import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { assembleEntityContext } from '@/lib/doc-context'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CHECKS_BY_CATEGORY: Record<string, { id: string; label: string }[]> = {
  personajes: [
    { id: 'identidad',        label: 'Identidad del personaje' },
    { id: 'edad_apariencia',  label: 'Edad y complexión' },
    { id: 'tono_piel',        label: 'Tono de piel' },
    { id: 'pelo',             label: 'Color y estilo de pelo' },
    { id: 'ojos',             label: 'Color de ojos' },
    { id: 'outfit',           label: 'Outfit del slot' },
    { id: 'accesorios_clave', label: 'Accesorios canónicos' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
    { id: 'proporciones',     label: 'Proporciones y silueta' },
  ],
  locaciones: [
    { id: 'ambiente_general', label: 'Ambiente general' },
    { id: 'paleta_color',     label: 'Paleta de color' },
    { id: 'iluminacion',      label: 'Iluminación' },
    { id: 'elementos_clave',  label: 'Elementos clave' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
  ],
  props: [
    { id: 'forma_general',    label: 'Forma general' },
    { id: 'materiales',       label: 'Materiales' },
    { id: 'colores',          label: 'Colores' },
    { id: 'detalles_clave',   label: 'Detalles clave' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
  ],
  criaturas: [
    { id: 'morfologia',           label: 'Morfología' },
    { id: 'tono_piel_o_pelaje',   label: 'Piel o pelaje' },
    { id: 'elementos_clave',      label: 'Elementos clave' },
    { id: 'estilo_visual',        label: 'Estilo 2D cel-shaded' },
  ],
  secundarios: [
    { id: 'identidad',        label: 'Identidad del personaje' },
    { id: 'tono_piel',        label: 'Tono de piel' },
    { id: 'pelo',             label: 'Color y estilo de pelo' },
    { id: 'outfit',           label: 'Outfit característico' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
    { id: 'proporciones',     label: 'Proporciones y silueta' },
  ],
  mascotas: [
    { id: 'morfologia',           label: 'Morfología y especie' },
    { id: 'tono_piel_o_pelaje',   label: 'Pelaje / textura' },
    { id: 'elementos_clave',      label: 'Elementos clave' },
    { id: 'expresion',            label: 'Expresión y carácter' },
    { id: 'estilo_visual',        label: 'Estilo 2D cel-shaded' },
  ],
  simbolos: [
    { id: 'forma_general',        label: 'Forma y estructura' },
    { id: 'tipografia',           label: 'Tipografía y texto' },
    { id: 'colores',              label: 'Paleta de color' },
    { id: 'detalles_clave',       label: 'Detalles y elementos clave' },
    { id: 'legibilidad',          label: 'Legibilidad y claridad' },
    { id: 'consistencia_marca',   label: 'Consistencia de marca' },
  ],
}

// Priority order for selecting reference images
const PRIORITY_VIEWS = ['Vista general', 'Frente', '3/4', 'Perfil D', 'Perfil I', 'Espalda']

function buildSystemPrompt(
  category: string,
  entityLabel: string,
  viewType: string,
  outfit: string | null,
  ageVersion: string | null,
  canonicalFields: Record<string, string>,
  refCount: number,
  outfitDocExcerpt?: string,
  entityContext?: string
): string {
  const checks = CHECKS_BY_CATEGORY[category] ?? CHECKS_BY_CATEGORY.personajes
  const checkList = checks.map(c => `- "${c.id}": ${c.label}`).join('\n')

  const canonText = Object.entries(canonicalFields)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `**${k}:** ${v}`)
    .join('\n')

  const outfitSection = outfitDocExcerpt
    ? `\n## Especificación oficial del outfit "${outfit}"\nEste es el fragmento relevante del documento de uniformes/outfits de la producción:\n${outfitDocExcerpt}\nUsa este documento como referencia autoritativa para el check "outfit".`
    : ''

  const contextSection = entityContext
    ? `\n## Contexto adicional de la Biblia de producción\nLos siguientes fragmentos provienen de múltiples documentos de la Biblia de "Los Prodigios". Úsalos para validar detalles que no estén explícitos en los campos canónicos:\n${entityContext}`
    : ''

  const slotContext = [
    `Entidad: ${entityLabel}`,
    `Categoría: ${category}`,
    `Vista: ${viewType}`,
    outfit ? `Outfit declarado: ${outfit}` : null,
    ageVersion ? `Versión etaria: ${ageVersion}` : null,
  ].filter(Boolean).join('\n')

  const refsSection = refCount > 0
    ? `## Referencias visuales
Se te proporcionan ${refCount} imagen(es) de referencia del personaje (marcadas como REFERENCIA 1, 2, etc.).
Úsalas para comparación visual directa al evaluar:
- "identidad": ¿El personaje en la imagen a validar es el mismo que en las referencias?
- "accesorios_clave": ¿El colgante, zapatillas y otros accesorios coinciden visualmente con los de las referencias?
- "tono_piel", "pelo", "proporciones": Compara directamente contra las referencias.
Sé específico: "En la referencia el colgante es un fragmento irregular de cerámica en cordón de cuero marrón; en la imagen a validar es un colgante redondo metálico — no coincide."`
    : `## Referencias visuales
No hay imágenes de referencia disponibles. Basa tu evaluación únicamente en el canon textual descrito arriba.`

  return `Eres el Supervisor de Canon Visual de "Los Prodigios", serie animada latinoamericana en desarrollo.

Tu única función es analizar si una imagen de asset cumple con el canon visual establecido para el elemento que representa.

## Contexto del slot
${slotContext}

## Canon visual del elemento
${canonText || '(Sin campos canónicos disponibles — evalúa solo el estilo visual general)'}
${outfitSection}${contextSection}

${refsSection}

## REGLA CRÍTICA DE IDENTIDAD
El check "identidad" es el más importante. Verifica que el personaje representado en la imagen a validar ES el mismo que el canon describe y el que aparece en las referencias. Si los rasgos físicos clave no coinciden, el check de identidad debe ser "error" + severity "critical". Un personaje incorrecto en un slot siempre es error crítico, sin excepción.

## Tu tarea
La PRIMERA imagen del mensaje es la IMAGEN A VALIDAR. Las siguientes son referencias.
Evalúa CADA uno de los siguientes checks para la imagen a validar:
${checkList}

## Reglas de evaluación
- "ok": El check pasa sin problemas
- "warning": Hay una inconsistencia menor o ambigüedad
- "error": Hay una violación clara del canon (bloquea aprobación si severity es "critical")

Severidades:
- "critical": Rompe el canon de forma inaceptable — especialmente si el personaje no es el correcto
- "warning": Inconsistencia menor tolerable
- "ok": Sin problemas

Verdict general:
- "critical": Al menos un check tiene status "error" y severity "critical"
- "warning": Hay warnings pero ningún critical
- "ok": Todo pasa correctamente

Score de 0 a 100 donde 100 es canon perfecto.

## Formato de respuesta
Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{
  "verdict": "ok" | "warning" | "critical",
  "score": número entre 0 y 100,
  "checks": [
    {
      "id": "id_del_check",
      "label": "Nombre legible",
      "status": "ok" | "warning" | "error",
      "severity": "ok" | "warning" | "critical",
      "detail": "Descripción específica de lo que se observa en la imagen a validar",
      "canon_rule": "La regla de canon relevante (solo si hay problema)"
    }
  ],
  "suggestion": "Sugerencia concreta de corrección (solo si hay errores críticos, omitir si no)"
}`
}

type SupportedMime = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

function detectMimeFromBase64(b64: string): SupportedMime {
  // Decode first few bytes to detect magic number
  const bytes = Buffer.from(b64.slice(0, 16), 'base64')
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'image/png'
  if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'image/jpeg'
  if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'image/gif'
  if (bytes[0] === 0x52 && bytes[4] === 0x57) return 'image/webp'
  return 'image/jpeg' // fallback
}

async function fetchImageAsBase64(url: string): Promise<{ b64: string; mime: SupportedMime } | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const b64 = Buffer.from(buf).toString('base64')
    const mime = detectMimeFromBase64(b64)
    return { b64, mime }
  } catch {
    return null
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: slotId } = await params
  const { canonical_fields = {}, session_refs = [] } = await req.json()

  const supabase = createServerClient()

  const { data: slot, error: slotErr } = await supabase
    .from('asset_slots')
    .select('*')
    .eq('id', slotId)
    .single()

  if (slotErr || !slot) {
    return NextResponse.json({ error: 'Slot no encontrado' }, { status: 404 })
  }

  if (!slot.pending_drive_file_id) {
    return NextResponse.json({ error: 'El slot no tiene imagen pendiente' }, { status: 400 })
  }

  // 1. Fetch the new image
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${slot.pending_drive_file_id}`
  const imageFetched = await fetchImageAsBase64(imageUrl)
  if (!imageFetched) {
    return NextResponse.json({ error: 'No se pudo obtener la imagen del slot' }, { status: 500 })
  }
  const { b64: imageBase64, mime: imageMime } = imageFetched

  // 2. Fetch approved reference images for this entity (max 5, prioritized)
  type RefImage = { label: string; b64: string; mime: SupportedMime }
  let refs: RefImage[] = []

  const { data: approvedSlots } = await supabase
    .from('asset_slots')
    .select('id, version_label, view_type, age_version, approved_drive_file_id')
    .eq('entity_name', slot.entity_name)
    .eq('status', 'approved')
    .not('approved_drive_file_id', 'is', null)

  if (approvedSlots && approvedSlots.length > 0) {
    // Sort by priority view type, prefer current age (no age_version)
    const sorted = [...approvedSlots].sort((a, b) => {
      const ai = PRIORITY_VIEWS.indexOf(a.view_type)
      const bi = PRIORITY_VIEWS.indexOf(b.view_type)
      const aPriority = ai === -1 ? 99 : ai
      const bPriority = bi === -1 ? 99 : bi
      // Prefer current age (null age_version) over versioned
      const aAge = a.age_version ? 1 : 0
      const bAge = b.age_version ? 1 : 0
      return aPriority - bPriority || aAge - bAge
    })

    // Take max 5, one per view_type to maximize diversity
    const seenViewTypes = new Set<string>()
    const selected = sorted.filter(s => {
      if (seenViewTypes.has(s.view_type)) return false
      seenViewTypes.add(s.view_type)
      return true
    }).slice(0, 5)

    // Fetch all in parallel
    const fetched = await Promise.all(
      selected.map(async (s) => {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${s.approved_drive_file_id}`
        const img = await fetchImageAsBase64(url)
        if (!img) return null
        return { label: `${s.version_label} (aprobada)`, b64: img.b64, mime: img.mime }
      })
    )
    refs = fetched.filter((r): r is RefImage => r !== null)
  } else if (session_refs.length > 0) {
    // No approved refs → use session refs from client (detect mime from b64)
    refs = (session_refs as { label: string; b64: string }[]).slice(0, 5).map(r => ({
      label: r.label,
      b64: r.b64,
      mime: detectMimeFromBase64(r.b64),
    }))
  }

  // 3. Assemble multi-doc context from Bible (entity profile + outfit specs + related docs)
  const entityCtx = await assembleEntityContext(
    supabase,
    slot.entity_name,
    slot.entity_label,
    slot.outfit ?? null
  )

  // 4. Build system prompt
  const systemPrompt = buildSystemPrompt(
    slot.category,
    slot.entity_label,
    slot.view_type,
    slot.outfit ?? null,
    slot.age_version ?? null,
    canonical_fields,
    refs.length,
    entityCtx.outfit_excerpt ?? undefined,
    entityCtx.entity_context || undefined
  )

  // 4. Build Claude message content (new image first, then references)
  type ImageBlock = { type: 'image'; source: { type: 'base64'; media_type: SupportedMime; data: string } }
  type TextBlock = { type: 'text'; text: string }
  type ContentBlock = ImageBlock | TextBlock

  const content: ContentBlock[] = [
    { type: 'image', source: { type: 'base64', media_type: imageMime, data: imageBase64 } },
    { type: 'text', text: 'IMAGEN A VALIDAR — Esta es la imagen que debes evaluar.' },
  ]

  refs.forEach((ref, i) => {
    content.push({ type: 'image', source: { type: 'base64', media_type: ref.mime, data: ref.b64 } })
    content.push({ type: 'text', text: `REFERENCIA ${i + 1}: ${ref.label}` })
  })

  content.push({
    type: 'text',
    text: refs.length > 0
      ? 'Analiza la IMAGEN A VALIDAR comparándola con las referencias y el canon textual. Responde con el JSON de validación.'
      : 'Analiza la IMAGEN A VALIDAR contra el canon textual. Responde con el JSON de validación.',
  })

  // 5. Call Claude
  let rawText = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
    })
    rawText = response.content[0].type === 'text' ? response.content[0].text : ''
  } catch (e) {
    return NextResponse.json({ error: `Error llamando a Claude: ${String(e)}` }, { status: 500 })
  }

  // 6. Parse JSON
  let result
  try {
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/) ?? rawText.match(/(\{[\s\S]*\})/)
    const jsonStr = jsonMatch ? jsonMatch[1] ?? jsonMatch[0] : rawText
    result = JSON.parse(jsonStr.trim())
  } catch {
    return NextResponse.json({ error: 'Claude no devolvió JSON válido', raw: rawText }, { status: 500 })
  }

  return NextResponse.json({
    ...result,
    blocked: result.verdict === 'critical',
    refs_used: refs.length,
  })
}
