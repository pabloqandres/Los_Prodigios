import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { logActivity } from '@/lib/activity'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 120

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Types ──────────────────────────────────────────────────────────────────────

type SceneAssetNeed = {
  scene_ref: string
  category: string
  entity_name: string
  entity_label: string
  matrix_key: string
  view_type: string
  outfit: string | null
  age_version: string | null
  reason: string
}

type CanonIssue = {
  scene_ref: string
  entity: string
  issue: string
  severity: 'error' | 'warning'
}

type AnalysisResult = {
  canon_issues: CanonIssue[]
  scene_needs: SceneAssetNeed[]
  gaps: SceneAssetNeed[]          // needs not covered by approved slots
  summary: string
}

// ── POST /api/episodes/[id]/analyze-script ─────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const supabase = createServerClient()

  // ── 1. Load episode ──────────────────────────────────────────────────────────
  const { data: episode, error: epErr } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, script')
    .eq('id', episodeId)
    .single()

  if (epErr || !episode) {
    return NextResponse.json({ error: 'Episodio no encontrado' }, { status: 404 })
  }
  if (!episode.script || episode.script.trim().length < 50) {
    return NextResponse.json({ error: 'El episodio no tiene guión cargado' }, { status: 400 })
  }

  // ── 2. Load approved asset slots ─────────────────────────────────────────────
  const { data: approvedSlots } = await supabase
    .from('asset_slots')
    .select('entity_name, entity_label, category, matrix_key, view_type, outfit, status')
    .eq('status', 'approved')

  const approvedSet = new Set(
    (approvedSlots ?? []).map(s =>
      `${s.entity_name}::${s.view_type}::${s.outfit ?? ''}`.toLowerCase()
    )
  )

  // ── 3. Load canon bible docs (reference_docs) ────────────────────────────────
  const { data: refDocs } = await supabase
    .from('reference_docs')
    .select('title, content')
    .limit(20)
    .order('updated_at', { ascending: false })

  const canonContext = (refDocs ?? [])
    .filter(d => d.content && d.content.length > 100)
    .slice(0, 8)
    .map(d => `### ${d.title}\n${d.content?.substring(0, 1500)}`)
    .join('\n\n---\n\n')

  // ── 4. Claude analysis ────────────────────────────────────────────────────────
  const scriptExcerpt = episode.script.substring(0, 8000)
  const episodeLabel  = `T${episode.season}E${episode.episode_number}${episode.title ? ` — ${episode.title}` : ''}`

  const systemPrompt = `Eres el supervisor de producción de "Los Prodigios", serie animada latinoamericana de fútbol.

Tu trabajo al analizar un guión es:
1. Detectar inconsistencias con el canon establecido en la biblia.
2. Identificar qué elementos visuales necesita cada escena (personajes, locaciones, props).
3. Para cada necesidad visual, especificar qué tipo de imagen concreta hace falta.

Conoces estas categorías de assets: personajes, locaciones, props, criaturas, secundarios, mascotas, rivales, hawks.
Conoces estos matrix_keys que determinan qué slots se generan:
- "personajes" → jugadores activos (juegan partidos)
- "entrenadores" → entrenadores, DTs, preparadores
- "secundarios" → personajes de apoyo sin arco propio
- "locaciones" → espacios físicos
- "props" → objetos con rol narrativo
- "criaturas" → animales/criaturas
- "mascotas" → mascotas del equipo
- "rivales" → equipos rivales
- "hawks" → jugadores/cuerpo técnico de Hawks FC

Para view_type usa los nombres del paquete base Cinema Studio:
"Identidad facial", "Cuerpo completo", "Lámina expresiones", "Uniforme partido",
"Outfit casual", "Acción", "Accesorio", "Vista maestra", "Vista complementaria",
"Detalle", "Estado A", "Estado B", "Estado C", "Maestro"

Devuelve ÚNICAMENTE un objeto JSON válido.`

  const userPrompt = `Episodio: ${episodeLabel}

## Canon de la biblia (fragmento)
${canonContext || '(Sin docs de biblia disponibles aún)'}

---

## Guión
${scriptExcerpt}

---

Analiza el guión y devuelve este JSON exacto:
{
  "canon_issues": [
    {
      "scene_ref": "Escena 2",
      "entity": "Mateo González",
      "issue": "descripción del problema",
      "severity": "error" | "warning"
    }
  ],
  "scene_needs": [
    {
      "scene_ref": "Escena 1",
      "category": "personajes",
      "entity_name": "MateoGonzalez",
      "entity_label": "Mateo González",
      "matrix_key": "personajes",
      "view_type": "Identidad facial",
      "outfit": null,
      "age_version": "Frontal",
      "reason": "Protagonista en primer plano — necesaria referencia facial aprobada"
    }
  ],
  "summary": "Resumen de 2-3 oraciones del análisis: canon issues encontrados y total de necesidades."
}

Reglas:
- Solo incluir en scene_needs los assets que realmente se necesitan para producir las escenas, no todos los personajes del universo.
- entity_name en PascalCase sin acentos (ej: "MateoGonzalez", "CanchaBarrio").
- Si un personaje aparece en múltiples escenas con el mismo tipo de imagen, listar UNA sola vez con el scene_ref de la primera aparición.
- Ser específico con view_type: si la escena pide un close-up emocional → "Identidad facial"; si pide al personaje corriendo → "Acción"; si pide locación general → "Vista maestra".
- Responde SOLO con el JSON, sin texto adicional.`

  let analysisRaw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })
    analysisRaw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  } catch (err) {
    return NextResponse.json({ error: 'Error al contactar Claude' }, { status: 500 })
  }

  // ── 5. Parse result ──────────────────────────────────────────────────────────
  let parsed: Omit<AnalysisResult, 'gaps'>
  try {
    // Strip markdown code fences if present
    const cleaned = analysisRaw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(match ? match[0] : cleaned)
  } catch {
    // Return partial result instead of hard error
    parsed = { canon_issues: [], scene_needs: [], summary: 'No se pudo interpretar la respuesta del análisis.' }
  }

  // ── 6. Gap analysis — filter out already-approved slots ──────────────────────
  const sceneNeeds: SceneAssetNeed[] = Array.isArray(parsed.scene_needs) ? parsed.scene_needs : []
  const gaps = sceneNeeds.filter(need => {
    const key = `${need.entity_name}::${need.view_type}::${need.outfit ?? ''}`.toLowerCase()
    return !approvedSet.has(key)
  })

  // ── 7. Save gaps to episode_asset_requests ────────────────────────────────────
  if (gaps.length > 0) {
    // Clear previous AI-generated requests for this episode first
    await supabase
      .from('episode_asset_requests')
      .delete()
      .eq('episode_id', episodeId)
      .eq('ai_generated', true)

    // For each gap, find approved slots for the same entity (Maestro suggestions)
    const uniqueEntities = [...new Set(gaps.map(g => g.entity_name))]
    const { data: approvedForEntities } = await supabase
      .from('asset_slots')
      .select('id, entity_name, view_type, outfit')
      .in('entity_name', uniqueEntities)
      .eq('status', 'approved')

    const approvedByEntity: Record<string, string[]> = {}
    for (const s of approvedForEntities ?? []) {
      if (!approvedByEntity[s.entity_name]) approvedByEntity[s.entity_name] = []
      approvedByEntity[s.entity_name].push(s.id)
    }

    const rows = gaps.map(g => ({
      episode_id:      episodeId,
      scene_ref:       g.scene_ref,
      category:        g.category,
      entity_name:     g.entity_name,
      entity_label:    g.entity_label,
      matrix_key:      g.matrix_key || g.category,
      view_type:       g.view_type,
      outfit:          g.outfit ?? null,
      age_version:     g.age_version ?? null,
      reason:          g.reason,
      status:          'pending',
      ai_generated:    true,
      suggested_slots: approvedByEntity[g.entity_name] ?? [],
    }))

    await supabase.from('episode_asset_requests').insert(rows)
  }

  // ── 8. Log activity ──────────────────────────────────────────────────────────
  await logActivity({
    action: 'episode.analyze_script',
    entity_type: 'episode',
    entity_id: episodeId,
    entity_label: episodeLabel,
    detail: `${gaps.length} gaps detectados, ${(parsed.canon_issues ?? []).length} issues de canon`,
    user_email: token.email,
  })

  const canonIssues = Array.isArray(parsed.canon_issues) ? parsed.canon_issues : []

  // Persist canon_issues into the current script_analysis (if one exists)
  await supabase
    .from('script_analyses')
    .update({ canon_issues: canonIssues })
    .eq('episode_id', episodeId)
    .eq('is_current', true)

  const result: AnalysisResult = {
    canon_issues: canonIssues,
    scene_needs:  sceneNeeds,
    gaps,
    summary:      typeof parsed.summary === 'string' ? parsed.summary : '',
  }

  return NextResponse.json(result)
}

// ── PATCH — update gap status ─────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const { gap_id, status } = await request.json()
  if (!gap_id || !status) return NextResponse.json({ error: 'gap_id y status requeridos' }, { status: 400 })

  const supabase = createServerClient()
  const { error } = await supabase
    .from('episode_asset_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', gap_id)
    .eq('episode_id', episodeId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// ── GET — fetch saved gaps for this episode ────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('episode_asset_requests')
    .select('*')
    .eq('episode_id', episodeId)
    .order('scene_ref')
    .order('entity_name')

  if (error) return NextResponse.json([])  // table may not exist yet — return empty
  return NextResponse.json(data ?? [])
}
