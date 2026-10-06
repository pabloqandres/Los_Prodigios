import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { REVIEWERS } from '@/lib/approval-config'

// POST /api/assets/slots/[id]/remove-image

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = token.email as string
  if (!REVIEWERS[email]) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const { id: slotId } = await params
  const supabase = createServerClient()

  const { data: slot, error: slotErr } = await supabase
    .from('asset_slots')
    .select('*')
    .eq('id', slotId)
    .single()

  if (slotErr || !slot) return NextResponse.json({ error: 'Slot no encontrado' }, { status: 404 })
  if (slot.status === 'approved') return NextResponse.json({ error: 'No se puede eliminar un asset ya aprobado' }, { status: 400 })

  // Delete from Supabase Storage
  if (slot.pending_drive_file_id) {
    await supabase.storage.from('assets').remove([slot.pending_drive_file_id])
  }

  // Clear approvals
  await supabase.from('asset_approvals').delete().eq('slot_id', slotId)

  // Reset slot
  await supabase
    .from('asset_slots')
    .update({
      status: 'pending',
      pending_drive_file_id: null,
      pending_drive_folder_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', slotId)

  const { data: updated } = await supabase
    .from('asset_slots')
    .select('*, asset_approvals(*)')
    .eq('id', slotId)
    .single()

  return NextResponse.json({ slot: updated })
}
