import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { ENTITIES } from '@/lib/approval-config'
import { assembleEntityContext } from '@/lib/doc-context'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const runtime = 'nodejs'
export const maxDuration = 60

interface SlotInfo {
  id: string
  view_type: string
  outfit: string | null
  age_version: string | null
  version_label: string
  filename: string
}

const SYSTEM_PROMPT = `Eres el supervisor de arte de "Los Prodigios", serie animada latinoamericana. Tu trabajo es escribir instrucciones de imagen para ChatGPT Images 2.0 — el generador más nuevo de OpenAI integrado en ChatGPT.

CÓMO FUNCIONA ChatGPT Images 2.0:
- Lee lenguaje natural descriptivo, NO keywords separados por comas
- El usuario siempre sube la ficha técnica del personaje como imagen de referencia antes de ejecutar el prompt
- El modelo tiene altísima fidelidad de referencia: respeta diseño, proporciones y paleta de la imagen que recibe
- Soporta edición localizada: "mantén todo igual excepto X"

FORMATO DE PROMPT CORRECTO (lenguaje natural, claro, descriptivo):
❌ MAL: "anime boy, cel shading, white bg, faded navy shirt, worn sneakers"
✅ BIEN: "Using the provided character reference sheet, draw [NOMBRE] in a full-body front view. Maintain their exact design: [descripción física], [accesorios canónicos visibles]. Style: 2D animation, cel-shaded with clean outlines and flat shadows. White background."

ESTILO MAESTRO — LOS PRODIGIOS:
- Animación 2D latinoamericana, cel-shading cinematográfico
- Outlines limpios y definidos, sombras planas en 2-3 tonos
- NO fotorrealista — estilo producción de serie animada de calidad
- Siempre fondo blanco para fichas de personaje/referencia
- Comenzar siempre con "Using the provided character reference sheet,"

REGLAS DE ESCRITURA DE PROMPTS:
- Lenguaje natural descriptivo, NO listas de keywords separados por comas
- Comenzar SIEMPRE con: "Using the provided character reference sheet, draw [descripción de la vista]."
- Para vistas de expresión: close-up of [nombre]'s face showing [emoción]
- Para acciones: [nombre] in a dynamic pose [descripción acción]
- Para accesorios/detalles: an isolated detail shot of [accesorio]
- Mencionar SIEMPRE los accesorios canónicos del personaje que sean visibles en esa vista específica
- Describir la expresión/emoción/pose de forma narrativa, no técnica
- Cerrar SIEMPRE con: "2D cel-shaded animation style, clean black outlines, flat color shading, white background. Maintain exact character design consistency with the reference."
- Entre 80-130 palabras por prompt

GUÍA POR TIPO DE VISTA (adaptarla al personaje específico):
Vista general · Frente → full-body front view, arms relaxed at sides, neutral standing pose
Vista general · Espalda → full-body back view, showing hair and back of outfit
Vista general · Perfil D → full-body right side profile
Vista general · Perfil I → full-body left side profile
3/4 → three-quarter angle, slight turn, relaxed pose
Expresión · Neutral → calm, slightly observant — default resting expression
Expresión · Alegría → genuine warm smile, eyes bright and slightly crinkled
Expresión · Enojo → furrowed brow, tight jaw, determined rather than aggressive
Expresión · Tristeza → downcast eyes, slight droop in posture, contained
Expresión · Sorpresa → eyes wide open, eyebrows raised, mouth slightly open
Expresión · Concentración → narrowed eyes, focused forward gaze, jaw set
Expresión · Miedo → wide eyes, slight step back, tense
Expresión · Llanto → tears visible, red eyes, biting lip, deeply contained grief
Expresión · Orgullo → subtle confident smile, chin slightly raised, shoulders back
Outfit casual → full body showing complete casual outfit, all clothing details visible
Outfit deportivo → full body in sports/team outfit, all details visible
Acción · Dribling → low athletic stance, ball at feet, dynamic body lean
Acción · Tiro → full kick follow-through, leg extended, powerful motion
Acción · Celebración → arms raised in joy or fist pump, genuine happiness
Acción · Sprint → full-speed running motion, slight forward lean, feet off ground
Acción · Caída → sliding or falling, scraping ground, impact moment
Acción · Salto → mid-air jump, body extended, feet off ground
Acción · Recepción → body positioned to receive/trap ball, focused
Gesto característico → signature casual everyday gesture, relaxed full body
Pose reposo → leaning against a wall or sitting, completely relaxed
Versión infantil → shorter and more childlike, rounder face, same design but younger
Accesorio → isolated detail shot, product reference style on white background`

