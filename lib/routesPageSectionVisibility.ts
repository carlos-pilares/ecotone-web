import { isSectionVisibleInMap, visibilityMapFromSectionModules, type PageSectionModuleRow } from '@/lib/pageSectionVisibility'

export const ROUTES_PAGE_SECTION_KEYS = [
  'hero',
  'snapshot',
  'territory',
  'routes',
  'compare',
  'experiences',
  'reviews',
  'finalCta',
] as const

export type RoutesPageSectionKey = (typeof ROUTES_PAGE_SECTION_KEYS)[number]

export type RoutesPageSectionVisibility = Record<RoutesPageSectionKey, boolean>

export function resolveRoutesPageSectionVisibility(
  sectionModules: PageSectionModuleRow[] | null | undefined,
): RoutesPageSectionVisibility {
  const map = visibilityMapFromSectionModules(sectionModules)
  return {
    hero: isSectionVisibleInMap(map, 'hero'),
    snapshot: isSectionVisibleInMap(map, 'snapshot'),
    territory: isSectionVisibleInMap(map, 'territory'),
    routes: isSectionVisibleInMap(map, 'routes'),
    compare: isSectionVisibleInMap(map, 'compare'),
    experiences: isSectionVisibleInMap(map, 'experiences'),
    reviews: isSectionVisibleInMap(map, 'reviews'),
    finalCta: isSectionVisibleInMap(map, 'finalCta'),
  }
}
