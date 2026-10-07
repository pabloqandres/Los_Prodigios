import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_CONTEXTS } from '@/lib/contexts'
import { createServerClient } from '@/lib/supabase'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  context: string
  userEmail?: string
}


async function fetchContinuityModules(): Promise<string> {
  try {
    const supabase = createServerClient()
    const { data: modules, error } = await supabase
      .from('continuity_modules')
      .select('module_key, content, updated_at')
      .order('module_key', { ascending: true })

    if (error || !modules || modules.length === 0) return ''

    let section = '\n\n---\n## SISTEMA DE CONTINUIDAD — ESTADO ACTUAL DE LA PRODUCCIÓN\n\n'
    section += '_Datos en tiempo real del sistema de continuidad de la serie._\n\n'

    for (const mod of modules) {
      const content = mod.content
        ? mod.content.substring(0, 8000) + (mod.content.length > 8000 ? '\n\n[... contenido truncado ...]' : '')
        : ''
      section += `### ${mod.module_key}\n`
      if (mod.updated_at) section += `_Actualizado: ${new Date(mod.updated_at).toLocaleDateString('es-CL')}_\n\n`
      if (content) section += `${content}\n`
      section += '\n---\n\n'
    }

    return section
  } catch {
    return ''
  }
}

async function fetchApprovedAssets(context: string): Promise<string> {
  if (!['arte', 'personajes', 'continuidad', 'general'].includes(context)) return ''
  try {
    const supabase = createServerClient()
    const { data: slots } = await supabase
      .from('asset_slots')
      .select('entity_name, entity_label, category, version_label, approved_drive_file_id')
      .eq('status', 'approved')
      .order('category', { ascending: true })
      .order('entity_name', { ascending: true })
      .limit(200)

    if (!slots || slots.length === 0) return ''

    let section = '\n\n---\n## ASSETS CANÓNICOS APROBADOS — REFERENCIAS VISUALES\n\n'
    section += '_Assets doble-aprobados disponibles como referencia visual. Úsalos en prompts de imagen/video._\n\n'

    const byEntity: Record<string, typeof slots> = {}
    for (const s of slots) {
      if (!byEntity[s.entity_name]) byEntity[s.entity_name] = []
      byEntity[s.entity_name].push(s)
    }

    for (const [, entitySlots] of Object.entries(byEntity)) {
      const label = entitySlots[0].entity_label
      const category = entitySlots[0].category
      section += `**${label}** (${category}):\n`
      for (const s of entitySlots) {
        section += `  - ${s.version_label}: https://drive.google.com/uc?id=${s.approved_drive_file_id}\n`
      }
    }

    section += '\n---\n\n'
    return section
  } catch {
    return ''
  }
}

async function fetchReferenceDocs(_context: string): Promise<string> {
  try {
    const supabase = createServerClient()

    // Cargar TODOS los documentos de la biblioteca siempre —
    // el contexto cambia el rol del asistente, no la información disponible.
    const { data: docs, error } = await supabase
      .from('reference_docs')
      .select('title, description, content, categories')
      .order('title', { ascending: true })
      .limit(50)

    if (error || !docs || docs.length === 0) return ''

    let section = '\n\n---\n## DOCUMENTOS DE REFERENCIA — BIBLIOTECA DE LA SERIE\n\n'
    section += `_${docs.length} documento${docs.length !== 1 ? 's' : ''} cargado${docs.length !== 1 ? 's' : ''} desde la biblioteca._\n\n`

    for (const doc of docs) {
      // Truncar cada doc a 10.000 chars para no exceder el contexto
      const content = doc.content
        ? doc.content.substring(0, 10000) + (doc.content.length > 10000 ? '\n\n[... contenido truncado ...]' : '')
        : ''

      section += `### ${doc.title}\n`
      if (doc.description) section += `_${doc.description}_\n\n`
      if (content) section += `${content}\n`
      section += '\n---\n\n'
    }

    return section
  } catch {
    // Si falla Supabase, el chat sigue funcionando sin docs
    return ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest
    const { messages, context = 'general', userEmail } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(
            'La API de Anthropic no está configurada. Para activar el asistente, añade tu ANTHROPIC_API_KEY en el archivo .env.local y reinicia el servidor.'
          ))
          controller.close()
        },
      })
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
      })
    }

    // Construir system prompt base + documentos + continuidad desde Supabase
    const basePrompt = SYSTEM_CONTEXTS[context] ?? SYSTEM_CONTEXTS.general
    const [referenceDocs, continuityModules, approvedAssets] = await Promise.all([
      fetchReferenceDocs(context),
      fetchContinuityModules(),
      fetchApprovedAssets(context),
    ])
    const systemPrompt = basePrompt + referenceDocs + continuityModules + approvedAssets

    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const anthropic = new Anthropic({ apiKey })

    const anthropicMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: systemPrompt,
            messages: anthropicMessages,
          })

          for await (const chunk of response) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? `Error al comunicarse con la API: ${error.message}`
              : 'Error desconocido al procesar la solicitud.'
          controller.enqueue(encoder.encode(errorMessage))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-User-Email': userEmail ?? 'unknown',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
