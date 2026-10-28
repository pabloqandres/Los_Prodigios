import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { logActivity } from '@/lib/activity'

// POST /api/assets/slots/[id]/link-episode
// Body: { episode_id, scene_ref?, note?, gap_request_id? }
// Links an approved asset slot to an episode (reuse or origin).

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: slotId } = await params
  const { episode_id, scene_ref, note, gap_request_id } = await req.json()

  if (!episode_id) return NextResponse.json({ error: 'episode_id requerido' }, { status: 400 })

  const supabase = createServerClient()

  // Verify slot exists and is approved
  const { data: slot, error: slotErr } = await supabase
    .from('asset_slots')
    .select('id, entity_label, version_label, approved_drive_file_id')
    .eq('id', slotId)
    .eq('status', 'approved')
    .single()

  if (slotErr || !slot) {
    return NextResponse.json({ error: 'Slot no encontrado o no aprobado' }, { status: 404 })
  }

  // Check if a usage already exists for this slot+episode
  const { data: existing } = await supabase
    .from('asset_episode_usage')
    .select('id, usage_type')
    .eq('slot_id', slotId)
    .eq('episode_id', episode_id)
    .single()

  let usage = existing
  if (!existing) {
    // Determine usage_type: 'origin' if no prior usages exist for this slot, else 'reused'
    const { count: priorCount } = await supabase
      .from('asset_episode_usage')
      .select('*', { count: 'exact', head: true })
      .eq('slot_id', slotId)

    const usage_type = (priorCount ?? 0) === 0 ? 'origin' : 'reused'

    const { data: created, error: usageErr } = await supabase
      .from('asset_episode_usage')
      .insert({
        slot_id: slotId,
        episode_id,
        usage_type,
        scene_ref: scene_ref ?? null,
        note: note ?? null,
        created_by: token.email,
      })
      .select()
      .single()

    if (usageErr) return NextResponse.json({ error: usageErr.message }, { status: 500 })
    usage = created
  }

  // If a gap_request_id was provided, mark that request as linked
  if (gap_request_id) {
    await supabase
      .from('episode_asset_requests')
      .update({
        status: 'linked',
        linked_slot_id: slotId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', gap_request_id)
  }

  // Load episode info for logging
  const { data: episode } = await supabase
    .from('episodes')
    .select('season, episode_number, title')
    .eq('id', episode_id)
    .single()

  const episodeLabel = episode
    ? `T${episode.season}E${episode.episode_number}${episode.title ? ` — ${episode.title}` : ''}`
    : episode_id

  await logActivity({
    action: 'asset.link_episode',
    entity_type: 'asset_slot',
    entity_id: slotId,
    entity_label: `${slot.entity_label} — ${slot.version_label}`,
    detail: `${existing ? 'Ya vinculado' : usage?.usage_type === 'origin' ? 'Origen' : 'Reutilizado'} en ${episodeLabel}${scene_ref ? ` · ${scene_ref}` : ''}`,
    user_email: token.email,
  })

  return NextResponse.json({ usage, already_existed: !!existing })
}