function getEntityAccessories(entity_name: string): string[] {
  for (const entities of Object.values(ENTITIES)) {
    const entity = entities.find(e => e.entity_name === entity_name)
    if (entity?.accessories) return entity.accessories
  }
  return []
}

function buildBatchPrompt(
  entity_name: string,
  entity_label: string,
  fieldLines: string,
  accessories: string[],
  batch: SlotInfo[],
  bibleContext?: string
): string {
  const slotsText = batch.map((s, i) =>
    `${i + 1}. ID:${s.id} | Vista:${s.view_type}${s.outfit ? ` · ${s.outfit}` : ''}${s.age_version ? ` · ${s.age_version}` : ''} | Archivo:${s.filename}`
  ).join('\n')

  const accessoriesLine = accessories.length > 0
    ? `\nACCESORIOS CANÓNICOS INAMOVIBLES: ${accessories.join(', ')} — siempre incluirlos si son visibles en la vista.`
    : ''

  const contextSection = bibleContext
    ? `\nCONTEXTO ADICIONAL DE LA BIBLIA (usa estos detalles para enriquecer la descripción en los prompts):\n${bibleContext.substring(0, 2500)}`
    : ''

  return `Personaje: ${entity_label}
Datos canónicos del personaje: ${fieldLines || 'usar la descripción visual del personaje'}${accessoriesLine}${contextSection}

Escribe una instrucción en INGLÉS para ChatGPT Images 2.0 para CADA slot de la lista.
El usuario siempre sube la ficha técnica del personaje antes de ejecutar la instrucción.
Usa "${entity_label}" como nombre del personaje en cada prompt (no uses otros nombres).

SLOTS A GENERAR:
${slotsText}

Responde SOLO el JSON array, sin texto adicional:
[{"id":"SLOT_ID","prompt":"la instrucción en inglés"},...]`
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { entity_name: string; entity_label: string; canonical_fields: Record<string, string>; slots: SlotInfo[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { entity_name, entity_label, canonical_fields, slots } = body
  if (!slots?.length) return NextResponse.json({ error: 'No slots provided' }, { status: 400 })

  const fieldLines = Object.entries(canonical_fields || {})
    .map(([k, v]) => `${k}: ${v}`)
    .join(' | ')

  const accessories = getEntityAccessories(entity_name)

  // Fetch multi-doc Bible context for this entity
  const supabase = createServerClient()
  const entityCtx = await assembleEntityContext(supabase, entity_name, entity_label)
  const bibleContext = entityCtx.entity_context || undefined

  const BATCH_SIZE = 10
  const batches: SlotInfo[][] = []
  for (let i = 0; i < slots.length; i += BATCH_SIZE) {
    batches.push(slots.slice(i, i + BATCH_SIZE))
  }

  async function processBatch(batch: SlotInfo[]): Promise<Array<{ id: string; prompt: string; filename: string }>> {
    try {
      const userMsg = buildBatchPrompt(entity_name, entity_label, fieldLines, accessories, batch, bibleContext)
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 5000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMsg }],
      })
      const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]'
      const match = raw.match(/\[[\s\S]*\]/)
      if (!match) return []
      const parsed: Array<{ id: string; prompt: string }> = JSON.parse(match[0])
      return parsed
        .map(item => {
          const slot = batch.find(s => s.id === item.id)
          return slot ? { id: item.id, prompt: item.prompt, filename: slot.filename } : null
        })
        .filter(Boolean) as Array<{ id: string; prompt: string; filename: string }>
    } catch {
      return []
    }
  }

  try {
    const results = await Promise.all(batches.map(processBatch))
    const promptMap: Record<string, { filename: string; prompt: string }> = {}
    for (const batch of results) {
      for (const item of batch) {
        promptMap[item.id] = { filename: item.filename, prompt: item.prompt }
      }
    }

    if (Object.keys(promptMap).length > 0) {
      const supabase = createServerClient()
      await Promise.all(
        Object.entries(promptMap).map(([id, { prompt }]) =>
          supabase.from('asset_slots').update({ generated_prompt: prompt }).eq('id', id)
        )
      )
    }

    return NextResponse.json({ prompts: promptMap })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
