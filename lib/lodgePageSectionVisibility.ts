import { isPageSectionVisible } from '@/lib/pageSectionVisibility'
import type { LodgePageSectionCopyRow, LodgePageSectionsRow } from '@/lib/lodgePageCmsTypes'

export type LodgePageSectionVisibilityKey =
  | 'hero'
  | 'highlights'
  | 'navigation'
  | 'overview'
  | 'accommodation'
  | 'facilities'
  | 'location'
  | 'research'
  | 'experiences'
  | 'reviews'
  | 'faq'
  | 'booking'

export type LodgePageSectionVisibility = Record<LodgePageSectionVisibilityKey, boolean>

function copyVisible(copy: LodgePageSectionCopyRow | null | undefined): boolean {
  return isPageSectionVisible(copy?.visible)
}

/** DOM `id` on lodge in-page nav → section visibility key. */
export const LODGE_NAV_ID_TO_VISIBILITY_KEY: Record<string, LodgePageSectionVisibilityKey> = {
  overview: 'overview',
  rooms: 'accommodation',
  facilities: 'facilities',
  location: 'location',
  research: 'research',
  experiences: 'experiences',
  reviews: 'reviews',
  faq: 'faq',
  book: 'booking',
}

export const LODGE_PAGE_SECTION_VISIBILITY_DEFAULT: LodgePageSectionVisibility = {
  hero: true,
  highlights: true,
  navigation: true,
  overview: true,
  accommodation: true,
  facilities: true,
  location: true,
  research: true,
  experiences: true,
  reviews: true,
  faq: true,
  booking: true,
}

export function resolveLodgePageSectionVisibility(row: {
  sections?: LodgePageSectionsRow
  heroSectionCopy?: LodgePageSectionCopyRow | null
  highlightsSectionCopy?: LodgePageSectionCopyRow | null
  navigationSectionCopy?: LodgePageSectionCopyRow | null
  overviewSectionCopy?: LodgePageSectionCopyRow | null
  accommodationSectionCopy?: LodgePageSectionCopyRow | null
  facilitiesSectionCopy?: LodgePageSectionCopyRow | null
  locationSectionCopy?: LodgePageSectionCopyRow | null
  researchSectionCopy?: LodgePageSectionCopyRow | null
  experiencesSectionCopy?: LodgePageSectionCopyRow | null
  faqSectionCopy?: LodgePageSectionCopyRow | null
  bookingSectionCopy?: LodgePageSectionCopyRow | null
} | null | undefined): LodgePageSectionVisibility {
  const sec = row?.sections
  return {
    hero: copyVisible(row?.heroSectionCopy ?? sec?.hero),
    highlights: copyVisible(row?.highlightsSectionCopy ?? sec?.highlights),
    navigation: copyVisible(row?.navigationSectionCopy ?? sec?.navigation),
    overview: copyVisible(row?.overviewSectionCopy ?? sec?.overview),
    accommodation: copyVisible(row?.accommodationSectionCopy ?? sec?.accommodation),
    facilities: copyVisible(row?.facilitiesSectionCopy ?? sec?.facilities),
    location: copyVisible(row?.locationSectionCopy ?? sec?.location),
    research: copyVisible(row?.researchSectionCopy ?? sec?.research),
    experiences: copyVisible(row?.experiencesSectionCopy ?? sec?.experiences),
    reviews: copyVisible(sec?.reviews),
    faq: copyVisible(row?.faqSectionCopy ?? sec?.faq),
    booking: copyVisible(row?.bookingSectionCopy ?? sec?.booking),
  }
}
