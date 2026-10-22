import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const supabase = createServerClient()

  const { data: episode } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, script')
    .eq('id', episodeId)
    .single()

  if (!episode?.script || episode.script.trim().length < 50) {
    return NextResponse.json({ error: 'No hay guión para analizar' }, { status: 400 })
  }

  const scriptText = episode.script.substring(0, 15000)
  const episodeLabel = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}${episode.title ? ` — ${episode.title}` : ''}`

  const systemPrompt = `Eres el story editor de "Los Prodigios", serie animada latinoamericana de fútbol y coming-of-age.
Tu tarea es leer el guión de un episodio y extraer sus metadatos narrativos clave.
Responde SOLO con JSON válido. Sin texto adicional, sin markdown, sin bloques de código.`

  const userPrompt = `Episodio: ${episodeLabel}

## GUIÓN:
${scriptText}

---

Lee el guión completo y extrae exactamente este JSON:
{
  "logline": "Una oración que resume el conflicto central del episodio (máx 120 caracteres)",
  "synopsis": "Resumen narrativo de 3-4 oraciones que describe el arco del episodio. Qué quiere el protagonista, qué obstáculo enfrenta, cómo lo resuelve.",
  "theme": "El tema central que explora este episodio (ej: 'El miedo a decepcionar a tu padre', 'Confiar en el equipo aunque te fallen')",
  "cold_open": "Descripción de lo que ocurre antes de los créditos de apertura (si aplica, si no hay escribe null)",
  "tag": "Descripción del cierre o gancho post-créditos (si aplica, si no hay escribe null)"
}`

  let raw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })
    raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Error al contactar Claude' }, { status: 500 })
  }

  let metadata: { logline: string; synopsis: string; theme: string; cold_open: string | null; tag: string | null }
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    metadata = JSON.parse(match ? match[0] : cleaned)
  } catch {
    return NextResponse.json({ error: 'No se pudo interpretar la respuesta', raw }, { status: 500 })
  }

  // Save to DB
  const patch: Record<string, string | null> = {}
  if (metadata.logline) patch.logline = metadata.logline
  if (metadata.synopsis) patch.synopsis = metadata.synopsis
  if (metadata.theme) patch.theme = metadata.theme
  if (metadata.cold_open !== undefined) patch.cold_open = metadata.cold_open
  if (metadata.tag !== undefined) patch.tag = metadata.tag

  await supabase
    .from('episodes')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', episodeId)

  return NextResponse.json(metadata)
}
