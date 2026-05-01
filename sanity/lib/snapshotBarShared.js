/**
 * Barra bajo el hero (Duration / From Cusco / …): slots canónicos resueltos desde el documento Experience.
 * Solo Studio / schema; el front público no usa este archivo todavía.
 */

/** Opciones para `experiencePageSnapshotStatPick.slot` y previews en Studio. */
export const SNAPSHOT_BAR_SLOT_OPTIONS = [
  {value: 'duration', title: 'Duration — duración del programa'},
  {value: 'distanceFromCusco', title: 'From Cusco — tiempo / distancia'},
  {value: 'altitude', title: 'Altitude — altitud'},
  {value: 'groupSize', title: 'Group size — tamaño de grupo'},
  {value: 'inclusive', title: 'Inclusive — all-inclusive (valor fijo en preview)'},
  {value: 'ecosystem', title: 'Ecosystem — ecosistema'},
]

/** Etiquetas cortas para columna «label» en UI de solo lectura. */
export const SNAPSHOT_BAR_LABELS = {
  duration: 'Duration',
  distanceFromCusco: 'From Cusco',
  altitude: 'Altitude',
  groupSize: 'Group size',
  inclusive: 'Inclusive',
  ecosystem: 'Ecosystem',
}

/**
 * Resuelve value + label mostrados para un slot desde el payload Experiencia (preview Studio).
 * @param {Record<string, unknown> | null | undefined} experience
 * @param {string} slot
 */
export function resolveSnapshotStatPreview(experience, slot) {
  if (!experience || !slot) {
    return {value: '—', label: '—'}
  }
  switch (slot) {
    case 'duration':
      return {
        value: experience.duration ? String(experience.duration) : '—',
        label: SNAPSHOT_BAR_LABELS.duration,
      }
    case 'distanceFromCusco':
      return {
        value: experience.distanceFromCusco ? String(experience.distanceFromCusco) : '—',
        label: SNAPSHOT_BAR_LABELS.distanceFromCusco,
      }
    case 'altitude':
      return {
        value: experience.altitude ? String(experience.altitude) : '—',
        label: SNAPSHOT_BAR_LABELS.altitude,
      }
    case 'groupSize': {
      const max = experience.groupSizeMax
      return {
        value: max != null && max !== '' ? `Max ${max}` : '—',
        label: SNAPSHOT_BAR_LABELS.groupSize,
      }
    }
    case 'inclusive':
      return {
        value: 'All-in',
        label: SNAPSHOT_BAR_LABELS.inclusive,
      }
    case 'ecosystem':
      return {
        value: experience.ecosystem ? String(experience.ecosystem) : '—',
        label: SNAPSHOT_BAR_LABELS.ecosystem,
      }
    default:
      return {value: '—', label: '—'}
  }
}
