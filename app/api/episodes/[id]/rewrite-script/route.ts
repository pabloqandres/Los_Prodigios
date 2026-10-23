import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 300

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type RewriteChange = {
  scene_ref: string
  finding_title: string
  what_changes: string   // what NUPPA will modify in this scene
  why: string            // which finding drives this change
  dimensions: string[]   // e.g. ["narrativa", "emocion"]
}

export type RewritePlan = {
  summary: string           // 2-3 sentence editorial summary of the whole rewrite
  changes: RewriteChange[]  // scene-level changes
  removals: string[]        // things being cut and why
  additions: string[]       // things being added and why
  expected_improvement: string // e.g. "Score estimado: 4.3-4.6"
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
  const { data: episode, error: epErr } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, script, logline, synopsis, theme')
    .eq('id', episodeId)
    .single()

  if (epErr || !episode) {
    return NextResponse.json({ error: 'Episodio no encontrado' }, { status: 404 })
  }
  if (!episode.script || episode.script.trim().length < 100) {
    return NextResponse.json({ error: 'No hay guión suficiente para reescribir' }, { status: 400 })
  }

  // 2. Load current analysis findings
  const { data: analysis } = await supabase
    .from('script_analyses')
    .select('id, overall_score')
    .eq('episode_id', episodeId)
    .eq('is_current', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  type Finding = {
    category: string
    title: string
    scene_ref: string
    problem_description: string
    narrative_effect: string
    improvement_goal: string
    priority: string
  }
  let findings: Finding[] = []
  if (analysis) {
    const { data: rawFindings } = await supabase
      .from('script_findings')
      .select('category, title, scene_ref, problem_description, narrative_effect, improvement_goal, priority')
      .eq('analysis_id', analysis.id)
      .order('priority')
    findings = (rawFindings ?? []) as Finding[]
  }

  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`

  const findingsText = findings.length > 0
    ? findings.map((f, i) =>
        `${i + 1}. [${f.priority.toUpperCase()}] [${f.category}] ${f.title}\n   Escena: ${f.scene_ref}\n   Problema: ${f.problem_description}\n   Efecto: ${f.narrative_effect}\n   Objetivo: ${f.improvement_goal}`
      ).join('\n\n')
    : '(No hay hallazgos registrados — mejora general de calidad.)'

  const systemPrompt = `Eres el story editor jefe de "Los Prodigios", serie animada latinoamericana de fútbol y coming-of-age.

Vas a realizar DOS cosas en una sola respuesta JSON:

1. PLAN DE CAMBIOS: un plan editorial detallado y honesto de exactamente qué vas a modificar, eliminar y agregar — y por qué. El autor del guión debe poder leer este plan y entender exactamente qué le vas a hacer a su guión antes de aceptar.

2. GUIÓN REESCRITO: la versión reescrita completa del guión, aplicando todos los cambios del plan.

REGLAS DE LA REESCRITURA:
- CONSERVAR: personajes y sus nombres, la premisa central, estructura de 3 actos, hechos narrativos inamovibles
- MEJORAR SUSTANCIALMENTE: profundidad emocional, arcos de personaje, especificidad del diálogo, ritmo interno de escenas
- RESOLVER TODOS los hallazgos, priorizando los de prioridad ALTA
- Los diálogos deben sonar auténticos para adolescentes latinoamericanos, no genéricos
- PROHIBIDO: cambios cosméticos, solo reformatear el mismo texto, ignorar hallazgos de alta prioridad

FORMATO DE SALIDA — MUY IMPORTANTE:
Tu respuesta debe ser EXACTAMENTE un objeto JSON válido:
{
  "plan": {
    "summary": "2-3 oraciones describiendo el enfoque editorial general",
    "changes": [
      {
        "scene_ref": "ESC 03",
        "finding_title": "título del hallazgo que motiva el cambio",
        "what_changes": "descripción específica de qué cambia en esta escena",
        "why": "por qué este cambio resuelve el problema y mejora el episodio",
        "dimensions": ["narrativa", "emocion"]
      }
    ],
    "removals": [
      "Descripción de qué se elimina y por qué (ej: 'Diálogo de 4 líneas en ESC 02 — no aporta información nueva ni tensión')"
    ],
    "additions": [
      "Descripción de qué se agrega y por qué (ej: 'Momento de vulnerabilidad de Mateo al cierre del Acto 2 — construye el arco emocional que faltaba')"
    ],
    "expected_improvement": "Score estimado tras la reescritura: X.X-X.X / 5"
  },
  "rewritten_script": "GUIÓN COMPLETO AQUÍ — mantén el formato original del guión"
}

NO uses bloques de código markdown. La primera línea es { y la última es }.`

  const userPrompt = `Episodio: ${episodeLabel}
${episode.logline ? `Logline: ${episode.logline}` : ''}
${episode.theme ? `Tema: ${episode.theme}` : ''}
${episode.synopsis ? `Sinopsis: ${episode.synopsis}` : ''}

## HALLAZGOS A RESOLVER:
${findingsText}

---

## GUIÓN ORIGINAL:
${episode.script}

---

Devuelve el JSON con el plan de cambios y el guión reescrito completo.`

  let raw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })
    raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    if (response.stop_reason === 'max_tokens') {
      console.warn('[rewrite-script] truncated at max_tokens')
      return NextResponse.json({
        error: 'El guión es demasiado largo para procesar completo. Acorta el guión a menos de 10,000 caracteres e intenta de nuevo.',
      }, { status: 422 })
    }
  } catch (e) {
    console.error('[rewrite-script] Claude error:', e)
    return NextResponse.json({ error: 'Error al contactar Claude' }, { status: 500 })
  }

  // Parse JSON response
  let parsed: { plan: RewritePlan; rewritten_script: string }
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON braces found')
    parsed = JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    console.error('[rewrite-script] parse failed, raw preview:', raw.substring(0, 300))
    return NextResponse.json({ error: 'No se pudo interpretar la respuesta de NUPPA', raw: raw.substring(0, 300) }, { status: 500 })
  }

  if (!parsed.rewritten_script || parsed.rewritten_script.length < 200) {
    return NextResponse.json({ error: 'El guión reescrito está vacío o incompleto' }, { status: 500 })
  }

  return NextResponse.json({
    plan: parsed.plan,
    rewritten_script: parsed.rewritten_script,
    original_length: episode.script.length,
    rewritten_length: parsed.rewritten_script.length,
    findings_addressed: findings.length,
  })
}
