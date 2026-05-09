/**
 * Copy de cabecera por sección para Vista previa en Studio (lodgePage.sections + fallback estático Soqtapata).
 * No forma parte del front público.
 */
import {
  lodgeSoqtapataBook,
  lodgeSoqtapataExperiences,
  lodgeSoqtapataFacilities,
  lodgeSoqtapataFaq,
  lodgeSoqtapataLocation,
  lodgeSoqtapataOverview,
  lodgeSoqtapataResearch,
  lodgeSoqtapataRooms,
} from '../../data/lodgeSoqtapataStatic'

/** Alineado a `app/lodges/soqtapata-lodge/page.tsx` → ReviewsSection. */
const REVIEWS_STATIC = {
  eyebrow: 'What guests say',
  title: 'Real stays',
  body: '',
} as const

const FALLBACK = {
  overview: {
    eyebrow: lodgeSoqtapataOverview.eyebrow,
    title: lodgeSoqtapataOverview.title,
    body: lodgeSoqtapataOverview.body,
  },
  accommodation: {
    eyebrow: lodgeSoqtapataRooms.eyebrow,
    title: lodgeSoqtapataRooms.title,
    body: lodgeSoqtapataRooms.body,
  },
  facilities: {
    eyebrow: lodgeSoqtapataFacilities.eyebrow,
    title: lodgeSoqtapataFacilities.title,
    body: lodgeSoqtapataFacilities.body,
  },
  location: {
    eyebrow: lodgeSoqtapataLocation.eyebrow,
    title: lodgeSoqtapataLocation.title,
    body: lodgeSoqtapataLocation.body,
  },
  research: {
    eyebrow: lodgeSoqtapataResearch.eyebrow,
    title: lodgeSoqtapataResearch.title,
    body: lodgeSoqtapataResearch.body,
  },
  experiences: {
    eyebrow: lodgeSoqtapataExperiences.eyebrow,
    title: lodgeSoqtapataExperiences.title,
    body: lodgeSoqtapataExperiences.body,
  },
  reviews: REVIEWS_STATIC,
  faq: {
    eyebrow: lodgeSoqtapataFaq.eyebrow,
    title: lodgeSoqtapataFaq.h2,
    body: lodgeSoqtapataFaq.lead,
  },
  booking: {
    eyebrow: lodgeSoqtapataBook.eyebrow,
    title: lodgeSoqtapataBook.title,
    body: lodgeSoqtapataBook.body,
  },
} as const

export type LodgePageStudioSectionKey = keyof typeof FALLBACK

type SectionRow = { eyebrow?: string | null; title?: string | null; body?: string | null } | null | undefined

export function resolveLodgePageSectionPreview(
  sectionKey: LodgePageStudioSectionKey,
  sections: Record<string, SectionRow> | null | undefined,
): { eyebrow: string; title: string; body: string } {
  const fb = FALLBACK[sectionKey]
  const o = sections?.[sectionKey] ?? {}
  return {
    eyebrow: o?.eyebrow?.trim() ? o.eyebrow.trim() : fb.eyebrow,
    title: o?.title?.trim() ? o.title.trim() : fb.title,
    body: o?.body?.trim() ? o.body.trim() : fb.body,
  }
}
