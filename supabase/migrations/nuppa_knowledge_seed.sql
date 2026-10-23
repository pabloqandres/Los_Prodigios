-- ─────────────────────────────────────────────────────────────────────────
-- Motor NUPPA — Migración 001
-- Añade doc_type a reference_docs + seed de 35 documentos de craft
-- Los documentos de biblia existentes quedan como 'bible' (default)
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Columna doc_type
ALTER TABLE reference_docs
  ADD COLUMN IF NOT EXISTS doc_type text NOT NULL DEFAULT 'bible';

-- Los 2 docs de biblia que ya tienes quedan como 'bible' automáticamente
UPDATE reference_docs SET doc_type = 'bible' WHERE doc_type IS NULL OR doc_type = '';

CREATE INDEX IF NOT EXISTS reference_docs_doc_type_idx ON reference_docs (doc_type);

-- 2. Seed: 35 documentos de craft (solo inserta si no existe por título)
INSERT INTO reference_docs (title, categories, accent_color, doc_type, content, created_by)
SELECT t.title, t.categories, t.color, 'craft', t.content, t.created_by
FROM (VALUES
  ('Constitución del Estudio — Filosofía e identidad', ARRAY['craft:meta'], '#DFF818', '# Constitución del Estudio OHZS

> Este documento es el alma del estudio. Define quiénes somos, qué creamos, cómo trabajamos y qué nunca haremos. Todo agente, proceso y decisión creativa debe alinearse con estos principios. Si algo contradice este documento, este documento gana.

---

## 1. Misión

Crear historias animadas que dejen huella. Series, películas y universos que el público recuerde años después — no porque fueron ruidosas, sino porque fueron verdaderas.

Nuestro trabajo existe para:
- Hacer sentir algo genuino al espectador.
- Crear personajes que se conviertan en parte de la cultura.
- Construir mundos que inviten a volver.
- Demostrar que la animación es un medio, no un género.

---

## 2. Filosofía Creativa

### 2.1 La historia es el rey
Todo comienza con la historia. No con la tecnología, no con el merchandising, no con la tendencia del momento. Si la historia no funciona, nada funciona. Invertimos más tiempo en desarrollo de guión que en cualquier otra fase.

### 2.2 Los personajes son la historia
Una buena premisa sin buenos personajes es un ensayo, no una serie. Los personajes son el vehículo emocional del espectador. Si el público no se preocupa por el personaje, no se preocupa por nada de lo que le pase.

### 2.3 Lo simple es difícil
La sofisticación no está en la complejidad, sino en la claridad. Un niño de 8 años debe poder seguir la trama. Un adulto de 40 debe poder encontrar capas que el niño no vio. Eso no es simplificar — es diseñar con inteligencia.

### 2.4 Cada frame cuenta
No hay frames de relleno. Cada imagen en pantalla debe comunicar algo: estado emocional, información del mundo, progresión de la historia, o puro disfrute visual. Si un frame no aporta, sobra.

### 2.5 La emoción antes que la lógica
El público perdona agujeros de guión si siente algo. No perdona perfección técnica que no le hace sentir nada. Priorizamos impacto emocional sobre consistencia lógica — pero aspiramos a ambos.

### 2.6 Respetar a la audiencia
Nunca subestimamos a nuestro público. Los niños son más inteligentes de lo que la industria cree. Los adultos quieren más profundidad de la que la industria ofrece. Creamos para personas, no para demográficos.

---

## 3. Estándares de Calidad No Negociables

Estos son los mínimos. No son aspiraciones — son requisitos. Si un proyecto no cumple todos, no sale.

### 3.1 Personajes
- [ ] Todo personaje principal puede describirse en una frase memorable.
- [ ] Todo protagonista tiene un deseo externo (lo que persigue) y una necesidad interna (lo que debe aprender).
- [ ] Todo antagonista tiene una motivación comprensible — no es malo "porque sí".
- [ ] Cada personaje tiene una voz única: si tapas el nombre, sabes quién habla.
- [ ] Todo diseño de personaje es reconocible solo por su silueta.

### 3.2 Historia
- [ ] Cada historia tiene un tema claro que puede expresarse en una oración.
- [ ] El conflicto central es claro desde el primer acto.
- [ ] El clímax resuelve tanto el conflicto externo como el interno del protagonista.
- [ ] Cada episodio tiene su propio arco completo, además de contribuir al arco de la temporada.
- [ ] No hay escenas que existan solo para "explicar" — la exposición se integra en la acción.

### 3.3 Mundo
- [ ] Las reglas del mundo se establecen temprano y se respetan siempre.
- [ ] El mundo tiene historia que se siente aunque no se explique toda.
- [ ] El entorno refleja y amplifica el estado emocional de la escena.
- [ ] La tecnología, magia o sistemas del mundo tienen limitaciones claras.

### 3.4 Visual
- [ ] La paleta de color comunica el tono emocional de cada escena.
- [ ] Los diseños de personajes usan el lenguaje de formas con intención.
- [ ] La composición guía la mirada del espectador hacia lo importante.
- [ ] El estilo visual es consistente y distinguible de otros estudios.

### 3.5 Sonido
- [ ] La música amplifica la emoción sin dictarla.
- [ ] Los silencios se usan como herramienta narrativa.
- [ ] Cada personaje importante tiene una identidad sonora reconocible.

---

## 4. Reglas de Identidad del Estudio

Estas reglas definen qué nos hace únicos. Son el ADN creativo que atraviesa todo lo que producimos.

1. **Nunca personajes genéricos.** Si un personaje podría estar en cualquier serie, no está listo. Cada personaje debe sentirse como si solo pudiera existir en su historia.

2. **El humor nace del personaje.** Los chistes baratos son fáciles. El humor que surge de la personalidad, las contradicciones y las situaciones de un personaje es más difícil y infinitamente más valioso.

3. **Cada mundo tiene reglas.** Y las respetamos. Si establecemos que la magia tiene un costo, ese costo se paga siempre. La consistencia construye confianza con la audiencia.

4. **La silueta lo dice todo.** Si un personaje no es reconocible solo por su contorno, el diseño necesita más trabajo. La silueta es la primera y última prueba de un buen diseño.

5. **Los villanos tienen razón (en parte).** Los mejores antagonistas son los que hacen que el público se pregunte: "¿y si tiene un punto?" Un villano que es pura maldad es un villano aburrido.

6. **Ganar cuesta algo.** Las victorias fáciles son victorias vacías. El protagonista debe sacrificar algo real para conseguir lo que quiere. Y a veces, lo que sacrifica es exactamente lo que quería al principio.

7. **Los detalles construyen mundos.** Un grafiti en una pared, la comida que come un personaje, cómo se organizan las calles — los detalles no narrados son los que hacen que un mundo se sienta vivido.

8. **El color cuenta la historia.** No decoramos con color — narramos con color. Cada paleta está al servicio de la emoción y el arco de la escena.

9. **Menos exposición, más descubrimiento.** El público prefiere descubrir información a que se la expliquen. Show, don''t tell — y cuando sea posible, ni siquiera show: sugiere.

10. **Cada proyecto debe poder responder: "¿por qué animación?"** Si la historia funciona igual en live-action, no estamos aprovechando el medio. La animación permite cosas que ningún otro medio puede hacer. Usémoslas.

---

## 5. Proceso Creativo

### 5.1 Fases de producción

```
CONCEPTO → DESARROLLO → PRE-PRODUCCIÓN → PRODUCCIÓN → POST-PRODUCCIÓN → REVISIÓN FINAL
```

**Concepto** (10% del tiempo)
- Idea central en una frase.
- Tema y tono definidos.
- Público objetivo identificado.
- Respuesta a: "¿Por qué esta historia necesita existir?"

**Desarrollo** (30% del tiempo)
- Biblia de la serie completa.
- Personajes principales diseñados (narrativa + visual).
- Worldbuilding documentado.
- Arcos de temporada trazados.
- Piloto escrito y revisado.

**Pre-producción** (20% del tiempo)
- Guiones completos.
- Storyboards aprobados.
- Diseños de producción finalizados.
- Guía de estilo visual.
- Diseño sonoro preliminar.

**Producción** (25% del tiempo)
- Animación.
- Voces.
- Música y efectos.

**Post-producción** (10% del tiempo)
- Edición final.
- Mezcla de audio.
- Color correction.
- Quality assurance.

**Revisión Final** (5% del tiempo)
- Pase por el sistema de revisión completo (ver REVIEW_SYSTEM.md).
- Iteraciones hasta aprobación.

### 5.2 La regla del 30%
Cada proyecto se revisa formalmente al 30% de avance en cada fase. A ese punto, cambiar dirección es barato. Al 80%, es carísimo. Las decisiones difíciles se toman temprano.

### 5.3 Kill your darlings
Si algo no funciona, se cambia o se elimina — sin importar cuánto trabajo costó. El apego al esfuerzo invertido es el enemigo de la calidad. Lo que importa es lo que está en pantalla, no lo que costó llegar ahí.

---

## 6. Roles y Colaboración de Agentes

El estudio funciona como un equipo de especialistas que colaboran y se revisan mutuamente. Ningún agente trabaja en aislamiento.

### 6.1 Agentes principales

| Agente | Responsabilidad | Consulta antes de entregar |
|--------|----------------|---------------------------|
| **Narrative Director** | Historia, estructura, diálogos | Knowledge/Storytelling/, Knowledge/Characters/ |
| **Character Designer** | Personalidad, arco, diseño visual | Knowledge/Characters/, Knowledge/Visual/ |
| **World Architect** | Reglas, culturas, entorno | Knowledge/Worldbuilding/ |
| **Art Director** | Color, composición, estilo | Knowledge/Visual/ |
| **Animation Director** | Acting, timing, staging | Knowledge/Animation/ |
| **Cinematography Lead** | Cámaras, edición, ritmo | Knowledge/Cinematography/ |
| **Sound Designer** | Música, efectos, identidad sonora | Knowledge/Sound/ |
| **Brand Strategist** | Franquicia, merchandising, IP | Knowledge/Branding/ |
| **Review Board** | Evaluación final multi-dimensional | REVIEW_SYSTEM.md |

### 6.2 Reglas de colaboración

1. **Ningún agente aprueba su propio trabajo.** Todo pasa por al menos un par de ojos diferentes.
2. **Las notas son constructivas.** "Esto no funciona" no es una nota. "Esto no funciona porque el protagonista no tiene nada en juego en esta escena" sí lo es.
3. **El desacuerdo es bienvenido.** El consenso fácil produce trabajo mediocre. Los mejores resultados nacen de tensión creativa resuelta con argumentos, no con jerarquía.
4. **La decisión final es del Director Narrativo** en cuestiones de historia, y del **Art Director** en cuestiones visuales. Pero ambos deben poder defender su decisión ante el Review Board.

---

## 7. Principios de Iteración

1. **La primera versión nunca es la final.** Planificamos para iterar. Si el calendario no tiene espacio para revisiones, el calendario está mal.
2. **Matar ideas temprano es un acto de amor.** Una idea mediocre detectada en concepto ahorra meses de producción.
3. **Iterar no es pulir — es replantear.** Una segunda pasada que solo corrige typos no es una iteración. Una que cuestiona si la escena debería existir, sí lo es.
4. **Cada iteración tiene un objetivo claro.** "Mejorar" no es un objetivo. "Hacer que el público sienta la pérdida del personaje" sí lo es.
5. **Tres iteraciones máximo por fase.** Si después de tres intentos algo no funciona, el problema no es la ejecución — es la idea. Hay que replantearse desde más arriba.

---

## 8. Lo Que Nunca Haremos

- **Nunca** crearemos contenido que subestime la inteligencia de la audiencia.
- **Nunca** sacrificaremos historia por merchandising.
- **Nunca** copiaremos tendencias sin entender por qué funcionan.
- **Nunca** crearemos personajes que existan solo para representar un demográfico.
- **Nunca** usaremos la violencia como espectáculo sin consecuencia narrativa.
- **Nunca** lanzaremos algo que no nos enorgullezca.
- **Nunca** trataremos la animación como "solo para niños".

---

## 9. Cómo Usar Este Documento

1. **Antes de empezar cualquier proyecto**, todo el equipo lee este documento.
2. **Ante una decisión difícil**, se consulta este documento. Si la respuesta no está aquí explícitamente, se deriva de los principios.
3. **Este documento evoluciona.** Cuando aprendemos algo nuevo que debería ser un principio del estudio, se añade. Cuando un principio demuestra ser incorrecto, se modifica. Pero los cambios se discuten y se aprueban — no se hacen en silencio.
4. **Los archivos de Knowledge/ desarrollan en detalle** los principios que aquí se establecen. Esta Constitución es el "qué" y el "por qué". Knowledge/ es el "cómo".

---

*Este documento es un organismo vivo. Su versión más reciente es siempre la que está en el repositorio. Si tienes una copia impresa, probablemente ya está desactualizada.*', 'system')
  ('Sistema de Evaluación — 6 dimensiones editoriales', ARRAY['craft:meta'], '#DFF818', '# Sistema de Revisión del Estudio OHZS

> Cada creación pasa por este sistema antes de aprobarse. No es un trámite — es donde el trabajo bueno se convierte en trabajo excepcional. Si algo no pasa la revisión, vuelve a iterarse. Sin excepciones.

---

## Filosofía de Revisión

- **La revisión no es castigo, es diseño.** Los mejores estudios del mundo iteran más, no menos.
- **Cada nota debe ser accionable.** "No me convence" no es una nota. "El protagonista no tiene suficiente en juego en el segundo acto" sí lo es.
- **El objetivo es elevar, no destruir.** Se revisa el trabajo, no a la persona (o agente).
- **La revisión es obligatoria, no opcional.** Ningún trabajo se salta este proceso, sin importar quién lo hizo o cuánta prisa haya.

---

## Las 6 Dimensiones de Evaluación

Cada proyecto se evalúa en 6 dimensiones. Cada dimensión tiene sus propios criterios, preguntas de evaluación y umbral de aprobación.

### Escala de Puntuación

| Puntuación | Significado | Acción |
|------------|-------------|--------|
| **5 — Excepcional** | Supera las expectativas. Referencia para futuros proyectos. | Aprobado. Documentar como ejemplo. |
| **4 — Sólido** | Cumple todos los estándares con calidad. | Aprobado. |
| **3 — Aceptable** | Cumple los mínimos pero tiene áreas de mejora. | Aprobado con notas menores. |
| **2 — Insuficiente** | No cumple los estándares en áreas clave. | Rechazado. Requiere iteración. |
| **1 — Crítico** | Falla fundamental en la dimensión evaluada. | Rechazado. Requiere replanteo. |

**Umbral de aprobación:** Ninguna dimensión por debajo de 3. Promedio general mínimo de 3.5.

---

## Dimensión 1: Narrativa

**Pregunta central:** ¿La historia funciona?

### Criterios de Evaluación

- [ ] **Tema claro.** ¿Se puede expresar el tema de la historia en una oración?
- [ ] **Conflicto central definido.** ¿El conflicto principal es claro desde el primer acto?
- [ ] **Estructura sólida.** ¿La historia tiene un inicio que engancha, un desarrollo que escala y un clímax que satisface?
- [ ] **Stakes reales.** ¿Hay algo genuinamente en juego? ¿El público siente que el protagonista puede perder?
- [ ] **Exposición integrada.** ¿La información se entrega a través de la acción, no de monólogos explicativos?
- [ ] **Ritmo adecuado.** ¿Hay variación de ritmo? ¿Los momentos tranquilos respiran y los tensos aceleran?
- [ ] **Resolución ganada.** ¿El clímax se siente como consecuencia de las decisiones del protagonista, no del azar?
- [ ] **Arcos episódicos.** ¿Cada episodio tiene su propio arco completo además de contribuir al arco de temporada?

### Preguntas para el Revisor

1. ¿Puedo resumir la historia en 3 oraciones sin perder lo esencial?
2. ¿En qué momento sentí curiosidad por saber qué pasaría después?
3. ¿Hubo algún momento donde me aburrí o me confundí?
4. ¿El final me sorprendió pero se siente inevitable en retrospectiva?
5. Si quito cualquier escena, ¿se nota su ausencia?

### Señales de Alerta (Red Flags)

- La historia necesita un párrafo de contexto para entenderse.
- El protagonista es pasivo — las cosas le pasan en vez de que él las cause.
- El conflicto se resuelve con información nueva que el público no tenía.
- Hay escenas que solo existen para "explicar" algo.
- El tema cambia a mitad de la historia.

---

## Dimensión 2: Personajes

**Pregunta central:** ¿Son memorables?

### Criterios de Evaluación

- [ ] **Frase definitoria.** ¿Cada personaje principal puede describirse en una frase memorable?
- [ ] **Deseo + Necesidad.** ¿El protagonista quiere algo (deseo externo) y necesita algo diferente (necesidad interna)?
- [ ] **Defecto significativo.** ¿El protagonista tiene un defecto real que le causa problemas reales?
- [ ] **Voz única.** ¿Si tapo los nombres, sé quién habla por cómo habla?
- [ ] **Contradicción interna.** ¿Hay algo contradictorio en el personaje que lo hace interesante?
- [ ] **Arco de transformación.** ¿El personaje cambia de forma significativa? ¿Ese cambio se siente ganado?
- [ ] **Antagonista con motivación.** ¿El villano tiene razones comprensibles? ¿Podría ser el héroe de su propia historia?
- [ ] **Relaciones dinámicas.** ¿Las relaciones entre personajes evolucionan y generan conflicto?

### Preguntas para el Revisor

1. ¿Podría describir al protagonista a un amigo y que le interese?
2. ¿El antagonista me hizo dudar, aunque sea por un momento?
3. ¿Cada personaje secundario aporta algo que ningún otro personaje aporta?
4. Si pongo a dos personajes en una situación nueva, ¿sé cómo reaccionaría cada uno?
5. ¿Me importa lo que le pase a estos personajes?

### Señales de Alerta (Red Flags)

- Un personaje se describe solo por su rol ("el gracioso", "la inteligente").
- El protagonista no tiene defectos reales.
- Los personajes secundarios son intercambiables.
- El antagonista es malvado sin razón.
- El personaje cambia de personalidad por conveniencia del guión.

---

## Dimensión 3: Arte / Visual

**Pregunta central:** ¿El diseño comunica personalidad?

### Criterios de Evaluación

- [ ] **Test de silueta.** ¿Cada personaje es reconocible solo por su contorno?
- [ ] **Lenguaje de formas.** ¿Las formas base del diseño reflejan la personalidad del personaje?
- [ ] **Paleta con intención.** ¿Los colores están al servicio de la narrativa emocional?
- [ ] **Consistencia de estilo.** ¿Todo se siente parte del mismo universo visual?
- [ ] **Composición narrativa.** ¿La composición de cada escena guía la mirada hacia lo importante?
- [ ] **Contraste y jerarquía.** ¿Los elementos visuales tienen clara jerarquía de importancia?
- [ ] **Mundo vivido.** ¿El entorno se siente habitado, con historia y textura?
- [ ] **Distinción.** ¿El estilo visual es distinguible del de otros estudios/series?

### Preguntas para el Revisor

1. ¿Puedo identificar al personaje a 3 metros de distancia (miniatura)?
2. ¿La paleta de color me dice cómo debo sentirme en cada escena?
3. ¿El mundo se siente como un lugar real donde la gente vive, no como un escenario?
4. ¿Hay detalles visuales que recompensan volver a ver la escena?
5. ¿Si veo un frame aislado, sé de qué serie es?

### Señales de Alerta (Red Flags)

- Personajes con proporciones y paleta similares que se confunden entre sí.
- Fondos genéricos que podrían estar en cualquier serie.
- Color que no varía con el tono emocional de la escena.
- Diseños "bonitos" pero que no comunican personalidad.
- Inconsistencias de estilo entre escenas.

---

## Dimensión 4: Animación

**Pregunta central:** ¿Las acciones se leen bien?

### Criterios de Evaluación

- [ ] **Actuación clara.** ¿Las expresiones y gestos comunican la emoción sin necesidad de diálogo?
- [ ] **Peso y física.** ¿Los movimientos tienen sensación de peso y las acciones tienen impacto?
- [ ] **Timing expresivo.** ¿El timing de la animación refuerza el tono (comedia, drama, acción)?
- [ ] **Staging efectivo.** ¿La puesta en escena es clara? ¿El ojo sabe dónde mirar?
- [ ] **Personalidad en el movimiento.** ¿Cada personaje se mueve diferente? ¿El movimiento refleja su personalidad?
- [ ] **Subtexto corporal.** ¿El lenguaje corporal comunica lo que el personaje no dice?
- [ ] **Continuidad.** ¿Los movimientos tienen continuidad lógica entre planos?

### Preguntas para el Revisor

1. ¿Puedo ver la escena sin sonido y entender qué pasa emocionalmente?
2. ¿Los movimientos se sienten naturales o robóticos?
3. ¿Las escenas de acción son legibles o confusas?
4. ¿Hay al menos un momento de animación que me sorprendió o me hizo sentir algo?
5. ¿El ritmo de la animación respira — hay pausas, anticipaciones, acentos?

### Señales de Alerta (Red Flags)

- Todos los personajes se mueven igual.
- Expresiones faciales que no coinciden con la emoción del diálogo.
- Acciones de acción confusas donde no se entiende qué pasó.
- Movimientos que flotan sin sensación de gravedad.
- Animación "correcta" pero sin personalidad.

---

## Dimensión 5: Audiencia

**Pregunta central:** ¿Conecta con el público objetivo?

### Criterios de Evaluación

- [ ] **Público definido.** ¿Está claro para quién es esta historia?
- [ ] **Accesibilidad.** ¿Un espectador nuevo puede engancharse sin conocimiento previo?
- [ ] **Capas de lectura.** ¿Hay contenido que funciona para diferentes edades o niveles de sofisticación?
- [ ] **Gancho desde el inicio.** ¿Los primeros 3 minutos enganchan?
- [ ] **Conexión emocional.** ¿El público puede identificarse con algún personaje o situación?
- [ ] **Rewatchability.** ¿Hay detalles, chistes o capas que recompensan volver a ver?
- [ ] **Resonancia cultural.** ¿Los temas son universales o al menos relevantes para la audiencia objetivo?

### Preguntas para el Revisor

1. ¿A quién le recomendaría esta serie y por qué?
2. ¿Un niño de 8 años puede seguir la trama principal?
3. ¿Un adulto encontrará capas que le interesen?
4. ¿Hay algún momento que genuinamente me emocionó, me hizo reír o me sorprendió?
5. ¿Quiero ver el siguiente episodio?

### Señales de Alerta (Red Flags)

- No está claro para qué edad o público es.
- Los temas son demasiado nicho sin un gancho universal.
- Los primeros minutos son lentos o confusos.
- El humor depende de referencias que caducan rápido.
- El tono oscila entre infantil y adulto sin intención.

---

## Dimensión 6: Marca / Franquicia

**Pregunta central:** ¿Tiene potencial de franquicia?

### Criterios de Evaluación

- [ ] **Universo expandible.** ¿El mundo tiene espacio para más historias?
- [ ] **Personajes icónicos.** ¿Los personajes tienen potencial para convertirse en iconos culturales?
- [ ] **Visual merchandisable.** ¿Los diseños funcionan en productos (juguetes, ropa, posters)?
- [ ] **Nombre memorable.** ¿El título y los nombres de personajes son fáciles de recordar y pronunciar?
- [ ] **Identidad visual fuerte.** ¿La serie tiene un "look" propio que es inmediatamente reconocible?
- [ ] **Multi-plataforma.** ¿La historia puede extenderse a juegos, libros, cómics, experiencias?
- [ ] **Longevidad.** ¿El concepto puede sostener múltiples temporadas sin agotarse?

### Preguntas para el Revisor

1. ¿Puedo imaginar a un niño pidiendo un juguete de este personaje?
2. ¿El universo tiene suficientes "rincones sin explorar" para spin-offs?
3. ¿La serie tiene un estilo visual que funcionaría como marca (logo, colores, iconografía)?
4. ¿Puedo explicar el concepto de la serie en 10 segundos y que alguien quiera saber más?
5. ¿Este concepto seguirá siendo relevante en 10 años?

### Señales de Alerta (Red Flags)

- La historia depende tanto de su trama que no permite spin-offs.
- Los diseños son bonitos pero no merchandisables (demasiado complejos, sin contraste).
- El concepto es tan nicho que limita la audiencia potencial.
- Los nombres son difíciles de recordar o pronunciar.
- La serie depende de una tendencia que puede pasar de moda.

---

## Proceso de Revisión

### Paso 1: Autoevaluación
El agente creador evalúa su propio trabajo con los criterios de la dimensión correspondiente antes de presentarlo. Si no pasa su propia autoevaluación, itera antes de presentar.

### Paso 2: Revisión por Pares
Al menos un agente diferente revisa el trabajo usando los criterios de este documento. Las notas deben ser específicas y accionables.

### Paso 3: Revisión del Review Board
El Review Board evalúa las 6 dimensiones y asigna puntuaciones. Se documenta cada puntuación con justificación.

### Paso 4: Decisión

| Resultado | Condición | Siguiente Paso |
|-----------|-----------|----------------|
| **Aprobado** | Todas las dimensiones ≥ 3, promedio ≥ 3.5 | Avanzar a la siguiente fase |
| **Aprobado con notas** | Todas ≥ 3, pero hay notas menores | Integrar notas y avanzar |
| **Iteración requerida** | Alguna dimensión en 2 | Volver al agente responsable con notas específicas |
| **Replanteo** | Alguna dimensión en 1 | Reunión de equipo. Posible cambio de dirección |

### Paso 5: Iteración
Si el trabajo vuelve a iterarse:
1. Las notas de revisión se adjuntan al trabajo.
2. El agente responsable tiene un máximo de 3 intentos por fase.
3. Si después de 3 intentos no se alcanza el estándar, se escala al Director Narrativo / Art Director.
4. Después de la iteración, el trabajo vuelve al Paso 2.

---

## Registro de Revisiones

Cada revisión se documenta con:

```
## Revisión: [Nombre del Proyecto] — [Fase]
Fecha: [YYYY-MM-DD]
Revisor: [Agente/Persona]

| Dimensión | Puntuación | Justificación |
|-----------|-----------|---------------|
| Narrativa | X/5 | ... |
| Personajes | X/5 | ... |
| Arte/Visual | X/5 | ... |
| Animación | X/5 | ... |
| Audiencia | X/5 | ... |
| Marca | X/5 | ... |

**Promedio: X.X/5**
**Decisión: [Aprobado / Aprobado con notas / Iteración / Replanteo]**

### Notas Detalladas
- ...

### Acciones Requeridas
- ...
```

---

*La revisión es donde nace la excelencia. No la temas — úsala.*', 'system')
  ('Protagonistas — Principios de escritura', ARRAY['craft:personajes'], '#9B6FD4', '# Protagonistas

## Proposito de este documento

Este archivo define los principios fundamentales para crear protagonistas memorables en cualquier proyecto del estudio. No es una plantilla para rellenar: es un sistema de pensamiento que todo agente debe internalizar antes de disenar un personaje central. Un protagonista debil hunde cualquier historia, sin importar que tan brillante sea el mundo o la animacion.

---

## Principios Fundamentales

### 1. El deseo es el motor, la necesidad es el destino

Todo protagonista opera en dos niveles simultaneos. El **deseo** es lo que el personaje cree que quiere: es consciente, articulable, y dirige sus acciones externas. La **necesidad** es lo que realmente le falta para ser una persona completa: es inconsciente, y el personaje la niega o la desconoce. La historia existe en la tension entre estos dos niveles. Si el deseo y la necesidad son lo mismo, no hay arco. Si no hay arco, no hay historia.

### 2. El defecto no es decorativo, es estructural

El defecto del protagonista no es un capricho de personalidad para hacerlo "interesante". Es la razon por la que no puede obtener lo que necesita al inicio de la historia. El defecto debe ser la causa directa de sus peores decisiones. Debe ser lo suficientemente profundo para que el publico entienda por que el personaje no puede simplemente "elegir mejor". El defecto nace de una herida, una creencia equivocada sobre el mundo que el personaje adopto como mecanismo de supervivencia.

### 3. Conexion instantanea, no explicacion gradual

El publico decide en los primeros 90 segundos si le importa el protagonista. Esta conexion no se logra con backstory ni con exposicion. Se logra con tres herramientas: **empatia** (el personaje sufre algo injusto o enfrenta una situacion que todos reconocemos), **competencia** (el personaje es bueno en algo, lo cual genera admiracion), y **simpatia** (el personaje muestra generosidad, humor o vulnerabilidad). No se necesitan las tres, pero se necesita al menos una con fuerza.

### 4. Las decisiones revelan al personaje, no los dialogos

Un protagonista se define por lo que hace cuando esta bajo presion, no por lo que dice sobre si mismo. Cada decision importante debe poner al personaje en una encrucijada donde ambas opciones tienen costo. Las decisiones faciles no revelan nada. Las decisiones imposibles revelan todo.

### 5. La identidad visual es una extension del conflicto interno

El diseno visual del protagonista no es estetica separada de la narrativa. La forma, el color, la postura, la silueta, el vestuario, todo comunica el estado interno del personaje. Un protagonista que carga culpa se disena diferente a uno que esconde miedo. La transformacion interna debe tener un reflejo visual, aunque sea sutil. El publico debe poder "leer" al personaje antes de que diga una sola palabra.

### 6. El protagonista es activo, no pasivo

Un protagonista que reacciona a lo que le pasa no es un protagonista: es un testigo. El personaje central debe tomar decisiones que muevan la trama hacia adelante, incluso si esas decisiones son erroneas. La agencia es innegociable. Un protagonista puede empezar pasivo, pero la historia debe forzarlo a actuar, y esa transicion debe sentirse como un punto de no retorno.

### 7. La vulnerabilidad es la puerta de entrada al publico

Los protagonistas invulnerables son aburridos. La audiencia no se conecta con la fuerza; se conecta con lo que esta en riesgo de perderse. El protagonista debe tener algo que le importa profundamente y que puede perder. Esa cosa en riesgo (una relacion, un lugar, una version de si mismo) es lo que da peso emocional a cada escena.

### 8. El protagonista no existe en el vacio

Un protagonista se define tanto por sus relaciones como por sus atributos internos. Quien lo ama, quien lo desafia, quien lo necesita: estas relaciones son espejos que revelan facetas diferentes del mismo personaje. Un protagonista sin relaciones significativas es un concepto, no una persona.

---

## Checklist de Creacion

Antes de dar por terminado el diseno de un protagonista, todo agente debe responder estas preguntas con claridad y precision. Si alguna respuesta es vaga o generica, el personaje no esta listo.

- [ ] Cual es el deseo consciente del protagonista? Puede articularse en una oracion simple?
- [ ] Cual es la necesidad inconsciente? Es diferente al deseo? Es contraria?
- [ ] Cual es el defecto central? De que herida o creencia equivocada nace?
- [ ] Que decision tomaria este personaje que ningun otro personaje de la historia tomaria?
- [ ] En los primeros 90 segundos, por que le importaria al publico? Empatia, competencia o simpatia?
- [ ] El protagonista toma decisiones que mueven la trama, o solo reacciona?
- [ ] Que esta en riesgo de perder? Por que eso le importa mas que cualquier otra cosa?
- [ ] La silueta del personaje comunica su estado emocional sin necesidad de dialogo?
- [ ] Las relaciones del protagonista revelan facetas diferentes de su personalidad?
- [ ] El defecto del protagonista es la causa directa de al menos tres problemas en la historia?
- [ ] Existe una version del protagonista al inicio y otra al final? Son reconociblemente la misma persona pero fundamentalmente diferentes?

---

## Errores Comunes

### El protagonista "perfecto disfrazado"

El personaje tiene un defecto superficial (es torpe, llega tarde, es sarcastico) que no tiene consecuencias reales en la historia. Este no es un defecto; es una peculiaridad. Si el defecto no causa dano real al protagonista o a quienes lo rodean, no es un defecto.

### El backstory como sustituto de personalidad

Explicar la infancia traumatica del personaje no reemplaza mostrarlo tomando decisiones en el presente. El publico empatiza con acciones, no con informacion. Un personaje con un pasado fascinante pero un presente inerte es un archivo, no un protagonista.

### La motivacion generica

"Quiere salvar al mundo" o "quiere ser feliz" no son deseos funcionales. Un deseo debe ser especifico, concreto y medible. El publico necesita saber exactamente que aspecto tiene el exito para este personaje en particular.

### El protagonista sin precio

Si el protagonista puede obtener lo que quiere sin sacrificar nada, no hay drama. Cada avance hacia el deseo debe costar algo. Si no le cuesta, el publico no siente que se lo haya ganado.

### Confundir simpatia con interes

Un protagonista no necesita ser amable para ser interesante. Puede ser egoista, cobarde o cruel, siempre que el publico entienda por que actua asi y perciba la posibilidad de cambio. La amabilidad sin complejidad produce personajes olvidables.

### El diseno visual desconectado del alma

Un protagonista cuyo diseno visual fue creado pensando solo en "que se vea cool" sin considerar como la forma expresa el conflicto interno. La apariencia debe ser consecuencia del personaje, no un poster pegado encima.

---

## Criterios de Calidad

Un protagonista cumple con el estandar del estudio cuando:

1. **Test de la decision unica**: Si reemplazas al protagonista por otro personaje cualquiera en la escena clave, la decision cambiaria. Si la respuesta es no, el protagonista no tiene voz propia.

2. **Test del deseo vs. necesidad**: El publico puede articular tanto el deseo como la necesidad del protagonista, y entiende la tension entre ambos antes del segundo acto.

3. **Test del primer minuto**: En los primeros 90 segundos de pantalla, el protagonista genera al menos una reaccion emocional (risa, preocupacion, admiracion, ternura).

4. **Test de la silueta**: Si muestras solo la silueta del personaje a alguien que no conoce la historia, esa persona puede inferir al menos un rasgo de personalidad.

5. **Test de la herida**: El defecto del protagonista es rastreable a una experiencia formativa que el publico puede intuir, aunque no se muestre explicitamente.

6. **Test del precio**: Al final de la historia, el protagonista ha pagado un costo real y significativo. Lo que gano no fue gratis.

7. **Test de la transformacion visible**: Hay al menos un momento visual donde el cambio interno del protagonista se manifiesta en su apariencia, postura, o relacion con el espacio.

8. **Test de la relacion reveladora**: Al menos una relacion del protagonista muestra una faceta de su personalidad que no se ve en ninguna otra interaccion.

---

## Nota Final

El protagonista no es el personaje mas interesante porque es el centro de la historia. Es el centro de la historia porque es el personaje mas interesante. Si otro personaje resulta mas fascinante, o el protagonista es quien realmente deberia serlo, o la historia esta centrada en la persona equivocada.', 'system')
  ('Antagonistas — Principios de escritura', ARRAY['craft:personajes'], '#D4256A', '# Antagonistas

## Proposito de este documento

Este archivo establece los principios para crear antagonistas que eleven la historia en lugar de simplemente obstaculizarla. Un antagonista debil es el defecto mas comun y mas destructivo en cualquier narrativa. No importa que tan brillante sea el protagonista: sin una fuerza opositora a su altura, la historia se desinfla. El antagonista no es un obstaculo; es el argumento mas poderoso en contra de la tesis del protagonista.

---

## Principios Fundamentales

### 1. El antagonista cree que tiene razon, y en cierta medida la tiene

El villano que sabe que es malvado es una caricatura. Los antagonistas memorables operan desde una logica interna coherente. Tienen una vision del mundo que, desde su perspectiva, justifica cada accion. Lo que los hace antagonistas no es que esten equivocados en todo, sino que su verdad parcial se ha distorsionado hasta convertirse en algo destructivo. El publico debe poder entender su razonamiento aunque no lo comparta.

### 2. El antagonista es el espejo oscuro del protagonista

El antagonista y el protagonista comparten algo fundamental: un miedo, una herida, un deseo, una circunstancia de origen. Lo que los diferencia es la respuesta que eligieron ante esa experiencia compartida. El protagonista y el antagonista son dos respuestas posibles a la misma pregunta. Esta relacion de espejo es lo que convierte al antagonista en la prueba definitiva del protagonista: "podrias haber terminado como yo".

### 3. La amenaza debe ser escalable y creible

Un antagonista que es igualmente peligroso en la primera escena y en la ultima es un antagonista estatico. La amenaza debe crecer conforme avanza la historia. Esto no significa simplemente "mas poder": significa que el antagonista se adapta, aprende de sus errores, y responde a las acciones del protagonista. Un antagonista reactivo es mas aterrador que uno todopoderoso.

### 4. El antagonista prueba el defecto del protagonista

La funcion narrativa del antagonista es crear situaciones que expongan y exploten el defecto del protagonista. Cada confrontacion debe forzar al protagonista a enfrentar exactamente aquello que mas teme o que mas niega. Si el protagonista teme el abandono, el antagonista lo aisla. Si el protagonista esconde su vulnerabilidad, el antagonista la expone. El antagonista es la presion que obliga al diamante a formarse.

### 5. La motivacion no es la maldad, es la vision

"Quiere poder" o "quiere destruir" no son motivaciones. Son sintomas. La motivacion del antagonista debe responder a la pregunta: "Que mundo quiere construir?" Incluso el antagonista mas violento tiene una imagen de como deberian ser las cosas. Esa imagen esta distorsionada, pero es genuina. La motivacion se construye desde el "para que", no desde el "que".

### 6. El antagonista tiene su propio arco

Los mejores antagonistas cambian a lo largo de la historia. No necesariamente se redimen, pero evolucionan. Pueden endurecerse, desesperarse, revelarse, o descubrir que su plan tiene un costo que no anticiparon. Un antagonista completamente estatico es un mecanismo, no un personaje.

### 7. La presencia no requiere pantalla

Un antagonista poderoso afecta las decisiones del protagonista incluso cuando no esta en escena. Su sombra se siente en cada eleccion que el protagonista toma para evitarlo, prepararse para el, o responder a sus acciones pasadas. Si el antagonista solo existe cuando aparece en pantalla, es un obstaculo episodico, no una fuerza narrativa.

### 8. El respeto del antagonista hacia el protagonista valida al heroe

Cuando el antagonista reconoce al protagonista como un rival digno, el publico siente que el heroe ha ganado algo. Cuando el antagonista subestima al protagonista y despues se ve forzado a reconsiderar, la audiencia siente la satisfaccion del crecimiento del heroe. La relacion entre ambos debe tener un arco propio.

---

## Checklist de Creacion

- [ ] Cual es la vision del mundo del antagonista? Si le dieras cinco minutos para explicar por que tiene razon, que diria?
- [ ] Que experiencia comparte con el protagonista? Cual es el punto de divergencia entre ambos?
- [ ] Que aspecto especifico del defecto del protagonista explota el antagonista?
- [ ] La amenaza del antagonista crece a lo largo de la historia? Como se adapta?
- [ ] El antagonista tiene una motivacion que va mas alla de "detener al protagonista"?
- [ ] El antagonista toma decisiones propias que no dependen de las acciones del protagonista?
- [ ] Hay al menos un momento donde el publico entiende (no justifica, entiende) la posicion del antagonista?
- [ ] El antagonista tiene algo que perder? Que arriesga?
- [ ] El antagonista cambia de alguna forma entre su primera y ultima aparicion?
- [ ] La presencia del antagonista se siente en escenas donde no aparece fisicamente?
- [ ] El diseno visual del antagonista tiene una relacion deliberada (contraste o eco) con el del protagonista?

---

## Errores Comunes

### El villano porque si

Un antagonista cuya unica motivacion es "ser malvado" o "destruir cosas". Este tipo de antagonista revela pereza narrativa. Si no puedes explicar por que el antagonista cree que sus acciones son necesarias, no has terminado de construirlo.

### El antagonista todopoderoso sin vulnerabilidad

Un villano que lo puede todo y no tiene puntos debiles no genera tension; genera frustracion. La audiencia necesita percibir que la derrota del antagonista es posible pero dificil. La omnipotencia sin grietas produce historias donde la victoria del heroe se siente arbitraria.

### El espejo roto: antagonista sin conexion tematica

Si el antagonista y el protagonista no comparten ningun eje tematico, la historia tiene dos narrativas compitiendo en lugar de una sola explorando un tema con profundidad. El antagonista que podria ser el villano de cualquier historia no le pertenece a ninguna.

### La revelacion tardia como muleta

Revelar la motivacion del antagonista solo al final de la historia priva al publico de la tension dramatica que produce entender por que el villano actua como actua. La motivacion debe sentirse presente desde el principio, aunque los detalles se revelen gradualmente.

### El antagonista reducido a obstaculo fisico

Si el unico conflicto que genera el antagonista es fisico (peleas, persecuciones, enfrentamientos de poder), el personaje funciona como un nivel de videojuego, no como una fuerza narrativa. El mejor conflicto con el antagonista es moral e intelectual, no solo fisico.

### La simetria forzada

Hacer que el antagonista sea literalmente igual al protagonista pero "en malvado" es superficial. El espejo debe ser tematico, no literal. Comparten una herida o una pregunta existencial, no necesariamente un poder, un origen identico o un aspecto visual calcado.

---

## Criterios de Calidad

1. **Test del fiscal**: Si el antagonista pudiera presentar su caso ante un jurado imparcial, al menos un miembro del jurado dudaria. Si su argumento no convence a nadie, el antagonista es un estereotipo.

2. **Test del espejo**: Se puede articular en una oracion que comparten el protagonista y el antagonista y en que divergen. Si no, la conexion tematica es debil.

3. **Test de la escalada**: La amenaza del antagonista en el tercer acto es cualitativamente diferente (no solo cuantitativamente mayor) que en el primero.

4. **Test de la escena robada**: Hay al menos una escena donde el antagonista es el personaje mas fascinante en pantalla, no por ser espectacular, sino por ser humano.

5. **Test de la sombra**: Si eliminas toda escena donde el antagonista aparece fisicamente, su influencia sigue sintiendose en las decisiones del protagonista.

6. **Test de la alternativa**: Si imaginas al antagonista como protagonista de su propia historia, esa historia tiene sentido y genera interes.

7. **Test del costo**: El antagonista paga un precio por sus acciones. Su camino tiene consecuencias que el mismo siente, aunque no las reconozca.

8. **Test del duelo final**: El enfrentamiento final entre protagonista y antagonista resuelve un conflicto tematico, no solo un conflicto de poder.

---

## Nota Final

Un antagonista no es alguien a quien derrotar. Es alguien a quien refutar. La victoria del protagonista no consiste en ser mas fuerte que el antagonista, sino en demostrar, con sus acciones, que hay una mejor respuesta a la pregunta que ambos comparten. Si la historia termina y lo unico que el protagonista hizo fue ganar una pelea, el antagonista cumplio su funcion mecanica pero no su funcion narrativa.', 'system')
  ('Evolución de Personajes — Arcos narrativos', ARRAY['craft:personajes'], '#9B6FD4', '# Evolucion de Personajes

## Proposito de este documento

Este archivo establece los principios para disenar arcos de transformacion que se sientan ganados, inevitables y profundamente humanos. La evolucion de un personaje es la columna vertebral emocional de toda historia. Si el cambio se siente abrupto, el publico se desconecta. Si se siente predecible, el publico se aburre. Si se siente imposible, el publico no lo cree. El arco de un personaje debe sentirse como la unica forma en que esa persona especifica habria cambiado bajo esas circunstancias especificas.

---

## Principios Fundamentales

### 1. El cambio no es un evento, es un proceso

Un personaje no "cambia" en una escena. Cambia a lo largo de toda la historia, a traves de una acumulacion de presiones, revelaciones y decisiones que van erosionando su creencia equivocada y construyendo una nueva comprension del mundo. Cada escena del arco aporta un grado mas de transformacion. Si el cambio ocurre de golpe, no es evolucion; es un interruptor.

### 2. La creencia equivocada es el punto de partida

Todo arco comienza con una creencia equivocada que el personaje sostiene como verdad absoluta. Esta creencia no es estupida ni irracional: fue la mejor respuesta que el personaje pudo dar a una experiencia dolorosa. "No puedo confiar en nadie" no es una idea tonta; es un mecanismo de supervivencia que se creo en un contexto donde tenia sentido. El arco consiste en que el personaje descubra que esa creencia, aunque util en el pasado, se ha convertido en una prision en el presente.

### 3. Tres tipos de arco, tres propositos narrativos

**Arco positivo**: El personaje comienza con una creencia equivocada y, a traves de la historia, la abandona por una verdad mas amplia. Es el arco mas comun y el mas satisfactorio emocionalmente. El protagonista empieza incompleto y termina transformado. Ejemplo: de la desconfianza a la vulnerabilidad, del aislamiento a la conexion, del miedo al coraje.

**Arco negativo**: El personaje comienza con un germen de verdad pero, bajo la presion de la historia, lo abandona y abraza una mentira mas oscura. Es un arco tragico que muestra como las circunstancias pueden destruir incluso a personas con buenas intenciones. Ejemplo: de la esperanza al cinismo, de la justicia a la venganza, de la compasion a la crueldad.

**Arco plano**: El personaje no cambia porque ya posee la verdad que la historia necesita. En cambio, transforma el mundo a su alrededor. Este arco no es ausencia de cambio; es una prueba de resistencia. El mundo intenta quebrar la verdad del personaje, y el personaje se niega a ceder. Ejemplo: un personaje que cree en la bondad enfrenta un mundo que lo castiga por ello, pero no abandona su posicion.

### 4. Los catalizadores deben ser especificos y personales

Un catalizador para el cambio no es un evento cualquiera: es un evento que ataca directamente la creencia equivocada del personaje. Un personaje que teme el abandono no cambia porque enfrenta un monstruo; cambia porque alguien que juro nunca irse se va, o porque alguien que no deberia quedarse se queda. El catalizador debe presionar exactamente el nervio correcto. Si el catalizador podria funcionar para cualquier personaje, no esta lo suficientemente personalizado.

### 5. Los puntos de quiebre marcan las fases del arco

Todo arco tiene momentos de quiebre donde la tension entre la creencia equivocada y la verdad emergente se vuelve insostenible. Estos puntos no son graduales; son crisis. El personaje se ve forzado a tomar una decision que lo acerca o lo aleja de la transformacion. Los puntos de quiebre tipicos son:

- **El primer fracaso**: La creencia equivocada falla por primera vez. El personaje la defiende, la racionaliza, o busca excusas.
- **La confrontacion con el espejo**: Alguien (el antagonista, el mentor, el sidekick) le dice la verdad al personaje directamente. El personaje la rechaza.
- **La noche oscura**: La creencia equivocada lleva al personaje al peor momento posible. Todo lo que temia se materializa precisamente porque actuo desde el miedo.
- **La eleccion final**: El personaje elige conscientemente entre la creencia equivocada y la verdad. Esta decision es el arco completo, concentrado en un instante.

### 6. El cambio debe costar algo

Una transformacion sin sacrificio es un deseo cumplido, no un arco. Abandonar la creencia equivocada significa perder las protecciones que esa creencia ofrecia. El personaje que aprende a confiar se vuelve vulnerable. El personaje que deja el control pierde certidumbre. El personaje que elige perdonar renuncia a la justicia. El costo es lo que hace que el cambio se sienta real y valiente.

### 7. La recaida es esencial

Ningun cambio real es lineal. El personaje debe tener momentos donde regresa a su patron anterior, donde la creencia equivocada parece tentadoramente segura. Estas recaidas no son retrocesos narrativos; son pruebas de la profundidad de la herida original. Cada recaida debe ser mas breve y menos convincente que la anterior, mostrando que el personaje esta ganando terreno aunque tropiece.

### 8. El cambio se demuestra con acciones, no con declaraciones

El momento culminante del arco no es cuando el personaje dice "he cambiado" o "ahora entiendo". Es cuando toma una decision que la version anterior de si mismo jamas habria tomado. Sin discurso, sin explicacion, sin fanfarria. La accion habla. El publico ve la transformacion en lo que el personaje hace bajo presion, no en lo que dice en un momento de calma.

### 9. La transformacion fisica refleja la transformacion interna

El arco del personaje debe tener un eco visual. Esto puede ser sutil (un cambio de postura, un color que aparece o desaparece, una prenda que se quita o se pone) o dramatico (una transformacion fisica literal). Lo importante es que el publico pueda ver el viaje interno externalizado de alguna forma. El personaje del tercer acto no debe verse identico al del primero.

---

## Checklist de Creacion

- [ ] Cual es la creencia equivocada del personaje al inicio? De que experiencia nace? Por que fue racional en su momento?
- [ ] Que tipo de arco es (positivo, negativo, plano)? Esa eleccion es deliberada y sirve al tema de la historia?
- [ ] Cuales son los catalizadores especificos que presionan la creencia equivocada? Esos catalizadores son personales para este personaje?
- [ ] Cuales son los puntos de quiebre? Hay al menos tres momentos de crisis donde el personaje se ve forzado a elegir?
- [ ] Que cuesta el cambio? Que pierde el personaje al abandonar su creencia equivocada?
- [ ] Hay al menos un momento de recaida donde el personaje regresa temporalmente a su patron anterior?
- [ ] La transformacion se demuestra con una accion especifica en el climax, no con un discurso?
- [ ] Hay un eco visual del cambio interno? El personaje se ve diferente al final que al principio?
- [ ] Si trazas una linea entre la creencia equivocada del primer acto y la verdad del tercero, cada escena del arco aporta un grado de movimiento entre ambas?
- [ ] El cambio es especifico para este personaje? Otro personaje con la misma creencia equivocada habria cambiado de la misma manera?

---

## Errores Comunes

### El cambio instantaneo

El personaje tiene un momento de revelacion y a partir de ahi es una persona completamente diferente. Esto no es evolucion; es una abduccion narrativa. El cambio instantaneo viola la psicologia basica del comportamiento humano y rompe la suspension de incredulidad del publico.

### El arco sin costo

El personaje "crece" pero no pierde nada en el proceso. Aprende a ser valiente sin enfrentar miedo real. Aprende a confiar sin arriesgar traicion. Aprende a amar sin riesgo de perdida. Si el cambio no duele, no se siente ganado.

### La declaracion en lugar de la demostracion

El personaje anuncia que ha cambiado: "Antes tenia miedo, pero ahora soy valiente". Esto no es mostrar el arco; es comentarlo. La audiencia no necesita que le digan que el personaje cambio. Necesita verlo actuar diferente.

### La recaida eliminada

El arco va en linea recta desde el defecto hasta la virtud sin ningun tropiezo. Esto produce un cambio que se siente mecanico y predecible. Las recaidas le dan textura al arco y le recuerdan al publico que el cambio es dificil.

### El catalizador generico

Un evento que "cambiaria a cualquiera" (una explosion, una muerte aleatoria, una catastrofe) funciona como catalizador. Pero el catalizador mas poderoso no es el que cambiaria a cualquiera, sino el que solo cambiaria a este personaje especifico, porque ataca su punto debil unico.

### El arco plano accidental

Un personaje que no cambia porque el guionista no supo como cambiarlo, disfrazado como un arco plano deliberado. La diferencia es clara: en un arco plano autentico, el mundo cambia alrededor del personaje como resultado de su firmeza. En un arco plano accidental, simplemente nada significativo le ocurre al personaje.

### La transformacion sin semilla

El cambio del personaje al final de la historia no tiene precedentes en su comportamiento anterior. Nunca se sembro la capacidad de cambiar. El publico necesita ver destellos tempranos de la verdad que el personaje eventualmente abrazara, enterrados bajo capas de la creencia equivocada. La semilla debe plantarse en el primer acto para que la cosecha del tercero se sienta organica.

---

## Criterios de Calidad

1. **Test de la inevitabilidad**: Cuando el publico ve la transformacion final, siente que era la unica forma en que este personaje podia haber terminado. No predecible, sino inevitable en retrospectiva.

2. **Test del gradiente**: Si divides la historia en diez segmentos, el personaje esta en un punto diferente de su arco en cada uno. No hay bloques donde el personaje sea identico a su estado anterior o posterior.

3. **Test del sacrificio**: Se puede nombrar algo especifico que el personaje perdio al cambiar. No algo abstracto como "su vieja forma de ser", sino algo concreto: una relacion, una seguridad, una identidad, una posibilidad.

4. **Test de la semilla**: Hay al menos un momento en el primer acto donde la verdad final del personaje se insinua. El publico, al revisitar la historia, puede senalar ese momento y decir "ahi estaba".

5. **Test de la decision**: El climax del arco es una decision activa del personaje, no algo que le sucede. El personaje elige cambiar; el cambio no le ocurre pasivamente.

6. **Test de la recaida**: Al menos una vez despues de un avance significativo, el personaje vuelve a su patron anterior. Esa recaida se siente humana, no frustrante.

7. **Test del espejo fisico**: Se puede identificar al menos un cambio visual entre el personaje del primer acto y el del tercero que refleja su transformacion interna.

8. **Test de la accion silenciosa**: El momento clave del arco se puede entender sin dialogo. Si apagas el sonido, el cambio sigue siendo visible en lo que el personaje hace.

9. **Test de la especificidad**: El arco de este personaje no funcionaria para otro personaje. Las circunstancias, los catalizadores, los puntos de quiebre y la verdad final son especificos para esta persona y su herida particular.

---

## Nota Final

La evolucion de un personaje no es lo que le pasa. Es lo que elige hacer con lo que le pasa. Dos personajes pueden enfrentar la misma tragedia y uno se rompe mientras el otro se fortalece. La diferencia no esta en la tragedia; esta en quien eran antes de que ocurriera y en que eligen ser despues. El trabajo del narrador no es mover al personaje del punto A al punto B. Es hacer que el publico sienta que estuvo presente en cada paso del camino y que, al llegar al final, sienta que no podia haber sido de otra manera.', 'system')
  ('El Mentor — Principios de escritura', ARRAY['craft:personajes'], '#9B6FD4', '# Mentor

## Proposito de este documento

Este archivo define los principios para crear mentores que funcionen como catalizadores narrativos, no como enciclopedias ambulantes. El mentor es uno de los arquetipos mas antiguos y mas malinterpretados. No existe para dar respuestas al protagonista. Existe para hacer las preguntas correctas, para representar un camino que el heroe debe trascender, y para demostrar que la sabiduria tiene un costo. Un mentor bien construido transforma la historia. Un mentor mal construido la detiene.

---

## Principios Fundamentales

### 1. El mentor es el puente entre el mundo ordinario y el extraordinario

El mentor aparece en el momento donde el protagonista enfrenta un umbral que no puede cruzar solo. Su funcion no es eliminar el obstaculo, sino darle al protagonista las herramientas, la confianza o la perspectiva para enfrentarlo. El mentor no cruza el umbral por el heroe; le muestra que el umbral puede cruzarse. Esta distincion es critica: un mentor que resuelve los problemas del protagonista lo infantiliza.

### 2. La sabiduria del mentor nace de sus propias cicatrices

Un mentor que solo sabe cosas es un libro de texto. Un mentor que sabe cosas porque las vivio, las sufrio y pago un precio por ellas es un personaje. La sabiduria sin costo es informacion. La sabiduria con costo es autoridad moral. El publico debe intuir que el mentor llego a donde esta a traves de un camino dificil, y que ese camino lo marco tanto como lo enseno.

### 3. El mentor debe ser falible

Un mentor perfecto es una fantasia paternalista que le quita responsabilidad al protagonista. Los mejores mentores tienen puntos ciegos, limitaciones, y errores de juicio que el protagonista eventualmente debera reconocer y superar. La falibilidad del mentor no es un defecto del personaje; es una necesidad narrativa. Si el mentor tiene todas las respuestas, el protagonista no necesita crecer.

### 4. El mentor representa el viejo camino que el heroe debe trascender

Este es el principio mas importante y el mas ignorado. El mentor no es el destino del protagonista; es el punto de partida de su transformacion. El mentor ensena lo que sabe, pero lo que sabe pertenece a su generacion, a su contexto, a sus limitaciones. El protagonista debe absorber las ensenanzas del mentor y luego superarlas, adaptarlas, o rechazar las que ya no sirven. Si el protagonista termina la historia siendo una copia del mentor, la historia fallo.

### 5. El momento de la partida es inevitable y necesario

Todo mentor debe irse. Puede morir, puede traicionar, puede retirarse, puede revelarse incapaz de continuar. Pero debe dejar al protagonista solo frente al desafio final. Este momento de partida no es un evento; es una transformacion narrativa. Marca el instante donde el protagonista pasa de aprender a aplicar, de seguir a liderar, de depender a ser autonomo. Si el mentor esta presente en la batalla final, el protagonista no ha completado su arco.

### 6. El mentor tiene su propia agenda

Un mentor sin motivaciones propias es un dispensador de consejos. Los mejores mentores tienen razones personales para guiar al protagonista: culpa, redencion, ambicion no resuelta, el deseo de corregir un error pasado a traves del exito del alumno. Estas motivaciones pueden alinearse con las del protagonista, pero no deben ser identicas. La tension entre lo que el mentor quiere para el protagonista y lo que el protagonista necesita para si mismo produce momentos narrativos extraordinarios.

### 7. La ensenanza no es verbal, es experiencial

Los peores mentores dan discursos. Los mejores mentores crean situaciones. Un mentor que le dice al protagonista "debes ser valiente" no ensena nada. Un mentor que pone al protagonista en una situacion donde la valentia es la unica opcion ensena todo. La metodologia del mentor revela su personalidad: un mentor impaciente lanza al protagonista al fuego; un mentor cauteloso construye desafios graduales; un mentor herido ensena a traves del ejemplo negativo.

### 8. La relacion mentor-alumno tiene un arco propio

La relacion empieza con una dinamica de poder desigual (el mentor sabe, el alumno no) y debe evolucionar hacia una de respeto mutuo o incluso inversion. Los momentos donde el alumno sorprende al mentor, lo contradice con fundamento, o le ensena algo, son momentos de enorme poder emocional. La relacion no puede ser estatica; si es la misma al final que al principio, ninguno de los dos crecio.

---

## Checklist de Creacion

- [ ] Que umbral ayuda el mentor a cruzar al protagonista? Es un umbral que el protagonista genuinamente no puede cruzar solo?
- [ ] Cual es el precio que el mentor pago por su sabiduria? Esa cicatriz es visible en como actua y ensena?
- [ ] En que se equivoca el mentor? Cual es su punto ciego o su limitacion fundamental?
- [ ] Que representa el mentor que el protagonista debera superar o trascender?
- [ ] Como y cuando se va el mentor? La partida esta motivada narrativamente o es un evento arbitrario?
- [ ] Cual es la motivacion personal del mentor para guiar al protagonista? Que gana o que intenta resolver?
- [ ] El mentor ensena a traves de experiencias o a traves de discursos? Su metodo de ensenanza revela su personalidad?
- [ ] La relacion mentor-alumno cambia a lo largo de la historia? Hay un momento donde la dinamica de poder se invierte o se equilibra?
- [ ] El protagonista termina la historia siendo diferente al mentor, no una copia de el?
- [ ] El diseno visual del mentor comunica tanto su sabiduria como su desgaste?

---

## Errores Comunes

### El oraculo infalible

Un mentor que siempre tiene razon, siempre dice lo correcto, y nunca se equivoca. Este personaje elimina la tension de cada escena donde aparece, porque el publico sabe que cualquier cosa que diga sera cierta. La infalibilidad es el enemigo de la buena narrativa.

### El mentor que no se va

Un mentor que permanece al lado del protagonista durante toda la historia, incluyendo el climax. Esto comunica que el protagonista nunca aprendio a valerse por si mismo, y transforma el arco del heroe en una historia de dependencia. La partida del mentor es un requisito narrativo, no una opcion.

### El canal de exposicion

Usar al mentor exclusivamente para explicar las reglas del mundo, la historia del universo, o los mecanismos de la trama. Un mentor que solo transmite informacion no es un personaje; es una funcion enciclopedica con forma humana.

### La sabiduria sin contexto

Un mentor que dice cosas profundas sin que esas reflexiones esten conectadas con su experiencia personal. "El miedo es la mente asesina" es una frase bonita. "Yo deje morir a alguien porque tuve miedo, y no pasa un dia sin que lo recuerde" es una ensenanza con peso.

### El mentor como premio

Presentar al mentor como una recompensa que el protagonista "merece" por ser especial. El mentor no elige al protagonista porque sea el elegido; lo elige porque ve en el algo especifico, a menudo algo que le recuerda a si mismo o a un error que quiere enmendar.

### El sacrificio gratuito

El mentor muere para motivar al protagonista, pero su muerte no tiene conexion con sus propios temas, decisiones o arco. La muerte del mentor debe ser consecuencia de su propia historia, no un dispositivo al servicio exclusivo del arco del heroe.

---

## Criterios de Calidad

1. **Test de la cicatriz**: El publico puede identificar al menos un momento pasado que explica por que el mentor ensena de la manera en que ensena. Su metodo pedagogico es consecuencia de su biografia, no una decision arbitraria.

2. **Test de la falibilidad**: El mentor se equivoca al menos una vez de manera significativa, y esa equivocacion tiene consecuencias reales que el protagonista debe manejar.

3. **Test de la trascendencia**: El protagonista hace al menos una cosa al final de la historia que el mentor no habria hecho, no podria haber hecho, o no habria aprobado. Esto demuestra que el alumno supero al maestro.

4. **Test de la partida**: El momento donde el mentor se va (muere, desaparece, se retira) se siente como el evento mas importante de la historia hasta ese punto, no como un tramite narrativo.

5. **Test de la motivacion oculta**: El mentor tiene una razon personal para guiar al protagonista que el protagonista no conoce completamente. Esta razon anada complejidad a la relacion, no solo intriga.

6. **Test de la ensenanza silenciosa**: Al menos una leccion del mentor se transmite sin palabras, a traves de acciones, decisiones, o la simple forma en que el mentor se comporta ante la adversidad.

7. **Test del eco**: Al menos una vez despues de la partida del mentor, el protagonista recuerda una ensenanza en un momento critico, pero la aplica de una manera que el mentor no anticipo.

8. **Test de la autonomia**: En el climax, el protagonista actua sin la guia del mentor y el publico siente que esta preparado para hacerlo, no porque el mentor le dio todas las herramientas, sino porque el protagonista aprendio a crear las suyas.

---

## Nota Final

El mentor no ensena al heroe a ganar. Le ensena a perder, a dudar, a caerse y a levantarse. Y luego se va, porque la ultima leccion del mentor es siempre la misma: que ya no lo necesitas. Si el publico llora cuando el mentor parte, no es porque el mentor era sabio. Es porque la relacion era real.', 'system')
  ('Sidekicks — Principios de escritura', ARRAY['craft:personajes'], '#9B6FD4', '# Sidekicks

## Proposito de este documento

Este archivo define los principios para crear sidekicks que enriquezcan la historia sin desestabilizarla. El sidekick es uno de los roles mas peligrosos en narrativa: demasiado debil y es olvidable; demasiado fuerte y eclipsa al protagonista. Un sidekick bien construido amplifica al heroe, revela facetas ocultas de su personalidad, y le da al publico un punto de entrada emocional diferente. Un sidekick mal construido es un accesorio comico que interrumpe el tono.

---

## Principios Fundamentales

### 1. El sidekick existe para revelar al protagonista

La funcion narrativa primaria del sidekick no es "acompanar" al protagonista. Es crear situaciones donde el protagonista muestre partes de si mismo que no mostraria estando solo. Con el sidekick, el protagonista piensa en voz alta, expresa dudas, muestra ternura, pierde la paciencia. El sidekick es el catalizador de la transparencia del heroe. Si el protagonista se comporta exactamente igual con y sin el sidekick, el sidekick no cumple su funcion.

### 2. El contraste es la razon de ser

El sidekick debe contrastar con el protagonista en al menos un eje fundamental: temperamento, metodo, vision del mundo, o relacion con el riesgo. Este contraste no es ornamental; es funcional. Produce friccion, debate, y momentos donde ambos personajes se ven obligados a justificar sus posiciones. Un sidekick que piensa, siente y actua igual que el protagonista es un eco, no un personaje.

### 3. El sidekick necesita voz propia

Tener funcion narrativa no es lo mismo que tener personalidad. El sidekick debe hablar, pensar y reaccionar de manera que no pueda confundirse con ningun otro personaje de la historia. Esto no se logra con muletillas o tics verbales; se logra con una cosmovision particular. El sidekick ve el mundo a traves de un lente que solo el tiene, y ese lente coloca todo lo que ocurre en la historia bajo una luz diferente.

### 4. Robar escenas sin robar la historia

Los mejores sidekicks tienen momentos que el publico recuerda para siempre. Pero esos momentos funcionan porque estan al servicio de la narrativa, no en contra de ella. Un sidekick roba la escena cuando dice la verdad que nadie mas dice, cuando actua con una valentia inesperada, o cuando revela una profundidad que el publico no anticipaba. No la roba siendo mas ruidoso, mas gracioso, o mas espectacular que todo lo demas.

### 5. El sidekick no es el alivio comico por defecto

Asignarle al sidekick la funcion exclusiva de "alivio comico" es reducir un personaje a un mecanismo de regulacion tonal. El humor puede ser parte de su personalidad, pero no debe ser su unica dimension. Un sidekick cuya unica contribucion es hacer chistes se convierte en un obstaculo para las escenas serias. Si no puede estar presente en los momentos graves sin romper el tono, no esta bien construido.

### 6. La lealtad debe tener un precio y un limite

Un sidekick cuya lealtad es incondicional y gratuita es un accesorio, no un personaje. La lealtad interesante tiene un origen (por que esta aqui?), un precio (que le cuesta quedarse?), y un limite (que tendria que pasar para que se fuera?). Las mejores historias prueban ese limite. El momento donde el sidekick considera o ejecuta la separacion es uno de los mas poderosos en la narrativa.

### 7. Tipos de relacion sidekick-protagonista

No todos los sidekicks operan igual. Reconocer el tipo de relacion permite construirla con precision:

- **El complemento**: Tiene las habilidades que al protagonista le faltan. Su valor es funcional pero la relacion se profundiza con el tiempo.
- **La conciencia**: Dice lo que el protagonista no quiere escuchar. Funciona como voz de la necesidad del heroe.
- **El espejo ingenuo**: Ve el mundo con ojos frescos y obliga al protagonista (y al publico) a cuestionar lo que da por sentado.
- **El veterano leal**: Ha estado con el protagonista desde antes de la historia. Conoce sus secretos y carga el peso de esa intimidad.
- **El aprendiz**: Admira al protagonista y lo fuerza a preguntarse si merece esa admiracion.
- **El antagonista reformado**: Empezo en el bando contrario. Su presencia genera tension constante porque la confianza nunca es completa.

### 8. El sidekick debe poder existir fuera de la orbita del protagonista

Aunque su funcion narrativa esta ligada al heroe, el sidekick debe sentirse como un ser que tiene vida propia fuera de la pantalla. Tiene preocupaciones, deseos y miedos que no giran exclusivamente alrededor del protagonista. Si eliminas al protagonista, el sidekick debe seguir siendo un personaje viable con su propia historia potencial.

---

## Checklist de Creacion

- [ ] Que aspecto del protagonista revela la presencia del sidekick que no se veria de otro modo?
- [ ] En que eje fundamental contrasta el sidekick con el protagonista?
- [ ] El sidekick tiene una cosmovision propia que es diferenciable de la del protagonista y de la del resto del elenco?
- [ ] Hay al menos un momento donde el sidekick roba la escena de manera organica (sin recurrir a ser mas ruidoso)?
- [ ] El sidekick puede estar presente en escenas serias sin romper el tono?
- [ ] Por que el sidekick es leal al protagonista? Que le cuesta esa lealtad? Cual es su limite?
- [ ] Que tipo de relacion sidekick-protagonista es? Esa eleccion es consciente y deliberada?
- [ ] El sidekick tiene deseos propios que no dependen del protagonista?
- [ ] Si el sidekick desapareciera de la historia, que escenas perderian profundidad?
- [ ] El diseno visual del sidekick contrasta con el del protagonista de manera que refuerza su relacion?
- [ ] El sidekick cambia a lo largo de la historia, aunque sea sutilmente?

---

## Errores Comunes

### El bufon permanente

Un sidekick que solo existe para hacer chistes. Cuando llega el momento dramatico, o desaparece de la escena (porque romperia el tono) o hace un chiste fuera de lugar (porque no sabe hacer otra cosa). Ambas opciones revelan un personaje incompleto.

### El asistente sin voluntad

Un sidekick que hace todo lo que el protagonista dice, nunca cuestiona, nunca propone, nunca se niega. Este personaje no es un sidekick; es un empleado. La ausencia de friccion entre protagonista y sidekick elimina una de las fuentes mas ricas de drama y revelacion de personaje.

### El robo total de escena

Un sidekick tan carismatico, tan divertido, tan fascinante que el publico desea que la historia sea sobre el en lugar del protagonista. Esto no es un logro; es un error de calibracion. El sidekick debe brillar con su propia luz, pero esa luz debe iluminar al protagonista, no cegarlo.

### La lealtad inexplicable

Un sidekick que arriesga su vida por el protagonista sin que jamas se establezca por que le importa tanto. La lealtad sin fundamento es conveniente para la trama pero vacia para la narrativa. El publico necesita entender el vinculo, no solo aceptarlo.

### El sidekick como dispositivo de exposicion

Usar al sidekick exclusivamente para que el protagonista le explique cosas (y por extension, se las explique al publico). Este uso reduce al sidekick a un microfono con patas. Si el unico proposito del sidekick es preguntar "que significa eso?", no es un personaje.

### El contraste superficial

Hacer que el sidekick sea "el opuesto" del protagonista en lo obvio (uno serio, otro comico; uno grande, otro pequeno) sin que ese contraste produzca friccion narrativa real. El contraste debe generar debate, no solo variedad visual.

---

## Criterios de Calidad

1. **Test de la revelacion**: Si eliminas al sidekick de tres escenas clave, el protagonista pierde profundidad. Se esconde informacion emocional que el publico necesitaba ver.

2. **Test de la voz**: Si lees los dialogos del sidekick sin etiquetas de personaje, se puede identificar quien habla solo por el contenido y el estilo. Si se confunde con el protagonista o con cualquier otro personaje, la voz no esta definida.

3. **Test del tono dual**: El sidekick puede funcionar tanto en una escena comica como en una escena emotiva sin sentirse como dos personajes diferentes.

4. **Test de la separacion**: Hay al menos un momento en la historia donde la relacion entre protagonista y sidekick se tensa, se cuestiona, o se pone a prueba. Ese momento es uno de los mas poderosos emocionalmente.

5. **Test del deseo propio**: El sidekick quiere algo que no esta directamente relacionado con lo que quiere el protagonista. Ese deseo, aunque secundario en la historia, es real y comprensible.

6. **Test de la silueta dual**: Cuando el protagonista y el sidekick aparecen juntos, sus siluetas se complementan visualmente y comunican la naturaleza de su relacion (proteccion, igualdad, tension, dependencia).

7. **Test de la ausencia**: Cuando el sidekick no esta en escena, el publico nota su ausencia y entiende como esa ausencia afecta al protagonista.

---

## Nota Final

El sidekick no es el segundo en importancia. Es el personaje que decide la profundidad emocional del protagonista. Sin el, el heroe es un monologuista. Con el, el heroe es una persona que se relaciona, que negocia, que necesita. La medida del exito de un sidekick no es cuanto gusta por separado, sino cuanto mejora al protagonista con su presencia.', 'system')
  ('Estructura Narrativa — Principios', ARRAY['craft:narrativa'], '#4ECDC4', '# Estructura Narrativa

## Propósito

Este documento establece los principios fundamentales de estructura narrativa que todo agente del estudio debe dominar. La estructura no es una camisa de fuerza: es el esqueleto invisible que sostiene la historia y permite que el espectador sienta sin necesidad de analizar. Una estructura sólida hace que lo extraordinario parezca inevitable y lo inevitable parezca sorprendente.

---

## Principios Fundamentales

1. **La estructura sirve a la emoción, nunca al revés.** No se elige una estructura de tres actos porque "es lo correcto", sino porque el viaje emocional que queremos provocar encaja en ese molde. Si la emoción pide otra forma, la forma se adapta.

2. **Cada escena debe cumplir al menos dos funciones.** Una escena que solo avanza la trama es mecánica. Una que solo desarrolla personaje es indulgente. Las mejores escenas hacen ambas cosas y además establecen tono, plantan semillas o refuerzan tema.

3. **El primer acto es un contrato con la audiencia.** En los primeros minutos se establece el género, el tono, las reglas del mundo y la promesa emocional. Romper ese contrato sin justificación destruye la confianza del espectador.

4. **El punto medio no es relleno.** El midpoint debe transformar la naturaleza del conflicto. El protagonista pasa de reactivo a proactivo, o descubre que el problema real es otro, o el precio de la victoria se revela. Sin un midpoint fuerte, el segundo acto colapsa.

5. **La resolución debe ser inevitable en retrospectiva pero sorprendente en el momento.** Si el final se ve venir desde lejos, es predecible. Si sale de la nada, es trampa. El equilibrio está en plantar las semillas con honestidad y cosecharlas con ingenio.

6. **Los cliffhangers deben plantear preguntas, no interrumpir respuestas.** Un buen cliffhanger abre una puerta emocional; uno malo simplemente corta la luz en medio de una escena. El primero genera anticipación, el segundo genera frustración.

7. **La estructura episódica y la serial no son opuestas, son un espectro.** Una serie puede tener episodios autoconclusivos que alimenten un arco mayor. La clave es que cada episodio tenga su propia estructura completa dentro del marco serial.

8. **El cold open es una promesa concentrada.** Debe capturar el tono, establecer las stakes o presentar el dilema central del episodio en su forma más potente. No es un resumen ni un trailer: es el primer bocado que define el apetito.

9. **El ritmo no es velocidad, es variación.** Una historia que siempre va rápido agota. Una que siempre va lenta aburre. El ritmo narrativo es la alternancia deliberada entre tensión y alivio, entre acción y reflexión, entre lo externo y lo interno.

10. **El arco de temporada necesita su propia estructura de tres actos.** Los primeros episodios establecen el mundo y el conflicto estacional. Los del medio complican y profundizan. Los finales resuelven y transforman. Cada temporada debe sentirse como una historia completa que también es un capítulo de algo mayor.

---

## Estructura de Tres Actos (Aplicación al Estudio)

- **Acto I (25%):** Mundo ordinario, incidente incitante, debate/rechazo, primer punto de giro que empuja al protagonista al conflicto.
- **Acto II (50%):** Confrontación, aliados y enemigos, pruebas ascendentes, midpoint que cambia las reglas, crisis que parece irreversible.
- **Acto III (25%):** Clímax donde el protagonista enfrenta su mayor miedo/obstáculo con las herramientas emocionales ganadas en el viaje, resolución que transforma el mundo ordinario.

## Estructura de Cinco Actos (Para Series Dramáticas)

- **Acto I:** Gancho e incidente incitante.
- **Acto II:** Complicación y primera escalada.
- **Acto III:** Midpoint y reversión.
- **Acto IV:** Consecuencias y preparación para el clímax.
- **Acto V:** Clímax y resolución.

## Arco de Temporada

- **Episodios 1-2:** Establecimiento del status quo estacional y del conflicto central.
- **Episodios 3-5:** Complicación progresiva, revelaciones que cambian la percepción del conflicto.
- **Episodios 6-8:** Crisis estacional, punto de no retorno, las stakes alcanzan su máximo.
- **Episodios 9-10:** Clímax y resolución del arco estacional, plantación de semillas para la siguiente temporada.

---

## Checklist de Creación

Antes de dar por terminada cualquier estructura narrativa, el agente debe responder:

- [ ] ¿El incidente incitante ocurre lo suficientemente temprano como para no perder a la audiencia?
- [ ] ¿El primer punto de giro cambia genuinamente la dirección de la historia o solo la acelera?
- [ ] ¿El midpoint transforma la naturaleza del conflicto o simplemente lo complica?
- [ ] ¿Cada acto tiene su propia mini-estructura con inicio, desarrollo y cierre parcial?
- [ ] ¿Los cliffhangers abren preguntas emocionales o solo interrumpen la acción?
- [ ] ¿El clímax resuelve tanto el conflicto externo como el arco interno del protagonista?
- [ ] ¿La resolución se siente ganada o simplemente concedida?
- [ ] ¿Hay un cold open que captura la esencia del episodio sin spoilear el viaje?
- [ ] ¿El arco de temporada tiene su propio incidente incitante, midpoint y clímax distinguibles?
- [ ] ¿El ritmo alterna entre momentos de alta y baja intensidad de manera deliberada?

---

## Errores Comunes (Anti-patrones)

1. **El segundo acto pantanoso.** Llenar el segundo acto con "cosas que pasan" sin escalada real ni transformación del conflicto. Cada secuencia del segundo acto debe mover al protagonista más lejos de su zona de confort.

2. **El clímax falso.** Resolver el conflicto aparente para luego revelar el "verdadero" conflicto sin haberlo plantado adecuadamente. El espectador se siente manipulado, no sorprendido.

3. **El cold open desconectado.** Abrir con una escena espectacular que no tiene relación temática ni narrativa con el episodio. El cold open debe ser la destilación del episodio, no un trailer genérico.

4. **Estructura rígida sin respiración.** Seguir la fórmula al minuto exacto sin permitir que las escenas respiren cuando lo necesitan. La estructura es una guía, no un metrónomo.

5. **Arco de temporada sin motor propio.** Depender exclusivamente de los arcos episódicos sin un conflicto estacional que los conecte. La temporada se siente como una colección de episodios, no como una historia.

6. **El cliffhanger gratuito.** Terminar cada episodio en un cliffhanger artificial que se resuelve trivialmente al inicio del siguiente. Esto entrena al espectador a no tomarse los finales en serio.

7. **Confundir complejidad con profundidad.** Agregar tramas secundarias, flashbacks y líneas temporales múltiples no hace una historia más profunda. La profundidad viene de la claridad emocional, no de la complejidad estructural.

---

## Criterios de Calidad

Una estructura narrativa cumple el estándar del estudio cuando:

- **Claridad:** Un espectador puede articular de qué trata la historia después de verla, incluso si no puede explicar por qué le importa.
- **Progresión:** Cada escena se siente como consecuencia inevitable de la anterior y causa necesaria de la siguiente.
- **Sorpresa dentro del orden:** Los giros sorprenden pero nunca se sienten arbitrarios al revisarlos.
- **Completitud emocional:** El espectador siente que ha vivido un viaje completo, no que le faltó algo ni que le sobraron piezas.
- **Resonancia:** La estructura amplifica el tema central en lugar de distraer de él.
- **Replayability:** En una segunda lectura/visionado, se descubren capas de plantación y prefiguración que enriquecen la experiencia.', 'system')
  ('Emoción — Cómo generarla', ARRAY['craft:emocion'], '#F5A52A', '# Emoción

## Propósito

Este documento establece cómo generar respuestas emocionales genuinas en la audiencia. La emoción no se impone, se gana. No se extrae del espectador — se cultiva con paciencia y se cosecha con precisión. La diferencia entre una historia que emociona y una que manipula está en el respeto: respeto por el personaje, por la audiencia y por la verdad emocional de la situación.

---

## Principios Fundamentales

1. **La emoción se gana, no se reclama.** Un momento emotivo que no ha sido preparado por la historia es manipulación. La música triste y la cámara lenta no generan emoción por sí solas — amplifican la emoción que ya existe si se ha construido correctamente.

2. **La empatía precede a la emoción.** Antes de que la audiencia sienta algo por un personaje, debe entenderlo. No necesita aprobarlo ni estar de acuerdo con él, pero sí comprender qué quiere, qué teme y por qué actúa como actúa.

3. **La especificidad genera universalidad.** Las emociones más universales nacen de los detalles más específicos. "Perder a alguien" es genérico. "El momento en que miras el lugar vacío en la mesa donde siempre se sentaba" es específico y universalmente devastador.

4. **El arco emocional debe tener su propia estructura.** No basta con tener un momento triste o alegre. La emoción necesita preparación, desarrollo y clímax propio. El arco emocional del personaje es tan importante como el arco narrativo.

5. **La contención amplifica.** Un personaje que intenta no llorar genera más emoción que uno que llora a gritos. La resistencia a la emoción crea presión dramática. Cuando finalmente la presa se rompe, el impacto es proporcional a la resistencia que la precedió.

6. **La alegría es tan difícil de escribir como la tristeza.** El estudio no puede depender solo de la melancolía para emocionar. Los momentos de triunfo, conexión, reconciliación y descubrimiento son igualmente poderosos y requieren el mismo rigor artesanal.

7. **El silencio es una herramienta emocional.** En animación, un rostro en silencio puede comunicar más que cualquier línea de diálogo. Los momentos de mayor carga emocional a menudo funcionan mejor sin palabras. Hay que confiar en la imagen.

8. **La emoción falsa entrena al espectador a desconfiar.** Si una historia manipula emocionalmente una vez, la audiencia levanta defensas para el resto de la experiencia. La confianza emocional es frágil y difícil de recuperar.

9. **Las emociones complejas son más interesantes que las simples.** Alegría mezclada con melancolía. Orgullo manchado de culpa. Alivio teñido de pérdida. Las emociones humanas rara vez son puras, y las historias que reconocen esa complejidad resuenan más profundamente.

---

## Arco Emocional: Anatomía

### Fase 1 — Inversión
- Establecer al personaje en su estado emocional ordinario.
- Crear momentos de conexión que hagan que la audiencia invierta emocionalmente.
- Mostrar vulnerabilidades que el personaje intenta ocultar.

### Fase 2 — Acumulación
- Incrementar gradualmente la presión emocional sobre el personaje.
- Alternar entre esperanza y miedo para mantener la inversión.
- Plantar los detalles específicos que detonarán el momento clave.

### Fase 3 — Punto de Quiebre
- El momento en que la acumulación se vuelve insostenible.
- El personaje debe enfrentar la verdad emocional que ha evitado.
- La resistencia colapsa de manera creíble y ganada.

### Fase 4 — Catarsis
- La liberación emocional — tanto del personaje como de la audiencia.
- Debe sentirse como culminación inevitable de todo lo construido.
- Puede ser silenciosa o explosiva, pero nunca decorativa.

### Fase 5 — Nuevo Equilibrio
- El personaje integra la experiencia emocional.
- El mundo sigue, pero algo fundamental ha cambiado.
- La audiencia necesita espacio para procesar antes de que la historia continúe.

---

## Herramientas para Generar Empatía

- **Deseo claro:** Mostrar lo que el personaje quiere profundamente — no lo que dice querer, sino lo que realmente necesita.
- **Vulnerabilidad revelada:** Momentos privados donde el personaje baja la guardia.
- **Injusticia percibida:** Cuando el personaje recibe menos de lo que merece, la audiencia se alinea instintivamente.
- **Competencia con defecto:** Un personaje que es bueno en algo pero tiene una falla humana reconocible genera admiración y compasión simultáneamente.
- **Conexión con otro personaje:** Ver a alguien cuidar de otro genera empatía más rápido que cualquier backstory trágico.

---

## Checklist de Creación

- [ ] ¿La escena emocional ha sido preparada por todo lo que la precede, o depende de la música y la actuación para funcionar?
- [ ] ¿La audiencia entiende al personaje lo suficiente como para sentir con él, no solo sentir por él?
- [ ] ¿Los detalles son específicos y concretos, o genéricos y abstractos?
- [ ] ¿El arco emocional tiene su propia estructura interna con preparación, acumulación y liberación?
- [ ] ¿Hay contención antes del momento clave — el personaje resiste antes de ceder?
- [ ] ¿La escena confía en la imagen y el silencio, o depende excesivamente del diálogo?
- [ ] ¿Las emociones son complejas y mezcladas, o simplistas y unidimensionales?
- [ ] ¿El momento emocional transforma algo permanentemente, o es un pico aislado sin consecuencias?
- [ ] ¿Hay espacio después del momento emocional para que la audiencia procese?
- [ ] ¿La emoción que se busca generar es honesta respecto a la verdad de la situación?

---

## Errores Comunes (Anti-patrones)

1. **El backstory trágico obligatorio.** Dar a cada personaje un pasado triste como atajo para generar empatía. La empatía no viene de la tragedia, viene de la humanidad reconocible del personaje.

2. **La música como muleta emocional.** Si la escena no funciona sin música, no funciona. La música debe amplificar lo que ya está ahí, no crear lo que falta.

3. **El llanto como señal de profundidad.** Hacer que los personajes lloren constantemente no comunica profundidad emocional — comunica que el escritor no confía en la sutileza. Las lágrimas tienen peso cuando son escasas.

4. **Manipulación por mascota o niño.** Poner en peligro a un animal adorable o a un niño inocente es la forma más barata de generar emoción. Si la escena necesita ese truco, el trabajo emocional no se hizo con los personajes principales.

5. **El momento emotivo sin consecuencias.** Una escena emocionalmente intensa que no cambia nada en la historia ni en los personajes. Si después del llanto todo sigue igual, el momento fue decorativo.

6. **Subrayar la emoción.** Cuando un personaje explica exactamente lo que siente ("Estoy triste porque..."), la emoción muere. Mostrar siempre supera a decir, especialmente en el terreno emocional.

7. **Confundir sentimentalismo con emoción.** El sentimentalismo es emoción excesiva en proporción a la causa. Es pedir al espectador que sienta más de lo que la situación justifica. La emoción genuina es proporcional y ganada.

8. **Negar espacio de procesamiento.** Pasar inmediatamente de un momento emotivo a una escena de acción o comedia. La audiencia necesita respirar después de sentir. Negarle ese espacio trivializa lo que acaba de experimentar.

---

## Criterios de Calidad

La dimensión emocional cumple el estándar del estudio cuando:

- **Ganada:** Cada momento emocional se siente como la consecuencia natural de todo lo que se construyó antes, no como un asalto sorpresa a los sentimientos del espectador.
- **Honesta:** La emoción representada es fiel a la verdad de la situación. No se exagera ni se minimiza.
- **Específica:** Los detalles que detonan la emoción son concretos y particulares, no genéricos.
- **Compleja:** Las emociones rara vez son puras. La alegría tiene sombras, la tristeza tiene bordes luminosos. La complejidad emocional es señal de madurez narrativa.
- **Duradera:** El impacto emocional persiste después de que termina la escena, el episodio o la serie. El espectador sigue pensando en ello.
- **Transformadora:** Después del momento emocional, algo es diferente — en el personaje, en las relaciones o en la percepción del espectador. La emoción que no transforma es ruido.', 'system')
  ('Conflicto — Creación y escalada', ARRAY['craft:narrativa'], '#4ECDC4', '# Conflicto

## Propósito

Este documento define cómo crear, escalar y resolver conflictos narrativos que sean significativos. El conflicto no es violencia ni discusión: es la distancia entre lo que un personaje quiere y lo que puede obtener. Sin conflicto no hay historia. Sin conflicto significativo no hay historia que importe.

---

## Principios Fundamentales

1. **El conflicto más poderoso nace de deseos legítimos que se oponen.** Cuando ambos lados tienen razón desde su perspectiva, el espectador no puede simplemente elegir un bando. Eso genera tensión real, no la ilusión de tensión.

2. **El conflicto externo debe reflejar el conflicto interno.** La batalla contra el dragón es interesante. La batalla contra el dragón que representa el miedo que el protagonista se niega a enfrentar es inolvidable. El obstáculo exterior es el espejo del obstáculo interior.

3. **Las stakes deben ser personales antes de ser universales.** "Salvar el mundo" no genera emoción si no sabemos qué significa ese mundo para el protagonista. Antes de salvar el planeta, necesitamos ver qué perdería el personaje si fracasa a nivel íntimo.

4. **La escalada no es lineal, es exponencial.** Cada nivel de conflicto debe elevar el precio del fracaso de manera desproporcionada. No basta con que las cosas empeoren; deben empeorar de formas que el personaje no anticipó y que atacan sus vulnerabilidades específicas.

5. **El conflicto revela carácter, no lo crea.** Las decisiones bajo presión muestran quién es realmente un personaje. El conflicto es el fuego que separa el oro de la escoria, no el molde que da forma al metal.

6. **Un conflicto resuelto demasiado fácil es peor que ningún conflicto.** Si el protagonista supera un obstáculo sin sacrificio, aprendizaje ni transformación, el espectador siente que le robaron algo. La resolución debe costar.

7. **El antagonista debe ser la peor pesadilla temática del protagonista.** No simplemente el más fuerte o el más malvado, sino el que representa exactamente aquello que el protagonista teme convertirse, o aquello que niega sobre sí mismo.

8. **Los conflictos relacionales son el pegamento emocional.** Los conflictos entre personajes que se quieren son más dolorosos y más interesantes que los conflictos entre extraños. La traición de un amigo duele más que el ataque de un enemigo.

9. **El conflicto societal da contexto y resonancia.** Cuando el conflicto personal ocurre dentro de un conflicto social más amplio, la historia trasciende lo individual y habla de la condición humana.

---

## Tipos de Conflicto

### Conflicto Interno
- Personaje vs. su propia naturaleza, miedos, deseos contradictorios o limitaciones.
- Es el motor de la transformación del personaje.
- Debe manifestarse externamente para ser cinematográfico: decisiones, comportamiento, diálogo subtextual.

### Conflicto Externo
- Personaje vs. fuerzas externas: antagonista, naturaleza, sistema, destino.
- Proporciona la estructura de la trama y las set pieces.
- Debe conectarse temáticamente con el conflicto interno para tener peso emocional.

### Conflicto Relacional
- Personaje vs. personaje dentro de una relación significativa.
- Genera las escenas más emocionalmente cargadas.
- Funciona mejor cuando ambas partes quieren algo legítimo que es incompatible con lo que quiere la otra.

### Conflicto Societal
- Personaje vs. normas, instituciones, expectativas culturales.
- Da a la historia relevancia más allá de lo personal.
- Debe encarnarse en personajes y situaciones concretas, nunca quedarse en lo abstracto.

---

## Anatomía de la Escalada

1. **Nivel 1 — Incomodidad:** El personaje nota que algo no está bien pero puede ignorarlo.
2. **Nivel 2 — Confrontación:** Ignorar ya no es opción. El personaje debe actuar pero subestima el problema.
3. **Nivel 3 — Complicación:** La primera solución falla o genera consecuencias inesperadas. Las stakes suben.
4. **Nivel 4 — Crisis:** El personaje descubre que el precio de resolver el conflicto es mayor de lo que imaginó. Debe elegir qué sacrificar.
5. **Nivel 5 — Punto de no retorno:** La decisión del personaje lo cambia irreversiblemente. No puede volver al status quo.
6. **Nivel 6 — Clímax:** El conflicto alcanza su expresión máxima. Todo lo que se ha plantado converge.
7. **Nivel 7 — Resolución y nuevo equilibrio:** El conflicto se resuelve (o se transforma), dejando al personaje y al mundo permanentemente alterados.

---

## Checklist de Creación

- [ ] ¿El conflicto central puede expresarse en una sola frase que contenga un "pero" o un "sin embargo"? ("Quiere X, pero Y se lo impide / pero el precio es Z.")
- [ ] ¿El conflicto externo tiene un correlato interno claro en el protagonista?
- [ ] ¿Las stakes son personales y concretas, no solo abstractas o globales?
- [ ] ¿El antagonista (persona, fuerza o circunstancia) tiene una lógica interna coherente y comprensible?
- [ ] ¿La escalada ataca las vulnerabilidades específicas del protagonista, no solo aumenta la dificultad genérica?
- [ ] ¿El conflicto obliga al protagonista a tomar decisiones que revelan su carácter?
- [ ] ¿La resolución implica un costo real — algo que el personaje valora debe ser sacrificado o transformado?
- [ ] ¿Existen conflictos en múltiples niveles (interno, relacional, externo) que se refuerzan mutuamente?
- [ ] ¿El conflicto tiene resonancia temática — dice algo sobre la condición humana que trasciende la trama?
- [ ] ¿Cada escena de conflicto cambia el equilibrio de poder entre las fuerzas opuestas?

---

## Errores Comunes (Anti-patrones)

1. **El villano cartón.** Un antagonista que es malo "porque sí" vacía el conflicto de significado. Si el espectador no puede entender por qué el antagonista cree que tiene razón, el conflicto es superficial.

2. **Stakes infladas sin peso emocional.** "¡El mundo se va a destruir!" no genera tensión si no hemos invertido emocionalmente en ese mundo. Las stakes más grandes del universo son irrelevantes si no están ancladas en algo personal.

3. **Resolución por deus ex machina.** Resolver el conflicto con un elemento que no se plantó previamente (un poder nuevo, un aliado desconocido, una coincidencia). Destruye la credibilidad del conflicto retroactivamente.

4. **Conflicto estático.** El mismo conflicto repitiendo el mismo patrón sin escalada ni evolución. El personaje enfrenta el problema, falla, lo intenta igual y falla igual. Sin variación ni aprendizaje, el conflicto se vuelve tedioso.

5. **Falsa urgencia.** Crear presión artificial con límites de tiempo o amenazas que el espectador sabe que no se cumplirán. La urgencia debe sentirse real y las consecuencias deben ser creíbles.

6. **Conflicto sin consecuencias.** Si los personajes pueden fallar sin que nada cambie, el conflicto no importa. Cada derrota debe dejar marca — en el mundo, en las relaciones o en el personaje.

7. **Resolución sin transformación.** El conflicto se "resuelve" pero nadie cambió. El protagonista terminó igual que empezó, solo que ahora la amenaza desapareció. Esto hace que toda la historia se sienta inútil.

8. **Confundir obstáculos con conflicto.** Una serie de pruebas físicas no es conflicto dramático. El conflicto requiere dimensión emocional y moral, no solo dificultad mecánica.

---

## Criterios de Calidad

Un conflicto cumple el estándar del estudio cuando:

- **Inevitabilidad:** El espectador siente que este conflicto tenía que ocurrir dados estos personajes en este mundo. No fue forzado por la trama.
- **Ambigüedad moral:** No es obvio quién tiene razón, o si la tiene, el precio de esa razón es visible y doloroso.
- **Progresión:** El conflicto evoluciona — no se repite. Cada confrontación cambia algo que hace la siguiente diferente.
- **Resonancia personal:** El espectador puede conectar el conflicto con algo de su propia experiencia, incluso si la historia ocurre en otro planeta.
- **Costo de resolución:** La resolución requirió que alguien sacrificara algo real. No fue gratis.
- **Transformación:** Los personajes involucrados son diferentes después del conflicto. No pueden volver a ser quienes eran.', 'system')
  ('Suspense — Tensión narrativa', ARRAY['craft:ritmo'], '#4ECDC4', '# Suspense

## Propósito

Este documento define cómo construir y sostener tensión narrativa de manera deliberada. El suspense no es un género — es una técnica fundamental que funciona en cualquier tipo de historia. Es el arte de controlar la información: qué sabe la audiencia, qué saben los personajes, y la brecha entre ambos. El suspense transforma al espectador pasivo en participante activo que anticipa, teme y espera.

---

## Principios Fundamentales

1. **El suspense nace de la información, no de la ignorancia.** Hitchcock lo formuló con claridad: si una bomba explota sin aviso, es sorpresa (dos segundos de impacto). Si la audiencia ve la bomba bajo la mesa mientras los personajes hablan, es suspense (diez minutos de tensión). Dar información a la audiencia es más poderoso que ocultársela.

2. **La anticipación es más intensa que el evento.** El miedo a lo que puede pasar genera más tensión que lo que realmente pasa. Por eso, dilatar el momento antes de la revelación o la confrontación amplifica el impacto. El suspense vive en el "antes de".

3. **Las stakes deben ser claras para que la tensión funcione.** La audiencia no puede temer por algo que no entiende. Antes de generar suspense, hay que establecer qué se puede perder y por qué importa.

4. **La ironía dramática es la herramienta más poderosa del suspense.** Cuando la audiencia sabe algo que el personaje no sabe, cada acción del personaje se carga de significado adicional. La audiencia quiere gritar, advertir, intervenir — y esa impotencia es puro suspense.

5. **El ritmo del suspense es alternancia controlada.** Tensión constante agota y adormece. El suspense efectivo alterna entre momentos de máxima tensión y breves respiros que permiten al espectador recuperarse antes del siguiente ascenso. Cada respiro debe ser más breve que el anterior a medida que se acerca el clímax.

6. **Los reveals deben generar más preguntas que respuestas.** Una revelación que cierra todas las preguntas mata el suspense. La mejor revelación resuelve una pregunta pero abre dos nuevas, más urgentes que la primera.

7. **El falso alivio multiplica la tensión.** Hacer creer a la audiencia que el peligro pasó, solo para revelar que era peor de lo que pensaba. Este patrón funciona porque ataca el momento de mayor vulnerabilidad emocional del espectador.

8. **El reloj visible acelera todo.** Un límite de tiempo concreto y creíble transforma cualquier situación en suspense. Pero el reloj debe tener consecuencias reales — si el tiempo se agota y no pasa nada significativo, la herramienta se invalida para el futuro.

9. **El suspense requiere personajes por los que la audiencia se preocupa.** Sin inversión emocional en los personajes, la tensión es abstracta e intelectual. El espectador debe temer por alguien, no solo por algo.

---

## Técnicas de Construcción de Suspense

### Control de Información
- **Ironía dramática:** La audiencia sabe más que el personaje.
- **Misterio:** La audiencia sabe menos que el personaje o que la situación.
- **Revelación dosificada:** Liberar información en fragmentos que cada vez reconfiguran la comprensión total.
- **Pista falsa (red herring):** Dirigir la atención hacia una amenaza aparente para ocultar la verdadera. Debe ser justa — la información real debe estar disponible para quien preste atención.

### Manipulación del Tiempo
- **Dilatación:** Estirar el tiempo subjetivo en momentos de máxima tensión. En animación, esto se logra con timing expandido, cuts lentos y detalle en las reacciones.
- **Compresión:** Acelerar la narración para transmitir urgencia y falta de control.
- **Cuenta regresiva:** Establecer un límite temporal concreto y visible.
- **Montaje paralelo:** Alternar entre líneas temporales o espaciales que convergen hacia un mismo punto de tensión.

### Arquitectura de la Amenaza
- **Amenaza establecida:** Mostrar de qué es capaz la amenaza antes de que enfrente al protagonista.
- **Amenaza latente:** La amenaza está presente pero inactiva. Su mera presencia contamina cada escena.
- **Amenaza invisible:** Sabemos que existe pero no dónde ni cuándo actuará. El espacio seguro se disuelve.
- **Amenaza interna:** El peligro viene de dentro del protagonista o de su grupo. La confianza se convierte en vulnerabilidad.

### Cliffhangers Efectivos
- Deben plantear una pregunta emocional, no solo narrativa.
- Deben ofrecer suficiente información para que la audiencia imagine múltiples desenlaces.
- El peor cliffhanger es el que solo se resuelve con información que la audiencia no tiene.
- El mejor cliffhanger hace que la audiencia tema la respuesta tanto como la desea.

---

## Checklist de Creación

- [ ] ¿Las stakes están claramente establecidas antes de que comience la secuencia de suspense?
- [ ] ¿La audiencia tiene suficiente información para sentir tensión, o está simplemente confundida?
- [ ] ¿Hay ironía dramática en al menos las escenas clave — la audiencia sabe algo que el personaje ignora?
- [ ] ¿El ritmo alterna entre picos de tensión y breves momentos de respiro?
- [ ] ¿Los reveals abren nuevas preguntas además de responder las existentes?
- [ ] ¿Hay al menos un momento de falso alivio antes del verdadero clímax?
- [ ] ¿El límite de tiempo (si existe) tiene consecuencias creíbles y reales?
- [ ] ¿La fuente de la amenaza ha sido demostrada como genuinamente peligrosa?
- [ ] ¿Los cliffhangers plantean preguntas emocionales, no solo de trama?
- [ ] ¿El suspense se sostiene en personajes por los que la audiencia se preocupa, no solo en la mecánica de la situación?
- [ ] ¿Las pistas falsas son justas — la información real está disponible para quien presta atención?

---

## Errores Comunes (Anti-patrones)

1. **Confundir confusión con misterio.** Ocultar información esencial no genera suspense — genera frustración. El misterio es una pregunta clara sin respuesta; la confusión es no saber ni siquiera cuál es la pregunta.

2. **El susto como sustituto del suspense.** Un golpe sonoro repentino asusta pero no genera tensión sostenida. Es el equivalente narrativo de hacer cosquillas: reacción involuntaria sin profundidad emocional.

3. **El personaje invulnerable.** Si la audiencia sabe que el protagonista nunca estará en peligro real, todo el suspense es teatro. Las consecuencias deben ser creíbles y la audiencia debe creer que pueden materializarse.

4. **Tensión sin resolución satisfactoria.** Construir tensión durante treinta minutos para resolverla en treinta segundos con una solución fácil. El clímax debe ser proporcional a la acumulación que lo precedió.

5. **Exceso de cliffhangers.** Cada episodio termina en un cliffhanger que se resuelve trivialmente al inicio del siguiente. Esto abarata la herramienta y entrena a la audiencia a no tomarse los finales en serio.

6. **El villano que explica su plan.** En el momento de máxima tensión, el antagonista detiene la acción para monologar. Esto destruye el ritmo y revela inseguridad narrativa — si el plan necesita explicación, no se plantó bien.

7. **Suspense sin foundation emocional.** Escenas técnicamente tensas pero emocionalmente vacías. Si no nos importa quién está en peligro, el mecanismo más sofisticado de suspense es inerte.

8. **Reveals que traicionan la confianza.** Revelaciones que dependen de información que la audiencia no podía haber deducido. El suspense justo permite que el espectador atento pueda reconstruir las pistas en retrospectiva.

---

## Criterios de Calidad

El suspense cumple el estándar del estudio cuando:

- **Participación activa:** La audiencia está mentalmente involucrada — anticipa, teoriza, teme. No es espectadora pasiva de eventos, sino participante emocional de posibilidades.
- **Justicia informativa:** En retrospectiva, todas las pistas estaban ahí. El espectador que revisa la historia descubre capas de prefiguración que enriquecen la experiencia.
- **Proporcionalidad:** La resolución está a la altura de la acumulación. La tensión no fue construida para nada.
- **Sostenibilidad:** La tensión se mantiene sin necesidad de trucos cada vez más extremos. El suspense viene de las stakes emocionales, no de la escalada mecánica.
- **Resonancia post-visionado:** El espectador recuerda no solo qué pasó, sino cómo se sintió esperando que pasara. La anticipación deja marca.
- **Integración narrativa:** El suspense sirve a la historia y a los personajes, no existe como fin en sí mismo. La tensión revela carácter y avanza el tema.', 'system')
  ('Aventura — Principios del género', ARRAY['craft:narrativa'], '#4A8FE8', '# Aventura

## Propósito

Este documento establece los principios para construir historias de aventura que sean emocionantes, significativas y memorables. La aventura no es solo acción en movimiento — es la transformación de un personaje a través de un viaje que lo pone a prueba física, emocional e intelectualmente. La mejor aventura no pregunta "qué pasa después" sino "quién será este personaje cuando llegue al final".

---

## Principios Fundamentales

1. **El viaje externo es el vehículo del viaje interno.** Cada montaña escalada, cada trampa superada, cada territorio desconocido explorado debe ser una metáfora tangible del crecimiento interior del personaje. Si el viaje externo puede separarse del interno sin que nada se pierda, la aventura es superficial.

2. **Las stakes deben escalar pero nunca inflarse.** Hay una diferencia entre escalar las stakes (cada desafío pone en juego algo más importante) e inflarlas (los números se hacen más grandes sin que el peso emocional aumente). Derrotar a diez enemigos no es más tenso que derrotar a uno si no sube el precio personal.

3. **El mundo es un personaje.** En la aventura, el entorno no es un escenario pasivo — es un agente activo que desafía, revela y transforma. Cada localización debe tener personalidad, reglas propias y una relación temática con el momento del viaje en que aparece.

4. **El héroe debe ganarse cada avance.** Nada en la aventura debe ser gratis. Cada habilidad nueva, cada aliado, cada herramienta tiene un precio — en esfuerzo, en sacrificio o en conocimiento ganado. Los regalos del destino son dramáticamente inertes.

5. **La exploración es recompensa en sí misma.** En la mejor aventura, el espectador siente asombro por el mundo antes de sentir tensión por los peligros. El sentido de descubrimiento — de ver algo nunca antes visto — es uno de los placeres más poderosos del género y la animación está perfectamente equipada para entregarlo.

6. **Los compañeros de viaje no son accesorios.** Cada miembro del grupo debe aportar algo indispensable — no solo una habilidad funcional, sino una perspectiva que desafíe o complemente la del héroe. Los mejores grupos de aventura son aquellos donde cada miembro sería el héroe de su propia historia.

7. **El regreso es tan importante como la ida.** El viaje de vuelta — sea literal o figurado — es donde se revela qué ganó y qué perdió el héroe. Un héroe que vuelve exactamente igual que partió no vivió una aventura; vivió un paseo.

8. **Las set pieces son argumentos visuales.** Cada secuencia de acción importante debe demostrar algo sobre el personaje o sobre el tema. Una persecución que solo muestra velocidad es genérica. Una persecución que muestra la desesperación del personaje por aferrarse a algo que se le escapa es una set piece con significado.

9. **Lo desconocido debe sentirse genuinamente desconocido.** Si el espectador puede predecir cada amenaza y cada descubrimiento, no hay aventura. El sentido de lo imprevisible — de que el mundo contiene sorpresas que ni el narrador parece controlar completamente — es esencial.

10. **El mentor debe tener un costo.** La guía que el héroe recibe siempre viene con un precio. El mentor que lo sabe todo y lo comparte todo sin consecuencia es un atajo narrativo. La sabiduría debe ganarse, y el mentor mismo debe tener sus propias limitaciones y sacrificios.

---

## El Viaje del Héroe (Aplicación Moderna)

El monomito de Campbell no es una receta sino un mapa emocional. Cada fase representa un momento psicológico del viaje, no un beat obligatorio.

### Mundo Ordinario
- Establecer qué tiene el héroe que puede perder y qué le falta que necesita encontrar.
- El mundo ordinario debe ser suficientemente concreto como para que el espectador sienta nostalgia por él cuando el héroe se aleje.

### La Llamada y el Umbral
- La llamada a la aventura debe conectarse con la carencia o el deseo más profundo del héroe.
- Cruzar el umbral es un acto de valentía, desesperación o necesidad — nunca de comodidad.

### Las Pruebas
- Cada prueba debe atacar una debilidad diferente del héroe.
- El orden de las pruebas importa: las primeras enseñan habilidades que serán necesarias en las últimas.
- Los fracasos son tan importantes como los éxitos — un héroe que nunca falla no crece.

### La Cueva Interior
- El momento más oscuro del viaje, donde el héroe enfrenta su miedo fundamental.
- Debe sentirse como un callejón sin salida genuino — la solución no puede ser obvia.
- Es el punto de transformación: el héroe que entra no es el que sale.

### La Recompensa y el Regreso
- La recompensa no es solo un objeto o logro — es la versión transformada del héroe.
- El regreso plantea una pregunta crucial: ¿puede el héroe integrar lo que aprendió en su mundo ordinario?
- El mundo ordinario al que regresa debe verse diferente a través de los ojos transformados del héroe.

---

## Estructuras de Quest

### Quest Lineal
- Un destino claro, una ruta con obstáculos.
- Funciona cuando el motor es la urgencia y las stakes son temporales.
- Riesgo: puede sentirse como una lista de tareas si las pruebas no están conectadas temáticamente.

### Quest Ramificada
- Múltiples objetivos que deben completarse en cualquier orden antes del desafío final.
- Permite exploración del mundo y variedad de tono.
- Riesgo: pérdida de momentum si las ramas no tienen escalada propia.

### Quest de Descubrimiento
- El destino no está claro al inicio — se revela a medida que el héroe avanza.
- El mapa se construye mientras se camina.
- Es la forma más orgánica pero la más difícil de estructurar sin perder cohesión.

### Quest Invertida
- El héroe ya tiene la recompensa al inicio y el viaje es regresar con ella, protegerla o entender qué significa.
- Subvierte las expectativas del género y permite explorar las consecuencias del triunfo.

---

## Set Pieces: Principios de Diseño

- **Cada set piece debe tener un problema único.** Si la solución es siempre "ser más fuerte/rápido", las set pieces son intercambiables.
- **El entorno debe ser un factor activo.** El escenario no es donde ocurre la acción — es parte de la acción. Lava, gravedad, clima, arquitectura: todo debe influir en las decisiones del héroe.
- **Las set pieces deben tener ritmo interno.** Inicio (establecimiento del problema), desarrollo (complicaciones crecientes), clímax (la solución o el fracaso), resolución (las consecuencias).
- **La set piece debe cambiar algo.** Después de cada secuencia de acción importante, algo debe ser diferente: una alianza, un recurso, una pieza de información, el estado emocional del héroe.

---

## Checklist de Creación

- [ ] ¿El viaje externo del héroe tiene un correlato claro con su viaje emocional interno?
- [ ] ¿El mundo se siente como un personaje con reglas, personalidad y misterios propios?
- [ ] ¿Las stakes escalan atacando las vulnerabilidades específicas del héroe, no solo aumentando la dificultad?
- [ ] ¿Cada prueba enseña o revela algo que será necesario más adelante?
- [ ] ¿Los compañeros de viaje tienen sus propios arcos y perspectivas que desafían al héroe?
- [ ] ¿Hay un sentido de asombro y descubrimiento — el mundo contiene sorpresas genuinas?
- [ ] ¿Las set pieces tienen problemas únicos que requieren soluciones específicas al contexto?
- [ ] ¿El héroe paga un precio real por cada avance?
- [ ] ¿La "cueva interior" enfrenta al héroe con su miedo más profundo, no con un obstáculo genérico?
- [ ] ¿El regreso (literal o figurado) muestra que el héroe y/o su mundo han sido transformados?
- [ ] ¿El ritmo alterna entre exploración asombrosa y acción urgente?

---

## Errores Comunes (Anti-patrones)

1. **La aventura turística.** Localizaciones espectaculares sin relación temática con el viaje del héroe. El mundo es un fondo bonito, no un agente narrativo. Cada lugar debe significar algo.

2. **El héroe competente desde el inicio.** Si el héroe puede manejar todo desde el primer acto, no hay espacio para crecimiento ni tensión. La incompetencia inicial es una inversión en el triunfo futuro.

3. **La escalada por volumen.** Más enemigos, más explosiones, más destrucción. La escalada significativa es emocional y moral, no cuantitativa.

4. **Los compañeros descartables.** Personajes secundarios que existen solo para dar información o abrir puertas. Si un compañero puede ser reemplazado por un letrero, no es un personaje.

5. **El mentor perfecto.** Un guía que siempre tiene la respuesta correcta y no tiene sus propias luchas. Los mejores mentores son aquellos que fallaron en su propio viaje y transfieren no solo sabiduría, sino también heridas.

6. **La recompensa irrelevante.** El objeto de la quest no tiene conexión temática con el viaje del héroe. El MacGuffin puro puede funcionar en un thriller, pero en aventura la recompensa debe ser significativa.

7. **Ritmo sin variación.** Acción-acción-acción sin momentos de quietud, exploración o desarrollo de relaciones. La aventura necesita respirar para que los momentos de tensión tengan contraste.

8. **El destino fácil.** El héroe llega al objetivo final sin haber sacrificado nada significativo. Si el viaje no costó nada, la recompensa no vale nada.

9. **Worldbuilding sin disciplina.** Introducir mecánicas, reglas o criaturas nuevas cada vez que la trama necesita una solución. El mundo debe sentirse consistente y descubierto, no inventado sobre la marcha.

---

## Criterios de Calidad

Una historia de aventura cumple el estándar del estudio cuando:

- **Asombro:** El espectador siente que ha visitado un lugar que no conocía y que quiere volver. El mundo se queda en la imaginación mucho después de que la historia termine.
- **Transformación:** El héroe al final del viaje es reconociblemente la misma persona pero fundamentalmente diferente. La transformación es creíble, ganada y conmovedora.
- **Integridad del mundo:** Las reglas del mundo se mantienen consistentes. Los descubrimientos se sienten orgánicos, no convenientes. El worldbuilding enriquece la historia en lugar de distraer de ella.
- **Stakes significativas:** El espectador cree genuinamente que el héroe puede fallar y que el fracaso tendría consecuencias reales e irreversibles.
- **Ritmo envolvente:** La alternancia entre exploración, desarrollo de personajes y acción crea un flujo que mantiene al espectador involucrado sin agotarlo.
- **Resonancia temática:** La aventura dice algo sobre el crecimiento, el coraje, el sacrificio o el descubrimiento que trasciende la trama específica y habla de la experiencia humana.', 'system')
  ('Humor — Comedia en narrativa', ARRAY['craft:dialogo'], '#F5A52A', '# Humor

## Propósito

Este documento establece los principios del humor como herramienta narrativa. El humor en el estudio no es decoración ni alivio cómico desechable: es una forma de verdad. Los mejores chistes revelan algo sobre un personaje, sobre el mundo o sobre la audiencia misma. El humor bien ejecutado hace que una historia sea más profunda, no más ligera.

---

## Principios Fundamentales

1. **El humor nace de la verdad reconocida.** Lo que hace reír no es lo absurdo en sí, sino el reconocimiento de algo verdadero presentado desde un ángulo inesperado. Un chiste que no tiene una verdad debajo es ruido.

2. **La sorpresa es el mecanismo, no el objetivo.** Todo humor depende de romper una expectativa, pero la ruptura debe llevar a algún lugar — una revelación de carácter, una observación sobre el mundo, una inversión de poder. La sorpresa vacía es un susto, no un chiste.

3. **El humor revela carácter mejor que el diálogo serio.** Lo que un personaje encuentra gracioso, cómo cuenta un chiste, si se ríe de sí mismo o de otros — todo esto revela su personalidad de forma más auténtica que cualquier monólogo expositivo.

4. **El timing lo es todo.** Un chiste perfecto con mal timing fracasa. Un chiste mediocre con timing perfecto funciona. El timing incluye la pausa antes del remate, la duración del beat cómico, el momento dentro de la escena y el momento dentro de la historia.

5. **El humor funciona por contraste.** Tono serio con contenido absurdo. Personaje digno en situación ridícula. Expectativa grandiosa con resultado mundano. Sin contraste, no hay comedia.

6. **La repetición transforma lo cómico.** La primera vez algo es gracioso. La segunda, menos. La tercera, es hilarante otra vez — pero por razones diferentes. La regla del tres no es arbitraria: es el patrón mínimo para que el cerebro detecte un patrón, lo anticipe, y pueda ser sorprendido por la variación.

7. **El humor no debe neutralizar la emoción.** Un chiste después de un momento emotivo puede destruir lo que se construyó. El humor y la emoción pueden coexistir, pero requieren una transición consciente, no automática.

8. **El humor cruel revela al que se ríe, no al objeto de la risa.** Si un personaje se burla de alguien vulnerable, eso nos dice algo sobre el personaje cruel, no sobre la víctima. El humor dirigido hacia abajo es una herramienta de caracterización del agresor.

9. **Lo visual supera lo verbal en animación.** En nuestro medio, un gag visual bien ejecutado tiene más impacto que el mejor juego de palabras. La animación permite distorsiones, exageraciones y timing imposibles en acción real — hay que aprovecharlo.

---

## Tipos de Humor y Su Función Narrativa

### Humor Situacional
- Nace de las circunstancias, no de los diálogos.
- Funciona cuando los personajes reaccionan con seriedad a una situación absurda.
- Es el tipo más universal porque no depende del idioma ni de referencias culturales.

### Humor de Personaje
- Emerge de la personalidad establecida del personaje enfrentando una situación.
- Es el más valioso narrativamente porque refuerza la caracterización con cada chiste.
- Requiere que el personaje esté bien definido: el humor nace de la consistencia, no de la aleatoriedad.

### Humor Visual
- Gags físicos, expresiones exageradas, timing de animación, composición cómica del encuadre.
- Es la ventaja competitiva de la animación sobre otros medios.
- Debe integrarse con la narrativa: el mejor gag visual también avanza la historia o revela personaje.

### Humor Verbal
- Juegos de palabras, dobles sentidos, réplicas ingeniosas, malentendidos lingüísticos.
- Funciona mejor cuando emerge del personaje — no todos hablan con ingenio, y un personaje que siempre tiene la respuesta perfecta es inverosímil.
- Requiere especial atención en localización y traducción.

### Humor Absurdo
- Rompe las reglas de la lógica o de la realidad establecida.
- Funciona en mundos donde el absurdo es parte del contrato con la audiencia.
- Peligroso si se usa sin control: puede destruir la credibilidad del mundo narrativo.

### Humor por Subtexto
- Lo que es gracioso no se dice explícitamente — está en lo que no se dice, en la brecha entre lo que el personaje dice y lo que el espectador sabe.
- Es el humor más sofisticado y el que mejor recompensa la atención de la audiencia.
- Requiere confianza en la inteligencia del espectador.

---

## Checklist de Creación

- [ ] ¿El humor emerge de los personajes y la situación, o está impuesto sobre ellos?
- [ ] ¿El chiste revela algo sobre el personaje que lo ejecuta o sobre el mundo?
- [ ] ¿El timing respeta los beats necesarios — hay espacio para la pausa, la anticipación y el remate?
- [ ] ¿El humor funciona visualmente además de verbalmente? (En animación esto es crítico.)
- [ ] ¿Los running gags evolucionan y se transforman a lo largo de la historia?
- [ ] ¿El humor respeta los momentos emocionales o los destruye prematuramente?
- [ ] ¿Hay variedad en los tipos de humor usados, o toda la comedia depende de un solo registro?
- [ ] ¿El humor funciona para la audiencia objetivo sin necesidad de explicación?
- [ ] ¿Los personajes "serios" tienen momentos de humor que humanicen sin caricaturizar?
- [ ] ¿El humor contribuye al tono general de la pieza o lo contradice?

---

## Errores Comunes (Anti-patrones)

1. **El chiste que mata la escena.** Insertar humor en un momento dramático "para aliviar la tensión" cuando la tensión es exactamente lo que la escena necesita. No toda tensión necesita ser aliviada; a veces necesita ser sostenida.

2. **Personajes que son "graciosos" sin ser personajes.** El sidekick cómico cuya única función es hacer chistes sin arco propio ni profundidad. Si quitas los chistes y no queda nada, no hay personaje.

3. **Humor de referencia como sustituto de humor original.** Parodiar lo popular del momento genera risa instantánea pero envejece fatalmente. Las referencias deben ser condimento, no ingrediente principal.

4. **El síndrome de la broma eterna.** Repetir un gag más allá de su vida útil sin variación ni escalada. La repetición funciona cuando cada iteración añade algo; fracasa cuando es pura insistencia.

5. **Humor que contradice el mundo establecido.** Un chiste que rompe las reglas internas del universo por una risa fácil. El chiste pasa, el daño al worldbuilding permanece.

6. **Confundir lo aleatorio con lo absurdo.** Lo absurdo tiene lógica interna. Lo aleatorio no tiene lógica de ningún tipo. "Es gracioso porque es random" es la muerte de la comedia con intención.

7. **Humor que humilla sin propósito narrativo.** Si un personaje es humillado solo por la risa del espectador, sin que eso sirva a la historia ni a la caracterización, es crueldad gratuita disfrazada de comedia.

---

## Criterios de Calidad

El humor cumple el estándar del estudio cuando:

- **Orgánico:** Se siente como parte natural de la historia, no como un inserto. Quitarlo cambiaría la escena, no solo la haría menos divertida.
- **Revelador:** Después del chiste sabemos algo nuevo sobre el personaje, la dinámica o el mundo — aunque sea sutil.
- **Duradero:** Funciona en el segundo visionado, quizás por razones diferentes a la primera vez.
- **Respetuoso con la audiencia:** No explica el chiste, no subraya el remate, confía en la inteligencia del espectador.
- **Consistente con el tono:** El registro cómico es apropiado para el mundo y la historia que estamos contando.
- **Multimodal:** En animación, el humor aprovecha todas las herramientas disponibles — timing visual, sonido, expresión, composición — no solo diálogo.', 'system')
  ('Comedia — Principios del género', ARRAY['craft:dialogo'], '#F5A52A', '# Comedia (Estructura de Series Cómicas)

## Propósito

Este documento aborda la comedia como género y formato de serie, complementando el archivo de humor (que trata los principios del humor como herramienta). Aquí se cubren las estructuras específicas de series cómicas, los subgéneros, las reglas de los mundos cómicos y los mecanismos que sostienen la risa a lo largo de temporadas completas. Una serie cómica exitosa no es una colección de chistes — es un mundo donde el humor emerge orgánicamente de personajes, situaciones y reglas internas.

---

## Principios Fundamentales

1. **El mundo cómico tiene reglas tan estrictas como el dramático.** Las reglas pueden ser absurdas, pero deben ser consistentes. Si en tu mundo los personajes pueden caer de un precipicio y sobrevivir, eso debe ser verdad siempre, no solo cuando conviene. La inconsistencia mata la comedia más rápido que un mal chiste.

2. **Los personajes cómicos son máquinas de conflicto.** Cada personaje principal en una comedia debe generar conflicto por su mera presencia. Sus defectos, obsesiones, puntos ciegos y dinámicas con otros personajes son los motores que producen situaciones cómicas de manera orgánica e inagotable.

3. **La premisa cómica debe ser un motor, no un tanque de combustible.** Una buena premisa de comedia genera situaciones infinitas; una mala se agota en el piloto. "Un grupo de personas trabaja en una oficina" es un motor. "Un hombre se despierta como mujer" es un tanque — tiene un recorrido limitado.

4. **El ritmo cómico es musical.** Setup, setup, punch. Pausa. Setup, punch, callback. Cada escena tiene un ritmo interno que funciona como una composición musical con tiempos fuertes y débiles, aceleraciones y pausas. En animación, este ritmo se traduce directamente al timing de la animación.

5. **El status quo cómico es sagrado y debe ser restaurado (o no).** En la sitcom clásica, el status quo se restaura al final del episodio. En la comedia serial moderna, el status quo evoluciona lentamente. En ambos casos, la relación con el status quo es deliberada y consciente.

6. **Los personajes de comedia rara vez aprenden.** A diferencia del drama, donde la transformación es el objetivo, en comedia la resistencia al cambio es una fuente inagotable de humor. El personaje que comete el mismo error de forma ligeramente diferente cada vez es cómicamente rico.

7. **La escalada cómica sigue la ley de "sí, y además..."** Cada beat cómico debe llevar la situación un paso más allá de lo que parecía posible. No se trata de repetir — se trata de escalar hasta que la absurdidad alcance un pico que parecía imposible tres beats antes.

8. **El elenco es un ecosistema.** Cada personaje debe tener una dinámica cómica distinta con cada otro personaje. Si A y B generan el mismo tipo de humor que A y C, uno de los dos sobra. El elenco perfecto es aquel donde cada combinación de personajes produce un registro cómico diferente.

9. **La comedia necesita corazón, pero no puede ser prisionera de él.** Las series que solo quieren ser "heartwarming" pierden los dientes. Las que solo quieren ser graciosas pierden el alma. El equilibrio cambia por episodio, pero a lo largo de la temporada debe existir.

---

## Subgéneros y Sus Reglas

### Sitcom (Comedia de Situación)
- Premisa de convivencia forzada (trabajo, familia, vecindario).
- Estructura de problemas autoconclusivos con arco de personaje lento.
- Depende del elenco coral y las dinámicas interpersonales.
- Las escenas funcionan como sketches conectados por una trama ligera.
- Regla clave: el espectador debe poder ver cualquier episodio de forma aislada y disfrutarlo.

### Sátira
- Usa la exageración para criticar la realidad.
- Requiere un "blanco" claro: institución, ideología, comportamiento social.
- El humor funciona por reconocimiento — la audiencia se ríe porque identifica la verdad detrás de la exageración.
- Riesgo principal: ser tan sutil que nadie entienda la crítica, o tan obvia que se vuelva un panfleto.

### Slapstick / Comedia Física
- El cuerpo es el instrumento cómico principal.
- En animación, el slapstick tiene posibilidades ilimitadas: distorsión, elasticidad, timing imposible.
- Funciona mejor cuando hay dignidad que destruir — un personaje orgulloso sufriendo caos físico es más gracioso que uno ya caótico.
- Requiere coreografía precisa: la comedia física mal ejecutada es incómoda, no graciosa.

### Comedia Negra / Dark Comedy
- Encuentra humor en temas normalmente tabú: muerte, fracaso, crueldad, absurdidad existencial.
- Funciona cuando la distancia emocional es la correcta: demasiado cerca y es ofensivo, demasiado lejos y no es gracioso.
- El tono es un equilibrio constante — un solo desliz puede hacer que la audiencia se cierre.
- Es el subgénero más difícil de mantener a lo largo de una serie porque la audiencia debe renovar su consentimiento emocional cada episodio.

### Comedia Absurda
- Las reglas del mundo se distorsionan deliberadamente.
- La lógica interna es consistente dentro de su propio sistema ilógico.
- Funciona mejor con personajes que toman el absurdo con total seriedad.
- Requiere valentía creativa: la tentación de explicar o justificar el absurdo lo mata.

---

## Running Gags: Arquitectura

Un running gag efectivo tiene tres fases:

1. **Establecimiento:** La primera aparición establece el patrón. Debe ser lo suficientemente memorable para que la audiencia la reconozca después.
2. **Variación:** Cada aparición posterior cambia algún elemento — el contexto, la escala, quién lo ejecuta, las consecuencias. La repetición pura no es running gag, es pereza.
3. **Subversión o culminación:** En algún punto, el running gag debe romperse de manera significativa — ya sea para un efecto cómico mayor (la variación definitiva) o para un efecto emocional (el momento en que el chiste se convierte en algo más).

Un running gag que nunca evoluciona ni culmina es un tic de escritura, no una herramienta narrativa.

---

## Estructura de Episodio Cómico (Modelo A/B)

- **Trama A (60%):** El conflicto cómico principal del episodio. Involucra al protagonista o al personaje central del episodio.
- **Trama B (30%):** Un conflicto secundario que contrasta temática o tonalmente con la trama A. Suele involucrar personajes secundarios.
- **Runner/Trama C (10%):** Un gag recurrente que atraviesa el episodio como hilo cómico. Puede no tener resolución o resolverse de manera inesperada.
- **Convergencia:** Las mejores comedias hacen que las tramas A, B y C converjan en el tercer acto de maneras inesperadas.

---

## Checklist de Creación

- [ ] ¿La premisa de la serie genera conflicto orgánico e inagotable, o depende de situaciones forzadas?
- [ ] ¿Cada personaje del elenco tiene una dinámica cómica diferente con cada otro personaje?
- [ ] ¿Las reglas del mundo cómico son consistentes, incluso si son absurdas?
- [ ] ¿El episodio tiene una estructura clara (trama A/B/runner) con convergencia satisfactoria?
- [ ] ¿Los running gags evolucionan y se transforman a lo largo de la serie?
- [ ] ¿El ritmo cómico de cada escena funciona musicalmente — setups, punches, pausas, callbacks?
- [ ] ¿La comedia viene de los personajes y sus dinámicas, o de chistes insertados externamente?
- [ ] ¿Hay momentos de corazón que no sacrifican el tono cómico?
- [ ] ¿El subgénero elegido se sostiene con sus propias reglas de manera consistente?
- [ ] ¿Un espectador nuevo puede disfrutar un episodio individual sin conocer la serie?

---

## Errores Comunes (Anti-patrones)

1. **Elenco homogéneo.** Todos los personajes son graciosos de la misma manera. Sin variedad cómica, el humor se vuelve monótono independientemente de la calidad de los chistes.

2. **Premisa agotable.** La premisa depende de un solo gag o situación que no puede regenerarse. Si la respuesta a "qué hacemos en el episodio 50" es silencio, la premisa no es un motor.

3. **Sentimentalismo invasivo.** Cada episodio termina con una lección de vida y un abrazo. La comedia con corazón no es comedia con sermón. Los momentos emocionales deben surgir naturalmente, no ser obligatorios.

4. **Flanderización.** Reducir gradualmente a un personaje a un solo rasgo cómico hasta que deja de ser un personaje y se convierte en un chiste ambulante. Los personajes cómicos deben tener dimensiones, aunque una dimensión sea dominante.

5. **Ignorar las consecuencias.** En un intento de mantener el status quo, los eventos de un episodio no tienen ningún efecto en el siguiente. Esto erosiona la inversión de la audiencia a largo plazo.

6. **Comedia de referencia perecedera.** Depender de memes, tendencias o eventos actuales para los chistes. Esto genera risas inmediatas pero fecha la serie irreversiblemente.

7. **El episodio "muy especial".** Abandonar completamente el tono cómico para un episodio dramático que se siente como de otra serie. Si hay algo serio que abordar, debe hacerse dentro del registro cómico de la serie, no abandonándolo.

8. **Escenas de relleno sin función cómica.** Escenas de transición que no contienen humor, no avanzan trama ni desarrollan personaje. En comedia, cada segundo que no es gracioso debe al menos construir hacia algo que lo será.

---

## Criterios de Calidad

Una serie cómica cumple el estándar del estudio cuando:

- **Generatividad:** La premisa y los personajes generan situaciones cómicas orgánicas sin necesidad de forzar la trama. Se siente como si hubiera infinitas historias por contar.
- **Consistencia tonal:** El tono cómico se mantiene a lo largo de la serie sin sacrificar profundidad emocional ni convertirse en parodia de sí misma.
- **Distinción de voces:** Cada personaje tiene un registro cómico propio e identificable. Podrías atribuir cualquier línea a su personaje sin necesidad de acotación.
- **Ritmo impecable:** Las escenas fluyen con el timing de un buen stand-up — cada beat tiene su lugar y su duración correcta.
- **Replayability:** Los episodios mejoran con revisiones — se descubren chistes de fondo, callbacks sutiles y capas de significado.
- **Longevidad:** La serie no muestra signos de agotamiento al avanzar. Cada temporada encuentra nuevas vetas de humor sin traicionar la esencia.', 'system')
  ('Ritmo Visual — Pacing de la historia', ARRAY['craft:ritmo'], '#4ECDC4', '# Ritmo — El Pacing de la Historia Visual

> El ritmo es la respiración de la historia. Una historia sin variación de ritmo es como una canción con una sola nota — técnicamente correcta, emocionalmente agotadora. El ritmo determina cuándo el espectador se inclina hacia adelante y cuándo puede recostarse.

---

## Principios Fundamentales

1. **El ritmo es contraste.** Rápido después de lento se siente explosivo. Lento después de rápido se siente como un respiro. Sin contraste, no hay ritmo — solo velocidad constante.

2. **Cada escena tiene su propio tempo.** Una escena de persecución y una de confesión emocional no pueden tener el mismo ritmo. El tempo de la escena debe corresponder a su función narrativa.

3. **El ritmo del episodio tiene forma.** Un buen episodio no mantiene la misma intensidad todo el tiempo. Tiene valles y picos, tensión y distensión, aceleración y reposo. La forma del episodio es visible si graficas la intensidad.

4. **La respiración es obligatoria.** Después de una secuencia intensa, el espectador necesita un momento para procesar. Ese momento no es tiempo muerto — es digestión emocional. Sin él, las emociones se cancelan entre sí.

5. **El ritmo de temporada es macro-ritmo.** No solo las escenas y episodios tienen ritmo — la temporada completa tiene un arco de intensidad. Episodios iniciales establecen; los centrales escalan; los finales explotan y resuelven.

6. **La información controla el ritmo.** Más información nueva = más rápido se siente. Menos información = más lento. Controlar cuánta información revelamos por escena controla el ritmo percibido.

7. **Los cliffhangers son reset de ritmo.** Un cliffhanger al final de un episodio obliga al siguiente a empezar con energía alta, resolviendo la tensión acumulada.

8. **El humor es válvula de escape.** Un momento cómico después de tensión intensa baja la presión sin romper la inmersión. Es una herramienta de ritmo, no solo de entretenimiento.

---

## Estructura Rítmica del Episodio

```
GANCHO (0-3 min)
  ↓ Energía alta — atrapar la atención
ESTABLECIMIENTO (3-7 min)
  ↓ Bajar un poco — situar al espectador
DESARROLLO (7-15 min)
  ↓ Escalada gradual con valles intermedios
PUNTO MEDIO (≈ mitad del episodio)
  ↓ Cambio de dirección o revelación
ESCALADA (15-20 min)
  ↓ Aumento de tensión hacia el clímax
CLÍMAX (20-23 min)
  ↓ Máxima intensidad
RESOLUCIÓN (23-25 min)
  ↓ Bajar — procesar emocionalmente
CIERRE / GANCHO SIGUIENTE
  ↓ Satisfacción + curiosidad
```

---

## Checklist de Creación

- [ ] ¿Hay contraste de ritmo claro entre escenas (rápidas vs. lentas)?
- [ ] ¿Hay momentos de respiro después de las secuencias más intensas?
- [ ] ¿El gancho del episodio es efectivo en los primeros 3 minutos?
- [ ] ¿La tensión escala progresivamente hacia el clímax?
- [ ] ¿El clímax es el punto de máxima intensidad (no hay nada después que lo supere)?
- [ ] ¿La resolución deja espacio emocional para procesar?
- [ ] ¿El ritmo del episodio contribuye al ritmo de la temporada?
- [ ] ¿Los momentos cómicos funcionan como válvulas de escape (si aplica)?
- [ ] ¿El episodio cierra con satisfacción Y curiosidad por el siguiente?

---

## Errores Comunes

- **Todo a la misma velocidad.** Acción constante agota. Calma constante aburre. El ritmo necesita variación.
- **Clímax prematuro.** La escena más intensa llega demasiado temprano y el resto se siente anticlimático.
- **Sin respiración.** Escena intensa tras escena intensa sin pausa — las emociones se anulan.
- **Resolución abrupta.** El clímax termina y el episodio acaba sin dar tiempo al espectador para procesar.
- **Escalada plana.** La tensión no aumenta — las escenas tienen la misma intensidad sin construcción.
- **Información dump.** Demasiada información en un solo momento que frena el ritmo en seco.
- **Humor que rompe el tono.** Un chiste en un momento de tensión máxima que destruye lo construido.

---

## Criterios de Calidad

- El espectador nunca siente que el episodio "se arrastra" ni que "va demasiado rápido".
- Hay un momento claro de máxima tensión que se siente como la cúspide del episodio.
- Los momentos de calma se sienten necesarios, no como relleno.
- El contraste rítmico amplifica el impacto de las escenas más intensas.
- Al terminar el episodio, el espectador siente satisfacción Y ganas de ver el siguiente.
- Si graficas la intensidad emocional del episodio, la curva tiene forma clara (no es una línea plana).', 'system')
  ('Edición — Montaje y estructura visual', ARRAY['craft:ritmo'], '#4ECDC4', '# Edición — El Arte Invisible

> La edición es el arte de controlar el tiempo y la atención. Un buen montaje es invisible — el espectador no nota los cortes, solo siente el ritmo. Un mal montaje saca al espectador de la historia con cada transición.

---

## Principios Fundamentales

1. **Cortar con motivación.** Cada corte necesita una razón: revelar información nueva, seguir la mirada de un personaje, cambiar de perspectiva emocional, o mantener el ritmo. Si no hay razón para cortar, no cortes.

2. **Cortar en la acción.** Los cortes que ocurren durante un movimiento (un personaje girando, un puño golpeando) son invisibles. Los cortes en quietud son más notables y, por tanto, más disruptivos.

3. **El ritmo de edición es el pulso de la escena.** Cortes rápidos = tensión, urgencia, caos. Planos largos = calma, contemplación, inmersión. El ritmo debe corresponder a la emoción.

4. **La continuidad es un contrato.** El espectador confía en que el espacio, la dirección y el tiempo son coherentes entre planos. Romper la continuidad sin razón rompe la confianza.

5. **El corte invisible es el ideal.** El mejor montaje es el que el espectador no nota. Si el público es consciente de los cortes, la edición está llamando la atención sobre sí misma en vez de la historia.

6. **Las transiciones comunican.** Un corte directo = continuidad temporal. Un fundido = paso del tiempo. Un fundido a negro = fin de sección. Un match cut = conexión conceptual. Cada transición tiene significado.

7. **El montaje paralelo multiplica la tensión.** Alternar entre dos acciones simultáneas crea urgencia y mantiene al espectador en vilo — especialmente cuando una de las líneas tiene un deadline.

8. **Saber qué NO mostrar.** A veces lo más poderoso es cortar ANTES del momento de impacto, o DESPUÉS. Lo que el espectador imagina puede ser más potente que lo que ve.

---

## Tipos de Transición

| Transición | Significado | Uso |
|-----------|-------------|-----|
| **Corte directo** | Continuidad, inmediatez | Default — la mayoría de transiciones |
| **Fundido cruzado** | Paso de tiempo suave, conexión | Transiciones temporales moderadas |
| **Fundido a negro** | Fin de sección, gran paso de tiempo | Fin de acto, cambio significativo |
| **Fundido desde negro** | Nuevo comienzo, despertar | Inicio de acto, nueva mañana |
| **Match cut** | Conexión conceptual entre escenas | Unir ideas visualmente similares |
| **Jump cut** | Paso de tiempo abrupto, dislocación | Montajes, sensación de inestabilidad |
| **Wipe** | Cambio de escena estilizado | Tono aventurero, cómico, retro |
| **Smash cut** | Contraste abrupto, comedia, shock | De calma a caos (o viceversa) |

---

## Checklist de Creación

- [ ] ¿Cada corte tiene una razón narrativa o emocional?
- [ ] ¿El ritmo de edición corresponde al tono emocional de la escena?
- [ ] ¿La continuidad espacial y temporal se mantiene (o se rompe con intención)?
- [ ] ¿Las transiciones comunican la relación temporal entre escenas?
- [ ] ¿Los planos tienen la duración necesaria para que el espectador absorba la información?
- [ ] ¿Las escenas de acción son legibles a pesar de la velocidad de corte?
- [ ] ¿Hay variación de ritmo (no todo corta a la misma velocidad)?
- [ ] ¿El montaje paralelo (si se usa) aumenta la tensión efectivamente?

---

## Errores Comunes

- **Cortar por aburrimiento.** Cambiar de plano porque "ya pasó suficiente tiempo" sin razón narrativa.
- **Ritmo monótono.** Todos los planos duran lo mismo — sin aceleración ni desaceleración.
- **Sobreexplicar con cortes.** Mostrar la reacción de cada personaje a cada línea de diálogo — confía en que el espectador puede imaginar.
- **Jump cuts accidentales.** Cortes entre planos similares que crean un salto visual no intencional.
- **Transiciones decorativas.** Efectos de transición (wipes, zooms, spins) que no aportan significado.
- **Edición de acción ilegible.** Cortes tan rápidos que el espectador no puede seguir la acción.
- **Escenas que no terminan.** Quedarse en un plano después de que la información ya se entregó.

---

## Criterios de Calidad

- El espectador no es consciente de los cortes — están al servicio de la historia.
- El ritmo de edición varía con el tono emocional y crea contraste efectivo.
- Las escenas de acción son emocionantes Y legibles.
- Las transiciones entre escenas comunican la relación temporal correcta.
- La edición contribuye al pacing general del episodio (inicio enganchador, desarrollo creciente, clímax, resolución).', 'system')
  ('Cámaras — Lenguaje cinematográfico', ARRAY['craft:visual'], '#4A8FE8', '# Cámaras — El Ojo de la Historia

> En animación, la cámara no existe físicamente — es una decisión de diseño pura. Cada ángulo, cada movimiento, cada tipo de plano es una elección narrativa que el espectador absorbe inconscientemente. La cámara no solo muestra la historia: la cuenta.

---

## Principios Fundamentales

1. **Cada plano tiene un propósito.** Antes de elegir un ángulo o movimiento de cámara, pregunta: "¿Qué necesita saber o sentir el espectador aquí?" La respuesta dicta la cámara.

2. **El tamaño del plano es intimidad emocional.** Plano general = contexto, distancia, soledad. Plano medio = conversación, relación. Primer plano = emoción, intimidad, verdad. Detalle = objeto crucial, pista narrativa.

3. **El ángulo es poder.** Contrapicado (cámara abajo) = el personaje se ve poderoso, dominante. Picado (cámara arriba) = el personaje se ve vulnerable, pequeño. Ángulo neutro = igualdad, normalidad.

4. **El movimiento de cámara es emoción en movimiento.** Dolly in = el espectador se involucra, algo importante pasa. Dolly out = distanciamiento, revelación de contexto. Tracking = acompañamiento, seguimiento. Cámara estática = calma, observación.

5. **La profundidad de campo dirige la atención.** Foco selectivo = mira esto, ignora lo demás. Todo en foco = el contexto importa tanto como el sujeto. Cambio de foco = transferencia de atención.

6. **La lente deforma la realidad.** Gran angular = espacio exagerado, distorsión, tensión. Teleobjetivo = compresión, intimidad, vigilancia. Normal = realismo, neutralidad.

7. **Menos movimientos, más intención.** Cada movimiento de cámara tiene un costo de atención. Un paneo innecesario distrae. Una cámara estática en el momento correcto puede ser más poderosa que cualquier movimiento.

8. **El POV es empatía.** Ver desde los ojos del personaje (punto de vista subjetivo) crea identificación inmediata. Úsalo con moderación para momentos donde necesitas que el espectador SEA el personaje.

---

## Tipos de Plano — Referencia Rápida

| Plano | Qué muestra | Cuándo usar |
|-------|-------------|-------------|
| **Gran general** | Paisaje completo, personaje diminuto | Establecer el mundo, mostrar escala, soledad |
| **General** | Personaje de cuerpo entero en su entorno | Establecer ubicación, mostrar acción física |
| **Americano** | De rodillas para arriba | Diálogo con acción, westerns, confrontaciones |
| **Medio** | De cintura para arriba | Conversaciones, interacción cotidiana |
| **Medio corto** | De pecho para arriba | Diálogo íntimo, reacciones |
| **Primer plano** | Cara completa | Emoción, decisiones, momentos de verdad |
| **Gran primer plano** | Ojos o boca | Máxima intensidad emocional, micro-expresiones |
| **Detalle** | Objeto o parte del cuerpo | Pistas, objetos narrativos, énfasis |

---

## Checklist de Creación

- [ ] ¿Cada plano tiene un propósito narrativo claro?
- [ ] ¿El tamaño del plano corresponde al nivel de intimidad emocional necesario?
- [ ] ¿Los ángulos de cámara refuerzan las dinámicas de poder de la escena?
- [ ] ¿Los movimientos de cámara están motivados por la narrativa (no son decorativos)?
- [ ] ¿Hay variedad de planos para mantener el interés visual?
- [ ] ¿Los planos de establecimiento sitúan al espectador antes de la acción?
- [ ] ¿Los close-ups se reservan para momentos emocionalmente significativos?
- [ ] ¿La cámara respeta la línea de 180° (o la rompe con intención)?

---

## Errores Comunes

- **Plano medio constante.** Toda la escena filmada al mismo tamaño — pierde dinamismo y énfasis.
- **Movimiento de cámara gratuito.** Cámara que se mueve constantemente sin razón narrativa.
- **Contrapicado/picado excesivo.** Si todo se filma en ángulo, nada destaca cuando realmente importa.
- **Sin planos de establecimiento.** El espectador no sabe dónde está la escena.
- **Close-up inflacionado.** Si cada momento es un close-up, los close-ups pierden poder.
- **Cámara shaky sin razón.** La cámara inestable comunica caos y urgencia — usarla sin justificación solo marea.
- **Ignorar la eyeline.** La línea de mirada entre personajes debe mantenerse coherente entre planos.

---

## Criterios de Calidad

- El espectador nunca se pregunta "¿dónde estamos?" ni "¿quién habla?"
- Los planos varían en tamaño y ángulo de forma que mantiene el interés visual.
- Los movimientos de cámara amplifican la emoción de la escena.
- Los close-ups se sienten como momentos de peso, no como default.
- La cámara se siente como un narrador invisible que sabe exactamente qué mostrar y cuándo.', 'system')
  ('Actuación Animada — Principios', ARRAY['craft:animacion'], '#66BB6A', '# Actuación — El Acting en Animación

> En animación, el animador ES el actor. Cada gesto, cada micro-expresión, cada cambio de peso corporal es una decisión de actuación. La diferencia entre animación correcta y animación memorable está en la actuación.

---

## Principios Fundamentales

1. **Piensa como actor antes que como animador.** Antes de mover al personaje, pregunta: "¿Qué siente? ¿Qué quiere? ¿Qué intenta ocultar?" El movimiento nace de la emoción, no de la técnica.

2. **El subtexto está en el cuerpo.** Lo que un personaje dice y lo que su cuerpo comunica no siempre coinciden. Un personaje que dice "estoy bien" mientras se encoge y evita la mirada está actuando — esa disonancia es oro narrativo.

3. **Menos es más.** La animación exagerada es divertida en comedia, pero en momentos emocionales, los gestos pequeños tienen más poder. Un parpadeo lento, un hombro que cae, dedos que aprietan — la contención es más difícil y más efectiva.

4. **Los ojos lo dicen todo.** El espectador mira los ojos del personaje primero. La dirección de la mirada, el ritmo del parpadeo, la apertura de los párpados — los ojos son donde vive la actuación más importante.

5. **El cuerpo tiene memoria emocional.** Un personaje triste no solo tiene cara triste — tiene hombros caídos, pasos pesados, manos inertes. La emoción habita todo el cuerpo, no solo la cara.

6. **Cada personaje se mueve diferente.** Un personaje seguro y uno inseguro no caminan igual. Un personaje grande y uno pequeño no gesticulan igual. El movimiento es identidad.

7. **Las pausas son actuación.** Un personaje que se detiene antes de responder está pensando. Esa pausa comunica que hay un proceso interno. No llenes cada segundo con movimiento.

8. **La anticipación es expectativa.** Antes de cada acción importante, hay un momento de preparación que le dice al espectador "algo va a pasar". Sin anticipación, las acciones se sienten abruptas.

---

## Checklist de Creación

- [ ] ¿La emoción del personaje es legible sin necesidad del diálogo?
- [ ] ¿El lenguaje corporal es coherente con lo que el personaje siente (no solo con lo que dice)?
- [ ] ¿Los ojos comunican la emoción principal?
- [ ] ¿Cada personaje tiene mannerismos o gestos propios que lo distinguen?
- [ ] ¿Hay variación en la intensidad de la actuación (momentos grandes Y momentos sutiles)?
- [ ] ¿Las pausas y silencios se usan como herramienta de actuación?
- [ ] ¿El personaje reacciona a su entorno y a los otros personajes, no solo a su diálogo?
- [ ] ¿La actuación es apropiada para el tono de la escena (comedia vs. drama)?
- [ ] ¿Hay subtexto corporal — el cuerpo dice algo diferente a las palabras?

---

## Errores Comunes

- **Animación de labios sin acting.** Mover la boca para que coincida con el audio pero no animar el resto del cuerpo ni la emoción.
- **Sobre-actuación constante.** Si cada gesto es exagerado, ninguno tiene impacto. La exageración es una herramienta, no un estado permanente.
- **Personajes estáticos cuando no hablan.** Un personaje que está en la escena pero no "habla" también debe estar actuando — escuchando, reaccionando, pensando.
- **Misma actuación para diferentes personajes.** Si el héroe y el sidekick expresan tristeza de la misma manera, se pierde individualidad.
- **Ignorar las manos.** Las manos son el segundo elemento más expresivo después de los ojos. Manos rígidas o inmóviles matan la actuación.
- **Movimiento sin motivación.** Movimiento constante que no está motivado por emoción o intención — solo ruido visual.

---

## Criterios de Calidad

- La escena se entiende emocionalmente con el sonido apagado.
- Cada personaje tiene una forma de moverse que lo distingue de los demás.
- Hay al menos un momento de actuación sutil que recompensa la atención del espectador.
- El lenguaje corporal y las expresiones faciales cuentan una historia paralela al diálogo.
- Las emociones se sienten genuinas, no performativas.', 'system')
  ('Staging — Composición de escena', ARRAY['craft:animacion'], '#66BB6A', '# Staging — Puesta en Escena

> El staging es el arte de presentar una idea de forma clara e inequívoca. Si el espectador no entiende qué está pasando, qué siente el personaje o dónde debe mirar, el staging ha fallado — sin importar lo buena que sea la animación.

---

## Principios Fundamentales

1. **Claridad ante todo.** Cada momento de la escena debe comunicar UNA idea principal de forma clara. Si el espectador tiene que deducir qué pasa, el staging necesita trabajo.

2. **Una idea por vez.** No compitas por la atención del espectador. Si el personaje está entregando una línea emotiva, no pongas una acción secundaria que distraiga. Primero una cosa, luego la otra.

3. **La cámara y el personaje trabajan juntos.** El ángulo de cámara, la posición del personaje y su pose deben alinearse para comunicar la misma idea. Si la cámara dice "poder" pero la pose dice "debilidad", hay conflicto no intencional.

4. **Las poses deben leerse en silueta.** Si tapas todos los detalles internos y la pose sigue siendo legible, el staging es bueno. Si la pose se confunde como silueta, necesita ajuste.

5. **El contraste dirige la atención.** El elemento que más contrasta (en movimiento, color, tamaño o posición) es donde mira el ojo. Asegúrate de que sea donde QUIERES que mire.

6. **El espacio entre personajes es relación.** Personajes cercanos = intimidad, confianza, confrontación. Personajes lejanos = distancia emocional, soledad, tensión. El espacio físico narra la relación.

7. **El movimiento de cámara tiene costo de atención.** Cada movimiento de cámara resetea la orientación del espectador. Mueve la cámara solo cuando el beneficio narrativo supera ese costo.

8. **La línea de acción se respeta.** La regla de 180 grados mantiene la orientación espacial del espectador. Romperla sin intención crea confusión. Romperla con intención crea desorientación expresiva.

---

## Checklist de Creación

- [ ] ¿La idea principal de cada momento se entiende al primer vistazo?
- [ ] ¿Cada pose importante se lee en silueta?
- [ ] ¿El ojo del espectador sabe dónde mirar en todo momento?
- [ ] ¿El espacio entre personajes refleja su relación emocional?
- [ ] ¿La línea de acción (180°) se respeta o se rompe con intención?
- [ ] ¿Los movimientos de cámara están justificados narrativamente?
- [ ] ¿No hay elementos compitiendo por atención en el mismo momento?
- [ ] ¿Las acciones secundarias complementan, no distraen de, la acción principal?

---

## Errores Comunes

- **Poses genéricas.** Personajes en poses neutrales que no comunican nada sobre su estado emocional o intención.
- **Tangencias.** Elementos que se superponen o tocan de forma confusa, creando ambigüedad visual.
- **Sobre-complejidad.** Demasiadas cosas pasando simultáneamente — el ojo no sabe dónde ir.
- **Staging plano.** Todo en el mismo plano de profundidad, sin usar foreground y background para crear capas.
- **Acción oculta.** Un momento importante (un golpe, una expresión clave) que queda parcialmente oculto por otro elemento.
- **Romper la línea de acción sin querer.** Cortes que cambian de lado y desorientan al espectador sin intención dramática.
- **Fondo que compite.** Elementos del fondo con tanto detalle o movimiento que roban atención al personaje.

---

## Criterios de Calidad

- Un espectador que ve la escena por primera vez entiende qué pasa sin necesidad de rebobinar.
- Las poses clave funcionan como ilustraciones independientes.
- El ojo del espectador se mueve por el frame siguiendo un camino intencional.
- No hay momentos de "¿qué acaba de pasar?" causados por staging confuso.
- La distancia y posición entre personajes comunica su relación emocional.
- Las escenas de acción son legibles incluso a alta velocidad.', 'system')
  ('Timing — Ritmo de animación', ARRAY['craft:animacion'], '#66BB6A', '# Timing — El Ritmo del Movimiento

> El timing es lo que separa la animación mecánica de la animación que se siente viva. No es cuántos frames dura un movimiento — es cómo esos frames se distribuyen para crear sensación de peso, impacto, emoción y comedia.

---

## Principios Fundamentales

1. **El timing es emoción.** Movimientos rápidos = urgencia, energía, comedia. Movimientos lentos = peso, gravedad, drama, melancolía. El ritmo del movimiento es el ritmo emocional de la escena.

2. **El spacing es la textura del timing.** Timing es cuánto dura. Spacing es cómo se distribuye el movimiento en ese tiempo. Spacing uniforme = movimiento mecánico. Spacing con ease in/out = movimiento orgánico.

3. **Ease in y ease out son obligatorios.** Nada en la naturaleza empieza o para de golpe (excepto impactos). Todo movimiento orgánico acelera al inicio y desacelera al final. Omitir esto crea sensación de robot.

4. **El peso se comunica con timing.** Un objeto pesado necesita más frames para arrancar y más para frenar. Un objeto ligero cambia de dirección rápido. El timing es lo que hace que algo se "sienta" pesado o ligero.

5. **La comedia vive en el timing.** Un beat de más, una pausa inesperada, una acción que llega un frame antes de lo esperado — el humor en animación es fundamentalmente una cuestión de timing.

6. **Los acentos necesitan contraste.** Un golpe solo se siente poderoso si hay calma antes y después. Un grito solo es dramático si hay silencio que lo precede. El impacto nace del contraste de velocidades.

7. **El hold (pausa) es una herramienta.** Sostener una pose por unos frames extra antes de una acción construye anticipación. Después de una acción, el hold permite que el impacto se absorba.

8. **El timing de personaje es personalidad.** Un personaje nervioso se mueve rápido con paradas abruptas. Uno confiado se mueve lento con timing deliberado. Uno perezoso tiene ease-outs largos y arrancadas lentas.

---

## Checklist de Creación

- [ ] ¿El timing general de la escena corresponde al tono emocional?
- [ ] ¿Los movimientos tienen ease in y ease out (no arranques/paradas abruptas sin razón)?
- [ ] ¿Los objetos y personajes se sienten con el peso correcto?
- [ ] ¿Hay contraste de velocidades (no todo se mueve al mismo ritmo)?
- [ ] ¿Los momentos de impacto tienen suficiente contraste (calma → acción → hold)?
- [ ] ¿El timing cómico funciona (si aplica)? ¿Los beats están en el frame correcto?
- [ ] ¿Cada personaje tiene un ritmo de movimiento propio?
- [ ] ¿Los holds se usan para énfasis y anticipación?

---

## Errores Comunes

- **Timing uniforme.** Todo se mueve a la misma velocidad — la escena se siente plana y mecánica.
- **Sin ease in/out.** Movimientos que arrancan y paran de golpe, como si el personaje fuera un robot.
- **Demasiado rápido en drama.** Escenas emocionales que se mueven a velocidad de acción — no dejan espacio para sentir.
- **Demasiado lento en comedia.** Chistes que pierden el beat porque el timing es perezoso.
- **Sin holds.** Movimiento constante sin pausas para que el espectador absorba lo que pasó.
- **Impactos sin preparación.** Un golpe o acción que llega sin anticipación se siente débil, no importa cuánto efecto visual tenga.
- **Todos se mueven igual.** El héroe y el villano se mueven con el mismo ritmo — se pierde la personalidad.

---

## Criterios de Calidad

- Los movimientos se sienten orgánicos y naturales (o estilizados con intención).
- Hay variación clara de velocidades que crea ritmo visual.
- Los momentos de impacto se sienten poderosos gracias al contraste.
- El timing cómico arranca risas (si es una escena cómica).
- Cada personaje tiene un "tempo" propio que lo distingue.
- Los holds y pausas se usan con intención y añaden expresividad.', 'system')
  ('Color — Lenguaje emocional', ARRAY['craft:visual'], '#F5A52A', '# Color — Narrativa Cromática

> El color no decora — narra. Cada paleta es una decisión narrativa que comunica tono, emoción, tiempo y transformación antes de que el espectador procese conscientemente lo que ve.

---

## Principios Fundamentales

1. **El color es emoción.** Antes de elegir un color, pregunta: "¿Qué debe sentir el espectador aquí?" La respuesta determina la paleta.

2. **Consistencia con variación.** Cada serie tiene una paleta base, pero esa paleta evoluciona con la historia. Un mundo que empieza cálido y termina frío cuenta una historia solo con color.

3. **El color del personaje es su identidad.** Los colores asociados a un personaje deben reflejar su esencia y evolucionar con su arco. Un personaje que va de la inseguridad a la confianza puede ir de tonos apagados a saturados.

4. **Contraste con propósito.** El contraste cromático no es decoración — es jerarquía. Lo importante destaca. Lo secundario se integra al fondo.

5. **Menos es más.** Una paleta restringida con uso estratégico de un color de acento tiene más impacto que un arcoíris sin dirección.

6. **El color establece el tiempo.** Mañana, tarde, noche, estaciones — el color sitúa temporalmente al espectador sin necesidad de texto.

7. **Los colores tienen memoria.** Si un color se asocia a un momento emocional fuerte, su reaparición evoca ese momento. Usa esto con intención.

8. **La saturación es intensidad emocional.** Escenas de alta emoción tienden a mayor saturación. Escenas de vacío o pérdida, a desaturación. Pero no es una regla rígida — a veces invertir esta lógica crea un efecto más poderoso.

---

## Checklist de Creación

- [ ] ¿La paleta general de la serie tiene una identidad cromática clara?
- [ ] ¿Cada personaje principal tiene colores asociados que reflejan su personalidad?
- [ ] ¿El color de cada escena comunica el tono emocional correcto?
- [ ] ¿Hay evolución cromática a lo largo de la temporada que refleje el arco narrativo?
- [ ] ¿Los colores de acento se usan con intención (no al azar)?
- [ ] ¿El contraste cromático guía la mirada hacia lo importante?
- [ ] ¿La paleta funciona para la audiencia objetivo (niños = más saturación; adultos = más matiz)?
- [ ] ¿Se ha probado la paleta en escenas de diferentes tonos (acción, drama, comedia)?
- [ ] ¿Los colores son accesibles para personas con daltonismo?

---

## Errores Comunes

- **Paleta sin dirección.** Usar colores "bonitos" sin que estén al servicio de la historia.
- **Color estático.** La misma paleta exacta en todas las escenas, sin variación emocional.
- **Sobre-saturación constante.** Si todo es vibrante, nada destaca. La saturación es una herramienta de contraste.
- **Ignorar el contexto cultural.** El rojo no significa lo mismo en todas las culturas. Considera la audiencia.
- **Color como etiqueta simplista.** "El malo es morado, el bueno es azul" sin matices ni evolución.
- **Fondos que compiten con personajes.** Los fondos deben complementar, no robar protagonismo cromático.

---

## Criterios de Calidad

- Un frame aislado comunica el tono emocional solo por su color.
- La paleta de la serie es reconocible — si ves un frame sabes que es de esta serie.
- El espectador no nota conscientemente el color, pero lo siente.
- Hay momentos donde un cambio de color genera un impacto emocional claro.
- La evolución cromática a lo largo de la temporada es visible al comparar primer y último episodio.', 'system')
  ('Composición — Principios visuales', ARRAY['craft:visual'], '#4A8FE8', '# Composición — Guía Visual del Espectador

> La composición es cómo organizamos los elementos visuales dentro del frame para contar la historia. Una buena composición guía la mirada, establece relaciones de poder y comunica emoción — todo sin que el espectador lo note.

---

## Principios Fundamentales

1. **La composición sirve a la historia.** Cada decisión compositiva debe responder a: "¿Qué necesita entender o sentir el espectador en este momento?"

2. **La mirada sigue un camino.** El ojo del espectador se mueve por el frame de forma predecible. Usa líneas, contraste y posición para guiarlo hacia lo importante.

3. **La regla de tercios es un punto de partida, no una ley.** Centrar a un personaje puede comunicar poder, soledad o confrontación. Descentrarlo puede comunicar desequilibrio o vulnerabilidad. La regla de tercios es útil, pero el contexto narrativo manda.

4. **El espacio negativo habla.** El vacío alrededor de un personaje comunica soledad, libertad, peligro o insignificancia. No llenes el frame por miedo al vacío.

5. **La posición en el frame es poder.** Arriba = dominio. Abajo = sumisión. Centro = importancia. Borde = marginalidad. Usa esto con intención.

6. **Las diagonales son energía.** Líneas horizontales = calma, estabilidad. Líneas verticales = formalidad, rigidez. Diagonales = tensión, movimiento, dinamismo.

7. **Profundidad crea inmersión.** Usar foreground, midground y background crea sensación de espacio tridimensional. Un frame plano se siente como una ilustración; uno con profundidad se siente como un mundo.

8. **Simetría para impacto.** La simetría perfecta crea sensación de orden, poder o artificialidad. Romper la simetría genera tensión. Usa ambas con intención.

---

## Checklist de Creación

- [ ] ¿El elemento más importante del frame es lo primero que ve el ojo?
- [ ] ¿La composición comunica la relación de poder entre los personajes presentes?
- [ ] ¿Hay un camino visual claro que guíe la mirada del espectador?
- [ ] ¿El espacio negativo está usado con intención (no por accidente)?
- [ ] ¿La composición refuerza el tono emocional de la escena?
- [ ] ¿Hay suficiente profundidad (layers de foreground/midground/background)?
- [ ] ¿La composición funciona en thumbnail (miniatura)?
- [ ] ¿Se mantiene la línea de acción (180 grados) entre planos?

---

## Errores Comunes

- **Centro muerto sin razón.** Poner todo en el centro por defecto, sin intención narrativa.
- **Frame abarrotado.** Demasiados elementos compitiendo por atención — el ojo no sabe dónde ir.
- **Composición plana.** Sin capas de profundidad, el mundo se siente como un telón de teatro.
- **Tangencias.** Elementos que se tocan en los bordes creando confusión visual (cabeza tocando el marco, objetos fusionándose).
- **Ignorar la lectura de izquierda a derecha.** En culturas occidentales, el movimiento de izquierda a derecha se siente natural/positivo. De derecha a izquierda se siente como resistencia/retroceso.
- **Composición estática en escenas dinámicas.** Si la emoción es intensa, la composición debería reflejarlo.

---

## Criterios de Calidad

- Cada frame clave podría funcionar como un poster o ilustración independiente.
- La jerarquía visual es clara — no hay duda de qué es lo importante en cada frame.
- La composición varía con el tono emocional (no todas las escenas se componen igual).
- Las relaciones de poder entre personajes son legibles solo por su posición en el frame.
- El espectador nunca se pregunta "¿dónde debo mirar?"', 'system')
  ('Iluminación — Principios', ARRAY['craft:visual'], '#4A8FE8', '# Iluminación — Luz como Narrativa

> La luz no solo hace visible la escena — la interpreta. La iluminación establece mood, guía la atención, revela u oculta información, y transforma el significado emocional de todo lo que toca.

---

## Principios Fundamentales

1. **La luz tiene intención.** Cada fuente de luz en una escena debe poder justificarse narrativamente. "¿De dónde viene esta luz?" no es solo una pregunta técnica — es una pregunta de storytelling.

2. **La oscuridad es tan importante como la luz.** Lo que no iluminas es tan expresivo como lo que iluminas. Las sombras ocultan, sugieren, amenazan. No le tengas miedo a la oscuridad.

3. **La dirección de la luz define el carácter.** Luz frontal = claridad, honestidad, exposición. Luz lateral = drama, dualidad. Contraluz = misterio, heroísmo, amenaza. Luz desde abajo = horror, poder siniestro.

4. **La temperatura de color es emocional.** Cálido (ámbar, dorado) = seguridad, nostalgia, intimidad. Frío (azul, verde) = alienación, peligro, soledad.

5. **Los cambios de iluminación son transiciones emocionales.** Un cielo que se nubla durante una discusión. Una vela que se apaga cuando llega la verdad. La luz cambia con la historia.

6. **El contraste de iluminación es tensión.** Alto contraste (luz dura, sombras marcadas) = tensión, drama, conflicto. Bajo contraste (luz difusa, sombras suaves) = calma, seguridad, sueño.

7. **Cada escena tiene una fuente de luz dominante.** Puede haber luces secundarias de relleno, pero el ojo necesita entender de dónde viene la luz principal. Sin jerarquía lumínica, la escena se siente plana.

8. **La luz evoluciona con la historia.** La iluminación del primer episodio debe sentirse diferente a la del último si la historia ha cambiado emocionalmente.

---

## Checklist de Creación

- [ ] ¿La fuente de luz principal es identificable y coherente con el entorno?
- [ ] ¿La dirección de la luz refuerza el tono emocional de la escena?
- [ ] ¿La temperatura de color (cálida/fría) es coherente con la emoción?
- [ ] ¿Las sombras se usan con intención narrativa?
- [ ] ¿Hay variación de iluminación entre escenas de diferentes tonos?
- [ ] ¿La iluminación guía la mirada hacia el foco de la escena?
- [ ] ¿Los cambios de luz dentro de una escena acompañan los cambios emocionales?
- [ ] ¿La iluminación es consistente entre planos de la misma escena?

---

## Errores Comunes

- **Iluminación plana.** Luz uniforme sin dirección ni contraste que aplana la escena y elimina profundidad.
- **Luz motivada por nada.** Luces dramáticas en un espacio donde no hay fuente que las justifique.
- **Sombras inconsistentes.** Sombras que cambian de dirección entre planos.
- **Sobre-iluminar por miedo.** Iluminar todo porque "el público necesita ver" — a veces no ver es más poderoso.
- **Temperatura de color genérica.** Usar siempre la misma temperatura sin adaptarla al contexto emocional.
- **Ignorar la hora del día.** La luz de las 7am no es igual a la de las 3pm. Los mundos creíbles respetan la luz natural.

---

## Criterios de Calidad

- La iluminación comunica el mood de la escena antes de que empiece el diálogo.
- Las sombras tienen forma y dirección que refuerzan la composición.
- Hay variación lumínica entre escenas que refleja el arco emocional del episodio.
- Los personajes en momentos clave están iluminados de forma que amplifica su estado emocional.
- La iluminación es uno de los elementos que hace que el estilo visual de la serie sea reconocible.', 'system')
  ('Lenguaje de Formas — Diseño de personajes', ARRAY['craft:visual'], '#AB47BC', '# Lenguaje de Formas — Geometría como Personalidad

> Las tres formas básicas — círculos, cuadrados y triángulos — son el alfabeto del diseño de personajes y mundos. Cada forma activa una respuesta psicológica instintiva en el espectador antes de cualquier análisis consciente.

---

## Principios Fundamentales

1. **Círculos = seguridad, amabilidad, inocencia.** Los personajes redondos se sienten accesibles y amigables. Son los protagonistas, los niños, los compañeros leales. Baymax, Totoro, Kirby — todos están construidos sobre círculos.

2. **Cuadrados = estabilidad, fuerza, rigidez.** Los personajes cuadrados se sienten sólidos y confiables, pero también tercos o inflexibles. Son los mentores, los guerreros, los protectores. Ralph (Wreck-it Ralph) es esencialmente un cuadrado.

3. **Triángulos = peligro, dinamismo, astucia.** Los personajes triangulares se sienten agresivos, astutos o amenazantes. Son los villanos, los tricksters, los personajes afilados. Jafar, Maleficent — puro triángulo.

4. **La mezcla de formas crea complejidad.** Un personaje que combina círculo (cuerpo amable) con triángulos (ojos afilados) comunica que hay más de lo que parece. Las contradicciones visuales generan personajes interesantes.

5. **Las formas evolucionan con el personaje.** Un villano que se redime puede pasar de formas triangulares a más redondeadas a lo largo de la serie. La transformación visual refleja la transformación interna.

6. **El mundo también tiene lenguaje de formas.** Un pueblo seguro tiene arquitectura redondeada. Una fortaleza del villano es toda ángulos y puntas. El entorno habla el mismo idioma visual que sus habitantes.

7. **Las formas secundarias añaden matiz.** La forma dominante define la primera impresión. Las formas secundarias añaden complejidad. Un personaje predominantemente circular con detalles cuadrados sugiere amabilidad con determinación.

8. **La consistencia es clave dentro de un mundo.** Cada mundo tiene su propio "vocabulario de formas". Un mundo orgánico usa más curvas. Un mundo industrial, más rectas. Mezclar sin criterio rompe la coherencia visual.

---

## Las Tres Formas en Detalle

### Círculo
- **Sensación:** Suave, seguro, acogedor, infantil, orgánico
- **Personajes típicos:** Protagonistas jóvenes, animales amigables, sidekicks cómicos
- **Mundos típicos:** Pueblos acogedores, bosques mágicos, hogares seguros
- **Peligro:** Exceso de círculos = personaje que parece débil o genérico

### Cuadrado
- **Sensación:** Sólido, confiable, fuerte, terco, artificial
- **Personajes típicos:** Héroes maduros, figuras de autoridad, robots, guardaespaldas
- **Mundos típicos:** Ciudades, fortalezas, instituciones, fábricas
- **Peligro:** Exceso de cuadrados = personaje rígido y aburrido

### Triángulo
- **Sensación:** Afilado, peligroso, dinámico, astuto, elegante
- **Personajes típicos:** Villanos, tricksters, personajes misteriosos, depredadores
- **Mundos típicos:** Guaridas, cuevas, paisajes hostiles, torres
- **Peligro:** Exceso de triángulos = personaje unidimensionalmente amenazante

---

## Checklist de Creación

- [ ] ¿La forma dominante del personaje comunica su esencia (amable, fuerte, peligroso)?
- [ ] ¿Las formas secundarias añaden complejidad al personaje?
- [ ] ¿Personajes opuestos tienen formas contrastantes?
- [ ] ¿El lenguaje de formas del entorno es coherente con el del mundo?
- [ ] ¿Las formas evolucionan con el arco del personaje (si aplica)?
- [ ] ¿El lenguaje de formas es consistente dentro de cada facción/cultura del mundo?
- [ ] ¿La combinación de formas del personaje refleja su contradicción interna?

---

## Errores Comunes

- **Usar formas al azar.** Formas que no corresponden a la personalidad del personaje.
- **Todos iguales.** Todo el elenco construido sobre la misma forma base.
- **Literalismo excesivo.** No todo villano necesita ser un triángulo. La subversión del lenguaje de formas puede ser más interesante.
- **Ignorar el mundo.** Diseñar personajes con lenguaje de formas pero olvidar aplicarlo a la arquitectura, los objetos y la naturaleza del mundo.
- **Formas sin consistencia.** Un personaje que es circular en un frame y cuadrado en otro sin justificación narrativa.

---

## Criterios de Calidad

- La forma básica de cada personaje se puede dibujar en 3 trazos y ya comunica su personalidad.
- Las formas del elenco principal crean un contraste visual claro.
- El mundo y sus habitantes comparten un vocabulario de formas coherente.
- Un espectador sin formación en diseño "siente" quién es amigable y quién es peligroso solo por la forma.
- Los personajes complejos combinan formas de maneras que reflejan sus contradicciones internas.', 'system')
  ('Siluetas — Identidad visual', ARRAY['craft:visual'], '#AB47BC', '# Siluetas — La Primera y Última Prueba del Diseño

> Si un personaje no es reconocible por su silueta, el diseño no está listo. La silueta es la forma más básica y poderosa de comunicar identidad visual. Es lo primero que el cerebro procesa y lo último que olvida.

---

## Principios Fundamentales

1. **La silueta es identidad.** Antes de color, antes de textura, antes de detalles — la silueta define al personaje. Mickey Mouse, Bart Simpson, Totoro: todos son reconocibles como sombras negras.

2. **Cada personaje necesita una silueta única.** Si dos personajes del mismo elenco tienen siluetas similares, hay un problema de diseño. El espectador debe poder distinguirlos instantáneamente.

3. **La silueta comunica personalidad.** Un personaje con hombros anchos y piernas cortas comunica algo diferente a uno alto y delgado. La forma básica del cuerpo es el primer statement sobre quién es.

4. **Las proporciones exageradas son memorables.** La animación permite exagerar proporciones de formas que el live-action no puede. Cabezas grandes, manos expresivas, cuerpos estilizados — la exageración es una herramienta, no un defecto.

5. **Los accesorios definen la silueta.** Un sombrero, un arma, una capa, un peinado — los elementos que rompen el contorno básico del cuerpo son los que hacen la silueta memorable.

6. **La silueta debe funcionar en movimiento.** Un buen diseño no solo es reconocible en pose estática — mantiene su legibilidad cuando el personaje corre, salta, pelea o baila.

7. **La silueta escala.** Debe funcionar en tamaño grande (poster) y pequeño (ícono de app, miniatura de video). Si solo funciona en un tamaño, el diseño necesita simplificarse.

8. **La silueta del grupo también importa.** El elenco completo de personajes, puesto lado a lado como siluetas, debe mostrar variedad clara de alturas, proporciones y formas.

---

## Checklist de Creación

- [ ] ¿El personaje es reconocible como silueta negra sólida, sin detalles internos?
- [ ] ¿La silueta se distingue claramente de la de otros personajes del elenco?
- [ ] ¿Las proporciones del cuerpo comunican la personalidad del personaje?
- [ ] ¿Hay elementos distintivos que rompan el contorno básico (pelo, accesorios, ropa)?
- [ ] ¿La silueta funciona en poses de acción, no solo en pose neutral?
- [ ] ¿La silueta funciona en tamaño pequeño (miniatura)?
- [ ] ¿El elenco completo, como grupo de siluetas, muestra variedad?
- [ ] ¿La silueta es simple y memorable, no compleja y olvidable?

---

## Errores Comunes

- **Personajes con la misma silueta base.** Mismo tipo de cuerpo diferenciado solo por color de pelo — eso no es diseño.
- **Dependencia del color.** Si necesitas el color para distinguir personajes, la silueta no funciona.
- **Detalles que no se leen.** Accesorios diminutos que se pierden a distancia o en movimiento.
- **Silueta estática.** Un diseño que se ve bien posando pero pierde legibilidad en acción.
- **Complejidad excesiva.** Demasiados elementos que rompen el contorno crean ruido visual, no identidad.
- **Proporciones realistas en animación.** La animación no necesita ser realista — necesita ser expresiva. Proporciones "correctas" suelen ser proporciones aburridas.

---

## Criterios de Calidad

- El "test de silueta" se pasa: cualquier persona identifica al personaje como sombra negra.
- Todos los personajes del elenco son distinguibles como grupo de siluetas.
- La silueta funciona como ícono (tamaño 64x64 pixels).
- La forma básica del cuerpo dice algo sobre la personalidad antes de ver cualquier detalle.
- La silueta se mantiene legible en las poses más extremas que el personaje adoptará en la serie.', 'system')
  ('Música — Narrativa sonora', ARRAY['craft:sonido'], '#FF8A65', '# Música — Scoring Emocional

> La música es la emoción que el espectador no puede ver. Un frame puede ser ambiguo — la música le dice al espectador cómo sentirse. Pero la mejor música no dicta emociones: las amplifica, las matiza, y a veces las contradice con efecto devastador.

---

## Principios Fundamentales

1. **La música sirve a la historia, no al revés.** La música no existe para sonar bonita — existe para hacer que la historia se sienta más. Si la música no amplifica la emoción de la escena, sobra.

2. **El leitmotif es identidad sonora.** Un tema musical asociado a un personaje, lugar o idea crea conexión emocional acumulativa. Cada vez que suena, trae consigo toda la historia emocional de ese personaje. Es una de las herramientas más poderosas del scoring.

3. **El silencio es la nota más poderosa.** Un momento sin música después de una secuencia musicalmente intensa crea un impacto emocional que ninguna orquesta puede igualar. No le tengas miedo al silencio.

4. **Menos música = más impacto.** Si toda la serie tiene música de fondo constante, los momentos musicales pierden poder. Reserva la música para momentos donde realmente amplifique algo.

5. **La música puede contradecir la imagen.** Música alegre sobre una escena triste. Música infantil sobre algo siniestro. La disonancia entre lo que se ve y lo que se oye crea una tensión que el espectador siente en las tripas.

6. **El tempo musical es pacing.** La música puede acelerar o desacelerar la percepción del ritmo de una escena. Un adagio hace que un momento se sienta eterno. Un allegro hace que todo vuele.

7. **Los temas evolucionan con los personajes.** El leitmotif del protagonista al inicio de la serie no debería sonar igual al final. Puede cambiar de instrumentación, tonalidad o tempo para reflejar su transformación.

8. **La instrumentación es worldbuilding.** Los instrumentos elegidos comunican cultura, época y estética. Un mundo medieval suena diferente a uno futurista. La paleta de instrumentos es parte del diseño del mundo.

---

## Checklist de Creación

- [ ] ¿Los personajes principales tienen leitmotifs identificables?
- [ ] ¿La música amplifica la emoción de cada escena sin dictarla?
- [ ] ¿Hay momentos de silencio musical intencionales?
- [ ] ¿La instrumentación es coherente con el mundo de la serie?
- [ ] ¿Los leitmotifs evolucionan con los arcos de los personajes?
- [ ] ¿La música no está presente en el 100% de las escenas? ¿Hay variación?
- [ ] ¿El volumen y la mezcla permiten que el diálogo sea siempre inteligible?
- [ ] ¿El tema principal de la serie es memorable y tarareble?
- [ ] ¿La música de los momentos clave (clímax, revelaciones) tiene el impacto adecuado?

---

## Errores Comunes

- **Wallpaper music.** Música de fondo genérica que está siempre ahí sin aportar nada específico.
- **Mickey Mousing excesivo.** Música que sigue cada acción literalmente (personaje sube escaleras = notas ascendentes). Un poco es útil; mucho es caricatura.
- **Telegrafiar emociones.** Música triste que le dice al espectador "esto es triste" antes de que la escena lo demuestre. Deja que la escena trabaje primero.
- **Sin leitmotifs.** Música que suena bien pero no construye identidades sonoras reconocibles para personajes o ideas.
- **Volumen que compite con diálogo.** Si el espectador tiene que esforzarse para oír lo que dicen los personajes, la mezcla está mal.
- **Música que no para.** Sin pausas ni silencios — el espectador se acostumbra y la música pierde todo efecto.
- **Tono musical inconsistente.** Saltar entre géneros musicales sin lógica narrativa.

---

## Criterios de Calidad

- El espectador puede tararear el tema principal después de unos pocos episodios.
- Los leitmotifs evocan al personaje/idea asociada cuando suenan en otros contextos.
- Hay al menos un momento por episodio donde la música eleva significativamente la escena.
- Los silencios musicales se sienten intencionales y potentes.
- La paleta instrumental es coherente con el mundo y el tono de la serie.
- La música del último episodio de la temporada suena como una evolución de la del primero.', 'system')
  ('Efectos de Sonido — Principios', ARRAY['craft:sonido'], '#FF8A65', '# Efectos de Sonido — El Mundo que Se Oye

> Los efectos de sonido son lo que hace que un mundo animado se sienta real. Sin sonido, la animación es una sucesión de imágenes silenciosas. Con el sonido correcto, cada golpe duele, cada puerta cruje, cada mundo respira.

---

## Principios Fundamentales

1. **El sonido completa la imagen.** Lo que se ve sin sonido se siente incompleto. Lo que se oye sin imagen activa la imaginación. Juntos, crean realidad. El sonido es el 50% de la experiencia.

2. **Cada mundo tiene su firma sonora.** Un bosque suena diferente a una ciudad. Una nave espacial suena diferente a un castillo. La textura sonora del ambiente es worldbuilding puro.

3. **El sonido puede mostrar lo que la cámara no muestra.** Un grito fuera de plano. Pasos acercándose. Una puerta que se cierra. El sonido puede narrar lo que está fuera del frame.

4. **Los efectos estilizados son válidos.** En animación, los sonidos no necesitan ser realistas — necesitan ser expresivos. Un golpe cómico suena diferente a un golpe dramático, aunque visualmente sean similares.

5. **Los detalles sonoros construyen inmersión.** El sonido de las pisadas cambia con el suelo (madera, piedra, hierba). La lluvia suena diferente en un tejado que en un charco. Estos detalles son los que hacen que el espectador olvide que está viendo animación.

6. **El silencio es un efecto de sonido.** Quitar repentinamente todo sonido después de una explosión o en un momento de shock es una herramienta poderosa. El silencio hace que el espectador sienta el vacío.

7. **Los efectos tienen personalidad.** El sonido de la espada del héroe no suena igual que la del villano. El motor de la nave del protagonista no suena como el del enemigo. Los sonidos caracterizan objetos.

8. **La mezcla es narrativa.** Qué se oye fuerte y qué se oye bajo es una decisión de storytelling. En una escena de conversación en un mercado, ¿domina el diálogo o el bullicio? Esa decisión cambia la escena.

---

## Categorías de Efectos

### Ambientes
- Textura sonora continua del espacio.
- Establece ubicación, hora del día, clima, estado del mundo.
- Debe ser sutil pero presente — el espectador lo nota solo cuando falta.

### Foley
- Sonidos de acciones de los personajes (pasos, ropa, objetos).
- Dan materialidad y peso al personaje.
- Varían con el personaje (pasos pesados vs. ligeros) y la superficie.

### Hard Effects
- Sonidos de eventos específicos (explosiones, puertas, vehículos).
- Son los sonidos que el espectador espera oír.
- Pueden ser realistas o estilizados según el tono.

### Design Effects
- Sonidos creados para elementos fantásticos (magia, poderes, criaturas).
- No tienen referente real — son pura invención sonora.
- Deben ser consistentes: el mismo poder suena igual siempre.

---

## Checklist de Creación

- [ ] ¿Cada ambiente tiene una textura sonora que establece el espacio?
- [ ] ¿Los pasos y foley varían con la superficie y el personaje?
- [ ] ¿Los elementos fantásticos (magia, poderes, criaturas) tienen sonidos diseñados con consistencia?
- [ ] ¿El silencio se usa como herramienta expresiva?
- [ ] ¿La mezcla prioriza lo narrativamente importante en cada momento?
- [ ] ¿Los efectos de sonido refuerzan el impacto de las acciones (golpes, caídas, impactos)?
- [ ] ¿Los sonidos están estilizados de forma coherente con el tono de la serie?
- [ ] ¿Los objetos y armas recurrentes tienen identidad sonora consistente?
- [ ] ¿El diseño sonoro contribuye al worldbuilding?

---

## Errores Comunes

- **Escenas silenciosas no intencionales.** Falta de ambientes o foley que hacen que la escena se sienta vacía y no terminada.
- **Sonidos genéricos.** Usar la misma biblioteca de sonidos genéricos que suena a "cualquier serie animada".
- **Sobre-carga sonora.** Demasiados efectos simultáneos que crean una masa de ruido indistinguible.
- **Inconsistencia.** El mismo poder/arma/criatura que suena diferente en cada aparición.
- **Foley ausente.** Personajes que se mueven sin hacer ruido — se siente fantasmal.
- **Efectos que compiten con diálogo.** Sonidos tan fuertes que el espectador no puede oír lo que se dice.
- **Realismo fuera de tono.** Efectos hiperrealistas en una serie cómica estilizada, o viceversa.

---

## Criterios de Calidad

- El espectador "siente" el mundo como un lugar real (o intencionalmente estilizado).
- Los personajes tienen presencia sonora — se oyen sus pasos, su ropa, sus acciones.
- Los elementos fantásticos tienen identidad sonora memorable y consistente.
- La mezcla de audio guía la atención del espectador hacia lo narrativamente importante.
- Hay al menos un momento por episodio donde el sonido (o su ausencia) crea un impacto emocional claro.
- Si cierras los ojos, puedes seguir la acción de la escena solo por el sonido.', 'system')
  ('Reglas del Mundo — Construcción de universos', ARRAY['craft:worldbuilding'], '#AB47BC', '# Reglas del Mundo

## Propósito

Este documento establece los principios para crear, documentar y mantener las reglas internas de un mundo ficticio. Las reglas son el contrato implícito con la audiencia: definen qué es posible, qué es imposible y qué tiene consecuencias. Un mundo sin reglas claras no genera tensión; un mundo con reglas rotas pierde credibilidad.

---

## Principios Fundamentales

### 1. Toda regla existe para generar tensión narrativa
Una regla que no crea dilemas, limitaciones o decisiones difíciles para los personajes no merece existir. Las reglas no son decoración: son las paredes del laberinto que obliga a los personajes a buscar caminos creativos.

### 2. Las reglas se establecen antes de necesitarlas
Si una regla aparece por primera vez en el momento exacto en que resuelve un problema, la audiencia lo percibe como trampa. Las reglas deben plantarse con anticipación — idealmente en contextos donde parecen información ambiental, no exposición forzada.

### 3. La consistencia es más importante que la espectacularidad
Un momento visualmente impresionante que viola las reglas establecidas erosiona la confianza del público. La audiencia perdona limitaciones de presupuesto o estilo, pero no perdona que el mundo se contradiga a sí mismo.

### 4. Las excepciones deben costar más que las reglas
Si una regla se puede romper, el precio de romperla debe ser tan alto que el acto mismo se convierta en un momento narrativo significativo. Las excepciones baratas devalúan todo el sistema.

### 5. Cada regla tiene jurisdicción clara
Hay que definir dónde aplica cada regla y dónde no. Las reglas universales (aplican en todo el mundo) son distintas de las reglas locales (aplican en una región, cultura o sistema). La confusión entre ambas genera inconsistencias.

### 6. Las reglas deben poder explicarse en una frase
Si una regla requiere un párrafo para entenderse, es demasiado compleja para que la audiencia la retenga. La complejidad puede existir en las implicaciones, no en la formulación.

### 7. Los personajes conocen las reglas de su mundo
Los habitantes del mundo no se sorprenden por cómo funciona su realidad. Si un personaje se asombra ante algo cotidiano en su mundo, rompe la verosimilitud. La sorpresa debe reservarse para lo genuinamente anómalo.

### 8. Las consecuencias son la prueba de que las reglas existen
Una regla que nunca se activa, que nunca genera consecuencias visibles, es invisible para la audiencia. Las reglas se demuestran con sus efectos, no con exposición verbal.

### 9. El mundo no se adapta a la conveniencia del protagonista
Las reglas aplican por igual a protagonistas y antagonistas. Si el héroe escapa de una situación gracias a una excepción que al villano no se le concedió, el mundo pierde credibilidad.

### 10. Menos reglas, mejor ejecutadas
Un mundo con tres reglas sólidas y bien exploradas es infinitamente superior a uno con veinte reglas superficiales. La profundidad viene de explorar las implicaciones, no de acumular restricciones.

---

## Checklist de Creación

Antes de dar por terminado el sistema de reglas de un mundo, todo agente debe responder:

- [ ] ¿Puedo enunciar cada regla en una sola oración clara?
- [ ] ¿Cada regla genera al menos un tipo de conflicto narrativo?
- [ ] ¿He definido qué sucede cuando alguien intenta romper cada regla?
- [ ] ¿Las reglas aplican de forma consistente a todos los personajes, sin favoritismo narrativo?
- [ ] ¿He establecido las reglas antes de los momentos donde serán relevantes?
- [ ] ¿He verificado que ninguna regla contradice a otra?
- [ ] ¿Los personajes del mundo actúan como si conocieran estas reglas desde siempre?
- [ ] ¿Las excepciones están documentadas con su costo correspondiente?
- [ ] ¿Puedo rastrear al menos tres consecuencias narrativas por cada regla principal?
- [ ] ¿El sistema de reglas se sostiene si elimino al protagonista? (Es decir, ¿las reglas son del mundo, no del personaje?)

---

## Errores Comunes

### El deus ex machina disfrazado
Introducir una regla nueva en el clímax que resuelve convenientemente el conflicto. Aunque técnicamente "no contradice nada", la audiencia lo experimenta como trampa porque no tuvo oportunidad de anticiparlo.

### La regla de goma
Establecer una regla que se estira o se encoge según la necesidad de la trama. "La magia no funciona de noche... excepto cuando sí." Cada flexión no justificada debilita todo el sistema.

### La exposición enciclopédica
Dedicar secuencias enteras a explicar reglas en lugar de mostrarlas en acción. Las reglas se enseñan mejor a través de consecuencias que a través de monólogos explicativos.

### El mundo que solo existe alrededor del protagonista
Crear reglas que solo afectan la experiencia del personaje principal. El mundo debe funcionar independientemente del protagonista. Las reglas que solo se manifiestan cuando él está presente revelan un mundo hueco.

### La escalada sin techo
No definir los límites superiores de un sistema de poder. Si no hay techo, no hay tensión. La audiencia necesita saber cuál es el máximo posible para calibrar el peligro.

### Reglas retroactivas
Alterar o reinterpretar reglas ya establecidas para justificar giros de trama. "En realidad, la profecía decía otra cosa." Esto destruye la confianza retroactivamente.

### Inconsistencia entre medios
Si el mundo existe en cortometraje, serie y material complementario, las reglas deben ser idénticas en todos. Una regla que funciona diferente en el cómic que en la serie fragmenta el mundo.

---

## Criterios de Calidad

Un sistema de reglas cumple con el estándar cuando:

1. **Test de predicción**: Un espectador atento puede anticipar las consecuencias de una acción basándose en las reglas establecidas. Si no puede, las reglas no están claras. Si siempre puede, no hay suficiente complejidad.

2. **Test de sustitución**: Si reemplazo al protagonista por otro personaje, las reglas del mundo siguen funcionando igual. Las reglas pertenecen al mundo, no al arco del héroe.

3. **Test de la pregunta infantil**: Si un niño de 8 años pregunta "¿pero por qué no usó X para resolver Y?", debe existir una respuesta satisfactoria dentro de las reglas. Los agujeros lógicos que un niño detecta son inaceptables.

4. **Test de consecuencias en cadena**: Cada regla principal debe generar al menos dos niveles de consecuencias derivadas. Si una regla no tiene implicaciones más allá de su efecto inmediato, está infraexplotada.

5. **Test de tensión**: Las reglas deben crear situaciones donde los personajes enfrentan decisiones difíciles. Un sistema de reglas que permite soluciones fáciles ha fallado en su propósito fundamental.

6. **Test de coherencia interna**: Un lector puede recorrer toda la biblia del mundo sin encontrar dos afirmaciones que se contradigan entre sí. La coherencia no es negociable.

7. **Test de elegancia**: El número de reglas es el mínimo necesario para sostener la riqueza narrativa deseada. Cada regla justifica su existencia con impacto verificable en la historia.', 'system')
  ('Culturas — Autenticidad y diversidad', ARRAY['craft:worldbuilding'], '#AB47BC', '# Culturas y Sociedades

## Propósito

Este documento establece los principios para diseñar culturas ficticias que se sientan habitadas, complejas y narrativamente productivas. Una cultura bien construida no es un catálogo de costumbres exóticas: es un sistema vivo de valores, contradicciones y presiones sociales que moldea a cada personaje que nace dentro de ella.

---

## Principios Fundamentales

### 1. Una cultura es una respuesta colectiva a un problema
Toda cultura surge como adaptación a circunstancias concretas: geografía, amenazas, recursos, historia. Antes de definir rituales o vestimenta, hay que definir: ¿qué problema resolvió esta cultura para sobrevivir? La respuesta a esa pregunta genera todo lo demás orgánicamente.

### 2. Las culturas se definen por lo que valoran Y por lo que sacrifican
Cada valor cultural tiene un costo. Una sociedad que prioriza la lealtad familiar sacrifica individualismo. Una que celebra la innovación descuida la tradición. No existen culturas que lo tienen todo resuelto. Los sacrificios son tan definitorios como los logros.

### 3. Dentro de cada cultura hay disidentes
Ninguna cultura es monolítica. Siempre existen personas que cuestionan, que no encajan, que quieren cambiar las cosas. Una cultura sin tensión interna es un estereotipo. Los disidentes revelan los puntos de presión de la sociedad.

### 4. La cultura se vive, no se exhibe
Los miembros de una cultura no piensan en sus costumbres como "costumbres". No explican sus tradiciones a otros miembros. La cultura se manifiesta en decisiones automáticas, en lo que se da por sentado, en lo que resulta impensable. La cultura es el agua en la que nadan los peces.

### 5. El choque cultural es la mina de oro narrativa
El conflicto más rico no ocurre dentro de una cultura, sino en el contacto entre dos que tienen valores incompatibles. El choque cultural obliga a los personajes a cuestionar lo que daban por sentado y a elegir quiénes quieren ser.

### 6. Los estereotipos son atajos perezosos
"El pueblo guerrero", "la raza sabia", "la civilización pacífica" son clichés que reducen sociedades enteras a un solo rasgo. Las culturas reales son contradictorias: pueden ser artísticamente sofisticadas y políticamente brutales al mismo tiempo.

### 7. La cultura moldea al personaje, pero no lo determina
El origen cultural de un personaje influye en su visión del mundo, sus suposiciones y sus puntos ciegos, pero no dicta sus decisiones. Los personajes más interesantes son aquellos que negocian con su herencia cultural: la abrazan, la rechazan, la reinterpretan.

### 8. Las culturas cambian con el tiempo
Una cultura que lleva mil años exactamente igual es una fantasía estática. Las culturas evolucionan por contacto con otras, por crisis, por innovación tecnológica, por el simple paso generacional. Definir cómo ha cambiado una cultura revela su vitalidad.

### 9. Los detalles cotidianos construyen más que los grandes rituales
Cómo saluda la gente, qué consideran grosero, cómo organizan una comida, qué chistes cuentan: estos micro-comportamientos construyen más sensación de cultura vivida que cualquier ceremonia elaborada.

### 10. Toda cultura tiene su lógica interna
Incluso las prácticas que parecen crueles o absurdas desde fuera tienen sentido dentro del marco de valores y circunstancias de esa cultura. Entender la lógica no significa aprobarla, pero es imprescindible para representarla con honestidad y profundidad.

---

## Checklist de Creación

Antes de dar por terminada una cultura, todo agente debe responder:

- [ ] ¿Cuál es el problema histórico o ambiental que esta cultura resolvió para sobrevivir?
- [ ] ¿Cuáles son sus tres valores fundamentales, y qué sacrifica cada uno?
- [ ] ¿Quiénes son los disidentes dentro de esta cultura y por qué disienten?
- [ ] ¿He definido al menos cinco comportamientos cotidianos (no ceremoniales) que revelan estos valores?
- [ ] ¿Cómo ha cambiado esta cultura en las últimas tres generaciones?
- [ ] ¿Cómo reacciona esta cultura ante las otras culturas del mundo? ¿Con admiración, desprecio, indiferencia, miedo?
- [ ] ¿Los personajes de esta cultura actúan como si sus costumbres fueran normales, sin explicarlas innecesariamente?
- [ ] ¿He evitado reducir esta cultura a un solo rasgo dominante?
- [ ] ¿Puedo identificar al menos una contradicción interna dentro de esta cultura (algo que predican pero no practican, o dos valores que entran en tensión)?
- [ ] ¿La cultura tiene una relación específica con la comida, el espacio, el cuerpo y el tiempo? Estos cuatro ejes revelan mucho.
- [ ] ¿Qué considera esta cultura imperdonable? ¿Qué es su tabú máximo?
- [ ] ¿He verificado que esta cultura no es un calco superficial de una cultura real reducida a estereotipos?

---

## Errores Comunes

### La cultura de un solo rasgo
Reducir toda una sociedad a "son guerreros" o "son sabios" o "son comerciantes". Las culturas reales tienen artistas, cobardes, filósofos, criminales y soñadores, todos operando bajo el mismo marco cultural pero expresándolo de formas diversas.

### El multiculturalismo decorativo
Crear varias culturas que solo se diferencian en vestimenta y acento pero comparten exactamente los mismos valores y formas de pensar. La diversidad cultural real implica diferencias profundas en cosmovisión, no solo en estética.

### El noble salvaje / el civilizado corrupto
Asignar automáticamente virtud moral a las culturas "primitivas" y corrupción a las "avanzadas". Esta dicotomía es tan reductiva como su opuesta. La complejidad moral existe en todos los niveles de desarrollo social.

### La cultura museo
Presentar una cultura como pieza de exhibición, congelada y perfecta, en lugar de como sistema vivo con tensiones, cambios y debates internos. Las culturas estáticas son culturas muertas.

### El traductor universal de valores
Asumir que conceptos como "libertad", "honor" o "justicia" significan lo mismo en todas las culturas del mundo. Parte de la riqueza del worldbuilding es explorar cómo distintas sociedades definen estos conceptos de formas incompatibles.

### Exotismo sin funcionalidad
Añadir prácticas culturales extrañas solo porque "se ven interesantes" sin conectarlas con la historia, el entorno o los valores de esa sociedad. Cada práctica cultural debe tener una razón de ser, aunque esa razón se haya perdido en el tiempo.

### Cultura como disfraz del autor
Crear una cultura ficticia que es transparentemente un vehículo para las opiniones políticas o morales del creador, sin complejidad ni matices. Las culturas ficticias deben presentar dilemas genuinos, no sermones disfrazados.

---

## Criterios de Calidad

Una cultura cumple con el estándar cuando:

1. **Test del habitante**: Puedo describir un día ordinario de una persona común de esta cultura — no del héroe, no del rey, sino de alguien promedio — y ese día se siente específico y distinto al de alguien de otra cultura del mismo mundo.

2. **Test del debate interno**: Dentro de esta cultura existen al menos dos posiciones legítimas sobre un tema importante. No hay consenso total; hay tensión productiva.

3. **Test de la raíz**: Puedo rastrear cada costumbre o valor importante hasta una causa histórica, ambiental o social concreta. Nada existe "porque sí".

4. **Test del choque**: Cuando dos culturas de este mundo interactúan, el conflicto que surge no es simplemente "buenos vs. malos", sino un choque genuino de valores donde ambas partes tienen razones comprensibles.

5. **Test de la inmersión**: Los personajes de esta cultura no necesitan explicar su cultura al público. La muestran viviendo. El espectador la absorbe por ósmosis, no por exposición.

6. **Test de la especificidad**: Si cambio los nombres y la estética visual, ¿esta cultura sigue siendo distinguible de las demás por su forma de pensar y actuar? Si no, es genérica.

7. **Test de la empatía**: Un espectador puede entender por qué alguien nacido en esta cultura piensa como piensa, incluso si no está de acuerdo. La cultura no existe para ser juzgada desde fuera, sino para ser comprendida desde dentro.', 'system')
  ('Economía — Sistemas del mundo', ARRAY['craft:worldbuilding'], '#AB47BC', '# Economía y Sistemas de Poder

## Propósito

Este documento establece los principios para diseñar sistemas económicos ficticios que funcionen como motor narrativo. La economía de un mundo no es un detalle de fondo: es la estructura invisible que determina quién tiene poder, quién no, qué conflictos son posibles y qué está en juego. Un mundo sin economía pensada es un mundo donde el poder aparece por arte de magia y las consecuencias materiales no existen.

---

## Principios Fundamentales

### 1. La escasez es el motor de toda narrativa
Donde hay abundancia no hay conflicto. Lo primero que hay que definir en cualquier economía ficticia es: ¿qué es escaso? Puede ser un recurso físico, energía, tiempo, espacio habitable, acceso a magia, información. La escasez dicta quién pelea, por qué pelea y qué está dispuesto a sacrificar.

### 2. Sigue el recurso para encontrar el poder
En cualquier mundo, quien controla el recurso escaso controla la sociedad. Rastrear la cadena de control de un recurso — quién lo extrae, quién lo transporta, quién lo distribuye, quién lo consume — revela la estructura de poder real, que frecuentemente es distinta de la estructura de poder oficial.

### 3. La desigualdad genera historias; la igualdad perfecta no
Los mundos narrativamente ricos tienen estratificación: quienes tienen y quienes no. Esto no es un juicio moral sobre la igualdad; es una observación sobre la mecánica narrativa. La tensión entre capas sociales es combustible puro para el conflicto.

### 4. El dinero es una tecnología, no un dato de fondo
¿Qué se usa como moneda y por qué? ¿Es dinero fiduciario, basado en un recurso, basado en reputación? La naturaleza del dinero revela los valores de la sociedad. Un mundo que comercia con memorias tiene una relación radicalmente distinta con la riqueza que uno que comercia con oro.

### 5. Todo sistema económico tiene ganadores y perdedores
No existen sistemas económicos perfectos, ni en la realidad ni en la ficción. Si un mundo tiene un sistema económico que funciona sin fricciones, está mintiendo o está ignorando a alguien. Los perdedores del sistema son frecuentemente los personajes más interesantes.

### 6. El trabajo define la identidad
Lo que los personajes hacen para ganarse la vida moldea cómo ven el mundo. Un pescador, un minero, un comerciante y un burócrata viven en el mismo mundo pero experimentan realidades completamente distintas. Las profesiones no son etiquetas: son lentes a través de las cuales se filtra toda la experiencia.

### 7. Los sistemas económicos tienen inercia
Las economías no cambian de la noche a la mañana. Tienen infraestructura, hábitos, instituciones, dependencias. Un cambio económico radical (una revolución, un descubrimiento, un colapso) tarda generaciones en asimilarse. La resistencia al cambio económico es una fuente rica de conflicto.

### 8. El comercio conecta mundos
Las rutas comerciales son las arterias de un mundo. ¿Quién comercia con quién? ¿Qué se exporta e importa? ¿Qué regiones dependen de otras? El comercio crea interdependencias que pueden ser fuente tanto de cooperación como de vulnerabilidad.

### 9. La economía informal existe siempre
Mercados negros, trueque, favores, contrabando. Junto a cualquier sistema económico formal existe uno informal que lo complementa, lo subvierte o lo parasita. La economía informal revela las fisuras del sistema oficial.

### 10. El costo de la guerra es económico antes que heroico
Las batallas se ganan con logística, no con discursos. ¿Quién paga a los soldados? ¿De dónde sale la comida? ¿Qué pasa con la economía civil durante un conflicto? Ignorar la dimensión económica de la guerra produce narrativas huecas donde los ejércitos aparecen y desaparecen sin consecuencias materiales.

---

## Checklist de Creación

Antes de dar por terminado un sistema económico, todo agente debe responder:

- [ ] ¿Cuál es el recurso más escaso de este mundo y quién lo controla?
- [ ] ¿Qué se usa como moneda o medio de intercambio, y por qué ese medio y no otro?
- [ ] ¿Cuántas clases o estratos sociales existen, y qué determina la pertenencia a cada uno?
- [ ] ¿Qué trabajo realiza la mayoría de la población? ¿Cuál es la actividad económica base?
- [ ] ¿Existen rutas comerciales? ¿Qué regiones dependen económicamente de otras?
- [ ] ¿Hay mercado negro o economía informal? ¿Qué circula por fuera del sistema oficial?
- [ ] ¿Quiénes son los perdedores del sistema económico actual? ¿Qué hacen al respecto?
- [ ] ¿Cómo se financia el conflicto principal de la historia? ¿De dónde sale el dinero para la guerra, la expedición o la empresa?
- [ ] ¿Qué pasaría si el recurso principal desapareciera mañana? ¿Cómo colapsaría la sociedad?
- [ ] ¿He verificado que la economía de este mundo podría funcionar a nivel básico? (No necesita ser un modelo econométrico, pero sí pasar el test del sentido común.)
- [ ] ¿La riqueza y la pobreza de los personajes se sienten como consecuencias del sistema, no como datos arbitrarios del guion?

---

## Errores Comunes

### La economía invisible
Personajes que viajan, comen, se equipan y pelean sin que jamás se mencione cómo lo financian. El dinero aparece cuando es conveniente y desaparece cuando estorba. Este error destruye la sensación de un mundo con consecuencias reales.

### El recurso mágico sin consecuencias
Introducir un recurso valiosísimo (cristales de poder, mineral raro, agua mágica) sin explorar quién lo controla, quién muere extrayéndolo, quién se enriquece con él y qué conflictos genera su distribución. Un recurso sin economía alrededor es un McGuffin vacío.

### El villano monopolista como única estructura económica
Reducir toda la economía del mundo a "un villano que controla todo". Las economías reales son redes complejas con múltiples actores, intereses cruzados y alianzas inestables. Un solo antagonista económico es una simplificación excesiva.

### La revolución instantánea
Derrocar un sistema económico en el tercer acto y asumir que el nuevo sistema funciona inmediatamente. Las transiciones económicas son caóticas, largas y dolorosas. La victoria política sin transición económica creíble es fantasía ingenua.

### El mundo post-escasez aburrido
Crear un mundo donde todo es abundante y luego preguntarse por qué no hay tensión. Si eliminas la escasez material, necesitas crear otro tipo de escasez (atención, estatus, propósito, tiempo) o no tendrás combustible narrativo.

### La pobreza pintoresca
Representar la pobreza como un detalle estético (calles sucias, ropa raída) sin explorar sus causas sistémicas ni sus efectos en la psicología de los personajes. La pobreza en ficción debe ser una fuerza narrativa, no decoración.

### Anacronismo económico inconsciente
Aplicar conceptos económicos modernos (corporaciones, bolsa de valores, capitalismo de consumo) a mundos pre-industriales sin justificación. Cada nivel tecnológico tiene sus propias formas económicas. No todos los mundos tienen bancos.

---

## Criterios de Calidad

Un sistema económico cumple con el estándar cuando:

1. **Test de la cadena**: Puedo rastrear cualquier objeto en la historia desde su origen (quién lo hizo, con qué materiales, dónde) hasta su uso final. Si un personaje tiene una espada, alguien minó el hierro, alguien lo forjó, alguien lo vendió.

2. **Test del trabajador**: Puedo describir la vida laboral de cinco personas de distintos estratos de este mundo. Sus trabajos se sienten diferentes entre sí y revelan distintas facetas del sistema económico.

3. **Test de la crisis**: Si elimino el recurso principal del mundo, puedo predecir razonablemente cómo colapsaría la sociedad: qué sectores caen primero, quién sufre más, quién intenta aprovecharse. El sistema económico es lo bastante coherente para simular estrés.

4. **Test de motivación**: Las decisiones económicas de los personajes son comprensibles dentro del sistema. Nadie rechaza riqueza sin razón, nadie ignora una deuda importante, nadie financia un ejército sin fuente de ingresos.

5. **Test del perdedor**: Puedo identificar quién paga el precio del sistema actual. Los perdedores existen, tienen rostro, y su situación se explica por la estructura económica, no por la mala suerte individual.

6. **Test de interdependencia**: Al menos dos regiones o grupos del mundo dependen económicamente uno del otro. Esta dependencia genera tanto cooperación como vulnerabilidad, y ambas son narrativamente explotables.

7. **Test de coherencia material**: Los personajes viven acorde a sus medios económicos. Los ricos actúan como ricos (con las ventajas y las distorsiones que eso implica), los pobres enfrentan limitaciones reales. La economía no se suspende por conveniencia narrativa.', 'system')
  ('Magia — Sistemas especiales', ARRAY['craft:worldbuilding'], '#AB47BC', '# Magia y Sistemas de Poder

## Propósito

Este documento establece los principios para diseñar sistemas de magia (o poderes extraordinarios) que sirvan a la narrativa en lugar de sabotearla. La magia mal diseñada es el enemigo número uno de la tensión dramática: si todo es posible, nada importa. Un sistema de magia bien construido no es un catálogo de efectos especiales, sino una extensión de los temas y dilemas de la historia.

---

## Principios Fundamentales

### 1. Las limitaciones son más interesantes que los poderes
Lo que la magia NO puede hacer define la historia mucho más que lo que sí puede. Las limitaciones crean dilemas, obligan a la creatividad y generan tensión. Un mago omnipotente no tiene historia; un mago que puede hacer una sola cosa pero con consecuencias devastadoras tiene un drama en cada decisión.

### 2. Toda magia tiene un costo
El costo puede ser físico (energía, dolor, años de vida), material (un recurso consumible), moral (sacrificio, corrupción) o social (estigma, aislamiento). La magia sin costo es un cheque en blanco narrativo que devalúa cada conflicto. El costo debe ser proporcional al poder: a mayor efecto, mayor precio.

### 3. Conoce tu espectro: magia dura vs. magia blanda
La magia dura tiene reglas explícitas, limitaciones claras y funciona como un sistema que la audiencia puede aprender. La magia blanda es misteriosa, impredecible y funciona como fuente de asombro. Ambas son válidas, pero requieren tratamientos narrativos distintos. El error fatal es mezclarlas sin intención: usar magia blanda para crear asombro y luego tratarla como magia dura para resolver problemas.

### 4. La magia dura resuelve problemas; la magia blanda los crea
Si la audiencia entiende las reglas de la magia, aceptará que se use para resolver conflictos. Si la magia es misteriosa, solo debe usarse para crear obstáculos o complicaciones, nunca como solución. Resolver un problema con magia que la audiencia no entiende es el equivalente narrativo de hacer trampa.

### 5. La magia debe reflejar los temas de la historia
Los mejores sistemas de magia son metáforas encarnadas. Si la historia trata sobre el peso del pasado, la magia podría alimentarse de recuerdos. Si trata sobre conexión humana, la magia podría requerir vínculos emocionales. La magia que no dialoga con los temas es pirotecnia hueca.

### 6. El acceso a la magia define la estructura social
¿Quién puede usar magia? ¿Todo el mundo, una élite, una minoría perseguida? La distribución del acceso mágico es una decisión política que moldea toda la sociedad. La magia democrática crea un tipo de mundo; la magia aristocrática, otro completamente distinto.

### 7. La magia transforma a quien la usa
El uso de la magia debe tener efectos acumulativos en quien la practica. No solo físicos: también psicológicos, sociales, espirituales. Un mago que usa magia durante años no debería ser la misma persona que cuando empezó. La transformación del usuario es una veta narrativa profundísima.

### 8. Los efectos secundarios son obligatorios
Toda acción mágica significativa debe tener consecuencias no intencionadas. Curar a alguien puede transferir la enfermedad. Controlar el clima puede desestabilizar ecosistemas. Los efectos secundarios previenen que la magia sea una solución limpia y perfecta.

### 9. La estética de la magia comunica su naturaleza
Cómo se ve, se siente y se experimenta la magia no es un detalle cosmético: es información narrativa. La magia que duele debería verse distinta de la magia que sana. La estética visual y sonora de la magia es lenguaje, especialmente en animación donde lo visual es primario.

### 10. Escala con cuidado
Definir temprano cuál es el techo de poder del sistema mágico. Si el primer acto muestra explosiones que destruyen montañas, el tercer acto necesita destruir continentes para impresionar. La escalada sin control narrativo lleva a la inflación de poder, donde nada impresiona porque todo es excesivo.

---

## Checklist de Creación

Antes de dar por terminado un sistema de magia, todo agente debe responder:

- [ ] ¿Puedo explicar qué puede y qué NO puede hacer la magia en una conversación breve?
- [ ] ¿Cuál es el costo de usar magia, y es proporcional al efecto?
- [ ] ¿He decidido conscientemente dónde se ubica el sistema en el espectro duro-blando, y trato la magia de forma coherente con esa decisión?
- [ ] ¿Quién tiene acceso a la magia y cómo afecta eso la estructura social?
- [ ] ¿Qué efectos tiene el uso prolongado de magia en el usuario?
- [ ] ¿Cuál es el techo de poder del sistema? ¿Cuál es la acción mágica más poderosa posible?
- [ ] ¿He definido al menos tres cosas que la magia definitivamente no puede hacer?
- [ ] ¿El sistema de magia conecta temáticamente con la historia que estamos contando?
- [ ] ¿He establecido los efectos secundarios o consecuencias no intencionadas del uso mágico?
- [ ] ¿Puedo verificar que la magia no se usa como deus ex machina en ningún momento de la trama?
- [ ] ¿La estética visual de la magia (color, textura, movimiento, sonido) comunica algo sobre su naturaleza?
- [ ] ¿Los personajes no mágicos del mundo tienen formas creíbles de lidiar con un entorno donde la magia existe?

---

## Errores Comunes

### La magia todopoderosa sin consecuencias
Personajes que lanzan hechizos devastadores sin agotarse, sin pagar un precio, sin efectos secundarios. Este error convierte cada conflicto futuro en absurdo: si podían hacer eso sin costo, ¿por qué no lo hicieron antes?

### El sistema de magia como sistema de videojuego
Tratar la magia como un árbol de habilidades con niveles, puntos de maná y categorías taxonómicas. Esto funciona en juegos donde la mecánica es el contenido, pero en narrativa reemplaza la emoción con contabilidad. La magia en ficción debe sentirse como fuerza viva, no como hoja de cálculo.

### La magia blanda que resuelve problemas
Usar magia misteriosa y sin reglas claras para resolver convenientemente el conflicto central. "El amor es la magia más poderosa" como solución a un problema concreto es una traición al contrato narrativo. Si la audiencia no pudo anticipar la solución, no es satisfactoria.

### El mago que olvida sus poderes
Personajes que tienen habilidades mágicas establecidas pero no las usan en situaciones donde serían la respuesta obvia. Esto ocurre cuando el sistema de magia no tiene limitaciones claras que justifiquen por qué no siempre es la primera opción.

### La escalada infinita
Cada nuevo villano es más poderoso que el anterior, requiriendo que el héroe alcance un nuevo nivel de poder. Este ciclo agota su efecto rápidamente y destruye cualquier noción de techo. Si el segundo villano es diez veces más fuerte que el primero, el décimo es absurdo.

### Magia culturalmente genérica
Un sistema de magia que podría existir en cualquier mundo, sin conexión con la historia, la cultura o los temas específicos del proyecto. La magia genérica (bolas de fuego, escudos de energía, teletransportación) no aporta identidad al mundo.

### El manual de usuario dentro de la historia
Secuencias donde un mentor explica las reglas de la magia con la exhaustividad de un manual técnico. Las reglas deben aprenderse viendo la magia en acción y sus consecuencias, no escuchando una clase magistral.

### Inconsistencia de poder entre escenas
Un personaje que en una escena tiene dificultad para mover una roca y en otra destruye un edificio, sin explicación de qué cambió. Las fluctuaciones de poder no justificadas destruyen la credibilidad del sistema.

---

## Criterios de Calidad

Un sistema de magia cumple con el estándar cuando:

1. **Test del dilema**: La magia crea situaciones donde usarla tiene un costo real, generando decisiones difíciles para los personajes. Si usar magia nunca implica un sacrificio, el sistema ha fallado.

2. **Test de la solución anticipable**: En un sistema de magia dura, un espectador atento puede predecir cómo la magia podría resolver un problema ANTES de que suceda en pantalla. La solución se siente ganada, no regalada.

3. **Test del misterio preservado**: En un sistema de magia blanda, la magia conserva su capacidad de generar asombro y nunca se reduce a una herramienta utilitaria. La magia blanda que pierde su misterio ha perdido su razón de ser.

4. **Test temático**: El sistema de magia puede articularse como metáfora de un tema central de la historia. "La magia de este mundo funciona como..." debería completarse con algo que conecte con el mensaje de la obra.

5. **Test de coherencia retroactiva**: Puedo revisar cada uso de magia en la historia y verificar que respeta las reglas establecidas. No hay excepciones convenientes ni contradicciones.

6. **Test del mundo sin héroe**: Si el protagonista no existiera, el sistema de magia seguiría funcionando igual en el mundo. La magia pertenece al mundo, no al arco del personaje principal.

7. **Test de la alternativa mundana**: Para cada problema que la magia resuelve, existe una razón clara de por qué la solución no mágica no era viable. La magia no reemplaza la inteligencia ni el esfuerzo de los personajes; los complementa.', 'system')
  ('Tecnología — Worldbuilding tecnológico', ARRAY['craft:worldbuilding'], '#AB47BC', '# Tecnología y Su Impacto Social

## Propósito

Este documento establece los principios para diseñar el nivel tecnológico de un mundo ficticio y, más importante aún, las consecuencias sociales de esa tecnología. La tecnología en worldbuilding no es un catálogo de inventos: es una fuerza que moldea sociedades, crea nuevas formas de desigualdad, transforma la vida cotidiana y genera preguntas que los personajes deben enfrentar. Cada decisión tecnológica es una decisión sobre el tipo de mundo que estamos construyendo.

---

## Principios Fundamentales

### 1. La tecnología es una respuesta a una necesidad
Antes de decidir qué tecnología existe en el mundo, hay que preguntar: ¿qué problema resuelve? La tecnología no aparece porque es posible, sino porque alguien la necesitó y tuvo los recursos para crearla. Entender la necesidad que originó una tecnología revela la historia del mundo.

### 2. Toda tecnología tiene efectos de segundo orden
El automóvil no solo reemplazó al caballo: creó suburbios, transformó el urbanismo, generó industrias petroleras, cambió las relaciones sociales, redefinió la adolescencia. En ficción, toda tecnología significativa debe tener al menos un efecto que sus creadores no anticiparon y que transforma la sociedad de formas inesperadas.

### 3. La tecnología redistribuye el poder
Cada nueva tecnología beneficia a algunos y perjudica a otros. La imprenta empoderó a los letrados y debilitó a quienes controlaban la información oral. Las armas de fuego democratizaron la violencia. ¿Quién gana y quién pierde con cada tecnología de tu mundo? Esta pregunta es narrativamente esencial.

### 4. El nivel tecnológico debe ser internamente coherente
Si un mundo tiene navegación intercontinental, probablemente tiene cartografía avanzada, metalurgia sofisticada, conocimiento astronómico y una economía que justifica el riesgo de la exploración. Las tecnologías no existen en aislamiento: forman ecosistemas donde unas habilitan a otras.

### 5. El anacronismo intencional es una herramienta; el accidental es un error
Mezclar niveles tecnológicos de distintas eras puede ser una decisión estética poderosa (steampunk, retrofuturismo, solarpunk) si se hace con intención y consistencia. Pero un mundo medieval con anteojos de sol y sin justificación es un descuido que rompe la inmersión.

### 6. La tecnología como metáfora amplifica los temas
Las mejores tecnologías ficticias funcionan simultáneamente como elemento del mundo y como metáfora de un tema. Una tecnología que permite leer mentes es también una exploración de la privacidad. Una tecnología que extiende la vida es también una exploración de qué significa ser mortal. La doble lectura enriquece la obra.

### 7. La vida cotidiana revela la tecnología mejor que la batalla
Cómo la gente cocina, se comunica, viaja, se entretiene, trabaja y cuida su salud dice más sobre el nivel tecnológico de un mundo que cualquier arma o máquina de guerra. La tecnología militar es espectacular; la tecnología doméstica es reveladora.

### 8. La resistencia a la tecnología es tan narrativa como la adopción
No todos adoptan la nueva tecnología con entusiasmo. Hay luditas, escépticos, comunidades que eligen rechazar ciertos avances, élites que restringen el acceso. La tensión entre adoptantes y resistentes es una fuente rica de conflicto.

### 9. La estética tecnológica comunica la filosofía del mundo
El aspecto de la tecnología — orgánica vs. mecánica, limpia vs. sucia, visible vs. oculta, artesanal vs. industrial — comunica valores. Un mundo donde la tecnología es orgánica y viva tiene una relación con la naturaleza fundamentalmente distinta a uno donde es metálica e industrial. En animación, esta decisión estética es narrativa pura.

### 10. La tecnología perdida es tan interesante como la existente
Tecnologías que existieron y se perdieron (por catástrofe, por decisión, por olvido) crean misterio, nostalgia y la posibilidad de redescubrimiento. La pérdida tecnológica implica que el progreso no es lineal y que las civilizaciones pueden retroceder.

---

## Checklist de Creación

Antes de dar por terminado el nivel tecnológico de un mundo, todo agente debe responder:

- [ ] ¿Cuál es la tecnología más avanzada de este mundo y qué necesidad la originó?
- [ ] ¿He verificado la coherencia interna del ecosistema tecnológico? (¿Las tecnologías que existen son compatibles entre sí y con el nivel de desarrollo general?)
- [ ] ¿He definido al menos un efecto social no intencionado de la tecnología principal?
- [ ] ¿Quién tiene acceso a la tecnología más importante y quién no? ¿Cómo afecta eso la estructura de poder?
- [ ] ¿He diseñado la vida cotidiana alrededor de este nivel tecnológico? (Comunicación, transporte, alimentación, salud, trabajo.)
- [ ] ¿Hay grupos que rechazan o resisten alguna tecnología? ¿Por qué?
- [ ] ¿Los anacronismos que existen son intencionales y consistentes?
- [ ] ¿La estética visual de la tecnología comunica algo sobre los valores del mundo?
- [ ] ¿Existe tecnología perdida u olvidada? Si es así, ¿qué pasó y qué implicaciones tiene?
- [ ] ¿He considerado qué tecnologías específicamente NO existen en este mundo, y cómo su ausencia moldea la sociedad?
- [ ] ¿La tecnología conecta temáticamente con los conflictos centrales de la historia?
- [ ] ¿He evitado el fetichismo tecnológico (presentar la tecnología como inherentemente buena o inherentemente mala)?

---

## Errores Comunes

### La tecnología decorativa
Incluir gadgets y máquinas que se ven interesantes pero no afectan cómo vive la gente. Si el mundo tiene teletransportación pero los personajes viven exactamente como si no existiera, la tecnología es un adorno sin función narrativa.

### El inventor genio aislado
Un personaje que solo, sin infraestructura, sin conocimiento previo de otros y sin recursos industriales, crea tecnología que transforma el mundo. La innovación real es acumulativa y social. El genio solitario que inventa todo desde cero es un mito que debilita la verosimilitud.

### La tecnología sin consecuencias sociales
Introducir una tecnología poderosa sin explorar cómo cambió la sociedad. Si existe la curación mágica instantánea, ¿qué pasa con los médicos, los hospitales, la demografía, la estructura de las guerras, la valoración de la vida? Cada tecnología poderosa necesita un análisis de impacto social.

### El retrofuturismo accidental
Mezclar niveles tecnológicos sin intención estética ni justificación narrativa. Espadas láser junto a pergaminos sin explicar por qué coexisten. El retrofuturismo funciona cuando es una decisión consciente con reglas propias.

### La tecnología como solución final
Presentar un avance tecnológico como la solución definitiva a todos los problemas del mundo. La tecnología resuelve problemas específicos y crea otros nuevos. La utopía tecnológica es narrativamente estéril; la ambivalencia tecnológica es fértil.

### Determinismo tecnológico
Asumir que la tecnología por sí sola determina la dirección de una sociedad. Las sociedades moldean la tecnología tanto como la tecnología moldea a las sociedades. La misma tecnología puede usarse de formas radicalmente distintas según el contexto cultural, político y económico.

### El vacío entre élite y pueblo
Crear una élite con tecnología avanzadísima y un pueblo con tecnología primitiva sin explicar por qué la tecnología no se ha filtrado hacia abajo o por qué la élite puede mantener ese monopolio. La brecha tecnológica necesita mecanismos activos de mantenimiento.

### Tecnología sin estética
Diseñar tecnología sin pensar en su aspecto, textura, sonido y sensación. En animación especialmente, la tecnología es un elemento visual primario. Un mundo donde toda la tecnología se ve igual (pantallas brillantes y superficies lisas) ha desperdiciado una oportunidad de diseño.

---

## Criterios de Calidad

El nivel tecnológico de un mundo cumple con el estándar cuando:

1. **Test de la vida cotidiana**: Puedo describir cómo una persona común empieza su día, se comunica, trabaja y come, y esa descripción se siente distinta a la nuestra gracias al nivel tecnológico específico de ese mundo. La tecnología no es solo armas y vehículos: es la textura completa de la vida.

2. **Test del ecosistema**: Las tecnologías del mundo forman un sistema coherente donde unas habilitan a otras. No hay tecnologías huérfanas que existen sin las tecnologías previas que las harían posibles.

3. **Test del impacto social**: Para cada tecnología significativa, puedo identificar al menos un cambio social que provocó, un grupo que se benefició y un grupo que se perjudicó. La tecnología no es neutral.

4. **Test de la ausencia**: He definido tecnologías que específicamente NO existen en este mundo, y su ausencia moldea la sociedad de formas identificables. Lo que el mundo no tiene es tan definitorio como lo que tiene.

5. **Test estético**: La tecnología del mundo tiene una identidad visual consistente y distinta que comunica los valores y la filosofía de la sociedad. Puedo reconocer la tecnología de este mundo a simple vista y distinguirla de la de otros mundos.

6. **Test de la ambivalencia**: La tecnología del mundo no es presentada como puramente buena ni puramente mala. Tiene beneficios claros y costos reales. Los personajes tienen opiniones distintas sobre ella, y todas son comprensibles.

7. **Test de la necesidad**: Puedo explicar por qué cada tecnología importante fue desarrollada: qué problema resolvía, quién la necesitaba, qué circunstancias la hicieron posible. La tecnología no existe porque sí; existe porque alguien la necesitó lo suficiente como para crearla.', 'system')
  ('Franquicias — Expansión de universo', ARRAY['craft:branding'], '#4A8FE8', '# Franquicias — Extensibilidad y Universo Expandido

> Una franquicia no es una serie con merchandising — es un universo lo suficientemente rico como para sostener múltiples historias, formatos y experiencias. La mejor franquicia se construye desde el primer episodio, no se añade después del éxito.

---

## Principios Fundamentales

1. **El universo es más grande que la historia.** La serie cuenta UNA historia dentro de un mundo que tiene espacio para muchas más. Si el mundo solo puede sostener una trama, no es una franquicia — es una miniserie.

2. **Los personajes son el ancla.** Las franquicias más valiosas se construyen sobre personajes icónicos, no sobre tramas. Las tramas se agotan; los personajes perduran.

3. **Diseña para expandir, no para cerrar.** Cada historia debe ser satisfactoria por sí misma, pero el mundo debe dejar "puertas abiertas" — lugares no explorados, historias no contadas, misterios no resueltos.

4. **La consistencia construye confianza.** Cada nueva historia en la franquicia debe sentirse parte del mismo mundo. Las reglas, el tono y la estética deben ser reconociblemente del mismo universo.

5. **Múltiples puntos de entrada.** Una franquicia sana permite que un nuevo espectador entre desde diferentes puntos — la serie principal, un spin-off, un juego, un cómic — sin necesitar haber consumido todo lo anterior.

6. **La longevidad requiere renovación.** Las franquicias que duran décadas lo hacen porque se reinventan manteniendo su esencia. El mundo evoluciona, los personajes cambian, pero el ADN permanece.

7. **El lore se dosifica.** Un universo con mucha historia detrás no necesita explicarla toda de golpe. La revelación gradual del lore mantiene al público enganchado temporada tras temporada.

8. **Cross-media amplifica.** La franquicia ideal vive en múltiples medios — serie, cómic, juego, experiencia — y cada medio aporta algo que los otros no pueden.

---

## Checklist de Creación

- [ ] ¿El mundo tiene espacio para al menos 3 historias diferentes además de la principal?
- [ ] ¿Hay personajes secundarios con potencial para spin-offs propios?
- [ ] ¿El lore del mundo tiene capas que se pueden revelar progresivamente?
- [ ] ¿La serie tiene un "elevator pitch" de 10 segundos que genera curiosidad?
- [ ] ¿El tono y las reglas son lo suficientemente definidos como para mantener consistencia en expansiones?
- [ ] ¿Un espectador nuevo podría engancharse sin haber visto todo lo anterior?
- [ ] ¿El concepto tiene potencial para adaptarse a otros medios (juegos, cómics, experiencias)?
- [ ] ¿El universo puede evolucionar sin perder su identidad esencial?

---

## Errores Comunes

- **Pensar en franquicia antes que en historia.** Si la primera historia no funciona por sí sola, no habrá franquicia.
- **Sobre-expandir demasiado pronto.** Lanzar spin-offs y expansiones antes de que la serie principal haya establecido su audiencia.
- **Cerrar demasiado el mundo.** Una historia que resuelve TODO no deja espacio para expandir.
- **Inconsistencia entre expansiones.** Reglas que cambian entre la serie y el spin-off — rompe la confianza.
- **Dependencia de un solo personaje.** Si la franquicia solo funciona con un personaje, es frágil.
- **Forzar conexiones.** Que cada spin-off necesite de los otros para tener sentido — eso limita la accesibilidad.

---

## Criterios de Calidad

- El mundo se siente más grande que lo que la serie muestra.
- Los fans especulan naturalmente sobre historias no contadas del universo.
- El concepto de la serie se explica en una frase y genera interés inmediato.
- Los personajes son lo suficientemente fuertes como para sostener historias fuera de la trama principal.
- La estética del universo es reconocible y consistente.
- Hay un balance entre historias cerradas (satisfacción) y misterios abiertos (curiosidad).', 'system')
  ('Licencias — Estrategia de IP', ARRAY['craft:branding'], '#4A8FE8', '# Licencias — Protección y Expansión de IP

> La propiedad intelectual es el activo más valioso del estudio a largo plazo. Una buena estrategia de licencias protege la IP, genera ingresos diversificados y amplifica el alcance de la marca sin diluir su calidad.

---

## Principios Fundamentales

1. **La IP es el activo principal.** Las series se producen una vez; la IP genera valor durante décadas. Proteger y gestionar la propiedad intelectual es una función estratégica del estudio, no un trámite legal.

2. **Calidad sobre volumen.** Es mejor tener pocas licencias de alta calidad que muchas licencias de baja calidad. Un producto malo con tu marca daña más de lo que varias licencias buenas construyen.

3. **Control creativo no es negociable.** Toda licencia debe incluir cláusulas de aprobación creativa. Si un licenciatario puede producir lo que quiera con tu marca sin aprobación, has perdido el control de tu identidad.

4. **Cada licencia debe aportar valor bidireccional.** La licencia no solo genera dinero — debe amplificar la marca, llegar a nuevas audiencias o crear experiencias que la serie por sí sola no puede ofrecer.

5. **La exclusividad tiene precio.** Las licencias exclusivas limitan opciones futuras. Solo se otorgan cuando el valor es significativamente mayor que las alternativas no exclusivas.

6. **Los territorios importan.** Lo que funciona en un mercado no funciona en todos. La estrategia de licencias debe considerar diferencias culturales, regulatorias y de mercado.

7. **El timing es estrategia.** Las licencias se lanzan en sincronía con la serie — no demasiado temprano (sin audiencia) ni demasiado tarde (momentum perdido).

8. **Documentar todo.** Cada acuerdo, cada aprobación, cada guía de estilo — la documentación es la defensa contra el mal uso de la IP.

---

## Tipos de Licencia

| Tipo | Descripción | Consideraciones |
|------|-------------|-----------------|
| **Producto** | Juguetes, ropa, accesorios | Control de calidad crítico. Test de mercado recomendado. |
| **Editorial** | Libros, cómics, revistas | Requiere guías de personaje detalladas. Puede expandir el canon. |
| **Digital** | Apps, juegos móviles, juegos de consola | Alto potencial de engagement. Requiere supervisión de gameplay y tono. |
| **Experiencias** | Parques temáticos, pop-ups, eventos | Mayor impacto de marca. Alto costo de producción. |
| **Media** | Adaptaciones, doblajes, distribución | Control de calidad en adaptación es crucial. |
| **Promocional** | Colaboraciones de marca, ediciones limitadas | Selección cuidadosa de partners alineados con valores de marca. |

---

## Checklist de Creación

- [ ] ¿La IP está debidamente registrada y protegida (marcas, derechos de autor)?
- [ ] ¿Existe una guía de estilo (brand guide) disponible para licenciatarios?
- [ ] ¿Los contratos incluyen cláusulas de aprobación creativa?
- [ ] ¿Se ha evaluado el mercado potencial para cada categoría de licencia?
- [ ] ¿Hay un proceso claro de aprobación de productos licenciados?
- [ ] ¿El timing de licencias está sincronizado con el calendario de la serie?
- [ ] ¿Se han definido los límites de lo que la marca NO haría (anti-brand)?
- [ ] ¿Los acuerdos incluyen métricas de rendimiento y cláusulas de terminación?

---

## Errores Comunes

- **Licenciar demasiado temprano.** Antes de que la serie tenga audiencia — genera productos que nadie compra y asocia la marca con el fracaso.
- **Perder control creativo.** Licenciatarios que producen contenido de baja calidad que daña la percepción de la marca.
- **Sobre-licenciar.** La marca aparece en tantos productos de tan diversa calidad que pierde exclusividad y valor percibido.
- **Ignorar mercados internacionales.** Tratar todos los mercados igual cuando cada uno tiene sus propias dinámicas.
- **No documentar la guía de estilo.** Licenciatarios que interpretan la marca a su manera por falta de guías claras.
- **Licencias reactivas.** Esperar a que lleguen las ofertas en vez de buscar proactivamente las asociaciones correctas.
- **Exclusividad regalada.** Dar exclusividad sin compensación proporcional al valor limitado.

---

## Criterios de Calidad

- Todos los productos licenciados pasan por aprobación creativa y se alinean con la identidad de marca.
- Las licencias amplifican el alcance de la marca sin diluir su percepción de calidad.
- Hay diversificación de ingresos más allá de la distribución de la serie.
- La IP está protegida en los territorios relevantes.
- Los partners licenciatarios son seleccionados por alineación con los valores del estudio, no solo por oferta económica.
- La estrategia de licencias está integrada con el calendario de producción y lanzamiento.', 'system')
  ('Merchandising — Extensión de marca', ARRAY['craft:branding'], '#4A8FE8', '# Merchandising — Diseño para Producto

> El mejor merchandising no se "añade" a una serie — nace orgánicamente de diseños que son icónicos, simplificables y deseables. Si un personaje está bien diseñado para la historia, estará bien diseñado para productos. Pero nunca se sacrifica la historia por el producto.

---

## Principios Fundamentales

1. **La historia primero, siempre.** El merchandising es consecuencia de un buen diseño, no el objetivo del diseño. Un personaje diseñado para vender juguetes se siente comercial; un personaje diseñado para contar historias que además se vende bien se siente auténtico.

2. **La iconicidad es merchandisable.** Un diseño icónico — reconocible, simple, memorable — funciona tanto en pantalla como en producto. Trabaja en la iconicidad del diseño y el merchandising se resuelve solo.

3. **La silueta es el test de producto.** Si el personaje funciona como silueta, funcionará como juguete, pin, camiseta, sticker. La silueta es el mínimo común denominador del diseño.

4. **El color crea reconocimiento de marca.** Una paleta de color consistente y distintiva hace que los productos de la serie sean reconocibles al instante en una estantería.

5. **Los objetos icónicos venden.** Un arma memorable, un vehículo único, un accesorio distintivo — los objetos de la serie son productos naturales si están bien diseñados.

6. **Simplificable no significa simple.** Un diseño complejo que puede reducirse a una versión simplificada (para chibi, para ícono, para bordado) es más versátil que uno que solo funciona en alta resolución.

7. **El appeal emocional vende.** El público compra productos de personajes que ama, no de personajes que se ven bien. El appeal del merchandising se construye en la historia, no en el diseño industrial.

8. **La variedad de elenco es variedad de producto.** Un elenco con personajes de diferentes tamaños, colores, formas y personalidades genera una línea de productos más diversa y atractiva.

---

## Checklist de Creación

- [ ] ¿Los personajes principales tienen diseños que funcionan como siluetas simples?
- [ ] ¿La paleta de color de la serie es distintiva y reconocible?
- [ ] ¿Hay objetos icónicos en la serie (armas, vehículos, accesorios) con buen diseño?
- [ ] ¿Los diseños se pueden simplificar (chibi, ícono, flat) sin perder reconocibilidad?
- [ ] ¿El elenco ofrece variedad de formas, tamaños y colores?
- [ ] ¿Los personajes generan conexión emocional con la audiencia (prerequisito del deseo de compra)?
- [ ] ¿Los diseños funcionan en diferentes escalas (poster grande, pin pequeño)?
- [ ] ¿Hay elementos visuales recurrentes que podrían funcionar como branding (logos, símbolos, patrones)?

---

## Errores Comunes

- **Diseñar para el producto primero.** Crear personajes pensando en el juguete antes que en la historia — el público lo detecta.
- **Complejidad inmanejable.** Diseños con tanto detalle que no se pueden reproducir en producto sin perder la esencia.
- **Elenco homogéneo.** Personajes que se parecen demasiado = productos que se parecen demasiado = ventas concentradas en 1-2 personajes.
- **Sin objetos icónicos.** Una serie donde los personajes no tienen objetos o vehículos memorables pierde oportunidades naturales.
- **Forzar el producto en la historia.** Introducir personajes, vehículos o transformaciones solo para vender juguetes — el público lo nota.
- **Ignorar la audiencia adulta.** El merchandising no es solo para niños. Los adultos compran art books, figuras de colección, ropa con diseño sutil.

---

## Criterios de Calidad

- Los diseños de personajes funcionan en al menos 5 formatos (juguete, camiseta, poster, sticker, ícono).
- La serie tiene una identidad visual tan fuerte que un producto sin el logo podría identificarse por el estilo.
- Los fans expresan deseo orgánico de poseer productos de la serie (no se necesita empujar).
- Hay variedad en el catálogo potencial de productos (no solo figuras — también ropa, libros, accesorios).
- El merchandising no ha comprometido ninguna decisión creativa de la serie.', 'system')
) AS t(title, categories, color, content, created_by)
WHERE NOT EXISTS (
  SELECT 1 FROM reference_docs r WHERE r.title = t.title AND r.doc_type = 'craft'
);
