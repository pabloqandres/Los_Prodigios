import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 120

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

  // 4. Call Claude
  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`
  const SCRIPT_LIMIT = 28000
  const scriptTruncated = episode.script.length > SCRIPT_LIMIT
  const scriptText = episode.script.substring(0, SCRIPT_LIMIT)

  const systemPrompt = `Eres el story editor jefe de "Los Prodigios", serie animada latinoamericana de fútbol y coming-of-age.
Tu tarea es hacer un análisis editorial completo del guión de un episodio.

Debes hacer DOS cosas en un solo JSON:

1. ESTRUCTURA: identificar todos los actos y escenas del guión. Si el guión tiene marcadores explícitos de escena (INT./EXT., ESCENA, ESC, #), úsalos. Si no, infiere las escenas por cambios de locación/tiempo/acción. Un episodio de 10-14 min tiene 8-18 escenas distribuidas en 3 actos.

2. SCORING Y HALLAZGOS: evaluar 5 dimensiones (narrativa, personajes, dialogo, ritmo, emocion) en escala 1-5 e identificar hallazgos concretos (múltiples por dimensión si los hay).

REGLAS DE SCORING:
- 5=Excepcional, 4=Sólido, 3=Aceptable, 2=Insuficiente, 1=Crítico
- No generar hallazgos artificialmente. Solo reportar problemas reales del guión.
- Cada hallazgo debe tener evidencia concreta del texto.
- Si una dimensión no tiene problemas relevantes, findings puede ser array vacío.

REGLAS DE ESTRUCTURA:
- Siempre 3 actos. Distribuir escenas según dramaturgia si no hay marcadores.
- description: resumen de máx 60 palabras de lo que ocurre (no copiar el diálogo).
- original_text: fragmento del guión de máx 80 chars.
- Máximo 6 escenas por acto (18 escenas totales máximo).

REGLAS DE FINDINGS:
- Máximo 2 hallazgos por categoría.
- evidence: máx 100 chars. problem_description: máx 80 chars. narrative_effect: máx 80 chars. improvement_goal: máx 80 chars.

FORMATO DE SALIDA — MUY IMPORTANTE:
Tu respuesta debe comenzar EXACTAMENTE con el carácter { y terminar EXACTAMENTE con el carácter }.
NO uses bloques de código markdown (\`\`\`json). NO agregues texto antes ni después del JSON.
La primera línea de tu respuesta es { y la última es }.`

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
      { "key": "dialogo", "label": "Diálogo", "score": 3, "strength": "...", "weakness": "...", "findings": [] },
      { "key": "ritmo", "label": "Ritmo", "score": 4, "strength": "...", "weakness": "...", "findings": [] },
      { "key": "emocion", "label": "Emoción", "score": 3, "strength": "...", "weakness": "...", "findings": [] }
    ]
  }
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
