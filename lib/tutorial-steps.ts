export interface TutorialStep {
  id: string
  route: string | null
  spotlightSelector: string | null
  bit: 'happy' | 'neutral' | 'surprised' | 'night'
  bitAdmin?: 'happy' | 'neutral' | 'surprised' | 'night'
  dialogue: string
  dialogueAdmin?: string
  navDialogue?: string
  condition: 'none' | 'event'
  conditionEvent?: string
  buttonLabel: string
  navLabel?: string
}

export interface TutorialTrack {
  id: string
  label: string
  description: string
  icon: string
  color: string
  stepIds: string[]
}

export const TUTORIAL_STEPS: TutorialStep[] = [

  // ── INTRO ────────────────────────────────────────────────────────────────────
  {
    id: 'intro',
    route: null,
    spotlightSelector: null,
    bit: 'happy',
    dialogue: '¡Ey! Soy Bit — la mascota oficial del estudio.\n\nBienvenido a NUPPA, el sistema operativo de Los Prodigios.\n\nAcá se escribe la serie, se validan los personajes, se genera arte, se controla la continuidad y mucho más.\n\nTe muestro cómo funciona todo, paso a paso. ¿Listo?',
    condition: 'none',
    buttonLabel: '¡Vamos!',
  },

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  {
    id: 'dashboard',
    route: '/dashboard',
    spotlightSelector: '[data-tutorial="quick-actions"]',
    bit: 'happy',
    navDialogue: 'Lo primero que ves al entrar es el Dashboard. Vamos a verlo.',
    dialogue: 'Este es el Dashboard — el panel de control de toda la producción.\n\nDe un vistazo ves el estado general de la serie: temporadas, episodios activos y accesos rápidos a las secciones más usadas.\n\nDesde acá llegas a cualquier parte de NUPPA.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir al Dashboard →',
  },

  // ── EPISODIOS ────────────────────────────────────────────────────────────────
  {
    id: 'episodes-grid',
    route: '/episodes',
    spotlightSelector: '[data-tutorial="episodes-grid"]',
    bit: 'surprised',
    navDialogue: 'Ahora te muestro Episodios — donde se construye cada uno de los 50 capítulos de la serie. Vamos.',
    dialogue: 'Este es el mapa de episodios: 5 temporadas, 10 episodios cada una.\n\nCada casilla es un episodio. Las que tienen borde de color ya existen — el color indica el estado:\n• Naranja = Outline\n• Morado = Guión en progreso\n• Turquesa = En producción\n• Rojo = Completado\n\nLas casillas con "+" están vacías. Haz clic en cualquiera para crear ese episodio.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Episodios →',
  },

  {
    id: 'episodes-builder',
    route: null,
    spotlightSelector: '[data-tutorial="episode-tabs"]',
    bit: 'happy',
    dialogue: 'Cuando abres un episodio entras al Episode Builder.\n\nArriba tienes tres modos: Vista general, Guión y Estructura.\n\nA la derecha siempre está el Asistente del episodio — la IA que te acompaña en los tres modos.\n\nVamos modo por modo.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-overview',
    route: null,
    spotlightSelector: '[data-tutorial="episode-overview"]',
    bit: 'neutral',
    dialogue: 'La Vista general es lo primero que debes completar antes de escribir.\n\nTiene 5 campos clave:\n• Logline — una oración con el conflicto central del episodio\n• Tema central — la pregunta emocional\n• Cold Open — lo que pasa antes de los créditos\n• Tag / Gancho final — el cierre o anzuelo post-créditos\n• Sinopsis — el resumen narrativo completo\n\nEstos datos se inyectan automáticamente en el contexto de la IA cuando trabajas en este episodio.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-script',
    route: null,
    spotlightSelector: '[data-tutorial="episode-script-tab"]',
    bit: 'surprised',
    dialogue: 'El modo Guión es el editor en formato estándar de animación.\n\nSi ya tienes un guión escrito fuera de NUPPA:\n1. Haz clic en la pestaña "Guión" arriba\n2. Selecciona todo el texto del editor y bórralo\n3. Pega tu guión directamente\n4. Se guarda automáticamente cada 1.5 segundos — no hay botón de guardar\n\nSi vas a escribir desde cero, escribe directo ahí.\n\nVerás un badge con el código de versión: T1E01-G01. Cuando terminas una versión, "Nueva versión" sube el contador. "Aprobar FINAL" lo congela definitivamente.\n\nEl botón "↓ PDF" descarga el guión con la identidad visual de Los Prodigios.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-structure',
    route: null,
    spotlightSelector: '[data-tutorial="episode-structure-tab"]',
    bit: 'happy',
    dialogue: 'El modo Estructura organiza el episodio en 3 actos con escenas.\n\nPuedes:\n• Agregar escenas manualmente con el "+" de cada acto\n• Definir título, descripción, locación, mood y duración de cada escena\n• Escribir el guión específico de cada escena por separado\n• O usar la IA: "Generar estructura con AI" propone escenas completas desde el logline\n\nCuando la IA genera escenas, aparece un banner con el botón "Importar a estructura" que las distribuye entre los 3 actos automáticamente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-ai',
    route: null,
    spotlightSelector: '[data-tutorial="episode-ai-panel"]',
    bit: 'surprised',
    dialogue: 'A la derecha del episodio tienes el panel de IA con 6 workflows.\n\nEl flujo estándar cuando tienes un guión listo es este — en orden:\n\n1️⃣ "Revisar continuidad" — la IA lee tu guión completo y lo compara contra toda la Biblia. Te dice si hay algo que contradice el canon o genera inconsistencias. Debes resolverlas antes de continuar.\n\n2️⃣ "Mejorar diálogos" — ajusta las voces de los personajes según sus fichas canónicas. Si Mateo habla como Kael, acá te lo marca.\n\n3️⃣ "Breakdown de producción" — extrae una lista ordenada de todos los personajes, locaciones y props que aparecen, escena por escena. Sirve para planificar la producción visual.\n\n4️⃣ "Log de continuidad" — detecta los cambios permanentes que este episodio introduce al universo. Ese es el último paso.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-continuity-log',
    route: null,
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'El "Log de continuidad" es el paso más importante al terminar un episodio.\n\nCómo funciona:\n1. Haz clic en "Log de continuidad" en el panel derecho\n2. La IA analiza el guión completo y lista todos los cambios permanentes que introduce — una cicatriz de Mateo, un personaje que muere, una locación que cambia\n3. Cuando termina, aparece un banner naranja: "X cambios detectados"\n4. Léelos uno por uno\n5. Si son correctos, presiona "✓ Aprobar y guardar log"\n\nEsos cambios se guardan automáticamente en el Sistema de Continuidad — en el Canon Log, los estados de personajes, locaciones y props.\n\nAsí NUPPA siempre sabe exactamente en qué momento de la historia está todo, antes de producir el siguiente episodio.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── CONTINUIDAD ──────────────────────────────────────────────────────────────
  {
    id: 'continuity',
    route: '/continuity',
    spotlightSelector: null,
    bit: 'neutral',
    navDialogue: 'Ahora una sección clave: Continuidad. Acá se registra todo lo que cambia episodio a episodio. Vamos.',
    dialogue: 'El Sistema de Continuidad mantiene la coherencia de los 50 episodios.\n\nTiene 6 módulos:\n• Canon Log — cambios permanentes aprobados episodio a episodio\n• Timeline — hitos que afectan el estado visual\n• Issues Abiertos — inconsistencias pendientes de resolver\n• Estados: Personajes — cómo está cada personaje ahora mismo en la historia\n• Estados: Locaciones — cambios acumulados en cada lugar\n• Estados: Props — objetos importantes y su estado actual\n\nTodo lo que se aprueba en el Log de continuidad de un episodio aparece reflejado acá automáticamente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Continuidad →',
  },

  // ── MOTOR NUPPA ──────────────────────────────────────────────────────────────
  {
    id: 'motor',
    route: '/motor',
    spotlightSelector: null,
    bit: 'surprised',
    navDialogue: 'Hay una sección que todavía no te mostré: el Motor NUPPA. Es donde se mide la calidad de la serie en tiempo real. Vamos.',
    dialogue: 'El Motor NUPPA evalúa cada episodio en 6 dimensiones: narrativa, personajes, diálogos, ritmo, consistencia visual y producción.\n\nEl gráfico de temporada muestra de un vistazo qué episodios están fuertes y cuáles necesitan trabajo — antes de que lleguen a la audiencia.\n\nSelecciona una temporada arriba para ver el estado de sus episodios. Los colores van de verde (muy bien) a rojo (necesita atención).\n\nEs como el VAR del estudio. Si algo falla, acá se ve primero.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir al Motor NUPPA →',
  },

  // ── BIBLIA ───────────────────────────────────────────────────────────────────
  {
    id: 'bible-open',
    route: '/bible',
    spotlightSelector: '[data-tutorial="bible-grid"]',
    bit: 'happy',
    navDialogue: 'Ahora te muestro la Biblia — el corazón de todo. Ahí está el canon oficial escrito de la serie. Vamos.',
    dialogue: 'La Biblia tiene dos tabs:\n\n📚 Canon — todos los documentos canónicos oficiales: perfiles de personajes, el mundo, la historia, las reglas del universo.\n\n✍ Taller — documentos de trabajo en progreso: guiones, notas, materiales de desarrollo.\n\nHaz clic en cualquier tomo para abrirlo y leer su contenido.',
    condition: 'event',
    conditionEvent: 'tutorial:bible_opened',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a la Biblia →',
  },

  {
    id: 'bible-read',
    route: '/bible',
    spotlightSelector: '[data-tutorial="bible-modal"]',
    bit: 'happy',
    bitAdmin: 'surprised',
    dialogue: '¿Lo ves? Todo el canon oficial en un solo lugar.\n\nCada tomo puede tener entidades vinculadas — si un doc habla de Mateo González, aparece un chip teal con su nombre. Al hacer clic te lleva directo a su galería de imágenes en Arte.\n\nLéelo con calma — esto es lo que mantiene la serie consistente en los 50 episodios.',
    dialogueAdmin: '¿Lo ves? Todo el canon oficial. Y tú puedes editarlo.\n\nEso es un poder ENORME. Si cambias algo acá sin pensarlo bien, las consecuencias se propagan a todos los flows, el asistente y los prompts de generación.\n\nTito me hizo prometerle que lo advertiría. Ya te lo advertí.',
    condition: 'none',
    buttonLabel: 'Entendido →',
  },

  {
    id: 'bible-template',
    route: '/bible',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Para agregar un nuevo elemento a la Biblia hay dos formas:\n\n1. Subir un archivo .docx o .md que ya tengas preparado\n2. Crear desde template — para personajes, locaciones y props hay plantillas con todas las secciones prerellenadas\n\nY lo más importante: cuando subes un doc, puedes vincularle entidades canónicas. Eso conecta el documento de texto con las imágenes aprobadas en Arte. Una sola fuente de verdad para lo escrito y lo visual.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── ASISTENTE ────────────────────────────────────────────────────────────────
  {
    id: 'studio',
    route: '/studio',
    spotlightSelector: '[data-tutorial="studio-input"]',
    bit: 'happy',
    navDialogue: 'El Asistente es el más potente de todos. Conoce toda la Biblia y el sistema de continuidad. Vamos a verlo.',
    dialogue: 'El Asistente sabe todo lo que está en la Biblia — personajes, locaciones, historia, reglas del mundo.\n\nArriba puedes cambiar el modo (Escritura, Arte, Marketing...) y el asistente se especializa en ese contexto.\n\nPruébalo: escríbele algo relacionado con Los Prodigios y ve qué responde.',
    condition: 'event',
    conditionEvent: 'tutorial:message_sent',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir al Asistente →',
  },

  {
    id: 'studio-prompt-target',
    route: '/studio',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'El Asistente sabe para qué motor vas a generar.\n\nCuando pides un prompt de imagen o video, cambia al modo Arte y especifica la plataforma:\n\n🧠 ChatGPT / Claude — prompt largo con contexto canónico completo\n🎬 Artlist / Kling — máx. 1.800 caracteres, listo para pegar\n✈️ Runway — máx. 1.000 caracteres, inglés\n🖼 Midjourney / Sora — máx. 2.000 caracteres con tags\n\nEl Asistente ajusta longitud, idioma y estructura automáticamente según lo que elijas.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'studio-canon',
    route: '/studio',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Esto es lo más importante: antes de generar cualquier prompt visual, el sistema verifica el canon completo.\n\nCuando generas un prompt, ves una pantalla de verificación — una red de nodos con todos los documentos de la Biblia. Los documentos relevantes se iluminan en tiempo real.\n\nA la derecha aparecen los datos canónicos exactos: colores, materiales, diseños. La IA recibe esos datos inyectados — no los inventa.\n\nNunca más un video o imagen con detalles incorrectos.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── ARTWORK FLOW ─────────────────────────────────────────────────────────────
  {
    id: 'artwork-generate',
    route: '/artwork',
    spotlightSelector: null,
    bit: 'surprised',
    navDialogue: 'Ahora el Artwork Flow — donde se arman los prompts para crear arte con IA. Vamos.',
    dialogue: 'El Artwork Flow construye prompts de imagen en un canvas visual.\n\nPara generar un prompt:\n1. Haz clic en "+ Tipo" y elige el tipo de artwork\n2. Haz clic en "+ Estilo" y selecciona un estilo visual\n3. Haz clic en "+ Entidad" y elige un personaje o locación\n4. Haz clic en "+ Output" para agregar la salida\n5. Arrastra desde los puntos de cada nodo para conectarlos\n6. Presiona "Generar Prompt" en el nodo Output\n\nEl prompt se arma leyendo el doc canónico del personaje desde la Biblia. Directo a Midjourney o ChatGPT.',
    condition: 'event',
    conditionEvent: 'tutorial:prompt_generated',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir al Artwork Flow →',
  },

  {
    id: 'artwork-result',
    route: '/artwork',
    spotlightSelector: null,
    bit: 'happy',
    dialogue: '¿Ves ese prompt?\n\nNo inventó nada — lo armó leyendo el documento canónico del personaje directamente desde la Biblia.\n\nSi en la Biblia dice que Mateo tiene pelo oscuro y collar de cerámica, el prompt lo dice también. Siempre consistente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── VIDEO FLOW ───────────────────────────────────────────────────────────────
  {
    id: 'video-flow-intro',
    route: '/video-flow',
    spotlightSelector: null,
    bit: 'surprised',
    navDialogue: 'Ahora el Video Flow. Si el Artwork Flow genera prompts para imágenes estáticas, el Video Flow genera prompts con intención cinematográfica real. Vamos.',
    dialogue: 'El Video Flow convierte parámetros de dirección en prompts listos para Kling AI, Runway Gen-4, Sora o Artlist.\n\nEl canvas tiene 5 nodos que conectas en orden:\n• Escena — qué tipo de momento cinematográfico es\n• Referencia visual — imagen canónica aprobada del personaje\n• Dirección — plano, cámara, iluminación, estilo, ritmo\n• Personaje (opcional) — conecta el doc canónico de la Biblia\n• Output — elige la plataforma y genera el prompt',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir al Video Flow →',
  },

  {
    id: 'video-flow-platform',
    route: '/video-flow',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'Lo más importante del Output: selecciona la plataforma ANTES de generar.\n\nKling AI — máx. 500 caracteres, keywords compactas separadas por comas\nRunway Gen-4 — máx. 300 caracteres, ultra-compacto\nSora — máx. 800 caracteres, prosa narrativa con arco temporal\nArtlist — máx. 2.000 caracteres, el más completo\n\nCada plataforma tiene su propio vocabulario. El sistema genera solo el prompt que necesitas — no los cuatro a la vez.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'video-flow-antimorphing',
    route: '/video-flow',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'Una cosa crítica si tu escena tiene objetos con forma definida — pelotas, vasos, trofeos, lo que sea.\n\nEl sistema aplica automáticamente reglas anti-morphing:\n• Describe el objeto con geometría estricta: "perfectly spherical ball, rigid shape, no deformation"\n• Ancla el objeto a una acción concreta y breve\n• Agrega al negative prompt: "object morphing, shape distortion, melting, fluid geometry"\n\nSi no aplicas esto, los modelos de video deforman los objetos durante el clip. Es el error más común al generar video con IA.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── BIBLIA VISUAL (APPROVAL) ─────────────────────────────────────────────────
  {
    id: 'approval-intro',
    route: '/approval',
    spotlightSelector: null,
    bit: 'happy',
    navDialogue: 'Ahora la Biblia Visual — donde todo el arte de Los Prodigios se valida antes de entrar al canon oficial. Vamos.',
    dialogue: 'Esta es la Biblia Visual.\n\nAntes de que cualquier imagen se convierta en canon definitivo, debe pasar por doble aprobación: Pablo y Trinidad.\n\nEstá organizada por categorías — Personajes Principales, Equipo Hawks, Locaciones, Props, Criaturas, Secundarios y Mascotas.\n\nCada categoría se despliega mostrando sus entidades como cards con foto y barra de progreso.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a la Biblia Visual →',
  },

  {
    id: 'approval-accordion',
    route: '/approval',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'Al abrir una categoría ves el grid de entidades — cada personaje, locación o prop como una card con su foto canónica más reciente y su barra de progreso individual.\n\nEl porcentaje indica cuántas de sus vistas están aprobadas. Cuando llega al 100%, aparece el badge de completado ✓.\n\nHaz clic en cualquier entidad para abrir su Ficha Técnica.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'approval-entity-sheet',
    route: '/approval',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Dentro de la Ficha Técnica tienes dos columnas:\n\n• Izquierda — retrato del personaje + datos canónicos leídos directamente desde su doc en la Biblia. Si cambia el doc, cambian los datos. Sin campos manuales.\n\n• Derecha — todos sus slots organizados por tipo de vista: Vista general, Expresiones, Outfit casual, Outfit deportivo, Accesorios, Acciones.\n\nCada slot muestra su thumbnail, estado actual y los sellos de aprobación.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'approval-upload',
    route: '/approval',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Para subir una imagen a un slot:\n\n1. Abre la ficha del personaje\n2. Encuentra el slot — por ejemplo "Outfit casual · Variante 1 · Frente"\n3. Arrastra la imagen al área punteada, o haz clic para elegirla\n4. La imagen sube automáticamente al sistema\n5. El slot pasa a "En Revisión" y espera los votos de aprobación\n\nSi la imagen ya está aprobada y quieres cambiarla, usa el ✕ del thumbnail — vuelve a Pendiente y sale de Arte hasta que se vuelva a aprobar.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'approval-seals',
    route: '/approval',
    spotlightSelector: null,
    bit: 'happy',
    dialogue: 'El sistema de doble aprobación usa sellos visuales — como un documento oficial.\n\nCada slot tiene dos sellos, uno por revisor:\n• Círculo punteado — pendiente de voto\n• Sello sólido con ✓ — aprobado (del color del revisor)\n• Sello con ✕ — rechazado, con nota obligatoria\n\nCuando ambos sellos están activos, el slot pasa a Aprobado y la imagen aparece automáticamente en Arte — en la galería de esa entidad, lista para consultar.\n\nSi rechazas, debes escribir una nota — queda registrada como feedback.',
    condition: 'none',
    buttonLabel: 'Entendido →',
  },

  // ── ARTE / ASSETS ─────────────────────────────────────────────────────────────
  {
    id: 'assets',
    route: '/assets',
    spotlightSelector: null,
    bit: 'happy',
    navDialogue: 'Vamos a Arte — la biblioteca visual con todo lo que ya está aprobado y listo para producción.',
    dialogue: 'Arte es la biblioteca oficial de imágenes canónicas de Los Prodigios.\n\nA la izquierda está el navegador: categorías desplegables con todas las entidades adentro.\n\nHaz clic en una categoría para desplegarla. Luego haz clic en cualquier entidad — Mateo González, la Cancha, el Balón — y su galería aparece a la derecha.\n\nLas imágenes están agrupadas por tipo de vista. Haz clic en cualquiera para abrirla en grande con todos sus metadatos y la opción de copiar la URL.\n\nSolo aparecen imágenes aprobadas. Nada pendiente, nada rechazado.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Arte →',
  },

  // ── MARKETING ────────────────────────────────────────────────────────────────
  {
    id: 'marketing',
    route: '/marketing',
    spotlightSelector: null,
    bit: 'surprised',
    navDialogue: 'Y la última sección grande: Marketing. Acá se construye todo lo que va al mundo exterior. Vamos.',
    dialogue: 'Marketing tiene su propio asistente especializado en franquicia y audiencia.\n\nLas pestañas son:\n• Posts de Redes — contenido para Instagram, TikTok, YouTube, X\n• Publicidad — campañas y creatividades para paid media\n• Trailers & Promos — teasers y videos promocionales\n• Merchandise — productos físicos y su diseño\n• Licensing — acuerdos y oportunidades de licencia\n\nCada pestaña activa el contexto correcto en el asistente para ese tipo de tarea.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Marketing →',
  },

  // ── WORKFLOWS ────────────────────────────────────────────────────────────────
  {
    id: 'workflows-intro',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'happy',
    navDialogue: 'Una sección que todavía no te mostré: Workflows. Son los procesos de producción del estudio documentados. Vamos.',
    dialogue: 'Workflows es el sistema operativo de producción de NUPPA.\n\nAcá están los procesos que usamos para hacer la serie, organizados en 10 fases que cubren todo el ciclo: desde la primera idea hasta el lanzamiento y la expansión de franquicia.\n\nNo son listas simples. Cada workflow tiene objetivo, pasos detallados, archivos de referencia y criterios de aprobación.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Workflows →',
  },

  {
    id: 'workflows-phases',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="workflow-phases"]',
    bit: 'neutral',
    dialogue: 'En la barra superior tienes los filtros por fase.\n\nLas 10 fases de producción son:\n💡 Concepto — primeras ideas de la serie\n🏗️ Desarrollo — personajes, guiones, worldbuilding\n📐 Pre-Producción — diseños, storyboards, guía de estilo\n🎬 Producción — animación, audio, score\n✂️ Post-Producción — edición, color, mezcla\n🔍 Revisión — evaluación y aprobación\n🚀 Lanzamiento — estrategia y release\n🌎 Expansión — franquicia, merchandise, spin-offs\n🔄 Iteración — rediseñar, corregir, pivotar\n⚙️ Sistema — calibración de NUPPA\n\nHaz clic en cualquier fase para filtrar. El buscador también funciona por nombre o descripción.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-card-anatomy',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="workflow-card"]',
    bit: 'surprised',
    dialogue: 'Cada card es un workflow.\n\nLo que ves en ella:\n• La franja de color arriba — identifica la fase de producción\n• El icono y nombre de la fase — para orientarte rápido\n• El título del workflow — qué proceso es exactamente\n• La descripción — qué problema resuelve y cuándo usarlo\n\nEl buscador de arriba te ayuda a encontrar el que necesitas sin tener que revisar todos.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-use-button',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="workflow-use-btn"]',
    bit: 'surprised',
    dialogue: 'El botón ⚡ Usar Workflow es donde está la magia.\n\nCuando lo presionas, el sistema:\n1. Carga el contenido completo del workflow — todos sus pasos y criterios\n2. Detecta qué archivos de Knowledge necesita ese proceso\n3. Añade el contexto del estudio: estilo maestro, estado de personajes, estado de locaciones, Biblia\n\nTodo se arma en un prompt listo para ejecutar. Sin abrir ningún archivo manualmente.\n\nHaz clic en ⚡ Usar Workflow en cualquier card.',
    condition: 'event',
    conditionEvent: 'tutorial:workflow_opened',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-prompt-anatomy',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'En el modal ves el prompt completo que se va a ejecutar.\n\nTiene 3 capas:\n\n📚 Knowledge — archivos de referencia que la IA debe leer primero\n🗂 Contexto del sistema — archivos vivos del estudio: estilo visual, estado de personajes y locaciones, Biblia\n📋 El workflow completo — objetivo, pasos, entregables y criterios\n\nCuando pegas esto en el Asistente, ejecuta el proceso con toda la información correcta. Sin buscar nada.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-copy',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'happy',
    dialogue: 'Para usar el workflow, presiona "Copiar para el asistente".\n\nLuego ve al Asistente, pega el prompt y ejecuta.\n\nTruco útil: si el workflow necesita un brief tuyo — por ejemplo "Diseñar un antagonista nuevo" — agrega tus notas al final del prompt antes de pegar. La IA tiene el proceso completo y tus instrucciones al mismo tiempo.',
    condition: 'none',
    buttonLabel: '¡Listo!',
  },

  // ── AGENTES ──────────────────────────────────────────────────────────────────
  {
    id: 'agents-tab',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="agents-tab"]',
    bit: 'happy',
    navDialogue: 'En Workflows hay un tab que todavía no te mostré: el Equipo. Son los agentes especializados del estudio. Vamos.',
    dialogue: 'Dentro de Workflows hay un segundo tab: el Equipo.\n\nSon los agentes especializados de NUPPA — cada uno con un rol preciso, expertise definido y reglas estrictas sobre qué hace y qué NUNCA hace.\n\nHaz clic en el tab para explorarlos.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'agents-card',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="agent-card"]',
    bit: 'surprised',
    dialogue: 'Cada card muestra el departamento, el rol del agente y con quién trabaja.\n\n"Ver perfil" abre la ficha completa: misión, especialización, colaboraciones, y lo que NUNCA hace — los límites son tan importantes como las capacidades.\n\n"Activar →" te lleva al Asistente con ese agente ya activo.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'agents-activate',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'happy',
    dialogue: 'La combinación más poderosa de NUPPA:\n\nAbre cualquier workflow → en el modal verás chips de los agentes que pueden ejecutarlo → selecciona uno → el prompt incluye el perfil completo del agente arriba del workflow.\n\nLe pegas eso al Asistente y tienes el workflow ejecutado por el especialista correcto — no por el asistente genérico.',
    condition: 'none',
    buttonLabel: '¡Entendido!',
  },

  // ── CIERRE ───────────────────────────────────────────────────────────────────
  {
    id: 'sidebar',
    route: null,
    spotlightSelector: '[data-tutorial="sidebar"]',
    bit: 'neutral',
    dialogue: 'Ya conoces todo NUPPA.\n\nEl sidebar es tu mapa — desde acá navegas a cualquier sección en cualquier momento.\n\nCada sección tiene su contexto especializado. Nunca más salgas de NUPPA para buscar información de Los Prodigios.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'done',
    route: null,
    spotlightSelector: null,
    bit: 'night',
    dialogue: '¡Eso es todo! Ya sabes moverte por NUPPA completo.\n\nSi me necesitas de nuevo, estoy en el sidebar — "Tutorial". Desde ahí puedes elegir repasar cualquier sección específica sin volver a ver todo.\n\nAhora voy a ver qué está haciendo Tito... seguro algo con datos que nadie más entiende.\n\nBienvenido al equipo.',
    condition: 'none',
    buttonLabel: '¡Entendido!',
  },
]

// ── Tracks ────────────────────────────────────────────────────────────────────

export const TUTORIAL_TRACKS: TutorialTrack[] = [
  {
    id: 'full',
    label: 'Tutorial Completo',
    description: 'Recorrido por todas las secciones de NUPPA — ideal para nuevos integrantes del equipo.',
    icon: '🎬',
    color: '#F5A52A',
    stepIds: [
      'intro',
      'dashboard',
      'episodes-grid', 'episodes-builder', 'episodes-overview', 'episodes-script', 'episodes-structure', 'episodes-ai', 'episodes-continuity-log',
      'continuity',
      'motor',
      'bible-open', 'bible-read', 'bible-template',
      'studio', 'studio-prompt-target', 'studio-canon',
      'artwork-generate', 'artwork-result',
      'video-flow-intro', 'video-flow-platform', 'video-flow-antimorphing',
      'approval-intro', 'approval-accordion', 'approval-entity-sheet', 'approval-upload', 'approval-seals',
      'assets',
      'marketing',
      'workflows-intro', 'workflows-phases', 'workflows-card-anatomy', 'workflows-use-button', 'workflows-prompt-anatomy', 'workflows-copy',
      'agents-tab', 'agents-card', 'agents-activate',
      'sidebar',
      'done',
    ],
  },
  {
    id: 'episodes',
    label: 'Episodios',
    description: 'El Episode Builder: guión, estructura y los 6 workflows de IA.',
    icon: '🎞',
    color: '#E8B84B',
    stepIds: ['episodes-grid', 'episodes-builder', 'episodes-overview', 'episodes-script', 'episodes-structure', 'episodes-ai', 'episodes-continuity-log'],
  },
  {
    id: 'bible',
    label: 'Biblia',
    description: 'Cómo navegar, editar y agregar documentos canónicos con vínculos a entidades.',
    icon: '📖',
    color: '#C6952A',
    stepIds: ['bible-open', 'bible-read', 'bible-template'],
  },
  {
    id: 'studio',
    label: 'Asistente IA',
    description: 'Motor de prompts canónicos, verificación visual y modos especializados.',
    icon: '🧠',
    color: '#9B59B6',
    stepIds: ['studio', 'studio-prompt-target', 'studio-canon'],
  },
  {
    id: 'approval',
    label: 'Biblia Visual',
    description: 'Fichas de personaje, sellos de aprobación y flujo completo de doble revisión.',
    icon: '✓',
    color: '#4ECDC4',
    stepIds: ['approval-intro', 'approval-accordion', 'approval-entity-sheet', 'approval-upload', 'approval-seals'],
  },
  {
    id: 'assets',
    label: 'Arte',
    description: 'Biblioteca visual organizada por categorías y entidades — solo canon aprobado.',
    icon: '🖼',
    color: '#9B6FD4',
    stepIds: ['assets'],
  },
  {
    id: 'artwork',
    label: 'Artwork Flow',
    description: 'Genera prompts de imagen con intención canónica usando el Artwork Flow.',
    icon: '✦',
    color: '#4A8FE8',
    stepIds: ['artwork-generate', 'artwork-result'],
  },
  {
    id: 'video-flow',
    label: 'Video Flow',
    description: 'Genera prompts cinematográficos para Kling, Runway, Sora y Artlist.',
    icon: '🎥',
    color: '#4ECDC4',
    stepIds: ['video-flow-intro', 'video-flow-platform', 'video-flow-antimorphing'],
  },
  {
    id: 'continuity',
    label: 'Continuidad',
    description: 'El sistema que mantiene coherencia visual y narrativa en los 50 episodios.',
    icon: '🔗',
    color: '#E74C3C',
    stepIds: ['continuity'],
  },
  {
    id: 'motor',
    label: 'Motor NUPPA',
    description: 'Panel de calidad por episodio — evalúa narrativa, personajes, ritmo y producción.',
    icon: '⚡',
    color: '#88D8B0',
    stepIds: ['motor'],
  },
  {
    id: 'workflows',
    label: 'Workflows',
    description: 'Procesos de producción en 10 fases — cómo ejecutar cualquier tarea del estudio.',
    icon: '⚙',
    color: '#F5A52A',
    stepIds: ['workflows-intro', 'workflows-phases', 'workflows-card-anatomy', 'workflows-use-button', 'workflows-prompt-anatomy', 'workflows-copy'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Asistente especializado para redes sociales, trailers y merchandise.',
    icon: '📣',
    color: '#D4256A',
    stepIds: ['marketing'],
  },
  {
    id: 'agents',
    label: 'Equipo del Estudio',
    description: 'Los agentes especializados de NUPPA — explorar por departamento y combinarlos con workflows.',
    icon: '👥',
    color: '#F5A52A',
    stepIds: ['agents-tab', 'agents-card', 'agents-activate'],
  },
]
