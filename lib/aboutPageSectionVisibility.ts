import { isSectionVisibleInMap, visibilityMapFromSectionModules, type PageSectionModuleRow } from '@/lib/pageSectionVisibility'

export const ABOUT_PAGE_SECTION_KEYS = [
  'hero',
  'who',
  'why',
  'different',
  'way',
  'people',
  'proof',
  'partners',
  'finalCta',
] as const

export type AboutPageSectionKey = (typeof ABOUT_PAGE_SECTION_KEYS)[number]

export type AboutPageSectionVisibility = Record<AboutPageSectionKey, boolean>

export function resolveAboutPageSectionVisibility(
  sectionModules: PageSectionModuleRow[] | null | undefined,
): AboutPageSectionVisibility {
  const map = visibilityMapFromSectionModules(sectionModules)
  return {
    hero: isSectionVisibleInMap(map, 'hero'),
    who: isSectionVisibleInMap(map, 'who'),
    why: isSectionVisibleInMap(map, 'why'),
    different: isSectionVisibleInMap(map, 'different'),
    way: isSectionVisibleInMap(map, 'way'),
    people: isSectionVisibleInMap(map, 'people'),
    proof: isSectionVisibleInMap(map, 'proof'),
    partners: isSectionVisibleInMap(map, 'partners'),
    finalCta: isSectionVisibleInMap(map, 'finalCta'),
  }
}
