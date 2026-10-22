import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 90

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type ScoreDimension = {
  key: string
  label: string
  score: number        // 1–5
  strength: string     // qué funciona (1 oración)
  weakness: string     // qué mejorar (1 oración)
  recommendation: string // acción concreta (imperativa, 1 oración)
  workflow_key: string // para activar el workflow en el panel AI
}

export type ScriptScore = {
  dimensions: ScoreDimension[]
  overall: number        // promedio 1–5
  verdict: string        // 1-2 oraciones: veredicto editorial general
  priority_fix: string   // la dimensión con score más bajo (key)
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
    .select('id, season, episode_number, title, script, logline, synopsis, theme')
    .eq('id', episodeId)
    .single()

  if (!episode?.script || episode.script.trim().length < 100) {
    return NextResponse.json({ error: 'No hay guión suficiente para evaluar' }, { status: 400 })
  }

  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`
  const scriptText = episode.script.substring(0, 18000)

  const systemPrompt = `Eres el story editor jefe de "Los Prodigios", serie animada latinoamericana de fútbol y coming-of-age para niños y adolescentes.

Tu función es evaluar guiones de episodios con criterios exigentes del sistema de revisión del estudio. Eres honesto, preciso y constructivo: no inflas puntuaciones, no destruyes sin proponer solución.

ESCALA DE PUNTUACIÓN (obligatoria):
- 5 = Excepcional. Supera expectativas, es referencia.
- 4 = Sólido. Cumple todos los estándares con calidad.
- 3 = Aceptable. Cumple mínimos pero tiene áreas de mejora.
- 2 = Insuficiente. No cumple estándares en áreas clave.
- 1 = Crítico. Falla fundamental que requiere replanteo.

UMBRAL: Ninguna dimensión por debajo de 3 para aprobar. Promedio mínimo 3.5.

Responde SOLO con JSON válido. Sin texto, sin markdown.`

  const userPrompt = `Episodio: ${episodeLabel}
${episode.logline ? `Logline: ${episode.logline}` : ''}
${episode.theme ? `Tema: ${episode.theme}` : ''}
${episode.synopsis ? `Sinopsis: ${episode.synopsis}` : ''}

## GUIÓN:
${scriptText}

---

Evalúa el guión en exactamente estas 5 dimensiones y devuelve este JSON:

{
  "dimensions": [
    {
      "key": "narrativa",
      "label": "Narrativa",
      "score": 4,
      "strength": "Una frase sobre lo que funciona bien en narrativa.",
      "weakness": "Una frase sobre el problema principal en narrativa.",
      "recommendation": "Una acción concreta y específica para mejorarlo (imperativo, menciona escenas/actos reales si puedes).",
      "workflow_key": "write_script"
    },
    {
      "key": "personajes",
      "label": "Personajes",
      "score": 3,
      "strength": "...",
      "weakness": "...",
      "recommendation": "...",
      "workflow_key": "improve_dialogue"
    },
    {
      "key": "dialogo",
      "label": "Diálogo",
      "score": 3,
      "strength": "...",
      "weakness": "...",
      "recommendation": "...",
      "workflow_key": "improve_dialogue"
    },
    {
      "key": "ritmo",
      "label": "Ritmo",
      "score": 4,
      "strength": "...",
      "weakness": "...",
      "recommendation": "...",
      "workflow_key": "review_continuity"
    },
    {
      "key": "emocion",
      "label": "Emoción",
      "score": 3,
      "strength": "...",
      "weakness": "...",
      "recommendation": "...",
      "workflow_key": "write_script"
    }
  ],
  "overall": 3.4,
  "verdict": "2 oraciones: veredicto editorial directo. Qué está bien y cuál es el trabajo prioritario.",
  "priority_fix": "dialogo"
}

CRITERIOS POR DIMENSIÓN:

NARRATIVA: ¿El conflicto central es claro desde el inicio? ¿La estructura tiene un punto de giro real en el Acto 2? ¿El clímax se siente ganado por las decisiones del protagonista? ¿Cada escena tiene al menos dos funciones (trama + personaje/tema)?

PERSONAJES: ¿El protagonista tiene deseo externo Y necesidad interna diferente? ¿Cada personaje tiene voz propia (si tapo el nombre sé quién habla)? ¿El personaje cambia al final? ¿Las relaciones evolucionan?

DIÁLOGO: ¿El diálogo suena natural para la edad/contexto? ¿Hay subtexto o todo se dice explícitamente? ¿El diálogo cumple función narrativa (no solo "charla")? ¿Se puede cortar la mitad sin perder información?

RITMO: ¿Hay variación entre escenas rápidas y lentas? ¿Las escenas de acción tienen energía? ¿Los momentos emocionales tienen espacio para respirar? ¿El episodio tiene duración adecuada (10-14 min = 8-16 escenas)?

EMOCIÓN: ¿Las stakes se sienten personales antes de universales? ¿Hay al menos un momento que genuinamente emociona/sorprende? ¿El público puede identificarse con alguien? ¿El final deja una sensación clara?`

  let raw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })
    raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Error al contactar Claude' }, { status: 500 })
  }

  let result: ScriptScore
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    result = JSON.parse(match ? match[0] : cleaned)
  } catch {
    return NextResponse.json({ error: 'No se pudo interpretar la respuesta', raw }, { status: 500 })
  }

  // Recalculate overall to be safe
  const avg = result.dimensions.reduce((s, d) => s + d.score, 0) / result.dimensions.length
  result.overall = Math.round(avg * 10) / 10

  // Find real priority_fix
  const minDim = result.dimensions.reduce((min, d) => d.score < min.score ? d : min, result.dimensions[0])
  result.priority_fix = minDim.key

  return NextResponse.json(result)
}
