import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET /api/script-proposals?finding_id=uuid  OR  ?episode_id=uuid
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const findingId = request.nextUrl.searchParams.get('finding_id')
  const episodeId = request.nextUrl.searchParams.get('episode_id')

  if (!findingId && !episodeId) {
    return NextResponse.json({ error: 'finding_id o episode_id requerido' }, { status: 400 })
  }

  const supabase = createServerClient()

  let query = supabase
    .from('script_proposals')
    .select('*')
    .order('created_at', { ascending: false })

  if (episodeId) {
    // Return all proposals for the episode (all statuses)
    query = query.eq('episode_id', episodeId)
  } else {
    // Legacy: filter by finding_id, only pending
    query = query.eq('finding_id', findingId!).eq('status', 'pending')
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}

// POST /api/script-proposals
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { finding_id, episode_id, original_text, proposed_text, change_type, location_hint } = body

  if (!finding_id || !episode_id) {
    return NextResponse.json({ error: 'finding_id y episode_id son requeridos' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Fetch current script_version_id for this episode
  const { data: currentVersion } = await supabase
    .from('script_versions')
    .select('id')
    .eq('episode_id', episode_id)
    .eq('is_current', true)
    .single()

  const scriptVersionId = currentVersion?.id ?? null

  // Insert proposal
  const { data: proposal, error: proposalError } = await supabase
    .from('script_proposals')
    .insert({
      finding_id,
      episode_id,
      script_version_id: scriptVersionId,
      original_text: original_text ?? null,
      proposed_text: proposed_text ?? null,
      change_type: change_type ?? null,
      location_hint: location_hint ?? null,
      status: 'pending',
      created_by: token.email,
    })
    .select('*')
    .single()

  if (proposalError || !proposal) {
    console.error('[script-proposals POST] insert error:', JSON.stringify(proposalError))
    return NextResponse.json({ error: proposalError?.message ?? 'Error al crear propuesta', details: proposalError }, { status: 500 })
  }

  // Update the linked finding's status to 'in_review' if it was 'pending'
  await supabase
    .from('script_findings')
    .update({ status: 'in_review', updated_at: new Date().toISOString() })
    .eq('id', finding_id)
    .eq('status', 'pending')

  return NextResponse.json(proposal, { status: 201 })
}

// PATCH /api/script-proposals?id=uuid
export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const body = await request.json()
  const { status, final_text, discarded_reason } = body

  if (!status) return NextResponse.json({ error: 'status requerido' }, { status: 400 })

  const validStatuses = ['approved', 'discarded', 'reverted']
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `status inválido. Valores permitidos: ${validStatuses.join(', ')}` },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  // Fetch current proposal to get finding_id
  const { data: existing, error: fetchError } = await supabase
    .from('script_proposals')
    .select('id, finding_id')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
  }

  const now = new Date().toISOString()
  const patch: Record<string, unknown> = {
    status,
    updated_at: now,
  }

  if (status === 'approved') {
    patch.approved_at = now
    if (final_text !== undefined) patch.final_text = final_text
  } else if (status === 'reverted') {
    patch.reverted_at = now
  } else if (status === 'discarded') {
    if (discarded_reason !== undefined) patch.discarded_reason = discarded_reason
  }

  const { data: updatedProposal, error: updateError } = await supabase
    .from('script_proposals')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Update linked finding status
  if (existing.finding_id) {
    if (status === 'approved') {
      await supabase
        .from('script_findings')
        .update({ status: 'implemented', updated_at: now })
        .eq('id', existing.finding_id)
    } else if (status === 'reverted') {
      await supabase
        .from('script_findings')
        .update({ status: 'in_review', updated_at: now })
        .eq('id', existing.finding_id)
    }
  }

  return NextResponse.json(updatedProposal)
}
