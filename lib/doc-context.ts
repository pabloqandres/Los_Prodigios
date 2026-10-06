/**
 * doc-context.ts
 * Multi-doc context assembler for Los Prodigios Bible docs.
 *
 * Strategy:
 *  1. Full-text search via tsvector (Postgres GIN index) — fast, searches full content
 *  2. Fallback: score all docs client-side by keyword overlap (if tsvector not available)
 *  3. Re-rank results: profile docs first (entity name in title), outfit docs boosted when outfit supplied
 *  4. Extract relevant paragraphs from each doc (max 1500 chars/doc, 6000 total)
 *  5. Return assembled context + structured key:value fields + outfit-specific excerpt
 */

import { createServerClient } from '@/lib/supabase'

export interface EntityContext {
  /** Key:value fields parsed from the best profile doc (for UI display) */
  structured_fields: Record<string, string>
  /** Multi-doc assembled text (for AI injection) */
  entity_context: string
  /** Outfit-specific excerpt (for validate-canon outfit check) */
  outfit_excerpt: string | null
  /** Docs that contributed to the context */
  docs_used: Array<{ id: string; title: string }>
}

// ── Text utilities ─────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function buildEntityKeywords(entity_name: string, entity_label: string): string[] {
  const fromLabel = normalize(entity_label).split(/\s+/).filter(w => w.length > 2)
  const fromName  = entity_name.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).map(normalize).filter(w => w.length > 2)
  return [...new Set([...fromLabel, ...fromName])]
}

/**
 * Extract the most relevant paragraphs from a doc given a list of keywords.
 * Always includes the first 2 paragraphs (header/intro), then keyword-matched ones.
 */
function extractRelevantParagraphs(content: string, keywords: string[], maxChars: number): string {
  const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 20)
  const intro = paragraphs.slice(0, 2)

  const rest = paragraphs.slice(2)
    .map(p => ({ p, hits: keywords.filter(kw => normalize(p).includes(kw)).length }))
    .filter(x => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .map(x => x.p)

  const seen = new Set<string>()
  const result: string[] = []
  for (const p of [...intro, ...rest]) {
    if (!seen.has(p)) { seen.add(p); result.push(p) }
  }

  return result.join('\n\n').substring(0, maxChars)
}

// ── Structured field parser (reused from entity-doc) ──────────────────────────

