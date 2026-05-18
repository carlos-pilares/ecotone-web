import {
  isSectionVisibleInMap,
  visibilityMapFromSectionModules,
  type PageSectionModuleRow,
} from '@/lib/pageSectionVisibility'

export const HOME_PAGE_SECTION_KEYS = [
  'hero',
  'stats',
  'manifesto',
  'explorer',
  'reviews',
  'tech',
  'mission',
  'partners',
  'blog',
  'booking',
] as const

export type HomePageSectionKey = (typeof HOME_PAGE_SECTION_KEYS)[number]

export type HomePageSectionVisibility = Record<HomePageSectionKey, boolean>

export const HOME_PAGE_SECTION_VISIBILITY_DEFAULT: HomePageSectionVisibility = {
  hero: true,
  stats: true,
  manifesto: true,
  explorer: true,
  reviews: true,
  tech: true,
  mission: true,
  partners: true,
  blog: true,
  booking: true,
}

export function resolveHomePageSectionVisibility(
  sectionModules: PageSectionModuleRow[] | null | undefined,
): HomePageSectionVisibility {
  const map = visibilityMapFromSectionModules(sectionModules)
  return {
    hero: isSectionVisibleInMap(map, 'hero'),
    stats: isSectionVisibleInMap(map, 'stats'),
    manifesto: isSectionVisibleInMap(map, 'manifesto'),
    explorer: isSectionVisibleInMap(map, 'explorer'),
    reviews: isSectionVisibleInMap(map, 'reviews'),
    tech: isSectionVisibleInMap(map, 'tech'),
    mission: isSectionVisibleInMap(map, 'mission'),
    partners: isSectionVisibleInMap(map, 'partners'),
    blog: isSectionVisibleInMap(map, 'blog'),
    booking: isSectionVisibleInMap(map, 'booking'),
  }
}
