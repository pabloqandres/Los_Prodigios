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
    dialogue: '¡Ey! Llegaste por El Llamado, ¿verdad? Bienvenido al equipo.\n\nTito estaba muy metido en sus datos como para recibirte... así que me mandaron a mí. Spoiler: soy mejor guía de todas formas.\n\nTe muestro cómo funciona todo esto.',
    condition: 'none',
    buttonLabel: '¡Vamos!',
  },

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  {
    id: 'dashboard',
    route: '/dashboard',
    spotlightSelector: '[data-tutorial="quick-actions"]',
    bit: 'happy',
    dialogue: 'Este es el Dashboard. De un vistazo ves el estado de toda la producción — temporadas, episodios, lo que está activo.\n\nEs como el camarín antes del partido.\n\nDesde acá llegas a todas las secciones.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir al Dashboard →',
  },

  // ── BIBLIA ───────────────────────────────────────────────────────────────────
  {
    id: 'bible-open',
    route: '/bible',
    spotlightSelector: '[data-tutorial="bible-grid"]',
    bit: 'happy',
    navDialogue: 'Primero te muestro la Biblia — el corazón de todo. Ahí está el canon oficial de la serie.\n\nVamos.',
    dialogue: 'Acá están todos los documentos canónicos — perfiles de personajes, referencias visuales, todo lo oficial.\n\nCada tomo es un archivo de la biblia. Haz clic en cualquiera para abrirlo.',
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
    dialogue: '¿Lo ves? Todo el canon oficial en un solo lugar.\n\nLéelo con calma — esto es lo que mantiene la serie consistente en los 50 episodios.',
    dialogueAdmin: '¿Lo ves? Todo el canon oficial. Y tú... tú puedes editarlo.\n\nEso es un poder ENORME. Tito me hizo prometerle que lo advertiría.\n\nSi cambias algo acá sin pensarlo, las consecuencias son catastróficas. No exagero.',
    condition: 'none',
    buttonLabel: 'Entendido →',
  },

  {
    id: 'bible-template',
    route: '/bible',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Hay dos formas de agregar un nuevo elemento a la Biblia:\n\n1. Subir un archivo .docx o .md que ya tengas\n2. Usar "Crear canon de personaje desde template" — te pide el nombre, genera el archivo con todas las secciones prerellenadas, incluyendo la sección de distinción física vs otros personajes. Fundamental para no confundir a Mateo con Nico.\n\nY lo mejor: cuando subes cualquier doc, la IA analiza automáticamente si ese elemento necesita imágenes de producción. Si detecta un personaje o locación te propone crear los slots de aprobación al instante — sin tener que ir a Aprobación a hacerlo manualmente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── ARTWORK FLOW ─────────────────────────────────────────────────────────────
  {
    id: 'artwork-generate',
    route: '/artwork',
    spotlightSelector: null,
    bit: 'surprised',
    navDialogue: 'Ahora el Artwork Flow — donde se generan los prompts para crear arte.\n\nTe explico cuando lleguemos, que esto tiene su truco.',
    dialogue: 'Acá construyes el flujo para generar prompts de imagen. La barra de arriba es tu panel de control.\n\nPara generar un prompt:\n1. Haz clic en "+ Tipo" y elige el tipo de artwork\n2. Haz clic en "+ Estilo" y selecciona un estilo visual\n3. Haz clic en "+ Entidad" y elige un personaje o locación\n4. Haz clic en "+ Output" para agregar la salida\n5. Arrastra desde los puntos de cada nodo para conectarlos\n6. Presiona "Generar Prompt" en el nodo Output',
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
    dialogue: '¿Ves ese prompt?\n\nLo armó leyendo el documento canónico del personaje desde la Biblia. Directo a Midjourney o ChatGPT y listo.\n\nNada de inventar detalles que no existen.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── VIDEO FLOW ───────────────────────────────────────────────────────────────
  {
    id: 'video-flow-intro',
    route: '/video-flow',
    spotlightSelector: null,
    bit: 'surprised',
    navDialogue: 'Ahora algo nuevo: el Video Flow. Si el Artwork Flow genera prompts para imágenes estáticas, el Video Flow genera prompts con intención cinematográfica real.\n\nVamos.',
    dialogue: 'El Video Flow convierte parámetros de dirección en prompts listos para Kling AI, Runway Gen-4, Sora o Artlist.\n\nEl canvas tiene 5 nodos que conectas en orden:\n• Escena — qué tipo de momento cinematográfico es\n• Referencia visual — imagen canónica aprobada del personaje\n• Dirección — plano, cámara, iluminación, estilo, extras, ritmo\n• Personaje (opcional) — conecta el doc canónico de la Biblia\n• Output — elige la plataforma y genera el prompt',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir al Video Flow →',
  },

  {
    id: 'video-flow-platform',
    route: '/video-flow',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'Lo más importante del Output: selecciona la plataforma ANTES de generar.\n\nKling AI — máx. 500 caracteres, keywords compactas separadas por comas\nRunway Gen-4 — máx. 300 caracteres, ultra-compacto\nSora — máx. 800 caracteres, prosa narrativa con arco temporal\nArtlist MinMaxH3 — máx. 2.000 caracteres, el más completo\n\nCada plataforma tiene su vocabulario propio. El sistema genera solo el prompt que necesitas — no los cuatro, así no gastas tokens de más.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'video-flow-antimorphing',
    route: '/video-flow',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'Una cosa crítica si tu escena tiene objetos con forma definida — pelotas, vasos, bicicletas, trofeos, lo que sea.\n\nEl sistema aplica automáticamente reglas anti-morphing:\n• Describe el objeto con geometría estricta: "perfectly spherical ball, rigid shape, no deformation"\n• Ancla el objeto a una acción concreta y breve, no a movimiento continuo\n• Agrega al negative prompt: "object morphing, shape distortion, melting, fluid geometry"\n\nSi no aplicas esto, los modelos de video deforman el objeto durante el clip. Es el problema más común al generar video con IA.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── ASISTENTE ────────────────────────────────────────────────────────────────
  {
    id: 'studio',
    route: '/studio',
    spotlightSelector: '[data-tutorial="studio-input"]',
    bit: 'happy',
    navDialogue: 'El Asistente es el más potente de todos. Conoce toda la Biblia y el sistema de continuidad.\n\nVamos a verlo.',
    dialogue: 'El Asistente sabe todo lo que está en la Biblia — personajes, locaciones, historia, marketing.\n\nPuedes cambiar el modo arriba (Escritura, Arte, Marketing...) y se especializa. Escríbele algo ahora para probarlo.',
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
    dialogue: '¿Sabías que el Asistente sabe para qué motor vas a generar?\n\nCuando pides un prompt de video o imagen — cambia al modo Arte o Trailers y dile "genera un prompt de X":\n\n🧠 ChatGPT / Claude — prompt largo con notas de dirección y contexto canónico completo\n🎬 Artlist / Kling — máx. 1.800 caracteres, listo para pegar\n✈️ Runway — máx. 1.000 caracteres, inglés\n🖼 Midjourney / Sora — máx. 2.000 caracteres con tags y parámetros\n\nEl Asistente ajusta longitud, idioma y estructura automáticamente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'studio-canon',
    route: '/studio',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Esto es lo más importante: ANTES de generar cualquier prompt visual, el sistema verifica todo el canon.\n\nLo que ves al generarlo:\n• Una pantalla de verificación animada — una red de nodos con todos los documentos de la Biblia\n• Los documentos relevantes para tu consulta se iluminan en tiempo real\n• A la derecha aparecen los datos canónicos exactos: colores, materiales, diseños\n• La IA recibe esos datos inyectados en el contexto — no los inventa\n\nNunca más un video generado con detalles incorrectos.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── CONTINUIDAD ──────────────────────────────────────────────────────────────
  {
    id: 'continuity',
    route: '/continuity',
    spotlightSelector: null,
    bit: 'neutral',
    navDialogue: 'Ahora una sección clave: Continuidad. Acá se registra todo lo que cambia episodio a episodio.\n\nVamos.',
    dialogue: 'El Sistema de Continuidad mantiene coherencia a lo largo de los 50 episodios.\n\nTiene 6 módulos:\n• Canon Log — cambios permanentes aprobados\n• Timeline — hitos que afectan el estado visual\n• Issues Abiertos — inconsistencias pendientes\n• Estados: Personajes — cómo está cada personaje en este momento de la historia\n• Estados: Locaciones — cambios acumulados en cada lugar\n• Estados: Props — objetos importantes y su estado actual\n\nSi mañana decides que Mateo es español y no chileno — cambias el doc en la Biblia y eso se propaga automáticamente a todos los flows, fichas y al asistente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Continuidad →',
  },

  // ── ASSETS ───────────────────────────────────────────────────────────────────
  {
    id: 'assets',
    route: '/assets',
    spotlightSelector: null,
    bit: 'happy',
    navDialogue: 'Vamos a la biblioteca de Assets — todo lo que se ha generado y aprobado para la serie.',
    dialogue: 'Acá está toda la biblioteca visual de Los Prodigios, organizada en Google Drive.\n\nLas categorías son:\n• Concept Art — diseños exploratorios\n• Personajes — arte final canon de cada personaje\n• Locaciones — fondos y escenarios definitivos\n• Props — objetos importantes del mundo\n• Criaturas — fauna del universo\n• Referencias — mood boards y material de referencia\n\nTodo lo que generes y apruebes vive acá. Si no está en Assets, no existe.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Assets →',
  },

  // ── MARKETING ────────────────────────────────────────────────────────────────
  {
    id: 'marketing',
    route: '/marketing',
    spotlightSelector: null,
    bit: 'surprised',
    navDialogue: 'Y la última sección grande: Marketing. Acá se construye todo lo que va al mundo exterior.\n\nVamos a verlo.',
    dialogue: 'Marketing tiene su propio asistente especializado en franquicia y audiencia.\n\nLas pestañas son:\n• Posts de Redes — contenido para Instagram, TikTok, YouTube, X\n• Publicidad — campañas y creatividades para paid media\n• Trailers & Promos — teasers y videos promocionales\n• Merchandise — productos físicos y su diseño\n• Licensing — acuerdos y oportunidades de licencia\n\nCada pestaña tiene el contexto correcto para el asistente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Marketing →',
  },

  // ── EPISODIOS ────────────────────────────────────────────────────────────────
  {
    id: 'episodes-grid',
    route: '/episodes',
    spotlightSelector: '[data-tutorial="episodes-grid"]',
    bit: 'surprised',
    navDialogue: 'Ahora algo nuevo — la sección de Episodios. Acá se construye cada uno de los 50 capítulos de la serie.\n\nVamos a verlo.',
    dialogue: 'Mira este mapa: 5 temporadas, 10 episodios cada una. 50 en total.\n\nCada casilla es un episodio. Las que tienen borde de color ya existen — el color indica el estado:\n• Naranja = Outline\n• Morado = Guión en progreso\n• Turquesa = En producción\n• Rojo = Completado\n\nLas casillas con "+" están vacías — haz clic en cualquiera para crear ese episodio.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Episodios →',
  },

  {
    id: 'episodes-builder',
    route: null,
    spotlightSelector: '[data-tutorial="episode-tabs"]',
    bit: 'happy',
    dialogue: 'Cuando abres un episodio entras al Episode Builder. Tiene tres modos en la barra superior: Vista general, Guión y Estructura.\n\nA la derecha siempre está el Asistente de episodio — el panel de IA que va contigo en los tres modos.\n\nVamos modo por modo.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-overview',
    route: null,
    spotlightSelector: '[data-tutorial="episode-overview"]',
    bit: 'neutral',
    dialogue: 'La Vista general es lo primero que debes completar antes de escribir.\n\nTiene 5 campos clave:\n• Logline — una oración que define el conflicto central\n• Tema central — la pregunta emocional del episodio\n• Cold Open — lo que ocurre antes de los créditos\n• Tag / Gancho final — el cierre o anzuelo post-créditos\n• Sinopsis — el resumen narrativo completo\n\nEstos datos se inyectan automáticamente en el contexto de la IA.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-script',
    route: null,
    spotlightSelector: '[data-tutorial="episode-script-tab"]',
    bit: 'surprised',
    dialogue: 'El modo Guión es el editor de pantalla completa en formato estándar de animación.\n\nTiene autoguardado cada 1.5 segundos — nunca pierdes trabajo.\n\nVerás un badge con el código de versión activo: T1E01-G01, T1E01-G02, etc.\n\nCuando terminas una versión:\n• "Nueva versión" sube el contador y crea la siguiente (G02, G03...)\n• "Aprobar FINAL" congela el código como T1E01-FINAL\n\nEl botón "↓ PDF" descarga el guión formateado con la identidad visual de Los Prodigios.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-structure',
    route: null,
    spotlightSelector: '[data-tutorial="episode-structure-tab"]',
    bit: 'happy',
    dialogue: 'El modo Estructura organiza el episodio en 3 actos con escenas.\n\nPuedes:\n• Agregar escenas manualmente con el botón "+" de cada acto\n• Definir título, descripción, locación, mood y duración estimada de cada escena\n• Escribir el guión específico de cada escena por separado\n• O usar la IA: el botón "Generar estructura con AI" propone escenas completas desde el logline\n\nCuando la IA genera escenas, aparece un banner azul con el botón "→ Importar a estructura" que las distribuye entre los 3 actos automáticamente.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-ai',
    route: null,
    spotlightSelector: '[data-tutorial="episode-ai-panel"]',
    bit: 'surprised',
    dialogue: 'El panel derecho tiene 6 workflows especializados — cada uno activa un rol distinto de la IA:\n\n✍ Escribir guión — asistente de formato con el Motor de Guión activo\n🔍 Revisar continuidad — detecta inconsistencias contra el canon\n💬 Mejorar diálogos — ajusta las voces a las fichas canónicas de cada personaje\n📋 Breakdown de producción — extrae personajes, locaciones y props escena por escena\n🎬 Generar estructura — propone actos y escenas desde el logline\n🗂 Log de continuidad — detecta cambios canónicos del episodio\n\nTodas las conversaciones se guardan en la base de datos.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'episodes-continuity-log',
    route: null,
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'El workflow "Log de continuidad" es especial — no solo genera texto.\n\nCuando termina el análisis aparece un banner naranja: "X cambios de continuidad detectados".\n\nTienes dos opciones:\n• Descartar — si los cambios no son definitivos\n• "✓ Aprobar y guardar log" — persiste los cambios en la base de datos\n\nLos cambios aprobados aparecen al final del modo Estructura como el "Log de continuidad guardado".\n\nEste es el mecanismo que alimenta el Sistema de Continuidad global entre episodios.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  // ── APROBACIÓN ───────────────────────────────────────────────────────────────
  {
    id: 'approval-intro',
    route: '/approval',
    spotlightSelector: null,
    bit: 'happy',
    navDialogue: 'Vamos a la Aprobación de Assets — donde todo el arte visual de Los Prodigios se valida antes de entrar a producción.\n\nVamos.',
    dialogue: 'Esta es la Sala de Aprobación.\n\nAntes de que cualquier imagen se convierta en canon definitivo, debe pasar por doble aprobación: Pablo y Trinidad.\n\nEstá organizada por categorías — Personajes Principales, Locaciones, Props, Criaturas, Secundarios y Mascotas. Cada categoría es un acordeón con su propio header visual y barra de progreso.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Aprobación →',
  },

  {
    id: 'approval-accordion',
    route: '/approval',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'Al abrir una categoría se despliega el grid de entidades — cada personaje, locación o prop como una card con su foto canónica más reciente y su barra de progreso individual.\n\nEl porcentaje indica cuántas de sus vistas están aprobadas. Cuando llega a 100%, aparece el badge verde ✓.\n\nEl botón "⚙ Inicializar Checklist" genera todos los slots desde la matriz definida. Solo se usa una vez al principio, o cuando se agrega una entidad nueva.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'approval-entity-sheet',
    route: '/approval',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Al hacer clic en cualquier entidad se abre su Ficha Técnica.\n\nTiene dos columnas:\n• Izquierda — retrato del personaje + datos canónicos leídos directamente desde su doc en la Biblia. Si cambia el doc, cambian los datos automáticamente. Sin campos manuales.\n• Derecha — todos sus slots organizados por tipo de vista: Vista general, Expresiones, Outfit casual, Outfit deportivo, Accesorios, Acciones, Versiones etarias.\n\nCada slot muestra su thumbnail, estado y los sellos de aprobación.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'approval-upload',
    route: '/approval',
    spotlightSelector: null,
    bit: 'surprised',
    dialogue: 'Para subir una imagen a un slot:\n\n1. Abre la ficha del personaje\n2. Encuentra el slot — por ejemplo "Outfit casual · Variante 1 · Frente"\n3. Arrastra la imagen al área punteada, o haz clic para elegirla\n4. La imagen sube automáticamente a Google Drive\n5. El slot pasa a "En Revisión"\n\nLa imagen se redimensiona a máx. 2048px automáticamente. Si la imagen ya está aprobada y quieres cambiarla, usa el ✕ del thumbnail — vuelve a Pendiente y sale de Assets hasta que se vuelva a aprobar.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'approval-seals',
    route: '/approval',
    spotlightSelector: null,
    bit: 'happy',
    dialogue: 'El sistema de doble aprobación usa sellos visuales — como un documento oficial.\n\nCada slot tiene dos sellos, uno por revisor:\n• Círculo punteado — pendiente de voto\n• Sello sólido con ✓ rotado — aprobado (del color del revisor)\n• Sello con ✕ — rechazado, con nota obligatoria\n\nCuando ambos sellos están activos, el slot pasa a Aprobado y el archivo se mueve automáticamente de Pendientes/ a Aprobados/ en Drive con nombre normalizado.\n\nSi rechazas, debes escribir una nota — queda registrada como feedback para quien generó la imagen.',
    condition: 'none',
    buttonLabel: 'Entendido →',
  },

  // ── WORKFLOWS ────────────────────────────────────────────────────────────────
  {
    id: 'workflows-intro',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'happy',
    navDialogue: 'Hay una sección que todavía no te mostré: Workflows.\n\nEs el sistema de producción del estudio — 95 procesos documentados. Vamos.',
    dialogue: 'Bienvenido a Workflows — el sistema operativo de producción del estudio.\n\nAcá están los 95 procesos que usamos para hacer la serie, organizados en 10 fases que cubren todo el ciclo: desde la primera idea hasta el lanzamiento y la expansión de franquicia.\n\nNo son simples listas. Cada workflow tiene objetivo, pasos detallados, archivos de referencia y criterios de aprobación.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
    navLabel: 'Ir a Workflows →',
  },

  {
    id: 'workflows-phases',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="workflow-phases"]',
    bit: 'neutral',
    dialogue: 'En la barra superior tienes los filtros por fase.\n\nLas 10 fases de producción son:\n💡 Concepto — primeras ideas de la serie\n🏗️ Desarrollo — personajes, guiones, worldbuilding\n📐 Pre-Producción — diseños, storyboards, guía de estilo\n🎬 Producción — animación, audio, score\n✂️ Post-Producción — edición, color, mezcla\n🔍 Revisión — evaluación y aprobación de entregables\n🚀 Lanzamiento — estrategia y release\n🌎 Expansión — franquicia, merchandise, spin-offs\n🔄 Iteración — rediseñar, corregir, pivotar\n⚙️ Sistema — calibración y mantenimiento del propio StudioOS\n\nHaz clic en cualquier fase para filtrar. El buscador también funciona por nombre o descripción.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-card-anatomy',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="workflow-card"]',
    bit: 'surprised',
    dialogue: 'Cada card es un workflow.\n\nLo que ves en ella:\n• La franja de color arriba — identifica la fase de producción\n• El icono y nombre de la fase — para orientarte rápido\n• El título del workflow — qué proceso es exactamente\n• La descripción — qué problema resuelve y cuándo usarlo\n\nSon 95 en total. El buscador de arriba te ayuda a encontrar el que necesitas sin tener que revisar todos.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-use-button',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="workflow-use-btn"]',
    bit: 'surprised',
    dialogue: 'El botón ⚡ Usar Workflow es donde está la magia.\n\nCuando lo presionas, el sistema:\n1. Carga el contenido completo del workflow — todos sus pasos, objetivos y criterios\n2. Detecta automáticamente qué archivos de Knowledge necesita ese proceso\n3. Añade el contexto del estudio: estilo maestro, estado de personajes, estado de locaciones, Biblia viva\n\nTodo eso se arma en un prompt listo para ejecutar. No tienes que abrir ningún archivo manualmente.\n\nHaz clic en ⚡ Usar Workflow en cualquier card.',
    condition: 'event',
    conditionEvent: 'tutorial:workflow_opened',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-prompt-anatomy',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'neutral',
    dialogue: 'En el modal ves el prompt completo que se va a ejecutar.\n\nTiene 3 capas:\n\n📚 Knowledge — los archivos de referencia que la IA debe leer primero. Por ejemplo, si el workflow es de animación de diálogos, carga automáticamente los principios de actuación y staging.\n\n🗂 Contexto del sistema — los archivos vivos del estudio: estilo visual maestro, estado actual de cada personaje y locación, la Biblia viva. La IA recibe el canon completo antes de ejecutar.\n\n📋 El workflow completo — objetivo, pasos detallados, entregables y criterios de aprobación.\n\nCuando pegas esto en el asistente, ejecuta el proceso con toda la información correcta. Sin tener que ir a buscar nada.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'workflows-copy',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'happy',
    dialogue: 'Para usar el workflow, presiona "Copiar para el asistente".\n\nLuego ve al Asistente (/studio), pega el prompt y ejecuta.\n\nUn truco útil: si el workflow necesita un brief tuyo — por ejemplo "Diseñar un antagonista nuevo" — agrega tus notas al final del prompt antes de pegar. La IA tiene el proceso completo y tus instrucciones específicas al mismo tiempo.\n\nSi el workflow tiene pasos que generan imágenes, el sistema ya sabe qué archivos de memoria visual consultar. Sin inventar detalles.',
    condition: 'none',
    buttonLabel: '¡Listo!',
  },

  // ── AGENTES ──────────────────────────────────────────────────────────────────
  {
    id: 'agents-tab',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="agents-tab"]',
    bit: 'happy',
    navDialogue: 'En Workflows hay un tab que todavía no te mostré: el Equipo. Son los 32 agentes del estudio. Vamos.',
    dialogue: 'Dentro de Workflows hay un segundo tab: el Equipo.\n\nSon 32 agentes especializados — cada uno con un rol preciso, expertise definido y reglas estrictas sobre qué hace y qué NUNCA hace.\n\nHaz clic en el tab para explorarlos.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'agents-card',
    route: '/workflows',
    spotlightSelector: '[data-tutorial="agent-card"]',
    bit: 'surprised',
    dialogue: 'Cada card muestra el departamento, el rol del agente y con quién trabaja.\n\n"Ver perfil" abre la ficha completa: misión, especialización, colaboraciones, y lo que NUNCA hace — los límites son tan importantes como las capacidades.\n\n"Activar →" te lleva al Asistente con ese agente ya activado.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'agents-activate',
    route: '/workflows',
    spotlightSelector: null,
    bit: 'happy',
    dialogue: 'Y la combinación más poderosa:\n\nAbre cualquier workflow → en el modal verás chips de los agentes que pueden ejecutarlo → selecciona uno → el prompt incluye el perfil completo del agente arriba del workflow.\n\nLe pegas eso al Asistente y tienes el workflow ejecutado por el especialista correcto — no por el asistente genérico.',
    condition: 'none',
    buttonLabel: '¡Entendido!',
  },

  // ── SIDEBAR + CIERRE ─────────────────────────────────────────────────────────
  {
    id: 'sidebar',
    route: null,
    spotlightSelector: '[data-tutorial="sidebar"]',
    bit: 'neutral',
    dialogue: 'Ya conoces todo. El sidebar es tu mapa — desde acá navegas a cualquier sección en cualquier momento.\n\nCada sección tiene su asistente con el contexto especializado. Nunca más salgas de StudioOS para buscar información de Los Prodigios.',
    condition: 'none',
    buttonLabel: 'Siguiente →',
  },

  {
    id: 'done',
    route: null,
    spotlightSelector: null,
    bit: 'night',
    dialogue: '¡Eso es todo! Ya sabes moverte por completo.\n\nSi me necesitas de nuevo, estoy en el sidebar — "Tutorial Plataforma". Desde ahí puedes elegir repasar cualquier sección específica sin volver a ver todo.\n\nAhora voy a ver qué está haciendo Tito... seguro algo con datos que nadie más entiende. Bienvenido al equipo.',
    condition: 'none',
    buttonLabel: '¡Entendido!',
  },
]