function parseStructuredFields(content: string, entityLabel: string): Record<string, string> {
  const fields: Record<string, string> = {}
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean)

  // Try markdown **Key**: Value format first
  for (const line of lines) {
    const m = line.match(/\*\*([^*:]{2,40})\*\*\s*:?\s*(.{2,150})/)
    if (!m) continue
    const key = m[1].trim()
    const val = m[2].replace(/\*\*/g, '').trim()
    if (!key.includes('#') && val.length < 200) fields[key] = val
  }
  if (Object.keys(fields).length >= 3) return fields

  // Fallback: prose extraction
  const SKIP_CAPS = /BIBLIOTECA|OFICIAL|PRODIGIOS|VERSIÓN|CONFIDENCIAL|DOCUMENTO|INTERNO|USO\s/i
  const capsLine = lines.find(l => /^[A-ZÁÉÍÓÚÜÑ\s"]{4,}$/.test(l) && l.length < 60 && !SKIP_CAPS.test(l))
  fields['Nombre completo'] = capsLine?.trim() ?? entityLabel

  const codeMatch = content.match(/LP-[A-Z]{1,4}-\d+/)
  if (codeMatch) fields['Código'] = codeMatch[0]

  const ageMatch = content.match(/tiene\s+(\w+)\s+años|(\d{1,2})\s+años/i)
  if (ageMatch) {
    const raw = ageMatch[1] ?? ageMatch[2]
    const wordMap: Record<string, string> = {
      quince: '15', catorce: '14', trece: '13', doce: '12',
      dieciséis: '16', diecisiete: '17', dieciocho: '18',
    }
    fields['Edad'] = wordMap[raw?.toLowerCase()] ? `${wordMap[raw.toLowerCase()]} años` : `${raw} años`
  }

  const heightMatch = content.match(/(?:entre\s+)?(1[,.]?\d{2})(?:\s+y\s+(1[,.]?\d{2}))?\s+metros/i)
  if (heightMatch) {
    fields['Estatura'] = heightMatch[2]
      ? `${heightMatch[1]}–${heightMatch[2]} m`
      : `${heightMatch[1]} m`
  }

  const natMatch = content.match(/es\s+(chileno|argentino|mexicano|colombiano|venezolano|peruano|ecuatoriano|boliviano|uruguayo|paraguayo|brasileño)/i)
  if (natMatch) fields['Nacionalidad'] = natMatch[1].charAt(0).toUpperCase() + natMatch[1].slice(1)

  const hairMatch = content.match(/pelo\s+([^.,;]{5,80})/i) ?? content.match(/cabello\s+([^.,;]{5,80})/i)
  if (hairMatch) fields['Pelo'] = hairMatch[1].trim()

  const eyeMatch = content.match(/ojos\s+(cafés|marrones|verdes|azules|negros|grises|castaños|claros|oscuros)[^.,;]{0,30}/i)
  if (eyeMatch) fields['Ojos'] = eyeMatch[0].replace(/^ojos\s+/i, '').trim()

  const buildMatch = content.match(/contextura\s+([^.,]{5,50})/i)
  if (buildMatch) fields['Complexión'] = buildMatch[1].trim()

  return fields
}

// ── Outfit-related term detection ─────────────────────────────────────────────

const OUTFIT_TERMS = [
  'uniforme', 'outfit', 'vestimenta', 'ropa', 'indumentaria',
  'camiseta', 'short', 'calzado', 'zapatillas', 'deportivo',
]

// ── Main assembler ────────────────────────────────────────────────────────────

export async function assembleEntityContext(
  supabase: ReturnType<typeof createServerClient>,
  entity_name: string,
  entity_label: string,
  outfit?: string | null
): Promise<EntityContext> {

  const entityKeywords = buildEntityKeywords(entity_name, entity_label)
  const outfitKeywords = outfit
    ? normalize(outfit).split(/\s+/).filter(w => w.length > 3)
    : []
  const allKeywords = [...entityKeywords, ...outfitKeywords]

  // ── 1. Full-text search via tsvector ──────────────────────────────────────
  const searchQuery = allKeywords.join(' OR ')
  let docs: Array<{ id: string; title: string; content: string }> = []

  if (searchQuery.trim()) {
    const { data: tsResults } = await supabase
      .from('reference_docs')
      .select('id, title, content')
      .textSearch('search_vector', searchQuery, { type: 'websearch', config: 'simple' })
      .not('content', 'is', null)
      .limit(8)

    if (tsResults?.length) {
      docs = tsResults
    }
  }

  // ── 2. Fallback: client-side scoring ──────────────────────────────────────
  if (!docs.length) {
    const { data: allDocs } = await supabase
      .from('reference_docs')
      .select('id, title, content')
      .not('content', 'is', null)

    if (allDocs?.length) {
      const scored = allDocs.map(d => {
        const t = normalize(d.title)
        const snippet = normalize((d.content ?? '').substring(0, 3000))
        const score =
          entityKeywords.filter(kw => t.includes(kw)).length * 3 +
          allKeywords.filter(kw => snippet.includes(kw)).length
        return { d, score }
      }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 8)

      docs = scored.map(x => x.d)
    }
  }

  if (!docs.length) {
    return { structured_fields: {}, entity_context: '', outfit_excerpt: null, docs_used: [] }
  }

  // ── 3. Re-rank: entity title hits first, then outfit hits ─────────────────
  const ranked = docs.map(d => {
    const t = normalize(d.title)
    const entityTitleHits = entityKeywords.filter(kw => t.includes(kw)).length
    const outfitTitleHits = [...outfitKeywords, ...OUTFIT_TERMS].filter(kw => t.includes(kw)).length
    return { d, entityTitleHits, outfitTitleHits }
  }).sort((a, b) =>
    b.entityTitleHits - a.entityTitleHits ||
    b.outfitTitleHits - a.outfitTitleHits
  )

  // ── 4. Parse structured fields from top profile doc ───────────────────────
  const profileDoc = ranked[0]?.d
  const structured_fields = profileDoc
    ? parseStructuredFields(profileDoc.content, entity_label)
    : {}

  // ── 5. Assemble context text (6000 chars total, 1500 per doc) ─────────────
  const contextParts: string[] = []
  const docs_used: Array<{ id: string; title: string }> = []
  let totalChars = 0
  const MAX_TOTAL = 6000
  const MAX_PER_DOC = 1500

  for (const { d } of ranked) {
    if (totalChars >= MAX_TOTAL) break
    const cap = Math.min(MAX_PER_DOC, MAX_TOTAL - totalChars)
    const excerpt = extractRelevantParagraphs(d.content, allKeywords, cap)
    if (!excerpt) continue
    contextParts.push(`### ${d.title}\n${excerpt}`)
    docs_used.push({ id: d.id, title: d.title })
    totalChars += excerpt.length + d.title.length + 10
  }

  // ── 6. Outfit-specific excerpt ────────────────────────────────────────────
  let outfit_excerpt: string | null = null
  if (outfit && outfitKeywords.length > 0) {
    const outfitDoc = ranked
      .filter(({ d }) => {
        const t = normalize(d.title)
        return OUTFIT_TERMS.some(term => t.includes(term)) ||
               outfitKeywords.some(kw => t.includes(kw))
      })
      .sort((a, b) => b.outfitTitleHits - a.outfitTitleHits)[0]?.d

    if (outfitDoc) {
      const excerpt = extractRelevantParagraphs(
        outfitDoc.content,
        [...outfitKeywords, ...OUTFIT_TERMS],
        2500
      )
      if (excerpt.length > 50) {
        outfit_excerpt = `[Fuente: ${outfitDoc.title}]\n${excerpt}`
      }
    }
  }

  return {
    structured_fields,
    entity_context: contextParts.join('\n\n---\n\n'),
    outfit_excerpt,
    docs_used,
  }
}
