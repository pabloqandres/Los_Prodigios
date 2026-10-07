import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { REVIEWERS, makeApprovedFileName } from '@/lib/approval-config'

export const runtime = 'nodejs'
export const maxDuration = 60

// POST /api/assets/bulk-approve
// Body: { slot_ids: string[] }
// Registers the current reviewer's approval for all listed slots.
// Each slot stays in 'in_review' until the second reviewer also approves
// (same dual-review logic as the single approve route).

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = token.email as string
  const reviewerName = REVIEWERS[email]
  if (!reviewerName) return NextResponse.json({ error: 'No autorizado para revisar assets' }, { status: 403 })

  const { slot_ids } = await req.json() as { slot_ids: string[] }
  if (!Array.isArray(slot_ids) || slot_ids.length === 0) {
    return NextResponse.json({ error: 'slot_ids requerido' }, { status: 400 })
  }

  const supabase = createServerClient()
  const results: { id: string; status: 'voted' | 'fully_approved' | 'skipped' | 'error'; reason?: string }[] = []

  for (const slotId of slot_ids) {
    const { data: slot, error: slotErr } = await supabase
      .from('asset_slots')
      .select('*')
      .eq('id', slotId)
      .single()

    if (slotErr || !slot) {
      results.push({ id: slotId, status: 'error', reason: 'Slot no encontrado' })
      continue
    }

    if (!slot.pending_drive_file_id) {
      results.push({ id: slotId, status: 'skipped', reason: 'Sin imagen pendiente' })
      continue
    }

    if (slot.status === 'approved') {
      results.push({ id: slotId, status: 'skipped', reason: 'Ya aprobado' })
      continue
    }

    try {
      // Register this reviewer's approval
      const { error: approvalErr } = await supabase
        .from('asset_approvals')
        .upsert({
          slot_id: slotId,
          reviewer_email: email,
          reviewer_name: reviewerName,
          approved: true,
          note: 'Aprobación masiva',
          drive_file_id: slot.pending_drive_file_id,
        }, { onConflict: 'slot_id,reviewer_email' })

      if (approvalErr) throw new Error(approvalErr.message)

      // Count total approvals for this slot
      const { count } = await supabase
        .from('asset_approvals')
        .select('*', { count: 'exact', head: true })
        .eq('slot_id', slotId)
        .eq('approved', true)

      // If both reviewers have approved → move file to approved/
      if ((count ?? 0) >= 2) {
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

        const { error: copyErr } = await supabase.storage
          .from('assets')
          .copy(pendingPath, approvedPath)

        if (copyErr) throw new Error(`copy: ${copyErr.message}`)

        await supabase.storage.from('assets').remove([pendingPath])

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

        results.push({ id: slotId, status: 'fully_approved' })
      } else {
        // First approval registered — keep in_review for second reviewer
        if (slot.status !== 'in_review') {
          await supabase
            .from('asset_slots')
            .update({ status: 'in_review', updated_at: new Date().toISOString() })
            .eq('id', slotId)
        }
        results.push({ id: slotId, status: 'voted' })
      }
    } catch (err) {
      results.push({ id: slotId, status: 'error', reason: String(err) })
    }
  }

  const voted = results.filter(r => r.status === 'voted').length
  const fullyApproved = results.filter(r => r.status === 'fully_approved').length
  const errors = results.filter(r => r.status === 'error').length

  return NextResponse.json({
    results,
    reviewer: reviewerName,
    summary: { voted, fully_approved: fullyApproved, errors, total: slot_ids.length },
  })
}
