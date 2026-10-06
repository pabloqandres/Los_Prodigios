import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { assembleEntityContext } from '@/lib/doc-context'

export const runtime = 'nodejs'

function normalize(s: string): string {
  return s
    .normalize('NFC').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ').trim()
}

// Extract key fields from plain-text profile docs (mammoth output from .docx)
function parseProseProfile(content: string, entityLabel: string): Record<string, string> {
  const fields: Record<string, string> = {}
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean)

  // ── Try markdown-style **Key**: Value first ─────────────────────────────────
  for (const line of lines) {
    const m = line.match(/\*\*([^*:]{2,40})\*\*\s*:?\s*(.{2,150})/)
    if (!m) continue
    const key = m[1].trim()
    const val = m[2].replace(/\*\*/g, '').trim()
    if (!key.includes('#') && val.length < 200) fields[key] = val
  }

  if (Object.keys(fields).length >= 3) return fields

  // ── Fallback: extract from prose ───────────────────────────────────────────
  const fullText = content

  // Name: first all-caps line that is NOT a generic org header
  const SKIP_CAPS = /BIBLIOTECA|OFICIAL|PRODIGIOS|VERSIÓN|CONFIDENCIAL|DOCUMENTO|INTERNO|USO\s/i
  const capsLine = lines.find(l => /^[A-ZÁÉÍÓÚÜÑ\s"]{4,}$/.test(l) && l.length < 60 && !SKIP_CAPS.test(l))
  if (capsLine) fields['Nombre completo'] = capsLine.trim()
  else fields['Nombre completo'] = entityLabel

  // Doc code (LP-FP-XX pattern)
  const codeMatch = fullText.match(/LP-[A-Z]{1,4}-\d+/)
  if (codeMatch) fields['Código'] = codeMatch[0]

  // Age — "tiene X años" or "X años"
  const ageMatch = fullText.match(/tiene\s+(\w+)\s+años|(\d{1,2})\s+años/i)
  if (ageMatch) {
    const raw = ageMatch[1] || ageMatch[2]
    // Convert word numbers
    const wordMap: Record<string, string> = { quince: '15', catorce: '14', trece: '13', doce: '12', dieciséis: '16', diecisiete: '17' }
    fields['Edad'] = wordMap[raw.toLowerCase()] ? `${wordMap[raw.toLowerCase()]} años` : `${raw} años`
  }

  // Height — "1,6X metros" or "entre 1,6X y 1,7X"
  const heightMatch = fullText.match(/(?:entre\s+)?(1[,\.]\d{2})(?:\s+y\s+(1[,\.]\d{2}))?\s+metros/i)
  if (heightMatch) {
    fields['Estatura'] = heightMatch[2]
      ? `${heightMatch[1]}–${heightMatch[2]} m`
      : `${heightMatch[1]} m`
  }

  // Nationality/origin
  const natMatch = fullText.match(/es\s+(chileno|argentino|mexicano|colombiano|venezolano|peruano|ecuatoriano|boliviano|uruguayo|paraguayo|brasileño)/i)
  if (natMatch) fields['Nacionalidad'] = natMatch[1].charAt(0).toUpperCase() + natMatch[1].slice(1)

  // Position / role
  const posMatch = fullText.match(/[Jj]uega\s+como\s+([^.]{5,60}?)(?:\s+y\s+es|\s*\.|,)/i)
  if (posMatch) fields['Posición'] = posMatch[1].trim()

  const rolMatch = fullText.match(/(?:es el|como)\s+(protagonista|antagonista|capitán|portero|entrenador|árbitro)[^.]{0,40}/i)
  if (rolMatch) fields['Rol'] = rolMatch[0].replace(/^(?:es el|como)\s+/i, '').replace(/[.,].*$/, '').trim()

  // Body build
  const buildMatch = fullText.match(/contextura\s+([^.,]{5,50})/i)
  if (buildMatch) fields['Complexión'] = buildMatch[1].trim()

  // Hair
  const hairMatch = fullText.match(/pelo\s+([^.,;]{5,80})/i) || fullText.match(/cabello\s+([^.,;]{5,80})/i)
  if (hairMatch) fields['Pelo'] = hairMatch[1].trim()

  // Eyes
  const eyeMatch = fullText.match(/ojos\s+(cafés|marrones|verdes|azules|negros|grises|castaños|claros|oscuros)[^.,;]{0,30}/i)
  if (eyeMatch) fields['Ojos'] = eyeMatch[0].replace(/^ojos\s+/i, '').trim()

  // Skin
  const skinMatch = fullText.match(/[Pp]iel\s+([^.,;]{5,60})/)
  if (skinMatch) fields['Piel'] = skinMatch[1].trim()

  // First sentence of section 1 as role description
  const sec1 = fullText.match(/1\.\s+Identidad[^\n]*\n+([\s\S]{30,300}?)(?:\n\n|\n\d\.)/i)
  if (sec1) {
    const firstSentence = sec1[1].split(/\.\s+/)[0].trim()
    if (firstSentence.length > 20) fields['Descripción'] = firstSentence + '.'
  }

  return fields
}

// GET /api/assets/entity-doc?entity_name=MateoGonzalez&entity_label=Mateo+González
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entity_name  = request.nextUrl.searchParams.get('entity_name') ?? ''
  const entity_label = request.nextUrl.searchParams.get('entity_label') ?? ''

  if (!entity_name && !entity_label) {
    return NextResponse.json({ error: 'entity_name or entity_label required' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Use assembleEntityContext for full-text search across all doc content
  const context = await assembleEntityContext(supabase, entity_name, entity_label)

  if (!context.docs_used.length) {
    // Fallback debug info using old title-only approach
    const { data: list } = await supabase.from('reference_docs').select('id, title').order('title')
    const labelWords = normalize(entity_label).split(/\s+/).filter(w => w.length > 2)
    const nameWords  = entity_name.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).map(normalize).filter(w => w.length > 2)
    const keywords   = [...new Set([...labelWords, ...nameWords])]
    const titles = (list ?? []).map((d: { id: string; title: string }) => ({ id: d.id, norm: normalize(d.title) }))
    return NextResponse.json({
      match: null,
      fields: {},
      debug: { keywords, titles: titles.slice(0, 10) },
    })
  }

  const bestDoc = context.docs_used[0]
  return NextResponse.json({
    match: { id: bestDoc.id, title: bestDoc.title },
    fields: context.structured_fields,
    docs_used: context.docs_used,
  })
}
