// AUTO-GENERATED — DO NOT EDIT MANUALLY
// Source: StudioOS/Workflows/

export interface Workflow {
  id: string
  phase: string
  phaseName: string
  phaseIcon: string
  phaseColor: string
  title: string
  description: string
  content: string
  knowledgeRefs: string[]
}

export const WORKFLOWS: Workflow[] = [
  {
    id: 'comparar_conceptos',
    phase: '00_Concepto',
    phaseName: 'Concepto',
    phaseIcon: '💡',
    phaseColor: '#4ecdc4',
    title: 'Comparar Conceptos',
    description: 'Evaluar múltiples ideas de serie y seleccionar la más fuerte con criterios objetivos.',
    content: `# Comparar Conceptos

> Evaluar múltiples ideas de serie y seleccionar la más fuerte con criterios objetivos.

## Objetivo
Establecer un proceso sistemático para comparar varias ideas de serie, puntuar cada una en dimensiones clave y tomar una decisión informada sobre cuál merece los recursos de desarrollo del estudio.

## Cuándo usar este workflow
- Cuando el estudio tiene varias ideas en fase de concepto y debe elegir cuál desarrollar.
- Cuando un equipo creativo presenta múltiples propuestas y hay que priorizar.
- Cuando los recursos permiten desarrollar solo uno o dos proyectos simultáneamente.
- Cuando hay desacuerdo interno sobre qué idea tiene más potencial.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Produccion/pipeline.md\`

## Pasos

### Paso 1: Definir los criterios de evaluación
Antes de evaluar cualquier idea, establece los criterios y sus pesos. Criterios sugeridos: originalidad (¿qué tan fresca es la premisa?), profundidad narrativa (¿puede sostener temporadas?), potencial visual (¿es visualmente distintiva?), conexión emocional (¿el espectador va a sentir algo?), viabilidad de producción (¿podemos hacerla con nuestros recursos?), potencial comercial (¿hay mercado?), alineación con el estudio (¿es el tipo de proyecto que queremos hacer?). Asigna un peso de 1 a 3 a cada criterio según las prioridades actuales del estudio.

### Paso 2: Puntuar cada concepto
Para cada idea, asigna una puntuación de 1 a 5 en cada criterio. Hazlo con el equipo completo, no individualmente. Cada persona puntúa en silencio primero, luego se comparten las puntuaciones y se discuten las discrepancias. Las diferencias grandes (más de 2 puntos) indican que alguien ve algo que otros no ven, y esa conversación es valiosa. Documenta no solo la puntuación final sino los argumentos detrás de cada calificación.

### Paso 3: Identificar riesgos específicos
Para cada idea, lista los tres riesgos principales. Pueden ser narrativos ("el concepto se agota después de una temporada"), de producción ("requiere un estilo de animación que no dominamos"), comerciales ("el mercado está saturado de este tipo de serie") o de equipo ("nadie en el estudio tiene pasión por este proyecto"). Clasifica cada riesgo como mitigable o estructural. Los riesgos estructurales pesan más que los mitigables.

### Paso 4: Comparar potencial de franquicia
Evalúa cada idea por su capacidad de expansión. Crea una tabla con columnas: spin-offs posibles, potencial de merchandising, adaptabilidad a otros medios (videojuegos, libros, cómics), longevidad de la propiedad intelectual, potencial de comunidad de fans. No todas las ideas necesitan ser franquicias, pero en una comparación directa, el potencial de expansión puede ser el factor diferenciador.

### Paso 5: Test del elevator pitch
Pide a cada defensor de idea que la presente en 30 segundos. Sin preparación especial, sin apoyos visuales. La idea que se comunica mejor en 30 segundos suele ser la que tiene el concepto más claro y potente. Graba estas presentaciones si es posible. La claridad de comunicación de una idea es un indicador fuerte de su viabilidad comercial: si no puedes explicarla rápido, es difícil de vender.

### Paso 6: Análisis de alineación estratégica
Evalúa cómo cada idea se alinea con la dirección del estudio. Considera: ¿refuerza la identidad del estudio o la diluye? ¿Abre puertas a nuevos mercados o audiencias? ¿Complementa el catálogo existente? ¿El equipo actual tiene la experiencia y la pasión para ejecutarla? La mejor idea en abstracto puede no ser la mejor idea para este estudio en este momento.

### Paso 7: Deliberación y decisión final
Reúne al equipo con toda la información documentada. Presenta la matriz de puntuaciones, los riesgos, el análisis de franquicia y la alineación estratégica. Permite una ronda de argumentos a favor y en contra de cada idea. Vota si es necesario, pero el director creativo tiene la decisión final. Documenta la decisión, los motivos y qué pasa con las ideas no seleccionadas (archivo, desarrollo futuro, o descarte).

## Entregable
Un informe comparativo que incluya: tabla de puntuaciones ponderadas para cada idea, análisis de riesgos por concepto, evaluación de potencial de franquicia, resultado del test de elevator pitch, análisis de alineación estratégica, y la decisión final con su justificación completa. Las ideas no seleccionadas deben tener una nota sobre su destino.

## Criterios de aprobación
- [ ] Los criterios de evaluación fueron definidos antes de puntuar.
- [ ] Cada idea fue evaluada por al menos tres personas.
- [ ] Las discrepancias en puntuación fueron discutidas y documentadas.
- [ ] Los riesgos están clasificados como mitigables o estructurales.
- [ ] El análisis de alineación estratégica considera la dirección actual del estudio.
- [ ] La decisión final tiene justificación escrita.
- [ ] Las ideas no seleccionadas tienen un destino definido.

## Errores comunes en este proceso
- Definir los criterios después de ver las ideas, lo que introduce sesgo hacia la favorita.
- Permitir que la persona con más autoridad influya en las puntuaciones del grupo.
- Evaluar todas las ideas con el mismo peso en todos los criterios, ignorando las prioridades del momento.
- Descartar ideas con riesgos altos sin evaluar si esos riesgos son mitigables.
- Elegir la idea más segura en vez de la más prometedora por aversión al riesgo.
- No documentar por qué se descartaron las otras ideas, perdiendo aprendizaje valioso.
- Confundir la idea que mejor se presenta con la idea que mejor se ejecutará.
`,
    knowledgeRefs: ['Knowledge/Produccion/pipeline.md', 'Knowledge/Storytelling/tono.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'crear_pitch',
    phase: '00_Concepto',
    phaseName: 'Concepto',
    phaseIcon: '💡',
    phaseColor: '#4ecdc4',
    title: 'Crear Pitch',
    description: 'Desarrollar un pitch deck que venda la idea de serie en cinco minutos o menos.',
    content: `# Crear Pitch

> Desarrollar un pitch deck que venda la idea de serie en cinco minutos o menos.

## Objetivo
Construir una presentación concisa, persuasiva y visualmente atractiva que comunique la esencia de la serie a ejecutivos, productores o plataformas, generando interés suficiente para pasar a la siguiente fase de desarrollo.

## Cuándo usar este workflow
- Cuando una idea ha pasado la evaluación de viabilidad y está lista para presentarse.
- Cuando necesitas convencer a un estudio, plataforma o inversor de financiar el desarrollo.
- Cuando participas en un pitch festival o competencia de proyectos.
- Cuando un socio potencial pide un resumen ejecutivo del proyecto.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Produccion/pipeline.md\`

## Pasos

### Paso 1: Pulir el logline
El logline es la primera y última impresión. Debe ser una sola oración que contenga: el mundo, el protagonista (con su falla o situación), el objetivo, el obstáculo y una insinuación del tema. Evita nombres propios en el logline; usa descriptores ("una niña que puede escuchar los sueños de otros"). Pruébalo con cinco personas. Si necesitas explicar algo después de decirlo, el logline no funciona. Dedica el tiempo necesario hasta que sea perfecto.

### Paso 2: Escribir la sinopsis
Expande el logline en un párrafo de 100 a 150 palabras. La sinopsis debe cubrir: la situación inicial, el evento detonante, el conflicto central y la promesa emocional de la serie. No cuentes el final; deja un gancho que genere curiosidad. La sinopsis debe leerse como la contraportada de un libro: suficiente para enganchar, no tanto como para saciar. Escribe tres versiones y elige la más potente.

### Paso 3: Definir la audiencia con datos
Ve más allá del perfil emocional. Incluye datos de mercado: tamaño de la audiencia objetivo, tendencias de consumo en ese segmento, plataformas donde consume contenido, series exitosas en ese nicho y sus números cuando estén disponibles. Los ejecutivos necesitan ver que hay un mercado real. Presenta la audiencia como una oportunidad de negocio, no solo como un grupo demográfico.

### Paso 4: Crear resúmenes de personajes
Para cada personaje principal (máximo cuatro en el pitch), escribe un bloque de tres a cinco líneas que incluya: quién es, qué quiere, qué le impide conseguirlo y por qué el espectador va a conectar con esa persona. Acompaña cada resumen con una imagen de referencia o concept art si está disponible. Los personajes venden series más que las premisas; asegúrate de que sean irresistibles en el papel.

### Paso 5: Diseñar el mood board
Selecciona de ocho a doce imágenes que comuniquen el tono visual de la serie. Incluye: paleta de color dominante, estilo de personajes (referencias de otras series o arte conceptual), ambientes y escenarios clave, y al menos una imagen que capture el tono emocional. El mood board no necesita ser arte original; puede usar referencias visuales que comuniquen la dirección. Organízalo en una composición limpia, no en un collage caótico.

### Paso 6: Posicionamiento competitivo
Crea una diapositiva de "Si te gusta X, te encantará Y". Elige dos o tres series conocidas y exitosas y explica cómo tu serie se relaciona con cada una pero ofrece algo diferente. Ejemplo: "La emoción de Avatar con la intimidad emocional de Hilda." Esto ayuda al ejecutivo a ubicar la serie mentalmente y a imaginar su audiencia. No elijas comparaciones que hagan parecer a tu serie como derivada.

### Paso 7: Ejemplos de episodios
Escribe sinopsis breves (tres a cinco líneas) de tres episodios: el piloto, un episodio de mitad de temporada y el final de temporada. Esto demuestra que la serie tiene recorrido y que los episodios individuales son interesantes. El piloto muestra el gancho, el episodio medio muestra la variedad, el final muestra la escalada. No necesitas resolver todo; solo demostrar que hay material para una temporada completa.

### Paso 8: Ensamblar y ensayar
Organiza todo en un deck de 10 a 15 diapositivas máximo. Orden sugerido: portada con título y logline, sinopsis, audiencia, personajes, mood board, posicionamiento, ejemplos de episodios, equipo creativo, llamada a la acción. Ensaya la presentación cronometrando. Debe durar entre cuatro y cinco minutos hablados. Si necesitas más tiempo, estás incluyendo demasiado detalle. El pitch debe dejar al oyente con ganas de preguntar más, no saturado de información.

## Entregable
Un pitch deck de 10 a 15 diapositivas en formato presentación (PDF o Keynote/PowerPoint) acompañado de un documento de texto con el logline, la sinopsis, los resúmenes de personajes y las sinopsis de episodios. Todo listo para presentar sin preparación adicional.

## Criterios de aprobación
- [ ] El logline engancha sin necesidad de explicación adicional.
- [ ] La sinopsis genera curiosidad sin revelar todo.
- [ ] Los datos de audiencia incluyen información de mercado verificable.
- [ ] Cada personaje principal tiene un resumen claro y atractivo.
- [ ] El mood board comunica el tono visual de forma coherente.
- [ ] El posicionamiento competitivo usa comparaciones inteligentes sin ser derivativo.
- [ ] Los ejemplos de episodios demuestran variedad y recorrido.
- [ ] La presentación completa dura cinco minutos o menos.

## Errores comunes en este proceso
- Incluir demasiada información y convertir el pitch en una biblia resumida.
- Usar un logline que describe pero no vende.
- Presentar datos de audiencia genéricos que aplican a cualquier serie.
- Describir personajes por su aspecto en vez de por su conflicto interno.
- Crear un mood board sin coherencia visual, mezclando estilos incompatibles.
- Elegir comparaciones competitivas con series de nicho que el ejecutivo no conoce.
- No ensayar y exceder el tiempo asignado, perdiendo la atención del oyente.
- Olvidar la llamada a la acción: qué quieres que haga el oyente después del pitch.
`,
    knowledgeRefs: ['Knowledge/Characters/protagonistas.md', 'Knowledge/Characters/antagonistas.md', 'Knowledge/Produccion/pipeline.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Storytelling/tono.md'],
  },
  {
    id: 'evaluar_viabilidad',
    phase: '00_Concepto',
    phaseName: 'Concepto',
    phaseIcon: '💡',
    phaseColor: '#4ecdc4',
    title: 'Evaluar Viabilidad',
    description: 'Analizar si una idea tiene potencial narrativo, visual, comercial y de audiencia antes de invertir recursos.',
    content: `# Evaluar Viabilidad

> Analizar si una idea tiene potencial narrativo, visual, comercial y de audiencia antes de invertir recursos.

## Objetivo
Someter una idea de serie a un análisis riguroso en múltiples dimensiones para determinar si merece avanzar a desarrollo completo o si necesita ajustes fundamentales antes de continuar.

## Cuándo usar este workflow
- Después de completar el workflow de idea de serie y antes de crear un pitch.
- Cuando hay varias ideas compitiendo por recursos y necesitas filtrar.
- Cuando un ejecutivo o cliente propone un concepto y necesitas evaluar su potencial real.
- Cuando tienes dudas sobre si una idea tiene suficiente profundidad para sostener una serie.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Produccion/pipeline.md\`

## Pasos

### Paso 1: Test de profundidad narrativa
Evalúa si la idea puede sostener múltiples episodios y temporadas. Hazte estas preguntas: ¿El conflicto central puede escalar sin volverse repetitivo? ¿El protagonista tiene espacio para crecer a lo largo de temporadas? ¿El mundo permite generar historias nuevas sin forzar la premisa? Escribe un párrafo para cada pregunta. Si alguna respuesta es débil, marca la idea como narrativamente limitada y documenta qué le falta.

### Paso 2: Evaluación de potencial visual
Analiza qué ofrece la idea visualmente. ¿El mundo tiene una identidad visual distintiva? ¿Los personajes tienen potencial para diseños memorables? ¿Hay oportunidades para secuencias visualmente impactantes? Compara con series existentes en el mismo espacio visual: ¿tu idea ofrece algo que no se ha visto o una variación significativa? Documenta los elementos visuales clave y califica el potencial visual de 1 a 5.

### Paso 3: Análisis de potencial de franquicia
Determina si la idea puede extenderse más allá de la serie. Considera: ¿Los personajes funcionan en merchandising? ¿El mundo permite spin-offs, precuelas, secuelas? ¿Hay elementos que se presten a videojuegos, libros, experiencias interactivas? ¿La propiedad intelectual tiene valor a largo plazo? No toda serie necesita ser una franquicia, pero el potencial de expansión aumenta el valor comercial. Califica de 1 a 5.

### Paso 4: Ajuste con la audiencia objetivo
Verifica que la idea conecta con su audiencia definida. Investiga qué consume actualmente esa audiencia. ¿Tu idea llena un vacío o compite directamente con propiedades establecidas? ¿El tono y los temas son apropiados para la edad y el perfil emocional del espectador? Si es posible, presenta la idea brevemente a personas que representen la audiencia objetivo y documenta sus reacciones.

### Paso 5: Mapeo del panorama competitivo
Identifica las 5-8 series más relevantes que ocupan un espacio similar. Para cada una, documenta: qué hace bien, qué le falta, y cómo tu idea se diferencia. Busca el hueco en el mercado que tu serie puede llenar. Si no encuentras diferenciación clara, la idea necesita un ángulo más fuerte. Crea una tabla comparativa con las dimensiones clave: tema, tono, audiencia, estilo visual, plataforma.

### Paso 6: Evaluación de recursos necesarios
Estima qué requiere producir esta serie. Considera: complejidad de animación (2D simple, 2D complejo, 3D, mixto), cantidad de personajes recurrentes, complejidad de fondos y escenarios, necesidades de efectos especiales, duración y número de episodios. Compara los recursos necesarios con los recursos disponibles o potencialmente disponibles. Identifica los cuellos de botella más probables.

### Paso 7: Matriz de decisión final
Consolida todas las evaluaciones en una matriz. Asigna puntuación de 1 a 5 en cada dimensión: profundidad narrativa, potencial visual, potencial de franquicia, ajuste de audiencia, diferenciación competitiva, viabilidad de producción. Suma las puntuaciones. Define umbrales: 25-30 = luz verde, 18-24 = viable con ajustes, menor a 18 = replantear fundamentalmente. Documenta la recomendación final con justificación.

## Entregable
Un informe de viabilidad de dos a tres páginas que incluya: puntuación en cada dimensión con justificación, tabla comparativa con competidores, estimación de recursos, matriz de decisión final, y recomendación clara (avanzar, ajustar, o descartar) con los argumentos que la sostienen.

## Criterios de aprobación
- [ ] Cada dimensión tiene una evaluación con evidencia, no solo opinión.
- [ ] El análisis competitivo incluye al menos cinco series comparables.
- [ ] La estimación de recursos es realista y considera los cuellos de botella.
- [ ] La matriz de decisión tiene puntuaciones justificadas.
- [ ] La recomendación final es clara y argumentada.
- [ ] El informe identifica los riesgos principales y propone mitigaciones.
- [ ] Alguien que no conozca la idea puede entender el análisis completo.

## Errores comunes en este proceso
- Evaluar con sesgo de confirmación: querer que la idea funcione en vez de evaluarla honestamente.
- Ignorar el panorama competitivo y asumir que la idea es más original de lo que realmente es.
- Subestimar los recursos necesarios, especialmente en complejidad visual.
- Confundir potencial visual con potencial narrativo; una idea puede ser visualmente rica pero narrativamente vacía.
- No definir umbrales claros antes de evaluar, lo que permite mover los postes después.
- Evaluar el potencial de franquicia como requisito en vez de como bonus.
- No consultar a personas fuera del equipo creativo para obtener perspectiva externa.
`,
    knowledgeRefs: ['Knowledge/Characters/protagonistas.md', 'Knowledge/Produccion/pipeline.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Storytelling/tono.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'idea_de_serie',
    phase: '00_Concepto',
    phaseName: 'Concepto',
    phaseIcon: '💡',
    phaseColor: '#4ecdc4',
    title: 'Idea de Serie',
    description: 'De un concepto vago a una idea clara con tema, tono y gancho definidos.',
    content: `# Idea de Serie

> De un concepto vago a una idea clara con tema, tono y gancho definidos.

## Objetivo
Transformar una chispa creativa inicial en una idea de serie estructurada que tenga tema central, tono definido, gancho narrativo y una razón clara para existir como animación.

## Cuándo usar este workflow
- Cuando surge una idea nueva que quieres explorar formalmente.
- Cuando un miembro del equipo propone un concepto y necesita desarrollo.
- Cuando tienes un tema o emoción pero no una serie concreta.
- Cuando necesitas validar si una intuición creativa tiene sustancia suficiente para convertirse en proyecto.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Worldbuilding/reglas.md\`

## Pasos

### Paso 1: Lluvia de ideas libre
Escribe sin filtro todo lo que asocias con la idea. No juzgues, no ordenes. Anota imágenes, emociones, escenas sueltas, frases, personajes vagos, mundos posibles. Usa mínimo 15 minutos sin parar. El objetivo es volumen, no calidad. Guarda todo en un documento crudo que puedas revisar después.

### Paso 2: Definir el tema central
De todo lo que escribiste, identifica el tema subyacente. No es el argumento, sino la pregunta humana que la serie explora. Ejemplos: "¿Se puede ser bueno en un mundo corrupto?", "¿El talento justifica la crueldad?". Escríbelo como una pregunta temática y como una afirmación temática. Si no puedes articular el tema, la idea necesita más cocción.

### Paso 3: Identificar la audiencia
Define quién necesita escuchar esta historia. No basta con "niños 6-11". Describe al espectador ideal: qué siente, qué le falta, qué busca en una serie. Define el rango de edad, pero también el perfil emocional. Una serie para niños ansiosos es diferente de una serie para niños aventureros. La audiencia informa todas las decisiones posteriores.

### Paso 4: Pasar la prueba "¿Por qué animación?"
Hazte esta pregunta con honestidad: ¿esta idea necesita ser animada? Si la historia funciona igual en live-action, la animación es un formato, no una necesidad. Identifica qué elementos de la idea solo pueden existir en animación: transformaciones visuales, mundos imposibles, metáforas literales, exageración expresiva, abstracción emocional. Si no encuentras al menos tres razones fuertes, reconsidera el medio.

### Paso 5: Crear el logline
Escribe una oración que capture la serie entera. Estructura sugerida: "En [mundo], [protagonista con falla] debe [objetivo] mientras enfrenta [obstáculo], descubriendo que [tema]." El logline debe generar curiosidad, implicar conflicto y sugerir el tono. Itéralo mínimo cinco veces. Léelo en voz alta. Si no engancha al oírlo, reescríbelo.

### Paso 6: Definir el tono
Elige tres adjetivos que describan cómo se siente ver la serie. No qué pasa en ella, sino qué siente el espectador. Ejemplos: "melancólico, esperanzador, misterioso" o "frenético, absurdo, tierno". Verifica que los tres adjetivos conviven sin contradecirse. El tono guía la dirección de arte, la música, el ritmo de edición y el tipo de humor. Documenta también lo que la serie NO es en tono.

### Paso 7: Evaluar el núcleo emocional
Identifica la emoción primaria que la serie quiere provocar. No la emoción del personaje, sino la del espectador. ¿Quieres que sienta asombro? ¿Nostalgia? ¿Inquietud seguida de alivio? Define el arco emocional de un episodio típico: cómo empieza emocionalmente el espectador y cómo termina. Este arco emocional es la promesa de la serie al público.

## Entregable
Un documento de una a dos páginas que contenga: logline final, tema central (como pregunta y como afirmación), perfil de audiencia, tres adjetivos de tono, justificación de animación como medio, y descripción del núcleo emocional. Este documento es la semilla para el pitch y la biblia de serie.

## Criterios de aprobación
- [ ] El logline se entiende sin explicación adicional.
- [ ] El tema es universal pero tiene un ángulo específico.
- [ ] La audiencia está definida más allá de la demografía.
- [ ] Hay mínimo tres razones claras para que sea animación.
- [ ] Los adjetivos de tono son coherentes entre sí.
- [ ] El núcleo emocional está articulado de forma concreta.
- [ ] Alguien externo al proyecto puede leer el documento y entender la serie.

## Errores comunes en este proceso
- Confundir argumento con tema. El argumento es lo que pasa; el tema es de qué trata realmente.
- Definir la audiencia solo por edad, sin considerar el perfil emocional o cultural.
- Enamorarse de una premisa visual sin verificar que hay sustancia narrativa debajo.
- Escribir un logline que describe la serie en vez de venderla.
- Elegir adjetivos de tono genéricos como "divertido" o "emocionante" que no dicen nada específico.
- Saltarse la prueba de animación y asumir que todo funciona mejor animado.
- No iterar el logline suficientes veces; la primera versión casi nunca es la mejor.
`,
    knowledgeRefs: ['Knowledge/Worldbuilding/reglas.md', 'Knowledge/Storytelling/tono.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'arco_de_temporada',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Arco de Temporada',
    description: 'Planificar la progresión narrativa completa de una temporada con escalada, puntos de giro y arcos de personaje integrados.',
    content: `# Arco de Temporada

> Planificar la progresión narrativa completa de una temporada con escalada, puntos de giro y arcos de personaje integrados.

## Objetivo
Diseñar la estructura narrativa de una temporada entera para que cada episodio funcione individualmente y como parte de un todo progresivo, con una escalada de tensión que culmine en un clímax satisfactorio y un cierre que resuelva lo necesario y abra lo suficiente.

## Cuándo usar este workflow
- Cuando se planifica una nueva temporada desde cero.
- Cuando la temporada en desarrollo necesita reestructuración.
- Cuando se añade una temporada adicional a una serie ya existente.
- Cuando los episodios individuales funcionan pero la temporada no tiene arco claro.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Characters/protagonistas.md\`

## Pasos

### Paso 1: Definir el tema de la temporada
Cada temporada necesita su propio tema, una variación o profundización del tema general de la serie. Si la serie trata sobre la identidad, la temporada uno puede tratar sobre "descubrir quién eres" y la temporada dos sobre "defender quién eres ante la presión de cambiar". El tema de la temporada guía la selección de conflictos, la evolución de personajes y el tipo de resolución del final. Escríbelo como pregunta y como afirmación temática.

### Paso 2: Establecer el estado inicial
Describe cómo están el mundo y los personajes al comenzar la temporada. Para el protagonista: cuáles son sus creencias, relaciones y objetivo al inicio. Para el mundo: qué equilibrio existe (aunque sea frágil). Para la audiencia: qué promesa emocional hace el primer episodio. El estado inicial es el punto de contraste contra el cual se medirá todo el cambio de la temporada. Documentéalo con claridad porque todo lo que sigue se construye sobre esta base.

### Paso 3: Planificar los puntos de giro principales
Una temporada necesita mínimo tres puntos de giro estructurales. El primer giro (alrededor del episodio 3-4 de una temporada de 13) cambia la dirección del conflicto y eleva las apuestas. El giro de medio punto (episodios 6-7) redefine la comprensión del conflicto: lo que el protagonista creía que era el problema resulta ser algo diferente. El giro previo al clímax (episodio 10-11) pone al protagonista en su peor momento. Para cada giro define: qué cambia, qué pierde el protagonista, y qué nueva información o desafío aparece.

### Paso 4: Diseñar la escalada
Entre los puntos de giro, la tensión debe escalar progresivamente. Define la escalada en cuatro dimensiones: riesgo (qué se puede perder crece), alcance (el conflicto afecta a más personas o más territorio), intimidad (el conflicto se vuelve más personal), y complejidad (las decisiones se vuelven más difíciles moralmente). Crea una gráfica o tabla de tensión episodio por episodio. No toda dimensión escala en cada episodio, pero la tensión general nunca debe bajar sin una subida posterior mayor.

### Paso 5: Integrar los arcos de personaje
Para cada personaje principal, define su arco dentro de la temporada. ¿Dónde empieza emocionalmente y dónde termina? ¿Cuáles son los momentos clave de cambio? Los arcos de personaje deben sincronizarse con la estructura de la temporada: los puntos de giro de la trama deben coincidir con puntos de inflexión en los arcos personales. Si la trama gira pero los personajes no cambian, la historia se siente mecánica. Crea una tabla con columnas para cada personaje y filas para cada episodio, marcando los beats de su arco.

### Paso 6: Diseñar el clímax de temporada
El clímax es donde convergen todas las líneas: la trama principal, las subtramas, los arcos de personaje y el tema. Define: cuál es la confrontación central, qué decisión debe tomar el protagonista (y por qué es difícil), qué sacrificio se requiere, y cómo la resolución del clímax responde a la pregunta temática de la temporada. El clímax no tiene que ser una batalla; puede ser una conversación, una revelación o un acto de renuncia. Lo importante es que sea el momento de mayor intensidad emocional.

### Paso 7: Diseñar la resolución y apertura
Después del clímax, la temporada necesita un espacio de resolución. Define: qué queda resuelto definitivamente, qué queda diferente de como estaba al inicio, qué preguntas quedan abiertas para la siguiente temporada, y cuál es la imagen o momento final. La resolución debe ser satisfactoria (el espectador siente que la temporada valió la pena) y provocativa (el espectador quiere saber qué viene después). Si hay siguiente temporada, planta al menos una semilla visible y una semilla oculta.

### Paso 8: Crear el mapa episódico
Para cada episodio de la temporada, escribe: título provisional, logline de una línea, posición en el arco general (setup, escalada, giro, clímax, resolución), trama A y trama B, qué personajes son centrales, y el beat emocional principal. Este mapa es la vista panorámica que permite verificar que la temporada tiene ritmo, variedad y progresión. Revísalo como un todo antes de aprobar episodios individuales.

## Entregable
Un documento de arco de temporada de seis a diez páginas que incluya: tema de la temporada, estado inicial documentado, tres o más puntos de giro definidos con consecuencias, tabla de escalada por episodio, arcos de personaje sincronizados con la estructura, diseño del clímax con decisión central, plan de resolución y apertura, y mapa episódico completo con ficha por episodio.

## Criterios de aprobación
- [ ] El tema de la temporada es claro y diferente al de la serie general.
- [ ] Los puntos de giro cambian la dirección y las apuestas de forma significativa.
- [ ] La escalada es progresiva y medible en al menos dos dimensiones.
- [ ] Los arcos de personaje están sincronizados con los puntos de giro de la trama.
- [ ] El clímax confronta al protagonista con una decisión temáticamente relevante.
- [ ] La resolución cierra lo necesario y abre lo suficiente.
- [ ] El mapa episódico muestra variedad de tono y progresión de tensión.
- [ ] La temporada funciona como unidad narrativa completa.

## Errores comunes en este proceso
- Planificar solo la trama sin integrar los arcos de personaje, creando una temporada mecánica.
- No escalar suficiente entre puntos de giro, manteniendo la tensión plana.
- Diseñar un clímax que resuelve la trama pero no el tema.
- Dejar demasiado abierto al final, frustrando al espectador en vez de intrigarlo.
- No respetar los momentos de descanso entre escaladas, agotando al espectador.
- Planificar los episodios individualmente sin verificar que funcionan como temporada.
- Sincronizar todos los arcos de personaje al mismo ritmo, perdiendo variedad.
- No definir el estado inicial con claridad, haciendo imposible medir el cambio.
`,
    knowledgeRefs: ['Knowledge/Storytelling/tono.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'biblia_de_serie',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Biblia de Serie',
    description: 'El documento maestro que define absolutamente todo sobre la serie: narrativa, personajes, mundo, tono visual y sonoro.',
    content: `# Biblia de Serie

> El documento maestro que define absolutamente todo sobre la serie: narrativa, personajes, mundo, tono visual y sonoro.

## Objetivo
Crear el documento fundacional que sirve como referencia única para todo el equipo. La biblia de serie es el contrato creativo del proyecto: todo lo que está en ella es canon, y todo lo que no está requiere aprobación antes de añadirse.

## Cuándo usar este workflow
- Cuando una idea ha sido aprobada para desarrollo completo tras el pitch.
- Cuando el proyecto pasa de concepto a preproducción.
- Cuando se incorporan nuevos miembros al equipo y necesitan entender la serie.
- Cuando hay que actualizar la biblia por cambios aprobados en el desarrollo.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Characters/sidekicks.md\`
- \`Knowledge/Characters/mentor.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/culturas.md\`
- \`Knowledge/Worldbuilding/magia.md\`
- \`Knowledge/Produccion/pipeline.md\`

## Pasos

### Paso 1: Escribir la visión general de la serie
Redacta una página que capture la esencia completa de la serie. Incluye: logline, sinopsis expandida (300-500 palabras), tema central, tono (con los tres adjetivos definidos), audiencia objetivo, formato (duración de episodio, número de episodios por temporada), y la propuesta de valor única. Esta página es lo primero que alguien lee y debe transmitir la serie entera de forma clara y emocionante.

### Paso 2: Definir tema y tono en profundidad
Expande los adjetivos de tono en guías concretas. Define: qué tipo de humor se permite y cuál no, el nivel de violencia o conflicto apropiado, cómo se manejan los temas difíciles, el equilibrio entre ligereza y profundidad. Incluye ejemplos de escenas que capturan el tono correcto y contraejemplos de escenas que lo romperían. El tono es lo más difícil de mantener consistente entre escritores diferentes.

### Paso 3: Crear las biblias de personajes
Para cada personaje principal y secundario recurrente, documenta: nombre, edad, descripción física, personalidad (virtudes y defectos), deseo consciente, necesidad inconsciente, falla fundamental, arco de transformación, voz (cómo habla, muletillas, registro), relaciones con otros personajes, y función narrativa. Incluye al menos tres reacciones del personaje ante situaciones diferentes para ilustrar su personalidad. Los personajes principales necesitan una página completa cada uno.

### Paso 4: Documento de worldbuilding
Describe el mundo de la serie con suficiente detalle para que cualquier escritor pueda crear episodios en él. Incluye: reglas físicas del mundo (¿qué es posible y qué no?), geografía relevante, estructura social, tecnología o magia disponible, historia relevante, economía (si aplica), y las reglas de convivencia. Mapas y diagramas son bienvenidos. Distingue entre lo que el espectador sabe y lo que el equipo sabe pero la audiencia descubrirá después.

### Paso 5: Diseñar el arco de temporada
Planifica la progresión narrativa de la primera temporada completa. Define: el estado inicial del mundo y los personajes, los puntos de giro principales (mínimo tres), el clímax de temporada, y la resolución (que debe cerrar algo y abrir algo nuevo). Escribe un párrafo por episodio describiendo qué avanza en la trama principal, qué subtramas se desarrollan y cuál es el arco emocional del episodio.

### Paso 6: Breakdown de episodios
Para cada episodio de la temporada, crea una ficha que incluya: título provisional, logline del episodio, sinopsis de una a dos párrafos, personajes que aparecen, locaciones principales, trama A (principal) y trama B (secundaria), y el momento clave del episodio. Los primeros tres y los últimos dos episodios necesitan mayor detalle. Los episodios intermedios pueden tener fichas más breves pero deben mostrar progresión.

### Paso 7: Dirección visual
Define la identidad visual de la serie. Incluye: estilo de animación (referencias y justificación), paleta de color general y por personaje o locación, proporción de personajes, nivel de detalle de fondos, estilo de efectos especiales, y referencias visuales organizadas por categoría. Esta sección debe permitir que un director de arte entienda exactamente qué busca la serie visualmente sin ambigüedades.

### Paso 8: Dirección de audio
Define la identidad sonora. Incluye: estilo musical (géneros, instrumentos, referencias), cómo cambia la música según el tono de la escena, uso de silencio, estilo de diseño sonoro (realista, estilizado, abstracto), y guías para actuación de voz (registro, energía, naturalismo vs. caricatura). La dirección de audio es frecuentemente subestimada pero define tanto la experiencia como lo visual.

## Entregable
Un documento de 20 a 40 páginas que funcione como referencia completa del proyecto. Debe estar organizado con índice, ser buscable, y tener secciones claramente separadas. Incluye apéndices con referencias visuales, glosario de términos del mundo, y timeline de la historia. El documento debe existir en formato digital editable con control de versiones.

## Criterios de aprobación
- [ ] La visión general transmite la serie en una página.
- [ ] El tono está definido con ejemplos positivos y negativos.
- [ ] Cada personaje principal tiene una biblia completa de al menos una página.
- [ ] El worldbuilding tiene reglas claras y consistentes.
- [ ] El arco de temporada tiene progresión clara con puntos de giro definidos.
- [ ] Cada episodio tiene al menos una ficha básica.
- [ ] La dirección visual incluye referencias concretas y paletas de color.
- [ ] La dirección de audio define estilo musical y de actuación de voz.
- [ ] El documento tiene índice y es navegable.

## Errores comunes en este proceso
- Escribir la biblia como un documento literario en vez de como una herramienta de trabajo.
- Incluir demasiado detalle en worldbuilding que nunca aparecerá en pantalla.
- No definir el tono con suficiente especificidad, dejando espacio a interpretaciones contradictorias.
- Crear personajes con biografías extensas pero sin voz ni personalidad distinguible.
- Planificar el arco de temporada sin considerar que cada episodio necesita funcionar individualmente.
- Omitir la dirección de audio asumiendo que "ya se verá en producción".
- No actualizar la biblia cuando se toman decisiones que cambian elementos fundamentales.
- Hacerla tan larga que nadie la lee completa.
`,
    knowledgeRefs: ['Knowledge/Characters/sidekicks.md', 'Knowledge/Worldbuilding/magia.md', 'Knowledge/Characters/protagonistas.md', 'Knowledge/Characters/antagonistas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Produccion/pipeline.md', 'Knowledge/Storytelling/tono.md', 'Knowledge/Worldbuilding/culturas.md', 'Knowledge/Characters/mentor.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'crear_mentor',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Crear Mentor',
    description: 'Diseñar una figura guía con sabiduría auténtica, fallas humanas y un plan de salida de la narrativa.',
    content: `# Crear Mentor

> Diseñar una figura guía con sabiduría auténtica, fallas humanas y un plan de salida de la narrativa.

## Objetivo
Construir un personaje mentor que transmita conocimiento necesario para el protagonista, que tenga suficiente profundidad para ser interesante por derecho propio, y cuya presencia y eventual ausencia sirvan al arco del héroe.

## Cuándo usar este workflow
- Cuando la serie necesita un personaje que guíe al protagonista en su formación.
- Cuando el mundo de la serie tiene conocimiento especializado que alguien debe transmitir.
- Cuando el protagonista necesita una figura de autoridad a la que eventualmente superar.
- Cuando la estructura narrativa incluye un viaje del héroe clásico o una variación.

## Archivos de referencia
- \`Knowledge/Characters/mentor.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Definir el dominio de sabiduría
¿Qué sabe el mentor que el protagonista necesita aprender? No se trata solo de habilidades técnicas (pelear, usar magia); lo más importante es la sabiduría temática que conecta con la necesidad del protagonista. Si el protagonista necesita aprender que la fuerza verdadera viene de la vulnerabilidad, el mentor debe encarnar esa lección de alguna forma. Define tanto lo que enseña intencionalmente como lo que enseña sin querer a través de su ejemplo.

### Paso 2: Crear la falla del mentor
Un mentor perfecto es aburrido y deshonesto. Define qué le falta al mentor, qué lección él mismo no ha aprendido, o qué error del pasado carga. La falla del mentor puede ser: conocimiento incompleto que lo lleva a enseñar mal una cosa crucial, un pecado pasado que compromete su autoridad moral, rigidez que le impide adaptarse, o miedo a repetir un fracaso con un alumno anterior. La falla del mentor es lo que hace que eventualmente el protagonista deba separarse de él.

### Paso 3: Planificar la partida
Todo mentor debe eventualmente salir de escena para que el protagonista crezca. La partida puede ser: muerte (el recurso más usado y a veces el más poderoso), traición (el mentor revela una agenda oculta), fracaso (el mentor no puede resolver la crisis y el alumno debe superarlo), retiro (el mentor reconoce que ya no es necesario), o transformación (el mentor se convierte en algo diferente). Elige el tipo de partida, planifica el momento en la temporada, y define qué efecto tiene en el protagonista.

### Paso 4: Diseñar el estilo de enseñanza
¿Cómo transmite el mentor su conocimiento? ¿Es directo y didáctico o críptico y enigmático? ¿Usa la experiencia práctica o la reflexión teórica? ¿Es paciente o exigente? ¿Premia el éxito o castiga el error? ¿Enseña con palabras o con acciones? El estilo de enseñanza define la dinámica entre mentor y alumno y genera oportunidades de humor, frustración y revelación. Escribe tres escenas breves de enseñanza que ilustren el estilo.

### Paso 5: Crear la historia de fondo
El mentor tiene un pasado que explica quién es. ¿Fue héroe antes? ¿Fracasó en una misión importante? ¿Perdió a un alumno anterior? ¿Renunció al poder voluntariamente? Su historia de fondo informa su motivación para mentorear: ¿busca redención, legado, protección, o evitar que se repita su error? Decide cuánto de su pasado se revela y cuándo. Las revelaciones sobre el mentor pueden ser puntos de giro poderosos en la serie.

### Paso 6: Definir los límites del mentor
El mentor no puede ser todopoderoso ni omnisciente. Define qué no sabe, qué no puede hacer, y dónde su sabiduría tiene puntos ciegos. Estos límites son cruciales: crean espacio para que el protagonista contribuya, generan tensión cuando surgen desafíos fuera del dominio del mentor, y hacen que la eventual partida sea narrativamente orgánica en vez de artificial.

### Paso 7: Diseño visual y presencia
El mentor visualmente debe comunicar experiencia y autoridad pero también su falla. Si es un mentor físicamente poderoso con un pasado de violencia, las cicatrices o el desgaste pueden ser visibles. Si es un mentor intelectual con rigidez emocional, su diseño puede ser rígido y controlado. La presencia física del mentor en la pantalla debe sentirse diferente a la de otros personajes: ocupa el espacio de manera distinta, se mueve con un ritmo propio.

## Entregable
Un perfil de mentor de dos a tres páginas que incluya: dominio de sabiduría con conexión temática, falla documentada con impacto en la narrativa, plan de partida con momento y consecuencias, estilo de enseñanza con escenas ejemplo, historia de fondo con plan de revelación, límites definidos, y hojas de diseño visual con notas sobre presencia.

## Criterios de aprobación
- [ ] El dominio de sabiduría conecta directamente con la necesidad del protagonista.
- [ ] La falla del mentor es específica y tiene consecuencias en la historia.
- [ ] La partida está planificada con tipo, momento y efecto en el protagonista.
- [ ] El estilo de enseñanza tiene escenas ejemplo que lo ilustran.
- [ ] La historia de fondo explica la motivación del mentor para enseñar.
- [ ] Los límites del mentor crean espacio narrativo para el protagonista.
- [ ] El diseño visual comunica tanto la autoridad como la falla.

## Errores comunes en este proceso
- Crear un mentor sin fallas que se siente como un dispositivo expositivo con patas.
- No planificar la partida, dejando al mentor activo tanto tiempo que el protagonista nunca crece.
- Hacer que la muerte del mentor se sienta manipulativa en vez de orgánica.
- Dar al mentor un estilo de enseñanza críptico que confunde al espectador además del protagonista.
- No conectar la sabiduría del mentor con el tema central de la serie.
- Crear una historia de fondo tan elaborada que el mentor se roba la serie.
- Olvidar que el mentor también tiene vida fuera de su relación con el alumno.
- Diseñar la partida sin planificar el eco: cómo las enseñanzas del mentor resuenan después de su salida.
`,
    knowledgeRefs: ['Knowledge/Characters/mentor.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'crear_sidekick',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Crear Sidekick',
    description: 'Diseñar un compañero que complemente al protagonista en personalidad, habilidades y función narrativa.',
    content: `# Crear Sidekick

> Diseñar un compañero que complemente al protagonista en personalidad, habilidades y función narrativa.

## Objetivo
Crear un personaje acompañante que enriquezca al protagonista por contraste, que aporte una perspectiva diferente al espectador, y que tenga suficiente personalidad propia para no ser simplemente un accesorio del héroe.

## Cuándo usar este workflow
- Cuando el protagonista necesita un compañero de aventuras.
- Cuando la serie requiere un personaje que humanice o cuestione al protagonista.
- Cuando necesitas un vehículo para exponer información de forma natural.
- Cuando el protagonista es demasiado serio o demasiado cómico y necesita un contrapeso.

## Archivos de referencia
- \`Knowledge/Characters/sidekicks.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Storytelling/tono.md\`

## Pasos

### Paso 1: Definir la función principal del sidekick
Un sidekick puede cumplir múltiples funciones, pero necesita una principal. Las funciones comunes son: ancla emocional (mantiene al protagonista conectado con la realidad), espejo cómico (aporta humor que el protagonista no puede), voz del espectador (hace las preguntas que la audiencia tiene), competencia complementaria (puede hacer lo que el protagonista no), y conciencia moral (cuestiona las decisiones del héroe). Elige una función principal y máximo una secundaria. Documenta por qué esa función es necesaria para la serie.

### Paso 2: Crear el contraste con el protagonista
Identifica las tres dimensiones principales del protagonista y diseña al sidekick como contraste en al menos dos de ellas. Si el protagonista es impulsivo, el sidekick puede ser cauteloso. Si el protagonista es serio, el sidekick puede ser ligero. Si el protagonista es solitario, el sidekick puede ser social. El contraste no significa opuesto absoluto; puede ser una diferencia de grado. Crea una tabla de contraste con las dimensiones clave y documenta dónde contrastan y dónde coinciden.

### Paso 3: Darle objetivos propios
Un sidekick sin deseos propios es un accesorio. Define qué quiere el sidekick independientemente del protagonista. Su objetivo puede estar relacionado con la aventura compartida pero desde un ángulo diferente. Puede querer algo que el protagonista no le puede dar. Puede tener un conflicto personal que se desarrolla en segundo plano. Estos objetivos propios son los que le dan dignidad como personaje y evitan que exista solo para servir al héroe.

### Paso 4: Crear una voz distintiva
El sidekick necesita hablar de forma diferente al protagonista. Define su registro lingüístico, su sentido del humor, sus muletillas, y su forma de expresar emociones. Escribe un diálogo de diez líneas entre protagonista y sidekick. Si pudieras intercambiar las líneas y nadie notaría la diferencia, la voz del sidekick no es suficientemente distintiva. El sidekick frecuentemente tiene la voz más memorable de la serie porque tiene más libertad expresiva que el protagonista.

### Paso 5: Diseñar el complemento visual
Visualmente, el sidekick debe complementar al protagonista sin competir con él. Si el protagonista es alto, el sidekick puede ser bajo. Si el protagonista tiene formas angulares, el sidekick puede ser redondeado. La paleta de color debe ser armónica pero diferente: pueden compartir un color en común que los conecte visualmente como dupla. Crea hojas de diseño que muestren a ambos personajes juntos en diferentes poses y situaciones para verificar que funcionan como par visual.

### Paso 6: Definir la relación y su evolución
Documenta cómo es la relación al inicio de la serie: ¿se conocen ya o se están conociendo? ¿Hay confianza o desconfianza? ¿Uno admira al otro o son iguales? Luego planifica cómo evoluciona la relación a lo largo de la temporada. Toda buena relación entre protagonista y sidekick tiene al menos un momento de crisis donde la lealtad se pone a prueba. Planifica ese momento y cómo se resuelve.

### Paso 7: Test de independencia
Escribe una escena donde el sidekick está solo, sin el protagonista. ¿El personaje sigue siendo interesante? ¿Tiene cosas que hacer y decir? ¿El espectador se quedaría viendo una escena solo con el sidekick? Si la respuesta es no, el personaje depende demasiado del protagonista y necesita más profundidad. Un buen sidekick podría sostener un episodio centrado en él.

## Entregable
Un perfil de sidekick de dos a tres páginas que incluya: función principal definida, tabla de contraste con el protagonista, objetivos personales, guía de voz con ejemplos de diálogo, hojas de diseño visual como complemento del protagonista, plan de evolución de la relación, y la escena de test de independencia escrita.

## Criterios de aprobación
- [ ] La función del sidekick en la serie está clara y justificada.
- [ ] El contraste con el protagonista está documentado en al menos dos dimensiones.
- [ ] El sidekick tiene objetivos propios independientes del protagonista.
- [ ] La voz es distinguible en diálogo sin acotaciones.
- [ ] El diseño visual complementa al protagonista sin competir.
- [ ] La relación tiene un plan de evolución con al menos un momento de crisis.
- [ ] La escena de independencia demuestra que el personaje funciona solo.

## Errores comunes en este proceso
- Crear un sidekick que solo existe para hacer chistes o para necesitar rescate.
- No darle objetivos propios, convirtiéndolo en un satélite del protagonista.
- Hacer al sidekick tan interesante que opaca al protagonista.
- Diseñar el contraste de forma tan extrema que la relación no es creíble.
- Usar al sidekick solo como dispositivo expositivo que hace preguntas para que el protagonista explique el mundo.
- No planificar la evolución de la relación, dejándola estática toda la serie.
- Darle una voz que es simplemente "la versión graciosa" de la voz del protagonista.
- Olvidar que el sidekick también necesita momentos vulnerables y genuinos.
`,
    knowledgeRefs: ['Knowledge/Storytelling/tono.md', 'Knowledge/Characters/sidekicks.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'disenar_antagonista',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Diseñar Antagonista',
    description: 'Crear un antagonista con motivación propia, visión de mundo coherente y función narrativa clara como espejo del protagonista.',
    content: `# Diseñar Antagonista

> Crear un antagonista con motivación propia, visión de mundo coherente y función narrativa clara como espejo del protagonista.

## Objetivo
Diseñar un antagonista que no sea simplemente un obstáculo, sino un personaje completo con su propia lógica interna, que desafíe al protagonista en el nivel temático y que haga la historia más rica por su presencia.

## Cuándo usar este workflow
- Cuando se necesita el antagonista principal de la serie o temporada.
- Cuando el villano actual se siente genérico o unidimensional.
- Cuando se introduce un nuevo antagonista para una nueva temporada o arco.
- Cuando el conflicto de la serie carece de tensión porque la amenaza no es convincente.

## Archivos de referencia
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Definir la visión de mundo del antagonista
Todo buen antagonista cree que tiene razón. Define qué cree el antagonista sobre cómo debería funcionar el mundo y por qué esa creencia es comprensible aunque sea errónea o extrema. Escribe un párrafo desde la perspectiva del antagonista donde explique y justifique sus acciones. Si no puedes hacer que suene razonable desde su punto de vista, el personaje necesita más desarrollo. La clave es que el espectador pueda pensar "entiendo por qué piensa así, aunque no esté de acuerdo."

### Paso 2: Construir el espejo con el protagonista
El antagonista funciona mejor cuando refleja una versión distorsionada del protagonista. Identifica qué comparten: pueden tener el mismo objetivo por razones diferentes, la misma herida con respuestas opuestas, o la misma capacidad usada para fines contrarios. Documenta explícitamente: qué tienen en común, en qué punto divergen, y qué decisión diferente tomó cada uno ante una encrucijada similar. Esta relación de espejo es lo que hace que el conflicto sea temático y no solo físico.

### Paso 3: Diseñar la escalada de amenaza
Planifica cómo el antagonista se vuelve más peligroso a lo largo de la temporada. La amenaza debe escalar en capas: primero amenaza los objetivos del protagonista, luego sus relaciones, luego sus creencias, y finalmente su identidad. Para cada nivel de escalada, define qué acción toma el antagonista y qué costo tiene para el protagonista. La escalada no siempre es de poder; puede ser de manipulación, de proximidad emocional, o de exposición de verdades incómodas.

### Paso 4: Crear la motivación profunda
Detrás de la visión de mundo hay una herida, una pérdida o una experiencia formativa. Define el evento o circunstancia que convirtió al antagonista en quien es. Esta motivación no justifica sus acciones pero las explica. Decide cuánto de esta historia de fondo conoce el espectador y cuándo se revela. La revelación de la motivación del antagonista suele ser uno de los momentos más poderosos de una serie si se maneja bien.

### Paso 5: Definir la voz y presencia
El antagonista necesita una forma de hablar y de estar en el espacio que lo distinga. ¿Es elocuente o lacónico? ¿Su presencia llena la habitación o es inquietantemente silenciosa? ¿Es carismático o intimidante? ¿Usa la cortesía como arma o es abiertamente hostil? Escribe cinco líneas de diálogo características y describe cómo entra a una habitación. La forma en que el antagonista se presenta es tan importante como lo que hace.

### Paso 6: Diseño visual como contraste al héroe
El diseño visual del antagonista debe funcionar en relación al protagonista. Si el héroe usa formas redondeadas, el antagonista puede usar angulares. Si el héroe tiene colores cálidos, el antagonista puede tener fríos. Pero evita el contraste obvio y busca contrastes más sutiles que reflejen la relación temática. La silueta del antagonista debe ser tan reconocible como la del protagonista. Crea hojas de diseño que muestren a ambos personajes juntos para verificar que el contraste funciona.

### Paso 7: Planificar el arco del antagonista
Incluso el antagonista necesita un arco. Puede escalar en poder y perder humanidad, puede revelar capas de complejidad, o puede tener un momento de duda que lo humanice. Define cómo está el antagonista al principio de la temporada y cómo está al final. ¿Se redime, se destruye, escapa, o se transforma en algo peor? Su arco debe complementar y desafiar el arco del protagonista.

## Entregable
Una biblia de antagonista de dos a cuatro páginas que incluya: visión de mundo documentada, análisis de la relación espejo con el protagonista, plan de escalada de amenaza, motivación profunda con plan de revelación, guía de voz y presencia, hojas de diseño visual con contraste al héroe, y arco del antagonista para la temporada.

## Criterios de aprobación
- [ ] La visión de mundo del antagonista es comprensible aunque errónea.
- [ ] La relación de espejo con el protagonista está documentada con puntos específicos.
- [ ] La escalada de amenaza tiene al menos cuatro niveles definidos.
- [ ] La motivación profunda explica (sin justificar) las acciones del antagonista.
- [ ] La voz es distinguible y tiene ejemplos de diálogo concretos.
- [ ] El diseño visual contrasta con el protagonista de forma intencional.
- [ ] El arco del antagonista está planificado para la temporada completa.
- [ ] El antagonista no es simplemente "malvado" sino complejo.

## Errores comunes en este proceso
- Crear un antagonista malvado sin motivación comprensible, reducido a un obstáculo genérico.
- Hacer al antagonista más interesante que al protagonista, robándole la serie.
- Diseñar la escalada de amenaza solo en términos de poder físico, ignorando la amenaza emocional y temática.
- Revelar la motivación del antagonista demasiado pronto, perdiendo el misterio, o demasiado tarde, cuando ya no importa.
- Usar el contraste visual más obvio posible (héroe de blanco, villano de negro) sin sutileza.
- No conectar el conflicto del antagonista con el tema central de la serie.
- Olvidar que el antagonista también tiene relaciones, rutinas y momentos de humanidad.
`,
    knowledgeRefs: ['Knowledge/Characters/antagonistas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'disenar_culturas',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Diseñar Culturas',
    description: 'Crear sociedades con valores propios, conflictos internos, estética definida y conexión orgánica con la historia de la serie.',
    content: `# Diseñar Culturas

> Crear sociedades con valores propios, conflictos internos, estética definida y conexión orgánica con la historia de la serie.

## Objetivo
Diseñar culturas ficticias que se sientan vivas y tridimensionales, que tengan coherencia interna, que generen conflictos narrativos de forma orgánica y que enriquezcan el mundo de la serie más allá de lo decorativo.

## Cuándo usar este workflow
- Cuando el mundo de la serie incluye una o más sociedades ficticias.
- Cuando se introduce una nueva cultura en una temporada posterior.
- Cuando una cultura existente se siente superficial o estereotipada.
- Cuando el conflicto entre culturas es central para la trama.

## Archivos de referencia
- \`Knowledge/Worldbuilding/culturas.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/economia.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Definir los valores centrales
Toda cultura se organiza alrededor de lo que considera importante. Define los tres valores principales de la sociedad. Pueden ser: honor, conocimiento, libertad, comunidad, tradición, innovación, fuerza, armonía, justicia, prosperidad. Los valores no son decorativos: determinan qué se premia, qué se castiga, qué se enseña a los niños y por qué se va a la guerra. Documenta cómo cada valor se manifiesta en la vida cotidiana de esa cultura.

### Paso 2: Crear la vida cotidiana
¿Cómo es un día normal para un ciudadano común de esta cultura? Define: qué comen y cómo obtienen alimento, cómo son las viviendas, qué hacen para ganarse la vida, qué hacen en su tiempo libre, cómo se relacionan en familia, y cuáles son sus aspiraciones típicas. La vida cotidiana es el suelo sobre el que se construye todo lo demás. Si no puedes describir un martes normal, no conoces la cultura lo suficiente.

### Paso 3: Diseñar los conflictos internos
Ninguna cultura real es homogénea, y las ficticias tampoco deben serlo. Define al menos dos tensiones internas: puede ser entre generaciones (tradición versus cambio), entre clases (ricos versus pobres), entre ideologías (conservadores versus progresistas), o entre regiones (centro versus periferia). Estos conflictos internos son fuentes de narrativa: personajes de la misma cultura pueden estar en lados opuestos de una grieta social.

### Paso 4: Establecer rituales y tradiciones
Los rituales marcan los momentos importantes de la vida en una cultura: nacimiento, paso a la adultez, matrimonio, muerte, cambio de estaciones, victorias, derrotas. Diseña al menos tres rituales significativos. Para cada uno define: qué se celebra o marca, qué se hace, quién participa, qué simboliza, y qué pasa si alguien no lo cumple. Los rituales son oportunidades visuales extraordinarias en animación y momentos reveladores de personaje.

### Paso 5: Definir la estética cultural
¿Cómo se ve esta cultura? Define: colores predominantes en vestimenta y arquitectura (con justificación: ¿usan pigmentos locales, colores simbólicos?), motivos decorativos recurrentes (patrones, símbolos), materiales de construcción y fabricación, y cómo se distingue visualmente un miembro de esta cultura de otros. La estética debe derivarse lógicamente de los valores, la geografía y la historia de la cultura, no imponerse arbitrariamente.

### Paso 6: Diseñar la relación con otras culturas
¿Cómo ve esta cultura al resto del mundo? Para cada cultura vecina o relevante, define: la percepción mutua (respeto, desprecio, curiosidad, miedo), el tipo de relación (alianza, rivalidad, comercio, aislamiento), los puntos de fricción, y las áreas de intercambio cultural. Las relaciones entre culturas generan conflictos a escala macro que pueden durar temporadas enteras.

### Paso 7: Conectar la cultura con la historia de la serie
Verifica que la cultura no sea solo decorado. Para cada aspecto cultural definido, identifica cómo afecta a la narrativa: ¿qué conflictos genera? ¿Qué obstáculos crea para los personajes? ¿Qué oportunidades narrativas abre? Si un aspecto cultural no tiene impacto narrativo, evalúa si es necesario o si solo ocupa espacio en el documento. La cultura debe servir a la historia, no competir con ella por atención.

## Entregable
Un perfil cultural de tres a cinco páginas por cultura que incluya: valores centrales con manifestaciones cotidianas, descripción de vida cotidiana, conflictos internos mapeados, al menos tres rituales detallados, guía estética con referencias visuales, mapa de relaciones con otras culturas, y conexiones explícitas con la narrativa de la serie.

## Criterios de aprobación
- [ ] Los valores centrales están definidos y se manifiestan en la vida cotidiana.
- [ ] La vida cotidiana está descrita con suficiente detalle para visualizar un día normal.
- [ ] Hay al menos dos conflictos internos documentados con facciones identificadas.
- [ ] Al menos tres rituales están diseñados con simbolismo y función narrativa.
- [ ] La estética cultural tiene justificación interna, no es arbitraria.
- [ ] Las relaciones con otras culturas están mapeadas con fricciones y conexiones.
- [ ] Cada aspecto cultural tiene conexión con la narrativa de la serie.
- [ ] La cultura no se reduce a un solo rasgo o estereotipo.

## Errores comunes en este proceso
- Crear culturas basadas en un solo rasgo ("la cultura guerrera", "la cultura pacífica").
- Copiar culturas reales sin transformación, cayendo en estereotipos o apropiación.
- No incluir conflictos internos, presentando sociedades donde todos piensan igual.
- Diseñar rituales visualmente interesantes pero narrativamente irrelevantes.
- Definir la estética sin justificación cultural, haciendo que los colores y formas sean arbitrarios.
- Crear culturas aisladas que no interactúan entre sí, perdiendo oportunidades de conflicto.
- Desarrollar la cultura en excesivo detalle en áreas que nunca aparecerán en pantalla.
- No verificar que la cultura sirve a la historia, creando worldbuilding que distrae en vez de enriquecer.
`,
    knowledgeRefs: ['Knowledge/Storytelling/estructura.md', 'Knowledge/Worldbuilding/economia.md', 'Knowledge/Worldbuilding/culturas.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'disenar_elenco',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Diseñar Elenco',
    description: 'Construir un elenco equilibrado con dinámicas claras, contraste visual y funciones narrativas complementarias.',
    content: `# Diseñar Elenco

> Construir un elenco equilibrado con dinámicas claras, contraste visual y funciones narrativas complementarias.

## Objetivo
Crear un conjunto de personajes que funcionen como sistema: cada uno aporta algo único, las relaciones entre ellos generan conflicto y humor orgánicamente, y el grupo completo es mayor que la suma de sus partes.

## Cuándo usar este workflow
- Después de diseñar protagonista y antagonista, cuando se construye el resto del elenco.
- Cuando el elenco actual se siente desequilibrado o redundante.
- Cuando se expande el elenco para una nueva temporada.
- Cuando hay personajes que no aportan suficiente al conjunto.

## Archivos de referencia
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Characters/sidekicks.md\`
- \`Knowledge/Characters/mentor.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Definir los roles narrativos necesarios
Antes de crear personajes, identifica qué funciones necesita la serie. Roles comunes: protagonista, antagonista, aliado/sidekick, mentor, interés romántico, rival amistoso, cómico, informante del mundo, voz de la razón, comodín impredecible. No toda serie necesita todos los roles. Lista los roles necesarios para tu historia específica y define qué aporta cada rol a la narrativa. Un personaje puede cumplir dos roles, pero más de dos lo sobrecarga.

### Paso 2: Asegurar contraste entre personajes
Para cada par de personajes que interactúen frecuentemente, define en qué contrastan. El contraste puede ser de personalidad (optimista/pesimista), de método (impulsivo/calculador), de valores (lealtad/independencia), o de estilo (serio/cómico). Crea una tabla de contraste donde cada fila es una dimensión y cada columna es un personaje. Ninguna columna debe ser idéntica a otra. Si dos personajes son demasiado similares, elimina uno o rediseña para diferenciarlo.

### Paso 3: Mapear las relaciones
Dibuja un diagrama de relaciones donde cada personaje es un nodo y cada línea es una relación. Etiqueta cada línea con: el tipo de relación (amistad, rivalidad, tensión, dependencia), lo que cada personaje quiere del otro, y la fuente de conflicto entre ellos. Toda relación debe tener potencial de conflicto, incluso las amistades. Verifica que no haya personajes aislados sin conexiones significativas con el grupo.

### Paso 4: Verificar variedad visual
Coloca las siluetas de todos los personajes juntas. ¿Son distinguibles sin color? Verifica variedad en: tamaño y proporciones, formas dominantes, posturas, paletas de color. El espectador debe poder identificar cada personaje a distancia, en miniatura, y en blanco y negro. Si dos personajes son visualmente similares, rediseña al menos uno. Crea una hoja de line-up con todos los personajes juntos a escala.

### Paso 5: Verificar variedad de personalidad
Asigna a cada personaje un perfil de personalidad usando opuestos: introvertido/extrovertido, emocional/racional, optimista/pesimista, líder/seguidor, impulsivo/cauteloso. Ningún personaje debe tener el mismo perfil que otro. Verifica que hay diversidad de perspectivas: si todos los personajes reaccionan igual ante un problema, el elenco es monótono. Plantea una situación de crisis hipotética y escribe cómo reaccionaría cada personaje. Las reacciones deben ser todas diferentes.

### Paso 6: Asignar funciones de género y episodio
Define qué personajes son esenciales en cada episodio y cuáles rotan. No todos los personajes necesitan aparecer en todos los episodios. Identifica combinaciones de personajes que generan dinámicas particularmente interesantes y planifica episodios que exploten esas combinaciones. Define también qué personaje aporta qué género a la serie: quién trae el humor, quién trae la tensión, quién trae la emoción, quién trae la acción.

### Paso 7: Test de dinámica de grupo
Escribe una escena corta donde todos los personajes principales estén en la misma habitación discutiendo un problema. ¿Cada uno reacciona de forma distinta? ¿Hay alianzas naturales y desacuerdos naturales? ¿La escena tiene energía y variedad tonal? Si la escena se siente monótona o si algunos personajes no tienen nada que decir, esos personajes necesitan más desarrollo o deben ser reconsiderados.

## Entregable
Un documento de elenco que incluya: lista de roles narrativos con justificación, tabla de contraste entre personajes, diagrama de relaciones anotado, hoja de line-up visual, perfiles de personalidad comparativos, plan de rotación por episodio, y la escena de test de dinámica grupal. Todo en un formato que permita consulta rápida durante la escritura de guiones.

## Criterios de aprobación
- [ ] Cada personaje tiene un rol narrativo claro y único.
- [ ] No hay dos personajes con el mismo perfil de personalidad.
- [ ] Todas las siluetas son distinguibles en negro sólido.
- [ ] Cada relación tiene una fuente de conflicto definida.
- [ ] La escena de test grupal demuestra dinámicas variadas y orgánicas.
- [ ] Hay diversidad visual verificable en el line-up.
- [ ] Cada personaje tiene al menos dos relaciones significativas con otros del elenco.
- [ ] El elenco completo cubre las necesidades narrativas de la serie.

## Errores comunes en este proceso
- Crear personajes individualmente brillantes que no funcionan juntos como grupo.
- Tener dos personajes que cumplen la misma función narrativa.
- Diseñar visualmente sin considerar cómo se ven todos juntos.
- Hacer que todas las relaciones sean positivas, eliminando fuentes de conflicto interno.
- Tener un elenco tan grande que ningún personaje tiene suficiente tiempo en pantalla.
- No planificar combinaciones de personajes para episodios específicos.
- Crear un elenco donde todos son excéntricos y no hay ancla emocional.
- Olvidar que cada personaje necesita su propia voz distinguible en diálogo.
`,
    knowledgeRefs: ['Knowledge/Characters/sidekicks.md', 'Knowledge/Characters/protagonistas.md', 'Knowledge/Characters/antagonistas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/mentor.md'],
  },
  {
    id: 'disenar_protagonista',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Diseñar Protagonista',
    description: 'Crear un protagonista completo con personalidad, arco de transformación, voz propia y diseño visual memorable.',
    content: `# Diseñar Protagonista

> Crear un protagonista completo con personalidad, arco de transformación, voz propia y diseño visual memorable.

## Objetivo
Construir un personaje protagonista que sea narrativamente funcional, emocionalmente resonante y visualmente icónico. El protagonista es el vehículo principal a través del cual el espectador experimenta la serie, por lo que cada decisión de diseño debe servir a esa función.

## Cuándo usar este workflow
- Cuando se inicia el desarrollo de personajes para una nueva serie.
- Cuando el protagonista actual no funciona narrativamente y necesita rediseño.
- Cuando se añade un nuevo protagonista a una serie existente (co-protagonista, nueva temporada).
- Cuando el feedback indica que el personaje no conecta con la audiencia.

## Archivos de referencia
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`

## Pasos

### Paso 1: Definir deseo versus necesidad
El deseo es lo que el protagonista quiere conscientemente y persigue activamente. La necesidad es lo que realmente le falta pero no sabe o no acepta. Estos dos elementos crean la tensión interna que impulsa el arco. Escribe una oración para cada uno. El deseo debe ser concreto y visible ("quiere ganar el torneo"). La necesidad debe ser emocional e interna ("necesita aprender que el valor propio no depende de ganar"). La serie termina cuando el personaje reconcilia deseo y necesidad.

### Paso 2: Identificar la falla fundamental
La falla no es un defecto menor; es la creencia errónea o el comportamiento disfuncional que impide al personaje conseguir lo que necesita. La falla está directamente conectada a la necesidad: existe porque el personaje no ha aprendido lo que necesita aprender. Debe ser lo suficientemente grave como para causar problemas reales, pero lo suficientemente humana como para que el espectador la reconozca en sí mismo. Documenta cómo la falla se manifiesta en comportamiento cotidiano, no solo en momentos dramáticos.

### Paso 3: Diseñar el arco de transformación
Planifica cómo el personaje cambia a lo largo de la serie. Divide el arco en fases: resistencia (la falla domina), cuestionamiento (empieza a dudar), crisis (la falla causa una pérdida significativa), transformación (elige cambiar), y nueva identidad (integra el aprendizaje). Para cada fase, escribe una escena ejemplo que ilustre el estado del personaje. El arco no tiene que ser lineal; las recaídas son más realistas y dramáticas que el progreso constante.

### Paso 4: Crear la voz del personaje
Define cómo habla este personaje de forma que sea distinguible de todos los demás. Considera: vocabulario (amplio o limitado, formal o coloquial), longitud de frases (cortas y directas o largas y divagantes), muletillas o expresiones recurrentes, sentido del humor (irónico, absurdo, nervioso, ausente), y cómo cambia su forma de hablar bajo presión. Escribe cinco líneas de diálogo que solo este personaje diría. Si podrían salir de la boca de otro personaje, la voz no es suficientemente distintiva.

### Paso 5: Diseñar la silueta
La silueta del personaje debe ser reconocible en negro sólido a cualquier tamaño. Trabaja primero en formas básicas: ¿el personaje está dominado por círculos (amigable, suave), triángulos (agresivo, dinámico), o cuadrados (estable, fuerte)? La combinación de formas comunica personalidad antes de que el personaje hable. Crea cinco variaciones de silueta y elige la que mejor comunica quién es el personaje a primera vista.

### Paso 6: Definir formas y proporciones
A partir de la silueta elegida, desarrolla las proporciones del personaje. Decide la relación cabeza-cuerpo, el largo de extremidades, la postura habitual. Las proporciones deben reflejar la personalidad: un personaje tímido puede tener hombros encogidos y extremidades recogidas; un personaje confiado puede tener pecho amplio y postura erguida. Crea una hoja de proporciones con el personaje de frente, perfil y tres cuartos.

### Paso 7: Asignar paleta de color
Elige los colores del personaje con intención narrativa. El color dominante debe comunicar la esencia del personaje. Los colores secundarios pueden contrastar o complementar. Verifica que la paleta funcione contra los fondos principales de la serie y que contraste con los otros personajes del elenco. Prueba la paleta en escala de grises para asegurar que hay suficiente contraste tonal. Documenta los códigos de color exactos.

### Paso 8: Test contra checklist de protagonista
Verifica el personaje contra estas preguntas: ¿Tiene un deseo claro que impulse la acción? ¿Su falla causa problemas concretos? ¿Su arco conecta con el tema de la serie? ¿Su voz es distinguible? ¿Su silueta es reconocible? ¿El espectador de la audiencia objetivo se puede identificar con él? ¿Tiene momentos donde es admirable y momentos donde es frustrante? Si alguna respuesta es no, revisa el elemento correspondiente.

## Entregable
Una biblia de personaje de tres a cinco páginas que incluya: perfil narrativo completo (deseo, necesidad, falla, arco), guía de voz con ejemplos de diálogo, hoja de diseño con silueta, proporciones, vistas múltiples y paleta de color, y el resultado del checklist de verificación. Todo en un solo documento referenciable.

## Criterios de aprobación
- [ ] Deseo y necesidad están claramente diferenciados y en tensión.
- [ ] La falla es específica, humana y causa problemas concretos en la historia.
- [ ] El arco de transformación tiene fases definidas con escenas ejemplo.
- [ ] La voz del personaje es distinguible en diálogo sin acotaciones.
- [ ] La silueta es reconocible en negro sólido.
- [ ] La paleta de color tiene intención narrativa documentada.
- [ ] El personaje pasa el checklist completo de protagonista.
- [ ] Un miembro del equipo que no participó en el diseño puede describir al personaje correctamente después de leer la biblia.

## Errores comunes en este proceso
- Crear un protagonista sin falla real, haciéndolo admirado pero no interesante.
- Confundir el deseo con la necesidad, quitando la tensión interna.
- Diseñar visualmente antes de definir la personalidad, creando un personaje bonito pero vacío.
- Hacer que la voz del protagonista sea genérica porque "es el personaje normal" frente al elenco excéntrico.
- Elegir colores por estética sin considerar su función narrativa o el contraste con otros personajes.
- Diseñar un arco de transformación demasiado limpio, sin recaídas ni complejidad.
- No verificar que la silueta funcione a tamaños pequeños (thumbnails, merchandising).
`,
    knowledgeRefs: ['Knowledge/Storytelling/tono.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'lore_del_mundo',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Lore del Mundo',
    description: 'Desarrollar la historia pasada del mundo que informa el presente narrativo y crea profundidad temporal.',
    content: `# Lore del Mundo

> Desarrollar la historia pasada del mundo que informa el presente narrativo y crea profundidad temporal.

## Objetivo
Crear una historia de fondo para el mundo ficticio que explique cómo llegó a su estado actual, que contenga secretos revelables a lo largo de la serie, y que enriquezca la narrativa presente con capas de significado sin sobrecargar al espectador con exposición innecesaria.

## Cuándo usar este workflow
- Cuando el mundo de la serie tiene una historia relevante que informa el presente.
- Cuando los conflictos actuales tienen raíces en eventos pasados que el espectador debe entender.
- Cuando se necesita material para revelaciones y misterios a lo largo de la serie.
- Cuando el worldbuilding necesita profundidad temporal para sentirse creíble.

## Archivos de referencia
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/culturas.md\`
- \`Knowledge/Worldbuilding/magia.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Crear la línea de tiempo
Construye una cronología del mundo desde su origen relevante hasta el presente de la serie. No necesitas cubrir millones de años; enfócate en los eventos que explican el estado actual. Divide la historia en eras o períodos con nombres que el equipo pueda referenciar. Para cada era define: qué la caracterizó, cómo terminó, y qué consecuencias tiene en la siguiente era. La línea de tiempo es la columna vertebral del lore; todo lo demás se cuelga de ella.

### Paso 2: Identificar los eventos fundacionales
De toda la línea de tiempo, selecciona los cinco a ocho eventos que más impactan el presente. Estos son los momentos que formaron el mundo tal como lo conocen los personajes: una guerra que dividió naciones, un descubrimiento que cambió las reglas, una catástrofe que alteró la geografía, una traición que rompió una alianza, una promesa que creó una tradición. Para cada evento, documenta: qué pasó exactamente, quiénes fueron los actores clave, qué versión cuentan los ganadores, qué versión cuentan los perdedores, y qué evidencia queda en el presente.

### Paso 3: Conectar la historia con los conflictos actuales
Para cada conflicto principal de la serie, traza su origen hasta un evento histórico. El antagonista no surgió de la nada; su motivación tiene raíces en algo que pasó antes. Las tensiones entre culturas tienen causas históricas. Los sistemas de poder tienen fundadores con intenciones específicas. Documenta estas conexiones explícitamente: "El conflicto entre X e Y existe porque en la Era Z ocurrió..." Estas conexiones dan peso y legitimidad a los conflictos presentes.

### Paso 4: Separar lo público de lo secreto
No todo el lore es conocimiento público dentro del mundo. Clasifica la información histórica en tres categorías: conocimiento común (lo que cualquier persona del mundo sabe), conocimiento especializado (lo que saben los eruditos, los ancianos o ciertos grupos), y secretos (lo que casi nadie sabe y que sería revelación si se descubriera). Los secretos son el recurso narrativo más valioso del lore: son las revelaciones que pueden cambiar el rumbo de la historia.

### Paso 5: Planificar las revelaciones
Para cada secreto histórico, planifica cuándo y cómo se revela al espectador. Define: en qué episodio o temporada se revela, qué personaje lo descubre, cómo lo descubre (artefacto, testimonio, investigación, accidente), qué impacto tiene la revelación en la historia presente, y cómo cambia la percepción del espectador sobre eventos previos. Las revelaciones deben estar distribuidas a lo largo de la serie, no concentradas. Cada revelación debe recontextualizar algo que el espectador ya vio.

### Paso 6: Crear los ecos visibles de la historia
La historia del mundo debe ser visible en el presente. Define qué evidencia del pasado existe en el mundo actual: ruinas de civilizaciones anteriores, monumentos que conmemoran eventos, cicatrices en el paisaje (un cráter de una batalla antigua, un bosque que no crece donde hubo un incendio mágico), artefactos que los personajes encuentran, tradiciones cuyo origen la gente ya olvidó. Estos ecos crean preguntas en la mente del espectador: "¿Qué pasó aquí?" Esas preguntas son invitaciones a profundizar en el lore.

### Paso 7: Escribir los textos internos
Crea fragmentos de texto que existen dentro del mundo: profecías, canciones populares, inscripciones en monumentos, pasajes de libros históricos, refranes que la gente usa sin saber su origen. Estos textos aportan textura y autenticidad. No necesitan ser largos; una estrofa de una canción o una línea de una profecía pueden contener pistas sobre el lore que la audiencia atenta reconocerá. Escribe al menos cinco textos internos para referencia del equipo de guion.

### Paso 8: Documento de lore canónico
Consolida todo en un documento organizado que separe claramente lo que es canon firme (no puede cambiar), lo que es canon flexible (puede ajustarse si la narrativa lo requiere), y lo que es propuesta (ideas que aún no son canon). Este documento evita contradicciones entre episodios y permite a los escritores inventar lore menor dentro de los límites establecidos sin consultar cada detalle.

## Entregable
Un documento de lore de seis a diez páginas que incluya: línea de tiempo con eras definidas, fichas de eventos fundacionales con versiones múltiples, mapa de conexiones historia-conflictos presentes, clasificación de lore por nivel de conocimiento (público, especializado, secreto), plan de revelaciones con ubicación en la serie, catálogo de ecos visibles del pasado, al menos cinco textos internos del mundo, y marcas claras de canon firme versus flexible.

## Criterios de aprobación
- [ ] La línea de tiempo tiene eras definidas con eventos que conectan entre sí.
- [ ] Los eventos fundacionales tienen versiones múltiples (ganadores y perdedores).
- [ ] Cada conflicto principal del presente tiene raíces históricas documentadas.
- [ ] El lore está clasificado en público, especializado y secreto.
- [ ] Las revelaciones están planificadas con momento, personaje y método de descubrimiento.
- [ ] Hay ecos visibles del pasado definidos para los escenarios principales.
- [ ] Existen al menos cinco textos internos del mundo.
- [ ] El documento distingue claramente entre canon firme y flexible.

## Errores comunes en este proceso
- Crear una historia del mundo tan detallada que se convierte en una novela que nadie lee.
- No conectar la historia con los conflictos del presente, dejando el lore como decorado.
- Revelar los secretos históricos demasiado pronto, agotando el misterio.
- No crear versiones contradictorias de los eventos, presentando la historia como verdad objetiva.
- Hacer que todo el lore sea público, eliminando la posibilidad de revelaciones.
- No planificar cuándo se revelan los secretos, improvisando en vez de construyendo.
- Crear ecos visuales del pasado sin planificar cómo se integran en los episodios.
- No distinguir entre canon firme y flexible, atándose las manos innecesariamente.
`,
    knowledgeRefs: ['Knowledge/Storytelling/estructura.md', 'Knowledge/Worldbuilding/magia.md', 'Knowledge/Worldbuilding/culturas.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'mapa_de_relaciones',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Mapa de Relaciones',
    description: 'Crear la red de vínculos entre personajes y planificar cómo evolucionan a lo largo de la serie.',
    content: `# Mapa de Relaciones

> Crear la red de vínculos entre personajes y planificar cómo evolucionan a lo largo de la serie.

## Objetivo
Diseñar un sistema de relaciones entre personajes que genere conflicto, emoción y dinamismo de forma orgánica, con evolución planificada que mantenga las interacciones frescas e impredecibles a lo largo de la temporada.

## Cuándo usar este workflow
- Después de diseñar el elenco principal, para definir cómo se conectan.
- Cuando las interacciones entre personajes se sienten estáticas o predecibles.
- Cuando se introduce un nuevo personaje y hay que integrarlo en la red existente.
- Cuando se planifica una nueva temporada y las relaciones necesitan evolucionar.

## Archivos de referencia
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Characters/sidekicks.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Mapear las relaciones iniciales
Crea un diagrama visual con cada personaje como nodo. Dibuja líneas entre todos los personajes que tienen una relación directa. Para cada línea define: el tipo de relación (familia, amistad, rivalidad, romance, mentoría, dependencia, desconfianza), la naturaleza emocional (cálida, tensa, neutra, volátil), y una frase que capture la dinámica ("lo admira pero le tiene miedo", "la quiere pero no la entiende"). El diagrama debe mostrar el estado al inicio de la temporada, no el estado ideal o final.

### Paso 2: Identificar las tensiones latentes
Para cada relación, identifica la fuente de conflicto potencial. Puede estar activa (ya se están peleando) o latente (aún no ha explotado pero es cuestión de tiempo). Las tensiones latentes son más valiosas narrativamente porque su detonación se puede planificar como momento dramático. Tipos de tensión: secretos que uno guarda del otro, objetivos incompatibles que aún no han chocado, resentimientos no expresados, malentendidos acumulados, y lealtades divididas. Documenta cada tensión y en qué episodio aproximado podría detonarse.

### Paso 3: Planificar la evolución por arco
Divide la temporada en tres actos o bloques. Para cada relación significativa, define su estado en cada bloque. Ejemplo: "Acto 1: son aliados con confianza creciente. Acto 2: un secreto revelado quiebra la confianza. Acto 3: reconstruyen la relación sobre bases más honestas." No todas las relaciones necesitan cambiar en cada bloque, pero las relaciones centrales de la temporada sí. Crea una tabla con relaciones en filas y actos en columnas, describiendo el estado de cada relación por acto.

### Paso 4: Diseñar los momentos clave de relación
Para cada relación principal, identifica los tres a cinco momentos que definen su evolución. Estos son las escenas que el espectador recordará: la primera conexión genuina, la primera traición, la confrontación honesta, el momento de perdón o ruptura definitiva. Escribe una breve descripción de cada momento: qué pasa, dónde ocurre, qué emoción domina, y cómo cambia la relación después. Estos momentos son los beats emocionales de la temporada.

### Paso 5: Verificar la red completa
Revisa el diagrama completo y busca: personajes aislados (con solo una o dos conexiones, que pueden desaparecer sin impacto), relaciones redundantes (dos relaciones que cumplen la misma función narrativa), y triángulos de tensión (tres personajes donde cambiar una relación afecta a las otras dos, que son especialmente valiosos). Verifica que no todas las relaciones estén concentradas en el protagonista; las relaciones entre secundarios enriquecen el mundo y reducen la dependencia del héroe.

### Paso 6: Definir las reglas de interacción
Para cada par de personajes que interactúen frecuentemente, define cómo se comportan juntos. ¿Uno domina la conversación? ¿Se interrumpen? ¿Hay tensión sexual no resuelta? ¿Tienen un ritual compartido? ¿Cómo se saludan? ¿Compiten por atención de un tercero? Estas reglas de interacción son guías para los escritores y para los actores de voz. Consistencia en las interacciones hace que las relaciones se sientan reales.

### Paso 7: Planificar relaciones futuras
Más allá de la temporada actual, haz notas sobre hacia dónde podrían ir las relaciones en temporadas posteriores. ¿Qué alianzas podrían romperse? ¿Qué enemigos podrían volverse aliados? ¿Qué relaciones románticas podrían surgir o disolverse? Estas notas no son compromisos sino posibilidades que informan decisiones presentes. Plantar semillas ahora para cosechas futuras hace que la serie se sienta orgánica y no improvisada.

## Entregable
Un documento de mapa de relaciones de cuatro a seis páginas que incluya: diagrama de relaciones inicial anotado, registro de tensiones latentes con plan de detonación, tabla de evolución por acto, lista de momentos clave de relación con descripción, resultado del análisis de red completa, reglas de interacción para pares principales, y notas de desarrollo futuro.

## Criterios de aprobación
- [ ] Cada relación tiene tipo, naturaleza emocional y dinámica definidos.
- [ ] Hay al menos una tensión latente documentada por relación principal.
- [ ] La evolución por acto está planificada para las relaciones centrales.
- [ ] Los momentos clave de relación están identificados y ubicados en la temporada.
- [ ] No hay personajes aislados sin conexiones significativas.
- [ ] Las reglas de interacción están definidas para los pares más frecuentes.
- [ ] El mapa de relaciones no está centrado exclusivamente en el protagonista.
- [ ] Las notas de desarrollo futuro existen y son coherentes con la evolución actual.

## Errores comunes en este proceso
- Centrar todas las relaciones en el protagonista, creando una red de estrella sin conexiones laterales.
- No incluir tensiones en las relaciones positivas, haciéndolas estáticas y aburridas.
- Planificar evoluciones de relación que no tienen escenas específicas que las justifiquen.
- Crear momentos clave de relación que suceden fuera de pantalla.
- Tener relaciones que nunca cambian a lo largo de la temporada.
- Cambiar relaciones de forma abrupta sin preparación narrativa.
- No definir reglas de interacción, dejando que cada escritor interprete las dinámicas a su manera.
- Olvidar que las relaciones entre secundarios también necesitan planificación.
`,
    knowledgeRefs: ['Knowledge/Characters/antagonistas.md', 'Knowledge/Characters/sidekicks.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'sistema_de_poder',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Sistema de Poder',
    description: 'Crear un sistema de magia o poderes con reglas claras, costos reales y limitaciones que generen conflicto narrativo.',
    content: `# Sistema de Poder

> Crear un sistema de magia o poderes con reglas claras, costos reales y limitaciones que generen conflicto narrativo.

## Objetivo
Diseñar un sistema de poder que sea internamente consistente, narrativamente productivo y temáticamente relevante. Un buen sistema de poder no es un catálogo de habilidades sino un marco que genera conflictos, decisiones difíciles y momentos dramáticos.

## Cuándo usar este workflow
- Cuando la serie incluye magia, superpoderes, tecnología avanzada u otro sistema de capacidades especiales.
- Cuando el sistema de poder existente tiene inconsistencias o se siente arbitrario.
- Cuando se expande el sistema para una nueva temporada con nuevas habilidades o amenazas.
- Cuando los escritores usan el poder como solución fácil y necesitas restricciones claras.

## Archivos de referencia
- \`Knowledge/Worldbuilding/magia.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Definir la fuente del poder
¿De dónde viene el poder en este mundo? Puede ser innato (genético, espiritual), aprendido (entrenamiento, estudio), otorgado (por entidades, artefactos), o extraído (de la naturaleza, de otros seres). La fuente determina quién puede tener poder y establece la primera desigualdad del mundo. Define también si la fuente es finita o infinita, y si el acceso al poder es democrático o exclusivo. La fuente del poder implica una estructura social.

### Paso 2: Establecer las reglas
Las reglas son las leyes físicas del poder. Define: qué puede hacer el poder (sus capacidades), qué no puede hacer nunca (sus límites absolutos), cómo se activa (gesto, palabra, pensamiento, ritual), cuánto dura un uso (instantáneo, temporal, permanente), y si se puede combinar con otros poderes o anular. Las reglas deben ser simples de entender pero ricas en consecuencias. Si necesitas más de cinco reglas básicas, el sistema probablemente es demasiado complejo para animación.

### Paso 3: Definir los costos
Todo uso de poder debe costar algo. El costo puede ser físico (fatiga, dolor, envejecimiento), emocional (memorias, emociones, conexiones), material (recursos, objetos, energía), social (reputación, relaciones, estatus), o existencial (humanidad, identidad, moralidad). El costo es lo que convierte el poder en una decisión dramática en vez de una solución automática. Define una escala de costos: poderes menores tienen costos menores, poderes mayores tienen costos devastadores.

### Paso 4: Crear las limitaciones
Las limitaciones son diferentes de los costos. Los costos son lo que pagas; las limitaciones son lo que no puedes hacer aunque pagues. Tipos de limitaciones: temporales (solo funciona de noche, necesita tiempo de recarga), condicionales (requiere contacto visual, no funciona en ciertos materiales), de escala (funciona en una persona pero no en cien), de conocimiento (necesitas entender lo que manipulas), y de conflicto (no puedes usarlo contra personas que amas). Las limitaciones generan creatividad en los personajes y en los escritores.

### Paso 5: Conectar el poder con el tema
El sistema de poder debe reflejar o cuestionar el tema central de la serie. Si la serie trata sobre el sacrificio, el poder debe requerir sacrificios genuinos. Si trata sobre la identidad, el poder debe transformar a quien lo usa. Si trata sobre la comunidad, el poder debe funcionar mejor en colaboración. Esta conexión temática es lo que eleva el sistema de poder de mecánica a metáfora. Documenta explícitamente cómo cada regla del sistema refleja el tema.

### Paso 6: Diseñar la representación visual
¿Cómo se ve el poder cuando se usa? Define: colores asociados, formas y texturas de los efectos, cómo afecta al cuerpo del usuario, cómo afecta al entorno, y cómo se distinguen visualmente diferentes tipos o niveles de poder. La representación visual debe ser consistente y legible: el espectador debe poder entender qué está pasando en pantalla sin explicación. Crea una guía visual con ejemplos de uso menor, medio y máximo.

### Paso 7: Test de abuso
Imagina al escritor más creativo del equipo intentando explotar el sistema. ¿Hay combinaciones de reglas que permitan poder infinito? ¿Hay formas de evitar los costos? ¿Las limitaciones tienen excepciones que se pueden explotar? Documenta los exploits potenciales y cómo las reglas los previenen. Si encuentras un exploit que las reglas no cubren, añade una regla o ajusta una existente. Un sistema robusto sobrevive a los escritores creativos sin necesitar excepciones ad hoc.

## Entregable
Un documento de sistema de poder de cuatro a seis páginas que incluya: fuente del poder con implicaciones sociales, reglas básicas (máximo cinco), escala de costos con ejemplos, limitaciones categorizadas, conexión temática documentada, guía visual de representación, y resultados del test de abuso con soluciones. Apéndice con glosario de términos del sistema.

## Criterios de aprobación
- [ ] La fuente del poder está definida con implicaciones sociales claras.
- [ ] Las reglas básicas son cinco o menos y son comprensibles.
- [ ] Todo uso de poder tiene un costo proporcional.
- [ ] Las limitaciones generan creatividad en vez de frustración.
- [ ] El sistema está conectado explícitamente con el tema de la serie.
- [ ] La representación visual es consistente y legible.
- [ ] El test de abuso no revela exploits sin solución.
- [ ] Un escritor puede leer el documento y saber exactamente qué pueden y no pueden hacer los personajes.

## Errores comunes en este proceso
- Crear un sistema sin costos reales, convirtiendo el poder en solución gratuita.
- Hacer el sistema tan complejo que los escritores no lo entienden y lo usan mal.
- No conectar el poder con el tema, dejando que sea pura mecánica de acción.
- Definir limitaciones que se ignoran cuando son inconvenientes para la trama.
- Crear costos que suenan graves pero nunca tienen consecuencias narrativas reales.
- Diseñar la representación visual sin considerar la legibilidad en pantalla pequeña.
- No hacer el test de abuso y descubrir los exploits cuando ya hay episodios escritos.
- Añadir reglas nuevas cada vez que surge un problema en vez de diseñar el sistema completo desde el inicio.
`,
    knowledgeRefs: ['Knowledge/Worldbuilding/reglas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Worldbuilding/magia.md'],
  },
  {
    id: 'worldbuilding_completo',
    phase: '01_Desarrollo',
    phaseName: 'Desarrollo',
    phaseIcon: '🏗️',
    phaseColor: '#64b5f6',
    title: 'Worldbuilding Completo',
    description: 'Construir un mundo con reglas coherentes, culturas vivas, economía funcional y estética visual y sonora definida.',
    content: `# Worldbuilding Completo

> Construir un mundo con reglas coherentes, culturas vivas, economía funcional y estética visual y sonora definida.

## Objetivo
Crear un mundo ficticio que se sienta vivo, coherente y explorable, con suficiente profundidad para sostener múltiples temporadas de narrativa y suficiente claridad para que cualquier escritor del equipo pueda crear historias dentro de él sin contradecir las reglas establecidas.

## Cuándo usar este workflow
- Cuando se inicia el desarrollo de una serie con un mundo ficticio original.
- Cuando el mundo existente necesita expansión para nuevas temporadas.
- Cuando hay inconsistencias en el mundo que requieren una revisión sistemática.
- Cuando se integran nuevos escritores que necesitan entender las reglas del mundo.

## Archivos de referencia
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/culturas.md\`
- \`Knowledge/Worldbuilding/magia.md\`
- \`Knowledge/Worldbuilding/economia.md\`
- \`Knowledge/Worldbuilding/geografia.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Definir las reglas fundamentales
Establece qué es posible y qué no en este mundo. Empieza con la pregunta: "¿En qué se diferencia este mundo del nuestro?" Lista las diferencias y para cada una define la regla que la gobierna. Las reglas deben ser claras, consistentes y tener consecuencias. Si existe magia, tiene un costo. Si la gravedad funciona diferente, afecta la arquitectura, el transporte y el combate. Cada regla que estableces debe impactar al menos dos aspectos de la vida cotidiana en ese mundo.

### Paso 2: Crear las culturas
Un mundo vivo tiene sociedades con valores, tradiciones y conflictos propios. Para cada cultura relevante, define: valores centrales (qué consideran sagrado o importante), estructura social (quién tiene poder y cómo se obtiene), tradiciones y rituales (qué hacen y por qué), conflictos internos (qué tensiones existen dentro de la sociedad), y relaciones con otras culturas (alianzas, rivalidades, comercio). Evita culturas monolíticas; toda sociedad tiene disidentes, reformistas y conservadores.

### Paso 3: Diseñar la economía
¿Qué mueve los recursos en este mundo? Define: qué es valioso y escaso, cómo se comercia (moneda, trueque, otro sistema), qué trabajos existen, quién es rico y quién es pobre y por qué, y cómo las reglas del mundo afectan la economía. La economía no necesita ser compleja, pero necesita ser lógica. Si hay magia que cura enfermedades, ¿quién tiene acceso a ella y cuánto cuesta? Las preguntas económicas revelan conflictos narrativos poderosos.

### Paso 4: Establecer los sistemas de poder
Define cómo se ejerce el poder en el mundo: político (quién gobierna y con qué legitimidad), militar (quién tiene la fuerza y cómo se usa), mágico o sobrenatural (quién accede al poder especial), económico (quién controla los recursos), y social (quién tiene influencia cultural). Mapea las tensiones entre estos poderes. Los conflictos más interesantes surgen cuando diferentes tipos de poder chocan: el poder político contra el mágico, el económico contra el militar.

### Paso 5: Worldbuilding visual
Define cómo se ve el mundo. Para cada región o zona relevante, establece: paleta de color dominante, estilo arquitectónico (con referentes y justificación cultural), nivel tecnológico visible, vegetación y naturaleza, iluminación característica (luz cálida, fría, filtrada, dura), y estado de conservación (mundo nuevo, antiguo, deteriorado, próspero). Crea mood boards por zona que el equipo de arte pueda usar como referencia directa. La estética visual debe reflejar las culturas y la historia del mundo.

### Paso 6: Worldbuilding sonoro
Define cómo suena el mundo. Para cada zona o cultura, establece: sonidos ambientales característicos, tipo de música (instrumentos, escalas, ritmos), cómo habla la gente (acento, velocidad, volumen), sonidos asociados a la magia o tecnología, y el nivel de ruido o silencio ambiental. El sonido es invisible pero construye la atmósfera tanto como lo visual. Un mercado bullicioso suena diferente a un templo silencioso, y esas diferencias sitúan al espectador sin necesidad de diálogo expositivo.

### Paso 7: Documento de consistencia
Crea una guía rápida de referencia que liste: las reglas que nunca pueden romperse, las preguntas más frecuentes sobre el mundo con sus respuestas canónicas, las zonas grises donde hay flexibilidad creativa, y los errores comunes que los escritores deben evitar. Este documento es la herramienta diaria del equipo de guion. Debe caber en dos páginas y ser de consulta rápida.

## Entregable
Un documento de worldbuilding de 10 a 20 páginas que incluya: reglas fundamentales con sus consecuencias, perfiles culturales completos, sistema económico, mapa de poderes con tensiones, mood boards visuales por zona, guía sonora por zona, y el documento de consistencia de dos páginas para consulta rápida. Apéndices con mapas, glosario y timeline histórica.

## Criterios de aprobación
- [ ] Cada regla fundamental tiene consecuencias documentadas en la vida cotidiana.
- [ ] Cada cultura tiene valores, conflictos internos y relaciones con otras culturas.
- [ ] La economía es lógica y revela conflictos narrativos.
- [ ] Los sistemas de poder están mapeados con sus tensiones.
- [ ] Hay mood boards visuales para cada zona relevante.
- [ ] La guía sonora define la atmósfera de cada zona.
- [ ] El documento de consistencia existe y cabe en dos páginas.
- [ ] Un escritor nuevo puede crear un episodio en este mundo sin contradecir las reglas.

## Errores comunes en este proceso
- Crear un mundo enormemente detallado en áreas que nunca aparecerán en la serie.
- Establecer reglas sin consecuencias, haciendo que el mundo se sienta arbitrario.
- Diseñar culturas monolíticas donde todos piensan igual.
- Ignorar la economía, creando un mundo donde nadie trabaja ni necesita dinero.
- Definir lo visual sin lo sonoro, dejando la mitad de la experiencia sensorial sin guía.
- No crear el documento de consistencia, obligando a los escritores a buscar en un documento de veinte páginas cada dato.
- Construir el mundo para el worldbuilder en vez de para la historia; el mundo debe servir a la narrativa.
- No dejar zonas grises que permitan flexibilidad creativa a escritores y directores.
`,
    knowledgeRefs: ['Knowledge/Worldbuilding/geografia.md', 'Knowledge/Worldbuilding/magia.md', 'Knowledge/Worldbuilding/economia.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Worldbuilding/culturas.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'casting_de_voces',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Casting de Voces',
    description: 'Proceso para definir la identidad vocal de cada personaje y seleccionar al elenco ideal.',
    content: `# Casting de Voces

> Proceso para definir la identidad vocal de cada personaje y seleccionar al elenco ideal.

## Objetivo
Encontrar las voces que encarnen a los personajes de la serie, asegurando que cada actor de voz aporte la personalidad, el rango emocional y la textura vocal que el personaje necesita, y que el elenco completo funcione como un conjunto con química y contraste.

## Cuándo usar este workflow
- Cuando se inicia la producción de una nueva serie y se necesita definir el elenco de voces.
- Cuando se reemplaza a un actor de voz por cualquier razón.
- Cuando se añaden personajes nuevos en temporadas posteriores.

## Archivos de referencia
- \`Knowledge/Characters/arquetipos.md\` — Arquetipos de personaje y sus cualidades definitorias.
- \`Knowledge/Characters/voz.md\` — Guía de voz narrativa y personalidad de cada personaje.
- \`Knowledge/Characters/relaciones.md\` — Dinámicas entre personajes que afectan la interacción vocal.

## Pasos

### Paso 1: Escribir descripciones de voz por personaje
Para cada personaje que necesita casting, escribir una descripción de voz detallada que incluya: rango vocal (grave, medio, agudo), textura (rasposa, suave, nasal, resonante), velocidad de habla habitual, energía general (contenida, explosiva, fluctuante), acento o particularidades de habla si las hay, y tres adjetivos que definan cómo debe sonar. Consultar \`voz.md\` para alinear la descripción con la personalidad del personaje.

### Paso 2: Definir las cualidades vocales esenciales
Distinguir entre cualidades vocales negociables y no negociables. Las no negociables son las que hacen al personaje reconocible e inconfundible: pueden ser un timbre específico, un ritmo de habla, o una textura vocal. Las negociables son aspectos que pueden ajustarse durante la dirección. Esta distinción evita descartar candidatos excelentes por criterios secundarios.

### Paso 3: Crear escenas de audición
Seleccionar o escribir entre 3 y 5 escenas de audición para cada personaje que pongan a prueba diferentes facetas: una escena de diálogo cotidiano para evaluar la voz natural, una escena emocional intensa para evaluar el rango, una escena de humor para evaluar el timing cómico, y una escena de acción o esfuerzo para evaluar la energía física. Las escenas deben ser autosuficientes: el actor debe poder entenderlas sin conocer toda la serie.

### Paso 4: Realizar las audiciones
Dirigir las audiciones dando contexto suficiente sobre el personaje pero sin sobredirigir. Permitir que el actor haga su primera interpretación con libertad antes de dar notas. Evaluar no solo la calidad de la voz sino la capacidad del actor de recibir dirección y ajustar su interpretación. Probar al menos una escena con dirección opuesta a lo que el actor hizo naturalmente para evaluar su versatilidad.

### Paso 5: Evaluar candidatos contra el personaje
Crear una matriz de evaluación para cada candidato que mida: alineación con las cualidades no negociables, rango emocional demostrado, capacidad de dirección, naturalidad en el diálogo, y el factor intangible de si la voz se siente como el personaje. No elegir la mejor voz aislada sino la voz que mejor sirve al personaje y a la serie. Un actor técnicamente superior puede no ser la elección correcta si su voz no encaja con el mundo.

### Paso 6: Probar química entre el elenco
Una vez seleccionados los candidatos principales, hacer pruebas de interacción. Reunir a los candidatos para los personajes que más interactúan y grabar escenas de diálogo entre ellos. Evaluar: ¿las voces se distinguen claramente una de otra? ¿El ritmo de conversación se siente natural? ¿Hay química o tensión según lo que la relación requiera? Consultar \`relaciones.md\` para verificar que la dinámica vocal refleja la dinámica narrativa.

### Paso 7: Verificar diversidad y contraste vocal
Revisar el elenco completo como conjunto. Cada voz debe ser distinguible de todas las demás sin necesidad de ver la imagen. Si dos personajes que comparten escenas suenan demasiado similares, reconsiderar una de las elecciones. El elenco ideal tiene variedad de timbres, registros y estilos de habla que hacen que cada personaje sea inmediatamente identificable solo por su voz.

### Paso 8: Sesión de prueba y confirmación
Realizar una sesión de grabación de prueba con el elenco seleccionado, dirigiendo escenas del piloto o de episodios tempranos. Evaluar la experiencia de dirección, la resistencia vocal del actor, su profesionalismo y su capacidad de mantener la consistencia del personaje a lo largo de una sesión. Confirmar las selecciones finales y documentar las notas de dirección específicas para cada actor.

## Entregable
Documento de casting que incluya: elenco confirmado con actor asignado a cada personaje, descripción de voz de referencia por personaje, notas de dirección específicas para cada actor, grabaciones de audición seleccionadas como referencia, y plan de grabación con disponibilidad del elenco. Contratos y acuerdos gestionados con producción.

## Criterios de aprobación
- Cada personaje tiene una voz que se siente auténtica y alineada con su personalidad.
- Las cualidades vocales no negociables están cubiertas en cada selección.
- El elenco tiene diversidad y contraste vocal suficiente para distinguir personajes sin imagen.
- La química entre actores que comparten escenas funciona según la dinámica del personaje.
- Los actores seleccionados han demostrado capacidad de recibir dirección y ajustar su interpretación.
- El showrunner y el director de voz han aprobado todas las selecciones.

## Errores comunes en este proceso
- Elegir voces por el nombre del actor en lugar de por la adecuación al personaje.
- No probar la química entre actores y descubrir en grabación que dos voces principales no contrastan.
- Escribir escenas de audición que solo prueban una faceta del personaje, sin revelar si el actor tiene rango.
- Sobredirigir las audiciones, impidiendo que el actor aporte su interpretación personal.
- No distinguir entre cualidades negociables y no negociables, descartando buenos candidatos por razones menores.
- Seleccionar voces demasiado similares para personajes que comparten escenas frecuentemente.
- No hacer sesión de prueba y descubrir problemas de consistencia o resistencia vocal ya en producción.
`,
    knowledgeRefs: ['Knowledge/Characters/voz.md', 'Knowledge/Characters/arquetipos.md', 'Knowledge/Characters/relaciones.md'],
  },
  {
    id: 'color_script',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Color Script',
    description: 'Proceso para crear el mapa emocional cromático de un episodio o película completa.',
    content: `# Color Script

> Proceso para crear el mapa emocional cromático de un episodio o película completa.

## Objetivo
Producir un color script que visualice el arco emocional del episodio o película a través del color, asignando temperatura cromática a cada beat narrativo, diseñando transiciones entre estados emocionales y verificando que el viaje emocional es legible en color solo, sin diálogo ni acción.

## Cuándo usar este workflow
- Cuando se prepara la dirección de arte de un episodio antes de entrar a producción de fondos.
- Cuando se diseña la dirección de color de una película o especial.
- Cuando se necesita replantear la paleta emocional de un episodio que no funciona visualmente.

## Archivos de referencia
- \`Knowledge/Visual/color.md\` — Teoría del color, psicología cromática y técnicas de paleta.
- \`Knowledge/Cinematography/ritmo.md\` — Ritmo cinematográfico y cadencia emocional.
- \`Knowledge/Storytelling/estructura.md\` — Estructura narrativa para alinear color con arco emocional.

## Pasos

### Paso 1: Desglosar el episodio en beats emocionales
Leer el guion o revisar la animática y listar cada cambio emocional significativo: cada momento donde el tono cambia de alegría a tensión, de calma a peligro, de esperanza a desolación. Estos beats son los puntos de inflexión cromática del color script. Numerarlos y describir brevemente la emoción dominante de cada uno. Consultar \`estructura.md\` para verificar que los beats emocionales se alinean con los puntos estructurales.

### Paso 2: Asignar temperatura de color a cada beat
Para cada beat emocional, definir su temperatura cromática consultando \`color.md\`. Las escenas cálidas (naranjas, amarillos, rojos suaves) comunican seguridad, intimidad o nostalgia. Las escenas frías (azules, violetas, grises) comunican soledad, peligro o melancolía. Las escenas neutras sirven como base desde la cual los cambios de temperatura son más notables. No asignar temperaturas arbitrariamente: cada decisión debe servir a la emoción de la escena.

### Paso 3: Definir la saturación por momento narrativo
Además de la temperatura, la saturación comunica intensidad emocional. Los momentos de máxima emoción (positiva o negativa) tienden a mayor saturación. Los momentos de vacío o confusión se desaturan. Definir un mapa de saturación paralelo al mapa de temperatura que suba y baje con la intensidad emocional del episodio. Consultar \`ritmo.md\` para asegurar que los picos de saturación coinciden con los picos narrativos.

### Paso 4: Diseñar las transiciones cromáticas
Los cambios de color entre beats no deben ser abruptos a menos que la narrativa lo justifique. Diseñar cómo transiciona el color de un beat al siguiente: ¿gradualmente a lo largo de una secuencia o con un corte dramático? Las transiciones graduales mantienen la inmersión. Los cortes cromáticos abruptos generan impacto o desorientación intencional. Cada transición debe tener una intención clara.

### Paso 5: Crear los thumbnails del color script
Pintar thumbnails pequeños y rápidos de cada beat clave, capturando el esquema de color predominante, la dirección de luz y la proporción entre colores cálidos y fríos. Estos thumbnails no necesitan detalle: son manchas de color que representan el mood de cada momento. Organizarlos en secuencia horizontal para visualizar el viaje cromático completo del episodio de un vistazo.

### Paso 6: Verificar el arco emocional en color
Observar la secuencia completa de thumbnails sin pensar en la trama. ¿El arco cromático cuenta una historia por sí solo? ¿Se percibe la subida de tensión, el clímax y la resolución solo en los colores? Si el color script se ve plano o monótono, hay problemas de variación. Si se ve caótico sin patrón, hay problemas de coherencia. El color script exitoso es un resumen visual del viaje emocional.

### Paso 7: Probar con escenas específicas
Seleccionar tres o cuatro escenas clave y pintar versiones más detalladas aplicando la paleta definida en el color script. Verificar que los personajes se leen bien contra los fondos con la iluminación y el color del momento. Probar las escenas emocionalmente opuestas para confirmar que el contraste cromático funciona. Ajustar los thumbnails del color script según los resultados de estas pruebas.

### Paso 8: Presentar y aprobar
Presentar el color script completo al director y al director de arte. Recorrer la secuencia explicando cada decisión cromática y su relación con la narrativa. Recoger notas y ajustar. El color script aprobado se convierte en la guía obligatoria para el equipo de fondos, iluminación y composición digital durante la producción.

## Entregable
Color script completo del episodio que incluya: secuencia de thumbnails cromáticos organizados por beats narrativos con descripción emocional, mapa de temperatura y saturación por escena, pruebas detalladas de escenas clave, documento de notas que explique las decisiones cromáticas principales, y paletas específicas por escena con valores de color. Formato digital de alta resolución y versión imprimible panorámica.

## Criterios de aprobación
- El arco emocional del episodio es legible solo mirando la secuencia de color.
- Las temperaturas de color están alineadas con las emociones de cada escena.
- Las transiciones cromáticas son intencionales y sirven a la narrativa.
- Los personajes se leen bien contra los fondos en las pruebas de escenas clave.
- Hay variación cromática suficiente para evitar monotonía visual.
- Los picos de saturación coinciden con los picos emocionales de la historia.
- El director y el director de arte han aprobado el color script.
- El documento es suficiente para guiar al equipo de fondos durante producción.

## Errores comunes en este proceso
- Asignar colores basándose en preferencias estéticas en lugar de necesidades emocionales de la escena.
- Mantener la misma temperatura de color durante todo el episodio, eliminando el contraste emocional.
- No diseñar las transiciones entre beats, dejando cambios de color abruptos e injustificados.
- Crear un color script demasiado detallado que se vuelve prescriptivo e impide ajustes durante producción.
- No verificar que los personajes se leen contra los fondos con la paleta del color script.
- Ignorar la saturación como herramienta, tratándola como constante cuando es tan expresiva como la temperatura.
- No alinear el color script con la estructura narrativa, produciendo picos cromáticos que no coinciden con los picos emocionales.
- Pintar thumbnails demasiado bonitos en lugar de funcionales, gastando tiempo en detalle que no sirve a la comunicación.
`,
    knowledgeRefs: ['Knowledge/Cinematography/ritmo.md', 'Knowledge/Visual/color.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'crear_animatic',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Crear Animática',
    description: 'Proceso para convertir el storyboard en la primera versión temporizada del episodio con audio provisional.',
    content: `# Crear Animática

> Proceso para convertir el storyboard en la primera versión temporizada del episodio con audio provisional.

## Objetivo
Producir una animática que permita evaluar el ritmo, la duración y el flujo narrativo del episodio antes de comprometer recursos de animación, identificando problemas de pacing, escenas que sobran o faltan, y momentos donde el timing no funciona emocionalmente.

## Cuándo usar este workflow
- Cuando el storyboard de un episodio ha sido aprobado y está listo para temporización.
- Cuando se necesita evaluar el ritmo de una secuencia específica antes de animarla.
- Cuando se revisa un episodio que tiene problemas de duración o pacing.

## Archivos de referencia
- \`Knowledge/Animation/timing.md\` — Principios de temporización y espaciado en animación.
- \`Knowledge/Cinematography/ritmo.md\` — Ritmo cinematográfico, corte y cadencia narrativa.
- \`Knowledge/Storytelling/estructura.md\` — Estructura de actos para verificar proporciones temporales.

## Pasos

### Paso 1: Importar y organizar el storyboard
Importar todos los paneles del storyboard aprobado al software de animática en orden secuencial. Verificar que no falten paneles y que la numeración sea correcta. Organizar los paneles por escenas y actos para tener una visión clara de la estructura. Crear marcadores en los puntos estructurales clave: inicio de cada acto, punto medio, clímax y resolución.

### Paso 2: Establecer el timing por plano
Asignar una duración inicial a cada plano basándose en su contenido. Consultar \`timing.md\` para las convenciones: los planos de establecimiento necesitan tiempo para que el público lea el espacio, los planos de diálogo se temporizan según la velocidad del habla, los planos de reacción necesitan tiempo para que la emoción se registre, los planos de acción se temporizan según la intensidad del movimiento. No ser precioso en esta primera pasada: establecer duraciones aproximadas.

### Paso 3: Añadir audio provisional
Incorporar las pistas de audio provisionales: diálogos grabados por el equipo de guion o scratch voices, efectos de sonido básicos para acciones clave (puertas, explosiones, pasos), y música temporal que capture el tono emocional de cada escena. El audio no necesita ser final pero debe ser suficiente para evaluar el ritmo. Los silencios también son intencionales: incluirlos donde la pausa es parte del efecto.

### Paso 4: Primera reproducción completa
Reproducir la animática de principio a fin sin pausar ni tomar notas. La primera reproducción es para sentir el flujo general: ¿el episodio engancha al inicio? ¿El ritmo se siente natural? ¿El clímax tiene el impacto esperado? ¿La duración total está dentro del rango? Después de esta primera reproducción, documentar las impresiones generales antes de entrar en detalles.

### Paso 5: Identificar problemas de pacing
En la segunda reproducción, tomar notas detalladas sobre ritmo. Marcar los momentos donde la atención se pierde, donde la emoción no llega, donde la acción se siente apresurada o donde las pausas son excesivas. Consultar \`ritmo.md\` para diagnosticar los problemas: ¿falta variación rítmica? ¿Los momentos de tensión no tienen suficiente acumulación? ¿Las escenas de respiración son demasiado largas? Clasificar cada problema por severidad.

### Paso 6: Ajustar timing y corte
Implementar correcciones: alargar planos que necesitan más respiración, acortar planos que se sienten lentos, añadir planos de reacción que faltan, eliminar planos redundantes. Mover la posición de los cortes para mejorar el ritmo: cortar en la acción para dinamismo, cortar en la pausa para énfasis. Cada ajuste debe servir a la historia y a la emoción, no solo a la duración.

### Paso 7: Verificar proporciones estructurales
Consultar \`estructura.md\` para verificar que los actos tienen proporciones temporales correctas. El primer acto no debe exceder el 25 por ciento de la duración total. El clímax debe llegar en el momento estructural adecuado. La resolución debe tener suficiente tiempo sin extenderse innecesariamente. Si las proporciones están desequilibradas, identificar qué escenas necesitan comprimirse o expandirse.

### Paso 8: Iterar con el equipo
Mostrar la animática revisada al director del episodio y al showrunner. Recoger notas específicas sobre timing, corte y ritmo. Implementar los cambios aprobados y reproducir nuevamente para verificar que las correcciones mejoraron el flujo sin crear nuevos problemas. Repetir este ciclo hasta obtener aprobación. La animática aprobada se convierte en el mapa temporal definitivo para la producción.

## Entregable
Animática aprobada del episodio completo en formato de video con audio provisional sincronizado. Documento de notas de timing que detalle la duración de cada escena y los ajustes realizados respecto al storyboard original. Lista de cambios implementados con justificación. Archivo de proyecto editable para futuros ajustes si son necesarios.

## Criterios de aprobación
- La duración total del episodio está dentro del rango establecido para la serie.
- El ritmo se siente natural y variado, sin mesetas prolongadas ni aceleraciones injustificadas.
- Los momentos emocionales clave tienen el impacto esperado.
- El clímax llega en el momento estructural correcto.
- Las proporciones entre actos son equilibradas.
- El audio provisional es suficiente para evaluar el ritmo.
- El director del episodio y el showrunner han aprobado la animática.
- El episodio puede verse de principio a fin sin que la atención se pierda.

## Errores comunes en este proceso
- No añadir audio provisional y evaluar el ritmo solo con imágenes, lo que da una percepción falsa del timing.
- Hacer todos los planos de la misma duración, creando un ritmo monótono sin variación.
- No incluir silencios ni pausas dramáticas, llenando cada segundo con diálogo o acción.
- Corregir problemas de ritmo solo acortando planos en lugar de considerar si faltan planos de transición o reacción.
- No verificar las proporciones estructurales, lo que produce episodios con primeros actos excesivos o resoluciones apresuradas.
- Iterar demasiadas veces en detalles menores antes de resolver los problemas mayores de estructura y pacing.
- Aprobar la animática sin reproducción completa, evaluando solo escenas individuales sin verificar el flujo total.
`,
    knowledgeRefs: ['Knowledge/Cinematography/ritmo.md', 'Knowledge/Animation/timing.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'crear_storyboard',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Crear Storyboard',
    description: 'Proceso para traducir el guion a una secuencia visual plano por plano con intención cinematográfica.',
    content: `# Crear Storyboard

> Proceso para traducir el guion a una secuencia visual plano por plano con intención cinematográfica.

## Objetivo
Transformar el guion aprobado en una secuencia de paneles que defina los encuadres, ángulos de cámara, composición, actuación de personajes y transiciones de cada escena, creando el plano visual completo del episodio antes de pasar a animática.

## Cuándo usar este workflow
- Cuando un guion ha sido aprobado y está listo para su traducción visual.
- Cuando se necesita revisar y rehacer el storyboard tras notas de dirección.
- Cuando se prepara una secuencia de acción o musical que requiere planificación visual detallada.

## Archivos de referencia
- \`Knowledge/Cinematography/camaras.md\` — Tipos de plano, movimientos de cámara y su efecto narrativo.
- \`Knowledge/Visual/composicion.md\` — Principios de composición, lectura visual y jerarquía.
- \`Knowledge/Storytelling/estructura.md\` — Estructura narrativa para mantener el ritmo visual.
- \`Knowledge/Animation/timing.md\` — Temporización básica para estimar duración de planos.

## Pasos

### Paso 1: Desglose del guion en planos
Leer el guion completo una vez sin dibujar nada. En la segunda lectura, marcar cada cambio de plano necesario: cada nueva acción significativa, cada cambio de sujeto de atención, cada reacción importante y cada transición emocional. No pensar todavía en encuadres específicos sino en unidades narrativas visuales. Numerar cada plano secuencialmente.

### Paso 2: Thumbnails de momentos clave
Antes de dibujar el storyboard completo, hacer thumbnails pequeños y rápidos de los 8 a 12 momentos más importantes del episodio: el gancho de apertura, los puntos de giro, el clímax y la resolución. Estos thumbnails definen la ambición visual del episodio y sirven como anclas para el resto del storyboard. Deben ser composiciones fuertes y memorables.

### Paso 3: Definir ángulos de cámara por escena
Para cada escena, decidir el lenguaje de cámara que mejor sirve a la emoción. Consultar \`camaras.md\` para seleccionar: planos abiertos para establecer contexto, planos medios para diálogo, primeros planos para emoción, contrapicados para poder, picados para vulnerabilidad. Cada decisión de cámara debe tener una razón narrativa, no ser arbitraria.

### Paso 4: Dibujar los paneles del storyboard
Dibujar cada panel con claridad suficiente para que cualquier miembro del equipo entienda la intención. Incluir en cada panel: el encuadre con personajes y fondo, flechas de movimiento de cámara si aplica, indicación del tipo de plano, y una línea de diálogo o acción debajo. La calidad del dibujo no necesita ser final pero la intención debe ser inequívoca. Consultar \`composicion.md\` para verificar que cada panel tiene una composición que guía la mirada del espectador.

### Paso 5: Planificar transiciones entre escenas
Definir cómo se conecta cada escena con la siguiente. Las transiciones no son solo cortes: pueden ser match cuts, fundidos, barridos o cortes por acción. Cada transición debe contribuir al ritmo del episodio. Las transiciones rápidas aceleran la energía, las transiciones suaves dan respiro. Anotar el tipo de transición entre los paneles finales e iniciales de escenas consecutivas.

### Paso 6: Añadir notas de timing y actuación
En cada panel que lo requiera, añadir notas sobre: duración estimada del plano en segundos, tipo de actuación del personaje (sutil, exagerada, contenida), velocidad del movimiento de cámara, y cualquier efecto sonoro o musical relevante. Estas notas son esenciales para que la animática capture la intención del storyboard.

### Paso 7: Verificar continuidad visual
Revisar el storyboard completo verificando: la línea de los 180 grados se respeta en cada escena de diálogo, los personajes mantienen su posición relativa entre planos, los objetos del entorno son consistentes, y las fuentes de luz no cambian sin justificación. Marcar y corregir cualquier error de continuidad.

### Paso 8: Revisión con dirección
Presentar el storyboard completo al director del episodio. Recorrer cada escena explicando las decisiones de cámara y composición. Tomar notas de los cambios solicitados y priorizar las correcciones. Iterar los paneles modificados y obtener aprobación final antes de pasar a animática.

## Entregable
Storyboard completo del episodio en formato digital con paneles numerados secuencialmente, organizado por escenas. Cada panel debe incluir: encuadre dibujado, número de plano, tipo de plano, diálogo o acción, notas de cámara y notas de timing. Archivo exportado en formato revisable por el equipo.

## Criterios de aprobación
- Cada escena del guion tiene su correspondiente secuencia de paneles sin omisiones.
- Los ángulos de cámara tienen justificación narrativa clara.
- La composición de los paneles clave es fuerte y guía la mirada del espectador.
- Las transiciones entre escenas están definidas y contribuyen al ritmo.
- La continuidad visual se mantiene en cada escena.
- Las notas de timing y actuación son suficientes para crear la animática.
- El director del episodio ha aprobado el storyboard.

## Errores comunes en este proceso
- Usar siempre el mismo tipo de plano por comodidad, sin variar el lenguaje visual.
- Olvidar dibujar las reacciones de los personajes que escuchan, enfocándose solo en quien habla.
- No planificar las transiciones, dejándolas todas como cortes directos por defecto.
- Saltar los thumbnails de momentos clave y perder la oportunidad de diseñar composiciones memorables.
- Romper la regla de los 180 grados en escenas de diálogo sin intención narrativa.
- No incluir notas de timing, lo que obliga al equipo de animática a adivinar la intención.
- Dibujar paneles demasiado detallados que consumen tiempo sin añadir claridad a la intención.
`,
    knowledgeRefs: ['Knowledge/Cinematography/camaras.md', 'Knowledge/Animation/timing.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Visual/composicion.md'],
  },
  {
    id: 'disenar_criaturas',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Diseñar Criaturas',
    description: 'Proceso para crear seres con biología, comportamiento y diseño visual coherentes entre sí.',
    content: `# Diseñar Criaturas

> Proceso para crear seres con biología, comportamiento y diseño visual coherentes entre sí.

## Objetivo
Diseñar criaturas que se sientan como organismos creíbles dentro de su ecosistema, con biología que justifique su apariencia, comportamiento que informe su diseño, movimiento característico y una identidad sonora que las complete, todo integrado al estilo visual y narrativo de la serie.

## Cuándo usar este workflow
- Cuando el guion introduce una nueva criatura con relevancia narrativa.
- Cuando se construye la fauna del mundo para la biblia de worldbuilding.
- Cuando se necesita una criatura para una secuencia de acción, amenaza o relación con un personaje.

## Archivos de referencia
- \`Knowledge/Visual/forma.md\` — Lenguaje de formas aplicado a anatomía de criaturas.
- \`Knowledge/Visual/color.md\` — Color como indicador de peligro, camuflaje o función biológica.
- \`Knowledge/Visual/textura.md\` — Texturas de piel, escamas, pelaje y materiales orgánicos.
- \`Knowledge/Worldbuilding/reglas.md\` — Reglas del mundo que afectan la biología y ecología.
- \`Knowledge/Worldbuilding/cultura.md\` — Relación entre las criaturas y las civilizaciones del mundo.

## Pasos

### Paso 1: Definir el nicho ecológico
Antes de diseñar la apariencia, establecer dónde vive la criatura en el ecosistema del mundo. ¿Es depredador, presa, parásito, simbionte? ¿Qué come, dónde duerme, cómo se reproduce? ¿Es solitaria o vive en grupo? Consultar \`reglas.md\` para verificar que la biología de la criatura es compatible con las reglas del mundo. El nicho ecológico determina la mayoría de las decisiones de diseño posteriores.

### Paso 2: Diseñar basándose en el comportamiento
La forma de una criatura debe surgir de lo que hace, no al revés. Un depredador emboscador tiene diseño diferente de un depredador perseguidor. Una criatura que vuela tiene proporciones diferentes de una que excava. Investigar animales reales que ocupen nichos similares y abstraer sus soluciones biológicas al lenguaje visual de la serie. No copiar animales reales sino entender por qué tienen la forma que tienen y aplicar esos principios.

### Paso 3: Aplicar lenguaje de formas
Consultar \`forma.md\` para definir si la criatura se percibe como amenazante, neutral o amigable. Las criaturas peligrosas usan formas angulares, asimetrías y proporciones que generan incomodidad. Las criaturas amigables usan formas redondeadas, ojos grandes y proporciones que evocan infancia. Las criaturas misteriosas combinan elementos familiares con elementos extraños. El lenguaje de formas debe ser consistente con el rol narrativo de la criatura.

### Paso 4: Definir la paleta cromática biológica
Consultar \`color.md\` para definir los colores de la criatura con lógica biológica. Los depredadores pueden tener colores de camuflaje o colores de advertencia. Las criaturas que necesitan atraer pareja pueden tener colores llamativos. Considerar también cómo el color de la criatura funciona contra los fondos donde aparece con más frecuencia. Si la criatura necesita destacar, usar colores complementarios al entorno. Si necesita integrarse, usar colores análogos.

### Paso 5: Crear el estilo de movimiento
Definir cómo se mueve la criatura: ¿es fluida o rígida? ¿Rápida o lenta? ¿Predecible o errática? El movimiento debe ser coherente con la anatomía diseñada y el comportamiento definido. Crear poses clave que muestren la criatura en reposo, en movimiento, en alerta, en ataque y en estado emocional relevante para la historia. Estas poses son la referencia para el equipo de animación y deben comunicar la personalidad motriz de la criatura.

### Paso 6: Diseñar la identidad sonora
Aunque el diseño sonoro final lo hace otro departamento, el diseñador de criaturas debe proponer la dirección sonora: ¿qué tipo de sonidos produce? ¿Graves o agudos? ¿Orgánicos o mecánicos? ¿Vocaliza o produce sonidos corporales? La identidad sonora debe ser coherente con el tamaño, la anatomía y el comportamiento de la criatura. Incluir referencias sonoras de animales reales o de efectos de sonido que capturen la intención.

### Paso 7: Crear el turnaround y la guía de escala
Producir la lámina de turnaround con vistas de frente, perfil y tres cuartos. Incluir comparativa de escala con un personaje humanoide. Si la criatura tiene partes móviles significativas (alas plegadas versus extendidas, cola enrollada versus extendida), mostrar ambas configuraciones. Añadir notas sobre anatomía, articulaciones principales y rango de movimiento de cada extremidad.

### Paso 8: Documentar variaciones y ciclo de vida
Si la criatura tiene variaciones (macho y hembra, juvenil y adulto, regional), diseñar cada variante con las diferencias documentadas. Si la criatura evoluciona o cambia durante la historia, diseñar cada estado con transiciones claras. Estas variaciones enriquecen el mundo y dan profundidad a la fauna del universo.

## Entregable
Paquete de diseño de criatura que incluya: ficha biológica con nicho ecológico, comportamiento y hábitat, lámina de turnaround con comparativa de escala, poses clave de movimiento y actuación, paleta de color con valores exactos, notas sobre identidad sonora con referencias, variaciones si aplica, y guía de animación con descripción de movimiento característico.

## Criterios de aprobación
- La anatomía de la criatura es coherente con su comportamiento y nicho ecológico.
- El lenguaje de formas comunica correctamente si es amenazante, neutral o amigable.
- Los colores tienen justificación biológica o narrativa.
- Las poses de movimiento son claras y animables.
- La criatura se integra visualmente con el estilo de la serie.
- La comparativa de escala es clara e inequívoca.
- La dirección sonora es coherente con el diseño visual.
- El director de arte y el director del episodio han aprobado el diseño.

## Errores comunes en este proceso
- Diseñar la criatura por estética sin considerar su biología ni comportamiento, produciendo seres incoherentes.
- Crear criaturas que son básicamente animales reales con un cuerno o un color diferente, sin diseño original.
- No definir el estilo de movimiento, dejando que cada animador interprete cómo se mueve la criatura.
- Diseñar criaturas con anatomía imposible de animar consistentemente.
- Olvidar la escala, produciendo confusión sobre el tamaño real de la criatura entre escenas.
- No considerar cómo se ve la criatura contra los fondos donde aparece, perdiéndose visualmente en su entorno.
- Crear criaturas excesivamente detalladas que son inconsistentes con el nivel de detalle del resto de la serie.
`,
    knowledgeRefs: ['Knowledge/Visual/forma.md', 'Knowledge/Visual/color.md', 'Knowledge/Worldbuilding/cultura.md', 'Knowledge/Visual/textura.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'disenar_escenarios',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Diseñar Escenarios',
    description: 'Proceso para crear los espacios donde la historia sucede, con identidad visual y narrativa propias.',
    content: `# Diseñar Escenarios

> Proceso para crear los espacios donde la historia sucede, con identidad visual y narrativa propias.

## Objetivo
Diseñar cada locación de la serie como un espacio con personalidad, atmósfera emocional y coherencia con el mundo narrativo, asegurando que los escenarios comuniquen información sobre la historia y los personajes que los habitan antes de que se diga una sola línea de diálogo.

## Cuándo usar este workflow
- Cuando se necesitan nuevas locaciones para episodios o temporadas.
- Cuando se rediseña una locación existente por cambios narrativos.
- Cuando se prepara la biblia visual de la serie y se definen los espacios del mundo.

## Archivos de referencia
- \`Knowledge/Visual/composicion.md\` — Principios de composición aplicados a fondos y entornos.
- \`Knowledge/Visual/color.md\` — Uso del color para definir atmósfera y emoción por locación.
- \`Knowledge/Visual/forma.md\` — Lenguaje de formas aplicado a arquitectura y espacios.
- \`Knowledge/Worldbuilding/reglas.md\` — Reglas del mundo que afectan la arquitectura y el entorno.
- \`Knowledge/Worldbuilding/cultura.md\` — Cultura, historia y sociedad que informan el diseño de espacios.

## Pasos

### Paso 1: Identificar todas las locaciones necesarias
Revisar los guiones o el outline de la temporada y listar cada locación mencionada o implícita. Clasificar cada una como: recurrente (aparece en múltiples episodios), ocasional (aparece en uno o dos episodios) o única (una sola escena). Las locaciones recurrentes reciben el mayor nivel de desarrollo. Anotar qué escenas ocurren en cada locación para entender su función narrativa.

### Paso 2: Definir el mood emocional de cada locación
Cada espacio debe tener un estado emocional predominante que apoye las escenas que ocurren en él. Definir para cada locación: ¿este lugar se siente seguro o amenazante? ¿Cálido o frío? ¿Íntimo o inmenso? ¿Ordenado o caótico? El mood debe alinearse con la función narrativa del espacio pero también puede usarse en contraste para generar tensión.

### Paso 3: Aplicar lenguaje de formas
Consultar \`forma.md\` para definir el vocabulario de formas de cada locación. Los espacios del protagonista tienden a formas que reflejan su personalidad. Los espacios del antagonista usan formas opuestas. La arquitectura, el mobiliario y hasta la vegetación deben seguir el lenguaje de formas asignado. Verificar que el lenguaje de formas del escenario sea compatible con los diseños de personajes que lo habitan.

### Paso 4: Diseñar la identidad cromática por locación
Consultar \`color.md\` para asignar a cada locación su paleta específica. Ninguna locación debe compartir la paleta exacta de otra a menos que haya una razón narrativa. La paleta debe comunicar el mood definido en el Paso 2. Considerar cómo cambia la paleta de la locación en diferentes momentos del día o diferentes momentos emocionales de la historia.

### Paso 5: Añadir detalles de habitabilidad
Un espacio creíble tiene signos de uso y de vida. Añadir objetos que cuenten historias sobre quién habita el lugar: marcas de uso en muebles, decoración personal, desorden intencional, plantas cuidadas o descuidadas. Cada detalle debe sentirse orgánico, no decorativo. Los detalles también pueden plantar información narrativa para escenas futuras.

### Paso 6: Diseñar para funcionalidad de animación
Verificar que cada escenario funcione para las escenas planificadas. Los personajes necesitan espacio para moverse, actuar y tener escenas de acción si las hay. Diseñar la locación desde múltiples ángulos para prever las necesidades del storyboard. Identificar capas de parallax para escenas que requieran profundidad. Asegurar que los elementos del fondo no compitan visualmente con los personajes en primer plano.

### Paso 7: Crear las láminas finales de escenario
Producir para cada locación recurrente: un diseño de establecimiento que muestre el exterior o la vista general, un plano de planta que muestre la distribución del espacio, al menos tres vistas interiores desde ángulos frecuentes en el storyboard, y una guía de props específicos del lugar. Para locaciones ocasionales, producir al menos la vista general y una vista interior.

## Entregable
Paquete de diseño de escenarios que incluya: láminas de diseño final de cada locación en color, planos de planta de locaciones recurrentes, guía de paleta de color por locación, notas sobre lenguaje de formas aplicado, y lista de props específicos de cada espacio. Todo organizado por locación con nomenclatura consistente.

## Criterios de aprobación
- Cada locación tiene una identidad visual distinguible de las demás.
- El mood emocional es legible sin contexto narrativo.
- El lenguaje de formas es consistente dentro de cada locación y coherente con el mundo.
- La paleta de color de cada locación es única y apoya la emoción de las escenas.
- Los detalles de habitabilidad hacen que los espacios se sientan vividos.
- Los escenarios funcionan para las necesidades de animación y storyboard.
- El director de arte ha aprobado todos los diseños.

## Errores comunes en este proceso
- Diseñar escenarios genéricos que no dicen nada sobre el mundo ni los personajes.
- Usar la misma paleta de color para todas las locaciones, haciéndolas indistinguibles.
- Olvidar la funcionalidad de animación: crear espacios bellos pero impracticables para las escenas.
- No considerar la iluminación y cómo cambia la locación en diferentes momentos del día.
- Añadir demasiados detalles que compiten con los personajes y hacen el fondo ruidoso.
- No diseñar vistas suficientes de las locaciones recurrentes, obligando a improvisar ángulos durante producción.
- Ignorar las reglas del mundo establecidas en la biblia, creando arquitectura que contradice la cultura del universo.
`,
    knowledgeRefs: ['Knowledge/Visual/forma.md', 'Knowledge/Visual/composicion.md', 'Knowledge/Visual/color.md', 'Knowledge/Worldbuilding/cultura.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'disenar_props',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Diseñar Props',
    description: 'Proceso para crear objetos narrativos y funcionales con intención de diseño y legibilidad visual.',
    content: `# Diseñar Props

> Proceso para crear objetos narrativos y funcionales con intención de diseño y legibilidad visual.

## Objetivo
Diseñar los objetos que aparecen en la serie asegurando que cada prop comunique información narrativa, sea visualmente legible a cualquier escala, mantenga coherencia con el mundo y el estilo visual, y cuando sea relevante, tenga potencial de merchandising.

## Cuándo usar este workflow
- Cuando el guion introduce objetos nuevos con relevancia narrativa.
- Cuando se prepara la biblia visual y se definen los objetos recurrentes del mundo.
- Cuando se diseñan objetos para escenas de acción o momentos clave de la trama.

## Archivos de referencia
- \`Knowledge/Visual/forma.md\` — Lenguaje de formas aplicado a objetos.
- \`Knowledge/Visual/color.md\` — Color como comunicador de función y pertenencia.
- \`Knowledge/Visual/composicion.md\` — Legibilidad visual y jerarquía.
- \`Knowledge/Branding/merchandising.md\` — Consideraciones de producto y licencias.

## Pasos

### Paso 1: Identificar props críticos para la narrativa
Revisar los guiones y listar todos los objetos que cumplen una función en la historia: armas, herramientas, dispositivos, objetos mágicos, objetos simbólicos, regalos entre personajes. Clasificar cada uno como: prop narrativo (la historia depende de él), prop de personaje (define o identifica a un personaje), prop ambiental (enriquece el mundo). Los props narrativos y de personaje reciben el mayor nivel de desarrollo.

### Paso 2: Definir la función y el significado de cada prop
Para cada prop importante, documentar: qué hace físicamente, qué significa emocionalmente, a quién pertenece, cuál es su historia dentro del mundo, y cómo evoluciona a lo largo de la serie. Un buen prop cuenta una historia por sí solo. La espada mellada dice algo diferente que la espada brillante. El objeto heredado tiene peso diferente al objeto comprado.

### Paso 3: Diseñar con lenguaje de formas
Consultar \`forma.md\` para aplicar el vocabulario de formas coherente con el dueño del objeto y su función. Los objetos de personajes heroicos tienden a formas dinámicas y abiertas. Los objetos peligrosos usan formas agresivas y angulares. La forma del objeto debe comunicar su naturaleza antes de que se explique verbalmente. Hacer múltiples exploraciones de formas antes de definir el diseño final.

### Paso 4: Aplicar color con intención
El color del prop debe vincularlo con su dueño o con su función narrativa. Un objeto que pertenece a un personaje debe usar los colores de ese personaje. Un objeto peligroso debe tener indicadores cromáticos de peligro. Consultar \`color.md\` para asegurar que el color del prop funciona contra los fondos donde aparecerá más frecuentemente. Evitar colores que se confundan con el entorno.

### Paso 5: Garantizar legibilidad a diferentes escalas
Dibujar el prop en tres escalas: primer plano detallado, plano medio donde el personaje lo sostiene, y plano general donde debe ser reconocible como silueta. El diseño debe funcionar en las tres escalas. Si el prop pierde legibilidad en plano general, simplificar la forma o exagerar un rasgo distintivo. La silueta es la prueba definitiva de un buen diseño de prop.

### Paso 6: Crear láminas de turnaround
Para cada prop narrativo y de personaje, producir una lámina de turnaround que muestre el objeto desde al menos cuatro ángulos: frente, perfil, espalda y tres cuartos. Incluir anotaciones de materiales, escala relativa (comparar con la mano del personaje que lo usa), y cualquier mecanismo o parte móvil. Si el prop cambia de estado durante la historia (se abre, se rompe, se transforma), mostrar cada estado.

### Paso 7: Evaluar potencial de merchandising
Para props icónicos de la serie, consultar \`merchandising.md\` para evaluar si el diseño funciona como producto físico. Un buen diseño de prop para merchandising tiene: forma reproducible, colores impactantes, y asociación clara con la serie. No comprometer el diseño narrativo por el merchandising, pero cuando ambos objetivos se alinean, optimizar para ambos.

### Paso 8: Documentar y entregar
Compilar todas las láminas de diseño en un paquete organizado por categoría (props narrativos, props de personaje, props ambientales). Incluir una hoja de referencia rápida con thumbnails de todos los props y sus nombres para uso del equipo de storyboard y animación.

## Entregable
Paquete de diseño de props que incluya: láminas de turnaround de cada prop narrativo y de personaje, ficha descriptiva con función, dueño y significado, pruebas de legibilidad a tres escalas, guía de color con valores exactos, y hoja de referencia rápida con thumbnails. Props ambientales se entregan como diseños de vista única con notas de estilo.

## Criterios de aprobación
- Cada prop narrativo tiene una silueta reconocible y única.
- El lenguaje de formas es coherente con su dueño y función.
- Los colores vinculan el prop con su contexto narrativo.
- El diseño es legible en primer plano, plano medio y plano general.
- Los turnarounds son suficientes para que cualquier artista pueda dibujar el prop desde cualquier ángulo.
- Los props con potencial de merchandising han sido evaluados.
- El director de arte ha aprobado todos los diseños.

## Errores comunes en este proceso
- Diseñar props genéricos que no dicen nada sobre el mundo ni sus dueños.
- Crear props demasiado detallados que pierden legibilidad en planos generales.
- No vincular el color del prop con su dueño, haciendo que parezca ajeno al personaje.
- Olvidar diseñar los estados alternativos del prop (roto, abierto, activado).
- No hacer turnarounds, obligando a los animadores a inventar cómo se ve el objeto desde atrás.
- Diseñar pensando solo en merchandising y producir un objeto que no se integra con el estilo visual de la serie.
- No definir la escala del prop respecto al personaje, generando inconsistencias de tamaño entre escenas.
`,
    knowledgeRefs: ['Knowledge/Visual/color.md', 'Knowledge/Visual/forma.md', 'Knowledge/Branding/merchandising.md', 'Knowledge/Visual/composicion.md'],
  },
  {
    id: 'disenar_vehiculos',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Diseñar Vehículos',
    description: 'Proceso para crear vehículos con personalidad, función narrativa y reconocimiento visual inmediato.',
    content: `# Diseñar Vehículos

> Proceso para crear vehículos con personalidad, función narrativa y reconocimiento visual inmediato.

## Objetivo
Diseñar vehículos que sean extensiones visuales de sus dueños, que comuniquen su función y personalidad a través de la forma, que sean reconocibles en silueta, y que estén preparados para las secuencias de acción y momentos narrativos clave donde participan.

## Cuándo usar este workflow
- Cuando el guion introduce un vehículo nuevo con relevancia narrativa.
- Cuando se diseña la flota de vehículos del mundo para la biblia visual.
- Cuando se prepara una secuencia de acción o persecución que requiere vehículos diseñados para rendimiento visual.

## Archivos de referencia
- \`Knowledge/Visual/forma.md\` — Lenguaje de formas y siluetas.
- \`Knowledge/Visual/color.md\` — Color como identificador y comunicador de personalidad.
- \`Knowledge/Visual/composicion.md\` — Composición y legibilidad en movimiento.

## Pasos

### Paso 1: Definir función y personalidad del dueño
Antes de dibujar, documentar: ¿para qué sirve este vehículo en la historia? ¿Quién lo conduce y qué dice el vehículo sobre esa persona? ¿Es una extensión de su personalidad o un contraste irónico? ¿El vehículo es nuevo, viejo, modificado, heredado, robado? La historia del vehículo informa su diseño tanto como su función mecánica. Un vehículo militar se ve diferente de uno civil aunque ambos vuelen.

### Paso 2: Aplicar lenguaje de formas
Consultar \`forma.md\` para definir el vocabulario de formas del vehículo. Vehículos heroicos tienden a formas aerodinámicas y proporciones equilibradas. Vehículos villanos usan formas agresivas e intimidantes. Vehículos cómicos exageran proporciones de forma inesperada. El lenguaje de formas del vehículo debe ser compatible con el de su dueño: un personaje angular conduce un vehículo angular. Explorar al menos 10 thumbnails de silueta antes de comprometerse con una dirección.

### Paso 3: Diseñar para reconocimiento de silueta
La silueta es la prueba definitiva del diseño de un vehículo. Rellenar la forma en negro sólido y verificar que es reconocible e identificable sin color ni detalle. Un buen diseño de vehículo se distingue de cualquier otro vehículo de la serie en silueta. Probar la silueta en diferentes ángulos: frente, perfil, tres cuartos y vista superior. Si dos vehículos se confunden en silueta, rediseñar uno de los dos.

### Paso 4: Definir los detalles que cuentan historias
Añadir detalles que revelen la historia del vehículo: abolladuras de batallas pasadas, modificaciones caseras, pegatinas, oxidación selectiva, reparaciones con materiales diferentes al original. Estos detalles no son decorativos sino narrativos. Cada marca en el vehículo debe poder responder la pregunta: ¿cómo llegó esto aquí? No sobrecargar: seleccionar los detalles más elocuentes.

### Paso 5: Diseñar el interior funcional
Si el vehículo tiene escenas interiores, diseñar la cabina o espacio interior con la misma intención narrativa. El interior revela al dueño más que el exterior: objetos personales, modificaciones, nivel de orden o desorden. Asegurar que el interior funcione para las necesidades de storyboard: espacio para actuación de personajes, visibilidad de expresiones, y ángulos de cámara posibles desde dentro.

### Paso 6: Planificar momentos clave de acción
Identificar las secuencias donde el vehículo tiene protagonismo: persecuciones, batallas, llegadas dramáticas, escapes. Para cada secuencia clave, diseñar poses de acción del vehículo que muestren velocidad, impacto o maniobra. Estas poses informan al equipo de storyboard y animación sobre las capacidades del vehículo y los ángulos más dinámicos para filmarlo.

### Paso 7: Crear el turnaround completo
Producir la lámina de turnaround con vistas de frente, perfil derecho, perfil izquierdo, tres cuartos frontal, tres cuartos trasero y vista superior. Incluir anotaciones de escala (comparar con un personaje de pie junto al vehículo), materiales, colores con valores exactos, y cualquier parte móvil (puertas, alas, paneles). Si el vehículo se transforma o tiene modos alternativos, mostrar cada configuración.

### Paso 8: Prueba de integración visual
Colocar el diseño final del vehículo en un fondo típico de la serie con su dueño a un lado para verificar la integración visual. El vehículo debe pertenecer al mismo mundo visual que los personajes y escenarios. Verificar que los colores funcionan contra los fondos principales y que el nivel de detalle es consistente con el estilo general de la serie.

## Entregable
Paquete de diseño de vehículo que incluya: lámina de turnaround completa con seis vistas mínimas, ficha descriptiva con función y dueño, prueba de silueta, diseño de interior (si aplica), poses de acción para secuencias clave, guía de color con valores exactos, comparativa de escala con personaje, y notas sobre partes móviles y configuraciones alternativas.

## Criterios de aprobación
- El vehículo es reconocible en silueta y no se confunde con otros de la serie.
- El lenguaje de formas es coherente con la personalidad de su dueño.
- Los detalles narrativos enriquecen el diseño sin sobrecargarlo.
- El turnaround permite dibujar el vehículo desde cualquier ángulo.
- Las poses de acción son dinámicas y realizables para el equipo de animación.
- El vehículo se integra visualmente con el estilo de la serie.
- El director de arte ha aprobado el diseño.

## Errores comunes en este proceso
- Diseñar el vehículo sin considerar quién lo conduce, produciendo diseños genéricos.
- Copiar diseños de vehículos reales sin estilizarlos al lenguaje visual de la serie.
- No probar la silueta y descubrir durante producción que dos vehículos son indistinguibles en plano general.
- Diseñar vehículos imposibles de animar por exceso de detalle o geometría compleja.
- Olvidar diseñar el interior cuando hay escenas planificadas dentro del vehículo.
- No definir la escala respecto a los personajes, causando que el vehículo cambie de tamaño entre escenas.
- Crear un diseño espectacular que no se integra con el estilo visual del resto de la serie.
`,
    knowledgeRefs: ['Knowledge/Visual/color.md', 'Knowledge/Visual/forma.md', 'Knowledge/Visual/composicion.md'],
  },
  {
    id: 'disenar_vestuario',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Diseñar Vestuario',
    description: 'Proceso para crear ropa que comunica personalidad, estatus y evolución del personaje.',
    content: `# Diseñar Vestuario

> Proceso para crear ropa que comunica personalidad, estatus y evolución del personaje.

## Objetivo
Diseñar el vestuario de cada personaje como una extensión visual de su identidad que comunique información sobre su personalidad, su posición social, su cultura y su arco narrativo, asegurando que la ropa funcione para animación y sea consistente con el estilo visual de la serie.

## Cuándo usar este workflow
- Cuando se finaliza el diseño de un personaje y se necesita definir su guardarropa.
- Cuando un personaje necesita vestuario nuevo para una temporada, arco narrativo o evento específico.
- Cuando se establece la moda y el código de vestimenta del mundo en la biblia visual.

## Archivos de referencia
- \`Knowledge/Visual/color.md\` — Color como comunicador de personalidad y afiliación.
- \`Knowledge/Visual/forma.md\` — Lenguaje de formas aplicado a siluetas de vestuario.
- \`Knowledge/Visual/textura.md\` — Texturas de tela y materiales.
- \`Knowledge/Characters/arquetipos.md\` — Personalidad y función narrativa de cada personaje.
- \`Knowledge/Characters/relaciones.md\` — Dinámicas que pueden reflejarse en el vestuario.

## Pasos

### Paso 1: Investigar el contexto del mundo
Antes de diseñar ropa, entender qué ropa existe en el mundo de la serie. ¿Qué tecnología textil hay? ¿Qué materiales están disponibles? ¿Hay influencias culturales específicas? ¿Existe una moda dominante o el vestuario es utilitario? La ropa de los personajes debe pertenecer a su mundo: no puede existir ropa que la tecnología o cultura del mundo no permita, a menos que haya una razón narrativa.

### Paso 2: Definir al personaje a través de su ropa
La ropa es la primera declaración visual que un personaje hace sobre sí mismo. Preguntarse: ¿este personaje elige su ropa con cuidado o se pone lo primero que encuentra? ¿Viste para impresionar, para pasar desapercibido, para comodidad, para intimidar? ¿Su ropa refleja quién es realmente o quién quiere aparentar ser? Consultar \`arquetipos.md\` para alinear el vestuario con la personalidad profunda del personaje.

### Paso 3: Aplicar color con intención
Consultar \`color.md\` para asignar la paleta cromática del vestuario. Los colores de la ropa deben vincularse con la paleta del personaje pero también comunicar información narrativa. Un personaje que oculta algo puede vestir colores que contrasten con su verdadera naturaleza. Un grupo o facción puede compartir un elemento cromático en su vestuario. Verificar que los colores del vestuario contrasten adecuadamente con los fondos más frecuentes del personaje.

### Paso 4: Diseñar con lenguaje de formas
Consultar \`forma.md\` para definir la silueta del vestuario. La silueta de un personaje vestido debe ser tan reconocible como su silueta desnuda. La ropa ajustada comunica algo diferente de la ropa holgada. Las líneas rectas sugieren rigidez o disciplina, las curvas sugieren suavidad o fluidez. El vestuario debe amplificar la silueta del personaje, no disolverla.

### Paso 5: Planificar la evolución del guardarropa
Los personajes que crecen cambian de ropa. Diseñar cómo evoluciona el vestuario del personaje a lo largo de la temporada o la serie. Los cambios pueden ser sutiles (nuevos colores, un accesorio nuevo) o dramáticos (un cambio completo de estilo tras un momento de transformación). La evolución del vestuario debe ser paralela al arco emocional del personaje. Documentar qué ropa usa en cada fase de su arco.

### Paso 6: Diseñar vestuario para momentos específicos
Además del atuendo cotidiano, diseñar vestuario para situaciones especiales: ropa de dormir, uniforme de trabajo o batalla, atuendo formal, ropa deteriorada tras una pelea, ropa para clima extremo. Cada variante debe sentirse como una elección que el personaje haría dentro de su personalidad. No diseñar más variantes de las que la producción necesita, pero cubrir todas las que los guiones requieren.

### Paso 7: Asegurar practicidad para animación
Verificar que el vestuario es animable: ¿la ropa tiene demasiados pliegues que serán inconsistentes entre frames? ¿Los accesorios se moverían de forma impredecible? ¿El diseño es reproducible consistentemente por diferentes animadores? Simplificar elementos que serán problemáticos sin perder la identidad del diseño. Consultar con el equipo de animación sobre elementos que anticipan como difíciles.

### Paso 8: Crear las láminas finales de vestuario
Producir para cada personaje: turnaround del atuendo principal con el personaje vistiendo cada pieza, close-ups de detalles significativos (texturas, accesorios, patrones), guía de color con valores exactos, y variantes de vestuario con notas sobre cuándo se usan. Si la ropa tiene capas o se quita parcialmente en alguna escena, mostrar cada configuración.

## Entregable
Paquete de vestuario por personaje que incluya: lámina de turnaround del atuendo principal, close-ups de detalles y accesorios, guía de color con valores exactos, variantes de vestuario con indicación de uso narrativo, plan de evolución del guardarropa a lo largo del arco, y notas de animación sobre elementos que requieren atención especial. Todo organizado por personaje.

## Criterios de aprobación
- El vestuario comunica la personalidad del personaje antes de que hable.
- Los colores están alineados con la paleta del personaje y funcionan contra los fondos.
- La silueta del personaje vestido es reconocible y distinguible de otros personajes.
- La evolución del guardarropa es coherente con el arco narrativo.
- El diseño es reproducible consistentemente por el equipo de animación.
- Las variantes cubren todas las situaciones requeridas por los guiones.
- El director de arte ha aprobado todos los diseños.

## Errores comunes en este proceso
- Diseñar ropa que se ve bien en una ilustración pero es imposible de mantener consistente en animación.
- No considerar el contexto cultural y tecnológico del mundo, creando anacronismos visuales.
- Hacer que todos los personajes vistan con el mismo nivel de cuidado cuando sus personalidades son diferentes.
- No planificar la evolución del vestuario y tener que improvisar cambios de ropa sin coherencia narrativa.
- Diseñar accesorios excesivamente detallados que se simplifican hasta ser irreconocibles en planos generales.
- No verificar cómo se ve el vestuario contra los fondos principales, produciendo personajes que se pierden en su entorno.
- Olvidar que la ropa se arruga, se ensucia y se deteriora, diseñando atuendos que siempre lucen perfectos sin justificación.
`,
    knowledgeRefs: ['Knowledge/Visual/forma.md', 'Knowledge/Visual/color.md', 'Knowledge/Characters/arquetipos.md', 'Knowledge/Characters/relaciones.md', 'Knowledge/Visual/textura.md'],
  },
  {
    id: 'guia_de_estilo',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Guía de Estilo',
    description: 'Proceso para crear el documento que define cómo se ve la serie en cada aspecto visual.',
    content: `# Guía de Estilo

> Proceso para crear el documento que define cómo se ve la serie en cada aspecto visual.

## Objetivo
Producir una guía de estilo completa que sirva como referencia definitiva para todo el equipo de arte, garantizando consistencia visual en diseño de personajes, escenarios, color, iluminación, línea y textura a lo largo de toda la producción, sin importar cuántos artistas trabajen en ella.

## Cuándo usar este workflow
- Cuando se inicia la preproducción de una nueva serie y se necesita definir su identidad visual.
- Cuando se incorporan nuevos artistas al equipo y necesitan una referencia clara.
- Cuando se actualiza la dirección de arte para una nueva temporada.

## Archivos de referencia
- \`Knowledge/Visual/composicion.md\` — Principios de composición y jerarquía visual.
- \`Knowledge/Visual/color.md\` — Teoría y aplicación del color.
- \`Knowledge/Visual/forma.md\` — Lenguaje de formas y su significado narrativo.
- \`Knowledge/Visual/linea.md\` — Calidad de línea y su impacto en el estilo.
- \`Knowledge/Visual/textura.md\` — Uso de texturas en la estética de la serie.

## Pasos

### Paso 1: Definir los principios de dirección de arte
Escribir entre 3 y 5 principios claros que guíen toda decisión visual de la serie. Estos principios deben ser específicos y accionables, no genéricos. Ejemplo válido: "Los personajes siempre son más saturados que sus entornos". Ejemplo inválido: "El arte debe ser de alta calidad". Cada principio debe poder usarse como criterio de decisión cuando un artista dude entre dos opciones.

### Paso 2: Establecer reglas de diseño de personajes
Documentar las convenciones de proporciones (cuántas cabezas de alto, relación cabeza-cuerpo), el nivel de estilización (realista, caricaturesco, geométrico), las reglas de ojos, boca y manos, y el rango de expresividad facial. Incluir ejemplos de lo que SÍ es correcto y lo que NO lo es. Consultar \`forma.md\` para definir el vocabulario de formas permitido para los personajes.

### Paso 3: Establecer reglas de entornos
Documentar el nivel de detalle de los fondos respecto a los personajes, las reglas de perspectiva (un punto, dos puntos, perspectiva libre), el tratamiento de la naturaleza versus lo artificial, y cómo los entornos interactúan visualmente con los personajes. Definir qué tan estilizados son los fondos y si siguen las mismas reglas de proporción que los personajes.

### Paso 4: Documentar las reglas de color
Incluir la paleta maestra de la serie, las reglas de saturación, las restricciones de temperatura de color por tipo de escena, y las convenciones de iluminación. Definir cómo se colorea la piel bajo diferentes luces, cómo se manejan las sombras (duras o suaves, de qué color), y si hay efectos cromáticos especiales como bloom o gradientes atmosféricos. Consultar \`color.md\` como base.

### Paso 5: Definir el enfoque de iluminación
Documentar las fuentes de luz típicas de la serie, el contraste estándar entre luz y sombra, si las sombras son proyectadas o ambientales, el uso de rim light o backlight, y cómo cambia la iluminación entre escenas diurnas y nocturnas. La iluminación define el mood tanto como el color y necesita reglas claras.

### Paso 6: Especificar la calidad de línea
Consultar \`linea.md\` para documentar: si la serie usa línea visible o no, el grosor de línea estándar y sus variaciones, si la línea varía de grosor o es uniforme, el color de la línea (negro, coloreada, invisible), y cómo se comporta la línea en diferentes escalas de plano (primer plano versus plano general).

### Paso 7: Definir el enfoque de texturas
Consultar \`textura.md\` para documentar: si la serie usa texturas y de qué tipo (ruido, granulado, pincelada), dónde se aplican texturas (personajes, fondos, ambos), la intensidad de las texturas, y si las texturas son consistentes o varían por tipo de escena. Incluir muestras de las texturas aprobadas.

### Paso 8: Crear la sección de DOs y DON'Ts
Compilar una galería visual clara de ejemplos correctos versus incorrectos para cada aspecto del estilo. Cada ejemplo debe mostrar un par: así sí, así no, con una explicación breve de por qué. Esta sección es la más consultada de la guía de estilo y debe ser inmediatamente útil. Cubrir al menos: proporciones, color, línea, expresiones, fondos e iluminación.

### Paso 9: Revisión y validación
Presentar la guía completa al equipo de arte para verificar que es comprensible y aplicable. Pedir a un artista que no participó en la creación de la guía que dibuje un personaje y un fondo siguiendo solo el documento. Si el resultado no es consistente con la visión, revisar las secciones que causaron confusión. Iterar hasta que la guía produzca resultados consistentes.

## Entregable
Documento de guía de estilo completo que incluya: principios de dirección de arte, reglas de diseño de personajes con ejemplos, reglas de entornos, guía de color con paletas y valores, enfoque de iluminación con diagramas, especificaciones de línea con muestras, enfoque de texturas con ejemplos, y galería de DOs y DON'Ts. Formato digital navegable y versión imprimible.

## Criterios de aprobación
- Los principios de dirección de arte son específicos y accionables.
- Un artista nuevo puede producir trabajo consistente con la serie siguiendo solo este documento.
- Cada sección incluye ejemplos visuales claros de lo correcto y lo incorrecto.
- Las reglas de color, línea y textura están documentadas con valores y muestras específicas.
- La guía cubre todos los aspectos visuales necesarios sin ambigüedades.
- El director de arte y el showrunner han aprobado el documento.
- Se ha validado con una prueba práctica de al menos un artista externo al proceso.

## Errores comunes en este proceso
- Escribir principios genéricos que no ayudan a tomar decisiones concretas.
- No incluir ejemplos visuales, dejando las reglas en texto abstracto que cada artista interpreta diferente.
- Crear una guía tan extensa que nadie la lee completa, perdiendo su utilidad práctica.
- No probar la guía con artistas que no participaron en su creación, asumiendo que es clara cuando no lo es.
- Olvidar definir la iluminación, que es uno de los aspectos más inconsistentes entre artistas.
- No actualizar la guía cuando la dirección de arte evoluciona, dejándola obsoleta a mitad de producción.
- Definir reglas contradictorias entre secciones por falta de revisión integral.
`,
    knowledgeRefs: ['Knowledge/Visual/forma.md', 'Knowledge/Visual/composicion.md', 'Knowledge/Visual/color.md', 'Knowledge/Visual/linea.md', 'Knowledge/Visual/textura.md'],
  },
  {
    id: 'guion_de_episodio',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Guion de Episodio',
    description: 'Proceso completo para transformar una premisa en un guion final con diálogos pulidos y subtexto.',
    content: `# Guion de Episodio

> Proceso completo para transformar una premisa en un guion final con diálogos pulidos y subtexto.

## Objetivo
Producir un guion de episodio listo para storyboard que contenga estructura sólida, diálogos con voz propia por personaje, subtexto emocional y ritmo narrativo adecuado al tono de la serie.

## Cuándo usar este workflow
- Cuando se asigna un nuevo episodio al equipo de guion.
- Cuando se necesita reescribir un episodio desde cero tras notas de revisión mayores.
- Cuando se adapta una historia de otra fuente al formato episódico de la serie.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\` — Principios de estructura narrativa y arcos por acto.
- \`Knowledge/Storytelling/conflicto.md\` — Tipos de conflicto y cómo escalarlos.
- \`Knowledge/Storytelling/humor.md\` — Reglas de comedia, timing y tipos de humor válidos para la serie.
- \`Knowledge/Storytelling/emocion.md\` — Cómo construir momentos emocionales auténticos.

## Pasos

### Paso 1: Definir la premisa y el conflicto central
Escribir en una sola oración qué quiere el protagonista en este episodio, qué se lo impide y qué está en juego. Consultar \`conflicto.md\` para asegurar que el conflicto tiene capas internas y externas. Verificar que la premisa conecta con el arco de temporada sin depender de él para funcionar de forma independiente.

### Paso 2: Crear el beat sheet
Listar entre 12 y 18 beats emocionales del episodio en orden cronológico. Cada beat debe indicar: qué sucede, qué siente el protagonista y cómo cambia la situación. Usar \`estructura.md\` como guía para distribuir los beats en la estructura de tres actos. Marcar el punto medio, la crisis y el clímax con claridad.

### Paso 3: Escribir el outline expandido
Convertir cada beat en un párrafo de 3 a 5 oraciones que describa la acción, la intención emocional y la información que el público recibe. No escribir diálogos todavía, solo describir qué se dice y con qué intención. Identificar dónde van los momentos de humor consultando \`humor.md\` y dónde los momentos emocionales consultando \`emocion.md\`.

### Paso 4: Primer borrador con diálogos
Escribir el guion completo en formato estándar: encabezados de escena, acción y diálogos. Cada personaje debe hablar con su voz única, no intercambiable con otro personaje. Leer cada línea de diálogo en voz alta para verificar que suena natural. No sobreescribir la acción: describir solo lo que la cámara vería.

### Paso 5: Añadir subtexto
Revisar cada escena preguntando: ¿qué quiere realmente el personaje debajo de lo que dice? Reescribir diálogos donde el personaje dice exactamente lo que siente, reemplazándolos con líneas que comuniquen la emoción de forma oblicua. Asegurar que al menos tres escenas del episodio funcionan en dos niveles: lo que se dice y lo que se significa.

### Paso 6: Revisión de consistencia de voz
Leer todo el diálogo de cada personaje de forma aislada, sin contexto de escena. Verificar que el vocabulario, el ritmo de habla y las muletillas son consistentes con la biblia del personaje. Ajustar líneas donde un personaje suene genérico o intercambiable con otro.

### Paso 7: Revisión de ritmo y estructura
Verificar la duración estimada del episodio según el conteo de páginas. Identificar escenas que se alargan sin aportar información nueva y recortarlas. Asegurar que cada acto termina con una pregunta dramática que empuja al siguiente. Revisar que el clímax llega en el momento estructural correcto.

### Paso 8: Pulido final
Eliminar líneas de diálogo redundantes. Verificar que las acotaciones son claras para el equipo de storyboard. Asegurar que las transiciones entre escenas son intencionales. Revisar ortografía, formato y nomenclatura de personajes y locaciones según la biblia de la serie.

## Entregable
Guion final en formato estándar (PDF y archivo editable) con portada que incluya título del episodio, número de episodio, nombre del guionista, número de borrador y fecha. El guion debe incluir encabezados de escena, acción, diálogos y notas de transición.

## Criterios de aprobación
- El conflicto central es claro desde el primer acto.
- Cada personaje tiene voz distinguible en sus diálogos.
- La estructura cumple con los principios de \`estructura.md\`.
- Hay al menos un momento emocional genuino y un momento de humor que funcione.
- El episodio funciona de forma independiente aunque contribuya al arco de temporada.
- La duración estimada está dentro del rango establecido para la serie.
- El guion ha pasado al menos una lectura en voz alta con el equipo.

## Errores comunes en este proceso
- Escribir diálogos donde los personajes explican la trama en lugar de vivirla.
- Saltar directamente al borrador sin hacer beat sheet, lo que produce episodios sin estructura clara.
- Hacer que todos los personajes hablen igual porque el guionista no consultó las voces individuales.
- Incluir demasiados beats secundarios que diluyen el conflicto central.
- No dejar espacio para la actuación visual: sobrecargar el diálogo cuando la animación podría comunicar la emoción.
- Olvidar plantar información necesaria para el tercer acto en el primer acto.
`,
    knowledgeRefs: ['Knowledge/Storytelling/humor.md', 'Knowledge/Storytelling/emocion.md', 'Knowledge/Storytelling/conflicto.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'guion_de_finale',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Guion de Finale',
    description: 'Proceso para cerrar arcos, pagar planteos y dejar al público satisfecho pero hambriento de más.',
    content: `# Guion de Finale

> Proceso para cerrar arcos, pagar planteos y dejar al público satisfecho pero hambriento de más.

## Objetivo
Escribir un episodio final de temporada que resuelva de forma satisfactoria los conflictos internos y externos del protagonista, pague todos los setups plantados durante la temporada, entregue un clímax emocionalmente potente y, si la serie continúa, deje un gancho que redefina las expectativas para la siguiente temporada.

## Cuándo usar este workflow
- Cuando se escribe el último episodio de una temporada.
- Cuando se escribe el episodio final de la serie completa.
- Cuando se reescribe un finale que no cumplió con las expectativas narrativas en revisiones previas.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\` — Principios de estructura narrativa y resolución de arcos.
- \`Knowledge/Storytelling/suspense.md\` — Técnicas de tensión, anticipación y liberación.
- \`Knowledge/Storytelling/conflicto.md\` — Resolución de conflictos y payoffs narrativos.
- \`Knowledge/Storytelling/emocion.md\` — Construcción de clímax emocional.

## Pasos

### Paso 1: Inventario de setups pendientes
Revisar todos los episodios de la temporada y crear una lista completa de cada setup, misterio, promesa narrativa y pregunta sin responder. Clasificar cada uno como: imprescindible de resolver en el finale, deseable de resolver, o mejor dejarlo para la siguiente temporada. Ningún setup imprescindible puede quedar sin payoff. Verificar que no se haya olvidado ningún hilo consultando las notas de cada guion de la temporada.

### Paso 2: Diseñar el clímax que resuelve conflicto interno y externo
El clímax del finale debe ser un momento donde la resolución del conflicto externo dependa directamente de la transformación interna del protagonista. Diseñar la situación donde el protagonista solo puede vencer al obstáculo externo si supera su debilidad interior. Consultar \`conflicto.md\` para asegurar que ambas capas convergen. El momento de decisión del protagonista debe ser el punto donde ambos conflictos se resuelven simultáneamente.

### Paso 3: Planificar la resolución emocional
Después del clímax hay que darle al público un momento de respiración emocional. Diseñar la secuencia de resolución donde se muestren las consecuencias del clímax en las relaciones entre personajes. Este no es un momento de acción sino de emoción: reencuentros, reconciliaciones, pérdidas asimiladas o nuevos equilibrios. Consultar \`emocion.md\` para construir este momento con autenticidad.

### Paso 4: Pagar los setups de la temporada
Distribuir los payoffs a lo largo de todo el episodio, no solo en el clímax. Algunos payoffs funcionan mejor como momentos pequeños y silenciosos que como grandes revelaciones. Verificar que cada payoff se siente ganado y no forzado. Si un setup no puede pagarse de forma satisfactoria, considerar si es mejor dejarlo abierto que cerrarlo mal.

### Paso 5: Construir la tensión progresiva
Usar las técnicas de \`suspense.md\` para escalar la tensión a lo largo del episodio. El finale debe sentirse como una escalera donde cada escena sube un peldaño de intensidad. Alternar momentos de tensión con breves respiros que hagan la siguiente subida más impactante. No revelar todas las cartas al inicio: dosificar la información para mantener la incertidumbre.

### Paso 6: Crear el gancho de temporada (si la serie continúa)
Si hay siguiente temporada, el gancho debe surgir orgánicamente de la resolución, no sentirse como un añadido. El gancho ideal recontextualiza la victoria del protagonista revelando que el verdadero desafío es diferente o mayor. No anular la satisfacción del clímax: el público debe sentir que esta temporada terminó bien Y que hay más historia. Si es el final de la serie, reemplazar el gancho con un cierre que resuene temáticamente con el piloto.

### Paso 7: Verificar el arco completo del protagonista
Releer el piloto y el finale juntos. El protagonista al final debe ser reconociblemente la misma persona pero transformada de forma específica y medible. La transformación debe sentirse inevitable en retrospectiva pero sorprendente en el momento. Verificar que la última escena del protagonista refleja su nueva condición.

### Paso 8: Revisión de impacto emocional
Hacer una lectura completa del episodio con el equipo creativo. Identificar el momento de mayor impacto emocional y verificar que está construido correctamente con anticipación y preparación. Probar si el finale funciona para alguien que ha visto toda la temporada: cada payoff debe generar reconocimiento. Ajustar ritmo y duración para que los momentos clave respiren.

## Entregable
Guion final del finale en formato estándar con portada completa. Documento anexo que mapee cada setup de la temporada con su payoff correspondiente en el finale, indicando escena y página. Lista de hilos abiertos para la siguiente temporada, si aplica.

## Criterios de aprobación
- Todos los setups clasificados como imprescindibles tienen un payoff claro y satisfactorio.
- El clímax resuelve simultáneamente el conflicto interno y externo del protagonista.
- Hay una secuencia de resolución emocional después del clímax que permite al público procesar.
- La tensión escala progresivamente a lo largo del episodio sin mesetas prolongadas.
- El protagonista muestra una transformación coherente con su arco de temporada.
- Si la serie continúa, el gancho genera curiosidad sin anular la satisfacción del cierre.
- Si es final de serie, el cierre resuena temáticamente con el inicio.
- El episodio funciona como culminación de toda la temporada, no solo como un episodio más.

## Errores comunes en este proceso
- Olvidar setups plantados en episodios intermedios que el público sí recuerda.
- Resolver el conflicto externo sin conectarlo con la transformación interna del protagonista.
- Sacrificar la resolución emocional por falta de tiempo, saltando directamente del clímax al gancho.
- Crear un gancho de temporada que anula la satisfacción del finale haciendo sentir que nada se resolvió.
- Introducir información nueva en el finale que debió plantarse antes.
- Hacer que el clímax dependa de un deus ex machina en lugar de las decisiones del protagonista.
- No darle tiempo suficiente al clímax: apresurarlo por querer llegar al gancho.
`,
    knowledgeRefs: ['Knowledge/Storytelling/emocion.md', 'Knowledge/Storytelling/conflicto.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Storytelling/suspense.md'],
  },
  {
    id: 'guion_de_piloto',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Guion de Piloto',
    description: 'Proceso para escribir el episodio más importante de la serie: el que engancha, establece y promete.',
    content: `# Guion de Piloto

> Proceso para escribir el episodio más importante de la serie: el que engancha, establece y promete.

## Objetivo
Crear un episodio piloto que enganche al espectador en los primeros tres minutos, presente al protagonista a través de sus acciones, establezca las reglas del mundo, defina el tono de la serie y plante las semillas del arco de temporada, todo sin sentirse expositivo.

## Cuándo usar este workflow
- Cuando se inicia el desarrollo de una nueva serie y se necesita el primer episodio.
- Cuando se reescribe un piloto tras feedback de ejecutivos o pruebas de audiencia.
- Cuando se adapta un concepto a un nuevo formato y se requiere un piloto de presentación.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\` — Principios de estructura narrativa y arcos por acto.
- \`Knowledge/Storytelling/conflicto.md\` — Tipos de conflicto y escalamiento.
- \`Knowledge/Storytelling/emocion.md\` — Construcción de momentos emocionales.
- \`Knowledge/Storytelling/humor.md\` — Tono cómico y reglas de humor de la serie.

## Pasos

### Paso 1: Definir qué debe establecer el piloto
Crear una lista exhaustiva de todo lo que el público necesita saber al final del episodio: quién es el protagonista, cuál es su deseo y su herida, cuáles son las reglas del mundo, quiénes son los personajes secundarios clave, cuál es el tono y cuál es la promesa de la serie. Priorizar esta lista: qué es imprescindible versus qué puede esperar a episodios posteriores.

### Paso 2: Diseñar el gancho de los primeros tres minutos
Los primeros tres minutos deben responder una pregunta implícita: ¿por qué debería seguir viendo? Diseñar una secuencia de apertura que establezca el tono, presente una pregunta dramática inmediata y muestre al protagonista en acción. No empezar con exposición ni con un día normal. Empezar con algo que solo pueda pasar en este mundo y con este personaje.

### Paso 3: Presentar al protagonista a través de acción
El protagonista no se presenta con descripción ni con diálogo expositivo. Se presenta tomando una decisión bajo presión. Diseñar una escena temprana donde el protagonista enfrente un dilema que revele su personalidad, sus valores y su forma de resolver problemas. Lo que elige y cómo lo elige dice más que cualquier narración.

### Paso 4: Establecer las reglas del mundo
Las reglas del mundo se establecen mostrándolas en funcionamiento, no explicándolas. Identificar las tres reglas más importantes del universo de la serie y diseñar momentos donde se activen de forma orgánica dentro de la trama. Si una regla necesita explicación verbal, encontrar la forma más breve y natural de darla a través de un personaje que tenga razón para explicarla.

### Paso 5: Introducir al elenco de forma memorable
Cada personaje secundario debe entrar en escena haciendo algo que lo defina. No presentar a más de cuatro personajes secundarios en el piloto. Cada uno debe tener un momento que muestre su relación con el protagonista y su función narrativa. El antagonista o la fuerza antagonista debe sentirse presente aunque no aparezca directamente.

### Paso 6: Plantar semillas del arco de temporada
Incluir al menos dos elementos que no se resuelvan en el piloto pero que generen curiosidad: un misterio, una relación sin resolver, una amenaza distante o una promesa. Estos elementos no deben distraer de la trama del piloto sino enriquecerla. El espectador debe sentir que hay más historia por descubrir.

### Paso 7: Construir un clímax que resuelva y abra
El clímax del piloto debe resolver el conflicto inmediato del episodio pero abrir una puerta más grande. El protagonista gana algo pero descubre que el verdadero desafío es mayor de lo que pensaba. El clímax debe demostrar el tipo de satisfacción emocional que la serie ofrecerá cada episodio.

### Paso 8: Terminar con un gancho hacia el futuro
La última escena del piloto debe crear una necesidad urgente de ver el siguiente episodio. No un cliffhanger barato sino una revelación que recontextualice lo que el público acaba de ver o una nueva pregunta que surja orgánicamente del clímax. El gancho debe prometer que la serie va a escalar.

### Paso 9: Revisión integral del piloto
Leer el piloto completo verificando que cumple con la lista del Paso 1. Todo lo imprescindible debe estar presente sin sentirse forzado. Hacer una lectura en voz alta con el equipo creativo para probar el ritmo y la claridad. Identificar cualquier momento donde la exposición frene la narrativa y encontrar formas visuales o dramáticas de comunicar esa información.

## Entregable
Guion de piloto en formato estándar con portada completa. Documento complementario de una página que liste: los elementos establecidos, las semillas plantadas para la temporada y las preguntas dramáticas abiertas al final del episodio. Nota de intención del guionista explicando las decisiones narrativas clave.

## Criterios de aprobación
- El gancho de apertura funciona en los primeros tres minutos sin depender de contexto previo.
- El protagonista se entiende por lo que hace, no por lo que se dice de él.
- Las reglas del mundo se sienten orgánicas, no expositivas.
- El tono de la serie queda definido de forma inequívoca.
- El piloto funciona como episodio independiente con inicio, desarrollo y cierre.
- Existen al menos dos semillas claras para el arco de temporada.
- El gancho final genera deseo genuino de ver más.
- La duración estimada respeta el formato de la serie.

## Errores comunes en este proceso
- Intentar establecer demasiado y producir un episodio sobrecargado de información.
- Empezar con una escena de la vida cotidiana del protagonista antes de que el público tenga razón para interesarse en él.
- Explicar las reglas del mundo a través de diálogos expositivos extensos.
- No darle al piloto un conflicto propio por enfocarse demasiado en plantar la temporada.
- Presentar a demasiados personajes sin darle a ninguno un momento definitorio.
- Terminar sin gancho porque se resolvió todo limpiamente.
- Escribir el piloto como si el público ya conociera y quisiera a los personajes.
`,
    knowledgeRefs: ['Knowledge/Storytelling/emocion.md', 'Knowledge/Storytelling/humor.md', 'Knowledge/Storytelling/conflicto.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'hoja_de_expresiones',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Hoja de Expresiones',
    description: 'Proceso para crear el model sheet de expresiones que garantiza consistencia emocional en la animación.',
    content: `# Hoja de Expresiones

> Proceso para crear el model sheet de expresiones que garantiza consistencia emocional en la animación.

## Objetivo
Producir una hoja de expresiones completa para cada personaje principal que documente sus emociones clave, expresiones intermedias, poses de actuación y reglas de deformación facial, sirviendo como referencia obligatoria para que cualquier animador pueda dibujar al personaje con consistencia emocional.

## Cuándo usar este workflow
- Cuando se finaliza el diseño de un personaje principal y se prepara para producción.
- Cuando se añade un personaje recurrente nuevo que necesita documentación de expresiones.
- Cuando hay inconsistencias en la actuación de un personaje entre animadores y se necesita una referencia clara.

## Archivos de referencia
- \`Knowledge/Animation/actuacion.md\` — Principios de actuación en animación y expresión emocional.
- \`Knowledge/Characters/arquetipos.md\` — Personalidad y rango emocional de cada personaje.
- \`Knowledge/Characters/voz.md\` — Voz y comportamiento del personaje que informan su expresividad.

## Pasos

### Paso 1: Identificar las emociones centrales del personaje
No todos los personajes expresan todas las emociones de la misma manera ni con la misma frecuencia. Consultar \`arquetipos.md\` y \`voz.md\` para determinar cuáles son las emociones que el personaje experimenta más frecuentemente y cuáles son raras pero impactantes. Un personaje tímido tiene muchas variaciones de incomodidad pero poca ira. Un personaje impulsivo tiene muchas variaciones de entusiasmo y frustración. Listar las 6 a 8 emociones más relevantes para el personaje.

### Paso 2: Dibujar las expresiones clave
Para cada emoción identificada, dibujar la expresión en su intensidad máxima. Estas son las expresiones ancla: la alegría más grande, la tristeza más profunda, la ira más intensa. Consultar \`actuacion.md\` para aplicar los principios de squash and stretch, asimetría facial y lenguaje corporal que hacen las expresiones creíbles. Cada expresión debe ser inequívocamente legible sin contexto.

### Paso 3: Crear expresiones intermedias
Entre las expresiones extremas hay un espectro de intensidad. Para cada emoción clave, dibujar al menos dos niveles intermedios: una versión sutil (la emoción apenas se asoma) y una versión moderada (la emoción es clara pero contenida). Estas expresiones intermedias son las que más se usan en escenas de diálogo y actuación sutil. Son más difíciles de dibujar consistentemente, por lo que necesitan documentación precisa.

### Paso 4: Diseñar expresiones mixtas
Los personajes rara vez sienten una sola emoción pura. Diseñar expresiones que combinan emociones: alegría con tristeza (nostalgia), ira con miedo (desesperación), sorpresa con alegría (asombro). Seleccionar las combinaciones más relevantes para las situaciones narrativas que el personaje enfrentará. Estas expresiones mixtas son las que dan profundidad a la actuación animada.

### Paso 5: Crear poses de actuación
Las expresiones no viven solo en el rostro. Diseñar poses de cuerpo completo que acompañen las emociones clave: la postura de derrota, la postura de determinación, el gesto de nerviosismo, la reacción de sorpresa. Cada pose debe ser una silueta expresiva que comunique la emoción a distancia. Incluir poses específicas del personaje: gestos habituales, manías corporales, posturas de descanso que lo caractericen.

### Paso 6: Documentar reglas de deformación
Establecer los límites de la deformación facial y corporal del personaje. ¿Qué tan lejos puede estirarse la boca? ¿Los ojos pueden salirse de la cabeza o la serie es más contenida? ¿Hasta dónde puede exagerarse el squash and stretch? Estos límites varían por personaje y por el tono de la serie. Documentar con ejemplos claros de deformación aceptable versus deformación excesiva.

### Paso 7: Crear la sección de DOs y DON'Ts
Compilar ejemplos específicos de errores comunes que los animadores deben evitar con este personaje. Ejemplo: "Este personaje nunca sonríe mostrando todos los dientes", "La ceja izquierda siempre sube más que la derecha cuando está escéptico", "Las orejas nunca se deforman aunque el resto de la cara sí". Cada regla debe tener un dibujo de ejemplo correcto e incorrecto.

### Paso 8: Revisión y validación
Presentar la hoja de expresiones al director de animación y al diseñador original del personaje. Verificar que las expresiones son fieles al diseño y a la personalidad del personaje. Pedir a un animador que no participó en la creación que dibuje al personaje usando solo la hoja como referencia. Si el resultado no es consistente, refinar las áreas que generaron confusión.

## Entregable
Hoja de expresiones completa por personaje que incluya: expresiones clave en intensidad máxima (6-8 emociones), expresiones intermedias por emoción (2 niveles), expresiones mixtas relevantes (4-6 combinaciones), poses de actuación de cuerpo completo (6-10 poses), guía de límites de deformación con ejemplos, y sección de DOs y DON'Ts con dibujos comparativos. Formato digital de alta resolución e imprimible para estaciones de trabajo.

## Criterios de aprobación
- Las emociones seleccionadas son representativas del rango emocional del personaje.
- Cada expresión es legible sin contexto narrativo.
- Las expresiones intermedias permiten transiciones suaves entre estados emocionales.
- Las poses de actuación comunican emoción en silueta.
- Los límites de deformación son claros y respetan el tono de la serie.
- La sección de DOs y DON'Ts previene los errores más frecuentes.
- Un animador externo puede reproducir las expresiones usando solo la hoja como referencia.
- El director de animación ha aprobado el documento.

## Errores comunes en este proceso
- Dibujar solo expresiones extremas sin las intermedias, dejando un vacío en el rango de actuación sutil.
- Crear expresiones genéricas que cualquier personaje podría tener en lugar de expresiones específicas de este personaje.
- No incluir poses de cuerpo completo, limitando la referencia al rostro cuando la actuación es de cuerpo entero.
- No definir límites de deformación, lo que produce inconsistencias entre animadores con estilos más o menos exagerados.
- Olvidar las expresiones mixtas, que son las más difíciles de mantener consistentes y las que más necesitan referencia.
- No validar la hoja con un animador externo, asumiendo que es clara cuando puede ser ambigua.
- Hacer la hoja demasiado restrictiva, eliminando la libertad del animador de aportar actuación propia dentro de los límites.
`,
    knowledgeRefs: ['Knowledge/Characters/voz.md', 'Knowledge/Animation/actuacion.md', 'Knowledge/Characters/arquetipos.md'],
  },
  {
    id: 'paleta_de_color',
    phase: '02_PreProduccion',
    phaseName: 'Pre-Producción',
    phaseIcon: '📐',
    phaseColor: '#b39ddb',
    title: 'Paleta de Color',
    description: 'Proceso para establecer la identidad cromática completa de la serie y sus reglas de uso.',
    content: `# Paleta de Color

> Proceso para establecer la identidad cromática completa de la serie y sus reglas de uso.

## Objetivo
Definir la paleta de color maestra de la serie que comunique su tono emocional, diferencie personajes y locaciones, evolucione con los arcos narrativos y funcione consistentemente en todos los tipos de escena, desde las más luminosas hasta las más oscuras.

## Cuándo usar este workflow
- Cuando se inicia el desarrollo visual de una nueva serie.
- Cuando se redefine la dirección de arte de una serie existente.
- Cuando se prepara una nueva temporada que requiere evolución cromática.

## Archivos de referencia
- \`Knowledge/Visual/color.md\` — Teoría del color, psicología cromática y técnicas de paleta.

## Pasos

### Paso 1: Definir el rango emocional de la serie
Antes de elegir colores, identificar las emociones extremas de la serie: ¿cuál es el momento más luminoso y cuál el más oscuro? ¿Cuál es el tono predominante: cálido, frío, neutro? ¿La serie es vibrante y saturada o apagada y sutil? Estas decisiones definen los límites dentro de los cuales operará toda la paleta. Documentar el rango emocional como una escala con ejemplos narrativos concretos.

### Paso 2: Elegir la paleta base
Seleccionar entre 5 y 8 colores base que representen la identidad visual de la serie. Estos colores deben funcionar juntos armónicamente y cubrir el rango emocional definido. Incluir al menos un color dominante (el que más se verá), un color de acento (para momentos de impacto), y colores de soporte. Consultar \`color.md\` para aplicar esquemas armónicos: complementarios, análogos, triádicos o split-complementarios.

### Paso 3: Asignar colores a personajes
Cada personaje principal debe tener un color o combinación cromática que lo identifique. Este color debe reflejar su personalidad y función narrativa. Los colores de personajes antagonistas deben contrastar con los del protagonista. Verificar que cuando todos los personajes aparecen juntos en pantalla, la composición cromática es armónica y cada uno es distinguible. Documentar los valores exactos (hex, RGB) de cada color de personaje.

### Paso 4: Asignar colores a locaciones
Cada locación recurrente debe tener su identidad cromática propia que no se confunda con otras. Los colores de las locaciones deben apoyar el mood emocional de las escenas que ocurren en ellas. Definir cómo interactúan los colores de los personajes con los de las locaciones: ¿el personaje destaca o se integra? Documentar la paleta específica de cada locación con sus variaciones por momento del día.

### Paso 5: Planificar la evolución cromática por arco
Los colores de la serie no son estáticos. Definir cómo evoluciona la paleta a lo largo de la temporada: ¿los colores se saturan o desaturan? ¿El tono se calienta o se enfría? ¿Aparecen colores nuevos que representan nuevos elementos narrativos? Crear un mapa cromático que muestre la progresión de color del primer episodio al último. Consultar \`color.md\` para técnicas de evolución cromática narrativa.

### Paso 6: Probar la paleta en diferentes tipos de escena
Crear pruebas de color aplicando la paleta a: una escena de diálogo íntima, una escena de acción dinámica, una escena nocturna, una escena de exterior con luz natural, una escena emocional intensa y una escena cómica. La paleta debe funcionar en todos los contextos sin perder su identidad. Ajustar los colores que no funcionen en algún contexto específico.

### Paso 7: Crear la guía de color definitiva
Compilar toda la información en un documento de referencia que incluya: la paleta base con valores exactos, las paletas de personajes, las paletas de locaciones, las reglas de evolución cromática, los colores prohibidos (los que nunca deben usarse), y ejemplos visuales de aplicación correcta e incorrecta. Este documento es la referencia obligatoria para todo el equipo de arte.

## Entregable
Guía de paleta de color de la serie que incluya: paleta base con swatches y valores exactos (hex, RGB, HSB), paletas individuales de cada personaje principal, paletas de cada locación recurrente, mapa de evolución cromática por temporada, pruebas de aplicación en diferentes tipos de escena, y lista de colores prohibidos con explicación. Formato digital editable y PDF de referencia.

## Criterios de aprobación
- La paleta base comunica el tono emocional de la serie de forma inmediata.
- Cada personaje principal es identificable por su color incluso en silueta con color plano.
- Cada locación tiene una identidad cromática distinguible.
- La paleta funciona en todos los tipos de escena probados sin perder identidad.
- Existe un plan claro de evolución cromática que apoya el arco narrativo.
- Los valores de color están documentados con precisión para reproducibilidad.
- El director de arte y el showrunner han aprobado la paleta.

## Errores comunes en este proceso
- Elegir colores que se ven bien de forma aislada pero que juntos no funcionan armónicamente.
- Asignar colores a personajes sin considerar cómo se ven juntos en escena.
- No probar la paleta en escenas oscuras o nocturnas, donde muchos esquemas de color fallan.
- Hacer la paleta demasiado amplia, perdiendo identidad visual, o demasiado restrictiva, limitando la expresividad.
- No planificar la evolución cromática y descubrir a mitad de temporada que la paleta no puede expresar lo que la historia necesita.
- Olvidar documentar los valores exactos, lo que lleva a inconsistencias entre artistas.
- No definir colores prohibidos, permitiendo que aparezcan colores que rompen la identidad visual.
`,
    knowledgeRefs: ['Knowledge/Visual/color.md'],
  },
  {
    id: 'animar_accion',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Animar Secuencias de Accion',
    description: 'Proceso para crear coreografias de combate, persecuciones y secuencias de alto impacto con legibilidad y peso visual.',
    content: `# Animar Secuencias de Accion

> Proceso para crear coreografias de combate, persecuciones y secuencias de alto impacto con legibilidad y peso visual.

## Objetivo
Producir animacion de accion que sea coreograficamente clara, fisicamente creible y emocionalmente impactante, asegurando que cada golpe, salto o maniobra se lea con precision incluso a alta velocidad.

## Cuando usar este workflow
- Escenas de combate cuerpo a cuerpo o con armas.
- Persecuciones a pie, en vehiculo o en vuelo.
- Secuencias de escape, infiltracion o destruccion a gran escala.
- Cualquier momento donde la accion fisica es el motor narrativo de la escena.

## Archivos de referencia
- \`Knowledge/Animation/timing.md\`
- \`Knowledge/Animation/staging.md\`
- \`Knowledge/Animation/actuacion.md\`
- \`Knowledge/Cinematography/camaras.md\`

## Pasos

### Paso 1: Analizar el proposito narrativo de la accion
Antes de animar un solo fotograma, responder: que cuenta esta pelea o persecucion. Identificar el arco emocional de la secuencia (quien empieza ganando, donde cambia la ventaja, cual es el climax). Definir que debe sentir el espectador en cada tramo. La accion sin proposito narrativo es ruido visual.

### Paso 2: Disenar la coreografia en papel
Crear un diagrama de flujo de la secuencia con bloques de accion. Cada bloque contiene: accion del atacante, reaccion del defensor, consecuencia espacial. Marcar los beats de impacto (momentos donde el espectador debe sentir el golpe). Verificar que la coreografia refleja la personalidad de cada personaje segun sus fichas.

### Paso 3: Establecer la puesta en escena
Definir el espacio fisico de la accion y como se usa narrativamente. Colocar obstaculos, niveles de altura y elementos interactivos del entorno. Asegurar que el espectador siempre entiende donde esta cada personaje en relacion a los demas. Consultar staging.md para principios de composicion en movimiento.

### Paso 4: Definir la estrategia de camara
Elegir los movimientos de camara que maximizan el impacto sin sacrificar legibilidad. Para golpes de impacto: camara firme con anticipacion clara. Para persecuciones: tracking shots que transmiten velocidad. Para momentos de giro: cambio de angulo que revela nueva informacion. Evitar movimientos de camara que compitan con la accion.

### Paso 5: Bloquear el timing general
Crear el blocking de la secuencia completa con poses clave a baja fidelidad. Establecer la duracion de cada beat de accion. Aplicar la regla de contraste ritmico: momentos rapidos seguidos de pausas breves para que el ojo descanse. Consultar timing.md para los principios de espaciado en accion rapida.

### Paso 6: Animar las poses de impacto
Trabajar primero los fotogramas de contacto e impacto, que son los mas importantes. Cada impacto necesita tres fases: anticipacion (viento), contacto (smear o freeze frame de 1-2 fotogramas) y consecuencia (reaccion del receptor). Exagerar las siluetas en los momentos de impacto para que se lean incluso en pantallas pequenas.

### Paso 7: Construir las transiciones entre impactos
Animar los arcos de movimiento entre poses clave. Usar spacing variable: rapido hacia el impacto, lento en la recuperacion. Incorporar overlapping action en capas, pelo, ropas y elementos secundarios que refuercen la fisicidad. Mantener la linea de accion clara en cada transicion.

### Paso 8: Aplicar efectos de camara en accion
Agregar camera shake controlado en impactos mayores. Usar speed lines, motion blur o smears en momentos de maxima velocidad. Incorporar cambios de profundidad de campo para dirigir la atencion. Cada efecto debe tener una razon narrativa, no decorativa.

### Paso 9: Integrar reacciones secundarias
Animar las respuestas del entorno: polvo que se levanta, objetos que se rompen, espectadores que reaccionan. Estos elementos refuerzan el peso y la consecuencia de la accion. Verificar que las reacciones secundarias no distraigan del foco principal.

### Paso 10: Revisar legibilidad a velocidad real
Reproducir la secuencia completa a velocidad final sin pausas. Si algun movimiento no se entiende en primera lectura, simplificar. Verificar en pantalla reducida (simular tamano movil). Hacer la prueba de silueta: cubrir los detalles y verificar que la accion se entiende solo con las formas.

## Entregable
Secuencia de accion animada completa con timing final, efectos de camara integrados y reacciones secundarias, lista para revision de direccion.

## Criterios de aprobacion
- Cada golpe o maniobra se lee claramente en una sola visualizacion a velocidad real.
- La coreografia refleja la personalidad y habilidades de cada personaje.
- Existe contraste ritmico entre momentos de alta intensidad y pausas.
- Los impactos tienen peso visual (anticipacion, contacto, consecuencia).
- La camara nunca compite con la accion por la atencion del espectador.
- El arco emocional de la secuencia es claro: inicio, escalada, climax, resolucion.
- La accion funciona narrativamente, no solo como espectaculo visual.

## Errores comunes en este proceso
- Animar toda la secuencia a la misma velocidad sin variacion ritmica, produciendo fatiga visual.
- Mover la camara constantemente creyendo que eso genera energia, cuando genera confusion.
- Olvidar las reacciones: un golpe sin consecuencia visible no tiene peso.
- Sacrificar la claridad de la coreografia por la complejidad del movimiento.
- No establecer la geografia del espacio, haciendo que el espectador pierda orientacion.
- Animar accion generica que no refleja quien es cada personaje ni que esta en juego.
`,
    knowledgeRefs: ['Knowledge/Cinematography/camaras.md', 'Knowledge/Animation/actuacion.md', 'Knowledge/Animation/timing.md', 'Knowledge/Animation/staging.md'],
  },
  {
    id: 'animar_comedia',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Animar Escenas de Comedia',
    description: 'Proceso para crear animacion comica con timing preciso, exageracion controlada, beats de reaccion y ritmo humoristico.',
    content: `# Animar Escenas de Comedia

> Proceso para crear animacion comica con timing preciso, exageracion controlada, beats de reaccion y ritmo humoristico.

## Objetivo
Producir animacion comica donde el timing, la exageracion y las reacciones generen risa genuina, respetando las reglas del humor visual y la coherencia de los personajes.

## Cuando usar este workflow
- Escenas cuyo proposito principal es generar humor.
- Momentos comicos dentro de escenas dramaticas o de accion (comic relief).
- Gags visuales, slapstick o humor situacional.
- Reacciones comicas de personajes ante situaciones inesperadas.

## Archivos de referencia
- \`Knowledge/Animation/timing.md\`
- \`Knowledge/Animation/actuacion.md\`
- \`Knowledge/Storytelling/humor.md\`

## Pasos

### Paso 1: Identificar el tipo de humor de la escena
Clasificar el gag: humor fisico (slapstick), humor de reaccion, humor de situacion, humor de repeticion, humor de subversion de expectativa o humor de caracter. Cada tipo requiere un approach de animacion distinto. Consultar humor.md para las estructuras comicas disponibles y elegir la que mejor sirve al momento.

### Paso 2: Definir la estructura del gag
Todo chiste tiene setup, build y punchline. Identificar cada parte en la escena. El setup establece la expectativa, el build la refuerza y el punchline la rompe. En gags visuales, el punchline es un cambio de pose, expresion o situacion que llega en el momento exacto. Marcar en la linea de tiempo donde cae cada elemento.

### Paso 3: Calcular el timing del punchline
El humor vive y muere en el timing. Un punchline un segundo antes es confusion, un segundo despues es aburrimiento. Regla general: el punchline debe llegar justo cuando el espectador empieza a anticipar pero antes de que confirme. Crear variaciones de timing y probar cual genera la mejor respuesta. Consultar timing.md para principios de spacing comico.

### Paso 4: Disenar la anticipacion exagerada
La comedia permite y requiere exageracion que el drama no admite. Usar squash and stretch amplificado, takes exagerados y poses imposibles si sirven al gag. La anticipacion en comedia es mas larga y pronunciada que en animacion realista: el viento antes del golpe comico es parte del chiste.

### Paso 5: Animar las poses de reaccion
Las reacciones son donde vive la mitad del humor. El personaje que recibe el gag es tan importante como el que lo ejecuta. Animar takes clasicos con escalas de reaccion: take simple (sorpresa menor), double take (realizacion tardia), slow burn (acumulacion gradual de frustracion). Cada personaje debe reaccionar segun su personalidad.

### Paso 6: Trabajar los beats de pausa
La pausa comica es sagrada. Despues del punchline visual, dar al espectador un beat para procesar y reir. Despues de una caida, un instante de quietud antes de la reaccion. El silencio entre gags evita la fatiga comica. Marcar las pausas en la linea de tiempo como elementos activos, no como vacio.

### Paso 7: Incorporar el humor secundario
Agregar capas de comedia en segundo plano o en detalles que recompensan la segunda visualizacion. Un personaje en el fondo que reacciona, un objeto que cae en cadena, un detalle visual que contradice lo que se dice. Estos elementos no deben competir con el gag principal sino enriquecerlo.

### Paso 8: Calibrar el nivel de exageracion
Verificar que la exageracion sea coherente con el tono general de la serie. Un gag con deformacion extrema en una serie semi-realista rompe la inmersion. Un gag demasiado sutil en una serie expresiva pasa desapercibido. Establecer el rango de exageracion permitido y mantenerlo consistente.

### Paso 9: Probar con audiencia fresca
Mostrar la secuencia a alguien que no conoce el contexto. Si el gag visual funciona sin explicacion, esta bien ejecutado. Si necesita contexto, el timing o la claridad visual necesitan ajuste. Registrar en que momento exacto se produce la reaccion (o la falta de ella).

## Entregable
Escena comica animada con timing de gag calibrado, reacciones completas, pausas comicas integradas y exageracion coherente con el tono de la serie.

## Criterios de aprobacion
- El punchline visual se entiende sin necesidad de dialogo explicativo.
- El timing del gag produce la reaccion deseada en visualizacion a velocidad real.
- Las reacciones de los personajes son especificas a su personalidad, no genericas.
- Existe al menos una pausa comica despues de cada punchline mayor.
- El nivel de exageracion es consistente con el tono visual de la serie.
- Los gags secundarios enriquecen sin distraer del gag principal.
- La secuencia mantiene su humor en visualizaciones repetidas.

## Errores comunes en este proceso
- Apresurar el punchline sin dar suficiente setup, eliminando el contraste comico.
- Encadenar gags sin pausas, causando fatiga comica y reduciendo el impacto de cada uno.
- Usar el mismo nivel de exageracion para todo, eliminando la jerarquia de humor.
- Olvidar las reacciones: un gag sin testigo pierde la mitad de su efecto.
- Animar comedia con el mismo timing que el drama, perdiendo la energia que el humor necesita.
- Forzar gags que no encajan con la personalidad establecida del personaje.
`,
    knowledgeRefs: ['Knowledge/Storytelling/humor.md', 'Knowledge/Animation/actuacion.md', 'Knowledge/Animation/timing.md'],
  },
  {
    id: 'animar_dialogo',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Animar Escenas de Dialogo',
    description: 'Proceso para crear conversaciones animadas con actuacion creible, reacciones naturales y subtexto corporal.',
    content: `# Animar Escenas de Dialogo

> Proceso para crear conversaciones animadas con actuacion creible, reacciones naturales y subtexto corporal.

## Objetivo
Producir escenas de dialogo donde la animacion eleve la conversacion mas alla de las palabras, usando actuacion corporal, gestos y reacciones para revelar lo que los personajes realmente piensan y sienten mientras hablan.

## Cuando usar este workflow
- Cualquier escena donde dos o mas personajes conversan.
- Monologos con audiencia visible que reacciona.
- Interrogatorios, negociaciones, confesiones o debates.
- Escenas expositivas que necesitan mantenerse visualmente vivas.

## Archivos de referencia
- \`Knowledge/Animation/actuacion.md\`
- \`Knowledge/Animation/staging.md\`

## Pasos

### Paso 1: Analizar el subtexto de la conversacion
Leer el dialogo completo e identificar que quiere realmente cada personaje (no lo que dice, sino lo que busca). Marcar las lineas donde hay discrepancia entre lo dicho y lo sentido. Esas lineas son las oportunidades de oro para la animacion: donde el cuerpo puede contradecir la boca.

### Paso 2: Definir la dinamica de poder
Toda conversacion tiene una dinamica de poder que cambia durante la escena. Identificar quien domina al inicio, donde cambia el control y quien termina con la ventaja. Esta dinamica se traduce en postura, ocupacion del espacio, altura relativa y direccion de la mirada.

### Paso 3: Disenar la puesta en escena de la conversacion
Decidir la disposicion espacial de los personajes. La distancia entre ellos comunica la relacion: intimidad, hostilidad, formalidad. Consultar staging.md para composiciones de dialogo efectivas. Planificar como cambia la disposicion durante la escena si la dinamica evoluciona.

### Paso 4: Asignar gestos especificos por personaje
Cada personaje tiene un vocabulario gestual propio basado en su personalidad. Un personaje nervioso juega con sus manos, uno dominante ocupa espacio, uno inseguro se protege cruzando brazos. Definir 3-4 gestos recurrentes por personaje para esta conversacion y usarlos con consistencia.

### Paso 5: Animar al personaje que escucha
El error mas comun en dialogos animados es congelar al personaje que no habla. El oyente esta procesando, reaccionando, preparando su respuesta. Animar microreacciones mientras el otro habla: un leve asentimiento, una ceja que se levanta, un cambio de peso corporal. El oyente cuenta la otra mitad de la historia.

### Paso 6: Trabajar la sincronizacion gesto-palabra
Los gestos naturales anticipan las palabras, no las acompanan. Un personaje que senala antes de decir "ahi" se siente real; uno que senala exactamente al decirlo se siente robotico. Desfasar los gestos 2-4 fotogramas antes de la palabra clave correspondiente.

### Paso 7: Incorporar las interrupciones y turnos de habla
Las conversaciones reales no son turnos limpios. Animar solapamientos: un personaje empieza a hablar antes de que el otro termine, uno interrumpe y el otro se detiene a mitad de gesto. Incluir los intentos fallidos de hablar: abrir la boca y cerrarla al ser cortado.

### Paso 8: Animar los silencios significativos
Los momentos donde nadie habla son los mas poderosos en un dialogo. Animar que hace cada personaje durante el silencio: uno desvía la mirada, otro traga saliva, otro busca las palabras. El silencio nunca es vacio en una buena animacion de dialogo.

### Paso 9: Verificar la variedad visual
Revisar que la escena no se convierta en cabezas parlantes estaticas. Incorporar cambios de postura, desplazamientos sutiles, interaccion con el entorno (apoyarse en algo, recoger un objeto, mirar por la ventana). Cada cambio debe estar motivado por la emocion, no ser aleatorio.

### Paso 10: Revisar la continuidad de la actuacion
Verificar que los gestos, posturas y expresiones mantienen coherencia a lo largo de toda la conversacion. Un personaje que cruza los brazos en un plano debe mantenerlos cruzados en el contraplano hasta que haya una razon para descruznrlos. Revisar cada corte de camara por saltos de continuidad gestual.

## Entregable
Escena de dialogo completamente animada con actuacion diferenciada por personaje, reacciones del oyente, subtexto corporal y continuidad gestual verificada.

## Criterios de aprobacion
- Ambos personajes estan actuando en todo momento, incluyendo al que escucha.
- El subtexto corporal complementa o contradice el dialogo segun la intencion.
- Cada personaje tiene gestos propios que lo distinguen del otro.
- La dinamica de poder es visible en la composicion y el lenguaje corporal.
- Los gestos anticipan las palabras de forma natural.
- No hay momentos de congelamiento involuntario en ningun personaje.
- La continuidad gestual se mantiene entre todos los angulos de camara.

## Errores comunes en este proceso
- Congelar al personaje que escucha, creando la sensacion de que el mundo se pausa mientras uno habla.
- Sincronizar gestos exactamente con las palabras en vez de anticiparlos, produciendo animacion robotica.
- Usar los mismos gestos genericos para todos los personajes sin diferenciacion.
- Llenar cada segundo con movimiento excesivo, cuando a veces la quietud es la eleccion correcta.
- Ignorar el subtexto y animar literalmente lo que dice el dialogo.
- No planificar los cambios de dinamica de poder, haciendo que la conversacion se sienta plana.
`,
    knowledgeRefs: ['Knowledge/Animation/actuacion.md', 'Knowledge/Animation/staging.md'],
  },
  {
    id: 'animar_drama',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Animar Escenas Dramaticas',
    description: 'Proceso para crear animacion con actuacion sutil, microexpresiones y peso emocional que conecte al espectador con los personajes.',
    content: `# Animar Escenas Dramaticas

> Proceso para crear animacion con actuacion sutil, microexpresiones y peso emocional que conecte al espectador con los personajes.

## Objetivo
Producir animacion dramatica donde cada gesto, mirada y silencio comunique la vida interior del personaje, logrando que el espectador sienta la emocion antes de que se diga una sola palabra.

## Cuando usar este workflow
- Escenas de confrontacion emocional entre personajes.
- Momentos de revelacion, perdida, decision dificil o transformacion interna.
- Dialogos donde lo que no se dice es mas importante que lo que se dice.
- Secuencias introspectivas o de vulnerabilidad del personaje.

## Archivos de referencia
- \`Knowledge/Animation/actuacion.md\`
- \`Knowledge/Animation/timing.md\`

## Pasos

### Paso 1: Identificar la emocion central y su subtexto
Definir que siente el personaje en esta escena y que esta tratando de ocultar o comunicar. La emocion dramatica rara vez es una sola cosa: es la tension entre lo que se muestra y lo que se esconde. Escribir en una frase: "El personaje siente X pero intenta mostrar Y." Esa tension es la guia de toda la animacion.

### Paso 2: Estudiar la trayectoria emocional
Mapear como evoluciona la emocion durante la escena. No es estatica: comienza en un estado y termina en otro. Crear una linea de tiempo emocional con los puntos de inflexion marcados. Identificar el momento exacto donde la emocion cambia, porque ese fotograma define la escena.

### Paso 3: Elegir el nivel de contencion
Decidir cuanto muestra el personaje. La animacion dramatica efectiva trabaja con restriccion: un personaje que lucha por no llorar es mas poderoso que uno que llora abiertamente. Definir el "volumen emocional" del personaje en cada tramo de la escena, donde 1 es total contencion y 10 es quiebre completo.

### Paso 4: Disenar las microexpresiones clave
Identificar 3-5 momentos donde una microexpresion cuenta la historia interior. Estas son fugaces: un temblor en el labio, un parpadeo contenido, una mirada que se desvía un instante. Dibujar las poses clave de cada microexpresion. Consultar actuacion.md para los principios de expresion facial por capas.

### Paso 5: Animar el cuerpo como reflejo emocional
El cuerpo revela lo que el rostro intenta ocultar. Un personaje que dice estar bien pero aprieta los punos, uno que se encoge casi imperceptiblemente, manos que buscan algo que sostener. Animar primero la postura general y el peso corporal, luego agregar los gestos sutiles de manos y hombros.

### Paso 6: Trabajar los ojos como centro dramatico
Los ojos son donde el espectador busca la verdad. Animar la direccion de la mirada con intencion: a donde mira el personaje revela en que esta pensando. Trabajar los parpadeos como puntuacion emocional. Un parpadeo lento puede ser aceptacion, uno rapido puede ser nerviosismo. Animar la humedad y el brillo ocular en momentos de quiebre.

### Paso 7: Calibrar el timing emocional
El drama vive en la pausa. Alargar los silencios donde la emocion necesita espacio. Usar timing lento para momentos de realizacion y timing ligeramente mas rapido para reacciones de defensa emocional. Consultar timing.md para las tecnicas de spacing en actuacion sutil. Cada segundo de pausa debe estar justificado.

### Paso 8: Incorporar la respiracion como herramienta
La respiracion es el indicador mas honesto del estado emocional. Animar respiracion contenida en momentos de tension, una exhalacion temblorosa en alivio o quiebre, respiracion acelerada en ansiedad. La respiracion conecta al espectador a nivel fisico con la emocion del personaje.

### Paso 9: Revisar sin audio
Reproducir la escena en silencio. Si la emocion se transmite sin dialogo ni musica, la animacion funciona. Si necesita las palabras para comunicar lo que siente el personaje, la actuacion necesita mas trabajo. La animacion dramatica debe poder contar la historia emocional de forma muda.

### Paso 10: Ajustar con audio y verificar sinergia
Integrar el audio y verificar que la animacion y la voz trabajan en la misma direccion sin redundancia. Si la voz dice tristeza y la animacion muestra tristeza identica, hay redundancia. Buscar complementariedad: la voz puede mostrar fortaleza mientras el cuerpo revela fragilidad.

## Entregable
Escena dramatica animada con actuacion completa, microexpresiones, lenguaje corporal y timing emocional calibrado, lista para integracion con audio final.

## Criterios de aprobacion
- La emocion central se transmite sin necesidad de dialogo.
- Las microexpresiones son sutiles pero detectables en visualizacion normal.
- El lenguaje corporal complementa (no duplica) lo que dice la voz.
- El timing respeta las pausas emocionales sin sentirse lento o vacio.
- La respiracion del personaje esta animada y refleja su estado interno.
- Existe una progresion emocional clara del inicio al final de la escena.
- El nivel de contencion es coherente con la personalidad del personaje.

## Errores comunes en este proceso
- Exagerar las expresiones faciales, convirtiendo el drama en melodrama.
- Animar al personaje completamente estatico creyendo que eso es subtileza, cuando es rigidez.
- Olvidar el cuerpo y concentrar toda la actuacion solo en la cara.
- Hacer que todos los personajes expresen la emocion de la misma manera, sin personalidad individual.
- No dejar espacio para el silencio, llenando cada segundo con movimiento.
- Duplicar en la animacion exactamente lo que ya dice el dialogo, perdiendo la oportunidad de subtexto.
`,
    knowledgeRefs: ['Knowledge/Animation/actuacion.md', 'Knowledge/Animation/timing.md'],
  },
  {
    id: 'animar_multitud',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Animar Escenas de Multitud',
    description: 'Proceso para gestionar multiples personajes en pantalla sin perder claridad narrativa ni jerarquia visual.',
    content: `# Animar Escenas de Multitud

> Proceso para gestionar multiples personajes en pantalla sin perder claridad narrativa ni jerarquia visual.

## Objetivo
Producir escenas con muchos personajes simultaneos donde el espectador siempre sepa donde mirar, quien importa y que esta pasando, manteniendo la sensacion de un mundo poblado y vivo sin sacrificar la legibilidad.

## Cuando usar este workflow
- Escenas de batalla con multiples combatientes.
- Reuniones, asambleas o celebraciones con grupos grandes.
- Escenas en mercados, ciudades u otros espacios publicos concurridos.
- Cualquier momento donde mas de cuatro personajes comparten plano.

## Archivos de referencia
- \`Knowledge/Animation/staging.md\`
- \`Knowledge/Cinematography/camaras.md\`

## Pasos

### Paso 1: Establecer la jerarquia de atencion
Clasificar cada personaje o grupo en pantalla por nivel de importancia: protagonistas activos (accion principal), personajes de soporte (reacciones relevantes) y figurantes (ambiente). Cada nivel recibe un tratamiento de animacion distinto en complejidad y detalle.

### Paso 2: Disenar la composicion por capas
Organizar la escena en planos visuales: primer plano, plano medio y fondo. Colocar la accion principal donde la mirada del espectador caiga naturalmente (segun staging.md). Usar las capas posteriores para dar profundidad y vida sin competir con el foco. Los personajes mas importantes deben tener el mayor contraste visual.

### Paso 3: Definir grupos de movimiento
Agrupar a los figurantes en bloques que se mueven con patrones compartidos. No animar cada figurante individualmente sino por clusters con variaciones sutiles. Definir 3-4 patrones de movimiento base para cada grupo y aplicar offsets de timing para evitar sincronizacion artificial.

### Paso 4: Crear guias de mirada
Disenar lineas de composicion que dirijan el ojo del espectador hacia la accion principal. Usar la direccion del movimiento de los figurantes para apuntar al protagonista. Consultar camaras.md para tecnicas de enfoque selectivo que separen capas. Las lineas del entorno, los gestos y las miradas de los personajes secundarios deben converger en el punto focal.

### Paso 5: Animar primero la accion principal
Completar la animacion de los protagonistas como si estuvieran solos en la escena. Solo cuando su actuacion funcione de forma aislada, empezar a agregar las capas secundarias. Esto garantiza que la historia se cuenta aunque el espectador ignore todo lo demas.

### Paso 6: Agregar personajes de soporte con reacciones
Los personajes de soporte reaccionan a la accion principal y la refuerzan. Sus reacciones deben ser ligeramente retrasadas respecto al evento (el publico reacciona despues del golpe, no simultaneamente). Animar con menor detalle que los protagonistas pero con intencionalidad clara.

### Paso 7: Poblar con figurantes y ciclos
Aplicar los ciclos de animacion a los grupos de figurantes. Variar la velocidad, escala y fase de los ciclos para evitar la repeticion visible. En planos amplios, los figurantes pueden ser mas simples; en planos medios, necesitan mas variacion individual. Nunca usar el mismo ciclo sin modificacion para personajes adyacentes.

### Paso 8: Verificar la legibilidad en cada corte
Reproducir cada plano y verificar que en los primeros fotogramas el espectador sabe donde mirar. Si hay confusion sobre el punto focal, ajustar la composicion, el contraste o el movimiento. Probar con ojos frescos: pedir a alguien que mire el plano por primera vez y pregunte a donde miro primero.

### Paso 9: Gestionar las transiciones de foco
Cuando el foco de atencion cambia de un personaje a otro dentro de la multitud, guiar la transicion. Reducir el movimiento del entorno momentaneamente para que el nuevo foco resalte. Usar un gesto grande o un cambio de ritmo para atraer la mirada al nuevo punto de interes.

## Entregable
Escena de multitud animada con jerarquia visual clara, figurantes organizados por grupos de movimiento, guias de mirada integradas y legibilidad verificada en cada plano.

## Criterios de aprobacion
- El punto focal es inmediatamente identificable en cada plano.
- Los figurantes aportan vida sin distraer de la accion principal.
- No hay dos figurantes adyacentes con movimiento identico y sincronizado.
- Las transiciones de foco entre personajes son fluidas y claras.
- La escena se lee correctamente incluso en pantallas pequenas.
- Los personajes de soporte refuerzan la accion principal con sus reacciones.
- La complejidad de animacion decrece apropiadamente del protagonista a los figurantes.

## Errores comunes en este proceso
- Dar el mismo nivel de detalle a todos los personajes, agotando recursos sin mejorar la escena.
- Crear figurantes con ciclos identicos perfectamente sincronizados, produciendo un efecto robotico.
- Poner la accion principal en una zona de baja atencion de la composicion.
- Mover la multitud aleatoriamente sin direccionalidad, generando ruido visual.
- No reducir la actividad del fondo cuando el foco cambia, causando competencia por la atencion.
- Olvidar que en planos cerrados la multitud se siente a traves de sonido y sugerencia, no mostrando cada individuo.
`,
    knowledgeRefs: ['Knowledge/Cinematography/camaras.md', 'Knowledge/Animation/staging.md'],
  },
  {
    id: 'componer_score',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Componer Score Emocional',
    description: 'Proceso para crear musica incidental que amplifique cada momento emocional de la serie sin imponerse sobre la narrativa.',
    content: `# Componer Score Emocional

> Proceso para crear musica incidental que amplifique cada momento emocional de la serie sin imponerse sobre la narrativa.

## Objetivo
Componer un score que funcione como arquitectura emocional invisible, guiando lo que el espectador siente en cada escena, amplificando tension, ternura, miedo o euforia en el momento preciso sin que la musica llame la atencion sobre si misma.

## Cuando usar este workflow
- Al musicalizar escenas individuales o bloques de escenas.
- Para crear piezas de underscore que acompanen momentos clave del episodio.
- Cuando se necesita musica que manipule emocionalmente sin ser percibida como manipulacion.
- Al adaptar el tema principal a momentos narrativos especificos.

## Archivos de referencia
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Storytelling/emocion.md\`

## Pasos

### Paso 1: Mapear el arco emocional de la escena
Ver la escena sin musica multiples veces. Identificar el estado emocional al inicio, los puntos de inflexion y el estado final. Crear un mapa emocional con timestamps: en que segundo exacto cambia la emocion, donde esta el climax, donde necesita respirar. Consultar emocion.md para las progresiones emocionales y sus funciones narrativas.

### Paso 2: Decidir la funcion de la musica
La musica puede cumplir diferentes funciones: subrayar (reforzar lo que ya se ve), contrapuntear (contradecir lo visible para crear tension), anticipar (preparar emocionalmente para lo que viene) o recordar (evocar un momento anterior via leitmotif). Definir la funcion para cada tramo de la escena.

### Paso 3: Elegir el punto de entrada y salida
No toda escena necesita musica todo el tiempo. Decidir donde entra la musica y donde sale. Las entradas y salidas son decisiones dramaticas: la musica que empieza un segundo despues del evento es mas poderosa que la que empieza al mismo tiempo. La ausencia subita de musica puede ser el efecto mas impactante.

### Paso 4: Seleccionar la paleta timbrica
Elegir los instrumentos apropiados para esta escena dentro de la paleta general de la serie. Escenas intimas usan menos instrumentos y texturas mas simples. Escenas epicas usan la orquestacion completa. La eleccion timbrica debe ser coherente con el vocabulario sonoro establecido para la serie.

### Paso 5: Componer siguiendo la respiracion de la escena
Escribir la musica sincronizada con el ritmo interno de la escena, no con un metronomo rigido. La musica debe respirar con los dialogos, las pausas y los movimientos. Dejar espacio para que el dialogo se escuche sin competencia. Los momentos de silencio en la musica son tan compuestos como las notas.

### Paso 6: Construir la tension progresivamente
La musica de score rara vez empieza en su intensidad maxima. Comenzar con texturas sutiles que el espectador apenas perciba y construir gradualmente. La acumulacion de capas instrumentales, la subida de registro, el aumento de densidad ritmica crean tension organica. El climax musical debe coincidir con el climax narrativo.

### Paso 7: Integrar motivos reconocibles
Incorporar fragmentos del tema principal o leitmotifs de personajes cuando sea narrativamente apropiado. Una cita musical breve puede conectar emocionalmente una escena con otra sin necesidad de explicacion. La transformacion de un motivo conocido (en modo menor, a diferente tempo) comunica que algo ha cambiado.

### Paso 8: Mezclar con la escena en progreso
Escuchar la musica integrada con dialogo, efectos de sonido y ambientes. Verificar que no compite con ninguno de estos elementos. Ajustar frecuencias para que la musica ocupe un espacio diferente al de la voz. La musica que funciona bien aislada puede no funcionar en contexto y viceversa.

### Paso 9: Verificar que la emocion no es excesiva
Reproducir la escena con musica y sin musica. Si la escena ya comunica la emocion correcta sin musica y la musica solo la sube al diez, probablemente esta siendo redundante. La mejor musica de score agrega una dimension que la imagen sola no logra, no amplifica al maximo lo que ya esta claro.

## Entregable
Score compuesto y premezclado para cada escena asignada, con marcas de sincronizacion, stems separados para la mezcla final y notas sobre la intencion emocional de cada pieza.

## Criterios de aprobacion
- La musica amplifica la emocion sin ser la protagonista de la escena.
- Los puntos de entrada y salida estan dramaticamente justificados.
- La musica deja espacio suficiente para el dialogo y los efectos.
- Los leitmotifs y citas del tema principal estan usados con proposito narrativo.
- La progresion dinamica (de sutil a intenso) se siente organica.
- La emocion de la escena es diferente con y sin musica, pero ambas versiones funcionan.
- El vocabulario instrumental es coherente con la paleta sonora de la serie.

## Errores comunes en este proceso
- Musicalizar cada segundo de cada escena sin dejar espacios de silencio.
- Componer score que compite con el dialogo por la atencion auditiva del espectador.
- Usar la musica para explicar emociones en vez de amplificarlas, generando redundancia.
- Crear subidas emocionales que llegan antes del momento dramatico, arruinando el impacto.
- Ignorar el efecto acumulativo: demasiada musica intensa durante un episodio insensibiliza.
- Componer piezas que suenan bien aisladas pero no sirven a la escena cuando se integran.
`,
    knowledgeRefs: ['Knowledge/Sound/musica.md', 'Knowledge/Storytelling/emocion.md'],
  },
  {
    id: 'componer_tema',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Componer el Tema Principal',
    description: 'Proceso para crear la pieza musical que define la identidad sonora de la serie, memorable y tarareble.',
    content: `# Componer el Tema Principal

> Proceso para crear la pieza musical que define la identidad sonora de la serie, memorable y tarareble.

## Objetivo
Componer un tema principal que encapsule la esencia emocional de la serie en una melodia reconocible, que el espectador asocie inmediatamente con el proyecto y que funcione como ancla sonora a lo largo de toda la produccion.

## Cuando usar este workflow
- Al inicio de la produccion musical de una nueva serie.
- Cuando se redefine la identidad de una serie existente.
- Al crear la musica para la secuencia de apertura.
- Cuando se necesita un tema madre del cual derivar variaciones para toda la banda sonora.

## Archivos de referencia
- \`Knowledge/Sound/musica.md\`

## Pasos

### Paso 1: Definir la identidad emocional de la serie
Antes de escribir una nota, articular en palabras lo que la serie debe hacer sentir. Escribir tres adjetivos emocionales que definan el tono general. No son generos musicales sino sensaciones: esperanza inquieta, melancolia luminosa, tension aventurera. Estos adjetivos son el filtro para todas las decisiones musicales.

### Paso 2: Identificar la paleta instrumental
Elegir los instrumentos que representan el mundo de la serie. Cada eleccion comunica: cuerdas evocan emocion clasica, sintetizadores sugieren futuro o artificialidad, instrumentos etnicos anclan en una cultura. Definir 4-6 instrumentos principales y su rol: cual lleva la melodia, cual crea textura, cual marca ritmo.

### Paso 3: Componer el motivo central
Crear una frase melodica de 4-8 notas que sea el ADN del tema. Este motivo debe ser simple, tarareble y emocionalmente cargado. Probarlo cantandolo sin acompanamiento: si funciona a capella, tiene fuerza intrinseca. El motivo central se transformara en leitmotifs y variaciones a lo largo de toda la serie.

### Paso 4: Desarrollar la estructura del tema
Expandir el motivo en una pieza completa con estructura clara. Intro que establece el mundo sonoro, exposicion del motivo principal, desarrollo que lo eleva, climax emocional y resolucion. La duracion debe ajustarse al formato de la secuencia de apertura pero la composicion completa puede ser mas extensa para uso en la serie.

### Paso 5: Definir la armonia y progresion
Elegir las progresiones armonicas que soporten la melodia y refuercen el tono emocional. Armonias mayores para esperanza, menores para drama, modales para misterio o epica. Verificar que la armonia tenga movimiento propio y no sea solo soporte pasivo de la melodia.

### Paso 6: Establecer el ritmo y tempo
El tempo define la energia: un tema heroico necesita pulso firme, uno contemplativo necesita respiracion. Probar el tema a diferentes tempos antes de fijar uno. El ritmo debe tener un patron identificable que refuerce la memorabilidad. Considerar como el tempo influye en el tono emocional general.

### Paso 7: Crear la orquestacion completa
Distribuir la melodia, armonia y ritmo entre los instrumentos elegidos. Construir la orquestacion en capas, comenzando simple y agregando densidad. El momento de maxima orquestacion debe coincidir con el climax emocional. Dejar espacio en la mezcla para que la melodia principal siempre sea protagonista.

### Paso 8: Producir una version reducida
Crear una version minima del tema que funcione con solo uno o dos instrumentos. Esta version es esencial para momentos intimos de la serie y para verificar que la fuerza del tema esta en la composicion, no en la produccion. Si la version reducida emociona, la composicion es solida.

### Paso 9: Validar la memorabilidad
Reproducir el tema tres veces y esperar una hora. Intentar tararear el motivo central de memoria. Si no viene naturalmente a la mente, el motivo necesita simplificacion o mayor gancho. Probar con personas ajenas al proyecto: despues de dos escuchas, deben poder reproducir al menos el contorno melodico.

## Entregable
Tema principal completo en version full y version reducida, con documentacion del motivo central, paleta instrumental y guia de uso para variaciones en la serie.

## Criterios de aprobacion
- El motivo central es tarareble despues de dos escuchas.
- La paleta instrumental es coherente con el mundo de la serie.
- El tema genera la emocion definida en el primer paso sin necesidad de imagen.
- La version reducida mantiene la identidad emocional del tema.
- La estructura tiene un arco dinamico claro con climax definido.
- El motivo central es lo suficientemente flexible para admitir variaciones de genero y tono.
- El tema no se confunde con temas existentes de otras producciones.

## Errores comunes en este proceso
- Componer un tema complejo y tecnico que impresiona pero no se recuerda.
- Elegir instrumentacion por moda en lugar de por coherencia con el mundo narrativo.
- Crear un motivo tan largo que pierde identidad y no puede ser fragmentado para leitmotifs.
- No probar la memorabilidad y asumir que si suena bien en el estudio, funcionara.
- Hacer un tema que solo funciona con produccion maxima y se desmorona en version simple.
- Componer para el genero musical preferido del compositor en vez de para las necesidades de la serie.
`,
    knowledgeRefs: ['Knowledge/Sound/musica.md'],
  },
  {
    id: 'crear_leitmotifs',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Crear Leitmotifs',
    description: 'Proceso para disenar temas musicales asociados a personajes, lugares e ideas que enriquezcan la narrativa a traves del sonido.',
    content: `# Crear Leitmotifs

> Proceso para disenar temas musicales asociados a personajes, lugares e ideas que enriquezcan la narrativa a traves del sonido.

## Objetivo
Crear un sistema de leitmotifs que funcione como lenguaje musical narrativo, donde cada tema asociado evoque inmediatamente a su personaje, lugar o concepto, y cuyas transformaciones cuenten la historia emocional a lo largo de la serie.

## Cuando usar este workflow
- Al desarrollar la identidad musical de personajes principales y antagonistas.
- Para crear temas de lugares significativos del mundo narrativo.
- Al asociar musicalmente conceptos abstractos como el destino, la traicion o la esperanza.
- Cuando se necesita un vocabulario musical que conecte escenas y episodios.

## Archivos de referencia
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Characters/\` (fichas de personajes relevantes)

## Pasos

### Paso 1: Inventariar elementos que necesitan leitmotif
No todo merece un leitmotif. Seleccionar los personajes, lugares y conceptos que tienen suficiente presencia narrativa y peso emocional para justificarlo. Priorizar: protagonistas, antagonista principal, la relacion central, el hogar, el lugar de conflicto y 2-3 conceptos tematicos. Limitar el total a 8-12 leitmotifs para evitar saturacion.

### Paso 2: Definir la esencia emocional de cada elemento
Para cada personaje o concepto, escribir su emocion central en una palabra. Consultar las fichas de personajes para entender su arco completo. El leitmotif de un heroe inseguro no suena igual que el de un heroe confiado. La esencia emocional del personaje en su estado inicial es el punto de partida del leitmotif.

### Paso 3: Componer el motivo base de cada leitmotif
Crear una frase melodica de 3-6 notas para cada leitmotif. Debe ser lo suficientemente corta para ser insertada en cualquier contexto y lo suficientemente distintiva para no confundirse con otra. Usar intervalos que refuercen la emocion: intervalos amplios para grandeza, cromatismos para amenaza, grados conjuntos para intimidad.

### Paso 4: Asignar instrumentacion primaria
Elegir un instrumento o combinacion que se asocie principalmente con cada leitmotif. El instrumento actua como firma timbrica: un cello para el mentor, una flauta para la inocencia, percusion metalica para el villano. Cuando ese timbre suena, el espectador asocia inconscientemente incluso antes de reconocer la melodia.

### Paso 5: Crear la version estandar de cada leitmotif
Desarrollar una version de referencia de cada leitmotif de 15-30 segundos, con su instrumentacion primaria, armonia base y tempo natural. Esta version es el canon contra el que se mediran todas las variaciones. Documentar la tonalidad, tempo, dinamica y caracter expresivo.

### Paso 6: Disenar las variaciones dramaticas
Planificar como cada leitmotif se transforma a lo largo de la serie. Versiones en modo menor para momentos oscuros del personaje, versiones fragmentadas para incertidumbre, versiones orquestales completas para momentos de triunfo. Mapear al menos 4 variaciones por leitmotif: triunfante, oscura, intima y corrupta o destruida.

### Paso 7: Planificar las combinaciones entre leitmotifs
Los momentos mas poderosos ocurren cuando dos leitmotifs se superponen o fusionan. El tema del heroe entrelazado con el del villano en su confrontacion. El tema del hogar que se cuela en el tema de la aventura cuando el protagonista siente nostalgia. Identificar 5-8 combinaciones narrativamente significativas.

### Paso 8: Crear una guia de uso para la serie
Documentar cada leitmotif con su motivo base, instrumentacion, variaciones y reglas de uso. Especificar cuando debe aparecer y cuando no. Definir la frecuencia de aparicion para evitar el desgaste: un leitmotif que suena en cada escena del personaje pierde poder, uno que aparece solo en momentos clave lo maximiza.

### Paso 9: Verificar diferenciacion entre leitmotifs
Reproducir todos los leitmotifs en secuencia y verificar que ninguno se confunde con otro. Probar cada uno fuera de contexto: si un oyente no puede distinguir entre el tema del heroe y el del mentor, hay un problema de diferenciacion. Ajustar intervalos, ritmo o instrumentacion para maximizar la distincion.

## Entregable
Sistema completo de leitmotifs con motivos base, versiones de referencia, catalogo de variaciones planificadas, guia de combinaciones y documento de uso para toda la produccion musical de la serie.

## Criterios de aprobacion
- Cada leitmotif es distinguible de los demas en 3 segundos o menos.
- Los motivos son suficientemente simples para ser insertados en cualquier contexto musical.
- La instrumentacion primaria de cada leitmotif no se repite entre personajes principales.
- Existen al menos 4 variaciones dramaticas documentadas por leitmotif.
- Las combinaciones planificadas funcionan armonicamente cuando se superponen.
- La guia de uso establece reglas claras de frecuencia y contexto de aparicion.
- El sistema completo es manejable (8-12 leitmotifs, no mas).

## Errores comunes en este proceso
- Crear demasiados leitmotifs, haciendo imposible que el espectador los asimile todos.
- Disenar motivos tan complejos que no pueden reducirse a una cita breve en el score.
- Usar el mismo leitmotif tan frecuentemente que pierde su poder evocador.
- No planificar la evolucion del leitmotif, usandolo identico en el episodio 1 y el 20.
- Crear leitmotifs que suenan similares entre si y confunden la asociacion del espectador.
- Asignar leitmotifs a personajes secundarios que no los justifican narrativamente.
`,
    knowledgeRefs: ['Knowledge/Sound/musica.md', 'Knowledge/Characters/'],
  },
  {
    id: 'direccion_de_voces',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Direccion de Voces',
    description: 'Proceso para dirigir actores de voz hacia interpretaciones autenticas que sirvan a la narrativa y los personajes.',
    content: `# Direccion de Voces

> Proceso para dirigir actores de voz hacia interpretaciones autenticas que sirvan a la narrativa y los personajes.

## Objetivo
Extraer de los actores de voz interpretaciones que capturen la verdad emocional de cada personaje, asegurando que las voces no solo digan las lineas correctamente sino que vivan la escena, con matices que enriquezcan la animacion y conecten emocionalmente con el espectador.

## Cuando usar este workflow
- En cada sesion de grabacion de voces para la serie.
- Al hacer callbacks o regrabaciones de lineas especificas.
- Para audiciones donde se busca la voz de un nuevo personaje.
- Al grabar gritos, esfuerzos, reacciones y sonidos no verbales.

## Archivos de referencia
- \`Knowledge/Animation/actuacion.md\`
- \`Knowledge/Characters/\` (fichas de personajes relevantes)

## Pasos

### Paso 1: Preparar el contexto emocional de la sesion
Antes de que el actor entre al estudio, preparar una descripcion del arco emocional de cada escena a grabar. No basta con el guion: el actor necesita saber de donde viene el personaje (que acaba de pasar), donde esta emocionalmente ahora y hacia donde va. Escribir notas de direccion para cada bloque de lineas.

### Paso 2: Compartir la identidad del personaje
Revisar la ficha del personaje con el actor, enfocandose en su psicologia, sus miedos, deseos y contradicciones. El actor debe entender como piensa el personaje, no solo que dice. Compartir referencias visuales del personaje para que la voz refleje su presencia fisica. Consultar las fichas en Characters/ para esta preparacion.

### Paso 3: Establecer el rango vocal del personaje
Definir con el actor la voz base del personaje: registro, velocidad natural, ritmo de habla, muletillas o patrones verbales. Establecer como cambia la voz bajo diferentes emociones: como suena este personaje enojado versus como suena asustado. Grabar la voz base como referencia para toda la produccion.

### Paso 4: Grabar por bloques emocionales
Organizar la sesion por estados emocionales, no por orden de guion. Grabar primero todas las lineas neutras, luego las de tension, luego las emocionales intensas. Esto permite al actor entrar y mantenerse en cada registro sin saltar constantemente entre extremos, mejorando la consistencia.

### Paso 5: Dirigir con imagenes, no con instrucciones tecnicas
No decir "habla mas rapido" o "sube el tono." En su lugar, dar contexto emocional: "acabas de descubrir que tu mejor amigo te traiciono y estas intentando que no se note." Consultar actuacion.md para principios de direccion por intencion. El actor traduce la emocion en voz de forma mas organica que siguiendo instrucciones mecanicas.

### Paso 6: Capturar la primera lectura en frio
Grabar la primera vez que el actor lee cada linea sin preparacion especifica. Frecuentemente la primera lectura tiene una naturalidad que se pierde en tomas posteriores mas pulidas. Conservar siempre la primera toma como opcion, incluso si se hacen versiones mas trabajadas despues.

### Paso 7: Pedir variaciones con ajuste de intencion
Para lineas clave, grabar al menos tres variaciones con diferentes subtextos: la misma linea dicha con rabia contenida, con resignacion y con desafio. Esto da opciones a la edicion y permite ajustar el tono a la animacion final. Etiquetar cada toma con la intencion para facilitar la seleccion posterior.

### Paso 8: Grabar las reacciones no verbales
Dedicar tiempo especificamente a sonidos no verbales: respiraciones, risas, suspiros, gruñidos, esfuerzos fisicos, reacciones de dolor. Estos sonidos son esenciales para la animacion y frecuentemente se olvidan. Grabar cada tipo en diferentes intensidades y emociones.

### Paso 9: Verificar la quimica entre personajes
Si es posible, grabar escenas de dialogo con ambos actores presentes (o al menos con uno escuchando la grabacion del otro). La reaccion genuina a la interpretacion del companero produce un dialogo mas organico que dos grabaciones aisladas ensambladas despues.

### Paso 10: Revisar coherencia con sesiones anteriores
Al final de cada sesion, comparar el tono y energia del personaje con grabaciones de sesiones previas. Verificar que la voz base no ha derivado, que las emociones mantienen el rango establecido y que los patrones verbales del personaje son consistentes.

## Entregable
Todas las lineas y reacciones no verbales grabadas, con al menos dos tomas por linea principal, etiquetadas por intencion emocional, y un log de sesion con notas de direccion para referencia de edicion.

## Criterios de aprobacion
- Cada linea tiene la intencion emocional correcta para la escena.
- La voz base del personaje es consistente con sesiones anteriores.
- Existen variaciones con diferentes subtextos para lineas clave.
- Las reacciones no verbales estan grabadas en suficiente variedad.
- El ritmo de habla se siente natural, no como lectura de guion.
- La quimica en escenas de dialogo se siente reactiva y organica.
- Las emociones intensas tienen la autenticidad necesaria sin ser impostadas.

## Errores comunes en este proceso
- Dar al actor el guion sin contexto emocional ni del arco del personaje.
- Dirigir con instrucciones tecnicas ("mas fuerte", "mas lento") en vez de con imagenes emocionales.
- Grabar en orden de guion, obligando al actor a saltar entre estados emocionales constantemente.
- No grabar reacciones no verbales, dejando a la animacion sin material sonoro de soporte.
- Aceptar la primera toma aceptable sin explorar variaciones que podrian ser superiores.
- No verificar coherencia con sesiones anteriores, causando deriva vocal del personaje.
`,
    knowledgeRefs: ['Knowledge/Animation/actuacion.md', 'Knowledge/Characters/'],
  },
  {
    id: 'secuencia_de_apertura',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Secuencia de Apertura',
    description: 'Proceso para crear el opening que define la identidad visual y sonora de la serie ante el espectador.',
    content: `# Secuencia de Apertura

> Proceso para crear el opening que define la identidad visual y sonora de la serie ante el espectador.

## Objetivo
Disenar y producir una secuencia de apertura que condense la esencia de la serie en una pieza audiovisual memorable, que establezca tono, presente personajes, genere anticipacion y se convierta en un ritual que el espectador desee ver en cada episodio.

## Cuando usar este workflow
- Al producir el opening definitivo de la serie o temporada.
- Cuando se actualiza la apertura para reflejar cambios narrativos.
- Al crear variaciones del opening para episodios especiales.
- Para redisenar un opening que no cumple su funcion.

## Archivos de referencia
- \`Knowledge/Visual/\` (archivos de identidad visual)
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Cinematography/\` (archivos de lenguaje cinematografico)

## Pasos

### Paso 1: Definir la funcion narrativa del opening
Decidir que debe comunicar la apertura: presentar el mundo, mostrar el conflicto, revelar relaciones entre personajes, establecer el tono o crear una experiencia estetica pura. Un opening puede hacer varias de estas cosas pero debe priorizar una. La funcion principal guia todas las demas decisiones.

### Paso 2: Elegir el estilo visual
Definir si el opening usa imagenes narrativas (escenas de la serie), imagenes abstractas o simbolicas, un estilo visual diferente al de la serie (collage, siluetas, tipografia cinematica) o una combinacion. Consultar los archivos de Visual/ para asegurar coherencia con la identidad visual establecida. El estilo debe ser distintivo y asociable a la serie.

### Paso 3: Crear el guion visual del opening
Disenar un storyboard shot por shot sincronizado con la estructura musical del tema principal. Cada seccion de la musica (intro, verso, estribillo, climax) debe tener una correspondencia visual. Los beats musicales fuertes coinciden con cambios de imagen, reveals de personaje o transiciones impactantes.

### Paso 4: Establecer la jerarquia de presentacion
Decidir el orden en que aparecen los personajes y elementos. Generalmente el protagonista aparece primero o ultimo (posicion de enfasis). Los antagonistas se presentan en contraste visual con los heroes. Los personajes secundarios aparecen en grupos o transiciones rapidas. El orden comunica importancia narrativa.

### Paso 5: Disenar las transiciones y el ritmo visual
Las transiciones entre shots definen la energia del opening. Cortes duros para energia, dissolves para misterio, wipes para aventura, match cuts para elegancia. Consultar los archivos de Cinematography/ para principios de edicion ritmica. El ritmo visual debe escalar con la musica hacia un climax visual.

### Paso 6: Integrar simbolismo y presagio
Incorporar elementos visuales que anticipen temas de la temporada sin revelar la trama. Imagenes simbolicas que cobren significado segun avanza la serie. Estos detalles recompensan la visualizacion repetida y demuestran que el opening es una pieza con capas de lectura.

### Paso 7: Disenar la tipografia y creditos
Elegir una tipografia que refuerce la identidad de la serie y sea legible en la duracion que aparece en pantalla. Decidir la integracion: creditos superpuestos a la imagen, creditos en fondos dedicados o creditos integrados en el mundo visual. La aparicion y desaparicion del texto debe estar sincronizada con la musica.

### Paso 8: Sincronizar animacion y musica al fotograma
Ajustar cada movimiento, transicion y aparicion al compas exacto de la musica. Los cambios de shot deben caer en beats musicales fuertes. Los movimientos de camara deben seguir la frase musical. La sincronizacion precisa entre audio y video es lo que convierte un opening funcional en uno memorable.

### Paso 9: Producir la animacion final
Animar la secuencia completa con la calidad visual maxima de la serie. El opening es la promesa visual al espectador: si la animacion del opening es inferior a la del episodio, hay un problema de prioridades. Aplicar los efectos finales, la iluminacion y el color grading especifico del opening.

### Paso 10: Verificar el impacto en visualizacion repetida
El opening se vera potencialmente cientos de veces. Verificar que no fatiga en la repeticion, que revela detalles nuevos en revisiones y que mantiene su energia emocional. Mostrarlo a personas ajenas al proyecto y registrar si quieren volver a verlo o si quieren saltarlo.

## Entregable
Secuencia de apertura final animada, sincronizada con el tema musical, con creditos integrados, en la duracion establecida y en todas las resoluciones requeridas para distribucion.

## Criterios de aprobacion
- El opening comunica el tono y la esencia de la serie en su duracion.
- La sincronizacion entre imagen y musica es precisa al fotograma en cada beat.
- Los personajes principales son reconocibles e identificables.
- La tipografia es legible y coherente con la identidad visual.
- Contiene capas de significado que recompensan la visualizacion repetida.
- No genera fatiga despues de multiples visualizaciones.
- La calidad visual es al menos igual a la del mejor momento de la serie.

## Errores comunes en este proceso
- Crear un opening que revela demasiado de la trama o hace spoilers visuales.
- Sincronizar imagen y musica de forma aproximada en vez de precisa, perdiendo el punch.
- Disenar un opening tan largo que el espectador lo salta consistentemente.
- Usar un estilo visual que no tiene conexion con la estetica de la serie.
- Priorizar la espectacularidad sobre la comunicacion de la esencia de la serie.
- No considerar la visualizacion repetida, creando algo que impresiona una vez pero cansa.
`,
    knowledgeRefs: ['Knowledge/Sound/musica.md', 'Knowledge/Cinematography/', 'Knowledge/Visual/'],
  },
  {
    id: 'secuencia_de_cierre',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Secuencia de Cierre',
    description: 'Proceso para crear el ending que deja al espectador con el tono emocional correcto al finalizar cada episodio.',
    content: `# Secuencia de Cierre

> Proceso para crear el ending que deja al espectador con el tono emocional correcto al finalizar cada episodio.

## Objetivo
Disenar y producir una secuencia de cierre que funcione como descompresion emocional despues del episodio, refuerce la identidad de la serie, deje al espectador con la sensacion adecuada y funcione como puente emocional hacia el siguiente episodio.

## Cuando usar este workflow
- Al producir el ending definitivo de la serie o temporada.
- Para crear variaciones del cierre para episodios con tono especial.
- Cuando se actualiza el ending por cambios en la narrativa o temporada.
- Al disenar secuencias de cierre para finales de arco o temporada.

## Archivos de referencia
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Cinematography/ritmo.md\`

## Pasos

### Paso 1: Definir la emocion de salida
Decidir con que emocion debe quedarse el espectador al terminar el episodio. El ending no compite con el climax del episodio sino que lo procesa. Si el episodio fue intenso, el ending puede ser contemplativo. Si fue melancolico, puede ser esperanzador. Definir la emocion predominante y su matiz.

### Paso 2: Elegir el estilo visual del ending
El cierre puede usar imagenes de la serie en tono diferente (los personajes en momentos cotidianos), arte original con estilo distinto al de la serie (acuarelas, bocetos, fotos), elementos simbolicos del mundo o composiciones abstractas con la paleta de color de la serie. El estilo debe complementar al opening sin duplicarlo.

### Paso 3: Seleccionar o componer la musica de cierre
Elegir una pieza que cumpla la funcion emocional definida. Puede ser una version acustica o reducida del tema principal, una cancion completamente diferente o una pieza instrumental dedicada. La musica de cierre debe tener un ritmo mas calmado que el opening para permitir la descompresion emocional.

### Paso 4: Disenar la transicion del episodio al ending
El momento donde el episodio termina y el ending comienza es critico. Puede ser un corte limpio, un fade que mezcla la ultima escena con el inicio del ending, o una transicion directa donde la ultima imagen del episodio se convierte en la primera del ending. La transicion debe respetar la emocion del cierre del episodio.

### Paso 5: Crear el guion visual sincronizado
Disenar la secuencia shot por shot alineada con la estructura de la musica de cierre. Consultar ritmo.md para principios de edicion en cierre. El ending tipicamente tiene un ritmo mas pausado que el opening, con shots mas largos y transiciones mas suaves. El ritmo debe invitar a la contemplacion, no a la excitacion.

### Paso 6: Integrar creditos finales
Distribuir los creditos de produccion a lo largo de la secuencia. Los creditos del ending suelen ser mas completos que los del opening. Asegurar que el tamano de tipografia y la duracion en pantalla cumplan los requisitos contractuales y de legibilidad. Los creditos no deben competir con la imagen sino integrarse naturalmente.

### Paso 7: Disenar variaciones para episodios especiales
Crear versiones alternativas para momentos narrativos que requieran un cierre diferente: finales de temporada pueden tener un ending extendido o modificado, episodios de alto impacto emocional pueden omitir el ending o empezar directamente con la musica sobre la escena final. Planificar al menos tres variaciones.

### Paso 8: Considerar el espacio post-creditos
Decidir si la serie utilizara escenas post-creditos y como el ending las integra. Si existen, el ending debe mantener suficiente interes para que el espectador no cambie antes de la escena adicional. Disenar una transicion natural entre el final del ending y la escena post-creditos.

### Paso 9: Verificar la funcion emocional
Reproducir la ultima escena de un episodio seguida del ending. Evaluar si la transicion emocional es correcta: el espectador debe pasar del impacto de la escena final a una sensacion de cierre satisfactorio. Si el ending interrumpe la emocion en vez de canalizarla, ajustar la transicion o el tono de la pieza.

## Entregable
Secuencia de cierre final animada con musica sincronizada, creditos integrados, variaciones para episodios especiales y transicion de episodio a ending definida.

## Criterios de aprobacion
- El ending deja al espectador con la emocion correcta segun la funcion definida.
- La transicion del episodio al ending es fluida y respetuosa con el tono del cierre narrativo.
- La musica y la imagen estan sincronizadas ritmicamente.
- Los creditos son legibles y cumplen requisitos de duracion y tamano.
- El estilo visual complementa al opening sin duplicarlo.
- Las variaciones para episodios especiales estan producidas y listas.
- El ending funciona como invitacion a ver el siguiente episodio.

## Errores comunes en este proceso
- Crear un ending tan energico que compite con el climax del episodio en vez de complementarlo.
- Usar el mismo tono que el opening, eliminando el contraste ritmico y emocional.
- Hacer un ending tan largo o generico que el espectador siempre lo salta.
- No planificar la transicion del episodio al ending, creando un corte emocional abrupto.
- Olvidar las variaciones para episodios especiales, forzando el mismo cierre en momentos que requieren otro.
- Ignorar el espacio post-creditos, perdiendo una herramienta narrativa valiosa.
`,
    knowledgeRefs: ['Knowledge/Sound/musica.md', 'Knowledge/Cinematography/ritmo.md'],
  },
  {
    id: 'sonido_de_poderes',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Sonido de Poderes',
    description: 'Proceso para disenar la identidad sonora de sistemas de poderes fantasticos, magia o habilidades sobrehumanas.',
    content: `# Sonido de Poderes

> Proceso para disenar la identidad sonora de sistemas de poderes fantasticos, magia o habilidades sobrehumanas.

## Objetivo
Crear un vocabulario sonoro coherente para los poderes y habilidades del universo narrativo, donde cada poder tenga una firma auditiva unica, escalable en intensidad y consistente con las reglas del sistema magico o fantastico establecido.

## Cuando usar este workflow
- Al disenar los sonidos de un sistema de magia o poderes.
- Para crear la identidad auditiva de habilidades especiales de personajes.
- Cuando se introducen nuevos poderes o transformaciones en la serie.
- Al escalar poderes existentes a nuevos niveles de intensidad.

## Archivos de referencia
- \`Knowledge/Sound/efectos.md\`
- \`Knowledge/Worldbuilding/magia.md\`

## Pasos

### Paso 1: Estudiar el sistema de poderes del mundo
Leer magia.md y comprender las reglas del sistema: de donde viene la energia, como se manifiesta, que costo tiene, cuales son sus limites. Un poder que viene de la naturaleza suena organico. Uno tecnologico suena mecanico. Uno que corrompe suena distorsionado. Las reglas del sistema son las reglas del sonido.

### Paso 2: Clasificar los poderes por familia
Agrupar los poderes en familias segun su origen, naturaleza o tipo de energia. Cada familia comparte una base sonora comun con variaciones individuales. Fuego, agua, tierra y aire comparten una raiz elemental pero cada uno tiene textura diferente. Esto crea cohesion sin monotonia.

### Paso 3: Disenar la firma sonora de cada familia
Crear el sonido base que identifica a cada familia de poderes. Este sonido tiene tres componentes: textura (que material sugiere), dinamica (como se comporta en el tiempo) y tono emocional (que sensacion produce). Un poder de fuego puede combinar crepitar, crescendo explosivo y agresividad. Documentar cada componente.

### Paso 4: Crear las fases de activacion de cada poder
Todo poder tiene un ciclo: preparacion, activacion, sostenimiento, impacto y disipacion. Disenar sonido para cada fase. La preparacion acumula energia auditiva, la activacion la libera, el sostenimiento la mantiene, el impacto es el climax y la disipacion es la cola sonora. Cada fase puede usarse independientemente segun la necesidad narrativa.

### Paso 5: Escalar los sonidos por nivel de intensidad
Un mismo poder a baja intensidad y a maxima intensidad deben sonar como variaciones del mismo sonido, no como sonidos diferentes. Definir al menos tres niveles: basico (uso cotidiano), intermedio (esfuerzo considerable) y maximo (al limite del personaje). Cada nivel agrega capas, aumenta la densidad y amplifica el rango de frecuencias.

### Paso 6: Personalizar por personaje
Dos personajes con el mismo tipo de poder no deben sonar identicos. Agregar matices personales que reflejen la personalidad del usuario: un personaje agresivo tiene sonidos mas percusivos, uno metodico tiene sonidos mas tonales y controlados. Consultar las fichas de personaje para estos matices.

### Paso 7: Disenar los sonidos de fallo y costo
Los poderes que fallan, se descontrolan o tienen un costo fisico necesitan sonidos propios. Un poder que falla puede sonar como una version distorsionada e incompleta del original. El costo puede tener sonido propio: un drenaje de energia, un crujido organico, una retroalimentacion dolorosa.

### Paso 8: Verificar diferenciacion auditiva
Reproducir los sonidos de todos los poderes en secuencia rapida. Si dos poderes de diferentes familias se confunden auditivamente, necesitan mayor diferenciacion. Cada poder debe ser identificable sin ver la pantalla. Probar con alguien ajeno al proyecto: si puede describir que tipo de poder escucha, el diseño funciona.

### Paso 9: Probar en contexto de mezcla
Integrar los sonidos de poderes con musica, dialogo y ambientes. Los poderes deben cortar a traves de la mezcla en los momentos de activacion sin destruir el balance. Ajustar las frecuencias para que ocupen un espacio sonoro propio que no compita con la voz ni con la orquesta.

## Entregable
Biblioteca completa de sonidos de poderes organizada por familia, con todas las fases de activacion, tres niveles de intensidad, variaciones por personaje, sonidos de fallo y guia de uso en mezcla.

## Criterios de aprobacion
- Cada familia de poderes tiene una firma sonora inmediatamente reconocible.
- Los poderes son identificables solo con sonido, sin imagen.
- Los tres niveles de intensidad se sienten como el mismo poder escalado, no como poderes diferentes.
- Las personalizaciones por personaje son detectables pero no rompen la coherencia de la familia.
- Los sonidos de fallo se perciben claramente como versiones rotas del sonido original.
- Los sonidos cortan a traves de la mezcla en la activacion sin distorsionar el balance.
- Todo el sistema sonoro es coherente con las reglas establecidas en magia.md.

## Errores comunes en este proceso
- Disenar todos los poderes con el mismo tratamiento generico de "magia brillante".
- Crear sonidos de poder tan densos que tapan completamente la musica y el dialogo.
- No escalar los sonidos por intensidad, haciendo que un ataque leve suene igual que uno devastador.
- Ignorar las fases y crear solo un sonido de impacto, sin preparacion ni disipacion.
- Disenar sonidos que no reflejan las reglas del sistema magico del mundo.
- No personalizar por personaje, haciendo que todos los usuarios del mismo elemento suenen identicos.
`,
    knowledgeRefs: ['Knowledge/Sound/efectos.md', 'Knowledge/Worldbuilding/magia.md'],
  },
  {
    id: 'sonido_del_mundo',
    phase: '03_Produccion',
    phaseName: 'Producción',
    phaseIcon: '🎬',
    phaseColor: '#ffb74d',
    title: 'Sonido del Mundo',
    description: 'Proceso para crear la textura sonora que hace que el mundo de la serie se sienta real, tangible y habitado.',
    content: `# Sonido del Mundo

> Proceso para crear la textura sonora que hace que el mundo de la serie se sienta real, tangible y habitado.

## Objetivo
Disenar un paisaje sonoro completo que de cuerpo y presencia al mundo narrativo, donde cada ambiente, superficie y fenomeno tenga una identidad auditiva que sumerja al espectador en el universo de la serie como si pudiera tocarlo.

## Cuando usar este workflow
- Al definir la identidad sonora de cada locacion de la serie.
- Para crear ambientes sonoros de espacios fantasticos o futuristas.
- Cuando se construyen nuevos biomas, ciudades o interiores narrativos.
- Al establecer los sonidos recurrentes que definen el mundo (clima, fauna, maquinaria).

## Archivos de referencia
- \`Knowledge/Sound/efectos.md\`
- \`Knowledge/Worldbuilding/\` (archivos de construccion del mundo)

## Pasos

### Paso 1: Inventariar las locaciones y sus caracteristicas
Listar todas las locaciones de la serie con sus propiedades fisicas: materiales predominantes, tamano del espacio, clima, nivel de actividad, hora del dia tipica. Cada propiedad fisica tiene una consecuencia sonora: un templo de piedra reverbera, un bosque absorbe, una ciudad metalica refleja.

### Paso 2: Definir la personalidad sonora de cada locacion
Cada lugar debe sonar diferente y reconocible. Asignar a cada locacion un sonido firma: el goteo constante de las cuevas, el viento entre las ruinas, el zumbido electrico de la fabrica. Este sonido firma es lo primero que el espectador escucha y lo ultimo que olvida de cada lugar.

### Paso 3: Disenar las capas ambientales
Construir cada ambiente en capas que pueden mezclarse independientemente. Capa base: tono constante del espacio (reverberacion, resonancia). Capa media: sonidos recurrentes pero irregulares (fauna, viento, maquinaria lejana). Capa superficial: sonidos ocasionales y especificos (un pajaro, una puerta, pasos distantes). Consultar efectos.md para tecnicas de diseño por capas.

### Paso 4: Crear los sonidos de superficies e interacciones
Cada superficie del mundo suena diferente al ser pisada, tocada o golpeada. Disenar los sonidos de paso sobre cada tipo de suelo (piedra, tierra, metal, madera, agua). Crear sonidos de interaccion con objetos comunes del mundo: puertas, armas, herramientas, vegetacion. Estos sonidos de detalle construyen la credibilidad tactil.

### Paso 5: Disenar el clima sonoro
El clima es un personaje sonoro. Crear variaciones de lluvia (llovizna, tormenta, lluvia sobre distintas superficies), viento (brisa, vendaval, viento entre edificios), tormentas y fenomenos especificos del mundo. Si el mundo tiene clima fantastico (lluvia de cristal, tormentas magicas), disenar sonidos que sean nuevos pero fisicamente creibles.

### Paso 6: Establecer la fauna y vida ambiental
Disenar los sonidos de las criaturas que habitan el mundo, tanto visibles como solo audibles. La fauna sonora que nunca se ve en pantalla (insectos nocturnos, aves lejanas, criaturas submarinas) da profundidad al mundo. Asignar fauna sonora especifica a cada bioma y hora del dia.

### Paso 7: Crear transiciones entre espacios
Disenar como suena el cambio de un espacio a otro: la transicion de interior a exterior, de superficie a subterraneo, de ciudad a naturaleza. Estas transiciones sonoras deben ser graduales y organicas, no cortes abruptos. El sonido del nuevo espacio debe colarse antes de que la imagen lo muestre completamente.

### Paso 8: Verificar coherencia con las reglas del mundo
Revisar que los sonidos respeten la logica interna del universo. Un mundo sin aves no puede tener cantos de pajaro ambiental. Un espacio al vacio no puede tener eco. Consultar los archivos de Worldbuilding para verificar que cada sonido tiene justificacion dentro de las reglas establecidas.

### Paso 9: Probar la inmersion con ojos cerrados
Reproducir solo el audio de una escena ambientada. Con los ojos cerrados, el oyente deberia poder identificar el lugar, la hora, el clima y si hay actividad humana cerca. Si el sonido solo evoca un espacio generico, necesita mas especificidad. Si evoca el lugar exacto de la serie, el trabajo esta bien hecho.

## Entregable
Biblioteca de ambientes sonoros por locacion con todas las capas separadas, catalogo de sonidos de superficies e interacciones, fauna sonora por bioma y guia de transiciones entre espacios.

## Criterios de aprobacion
- Cada locacion tiene un sonido firma reconocible e inmediatamente diferenciable.
- Los ambientes estan construidos en capas independientes que permiten mezcla flexible.
- Los sonidos de interaccion reflejan los materiales fisicos del mundo.
- La fauna sonora es coherente con el ecosistema establecido en el worldbuilding.
- Las transiciones entre espacios son graduales y organicas.
- El paisaje sonoro funciona con los ojos cerrados para identificar la locacion.
- El clima sonoro tiene variaciones suficientes para no repetirse.

## Errores comunes en este proceso
- Usar sonidos ambientales genericos de libreria sin personalizarlos para el mundo especifico.
- Crear ambientes con una sola capa, produciendo un sonido plano y artificial.
- Incluir sonidos que contradicen las reglas del mundo establecidas en el worldbuilding.
- Hacer ambientes tan densos que compiten con el dialogo y la musica.
- No diferenciar las locaciones sonoramente, haciendo que todos los interiores suenen igual.
- Olvidar las transiciones y cortar abruptamente de un ambiente a otro.
`,
    knowledgeRefs: ['Knowledge/Sound/efectos.md', 'Knowledge/Worldbuilding/'],
  },
  {
    id: 'adaptar_formatos',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'Adaptar para Diferentes Formatos — TV, Streaming, Móvil, Cine',
    description: '',
    content: `# Adaptar para Diferentes Formatos — TV, Streaming, Móvil, Cine

**Objetivo:** Generar versiones del episodio optimizadas para cada canal de distribución sin comprometer la integridad narrativa ni visual de la obra.

**Cuándo usar:** Una vez aprobado el master del episodio (imagen, audio y subtítulos), antes de la entrega a cada distribuidor.

**Archivos de referencia:**
- \`Productions/Serie_01/Memory/Style/master_style.md\` — Decisiones de encuadre y composición que deben preservarse al cambiar de ratio
- \`CONSTITUTION.md\` — Principios irrompibles sobre la identidad visual de la serie
- Especificaciones técnicas de cada distribuidor (documento externo, actualizar por temporada)

---

## Pasos

1. **Mapear los formatos de entrega requeridos**
   - Listar cada plataforma y canal de destino con sus especificaciones exactas: resolución, ratio de aspecto, códec, bitrate, audio (estéreo / 5.1 / Dolby Atmos), metadatos requeridos.
   - Clasificar los formatos en grupos por ratio de aspecto: 16:9 (TV / streaming horizontal), 9:16 (vertical móvil / stories), 1:1 (cuadrado), 2.39:1 (cine scope).
   - Identificar cuáles formatos requieren recorte de imagen y cuáles solo afectan compresión y códec.
   - Confirmar con el director si el recorte de imagen para formatos verticales necesita supervisión creativa caso por caso.

2. **Preparar el master de origen**
   - Partir siempre del archivo master en la máxima resolución disponible (DCP o ProRes 4K si existe).
   - Verificar que el master tenga al menos 10% de espacio de seguridad en los cuatro bordes con respecto a los elementos narrativos importantes.
   - Extraer pistas de audio por separado: diálogos, música y efectos en pistas independientes para facilitar el rebalanceo según el formato.
   - Confirmar que los subtítulos existan en el formato correcto para cada destino antes de comenzar la adaptación.

3. **Adaptar el ratio de aspecto (cuando aplica)**
   - Para versión 9:16 (vertical): realizar un "reframe" inteligente escena por escena, priorizando mantener los rostros de los personajes principales en cuadro.
   - Nunca usar un recorte automático centrado; revisar cada escena manualmente para verificar que la acción principal sea visible.
   - Para versión 1:1 (cuadrado): preferir un reframe que incluya el tercio superior y el tercio central; evitar cortar pies y manos simultáneamente.
   - Documentar las decisiones de reframe en una hoja de edición para que sean replicables en episodios futuros de la misma temporada.

4. **Ajustar el audio por formato**
   - TV / streaming premium: mix 5.1 o Dolby Atmos completo; respetar el rango dinámico original.
   - Streaming estándar y móvil: mix estéreo normalizado a -14 LUFS integrados; comprimir ligeramente el rango dinámico para entornos ruidosos.
   - Cine: mix inmersivo sin normalización de streaming; respetar picos de hasta -6 dBFS.
   - Verificar que los diálogos sean inteligibles en todos los formatos incluso sin auriculares (crítico para móvil).

5. **Codificar y exportar cada versión**
   - Usar la configuración de códec recomendada por cada plataforma (no usar configuraciones genéricas "de alta calidad").
   - Nombrar los archivos con la convención estándar del estudio: \`[SerieID]_[TemporadaEpisodio]_[Formato]_[Versión].[extensión]\` (ej. \`LP_S01E03_9x16_v1.mp4\`).
   - Exportar en lotes siempre que sea posible para reducir tiempo de renderizado total.
   - Verificar que cada archivo exportado abra correctamente y que el código de tiempo inicial sea el correcto.

6. **Control de calidad por formato**
   - Reproducir al menos los primeros 2 minutos, una escena de acción y los últimos 30 segundos de cada versión.
   - En formatos verticales y cuadrado, verificar que los títulos, créditos y textos en pantalla sean legibles en el nuevo encuadre.
   - Confirmar que los subtítulos se posicionen correctamente en cada ratio de aspecto.
   - Verificar los metadatos embebidos (título, episodio, idioma, copyright) antes de la entrega.

7. **Registrar y entregar**
   - Registrar en el log de entregas: fecha, plataforma, formato, nombre del archivo, checksum MD5 o SHA256.
   - Subir cada archivo al canal de entrega correspondiente (FTP, portal del distribuidor, drive compartido).
   - Archivar todas las versiones en el almacenamiento del estudio organizadas por episodio y formato.

---

**Entregable:** Conjunto de archivos del episodio adaptados a cada formato de distribución requerido, con metadatos correctos y log de entrega completado.

**Criterios de aprobación:**
- Cada archivo cumple las especificaciones técnicas del distribuidor correspondiente (resolución, códec, bitrate, audio).
- En los formatos de recorte vertical y cuadrado, ningún elemento narrativo principal queda fuera de cuadro.
- Los diálogos son inteligibles en todos los formatos sin necesidad de auriculares.
- El log de entregas tiene una entrada completa por cada archivo generado.
- Ningún archivo tiene errores de reproducción al abrirlo en el reproductor de referencia del distribuidor.

**Errores comunes:**
- **Usar el mismo master comprimido para generar todas las versiones** — Cada recompresión degrada la imagen; siempre partir del master sin comprimir para cada versión final.
- **Aplicar un reframe automático centrado para el formato vertical** — La composición de animación rara vez tiene los elementos importantes en el centro exacto; el reframe manual es imprescindible.
- **No verificar los subtítulos en el nuevo ratio** — Un subtítulo en la posición estándar 16:9 puede quedar cortado o invisible en formato 9:16 o 1:1.
- **Entregar sin verificar los metadatos** — Un archivo con el título o el número de episodio incorrecto en los metadatos puede ser rechazado por el distribuidor o publicado con información errónea.
`,
    knowledgeRefs: [],
  },
  {
    id: 'color_grading',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'Color Grading',
    description: 'Proceso de ajuste cromatico final para lograr coherencia emocional y visual a lo largo de todo el episodio.',
    content: `# Color Grading

> Proceso de ajuste cromatico final para lograr coherencia emocional y visual a lo largo de todo el episodio.

## Objetivo
Aplicar el tratamiento de color definitivo que unifique visualmente todas las escenas del episodio, refuerce el tono emocional de cada momento y mantenga la coherencia cromatica establecida para la serie, convirtiendo la animacion terminada en la imagen final que vera el espectador.

## Cuando usar este workflow
- Al realizar el color grading final de cada episodio.
- Para ajustar la paleta cromatica despues de revision de direccion.
- Cuando se necesita crear looks diferenciados para secuencias especiales.
- Al preparar versiones con espacios de color diferentes por plataforma.

## Archivos de referencia
- \`Knowledge/Visual/color.md\`
- \`Knowledge/Visual/iluminacion.md\`

## Pasos

### Paso 1: Revisar la guia de color de la serie
Consultar color.md para las paletas establecidas, las asociaciones cromaticas por personaje, locacion y estado emocional. Verificar las LUTs base de la serie y los rangos cromaticos aprobados. El color grading no es una decision aislada por episodio sino parte de un sistema visual global.

### Paso 2: Establecer el look base del episodio
Definir la temperatura de color general, el nivel de contraste y la saturacion base del episodio. Estos parametros dependen del tono emocional predominante: episodios calidos y esperanzadores tienen una base diferente a episodios oscuros y tensos. Aplicar el look base como punto de partida uniforme.

### Paso 3: Calibrar la exposicion y el contraste por escena
Revisar cada escena y ajustar la exposicion para que los negros y blancos esten en su rango correcto. Consultar iluminacion.md para los principios de contraste por tipo de iluminacion. Asegurar que no hay zonas quemadas ni sombras sin detalle salvo que sea intencional para la composicion.

### Paso 4: Aplicar la paleta emocional por secuencia
Ajustar los tonos de cada secuencia segun su intencion emocional. Escenas de peligro pueden virar hacia rojos o naranjas desaturados. Escenas de soledad pueden enfriarse hacia azules. Escenas de nostalgia pueden teñirse de ambar. Cada ajuste debe ser sutil: el espectador debe sentir la emocion, no ver el color.

### Paso 5: Trabajar la piel de los personajes
Los tonos de piel son la referencia principal del espectador para evaluar si el color es "correcto." Ajustar los tonos de piel de cada personaje para que se mantengan naturales y consistentes independientemente de la iluminacion de la escena. Proteger los tonos de piel de los ajustes generales usando calificacion selectiva.

### Paso 6: Crear separacion por planos de profundidad
Usar el color para reforzar la profundidad de la composicion. Los elementos de primer plano pueden tener mas saturacion y contraste, mientras que los fondos se desaturan y suavizan ligeramente. Esta separacion cromatica por profundidad guia la mirada del espectador hacia el sujeto principal.

### Paso 7: Verificar las transiciones cromaticas entre escenas
Reproducir las transiciones entre escenas y verificar que los cambios de look son graduales y motivados. Un salto cromatico brusco sin justificacion narrativa distrae. Las transiciones de dia a noche, de interior a exterior, de presente a pasado deben tener una progresion cromatica logica.

### Paso 8: Revisar la coherencia con episodios anteriores
Comparar el look del episodio actual con el de episodios anteriores. Las locaciones recurrentes deben tener un look consistente. Los personajes deben verse cromaticamente coherentes de un episodio a otro. Verificar con fotogramas de referencia de episodios previos.

### Paso 9: Ajustar para el formato de distribucion
Verificar que el color grading funciona en el espacio de color de destino. SDR para television estandar, HDR si aplica para streaming premium. Lo que se ve en el monitor calibrado del estudio puede verse diferente en una pantalla domestica. Hacer una version para cada espacio de color requerido.

## Entregable
Episodio con color grading final aplicado en todos los espacios de color requeridos, con documentacion de los looks por escena y referencias de continuidad cromatica para futuros episodios.

## Criterios de aprobacion
- El look general del episodio es coherente con la identidad visual de la serie.
- Los tonos de piel son naturales y consistentes en todas las condiciones de iluminacion.
- La paleta emocional refuerza el tono de cada secuencia sin ser obvia.
- Las transiciones cromaticas entre escenas son suaves y motivadas.
- Hay separacion cromatica de profundidad que guia la mirada.
- El color grading es consistente con episodios anteriores en locaciones recurrentes.
- La imagen funciona correctamente en todos los espacios de color de distribucion.

## Errores comunes en este proceso
- Aplicar un look tan agresivo que distorsiona los tonos de piel de los personajes.
- Tratar cada escena de forma aislada sin verificar la coherencia del episodio completo.
- Usar tendencias de color que no corresponden a la estetica establecida de la serie.
- No proteger los tonos de piel al hacer ajustes globales de color.
- Gradear solo en el monitor del estudio sin verificar como se ve en pantallas domesticas.
- Hacer cambios cromaticos bruscos entre escenas sin transicion ni justificacion narrativa.
`,
    knowledgeRefs: ['Knowledge/Visual/iluminacion.md', 'Knowledge/Visual/color.md'],
  },
  {
    id: 'editar_episodio',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'Editar Episodio',
    description: 'Proceso de ensamblaje final del episodio: ritmo, cortes, transiciones y pacing narrativo.',
    content: `# Editar Episodio

> Proceso de ensamblaje final del episodio: ritmo, cortes, transiciones y pacing narrativo.

## Objetivo
Ensamblar todas las piezas del episodio (animacion, voces, musica, efectos) en una pieza cohesiva con ritmo preciso, donde cada corte tenga proposito, cada transicion sirva a la narrativa y el pacing mantenga al espectador enganchado de principio a fin.

## Cuando usar este workflow
- Al realizar el primer ensamblaje de un episodio completo.
- Para revisar y ajustar el corte de un episodio ya ensamblado.
- Al preparar la version de director para revision.
- Para el corte final antes de la postproduccion tecnica.

## Archivos de referencia
- \`Knowledge/Cinematography/edicion.md\`
- \`Knowledge/Cinematography/ritmo.md\`

## Pasos

### Paso 1: Revisar todo el material disponible
Antes de cortar, visualizar todo el material: todas las tomas de animacion, todas las versiones de dialogo, la musica compuesta y los efectos de sonido. Conocer las opciones disponibles permite tomar mejores decisiones. Marcar el material destacado y las alternativas interesantes para momentos clave.

### Paso 2: Establecer la estructura macro del episodio
Definir los actos del episodio y sus puntos de transicion. Consultar ritmo.md para las estructuras ritmicas por formato. Marcar en la linea de tiempo: gancho de apertura, desarrollo del conflicto, punto medio, escalada, climax y resolucion. Cada acto tiene un ritmo propio que contribuye al pacing general.

### Paso 3: Realizar el primer ensamblaje en bruto
Colocar todas las escenas en orden con las tomas seleccionadas, sin pulir cortes ni transiciones. El objetivo es tener una version completa aunque imperfecta para evaluar la estructura. No invertir tiempo en perfeccionar detalles que podrian cambiar en la revision estructural.

### Paso 4: Evaluar el pacing general
Reproducir el ensamblaje completo de corrido, sin pausas. Registrar donde el ritmo se siente lento (el espectador querria avanzar), donde se siente apurado (no hay tiempo de absorber) y donde fluye naturalmente. Estas notas de sensacion son mas valiosas que las mediciones de duracion.

### Paso 5: Ajustar la duracion de cada escena
Recortar o extender escenas segun las notas de pacing. Consultar edicion.md para tecnicas de compresion y expansion temporal. Las escenas expositivas suelen necesitar compresion. Los momentos emocionales suelen necesitar mas aire. Cada recorte debe mantener la coherencia narrativa de la escena.

### Paso 6: Refinar los cortes entre planos
Trabajar cada transicion entre planos dentro de cada escena. Decidir el tipo de corte: corte directo para continuidad, jump cut para energia, match cut para conexion tematica, L-cut o J-cut para fluidez narrativa. Cada corte debe tener una razon: revelar informacion, cambiar perspectiva, mantener ritmo o crear contraste.

### Paso 7: Disenar las transiciones entre escenas
Las transiciones entre escenas comunican la relacion temporal y tematica entre ellas. Un corte directo implica continuidad inmediata, un fade implica paso de tiempo, un wipe puede implicar cambio de locacion. Definir cada transicion segun lo que necesita comunicar narrativamente al espectador.

### Paso 8: Integrar la capa sonora
Colocar la musica, efectos y ambientes en el ensamblaje y verificar que la edicion respira con el audio. Ajustar cortes para que caigan en beats musicales cuando sea apropiado. Verificar que los L-cuts y J-cuts crean las transiciones sonoras correctas. El audio puede pedir ajustes en el corte visual.

### Paso 9: Verificar la claridad narrativa
Reproducir el episodio como si fuera la primera vez. En cada momento, debe ser claro: donde estamos, que quieren los personajes, que esta en juego y por que importa. Si algun momento genera confusion no intencional, resolver con ajustes de edicion, reordenamiento o adicion de planos de contexto.

### Paso 10: Realizar el corte de precision final
Revisar el episodio fotograma a fotograma en los cortes criticos. Ajustar entradas y salidas al fotograma exacto. Verificar que no hay flashes negros entre cortes, que las continuidades de movimiento son fluidas y que el ritmo de la edicion se siente invisible: el espectador debe seguir la historia, no notar los cortes.

## Entregable
Episodio ensamblado en corte final con todos los planos, transiciones, pacing y sincronizacion de audio verificados, listo para la postproduccion tecnica (color grading, mezcla final de audio).

## Criterios de aprobacion
- El pacing del episodio mantiene el interes sin momentos de arrastre ni apuro.
- Cada corte tiene un proposito narrativo o ritmico identificable.
- Las transiciones entre escenas comunican correctamente la relacion temporal.
- La claridad narrativa se mantiene en todo momento sin confusion no intencional.
- La sincronizacion con la musica y efectos es precisa.
- La duracion del episodio esta dentro del rango establecido para el formato.
- La edicion es invisible: el espectador sigue la historia, no los cortes.

## Errores comunes en este proceso
- Enamorarse de una toma o escena y negarse a recortarla aunque perjudique el pacing.
- Cortar demasiado rapido pensando que eso genera energia, cuando genera agotamiento.
- No dejar respirar los momentos emocionales por miedo a que el ritmo baje.
- Usar transiciones elaboradas (wipes, dissolves) donde un corte directo es mas efectivo.
- Editar solo con imagen y agregar el audio al final, descubriendo incompatibilidades.
- No hacer una visualizacion completa del episodio de corrido, perdiendo la experiencia del pacing global.
`,
    knowledgeRefs: ['Knowledge/Cinematography/ritmo.md', 'Knowledge/Cinematography/edicion.md'],
  },
  {
    id: 'mezcla_de_audio',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'Mezcla de Audio',
    description: 'Proceso para balancear dialogo, musica, efectos y ambientes en una mezcla sonora cohesiva y dinamica.',
    content: `# Mezcla de Audio

> Proceso para balancear dialogo, musica, efectos y ambientes en una mezcla sonora cohesiva y dinamica.

## Objetivo
Crear una mezcla de audio final donde cada elemento sonoro ocupe su espacio correcto, el dialogo sea siempre inteligible, la musica amplifique sin dominar, los efectos tengan impacto sin saturar y los ambientes envuelvan sin distraer, resultando en una experiencia auditiva que sirva a la narrativa.

## Cuando usar este workflow
- Al realizar la mezcla final de cada episodio.
- Para ajustar mezclas despues de notas de revision.
- Al preparar mezclas diferenciadas por plataforma (TV, streaming, cine).
- Para la mezcla de trailers, promos o material especial.

## Archivos de referencia
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Sound/efectos.md\`

## Pasos

### Paso 1: Organizar y etiquetar todas las pistas
Agrupar las pistas por categoria: dialogos, musica, efectos de sonido, foley, ambientes. Etiquetar cada pista con nombre descriptivo. Verificar que todo el material esta presente y en la version correcta. Una sesion desorganizada produce una mezcla con errores ocultos.

### Paso 2: Establecer la jerarquia de prioridad
Definir el orden de prioridad para cada momento del episodio. En general: dialogo primero, luego musica, luego efectos, luego ambientes. Pero esto cambia segun el momento: en una explosion sin dialogo, los efectos son prioridad. En un momento contemplativo sin palabras, la musica lidera. Marcar en la linea de tiempo los cambios de prioridad.

### Paso 3: Mezclar el dialogo como base
Comenzar la mezcla estableciendo el nivel de dialogo como referencia. Todo lo demas se construye alrededor de la voz. Asegurar que cada linea es inteligible sin esfuerzo del oyente. Aplicar ecualizacion para claridad vocal, compresion suave para mantener niveles consistentes y de-esser si es necesario.

### Paso 4: Integrar la musica bajo el dialogo
Agregar la musica a la mezcla ajustando su nivel para que apoye sin competir con el dialogo. Usar sidechain o ducking automatico para que la musica baje sutilmente cuando hay dialogo y suba en los silencios. Verificar que la musica mantiene su impacto emocional incluso a volumen reducido bajo las voces.

### Paso 5: Colocar los efectos de sonido
Integrar los efectos de sonido en capas: primero los efectos sincronizados con accion en pantalla, luego los efectos ambientales. Los efectos de impacto (golpes, explosiones, puertas) deben tener presencia sin saturar. Consultar efectos.md para las tecnicas de integracion de efectos en mezcla.

### Paso 6: Construir la cama ambiental
Agregar los ambientes como base continua que contextualiza el espacio. Los ambientes deben sentirse pero no escucharse conscientemente. Ajustar niveles para que sean percibidos subconscientemente como informacion espacial. Las transiciones de ambiente entre escenas deben ser suaves.

### Paso 7: Trabajar la dinamica general
Revisar el rango dinamico del episodio completo. Los momentos suaves deben ser suficientemente audibles y los momentos fuertes no deben distorsionar ni saltar excesivamente del nivel base. Aplicar compresion de bus suave para cohesion sin eliminar la dinamica natural que hace la mezcla viva.

### Paso 8: Verificar la espacializacion
Revisar la imagen estereo (o surround si aplica). El dialogo debe estar centrado. La musica puede tener amplitud estereo. Los ambientes envuelven. Los efectos direccionales deben corresponder a su posicion en pantalla. Verificar la compatibilidad mono: la mezcla debe funcionar tambien en dispositivos mono.

### Paso 9: Escuchar en diferentes sistemas
Reproducir la mezcla en monitores de estudio, en auriculares, en altavoces pequenos (simulando TV o telefono) y a diferentes volumenes. Lo que suena bien en el estudio puede ser inaudible en un telefono. Ajustar para que la mezcla funcione aceptablemente en todos los sistemas de reproduccion.

### Paso 10: Entregar stems y mezcla final
Exportar la mezcla final en el formato requerido. Ademas, exportar stems separados (dialogo, musica, efectos) para permitir ajustes posteriores y para la creacion de versiones internacionales donde se reemplaza el dialogo manteniendo el resto de la mezcla.

## Entregable
Mezcla de audio final del episodio con niveles calibrados, stems separados por categoria, verificacion de compatibilidad en multiples sistemas y documentacion de los niveles de referencia.

## Criterios de aprobacion
- El dialogo es inteligible al 100% en todo momento sin necesidad de subir el volumen.
- La musica amplifica la emocion sin enmascarar el dialogo ni los efectos clave.
- Los efectos de sonido tienen impacto proporcional a su importancia narrativa.
- Los ambientes se sienten presentes pero no distraen conscientemente.
- La mezcla funciona en monitores de estudio, auriculares y altavoces pequenos.
- El rango dinamico es apropiado para el formato de distribucion.
- Los stems separados estan correctamente exportados para uso internacional.

## Errores comunes en este proceso
- Mezclar solo en monitores de alta calidad y descubrir problemas al escuchar en otros sistemas.
- Subir la musica hasta que compita con el dialogo, forzando al espectador a esforzarse.
- Comprimir excesivamente eliminando toda la dinamica y haciendo la mezcla plana.
- No verificar la compatibilidad mono, causando cancelacion de fase en dispositivos mono.
- Mezclar cada escena de forma aislada sin verificar la coherencia de niveles del episodio completo.
- Olvidar los stems separados, complicando futuras versiones internacionales o ajustes.
`,
    knowledgeRefs: ['Knowledge/Sound/musica.md', 'Knowledge/Sound/efectos.md'],
  },
  {
    id: 'qa_visual',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'QA Visual — Revisión Frame por Frame',
    description: '',
    content: `# QA Visual — Revisión Frame por Frame

**Objetivo:** Detectar y documentar todos los errores visuales de un episodio antes de su entrega final.

**Cuándo usar:** Una vez completado el ensamble de imagen y audio del episodio, antes del color grading final y la entrega al distribuidor.

**Archivos de referencia:**
- \`REVIEW_SYSTEM.md\` — Dimensiones de evaluación y rúbricas de calidad
- \`Productions/Serie_01/Memory/Style/master_style.md\` — Estilo visual canónico
- \`Productions/Serie_01/Memory/Characters/[nombre]/visual_canon.md\` — Referencia por personaje presente en el episodio
- \`Productions/Serie_01/Memory/Environments/[nombre]/visual_canon.md\` — Referencia por escenario presente en el episodio

---

## Pasos

1. **Preparar el entorno de revisión**
   - Exportar el episodio en resolución de trabajo (no comprimida) con código de tiempo visible.
   - Abrir en paralelo los \`visual_canon.md\` de todos los personajes y escenarios que aparecen.
   - Tener a mano el guion técnico y el animatic aprobado como referencia de intención original.
   - Crear una hoja de registro de errores con columnas: TC_inicio, TC_fin, tipo_error, descripción, severidad (A/B/C), responsable.

2. **Primera pasada: errores de personaje**
   - Revisar a velocidad normal para detectar inconsistencias de peso visual (un personaje que no "pesa" igual en todos los planos).
   - Pausar en cada corte para verificar: proporciones, colores planos, líneas de contorno, expresiones fuera de rango canónico.
   - Anotar cada error con TC exacto y captura de frame.
   - Clasificar severidad: A = rompe la escena / B = visible pero tolerable / C = imperceptible a velocidad normal.

3. **Segunda pasada: errores de escenario y props**
   - Verificar que los fondos coincidan con el \`visual_canon.md\` de cada locación (paleta, perspectiva, elementos inamovibles del mundo).
   - Comprobar que los props aparezcan en manos correctas, con el color y tamaño canónicos.
   - Revisar que los efectos de ambiente (luz, niebla, sombras proyectadas) sean consistentes dentro de cada escena.

4. **Tercera pasada: continuidad de animación**
   - Verificar que no haya saltos de posición entre planos de la misma escena (personajes que "teletransportan" entre cortes).
   - Comprobar dirección de miradas, orientación corporal y posición de manos en conversaciones.
   - Detectar intercalados faltantes o duplicados que causen movimientos robóticos o de doble frame.

5. **Cuarta pasada: errores técnicos de imagen**
   - Buscar líneas de compositing mal enmascaradas, artefactos de renderizado, halos de chroma o bordes sucios.
   - Verificar que el ratio de aspecto sea correcto en toda la duración y que no haya crops accidentales.
   - Comprobar que no existan frames negros o congelados no intencionales.

6. **Clasificar y priorizar el reporte**
   - Agrupar los errores por tipo y responsable de corrección.
   - Todos los errores A deben corregirse obligatoriamente antes de la entrega.
   - Los errores B se evalúan en función del tiempo disponible; los C quedan en un backlog de mejora futura.
   - Consolidar el reporte en un documento con capturas de frame adjuntas.

7. **Entregar el reporte y hacer seguimiento**
   - Compartir el reporte con el director de animación y el compositor.
   - Fijar una fecha de cierre de correcciones.
   - Una vez corregidos, realizar una pasada de verificación rápida (solo los TCs afectados) para confirmar que los errores A y B están resueltos.

---

**Entregable:** Reporte de QA visual con código de tiempo, tipo de error, severidad y estado de resolución; episodio corregido listo para color grading final.

**Criterios de aprobación:**
- Cero errores de severidad A en el corte final.
- Todos los personajes son consistentes con su \`visual_canon.md\` en el 100% de sus apariciones.
- Ningún artefacto técnico visible a velocidad normal de reproducción.
- El reporte de seguimiento confirma cierre de todos los errores A y B documentados.

**Errores comunes:**
- **Revisar directamente en el archivo comprimido para entrega** — Los artefactos de compresión ocultan errores que reaparecen en otras versiones; siempre revisar en el master sin comprimir.
- **Hacer una sola pasada mezclando tipos de error** — La atención dividida hace que se pasen por alto errores; cada pasada debe tener un foco único y definido.
- **No documentar los errores C** — Aunque no sean urgentes, deben quedar registrados; acumulados a lo largo de la temporada crean inconsistencia sistémica.
- **Aprobar sin verificación de cierre** — No marcar un error como resuelto sin revisar el frame corregido; la corrección puede introducir nuevos errores.
`,
    knowledgeRefs: [],
  },
  {
    id: 'recap',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'Recap — "Previamente en..." para Episodio Anterior',
    description: '',
    content: `# Recap — "Previamente en..." para Episodio Anterior

**Objetivo:** Crear un resumen audiovisual breve que active la memoria del espectador sobre los eventos relevantes del episodio anterior sin revelar lo que sucederá en el actual.

**Cuándo usar:** Al producir cada episodio a partir del segundo de la temporada; el recap se monta cuando el episodio actual está en picture lock pero aún puede ajustarse su duración inicial.

**Archivos de referencia:**
- \`Productions/Serie_01/Bible/\` — Arco narrativo de la temporada para saber qué información es "setup" y qué es "payoff"
- \`Productions/Serie_01/Seasons/[temporada]/[episodio_anterior]/\` — Material del episodio fuente
- \`CONSTITUTION.md\` — Tono y voz narrativa de la serie (el recap debe sonar igual que la serie, no como un resumen externo)

---

## Pasos

1. **Identificar qué recordar (y qué no)**
   - Leer el guion del episodio actual y listar los elementos narrativos que el espectador necesita tener presentes para entender las escenas del episodio.
   - Distinguir entre: información que el espectador necesita recordar (incluir) e información que perderá impacto si se adelanta en el recap (omitir).
   - Priorizar escenas que establecieron promesas narrativas que el episodio actual va a resolver.
   - No incluir el cliffhanger del episodio anterior si el episodio actual lo resuelve en los primeros cinco minutos: es más efectivo que el espectador lo redescubra en contexto.

2. **Seleccionar los clips fuente**
   - Extraer del episodio anterior (o episodios anteriores si la información se remonta más atrás) los planos que comunican la información identificada en el paso anterior.
   - Priorizar planos con rostros de personajes sobre planos de acción: la emoción ancla mejor la memoria que la acción.
   - Seleccionar versiones de los planos que funcionen fuera de contexto: un plano en el que el personaje está reaccionando a algo que ya no se ve puede ser confuso en el recap.
   - Reunir entre 6 y 12 clips; si necesitas más de 12 clips para contextualizar el episodio actual, el problema puede ser narrativo y vale la pena consultarlo con el director.

3. **Escribir la narración (si aplica)**
   - Si la serie usa voz en off para el recap, escribir el texto con la voz del narrador establecido o del personaje cuya perspectiva domina la temporada.
   - El texto debe ser mínimo: las imágenes hacen el trabajo; la narración solo añade lo que la imagen no puede decir sola.
   - Evitar revelar información nueva en la narración del recap; todo lo que se diga debe estar anclado en imágenes presentes en el clip.
   - Máximo 3-4 frases de narración para un recap de 60 segundos.

4. **Montar el recap**
   - Duración objetivo: entre 30 y 90 segundos. Por encima de 90 segundos el espectador percibe el recap como un resumen del episodio anterior, no como un recordatorio.
   - Ordenar los clips en orden cronológico de la historia (no en el orden en que el espectador los vio, si hubo flashbacks o estructura no lineal).
   - Usar los mismos cortes de sonido del episodio original (diálogos, efectos) para que el clip funcione como un fragmento reconocible, no como un extracto forzado.
   - Añadir el logo o la tarjeta de "Previamente en [nombre de la serie]" al inicio con la misma tipografía y estilo de los títulos principales.

5. **Revisar el recap con criterio de spoiler**
   - Ver el recap inmediatamente seguido del inicio del episodio actual para verificar que la transición sea fluida.
   - Confirmar que el recap no adelanta ni sugiere el giro principal del episodio actual.
   - Pedir a alguien que no haya visto el episodio anterior que vea el recap y responda: ¿entiendes el contexto? ¿sientes que te spoilearon algo del episodio que vas a ver? Ajustar según su respuesta.

6. **Integrar al master del episodio**
   - Insertar el recap antes del cold open o del título principal, según la estructura establecida en la temporada.
   - Verificar que el audio del recap esté balanceado con el resto del episodio (el salto de volumen entre el recap y el inicio del episodio es uno de los errores más frecuentes).
   - Incluir el recap en todas las versiones de entrega del episodio (no es un elemento opcional que se omite en streaming).

---

**Entregable:** Secuencia de recap de 30-90 segundos integrada al inicio del episodio, con narración (si aplica), correctamente balanceada en audio y sin spoilers del episodio actual.

**Criterios de aprobación:**
- El recap comunica toda la información que el episodio actual necesita que el espectador recuerde.
- No contiene spoilers del giro o revelación principal del episodio actual.
- La duración está entre 30 y 90 segundos.
- El audio está nivelado con el resto del episodio (sin saltos de volumen perceptibles).
- Alguien que no recuerde el episodio anterior puede seguir el episodio actual sin confusión tras ver el recap.

**Errores comunes:**
- **Incluir demasiada información** — Un recap que cubre todo el episodio anterior se convierte en un resumen, no en un recordatorio; el espectador siente que está siendo tratado como alguien que no prestó atención.
- **Seleccionar los clips más espectaculares en lugar de los más informativos** — Los mejores planos de acción del episodio anterior rara vez son los que el espectador necesita recordar para entender el siguiente.
- **Montar el recap antes de tener el picture lock del episodio actual** — Si el episodio cambia después de montar el recap, el recap puede quedar contextualmente incorrecto.
- **Olvidar balancear el audio** — El recap suele montarse con pistas de audio de distintas mezclas; sin un ajuste de niveles explícito, el salto de volumen al inicio del episodio es casi inevitable.
`,
    knowledgeRefs: [],
  },
  {
    id: 'revision_continuidad',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'Revisión de Continuidad — Coherencia Visual y Narrativa',
    description: '',
    content: `# Revisión de Continuidad — Coherencia Visual y Narrativa

**Objetivo:** Verificar que todas las escenas y episodios de una temporada funcionen como un universo visual y narrativo coherente.

**Cuándo usar:** Al terminar el ensamble de cada bloque de episodios (cada 2-3 episodios) y al cerrar una temporada completa antes de su entrega.

**Archivos de referencia:**
- \`Productions/Serie_01/Bible/\` — Reglas del mundo, timeline canónico, relaciones entre personajes
- \`Productions/Serie_01/Memory/Characters/[nombre]/visual_canon.md\` — Estado visual vigente de cada personaje
- \`Productions/Serie_01/Memory/Environments/[nombre]/visual_canon.md\` — Estado visual vigente de cada locación
- \`REVIEW_SYSTEM.md\` — Dimensión de coherencia narrativa en la rúbrica de evaluación
- \`CONSTITUTION.md\` — Identidad de la serie y principios irrompibles

---

## Pasos

1. **Construir la matriz de continuidad del bloque**
   - Listar todos los episodios del bloque con sus escenas ordenadas cronológicamente en la línea de tiempo de la historia.
   - Crear una tabla de "estado de personaje" por episodio: vestuario, heridas o marcas físicas, objetos que porta, estado emocional dominante.
   - Crear una tabla de "estado de locación" por episodio: hora del día, condiciones climáticas, objetos añadidos o removidos del escenario.
   - Anotar cualquier evento que cambie permanentemente a un personaje o locación (corte de cabello, destrucción de un lugar, nuevo objeto en el mundo).

2. **Revisión de continuidad de vestuario y apariencia**
   - Verificar que el vestuario de cada personaje sea consistente dentro de un mismo día de la historia (a menos que haya una escena de cambio de ropa).
   - Comprobar que las marcas físicas acumulativas (heridas, manchas, deterioro de ropa) aparezcan en los episodios posteriores al evento que las causó.
   - Confirmar que los cambios de imagen permanentes (nuevo corte de pelo, cicatriz) se mantengan de forma consistente desde su introducción.

3. **Revisión de continuidad de props y objetos clave**
   - Listar todos los objetos narrativamente importantes (cartas, llaves, armas, artefactos) y trazar su recorrido de mano en mano.
   - Verificar que un objeto destruido no aparezca intacto en episodios posteriores.
   - Confirmar que los objetos que los personajes dejan en un lugar permanezcan allí salvo que alguien los mueva en escena.

4. **Revisión de continuidad espacial y temporal**
   - Verificar que la geografía del mundo sea consistente: si el personaje va de A a B en el episodio 3, ese trayecto debe tener la misma duración implícita en el episodio 7.
   - Comprobar que los ciclos de día y noche sean coherentes con el tiempo diegético transcurrido.
   - Detectar saltos temporales no señalizados (una escena que implica días de diferencia pero el vestuario es el mismo).

5. **Revisión de continuidad narrativa y de personaje**
   - Verificar que los personajes actúen de acuerdo a la información que poseen en cada momento de la historia (sin conocimiento que aún no deberían tener).
   - Comprobar que las decisiones de los personajes sean coherentes con su caracterización establecida en la Biblia.
   - Detectar promesas narrativas abiertas (preguntas planteadas al espectador) que deban resolverse en el bloque o marcarlas para seguimiento en episodios futuros.

6. **Documentar discrepancias y clasificarlas**
   - Registrar cada discrepancia con: episodio, minuto, descripción del error, impacto narrativo (alto / medio / bajo).
   - Impacto alto: contradice un hecho establecido que el espectador recordará.
   - Impacto medio: inconsistencia visible pero que no rompe la lógica de la historia.
   - Impacto bajo: detalle que solo notaría un espectador muy atento o el equipo.
   - Proponer la corrección más económica para cada discrepancia (edición, añadir un plano, añadir una línea de diálogo).

7. **Actualizar la memoria visual y la Biblia**
   - Una vez resueltas las discrepancias, actualizar los \`visual_canon.md\` y los documentos de la Biblia para que reflejen el estado canónico definitivo del bloque.
   - Anotar en la Biblia cualquier decisión tomada durante esta revisión que amplíe o matice las reglas del mundo.

---

**Entregable:** Matriz de continuidad del bloque, reporte de discrepancias con propuesta de corrección y documentos de memoria actualizados con el estado canónico vigente.

**Criterios de aprobación:**
- Ninguna discrepancia de impacto alto sin resolver en el corte final.
- La matriz de continuidad está completa y puede usarse como referencia para los episodios siguientes.
- Todos los \`visual_canon.md\` afectados por cambios permanentes han sido actualizados.
- El equipo de guion ha validado que no hay contradicciones con el arco narrativo planificado para el resto de la temporada.
- Las discrepancias de impacto bajo quedan documentadas en el backlog para referencia futura.

**Errores comunes:**
- **Revisar episodio por episodio en lugar de con la matriz** — Sin una vista global, los errores de continuidad que cruzan varios episodios son casi imposibles de detectar.
- **Corregir solo el error visible sin actualizar la memoria** — Si no se actualiza el \`visual_canon.md\`, el mismo error se repetirá en futuros episodios.
- **Ignorar la continuidad de información de los personajes** — La continuidad no es solo visual; un personaje que actúa con información que aún no tiene es un error narrativo igual de grave que un prop que cambia de mano.
- **Dejar la revisión de continuidad para el cierre de temporada** — A ese punto, las correcciones son mucho más costosas; revisar por bloques permite corregir antes de que el error se propague.
`,
    knowledgeRefs: [],
  },
  {
    id: 'subtitulado',
    phase: '04_PostProduccion',
    phaseName: 'Post-Producción',
    phaseIcon: '✂️',
    phaseColor: '#f06292',
    title: 'Subtitulado — Versión con Subtítulos del Episodio',
    description: '',
    content: `# Subtitulado — Versión con Subtítulos del Episodio

**Objetivo:** Crear subtítulos precisos, legibles y bien sincronizados que hagan el episodio accesible sin interferir con la experiencia visual.

**Cuándo usar:** Una vez aprobado el mix de audio definitivo del episodio, antes de generar las versiones de entrega para cada plataforma.

**Archivos de referencia:**
- \`Productions/Serie_01/Bible/\` — Nombres propios canónicos, topónimos del mundo, términos inventados con su ortografía oficial
- \`Productions/Serie_01/Memory/Style/master_style.md\` — Paleta de color de referencia para verificar contraste de subtítulos sobre imagen
- Guion de audio aprobado — Fuente primaria del texto a subtitular

---

## Pasos

1. **Preparar el archivo fuente**
   - Partir del guion de audio definitivo (el aprobado en mezcla, no un borrador previo).
   - Exportar la pista de diálogos separada del mix para facilitar la sincronización.
   - Definir el estándar de formato de entrega requerido por cada plataforma: SRT, VTT, TTML, o closed captions embebidos.
   - Crear un glosario de términos propios de la serie (nombres, lugares, expresiones inventadas) para garantizar ortografía consistente.

2. **Transcribir y segmentar los diálogos**
   - Transcribir el audio fiel al texto hablado, incluyendo contracciones y registros coloquiales tal como suenan.
   - Segmentar cada bloque de texto en unidades de lectura natural: máximo 2 líneas por tarjeta, máximo 42 caracteres por línea.
   - Respetar los cortes de frase: nunca dividir una unidad sintáctica (sujeto + verbo) entre dos tarjetas consecutivas si puede evitarse.
   - Mantener una tarjeta por hablante cuando hay solapamiento de voces; indicar quién habla con un guion si dos personajes hablan a la vez.

3. **Sincronizar los tiempos**
   - Asignar TC de entrada 2-4 frames después del inicio del audio percibido (el ojo necesita ese margen para reconocer que hay texto).
   - Asignar TC de salida 4-6 frames antes del corte del audio o del corte de imagen, lo que ocurra primero.
   - Respetar una duración mínima de 1 segundo por tarjeta (para que el ojo pueda registrar que apareció texto) y máxima de 7 segundos.
   - En escenas de acción rápida con diálogos breves, priorizar la legibilidad sobre la sincronía milimétrica: es mejor que el texto entre un frame antes a que desaparezca antes de ser leído.

4. **Revisar legibilidad sobre imagen**
   - Reproducir el episodio con los subtítulos superpuestos y verificar que el texto sea legible sobre todos los fondos donde aparece.
   - En fondos claros o con mucho detalle, agregar sombra o borde al texto (según el estándar de la plataforma destino).
   - Verificar que los subtítulos no cubran información visual narrativamente importante (el rostro de un personaje en un momento clave, un prop relevante).
   - Desplazar el texto al tercio superior de la imagen cuando el tercio inferior esté ocluido por elementos visuales críticos.

5. **Revisar ortografía, puntuación y consistencia**
   - Cotejar todos los nombres propios, topónimos y términos inventados con el glosario de la serie.
   - Verificar puntuación: los subtítulos no usan punto final en la última línea de una tarjeta, pero sí usan comas, puntos suspensivos y signos de interrogación/exclamación cuando corresponde.
   - Unificar el tratamiento de los efectos de sonido no diegéticos si se incluyen (entre corchetes y en mayúsculas: [MÚSICA TENSA], [TRUENO]).
   - Revisar que el registro de cada personaje sea consistente: si habla en un dialecto o con un rasgo de habla característico, reflejarlo con criterio (sin exagerar al punto de reducir legibilidad).

6. **Generar los archivos de entrega**
   - Exportar en el formato requerido por cada plataforma de destino.
   - Incluir metadatos de idioma y codificación UTF-8 en el encabezado del archivo.
   - Guardar el archivo master en el repositorio del episodio junto con el video master.
   - Registrar en el log de entrega qué versiones de subtítulos se generaron y para qué plataformas.

---

**Entregable:** Archivos de subtítulos en los formatos requeridos, sincronizados con el audio definitivo, listos para entrega por plataforma.

**Criterios de aprobación:**
- Ninguna tarjeta supera los 42 caracteres por línea ni las 2 líneas de altura.
- Todos los nombres propios y términos de la serie coinciden con el glosario canónico.
- Los subtítulos son legibles sobre el 100% de los fondos del episodio (contraste verificado).
- La sincronía es natural: el texto aparece y desaparece sin que el espectador tenga que anticiparse ni esperar.
- Los archivos se abren y reproducen correctamente en cada plataforma de destino.

**Errores comunes:**
- **Usar el guion de escritura en lugar del guion de audio** — Los actores improvisan, cambian frases y adaptan los diálogos; subtitular el guion escrito genera discrepancias con lo que se escucha.
- **Segmentar el texto según el audio sin respetar la sintaxis** — Cortar "que mañana / te cuento" es mucho menos legible que "que mañana te cuento" en una sola línea aunque sea larga.
- **No revisar sobre imagen en movimiento** — Un subtítulo perfectamente legible sobre un frame estático puede ser ilegible en movimiento si coincide con un pan rápido o una explosión de luz.
- **Generar un solo archivo para todas las plataformas** — Cada plataforma tiene requisitos técnicos distintos (codificación, posición, tipografía embebida); un archivo genérico puede verse mal o ser rechazado.
`,
    knowledgeRefs: [],
  },
  {
    id: 'revision_animacion',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión de Animación',
    description: 'Evaluación de la actuación animada, el timing, el peso y la expresividad del movimiento.',
    content: `# Revisión de Animación

> Evaluación de la actuación animada, el timing, el peso y la expresividad del movimiento.

## Objetivo
Verificar que la animación funciona como actuación: que los personajes "viven", que el movimiento comunica emoción y personalidad, que el timing es preciso y que cada gesto tiene intención dramática. La animación no es solo movimiento técnicamente correcto; es interpretación a través del movimiento.

## Cuándo usar este workflow
- Cuando se tienen escenas animadas en fase de blocking o polish.
- Antes de aprobar escenas para render final o composición.
- Cuando la animación se siente "correcta pero vacía" o mecánica.
- Cuando hay inconsistencias en la actuación entre escenas del mismo personaje.
- En cada ciclo de revisión de animación previo a la entrega final.

## Archivos de referencia
- \`Knowledge/Animation/principios.md\`
- \`Knowledge/Animation/acting.md\`
- \`Knowledge/Animation/timing.md\`
- \`Knowledge/Animation/expresiones.md\`
- \`Knowledge/Animation/movimiento.md\`
- \`Knowledge/REVIEW_SYSTEM.md\` — Dimensión 4: Animación

## Pasos

### Paso 1: Visualización completa de la escena
Ver la escena completa una primera vez sin pausa y sin análisis técnico. Registrar la impresión emocional: la actuación se siente auténtica o forzada, el ritmo de la escena fluye o se arrastra, los momentos emocionales impactan o pasan desapercibidos. Esta primera impresión es la más cercana a la experiencia del espectador.

### Paso 2: Evaluar la actuación general
Consultar \`Knowledge/Animation/acting.md\`. La animación debe comunicar lo que el personaje piensa y siente, no solo lo que hace. Verificar que cada acción tiene una motivación emocional clara. Los personajes deben "pensar antes de actuar": debe existir un proceso interno visible antes de cada acción significativa.

### Paso 3: Analizar el timing y el spacing
Consultar \`Knowledge/Animation/timing.md\`. El timing define la personalidad del movimiento. Revisar cada acción importante: las anticipaciones son correctas, los breakdowns tienen el arco adecuado, los slow-ins y slow-outs dan peso y naturalidad. Un timing incorrecto hace que un personaje grande se mueva como uno pequeño o que un momento dramático pase sin peso.

### Paso 4: Verificar el peso y la física
Los personajes deben sentirse sólidos en su mundo. Verificar que el peso es consistente: los personajes pesados se mueven diferente a los ligeros, los objetos caen con la gravedad correcta, los contactos con el suelo son convincentes. Consultar \`Knowledge/Animation/movimiento.md\` para las reglas de peso según el estilo de la serie.

### Paso 5: Evaluar las expresiones faciales
Consultar \`Knowledge/Animation/expresiones.md\`. Las expresiones son el centro de la actuación animada. Verificar que las transiciones entre expresiones son fluidas y creíbles, que las microexpresiones acompañan los diálogos, que los ojos comunican intención y que la boca no es el único indicador emocional del rostro.

### Paso 6: Revisar la sincronización con el audio
Verificar que el lip-sync es preciso y natural, no mecánico. Los acentos y énfasis del diálogo deben reflejarse en los gestos corporales. Las reacciones de los personajes que escuchan son tan importantes como las del que habla. La actuación corporal debe estar sincronizada con el tono emocional de la voz.

### Paso 7: Analizar la continuidad de actuación
Verificar que un mismo personaje mantiene su estilo de movimiento entre escenas. Cada personaje debe tener una forma de moverse que lo distinga: su postura, la amplitud de sus gestos, la velocidad de sus reacciones, sus tics o hábitos corporales. La inconsistencia en la actuación rompe la ilusión de un personaje real.

### Paso 8: Evaluar las escenas de acción
Las escenas de acción requieren revisión especial: la coreografía debe ser legible, cada golpe o movimiento importante debe tener anticipación y follow-through adecuados, el ritmo debe variar para crear momentos de impacto, y la cámara debe apoyar la claridad de la acción.

### Paso 9: Revisar los momentos de silencio
Los momentos sin diálogo son donde la animación más se prueba. Verificar que la actuación comunica pensamiento, emoción y estado interno sin depender de palabras. Estos momentos definen si la animación está al nivel de interpretación dramática o si es solo movimiento ilustrativo.

### Paso 10: Documentar hallazgos por escena
Crear notas específicas por escena y por toma, indicando timecodes exactos, el problema identificado y la corrección sugerida. Priorizar los problemas que afectan la lectura emocional sobre los problemas técnicos menores.

## Entregable
Informe de revisión de animación con evaluación general según la Dimensión 4 de \`REVIEW_SYSTEM.md\`, notas por escena con timecodes y descripciones específicas del problema, y recomendaciones priorizadas distinguiendo entre problemas de actuación, timing, peso y continuidad.

## Criterios de aprobación
- La actuación comunica emoción y pensamiento, no solo acción física.
- El timing es preciso y adecuado al peso y personalidad de cada personaje.
- Las expresiones faciales son ricas, variadas y sincronizadas con el audio.
- Cada personaje tiene un estilo de movimiento distinguible y consistente.
- Los momentos de silencio sostienen la actuación sin depender de diálogos.
- Las escenas de acción son legibles y tienen ritmo variable.
- La puntuación en la Dimensión 4 del REVIEW_SYSTEM alcanza el umbral mínimo.

## Errores comunes en este proceso
- Evaluar la suavidad del movimiento sin evaluar la intención: un movimiento perfectamente interpolado puede ser completamente muerto dramáticamente.
- Ignorar el contexto narrativo: la animación debe servir a la historia, no lucirse técnicamente.
- No dar notas específicas: "la animación no funciona" no es útil. Especificar qué frame, qué personaje, qué acción y qué debería cambiar.
- Pedir realismo cuando el estilo de la serie es estilizado: las reglas de animación cambian según el estilo visual.
- No revisar con audio: la animación se experimenta con sonido, música y diálogo. Revisar sin audio da una evaluación incompleta.
- Corregir problemas de animación que en realidad son problemas de guion: si la actuación no funciona, a veces el problema está en lo que dice el personaje, no en cómo se mueve.
`,
    knowledgeRefs: ['Knowledge/Animation/acting.md', 'Knowledge/Animation/principios.md', 'Knowledge/Animation/timing.md', 'Knowledge/Animation/movimiento.md', 'Knowledge/REVIEW_SYSTEM.md', 'Knowledge/Animation/expresiones.md'],
  },
  {
    id: 'revision_audio',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión de Audio',
    description: 'Evaluación del diseño sonoro, la música y el doblaje como herramientas de construcción de mundo y amplificación emocional.',
    content: `# Revisión de Audio

> Evaluación del diseño sonoro, la música y el doblaje como herramientas de construcción de mundo y amplificación emocional.

## Objetivo
Determinar si el audio cumple su triple función: la música amplifica las emociones de la historia, el diseño de sonido construye un mundo creíble y envolvente, y las voces dan vida auténtica a los personajes. El audio no es un complemento secundario; es la mitad de la experiencia audiovisual.

## Cuándo usar este workflow
- Cuando se tiene una mezcla de audio en fase avanzada o final.
- Cuando la música o los efectos de sonido se sienten desconectados de la imagen.
- Antes de la mezcla final para verificar que todos los elementos sonoros funcionan juntos.
- Cuando se recibe feedback sobre que "algo falta" en la experiencia de visionado.
- En cada ciclo de revisión de audio previo a la entrega final.

## Archivos de referencia
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Sound/efectos.md\`
- \`Knowledge/Sound/voces.md\`
- \`Knowledge/Sound/mezcla.md\`
- \`Knowledge/Sound/diseno_sonoro.md\`
- \`Knowledge/REVIEW_SYSTEM.md\` — Dimensión 5: Audio

## Pasos

### Paso 1: Escucha completa con imagen
Ver la pieza completa con atención prioritaria al audio. Anotar momentos donde el audio potencia la imagen, momentos donde la distrae o contradice, y momentos donde se siente su ausencia. Registrar si la experiencia emocional general se amplifica o se reduce por el audio.

### Paso 2: Escucha solo de audio sin imagen
Reproducir solo la pista de audio sin la imagen. Esto revela si el diseño sonoro construye un mundo reconocible por sí mismo: se debería poder intuir los espacios, las acciones y las emociones solo escuchando. Anotar dónde el audio crea imágenes mentales y dónde hay vacíos.

### Paso 3: Evaluar la música como herramienta narrativa
Consultar \`Knowledge/Sound/musica.md\`. La música debe amplificar, no duplicar. Si la escena es triste y la música dice "esto es triste", hay redundancia. La música más efectiva añade una capa que la imagen sola no comunica: ironía, presagio, profundidad emocional. Verificar que cada entrada musical tiene justificación dramática y que los silencios musicales son tan intencionales como la música misma.

### Paso 4: Analizar los temas musicales
Verificar que los temas o leitmotifs asociados a personajes, lugares o emociones son coherentes y reconocibles. Los temas deben evolucionar con la historia: variaciones instrumentales, cambios de tonalidad o ritmo que reflejen el arco narrativo. Un tema que suena siempre igual pierde poder.

### Paso 5: Evaluar el diseño de sonido ambiente
Consultar \`Knowledge/Sound/diseno_sonoro.md\`. Cada espacio debe tener su paisaje sonoro propio: la acústica de una cueva difiere de la de un bosque o una ciudad. Verificar que los ambientes son ricos en detalle pero no compiten con los diálogos. Los ambientes deben ser sentidos más que escuchados conscientemente.

### Paso 6: Revisar los efectos de sonido
Consultar \`Knowledge/Sound/efectos.md\`. Los efectos deben ser apropiados al estilo de la serie: realistas, estilizados o exagerados según la dirección artística. Cada efecto importante debe tener peso y presencia. Verificar la sincronización exacta con la acción visual y que los efectos contribuyen a la sensación de impacto físico.

### Paso 7: Evaluar las voces y el doblaje
Consultar \`Knowledge/Sound/voces.md\`. Las voces deben ser coherentes con el diseño de cada personaje. Evaluar la actuación vocal: naturalidad, rango emocional, dicción clara sin ser artificial. Verificar que las voces se distinguen claramente entre sí y que el casting vocal refuerza la personalidad de cada personaje.

### Paso 8: Analizar la mezcla y los niveles
Consultar \`Knowledge/Sound/mezcla.md\`. Los diálogos deben ser siempre inteligibles. La música no debe competir con las voces en momentos de diálogo importante. Los efectos de sonido deben integrarse naturalmente sin sobresaltos injustificados. Verificar la mezcla en diferentes sistemas de reproducción si es posible: altavoces, auriculares, dispositivo móvil.

### Paso 9: Verificar transiciones sonoras
Las transiciones entre escenas deben ser suaves o intencionalmente abruptas según la narrativa. Verificar que los cortes de audio no son bruscos de forma accidental, que los crossfades son apropiados y que las transiciones sonoras apoyan el ritmo de la edición visual.

### Paso 10: Compilar informe de audio
Documentar todos los hallazgos con timecodes precisos. Clasificar los problemas en: problemas de diseño sonoro (afectan la construcción del mundo), problemas musicales (afectan la amplificación emocional), problemas de voces (afectan la credibilidad de personajes) y problemas de mezcla (afectan la experiencia de escucha).

## Entregable
Informe de revisión de audio con evaluación general según la Dimensión 5 de \`REVIEW_SYSTEM.md\`, análisis detallado de música, diseño sonoro, voces y mezcla, notas con timecodes específicos, y recomendaciones priorizadas para cada área.

## Criterios de aprobación
- La música amplifica sin duplicar las emociones de la imagen.
- Los temas musicales son reconocibles y evolucionan con la narrativa.
- El diseño de sonido construye un mundo sonoro creíble y envolvente.
- Los efectos están sincronizados y tienen el peso adecuado al estilo.
- Las voces son distinguibles, naturales y coherentes con los personajes.
- Los diálogos son inteligibles en todos los momentos.
- La mezcla funciona en diferentes sistemas de reproducción.
- La puntuación en la Dimensión 5 del REVIEW_SYSTEM alcanza el umbral mínimo.

## Errores comunes en este proceso
- Revisar el audio en condiciones acústicas deficientes: usar monitores de referencia o auriculares de calidad profesional.
- Evaluar elementos aislados sin considerar la mezcla completa: todo el audio debe funcionar como un todo integrado.
- Ignorar los silencios: el silencio es una herramienta sonora poderosa; su ausencia total es un error tan grave como el exceso de sonido.
- Asumir que más sonido es mejor: la saturación sonora fatiga al espectador tanto como la monotonía.
- No considerar al público objetivo: el diseño sonoro para niños pequeños tiene reglas diferentes al dirigido a adolescentes o adultos.
- Revisar solo una vez: el audio revela problemas diferentes en cada escucha.
`,
    knowledgeRefs: ['Knowledge/Sound/efectos.md', 'Knowledge/Sound/musica.md', 'Knowledge/Sound/voces.md', 'Knowledge/Sound/diseno_sonoro.md', 'Knowledge/Sound/mezcla.md', 'Knowledge/REVIEW_SYSTEM.md'],
  },
  {
    id: 'revision_biblia',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión de Biblia',
    description: 'Verificación integral de la solidez de la biblia de la serie antes de entrar en producción.',
    content: `# Revisión de Biblia

> Verificación integral de la solidez de la biblia de la serie antes de entrar en producción.

## Objetivo
Asegurar que la biblia de la serie es un documento sólido, completo y coherente que pueda servir como fundamento confiable para toda la producción. Una biblia débil produce problemas que se multiplican exponencialmente a medida que avanza la producción. Es mucho más barato corregir la biblia que corregir una serie en producción.

## Cuándo usar este workflow
- Cuando la biblia se considera "terminada" y lista para producción.
- Antes de presentar la biblia a inversores, productores o plataformas.
- Cuando se incorporan nuevos miembros al equipo que deben usar la biblia como referencia.
- Cuando hay inconsistencias en la producción que sugieren vacíos en la biblia.
- Como revisión periódica durante la preproducción para verificar que todo sigue vigente.

## Archivos de referencia
- \`Knowledge/REVIEW_SYSTEM.md\` — Todas las dimensiones como criterio de completitud
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Characters/arquetipos.md\`
- \`Knowledge/Characters/arcos.md\`
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Branding/identidad.md\`

## Pasos

### Paso 1: Verificar la completitud del documento
Revisar que la biblia contiene todas las secciones necesarias: premisa y logline, descripción del mundo, reglas del universo, fichas de personajes principales y secundarios, guía de relaciones, guía de tono y estilo, dirección de arte, estructura de la serie, sinopsis de temporada, sinopsis de episodios, audiencia objetivo y posicionamiento de marca. Marcar las secciones ausentes o incompletas.

### Paso 2: Evaluar la premisa y el concepto central
La premisa debe ser clara, original y con potencial para sostener múltiples temporadas. Verificar que responde a: de qué trata la serie (superficie), de qué trata realmente (tema profundo), por qué ahora (relevancia), y por qué animación (justificación del medio). Si alguna de estas preguntas no tiene respuesta convincente, la premisa necesita trabajo.

### Paso 3: Verificar la coherencia interna del mundo
Revisar todas las reglas del universo establecidas en la biblia. Verificar que no hay contradicciones entre secciones diferentes. Si el mundo tiene magia, tecnología especial o reglas físicas propias, estas deben estar claramente definidas con sus límites. Crear un documento de reglas y verificar que ningún elemento de la biblia las viola.

### Paso 4: Evaluar la profundidad de los personajes
Para cada personaje principal, verificar que la ficha incluye: apariencia y diseño, personalidad con contradicciones, backstory relevante, deseo externo y necesidad interna, arco de transformación planeado, voz propia, y relación con cada otro personaje principal. Cada ficha debe permitir que cualquier guionista escriba diálogos coherentes para ese personaje.

### Paso 5: Probar la solidez de las relaciones
Mapear todas las relaciones entre personajes y verificar que cada una tiene tensión dramática potencial, historial implícito y capacidad de evolución. Las relaciones deben generar conflicto o apoyo de forma dinámica, no estática. Identificar relaciones que no aportan nada dramáticamente y sugerir cómo potenciarlas o eliminarlas.

### Paso 6: Evaluar las reglas del mundo
Todo mundo narrativo tiene reglas, incluso los realistas. Verificar que las reglas son claras, consistentes y completas. Plantear escenarios hipotéticos: si un personaje hiciera X, qué pasaría según las reglas del mundo. Si la respuesta es ambigua o contradictoria, las reglas necesitan refinamiento. Las reglas bien definidas permiten consistencia; las ambiguas producen errores.

### Paso 7: Revisar la estructura de la serie
Verificar que la estructura de la serie está clara: formato de episodio (duración, estructura interna), número de episodios por temporada, arco de temporada planificado, y visión a largo plazo de la serie. Las sinopsis de episodios deben mostrar variedad y progresión, no repetición de fórmula.

### Paso 8: Evaluar el potencial de franquicia
Determinar si la biblia establece un universo lo suficientemente rico para expandirse. Verificar que hay más mundo del que se muestra en la primera temporada, que existen personajes secundarios con potencial para spin-offs, y que las reglas del universo permiten nuevas historias sin contradecir las existentes.

### Paso 9: Realizar lectura de estrés
Dar la biblia a alguien que no haya participado en su creación y pedirle que identifique confusiones, contradicciones, vacíos y suposiciones no explícitas. La biblia debe ser autocontenida: un lector inteligente que no conoce el proyecto debe poder entender completamente el mundo, los personajes y la historia solo con este documento.

### Paso 10: Compilar el informe de revisión de biblia
Documentar todos los hallazgos clasificados por nivel de gravedad: vacíos críticos (impiden la producción), inconsistencias importantes (generarán problemas), mejoras recomendadas (fortalecerían el documento) y sugerencias opcionales (refinamientos de detalle).

## Entregable
Informe de revisión de biblia con: checklist de completitud con estado de cada sección, análisis de coherencia interna con contradicciones identificadas, evaluación de profundidad de cada personaje principal, mapa de relaciones con evaluación de potencial dramático, lista de reglas del mundo con pruebas de consistencia, y plan de correcciones priorizado.

## Criterios de aprobación
- Todas las secciones esenciales están presentes y completas.
- No hay contradicciones internas entre secciones.
- Cada personaje principal tiene ficha completa con profundidad suficiente para escritura.
- Las reglas del mundo son claras, consistentes y completas.
- La estructura de la serie está definida con visión a largo plazo.
- El documento es autocontenido y comprensible para un lector externo.
- El universo tiene potencial de expansión demostrable.
- La lectura de estrés no revela vacíos críticos.

## Errores comunes en este proceso
- Asumir que lo que está en la cabeza del creador está en el documento: si no está escrito, no existe para el equipo.
- Revisar la biblia como documento literario en lugar de como herramienta de producción: debe ser clara y funcional, no necesariamente elegante.
- No probar con lectores externos: el equipo creativo tiene demasiado contexto implícito para detectar vacíos.
- Aprobar la biblia con secciones "por completar después": cada vacío se convierte en un problema durante la producción.
- Confundir extensión con profundidad: una biblia de 200 páginas puede ser más superficial que una de 50 bien enfocadas.
- No actualizar la biblia cuando se toman decisiones creativas durante la producción: la biblia debe ser un documento vivo.
`,
    knowledgeRefs: ['Knowledge/Branding/identidad.md', 'Knowledge/Characters/arcos.md', 'Knowledge/Characters/arquetipos.md', 'Knowledge/Visual/estilo.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/REVIEW_SYSTEM.md'],
  },
  {
    id: 'revision_episodio',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión de Episodio',
    description: 'Evaluación integral de un episodio terminado aplicando las 6 dimensiones del sistema de revisión.',
    content: `# Revisión de Episodio

> Evaluación integral de un episodio terminado aplicando las 6 dimensiones del sistema de revisión.

## Objetivo
Aplicar un análisis completo y sistemático a un episodio finalizado, evaluando simultáneamente las seis dimensiones del REVIEW_SYSTEM: narrativa, personajes, visual, animación, audio y marca. El objetivo no es revisar cada dimensión en profundidad (para eso existen los workflows individuales), sino obtener una visión holística de la calidad del episodio e identificar las áreas que requieren atención prioritaria.

## Cuándo usar este workflow
- Cuando un episodio está en fase de corte final o casi finalizado.
- Como evaluación de calidad antes de la entrega definitiva.
- Cuando se necesita una visión panorámica rápida del estado de un episodio.
- Para comparar la calidad entre episodios de una misma temporada.
- Como paso previo a derivar a workflows de revisión específicos por dimensión.

## Archivos de referencia
- \`Knowledge/REVIEW_SYSTEM.md\` — Las 6 dimensiones completas
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Characters/arcos.md\`
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Animation/acting.md\`
- \`Knowledge/Sound/mezcla.md\`
- \`Knowledge/Branding/identidad.md\`

## Pasos

### Paso 1: Visionado completo sin interrupciones
Ver el episodio de principio a fin como un espectador normal, sin pausas, sin tomar notas, sin analizar. Registrar la experiencia emocional global: funcionó como un todo, mantuvo la atención, produjo las emociones que debía producir. Esta primera impresión es el dato más valioso porque no se puede replicar.

### Paso 2: Segundo visionado analítico con notas por timecode
Ver el episodio por segunda vez con pausas frecuentes. En cada escena, anotar observaciones rápidas para cada dimensión. Usar un sistema de marcado eficiente: verde (funciona), amarillo (funciona con reservas), rojo (necesita trabajo). Incluir timecodes precisos para cada observación.

### Paso 3: Evaluar Dimensión 1 — Narrativa
Verificar que la estructura del episodio funciona: gancho inicial, desarrollo con escalamiento de conflicto, clímax satisfactorio, cierre que conecta con el arco general. Evaluar si el episodio avanza la trama general de la serie y si funciona como unidad independiente. Asignar puntuación según los criterios de la Dimensión 1 del REVIEW_SYSTEM.

### Paso 4: Evaluar Dimensión 2 — Personajes
Verificar que los personajes actúan de forma coherente con su psicología establecida, que sus decisiones tienen motivación clara, que hay desarrollo o revelación de carácter en el episodio. Evaluar la calidad de los diálogos y si cada personaje suena diferente. Asignar puntuación según la Dimensión 2.

### Paso 5: Evaluar Dimensión 3 — Visual
Verificar la coherencia del estilo visual, la efectividad de la composición, el uso narrativo del color y la iluminación, la calidad del diseño de escenarios. Identificar inconsistencias visuales entre escenas. Asignar puntuación según la Dimensión 3.

### Paso 6: Evaluar Dimensión 4 — Animación
Verificar la calidad de la actuación animada, el timing, el peso, las expresiones faciales, la sincronización con el audio. Identificar escenas donde la animación eleva la narrativa y escenas donde la debilita. Asignar puntuación según la Dimensión 4.

### Paso 7: Evaluar Dimensión 5 — Audio
Verificar la mezcla general, la efectividad de la música, la calidad del diseño de sonido, la naturalidad de las voces. Evaluar si el audio construye mundo y amplifica emoción. Asignar puntuación según la Dimensión 5.

### Paso 8: Evaluar Dimensión 6 — Marca
Verificar que el episodio es coherente con la identidad de marca de la serie, que refuerza el posicionamiento, que contiene elementos memorables que fortalecen la propiedad intelectual. Asignar puntuación según la Dimensión 6.

### Paso 9: Identificar las áreas más débiles
Comparar las puntuaciones de las seis dimensiones. Identificar las dos dimensiones con puntuación más baja: estas son las áreas de atención prioritaria. Para cada una, derivar al workflow de revisión específico correspondiente con las notas relevantes ya documentadas.

### Paso 10: Generar el informe de episodio
Compilar todas las evaluaciones en un informe unificado con la puntuación global del episodio, el desglose por dimensión, las tres fortalezas principales, las tres debilidades principales, y las acciones correctivas priorizadas con sus workflows de referencia.

## Entregable
Informe de revisión de episodio con: puntuación global y desglose por las 6 dimensiones de \`REVIEW_SYSTEM.md\`, resumen ejecutivo de la experiencia de visionado, notas específicas por timecode para cada dimensión, identificación de las áreas prioritarias de mejora, y plan de acción con derivación a workflows específicos.

## Criterios de aprobación
- Las seis dimensiones alcanzan el umbral mínimo definido en el REVIEW_SYSTEM.
- No hay ninguna dimensión en nivel rojo (crítico).
- El episodio funciona como unidad independiente y como parte de la serie.
- Los momentos emocionales clave producen el efecto deseado.
- No hay inconsistencias técnicas que rompan la inmersión.
- El informe incluye acciones correctivas concretas para cada debilidad.
- La puntuación global está dentro del rango aceptable para aprobación.

## Errores comunes en este proceso
- Dedicar demasiado tiempo a una dimensión y descuidar las otras: la revisión de episodio es panorámica, no profunda.
- Comparar con un ideal imposible en lugar de con el estándar establecido por la serie: cada serie tiene su propio techo.
- No hacer el primer visionado sin interrupciones: la experiencia de espectador es insustituible como dato.
- Mezclar las notas de diferentes dimensiones: mantener la organización por dimensión facilita la derivación a workflows específicos.
- Olvidar que el episodio existe en un contexto: su función dentro de la temporada importa tanto como su calidad individual.
- No priorizar: intentar corregir todo a la vez es inviable; enfocarse en lo que más impacta la experiencia del espectador.
`,
    knowledgeRefs: ['Knowledge/Branding/identidad.md', 'Knowledge/Animation/acting.md', 'Knowledge/Characters/arcos.md', 'Knowledge/Visual/estilo.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Sound/mezcla.md', 'Knowledge/REVIEW_SYSTEM.md'],
  },
  {
    id: 'revision_marca',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión de Marca',
    description: 'Evaluación del potencial comercial, la expandibilidad y la fuerza de la marca de la serie.',
    content: `# Revisión de Marca

> Evaluación del potencial comercial, la expandibilidad y la fuerza de la marca de la serie.

## Objetivo
Determinar si la serie tiene potencial comercial real, si su identidad de marca es lo suficientemente fuerte para sostenerse en el mercado, y si su universo es expandible a otros formatos, productos y experiencias. Una gran serie que no puede comunicarse como marca tiene techo comercial; una marca sin gran serie es hueca.

## Cuándo usar este workflow
- Cuando la serie está en fase de pitch o búsqueda de financiación.
- Antes de firmar acuerdos de licencia o merchandising.
- Cuando se evalúa el potencial de expansión a nuevos formatos o mercados.
- Cuando la identidad de marca parece débil o confusa en el mercado.
- En la planificación estratégica anual de la propiedad intelectual.

## Archivos de referencia
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Branding/posicionamiento.md\`
- \`Knowledge/Branding/expansion.md\`
- \`Knowledge/Branding/merchandising.md\`
- \`Knowledge/REVIEW_SYSTEM.md\` — Dimensión 6: Marca y potencial comercial

## Pasos

### Paso 1: Evaluar la claridad de la propuesta de valor
La serie debe poder explicarse en una frase que genere interés inmediato. Formular el logline comercial: no el artístico, sino el que responde a "por qué un comprador o plataforma debería invertir en esto". Si la propuesta de valor no es clara e inmediata, el posicionamiento de marca necesita trabajo.

### Paso 2: Analizar la identidad visual de marca
Consultar \`Knowledge/Branding/identidad.md\`. Revisar el logo, la tipografía, la paleta de marca, el estilo de las imágenes promocionales. Verificar que la identidad visual es reconocible, memorable, reproducible en diferentes tamaños y formatos, y coherente con el tono de la serie. Debe funcionar tanto en una pantalla de cine como en un icono de aplicación.

### Paso 3: Evaluar el posicionamiento en el mercado
Consultar \`Knowledge/Branding/posicionamiento.md\`. Identificar las series competidoras directas e indirectas. Definir en qué se diferencia esta serie de las demás en su segmento. El posicionamiento debe ser claro: qué territorio ocupa esta marca que ninguna otra ocupa. Si no hay diferenciación clara, el proyecto se pierde en el ruido del mercado.

### Paso 4: Verificar la coherencia de marca a través de todo el contenido
La marca debe ser coherente en todas sus manifestaciones: la serie misma, los materiales promocionales, las redes sociales, el merchandising, las presentaciones a inversores. Verificar que el tono de voz, el estilo visual y los valores de marca son consistentes en todos los puntos de contacto.

### Paso 5: Evaluar el potencial de merchandising
Consultar \`Knowledge/Branding/merchandising.md\`. Identificar qué elementos de la serie tienen potencial para productos: personajes con diseño icónico, objetos reconocibles, frases memorables, símbolos visuales fuertes. Evaluar si los diseños se traducen bien a productos físicos: juguetes, ropa, artículos escolares, accesorios.

### Paso 6: Analizar la expandibilidad del universo
Consultar \`Knowledge/Branding/expansion.md\`. Evaluar si el universo narrativo puede sostener más historias: spin-offs de personajes secundarios, precuelas, secuelas, historias paralelas, cambio de formato (juego, cómic, libro, experiencia interactiva). Un universo expandible multiplica el valor de la propiedad intelectual.

### Paso 7: Verificar la adaptabilidad cultural
Evaluar si la serie puede funcionar en mercados internacionales. Identificar elementos culturalmente específicos que puedan ser barreras o ventajas en otros mercados. Verificar que el humor, los valores y los conflictos tienen resonancia universal o adaptable. Una marca global necesita funcionar más allá de su mercado de origen.

### Paso 8: Evaluar el potencial de comunidad
Determinar si la serie tiene elementos que generan comunidad activa: teorías que discutir, contenido que crear, identidades que adoptar, experiencias que compartir. Las marcas más valiosas no solo tienen audiencia; tienen comunidad. Evaluar qué incentiva la participación activa del fan.

### Paso 9: Proyectar la longevidad de la marca
Evaluar si la marca puede mantenerse relevante en el tiempo. Las modas pasan; las marcas sólidas permanecen. Verificar que los valores de la marca son atemporales aunque su ejecución sea contemporánea. Proyectar cómo se verá la marca en 5 y 10 años.

### Paso 10: Compilar el informe de marca
Documentar todos los hallazgos con evaluaciones específicas para cada área. Incluir un mapa de oportunidades comerciales priorizadas, identificación de debilidades de marca que requieren atención, y un plan de acción para fortalecer el potencial comercial.

## Entregable
Informe de revisión de marca con evaluación según la Dimensión 6 de \`REVIEW_SYSTEM.md\`, análisis de identidad, posicionamiento y diferenciación, mapa de oportunidades de expansión y merchandising, evaluación de adaptabilidad cultural, y plan estratégico de marca con acciones priorizadas.

## Criterios de aprobación
- La propuesta de valor se articula en una frase clara y atractiva comercialmente.
- La identidad visual es reconocible, memorable y funcional en múltiples formatos.
- Existe diferenciación clara respecto a la competencia directa.
- La coherencia de marca se mantiene en todos los puntos de contacto.
- Hay al menos tres líneas viables de merchandising identificadas.
- El universo permite al menos dos expansiones narrativas significativas.
- La serie tiene potencial de adaptación a mercados internacionales.
- La puntuación en la Dimensión 6 del REVIEW_SYSTEM alcanza el umbral mínimo.

## Errores comunes en este proceso
- Evaluar la marca solo desde la perspectiva artística sin considerar la comercial, o viceversa: ambas deben estar alineadas.
- Sobreestimar el merchandising: no todo personaje bonito se traduce en productos exitosos.
- Ignorar la competencia: no conocer el mercado hace imposible el posicionamiento efectivo.
- Pensar en la expansión antes de tener una base sólida: la serie original debe funcionar primero.
- No considerar al fan como co-creador de la marca: la comunidad define tanto la marca como los creadores.
- Confundir reconocimiento con valor: una marca puede ser conocida sin ser querida o comercialmente viable.
`,
    knowledgeRefs: ['Knowledge/Branding/merchandising.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Branding/expansion.md', 'Knowledge/Branding/posicionamiento.md', 'Knowledge/REVIEW_SYSTEM.md'],
  },
  {
    id: 'revision_narrativa',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión Narrativa',
    description: 'Análisis profundo de la estructura, coherencia y poder emocional de la historia.',
    content: `# Revisión Narrativa

> Análisis profundo de la estructura, coherencia y poder emocional de la historia.

## Objetivo
Determinar si la historia funciona como un todo orgánico: si engancha, si sostiene la tensión, si el conflicto escala adecuadamente, si el desenlace satisface y si el viaje emocional del espectador está correctamente diseñado.

## Cuándo usar este workflow
- Cuando se tiene un guion completo (borrador o versión avanzada).
- Antes de pasar a producción visual o animación.
- Cuando algo "no funciona" en la historia pero no se identifica qué.
- Después de recibir feedback negativo sobre la narrativa.
- En cada ciclo de revisión previo a la aprobación final del guion.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/conflicto.md\`
- \`Knowledge/Storytelling/temas.md\`
- \`Knowledge/Storytelling/dialogos.md\`
- \`Knowledge/Storytelling/subtexto.md\`
- \`Knowledge/REVIEW_SYSTEM.md\` — Dimensión 1: Narrativa

## Pasos

### Paso 1: Lectura completa sin interrupciones
Leer el guion de principio a fin sin tomar notas. La primera impresión importa: registrar mentalmente dónde la atención decae, dónde surge emoción genuina y dónde hay confusión. Inmediatamente después, anotar en una lista las sensaciones generales: qué funcionó, qué no, qué se recuerda con claridad y qué se ha olvidado.

### Paso 2: Evaluar la premisa y el motor dramático
Identificar la premisa central en una sola frase. Si no se puede articular de forma clara, la historia tiene un problema de foco. Verificar que el motor dramático (lo que empuja la historia hacia adelante) está presente desde el primer acto y se mantiene activo hasta el clímax. Consultar \`Knowledge/Storytelling/estructura.md\` para validar la arquitectura.

### Paso 3: Analizar la estructura por actos
Dividir la historia en sus actos o bloques estructurales. Para cada bloque verificar: hay un evento detonante claro, cada escena tiene un objetivo narrativo definido, existe escalamiento progresivo de conflicto, los puntos de giro cambian la dirección de la historia de forma significativa. Marcar las escenas que no aportan al avance narrativo.

### Paso 4: Evaluar el conflicto central y los secundarios
Consultar \`Knowledge/Storytelling/conflicto.md\`. Verificar que el conflicto central es lo suficientemente poderoso para sostener toda la historia. Los conflictos secundarios deben complementar o reflejar temáticamente al principal, nunca distraer. Cada conflicto debe tener obstáculos crecientes y consecuencias reales.

### Paso 5: Revisar la coherencia temática
Consultar \`Knowledge/Storytelling/temas.md\`. Identificar el tema central y los subtemas. Verificar que cada escena, cada decisión de personaje y cada giro narrativo refuerza o problematiza el tema sin ser didáctico. El tema debe emerger de las acciones, no de los diálogos explicativos.

### Paso 6: Analizar el subtexto y las capas de lectura
Consultar \`Knowledge/Storytelling/subtexto.md\`. Verificar que la historia funciona en más de un nivel. Buscar escenas donde lo que se dice y lo que realmente sucede son diferentes. Si toda la información es explícita, la narrativa carece de profundidad.

### Paso 7: Evaluar la calidad de los diálogos narrativos
Consultar \`Knowledge/Storytelling/dialogos.md\`. Los diálogos deben avanzar la trama, revelar personaje o crear tensión. Idealmente las tres cosas a la vez. Marcar diálogos que solo transmiten información sin cumplir otra función dramática.

### Paso 8: Verificar el ritmo narrativo
Mapear el ritmo emocional de la historia: momentos de tensión, alivio, sorpresa, calma. Verificar que hay variación y que las escenas de alta intensidad están precedidas por preparación adecuada. Un ritmo plano indica problemas estructurales.

### Paso 9: Evaluar el desenlace
El final debe ser inevitable y sorprendente a la vez. Verificar que es coherente con todo lo establecido, que resuelve el conflicto central de forma satisfactoria y que el arco temático cierra. Un final que depende de coincidencias o intervenciones externas no funciona.

### Paso 10: Sintetizar hallazgos y priorizar
Compilar todas las observaciones en un documento estructurado. Clasificar los problemas encontrados en tres niveles: estructurales (requieren reescritura mayor), de desarrollo (requieren ajustes en escenas específicas) y de pulido (mejoras de diálogo o detalle).

## Entregable
Documento de revisión narrativa que incluya: evaluación general con puntuación según la Dimensión 1 de \`REVIEW_SYSTEM.md\`, lista priorizada de problemas encontrados con su nivel de gravedad, y recomendaciones específicas y accionables para cada problema identificado.

## Criterios de aprobación
- La premisa se articula en una frase clara y poderosa.
- El conflicto central sostiene la historia de principio a fin.
- Cada escena tiene función narrativa demostrable.
- Los puntos de giro cambian la dirección de forma significativa.
- El tema emerge de las acciones, no de los diálogos.
- El ritmo tiene variación adecuada entre tensión y alivio.
- El desenlace es coherente, satisfactorio y no depende de coincidencias.
- La puntuación en la Dimensión 1 del REVIEW_SYSTEM alcanza el umbral mínimo.

## Errores comunes en este proceso
- Confundir gusto personal con análisis técnico: la revisión debe basarse en principios narrativos, no en preferencias.
- Sugerir soluciones antes de diagnosticar el problema: primero entender qué falla y por qué.
- Ignorar el ritmo: enfocarse solo en la trama y olvidar que el cómo importa tanto como el qué.
- No releer después de las correcciones: cada cambio afecta al todo; verificar que la solución no genera nuevos problemas.
- Ser demasiado complaciente: si algo no funciona, hay que decirlo con claridad y proponer alternativas concretas.
`,
    knowledgeRefs: ['Knowledge/Storytelling/subtexto.md', 'Knowledge/REVIEW_SYSTEM.md', 'Knowledge/Storytelling/conflicto.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Storytelling/temas.md', 'Knowledge/Storytelling/dialogos.md'],
  },
  {
    id: 'revision_personajes',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión de Personajes',
    description: 'Evaluación integral de la memorabilidad, arco dramático y voz propia de cada personaje.',
    content: `# Revisión de Personajes

> Evaluación integral de la memorabilidad, arco dramático y voz propia de cada personaje.

## Objetivo
Verificar que cada personaje es memorable, tiene un arco de transformación claro, posee una voz propia distinguible y cumple una función dramática específica dentro de la historia. Un personaje que no cambia, no tiene deseos claros o suena igual que los demás debilita toda la narrativa.

## Cuándo usar este workflow
- Cuando se ha completado el diseño de personajes y sus fichas.
- Antes de aprobar la biblia de la serie.
- Cuando los diálogos suenan genéricos o intercambiables entre personajes.
- Cuando un personaje "no conecta" con la audiencia de prueba.
- En cada revisión mayor de guion donde los personajes son cuestionados.

## Archivos de referencia
- \`Knowledge/Characters/arquetipos.md\`
- \`Knowledge/Characters/arcos.md\`
- \`Knowledge/Characters/psicologia.md\`
- \`Knowledge/Characters/relaciones.md\`
- \`Knowledge/Characters/diseno_personajes.md\`
- \`Knowledge/REVIEW_SYSTEM.md\` — Dimensión 2: Personajes

## Pasos

### Paso 1: Inventario de personajes
Listar todos los personajes con su rol narrativo: protagonista, antagonista, mentor, aliado, catalizador, personaje espejo, comic relief, etc. Verificar que cada uno cumple una función dramática única. Si dos personajes cumplen la misma función, considerar si uno de ellos sobra o si deben fusionarse.

### Paso 2: Evaluar la memorabilidad individual
Para cada personaje principal, aplicar la prueba de memorabilidad: si se describe al personaje a alguien que no conoce la serie, esa persona debería poder distinguirlo de cualquier otro personaje similar en otras series. Identificar qué lo hace único: su contradicción interna, su forma de hablar, su defecto definitorio, su deseo más profundo.

### Paso 3: Verificar deseos y motivaciones
Consultar \`Knowledge/Characters/psicologia.md\`. Cada personaje principal debe tener un deseo externo (lo que quiere) y una necesidad interna (lo que realmente necesita). Estos dos deben estar en tensión. El deseo externo mueve la trama; la necesidad interna produce el arco de transformación. Verificar que ambos están claramente definidos.

### Paso 4: Analizar el arco de transformación
Consultar \`Knowledge/Characters/arcos.md\`. Para cada personaje principal, mapear su estado al inicio y al final de la historia. Identificar los momentos clave de cambio: el evento que desafía su visión del mundo, la resistencia al cambio, el punto de quiebre y la transformación final. Un personaje sin arco es un personaje plano.

### Paso 5: Evaluar la voz propia
Leer los diálogos de cada personaje de forma aislada, sin contexto de escena. Cada personaje debe ser reconocible solo por cómo habla: su vocabulario, su ritmo, sus muletillas, lo que evita decir, cómo expresa emociones. Tapar los nombres en los diálogos y verificar si se puede identificar quién habla.

### Paso 6: Analizar las dinámicas relacionales
Consultar \`Knowledge/Characters/relaciones.md\`. Mapear las relaciones entre todos los personajes principales. Cada relación debe tener una tensión propia, un historial implícito y capacidad de evolucionar. Las relaciones estáticas aburren. Verificar que las relaciones producen conflicto dramático y no solo convivencia.

### Paso 7: Verificar coherencia de comportamiento
Revisar que las decisiones de cada personaje son coherentes con su psicología establecida. Un personaje puede sorprender, pero nunca contradecirse sin justificación dramática. Marcar momentos donde un personaje actúa "fuera de carácter" solo para servir a la trama.

### Paso 8: Evaluar al antagonista
El antagonista merece revisión especial. Debe ser tan complejo como el protagonista, con motivaciones comprensibles aunque no compartibles. Un antagonista que es "malo porque sí" debilita toda la historia. Verificar que representa una amenaza real y que su conflicto con el protagonista es temáticamente significativo.

### Paso 9: Revisar personajes secundarios
Los secundarios deben tener al menos una dimensión clara que los haga memorables, aunque no tengan arco completo. Cada uno debe aportar algo que ningún otro aporta: información, tono, contraste, reflejo temático. Eliminar o rediseñar secundarios que solo ocupan espacio.

### Paso 10: Compilar informe de personajes
Crear un documento que evalúe cada personaje según los criterios de la Dimensión 2 del REVIEW_SYSTEM. Incluir puntuación individual, fortalezas, debilidades específicas y propuestas de mejora concretas para cada uno.

## Entregable
Informe de revisión de personajes con evaluación individual de cada personaje principal y secundario relevante, puntuación según la Dimensión 2 de \`REVIEW_SYSTEM.md\`, y plan de acción con correcciones priorizadas.

## Criterios de aprobación
- Cada personaje principal tiene deseo externo y necesidad interna definidos.
- Los arcos de transformación son claros y están anclados en momentos específicos.
- Los diálogos son distinguibles sin ver los nombres de los personajes.
- El antagonista tiene motivaciones complejas y comprensibles.
- Las relaciones entre personajes generan conflicto dramático activo.
- No hay personajes redundantes o sin función dramática clara.
- La puntuación en la Dimensión 2 del REVIEW_SYSTEM alcanza el umbral mínimo.

## Errores comunes en este proceso
- Evaluar personajes en aislamiento sin considerar cómo funcionan en conjunto: el elenco debe funcionar como sistema.
- Confundir backstory con profundidad: un pasado extenso no compensa la falta de conflicto interno presente.
- Ignorar a los secundarios: un secundario mal construido puede arruinar escenas enteras.
- Defender personajes por cariño del creador en lugar de por su función narrativa.
- No probar los diálogos en voz alta: lo que funciona en papel puede sonar falso al decirse.
- Crear personajes que son vehículos de mensaje en lugar de personas con contradicciones reales.
`,
    knowledgeRefs: ['Knowledge/Characters/arcos.md', 'Knowledge/Characters/arquetipos.md', 'Knowledge/Characters/diseno_personajes.md', 'Knowledge/Characters/psicologia.md', 'Knowledge/Characters/relaciones.md', 'Knowledge/REVIEW_SYSTEM.md'],
  },
  {
    id: 'revision_temporada',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión de Temporada',
    description: 'Evaluación del arco macro, la consistencia, la evolución y la satisfacción global de una temporada completa.',
    content: `# Revisión de Temporada

> Evaluación del arco macro, la consistencia, la evolución y la satisfacción global de una temporada completa.

## Objetivo
Evaluar la temporada como una obra completa: verificar que el arco narrativo general funciona, que los personajes evolucionan de forma consistente a lo largo de todos los episodios, que las apuestas dramáticas escalan progresivamente y que el finale produce una satisfacción proporcional a la inversión emocional del espectador. La temporada es más que la suma de sus episodios.

## Cuándo usar este workflow
- Cuando todos los episodios de una temporada están finalizados o en corte avanzado.
- Antes de la aprobación final de la temporada para entrega o emisión.
- Cuando se planifica la siguiente temporada y se necesita evaluar la anterior.
- Cuando hay preocupaciones sobre la coherencia general entre episodios.
- Como evaluación retrospectiva para aprendizaje del equipo.

## Archivos de referencia
- \`Knowledge/REVIEW_SYSTEM.md\` — Todas las dimensiones aplicadas a nivel macro
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/conflicto.md\`
- \`Knowledge/Characters/arcos.md\`
- \`Knowledge/Characters/relaciones.md\`

## Pasos

### Paso 1: Revisión de todos los arcos de episodio en conjunto
Crear un mapa visual que muestre el arco narrativo de cada episodio: su conflicto principal, su clímax y su resolución. Colocar todos los arcos en secuencia para visualizar el flujo de la temporada completa. Identificar patrones: hay variación suficiente entre episodios, hay una progresión clara, hay mesetas donde la tensión se estanca.

### Paso 2: Evaluar el arco de temporada
Identificar el arco narrativo macro que recorre toda la temporada. Este arco debe tener su propia estructura: planteamiento en los primeros episodios, complicación progresiva en los centrales, crisis en los penúltimos y resolución en el finale. Verificar que este arco es claro y que cada episodio contribuye a su avance, directa o indirectamente.

### Paso 3: Verificar la consistencia de la evolución de personajes
Para cada personaje principal, trazar su transformación episodio por episodio. Verificar que los cambios son graduales y creíbles, que no hay saltos injustificados en su desarrollo, que las lecciones aprendidas en un episodio se mantienen en los siguientes (salvo que haya razón dramática para la regresión). La evolución debe sentirse orgánica.

### Paso 4: Analizar la escalación de las apuestas dramáticas
Las apuestas deben subir a medida que avanza la temporada. Lo que está en juego en el episodio 10 debe ser significativamente mayor que en el episodio 1. Verificar que la escalación es progresiva y no artificial: cada aumento de las apuestas debe sentirse como consecuencia natural de las decisiones anteriores, no como una imposición del guion.

### Paso 5: Evaluar la consistencia temática
Verificar que el tema central de la temporada se explora desde diferentes ángulos a lo largo de los episodios. Cada episodio puede iluminar una faceta diferente del mismo tema. La temporada debe sentirse como una exploración completa de su pregunta central, no como una colección de ideas desconectadas.

### Paso 6: Revisar la distribución del ritmo
Analizar la distribución de episodios de alta tensión, episodios más reflexivos, episodios de desarrollo de personaje y episodios de acción. Verificar que hay variación rítmica a lo largo de la temporada y que la ubicación de cada tipo de episodio es estratégica. Dos episodios de alta tensión seguidos pueden fatigar; tres episodios lentos consecutivos pueden aburrir.

### Paso 7: Evaluar la satisfacción del finale
El finale de temporada debe cumplir varias funciones simultáneas: resolver el conflicto principal de la temporada, culminar los arcos de personaje principales, ofrecer una satisfacción emocional proporcional a lo invertido, y si hay temporada siguiente, dejar suficiente intriga sin sentirse incompleto. Evaluar si logra todo esto.

### Paso 8: Verificar la coherencia visual y de producción
Revisar que la calidad visual, la animación, el audio y el diseño de producción son consistentes a lo largo de toda la temporada. Identificar episodios que se sienten visualmente inferiores o superiores al promedio. La inconsistencia de producción rompe la inmersión y afecta la percepción de calidad de toda la temporada.

### Paso 9: Evaluar la experiencia de maratón vs. semanal
Considerar cómo se experimenta la temporada vista de corrido (binge) versus con espera entre episodios. Verificar que cada episodio tiene suficiente enganche individual para la emisión semanal y que la temporada completa fluye bien vista de corrido sin repeticiones innecesarias o recapitulaciones excesivas.

### Paso 10: Compilar el informe de temporada
Crear un documento exhaustivo que incluya: evaluación del arco macro con diagrama de progresión, análisis de evolución de cada personaje principal, evaluación de escalación dramática, consistencia temática, distribución de ritmo, evaluación del finale, y plan de aprendizajes para la siguiente temporada.

## Entregable
Informe de revisión de temporada con: diagrama de arcos narrativos por episodio, evaluación del arco macro de temporada, análisis de evolución de personajes con mapa de progresión, evaluación de la escalación de apuestas, análisis del finale, comparativa de calidad entre episodios, y documento de aprendizajes para producción futura.

## Criterios de aprobación
- El arco de temporada es claro, coherente y satisfactorio en su resolución.
- La evolución de personajes es gradual, creíble y consistente entre episodios.
- Las apuestas dramáticas escalan progresivamente de forma orgánica.
- El tema central se explora desde múltiples ángulos sin ser repetitivo.
- El ritmo tiene variación adecuada a lo largo de la temporada.
- El finale resuelve, culmina y satisface proporcionalmente.
- La calidad de producción es consistente entre todos los episodios.
- No hay episodios que funcionen como "relleno" sin contribución al arco general.

## Errores comunes en este proceso
- Evaluar episodios de forma aislada sin considerar su función en la temporada: un episodio "débil" puede ser necesario como preparación para lo que viene.
- Ignorar la fatiga del revisor: revisar una temporada completa es agotador; distribuir la revisión en varias sesiones con descanso adecuado.
- No documentar los aprendizajes: cada temporada debe informar las decisiones de la siguiente.
- Intentar corregir problemas de arco macro con parches en episodios individuales: los problemas estructurales de temporada requieren soluciones estructurales.
- Olvidar que el espectador no tiene la visión panorámica del creador: lo que parece obvio en un diagrama puede ser imperceptible en la experiencia de visionado.
- No considerar el contexto de emisión: una temporada diseñada para emisión semanal funciona diferente a una diseñada para binge.
`,
    knowledgeRefs: ['Knowledge/Characters/arcos.md', 'Knowledge/Storytelling/conflicto.md', 'Knowledge/Characters/relaciones.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/REVIEW_SYSTEM.md'],
  },
  {
    id: 'revision_visual',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Revisión Visual',
    description: 'Evaluación del diseño visual como herramienta narrativa: comunicación, identidad y coherencia estética.',
    content: `# Revisión Visual

> Evaluación del diseño visual como herramienta narrativa: comunicación, identidad y coherencia estética.

## Objetivo
Determinar si el diseño visual comunica eficazmente el tono, el mundo y las emociones de la historia. No se trata de si "se ve bonito", sino de si cada decisión visual tiene intención narrativa, si existe una identidad reconocible y si el lenguaje visual es coherente a lo largo de toda la producción.

## Cuándo usar este workflow
- Cuando se tienen los diseños de personajes, escenarios y props en fase avanzada.
- Antes de aprobar la dirección de arte para producción.
- Cuando hay inconsistencias visuales reportadas entre escenas o episodios.
- Cuando el estilo visual no parece alineado con el tono de la historia.
- En cada revisión visual mayor antes de la aprobación final.

## Archivos de referencia
- \`Knowledge/Visual/color.md\`
- \`Knowledge/Visual/composicion.md\`
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Visual/escenarios.md\`
- \`Knowledge/Visual/iluminacion.md\`
- \`Knowledge/REVIEW_SYSTEM.md\` — Dimensión 3: Visual

## Pasos

### Paso 1: Evaluación de primera impresión visual
Observar una selección representativa de las imágenes clave del proyecto sin contexto narrativo. Anotar las primeras impresiones: qué tono comunica, qué emociones evoca, a qué público parece dirigirse, qué referencias visuales sugiere. Si la primera impresión no coincide con la intención del proyecto, hay un desalineamiento fundamental.

### Paso 2: Analizar la paleta de color
Consultar \`Knowledge/Visual/color.md\`. Verificar que la paleta de color tiene una lógica narrativa: cada color dominante debe asociarse a una emoción, un personaje o un estado de la historia. Revisar que existe variación cromática entre actos o momentos emocionales diferentes. Una paleta monótona aplana la experiencia; una paleta caótica confunde.

### Paso 3: Evaluar la composición de encuadres clave
Consultar \`Knowledge/Visual/composicion.md\`. Seleccionar los encuadres más importantes de cada escena crucial y analizar su composición: dónde está el punto focal, cómo se guía la mirada del espectador, qué relaciones de poder o emoción comunica la disposición de los elementos. Cada composición debe tener intención.

### Paso 4: Verificar la identidad visual
La serie debe tener un estilo visual reconocible que la distinga de cualquier otra. Consultar \`Knowledge/Visual/estilo.md\`. Si se mostrara un fotograma sin contexto, un conocedor del medio debería poder asociarlo con esta serie. Evaluar qué elementos definen esa identidad: proporciones, texturas, tratamiento de línea, nivel de detalle, grado de estilización.

### Paso 5: Revisar el diseño de escenarios
Consultar \`Knowledge/Visual/escenarios.md\`. Los escenarios no son fondos pasivos: son extensiones del mundo narrativo. Verificar que cada locación comunica información sobre quién vive allí, qué ha pasado y qué puede pasar. Los escenarios deben tener personalidad propia y contribuir al storytelling visual.

### Paso 6: Analizar la iluminación como herramienta narrativa
Consultar \`Knowledge/Visual/iluminacion.md\`. La iluminación debe variar según el momento emocional de la historia. Verificar que existe un plan de iluminación coherente: luz cálida, fría, dura, suave, direccional, ambiental. Cada decisión de iluminación debe amplificar la emoción de la escena.

### Paso 7: Evaluar la coherencia visual entre escenas
Revisar una secuencia de escenas consecutivas y verificar que el estilo es consistente: proporciones de personajes, nivel de detalle, tratamiento de color, calidad de línea. Las inconsistencias rompen la inmersión. Esto es especialmente crítico cuando diferentes artistas trabajan en diferentes escenas.

### Paso 8: Verificar la legibilidad visual
En cada encuadre, la acción principal debe ser inmediatamente legible. El espectador no debe esforzarse para entender qué está pasando visualmente. Revisar escenas de acción, escenas con múltiples personajes y escenas con fondos complejos para verificar que la claridad visual se mantiene.

### Paso 9: Compilar el informe visual
Documentar todos los hallazgos con capturas de referencia. Clasificar los problemas en: problemas de identidad (afectan la serie completa), problemas de coherencia (afectan la continuidad entre escenas) y problemas de ejecución (afectan escenas específicas).

## Entregable
Informe de revisión visual con evaluación general según la Dimensión 3 de \`REVIEW_SYSTEM.md\`, análisis detallado de paleta, composición, identidad, escenarios e iluminación, y guía de correcciones con referencia visual para cada problema identificado.

## Criterios de aprobación
- La paleta de color tiene lógica narrativa documentada.
- Las composiciones clave guían la mirada con intención.
- El estilo visual es reconocible y distinguible.
- Los escenarios comunican información narrativa.
- La iluminación varía según el momento emocional.
- La coherencia se mantiene entre todas las escenas revisadas.
- Cada encuadre es legible en su acción principal.
- La puntuación en la Dimensión 3 del REVIEW_SYSTEM alcanza el umbral mínimo.

## Errores comunes en este proceso
- Evaluar la calidad técnica sin considerar la intención narrativa: un dibujo técnicamente perfecto puede ser narrativamente vacío.
- Ignorar cómo se verá en el formato final: revisar en monitor grande cuando la audiencia verá en pantalla pequeña, o viceversa.
- No considerar la animación futura: diseños que se ven geniales en estático pueden ser imposibles de animar bien.
- Revisar imágenes aisladas sin considerar la secuencia: el diseño visual debe funcionar en movimiento y en contexto.
- Confundir complejidad con calidad: a veces menos detalle comunica más eficazmente.
`,
    knowledgeRefs: ['Knowledge/Visual/escenarios.md', 'Knowledge/Visual/iluminacion.md', 'Knowledge/Visual/composicion.md', 'Knowledge/Visual/color.md', 'Knowledge/Visual/estilo.md', 'Knowledge/REVIEW_SYSTEM.md'],
  },
  {
    id: 'test_de_audiencia',
    phase: '05_Revision',
    phaseName: 'Revisión',
    phaseIcon: '🔍',
    phaseColor: '#4dd0e1',
    title: 'Test de Audiencia',
    description: 'Simulación de la experiencia del espectador objetivo para evaluar accesibilidad, enganche y conexión emocional.',
    content: `# Test de Audiencia

> Simulación de la experiencia del espectador objetivo para evaluar accesibilidad, enganche y conexión emocional.

## Objetivo
Ponerse en la piel del espectador objetivo y evaluar la pieza desde su perspectiva real. No desde el conocimiento interno del equipo creativo, sino desde la experiencia de alguien que ve el contenido por primera vez, sin contexto previo, con las distracciones normales de su entorno y con las expectativas propias de su perfil demográfico y psicográfico.

## Cuándo usar este workflow
- Cuando se tiene un episodio o pieza completa lista para evaluación.
- Antes de la aprobación final para distribución.
- Cuando el equipo tiene dudas sobre si el contenido conecta con la audiencia.
- Cuando hay desacuerdo interno sobre decisiones creativas que afectan al público.
- Como paso obligatorio antes de cada lanzamiento importante.

## Archivos de referencia
- \`Knowledge/REVIEW_SYSTEM.md\` — Dimensión 5: Engagement y conexión emocional
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/temas.md\`
- \`Knowledge/Characters/psicologia.md\`

## Pasos

### Paso 1: Definir el perfil del espectador objetivo
Crear una ficha detallada del espectador al que va dirigido el contenido. Incluir: rango de edad, contexto cultural, nivel de familiaridad con el género, qué otras series o películas consume, en qué plataforma verá el contenido, en qué contexto (solo, en familia, en transporte), cuáles son sus expectativas y cuáles son sus posibles resistencias.

### Paso 2: Crear las condiciones de visionado realistas
Preparar el visionado simulando las condiciones reales del espectador objetivo. Si es un niño de 8 años que ve en tablet con su hermano al lado, simular esa experiencia. Si es un adolescente que ve en móvil con auriculares en el transporte público, ajustar las condiciones. El contenido debe funcionar en su contexto real de consumo, no solo en una sala de proyección óptima.

### Paso 3: Ver como espectador, no como creador
Realizar el visionado completo adoptando la mentalidad del espectador objetivo. Olvidar todo el conocimiento interno: las decisiones creativas, los compromisos técnicos, las referencias intencionales. Preguntar honestamente: si no supiera nada de esta serie, si fuera la primera vez, si no tuviera obligación profesional de verla, seguiría mirando.

### Paso 4: Evaluar la accesibilidad del contenido
Verificar que el contenido es comprensible sin información previa. El espectador nuevo debe poder entender quiénes son los personajes, qué quieren, cuál es el conflicto y por qué importa, todo dentro de los primeros minutos. Marcar cada momento donde se requiere conocimiento previo no proporcionado o donde la confusión es accidental en lugar de intencional.

### Paso 5: Mapear los ganchos de enganche
Identificar los momentos diseñados para mantener la atención del espectador. Verificar que hay un gancho en los primeros 30 segundos, que cada escena tiene una pregunta abierta que impulsa a seguir viendo, que los finales de acto o episodio crean necesidad de continuar. Anotar los puntos donde la atención puede dispersarse y evaluar si el contenido recupera al espectador.

### Paso 6: Evaluar la conexión emocional
Para cada momento emocional clave de la pieza, evaluar honestamente: el espectador objetivo sentiría algo aquí. Las emociones deben ser ganadas, no impuestas. Verificar que los momentos de humor funcionan para la edad objetivo, que los momentos de tensión generan ansiedad real, que los momentos emotivos tienen suficiente preparación para impactar.

### Paso 7: Verificar la representación y relevancia
Evaluar si el espectador objetivo se ve reflejado o representado en el contenido. No necesariamente en apariencia, sino en experiencias, emociones y dilemas. El contenido debe sentirse relevante para la vida del espectador, no como algo ajeno o distante. Verificar que los temas resuenan con las preocupaciones reales de la audiencia objetivo.

### Paso 8: Realizar la prueba de conversación
Después del visionado, simular la conversación que el espectador tendría con un amigo sobre lo que acaba de ver. Qué contaría primero, qué momentos mencionaría, qué personaje le gustó más, qué pregunta le quedó abierta. Si la simulación produce una conversación entusiasta, el contenido conecta. Si produce un "estuvo bien" genérico, hay un problema.

### Paso 9: Evaluar la repetibilidad
Determinar si el espectador objetivo querría volver a ver el contenido. El contenido que se revé tiene capas de detalle, momentos favoritos que se quieren repetir, chistes o referencias que se aprecian más la segunda vez. La repetibilidad es un indicador fuerte de conexión profunda.

### Paso 10: Compilar el informe de audiencia
Documentar los hallazgos desde la perspectiva del espectador, no del creador. Incluir: perfil del espectador utilizado, evaluación de accesibilidad, mapa de enganche con puntos fuertes y débiles, análisis de conexión emocional, y recomendaciones para mejorar la experiencia del espectador.

## Entregable
Informe de test de audiencia que incluya: ficha del espectador objetivo utilizado, evaluación de accesibilidad y comprensión, mapa de ganchos de enganche con timecodes, análisis de conexión emocional por escena, prueba de conversación simulada, y recomendaciones priorizadas desde la perspectiva del espectador.

## Criterios de aprobación
- El contenido es comprensible sin conocimiento previo externo.
- Hay ganchos de enganche efectivos en los primeros 30 segundos.
- Los momentos emocionales producen respuesta genuina en el perfil objetivo.
- El espectador objetivo querría seguir viendo después del episodio.
- La prueba de conversación produce entusiasmo, no indiferencia.
- Los temas son relevantes para la vida real de la audiencia objetivo.
- No hay puntos de abandono involuntario en la pieza.

## Errores comunes en este proceso
- No poder separarse del rol de creador: el conocimiento interno sesga toda la evaluación.
- Definir un perfil de audiencia demasiado vago: "niños de 6 a 12" es un rango demasiado amplio; un niño de 6 y uno de 12 son espectadores completamente diferentes.
- Hacer el test en condiciones ideales en lugar de realistas: el contenido compite con distracciones reales.
- Confundir lo que el espectador "debería" sentir con lo que realmente sentiría.
- No hacer el test con perfiles diferentes: una serie puede tener audiencia primaria y secundaria, y ambas importan.
- Usar el test de audiencia para validar decisiones ya tomadas en lugar de para descubrir problemas reales.
`,
    knowledgeRefs: ['Knowledge/Storytelling/temas.md', 'Knowledge/Characters/psicologia.md', 'Knowledge/REVIEW_SYSTEM.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'arte_promocional',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Arte Promocional',
    description: 'Creación de pósters, banners y key art que comuniquen la esencia de la serie en una sola imagen.',
    content: `# Arte Promocional

> Creación de pósters, banners y key art que comuniquen la esencia de la serie en una sola imagen.

## Objetivo
Diseñar las piezas de arte promocional que representen visualmente la serie en todos sus puntos de contacto: pósters, banners, key art para plataformas, miniaturas, displays y materiales impresos. Cada pieza debe funcionar como una ventana a la serie que capte la atención, comunique el tono y genere deseo de verla.

## Cuándo usar este workflow
- Cuando se necesita el arte principal para la campaña de lanzamiento.
- Para crear materiales para plataformas de distribución que requieren key art.
- Cuando se preparan materiales para festivales, mercados o presentaciones.
- Para actualizar el arte promocional en nuevas temporadas o relanzamientos.
- Cuando se necesitan adaptaciones de formato para diferentes plataformas o eventos.

## Archivos de referencia
- \`Knowledge/Visual/color.md\`
- \`Knowledge/Visual/composicion.md\`
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Visual/iluminacion.md\`
- \`Knowledge/Branding/identidad.md\`

## Pasos

### Paso 1: Identificar la composición heroica
Definir cuál es la imagen central que mejor representa la serie. No es necesariamente una escena de la serie; es una composición creada específicamente para comunicar su esencia. Considerar: el protagonista en una pose que define su carácter, el elenco en una disposición que muestra sus relaciones, un momento icónico que captura el tono, o una vista del mundo que invita a explorarlo.

### Paso 2: Seleccionar los personajes y sus poses
Elegir qué personajes aparecen en el key art principal y en qué poses. Las poses deben comunicar personalidad: un personaje valiente no posa igual que uno tímido. La disposición de los personajes en el encuadre comunica jerarquía y relaciones. El protagonista debe tener la posición dominante sin anular al resto del elenco.

### Paso 3: Aplicar la paleta de color de la serie
Consultar \`Knowledge/Visual/color.md\`. La paleta del arte promocional debe ser coherente con la paleta de la serie pero puede intensificar ciertos colores para mayor impacto visual. El color dominante del póster debe comunicar la emoción principal de la serie. Los contrastes de color deben guiar la atención hacia el punto focal.

### Paso 4: Diseñar la jerarquía de información visual
Definir el orden de lectura visual del arte: qué ve el espectador primero (imagen central), qué ve después (título), y qué ve al final (información secundaria como créditos, fecha de estreno, plataforma). Cada nivel de información debe ser legible sin competir con los otros. La composición debe funcionar como una cascada visual.

### Paso 5: Integrar tipografía y título
El tratamiento tipográfico del título debe ser coherente con la identidad de marca y funcionar como elemento visual, no solo como texto. Definir tamaño, posición, color, efectos y relación con la imagen. El título debe ser legible instantáneamente pero también estéticamente integrado en la composición global.

### Paso 6: Diseñar para múltiples formatos
Crear el arte maestro en la resolución más alta necesaria y diseñar adaptaciones para cada formato requerido: póster vertical (cine y redes), banner horizontal (plataformas), miniatura cuadrada (apps y redes), formato vertical largo (banners web), y versiones con y sin texto. Cada formato debe funcionar como pieza independiente, no como un recorte del original.

### Paso 7: Probar el impacto a tamaños pequeños
Verificar que el arte funciona cuando se reduce a tamaños mínimos: miniatura de plataforma de streaming, icono de app, avatar de redes sociales. A tamaño pequeño, los detalles se pierden; lo que debe sobrevivir es la silueta, el color dominante y la legibilidad del título. Si a tamaño miniatura no se entiende qué se está viendo, el diseño necesita simplificación.

### Paso 8: Verificar la coherencia con la identidad de marca
Consultar \`Knowledge/Branding/identidad.md\`. El arte promocional debe ser inmediatamente reconocible como parte de la marca de la serie. Verificar que los colores, la tipografía, el estilo de ilustración y el tono visual son coherentes con todos los demás materiales de marca. El arte promocional no es una pieza aislada; es parte de un sistema visual.

### Paso 9: Crear variaciones temáticas
Si la serie tiene múltiples temas o momentos clave, crear variaciones del arte que enfaticen diferentes aspectos: una versión que enfatice la aventura, otra que enfatice las relaciones entre personajes, otra que muestre el mundo. Estas variaciones permiten adaptar la comunicación a diferentes audiencias y contextos.

### Paso 10: Preparar archivos finales para producción
Exportar todos los archivos en los formatos y resoluciones necesarios para cada uso: CMYK para impresión, RGB para digital, con y sin sangrado para impresión, con y sin transparencia para composición. Nombrar cada archivo con convención clara que indique formato, tamaño y versión. Entregar los archivos editables junto con los exportados.

## Entregable
Paquete de arte promocional con: key art principal en formato maestro de alta resolución, adaptaciones para todos los formatos requeridos (póster, banner, miniatura, avatar), variaciones temáticas, versiones con y sin texto, archivos editables, y guía de uso con especificaciones técnicas por formato.

## Criterios de aprobación
- La composición heroica comunica el tono y la esencia de la serie al primer vistazo.
- Los personajes están en poses expresivas que comunican su personalidad.
- La paleta de color es coherente con la serie y tiene impacto visual suficiente.
- El título es legible en todos los formatos, incluidos los más pequeños.
- El arte funciona como pieza independiente en cada formato requerido.
- El impacto visual se mantiene al reducir a tamaño miniatura.
- La coherencia con la identidad de marca es completa.
- Los archivos están en los formatos y resoluciones correctos para cada uso.

## Errores comunes en este proceso
- Diseñar solo para un formato y luego recortar para los demás: cada formato requiere composición propia.
- Saturar de información: un póster con demasiados personajes, demasiado texto o demasiados elementos pierde impacto.
- Ignorar el contexto de visualización: un póster de cine compite con otros pósters; una miniatura de streaming compite con cientos de opciones.
- No probar en tamaño real: lo que funciona en pantalla de diseño puede no funcionar impreso en gran formato o reducido a miniatura.
- Usar tipografías genéricas: el tratamiento del título es parte de la identidad de marca.
- Olvidar las versiones sin texto: las plataformas y los medios frecuentemente necesitan versiones limpias del arte.
`,
    knowledgeRefs: ['Knowledge/Visual/iluminacion.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Visual/composicion.md', 'Knowledge/Visual/color.md', 'Knowledge/Visual/estilo.md'],
  },
  {
    id: 'behind_the_scenes',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Behind the Scenes — Contenido sobre el Proceso Creativo',
    description: '',
    content: `# Behind the Scenes — Contenido sobre el Proceso Creativo

**Objetivo:** Crear material que muestre el trabajo del estudio de manera auténtica, refuerce el vínculo entre el equipo creativo y la audiencia, y aporte valor sin revelar spoilers.

**Cuándo usar:** Durante la producción activa de cualquier temporada y en las semanas de campaña de lanzamiento; este tipo de contenido puede producirse de forma continua como registro de proceso.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — Identidad del estudio y valores que deben proyectarse hacia afuera
- \`Productions/Serie_01/Bible/\` — Límite de qué información del mundo puede revelarse sin spoilear la trama
- \`Productions/Serie_01/Memory/Style/master_style.md\` — El estilo visual del BTS debe resonar con el estilo de la serie (no tiene que ser idéntico, pero sí coherente)

---

## Pasos

1. **Definir el tipo y formato del contenido**
   - Clasificar el BTS según su naturaleza: documental de proceso (cómo se hace X), retrato de equipo (quién hace qué), timelapse de creación, comparativa animatic-resultado final, o ensayo de doblaje.
   - Decidir el formato de distribución: video corto para redes (15-60 segundos), video largo para YouTube o plataforma propia (3-10 minutos), galería de imágenes, hilo de texto con ilustraciones.
   - Confirmar en qué momento del calendario de lanzamiento se publicará este contenido y ajustar el nivel de revelación de información según la semana.
   - Establecer si el contenido requiere locución, texto en pantalla, subtítulos o si las imágenes hablan por sí mismas.

2. **Documentar el proceso en tiempo real**
   - Registrar el material en bruto durante la producción: capturas de pantalla del proceso de animación, fotos del board de diseño, video del equipo trabajando, bocetos en distintas etapas.
   - Capturar las comparativas más interesantes: boceto vs. diseño final, storyboard vs. frame renderizado, primera versión de animación vs. versión pulida.
   - Registrar con permiso explícito a los miembros del equipo que aparezcan en el material; no publicar sin aprobación individual.
   - Guardar todo el material bruto en una carpeta de archivo aunque no se vaya a usar de inmediato; puede ser útil para contenido futuro.

3. **Seleccionar y estructurar el contenido**
   - Elegir el material que cuente una historia clara con inicio, desarrollo y cierre (incluso en 30 segundos, debe haber una progresión).
   - Priorizar el proceso sobre el resultado: mostrar cómo algo difícil se resolvió es más interesante que mostrar el resultado perfecto sin contexto.
   - Verificar que el material seleccionado no revele información de trama (personajes nuevos no anunciados, locaciones del arco final, giros de guion).
   - Si el contenido incluye animación o arte no publicado, confirmar con el director qué puede mostrarse en cada etapa de la campaña.

4. **Producir el material final**
   - Editar el video o preparar las imágenes con el estilo visual del estudio (tipografía consistente con los títulos de la serie, paleta de color afín al universo).
   - Añadir música de fondo si el formato lo requiere; usar tracks originales o con licencia del catálogo del estudio; nunca música popular sin licencia.
   - Incluir créditos del equipo que aparece o contribuye al contenido; el BTS es también una herramienta de reconocimiento interno.
   - Asegurarse de que el formato de exportación sea el correcto para cada plataforma (vertical para Instagram Stories y TikTok, horizontal para YouTube, cuadrado para feed de Instagram).

5. **Revisar antes de publicar**
   - Ver el contenido final con los ojos de alguien externo al estudio: ¿es comprensible sin conocer el proceso interno? ¿resulta interesante para alguien que aún no vio la serie?
   - Verificar que no haya información sensible visible en segundo plano (guiones sobre mesas, documentos de producción en pantallas, calendarios con fechas de entrega).
   - Confirmar con el director y el equipo de comunicación que el contenido es aprobado para publicación antes de programarlo.
   - Revisar que los textos, subtítulos y menciones del equipo estén correctamente escritos (nombres mal escritos son el error más frecuente y visible en este tipo de contenido).

6. **Publicar y gestionar la respuesta**
   - Programar la publicación en el horario de mayor actividad de la audiencia objetivo.
   - Incluir en el post o descripción una pregunta o dato que invite a la interacción (no basta con publicar; hay que dar un punto de entrada a la conversación).
   - Monitorear los comentarios durante las primeras 2 horas y responder a preguntas genuinas sobre el proceso; evitar responder comentarios de spoiler o preguntas de trama.
   - Guardar las métricas de engagement de cada pieza de BTS para aprender qué tipo de contenido de proceso conecta más con la audiencia de la serie.

---

**Entregable:** Piezas de contenido behind-the-scenes listas para publicar, en el formato correcto para cada plataforma, sin spoilers y con la identidad visual del estudio.

**Criterios de aprobación:**
- El contenido cuenta una historia clara de proceso con principio y fin, incluso en formato corto.
- No revela información de trama, personajes no anunciados ni locaciones del arco no publicado.
- El equipo que aparece ha dado su consentimiento explícito para la publicación.
- El formato de exportación es el correcto para cada plataforma de destino.
- El director y el equipo de comunicación han aprobado el contenido antes de su publicación.

**Errores comunes:**
- **Mostrar el resultado final en lugar del proceso** — Un BTS que solo muestra frames terminados o renders perfectos no aporta más que lo que ya verá el espectador en la serie; el valor está en las capas de trabajo y las decisiones intermedias.
- **No verificar el fondo de las imágenes y videos** — Documentos de producción, hojas de presupuesto, calendarios internos o guiones sin aprobar visibles en segundo plano son una filtración involuntaria de información sensible.
- **Publicar sin el consentimiento del equipo** — Un miembro del equipo que aparece en un video sin saberlo puede causar un conflicto interno serio; el consentimiento no es opcional.
- **Tratar el BTS como relleno de calendario** — El contenido de proceso publicado sin editar ni narrativizar parece descuidado y puede dar una imagen de desorganización; siempre debe haber una mínima intención editorial antes de publicar.
`,
    knowledgeRefs: [],
  },
  {
    id: 'crear_teaser',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Crear Teaser',
    description: 'Generar expectación con información mínima: máximo misterio, máxima intriga.',
    content: `# Crear Teaser

> Generar expectación con información mínima: máximo misterio, máxima intriga.

## Objetivo
Crear una pieza breve (15-45 segundos) que anuncie la existencia de la serie, establezca su tono y mundo, y deje a la audiencia con una curiosidad intensa sin revelar prácticamente nada de la trama. El teaser es un susurro que dice "algo viene" y hace que la gente quiera saber qué.

## Cuándo usar este workflow
- Antes de tener suficiente material para un tráiler completo.
- Como primera pieza de la campaña de marketing, meses antes del lanzamiento.
- Para anuncios en redes sociales, eventos o convenciones.
- Cuando se quiere generar conversación y especulación antes de revelar más.
- Para acompañar anuncios de fechas de estreno o confirmaciones de temporada.

## Archivos de referencia
- \`Knowledge/Cinematography/edicion.md\`
- \`Knowledge/Cinematography/ritmo.md\`
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Sound/diseno_sonoro.md\`
- \`Knowledge/Visual/composicion.md\`
- \`Knowledge/Branding/identidad.md\`

## Pasos

### Paso 1: Identificar la imagen o momento icónico
El teaser se construye alrededor de un elemento central que capture la esencia de la serie en su forma más concentrada. Puede ser una imagen (la silueta del protagonista contra el horizonte de su mundo), un sonido (una voz, un efecto que define el universo), un objeto (un elemento simbólico central), o un momento (una acción que define el tono). Elegir uno solo. La restricción es la fuerza del teaser.

### Paso 2: Definir qué misterio crear
Decidir exactamente qué pregunta debe quedarse en la mente del espectador después de ver el teaser. No es "qué es esta serie" sino algo más específico y evocador: "quién es esta persona", "qué pasó en ese lugar", "por qué está corriendo". La pregunta no se formula explícitamente; se planta a través de la imagen y el sonido.

### Paso 3: Establecer el tono sin explicarlo
El teaser debe comunicar si la serie es oscura o luminosa, divertida o seria, íntima o épica, realista o fantástica. No con palabras ni con narración, sino con la paleta de color, la iluminación, la música, el ritmo del montaje y el diseño de sonido. En 30 segundos, el espectador debe sentir el tono aunque no pueda articularlo.

### Paso 4: Insinuar el mundo sin mostrarlo completo
Revelar apenas lo suficiente del mundo para intrigar. Un detalle arquitectónico que sugiere una civilización, un paisaje que no es del todo reconocible, una tecnología o magia apenas visible en el fondo. Lo que se muestra parcialmente fascina más que lo que se muestra completo. El espectador debe querer ver más de ese mundo.

### Paso 5: Diseñar el sonido como protagonista
En un teaser, el audio puede ser más importante que la imagen. Diseñar un paisaje sonoro que envuelva al espectador: puede ser un silencio que se rompe, una melodía que se construye, un efecto de sonido que se repite como latido. El sonido del teaser puede convertirse en la firma sonora de toda la campaña.

### Paso 6: Construir la estructura de revelación
El teaser tiene una estructura simple pero precisa: oscuridad o calma inicial, revelación gradual que construye tensión o curiosidad, momento de impacto o revelación parcial, y cierre con título o logo. Cada segundo cuenta. No hay espacio para material que no aporte a la progresión.

### Paso 7: Cerrar con la identidad de marca
El logo o título de la serie debe aparecer como el momento de revelación final. Si se ha construido bien la intriga, el título se convierte en la respuesta que el espectador estaba esperando, aunque no sea realmente una respuesta sino una promesa. El tratamiento visual del título debe ser coherente con la identidad de marca.

### Paso 8: Dejar al espectador queriendo más
El último frame antes del título o después de él debe ser intencionalmente incompleto. Un gesto que no se termina, una puerta que se abre sin mostrar qué hay detrás, una voz que dice una frase que no se completa. La incompletitud es la herramienta más poderosa del teaser.

### Paso 9: Optimizar para el formato de consumo
El teaser se verá probablemente en redes sociales, en pantallas pequeñas, posiblemente sin sonido inicial. Verificar que funciona visualmente incluso en silencio (con subtítulos si hay texto hablado), que la imagen es legible en formatos pequeños, y que los primeros 3 segundos capturan la atención en un scroll infinito.

### Paso 10: Planificar el lanzamiento del teaser
Definir dónde, cuándo y cómo se lanzará el teaser. Considerar si se acompaña de un hashtag, si se lanza en un evento específico, si se envía a medios especializados antes del lanzamiento público. El contexto de lanzamiento del teaser puede amplificar o reducir su impacto.

## Entregable
Teaser de 15-45 segundos en formatos horizontal y vertical, archivos de proyecto editables, guía de lanzamiento con plataformas y calendario, y elementos gráficos de apoyo (thumbnail, GIF de momentos clave, imágenes fijas para acompañar el lanzamiento).

## Criterios de aprobación
- La pieza dura menos de 45 segundos y no se siente ni corta ni larga.
- Comunica el tono de la serie sin explicarlo verbalmente.
- Deja al espectador con curiosidad activa, no con confusión pasiva.
- No revela trama, personajes en detalle ni giros argumentales.
- Funciona con y sin sonido en formatos de redes sociales.
- La identidad de marca es clara y memorable en el cierre.
- El teaser genera deseo de buscar más información sobre la serie.

## Errores comunes en este proceso
- Convertir el teaser en un mini-tráiler: el teaser sugiere, no muestra.
- Incluir demasiada información: menos es más; la restricción genera intriga.
- Ignorar el formato de consumo real: diseñar para cine cuando se verá en Instagram es un error de contexto.
- No tener un elemento central claro: la ambigüedad puede ser intrigante, pero la vaguedad aburre.
- Olvidar el sonido: en un teaser, el diseño sonoro puede ser el 70% de la experiencia.
- Lanzar el teaser sin estrategia: un gran teaser lanzado en el momento equivocado pierde su impacto.
`,
    knowledgeRefs: ['Knowledge/Cinematography/edicion.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Visual/composicion.md', 'Knowledge/Cinematography/ritmo.md', 'Knowledge/Sound/musica.md', 'Knowledge/Sound/diseno_sonoro.md'],
  },
  {
    id: 'crear_trailer',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Crear Tráiler',
    description: 'Vender la serie en 60-90 segundos sin spoilear, generando deseo irresistible de verla.',
    content: `# Crear Tráiler

> Vender la serie en 60-90 segundos sin spoilear, generando deseo irresistible de verla.

## Objetivo
Crear un tráiler que comunique la esencia de la serie, genere emoción y curiosidad, muestre el mejor material disponible y deje al espectador con necesidad urgente de ver más. El tráiler no es un resumen; es una pieza de seducción audiovisual con su propia estructura narrativa.

## Cuándo usar este workflow
- Cuando se tiene suficiente material visual y de audio para seleccionar los mejores momentos.
- Para la campaña de lanzamiento principal de la serie.
- Para presentaciones a plataformas, distribuidores o inversores.
- Cuando se necesita un nuevo tráiler para relanzamiento o nueva temporada.
- Para festivales y mercados de contenido audiovisual.

## Archivos de referencia
- \`Knowledge/Cinematography/edicion.md\`
- \`Knowledge/Cinematography/ritmo.md\`
- \`Knowledge/Sound/musica.md\`
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Branding/identidad.md\`

## Pasos

### Paso 1: Identificar el gancho principal
Antes de seleccionar material, definir cuál es el gancho del tráiler: la razón por la que alguien querría ver esta serie. Puede ser el mundo (un lugar nunca antes visto), el conflicto (una situación fascinante), el personaje (alguien con quien se quiere pasar tiempo), la emoción (algo que se quiere sentir) o el misterio (algo que se quiere descubrir). Todo el tráiler debe construir hacia ese gancho.

### Paso 2: Seleccionar los momentos clave
Revisar todo el material disponible y seleccionar los momentos visualmente más impactantes, las líneas de diálogo más poderosas, las expresiones más emotivas y las acciones más espectaculares. Crear un banco de clips candidatos sin preocuparse aún por el orden. Buscar variedad: momentos de acción, emoción, humor, belleza y misterio.

### Paso 3: Definir la estructura del tráiler
Consultar \`Knowledge/Cinematography/edicion.md\`. Un tráiler efectivo tiene tres actos: establecimiento (presentar el mundo y el personaje en los primeros 15-20 segundos), desarrollo (revelar el conflicto y escalar la tensión en los siguientes 30-40 segundos) y clímax (montaje de momentos impactantes con cortes rápidos en los últimos 20-30 segundos, cerrando con un momento de impacto y el título).

### Paso 4: Construir la escalación emocional
Consultar \`Knowledge/Cinematography/ritmo.md\`. El tráiler debe ir de menos a más en intensidad. Comenzar con planos más largos y respirados, ir acortando la duración de los cortes progresivamente, aumentar la energía del montaje hasta un pico emocional. La última imagen antes del título debe ser la más poderosa o la más intrigante.

### Paso 5: Elegir la música
Consultar \`Knowledge/Sound/musica.md\`. La música es el esqueleto emocional del tráiler. Debe tener una progresión que apoye la escalación: un inicio evocador, un build-up que acompañe al desarrollo y un drop o clímax que coincida con el momento de mayor impacto visual. La música debe capturar el tono de la serie sin necesariamente usar la banda sonora original.

### Paso 6: Verificar que no hay spoilers
Revisar cada clip seleccionado y preguntarse: esto revela algo que el espectador debería descubrir por sí mismo al ver la serie. Los giros argumentales, las muertes de personajes, las revelaciones sorpresa y las resoluciones de conflicto están prohibidos. El tráiler debe prometer experiencias, no revelarlas. Mostrar el qué sin revelar el cómo ni el por qué.

### Paso 7: Redactar líneas de texto o narración
Si el tráiler incluye títulos en pantalla o narración, estos deben ser concisos, evocadores y nunca explicativos. Evitar frases genéricas como "un mundo en peligro" o "una aventura épica". Cada palabra debe aportar. Preferir líneas de diálogo de los personajes que capturen su esencia sobre narración impuesta.

### Paso 8: Cerrar con intriga
El final del tráiler es tan importante como el inicio. Debe dejar al espectador con una pregunta, una emoción o un deseo. Después del título, un stinger final (un último momento breve, sorprendente o divertido) puede ser extremadamente efectivo para la memorabilidad.

### Paso 9: Probar con audiencia fresca
Mostrar el tráiler a personas que no conocen la serie. Medir: entendieron de qué se trata, les generó curiosidad, querrían ver la serie, qué recordaron con más claridad, qué les confundió. Ajustar según el feedback priorizando la claridad y el deseo de ver más.

### Paso 10: Ajustar para múltiples formatos
Crear versiones adaptadas a diferentes plataformas: versión completa para YouTube y cine (60-90 segundos), versión corta para redes sociales (15-30 segundos), versión vertical para stories e historias. Cada versión debe funcionar como pieza independiente, no como un recorte de la original.

## Entregable
Tráiler principal en formato completo (60-90 segundos) con versiones adaptadas para redes sociales, archivos de proyecto editables, lista de clips utilizados con timecodes de origen, y documento con la estrategia de distribución del tráiler.

## Criterios de aprobación
- El gancho es claro e irresistible en los primeros 5 segundos.
- La escalación emocional funciona de menos a más sin mesetas.
- No hay spoilers de giros, revelaciones o resoluciones.
- La música amplifica la emoción sin competir con los diálogos.
- El espectador de prueba quiere ver la serie después de ver el tráiler.
- El título y la identidad de marca son claros y memorables.
- Funciona en todas las versiones de formato requeridas.

## Errores comunes en este proceso
- Incluir demasiada trama: el tráiler no es un resumen, es una promesa emocional.
- Usar la cronología de la serie: el tráiler tiene su propia narrativa; mezclar el orden es no solo aceptable, sino recomendable.
- Empezar lento: los primeros 3 segundos determinan si el espectador sigue viendo o pasa al siguiente contenido.
- Elegir música genérica: la música equivocada puede hacer que una gran serie parezca mediocre.
- No probar con audiencia externa: el equipo creativo no puede evaluar objetivamente lo que comunica el tráiler.
- Enamorarse de un clip específico que no funciona en el contexto del tráiler: cada clip debe servir al todo.
`,
    knowledgeRefs: ['Knowledge/Branding/identidad.md', 'Knowledge/Cinematography/edicion.md', 'Knowledge/Cinematography/ritmo.md', 'Knowledge/Sound/musica.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'planificar_estreno',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Planificar Estreno — Calendario y Estrategia de Lanzamiento de Temporada',
    description: '',
    content: `# Planificar Estreno — Calendario y Estrategia de Lanzamiento de Temporada

**Objetivo:** Diseñar y ejecutar un calendario de lanzamiento que maximice el impacto del estreno de temporada y sostenga la audiencia a lo largo de todos los episodios.

**Cuándo usar:** Al menos 12 semanas antes de la fecha de estreno planificada, una vez que el primer episodio esté en picture lock y la mayoría de los episodios de la temporada estén en postproducción avanzada.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — Identidad de la serie y valores que deben reflejarse en la comunicación externa
- \`Productions/Serie_01/Bible/\` — Arco narrativo de la temporada (para saber qué revelar y cuándo sin spoilear)
- \`Workflows/06_Lanzamiento/crear_trailer.md\` — Proceso de producción del trailer
- \`Workflows/06_Lanzamiento/arte_promocional.md\` — Proceso de creación de materiales visuales
- \`Workflows/06_Lanzamiento/sinopsis.md\` — Proceso de escritura de sinopsis oficiales

---

## Pasos

1. **Definir la estrategia de lanzamiento**
   - Confirmar con los distribuidores o plataformas el modelo de publicación: estreno de todos los episodios a la vez (binge), publicación semanal, o estreno escalonado con estreno doble.
   - Identificar la fecha exacta de estreno del primer episodio y trabajar hacia atrás para fijar todas las fechas del calendario.
   - Definir el territorio de lanzamiento (local, regional, global) y si hay estrenos escalonados por mercado.
   - Establecer si hay una proyección de prensa o avant-premiere y en qué fecha debe estar lista la versión de screening (con o sin créditos finales, con o sin subtítulos).

2. **Construir el calendario de campaña**
   - Semana 12 antes del estreno: anuncio oficial de la temporada (fecha + arte clave). Sin revelar trama.
   - Semana 10: publicación del teaser (30-60 segundos). Tono y atmósfera, sin spoilers de trama.
   - Semana 8: lanzamiento del trailer principal (90-120 segundos). Presenta conflicto central sin revelar el desenlace.
   - Semana 6: inicio de publicaciones de personajes en redes (un personaje por semana hasta el estreno).
   - Semana 4: campaña de conteo regresivo, activaciones en comunidades de fans, entrevistas con el equipo creativo.
   - Semana 2: embargo de críticas (si aplica) y acceso anticipado a prensa especializada.
   - Semana 1: recordatorios intensivos, publicación de clips breves (máx. 90 segundos del primer episodio sin spoilers).
   - Día del estreno: publicación coordinada en todos los canales de manera simultánea.

3. **Definir los materiales necesarios y asignar responsables**
   - Listar todos los entregables de campaña: arte clave, teaser, trailer, posters de personaje, clips de redes, sinopsis corta y larga, press kit, behind-the-scenes.
   - Asignar a cada entregable un responsable, una fecha de entrega interna (con margen de revisión) y una fecha de publicación.
   - Verificar que ningún material revele más información de trama de la que corresponde a su semana en el calendario.
   - Confirmar qué materiales necesitan aprobación externa (distribuidores, co-productores, licenciatarios) y añadir ese tiempo al calendario.

4. **Planificar la estrategia de episodios semana a semana (si es lanzamiento semanal)**
   - Definir qué información se puede revelar de cada episodio antes de su publicación: sinopsis, imagen promocional, clip corto.
   - Establecer el embargo de cada episodio: no publicar materiales del episodio N hasta que el episodio N-1 haya sido publicado.
   - Planificar al menos una acción de engagement por semana de publicación: pregunta a la audiencia, arte de un personaje, trivia del mundo de la serie.
   - Preparar los materiales de los primeros tres episodios antes del estreno para no depender de producción en caliente durante la campaña.

5. **Coordinar con plataformas y distribuidores**
   - Entregar todos los assets de plataforma (thumbnails, metadatos, sinopsis) con al menos 3 semanas de antelación al estreno.
   - Confirmar las fechas de disponibilidad de los episodios en el sistema de la plataforma y hacer una verificación técnica 48 horas antes del estreno.
   - Establecer un protocolo de comunicación de emergencia para el día del estreno (contacto directo con el equipo técnico de la plataforma).
   - Verificar que los territorios de disponibilidad estén correctamente configurados en el sistema de la plataforma.

6. **Preparar el plan de respuesta post-estreno**
   - Definir qué métricas se van a monitorear en las primeras 72 horas: visualizaciones, retención por episodio, comentarios, menciones en redes.
   - Establecer un protocolo de respuesta a reseñas y cobertura de prensa (quién responde, en qué tono, qué no se comenta).
   - Planificar un contenido de "celebración" para las 24-48 horas post-estreno si la recepción es positiva (agradecimiento del equipo, arte extra, dato de making-of).
   - Tener preparado un plan de contingencia si el estreno técnico falla (mensaje oficial, comunicación a distribuidores, tiempo máximo de resolución).

---

**Entregable:** Calendario de lanzamiento semana a semana con todos los entregables de campaña asignados a responsables y fechas, coordinado con distribuidores y plataformas.

**Criterios de aprobación:**
- El calendario cubre las 12 semanas previas al estreno con al menos una acción semanal definida.
- Todos los materiales de campaña tienen responsable, fecha de entrega interna y fecha de publicación asignados.
- Ningún material de campaña revela más información de la planificada para su semana correspondiente.
- Los assets de plataforma están entregados con al menos 3 semanas de antelación.
- Existe un plan de contingencia para fallo técnico el día del estreno.

**Errores comunes:**
- **Planificar el calendario sin confirmar primero las fechas con los distribuidores** — La plataforma puede tener restricciones de calendario que invaliden la estrategia antes de empezar.
- **Revelar demasiado en el trailer principal** — Mostrar los mejores momentos del episodio 8 en el trailer de estreno reduce la motivación para llegar a ese episodio; el trailer debe generar preguntas, no responderlas.
- **No tener los primeros materiales listos con suficiente antelación** — Depender de producción en curso para alimentar la campaña hace que cualquier retraso en postproducción se convierta también en un retraso de marketing.
- **Ignorar el plan post-estreno** — La primera semana tras el estreno es tan importante como el día del estreno para consolidar la audiencia; no planificarla es desperdiciar el momentum generado.
`,
    knowledgeRefs: [],
  },
  {
    id: 'press_kit',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Press Kit',
    description: 'Kit completo para periodistas y medios que facilite la cobertura informada y entusiasta de la serie.',
    content: `# Press Kit

> Kit completo para periodistas y medios que facilite la cobertura informada y entusiasta de la serie.

## Objetivo
Crear un paquete de materiales profesional y completo que permita a periodistas, bloggers, influencers y medios especializados escribir sobre la serie con información precisa, imágenes de calidad y ángulos de historia interesantes. Un buen press kit no solo informa; guía la narrativa mediática hacia los puntos fuertes del proyecto.

## Cuándo usar este workflow
- Semanas antes de cualquier lanzamiento público o anuncio importante.
- Antes de enviar la serie a festivales o mercados.
- Cuando se agenda entrevistas o eventos de prensa.
- Para acompañar screeners enviados a prensa especializada.
- Cuando se actualiza la información de la serie para una nueva temporada.

## Archivos de referencia
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Branding/posicionamiento.md\`
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Characters/diseno_personajes.md\`

## Pasos

### Paso 1: Redactar la descripción oficial de la serie
Escribir tres versiones de la descripción: una versión corta de una línea (logline para titulares), una versión media de un párrafo (para cuerpo de notas de prensa) y una versión extendida de 300-500 palabras (para artículos de fondo). Las tres deben ser atractivas, precisas y escritas con calidad periodística. Evitar lenguaje promocional excesivo; priorizar el interés genuino.

### Paso 2: Crear biografías de personajes para prensa
Redactar descripciones de los personajes principales pensadas para un público que no conoce la serie. No son fichas técnicas de producción; son presentaciones que generan interés. Incluir lo suficiente para intrigar sin spoilear. Cada biografía debe dar una razón para querer conocer a ese personaje.

### Paso 3: Preparar arte en alta resolución
Seleccionar y preparar imágenes en alta resolución listas para publicación: key art principal (cartel oficial), retratos individuales de personajes, escenas clave sin spoilers, arte conceptual seleccionado, capturas de pantalla representativas. Todas las imágenes deben estar en resolución de impresión (300 dpi mínimo) y resolución web, con y sin logos superpuestos.

### Paso 4: Redactar la declaración del creador
Escribir un texto en primera persona del creador o director que explique la génesis del proyecto, la motivación personal y la visión artística. Este texto debe ser auténtico y dar a los periodistas una historia humana detrás de la serie. Los medios buscan ángulos personales; este texto les facilita encontrarlos.

### Paso 5: Incluir la ficha técnica
Documentar toda la información técnica relevante: título oficial, género, duración de episodios, número de episodios por temporada, formato de producción (2D, 3D, stop-motion, etc.), estudio de producción, equipo creativo principal con cargos, fecha de estreno, plataforma de distribución, clasificación por edades, países de coproducción si aplica.

### Paso 6: Preparar datos de contexto y ángulos de historia
Incluir información que facilite artículos más profundos: datos sobre el proceso de creación, curiosidades de producción, conexiones temáticas con temas de actualidad, datos sobre el equipo creativo, premios o reconocimientos obtenidos, impacto social o educativo si es relevante. Cada dato es un potencial ángulo de artículo.

### Paso 7: Organizar el kit para distribución digital
Estructurar todo el material en una carpeta digital organizada con nomenclatura clara: carpeta de imágenes, carpeta de textos, carpeta de videos (teaser, tráiler, behind the scenes), carpeta de logos y assets de marca. Incluir un documento índice que liste todo el contenido con descripciones. El periodista debe encontrar lo que necesita en menos de 30 segundos.

### Paso 8: Incluir información de contacto y disponibilidad
Proporcionar datos de contacto claros del equipo de prensa: nombre del responsable, email, teléfono, disponibilidad horaria, disponibilidad de los creadores para entrevistas, formatos aceptados de entrevista (presencial, videollamada, escrita). Facilitar el acceso genera más cobertura.

### Paso 9: Revisar y validar todo el contenido
Verificar que toda la información es precisa y actualizada, que no hay errores ortográficos o de datos, que las imágenes están correctamente nombradas y en la resolución correcta, que los textos son coherentes entre sí y con la identidad de marca. Un press kit con errores daña la credibilidad del proyecto.

### Paso 10: Planificar la distribución del press kit
Definir la lista de medios destinatarios, personalizar la comunicación de envío para cada tipo de medio (generalista, especializado en animación, especializado en entretenimiento infantil, etc.), establecer embargo si aplica, y programar seguimiento posterior al envío.

## Entregable
Press kit digital completo que incluya: tres versiones de la descripción de la serie, biografías de personajes, galería de imágenes en alta resolución, declaración del creador, ficha técnica, documento de ángulos de historia, todos organizados en carpeta estructurada con índice, más plan de distribución a medios.

## Criterios de aprobación
- Las tres versiones de descripción son precisas, atractivas y libres de spoilers.
- Las imágenes están en resolución profesional y correctamente nombradas.
- La ficha técnica está completa y actualizada.
- La declaración del creador es auténtica y proporciona ángulos de historia.
- La estructura de carpetas es intuitiva y de acceso rápido.
- Todo el contenido es coherente con la identidad de marca.
- La información de contacto está actualizada y verificada.

## Errores comunes en este proceso
- Enviar imágenes en baja resolución: los medios necesitan calidad de publicación.
- Escribir descripciones en lenguaje de marketing en lugar de lenguaje periodístico: los medios quieren información, no publicidad.
- Olvidar incluir logos y assets de marca: los medios los necesitan para ilustrar sus artículos.
- No personalizar el envío: un email genérico a toda la lista es menos efectivo que comunicaciones adaptadas.
- No actualizar el press kit: información desactualizada genera errores en la cobertura.
- Incluir spoilers en las descripciones: la prensa publicará lo que se le entregue.
`,
    knowledgeRefs: ['Knowledge/Characters/diseno_personajes.md', 'Knowledge/Visual/estilo.md', 'Knowledge/Branding/posicionamiento.md', 'Knowledge/Branding/identidad.md'],
  },
  {
    id: 'redes_sociales',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Redes Sociales',
    description: 'Plan de contenido para construir comunidad, generar conversación y mantener la relevancia de la serie.',
    content: `# Redes Sociales

> Plan de contenido para construir comunidad, generar conversación y mantener la relevancia de la serie.

## Objetivo
Diseñar una estrategia de redes sociales que construya una comunidad activa alrededor de la serie, genere conversación orgánica, mantenga la relevancia entre temporadas y convierta a espectadores casuales en fans comprometidos. Las redes no son un canal de anuncios; son un espacio de relación con la audiencia.

## Cuándo usar este workflow
- Cuando se establece la presencia en redes sociales de la serie por primera vez.
- Cuando se planifica la campaña de lanzamiento en redes.
- Para cada ciclo de planificación de contenido (mensual o trimestral).
- Cuando se necesita reactivar la comunidad entre temporadas.
- Cuando la estrategia actual no genera el engagement esperado.

## Archivos de referencia
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Branding/posicionamiento.md\`
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Characters/diseno_personajes.md\`

## Pasos

### Paso 1: Definir la voz y el tono para redes sociales
La cuenta de la serie debe tener una personalidad definida que sea coherente con el tono de la serie pero adaptada al lenguaje de cada plataforma. Definir: el tono general (divertido, misterioso, cálido, irreverente), el vocabulario que se usa y el que se evita, cómo se responde a comentarios positivos y negativos, y si la cuenta habla como narrador omnisciente, como un personaje o como el equipo creativo.

### Paso 2: Seleccionar plataformas y adaptar la estrategia
No todas las plataformas son iguales ni sirven al mismo público. Para cada plataforma relevante (Instagram, TikTok, YouTube, X, Facebook, etc.), definir: qué audiencia se encuentra allí, qué formato de contenido funciona mejor, con qué frecuencia publicar, y cuál es el objetivo principal en esa plataforma (alcance, comunidad, conversión, etc.).

### Paso 3: Planificar el calendario de contenido
Crear un calendario editorial que cubra al menos un mes por adelantado. Incluir: fechas de publicación, tipo de contenido, plataforma, copy sugerido, asset visual requerido, y objetivo de cada publicación. El calendario debe tener equilibrio entre contenido promocional (máximo 20%), contenido de valor (60%) y contenido de comunidad (20%).

### Paso 4: Crear assets visuales compartibles
Diseñar contenido visual nativo para redes que la audiencia quiera compartir: wallpapers con los personajes, GIFs animados de momentos icónicos, memes oficiales que permitan apropiación, infografías del mundo de la serie, comparativas de personajes, quizzes visuales de "qué personaje eres". Todo con la identidad visual de la serie.

### Paso 5: Diseñar estrategias de engagement
Planificar acciones que generen participación activa: preguntas que inviten a compartir opiniones, encuestas sobre personajes o momentos favoritos, retos creativos que inviten al fan art, dinámicas de anticipación antes de episodios nuevos, respuestas creativas a comentarios de la comunidad. El objetivo es convertir espectadores pasivos en participantes activos.

### Paso 6: Planificar la cadencia de revelación
Si la serie aún no se ha estrenado, diseñar un plan de revelación progresiva: qué se muestra primero (teaser, arte conceptual, siluetas de personajes), qué se revela después (diseños, nombres, primeros clips), y qué se guarda para el final (tráiler, fecha de estreno). Cada revelación debe generar una ola de conversación y expectativa creciente.

### Paso 7: Establecer métricas y objetivos
Definir KPIs claros para cada plataforma y tipo de contenido: alcance, impresiones, engagement rate, crecimiento de seguidores, clics, shares, saves, comentarios. Establecer objetivos mensuales realistas y crear un sistema de seguimiento para evaluar qué funciona y qué no. Los datos guían las decisiones, no las intuiciones.

### Paso 8: Preparar protocolo de gestión de comunidad
Definir reglas claras para la gestión de la comunidad: tiempos de respuesta a comentarios, tono de las respuestas, protocolo para manejo de comentarios negativos o trolls, política de reposteo de contenido de fans (siempre con crédito), y criterios para moderar contenido inapropiado. La comunidad necesita gestión activa y respetuosa.

### Paso 9: Planificar contenido entre temporadas
El periodo entre temporadas es crítico para mantener la comunidad activa. Planificar contenido que mantenga el interés: behind the scenes del proceso creativo, celebraciones de aniversarios o hitos, interacción con fan art y fan theories, colaboraciones con otros creadores, y anticipación gradual de la nueva temporada.

### Paso 10: Revisar y optimizar continuamente
Cada semana, revisar las métricas del contenido publicado. Identificar qué tipos de publicación generan más engagement, en qué horarios hay más actividad, qué temas generan más conversación. Ajustar el calendario y la estrategia según los datos. La estrategia de redes es un documento vivo que evoluciona con la audiencia.

## Entregable
Documento de estrategia de redes sociales con: definición de voz y tono, estrategia por plataforma, calendario editorial del primer mes, banco de assets visuales compartibles, plan de engagement, cadencia de revelación, KPIs y objetivos, protocolo de comunidad, y plan de contenido entre temporadas.

## Criterios de aprobación
- La voz y el tono son coherentes con la identidad de la serie.
- El calendario tiene equilibrio entre contenido promocional, de valor y de comunidad.
- Los assets visuales son compartibles y respetan la identidad de marca.
- Hay estrategias de engagement que incentivan la participación activa.
- Los KPIs son medibles, específicos y realistas.
- El protocolo de comunidad cubre escenarios positivos y negativos.
- Existe un plan claro para el periodo entre temporadas.

## Errores comunes en este proceso
- Usar redes sociales solo como canal de anuncios: la audiencia huye del contenido puramente promocional.
- Copiar la misma publicación en todas las plataformas sin adaptar formato ni lenguaje.
- No responder a la comunidad: las redes son bidireccionales; ignorar a la audiencia la aleja.
- Publicar sin estrategia: el contenido improvisado es inconsistente y pierde oportunidades.
- Medir solo seguidores: el engagement y la calidad de la comunidad importan más que los números brutos.
- Abandonar las redes entre temporadas: reconstruir una comunidad es más difícil que mantenerla.
`,
    knowledgeRefs: ['Knowledge/Characters/diseno_personajes.md', 'Knowledge/Visual/estilo.md', 'Knowledge/Branding/posicionamiento.md', 'Knowledge/Branding/identidad.md'],
  },
  {
    id: 'sinopsis',
    phase: '06_Lanzamiento',
    phaseName: 'Lanzamiento',
    phaseIcon: '🚀',
    phaseColor: '#dce775',
    title: 'Sinopsis Oficiales — Descripciones que Enganchan sin Revelar Spoilers',
    description: '',
    content: `# Sinopsis Oficiales — Descripciones que Enganchan sin Revelar Spoilers

**Objetivo:** Escribir sinopsis de temporada y de episodio que generen interés en la audiencia potencial y sirvan como texto oficial en plataformas, prensa y materiales de campaña.

**Cuándo usar:** Al preparar los materiales de lanzamiento de cada temporada y episodio; las sinopsis de plataforma deben estar listas al menos 3 semanas antes del estreno.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — Tono, voz y valores de la serie; la sinopsis debe sonar como la serie
- \`Productions/Serie_01/Bible/\` — Premisa, personajes principales, arco narrativo; fuente de verdad sobre qué puede y qué no puede revelarse
- \`Workflows/06_Lanzamiento/planificar_estreno.md\` — Calendario de revelación de información por semana de campaña

---

## Pasos

1. **Identificar el nivel de sinopsis requerido**
   - Sinopsis de serie (el mundo y la premisa general): máximo 150 palabras; no revela el arco de ninguna temporada específica.
   - Sinopsis de temporada (el conflicto central de la temporada): entre 80 y 120 palabras; plantea la pregunta central sin responderla.
   - Sinopsis de episodio larga (para plataformas y press kit): entre 50 y 80 palabras; describe el conflicto del episodio sin revelar su resolución.
   - Sinopsis de episodio corta (para thumbnails, guías de TV, app de plataforma): entre 20 y 40 palabras; una o dos oraciones que enganchen.
   - Producir los cuatro niveles para cada temporada y los dos niveles de episodio para cada episodio.

2. **Definir qué puede revelarse y qué no**
   - Leer el guion del episodio o el arco de la temporada e identificar: la situación de partida (puede revelarse), el conflicto central (puede plantearse como pregunta), el desarrollo (revelar solo si no spoilea la resolución), y la resolución (no revelar nunca en sinopsis).
   - Marcar los elementos que son "gancho" (lo que atrae al espectador a ver) y los elementos que son "spoiler" (lo que le quita la razón para ver).
   - Una buena sinopsis revela el problema, no la solución.
   - En series con giros narrativos fuertes: ni siquiera insinuar la dirección del giro; describir solo el estado del mundo en el inicio del episodio.

3. **Escribir el borrador**
   - Comenzar con la sinopsis larga: es más fácil recortar que ampliar.
   - Estructura recomendada para sinopsis de episodio: [Situación de los personajes] + [El conflicto que surge] + [La pregunta que queda abierta]. Ejemplo: "Cuando X descubre Y, debe decidir entre Z y W. Pero el tiempo se acaba y alguien más ya sabe la verdad."
   - Usar el tiempo verbal presente: da inmediatez y dinamismo ("Mateo descubre" en lugar de "Mateo descubrirá").
   - Escribir desde la perspectiva del personaje principal del episodio, no desde una vista panorámica omnisciente; esto crea empatía antes de ver el episodio.
   - Evitar los adjetivos valorativos ("emocionante", "impactante", "increíble"): dejar que la situación hable por sí misma.

4. **Derivar las versiones más cortas**
   - Recortar la sinopsis larga eliminando el desarrollo intermedio; conservar la situación de partida y la pregunta abierta.
   - Para la sinopsis ultra-corta (20-40 palabras), identificar la imagen más potente o la pregunta más irresistible de la sinopsis larga y construir solo alrededor de eso.
   - Verificar que las versiones cortas funcionen de manera independiente: el espectador que lea solo la versión corta debe entender de qué va el episodio.

5. **Revisar con los criterios del espectador nuevo**
   - Leer la sinopsis como si no se supiera nada de la serie ni del episodio: ¿está claro de qué va? ¿genera curiosidad? ¿hay algo concreto que quiera saber después de leerla?
   - Pedir a alguien externo al equipo que lea la sinopsis y responda: ¿qué cree que va a pasar en el episodio? Si responde correctamente, la sinopsis spoilea demasiado.
   - Verificar que todos los nombres propios coincidan con el glosario canónico de la serie.
   - Confirmar con el director que la sinopsis es fiel al tono del episodio (una sinopsis de comedia para un episodio de drama destruye la expectativa del espectador).

6. **Adaptar el texto para cada canal**
   - Plataforma de streaming: respetar el límite de caracteres del sistema (suele ser 200-500 caracteres para la sinopsis corta).
   - Guías de TV y EPG: texto plano sin formato, máximo 2 líneas en pantalla.
   - Press kit: sinopsis larga completa con formato Markdown o Word, acompañada del título oficial y el número de episodio.
   - Redes sociales: adaptar la sinopsis como gancho conversacional (puede ser una pregunta retórica o una frase del personaje que actúa como cebo narrativo).
   - Asegurarse de que cada versión esté etiquetada con su canal de destino antes de enviarla al distribuidor.

---

**Entregable:** Sinopsis oficiales en todos los niveles requeridos (serie, temporada, episodio largo, episodio corto) para cada episodio de la temporada, aprobadas por el director y listas para distribución por canal.

**Criterios de aprobación:**
- Cada sinopsis plantea el conflicto central sin revelar su resolución.
- El tono del texto es coherente con el tono del episodio y la voz de la serie definida en la Constitución.
- Todos los nombres propios y términos de la serie coinciden con el glosario canónico.
- Las versiones cortas funcionan de manera independiente sin necesitar leer la versión larga para comprenderse.
- El director ha aprobado cada sinopsis antes de su distribución.

**Errores comunes:**
- **Escribir la sinopsis desde el punto de vista del narrador omnisciente** — El espectador no tiene acceso a esa perspectiva; una sinopsis que lo sabe todo destruye el placer del descubrimiento y suena a ficha de Wikipedia, no a invitación a ver.
- **Usar adjetivos valorativos en lugar de describir la situación** — "En un episodio lleno de sorpresas" no dice nada; "Cuando Mateo descubre que su padre lleva años mintiéndole" sí.
- **Escribir las versiones cortas recortando mecánicamente la larga** — La sinopsis corta tiene una lógica diferente; es un gancho, no un resumen; debe escribirse con esa intención desde el principio.
- **No actualizar la sinopsis si el episodio cambia en edición** — Una sinopsis escrita sobre un borrador de guion puede no corresponder al episodio final; siempre verificar contra el picture lock antes de distribuir.
`,
    knowledgeRefs: [],
  },
  {
    id: 'adaptar_medio',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Adaptar a Otro Medio',
    description: 'Transformar la serie en juego, cómic, libro o experiencia sin perder su alma.',
    content: `# Adaptar a Otro Medio

> Transformar la serie en juego, cómic, libro o experiencia sin perder su alma.

## Objetivo
Adaptar una propiedad de animación a un medio diferente aprovechando las fortalezas únicas de ese medio, manteniendo la identidad visual, tonal y temática de la serie original.

## Cuándo usar este workflow
- Cuando se quiere llevar la serie a videojuego, cómic, novela gráfica, libro o experiencia inmersiva.
- Cuando un socio externo propone una adaptación y hay que guiar el proceso.
- Cuando la estrategia de franquicia requiere presencia en múltiples medios.
- Cuando un medio específico puede contar algo que la serie animada no puede.

## Archivos de referencia
- \`Knowledge/Branding/franquicias.md\`
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Branding/merchandising.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Visual/paleta.md\`

## Pasos

### Paso 1: Identificar qué puede hacer el nuevo medio que la serie no
Cada medio tiene superpoderes únicos. Un videojuego permite agencia del jugador. Un cómic permite controlar el ritmo de lectura. Un libro permite acceso a pensamientos internos. Una experiencia inmersiva permite presencia física. Identifica al menos tres capacidades exclusivas del nuevo medio y documenta cómo pueden enriquecer la experiencia del universo. Si no encuentras capacidades únicas que aporten algo nuevo, cuestiona si la adaptación vale la pena.

### Paso 2: Definir qué historia contar en este medio
No adaptes la serie; crea para el medio. La peor adaptación es una transcripción literal. Decide si vas a contar una historia paralela, una precuela, una perspectiva diferente, o una experiencia completamente nueva dentro del universo. La historia elegida debe ser una que funcione mejor en el nuevo medio que en animación. Si funciona igual o peor, estás eligiendo mal.

### Paso 3: Adaptar la narrativa a las fortalezas del medio
Reescribe la experiencia narrativa usando las herramientas propias del medio. En un juego, la historia se cuenta a través de mecánicas y decisiones. En un cómic, a través de composición de página y ritmo visual. En un libro, a través de voz narrativa y descripción. No fuerces las convenciones de la animación en otro formato. Permite que el medio transforme la forma de contar.

### Paso 4: Mantener la consistencia visual y tonal
Consulta \`Knowledge/Branding/identidad.md\` y \`Knowledge/Visual/paleta.md\` para definir cómo se traduce la identidad visual al nuevo medio. Los colores, la tipografía, el estilo de personajes deben ser reconocibles aunque se adapten. El tono emocional debe ser coherente: si la serie es melancólica y esperanzadora, el juego también debe serlo. Crea una guía de adaptación visual que especifique qué elementos son intocables y cuáles son flexibles.

### Paso 5: Diseñar experiencias exclusivas del medio
Crea momentos que solo sean posibles en el nuevo medio. En un juego: una decisión moral que el jugador debe tomar personalmente. En un cómic: una doble página que revela algo impactante al abrir. En un libro: un capítulo desde la perspectiva del villano que la serie nunca mostraría. Estas experiencias exclusivas justifican la existencia de la adaptación y dan razones al fan para consumir ambos productos.

### Paso 6: Definir el nivel de canon
Decide si los eventos de la adaptación son canon dentro del universo de la serie o son una interpretación alternativa. Documenta esta decisión claramente. Si es canon, verifica que no contradiga la serie ni limite sus opciones futuras. Si no es canon, establece qué libertades creativas se permiten. Esta decisión afecta cómo la audiencia recibe el producto y cómo el equipo creativo trabaja.

### Paso 7: Proteger la propiedad intelectual
Define qué elementos del universo puede usar la adaptación y cuáles están reservados. Crea un documento de límites que proteja la integridad de la franquicia. Si trabajas con un socio externo, este documento es contractual. Si trabajas internamente, es una guía de respeto a la propiedad original. Incluye: personajes disponibles, eventos referenciables, tono permitido, y líneas que no deben cruzarse.

### Paso 8: Validar con la audiencia objetivo del medio
La audiencia de un juego no es idéntica a la de una serie animada, aunque se solape. Identifica quién consumirá este producto específicamente y qué espera del medio. Un jugador espera agencia; un lector espera profundidad. Verifica que la adaptación satisface tanto a fans existentes como a nuevos consumidores que llegan desde el medio, no desde la serie.

## Entregable
Documento de adaptación que incluya: análisis de capacidades del medio, historia elegida con justificación, guía de adaptación visual, lista de experiencias exclusivas del medio, decisión de canon documentada, documento de límites de propiedad intelectual, y perfil de audiencia del medio específico.

## Criterios de aprobación
- [ ] Se identificaron capacidades únicas del medio que aportan algo nuevo al universo.
- [ ] La historia elegida funciona mejor en el nuevo medio que en animación.
- [ ] La identidad visual es reconocible pero adaptada al medio.
- [ ] Hay al menos tres experiencias exclusivas que justifican la adaptación.
- [ ] El nivel de canon está definido y documentado.
- [ ] El documento de límites protege la integridad de la franquicia.
- [ ] La audiencia del medio específico está contemplada.

## Errores comunes en este proceso
- Hacer una transcripción literal de la serie en vez de una adaptación al medio.
- Ignorar las fortalezas del nuevo medio y forzar las convenciones de la animación.
- No definir el nivel de canon, creando confusión en la audiencia y el equipo.
- Permitir que la adaptación contradiga eventos importantes de la serie.
- Diseñar solo para fans existentes sin considerar a la audiencia nativa del medio.
- Sacrificar calidad narrativa por fidelidad visual excesiva al original.
- No crear experiencias exclusivas del medio, haciendo la adaptación redundante.
`,
    knowledgeRefs: ['Knowledge/Visual/paleta.md', 'Knowledge/Branding/merchandising.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Branding/franquicias.md', 'Knowledge/Storytelling/tono.md'],
  },
  {
    id: 'biblia_de_franquicia',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Biblia de Franquicia',
    description: 'El documento que gobierna todo el universo expandido y garantiza coherencia entre propiedades.',
    content: `# Biblia de Franquicia

> El documento que gobierna todo el universo expandido y garantiza coherencia entre propiedades.

## Objetivo
Crear un documento maestro que establezca las reglas, límites y directrices para todo producto, serie derivada o adaptación dentro del universo expandido, asegurando coherencia sin sofocar la creatividad individual de cada propiedad.

## Cuándo usar este workflow
- Cuando el universo tiene más de una propiedad activa (serie principal más spinoff, juego, cómic, etc.).
- Cuando se planifica la expansión a múltiples medios o formatos.
- Cuando hay riesgo de inconsistencias entre diferentes equipos trabajando en el mismo universo.
- Cuando se necesita un documento de referencia para socios externos que trabajan con la propiedad.

## Archivos de referencia
- \`Knowledge/Branding/franquicias.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/historia.md\`
- \`Knowledge/Worldbuilding/geografia.md\`
- \`Knowledge/Worldbuilding/cultura.md\`
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Storytelling/tono.md\`

## Pasos

### Paso 1: Establecer las reglas canónicas del universo
Documenta todas las leyes inmutables del universo: cómo funciona la magia o la tecnología, qué es posible y qué no, cuáles son los límites del mundo. Estas reglas aplican a toda propiedad dentro de la franquicia sin excepción. Si un juego necesita romper una regla del universo para funcionar como juego, la regla necesita revisarse, no ignorarse. Las reglas canónicas son la columna vertebral de la coherencia.

### Paso 2: Definir qué es sagrado y qué es flexible
No todo en el universo tiene el mismo nivel de protección. Clasifica los elementos en tres niveles. Sagrado: no se puede modificar bajo ninguna circunstancia (reglas fundamentales, características definitorias de personajes principales, eventos clave de la línea temporal). Dirigido: se puede adaptar pero dentro de límites claros (tono, estilo visual, estructura narrativa). Flexible: se puede reinventar libremente según el medio y la propiedad (personajes secundarios, ubicaciones menores, detalles culturales de fondo).

### Paso 3: Crear la línea temporal maestra
Construye una cronología que abarca todas las propiedades del universo. Incluye eventos pasados (lore), presentes (series activas) y futuros planificados. Marca claramente qué eventos son canon confirmado y cuáles son proyecciones sujetas a cambio. La línea temporal debe ser consultable por cualquier equipo para verificar que su historia no contradice eventos de otras propiedades.

### Paso 4: Establecer directrices de consistencia
Escribe reglas claras para mantener coherencia entre propiedades: cómo se representan personajes compartidos, cómo se referencian eventos de otras propiedades, qué nivel de conocimiento del universo puede asumir cada producto. Incluye ejemplos concretos de lo que está bien y lo que está mal. Las directrices deben ser específicas y prácticas, no declaraciones vagas de intención.

### Paso 5: Planificar conexiones entre propiedades
Diseña los puntos de contacto entre las diferentes propiedades del universo. ¿Un personaje del cómic puede aparecer en la serie? ¿Un evento del juego afecta el mundo de la película? Define cómo se manejan estas intersecciones: quién tiene autoridad para aprobarlas, qué nivel de coordinación se requiere, y cómo se comunican los cambios entre equipos. Las conexiones deben enriquecer, no complicar.

### Paso 6: Documentar la jerarquía de canon
Establece qué propiedades tienen mayor autoridad canónica cuando hay conflicto. Típicamente la serie principal tiene precedencia, pero esto debe documentarse explícitamente. Define: si el juego dice una cosa y la serie otra, ¿cuál prevalece? Si un cómic revela información que la serie contradice después, ¿qué ocurre? Estas decisiones previenen crisis cuando los conflictos inevitablemente surjan.

### Paso 7: Crear el proceso de aprobación
Define quién aprueba qué dentro de la franquicia. Establece un proceso claro: quién revisa la consistencia de cada nueva propiedad, quién tiene veto sobre decisiones canónicas, cómo se escalan los conflictos entre equipos. El proceso debe ser ágil; un proceso de aprobación lento mata la creatividad. Pero debe existir; sin aprobación, el canon se fragmenta.

### Paso 8: Diseñar el sistema de actualización
La biblia de franquicia es un documento vivo. Define cómo se actualiza cuando se crean nuevas propiedades, cuando se revela nuevo lore, cuando se toman decisiones canónicas. Establece una cadencia de revisión y un responsable de mantenimiento. Cada actualización debe comunicarse a todos los equipos activos. Una biblia desactualizada es peor que no tener biblia, porque genera falsa confianza.

## Entregable
Biblia de franquicia que incluya: reglas canónicas del universo, clasificación de elementos por nivel de protección (sagrado/dirigido/flexible), línea temporal maestra, directrices de consistencia con ejemplos, mapa de conexiones entre propiedades, jerarquía de canon documentada, proceso de aprobación definido, y sistema de actualización con responsables.

## Criterios de aprobación
- [ ] Las reglas canónicas están documentadas de forma clara y sin ambigüedad.
- [ ] La clasificación sagrado/dirigido/flexible cubre todos los elementos importantes.
- [ ] La línea temporal maestra incluye todas las propiedades activas y planificadas.
- [ ] Las directrices de consistencia tienen ejemplos concretos.
- [ ] La jerarquía de canon resuelve conflictos potenciales entre propiedades.
- [ ] El proceso de aprobación es claro y ágil.
- [ ] Hay un sistema de actualización con responsables asignados.

## Errores comunes en este proceso
- Crear una biblia tan rígida que sofoca la creatividad de las propiedades individuales.
- No definir la jerarquía de canon, causando confusión cuando surgen contradicciones.
- Escribir directrices vagas que cada equipo interpreta diferente.
- No actualizar la biblia cuando se toman decisiones canónicas nuevas.
- Hacer el proceso de aprobación tan pesado que los equipos lo ignoran.
- No incluir ejemplos concretos, dejando las reglas abiertas a interpretación.
- Tratar la biblia como documento de archivo en vez de herramienta de trabajo viva.
`,
    knowledgeRefs: ['Knowledge/Branding/identidad.md', 'Knowledge/Storytelling/tono.md', 'Knowledge/Worldbuilding/geografia.md', 'Knowledge/Worldbuilding/cultura.md', 'Knowledge/Branding/franquicias.md', 'Knowledge/Worldbuilding/historia.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'crear_cortos',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Crear Cortos',
    description: 'Historias breves dentro del mismo universo que enriquecen sin sobrecargar.',
    content: `# Crear Cortos

> Historias breves dentro del mismo universo que enriquecen sin sobrecargar.

## Objetivo
Desarrollar cortometrajes que expandan el universo de la serie contando historias autocontenidas, aprovechando el formato corto para explorar ángulos narrativos que la serie principal no puede cubrir.

## Cuándo usar este workflow
- Cuando hay historias interesantes que no justifican un episodio completo pero merecen ser contadas.
- Cuando se quiere mantener la presencia de la marca entre temporadas.
- Cuando un personaje secundario o un rincón del mundo necesita un momento propio.
- Cuando se quiere experimentar con estilos visuales o narrativos sin comprometer la serie principal.
- Cuando la estrategia de contenido requiere piezas más cortas para plataformas digitales.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Storytelling/emocion.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Visual/paleta.md\`

## Pasos

### Paso 1: Identificar la historia que merece formato corto
Revisa el universo de la serie buscando historias que funcionen mejor en formato condensado. Las mejores candidatas son: un momento íntimo de un personaje, un evento histórico del mundo contado en tiempo real, una perspectiva diferente de un evento conocido, o un concepto del universo explorado en profundidad. La historia debe ser completa en sí misma, no un avance ni un resumen.

### Paso 2: Diseñar el arco autocontenido
Un corto necesita principio, desarrollo y resolución en minutos. Esto exige precisión extrema. Define un solo conflicto, una sola emoción dominante, un solo cambio en el personaje. No intentes meter un episodio completo en menos tiempo; diseña una historia que solo puede existir en formato corto. El arco debe sentirse completo, no abreviado.

### Paso 3: Aprovechar el formato para worldbuilding
Los cortos son la herramienta perfecta para expandir el mundo sin exposición forzada. En lugar de explicar las reglas del universo, muéstralas en acción a través de una historia pequeña. Un corto sobre un panadero en el mundo de la serie puede revelar más sobre la sociedad que un episodio de exposición. Usa los cortos como ventanas a rincones del universo que la trama principal no puede visitar.

### Paso 4: Mantener el tono y la calidad de la serie
Consulta \`Knowledge/Storytelling/tono.md\` y verifica que el corto se siente como parte del mismo universo. La audiencia debe reconocer el mundo instantáneamente. El nivel de calidad visual y narrativa no baja porque el formato sea más corto; si acaso, sube, porque cada segundo cuenta más. Un corto mediocre daña la percepción de la serie más que la ausencia de corto.

### Paso 5: Definir la duración óptima
No todas las historias cortas necesitan la misma duración. Algunas funcionan en dos minutos, otras necesitan siete. Deja que la historia dicte la duración, no la plataforma de distribución. Escribe primero, cronometra después. Si la historia se siente apresurada, necesita más tiempo. Si tiene relleno, necesita menos. La duración correcta es la que no sobra ni falta un solo segundo.

### Paso 6: Diseñar la conexión con la serie principal
Decide el nivel de conexión: ¿el corto enriquece la comprensión de un personaje de la serie? ¿Revela un detalle del mundo? ¿Es completamente independiente dentro del universo? Documenta la conexión para que el equipo de la serie principal sepa qué existe y pueda referenciarlo si lo desea. Nunca hagas que la serie principal dependa de información revelada solo en un corto.

### Paso 7: Planificar la producción y distribución
Define cuántos cortos se producirán, en qué calendario, y dónde se publicarán. Los cortos funcionan mejor como serie de piezas que como unidades aisladas. Planifica una cadencia regular que mantenga al público conectado con el universo. Considera plataformas específicas: los cortos pueden vivir en redes sociales, sitios web, o como contenido extra en plataformas de streaming.

## Entregable
Paquete de desarrollo que incluya: lista de historias seleccionadas con justificación, guión de cada corto con arco completo, definición de duración por pieza, mapa de conexiones con la serie principal, calendario de producción, y plan de distribución por plataforma.

## Criterios de aprobación
- [ ] Cada corto tiene un arco narrativo completo y autocontenido.
- [ ] Las historias aprovechan el formato corto en lugar de abreviar un formato largo.
- [ ] El tono y la calidad visual son coherentes con la serie principal.
- [ ] Los cortos enriquecen el universo sin ser requisito para entender la serie.
- [ ] La duración de cada pieza está justificada por la historia, no por convención.
- [ ] Hay un calendario de producción y distribución definido.
- [ ] Las conexiones con la serie principal están documentadas.

## Errores comunes en este proceso
- Tratar los cortos como episodios abreviados en vez de historias diseñadas para el formato.
- Reducir la calidad visual o narrativa porque "es solo un corto".
- Hacer cortos que solo funcionan si conoces la serie, sin valor independiente.
- Revelar información crucial en cortos que la audiencia general no verá.
- No planificar la cadencia de publicación, publicando de forma errática.
- Elegir historias por facilidad de producción en vez de por valor narrativo.
- Meter demasiada trama en poco tiempo, resultando en piezas apresuradas e incomprensibles.
`,
    knowledgeRefs: ['Knowledge/Visual/paleta.md', 'Knowledge/Storytelling/emocion.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Storytelling/tono.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'crear_spinoff',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Crear Spinoff',
    description: 'Nueva serie dentro del mismo universo, con identidad propia pero ADN compartido.',
    content: `# Crear Spinoff

> Nueva serie dentro del mismo universo, con identidad propia pero ADN compartido.

## Objetivo
Desarrollar una serie derivada que aproveche el universo existente para contar una historia nueva, manteniendo coherencia con la propiedad original sin depender de ella narrativamente.

## Cuándo usar este workflow
- Cuando un personaje secundario genera suficiente interés como para sostener su propia serie.
- Cuando una ubicación o era del universo tiene potencial narrativo inexplorado.
- Cuando la serie original ha terminado pero el universo tiene más historias que contar.
- Cuando el estudio busca expandir la franquicia de forma estratégica.
- Cuando la audiencia pide explorar aspectos del mundo que la serie principal no puede cubrir.

## Archivos de referencia
- \`Knowledge/Branding/franquicias.md\`
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/historia.md\`
- \`Knowledge/Characters/protagonistas.md\`

## Pasos

### Paso 1: Identificar el candidato a spinoff
Revisa el universo existente y detecta qué elemento tiene potencial para expandirse: un personaje con trasfondo sin explorar, una ubicación con su propia dinámica, una era histórica del mundo, o un concepto temático que merece desarrollo propio. El candidato debe tener suficiente misterio o interés acumulado como para justificar una serie entera. No elijas por popularidad solamente; elige por potencial narrativo.

### Paso 2: Verificar la consistencia con el universo
Consulta \`Knowledge/Worldbuilding/reglas.md\` y documenta todas las reglas del universo que aplican al spinoff. Identifica posibles conflictos entre lo que quieres contar y lo que ya está establecido. Si hay contradicciones, decide si puedes resolverlas sin romper el canon o si necesitas ajustar tu propuesta. Nunca sacrifiques la coherencia del universo original por conveniencia del spinoff.

### Paso 3: Definir el tema propio del spinoff
El spinoff necesita su propia pregunta temática, distinta de la serie original. No puede ser simplemente "más de lo mismo en otro lugar". Pregúntate: ¿qué explora esta serie que la original no puede? ¿Qué ángulo nuevo ofrece sobre el universo? El tema debe justificar la existencia independiente del proyecto. Si el tema es el mismo que la serie madre, estás haciendo una temporada, no un spinoff.

### Paso 4: Diseñar la independencia narrativa
Un espectador que nunca vio la serie original debe poder disfrutar el spinoff sin sentirse perdido. Diseña la serie para que funcione sola: presenta su mundo, sus reglas y sus personajes como si fueran nuevos. Las conexiones con la serie original deben ser recompensas para fans, no requisitos para entender la trama. Prueba esto escribiendo el primer episodio sin asumir conocimiento previo.

### Paso 5: Establecer las conexiones sin crear dependencia
Define los puntos de contacto entre el spinoff y la serie original: personajes compartidos, eventos referenciados, elementos visuales del mundo. Cada conexión debe funcionar en dos niveles: como elemento natural de la nueva serie para espectadores nuevos, y como referencia significativa para fans existentes. Documenta qué conexiones son estructurales y cuáles son decorativas.

### Paso 6: Definir el tono diferencial
Consulta \`Knowledge/Storytelling/tono.md\` y establece cómo el spinoff se siente diferente de la original manteniendo el ADN del universo. Un spinoff exitoso tiene su propia personalidad tonal. Si la serie original es aventura épica, quizá el spinoff es thriller íntimo en el mismo mundo. El tono diferencial es lo que justifica que exista como serie separada.

### Paso 7: Crear la biblia del spinoff
Documenta protagonista, tema, tono, arco de primera temporada, relación con la serie madre y reglas específicas del spinoff. Este documento debe poder leerse independientemente de la biblia original, pero debe ser compatible con ella. Incluye una sección explícita de "límites": qué puede hacer el spinoff y qué no puede tocar del universo original.

### Paso 8: Validar con la propiedad original
Revisa que el spinoff no contradiga, devalúe ni repita lo que la serie original ya hizo. Verifica que no revele información que la serie madre planea revelar. Asegúrate de que los personajes compartidos se comporten de forma coherente. Si el spinoff ocurre en otra línea temporal, verifica la cronología completa.

## Entregable
Biblia de spinoff que incluya: justificación del proyecto, tema propio, logline, perfil de audiencia, tono diferencial, mapa de conexiones con la serie original, arco de primera temporada, y documento de límites y reglas de coexistencia con la propiedad madre.

## Criterios de aprobación
- [ ] El spinoff tiene un tema propio distinto al de la serie original.
- [ ] Un espectador nuevo puede entender la serie sin conocimiento previo.
- [ ] Las conexiones con el original funcionan como recompensas, no como requisitos.
- [ ] No hay contradicciones con las reglas del universo establecido.
- [ ] El tono es distinguible del de la serie madre.
- [ ] La biblia del spinoff funciona como documento independiente.
- [ ] Los personajes compartidos se comportan de forma coherente en ambas propiedades.

## Errores comunes en este proceso
- Crear un spinoff que solo funciona si viste la serie original, alienando a nuevos espectadores.
- Elegir un personaje popular pero sin profundidad suficiente para sostener una serie.
- Repetir el mismo tema de la serie madre con diferente envoltorio.
- Contradecir el canon establecido por conveniencia narrativa del spinoff.
- No definir límites claros, causando conflictos entre las dos series cuando avanzan en paralelo.
- Depender excesivamente de cameos y guiños a la serie original en lugar de construir identidad propia.
- Asumir que la audiencia del original automáticamente seguirá al spinoff sin ganársela de nuevo.
`,
    knowledgeRefs: ['Knowledge/Storytelling/tono.md', 'Knowledge/Branding/franquicias.md', 'Knowledge/Characters/protagonistas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Worldbuilding/historia.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'crossover',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Crossover',
    description: 'Cruzar universos con otras propiedades de forma narrativamente justificada.',
    content: `# Crossover

> Cruzar universos con otras propiedades de forma narrativamente justificada.

## Objetivo
Diseñar un evento de crossover entre dos o más propiedades que se sienta narrativamente orgánico, respete las reglas de todos los universos involucrados y ofrezca una experiencia que ninguna propiedad podría lograr por sí sola.

## Cuándo usar este workflow
- Cuando dos propiedades del estudio comparten temáticas o audiencias compatibles.
- Cuando una colaboración con una propiedad externa puede beneficiar a ambas marcas.
- Cuando la audiencia ha expresado interés en ver universos combinados.
- Cuando un evento especial requiere un gancho narrativo excepcional.
- Cuando se busca presentar una propiedad a la audiencia de otra.

## Archivos de referencia
- \`Knowledge/Branding/franquicias.md\`
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Characters/protagonistas.md\`

## Pasos

### Paso 1: Evaluar la alineación de marcas
Antes de cualquier decisión narrativa, verifica que las marcas son compatibles. Compara: audiencia objetivo, valores de marca, tono narrativo, calidad percibida. Un crossover entre propiedades con audiencias o tonos incompatibles daña a ambas. No hagas un crossover solo porque es posible; hazlo porque las marcas se fortalecen mutuamente. Si hay duda sobre la compatibilidad, no lo hagas.

### Paso 2: Identificar la justificación narrativa
Un crossover necesita una razón para existir dentro de las historias, no solo fuera de ellas. Pregúntate: ¿por qué estos personajes se encontrarían? ¿Qué amenaza o evento justifica que estos mundos colisionen? La justificación debe ser tan fuerte que el espectador piense "esto tiene sentido" antes de pensar "esto es un crossover". Si la única justificación es comercial, la audiencia lo detectará.

### Paso 3: Definir las reglas del encuentro
Cuando dos universos se cruzan, sus reglas pueden entrar en conflicto. Establece cómo coexisten: ¿la magia del universo A funciona en el universo B? ¿Las leyes físicas de cuál mundo prevalecen? ¿Los personajes mantienen sus poderes? Define estas reglas antes de escribir una sola escena. Las inconsistencias en las reglas del crossover destruyen la suspensión de incredulidad más rápido que cualquier otra cosa.

### Paso 4: Mantener las reglas de ambos universos
Consulta \`Knowledge/Worldbuilding/reglas.md\` de cada propiedad y verifica que el crossover no rompe ninguna. Los personajes deben comportarse de forma coherente con su desarrollo en sus series respectivas. Un protagonista valiente no se vuelve cobarde porque está fuera de su universo. Un villano no pierde su inteligencia porque enfrenta nuevos oponentes. La integridad de cada propiedad es innegociable.

### Paso 5: Diseñar el conflicto compartido
El conflicto del crossover debe ser uno que requiera genuinamente la colaboración de personajes de ambos universos. No basta con poner personajes en la misma habitación; necesitan una razón para trabajar juntos que aproveche las fortalezas únicas de cada grupo. El mejor conflicto de crossover es uno que ninguna de las dos partes podría resolver sola, pero que juntas abordan de forma inesperada y satisfactoria.

### Paso 6: Equilibrar el protagonismo
Ninguna propiedad debe sentirse como invitada en la casa de la otra. Diseña el crossover para que ambas reciban igual respeto narrativo, tiempo de pantalla significativo y momentos de brillar. Si la audiencia de una propiedad siente que sus personajes fueron reducidos a comparsas, el crossover fracasó. Planifica los momentos clave asegurando que ambos equipos de personajes contribuyan sustancialmente.

### Paso 7: Planificar la transición de audiencias
El crossover es una oportunidad para que la audiencia de una propiedad descubra la otra. Diseña momentos que presenten a cada grupo de personajes de forma atractiva para espectadores que no los conocen. No asumas que toda la audiencia conoce ambas propiedades. Incluye contexto suficiente para que un espectador de cualquiera de las dos propiedades disfrute el crossover sin sentirse excluido.

### Paso 8: Definir las consecuencias post-crossover
Decide qué pasa después: ¿el crossover es canon en ambos universos? ¿Los personajes recuerdan lo que pasó? ¿Los eventos afectan las tramas futuras de cada serie? Documenta estas decisiones antes de la producción. Las consecuencias mal manejadas crean problemas narrativos a largo plazo. Si el crossover es canon, ambas series deben reflejarlo coherentemente después.

## Entregable
Documento de crossover que incluya: análisis de alineación de marcas, justificación narrativa, reglas del encuentro entre universos, diseño del conflicto compartido, plan de equilibrio de protagonismo, estrategia de transición de audiencias, y definición de consecuencias post-crossover con impacto en cada propiedad.

## Criterios de aprobación
- [ ] Las marcas son compatibles en audiencia, tono y valores.
- [ ] Hay una justificación narrativa orgánica para el encuentro.
- [ ] Las reglas de coexistencia de universos están definidas sin contradicciones.
- [ ] El conflicto requiere genuinamente la participación de ambos grupos.
- [ ] El protagonismo está equilibrado entre las propiedades.
- [ ] Un espectador de cualquiera de las dos propiedades puede disfrutar el crossover.
- [ ] Las consecuencias post-crossover están definidas y son manejables.

## Errores comunes en este proceso
- Hacer un crossover sin justificación narrativa, motivado solo por marketing.
- No definir las reglas de coexistencia, causando incoherencias lógicas.
- Favorecer una propiedad sobre la otra, alienando a parte de la audiencia.
- Ignorar la consistencia de los personajes fuera de su universo habitual.
- No planificar las consecuencias, creando problemas en las series individuales después.
- Asumir que toda la audiencia conoce ambas propiedades igualmente.
- Diseñar un conflicto que cualquiera de los dos grupos podría resolver solo, haciendo el crossover innecesario.
`,
    knowledgeRefs: ['Knowledge/Branding/identidad.md', 'Knowledge/Branding/franquicias.md', 'Knowledge/Characters/protagonistas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'expandir_lore',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Expandir Lore',
    description: 'Profundizar la historia del mundo más allá de lo que la serie muestra.',
    content: `# Expandir Lore

> Profundizar la historia del mundo más allá de lo que la serie muestra.

## Objetivo
Desarrollar la historia, mitología y contexto del universo narrativo en capas que enriquezcan la experiencia sin ser necesarias para seguir la trama principal, creando un mundo que se sienta vivido y profundo.

## Cuándo usar este workflow
- Cuando el mundo de la serie necesita más profundidad para sentirse creíble.
- Cuando los escritores necesitan contexto histórico para tomar decisiones narrativas coherentes.
- Cuando la audiencia muestra curiosidad por aspectos del mundo no explorados en la serie.
- Cuando se planean productos expandidos (libros, juegos, cómics) que necesitan lore documentado.
- Cuando hay inconsistencias que se resuelven estableciendo historia de fondo.

## Archivos de referencia
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/historia.md\`
- \`Knowledge/Worldbuilding/geografia.md\`
- \`Knowledge/Worldbuilding/cultura.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Identificar áreas de interés inexploradas
Revisa el universo y lista los huecos: ¿qué pasó antes de que empiece la serie? ¿Cómo funciona la economía de este mundo? ¿Qué hay en las regiones que los personajes nunca visitan? ¿Cuál es el origen de las tradiciones que se mencionan de pasada? Prioriza las áreas que generan más preguntas en la audiencia y las que los escritores necesitan para tomar mejores decisiones. No expandas por expandir; expande lo que importa.

### Paso 2: Escribir eventos históricos clave
Desarrolla los eventos que formaron el mundo tal como existe en la serie. Cada evento histórico debe tener causa, desarrollo y consecuencia. No escribas cronologías secas; escribe historia con conflicto y personajes. Un evento del pasado del mundo debe ser tan narrativamente interesante como un episodio de la serie. Si el evento histórico no tiene drama, no vale la pena documentarlo.

### Paso 3: Conectar el lore con la historia actual
Cada pieza de lore nueva debe tener al menos una conexión con los eventos de la serie. La historia del mundo no existe en el vacío; existe porque explica por qué las cosas son como son en el presente narrativo. Documenta las conexiones explícitamente: "Este evento histórico explica por qué la ciudad X tiene esta arquitectura" o "Esta tradición antigua es la razón del ritual que aparece en el episodio Y".

### Paso 4: Decidir la estrategia de revelación
No todo el lore debe revelarse al espectador. Decide qué información es: a) necesaria para la trama y debe revelarse explícitamente, b) enriquecedora y puede revelarse sutilmente para observadores atentos, c) contexto interno que solo necesitan los escritores. La mayoría del lore debe estar en la categoría B o C. El iceberg narrativo funciona porque la mayor parte está bajo la superficie.

### Paso 5: Crear consistencia interna
Verifica que el nuevo lore no contradiga nada establecido previamente. Revisa \`Knowledge/Worldbuilding/reglas.md\` y asegúrate de que la historia expandida respeta las leyes del mundo. Si el nuevo lore sugiere que las reglas actuales deberían ser diferentes, decide qué prevalece: el lore nuevo o las reglas existentes. Nunca dejes contradicciones sin resolver; erosionan la credibilidad del mundo.

### Paso 6: Desarrollar culturas y sociedades
Los mundos profundos tienen sociedades que funcionan con su propia lógica. Desarrolla cómo viven las personas en este mundo: qué comen, qué valoran, cómo resuelven conflictos, qué arte crean, qué temen. Consulta \`Knowledge/Worldbuilding/cultura.md\` y asegúrate de que las culturas son coherentes con la geografía, la historia y las reglas del mundo. Las culturas no son decoración; son el resultado de la historia y el entorno.

### Paso 7: Documentar en la biblia del mundo
Organiza todo el lore nuevo en el formato establecido de la biblia del mundo. Cada entrada debe incluir: descripción, período temporal, ubicación geográfica, personajes relevantes, conexión con la serie actual, y nivel de revelación (público, sutil, interno). Mantén un índice actualizado que permita a cualquier miembro del equipo encontrar información rápidamente. El lore que no está documentado no existe oficialmente.

### Paso 8: Validar que el lore sirve a la narrativa
Revisa todo el lore expandido con una pregunta: ¿esto hace mejor la serie? Si una pieza de lore no enriquece la experiencia del espectador ni ayuda a los escritores a tomar mejores decisiones, elimínala. El lore por el lore es indulgencia del creador. Cada pieza debe tener una función, aunque esa función sea simplemente hacer que el mundo se sienta más real y vivido.

## Entregable
Documento de expansión de lore que incluya: lista de áreas expandidas con justificación, narrativa de cada evento histórico, mapa de conexiones con la serie actual, estrategia de revelación por pieza, verificación de consistencia con reglas existentes, y entradas formateadas para la biblia del mundo.

## Criterios de aprobación
- [ ] Cada pieza de lore tiene al menos una conexión con la serie actual.
- [ ] No hay contradicciones con las reglas o eventos establecidos del mundo.
- [ ] La estrategia de revelación está definida para cada pieza (pública, sutil, interna).
- [ ] Las culturas y sociedades son coherentes con la geografía e historia del mundo.
- [ ] El lore está documentado en formato de biblia del mundo con índice.
- [ ] Cada pieza de lore mejora la serie o ayuda a los escritores.
- [ ] Los eventos históricos tienen drama y conflicto, no son cronologías secas.

## Errores comunes en este proceso
- Expandir el lore sin conectarlo a la serie, creando información huérfana que nadie usa.
- Contradecir reglas o eventos establecidos previamente por no verificar consistencia.
- Revelar demasiado lore al espectador, destruyendo el misterio del mundo.
- Escribir historia del mundo sin drama ni personajes, creando enciclopedias aburridas.
- No documentar el lore formalmente, causando que diferentes escritores tengan versiones distintas.
- Crear culturas superficiales que son solo estéticas sin lógica interna.
- Desarrollar lore que limita las opciones narrativas futuras de la serie sin intención.
`,
    knowledgeRefs: ['Knowledge/Worldbuilding/geografia.md', 'Knowledge/Worldbuilding/cultura.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Worldbuilding/historia.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'experiencia_interactiva',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Experiencia Interactiva',
    description: 'Juegos, apps y experiencias inmersivas que llevan al espectador dentro del universo.',
    content: `# Experiencia Interactiva

> Juegos, apps y experiencias inmersivas que llevan al espectador dentro del universo.

## Objetivo
Diseñar experiencias interactivas que trasladen al usuario al interior del universo narrativo, aprovechando la agencia y la participación activa para crear momentos imposibles en medios pasivos, manteniendo la calidad narrativa y visual de la franquicia.

## Cuándo usar este workflow
- Cuando se quiere expandir la franquicia al medio interactivo (videojuegos, apps, experiencias inmersivas).
- Cuando un aspecto del universo se presta especialmente a la exploración activa del usuario.
- Cuando la audiencia demanda participación más allá de observar.
- Cuando se busca un producto que complemente la serie con una experiencia radicalmente diferente.
- Cuando una colaboración con un estudio de juegos o tecnología está en proceso.

## Archivos de referencia
- \`Knowledge/Branding/franquicias.md\`
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Worldbuilding/reglas.md\`
- \`Knowledge/Worldbuilding/geografia.md\`
- \`Knowledge/Worldbuilding/cultura.md\`
- \`Knowledge/Visual/paleta.md\`

## Pasos

### Paso 1: Identificar el potencial interactivo del universo
Revisa el universo y pregúntate: ¿qué haría un fan si pudiera entrar en este mundo? ¿Qué exploraría? ¿Con quién hablaría? ¿Qué decisiones tomaría? Las respuestas revelan el potencial interactivo. Si el mundo tiene mecánicas inherentes (sistema de magia, combate, exploración, creación), el potencial es alto. Si el atractivo principal es observar una historia, el medio interactivo puede no ser el adecuado.

### Paso 2: Definir el rol del usuario en el universo
El usuario no puede ser un espectador que presiona botones; necesita un rol que justifique su agencia. Opciones: ser un habitante del mundo con su propia historia, ser un personaje nuevo que interactúa con personajes conocidos, asumir el rol de un personaje existente en situaciones nuevas, o ser una fuerza abstracta que influye en eventos. El rol debe darle al usuario una razón para actuar y consecuencias por sus acciones.

### Paso 3: Adaptar las reglas del mundo a la interactividad
Las reglas del universo deben traducirse en mecánicas de juego o interacción. Consulta \`Knowledge/Worldbuilding/reglas.md\` y define cómo cada regla se manifiesta interactivamente. Si la magia funciona con concentración en la serie, quizás funciona con gestos precisos en el juego. La traducción debe ser fiel al espíritu de la regla aunque cambie la forma. Las mecánicas que contradicen las reglas del mundo rompen la inmersión instantáneamente.

### Paso 4: Mantener la calidad narrativa
La interactividad no es excusa para narrativa mediocre. El guión de la experiencia interactiva debe tener el mismo rigor que un episodio de la serie. Los diálogos deben sonar como los personajes. Las tramas deben tener arco, conflicto y resolución. Si hay decisiones del jugador, cada camino debe ser narrativamente satisfactorio, no solo uno "correcto" y varios "incorrectos". Consulta los mismos archivos de Storytelling que usarías para un episodio.

### Paso 5: Diseñar momentos exclusivos del medio
Crea experiencias que solo sean posibles en el medio interactivo. Un momento donde el jugador debe tomar una decisión moral que el protagonista de la serie nunca enfrentó. Una exploración libre de un lugar que la cámara de la serie solo muestra de lejos. Una conversación con un personaje donde el usuario puede hacer preguntas que la trama de la serie no permite. Estos momentos justifican la existencia del producto y dan razones únicas para experimentarlo.

### Paso 6: Mantener la coherencia visual
Consulta \`Knowledge/Visual/paleta.md\` y \`Knowledge/Branding/identidad.md\` para definir cómo se traduce la identidad visual al medio interactivo. El cambio de medio puede requerir cambio de estilo (2D a 3D, por ejemplo), pero la paleta de colores, el diseño de personajes y la atmósfera deben ser reconocibles. Un fan que entre al juego debe sentir que está en el mismo mundo de la serie en los primeros tres segundos.

### Paso 7: Definir los límites narrativos
Establece qué puede hacer el usuario y qué no dentro del universo. ¿Puede matar personajes principales? ¿Puede cambiar eventos canónicos? ¿Puede acceder a información que la serie aún no ha revelado? Los límites protegen tanto la franquicia como la experiencia del usuario. Demasiada libertad rompe el canon; demasiada restricción frustra al jugador. Encuentra el equilibrio documentando casos específicos.

### Paso 8: Planificar la integración con la franquicia
Decide cómo se relaciona la experiencia interactiva con las demás propiedades. ¿Es canon? ¿Complementa una temporada específica? ¿Ocurre en una línea temporal diferente? ¿Los eventos del juego se reflejan en la serie? Documenta estas decisiones y comunícalas a todos los equipos. La experiencia interactiva debe fortalecer la franquicia, no crear problemas de continuidad que otros equipos deban resolver.

## Entregable
Documento de diseño de experiencia interactiva que incluya: análisis de potencial interactivo, definición del rol del usuario, traducción de reglas del mundo a mecánicas, guión narrativo con ramas de decisión, diseño de momentos exclusivos del medio, guía de coherencia visual, documento de límites narrativos, y plan de integración con la franquicia.

## Criterios de aprobación
- [ ] El potencial interactivo del universo está justificado con ejemplos concretos.
- [ ] El rol del usuario tiene agencia real con consecuencias significativas.
- [ ] Las mecánicas respetan las reglas del universo.
- [ ] La narrativa tiene la misma calidad que la serie.
- [ ] Hay al menos cinco momentos exclusivos del medio interactivo.
- [ ] La identidad visual es reconocible a pesar del cambio de medio.
- [ ] Los límites narrativos están definidos con casos específicos.
- [ ] La integración con la franquicia está documentada y comunicada.

## Errores comunes en este proceso
- Crear un juego genérico con la piel visual de la serie en lugar de una experiencia que viva en el universo.
- Sacrificar la narrativa porque "es un juego y lo importante es la jugabilidad".
- Contradecir las reglas del mundo para que las mecánicas de juego funcionen.
- Dar tanta libertad al usuario que el canon de la franquicia se vuelve inmanejable.
- No crear momentos exclusivos del medio, haciendo la experiencia redundante con la serie.
- Asumir que la audiencia del juego conoce la serie y no proveer contexto.
- No definir la relación canónica con el resto de la franquicia, creando confusión.
`,
    knowledgeRefs: ['Knowledge/Visual/paleta.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Worldbuilding/geografia.md', 'Knowledge/Worldbuilding/cultura.md', 'Knowledge/Branding/franquicias.md', 'Knowledge/Worldbuilding/reglas.md'],
  },
  {
    id: 'linea_merchandising',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Línea de Merchandising',
    description: 'Productos que extienden la experiencia de la serie más allá de la pantalla.',
    content: `# Línea de Merchandising

> Productos que extienden la experiencia de la serie más allá de la pantalla.

## Objetivo
Diseñar una línea de productos que amplifique la conexión emocional del espectador con la serie, generando ingresos mientras mantiene la calidad y coherencia de la marca.

## Cuándo usar este workflow
- Cuando la serie tiene audiencia suficiente para justificar productos físicos o digitales.
- Cuando se quiere expandir la presencia de la marca fuera del contenido audiovisual.
- Cuando la audiencia pide activamente productos relacionados con la serie.
- Cuando se planifica el lanzamiento de una nueva temporada y se quiere acompañar con merchandising.

## Archivos de referencia
- \`Knowledge/Branding/merchandising.md\`
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Branding/franquicias.md\`
- \`Knowledge/Visual/paleta.md\`

## Pasos

### Paso 1: Identificar activos merchandisables
Revisa la serie y lista todos los elementos con potencial comercial: personajes icónicos, objetos narrativos importantes, frases memorables, símbolos visuales, ubicaciones reconocibles, criaturas o vehículos. No todo lo que existe en la serie merece un producto. Prioriza elementos que tienen significado emocional para la audiencia, no solo los que se ven bien aislados.

### Paso 2: Investigar la demanda de la audiencia
Analiza qué pide la audiencia: redes sociales, fan art, cosplay, conversaciones en comunidades. Los fans te dicen qué productos quieren con su comportamiento. Si dibujan un personaje constantemente, quieren una figura. Si citan una frase, quieren una camiseta. Si recrean el mundo, quieren sets de construcción. La demanda orgánica es mejor predictor que cualquier estudio de mercado.

### Paso 3: Priorizar por impacto y viabilidad
Clasifica los productos potenciales en una matriz de impacto emocional versus viabilidad de producción. Los productos de alto impacto y alta viabilidad van primero. Los de alto impacto y baja viabilidad se planifican a largo plazo. Los de bajo impacto se descartan sin importar su viabilidad. Nunca hagas un producto fácil de fabricar que no le importa a nadie; es ruido que diluye la marca.

### Paso 4: Diseñar la línea de productos
Crea una colección coherente, no productos sueltos. Define categorías: coleccionables, uso diario, experiencia, edición limitada. Cada producto debe tener una razón de existir dentro de la línea. La colección debe contar una historia visual: si la pones toda junta, debe sentirse como el universo de la serie. Consulta \`Knowledge/Visual/paleta.md\` para mantener coherencia cromática.

### Paso 5: Establecer el control de calidad
Define estándares mínimos de calidad que cualquier producto debe cumplir. Esto incluye materiales, acabados, precisión de color, fidelidad al diseño original y durabilidad. Un producto de mala calidad daña más la marca que la ausencia de producto. Crea un proceso de aprobación con muestras físicas obligatorias antes de producción masiva. Nunca apruebes un producto solo viendo renders digitales.

### Paso 6: Planificar el timing de lanzamiento
Sincroniza los lanzamientos de productos con momentos clave de la serie: estreno de temporada, episodio importante, revelación de personaje. El merchandising debe amplificar la emoción del contenido, no competir con él. Define ventanas de lanzamiento y asegúrate de que los productos estén disponibles cuando la emoción del espectador está en su punto más alto.

### Paso 7: Diseñar productos que extiendan la experiencia
Los mejores productos de merchandising no son solo objetos con el logo de la serie; son extensiones de la experiencia narrativa. Un diario que replica el cuaderno de un personaje extiende la experiencia. Una figura genérica con el logo no lo hace. Diseña cada producto pensando: ¿esto hace que el fan se sienta más conectado con el universo? Si la respuesta es no, rediseña o descarta.

### Paso 8: Definir la estrategia de distribución
Decide dónde y cómo se venderán los productos: tienda online propia, retailers, convenciones, exclusivos por plataforma. Cada canal tiene su audiencia y sus expectativas. Los coleccionistas buscan exclusividad. El público general busca accesibilidad. No intentes servir a todos con el mismo producto en el mismo canal. Segmenta la oferta por tipo de consumidor.

## Entregable
Plan de merchandising que incluya: catálogo de activos merchandisables priorizados, diseño de línea de productos con categorías, estándares de calidad documentados, calendario de lanzamientos sincronizado con la serie, estrategia de distribución por canal, y presupuesto estimado de producción inicial.

## Criterios de aprobación
- [ ] Los productos seleccionados tienen demanda demostrada o fuertemente inferida.
- [ ] La línea de productos es coherente visualmente y narrativamente.
- [ ] Los estándares de calidad están documentados con criterios específicos.
- [ ] El calendario de lanzamientos está sincronizado con la serie.
- [ ] Cada producto extiende la experiencia del universo, no solo lleva el logo.
- [ ] La estrategia de distribución segmenta por tipo de consumidor.
- [ ] Hay un proceso de aprobación con muestras físicas definido.

## Errores comunes en este proceso
- Lanzar productos genéricos con el logo de la serie en lugar de productos con significado narrativo.
- Ignorar lo que la audiencia pide y fabricar lo que es más fácil de producir.
- No sincronizar lanzamientos con momentos clave de la serie.
- Aprobar productos basándose en renders digitales sin ver muestras físicas.
- Saturar el mercado con demasiados productos que diluyen la marca.
- No establecer estándares de calidad, permitiendo productos que dañan la percepción de la serie.
- Tratar el merchandising como ingreso puro sin considerar su impacto en la relación con la audiencia.
`,
    knowledgeRefs: ['Knowledge/Visual/paleta.md', 'Knowledge/Branding/merchandising.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Branding/franquicias.md'],
  },
  {
    id: 'siguiente_temporada',
    phase: '07_Expansion',
    phaseName: 'Expansión',
    phaseIcon: '🌎',
    phaseColor: '#fff176',
    title: 'Siguiente Temporada',
    description: 'Planificar lo que viene: nuevos arcos, evolución de personajes y apuestas más altas.',
    content: `# Siguiente Temporada

> Planificar lo que viene: nuevos arcos, evolución de personajes y apuestas más altas.

## Objetivo
Diseñar la siguiente temporada de una serie existente de manera que eleve las apuestas, evolucione a los personajes y mantenga la frescura narrativa sin traicionar la identidad del proyecto.

## Cuándo usar este workflow
- Cuando una temporada ha terminado y se confirma la producción de la siguiente.
- Cuando necesitas planificar la dirección narrativa antes de escribir episodios.
- Cuando la serie necesita renovarse sin perder su esencia.
- Cuando hay hilos narrativos abiertos que requieren resolución o desarrollo.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Characters/evolucion.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Storytelling/emocion.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Characters/antagonistas.md\`

## Pasos

### Paso 1: Auditoría de la temporada anterior
Analiza qué funcionó y qué no. Revisa cada episodio y clasifica: momentos que generaron mayor impacto emocional, tramas que perdieron impulso, personajes que crecieron y personajes que se estancaron, giros que sorprendieron y giros que se sintieron forzados. Sé brutalmente honesto. Lo que no funcionó no se repite; lo que funcionó se entiende por qué funcionó, no se copia mecánicamente.

### Paso 2: Mapear hilos sin resolver
Lista todos los hilos narrativos abiertos: preguntas sin respuesta, conflictos latentes, relaciones en evolución, secretos no revelados, promesas hechas al espectador. Clasifícalos por urgencia: cuáles debe resolver la siguiente temporada, cuáles pueden esperar, y cuáles es mejor dejar como misterio permanente. No todo hilo abierto necesita cerrarse, pero todo hilo importante necesita atención.

### Paso 3: Elevar las apuestas
Consulta \`Knowledge/Storytelling/estructura.md\` y diseña cómo la nueva temporada sube la intensidad. Las apuestas no se elevan solo añadiendo peligro; se elevan haciendo que lo que está en juego importe más. Pregúntate: ¿qué puede perder el protagonista ahora que antes no podía? ¿Qué decisión imposible debe enfrentar? ¿Qué verdad dolorosa debe aceptar? Las mejores temporadas nuevas hacen que el éxito anterior se sienta como preparación, no como resolución.

### Paso 4: Planificar la evolución de personajes
Consulta \`Knowledge/Characters/evolucion.md\` y define el arco de cada personaje principal para la nueva temporada. Cada personaje debe terminar la temporada en un lugar emocional diferente al que empezó. La evolución debe ser consecuencia de los eventos, no decoración. Identifica qué falla interna enfrenta cada personaje ahora que las fallas anteriores fueron (parcialmente) superadas. Los personajes que no evolucionan se vuelven muebles.

### Paso 5: Diseñar nuevos conflictos
Los conflictos de la nueva temporada deben surgir orgánicamente del estado actual de los personajes y el mundo. No introduzcas amenazas aleatorias; diseña conflictos que pongan a prueba exactamente lo que los personajes aprendieron o ganaron. El mejor conflicto nuevo hace que el espectador piense "claro, esto tenía que pasar". Incluye al menos un conflicto interno y uno externo que se reflejen mutuamente.

### Paso 6: Redefinir al antagonista
Si el antagonista anterior fue derrotado, diseña uno nuevo que represente un desafío diferente. Si el antagonista continúa, debe evolucionar tanto como el protagonista. Consulta \`Knowledge/Characters/antagonistas.md\` y verifica que la amenaza se siente renovada. El peor error es un villano que repite el mismo plan con más recursos. El antagonista de la nueva temporada debe atacar una vulnerabilidad que el protagonista no sabía que tenía.

### Paso 7: Definir el arco emocional de la temporada
Diseña cómo se siente la temporada completa como unidad. ¿Empieza con falsa calma y escala a crisis? ¿Empieza en crisis y busca reconstrucción? Define el punto más bajo emocional y el momento catártico. Mapea la curva de intensidad episodio por episodio. La temporada debe tener su propio ritmo emocional, no ser simplemente una extensión de la anterior.

### Paso 8: Verificar coherencia con la serie completa
Revisa que la nueva temporada encaje en la narrativa general de la serie. Si hay un arco total planeado, verifica que esta temporada avance hacia él. Asegúrate de que los cambios de personaje sean acumulativos y coherentes con temporadas anteriores. La serie completa debe sentirse como un viaje con dirección, no como temporadas sueltas pegadas entre sí.

## Entregable
Documento de planificación de temporada que contenga: análisis de la temporada anterior (aciertos y errores), lista de hilos a resolver, arco de cada personaje principal, definición del antagonista, mapa de conflictos nuevos, curva emocional de la temporada, y sinopsis de cada episodio en una línea.

## Criterios de aprobación
- [ ] Se identificaron claramente aciertos y errores de la temporada anterior.
- [ ] Las apuestas son genuinamente más altas, no artificialmente infladas.
- [ ] Cada personaje principal tiene un arco definido para la temporada.
- [ ] Los nuevos conflictos surgen orgánicamente del estado actual de la serie.
- [ ] El antagonista presenta un desafío cualitativamente diferente.
- [ ] La curva emocional de la temporada está mapeada.
- [ ] La temporada encaja coherentemente en el arco general de la serie.

## Errores comunes en este proceso
- Repetir la fórmula de la temporada exitosa anterior sin entender por qué funcionó.
- Elevar apuestas solo con escala (más grande, más peligroso) sin profundidad emocional.
- Ignorar la evolución de personajes y mantenerlos estáticos porque "funcionan así".
- Introducir conflictos que no tienen relación con lo que los personajes ya vivieron.
- Resolver todos los hilos abiertos al inicio de la temporada, dejándola sin combustible narrativo.
- No planificar el arco completo antes de escribir episodios, causando inconsistencias.
- Olvidar que el espectador creció con los personajes y espera madurez narrativa acorde.
`,
    knowledgeRefs: ['Knowledge/Storytelling/emocion.md', 'Knowledge/Characters/protagonistas.md', 'Knowledge/Characters/antagonistas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/evolucion.md', 'Knowledge/Storytelling/tono.md'],
  },
  {
    id: 'agregar_personaje',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Agregar Personaje',
    description: 'Introducir un personaje nuevo a una serie en marcha sin desbalancear el elenco.',
    content: `# Agregar Personaje

> Introducir un personaje nuevo a una serie en marcha sin desbalancear el elenco.

## Objetivo
Incorporar un personaje nuevo que enriquezca la serie de forma orgánica, justificando su entrada narrativamente, creando contraste con el elenco existente y evitando desplazar a personajes ya queridos por la audiencia.

## Cuándo usar este workflow
- Cuando la narrativa necesita un rol que ningún personaje actual puede cumplir.
- Cuando el elenco necesita nueva energía o dinámica.
- Cuando un nuevo arco requiere un punto de vista fresco.
- Cuando la audiencia necesita un punto de entrada a un mundo que se ha vuelto complejo.
- Cuando la evolución de la historia exige nuevos tipos de conflicto interpersonal.

## Archivos de referencia
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Characters/evolucion.md\`
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Characters/secundarios.md\`
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`

## Pasos

### Paso 1: Justificar narrativamente la entrada
El nuevo personaje necesita una razón dentro de la historia para aparecer. No puede materializarse sin contexto. Pregúntate: ¿por qué aparece ahora y no antes? ¿Qué evento o circunstancia lo trae a la historia? ¿Su llegada es consecuencia de algo que los personajes existentes hicieron? La justificación más fuerte es cuando la llegada del nuevo personaje se siente inevitable dados los eventos previos.

### Paso 2: Definir el rol en el elenco
Consulta \`Knowledge/Characters/protagonistas.md\` y mapea el elenco actual: quién es el héroe, el mentor, el cómico, el escéptico, etc. Identifica qué rol falta o qué dinámica necesita refuerzo. El nuevo personaje debe llenar un vacío funcional, no duplicar un rol existente. Si ya tienes un personaje cómico y añades otro, ambos se diluyen. Si añades un antagonista interno, creas tensión nueva.

### Paso 3: Crear contraste con el elenco existente
El nuevo personaje debe sentirse distinto de todos los demás. Contraste en personalidad, en método, en valores, en estilo visual. Consulta \`Knowledge/Characters/secundarios.md\` y verifica que no se superpone con nadie. El contraste genera fricción dramática, que genera escenas interesantes. Si el personaje nuevo se parece demasiado a uno existente, uno de los dos sobra.

### Paso 4: Diseñar la introducción
La primera aparición del personaje define cómo la audiencia lo percibe. Diseña una entrada que comunique quién es en una escena: su personalidad, su competencia, su conflicto interno, su relación con el mundo. No lo expliques; muéstralo actuando. La introducción debe generar curiosidad: el espectador debe querer saber más. Si la primera escena no engancha, el personaje empieza en desventaja emocional.

### Paso 5: Integrar gradualmente en las dinámicas
No le des todo el protagonismo al personaje nuevo de golpe. Intégralo progresivamente: primero interactúa con un personaje, luego con otro, luego con el grupo. Permite que las dinámicas existentes absorban al nuevo miembro de forma natural. La audiencia necesita tiempo para aceptar a alguien nuevo en un grupo que ya quiere. Forzar la aceptación inmediata se siente artificial.

### Paso 6: Evitar desplazar personajes existentes
Este es el riesgo más grande. Verifica que el nuevo personaje no roba escenas, arcos ni dinámicas que pertenecen a personajes establecidos. Consulta \`Knowledge/Characters/evolucion.md\` y asegúrate de que los arcos de los personajes existentes continúan sin interrupción. Si el nuevo personaje necesita espacio, créalo; no se lo quites a alguien más. La audiencia percibe el desplazamiento y lo resiente.

### Paso 7: Establecer el conflicto propio del personaje
El nuevo personaje necesita su propia falla interna, su propio arco de crecimiento, su propia pregunta temática. Esto lo convierte en un personaje completo, no en una función narrativa. Define qué quiere, qué necesita, qué le impide obtenerlo, y cómo la serie le obliga a confrontar su falla. Un personaje sin conflicto propio se siente como utilería con diálogos.

### Paso 8: Evaluar el impacto post-integración
Después de varios episodios con el nuevo personaje, evalúa: ¿la serie es mejor con él? ¿Las dinámicas se enriquecieron? ¿Los personajes existentes siguen brillando? ¿La audiencia conectó? Si la respuesta a cualquiera es no, ajusta el rol del personaje o, si es necesario, planifica una salida digna. Agregar un personaje es una apuesta; hay que estar dispuesto a corregir si no funciona.

## Entregable
Ficha completa del nuevo personaje que incluya: justificación narrativa de su entrada, rol en el elenco, análisis de contraste con personajes existentes, diseño de la escena de introducción, plan de integración gradual episodio por episodio, verificación de no-desplazamiento, y arco de conflicto propio.

## Criterios de aprobación
- [ ] La entrada del personaje está justificada narrativamente dentro de la historia.
- [ ] El personaje llena un rol vacante, no duplica uno existente.
- [ ] Hay contraste claro con todos los miembros del elenco actual.
- [ ] La escena de introducción comunica su esencia sin exposición forzada.
- [ ] Ningún personaje existente pierde espacio narrativo significativo.
- [ ] El personaje tiene conflicto interno propio y arco definido.
- [ ] Hay un plan de integración gradual, no una imposición inmediata.

## Errores comunes en este proceso
- Agregar un personaje sin justificación narrativa, haciendo que se sienta forzado.
- Duplicar el rol de un personaje existente, diluyendo a ambos.
- Dar demasiado protagonismo al nuevo personaje desde el primer episodio.
- Desplazar personajes queridos para hacer espacio al nuevo.
- No crear un conflicto propio, dejando al personaje como función narrativa sin profundidad.
- Introducir al personaje con exposición verbal en vez de acción que muestre quién es.
- No evaluar el impacto después de la integración y asumir que funcionó.
`,
    knowledgeRefs: ['Knowledge/Characters/protagonistas.md', 'Knowledge/Characters/antagonistas.md', 'Knowledge/Characters/secundarios.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/evolucion.md', 'Knowledge/Storytelling/tono.md'],
  },
  {
    id: 'arreglar_ritmo',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Arreglar Ritmo de Temporada',
    description: '',
    content: `# Arreglar Ritmo de Temporada

**Objetivo:** Diagnosticar y corregir una temporada cuyo ritmo narrativo se siente lento, apresurado, o desbalanceado, hasta que la experiencia de ver la temporada complete tenga la energía correcta.

**Cuándo usar:** Cuando una temporada completa se lee o visualiza y genera sensación de arrastre en el medio, cuando el clímax llega sin suficiente preparación emocional, cuando episodios importantes se agrupan y episodios de transición se acumulan, o cuando la audiencia reporta que "tardó en enganchar" o que "el final se sintió apresurado."

**Archivos de referencia:**
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/emocion.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Productions/Serie_01/Seasons/\` — Estructura de temporada actual

## Pasos

### Paso 1: Mapear la curva dramática de la temporada
Crea un mapa visual de los 10 episodios de la temporada. Para cada episodio, registra: nivel de tensión narrativa (1-10), eventos de plot major, momentos de revelación de personaje, beats emocionales clave, y tipo de episodio (acción, transición, giro, resolución). Cuando el mapa está completo, la curva dramática es visible. Una temporada bien ritmada tiene una curva con ascensos, mesetas calculadas, y un clímax claramente ubicado. Una temporada con problemas de ritmo mostrará aplanamiento, picos mal distribuidos, o ausencia de estructura reconocible.

### Paso 2: Identificar el tipo de problema de ritmo
Los problemas de ritmo de temporada tienen patrones reconocibles. Diagnostica cuál aplica: ritmo lento (la tensión no escala, demasiados episodios de transición seguidos, plot que avanza poco por episodio), ritmo apresurado (revelaciones y giros llegan sin preparación suficiente, arcos emocionales no tienen espacio para respirar), desbalanceado (los primeros episodios son lentos y los últimos se aceleran o viceversa), o episodios aislados que rompen el ritmo del conjunto. Cada tipo requiere una intervención diferente.

### Paso 3: Revisar la función de cada episodio en la temporada
Cada episodio debe tener una función clara dentro del arco de temporada. Revisa cada uno contra la pregunta: ¿Qué hace avanzar este episodio que no podría omitirse sin dañar la temporada? Si un episodio no tiene una respuesta clara, es candidato a condensarse con otro o a recibir una función más definida. Consulta \`Knowledge/Storytelling/estructura.md\` para recordar las funciones clásicas de episodios en una temporada: establecimiento, escalada, giro de mitad, profundización, clímax, resolución.

### Paso 4: Redistribuir los beats de tensión
Con el diagnóstico del Paso 2 y la revisión del Paso 3, rediseña la distribución de tensión de la temporada. Si la temporada es lenta, identifica dónde introducir revelaciones, complicaciones o giros que hoy no existen. Si es apresurada, identifica dónde añadir episodios de respiración que profundicen personajes antes de los giros grandes. Si está desbalanceada, reasigna qué sucede en qué episodio. El objetivo es una curva que asciende con variaciones, no de forma linear, pero sí con dirección clara hacia el clímax de temporada.

### Paso 5: Revisar el ritmo interno de los episodios problemáticos
Una temporada puede tener buena estructura macro pero episodios individuales que la dañan con su ritmo interno. Identifica los episodios que más contribuyen al problema de ritmo percibido y revisa su estructura interna: ¿El acto uno establece lo necesario sin extenderse? ¿El acto dos tiene al menos un giro o complicación? ¿El acto tres resuelve y planta lo suficiente para el siguiente episodio? Un episodio bien estructurado internamente puede estar en la posición equivocada en la temporada; uno mal estructurado daña el ritmo independientemente de dónde esté.

### Paso 6: Verificar el ritmo emocional junto al ritmo narrativo
El ritmo de una temporada no es solo cuándo suceden los eventos, sino cuándo la audiencia siente qué. Una temporada puede tener eventos bien distribuidos pero emociones mal distribuidas: demasiado tiempo en el mismo estado emocional, ausencia de momentos de alivio antes de las cargas más fuertes, o revelaciones emocionales que llegan antes de que la audiencia esté preparada para recibirlas. Consulta \`Knowledge/Storytelling/emocion.md\` y verifica que la curva emocional de la temporada tiene variación deliberada y no solo variación accidental.

### Paso 7: Documentar el plan de corrección y ejecutar por fases
Redacta un plan de corrección que liste: qué episodios requieren reescritura, qué episodios requieren ajustes menores, si algún episodio debe reposicionarse en el orden de temporada, y qué material nuevo debe crearse para rellenar huecos de ritmo. Prioriza las correcciones por impacto en el ritmo percibido y por costo de producción. Ejecuta en fases: primero los cambios de estructura (posición de episodios, adición/eliminación de beats), luego los cambios de contenido (reescrituras y ajustes de guion).

## Entregable
Mapa de curva dramática de la temporada (antes y después), diagnóstico tipificado del problema de ritmo, tabla de función de cada episodio en la temporada, plan de redistribución de beats de tensión y emociones, y plan de corrección priorizado con estimación de impacto.

## Criterios de aprobación
- La curva dramática revisada muestra ascenso con variaciones hacia un clímax identificable.
- Cada episodio tiene una función definida en la temporada que no es redundante con sus vecinos.
- Los momentos de respiración emocional están antes de los beats más intensos, no después.
- El plan de corrección distingue entre cambios estructurales y cambios de contenido.
- La temporada revisada puede describirse en un pitch de una oración que capture su arco emocional completo.

## Errores comunes
- Agregar más eventos y giros para "acelerar" una temporada lenta, cuando el problema es que los eventos existentes no tienen peso emocional suficiente.
- Corregir el ritmo de episodios individuales sin considerar su posición en la temporada como sistema.
- Ignorar el ritmo emocional y trabajar solo la distribución de eventos de plot.
- Cambiar el orden de episodios sin verificar que las dependencias narrativas y de continuidad no se rompen.
`,
    knowledgeRefs: ['Knowledge/Storytelling/tono.md', 'Knowledge/Storytelling/emocion.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'cambiar_estilo',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Cambiar Estilo Visual',
    description: 'Pivotar la estética de la serie cuando el estilo actual no funciona.',
    content: `# Cambiar Estilo Visual

> Pivotar la estética de la serie cuando el estilo actual no funciona.

## Objetivo
Transformar la dirección de arte de la serie de manera planificada y coherente, resolviendo los problemas del estilo actual mientras se preserva la identidad reconocible del proyecto.

## Cuándo usar este workflow
- Cuando el estilo visual no comunica el tono de la serie correctamente.
- Cuando la audiencia no conecta con la estética a pesar de la calidad narrativa.
- Cuando el estilo actual limita la expresividad que la historia necesita.
- Cuando una nueva temporada requiere una evolución visual que refleje cambios narrativos.
- Cuando el pipeline de producción no puede sostener el estilo actual de forma consistente.

## Archivos de referencia
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Visual/paleta.md\`
- \`Knowledge/Visual/composicion.md\`
- \`Knowledge/Branding/identidad.md\`
- \`Knowledge/Storytelling/tono.md\`

## Pasos

### Paso 1: Diagnosticar por qué el estilo actual no funciona
Sé específico sobre el problema. ¿El estilo es demasiado infantil para la historia que se cuenta? ¿Es demasiado complejo para mantener consistencia en producción? ¿No comunica la emoción correcta? ¿La paleta de colores no funciona en pantallas pequeñas? Documenta el diagnóstico con comparaciones concretas: "Esto es lo que tenemos; esto es lo que necesitamos; esta es la distancia entre ambos." Sin diagnóstico claro, el cambio será aleatorio.

### Paso 2: Definir la estética objetivo
Consulta \`Knowledge/Visual/estilo.md\` y describe el estilo deseado con precisión. Reúne referencias visuales de diversas fuentes: otras series, ilustración, arte, fotografía, cine. Crea un moodboard que capture la sensación del nuevo estilo. No copies un referente; extrae principios. Define los adjetivos visuales de la nueva dirección: ¿geométrico o orgánico? ¿limpio o texturado? ¿saturado o apagado? ¿detallado o minimalista?

### Paso 3: Verificar la alineación con el tono narrativo
Consulta \`Knowledge/Storytelling/tono.md\` y verifica que el nuevo estilo comunica el tono de la serie. Si la serie es melancólica, el estilo debe sentirse melancólico. Si es frenética, el estilo debe transmitir energía. El estilo visual no es decoración; es comunicación. Si hay tensión entre el tono narrativo y el estilo visual, la serie se siente inconsistente aunque cada elemento individual sea bueno.

### Paso 4: Planificar la estrategia de transición
Decide cómo se implementa el cambio. Transición gradual: cambios pequeños episodio a episodio hasta llegar al nuevo estilo. Transición por temporada: estilo nuevo a partir de la nueva temporada. Transición narrativa: un evento en la historia justifica el cambio visual. Transición directa: cambio completo sin explicación. Cada estrategia tiene riesgos diferentes. La gradual puede pasar desapercibida; la directa puede ser chocante. Elige según la magnitud del cambio.

### Paso 5: Actualizar la guía de estilo completa
Reescribe la guía de estilo visual con el nuevo lenguaje. Incluye: proporciones de personajes, grosor de línea, tratamiento de sombras, paleta de colores actualizada, estilo de fondos, tratamiento de efectos especiales, y reglas de composición. Cada regla debe tener un ejemplo visual del "antes" y el "después". La guía debe ser tan clara que un artista nuevo pueda entender el estilo sin explicación verbal.

### Paso 6: Reentrenar el pipeline visual
Identifica qué procesos de producción cambian con el nuevo estilo. ¿Cambian los pinceles digitales? ¿El proceso de coloreado? ¿El estilo de animación? Planifica sesiones de entrenamiento para el equipo. Crea ejercicios prácticos donde los artistas practiquen el nuevo estilo en escenas de la serie. No asumas que el equipo adoptará el cambio automáticamente; dale tiempo y herramientas para adaptarse.

### Paso 7: Producir un episodio piloto visual
Antes de comprometerse con el cambio a escala completa, produce un episodio o una secuencia completa en el nuevo estilo. Evalúa: ¿se mantiene la calidad? ¿El equipo puede producir de forma consistente? ¿El estilo funciona en escenas de acción, drama y comedia? ¿Los personajes son reconocibles? Este piloto es la prueba de concepto. Si falla, revisa antes de escalar.

### Paso 8: Comunicar el cambio a la audiencia
Si el cambio de estilo es significativo, prepara a la audiencia. Esto puede incluir: material detrás de cámaras mostrando la evolución, comunicación directa explicando la decisión, material de transición que familiarice con el nuevo look. La audiencia puede resistir el cambio inicial pero aceptarlo si entiende la razón. Nunca cambies sin preparación y esperes que nadie lo note.

## Entregable
Paquete de cambio de estilo que incluya: diagnóstico del estilo actual con problemas específicos, moodboard y definición del estilo objetivo, guía de estilo actualizada con ejemplos antes/después, plan de transición con cronograma, plan de entrenamiento del equipo, episodio piloto visual, y estrategia de comunicación a la audiencia.

## Criterios de aprobación
- [ ] El diagnóstico del problema es específico y documentado con evidencia.
- [ ] El nuevo estilo está definido con referencias y principios claros.
- [ ] El estilo nuevo comunica el tono narrativo correctamente.
- [ ] La guía de estilo está actualizada con ejemplos visuales.
- [ ] El equipo ha sido entrenado y puede producir consistentemente.
- [ ] El episodio piloto demuestra viabilidad del nuevo estilo.
- [ ] Hay una estrategia de comunicación para la audiencia.

## Errores comunes en este proceso
- Cambiar de estilo sin diagnosticar por qué el actual no funciona, repitiendo el mismo error.
- Copiar el estilo de una serie exitosa sin entender por qué funciona para esa serie específica.
- No verificar que el nuevo estilo es sostenible en producción a escala.
- Hacer el cambio sin entrenar al equipo, causando inconsistencia y frustración.
- Ignorar la reacción de la audiencia al cambio.
- No producir un piloto visual y comprometerse con un estilo que falla en la práctica.
- Cambiar el estilo sin actualizar la guía, dejando al equipo sin referencia clara.
`,
    knowledgeRefs: ['Knowledge/Visual/paleta.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Visual/composicion.md', 'Knowledge/Visual/estilo.md', 'Knowledge/Storytelling/tono.md'],
  },
  {
    id: 'pivotar_concepto',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Pivotar Concepto de Serie',
    description: '',
    content: `# Pivotar Concepto de Serie

**Objetivo:** Ejecutar un cambio mayor de dirección creativa preservando lo que ya funciona y minimizando el daño a lo producido.

**Cuándo usar:** Cuando el concepto original de la serie ha probado ser inviable, el mercado requiere una reorientación significativa, o el equipo creativo identifica que la premisa fundamental no puede sostener 50 episodios. No usar ante problemas que un reescritura de arco o ajuste de tono pueda resolver.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — Principios inviolables que deben sobrevivir el pivote
- \`Productions/Serie_01/Bible/\` — Biblia completa a revisar
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Worldbuilding/\` — Todo el material de mundo construido

## Pasos

### Paso 1: Auditar el concepto actual con honestidad radical
Antes de pivotar, entiende exactamente qué está roto. Prepara un documento de diagnóstico con tres columnas: qué funciona (personajes, mundo, dinámicas, momentos), qué no funciona (premisa, formato, tono, arcos), y qué no se ha probado todavía. Entrevista a cada miembro del equipo por separado para obtener perspectivas no filtradas. No se puede pivotar hacia algo mejor si no se entiende con precisión qué falló del original. El diagnóstico debe ser brutal, específico, y sin defensas del trabajo anterior.

### Paso 2: Definir los activos no negociables
Lista los elementos del concepto actual que tienen valor probado y que el pivote debe preservar. Estos pueden ser: un personaje que resuena, una dinámica de relación que funciona, un aspecto del mundo que es distintivo, una línea temática que tiene potencia. Consulta \`CONSTITUTION.md\` para identificar qué principios del estudio deben mantenerse independientemente de hacia dónde vaya el pivote. Los activos no negociables son el puente entre lo viejo y lo nuevo; sin ellos el pivote es simplemente empezar de cero.

### Paso 3: Explorar tres direcciones posibles de pivote
Genera al menos tres direcciones sustancialmente diferentes hacia donde podría ir la serie. Cada dirección debe: preservar los activos no negociables, resolver el problema diagnosticado en el Paso 1, y ser viable de producir con los recursos disponibles. Evita enamorarte de la primera idea que aparezca. La segunda y tercera dirección suelen ser más originales porque obligan a salir de lo obvio. Documenta cada dirección con su premisa, tono, estructura de temporada, y qué cambia respecto al concepto actual.

### Paso 4: Evaluar el impacto en producción existente
Para cada dirección explorada en el Paso 3, evalúa qué trabajo ya producido se puede reutilizar y qué se descarta. Cuantifica: episodios escritos que sobreviven, diseños de personaje que son compatibles, assets de animación reutilizables, material de mundo aprovechable. El pivote con menor costo no es siempre el correcto, pero el costo debe conocerse antes de decidir. Un pivote que descarta el 90% del trabajo puede ser la decisión correcta, pero debe tomarse conscientemente y con los ojos abiertos.

### Paso 5: Seleccionar la dirección y rediseñar la Biblia
Elige la dirección del pivote basándote en la combinación de potencia creativa e impacto en producción. Una vez elegida, rediseña la Biblia de la serie: nueva premisa, nuevos arcos de temporada, revisión de personajes, ajustes de mundo. Consulta \`Knowledge/Storytelling/estructura.md\` para asegurar que la nueva estructura de la serie tiene solidez narrativa. La Biblia pivotada debe estar tan desarrollada como la original antes de comunicar el cambio al equipo.

### Paso 6: Diseñar el plan de transición
Planifica cómo se ejecuta el pivote en producción real. Define: qué se para, qué continúa, cuál es el nuevo punto de inicio, cómo se reutiliza el trabajo existente, y cuál es el calendario revisado. Si la serie ya tiene episodios publicados, planifica cómo la nueva dirección puede presentarse de forma que el pivot se sienta como una evolución natural y no una contradicción. La transición mal planificada puede dañar la confianza de la audiencia y desmoralizar al equipo.

### Paso 7: Comunicar y ejecutar
Presenta el pivote al equipo completo con honestidad total: qué se diagnosticó, por qué se pivota, qué nueva dirección se tomó, y qué significa para cada área de producción. Reconoce explícitamente el trabajo que se descarta y su valor. Un equipo que entiende el porqué del pivote puede comprometerse con la nueva dirección; uno que lo recibe sin contexto lo resiste. Actualiza todos los documentos del sistema: Biblia, Memoria Visual, calendarios de producción, y documentos de referencia.

### Paso 8: Documentar el pivote como lección institucional
Registra el pivote completo en un documento de post-diagnóstico: cuál era el concepto original, qué señales tempranas se ignoraron, cuándo se confirmó el problema, qué se intentó antes del pivote, y cómo se tomó la decisión final. Este documento es conocimiento institucional del estudio. Los pivotes son costosos; documentar su causa raíz previene que el estudio repita el mismo error en la próxima producción.

## Entregable
Biblia de la serie revisada con nueva premisa y arcos de temporada, documento de diagnóstico del concepto original, mapa de activos preservados y descartados, plan de transición de producción con calendario, y documento institucional de lecciones del pivote.

## Criterios de aprobación
- El diagnóstico identifica la causa raíz del problema, no solo síntomas superficiales.
- Los activos no negociables están preservados y visibles en el nuevo concepto.
- La nueva Biblia tiene al menos la misma profundidad de desarrollo que la original.
- El plan de transición es realista y tiene en cuenta el trabajo ya producido.
- El equipo ha recibido la comunicación con contexto completo y tiene claridad sobre los próximos pasos.

## Errores comunes
- Pivotar reactivamente ante la primera crítica sin esperar a tener un diagnóstico sólido.
- Descartar todo el trabajo anterior sin identificar primero qué tiene valor real.
- Elegir la nueva dirección por entusiasmo y no por análisis de su viabilidad narrativa y de producción.
- Comunicar el pivote como un cambio de plan sin reconocer el trabajo descartado, dañando la moral del equipo.
`,
    knowledgeRefs: ['Knowledge/Storytelling/tono.md', 'Knowledge/Worldbuilding/', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'redisenar_personaje',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Rediseñar Personaje',
    description: 'Cambiar lo visual o la personalidad de un personaje sin perder su esencia.',
    content: `# Rediseñar Personaje

> Cambiar lo visual o la personalidad de un personaje sin perder su esencia.

## Objetivo
Modificar el diseño visual, la personalidad o ambos aspectos de un personaje existente de manera que resuelva los problemas identificados mientras preserva los elementos que hacen reconocible y querido al personaje.

## Cuándo usar este workflow
- Cuando un personaje no conecta visualmente con la audiencia a pesar de tener buen papel narrativo.
- Cuando la personalidad de un personaje se siente inconsistente o poco definida.
- Cuando el estilo de la serie evoluciona y el personaje necesita actualizarse.
- Cuando feedback consistente indica que algo no funciona en el personaje.
- Cuando un personaje necesita madurar visualmente para reflejar su evolución narrativa.

## Archivos de referencia
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Characters/evolucion.md\`
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Visual/paleta.md\`
- \`Knowledge/Visual/estilo.md\`
- \`Knowledge/Branding/identidad.md\`

## Pasos

### Paso 1: Diagnosticar qué necesita cambiar y por qué
Identifica el problema específico. No rediseñes por aburrimiento; rediseña porque algo no funciona. ¿El diseño visual no comunica la personalidad? ¿La personalidad no genera interés? ¿El personaje es visualmente confundible con otro? ¿La audiencia no conecta? Documenta el problema con evidencia concreta: qué feedback se ha recibido, qué métricas lo indican, qué observaciones internas lo confirman.

### Paso 2: Definir qué debe permanecer intacto
Antes de cambiar nada, identifica la esencia del personaje: los elementos que lo hacen ser él. Esto puede incluir: un rasgo visual icónico (cicatriz, color de pelo, accesorio), un patrón de comportamiento definitorio, una forma de hablar, una relación clave. Consulta \`Knowledge/Characters/protagonistas.md\` y documenta la esencia como una lista de elementos innegociables. Si cambias la esencia, no estás rediseñando; estás creando un personaje nuevo.

### Paso 3: Rediseñar incrementalmente
No hagas un cambio radical de una vez. Diseña tres versiones: cambio mínimo (ajuste sutil), cambio moderado (evolución visible), cambio máximo (transformación significativa). Evalúa cada versión contra el problema original y contra la esencia definida en el paso anterior. El cambio mínimo que resuelve el problema es generalmente el mejor. Los cambios radicales desorientan a la audiencia existente y deben reservarse para situaciones extremas.

### Paso 4: Probar el reconocimiento
Muestra las opciones de rediseño a personas familiarizadas con el personaje sin contexto previo. Pregunta: ¿sabes quién es este personaje? Si no lo reconocen, has cambiado demasiado. Pregunta: ¿qué sientes al verlo? Si la emoción es diferente a la intención, el rediseño falla emocionalmente aunque funcione visualmente. El personaje debe seguir siendo reconocible en silueta, en miniatura y en contexto narrativo.

### Paso 5: Verificar la coherencia narrativa
Consulta \`Knowledge/Characters/evolucion.md\` y verifica que el rediseño sea coherente con la historia del personaje. Si el personaje ha pasado por eventos traumáticos, quizá un aspecto más endurecido tiene sentido. Si ha encontrado paz, quizá un diseño más suave. El rediseño no ocurre en el vacío; debe reflejar o al menos ser compatible con la trayectoria narrativa del personaje. Un cambio sin justificación diegética se siente arbitrario.

### Paso 6: Actualizar toda la documentación visual
Una vez aprobado el rediseño, actualiza todas las hojas de modelo, guías de expresión, paleta de color del personaje, y referencias de animación. Consulta \`Knowledge/Visual/estilo.md\` y asegúrate de que el personaje rediseñado sigue encajando en el elenco visual de la serie. Distribuye la nueva referencia a todo el equipo de producción. Un rediseño aprobado pero no comunicado causa inconsistencias en producción.

### Paso 7: Planificar la transición para la audiencia
Si el rediseño es visible para la audiencia, decide cómo presentarlo. Opciones: transición narrativa (el personaje cambia por una razón dentro de la historia), transición gradual (pequeños cambios episodio a episodio), transición directa (nuevo diseño a partir de la nueva temporada). Cada estrategia tiene pros y contras. La transición narrativa es la más elegante; la directa es la más limpia; la gradual es la menos disruptiva.

## Entregable
Paquete de rediseño que incluya: diagnóstico del problema original, lista de esencia innegociable, tres opciones de rediseño (mínimo/moderado/máximo), resultados de pruebas de reconocimiento, justificación narrativa del cambio, hojas de modelo actualizadas, y plan de transición para la audiencia.

## Criterios de aprobación
- [ ] El problema original está claramente diagnosticado con evidencia.
- [ ] La esencia del personaje está definida y preservada en el rediseño.
- [ ] El personaje es reconocible después del cambio.
- [ ] El rediseño es coherente con la evolución narrativa del personaje.
- [ ] Toda la documentación visual está actualizada.
- [ ] Hay un plan de transición para la audiencia.
- [ ] El rediseño resuelve el problema identificado sin crear nuevos problemas.

## Errores comunes en este proceso
- Rediseñar por aburrimiento del equipo en lugar de por un problema real.
- Cambiar tanto que el personaje pierde su esencia y deja de ser reconocible.
- No definir qué es innegociable antes de empezar, perdiendo la brújula durante el proceso.
- Hacer el rediseño sin justificación narrativa, causando una ruptura en la inmersión.
- No actualizar toda la documentación, causando que el equipo use referencias obsoletas.
- Ignorar la reacción de la audiencia al cambio y no planificar la transición.
- Confundir "diferente" con "mejor"; un diseño nuevo no es automáticamente superior.
`,
    knowledgeRefs: ['Knowledge/Visual/paleta.md', 'Knowledge/Branding/identidad.md', 'Knowledge/Characters/protagonistas.md', 'Knowledge/Visual/estilo.md', 'Knowledge/Characters/antagonistas.md', 'Knowledge/Characters/evolucion.md'],
  },
  {
    id: 'reescribir_arco',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Reescribir Arco Narrativo',
    description: 'Cambiar la dirección de la historia cuando se detectan problemas fundamentales.',
    content: `# Reescribir Arco Narrativo

> Cambiar la dirección de la historia cuando se detectan problemas fundamentales.

## Objetivo
Rediseñar un arco narrativo que no funciona, preservando la inversión emocional de la audiencia en los personajes y eventos ya establecidos, mientras se corrige el rumbo hacia una dirección más fuerte.

## Cuándo usar este workflow
- Cuando un arco narrativo pierde impulso y no se puede rescatar con ajustes menores.
- Cuando la dirección de la historia contradice el tema central de la serie.
- Cuando feedback consistente indica que la audiencia pierde interés en la trama principal.
- Cuando un giro planificado ya no funciona por cambios en el contexto del proyecto.
- Cuando los escritores detectan que el arco actual lleva a un callejón sin salida narrativo.

## Archivos de referencia
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Storytelling/emocion.md\`
- \`Knowledge/Characters/evolucion.md\`
- \`Knowledge/Characters/protagonistas.md\`

## Pasos

### Paso 1: Diagnosticar qué está roto
Identifica el problema con precisión. ¿El arco no tiene tensión? ¿El conflicto no escala? ¿Los personajes no tienen suficiente en juego? ¿La resolución planificada no satisface? ¿El arco contradice el tema de la serie? No reescribas hasta que puedas articular exactamente qué falla y por qué. Un diagnóstico vago lleva a una reescritura vaga que repite los mismos errores con diferente envoltorio.

### Paso 2: Identificar los elementos salvables
Revisa todo lo que se ha producido o publicado del arco actual. Lista qué funciona: personajes que generan conexión, momentos que impactaron, setup que tiene potencial, relaciones dinámicas, escenas ya animadas o escritas que son fuertes. Estos elementos son los cimientos del arco nuevo. No tires todo; reconstruye usando lo que ya probó su valor. La audiencia ya invirtió emocionalmente en estos elementos.

### Paso 3: Rediseñar el arco preservando la inversión
Construye el nuevo arco usando los elementos salvables como puntos de anclaje. Consulta \`Knowledge/Storytelling/estructura.md\` y diseña una nueva progresión que respete lo que ya pasó en la historia. El espectador no debe sentir que perdió el tiempo con los episodios anteriores; debe sentir que aquello fue preparación para algo mejor de lo que esperaba. Recontextualiza, no invalides.

### Paso 4: Proteger la evolución de personajes
Consulta \`Knowledge/Characters/evolucion.md\` y verifica que la reescritura respeta el crecimiento que los personajes ya tuvieron. Si un personaje superó su cobardía en un episodio anterior, el arco nuevo no puede ignorar ese cambio. La reescritura puede cambiar el destino de los personajes, pero no puede borrar su viaje. Los personajes son la mayor inversión emocional de la audiencia; protégelos.

### Paso 5: Diseñar la transición del arco viejo al nuevo
Planifica cómo se pasa de la dirección actual a la nueva. El punto de transición debe sentirse natural, no como un corte abrupto. Busca un momento en la historia donde un giro creíble pueda redirigir la trama. Idealmente, este giro recontextualiza eventos anteriores de forma que el espectador piense "ahora todo tiene sentido" en vez de "olvidaron lo que pasó antes".

### Paso 6: Verificar la coherencia temática
Consulta \`Knowledge/Storytelling/tono.md\` y asegúrate de que el arco nuevo sirve al tema central de la serie. Una reescritura es la oportunidad de reconectar con el corazón temático del proyecto. Si el arco anterior se desvió del tema, el nuevo debe regresar a él con fuerza. Si el tema mismo necesita revisión, eso es una decisión diferente y más profunda que debe tomarse conscientemente.

### Paso 7: Planificar la revelación al equipo
Comunica la reescritura al equipo de producción de forma clara. Explica el diagnóstico, la solución, y qué impacto tiene en el trabajo ya realizado. Sé honesto sobre qué se descarta y qué se conserva. Un equipo que entiende la razón del cambio trabaja mejor que uno que siente que su trabajo fue en vano. Preserva la moral reconociendo el valor del trabajo anterior.

### Paso 8: Documentar las lecciones
Registra por qué el arco original falló y cómo se detectó. Esta documentación previene errores similares en el futuro. Incluye: señales de alarma que se ignoraron o detectaron tarde, decisiones que llevaron al problema, y qué se haría diferente con la experiencia ganada. Una reescritura sin aprendizaje es una oportunidad desperdiciada.

## Entregable
Documento de reescritura que incluya: diagnóstico detallado del arco problemático, lista de elementos salvables, diseño del arco nuevo con estructura completa, plan de transición escena por escena, verificación de coherencia temática y de personajes, plan de comunicación al equipo, y documento de lecciones aprendidas.

## Criterios de aprobación
- [ ] El diagnóstico identifica el problema raíz, no solo los síntomas.
- [ ] Los elementos salvables están identificados y preservados en el nuevo arco.
- [ ] El arco nuevo respeta la evolución de personajes ya establecida.
- [ ] La transición del arco viejo al nuevo se siente orgánica.
- [ ] El arco nuevo sirve al tema central de la serie.
- [ ] El equipo ha sido informado con claridad y contexto.
- [ ] Las lecciones están documentadas para prevenir errores futuros.

## Errores comunes en este proceso
- Reescribir sin diagnosticar, cambiando la historia pero repitiendo el error fundamental.
- Descartar todo lo anterior en vez de identificar qué funciona y construir sobre ello.
- Invalidar la evolución de personajes, haciendo que episodios anteriores se sientan sin sentido.
- Hacer la transición de forma abrupta, confundiendo a la audiencia.
- No comunicar el cambio al equipo, causando confusión y desmoralización.
- Reescribir reactivamente ante cada crítica en vez de esperar a tener un diagnóstico sólido.
- No documentar las lecciones, garantizando que los mismos errores se repitan en el futuro.
`,
    knowledgeRefs: ['Knowledge/Storytelling/emocion.md', 'Knowledge/Characters/protagonistas.md', 'Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/evolucion.md', 'Knowledge/Storytelling/tono.md'],
  },
  {
    id: 'rescatar_villano',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Rescatar Villano Débil',
    description: '',
    content: `# Rescatar Villano Débil

**Objetivo:** Diagnosticar por qué el antagonista no funciona y ejecutar los cambios necesarios para convertirlo en una fuerza narrativa genuina que eleve la historia.

**Cuándo usar:** Cuando el antagonista no genera amenaza creíble, cuando la audiencia no lo recuerda o no le teme, cuando parece un obstáculo mecánico más que un personaje real, cuando sus motivaciones son genéricas o incomprensibles, o cuando el protagonista resuelve el conflicto sin que el antagonista haya presentado un verdadero desafío.

**Archivos de referencia:**
- \`Knowledge/Characters/antagonistas.md\`
- \`Knowledge/Characters/evolucion.md\`
- \`Knowledge/Characters/protagonistas.md\`
- \`Knowledge/Storytelling/estructura.md\`
- \`Productions/Serie_01/Bible/\` — Función del antagonista en la Biblia

## Pasos

### Paso 1: Diagnosticar el tipo de debilidad del antagonista
Los villanos débiles fallan por razones específicas y diferentes. Identifica cuál aplica: sin motivación creíble (el antagonista quiere el mal por el mal, sin lógica interna), sin amenaza real (no pone en riesgo genuino al protagonista), sin dimensión humana (es una función narrativa, no un personaje), sin presencia (desaparece por episodios enteros y el espectador lo olvida), sin relación significativa con el protagonista (sus conflictos se sienten externos e intercambiables), o con un plan que no sostiene escrutinio (lo que intenta lograr no tiene coherencia). El diagnóstico correcto determina la intervención correcta.

### Paso 2: Revisar la relación antagonista-protagonista
Un villano no existe en aislamiento; existe en relación con el héroe. Consulta \`Knowledge/Characters/protagonistas.md\` y \`Knowledge/Characters/antagonistas.md\` y analiza: ¿El antagonista amenaza específicamente lo que el protagonista más valora? ¿El antagonista encarna la versión oscura de lo que el protagonista podría convertirse? ¿El conflicto entre ambos es personal, no solo circunstancial? Un antagonista memorable no es intercambiable; está diseñado para este protagonista específico, para atacar exactamente su punto más vulnerable. Si la relación es genérica, el villano lo será.

### Paso 3: Construir la lógica interna del antagonista
El antagonista debe tener una perspectiva coherente desde la cual sus acciones tienen sentido. Escribe un documento de "la historia desde el punto de vista del villano" donde él es el protagonista de su propia narrativa y sus acciones son justificadas desde su lógica. Esto no significa que tenga razón, sino que cree tener razón. Un villano con lógica interna sólida puede defender sus acciones de forma que resulte inquietante porque no es completamente descartable. Si no puedes escribir esa historia de forma convincente, la lógica del antagonista está rota.

### Paso 4: Diseñar al menos un momento de humanización genuina
El antagonista necesita al menos un momento por temporada donde el espectador lo entiende, no lo aprueba pero lo comprende. Este momento puede ser: una memoria que explica su formación, una pérdida que define su postura, una interacción con alguien a quien aprecia que revela que hay algo humano dentro, o un instante de duda que muestra que su certeza tiene grietas. La humanización no debilita al villano; lo hace más aterrador porque revela que el camino al que tomó estaba disponible para cualquiera.

### Paso 5: Elevar la amenaza de forma concreta
Si el antagonista no genera amenaza real, necesita victorias. Revisa la estructura de la temporada y planifica momentos donde el antagonista gane: planes que funcionan, protagonista que fracasa por causas directamente atribuibles al antagonista, consecuencias reales para personajes queridos. Un villano que nunca gana no es amenaza. Las victorias del antagonista deben doler al espectador emocionalmente, no solo como movimientos de tablero. Consulta \`Knowledge/Storytelling/estructura.md\` para ubicar estos momentos en los puntos de mayor impacto de la temporada.

### Paso 6: Revisar y ajustar el material existente
Con el diagnóstico y la nueva construcción del antagonista, revisa el material ya escrito o producido. Identifica las escenas del antagonista que deben ser reescritas, las que pueden ajustarse con cambios de diálogo o intención, y las que pueden conservarse. Prioriza la corrección de las primeras apariciones del antagonista, porque el espectador forma su impresión inicial en esos momentos y es muy difícil corregirla después. Una primera aparición fuerte del antagonista establece la amenaza para toda la temporada.

### Paso 7: Integrar al antagonista en la estructura de episodios
Un antagonista olvidable suele estar ausente de la narrativa por episodios enteros. Diseña un plan de presencia: en qué episodios el antagonista aparece, qué hace en cada aparición que avanza su plan y amenaza al protagonista, y cómo su sombra se siente incluso en episodios donde no aparece físicamente. El antagonista debe sentirse como una fuerza activa que moldea el mundo de la serie, no como un jefe final que aparece al final de la temporada después de estar ausente.

## Entregable
Diagnóstico tipificado de la debilidad del antagonista, documento de lógica interna del antagonista desde su propia perspectiva, plan de humanización con escenas específicas, mapa de victorias y presencia del antagonista en la temporada, y lista de material existente con clasificación de correcciones necesarias.

## Criterios de aprobación
- La lógica interna del antagonista es coherente y puede articularse en una oración desde su perspectiva.
- El conflicto antagonista-protagonista es personal y específico, no genérico ni intercambiable.
- El antagonista tiene al menos una victoria significativa que el espectador siente emocionalmente.
- Hay al menos un momento de humanización que complica la relación emocional del espectador con el villano.
- El antagonista tiene presencia activa en la estructura de la temporada, no solo al final.

## Errores comunes
- Añadir crueldad gratuita para crear amenaza, en lugar de profundidad y lógica que hagan al antagonista genuinamente inquietante.
- Humanizar al antagonista tanto que deje de funcionar como fuerza de conflicto, diluyendo la tensión narrativa.
- Hacer que el antagonista pierda siempre hasta el clímax, en lugar de darle victorias intermedias que construyan su credibilidad.
- Diseñar al antagonista en aislamiento sin verificar que su relación con el protagonista es el corazón del conflicto.
`,
    knowledgeRefs: ['Knowledge/Storytelling/estructura.md', 'Knowledge/Characters/antagonistas.md', 'Knowledge/Characters/evolucion.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'resolver_tono',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Resolver Problema de Tono',
    description: '',
    content: `# Resolver Problema de Tono

**Objetivo:** Unificar el tono de una serie que oscila entre registros incompatibles hasta dañar la coherencia emocional del proyecto.

**Cuándo usar:** Cuando episodios de la misma serie se sienten como si pertenecieran a shows diferentes, cuando la audiencia no sabe qué esperar emocionalmente, cuando el humor y la gravedad se cancelan mutuamente en lugar de enriquecerse, o cuando el equipo creativo produce contenido en tonos contradictorios sin darse cuenta.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — El tono fundamental del estudio
- \`Productions/Serie_01/Bible/\` — Tono declarado en la Biblia
- \`Knowledge/Storytelling/tono.md\`
- \`Knowledge/Storytelling/emocion.md\`
- \`Knowledge/Storytelling/estructura.md\`

## Pasos

### Paso 1: Mapear el espectro tonal actual
Revisa los episodios y scripts existentes y clasifica cada uno por tono dominante. Usa un espectro simple: muy ligero / ligero / neutro / grave / muy grave. Incluye también subdimensiones: ¿es el humor absurdo o costumbrista? ¿la gravedad es épica o íntima? Visualiza el resultado en un gráfico de episodios por tono. Cuando el patrón es visible, el problema se vuelve analizable. Un problema de tono que no se puede mapear no se puede resolver.

### Paso 2: Identificar la fuente del problema tonal
El tono inconsistente tiene causas concretas. Las más comunes: diferentes escritores con registros distintos sin documento de tono unificador, presión externa de revisores que piden "más humor" o "más emoción" en momentos diferentes, personajes cuya voz permite múltiples tonos sin que se haya definido cuál es el correcto para la serie, o una Biblia que declara el tono de forma ambigua. Identifica cuál es la fuente real. Tratar el síntoma (los episodios inconsistentes) sin atacar la causa (por qué se produjeron) garantiza que el problema regrese.

### Paso 3: Definir el tono maestro de la serie
Consulta \`Knowledge/Storytelling/tono.md\` y redacta una declaración de tono que pueda usarse como piedra de toque para cada decisión creativa. Esta declaración debe: nombrar el tono central, definir cómo conviven el humor y la gravedad en la serie, dar ejemplos de referencias externas (series, películas, libros) que tienen el tono correcto, y dar ejemplos de referencias que están fuera del tono. Una declaración de tono útil no solo describe, sino que permite al equipo reconocer qué entra y qué no.

### Paso 4: Revisar la Biblia y documentos de personaje
Con la declaración de tono definida, revisa todos los documentos fundacionales: Biblia de la serie, perfiles de personaje, guías de episodio. Marca dónde el lenguaje descriptivo permite o implica tonos fuera del rango correcto. Corrige esos documentos para que la declaración de tono sea consistente en todo el sistema. Si la Biblia dice "ligero y divertido" en un apartado y "oscuro y emocional" en otro sin explicar la relación, el equipo producirá contenido en ambos extremos y ambos creerán estar siguiendo la Biblia.

### Paso 5: Auditar y corregir el material existente
Regresa al mapa tonal del Paso 1 e identifica los episodios y escenas que están fuera del rango correcto. Clasifícalos en tres grupos: episodios que se pueden corregir con ajustes de diálogo y escenas puntuales, episodios que requieren reescritura significativa, y episodios que están tan fuera de tono que deben reconsiderarse. No intentes corregir todo simultáneamente; prioriza el material que aún está en pre-producción o producción temprana, donde el costo de corrección es menor.

### Paso 6: Crear una guía de tono operativa
Transforma la declaración de tono en una herramienta práctica para el equipo: la Guía de Tono. Incluye: el espectro tonal de la serie con sus límites, cómo cada personaje principal habita el tono, qué tipos de escenas anclan el tono y cuáles lo amenazan, ejemplos concretos de diálogos en tono vs. fuera de tono, y una lista de preguntas de diagnóstico que cualquier escritor puede usar antes de entregar un guion. Esta guía entra al sistema de referencia como documento vivo.

### Paso 7: Implementar revisión tonal en el proceso de producción
Añade una verificación de tono explícita al proceso de revisión de guiones. Cada guion debe pasar por la pregunta: "¿Este episodio, en su tono, pertenece a la misma serie que el episodio anterior y el siguiente?" Asigna a un miembro del equipo como guardián de tono con autoridad para señalar desviaciones antes de que lleguen a producción. Los problemas de tono son exponencialmente más costosos de corregir en animación que en guion.

## Entregable
Documento de declaración de tono maestro, Biblia revisada con lenguaje tonal consistente, Guía de Tono operativa para el equipo, mapa de episodios con clasificación tonal y plan de corrección, y protocolo de revisión tonal integrado al workflow de producción.

## Criterios de aprobación
- La declaración de tono permite al equipo tomar decisiones sin ambigüedad.
- El material existente ha sido auditado y tiene un plan de corrección priorizado.
- La Guía de Tono incluye ejemplos concretos, no solo descripción abstracta.
- El proceso de producción tiene un punto de verificación tonal explícito.
- El equipo puede articular el tono de la serie con las mismas palabras sin consultarse entre sí.

## Errores comunes
- Definir el tono como "equilibrio entre humor y emoción" sin especificar cómo se relacionan, lo cual no resuelve nada.
- Corregir episodios ya animados antes de corregir los documentos fundacionales, garantizando que el problema se repita en el material nuevo.
- Intentar que la serie abarque un rango tonal demasiado amplio por miedo a limitar la creatividad del equipo.
- Tratar el problema de tono como un problema individual de un escritor en lugar de como un fallo sistémico de los documentos de referencia.
`,
    knowledgeRefs: ['Knowledge/Storytelling/tono.md', 'Knowledge/Storytelling/emocion.md', 'Knowledge/Storytelling/estructura.md'],
  },
  {
    id: 'retirar_personaje',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Retirar Personaje',
    description: 'Sacar a un personaje de la serie de forma narrativamente satisfactoria.',
    content: `# Retirar Personaje

> Sacar a un personaje de la serie de forma narrativamente satisfactoria.

## Objetivo
Diseñar la salida de un personaje de manera que honre su trayectoria, genere impacto emocional proporcional a su importancia, cierre sus hilos narrativos y llene el vacío que deja en la dinámica de la serie.

## Cuándo usar este workflow
- Cuando un personaje ha completado su arco y mantenerlo diluiría su historia.
- Cuando la narrativa requiere la partida o muerte de un personaje para avanzar.
- Cuando un personaje ya no aporta al elenco y su presencia se siente forzada.
- Cuando decisiones de producción requieren reducir el elenco.
- Cuando el actor de voz ya no está disponible y el personaje no puede recastearse.

## Archivos de referencia
- \`Knowledge/Characters/evolucion.md\`
- \`Knowledge/Storytelling/emocion.md\`
- \`Knowledge/Storytelling/estructura.md\`
- \`Knowledge/Characters/protagonistas.md\`

## Pasos

### Paso 1: Diseñar el arco de despedida
El personaje merece un arco final que culmine su historia. No lo elimines en un instante; dale un recorrido final que recapitule quién es y cuánto ha crecido. Consulta \`Knowledge/Characters/evolucion.md\` y diseña un mini-arco que funcione como resumen emocional de todo el viaje del personaje. Este arco debe sentirse como la conclusión natural de su historia, no como una decisión administrativa.

### Paso 2: Cerrar los hilos pendientes del personaje
Lista todos los hilos narrativos asociados al personaje: relaciones inconclusas, promesas no cumplidas, conflictos internos en progreso, secretos no revelados. Decide cuáles se cierran antes de la partida y cuáles se dejan como legado para otros personajes. Cada hilo cerrado debe tener una resolución satisfactoria. Cada hilo dejado como legado debe transferirse explícitamente a otro personaje.

### Paso 3: Crear el impacto emocional proporcional
Consulta \`Knowledge/Storytelling/emocion.md\` y diseña el momento de la partida para generar el nivel de emoción adecuado. Un personaje principal que estuvo desde el episodio uno necesita un momento devastador. Un personaje secundario que estuvo una temporada necesita un momento conmovedor. No subestimes ni sobredimensiones la emoción. La audiencia sabe cuánto debería doler y lo nota si no coincide.

### Paso 4: Permitir que otros personajes reaccionen
La partida de un personaje afecta a todos los que lo rodean. Diseña cómo reacciona cada personaje principal: quién sufre, quién se enfada, quién crece por la ausencia. Estas reacciones son tan importantes como la partida misma. Dan a la audiencia permiso para sentir a través de los personajes. No apresures el duelo narrativo; dale el espacio que necesita.

### Paso 5: Manejar el apego de la audiencia
Reconoce que la audiencia tiene una relación emocional con el personaje que va más allá de la narrativa. La salida debe respetar esa relación. Evita salidas absurdas, humillantes o que trivialicen al personaje. La audiencia aceptará una salida dolorosa si es significativa; no aceptará una salida estúpida aunque sea conveniente para la trama. El personaje debe irse con dignidad.

### Paso 6: Llenar el vacío narrativo
Identifica qué funciones cumplía el personaje en la dinámica del grupo: ¿era el cómico? ¿El sabio? ¿El que generaba conflicto? Su partida deja un hueco que se siente. Decide si otro personaje absorbe esas funciones (creciendo en el proceso), si el grupo funciona diferente sin esa función, o si un nuevo personaje eventualmente la cubre. El vacío puede ser temporal y dramático; no tiene que llenarse inmediatamente.

### Paso 7: Decidir la permanencia de la ausencia
Define si la partida es definitiva o deja la puerta abierta. Si es definitiva, hazlo claro para la audiencia y el equipo. Si deja posibilidad de retorno, establece las condiciones bajo las cuales sería coherente. No prometas un retorno que no vas a cumplir, pero tampoco cierres opciones innecesariamente. La decisión debe basarse en lo que sirve mejor a la historia a largo plazo.

### Paso 8: Documentar el legado del personaje
Registra la contribución total del personaje a la serie: su arco completo, sus relaciones clave, su impacto en la trama, y las lecciones que dejó en otros personajes. Este documento sirve como referencia si el personaje es mencionado en episodios futuros. Un personaje retirado sigue existiendo en la memoria del mundo y de otros personajes; ese legado debe ser coherente cuando se invoque.

## Entregable
Plan de retiro que incluya: arco de despedida completo, lista de hilos cerrados y transferidos, diseño del momento de partida con nivel emocional calibrado, mapa de reacciones de cada personaje, análisis del vacío y plan de compensación, decisión de permanencia documentada, y ficha de legado del personaje.

## Criterios de aprobación
- [ ] El personaje tiene un arco de despedida que honra su trayectoria completa.
- [ ] Todos los hilos narrativos están cerrados o transferidos.
- [ ] El impacto emocional es proporcional a la importancia del personaje.
- [ ] Los personajes restantes reaccionan de forma auténtica y reciben espacio para ello.
- [ ] La partida es digna y respeta el apego de la audiencia.
- [ ] El vacío narrativo está identificado con un plan de compensación.
- [ ] El legado del personaje está documentado para referencia futura.

## Errores comunes en este proceso
- Eliminar a un personaje abruptamente sin darle un arco de cierre.
- No cerrar hilos narrativos, dejando preguntas sin respuesta que frustran a la audiencia.
- Trivializar la partida de un personaje importante con un momento insuficiente.
- No dar espacio a otros personajes para reaccionar al cambio.
- Dejar un vacío narrativo sin plan, desbalanceando la dinámica del elenco.
- Prometer un retorno que nunca se cumple, generando expectativas falsas.
- Hacer una salida humillante que ofende a la audiencia que quería al personaje.
`,
    knowledgeRefs: ['Knowledge/Storytelling/estructura.md', 'Knowledge/Storytelling/emocion.md', 'Knowledge/Characters/evolucion.md', 'Knowledge/Characters/protagonistas.md'],
  },
  {
    id: 'revitalizar_serie',
    phase: '08_Iteracion',
    phaseName: 'Iteración',
    phaseIcon: '🔄',
    phaseColor: '#ef9a9a',
    title: 'Revitalizar Serie Estancada',
    description: '',
    content: `# Revitalizar Serie Estancada

**Objetivo:** Diagnosticar por qué una serie perdió momentum creativo o de producción y ejecutar las acciones necesarias para recuperar energía, dirección, y propósito en el equipo y el proyecto.

**Cuándo usar:** Cuando la producción se siente mecánica y sin entusiasmo, cuando los episodios se producen pero no emocionan al equipo ni a la audiencia, cuando la serie ha perdido su sentido de propósito, cuando el equipo trabaja en piloto automático, o cuando cada nuevo episodio se parece demasiado al anterior sin evolución perceptible.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — El propósito original del estudio y la serie
- \`Productions/Serie_01/Bible/\` — Visión original de la serie
- \`Knowledge/Storytelling/\` — Todos los archivos de narrativa
- \`REVIEW_SYSTEM.md\` — Para diagnóstico de calidad sistemático

## Pasos

### Paso 1: Distinguir entre estancamiento creativo y estancamiento de producción
El estancamiento tiene dos formas que se parecen pero requieren intervenciones distintas. El estancamiento creativo ocurre cuando las ideas se han agotado, el equipo repite fórmulas, y la serie no tiene nada nuevo que decir. El estancamiento de producción ocurre cuando el proceso es tan pesado, lento, o frustrante que el equipo pierde energía aunque las ideas estén bien. Diagnostica cuál es el problema dominante, porque tratar un problema de proceso con inyecciones creativas no funciona, y viceversa.

### Paso 2: Regresar a la visión original
Saca la Biblia original y \`CONSTITUTION.md\` y léelos como si fuera la primera vez. Pregunta: ¿Cuál era el propósito de esta serie? ¿Qué quería decir? ¿Qué tipo de experiencia quería crear para la audiencia? ¿Estamos todavía haciendo esa serie, o nos desviamos sin darnos cuenta? Muchas series se estancan no porque la visión sea mala sino porque la presión de producción las alejó gradualmente de lo que las hacía especiales. El diagnóstico más común es que la serie se volvió competente pero perdió su alma.

### Paso 3: Hacer un diagnóstico de calidad con REVIEW_SYSTEM.md
Toma los últimos tres episodios producidos y evalúalos sistemáticamente usando \`REVIEW_SYSTEM.md\`. Registra los puntajes en las seis dimensiones. Compara con los primeros episodios de la serie. El diagnóstico cuantitativo revela qué dimensiones específicas decayeron: ¿El craft visual empeoró? ¿La narrativa se volvió predecible? ¿Los personajes dejaron de evolucionar? ¿El tono perdió consistencia? Un estancamiento que se siente general suele tener un origen específico cuando se mide con precisión.

### Paso 4: Identificar los factores de estancamiento específicos
Con el diagnóstico del Paso 3 y el análisis del Paso 2, lista los factores concretos que generan el estancamiento. Pueden ser narrativos (la serie agotó sus conflictos principales sin abrir nuevos), de personaje (los protagonistas dejaron de crecer), de mundo (no hay partes del mundo sin explorar), de proceso (el pipeline es tan rígido que impide la experimentación), o de equipo (la fatiga o la falta de variedad en las tareas drenó la energía). Cada factor requiere una acción específica; una lista genérica de "necesitamos más creatividad" no sirve.

### Paso 5: Diseñar inyecciones de energía específicas
Para cada factor identificado en el Paso 4, diseña una intervención concreta. Ejemplos: si la serie agotó sus conflictos, planifica la introducción de nuevos elementos de mundo o personajes que abran nuevas preguntas; si los protagonistas dejaron de crecer, diseña un episodio que los coloque en una situación que nunca enfrentaron; si el proceso es rígido, planifica un episodio experimental con libertades de formato que el equipo elija; si el equipo está fatigado, reorganiza los roles para que cada miembro trabaje en algo diferente a lo habitual. Las inyecciones de energía son más efectivas cuando son específicas al problema diagnosticado.

### Paso 6: Planificar la evolución de la serie hacia adelante
Una serie revitalizada no regresa al punto donde estaba; avanza hacia algo nuevo que contiene lo mejor de lo que fue. Diseña la dirección de las próximas dos temporadas con preguntas nuevas que la serie quiere explorar, territorios de personaje sin cubrir, y posibilidades de mundo sin desarrollar. La revitalización no es solo arreglar lo que está roto; es abrir el futuro de la serie de forma que el equipo tenga razones para emocionarse con el trabajo que viene.

### Paso 7: Ejecutar y medir la respuesta
Implementa las intervenciones del Paso 5 y la dirección del Paso 6 durante dos o tres episodios. Mide el resultado de dos formas: con el REVIEW_SYSTEM.md para rastrear cambios en calidad objetiva, y con conversaciones con el equipo para evaluar el cambio en energía y entusiasmo. Si la revitalización funciona, ambas métricas mejorarán. Si solo mejora una, el diagnóstico original estaba incompleto y hay un factor no identificado que debe atenderse.

## Entregable
Diagnóstico diferencial (creativo vs. producción), análisis comparativo de calidad con REVIEW_SYSTEM.md, lista de factores de estancamiento específicos, plan de inyecciones de energía por factor, plan de evolución de la serie hacia adelante, y protocolo de medición de la revitalización.

## Criterios de aprobación
- El diagnóstico distingue entre estancamiento creativo y de producción con evidencia específica.
- Los factores de estancamiento listados son concretos y accionables, no descripciones generales.
- Cada intervención diseñada está vinculada directamente a un factor diagnosticado.
- El plan de evolución abre preguntas y territorios nuevos en lugar de solo repetir la fórmula original con más energía.
- Hay métricas de seguimiento definidas para verificar si la revitalización está funcionando.

## Errores comunes
- Tratar el estancamiento con reuniones de motivación en lugar de cambios concretos en el proceso y el contenido.
- Añadir nuevos personajes o subtramas como inyección de energía sin resolver los problemas narrativos de los elementos existentes.
- Confundir la nostalgia por la energía inicial del proyecto con un diagnóstico real de qué cambió y por qué.
- Revitalizar solo externamente (nuevo arte, nuevo diseño, nueva música) sin abordar los problemas narrativos o de proceso subyacentes.
`,
    knowledgeRefs: ['Knowledge/Storytelling/'],
  },
  {
    id: 'actualizar_constitucion',
    phase: '09_Sistema',
    phaseName: 'Sistema',
    phaseIcon: '⚙️',
    phaseColor: '#b0bec5',
    title: 'Actualizar la Constitución',
    description: '',
    content: `# Actualizar la Constitución

**Objetivo:** Modificar los principios fundacionales del estudio de forma rigurosa, con consenso genuino y documentación de la razón del cambio.

**Cuándo usar:** Cuando la experiencia de producción ha demostrado que un principio de la Constitución genera más daño que beneficio, cuando el estudio ha crecido de formas que requieren principios nuevos, cuando un principio entra en contradicción con otro y debe resolverse, o cuando hay consenso entre todos los miembros del equipo de que algo en los fundamentos debe cambiar.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — El documento a modificar
- \`REVIEW_SYSTEM.md\` — Para verificar coherencia con el sistema de evaluación
- \`WORKFLOWS.md\` — Para verificar que los workflows actuales son compatibles con los cambios
- Todos los workflows en \`Workflows/\` que dependan del principio modificado

## Pasos

### Paso 1: Documentar la evidencia del problema
Antes de proponer ningún cambio, documenta la evidencia concreta de por qué el principio actual no está funcionando. Lista casos específicos: situaciones donde el principio fue aplicado y generó un resultado negativo, decisiones que el equipo evitó porque el principio las prohibía pero que habrían sido correctas, o conflictos entre principios que el sistema actual no puede resolver. La evidencia debe ser concreta; si no hay casos documentados, el problema puede no ser el principio sino su aplicación. Un principio no se cambia por intuición, se cambia por evidencia acumulada.

### Paso 2: Distinguir entre el principio y su interpretación
Muchos problemas atribuidos a la Constitución son en realidad problemas de interpretación. Antes de proponer modificar un principio, verifica si el problema puede resolverse con una aclaración, un ejemplo, o una guía de aplicación que no requiera cambiar el principio mismo. Reúne al equipo y discutan el principio: ¿Todos lo interpretan de la misma manera? ¿Las diferencias de interpretación explican los problemas observados? Si la respuesta es sí, la solución es agregar claridad al principio, no reemplazarlo.

### Paso 3: Proponer el cambio con alternativas
Quien propone el cambio debe presentar no solo la modificación deseada sino al menos dos alternativas. Alternativa A: el principio tal como está hoy. Alternativa B: el cambio propuesto. Alternativa C: una versión matizada del cambio propuesto. Para cada alternativa, documentar: cómo resuelve el problema diagnosticado, qué pierden el estudio y la producción con esta opción, y si crea nuevos conflictos con otros principios de la Constitución. Este formato evita que el debate sea binario (cambiar o no cambiar) y permite llegar a soluciones más precisas.

### Paso 4: Consultar el impacto en el sistema completo
Antes de llevar el cambio a decisión, verifica su impacto en cascada. Revisa todos los workflows de \`Workflows/\` que citen o dependan del principio bajo revisión. Verifica que \`REVIEW_SYSTEM.md\` es coherente con el principio modificado. Busca en los documentos de Knowledge/ cualquier material que dependa de la interpretación actual del principio. Documenta todos los archivos que requerirán actualización si el cambio se aprueba. Un cambio constitucional que no se propaga correctamente al sistema crea contradicciones silenciosas que confunden al equipo.

### Paso 5: Proceso de consenso formal
La Constitución no se modifica por mayoría simple. El proceso requiere consenso genuino: todos los miembros activos del equipo deben comprender el cambio propuesto, sus implicaciones, y estar de acuerdo no solo en que el cambio es aceptable sino en que es correcto. Si hay disidencia con fundamento, el cambio no está listo. La disidencia no es un obstáculo sino información: o el cambio tiene un problema que el disidente ve y otros no, o el disidente necesita más contexto para comprender la necesidad del cambio. El proceso de consenso es el lugar donde se resuelve cuál de las dos.

### Paso 6: Implementar el cambio y actualizar el sistema
Una vez alcanzado el consenso, ejecuta la actualización en el siguiente orden: primero \`CONSTITUTION.md\`, con el nuevo principio y una nota al pie de por qué fue modificado y cuándo; luego todos los workflows afectados identificados en el Paso 4; luego \`REVIEW_SYSTEM.md\` si corresponde; luego los documentos de Knowledge/ afectados. Registra la versión anterior del principio en un apéndice de historial de la Constitución para que el sistema tenga memoria de su propia evolución.

### Paso 7: Comunicar el cambio y verificar comprensión
Comunica el cambio al equipo completo con: el principio original, el principio nuevo, la evidencia que motivó el cambio, y cómo se aplica en el trabajo diario. Verifica que todos entienden no solo qué cambió sino por qué. Un cambio constitucional que el equipo no comprende produce comportamientos inconsistentes: algunos siguen el principio viejo, otros aplican el nuevo de formas no previstas. La comunicación es parte de la implementación, no un accesorio.

## Entregable
Documento de evidencia del problema, análisis de alternativas con impacto documentado, registro de impacto en el sistema (todos los archivos afectados), acta de consenso del equipo, \`CONSTITUTION.md\` actualizado con historial, y comunicación formal al equipo con el cambio y su razón.

## Criterios de aprobación
- La evidencia documentada en el Paso 1 es concreta y específica, no anecdótica ni especulativa.
- Se verificó que el problema no es de interpretación antes de proponer el cambio del principio.
- Todos los archivos del sistema afectados por el cambio han sido actualizados.
- El consenso es genuino: no hay disidencia con fundamento sin resolver.
- La versión anterior del principio está registrada en el historial de la Constitución.

## Errores comunes
- Modificar la Constitución para resolver una situación puntual sin verificar que el problema es sistémico y no excepcional.
- Aprobar el cambio por mayoría en lugar de requerir consenso, dejando disidentes cuya perspectiva era correcta.
- Actualizar \`CONSTITUTION.md\` sin propagar los cambios a los workflows y documentos que dependen de él.
- No registrar la versión anterior del principio, perdiendo el historial de por qué el sistema evolucionó.
`,
    knowledgeRefs: [],
  },
  {
    id: 'agregar_conocimiento',
    phase: '09_Sistema',
    phaseName: 'Sistema',
    phaseIcon: '⚙️',
    phaseColor: '#b0bec5',
    title: 'Añadir Conocimiento Nuevo',
    description: '',
    content: `# Añadir Conocimiento Nuevo

**Objetivo:** Incorporar aprendizajes, técnicas y principios nuevos al sistema de Knowledge de forma rigurosa, para que el estudio aprenda institucionalmente y no solo individualmente.

**Cuándo usar:** Cuando un miembro del equipo desarrolla una técnica nueva que mejora la producción, cuando la experiencia de una temporada revela un principio que no estaba documentado, cuando investigación externa (referencias, cursos, libros, otras producciones) aporta conocimiento aplicable a la forma de trabajar del estudio, o cuando el REVIEW_SYSTEM.md revela un patrón de mejora no capturado en los documentos existentes.

**Archivos de referencia:**
- \`Knowledge/\` — Estructura de categorías existente
- \`CONSTITUTION.md\` — Para verificar coherencia con los principios del estudio
- \`WORKFLOWS.md\` — Para verificar si el conocimiento nuevo requiere un workflow nuevo

## Pasos

### Paso 1: Capturar el conocimiento de forma bruta
Antes de editar ningún documento, escribe el conocimiento nuevo de la forma más completa y sin filtro que puedas. Incluye: qué se aprendió, en qué contexto surgió, cómo se aplicó, qué resultados produjo, y cualquier matiz o condición de aplicabilidad que ya sea visible. No te preocupes por el formato en esta etapa. El objetivo es capturar todo antes de que el aprendizaje se diluya con el tiempo. El conocimiento institucional más valioso suele perderse porque se pensó que habría tiempo de documentarlo después.

### Paso 2: Verificar que el conocimiento es genuinamente nuevo
Antes de añadir, busca en \`Knowledge/\` si el conocimiento ya existe de alguna forma. Muchos aprendizajes parecen nuevos pero son variaciones de principios ya documentados. Si el conocimiento ya existe, evalúa si lo que tienes es: una confirmación del principio existente (no requiere cambio), una matización o excepción que enriquece el principio (requiere editar el archivo existente), o un principio diferente que el existente no captura (requiere un archivo nuevo o una sección nueva). No añadas redundancia al sistema; un sistema con conocimiento duplicado o contradictorio es menos útil que uno con menos pero más preciso.

### Paso 3: Clasificar el conocimiento en la estructura existente
Determina en qué categoría de \`Knowledge/\` pertenece el conocimiento nuevo. Las categorías existentes son: Characters, Storytelling, Visual, Animation, Sound, Worldbuilding, Production, Direction. Si el conocimiento cae claramente en una categoría, ese es su lugar. Si cruza categorías, elige la categoría donde tiene mayor aplicabilidad y añade referencias cruzadas en las otras. Si genuinamente no cabe en ninguna categoría existente, evalúa si el volumen de conocimiento en esa área justifica crear una categoría nueva.

### Paso 4: Formatearlo con los estándares del sistema
Revisa un archivo existente de la misma categoría y usa su estructura como plantilla. Los archivos de Knowledge del estudio tienen un formato consistente: título, principio central en pocas líneas, desarrollo con ejemplos específicos, y matices o condiciones de aplicación. El conocimiento nuevo debe seguir ese mismo formato para que el sistema sea consultable de forma uniforme. Un archivo que rompe el formato del sistema es más difícil de encontrar y consultar en el momento en que se necesita.

### Paso 5: Verificar coherencia con la Constitución
Lee el conocimiento nuevo junto a \`CONSTITUTION.md\` y verifica que no contradice ningún principio fundamental del estudio. Si hay tensión entre el conocimiento nuevo y la Constitución, hay tres posibilidades: el conocimiento nuevo está equivocado o es demasiado específico para generalizarse como principio, el conocimiento nuevo revela una limitación de la Constitución que debe atenderse (usa el workflow \`actualizar_constitucion.md\`), o la tensión es aparente y se resuelve con una matización que hace compatibles ambos. No incorpores conocimiento que entre en contradicción directa con la Constitución sin resolver la contradicción primero.

### Paso 6: Integrar y actualizar el índice
Añade el conocimiento al archivo correspondiente en \`Knowledge/\` o crea el archivo nuevo en la ubicación correcta. Actualiza cualquier índice o tabla de contenidos dentro de la categoría. Si el conocimiento nuevo tiene implicaciones para algún workflow existente, señálalo con una nota de referencia cruzada en ambos documentos. Verifica que \`WORKFLOWS.md\` está actualizado si el conocimiento nuevo requirió crear un workflow asociado.

### Paso 7: Comunicar al equipo y validar en producción
Comparte el conocimiento nuevo con el equipo con contexto: de dónde viene, por qué es relevante, y cómo cambia (si lo hace) la forma de trabajar en áreas específicas. El conocimiento que nadie sabe que existe no beneficia al sistema. Planifica cómo se aplicará en el siguiente ciclo de producción para validar que el principio documentado funciona en contexto real. El conocimiento institucional solo se consolida cuando se aplica y produce los resultados esperados.

## Entregable
Captura bruta del conocimiento, análisis de novedad y categorización, archivo nuevo o actualización de archivo existente en \`Knowledge/\`, actualizaciones de referencias cruzadas en workflows relacionados, y comunicación al equipo con contexto y aplicación práctica.

## Criterios de aprobación
- Se verificó que el conocimiento no duplica ni contradice material ya existente en \`Knowledge/\`.
- El archivo sigue el formato estándar del sistema y es coherente con otros archivos de su categoría.
- El conocimiento es compatible con los principios de \`CONSTITUTION.md\` o las contradicciones han sido resueltas.
- El equipo conoce el nuevo conocimiento y sabe cómo aplicarlo.
- Hay un plan para validar el conocimiento en producción real.

## Errores comunes
- Añadir conocimiento sin verificar si ya existe en el sistema, creando redundancia y contradicción.
- Documentar el aprendizaje de un caso específico como principio universal sin verificar que generaliza correctamente.
- Saltarse la comunicación al equipo, creando conocimiento institucional que solo existe en el documento pero no en la práctica del equipo.
- Añadir conocimiento nuevo sin actualizar las referencias cruzadas en workflows relacionados, dejando el sistema inconsistente.
`,
    knowledgeRefs: [],
  },
  {
    id: 'calibrar_revision',
    phase: '09_Sistema',
    phaseName: 'Sistema',
    phaseIcon: '⚙️',
    phaseColor: '#b0bec5',
    title: 'Calibrar Sistema de Revisión',
    description: '',
    content: `# Calibrar Sistema de Revisión

**Objetivo:** Ajustar los criterios, umbrales y pesos del REVIEW_SYSTEM.md para que las evaluaciones de calidad reflejen con precisión lo que el estudio considera excelencia en cada momento de su evolución.

**Cuándo usar:** Cuando los puntajes del review system no correlacionan con la calidad percibida del trabajo (piezas que se sienten mal sacan puntuaciones altas, o viceversa), cuando el estudio ha desarrollado nuevas capacidades o estándares que el sistema actual no mide, cuando una nueva temporada requiere criterios específicos que el sistema general no captura, o cuando el equipo usa el sistema de revisión de forma mecánica sin sentir que tiene valor real.

**Archivos de referencia:**
- \`REVIEW_SYSTEM.md\` — El documento a calibrar
- \`CONSTITUTION.md\` — Para anclar los criterios en los principios del estudio
- \`Knowledge/\` — Para verificar coherencia con el conocimiento de craft documentado
- Ejemplos de trabajo aprobado y rechazado de las temporadas anteriores

## Pasos

### Paso 1: Diagnosticar el fallo del sistema actual
El review system puede fallar de varias formas específicas. Identifica cuál aplica: los criterios son demasiado subjetivos para producir evaluaciones consistentes entre revisores diferentes, los umbrales de aprobación están mal calibrados (demasiado bajos permiten trabajo mediocre, demasiado altos bloquean trabajo bueno), las dimensiones de evaluación no capturan lo que realmente importa para la calidad de la serie, los pesos de cada dimensión no reflejan sus importancias reales, o el sistema mide lo que es fácil de medir en lugar de lo que es importante. El diagnóstico del tipo de fallo determina qué parte del sistema debe cambiar.

### Paso 2: Recolectar evidencia de calibración
Reúne al menos diez piezas de trabajo ya evaluadas: cinco que el equipo considera excelentes, cinco que considera débiles. Re-evalúalas con el sistema actual sin mirar las puntuaciones previas. Luego compara los resultados: ¿El sistema separó correctamente las piezas excelentes de las débiles? ¿Qué dimensiones correlacionaron bien con la calidad percibida? ¿Cuáles produjeron resultados contraintuitivos? Esta evidencia empírica es la base de la recalibración. Un sistema de revisión sin casos de prueba concretos se calibra sobre suposiciones, no sobre realidad.

### Paso 3: Revisar cada dimensión de evaluación
Para cada dimensión del REVIEW_SYSTEM.md, pregunta: ¿Esta dimensión mide algo que diferencia el trabajo excelente del mediocre en nuestra serie? ¿Los criterios dentro de la dimensión son específicos y aplicables de forma consistente por diferentes revisores? ¿El peso asignado a la dimensión refleja su importancia real para la calidad del episodio final? Consulta \`Knowledge/\` para verificar que las dimensiones de evaluación corresponden a las categorías de craft documentadas. Si hay categorías de craft bien documentadas que no tienen reflejo en el review system, el sistema está midiendo incompleto.

### Paso 4: Ajustar umbrales con casos de prueba
Propone nuevos umbrales de aprobación y rechazo usando los casos de prueba del Paso 2 como referencia. Un umbral bien calibrado separa los casos de prueba de la forma que el equipo considera correcta. Si el umbral propuesto clasifica algunas piezas de forma contraintuitiva, ajusta hasta que la clasificación refleje el consenso del equipo sobre qué es excelente, aceptable, y débil. Los umbrales deben ser específicos por dimensión, no solo un puntaje total, porque una pieza puede ser excelente en narrativa y débil en animación y ambas calificaciones importan por separado.

### Paso 5: Probar el sistema recalibrado en trabajo nuevo
Antes de implementar los cambios definitivamente, usa el sistema recalibrado para evaluar tres o cuatro piezas de trabajo reciente que no fueron parte del conjunto de prueba del Paso 2. Compara los resultados con la percepción del equipo. Si el sistema recalibrado produce evaluaciones que el equipo considera correctas en estos casos nuevos, la calibración es sólida. Si hay sorpresas, el sistema aún tiene problemas que el conjunto de prueba no reveló y requiere más ajuste.

### Paso 6: Documentar los cambios y su justificación
Actualiza \`REVIEW_SYSTEM.md\` con los criterios, umbrales, y pesos revisados. Para cada cambio significativo, añade una nota explicando qué evidencia motivó el cambio. Esta documentación es importante: cuando el equipo no recuerda por qué un criterio está como está, tiende a modificarlo de vuelta por intuición. Mantener el historial de calibración dentro del documento preserva la memoria del por qué el sistema evolucionó de la forma en que lo hizo.

### Paso 7: Capacitar al equipo en el sistema actualizado
Comunica los cambios al equipo con ejemplos concretos: muestra cómo una pieza de trabajo sería evaluada antes y después del recalibrado. Asegúrate de que todos los revisores aplican los nuevos criterios de forma consistente. Si es posible, realiza una evaluación de calibración grupal con el equipo: todos evalúan la misma pieza de forma independiente y luego comparan resultados. La divergencia entre revisores revela dónde los criterios aún son ambiguos y requieren más especificación.

## Entregable
Diagnóstico del fallo del sistema actual, conjunto de casos de prueba con evaluaciones documentadas, análisis de cada dimensión de evaluación, propuesta de nuevos umbrales con justificación basada en evidencia, \`REVIEW_SYSTEM.md\` actualizado con historial de cambios, y sesión de calibración grupal documentada.

## Criterios de aprobación
- El sistema recalibrado separa correctamente los casos de prueba excelentes de los débiles según el consenso del equipo.
- Diferentes revisores que aplican el sistema recalibrado a la misma pieza producen puntajes similares.
- Cada dimensión de evaluación tiene criterios específicos que permiten aplicación consistente.
- Los cambios en el sistema están justificados con evidencia empírica, no solo con preferencias del equipo.
- El equipo comprende el sistema actualizado y puede aplicarlo sin consultar a otro revisor.

## Errores comunes
- Calibrar el sistema sin casos de prueba concretos, basándose solo en discusión teórica sobre qué debería medirse.
- Añadir más dimensiones para capturar más cosas, cuando el problema es que las dimensiones existentes no están bien definidas.
- Calibrar para el trabajo actual sin verificar que el sistema sigue siendo útil para los tipos de trabajo que vendrán en temporadas futuras.
- Cambiar el sistema después de una sola evaluación controvertida, en lugar de esperar a tener un patrón de fallos que justifique la recalibración.
`,
    knowledgeRefs: [],
  },
  {
    id: 'crear_workflow',
    phase: '09_Sistema',
    phaseName: 'Sistema',
    phaseIcon: '⚙️',
    phaseColor: '#b0bec5',
    title: 'Crear Workflow Nuevo',
    description: '',
    content: `# Crear Workflow Nuevo

**Objetivo:** Diseñar y documentar un proceso que no existe en el sistema, de forma que sea adoptable por cualquier miembro del equipo y reproduzca resultados de calidad de forma consistente.

**Cuándo usar:** Cuando el equipo realiza una tarea compleja de forma repetida sin un proceso documentado, cuando diferentes miembros ejecutan la misma tarea de formas incompatibles, cuando una tarea nueva entra al scope del estudio y no hay referencia de cómo abordarla, o cuando se identifica que la ausencia de un workflow específico es la causa de errores o inconsistencias recurrentes.

**Archivos de referencia:**
- \`WORKFLOWS.md\` — Índice de workflows existentes para verificar que no existe uno similar
- \`CONSTITUTION.md\` — Para anclar el nuevo workflow en los principios del estudio
- \`Knowledge/\` — Para referenciar el conocimiento de craft relevante en los pasos del workflow

## Pasos

### Paso 1: Verificar que el workflow es genuinamente necesario
Antes de crear, busca en \`WORKFLOWS.md\` y en \`Workflows/\` si existe un workflow que cubre el mismo proceso. Muchos workflows faltantes son variaciones de workflows existentes que pueden adaptarse con una nota de contexto. Si existe un workflow relacionado pero no idéntico, evalúa si el problema puede resolverse añadiendo una sección o variante al workflow existente en lugar de crear uno nuevo. El sistema es más útil cuando tiene el mínimo de documentos necesarios; un índice de 200 workflows es más difícil de navegar que uno de 90 bien diseñados.

### Paso 2: Mapear el proceso real antes de documentarlo
Habla con quien actualmente ejecuta la tarea (o quien la ha ejecutado con mejores resultados) y observa o registra cómo lo hace. Si la tarea nunca se ha hecho, mapea el proceso ideal entrevistando a los expertos del equipo en las áreas relevantes. No documentes cómo crees que debería hacerse; documenta cómo debería hacerse con base en conocimiento real. Los workflows diseñados desde el escritorio sin validación práctica suelen omitir los pasos donde el proceso real es más complejo, y esos son exactamente los pasos que más necesitan documentación.

### Paso 3: Identificar el alcance y los límites del workflow
Define con precisión dónde empieza y dónde termina el proceso. ¿Qué condición activa este workflow? ¿Qué debe existir antes de que pueda comenzarse? ¿Qué produce como output y quién lo recibe? ¿Dónde termina este workflow y empieza el siguiente? Los límites mal definidos producen workflows que se solapan con otros o que dejan huecos entre procesos. El campo "Cuándo usar" del workflow es la respuesta a estas preguntas y debe ser lo suficientemente específico para que alguien pueda decidir si este es el workflow correcto sin leer el documento completo.

### Paso 4: Diseñar los pasos con la granularidad correcta
Un workflow bien diseñado tiene entre cinco y ocho pasos. Cada paso debe: ser una unidad de trabajo coherente (no tan grande que contenga múltiples procesos, no tan pequeño que sea una acción trivial), tener una acción clara que indica qué hacer, no solo qué considerar, y producir algo verificable al final. Evita pasos que son listas de consideraciones sin una acción definida; eso es análisis, no proceso. Usa los archivos de \`Knowledge/\` como referencias dentro de los pasos en lugar de duplicar el conocimiento: el paso debe indicar qué consultar y por qué, no reproducir el contenido del archivo.

### Paso 5: Definir entregable y criterios de aprobación
El entregable describe el output concreto del workflow: qué existe al final que no existía al principio. Los criterios de aprobación son la lista de condiciones verificables que permiten a quien revisa el output saber si el proceso fue ejecutado correctamente. Los criterios deben ser verificables sin ambigüedad: no "el resultado es bueno" sino "el archivo existe en la ubicación correcta", "el documento incluye las secciones X, Y, Z", "el resultado fue revisado con el criterio A". Un workflow sin criterios de aprobación claros deja la decisión de calidad completamente a criterio individual, que es exactamente lo que el workflow debe evitar.

### Paso 6: Documentar errores comunes
Lista tres o cuatro errores que el equipo cometería si ejecutara el proceso sin el workflow, o que se han cometido históricamente en procesos similares. Los errores comunes son uno de los elementos más valiosos de un workflow porque codifican conocimiento negativo: qué no hacer y por qué. Este conocimiento suele ser el más difícil de transferir sin documentación. La sección de errores comunes debe describir el anti-patrón con suficiente detalle para que quien lo esté cometiendo lo reconozca.

### Paso 7: Validar el workflow con una ejecución real
Antes de añadir el workflow al sistema definitivamente, ejecuta el proceso siguiendo el documento al pie de la letra, sin atajos ni adaptaciones. Si quien lo ejecuta necesita tomar decisiones que el workflow no contempla, o si algún paso no tiene sentido en la práctica, el workflow tiene un problema que debe corregirse. Un workflow que no sobrevive su primera ejecución real no está listo para el sistema. Después de la validación, actualiza el documento con los ajustes necesarios.

### Paso 8: Integrar al sistema
Añade el workflow al índice \`WORKFLOWS.md\` en la categoría y fase correcta. Si el workflow hace referencia a archivos de \`Knowledge/\` específicos, añade una referencia cruzada en esos archivos indicando que existe un workflow asociado. Si el workflow es relevante para algún proceso de onboarding o training del equipo, señálalo en los documentos correspondientes. Un workflow que existe pero no está indexado es tan útil como uno que no existe.

## Entregable
Archivo de workflow completo con todos los campos requeridos (objetivo, cuándo usar, archivos de referencia, pasos, entregable, criterios de aprobación, errores comunes), registro de la ejecución de validación, y actualización del índice \`WORKFLOWS.md\`.

## Criterios de aprobación
- El workflow no duplica ningún proceso ya documentado en el sistema.
- El campo "Cuándo usar" permite decidir si este es el workflow correcto sin leer el documento completo.
- Cada paso tiene una acción clara y produce algo verificable, no solo lista consideraciones.
- El workflow fue ejecutado al menos una vez en producción real antes de ser añadido al sistema.
- \`WORKFLOWS.md\` está actualizado con la nueva entrada en la categoría correcta.

## Errores comunes
- Diseñar el workflow desde teoría sin mapear el proceso real con quienes lo ejecutan.
- Crear un workflow con pasos demasiado genéricos que no guían las decisiones difíciles, que son exactamente las que más necesitan guía.
- Añadir el workflow al sistema sin validarlo en una ejecución real, descubriendo sus problemas cuando alguien lo necesita en un momento de presión.
- Duplicar conocimiento de \`Knowledge/\` dentro del workflow en lugar de referenciarlo, creando dos fuentes que pueden desincronizarse.
`,
    knowledgeRefs: [],
  },
  {
    id: 'onboarding_agente',
    phase: '09_Sistema',
    phaseName: 'Sistema',
    phaseIcon: '⚙️',
    phaseColor: '#b0bec5',
    title: 'Onboarding de Nuevo Agente',
    description: '',
    content: `# Onboarding de Nuevo Agente

**Objetivo:** Integrar un nuevo agente al sistema del estudio de forma que pueda contribuir con calidad desde el principio, sin comprometer la consistencia del proyecto ni los estándares del equipo.

**Cuándo usar:** Cuando se incorpora un nuevo agente (humano o IA) a la producción activa del estudio, ya sea para cubrir una función nueva, reemplazar a un agente anterior, o ampliar la capacidad en una fase específica del pipeline.

**Archivos de referencia:**
- \`CONSTITUTION.md\` — El primer documento que todo agente nuevo debe leer
- \`REVIEW_SYSTEM.md\` — Los estándares de calidad que el agente debe internalizar
- \`WORKFLOWS.md\` — El índice de procesos del estudio
- \`Productions/Serie_01/Bible/\` — El universo de la producción activa
- \`Productions/Serie_01/Memory/\` — La memoria visual del proyecto

## Pasos

### Paso 1: Definir el rol y el alcance del nuevo agente
Antes de comenzar el onboarding, documenta con precisión qué hará el agente en el sistema: qué fases del pipeline cubre, qué tipos de decisiones puede tomar de forma autónoma, qué decisiones requieren aprobación de otro agente o del equipo, y con qué otros agentes interactúa directamente. Sin un rol definido, el onboarding no tiene foco y el agente tenderá a operar en áreas donde no tiene autoridad o a evitar áreas donde sí la tiene. La definición de rol es el documento de referencia para el agente durante sus primeras semanas de operación.

### Paso 2: Lectura de los documentos fundacionales
El agente nuevo debe leer, en este orden y completamente, los documentos fundacionales del estudio: \`CONSTITUTION.md\`, \`REVIEW_SYSTEM.md\`, \`WORKFLOWS.md\`, la Biblia de la serie activa, y el \`master_style.md\` de la Memoria Visual. Después de cada documento, el agente debe poder articular sus puntos principales sin consultarlo. No avanzar al siguiente documento hasta que el anterior está comprendido. Este paso no puede acortarse; un agente que opera sin haber internalizado la Constitución tomará decisiones que parecen razonables localmente pero que contradicen los principios del estudio.

### Paso 3: Revisión de la Memoria Visual completa
Si el agente trabajará en cualquier aspecto visual de la producción (generación de imágenes, diseño, revisión visual, o cualquier tarea con output gráfico), debe revisar la Memoria Visual completa: \`Memory/Style/\`, \`Memory/Characters/\`, \`Memory/Environments/\`, \`Memory/Props/\`, y \`Memory/Prompts/\`. El agente debe poder identificar a los personajes principales por descripción, conocer el estilo maestro de la serie, y entender el sistema de generación de imágenes antes de producir o revisar cualquier output visual. La consistencia gráfica es la prioridad máxima del sistema visual y un agente sin contexto visual romperá esa consistencia en su primer output.

### Paso 4: Revisión de trabajo existente con REVIEW_SYSTEM.md
El agente nuevo evalúa de forma independiente entre cinco y diez episodios ya producidos y aprobados usando \`REVIEW_SYSTEM.md\`. Luego compara sus evaluaciones con las del equipo. Las diferencias revelan: estándares que el agente aplica de forma diferente a la del estudio, dimensiones donde la calibración del agente está desalineada, y criterios del sistema que no son suficientemente específicos para producir evaluaciones consistentes. Esta calibración práctica es más efectiva que cualquier descripción teórica de los estándares del estudio.

### Paso 5: Tarea supervisada en el área de rol
El agente ejecuta su primera tarea real dentro de su rol, siguiendo el workflow correspondiente, mientras un agente con experiencia en esa área observa o revisa el proceso y el output. El objetivo no es que la tarea sea perfecta sino que revele en qué puntos el agente necesita más contexto, qué decisiones le resultan difíciles de tomar, y qué partes del workflow no comprendió completamente. El feedback de esta tarea supervisada debe ser específico: no "mejorar la calidad" sino "en el Paso 3 de este workflow, la decisión correcta en este contexto fue X porque Y".

### Paso 6: Definir el protocolo de escalamiento del agente
Documenta los criterios que el agente debe usar para escalar una decisión en lugar de tomarla de forma autónoma. Los criterios típicos son: decisiones que afectan la Constitución o la Biblia, decisiones que contradicen el trabajo aprobado previamente, incertidumbre sobre si una decisión está dentro del alcance del rol, y cualquier situación donde el agente identifica un conflicto entre sus instrucciones y los principios del estudio. Un agente que no sabe cuándo escalar toma decisiones fuera de su alcance o paraliza la producción escalando todo. El protocolo de escalamiento es el balance entre autonomía y supervisión.

### Paso 7: Período de integración con revisión frecuente
Durante las primeras dos semanas de operación autónoma, el agente recibe revisión estructurada de su trabajo más frecuente que la que recibirá en régimen normal. Las revisiones no son solo de calidad del output sino de proceso: ¿El agente usó el workflow correcto? ¿Consultó los documentos de referencia indicados? ¿Documentó sus outputs según el sistema (generation log, actualización de archivos, registro en el sistema)? Al final del período de integración, el agente y el equipo evalúan juntos si el rol está correctamente definido, si el agente tiene todo el contexto que necesita, y si hay ajustes al proceso de onboarding que deben incorporarse para el siguiente agente.

## Entregable
Documento de definición de rol del agente, registro de lecturas de documentos fundacionales completadas, resultados de la calibración con REVIEW_SYSTEM.md, informe de la tarea supervisada con feedback específico, protocolo de escalamiento documentado, y evaluación al final del período de integración con ajustes al proceso de onboarding.

## Criterios de aprobación
- El agente puede articular los principios de \`CONSTITUTION.md\` sin consultarla.
- Las evaluaciones del agente con \`REVIEW_SYSTEM.md\` son consistentes con las del equipo dentro de un margen aceptable.
- El agente conoce el protocolo de escalamiento y puede aplicarlo sin consultar.
- La tarea supervisada produjo un output que cumple los criterios de aprobación del workflow correspondiente.
- El agente sabe dónde vive cada tipo de información en el sistema y cómo consultarla de forma eficiente.

## Errores comunes
- Saltear la lectura de documentos fundacionales para "comenzar a producir más rápido", creando un agente que opera sin contexto sistémico.
- Hacer el onboarding de forma completamente teórica sin incluir tareas supervisadas reales que revelen las brechas de comprensión.
- No definir el protocolo de escalamiento, dejando al agente en la situación imposible de decidir cuándo su autonomía tiene límites.
- No revisar el proceso de onboarding al final de la integración, perdiendo la oportunidad de mejorar el proceso para el siguiente agente.
`,
    knowledgeRefs: [],
  },
  {
    id: 'post_mortem',
    phase: '09_Sistema',
    phaseName: 'Sistema',
    phaseIcon: '⚙️',
    phaseColor: '#b0bec5',
    title: 'Post-Mortem de Proyecto',
    description: '',
    content: `# Post-Mortem de Proyecto

**Objetivo:** Analizar sistemáticamente qué funcionó y qué no al terminar una temporada, para que el estudio aprenda institucionalmente y mejore en la siguiente producción.

**Cuándo usar:** Al completar cada temporada de la serie, o al terminar cualquier proyecto significativo del estudio. Ejecutar el post-mortem dentro de las dos semanas siguientes al cierre de producción, cuando la experiencia está fresca pero el equipo tiene suficiente distancia emocional para ser honesto.

**Archivos de referencia:**
- \`REVIEW_SYSTEM.md\` — Para el análisis de calidad sistemático de la temporada
- \`CONSTITUTION.md\` — Para evaluar si la producción respetó los principios del estudio
- \`WORKFLOWS.md\` — Para identificar qué workflows funcionaron y cuáles fallaron
- \`Productions/Serie_01/Seasons/\` — Todo el material de la temporada analizada

## Pasos

### Paso 1: Recopilar datos cuantitativos antes del análisis cualitativo
Antes de cualquier reunión o discusión, recopila los datos objetivos de la temporada: puntajes del REVIEW_SYSTEM.md por episodio, tiempo de producción real vs. estimado por fase, número de revisiones por episodio antes de aprobación, episodios o escenas que requirieron retrabajo significativo, y cualquier métrica de calidad que el estudio registre. Los datos deben existir antes de la discusión para que el análisis no esté completamente dominado por las memorias más vívidas o por las voces más fuertes. Las anécdotas son útiles para entender los datos, no para reemplazarlos.

### Paso 2: Encuesta individual antes de la sesión grupal
Pide a cada miembro del equipo que responda por escrito, de forma individual y sin consultar a otros, las siguientes preguntas: ¿Qué tres cosas funcionaron mejor en esta temporada? ¿Qué tres cosas fallaron más consistentemente? ¿Qué cambiarías si pudieras repetir la temporada? ¿Qué momento de la producción fue el más frustrante y por qué? ¿Qué momento fue el más satisfactorio? La encuesta individual previa a la sesión grupal captura perspectivas que suelen silenciarse en la dinámica de grupo, especialmente de miembros menos jerárquicos del equipo cuyas observaciones son frecuentemente las más valiosas.

### Paso 3: Sesión de post-mortem grupal estructurada
Realiza una sesión de entre dos y tres horas con todo el equipo. La sesión tiene cuatro momentos: celebración (qué salió excepcionalmente bien, con ejemplos específicos), diagnóstico (qué falló con regularidad, usando los datos del Paso 1 para anclar la discusión), análisis de causa raíz (por qué fallaron las cosas que fallaron, buscando causas sistémicas no culpables individuales), y propuestas (qué cambios concretos haría cada persona para la próxima temporada). El facilitador debe proteger las voces menos escuchadas y asegurarse de que la sesión produce observaciones concretas, no generalizaciones.

### Paso 4: Analizar el rendimiento de los workflows
Evalúa qué workflows de \`Workflows/\` se usaron durante la temporada y cómo funcionaron. Para cada workflow usado, determina: ¿Fue seguido? Si no, ¿por qué? ¿Produjo los resultados esperados? ¿Tiene pasos que el equipo consistentemente saltó porque no tenían sentido en la práctica? ¿Hay procesos que el equipo ejecutó repetidamente sin un workflow que los guíe? Este análisis alimenta directamente el backlog de mejoras del sistema: workflows que deben actualizarse, workflows que deben crearse, y workflows que el equipo usa porque los percibe como valiosos.

### Paso 5: Analizar la coherencia con la Constitución
Revisa \`CONSTITUTION.md\` y evalúa honestamente cuánto de la producción de la temporada estuvo alineada con los principios declarados. Identifica: principios que se respetaron consistentemente, principios que se violaron bajo presión de producción y cómo eso afectó el resultado, y principios que resultaron más difíciles de aplicar de lo esperado. Esta sección del post-mortem es la más incómoda porque implica reconocer la distancia entre los valores declarados y el comportamiento real, pero es la más valiosa para que la Constitución sea un documento vivo y no aspiracional.

### Paso 6: Generar el plan de mejoras concretas
Transforma las observaciones del análisis en un plan de mejoras concretas para la próxima temporada. Cada mejora debe: identificar un problema específico (no genérico), proponer una acción específica que lo aborda, asignar responsabilidad de implementación, y tener una fecha de implementación antes del inicio de producción de la siguiente temporada. Prioriza las mejoras por impacto y factibilidad. Un plan de mejoras de veinte ítems que no se implementa es menos valioso que un plan de cinco que sí se ejecutan.

### Paso 7: Actualizar el sistema y documentar el aprendizaje
Ejecuta las actualizaciones al sistema que el post-mortem genera: nuevos workflows, actualizaciones a workflows existentes, nuevo conocimiento añadido a \`Knowledge/\`, calibraciones al REVIEW_SYSTEM.md, y si aplica, cambios propuestos a la Constitución siguiendo el workflow \`actualizar_constitucion.md\`. Guarda el documento completo del post-mortem en \`Productions/Serie_01/Seasons/[S0X]/post_mortem.md\`. Este archivo es memoria institucional de la evolución del estudio y debe ser consultable en futuros post-mortems para verificar si los problemas identificados se resolvieron o se repiten.

## Entregable
Compilación de datos cuantitativos de la temporada, resultados de encuesta individual procesados, acta de la sesión grupal con observaciones organizadas, análisis de rendimiento de workflows, análisis de coherencia con la Constitución, plan de mejoras priorizado con responsables y fechas, y actualizaciones al sistema ejecutadas.

## Criterios de aprobación
- El análisis usa datos cuantitativos como base, no solo memoria e impresiones del equipo.
- Todos los miembros del equipo tuvieron oportunidad de contribuir de forma individual antes de la sesión grupal.
- Las causas raíz identificadas son sistémicas, no responsabilidades individuales.
- El plan de mejoras tiene menos de diez ítems priorizados, con responsables y fechas definidas.
- Las actualizaciones al sistema (workflows, knowledge, calibraciones) están ejecutadas antes del inicio de la siguiente temporada.

## Errores comunes
- Hacer el post-mortem demasiado tarde, cuando los detalles se perdieron y el equipo ya pasó emocionalmente a lo siguiente.
- Dominar la sesión grupal con las voces más jerárquicas sin capturar primero las perspectivas individuales por escrito.
- Identificar problemas sin analizar causas raíz, produciendo un plan de mejoras que trata síntomas en lugar de causas.
- Generar un plan de mejoras ambicioso que no se implementa antes de la siguiente producción, haciendo que el post-mortem sea un ritual sin consecuencias.
`,
    knowledgeRefs: [],
  },
]

export const PHASES = [...new Set(WORKFLOWS.map(w => w.phase))].sort()

export function getWorkflowsByPhase(phase: string) {
  return WORKFLOWS.filter(w => w.phase === phase)
}