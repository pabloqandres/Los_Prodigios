import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// POST /api/canon-preflight
// Searches all reference docs for entities mentioned in the query.
// Returns relevant docs + canonical snippets to ground the AI before generating.

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query) return NextResponse.json({ docs: [], facts: [] })

    const supabase = createServerClient()

    // 1. Load ALL reference docs (titles + full content for search)
    const { data: allDocs } = await supabase
      .from('reference_docs')
      .select('title, content, description')
      .order('title')

    if (!allDocs || allDocs.length === 0) return NextResponse.json({ docs: [], facts: [] })

    // 2. Score each doc by relevance to the query
    const queryLower = query.toLowerCase()
    const queryWords = queryLower
      .split(/\s+/)
      .filter((w: string) => w.length > 3)
      .map((w: string) => w.replace(/[^a-záéíóúñü]/gi, ''))

    const scoredDocs = allDocs.map(doc => {
      const combined = `${doc.title} ${doc.description ?? ''} ${doc.content ?? ''}`.toLowerCase()
      let score = 0
      for (const word of queryWords) {
        if (!word) continue
        const count = (combined.match(new RegExp(word, 'g')) ?? []).length
        score += count
        // Bonus if word appears in title
        if (doc.title.toLowerCase().includes(word)) score += 10
      }
      return { ...doc, score }
    })

    // 3. Sort by relevance, take top 6
    const relevant = scoredDocs
      .filter(d => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    // 4. Extract key canonical snippets from relevant docs
    // Look for sections with visual/design keywords
    const VISUAL_KEYWORDS = [
      'color', 'azul', 'rojo', 'verde', 'negro', 'blanco', 'dorado', 'cobre', 'plateado',
      'diseño', 'forma', 'textura', 'material', 'papel', 'sobre', 'sello', 'lacre',
      'uniforme', 'ropa', 'pelo', 'cabello', 'ojos', 'piel', 'altura', 'complexión',
      'locación', 'locacion', 'edificio', 'cancha', 'sala', 'cuarto', 'ciudad',
      'logo', 'símbolo', 'emblema', 'marca', 'tipografía'
    ]

    const facts: { doc: string; snippet: string }[] = []

    for (const doc of relevant.slice(0, 4)) {
      if (!doc.content) continue
      const lines = doc.content.split('\n').filter((l: string) => l.trim().length > 20)

      for (const line of lines) {
        const lineLower = line.toLowerCase()
        const hasVisual = VISUAL_KEYWORDS.some(kw => lineLower.includes(kw))
        const hasQueryTerm = queryWords.some((w: string) => w && lineLower.includes(w))

        if (hasVisual && hasQueryTerm && facts.length < 12) {
          facts.push({
            doc: doc.title,
            snippet: line.trim().slice(0, 180),
          })
        }
      }
    }

    return NextResponse.json({
      docs: allDocs.map(d => d.title),
      relevant: relevant.map(d => ({ title: d.title, score: d.score })),
      facts,
      total: allDocs.length,
    })
  } catch (e) {
    console.error('canon-preflight error:', e)
    return NextResponse.json({ docs: [], facts: [], relevant: [], total: 0 })
  }
}
