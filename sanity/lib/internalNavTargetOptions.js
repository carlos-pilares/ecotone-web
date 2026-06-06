import {MODULE_LIST} from './pageModuleShared'

/** Experience page sticky nav — tourism module keys (from `MODULE_LIST`). */
export const EXPERIENCE_PAGE_INTERNAL_NAV_TARGETS = MODULE_LIST.filter(
  (m) => !['hero', 'highlights', 'internalNav'].includes(m.value),
).map((m) => ({title: m.title, value: m.value}))

/** Extra anchors on Experiential Learning landings only (`#projects`, `#outcomes`). */
export const EXPERIENCE_PAGE_LEARNING_INTERNAL_NAV_TARGETS = [
  {title: 'Projects', value: 'projects'},
  {title: 'Learning outcomes', value: 'learningOutcomes'},
]

function hasLearningProgrammeRef(document) {
  const ref = document?.learningProgramme
  if (!ref) return false
  if (typeof ref === 'string') return Boolean(ref.trim())
  return Boolean(ref._ref)
}

/** Dropdown options for `internalNavItem.targetSection` on `experiencePage`. */
export function getExperiencePageInternalNavTargetOptions(document) {
  const base = EXPERIENCE_PAGE_INTERNAL_NAV_TARGETS
  if (!hasLearningProgrammeRef(document)) return base
  return [...base, ...EXPERIENCE_PAGE_LEARNING_INTERNAL_NAV_TARGETS]
}
