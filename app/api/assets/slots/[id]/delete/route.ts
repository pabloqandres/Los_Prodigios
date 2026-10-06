import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { getDriveWriteClient } from '@/lib/drive'
import { REVIEWERS } from '@/lib/approval-config'

// POST /api/assets/slots/[id]/delete
// Elimina el slot completo (+ imagen de Drive si existe + votos)

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = token.email as string
  if (!REVIEWERS[email]) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id: slotId } = await params
  const supabase = createServerClient()

  const { data: slot } = await supabase
    .from('asset_slots')
    .select('*')
    .eq('id', slotId)
    .single()

  if (!slot) return NextResponse.json({ error: 'Slot no encontrado' }, { status: 404 })

  // Eliminar archivos de Drive si existen
  const drive = getDriveWriteClient()
  for (const fileId of [slot.pending_drive_file_id, slot.approved_drive_file_id].filter(Boolean)) {
    try {
      await drive.files.delete({ fileId })
    } catch {
      // Continuar si el archivo no existe
    }
  }

  // Eliminar votos (cascade lo haría pero por si acaso)
  await supabase.from('asset_approvals').delete().eq('slot_id', slotId)

  // Eliminar slot
  const { error } = await supabase.from('asset_slots').delete().eq('id', slotId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ deleted: slotId })
}
