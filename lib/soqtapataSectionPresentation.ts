/**
 * Une `sectionModules` (experiencePage) + contenido fusionado Soqtapata con `resolveSectionPresentation`.
 */
import { SECTION_DEFAULTS } from '@/lib/sectionPresentationDefaults'
import { resolveSectionPresentation } from '@/lib/sectionPresentation'
import type {
  ExperiencePresentationSlice,
  LandingSectionOverride,
  ResolvedSectionPresentation,
  SectionModuleKey,
} from '@/lib/sectionPresentationTypes'
import type { soqtapataExperience } from '@/data/soqtapataExperienceLocal'
import type { ExperienceReviewsLayoutMutable } from '@/lib/experienceReviewsPresentation'

/** Experiencia fusionada (CMS + local) con campos opcionales que solo setea la capa de presentación. */
export type SoqtapataExperienceMerged = typeof soqtapataExperience & {
  techEyebrow?: string
  techTitle?: string
}

export type SoqtapataPageModuleRow = {
  _key?: string
  key?: string | null
  visible?: boolean | null
  anchorId?: string | null
  eyebrow?: string | null
  sectionTitle?: string | null
  sectionText?: string | null
}

/** Orden editorial alineado con `sanity/lib/pageModuleShared` MODULE_LIST. */
export const SOQTAPATA_SECTION_KEYS: SectionModuleKey[] = [
  'overview',
  'itinerary',
  'lodge',
  'wildlife',
  'includes',
  'tech',
  'media',
  'whenToVisit',
  'beforeYouGo',
  'reviews',
  'terms',
  'resources',
  'faq',
  'related',
  'reserve',
]

export function landingOverridesFromSectionModules(
  modules: SoqtapataPageModuleRow[] | null | undefined,
): Map<SectionModuleKey, LandingSectionOverride> {
  const map = new Map<SectionModuleKey, LandingSectionOverride>()
  if (!modules?.length) return map
  for (const row of modules) {
    if (row == null || typeof row !== 'object') continue
    const key = row?.key as SectionModuleKey | undefined
    if (!key || !SOQTAPATA_SECTION_KEYS.includes(key)) continue
    map.set(key, {
      eyebrow: row.eyebrow ?? undefined,
      sectionTitle: row.sectionTitle ?? undefined,
      sectionText: row.sectionText ?? undefined,
      visible: row.visible,
    })
  }
  return map
}

export function buildExperiencePresentationSlice(
  ex: SoqtapataExperienceMerged,
  reviewsLayout: Pick<ExperienceReviewsLayoutMutable, 'eyebrow' | 'headline'>,
  pageReviews?: { eyebrow?: string | null; title?: string | null; body?: string | null } | null,
): ExperiencePresentationSlice {
  const td = SECTION_DEFAULTS.tech
  const pr = pageReviews && typeof pageReviews === 'object' ? pageReviews : null
  return {
    overview: {
      eyebrow: ex.overview.eyebrow,
      title: ex.overview.h2,
      text: '',
    },
    itinerary: {
      eyebrow: ex.itinerary.eyebrow,
      title: ex.itinerary.h2,
      text: '',
    },
    lodge: {
      eyebrow: ex.lodge.eyebrow,
      title: ex.lodge.h2,
      text: ex.lodge.intro,
    },
    wildlife: {
      eyebrow: ex.wildlife.eyebrow,
      title: ex.wildlife.h2,
      text: ex.wildlife.intro,
    },
    includes: {
      eyebrow: ex.includes.eyebrow,
      title: ex.includes.h2,
      text: ex.includes.lead ?? '',
    },
    tech: {
      eyebrow: td.eyebrow,
      title: td.title,
      text: ex.techDescription ?? '',
    },
    media: {
      eyebrow: ex.media.eyebrow,
      title: ex.media.h2,
      text: ex.media.lead ?? '',
    },
    whenToVisit: {
      eyebrow: ex.when.eyebrow,
      title: ex.when.h2,
      text: ex.when.intro,
    },
    beforeYouGo: {
      eyebrow: ex.beforeYouGo.eyebrow,
      title: ex.beforeYouGo.h2,
      text: ex.beforeYouGo.lead,
    },
    reviews: {
      eyebrow: pr?.eyebrow?.trim() || reviewsLayout.eyebrow || undefined,
      title: pr?.title?.trim() || reviewsLayout.headline || undefined,
      text: pr?.body?.trim() || '',
    },
    terms: {
      eyebrow: ex.terms.introEyebrow,
      title: ex.terms.h2,
      text: ex.terms.lead,
    },
    resources: {
      eyebrow: ex.resources.eyebrow,
      title: ex.resources.h2,
      text: ex.resources.lead ?? '',
    },
    faq: {
      eyebrow: ex.faq.eyebrow,
      title: ex.faq.h2,
      text: ex.faq.lead,
    },
    related: {
      eyebrow: ex.also.eyebrow,
      title: ex.also.h2,
      text: ex.also.lead ?? '',
    },
    reserve: {
      eyebrow: ex.book.eyebrow,
      title: ex.book.h2,
      text: '',
    },
  }
}

