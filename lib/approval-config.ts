export interface SlotMatrixRow {
  view_type: string
  outfit: string | null
  age_versions: string[]
}

export interface EntityDef {
  entity_name: string
  entity_label: string
  // Per-entity accessory overrides. If defined, replaces the generic Accesorio row from SLOT_MATRIX.
  accessories?: string[]
}

export const SLOT_MATRIX: Record<string, SlotMatrixRow[]> = {
  personajes: [
    // ── VISTAS GENERALES (turnabout casual) ──────────────────────────────────
    { view_type: 'Vista general',    outfit: 'Casual',              age_versions: ['Frente', 'Perfil D', 'Perfil I', 'Espalda'] },

    // ── EDADES (junto al canon base) ─────────────────────────────────────────
    { view_type: 'Versión etaria',   outfit: 'Casual',              age_versions: ['Versión infantil'] },

    // ── 3/4 ──────────────────────────────────────────────────────────────────
    { view_type: '3/4',              outfit: 'Casual',              age_versions: ['Izquierda', 'Derecha'] },

    // ── EXPRESIONES ───────────────────────────────────────────────────────────
    { view_type: 'Expresión',        outfit: null, age_versions: ['Neutral', 'Alegría', 'Enojo', 'Tristeza', 'Sorpresa', 'Concentración', 'Miedo', 'Llanto', 'Orgullo'] },

    // ── OUTFIT DEPORTIVO — variantes ──────────────────────────────────────────
    { view_type: 'Outfit deportivo', outfit: 'Uniforme partido',    age_versions: ['Frente', 'Espalda'] },
    { view_type: 'Outfit deportivo', outfit: 'Uniforme entreno',    age_versions: ['Frente', 'Espalda'] },
    { view_type: 'Outfit deportivo', outfit: 'Uniforme alternativo',age_versions: ['Frente'] },
    { view_type: 'Outfit deportivo', outfit: 'Ropa de arco',        age_versions: ['Frente'] },

    // ── POSES DE ACCIÓN ───────────────────────────────────────────────────────
    { view_type: 'Acción',           outfit: 'Uniforme partido',    age_versions: ['Dribling', 'Tiro', 'Celebración', 'Sprint', 'Caída', 'Salto', 'Recepción'] },
    { view_type: 'Acción',           outfit: 'Casual',              age_versions: ['Gesto característico', 'Pose de reposo'] },

    // ── OUTFIT CASUAL — variantes ─────────────────────────────────────────────
    { view_type: 'Outfit casual',    outfit: 'Variante 1',          age_versions: ['Frente'] },
    { view_type: 'Outfit casual',    outfit: 'Variante 2',          age_versions: ['Frente'] },
    { view_type: 'Outfit casual',    outfit: 'Variante 3 (frío)',   age_versions: ['Frente'] },
    { view_type: 'Outfit casual',    outfit: 'Variante 4 (casa)',   age_versions: ['Frente'] },

    // ── ACCESORIOS / ELEMENTOS DEL PERSONAJE ─────────────────────────────────
    { view_type: 'Accesorio',        outfit: null, age_versions: ['Zapatillas (detalle)', 'Collar / colgante', 'Pulsera', 'Mochila', 'Rodillera / vendaje'] },
  ],
  locaciones: [
    // Exterior con variaciones de luz
    { view_type: 'Exterior',          outfit: null, age_versions: ['Día', 'Tarde dorada', 'Atardecer', 'Noche', 'Lluvia', 'Neblina'] },
    // Interior con variaciones de luz
    { view_type: 'Interior',          outfit: null, age_versions: ['Día natural', 'Luz artificial', 'Noche', 'Contraluz ventana'] },
    // Planos específicos
    { view_type: 'Plano general',     outfit: null, age_versions: ['Día', 'Noche'] },
    { view_type: 'Detalle ambiental', outfit: null, age_versions: ['Textura', 'Elemento narrativo', 'Atmosphere shot'] },
    { view_type: 'POV personaje',     outfit: null, age_versions: ['Entrando', 'Desde dentro'] },
  ],
  props: [
    // Vistas básicas
    { view_type: 'Vista frontal',     outfit: null, age_versions: ['Limpio', 'Usado/desgastado'] },
    { view_type: 'Vista lateral',     outfit: null, age_versions: ['v1'] },
    { view_type: 'Vista superior',    outfit: null, age_versions: ['v1'] },
    // Detalles
    { view_type: 'Detalle',           outfit: null, age_versions: ['Textura', 'Logo/marca', 'Elemento clave'] },
    // En uso
    { view_type: 'En contexto',       outfit: null, age_versions: ['En manos personaje', 'En escena', 'Close-up dramático'] },
  ],
  criaturas: [
    { view_type: 'Frente',           outfit: null, age_versions: ['Pose neutral', 'Alerta', 'Agresiva'] },
    { view_type: 'Lateral',          outfit: null, age_versions: ['Caminando', 'Quieto'] },
    { view_type: 'Expresión',        outfit: null, age_versions: ['Neutral', 'Amenazante', 'Curiosa'] },
    { view_type: 'Acción',           outfit: null, age_versions: ['Movimiento característico'] },
    { view_type: 'Escala',           outfit: null, age_versions: ['Junto a personaje humano'] },
  ],
  secundarios: [
    { view_type: 'Frente',           outfit: 'Outfit característico', age_versions: ['v1'] },
    { view_type: '3/4',              outfit: 'Outfit característico', age_versions: ['v1'] },
    { view_type: 'Expresión',        outfit: null, age_versions: ['Neutral', 'Alegría', 'Enojo', 'Sorpresa'] },
    { view_type: 'Acción',           outfit: null, age_versions: ['Momento característico'] },
    { view_type: 'Accesorio',        outfit: null, age_versions: [] }, // age_versions vacío → solo aplica si la entidad define accessories
  ],
  mascotas: [
    { view_type: 'Frente',           outfit: null, age_versions: ['Pose neutral', 'Alerta', 'Feliz'] },
    { view_type: 'Lateral',          outfit: null, age_versions: ['Caminando', 'Quieto'] },
    { view_type: 'Expresión',        outfit: null, age_versions: ['Curioso', 'Asustado', 'Juguetón'] },
    { view_type: 'Acción',           outfit: null, age_versions: ['Corriendo', 'Saltando'] },
  ],
  simbolos: [
    { view_type: 'Ficha técnica',    outfit: null, age_versions: ['v1'] },
  ],
  hawks: [
    // Misma estructura que personajes — son rivales principales con desarrollo de arco propio
    { view_type: 'Vista general',    outfit: 'Uniforme Hawks',          age_versions: ['Frente', 'Perfil D', 'Perfil I', 'Espalda'] },
    { view_type: '3/4',              outfit: 'Uniforme Hawks',          age_versions: ['Izquierda', 'Derecha'] },
    { view_type: 'Expresión',        outfit: null,                      age_versions: ['Neutral', 'Alegría', 'Enojo', 'Tristeza', 'Sorpresa', 'Concentración', 'Miedo', 'Orgullo'] },
    { view_type: 'Outfit deportivo', outfit: 'Uniforme Hawks titular',  age_versions: ['Frente', 'Espalda'] },
    { view_type: 'Outfit deportivo', outfit: 'Uniforme Hawks entreno',  age_versions: ['Frente'] },
    { view_type: 'Acción',           outfit: 'Uniforme Hawks titular',  age_versions: ['Sprint', 'Tiro / acción característica', 'Celebración', 'Caída', 'Salto'] },
    { view_type: 'Outfit casual',    outfit: 'Variante 1',              age_versions: ['Frente'] },
    { view_type: 'Accesorio',        outfit: null,                      age_versions: [] },
  ],
  rivales: [
    // Uniforme titular
    { view_type: 'Uniforme titular', outfit: 'Camiseta',       age_versions: ['Frente', 'Espalda', 'Detalle cuello', 'Detalle número'] },
    { view_type: 'Uniforme titular', outfit: 'Short y medias', age_versions: ['Frente', 'Detalle lateral'] },
    { view_type: 'Conjunto titular', outfit: null,             age_versions: ['Jugador de campo'] },
    // Uniforme arquero
    { view_type: 'Uniforme arquero', outfit: 'Camiseta',       age_versions: ['Frente', 'Espalda'] },
    { view_type: 'Uniforme arquero', outfit: 'Short y medias', age_versions: ['Frente'] },
    { view_type: 'Uniforme arquero', outfit: 'Guantes',        age_versions: ['Detalle'] },
    { view_type: 'Conjunto arquero', outfit: null,             age_versions: ['Vista conjunto'] },
    // Identidad visual
    { view_type: 'Emblema',          outfit: null,             age_versions: ['Limpio sobre fondo', 'Bordado en camiseta'] },
    { view_type: 'Paleta cromática', outfit: null,             age_versions: ['Swatches oficiales'] },
    { view_type: 'Botines',          outfit: null,             age_versions: ['Detalle'] },
  ],
}

