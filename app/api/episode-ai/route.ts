import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { SYSTEM_CONTEXTS } from '@/lib/contexts'

export const runtime = 'nodejs'
export const maxDuration = 60

const IDIOMA = `Responde SIEMPRE en español chileno neutro y profesional. Sin modismos. Tono directo y claro.`

// Workflow prompts — each maps to a specific AI role + instructions
const WORKFLOW_PROMPTS: Record<string, string> = {
  write_script: `Eres el asistente de guión de "Los Prodigios". Tu tarea es ayudar a escribir o mejorar el guión del episodio en formato estándar de animación.

ANTES DE ESCRIBIR — aplica obligatoriamente el Motor de Guión y Protocolo Episodios:
1. Identifica quién es el personaje central del episodio y qué quiere
2. Confirma cuál es el obstáculo genuino (no resoluble con habilidades existentes)
3. Verifica que haya una decisión con costo real que revele carácter
4. Activa al menos 2 de los 5 motores narrativos de la serie
5. Asegúrate de que el episodio pase la "Pregunta Prodigio": ¿por qué SOLO puede existir en Los Prodigios?

Aplica también las 14 prohibiciones del Motor de Guión. Si detectas una violación, señálala y corrígela.

Formato de guión que debes usar:
- Encabezados de escena: INT./EXT. LOCACIÓN — MOMENTO DEL DÍA (en mayúsculas)
- Acotaciones: en minúsculas, describen la acción
- Personaje: centrado, en mayúsculas antes del diálogo
- Diálogo: indentado bajo el nombre del personaje
- Paréntesis de acotación: (entre paréntesis, en minúsculas) justo bajo el nombre

Siempre basa los personajes y locaciones en la información canónica de la serie.
${IDIOMA}`,

  review_continuity: `Eres el Supervisor de Continuidad de "Los Prodigios". Tu tarea es revisar el guión o las escenas del episodio y detectar:
1. Inconsistencias con el canon establecido (personajes, locaciones, poderes, relaciones)
2. Contradicciones con episodios anteriores (según el sistema de continuidad)
3. Promesas narrativas sembradas que deben seguirse
4. Errores de lógica interna del episodio

Sé meticuloso. Señala EXPLÍCITAMENTE cada inconsistencia con referencia al documento canónico.
${IDIOMA}`,

  improve_dialogue: `Eres el especialista en diálogos de "Los Prodigios". Tu tarea es mejorar los diálogos del episodio:
1. Cada personaje debe hablar con su voz única según su ficha canónica
2. Los diálogos deben sonar naturales para animación (evitar exposición forzada)
3. Mantén la economía de palabras — en animación cada línea cuesta tiempo de animación
4. Sugiere mejoras específicas, no reescrituras completas sin justificación.
${IDIOMA}`,

  breakdown: `Eres el coordinador de producción de "Los Prodigios". Tu tarea es hacer el breakdown del guión:
Extrae y organiza:
- Lista de escenas con: número, locación, personajes presentes, props necesarios, tiempo estimado
- Lista de personajes del episodio (quiénes aparecen)
- Lista de locaciones (cuántas veces se usa cada una)
- Props o elementos especiales que requieren diseño

Responde en formato estructurado claro, organizado para que el equipo de producción pueda trabajar con él.
${IDIOMA}`,

  generate_scenes: `Eres el story editor de "Los Prodigios". A partir del logline, sinopsis o descripción del episodio, propón una estructura de escenas.

ANTES DE PROPONER ESCENAS — aplica el Motor de Guión:
- Las 5 claves del capítulo deben estar presentes: premisa en una frase, personaje central emocional, obstáculo genuino, decisión con costo, consecuencia real
- Activa al menos 2 de los 5 motores narrativos
- El episodio debe pasar la "Pregunta Prodigio" (¿por qué SOLO puede existir en Los Prodigios?)
- Los adultos no resuelven el conflicto central; los personajes jóvenes deben hacerlo

Para cada escena proporciona:
- Título corto
- Descripción de la acción (2-3 oraciones)
- Personajes presentes
- Locación sugerida
- Duración estimada en segundos
- Tono/mood de la escena

Responde en JSON válido con esta estructura:
{"scenes": [{"title": "", "description": "", "characters": [], "location": "", "duration_est": 0, "mood": ""}]}
${IDIOMA}`,

  analyze_continuity: `Eres el Supervisor de Continuidad de "Los Prodigios". Analiza el episodio completo y genera un log de cambios canónicos para actualizar el sistema de continuidad.

Para cada cambio detectado, indica:
- Tipo: character_change | location_change | canon_fact | narrative_promise | issue
- Entidad afectada (personaje/locación/prop)
- Descripción exacta del cambio o hecho nuevo

Responde en JSON válido:
{"changes": [{"type": "", "entity": "", "description": ""}]}
${IDIOMA}`,
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, episodeId, prompt: userPrompt, stream: useStream = true } = await request.json()

  if (!action || !WORKFLOW_PROMPTS[action]) {
    return NextResponse.json({ error: 'action inválida' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Load episode context
  let episodeContext = ''
  if (episodeId) {
    const { data: ep } = await supabase.from('episodes').select('*').eq('id', episodeId).single()
    if (ep) {
      episodeContext = `\n\n## EPISODIO ACTUAL\n`
      episodeContext += `Código: T${ep.season}E${String(ep.episode_number).padStart(2, '0')}\n`
      if (ep.title) episodeContext += `Título: ${ep.title}\n`
      if (ep.logline) episodeContext += `Logline: ${ep.logline}\n`
      if (ep.synopsis) episodeContext += `Sinopsis: ${ep.synopsis}\n`
      if (ep.theme) episodeContext += `Tema: ${ep.theme}\n`
      if (ep.cold_open) episodeContext += `Cold Open: ${ep.cold_open}\n`
      if (ep.script) episodeContext += `\n### GUIÓN ACTUAL:\n${ep.script.substring(0, 20000)}\n`
    }
  }

  // Load reference docs — priority: episode writing frameworks first, then canon
  let referenceDocs = ''
  try {
    // 1. Episode writing frameworks — loaded first, full content, marked as mandatory
    const { data: frameworkDocs } = await supabase
      .from('reference_docs')
      .select('title, content')
      .or('title.ilike.%Motor de Guión%,title.ilike.%Apertura Narrativa%,title.ilike.%LP-G01%')
      .limit(5)

    if (frameworkDocs && frameworkDocs.length > 0) {
      referenceDocs += '\n\n## FRAMEWORKS DE ESCRITURA EPISÓDICA — APLICAR SIEMPRE\n'
      referenceDocs += '> Estos documentos definen el protocolo obligatorio de escritura. Antes de generar cualquier contenido episódico, interioriza y aplica estos frameworks.\n\n'
      for (const doc of frameworkDocs) {
        const content = doc.content ? doc.content.substring(0, 15000) : ''
        referenceDocs += `### ${doc.title}\n${content}\n\n---\n\n`
      }
    }

    // 2. Rest of canon docs (exclude frameworks already loaded)
    const frameworkTitles = frameworkDocs?.map(d => d.title) ?? []
    const { data: canonDocs } = await supabase
      .from('reference_docs')
      .select('title, content, categories')
      .not('title', 'in', `(${frameworkTitles.map(t => `"${t}"`).join(',')})`)
      .order('title')
      .limit(25)

    if (canonDocs && canonDocs.length > 0) {
      referenceDocs += '\n\n## DOCUMENTOS CANÓNICOS DE LA SERIE\n\n'
      for (const doc of canonDocs) {
        const content = doc.content ? doc.content.substring(0, 5000) : ''
        referenceDocs += `### ${doc.title}\n${content}\n\n---\n\n`
      }
    }
  } catch { /* continue */ }

  const systemPrompt = (SYSTEM_CONTEXTS['guion'] ?? SYSTEM_CONTEXTS['general'])
    + '\n\n' + WORKFLOW_PROMPTS[action]
    + episodeContext
    + referenceDocs

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 500 })

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey })

  // For structured actions (generate_scenes, analyze_continuity) return JSON directly
  if (!useStream || action === 'generate_scenes' || action === 'analyze_continuity') {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt || 'Analiza el episodio y responde.' }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    // Try to extract JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) return NextResponse.json({ result: JSON.parse(jsonMatch[0]), raw: text })
    } catch { /* fall through */ }
    return NextResponse.json({ result: null, raw: text })
  }

  // Streaming response for chat-like workflows
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 8096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt || 'Ayúdame con este episodio.' }],
        })
        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        controller.enqueue(encoder.encode(`Error: ${msg}`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  })
}