function emptyVisibility(): Record<SectionModuleKey, boolean> {
  return Object.fromEntries(SOQTAPATA_SECTION_KEYS.map((k) => [k, true])) as Record<
    SectionModuleKey,
    boolean
  >
}

/**
 * Resuelve y aplica eyebrow / título / intro / visibilidad sobre la experiencia ya fusionada con CMS.
 */
export function applySoqtapataSectionPresentation(params: {
  experience: SoqtapataExperienceMerged
  reviewsLayout: ExperienceReviewsLayoutMutable
  sectionModules: SoqtapataPageModuleRow[] | null | undefined
  pageReviews?: { eyebrow?: string | null; title?: string | null; body?: string | null } | null
}): {
  sectionVisibility: Record<SectionModuleKey, boolean>
  reviewsSectionLead: string | undefined
} {
  const { experience: ex, reviewsLayout: rl } = params
  const landing = landingOverridesFromSectionModules(params.sectionModules)
  const expSlice = buildExperiencePresentationSlice(ex, rl, params.pageReviews ?? null)

  const resolvedBySection = {} as Record<SectionModuleKey, ResolvedSectionPresentation>
  for (const key of SOQTAPATA_SECTION_KEYS) {
    resolvedBySection[key] = resolveSectionPresentation(key, {
      landing: landing.get(key),
      experiencePresentation: expSlice,
    })
  }

  const o = resolvedBySection.overview!
  ex.overview.eyebrow = o.eyebrow
  ex.overview.h2 = o.title
  ex.overview.lead = o.text || undefined

  const it = resolvedBySection.itinerary!
  ex.itinerary.eyebrow = it.eyebrow
  ex.itinerary.h2 = it.title
  ex.itinerary.lead = it.text || undefined

  const lg = resolvedBySection.lodge!
  ex.lodge.eyebrow = lg.eyebrow
  ex.lodge.h2 = lg.title
  ex.lodge.intro = lg.text

  const wi = resolvedBySection.wildlife!
  ex.wildlife.eyebrow = wi.eyebrow
  ex.wildlife.h2 = wi.title
  ex.wildlife.intro = wi.text

  const inc = resolvedBySection.includes!
  ex.includes.eyebrow = inc.eyebrow
  ex.includes.h2 = inc.title
  ex.includes.lead = inc.text || undefined

  const te = resolvedBySection.tech!
  ex.techEyebrow = te.eyebrow
  ex.techTitle = te.title
  ex.techDescription = te.text

  const me = resolvedBySection.media!
  ex.media.eyebrow = me.eyebrow
  ex.media.h2 = me.title
  ex.media.lead = me.text || undefined

  const wh = resolvedBySection.whenToVisit!
  ex.when.eyebrow = wh.eyebrow
  ex.when.h2 = wh.title
  ex.when.intro = wh.text

  const bf = resolvedBySection.beforeYouGo!
  ex.beforeYouGo.eyebrow = bf.eyebrow
  ex.beforeYouGo.h2 = bf.title
  ex.beforeYouGo.lead = bf.text

  const rv = resolvedBySection.reviews!
  rl.eyebrow = rv.eyebrow
  rl.headline = rv.title

  const tm = resolvedBySection.terms!
  ex.terms.introEyebrow = tm.eyebrow
  ex.terms.h2 = tm.title
  ex.terms.lead = tm.text

  const rs = resolvedBySection.resources!
  ex.resources.eyebrow = rs.eyebrow
  ex.resources.h2 = rs.title
  ex.resources.lead = rs.text || undefined

  const fq = resolvedBySection.faq!
  ex.faq.eyebrow = fq.eyebrow
  ex.faq.h2 = fq.title
  ex.faq.lead = fq.text

  const rel = resolvedBySection.related!
  ex.also.eyebrow = rel.eyebrow
  ex.also.h2 = rel.title
  ex.also.lead = rel.text || undefined

  const bk = resolvedBySection.reserve!
  ex.book.eyebrow = bk.eyebrow
  ex.book.h2 = bk.title

  const sectionVisibility = emptyVisibility()
  for (const key of SOQTAPATA_SECTION_KEYS) {
    sectionVisibility[key] = resolvedBySection[key]!.visible
  }

  return {
    sectionVisibility,
    reviewsSectionLead: rv.text || undefined,
  }
}
