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

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text, filename } = await request.json()
  if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

  const excerpt = text.substring(0, 10000)

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 900,
    messages: [
      {
        role: 'user',
        content: `Eres el asistente de producción de "Los Prodigios", una serie animada latinoamericana de fútbol.

Analiza el siguiente documento y devuelve SOLO un objeto JSON válido con este formato exacto:
{
  "description": "Una descripción de 1-2 oraciones que explique qué contiene el documento.",
  "categories": ["categoria1"],
  "needs_assets": true,
  "asset_category": "personajes",
  "asset_matrix_key": "entrenadores",
  "asset_entity_name": "MateoGonzalez",
  "asset_entity_label": "Mateo González",
  "asset_confidence": 0.95,
  "asset_accessories": ["Nombre del objeto 1", "Nombre del objeto 2"]
}

Reglas para "categories" (máximo 4, solo estas): personajes, arte, guion, continuidad, marketing, merchandise, trailers, redes, licensing, general

Reglas para assets:
- "needs_assets": true si el documento describe un elemento visual concreto que necesitará imágenes de referencia aprobadas: un personaje, locación, prop, criatura, mascota, personaje secundario, O un equipo rival. false si es un documento conceptual, de reglas narrativas, guión, marketing, o cualquier cosa que NO requiera arte visual aprobado.
- "asset_category": una de: personajes, locaciones, props, criaturas, secundarios, mascotas, rivales, hawks. Reglas:
    * "personajes" → TODOS los miembros del cast principal de Los Prodigios: jugadores, entrenadores, analistas, staff con arco propio y presencia recurrente (aunque no jueguen fútbol). Si el documento tiene secciones como "arco de personaje", "función en el equipo" o "relaciones con los prodigios", es "personajes".
    * "secundarios" → personajes menores SIN arco propio: familiares episódicos, árbitros, comentaristas, hinchas, figuras de fondo.
    * "hawks" → SOLO Hawks FC y su cuerpo técnico específicamente.
    * "rivales" → otros equipos rivales como identidad visual de equipo.
    Solo si needs_assets es true.
- "asset_matrix_key": determina QUÉ TIPO DE SLOTS DE ARTE se generarán:
    * "personajes" → jugadores activos (juegan partidos, tienen uniforme de partido y poses de acción deportiva)
    * "entrenadores" → entrenadores, DTs, preparadores físicos (banca, no juegan)
    * "secundarios" → personajes sin uniforme ni acción deportiva (analistas, staff técnico, personajes de apoyo con arco). Usar también para miembros principales que NO juegan partidos (ej: analista de datos, médico del equipo).
    * "locaciones" → espacios físicos
    * "props" → objetos con significado narrativo
    * "criaturas" → animales o criaturas
    * "mascotas" → mascotas del equipo
    * "rivales" → equipos rivales
    * "hawks" → jugadores o cuerpo técnico de Hawks FC
    * "simbolos" → emblemas, logos, gráfica oficial
- "asset_entity_name": slug en PascalCase sin espacios ni acentos (ej: "MateoGonzalez", "CanchaBarrio"). Solo si needs_assets es true.
- "asset_entity_label": nombre legible con acentos (ej: "Mateo González"). Solo si needs_assets es true.
- "asset_confidence": número entre 0 y 1. Solo si needs_assets es true.
- "asset_accessories": lista de objetos físicos con significado visual o narrativo que el personaje/entidad posee de forma característica (máximo 5). Ejemplos: "Collar / fragmento cerámica", "Libreta negra (detalle)", "Reloj analógico (herencia)". Solo si needs_assets es true y el documento menciona objetos característicos. Si no hay objetos relevantes, devuelve [].

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

    const assetCategory = VALID_ASSET_CATEGORIES.includes(parsed.asset_category) ? parsed.asset_category : null
    const matrixKey = VALID_MATRIX_KEYS.includes(parsed.asset_matrix_key) ? parsed.asset_matrix_key : assetCategory
    const confidence = typeof parsed.asset_confidence === 'number' ? parsed.asset_confidence : 0
    const needsAssets = parsed.needs_assets === true && confidence > 0 && !!assetCategory && !!parsed.asset_entity_name
    const accessories = needsAssets && Array.isArray(parsed.asset_accessories)
      ? parsed.asset_accessories.filter((a: unknown) => typeof a === 'string' && a.trim().length > 0).slice(0, 5)
      : []

    return NextResponse.json({
      description,
      categories,
      needs_assets: needsAssets,
      asset_category: needsAssets ? assetCategory : null,
      asset_matrix_key: needsAssets && assetCategory ? matrixKey : null,
      asset_entity_name: needsAssets ? (parsed.asset_entity_name ?? null) : null,
      asset_entity_label: needsAssets ? (parsed.asset_entity_label ?? null) : null,
      asset_confidence: needsAssets ? confidence : null,
      asset_accessories: accessories,
    })
  } catch {
    return NextResponse.json({ description: '', categories: ['general'], needs_assets: false })
  }
}