export const ENTITIES: Record<string, EntityDef[]> = {
  personajes: [
    {
      entity_name: 'MateoGonzalez', entity_label: 'Mateo González',
      // Collar de cerámica (su objeto más preciado), zapatillas deportivas, cuaderno de cuentas
      accessories: ['Collar / fragmento cerámica', 'Zapatillas (detalle)', 'Cuaderno de cuentas'],
    },
    {
      entity_name: 'KaelSantos', entity_label: 'Kael Santos',
      // Havaianas cuando no entrena, zapatillas deportivas en cancha
      accessories: ['Zapatillas deportivas (detalle)', 'Havaianas / sandalias'],
    },
    {
      entity_name: 'ValentinaRios', entity_label: 'Valentina Ríos',
      // Atado de cintas de raso (archivo íntimo de su historia como bailarina)
      accessories: ['Cintas de raso (atado)', 'Zapatillas de ballet'],
    },
    {
      entity_name: 'ProfesorCasas', entity_label: 'Emilio "Profe" Casas',
      // Reloj analógico de su padre, libreta negra inseparable, lápiz amarillo con el que piensa
      accessories: ['Reloj analógico (herencia)', 'Libreta negra (detalle)', 'Lápiz amarillo', 'Zapatillas deportivas gastadas'],
    },
    {
      entity_name: 'TitoHernandez', entity_label: 'Alberto "Tito" Hernández',
      // Tablet (objeto más reconocible), mochila ultraorganizada, inhalador, cables sueltos
      accessories: ['Tablet (detalle)', 'Mochila (detalle)', 'Inhalador', 'Cables y componentes'],
    },
    // Sin perfil definido aún — accesorios genéricos del SLOT_MATRIX
    { entity_name: 'LucasWong',        entity_label: 'Lucas Wong' },
    { entity_name: 'SofiaLuna',        entity_label: 'Sofía Luna' },
    { entity_name: 'DiegoSalvatierra', entity_label: 'Diego Salvatierra' },
    { entity_name: 'NicoAquino',       entity_label: 'Nico Aquino' },
  ],
  locaciones: [
    { entity_name: 'CasaProdigio',        entity_label: 'Casa Prodigio' },
    { entity_name: 'CanchaEntrenamiento', entity_label: 'Cancha de Entrenamiento' },
    { entity_name: 'CanchaBarrio',        entity_label: 'Cancha del Barrio' },
    { entity_name: 'EstadioGrande',       entity_label: 'Estadio Principal' },
    { entity_name: 'VestuarioEquipo',     entity_label: 'Vestuario del Equipo' },
    { entity_name: 'ColegioBarrio',       entity_label: 'Colegio / Escuela' },
    { entity_name: 'CafetinCancha',       entity_label: 'Cafetín de la Cancha' },
    { entity_name: 'OficinaFederacion',   entity_label: 'Oficina de la Federación' },
    { entity_name: 'BarrioMateo',         entity_label: 'Barrio de Mateo (calle)' },
    { entity_name: 'CentroComercial',     entity_label: 'Centro Comercial' },
  ],
  props: [
    { entity_name: 'ElLlamado',            entity_label: 'El Llamado (carta)' },
    { entity_name: 'FragmentoCeramica',    entity_label: 'Fragmento de cerámica de Mateo' },
    { entity_name: 'BalonOficial',         entity_label: 'Balón Oficial del Equipo' },
    { entity_name: 'CamisetaProdigios',    entity_label: 'Camiseta Los Prodigios' },
    { entity_name: 'EscudoEquipo',         entity_label: 'Escudo del Equipo' },
    { entity_name: 'TrofeoTorneo',         entity_label: 'Trofeo del Torneo' },
    { entity_name: 'MochilaMate',          entity_label: 'Mochila de Mateo' },
  ],
  criaturas: [
    { entity_name: 'BitMascota', entity_label: 'Bit — Mascota Oficial' },
  ],
  secundarios: [
    { entity_name: 'MadreMateo',       entity_label: 'Mamá de Mateo' },
    { entity_name: 'PadreKael',        entity_label: 'Papá de Kael' },
    { entity_name: 'EntrenadorRival',  entity_label: 'Entrenador Rival (genérico)' },
    { entity_name: 'Arbitro',          entity_label: 'Árbitro de Partido' },
    { entity_name: 'ComentaristaUno',  entity_label: 'Comentarista A' },
    { entity_name: 'ComentaristaDos',  entity_label: 'Comentarista B' },
    { entity_name: 'HinchaRival',      entity_label: 'Hincha Rival' },
    { entity_name: 'VendedorEstadio',  entity_label: 'Vendedor del Estadio' },
    { entity_name: 'DirectorColegio',  entity_label: 'Director del Colegio' },
    { entity_name: 'CompañeroA',       entity_label: 'Compañero de Equipo A' },
    { entity_name: 'CompañeroB',       entity_label: 'Compañero de Equipo B' },
    { entity_name: 'CompañeroC',       entity_label: 'Compañero de Equipo C' },
  ],
  hawks: [
    { entity_name: 'HawksFC',               entity_label: 'Hawks FC — Identidad Visual' },
    { entity_name: 'HawksRafaelMontoya',   entity_label: 'Rafael Montoya' },
    { entity_name: 'HawksMaxNavarro',       entity_label: 'Max Navarro' },
    { entity_name: 'HawksMatasCastillo',    entity_label: 'Matías Castillo' },
    { entity_name: 'HawksHoracioRomero',    entity_label: 'Horacio Romero' },
    { entity_name: 'HawksRenataVargas',     entity_label: 'Renata Vargas' },
    {
      entity_name: 'HawksAlfonsoNavarro',   entity_label: 'Alfonso Navarro',
      accessories: ['Guantes de arquero (detalle)'],
    },
    { entity_name: 'HawksCamilaMendoza',    entity_label: 'Camila Mendoza' },
    {
      entity_name: 'HawksSebastianMontoya', entity_label: 'Sebastián Montoya (DT)',
      accessories: ['Pin emblema Hawks (detalle)', 'Colleras doradas (detalle)'],
    },
  ],
  mascotas: [
    { entity_name: 'PerroCancha',   entity_label: 'El Perro de la Cancha' },
    { entity_name: 'GatoBarrio',    entity_label: 'El Gato del Barrio' },
  ],
  rivales: [
    // Equipos rivales de temporadas futuras se agregan aquí
  ],
  simbolos: [
    // ── NUEVA CORONA ──────────────────────────────────────────────────────────
    { entity_name: 'LPS01_NuevaCorna_Bandera',          entity_label: 'LP-S01 — Nueva Corona: Bandera Nacional' },
    { entity_name: 'LPS02_NuevaCorona_Corona11',        entity_label: 'LP-S02 — Nueva Corona: Corona de 11 Estrellas' },
    { entity_name: 'LPS03_NuevaCorona_Urbano',          entity_label: 'LP-S03 — Nueva Corona: Aplicaciones Urbanas' },
    // ── PRODIGIOS EMBLEMAS ────────────────────────────────────────────────────
    { entity_name: 'LPS04_EmblemaAspirante_Limpio',     entity_label: 'LP-S04 — Emblema Aspirante Prodigio (limpio)' },
    { entity_name: 'LPS05_EmblemaOficial_Limpio',       entity_label: 'LP-S05 — Emblema Oficial Prodigio (limpio)' },
    { entity_name: 'LPS06_EmblemaAspirante_Bordado',    entity_label: 'LP-S06 — Emblema Aspirante Prodigio (bordado)' },
    { entity_name: 'LPS07_EmblemaOficial_Bordado',      entity_label: 'LP-S07 — Emblema Oficial Prodigio (bordado)' },
    // ── EL LLAMADO ────────────────────────────────────────────────────────────
    { entity_name: 'LPS08_Llamado_CartaSobre',          entity_label: 'LP-S08 — El Llamado: Carta y Sobre' },
    { entity_name: 'LPS09_Llamado_CajaInstitucional',   entity_label: 'LP-S09 — El Llamado: La Caja Institucional' },
    { entity_name: 'LPS10_Llamado_CajaApertura',        entity_label: 'LP-S10 — El Llamado: Caja — Primera Apertura' },
    { entity_name: 'LPS11_Llamado_CajaLayout',          entity_label: 'LP-S11 — El Llamado: Caja — Layout de Elementos' },
    { entity_name: 'LPS12_Llamado_CuadernoRuta',        entity_label: 'LP-S12 — El Llamado: Cuaderno de Ruta' },
    { entity_name: 'LPS13_Llamado_MapaNuevaCorona',     entity_label: 'LP-S13 — El Llamado: Mapa de Nueva Corona' },
    { entity_name: 'LPS14_Llamado_MonedaConmem',        entity_label: 'LP-S14 — El Llamado: Moneda Conmemorativa' },
    { entity_name: 'LPS15_Llamado_TarjetaProvisional',  entity_label: 'LP-S15 — El Llamado: Tarjeta de Acceso Provisional' },
    { entity_name: 'LPS16_TarjetaPermanente',           entity_label: 'LP-S16 — Tarjeta de Acceso Permanente' },
    // ── TARJETAS DE ACCESO ────────────────────────────────────────────────────
    { entity_name: 'LPS17_TarjetaMentor',               entity_label: 'LP-S17 — Tarjeta de Acceso: Mentor' },
    { entity_name: 'LPS18_TarjetaObservador',           entity_label: 'LP-S18 — Tarjeta de Acceso: Observador' },
    { entity_name: 'LPS19_TarjetaConsejoC',             entity_label: 'LP-S19 — Tarjeta de Acceso: Consejo Central' },
    // ── CONSEJO CENTRAL ───────────────────────────────────────────────────────
    { entity_name: 'LPS20_ConsejoCentral_Sello',        entity_label: 'LP-S20 — Consejo Central: Sello Oficial' },
    { entity_name: 'LPS21_ConsejoCentral_Libro',        entity_label: 'LP-S21 — Consejo Central: El Libro del Legado' },
    { entity_name: 'LPS22_ConsejoCentral_Baston',       entity_label: 'LP-S22 — Consejo Central: El Bastón del Consejo' },
    { entity_name: 'LPS23_ConsejoCentral_Antorcha',     entity_label: 'LP-S23 — Consejo Central: La Antorcha del Legado' },
    { entity_name: 'LPS24_ConsejoCentral_Llave',        entity_label: 'LP-S24 — Consejo Central: La Llave de Federación' },
    { entity_name: 'LPS25_ConsejoCentral_Cinta',        entity_label: 'LP-S25 — Consejo Central: Cinta del Compromiso' },
    { entity_name: 'LPS26_ConsejoCentral_Diploma',      entity_label: 'LP-S26 — Consejo Central: Diploma de Graduación' },
    { entity_name: 'LPS27_ConsejoCentral_Medalla',      entity_label: 'LP-S27 — Consejo Central: La Medalla del Mentor' },
    { entity_name: 'LPS28_ConsejoCentral_Martillo',     entity_label: 'LP-S28 — Consejo Central: El Martillo de Apertura' },
    // ── UNIFORMES OFICIALES ───────────────────────────────────────────────────
    { entity_name: 'LPS29_UniformeOficialMasc',         entity_label: 'LP-S29 — Uniforme Oficial Masculino' },
    { entity_name: 'LPS30_UniformeOficialFem',          entity_label: 'LP-S30 — Uniforme Oficial Femenino' },
    { entity_name: 'LPS31_UniformeOficialArquero',      entity_label: 'LP-S31 — Uniforme Oficial Arquero' },
  ],
}

