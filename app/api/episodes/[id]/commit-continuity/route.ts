import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import type { ContinuityExtraction } from '../extract-continuity/route'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await params // consume params (not needed for this route)

  const body: ContinuityExtraction = await request.json()
  const supabase = createServerClient()

  // 1. Load all continuity modules
  const { data: modules } = await supabase
    .from('continuity_modules')
    .select('module_key, content')

  const moduleMap: Record<string, string> = {}
  if (modules) {
    for (const m of modules) {
      moduleMap[m.module_key] = m.content ?? ''
    }
  }

  const label = body.episode_label
  const date = new Date().toISOString().split('T')[0]

  // 2. Build updated content for each module

  // canon_log
  let canonLogAppend = `\n\n## ${label} — ${date}`
  for (const f of body.canon_facts) {
    canonLogAppend += `\n- **[${f.category}]** ${f.fact} *(${f.entity} · ${f.evidence})*`
  }
  const newCanonLog = (moduleMap['canon_log'] ?? '') + (body.canon_facts.length > 0 ? canonLogAppend : '')

  // timeline
  let timelineAppend = ''
  if (body.timeline_milestones.length > 0) {
    timelineAppend = `\n\n### ${label}`
    for (const m of body.timeline_milestones) {
      timelineAppend += `\n- ${m.event} *(${m.characters_involved.join(', ')})* — ${m.significance}`
    }
  }
  const newTimeline = (moduleMap['timeline'] ?? '') + timelineAppend

  // character_states
  let charStatesAppend = ''
  if (body.character_changes.length > 0) {
    charStatesAppend = `\n\n## Estado al cierre de ${label}`
    // Group by character
    const byChar: Record<string, typeof body.character_changes> = {}
    for (const c of body.character_changes) {
      if (!byChar[c.character]) byChar[c.character] = []
      byChar[c.character].push(c)
    }
    for (const [character, changes] of Object.entries(byChar)) {
      charStatesAppend += `\n\n### ${character}`
      for (const c of changes) {
        charStatesAppend += `\n- **Cambio (${c.change_type}):** ${c.before} → ${c.after}`
        charStatesAppend += `\n- Permanente: ${c.is_permanent ? 'Sí' : 'No'} · ${c.scene_ref}`
      }
    }
  }
  const newCharStates = (moduleMap['character_states'] ?? '') + charStatesAppend

  // location_states
  let locStatesAppend = ''
  if (body.location_changes.length > 0) {
    locStatesAppend = `\n\n## ${label}`
    for (const l of body.location_changes) {
      locStatesAppend += `\n- **${l.location}:** ${l.change} *(permanente: ${l.is_permanent ? 'sí' : 'no'})*`
    }
  }
  const newLocStates = (moduleMap['location_states'] ?? '') + locStatesAppend

  // open_issues
  let openIssuesAppend = ''
  if (body.promises_opened.length > 0) {
    openIssuesAppend += `\n\n## Abiertos desde ${label}`
    for (const p of body.promises_opened) {
      openIssuesAppend += `\n- **[${p.urgency.toUpperCase()}]** [${p.type}] ${p.description}`
      if (p.related_character) openIssuesAppend += ` · ${p.related_character}`
    }
  }
  if (body.promises_closed.length > 0) {
    openIssuesAppend += `\n\n## Cerrados en ${label}`
    for (const c of body.promises_closed) {
      openIssuesAppend += `\n- ~~${c.description}~~ → ${c.resolution}`
    }
  }
  const newOpenIssues = (moduleMap['open_issues'] ?? '') + openIssuesAppend

  // 3. Update all modules in supabase
  const moduleUpdates = [
    { key: 'canon_log', content: newCanonLog },
    { key: 'timeline', content: newTimeline },
    { key: 'character_states', content: newCharStates },
    { key: 'location_states', content: newLocStates },
    { key: 'open_issues', content: newOpenIssues },
  ]

  for (const mod of moduleUpdates) {
    await supabase
      .from('continuity_modules')
      .upsert(
        { module_key: mod.key, content: mod.content, updated_by: token.email, updated_at: new Date().toISOString() },
        { onConflict: 'module_key' }
      )
  }

  // 4. Bible propagation — only insert NEW docs, never modify existing
  let newBibleDocs = 0

  if (body.new_entities.length > 0) {
    const { data: existingDocs } = await supabase
      .from('reference_docs')
      .select('title')

    const existingTitles = new Set(
      (existingDocs ?? []).map(d => d.title.toLowerCase())
    )

    const categoryMap: Record<string, string> = {
      character: 'personajes',
      location: 'continuidad',
      prop: 'arte',
    }

    for (const entity of body.new_entities) {
      const titleLower = entity.name.toLowerCase()
      if (existingTitles.has(titleLower)) continue

      const category = categoryMap[entity.type] ?? 'general'
      const content = `# ${entity.name}\n\n**Tipo:** ${entity.type}\n**Introducido en:** ${label}\n\n${entity.description}\n\n*Generado automáticamente por NUPPA. Expandir con más detalles.*`

      const { error } = await supabase
        .from('reference_docs')
        .insert({
          title: entity.name,
          content,
          categories: [category],
          created_by: token.email,
          updated_at: new Date().toISOString(),
        })

      if (!error) {
        newBibleDocs++
        existingTitles.add(titleLower) // prevent duplicates within same batch
      }
    }
  }

  // 5. Insert new open promises into narrative_promises (deduplicated by promise_id)
  let newPromisesInserted = 0

  if (body.promises_opened.length > 0) {
    // Fetch existing promise_ids to avoid duplicates across re-runs
    const { data: existingPromises } = await supabase
      .from('narrative_promises')
      .select('promise_id')

    const existingIds = new Set(
      (existingPromises ?? []).map((p: { promise_id: string }) => p.promise_id)
    )

    for (const p of body.promises_opened) {
      if (existingIds.has(p.id)) continue

      const { error } = await supabase
        .from('narrative_promises')
        .insert({
          promise_id: p.id,
          episode_label: label,
          type: p.type,
          description: p.description,
          urgency: p.urgency,
          related_character: p.related_character ?? null,
          status: 'open',
          resolution: null,
          resolved_in_episode: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (!error) {
        newPromisesInserted++
        existingIds.add(p.id) // prevent duplicates within same batch
      }
    }
  }

  return NextResponse.json({ ok: true, modules_updated: 5, new_bible_docs: newBibleDocs, new_promises: newPromisesInserted })
}
