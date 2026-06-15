import { isSectionVisibleInMap, visibilityMapFromSectionModules } from '@/lib/pageSectionVisibility'
import type { LearningSectionModuleKey } from '@/lib/sectionPresentationTypes'
import { LEARNING_SECTION_MODULE_KEYS } from '@/lib/sectionPresentationTypes'
import type { SoqtapataPageModuleRow } from '@/lib/soqtapataSectionPresentation'

/** Visibility for EL-only sections from `experiencePage.sectionModules`. */
export function learningSectionVisibilityFromModules(
  modules: SoqtapataPageModuleRow[] | null | undefined,
): Partial<Record<LearningSectionModuleKey, boolean>> {
  const visMap = visibilityMapFromSectionModules(modules)
  const out: Partial<Record<LearningSectionModuleKey, boolean>> = {}
  for (const key of LEARNING_SECTION_MODULE_KEYS) {
    out[key] = isSectionVisibleInMap(visMap, key)
  }
  return out
}
