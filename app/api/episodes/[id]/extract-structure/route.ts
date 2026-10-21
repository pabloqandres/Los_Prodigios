import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 90

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type ExtractedScene = {
  title: string
  description: string
  location: string
  characters: string[]
  duration_est: number
  mood: string
  scene_ref: string
}

export type ExtractedAct = {
  act_number: number
  title: string
  goal: string
  scenes: ExtractedScene[]
}

export type ExtractionResult = {
  acts: ExtractedAct[]
  notes: string
  total_scenes: number
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const supabase = createServerClient()

  const { data: episode } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, script, logline, synopsis')
    .eq('id', episodeId)
    .single()

  if (!episode?.script || episode.script.trim().length < 50) {
    return NextResponse.json({ error: 'No hay guión para analizar' }, { status: 400 })
  }

  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`
  const scriptText = episode.script.substring(0, 20000)

  const systemPrompt = `Eres el story editor de "Los Prodigios", serie animada latinoamericana de fútbol.
Tu tarea es leer el guión de un episodio y extraer su estructura narrativa completa, organizando las escenas en exactamente 3 actos.

Reglas:
- El episodio SIEMPRE tiene 3 actos. Distribuye las escenas en 3 actos según la dramaturgia.
- Un episodio de 10-14 minutos tiene normalmente entre 8-16 escenas en total.
- Acto 1: presentación/detonante (aprox 25% del tiempo). Acto 2: desarrollo/conflicto (aprox 50%). Acto 3: clímax/resolución (aprox 25%).
- Si el guión tiene marcadores de acto explícitos, respétalos. Si no, inferirlos de la dramaturgia.
- Cada escena debe tener título corto (3-6 palabras) y descripción concisa (1-2 oraciones).
- duration_est es en segundos. Una escena promedio de animación: 40-90 segundos.
- mood: tenso | emotivo | cómico | acción | exposición | clímax | reflexivo | transición
- Responde SOLO con JSON válido. Sin texto adicional, sin markdown.`

  const userPrompt = `Episodio: ${episodeLabel}
${episode.logline ? `Logline: ${episode.logline}` : ''}
${episode.synopsis ? `Sinopsis: ${episode.synopsis}` : ''}

## GUIÓN:
${scriptText}

---

Extrae la estructura y devuelve exactamente este JSON (3 actos, escenas reales del guión):
{
  "acts": [
    {
      "act_number": 1,
      "title": "Título descriptivo del acto",
      "goal": "Objetivo narrativo del acto en una frase",
      "scenes": [
        {
          "title": "Título corto",
          "description": "Qué pasa en la escena.",
          "location": "Nombre de la locación",
          "characters": ["Personaje1", "Personaje2"],
          "duration_est": 60,
          "mood": "tenso",
          "scene_ref": "ESC 1"
        }
      ]
    },
    {
      "act_number": 2,
      "title": "...",
      "goal": "...",
      "scenes": []
    },
    {
      "act_number": 3,
      "title": "...",
      "goal": "...",
      "scenes": []
    }
  ],
  "notes": "Observaciones sobre la estructura: ritmo, desequilibrios entre actos, escenas fuertes/débiles, lo que destaca o falta.",
  "total_scenes": 12
}`

  let raw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })
    raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Error al contactar Claude' }, { status: 500 })
  }

  let result: ExtractionResult
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    result = JSON.parse(match ? match[0] : cleaned)
  } catch {
    return NextResponse.json({ error: 'No se pudo interpretar la respuesta', raw }, { status: 500 })
  }

  return NextResponse.json(result)
}
