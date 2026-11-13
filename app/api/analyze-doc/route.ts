import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VALID_CATEGORIES = [
  'personajes', 'arte', 'guion', 'continuidad',
  'marketing', 'merchandise', 'trailers', 'redes', 'licensing', 'general',
]

const VALID_ASSET_CATEGORIES = ['personajes', 'locaciones', 'props', 'criaturas', 'secundarios', 'mascotas', 'rivales', 'hawks']

const VALID_MATRIX_KEYS = ['personajes', 'entrenadores', 'locaciones', 'props', 'criaturas', 'secundarios', 'mascotas', 'rivales', 'hawks', 'simbolos']

type EntitySuggestion = {
  asset_category: string | null
  asset_matrix_key: string | null
  asset_entity_name: string | null
  asset_entity_label: string | null
  asset_confidence: number | null
  asset_accessories: string[]
}

function parseEntity(raw: Record<string, unknown>): EntitySuggestion | null {
  const assetCategory = VALID_ASSET_CATEGORIES.includes(raw.asset_category as string) ? raw.asset_category as string : null
  const matrixKey = VALID_MATRIX_KEYS.includes(raw.asset_matrix_key as string) ? raw.asset_matrix_key as string : assetCategory
  const confidence = typeof raw.asset_confidence === 'number' ? raw.asset_confidence : 0
  const needsAssets = raw.needs_assets === true && confidence > 0 && !!assetCategory && !!raw.asset_entity_name
  if (!needsAssets) return null
  const accessories = Array.isArray(raw.asset_accessories)
    ? (raw.asset_accessories as unknown[]).filter((a: unknown) => typeof a === 'string' && (a as string).trim().length > 0).slice(0, 5) as string[]
    : []
  return {
    asset_category: assetCategory,
    asset_matrix_key: matrixKey,
    asset_entity_name: (raw.asset_entity_name as string) ?? null,
    asset_entity_label: (raw.asset_entity_label as string) ?? null,
    asset_confidence: confidence,
    asset_accessories: accessories,
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text, filename } = await request.json()
  if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

  // Use more text for multi-entity detection
  const excerpt = text.substring(0, 16000)

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Eres el asistente de producción de "Los Prodigios", una serie animada latinoamericana de fútbol.

Analiza el siguiente documento y devuelve SOLO un objeto JSON válido.

IMPORTANTE: Si el documento describe MÚLTIPLES elementos visuales (varios personajes, varias locaciones, etc.), devuelve TODOS en el array "entities". Si describe UN SOLO elemento, pon ese único elemento en el array. Si NO describe ningún elemento visual, deja "entities" vacío.

Formato exacto:
{
  "description": "Una descripción de 1-2 oraciones que explique qué contiene el documento.",
  "categories": ["categoria1"],
  "entities": [
    {
      "needs_assets": true,
      "asset_category": "hawks",
      "asset_matrix_key": "hawks",
      "asset_entity_name": "HawksRafaelMontoya",
      "asset_entity_label": "Rafael Montoya",
      "asset_confidence": 0.95,
      "asset_accessories": ["Objeto 1"]
    }
  ]
}

Reglas para "categories" (máximo 4, solo estas): personajes, arte, guion, continuidad, marketing, merchandise, trailers, redes, licensing, general

Reglas para cada entidad en "entities":
- "needs_assets": true si describe un elemento visual concreto que necesitará imágenes aprobadas.
- "asset_category": una de: personajes, locaciones, props, criaturas, secundarios, mascotas, rivales, hawks. Reglas:
    * "personajes" → miembros del cast principal de Los Prodigios: jugadores, entrenadores, analistas, staff con arco propio.
    * "secundarios" → personajes menores SIN arco propio: familiares episódicos, árbitros, comentaristas, hinchas.
    * "hawks" → SOLO Hawks FC y su cuerpo técnico.
    * "rivales" → otros equipos rivales como identidad visual de equipo.
- "asset_matrix_key": determina los TIPOS DE SLOTS DE ARTE:
    * "personajes" → jugadores activos (uniforme de partido, poses de acción deportiva)
    * "entrenadores" → entrenadores, DTs, preparadores físicos (banca, no juegan)
    * "secundarios" → personajes sin uniforme ni acción deportiva
    * "locaciones" → espacios físicos
    * "props" → objetos con significado narrativo
    * "criaturas" → animales o criaturas
    * "mascotas" → mascotas del equipo
    * "rivales" → equipos rivales (identidad visual del equipo, no jugadores individuales)
    * "hawks" → jugadores de Hawks FC
    * "simbolos" → emblemas, logos, gráfica oficial
- "asset_entity_name": slug PascalCase sin acentos. Para hawks prefija con "Hawks" (ej: "HawksRafaelMontoya"). Para locaciones usa nombre descriptivo (ej: "ColegioSouthCross").
- "asset_entity_label": nombre legible con acentos.
- "asset_confidence": 0-1.
- "asset_accessories": SOLO objetos/props físicos recurrentes del personaje (máximo 5).
  INCLUIR: objetos personales con significado (collares, pulseras, libretas, relojes, guantes de arquero, botines especiales).
  EXCLUIR: ropa/uniformes, rasgos físicos, props de un solo uso.
  Si no hay, devuelve [].

REGLA CRÍTICA para documentos multi-personaje:
- Si el documento describe un EQUIPO con varios jugadores, crea UNA entidad POR CADA jugador/entrenador individual.
- Si el documento describe una locación con múltiples áreas diferenciadas, crea una entidad para la locación principal.
- Si un personaje es DT/entrenador, usa asset_matrix_key "entrenadores" en vez de "hawks" o "personajes".
- NO crees una entidad genérica del equipo si ya existen los jugadores individuales.

Nombre del archivo: ${filename}

Contenido:
---
${excerpt}
---

Responde ÚNICAMENTE con el JSON, sin texto adicional.`,
      },
    ],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  try {
    const match = raw.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(match ? match[0] : raw)

    const description = typeof parsed.description === 'string' ? parsed.description : ''
    const categories = Array.isArray(parsed.categories)
      ? parsed.categories.filter((c: string) => VALID_CATEGORIES.includes(c))
      : []

    // Parse entities array (new multi-entity format)
    const rawEntities: Record<string, unknown>[] = Array.isArray(parsed.entities) ? parsed.entities : []
    const entities: EntitySuggestion[] = rawEntities
      .map(parseEntity)
      .filter((e): e is EntitySuggestion => e !== null)

    // Backward compatibility: if AI returned old single-entity format, wrap it
    if (entities.length === 0 && parsed.needs_assets === true && parsed.asset_entity_name) {
      const single = parseEntity(parsed)
      if (single) entities.push(single)
    }

    // Legacy single-entity fields for backward compat with frontend (first entity)
    const first = entities[0] ?? null

    return NextResponse.json({
      description,
      categories,
      // New: full entity list
      entities,
      // Legacy single-entity fields (first entity or null)
      needs_assets: !!first,
      asset_category: first?.asset_category ?? null,
      asset_matrix_key: first?.asset_matrix_key ?? null,
      asset_entity_name: first?.asset_entity_name ?? null,
      asset_entity_label: first?.asset_entity_label ?? null,
      asset_confidence: first?.asset_confidence ?? null,
      asset_accessories: first?.asset_accessories ?? [],
    })
  } catch {
    return NextResponse.json({ description: '', categories: ['general'], needs_assets: false, entities: [] })
  }
}
