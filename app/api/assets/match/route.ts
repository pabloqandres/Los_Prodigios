import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// GET /api/assets/match?entity_name=MateoGonzalez&view_type=Identidad+facial&tags=llanto,tristeza
// Returns approved slots that match the query, enriched with episode usage count.

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const entity_name = searchParams.get('entity_name')
  const view_type   = searchParams.get('view_type')
  const tagsParam   = searchParams.get('tags')
  const tags        = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : []

  if (!entity_name) {
    return NextResponse.json({ error: 'entity_name requerido' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Try exact match first, then fuzzy match by label/name similarity
  let query = supabase
    .from('asset_slots')
    .select('id, entity_name, entity_label, category, view_type, outfit, age_version, version_label, approved_drive_file_id, semantic_tags, usage_context')
    .eq('entity_name', entity_name)
    .eq('status', 'approved')

  if (view_type) {
    query = query.eq('view_type', view_type)
  }

  let { data: slots, error } = await query.order('view_type').order('age_version')

  // Fuzzy fallback: if no exact match, search by entity_label ilike or partial name match
  if ((!slots || slots.length === 0) && !error) {
    // Normalize: split PascalCase into words for partial matching
    const words = entity_name.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).filter(w => w.length > 2)

    // Try ilike on entity_label and entity_name for each significant word
    const { data: allApproved } = await supabase
      .from('asset_slots')
      .select('id, entity_name, entity_label, category, view_type, outfit, age_version, version_label, approved_drive_file_id, semantic_tags, usage_context')
      .eq('status', 'approved')

    if (allApproved?.length) {
      const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
      const searchNorm = normalize(entity_name)

      // Score each entity by word overlap
      const entityScores: Record<string, { score: number; slots: typeof allApproved }> = {}
      for (const slot of allApproved) {
        const nameNorm = normalize(slot.entity_name)
        const labelNorm = normalize(slot.entity_label)

        let score = 0
        for (const w of words) {
          const wn = normalize(w)
          if (nameNorm.includes(wn)) score += 2
          if (labelNorm.includes(wn)) score += 2
        }
        // Also check if the search term is contained in the name or vice versa
        if (nameNorm.includes(searchNorm) || searchNorm.includes(nameNorm)) score += 5

        if (score > 0) {
          if (!entityScores[slot.entity_name]) entityScores[slot.entity_name] = { score: 0, slots: [] }
          entityScores[slot.entity_name].score = Math.max(entityScores[slot.entity_name].score, score)
          entityScores[slot.entity_name].slots.push(slot)
        }
      }

      // Take the best matching entity (minimum score threshold)
      const best = Object.entries(entityScores)
        .filter(([, v]) => v.score >= 4)
        .sort((a, b) => b[1].score - a[1].score)[0]

      if (best) {
        slots = view_type
          ? best[1].slots.filter(s => s.view_type === view_type)
          : best[1].slots
      }
    }
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!slots || slots.length === 0) return NextResponse.json([])

  // Get episode usage counts for all matched slots
  const slotIds = slots.map(s => s.id)
  const { data: usages } = await supabase
    .from('asset_episode_usage')
    .select('slot_id, episode_id, usage_type, scene_ref, episodes(season, episode_number, title)')
    .in('slot_id', slotIds)

  const usageBySlot: Record<string, typeof usages> = {}
  for (const u of usages ?? []) {
    if (!usageBySlot[u.slot_id]) usageBySlot[u.slot_id] = []
    usageBySlot[u.slot_id]!.push(u)
  }

  // Score each slot by relevance (tag overlap)
  const results = slots.map(slot => {
    const slotTags: string[] = slot.semantic_tags ?? []
    const overlap = tags.filter(t => slotTags.some(st => st.toLowerCase().includes(t.toLowerCase()))).length
    const usageList = usageBySlot[slot.id] ?? []

    return {
      ...slot,
      usage_count: usageList.length,
      usages: usageList,
      relevance_score: overlap + (view_type && slot.view_type === view_type ? 2 : 0),
    }
  })

  // Sort by relevance descending, then by usage_count
  results.sort((a, b) => b.relevance_score - a.relevance_score || b.usage_count - a.usage_count)

  return NextResponse.json(results)
}
