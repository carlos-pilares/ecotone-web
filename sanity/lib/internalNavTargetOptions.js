import {MODULE_LIST} from './pageModuleShared'

const INTERNAL_NAV_EXCLUDED_MODULE_KEYS = new Set(['hero', 'highlights', 'internalNav'])

function mergeTargetLists(...lists) {
  const seen = new Set()
  const merged = []
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const item of list) {
      if (!item?.value || seen.has(item.value)) continue
      seen.add(item.value)
      merged.push({title: item.title, value: item.value})
    }
  }
  return merged
}

/** Tourism experience page sticky nav — module keys from `MODULE_LIST`. */
export const EXPERIENCE_PAGE_INTERNAL_NAV_TARGETS = MODULE_LIST.filter(
  (m) => !INTERNAL_NAV_EXCLUDED_MODULE_KEYS.has(m.value),
).map((m) => ({title: m.title, value: m.value}))

/**
 * Extra anchors on Experiential Learning landings (not in shared `MODULE_LIST`).
 * Keep in sync with `INTERNAL_NAV_TARGET_META` in `lib/soqtapataInternalNav.ts`.
 */
export const EXPERIENCE_PAGE_LEARNING_INTERNAL_NAV_TARGETS = [
  {title: 'Programme', value: 'programme'},
  {title: 'Projects', value: 'projects'},
  {title: 'Learning outcomes', value: 'learningOutcomes'},
  {title: 'Field base / lodge', value: 'fieldBase'},
]

/**
 * Full static dropdown list for `internalNavItem.targetSection`.
 * Sanity `options.list` must be an array — dynamic functions crash nested array fields.
 */
export const EXPERIENCE_PAGE_ALL_INTERNAL_NAV_TARGETS = mergeTargetLists(
  EXPERIENCE_PAGE_INTERNAL_NAV_TARGETS,
  EXPERIENCE_PAGE_LEARNING_INTERNAL_NAV_TARGETS,
)

/** @deprecated Use `EXPERIENCE_PAGE_ALL_INTERNAL_NAV_TARGETS` — kept for callers/tests. */
export function getExperiencePageInternalNavTargetOptions(_document) {
  return EXPERIENCE_PAGE_ALL_INTERNAL_NAV_TARGETS
}
