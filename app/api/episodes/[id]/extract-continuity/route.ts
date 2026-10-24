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

  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`
  const scriptText = episode.script.substring(0, 10000)

  const continuityContext = [
    moduleMap['canon_log'] ? `### canon_log\n${moduleMap['canon_log'].substring(0, 800)}` : '',
    moduleMap['timeline'] ? `### timeline\n${moduleMap['timeline'].substring(0, 800)}` : '',
    moduleMap['character_states'] ? `### character_states\n${moduleMap['character_states'].substring(0, 800)}` : '',
    moduleMap['location_states'] ? `### location_states\n${moduleMap['location_states'].substring(0, 800)}` : '',
    moduleMap['open_issues'] ? `### open_issues\n${moduleMap['open_issues'].substring(0, 800)}` : '',
  ].filter(Boolean).join('\n\n')

  const systemPrompt = `Eres el Supervisor de Continuidad de 'Los Prodigios', serie animada latinoamericana de fútbol/coming-of-age. Tu único trabajo es extraer del guión TODO lo que debe quedar registrado en el sistema de continuidad de la serie. Eres obsesivo con los detalles — ningún hecho canónico, cambio de personaje, promesa narrativa o hito puede escaparse. Responde ÚNICAMENTE con JSON válido.`

  const userPrompt = `Episodio: ${episodeLabel}

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
      max_tokens: 4000,
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
}
