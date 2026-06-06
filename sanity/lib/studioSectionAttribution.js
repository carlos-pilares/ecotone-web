/**
 * Atribuciones B. Fuente para el Studio. No se importa en el front público.
 */

/**
 * B. Fuente — por clave de `pageModule` (misma que `section` vía mapeo de pestañas).
 */
export const STUDIO_MODULE_SOURCE = {
  overview: {label: 'Experience', path: 'Descripción, highlights'},
  itinerary: {label: 'Experience', path: 'Itinerario (días, pasos)'},
  includes: {label: 'Experience', path: 'Incluye / no incluye'},
  lodge: {label: 'Lodge (vía Experience)', path: 'Ficha vinculada a la experiencia'},
  wildlife: {label: 'Experience / Learning Programme', path: 'Listado wildlife'},
  tech: {label: 'Tech products', path: 'Fichas en librería; orden/curación en esta landing'},
  media: {label: 'Experience', path: 'Galería, vídeo'},
  whenToVisit: {label: 'Experience', path: 'Mejores meses / estacional'},
  beforeYouGo: {label: 'Experience', path: 'Requisitos, packing, llegada'},
  reviews: {label: 'Review (documentos) + layout', path: 'Citas en la librería; qué reseñas en esta URL'},
  terms: {label: 'Experience', path: 'Políticas y términos'},
  resources: {label: 'Experience', path: 'PDF, enlaces'},
  faq: {label: 'Experience', path: 'Preguntas frecuentes'},
  related: {label: 'Otras experiencias (refs) o lista en Experience', path: 'Cards de programa'},
  reserve: {label: 'Experience + front', path: 'Precio, CTAs del bloque reserva (layout en el sitio)'},
}

export function getStudioModuleSourceLine(key) {
  if (!key) return null
  const m = STUDIO_MODULE_SOURCE[key]
  if (!m) {
    return {line: 'Front / componente (definición en código)', sub: '—'}
  }
  return {line: `${m.label} → ${m.path}`, sub: m.label}
}

/**
 * Una sola línea para el bloque de overrides: "Fuente principal: …"
 */
const FUENTE_PRINCIPAL_LINE = {
  overview: 'Experience → overview, highlights',
  itinerary: 'Experience → itinerario',
  includes: 'Experience → includes / not includes',
  lodge: 'Lodge (vía Experience) → ficha',
  wildlife: 'Experience / Learning Programme → wildlife',
  tech: 'Tech products + Experience',
  media: 'Experience → galería, vídeo',
  whenToVisit: 'Experience → mejores meses',
  beforeYouGo: 'Experience → antes de viajar',
  reviews: 'Review (documentos) + layout de esta URL',
  terms: 'Experience → términos',
  resources: 'Experience → recursos, PDFs',
  faq: 'Experience → FAQ',
  related: 'Otras experiencias (refs) o lista en Experience',
  reserve: 'Experience + front (reserva)',
}

/**
 * @param {string|null|undefined} key - pageModule.key
 * @returns {string|null}
 */
export function getPrimarySourceLine(key) {
  if (!key) return null
  return FUENTE_PRINCIPAL_LINE[key] || 'Front (componente default)'
}