// ── Tracks ────────────────────────────────────────────────────────────────────

export const TUTORIAL_TRACKS: TutorialTrack[] = [
  {
    id: 'full',
    label: 'Tutorial Completo',
    description: 'Recorrido por todas las secciones — ideal para nuevos integrantes del equipo.',
    icon: '🎬',
    color: '#F5A52A',
    stepIds: [
      'intro',
      'dashboard',
      'bible-open', 'bible-read', 'bible-template',
      'artwork-generate', 'artwork-result',
      'video-flow-intro', 'video-flow-platform', 'video-flow-antimorphing',
      'studio', 'studio-prompt-target', 'studio-canon',
      'continuity',
      'assets',
      'marketing',
      'episodes-grid', 'episodes-builder', 'episodes-overview', 'episodes-script', 'episodes-structure', 'episodes-ai', 'episodes-continuity-log',
      'approval-intro', 'approval-accordion', 'approval-entity-sheet', 'approval-upload', 'approval-seals',
      'workflows-intro', 'workflows-phases', 'workflows-card-anatomy', 'workflows-use-button', 'workflows-prompt-anatomy', 'workflows-copy',
      'agents-tab', 'agents-card', 'agents-activate',
      'sidebar',
      'done',
    ],
  },
  {
    id: 'bible',
    label: 'Biblia',
    description: 'Cómo navegar, editar y agregar documentos canónicos — incluyendo templates de personaje.',
    icon: '📖',
    color: '#C6952A',
    stepIds: ['bible-open', 'bible-read', 'bible-template'],
  },
  {
    id: 'artwork',
    label: 'Artwork Flow',
    description: 'Genera prompts de imagen con intención canónica usando el Artwork Flow.',
    icon: '🖼',
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
    id: 'studio',
    label: 'Asistente IA',
    description: 'Motor de prompts canónicos, verificación visual y modos especializados.',
    icon: '🧠',
    color: '#9B59B6',
    stepIds: ['studio', 'studio-prompt-target', 'studio-canon'],
  },
  {
    id: 'approval',
    label: 'Aprobación de Assets',
    description: 'Fichas de personaje, sellos de aprobación y flujo completo de doble revisión.',
    icon: '✓',
    color: '#4ECDC4',
    stepIds: ['approval-intro', 'approval-accordion', 'approval-entity-sheet', 'approval-upload', 'approval-seals'],
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
    id: 'continuity',
    label: 'Continuidad',
    description: 'El sistema que mantiene coherencia visual y narrativa en los 50 episodios.',
    icon: '🔗',
    color: '#E74C3C',
    stepIds: ['continuity'],
  },
  {
    id: 'workflows',
    label: 'Workflows',
    description: '95 procesos de producción en 10 fases — cómo usar el sistema para ejecutar cualquier tarea del estudio.',
    icon: '⚡',
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
    description: 'Los 32 agentes del estudio — explorar por departamento y combinarlos con workflows.',
    icon: '👥',
    color: '#F5A52A',
    stepIds: ['agents-tab', 'agents-card', 'agents-activate'],
  },
]
