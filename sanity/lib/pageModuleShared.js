/**
 * Valores de referencia para el preview de Studio (pageModule).
 * No afecta al front: solo aproximación editorial para títulos por defecto de cada bloque.
 */
export const MODULE_LIST = [
  {value: 'hero', title: 'Hero'},
  {value: 'highlights', title: 'Highlights (stats bar)'},
  {value: 'internalNav', title: 'Internal navigation'},
  {value: 'overview', title: 'Overview (sobre el programa)'},
  {value: 'itinerary', title: 'Itinerary (día a día)'},
  {value: 'lodge', title: 'Lodge / alojamiento'},
  {value: 'wildlife', title: 'Wildlife (fauna)'},
  {value: 'includes', title: 'Incluye / no incluye'},
  {value: 'tech', title: 'Tech / pack de tecnología'},
  {value: 'media', title: 'Media (galería, vídeo)'},
  {value: 'whenToVisit', title: 'When to visit (mes a mes)'},
  {value: 'beforeYouGo', title: 'Before you go (traveller guide)'},
  {value: 'reviews', title: 'Reviews (reseñas)'},
  {value: 'terms', title: 'Términos y condiciones'},
  {value: 'resources', title: 'Recursos (PDF, descargas)'},
  {value: 'faq', title: 'FAQ'},
  {value: 'related', title: 'Also / otras experiencias'},
  {value: 'reserve', title: 'Book / reservar (CTA final)'},
]

/** Subtítulos cortos para la lista de módulos en el array (Studio). */
export const PREVIEW_LIST_SUBTITLE = {
  overview: 'Fuente: Experiencia',
  itinerary: 'Fuente: Experiencia → itinerario',
  lodge: 'Fuente: Lodge (vía Experiencia)',
  wildlife: 'Fuente: Experiencia / Learning Programme → wildlife',
  includes: 'Fuente: Experiencia → incluye',
  tech: 'Fuente: Producto tech (librería)',
  media: 'Fuente: Experiencia → media',
  whenToVisit: 'Fuente: Experiencia → estacional',
  beforeYouGo: 'Fuente: Experiencia → antes de viajar',
  reviews: 'Fuente: Reseñas (librería) + layout en esta pestaña',
  terms: 'Fuente: Experiencia → términos',
  resources: 'Fuente: Experiencia → recursos',
  faq: 'Fuente: Experiencia → FAQ',
  related: 'Fuente: otras Experiencias (elegir abajo)',
  reserve: 'Fuente: Experiencia + CTAs (hero en esta landing)',
}

export const PREVIEW_SOURCE = {
  overview: 'Contenido: Experiencia (descripción, highlights)',
  itinerary: 'Contenido: Experiencia → Itinerario',
  lodge: 'Contenido: Lodge (vía Experiencia) + reglas del front',
  wildlife: 'Contenido: Experiencia / Learning Programme → wildlife',
  includes: 'Contenido: Experiencia → incluye / no incluye',
  tech: 'Contenido: productos en librería Tech + curación en esta URL',
  media: 'Contenido: Experiencia → galería / vídeo',
  whenToVisit: 'Contenido: Experiencia → mejores meses / estacional',
  beforeYouGo: 'Contenido: Experiencia → requisitos, packing, etc.',
  reviews: 'Contenido: documentos Review + layout de esta URL',
  terms: 'Contenido: Experiencia → términos y cancelación',
  resources: 'Contenido: Experiencia → mapas, brochure, enlaces',
  faq: 'Contenido: Experiencia → preguntas frecuentes',
  related: 'Contenido: otras experiencias (refs) o lista en Experiencia',
  reserve: 'Contenido: Experiencia + CTAs de esta landing',
}

/** Título de sección por defecto aproximado (label del módulo en Studio) si no hay override. */
export function getDefaultSectionTitle(key) {
  const m = MODULE_LIST.find((x) => x.value === key)
  return m ? m.title : '— (elige un bloque)'
}

/**
 * Dónde “vive” el rótulo eyebrow: en CMS de landing solo si override; si no, el sitio/ front.
 * No forzamos texto de eyebrow por defecto aquí (i18n / componente en Next).
 */
export function describeEyebrowSource({hasOverride, keySelected}) {
  if (hasOverride) {
    return {line: 'Landing override (este módulo en esta URL)', kind: 'override'}
  }
  if (!keySelected) {
    return {line: 'Default del sitio: elige un «Bloque» primero', kind: 'default'}
  }
  return {
    line: 'Default del componente (front; no definido en este CMS mientras el campo de abajo esté vacío)',
    kind: 'default',
  }
}

export function describeTitleSource({hasOverride, keySelected}) {
  if (hasOverride) {
    return {line: 'Landing override (este módulo en esta URL)', kind: 'override'}
  }
  if (!keySelected) {
    return {line: 'Default del módulo (elige un bloque para ver el título de referencia)', kind: 'default'}
  }
  return {line: 'Default del módulo (título de referencia en Studio, alineado con el front)', kind: 'default'}
}

export function getContentSourceLine(key) {
  if (!key) return '—'
  return PREVIEW_SOURCE[key] || 'Ver descripción del campo «Bloque».'
}

export function getListSubtitleLine(key) {
  if (!key) return 'Fuente: ver descripción del campo «Bloque»'
  return PREVIEW_LIST_SUBTITLE[key] || 'Fuente: ver descripción del campo «Bloque»'
}

/**
 * `options.section` del preview de Experience page → clave `pageModule.key` en `sectionModules`.
 * (p. ej. pestaña Gallery → módulo `media`)
 */
export const PREVIEW_SECTION_TO_MODULE_KEY = {
  overview: 'overview',
  itinerary: 'itinerary',
  lodge: 'lodge',
  wildlife: 'wildlife',
  includes: 'includes',
  tech: 'tech',
  gallery: 'media',
  when: 'whenToVisit',
  beforeYou: 'beforeYouGo',
  reviews: 'reviews',
  terms: 'terms',
  resources: 'resources',
  faq: 'faq',
  related: 'related',
  reserve: 'reserve',
  structure: null,
  general: null,
  hero: 'hero',
  highlights: 'highlights',
  internalNav: 'internalNav',
}

export function getModuleKeyForPreviewSection(section) {
  if (!section) return null
  return PREVIEW_SECTION_TO_MODULE_KEY[section] ?? null
}
