import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 120

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface ContinuityExtraction {
  episode_label: string
  canon_facts: Array<{ fact: string; category: string; entity: string; evidence: string }>
  character_changes: Array<{ character: string; change_type: string; before: string; after: string; is_permanent: boolean; scene_ref: string }>
  location_changes: Array<{ location: string; change: string; is_permanent: boolean }>
  promises_opened: Array<{ id: string; type: string; description: string; urgency: string; related_character: string | null }>
  promises_closed: Array<{ description: string; resolution: string }>
  timeline_milestones: Array<{ event: string; significance: string; characters_involved: string[] }>
  new_entities: Array<{ type: string; name: string; description: string }>
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const supabase = createServerClient()

  // 1. Load episode
  const { data: episode, error: episodeError } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, script')
    .eq('id', episodeId)
    .single()

  if (episodeError || !episode) {
    return NextResponse.json({ error: 'Episodio no encontrado' }, { status: 404 })
  }

  if (!episode.script || episode.script.trim().length < 100) {
    return NextResponse.json({ error: 'No hay guión suficiente para extraer continuidad' }, { status: 400 })
  }

  // 2. Load current continuity modules for context
  const { data: modules } = await supabase
    .from('continuity_modules')
    .select('module_key, content')

  const moduleMap: Record<string, string> = {}
  if (modules) {
    for (const m of modules) {
      moduleMap[m.module_key] = m.content ?? ''
    }
  }

  // 3. Load bible / reference docs — with relevance filtering above threshold
  const { data: refDocs } = await supabase
    .from('reference_docs')
    .select('title, categories, content')
    .order('created_at', { ascending: true })

  const LOAD_ALL_THRESHOLD = 25
  const MAX_SELECTED = 15
  const scriptSample = episode.script.substring(0, 5000)

  function extractKeyTerms(script: string): Set<string> {
    const terms = new Set<string>()
    for (const line of script.split('\n')) {
      const t = line.trim()
      // Dialogue speakers: "NOMBRE:" or "NOMBRE (acot):"
      const speaker = t.match(/^([A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ\s]{1,30})(?:\s*\(.*?\))?:/)
      if (speaker) terms.add(speaker[1].trim().toLowerCase())
      // Locations: INT./EXT. lines
      const loc = t.match(/^(?:INT\.|EXT\.)\s+(.+?)(?:\s*[·—–-]|$)/i)
      if (loc) {
        const parts = loc[1].split(/[·—–\/]/)[0].trim().toLowerCase()
        if (parts.length > 2) terms.add(parts)
      }
    }
    return terms
  }

  function scoreDoc(doc: { title: string; categories: string[] | null; content: string | null }, terms: Set<string>): number {
    let score = 0
    const titleLower = doc.title.toLowerCase()
    const contentLower = (doc.content ?? '').substring(0, 600).toLowerCase()
    const cats = Array.isArray(doc.categories) ? doc.categories : []

    // Category boosts — always relevant
    if (cats.includes('continuidad')) score += 3
    if (cats.includes('personajes')) score += 2

    // Term matching
    for (const term of terms) {
      if (titleLower.includes(term)) score += 5
      else if (contentLower.includes(term)) score += 2
    }
    return score
  }

  let selectedDocs = refDocs ?? []

  if (selectedDocs.length > LOAD_ALL_THRESHOLD) {
    const terms = extractKeyTerms(scriptSample)

    // Always-include: conocimiento + produccion docs (craft/base knowledge)
    const alwaysInclude = selectedDocs.filter(doc => {
      const cats = Array.isArray(doc.categories) ? doc.categories : []
      return cats.includes('conocimiento') || cats.includes('produccion')
    })

    // Remaining docs go through relevance scoring
    const alwaysIds = new Set(alwaysInclude.map(d => d.title))
    const remaining = selectedDocs.filter(d => !alwaysIds.has(d.title))
    const scored = remaining
      .map(doc => ({ doc, score: scoreDoc(doc, terms) }))
      .sort((a, b) => b.score - a.score)

    const slotsLeft = Math.max(0, MAX_SELECTED - alwaysInclude.length)
    selectedDocs = [...alwaysInclude, ...scored.slice(0, slotsLeft).map(s => s.doc)]
  }

  // Tiered excerpt budget: more chars for top docs
  const bibleContext = selectedDocs.length > 0
    ? selectedDocs.map((doc, i) => {
        const cats = Array.isArray(doc.categories) ? doc.categories.join(', ') : ''
        const budget = i < 3 ? 2000 : i < 8 ? 1000 : 500
        const excerpt = (doc.content ?? '').substring(0, budget)
        return `### ${doc.title}${cats ? ` [${cats}]` : ''}\n${excerpt}`
      }).join('\n\n')
    : ''

  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`
  const scriptText = episode.script.substring(0, 7000)

  const continuityContext = [
    moduleMap['canon_log'] ? `### canon_log\n${moduleMap['canon_log'].substring(0, 800)}` : '',
    moduleMap['timeline'] ? `### timeline\n${moduleMap['timeline'].substring(0, 800)}` : '',
    moduleMap['character_states'] ? `### character_states\n${moduleMap['character_states'].substring(0, 800)}` : '',
    moduleMap['location_states'] ? `### location_states\n${moduleMap['location_states'].substring(0, 800)}` : '',
    moduleMap['open_issues'] ? `### open_issues\n${moduleMap['open_issues'].substring(0, 800)}` : '',
  ].filter(Boolean).join('\n\n')

  const systemPrompt = `Eres el Supervisor de Continuidad de 'Los Prodigios', serie animada latinoamericana de fútbol/coming-of-age. Tu único trabajo es extraer del guión TODO lo que debe quedar registrado en el sistema de continuidad de la serie. Eres obsesivo con los detalles — ningún hecho canónico, cambio de personaje, promesa narrativa o hito puede escaparse.${bibleContext ? ' Tienes acceso a la biblia de la serie: úsala para contrastar — confirma consistencia con lo ya documentado, y en new_entities incluye SOLO entidades que NO existen aún en la biblia. Si el guión contradice la biblia, marca el hecho canónico con category "CONTRADICCIÓN".' : ''} Responde ÚNICAMENTE con JSON válido.`

  const userPrompt = `Episodio: ${episodeLabel}
${bibleContext ? `
## BIBLIA Y CÁNONES DE LA SERIE:
${bibleContext}
` : ''}
## ESTADO ACTUAL DEL SISTEMA DE CONTINUIDAD:
${continuityContext || '(Sin registros previos — esta es la primera extracción)'}

## GUIÓN:
${scriptText}

---

Extrae TODA la información de continuidad del guión y devuelve exactamente este JSON (sin bloques de código markdown, sin texto antes ni después):

{
  "episode_label": "${episodeLabel}",
  "canon_facts": [
    { "fact": "Hecho canónico establecido en este episodio", "category": "personaje|locación|mundo|regla|relación", "entity": "nombre del elemento", "evidence": "cita breve del guión" }
  ],
  "character_changes": [
    { "character": "nombre", "change_type": "estado_emocional|relación|habilidad|conocimiento|físico|posición", "before": "cómo estaba antes", "after": "cómo queda ahora", "is_permanent": true, "scene_ref": "ESC XX" }
  ],
  "location_changes": [
    { "location": "nombre de la locación", "change": "descripción del cambio permanente", "is_permanent": true }
  ],
  "promises_opened": [
    { "id": "PROMISE_T1E01_001", "type": "pregunta|setup|misión|conflicto|misterio", "description": "qué promesa narrativa queda abierta", "urgency": "critical|high|medium|low", "related_character": "nombre o null" }
  ],
  "promises_closed": [
    { "description": "promesa que se resolvió (si aplica)", "resolution": "cómo se resolvió" }
  ],
  "timeline_milestones": [
    { "event": "evento significativo del episodio", "significance": "por qué importa para la serie", "characters_involved": ["nombre1", "nombre2"] }
  ],
  "new_entities": [
    { "type": "character|location|prop|creature|organization|other", "name": "nombre", "description": "descripción breve para la biblia" }
  ]
}`

  let raw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })
    raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  } catch (e) {
    console.error('[extract-continuity] Claude error:', e)
    return NextResponse.json({ error: 'Error al contactar Claude' }, { status: 500 })
  }

  let extraction: ContinuityExtraction
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON braces found')
    extraction = JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    console.error('[extract-continuity] parse failed, raw preview:', raw.substring(0, 500))
    return NextResponse.json({ error: 'No se pudo interpretar la respuesta de Claude', raw: raw.substring(0, 400) }, { status: 500 })
  }

  return NextResponse.json(extraction)
  } catch (e) {
    console.error('[extract-continuity] unhandled error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error interno del servidor' }, { status: 500 })
  }
}
