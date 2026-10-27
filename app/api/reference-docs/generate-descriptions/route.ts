import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 120

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST /api/reference-docs/generate-descriptions
// Generates a short description for every doc that has none, using Claude.
// Processes up to 5 docs in parallel per batch to stay within timeout.
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  // Fetch docs without a description (null or empty string)
  const { data: docs, error } = await supabase
    .from('reference_docs')
    .select('id, title, categories, content')
    .or('description.is.null,description.eq.')
    .order('title', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!docs || docs.length === 0) return NextResponse.json({ updated: 0, message: 'Todos los documentos ya tienen descripción.' })

  async function generateDescription(doc: { id: string; title: string; categories: string[] | null; content: string | null }): Promise<{ id: string; description: string }> {
    const excerpt = (doc.content ?? '').substring(0, 1500)
    const cats = Array.isArray(doc.categories) ? doc.categories.join(', ') : ''

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: `Eres un archivista de un estudio de animación. Escribe UNA descripción en español de máximo 2 oraciones (máx. 180 caracteres) para el siguiente documento de la biblioteca del estudio. La descripción debe resumir de qué trata el documento y para qué sirve, en tono técnico y directo. No uses comillas. No pongas el título al inicio.

Título: ${doc.title}
Categorías: ${cats || 'sin categoría'}
Contenido (extracto):
${excerpt}

Descripción:`,
      }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    // Strip leading quotes if Claude added them
    const description = raw.replace(/^["«]|["»]$/g, '').trim()
    return { id: doc.id, description }
  }

  // Process in batches of 5 in parallel
  const BATCH_SIZE = 5
  let updated = 0
  const errors: string[] = []

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE)
    const results = await Promise.allSettled(batch.map(generateDescription))

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { id, description } = result.value
        const { error: upErr } = await supabase
          .from('reference_docs')
          .update({ description, updated_at: new Date().toISOString() })
          .eq('id', id)
        if (!upErr) updated++
        else errors.push(id)
      } else {
        errors.push('generation-error')
      }
    }
  }

  return NextResponse.json({
    updated,
    total: docs.length,
    errors: errors.length > 0 ? errors : undefined,
  })
}
