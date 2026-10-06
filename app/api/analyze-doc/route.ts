import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VALID_CATEGORIES = [
  'personajes', 'arte', 'guion', 'continuidad',
  'marketing', 'merchandise', 'trailers', 'redes', 'licensing', 'general',
]

const VALID_ASSET_CATEGORIES = ['personajes', 'locaciones', 'props', 'criaturas', 'secundarios', 'mascotas', 'rivales', 'hawks']

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text, filename } = await request.json()
  if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

  const excerpt = text.substring(0, 6000)

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `Eres el asistente de producción de "Los Prodigios", una serie animada latinoamericana.

Analiza el siguiente documento y devuelve SOLO un objeto JSON válido con este formato exacto:
{
  "description": "Una descripción de 1-2 oraciones que explique qué contiene el documento.",
  "categories": ["categoria1"],
  "needs_assets": true,
  "asset_category": "personajes",
  "asset_entity_name": "MateoGonzalez",
  "asset_entity_label": "Mateo González",
  "asset_confidence": 0.95
}

Reglas para "categories" (máximo 4, solo estas): personajes, arte, guion, continuidad, marketing, merchandise, trailers, redes, licensing, general

Reglas para assets:
- "needs_assets": true si el documento describe un elemento visual concreto que necesitará imágenes de referencia aprobadas: un personaje, locación, prop, criatura, mascota, personaje secundario, O un equipo rival (con uniformes, emblema, colores). false si es un documento conceptual, de reglas narrativas, guión, marketing, o cualquier cosa que NO requiera arte visual aprobado.
- "asset_category": una de: personajes, locaciones, props, criaturas, secundarios, mascotas, rivales, hawks. Usa "rivales" para equipos rivales como EQUIPO (uniforme, emblema, identidad visual). Usa "hawks" si el documento describe uno o más jugadores o el cuerpo técnico de Hawks específicamente. Usa "secundarios" para otros personajes de apoyo. Solo si needs_assets es true.
- "asset_entity_name": slug en PascalCase sin espacios ni acentos (ej: "MateoGonzalez", "CanchaBarrio", "ElCondorFC"). Solo si needs_assets es true.
- "asset_entity_label": nombre legible con acentos (ej: "Mateo González", "El Cóndor FC"). Solo si needs_assets es true.
- "asset_confidence": número entre 0 y 1 indicando qué tan seguro estás. Solo si needs_assets es true.

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

    const needsAssets = parsed.needs_assets === true && parsed.asset_confidence >= 0.7
    const assetCategory = VALID_ASSET_CATEGORIES.includes(parsed.asset_category) ? parsed.asset_category : null

    return NextResponse.json({
      description,
      categories,
      needs_assets: needsAssets,
      asset_category: needsAssets ? assetCategory : null,
      asset_entity_name: needsAssets && assetCategory ? (parsed.asset_entity_name ?? null) : null,
      asset_entity_label: needsAssets && assetCategory ? (parsed.asset_entity_label ?? null) : null,
      asset_confidence: needsAssets ? (parsed.asset_confidence ?? null) : null,
    })
  } catch {
    return NextResponse.json({ description: '', categories: ['general'], needs_assets: false })
  }
}
