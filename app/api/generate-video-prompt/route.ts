import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { SYSTEM_CONTEXTS } from '@/lib/contexts'

const VIDEO_SYSTEM_EXTENSION = `

Eres un director de fotografía y prompt engineer especializado en generación de video con IA. Genera prompts de video con INTENCIÓN CINEMATOGRÁFICA real. Vocabulario de DP: motivated light, practical source, rim light, depth separation, motivated camera movement. NUNCA uses: beautiful, stunning, amazing, breathtaking. Cada prompt debe ser DENSO — cada palabra gana su lugar. Test de densidad: si una palabra puede eliminarse sin perder información, elimínala.

Si se proporciona una imagen de referencia, analízala primero y extrae: qué personaje(s) aparecen, ropa exacta y colores, entorno y ambiente tal como aparece en la imagen, iluminación existente, postura y energía. Usa ese análisis como base del prompt. NO asumas región geográfica ni cultura — describe solo lo que ves o lo que dice el documento canónico.

KLING AI (máx 500 chars): keywords compactas separadas por comas. Orden: subject → action → shot type → camera movement → lighting → style → mood → negative prompt
RUNWAY Gen-4 (máx 300 chars): ultra-compacto, solo lo más impactante: action + camera + light
SORA (máx 800 chars): prosa narrativa corta con arco temporal (inicio → clímax → cierre), vocabulario cinematográfico
ARTLIST MinMaxH3 (máx 2000 chars con espacios): el más completo. Descripción cinematográfica en inglés con: personaje detallado (rasgos, ropa, accesorios exactos), acción específica con física realista, entorno tal como lo describe el documento canónico o la imagen de referencia (NO asumir región geográfica — describir lo que está en el documento o la imagen), iluminación técnica (fuente, dirección, temperatura, sombras), movimiento de cámara con motivación dramática, extras y fondo, estilo visual y color grading, mood y arco emocional del clip. Usa vocabulario de director de fotografía real. Incluir negative prompt al final.

REGLA ANTI-MORPHING (aplicar en TODOS los prompts): Si la escena incluye objetos con forma definida (pelotas, balones, objetos esféricos, props con geometría específica), aplicar estas técnicas en el prompt:
1. Describir el objeto con geometría estricta: "perfectly spherical ball, rigid shape, no deformation" — nunca solo "ball"
2. Anclar el objeto a una acción física concreta y breve: "ball mid-arc, caught at peak of trajectory" en lugar de movimiento continuo
3. En el negative prompt incluir SIEMPRE: "ball morphing, object deformation, shape distortion, melting objects, non-euclidean geometry, fluid objects"
4. Para Kling específicamente: preferir que el objeto esté estático o con movimiento muy acotado (una sola dirección, sin trayectoria compleja)
5. Si hay pelota de fútbol: especificar "classic black-and-white soccer ball, hexagonal pattern clearly visible, rigid sphere"`

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const {
    platform,
    sceneType,
    referenceImageUrl,
    referenceImageB64,
    shotType,
    cameraMovement,
    lightingTime,
    lightingType,
    lightingTemp,
    visualStyle,
    extras,
    extrasType,
    bgDetail,
    duration,
    speed,
    mood,
    entityDocId,
    entityTitle,
    sceneDescription,
  } = await request.json()

  // Fetch entity canonical content from reference_docs
  let entityContent = ''
  if (entityDocId) {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('reference_docs')
      .select('content')
      .eq('id', entityDocId)
      .single()
    if (data?.content) {
      entityContent = data.content.substring(0, 8000)
      if (data.content.length > 8000) entityContent += '\n\n[... contenido truncado ...]'
    }
  }

  const imageNote = referenceImageUrl
    ? `\n- Imagen de referencia: ${referenceImageUrl} (analiza esta imagen para extraer todos los detalles visuales del personaje y entorno)`
    : referenceImageB64
    ? `\n- Imagen de referencia: adjunta como base64 (analiza esta imagen cuidadosamente — extrae personaje, ropa, entorno, luz, postura)`
    : ''

  const platformInstructions: Record<string, { tag: string; limit: number; instruction: string }> = {
    kling:   { tag: 'KLING',   limit: 500,  instruction: 'KLING AI (máx 500 chars): keywords compactas separadas por comas. Orden: subject → action → shot type → camera movement → lighting → style → mood → negative prompt' },
    runway:  { tag: 'RUNWAY',  limit: 300,  instruction: 'RUNWAY Gen-4 (máx 300 chars): ultra-compacto, solo lo más impactante: action + camera + light' },
    sora:    { tag: 'SORA',    limit: 800,  instruction: 'SORA (máx 800 chars): prosa narrativa corta con arco temporal (inicio → clímax → cierre), vocabulario cinematográfico' },
    artlist: { tag: 'ARTLIST', limit: 2000, instruction: 'ARTLIST MinMaxH3 (máx 2000 chars con espacios): el más completo. Descripción cinematográfica en inglés con: personaje detallado (rasgos, ropa, accesorios exactos), acción específica con física realista, entorno tal como lo describe el documento canónico o la imagen de referencia, iluminación técnica (fuente, dirección, temperatura, sombras), movimiento de cámara con motivación dramática, extras y fondo, estilo visual y color grading, mood y arco emocional del clip. Incluir negative prompt al final.' },
  }

  const activePlatform = platformInstructions[platform] ?? platformInstructions['kling']

  const userMessage = `Genera UN prompt de video para ${activePlatform.tag}.${referenceImageB64 ? '\n\nANALIZA LA IMAGEN ADJUNTA PRIMERO: extrae personaje (rasgos, ropa, accesorios exactos), entorno (espacio, materiales, detalles), iluminación existente, postura y energía. Usa ese análisis como base del prompt.' : ''}

PARÁMETROS DE LA ESCENA:
- Tipo de escena: ${sceneType || 'No especificado'}
- Plano: ${shotType || 'No especificado'}
- Movimiento de cámara: ${cameraMovement || 'No especificado'}
- Hora del día: ${lightingTime || 'No especificado'}
- Tipo de iluminación: ${lightingType || 'No especificado'}
- Temperatura de color: ${lightingTemp || 'No especificado'}
- Estilo visual: ${visualStyle || 'No especificado'}
- Extras en escena: ${extras || 'Sin extras'}${extrasType ? ` — tipo: ${extrasType}` : ''}
- Detalle del fondo: ${bgDetail || 'No especificado'}
- Duración objetivo: ${duration || 'No especificado'}
- Velocidad: ${speed || 'Normal'}
- Mood: ${mood || 'No especificado'}${entityTitle ? `\n- Personaje / entidad: ${entityTitle}` : ''}${imageNote}${sceneDescription ? `\n\nDESCRIPCIÓN NARRATIVA DE LA ESCENA:\n${sceneDescription}` : ''}${entityContent ? `\n\nINFORMACIÓN CANÓNICA DEL PERSONAJE/ENTIDAD:\n${entityContent}` : ''}

INSTRUCCIÓN DE PLATAFORMA: ${activePlatform.instruction}

Genera SOLO el prompt, sin bloques ni marcadores, respetando estrictamente el límite de ${activePlatform.limit} caracteres. Entrega únicamente el texto del prompt, nada más.`

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 500 })
  }

  const systemPrompt = (SYSTEM_CONTEXTS['arte'] ?? SYSTEM_CONTEXTS['general']) + VIDEO_SYSTEM_EXTENSION

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageContent: any[] = referenceImageB64
          ? [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: referenceImageB64 } },
              { type: 'text', text: userMessage },
            ]
          : [{ type: 'text', text: userMessage }]

        const response = await anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: messageContent }],
        })
        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      } catch (error) {
        const msg = error instanceof Error ? `Error: ${error.message}` : 'Error desconocido'
        controller.enqueue(encoder.encode(msg))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  })
}
