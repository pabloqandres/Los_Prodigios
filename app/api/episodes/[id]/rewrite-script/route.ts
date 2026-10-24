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

  // 3. Load knowledge context
  const { data: knowledgeDocs } = await supabase
    .from('reference_docs')
    .select('title, content, doc_type, categories')
    .order('doc_type')
    .order('title')

  const SCRIPT_CRAFT_CATEGORIES = ['craft:meta', 'craft:storytelling', 'craft:characters', 'craft:cinematography']
  const craftContext = (knowledgeDocs ?? [])
    .filter(d => d.doc_type === 'craft' && d.content && d.content.length > 50 &&
      (d.categories ?? []).some((c: string) => SCRIPT_CRAFT_CATEGORIES.includes(c)))
    .map(d => `### [CRAFT] ${d.title}\n${d.content.substring(0, 1500)}`)
    .join('\n\n---\n\n')

  const bibleContext = (knowledgeDocs ?? [])
    .filter(d => d.doc_type === 'bible' && d.content && d.content.length > 50)
    .map(d => `### [BIBLIA] ${d.title}\n${d.content.substring(0, 3000)}`)
    .join('\n\n---\n\n')

  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`

  const findingsText = findings.length > 0
    ? findings.map((f, i) =>
        `${i + 1}. [${f.priority.toUpperCase()}] [${f.category}] ${f.title}\n   Escena: ${f.scene_ref}\n   Problema: ${f.problem_description}\n   Efecto: ${f.narrative_effect}\n   Objetivo: ${f.improvement_goal}`
      ).join('\n\n')
    : '(No hay hallazgos registrados — mejora general de calidad.)'

  const systemPrompt = `Eres el Motor NUPPA — el cerebro editorial del Estudio OHZS.

Tu función en este modo es reescribir guiones de series animadas para llevarlos al estándar de producción (score ≥ 4.3 en el Sistema de Revisión del estudio). Operas con los 6 criterios oficiales. Cada decisión de reescritura está anclada en un hallazgo específico o en un principio de craft violado — nunca en preferencia estética personal.

## PRINCIPIOS DE REESCRITURA

Las 6 dimensiones que guían cada decisión:
- NARRATIVA: tema claro, conflicto definido, estructura sólida, stakes reales, exposición en acción no en monólogos, clímax ganado
- PERSONAJES: deseo + necesidad diferenciados, defecto real, voz única, contradicción interna, arcos ganados
- VISUAL: momentos que solo funcionan con imagen, subtexto visual, locaciones con personalidad
- ACTUACIÓN: comportamiento físico específico, espacio para que la animación respire y construya
- AUDIENCIA: accesible sin conocimiento previo, capas para distintas edades, identificación emocional
- FRANQUICIA: universo expandible, momentos icónicos, semillas para futuros episodios, lógica interna consistente

${craftContext ? `## PRINCIPIOS DE CRAFT DEL ESTUDIO\nCada cambio debe alinearse con estos principios. Cuando apliques uno, puedes nombrarlo:\n\n${craftContext}\n\n---\n\n` : ''}${bibleContext ? `## BIBLIA DE LA SERIE\nNINGÚN cambio puede violar lo establecido aquí. Es la fuente de verdad absoluta sobre personajes, mundo y tono:\n\n${bibleContext}\n\n---\n\n` : ''}## REGLAS ABSOLUTAS DE REESCRITURA

CONSERVAR SIEMPRE: personajes y sus nombres, premisa central, estructura de 3 actos, hechos narrativos inamovibles establecidos en la biblia
MEJORAR SUSTANCIALMENTE: profundidad emocional, arcos de personaje, especificidad del diálogo, ritmo interno de escenas, material visual y de actuación
RESOLVER TODOS los hallazgos de prioridad ALTA. Los de prioridad media si el espacio lo permite.
PROHIBIDO: cambios cosméticos (reformatear sin cambiar el fondo), ignorar hallazgos de alta prioridad, diálogos genéricos que cualquier personaje podría decir

## FORMATO DE SALIDA — CRÍTICO

Tu respuesta es EXACTAMENTE un objeto JSON válido. Primera línea: {. Última línea: }.
Sin bloques markdown. Sin texto antes ni después.

{
  "plan": {
    "summary": "2-3 oraciones del enfoque editorial: qué problema central resuelve esta reescritura y por qué el episodio saldrá mejor",
    "changes": [
      {
        "scene_ref": "ESC 03",
        "finding_title": "título del hallazgo que motiva el cambio",
        "what_changes": "descripción específica de qué cambia en esta escena",
        "why": "qué dimensión del sistema de revisión resuelve y por qué el cambio es la solución correcta",
        "dimensions": ["narrativa", "personajes"]
      }
    ],
    "removals": ["Qué se elimina y por qué — siempre con referencia a escena y criterio violado"],
    "additions": ["Qué se agrega y por qué — siempre con referencia a escena y dimensión que mejora"],
    "expected_improvement": "Score estimado tras la reescritura: X.X-X.X / 5"
  },
  "rewritten_script": "GUIÓN COMPLETO REESCRITO — mantén el formato original del guión sin modificar"
}`

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
