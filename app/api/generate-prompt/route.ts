import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { SYSTEM_CONTEXTS } from '@/lib/contexts'

const ARTWORK_WORKFLOW_TEMPLATES: Record<string, string> = {
  'Ficha técnica de personaje': `Vista frontal completa (cuerpo entero, pose neutra). Vista de 3/4 (ángulo canónico). Vista posterior. Detalle de cara: frontal y perfil. Hoja de proporciones con guías de cabeza. Paleta de color oficial con valores HEX: piel, cabello, ropa primaria, ropa secundaria, accesorios. Notas de textura y acabados. Variantes de expresión facial: neutral, alegre, enojado, triste. Detalles de manos, calzado y accesorios clave. Notas de continuidad: elementos invariables entre escenas.`,
  'Concept Art': `Ilustración principal de alta resolución con el concepto central. 2-3 variaciones de diseño (paleta alternativa, composición diferente o variación de contexto). Estudio de iluminación: versión diurna y nocturna/dramática. Notas de ambiente y mood (temperatura de color, contraste, saturación). Referencias de textura de fondo y materiales. Escala relativa si hay personajes presentes. Bocetos de exploración conceptual (thumbnails) como soporte.`,
  'Artwork escenográfico': `Plano general del escenario completo (establishing shot). Vistas ortogonales: frontal, lateral, planta si aplica. Detalle de zonas de interés: elementos narrativos clave, props integrados al set. Paleta de color del ambiente: tonos dominantes, secundarios, acentos. Guía de iluminación: fuentes, dirección, temperatura y sombras. Variante de estado: limpio/habitado/deteriorado según el punto de la historia. Escala humana de referencia usando silueta de personaje estándar.`,
  'Diseño de interior': `Vista de perspectiva a 3/4 del interior completo. Plano de planta con distribución de muebles y elementos. Elevaciones de las paredes principales (mínimo 2). Paleta de materiales: paredes, pisos, mobiliario, textiles, iluminación. Detalles de mobiliario y decoración clave (estilo, época, condición). Iluminación: fuentes naturales y artificiales, hora del día de referencia. Props decorativos que refuercen la caracterización del habitante. Notas sobre el estado del interior.`,
  'Prop Sheet': `Vista ortogonal de cada cara: frontal, lateral, superior, posterior. Escala de referencia junto a mano humana o personaje. Detalle de materiales y acabados superficiales (mate, brillante, desgaste, reflejo). Paleta de color: colores base y variaciones por material. Estado de conservación: nuevo/usado/desgastado/roto según el punto narrativo. Variantes funcionales si el prop cambia de forma en la historia. Notas de animación: puntos de articulación, partes móviles. Tamaño aproximado relativo a personaje.`,
  'Creature Sheet': `Vista de perfil completo (lado izquierdo canónico). Vista frontal y posterior. Detalle anatómico de partes clave: cabeza, extremidades, apéndices especiales. Proporciones comparativas con humano adulto estándar. Paleta de color: piel/escamas/pelaje, marcas, ojos, interior de boca. Variantes de estado: reposo, alerta, ataque, herido. Locomotión: pose de caminar/volar/nadar según corresponda. Expresiones o señales de comunicación. Notas de anatomía relevantes para la animación.`,
  'Escena cinematográfica': `INSTRUCCIÓN PRINCIPAL: Genera un prompt en inglés para crear UNA SOLA IMAGEN cinematográfica de alta calidad que capture un momento narrativo específico de la serie. Esta imagen NO es un reference sheet — es una ilustración de escena con intención emocional y visual completa.\n\nESTILO VISUAL OBLIGATORIO:\nCinematic cel-shading: warm-toned, 3-4 shadow tones with hard edges (no gradients), bold clean outlines, shallow depth of field (protagonist sharp, background softly rendered but detailed). Lighting: directional golden-hour or dramatic side-lighting that unifies the entire scene. Latin American animation aesthetic — NOT Japanese anime. Rich environmental storytelling: worn surfaces, graffiti, dust, chain-link fences, concrete — details that communicate social and geographic context without labeling it.\n\nEXTRACCIÓN OBLIGATORIA DEL DOCUMENTO CANÓNICO:\n1. Si el documento es de personaje: extraer rasgos físicos canónicos (piel, cabello, ojos, ropa), edad en la escena, energía visual del personaje. Aplicar al personaje principal de la escena.\n2. Si el documento es de locación: extraer arquitectura, materiales, paleta de colores, hora del día preferida de la locación, estado de conservación.\n3. Si el documento es de ambos: integrar personaje EN la locación, comunicar la relación del personaje con ese espacio.\n\nELEMENTOS DE COMPOSICIÓN (extraer del contexto narrativo si está disponible, o derivar del documento):\n- ENCUADRE: especificar tipo de plano (close-up / medium shot / full shot / establishing) y ángulo (eye-level / low angle / high angle / dutch tilt)\n- ACCIÓN: describir qué está haciendo el personaje en este preciso momento — no pose neutral, sino un instante de acción o emoción real\n- ILUMINACIÓN: hora del día, dirección de la luz, temperatura de color dominante (golden hour warm, overcast cool, artificial night, etc.)\n- PROFUNDIDAD: qué está en primer plano nítido, qué está en el fondo difuminado pero detallado\n- ESTADO EMOCIONAL: el mood de la escena — qué siente el personaje, qué atmósfera tiene el espacio\n- ENTORNO LATINOAMERICANO: especificar detalles visuales del entorno que anclen la escena geográfica y culturalmente sin caer en estereotipo\n\nFORMATO TÉCNICO:\n- Relación de aspecto: 16:9 panorámico (landscape)\n- Resolución: 4096x2304px o equivalente\n- Sin texto, sin watermarks, sin etiquetas en la imagen\n- Calidad de producción: image board de animación, no boceto\n\nNEGATIVE PROMPT obligatorio: include — anime style, Japanese animation conventions, manga shading, large sparkle eyes, speed lines, photorealism, 3D render, watercolor, sketch aesthetic, multiple panels, reference sheet layout, white background, text overlays, labels, soft gradient shading, airbrush, Western comic halftone.`,
  'Reference Sheet — Personaje': `INSTRUCCIÓN PRINCIPAL: Genera un prompt en inglés para crear UNA SOLA IMAGEN de alta resolución (4096x4096px mínimo) con TODAS las vistas del personaje en un reference sheet profesional.\n\nLAYOUT:\n- Fondo blanco puro (RGB 255,255,255), sin sombras, sin ambiente\n- Cada vista separada mínimo 80px entre sí, con margen para cortar en Photoshop\n- Título en la parte superior: "[NOMBRE] — CHARACTER REFERENCE SHEET | LOS PRODIGIOS"\n- Cada vista etiquetada en español debajo (sans-serif pequeño)\n- Línea de referencia de altura implícita (invisible): todas las figuras comparten la misma escala cabeza-a-pie\n\nEXTRACCIÓN OBLIGATORIA DEL DOCUMENTO CANÓNICO (incluir en el prompt):\n1. COLORES HEX: Extraer o derivar valores HEX para: tono de piel, color de cabello, color de ojos, ropa casual (prendas principales), colores del uniforme (primario, secundario, acento). Si el documento no tiene HEX, derivarlos con máxima precisión a partir de la descripción textual y especificarlos en el prompt.\n2. PROPORCIONES DE CABEZA: Especificar cuántas cabezas de alto mide el personaje en cada versión de edad (ej. "7.5 head-heights tall at age 15, 6.5 head-heights at age 10"). Derivar de la descripción de proporciones si no está explícito.\n3. PERFIL LATERAL — DESCRIPCIÓN ESPECÍFICA: Para la vista lateral, describir explícitamente: forma de nariz en perfil (tipo, tamaño relativo), posición y forma de oreja, volumen y largo del cabello visto desde atrás y de lado, línea de mandíbula y cuello en perfil, postura lateral característica del personaje.\n4. MARCA DE CALZADO Y RESTRICCIONES: Incluir en las reglas de consistencia cualquier restricción de marca o estilo de calzado que aparezca en el documento.\n5. VOZ VISUAL DEL PERSONAJE: Extraer adjetivos que describan la energía visual del personaje (ej. "spontaneous, slightly unkempt, natural ease") e incluirlos en CADA vista, no solo en las expresiones.\n\nORGANIZACIÓN POR EDAD (el eje principal es la edad, no el tipo de vista):\nLa imagen se divide en DOS BLOQUES verticales separados por una línea sutil. Cada bloque tiene su propia columna de vistas ordenadas de arriba a abajo.\n\nBLOQUE IZQUIERDO — 10 AÑOS (versión infantil):\nHeader: "10 AÑOS" en sans-serif pequeño, centrado sobre el bloque\n1. FRENTE CASUAL 10 años — cuerpo completo, frontal, ropa casual, proporciones claramente infantiles: 5.5-6 head-heights, cara redondeada, rasgos más suaves, menos definición de mandíbula\n2. PERFIL CASUAL 10 años — perfil lateral izquierdo, misma ropa, proporciones de 10 años\n3. 3/4 CASUAL 10 años — ángulo 3/4 frontal-izquierdo, misma ropa\n4. EXPRESIÓN Alegría 10 años — busto, primer plano, genuino, NO caricaturesco\n5. EXPRESIÓN Enojo 10 años — busto, primer plano, controlado, NO gritando\n6. EXPRESIÓN Tristeza 10 años — busto, primer plano, contenida, NO lágrimas\n\nBLOQUE DERECHO — EDAD ACTUAL (versión principal de la historia, extraer edad exacta del documento):\nHeader: "EDAD ACTUAL — [EDAD] AÑOS" en sans-serif pequeño, centrado sobre el bloque\n7. FRENTE CASUAL — cuerpo completo, frontal, ropa casual, proporciones de la edad actual (especificar head-heights)\n8. FRENTE UNIFORME — frontal, uniforme del equipo, elementos de capitán/rol si aplica\n9. PERFIL CASUAL — perfil lateral izquierdo, casual (aplicar descripción de perfil del documento: nariz, oreja, volumen de cabello, mandíbula)\n10. 3/4 CASUAL — ángulo 3/4 frontal-izquierdo, casual\n11. 3/4 UNIFORME — ángulo 3/4, uniforme\n12. EXPRESIÓN Alegría — busto, genuino, espontáneo, NO sonrisa forzada\n13. EXPRESIÓN Enojo — busto, controlado, determinado, NO boca abierta\n14. EXPRESIÓN Tristeza — busto, contenida, internalizada, NO llanto visible\n\nSEPARADOR: línea vertical sutil (1px, rgba gris claro) entre bloques izquierdo y derecho\nTÍTULO: "[NOMBRE] — CHARACTER REFERENCE SHEET | LOS PRODIGIOS" en la parte superior, centrado\nETIQUETAS: cada vista etiquetada en español debajo en sans-serif pequeño\nESCALA: line de referencia de altura implícita — el personaje adulto en bloque derecho es visiblemente más alto que en el bloque izquierdo\n\nVOCABULARIO DE ESTILO — TRADUCIR AL PROMPT SEGÚN EL ESTILO SOLICITADO:\nSi el estilo es "cel-shading" o "cel shading": usar el siguiente vocabulario técnico en el prompt → "clean cel-shaded digital illustration, hard-edged shadow layers (2 tones maximum: base color + one discrete shadow, no gradients in shading), clean bold outlines with consistent weight, flat color fills with sharp shadow cuts, modern animation production quality. Style references: contemporary Korean and Latin American animation, Spider-Man Into the Spider-Verse color discipline (NOT the motion blur effect), Arcane-adjacent clean render. NOT anime: no large stylized eyes, no manga shading, no speed lines, no Japanese animation conventions. NOT painterly: no brush texture, no watercolor, no soft blending."\nSi el estilo es otro, adaptarlo con el mismo nivel de precisión técnica.\n\nTÉCNICO: 4096x4096px PNG, proporciones consistentes en todas las vistas.`,
  'Reference Sheet — Locación': `INSTRUCCIÓN PRINCIPAL: Genera un prompt en inglés para crear UNA SOLA IMAGEN de alta resolución (4096x4096px mínimo) con TODAS las vistas de la locación en un reference sheet de producción.\n\nLAYOUT:\n- Fondo blanco puro (RGB 255,255,255) alrededor de cada vista (el fondo blanco es el lienzo, NO el fondo de las escenas)\n- Cada vista separada 80px mínimo, con margen para cortar en Photoshop\n- Las 4 vistas se distribuyen en 2 columnas × 2 filas, igual tamaño, sin vista vacía\n- Título: "[NOMBRE] — LOCATION REFERENCE SHEET | LOS PRODIGIOS"\n- Cada vista etiquetada en español debajo\n\nEXTRACCIÓN OBLIGATORIA DEL DOCUMENTO CANÓNICO (incluir en el prompt):\n1. PALETA HEX: Extraer o derivar valores HEX para los colores dominantes de la locación: fachada/exterior, paredes interiores, piso, elementos arquitectónicos clave, iluminación nocturna (color de luz artificial).\n2. ELEMENTOS ARQUITECTÓNICOS INVARIABLES: Listar los elementos físicos que NO pueden cambiar entre vistas día/noche ni entre exterior/interior (puertas, ventanas, materiales, proporciones del espacio). Estos van en las ABSOLUTE CONSISTENCY RULES.\n3. CARÁCTER DEL LUGAR: Extraer adjetivos que describan la atmósfera y clase social implícita del espacio. Aplicar en todas las vistas.\n4. TIEMPO DE LA HISTORIA: Si el documento especifica en qué punto de la narrativa se usa la locación, reflejar el estado de conservación correspondiente (nuevo, habitado, deteriorado).\n\nVISTAS REQUERIDAS (2 columnas × 2 filas, cuadrícula exacta):\nFILA 1:\n1. EXTERIOR DÍA (columna izquierda) — establishing shot exterior, iluminación diurna natural, misma cámara y encuadre que la versión nocturna\n2. EXTERIOR NOCHE (columna derecha) — mismo exterior, misma cámara, iluminación nocturna artificial/ambiental\nFILA 2:\n3. INTERIOR DÍA (columna izquierda) — vista interior principal, luz natural entrando por ventanas, misma cámara que versión nocturna\n4. INTERIOR NOCHE (columna derecha) — mismo interior, misma cámara, iluminación artificial (especificar tipo: lámpara, neón, ventana exterior nocturna)\n\nREGLA CRÍTICA: Exterior día y noche deben ser el mismo edificio/espacio desde el mismo ángulo — solo cambia la iluminación. Interior día y noche: mismo espacio, mismo encuadre — solo cambia la fuente de luz.\n\nTÉCNICO: 4096x4096px PNG, paleta y arquitectura consistentes entre las 4 vistas, estilo ilustración de producción limpia sin textura pictórica.`,
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { artworkType, style, entityDocId, entityTitle, entityFocus, canonImageUrl, selectedView, renderer } = await request.json()

  if (!artworkType || !style || !entityTitle) {
    return NextResponse.json({ error: 'artworkType, style y entityTitle son requeridos' }, { status: 400 })
  }

  const workflowTemplate = ARTWORK_WORKFLOW_TEMPLATES[artworkType] ?? ''

  const isVistaIndividual = artworkType === 'Vista Individual — Personaje' || artworkType === 'Vista Individual — Locación'
  const isVistaPersonaje = artworkType === 'Vista Individual — Personaje'

  const rendererVocab = (() => {
    if (renderer === 'cel-shading' || !renderer)
      return `ESTILO VISUAL: Ilustración de animación 2D, cel-shading de calidad de producción profesional. Outlines negros limpios y consistentes. Colores planos con sombras de borde duro — exactamente un tono de sombra por área de color, sin degradados. La referencia estética es animación latinoamericana contemporánea y la disciplina de color de Spider-Man: Into the Spider-Verse (sin el efecto de motion blur). NO es anime japonés: sin ojos grandes estilizados, sin convenciones de manga, sin líneas de velocidad. NO es realista ni pictórico.`
    if (renderer === 'flat-color')
      return `ESTILO VISUAL: Ilustración de color plano puro. Sin sombras, sin degradados, sin shading. Solo outlines y rellenos sólidos. Estética gráfica y posterizada.`
    if (renderer === 'sketch')
      return `ESTILO VISUAL: Boceto de producción limpio. Líneas de lápiz precisas, sombreado mínimo con hatching fino, sin rellenos de color, calidad de character design o storyboard profesional.`
    return `ESTILO VISUAL: Ilustración digital limpia, calidad de animación contemporánea.`
  })()

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

  const canonSection = canonImageUrl
    ? `\nIMAGEN DE REFERENCIA VISUAL CANÓNICA (APROBADA): ${canonImageUrl}\nEsta imagen es el canon visual oficial aprobado. TODAS las vistas generadas deben ser 100% consistentes con este personaje/entidad: mismos rasgos, colores exactos, proporciones, estilo de línea y paleta. No inventar características que no estén en esta imagen o en la información canónica.\n`
    : ''

  const userMessage = isVistaIndividual ? `Escribe una instrucción en inglés para ChatGPT Images 2.0 — el generador de imágenes más nuevo de OpenAI integrado en ChatGPT, con alta fidelidad de referencia visual.

IMPORTANTE: El usuario siempre adjunta la imagen de referencia canónica aprobada del personaje/locación ANTES de ejecutar este prompt. ChatGPT Images 2.0 lee esa imagen y la respeta fielmente.

FORMATO REQUERIDO — lenguaje natural descriptivo, NO keywords separados por comas:
✓ "Using the provided reference image, draw Mateo in a full-body front view..."
✗ "anime boy, cel shading, white background, navy shirt..."

La instrucción debe ser clara, descriptiva y específica. Sin negative prompts — Images 2.0 no los usa.

VISTA A GENERAR: "${selectedView ?? (isVistaPersonaje ? 'frente_casual_15' : 'exterior_dia')}"
${isVistaPersonaje ? `
Traduce el ID de vista a instrucciones de composición:
- frente_casual_15 / frente_casual_16 / frente_casual_10 → full body, strictly front-facing, neutral standing pose. Age must be clearly visible in proportions and face maturity.
- frente_uniforme_15 / frente_uniforme_16 → full body, front-facing, team uniform, confident athletic stance.
- perfil_casual_15 → full body, left side profile. Describe hair volume from behind, jawline, posture silhouette from the side.
- tres_cuartos_casual_15 → full body, three-quarter front-left angle, slight weight shift, natural and relaxed.
- tres_cuartos_uniforme_15 → full body, three-quarter angle, uniform.
- expresion_alegria → close-up bust, genuine spontaneous joy.
- expresion_enojo → close-up bust, controlled determined anger.
- expresion_tristeza → close-up bust, quiet internalized sadness.
` : `
Traduce el ID de vista:
- exterior_dia → establishing exterior shot, natural daylight.
- exterior_noche → same angle as exterior_dia, nighttime lighting.
- interior_dia → main interior view, natural light from windows.
- interior_noche → same interior angle, artificial light sources.
`}

COMPOSICIÓN:
- Imagen única, NO reference sheet con múltiples figuras
- Fondo blanco puro — sin ambiente ni sombras
- ${isVistaPersonaje ? 'Figura centrada, espacio para recorte limpio' : 'Escena encuadrada, márgenes limpios'}
- Sin texto ni etiquetas en la imagen

${rendererVocab}

ENTIDAD: ${entityTitle}
${canonSection}${entityContent ? `\nINFORMACIÓN CANÓNICA:\n${entityContent}` : ''}

El prompt debe:
1. Estar en inglés
2. Comenzar con "Using the provided reference image, draw..."
3. Describir la vista específica con detalle narrativo — pose, expresión, ángulo de cámara
4. Mencionar los detalles canónicos clave que deben ser visibles en esta vista específica
5. Especificar colores con HEX cuando estén disponibles en el documento
6. Describir el estilo visual de forma natural, sin keywords técnicos
7. Terminar con una instrucción de consistencia: "Maintain exact design consistency with the provided reference image."
8. Sin "Negative prompt:", sin listas de keywords, sin secciones técnicas — solo lenguaje descriptivo claro

Genera ÚNICAMENTE el prompt. Sin explicaciones previas.

VISTA A GENERAR: "${selectedView ?? (isVistaPersonaje ? 'frente_casual_15' : 'exterior_dia')}"
${isVistaPersonaje ? `
Traduce el ID de vista a estas instrucciones de composición:
- frente_casual_15 / frente_casual_16 / frente_casual_10 → full body, strictly frontal view, neutral standing pose. The specified age must be clearly readable in proportions.
- frente_uniforme_15 / frente_uniforme_16 → full body, strictly frontal, team uniform, athletic ready stance.
- perfil_casual_15 → full body, LEFT lateral profile view. Describe hair volume from behind, jaw line in profile, posture silhouette from the side.
- tres_cuartos_casual_15 → full body, 3/4 front-left angle, slight weight shift, natural dynamism.
- tres_cuartos_uniforme_15 → full body, 3/4 front-left angle, uniform, athletic energy.
- expresion_alegria → bust/head-and-shoulders close-up, genuine spontaneous joy, NOT performative smile.
- expresion_enojo → bust close-up, controlled determined anger, jaw set, NOT open-mouth screaming.
- expresion_tristeza → bust close-up, quiet internalized sadness, no visible tears, weight of stillness.
` : `
Traduce el ID de vista a estas instrucciones de composición:
- exterior_dia → establishing shot exterior, natural daylight, architecture clearly readable.
- exterior_noche → same exterior angle as exterior_dia, nighttime artificial/ambient lighting.
- interior_dia → main interior view, natural light entering through windows.
- interior_noche → same interior angle as interior_dia, artificial light sources (lamp, ceiling light, window glow from outside).
`}

COMPOSICIÓN — REGLAS PARA VISTA ÚNICA:
- La imagen muestra SOLO esta vista. No es un reference sheet, no hay múltiples figuras.
- Fondo blanco puro (RGB 255,255,255) — sin ambiente, sin sombras en el fondo, sin decoración.
- ${isVistaPersonaje ? 'Figura perfectamente centrada, con espacio de aire alrededor para recorte limpio en Photoshop.' : 'Escena perfectamente encuadrada, márgenes limpios para recorte.'}
- Máxima atención al detalle — esta imagen va directamente a revisión de assets canónicos.
- NO incluir texto, etiquetas, ni anotaciones en la imagen.

${rendererVocab}

ENTIDAD / ${isVistaPersonaje ? 'PERSONAJE' : 'LOCACIÓN'}: ${entityTitle}
${canonSection}${entityContent ? `\nINFORMACIÓN CANÓNICA:\n${entityContent}` : ''}

El prompt debe:
1. Estar en inglés
2. Extraer del documento canónico y especificar con valores HEX: ${isVistaPersonaje ? 'tono de piel exacto, color de cabello, ojos, ropa' : 'paleta de colores dominantes del espacio, materiales, texturas'}
3. ${isVistaPersonaje ? 'Especificar proporciones de cabeza (head-heights) para la edad indicada' : 'Especificar elementos arquitectónicos invariables que deben aparecer'}
4. ${isVistaPersonaje ? 'Si la vista es PERFIL, describir explícitamente: nariz en perfil, volumen de cabello visto de lado/atrás, línea de mandíbula y cuello lateral' : 'Si es vista nocturna, especificar tipo y color de fuente de luz artificial'}
5. Aplicar el renderer indicado con vocabulario técnico preciso
6. Incluir sección "ABSOLUTE CONSISTENCY RULES:" con 5-8 elementos visuales invariables del documento
7. Incluir "Negative prompt:" con lo que debe evitarse estrictamente (incluyendo: multiple figures, reference sheet layout, text overlays, labels in image, colored background)
${canonImageUrl ? '8. Añadir al final: "REFERENCE IMAGE: ' + canonImageUrl + '"' : ''}

Genera ÚNICAMENTE el prompt. Sin explicaciones, sin texto introductorio.`
  : `Escribe una instrucción detallada en inglés para ChatGPT Images 2.0 — el generador de imágenes más nuevo de OpenAI, con alta fidelidad de referencia visual y edición. Usa lenguaje natural descriptivo, NO listas de keywords separados por comas. El usuario siempre adjunta la imagen de referencia canónica antes de ejecutar la instrucción.

TIPO DE ARTWORK:

TIPO DE ARTWORK: ${artworkType}

TEMPLATE DE WORKFLOW (qué debe incluir el artwork):
${workflowTemplate}

ESTILO VISUAL: ${style}

ENTIDAD / PERSONAJE: ${entityTitle}${entityFocus ? `\nZONA O FOCO ESPECÍFICO: ${entityFocus} (el prompt debe centrarse exclusivamente en esta zona/área del documento, ignorando el resto)` : ''}
${canonSection}${entityContent ? `\nINFORMACIÓN CANÓNICA DE LA ENTIDAD:\n${entityContent}` : ''}

La instrucción debe:
1. Estar en inglés
2. Comenzar con "Using the provided reference image, draw..." o "Using the provided reference image as the canonical design base, create..."
3. Describir en lenguaje natural cada elemento visual que debe aparecer — sin listas de keywords
4. Seguir el template de workflow para este tipo de artwork, describiendo narrativamente cada vista o elemento requerido
5. Especificar colores con HEX cuando estén disponibles en el documento canónico
6. Si el artwork incluye texto o etiquetas visibles, indicar que deben estar en español
7. Describir el estilo visual de forma natural y clara — sin términos técnicos de renderizado
8. Cerrar con: "Maintain exact design consistency with the provided reference image across all views."
9. Sin "Negative prompt:", sin secciones técnicas de keywords — solo lenguaje descriptivo fluido

Genera ÚNICAMENTE la instrucción. Sin explicaciones previas.`

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 500 })
  }

  // Fetch arte reference docs to inject into system prompt
  let refDocsSection = ''
  try {
    const supabase = createServerClient()
    const { data: docs } = await supabase
      .from('reference_docs')
      .select('title, description, content, categories')
      .or('categories.cs.{"arte"},categories.cs.{"general"}')
      .order('title', { ascending: true })
      .limit(10)

    if (docs && docs.length > 0) {
      refDocsSection = '\n\n---\n## DOCUMENTOS DE REFERENCIA — BIBLIOTECA DE LA SERIE\n\n'
      for (const doc of docs) {
        const content = doc.content
          ? doc.content.substring(0, 6000) + (doc.content.length > 6000 ? '\n\n[... truncado ...]' : '')
          : ''
        refDocsSection += `### ${doc.title}\n`
        if (doc.description) refDocsSection += `_${doc.description}_\n\n`
        if (content) refDocsSection += `${content}\n`
        refDocsSection += '\n---\n\n'
      }
    }
  } catch {
    // continue without docs
  }

  const systemPrompt = (SYSTEM_CONTEXTS['arte'] ?? SYSTEM_CONTEXTS['general']) + refDocsSection

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 8096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
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