// Genera el version_label legible para un slot
export function makeVersionLabel(view_type: string, outfit: string | null, age_version: string): string {
  const parts = [
    view_type,
    outfit ?? null,
    age_version,
  ].filter(Boolean)
  return parts.join(' · ')
}

// Genera el nombre de archivo canónico para un asset aprobado
export function makeApprovedFileName(
  entity_name: string,
  view_type: string,
  outfit: string | null,
  age_version: string,
  index: number
): string {
  const parts = [
    entity_name,
    view_type.replace(/[/\s]/g, '_'),
    outfit ?? '',
    age_version.replace(/\s/g, '_'),
    String(index).padStart(3, '0'),
  ].filter(Boolean)
  return parts.join('_') + '.jpg'
}

// Revisores autorizados (email → nombre)
export const REVIEWERS: Record<string, string> = {
  'pabloqandres@gmail.com': 'Pablo',
  'trinidadcarmonaaldunate@gmail.com': 'Trinidad',
}

export const REVIEWER_COLORS: Record<string, string> = {
  Pablo:    '#F5A52A',
  Trinidad: '#4ECDC4',
}

export const CATEGORY_LABELS: Record<string, string> = {
  personajes:  'Personajes Principales',
  locaciones:  'Locaciones',
  props:       'Props & Objetos',
  criaturas:   'Criaturas',
  secundarios: 'Personajes Secundarios',
  mascotas:    'Mascotas & Animales',
  simbolos:    'Símbolos & Gráfica Oficial',
  rivales:     'Equipos Rivales',
  hawks:       'Equipo Contrincante — Hawks',
}

export const CATEGORY_ORDER = ['personajes', 'hawks', 'locaciones', 'props', 'criaturas', 'secundarios', 'mascotas', 'simbolos']
// 'rivales' se reactiva cuando se agreguen equipos rivales de temporadas futuras
