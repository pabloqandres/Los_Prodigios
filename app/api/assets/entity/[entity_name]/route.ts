import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// DELETE /api/assets/entity/[entity_name]
// Solo admins. Elimina todos los slots de una entidad y sus archivos en Storage.
// Registra la eliminación en canon_log para que aparezca en actividad reciente.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entity_name: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  // Verificar rol admin
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('email', token.email as string)
    .single()
  if (roleData?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: se requiere rol admin' }, { status: 403 })
  }

  const { entity_name } = await params
  if (!entity_name) return NextResponse.json({ error: 'entity_name requerido' }, { status: 400 })

  // 1. Obtener todos los slots de la entidad
  const { data: slots, error: fetchErr } = await supabase
    .from('asset_slots')
    .select('id, entity_label, pending_drive_file_id, approved_drive_file_id')
    .eq('entity_name', entity_name)

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  if (!slots || slots.length === 0) {
    return NextResponse.json({ error: 'Entidad no encontrada' }, { status: 404 })
  }

  const entity_label = slots[0].entity_label

  // 2. Recopilar paths de Storage a eliminar
  const storagePaths: string[] = []
  for (const slot of slots) {
    if (slot.pending_drive_file_id) storagePaths.push(slot.pending_drive_file_id)
    if (slot.approved_drive_file_id && slot.approved_drive_file_id !== slot.pending_drive_file_id) {
      storagePaths.push(slot.approved_drive_file_id)
    }
  }

  // 3. Eliminar archivos de Storage
  if (storagePaths.length > 0) {
    await supabase.storage.from('assets').remove(storagePaths)
  }

  // 4. Eliminar aprobaciones de los slots
  const slotIds = slots.map(s => s.id)
  await supabase.from('asset_approvals').delete().in('slot_id', slotIds)

  // 5. Eliminar los slots
  const { error: deleteErr } = await supabase
    .from('asset_slots')
    .delete()
    .eq('entity_name', entity_name)

  if (deleteErr) return NextResponse.json({ error: deleteErr.message }, { status: 500 })

  // 6. Registrar en canon_log para actividad reciente
  await supabase.from('canon_log').insert({
    doc_title: entity_label,
    change_summary: `Entidad eliminada por admin — ${slots.length} slots y ${storagePaths.length} archivos borrados`,
    created_by: token.email as string,
  })

  return NextResponse.json({
    ok: true,
    entity_name,
    entity_label,
    slots_deleted: slots.length,
    files_deleted: storagePaths.length,
  })
}
