import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 300

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type AnalysisScene = {
  scene_number: number
  title: string
  description: string
  original_text: string
  location: string
  characters: string[]
  duration_est: number
  mood: string
  scene_ref: string
}

export type AnalysisAct = {
  act_number: number
  title: string
  goal: string
  scenes: AnalysisScene[]
}

export type Finding = {
  id: string
  title: string
  scene_ref: string
  evidence: string
  problem_description: string
  narrative_effect: string
  improvement_goal: string
  priority: string
  status: string
  source: string
  order_index: number
}

export type AnalysisCategory = {
  key: string
  label: string
  score: number
  strength: string
  weakness: string
  findings: Finding[]
}

export type FullAnalysis = {
  analysis_id: string
  script_version_id: string
  structure: {
    acts: AnalysisAct[]
    total_scenes: number
    structure_notes: string
  }
  scoring: {
    overall: number
    verdict: string
    categories: AnalysisCategory[]
  }
  findings_count: number
  script_truncated?: boolean
  script_total_chars?: number
  script_analyzed_chars?: number
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const supabase = createServerClient()

  // 1. Fetch episode
  const { data: episode, error: episodeError } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, script, logline, synopsis, theme')
    .eq('id', episodeId)
    .single()

  if (episodeError || !episode) {
    return NextResponse.json({ error: 'Episodio no encontrado' }, { status: 404 })
  }

  if (!episode.script || episode.script.trim().length < 100) {
    return NextResponse.json({ error: 'No hay guión suficiente para analizar' }, { status: 400 })
  }

  // 2. Save/update script version
  // Check if there's a current version with the same text
  const { data: currentVersion } = await supabase
    .from('script_versions')
    .select('id, script_text, version_number')
    .eq('episode_id', episodeId)
    .eq('is_current', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let scriptVersionId: string

  if (currentVersion && currentVersion.script_text === episode.script) {
    // Reuse existing version
    scriptVersionId = currentVersion.id
  } else {
    // Get max version_number
    const { data: versions } = await supabase
      .from('script_versions')
      .select('version_number')
      .eq('episode_id', episodeId)
      .order('version_number', { ascending: false })
      .limit(1)

    const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1

    // Set all existing versions to is_current=false
    await supabase
      .from('script_versions')
      .update({ is_current: false })
      .eq('episode_id', episodeId)

    // Insert new version
    const { data: newVersion, error: versionError } = await supabase
      .from('script_versions')
      .insert({
        episode_id: episodeId,
        version_number: nextVersion,
        label: 'imported',
        script_text: episode.script,
        is_current: true,
        created_by: token.email,
      })
      .select('id')
      .single()

    if (versionError || !newVersion) {
      return NextResponse.json({ error: 'Error al guardar versión del guión' }, { status: 500 })
    }

    scriptVersionId = newVersion.id
  }

  // 3. Mark previous analyses as not current
  await supabase
    .from('script_analyses')
    .update({ is_current: false })
    .eq('episode_id', episodeId)

  // 4. Load knowledge context (craft principles + bible)
  const { data: knowledgeDocs } = await supabase
    .from('reference_docs')
    .select('title, content, doc_type, categories')
    .order('doc_type')   // craft first, then bible
    .order('title')

  // For script analysis, only load craft docs relevant to writing (not visual/sound/branding)
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

  // 5. Call Claude
  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`
  const SCRIPT_LIMIT = 28000
  const scriptTruncated = episode.script.length > SCRIPT_LIMIT
  const scriptText = episode.script.substring(0, SCRIPT_LIMIT)

  const systemPrompt = `Eres el Motor NUPPA — el cerebro editorial del Estudio OHZS.

Tu función es analizar guiones de series animadas con la precisión de un story editor con 20 años de experiencia. No das opiniones — das diagnósticos. Operas con el Sistema de Revisión oficial del estudio: 6 dimensiones con criterios exactos. Tu trabajo sirve para cualquier serie animada, no solo una.

## IDENTIDAD OPERATIVA
Cuando identificas un problema: (1) nombra el criterio específico violado, (2) cita evidencia exacta del texto, (3) describe el efecto narrativo concreto, (4) propone el objetivo de mejora — no cómo lograrlo, sino qué debe conseguir la revisión.

---

## LAS 6 DIMENSIONES OFICIALES — CRITERIOS EXACTOS

Evalúas en 6 dimensiones. En la fase de guión, las dimensiones de Arte y Actuación se evalúan desde lo que el texto implica para la producción visual.

### Escala
5 — Excepcional (referencia del estudio) · 4 — Sólido · 3 — Aceptable (mínimo viable) · 2 — Insuficiente · 1 — Crítico (replanteo)
Umbral de producción: NINGUNA dimensión < 3 y promedio ≥ 3.5

---

### D1 — NARRATIVA
Pregunta: ¿La historia funciona?
Criterios (cada uno puede ser fuente de un hallazgo):
- El tema se puede expresar en una oración
- Conflicto central claro desde el primer acto
- Estructura: inicio que engancha → desarrollo que escala → clímax que satisface
- Stakes reales: el protagonista puede genuinamente perder algo
- Exposición integrada en acción, NO en monólogos explicativos
- Ritmo con variación: los momentos tranquilos respiran, los tensos aceleran
- Clímax es consecuencia de decisiones del protagonista, no del azar
- Cada episodio tiene arco propio Y contribuye al arco de temporada
Red flags: protagonista pasivo (las cosas le pasan en vez de causarlas), escenas que solo sirven para explicar, conflicto resuelto con información nueva que el público no tenía, tema que cambia a mitad

### D2 — PERSONAJES
Pregunta: ¿Son memorables?
Criterios:
- Cada protagonista tiene deseo externo (qué quiere) Y necesidad interna diferente (qué necesita)
- El protagonista tiene un defecto real que le causa problemas reales
- Voz única: con los nombres tapados, sé quién habla por cómo habla
- Contradicción interna que hace al personaje interesante
- Arco de transformación ganado, no impuesto por el guión
- El antagonista tiene motivación comprensible — podría ser el héroe de su propia historia
- Las relaciones entre personajes evolucionan y generan conflicto
Red flags: personaje reducido a su rol ("el gracioso"), protagonista sin defectos reales, antagonista malvado sin razón, personaje que cambia de personalidad por conveniencia

### D3 — VISUAL (evaluado desde el guión)
Pregunta: ¿El texto da material para contar sin palabras?
Criterios:
- Hay escenas o momentos que solo funcionan con imagen, no con diálogo
- Las acotaciones describen comportamiento físico que revela carácter o emoción — no solo bloqueo técnico
- Subtexto visual presente: lo que el personaje hace contradice o enriquece lo que dice
- Las locaciones tienen personalidad suficiente para comunicar tono emocional
- Las escenas de acción se leen con claridad espacial
Red flags: escenas que dependen 100% del diálogo para funcionar, acotaciones vagas ("actúa nervioso" sin especificar cómo), locaciones genéricas sin personalidad

### D4 — ACTUACIÓN / STAGING (evaluado desde el guión)
Pregunta: ¿El texto da material para construir actuación con personalidad?
Criterios:
- Comportamiento físico específico descrito (no solo "está nervioso")
- Hay momentos de silencio o acción sin diálogo donde la animación puede respirar y construir
- Cada personaje principal tiene un lenguaje corporal implícito diferente en el texto
- Los momentos de comedia tienen timing sugerido en la escritura
- Las escenas emocionales tienen espacio dramatúrgico — no todo está dicho, hay lugar para que la actuación complete el significado
Red flags: el diálogo explica lo que la acción ya muestra, ausencia total de acotaciones físicas, escenas demasiado saturadas de información para que la animación respire

### D5 — AUDIENCIA
Pregunta: ¿Conecta con el público objetivo?
Criterios:
- Los primeros 3 minutos enganchan sin conocimiento previo
- Un espectador nuevo puede seguir la trama sin contexto anterior
- Hay capas que funcionan para distintas edades o niveles de sofisticación
- Al menos un personaje o situación en la que el público se puede identificar
- Los temas son universales o genuinamente relevantes para la audiencia objetivo
Red flags: primeros minutos lentos o confusos para alguien que nunca vio la serie, humor que depende de referencias que caducan, tono oscilando entre infantil y adulto sin intención clara

### D6 — FRANQUICIA
Pregunta: ¿Este episodio construye universo e iconos?
Criterios:
- El episodio amplía el universo con detalles que invitan a explorar más
- Al menos un momento memorable que puede definir a un personaje como icónico
- Hay semillas para futuros episodios, spin-offs o mitología de la serie
- El mundo tiene reglas y lógica interna consistente — no se contradice
- El episodio funciona tanto para un espectador nuevo como para un fan de la serie
Red flags: episodio que no añade nada al universo, personajes sin momento memorable, mundo que se contradice a sí mismo, concepto que no puede escalar a múltiples temporadas

---

${craftContext ? `## PRINCIPIOS DE CRAFT DEL ESTUDIO\nCuando un hallazgo viole uno de estos principios, nómbralo explícitamente en la descripción del problema:\n\n${craftContext}\n\n---\n\n` : ''}${bibleContext ? `## BIBLIA DE LA SERIE\nConocimiento específico de la producción. TODA inconsistencia con la biblia debe reportarse como hallazgo:\n\n${bibleContext}\n\n---\n\n` : ''}## REGLAS DE OPERACIÓN

ESTRUCTURA: Siempre 3 actos. Usar los marcadores del guión (INT./EXT., ESCENA, ESC, #) si existen. description: resumen de máx 60 palabras. original_text: fragmento real del texto (máx 120 chars). Máximo 6 escenas por acto.

SCORING: No generes hallazgos artificialmente. Solo reporta problemas reales con evidencia concreta del texto. Si una dimensión funciona bien, findings = []. Máximo 2 hallazgos por dimensión — los más importantes.

PRECISIÓN: Un hallazgo vago ("los personajes podrían estar mejor") no es válido. "D2 — Vale no tiene deseo externo visible en sus 3 apariciones del Acto 1" sí lo es.

FORMATO: Tu respuesta empieza EXACTAMENTE con { y termina EXACTAMENTE con }. Sin bloques de código markdown. Sin texto antes ni después del JSON.`

  const userPrompt = `Episodio: ${episodeLabel}
${episode.logline ? `Logline: ${episode.logline}` : ''}
${episode.theme ? `Tema: ${episode.theme}` : ''}
${episode.synopsis ? `Sinopsis: ${episode.synopsis}` : ''}

## GUIÓN:
${scriptText}

---

Devuelve exactamente este JSON:
{
  "structure": {
    "acts": [
      {
        "act_number": 1,
        "title": "string",
        "goal": "string",
        "scenes": [
          {
            "scene_number": 1,
            "title": "string",
            "description": "string - narrative summary of what happens",
            "original_text": "string - brief excerpt (max 150 chars) from the actual script for this scene",
            "location": "string",
            "characters": ["string"],
            "duration_est": 60,
            "mood": "string",
            "scene_ref": "ESC 01"
          }
        ]
      }
    ],
    "total_scenes": 15,
    "structure_notes": "string - observations about pacing, act balance"
  },
  "scoring": {
    "overall": 3.4,
    "verdict": "string - 2 sentences editorial verdict",
    "categories": [
      {
        "key": "narrativa",
        "label": "Narrativa",
        "score": 4,
        "strength": "string - one sentence what works",
        "weakness": "string - one sentence main problem",
        "findings": [
          {
            "title": "string - Escena X: short description of the issue",
            "scene_ref": "string - Escena 3 or ESC 03 or Acto 2",
            "evidence": "string - exact quote or specific moment from the script (max 200 chars)",
            "problem_description": "string - what exactly is wrong",
            "narrative_effect": "string - why this matters for the story",
            "improvement_goal": "string - what a good revision would achieve",
            "priority": "alta|media|baja"
          }
        ]
      },
      { "key": "personajes", "label": "Personajes", "score": 3, "strength": "...", "weakness": "...", "findings": [] },
      { "key": "visual", "label": "Visual", "score": 3, "strength": "...", "weakness": "...", "findings": [] },
      { "key": "actuacion", "label": "Actuación", "score": 4, "strength": "...", "weakness": "...", "findings": [] },
      { "key": "audiencia", "label": "Audiencia", "score": 3, "strength": "...", "weakness": "...", "findings": [] },
      { "key": "franquicia", "label": "Franquicia", "score": 3, "strength": "...", "weakness": "...", "findings": [] }
    ]
  }
}`

  let raw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 10000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })
    raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    if (response.stop_reason === 'max_tokens') {
      console.warn('[analyze-full] response truncated at max_tokens')
    }
  } catch (e) {
    console.error('[analyze-full] Claude error:', e)
    return NextResponse.json({ error: 'Error al contactar Claude' }, { status: 500 })
  }

  // 5. Parse JSON response
  let result: { structure: FullAnalysis['structure']; scoring: { overall: number; verdict: string; categories: Array<{ key: string; label: string; score: number; strength: string; weakness: string; findings: Omit<Finding, 'id' | 'status' | 'source' | 'order_index'>[] }> } }
  try {
    // Remove markdown fences if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    // Find first { and last } to extract the JSON object
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON braces found')
    result = JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    console.error('[analyze-full] parse failed, raw preview:', raw.substring(0, 500))
    return NextResponse.json({ error: 'No se pudo interpretar la respuesta', raw: raw.substring(0, 400) }, { status: 500 })
  }

  // 6. Insert script_analysis
  const { data: analysis, error: analysisError } = await supabase
    .from('script_analyses')
    .insert({
      episode_id: episodeId,
      script_version_id: scriptVersionId,
      overall_score: result.scoring.overall,
      verdict: result.scoring.verdict,
      scores_snapshot: result.scoring.categories,
      structure_data: result.structure ?? null,
      is_current: true,
      created_by: token.email,
    })
    .select('id')
    .single()

  if (analysisError || !analysis) {
    return NextResponse.json({ error: 'Error al guardar análisis' }, { status: 500 })
  }

  const analysisId = analysis.id

  // 7. Insert findings
  const savedFindingsByCategory: Record<string, Finding[]> = {}

  for (const cat of result.scoring.categories) {
    savedFindingsByCategory[cat.key] = []
    if (!cat.findings || cat.findings.length === 0) continue

    const findingsToInsert = cat.findings.map((f, i) => ({
      episode_id: episodeId,
      analysis_id: analysisId,
      category: cat.key,
      title: f.title,
      scene_ref: f.scene_ref,
      evidence: f.evidence,
      problem_description: f.problem_description,
      narrative_effect: f.narrative_effect,
      improvement_goal: f.improvement_goal,
      priority: f.priority,
      status: 'pending',
      source: 'scoring',
      order_index: i,
    }))

    const { data: insertedFindings, error: findingsError } = await supabase
      .from('script_findings')
      .insert(findingsToInsert)
      .select('*')

    if (!findingsError && insertedFindings) {
      savedFindingsByCategory[cat.key] = insertedFindings as Finding[]
    }
  }

  const totalFindings = Object.values(savedFindingsByCategory).reduce((sum, arr) => sum + arr.length, 0)

  const categoriesWithFindings: AnalysisCategory[] = result.scoring.categories.map(cat => ({
    key: cat.key,
    label: cat.label,
    score: cat.score,
    strength: cat.strength,
    weakness: cat.weakness,
    findings: savedFindingsByCategory[cat.key] ?? [],
  }))

  const response: FullAnalysis = {
    analysis_id: analysisId,
    script_version_id: scriptVersionId,
    structure: result.structure,
    scoring: {
      overall: result.scoring.overall,
      verdict: result.scoring.verdict,
      categories: categoriesWithFindings,
    },
    findings_count: totalFindings,
    script_truncated: scriptTruncated,
    script_total_chars: episode.script.length,
    script_analyzed_chars: scriptText.length,
  }

  return NextResponse.json(response)
}
