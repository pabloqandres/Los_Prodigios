import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { REVIEWERS, makeApprovedFileName } from '@/lib/approval-config'

export const runtime = 'nodejs'
export const maxDuration = 60

// POST /api/assets/slots/[id]/approve
// Body: { approved: boolean, note?: string }

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = token.email as string
  const reviewerName = REVIEWERS[email]
  if (!reviewerName) return NextResponse.json({ error: 'No autorizado para revisar assets' }, { status: 403 })

  const { id: slotId } = await params
  const { approved, note } = await req.json()

  const supabase = createServerClient()

  const { data: slot, error: slotErr } = await supabase
    .from('asset_slots')
    .select('*')
    .eq('id', slotId)
    .single()

  if (slotErr || !slot) return NextResponse.json({ error: 'Slot no encontrado' }, { status: 404 })
  if (!slot.pending_drive_file_id) return NextResponse.json({ error: 'No hay imagen subida para revisar' }, { status: 400 })

  // Upsert vote
  const { error: approvalErr } = await supabase
    .from('asset_approvals')
    .upsert({
      slot_id: slotId,
      reviewer_email: email,
      reviewer_name: reviewerName,
      approved,
      note: note ?? null,
      drive_file_id: slot.pending_drive_file_id,
    }, { onConflict: 'slot_id,reviewer_email' })

  if (approvalErr) return NextResponse.json({ error: approvalErr.message }, { status: 500 })

  // Rejection → mark rejected
  if (!approved) {
    await supabase
      .from('asset_slots')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', slotId)

    const { data: updated } = await supabase
      .from('asset_slots')
      .select('*, asset_approvals(*)')
      .eq('id', slotId)
      .single()
    return NextResponse.json({ slot: updated, moved: false })
  }

  // Count approvals
  const { count } = await supabase
    .from('asset_approvals')
    .select('*', { count: 'exact', head: true })
    .eq('slot_id', slotId)
    .eq('approved', true)

  // Both approved → move file in Supabase Storage
  if ((count ?? 0) >= 2) {
    try {
      const { count: existingCount } = await supabase
        .from('asset_slots')
        .select('*', { count: 'exact', head: true })
        .eq('entity_name', slot.entity_name)
        .eq('status', 'approved')

      const newName = makeApprovedFileName(
        slot.entity_name,
        slot.view_type,
        slot.outfit,
        slot.age_version ?? 'v1',
        (existingCount ?? 0) + 1
      )

      const pendingPath: string = slot.pending_drive_file_id
      const approvedPath = `${slot.category}/${slot.entity_name}/approved/${newName}`

      // Copy pending → approved
      const { error: copyErr } = await supabase.storage
        .from('assets')
        .copy(pendingPath, approvedPath)

      if (copyErr) throw new Error(copyErr.message)

      // Delete pending
      await supabase.storage.from('assets').remove([pendingPath])

      // Update slot
      await supabase
        .from('asset_slots')
        .update({
          status: 'approved',
          approved_drive_file_id: approvedPath,
          approved_drive_folder_id: `${slot.category}/${slot.entity_name}/approved`,
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

      return NextResponse.json({ slot: updated, moved: true })
    } catch (err) {
      console.error('[approve] error moving file:', err)
    }
  }

  // Mark in_review if not already
  if (slot.status !== 'in_review') {
    await supabase
      .from('asset_slots')
      .update({ status: 'in_review', updated_at: new Date().toISOString() })
      .eq('id', slotId)
  }

  const { data: updated } = await supabase
    .from('asset_slots')
    .select('*, asset_approvals(*)')
    .eq('id', slotId)
    .single()

  return NextResponse.json({ slot: updated, moved: false })
}
