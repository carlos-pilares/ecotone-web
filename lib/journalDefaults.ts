import type { JournalPageDoc } from '@/lib/queries'

export const journalIndexDefaults = {
  heroEyebrow: 'Field notes',
  heroTitle: 'Journal',
  heroIntro:
    'Dispatch from the field — conservation context, expedition craft, and the science behind how we move through cloud forest and lowland Amazon.',
  showTagFilter: true,
} as const

export type ResolvedJournalIndexPage = {
  heroEyebrow: string
  heroTitle: string
  heroIntro: string
  showTagFilter: boolean
  seo: {
    title: string | null
    description: string | null
    noIndex: boolean
    ogImageUrl: string | null
  }
}

export function mergeJournalPage(cms: JournalPageDoc | null | undefined): ResolvedJournalIndexPage {
  const seo = cms?.seo ?? {}
  return {
    heroEyebrow: (cms?.heroEyebrow ?? journalIndexDefaults.heroEyebrow).trim() || journalIndexDefaults.heroEyebrow,
    heroTitle: (cms?.heroTitle ?? journalIndexDefaults.heroTitle).trim() || journalIndexDefaults.heroTitle,
    heroIntro: (cms?.heroIntro ?? journalIndexDefaults.heroIntro).trim() || journalIndexDefaults.heroIntro,
    showTagFilter: cms?.showTagFilter !== false,
    seo: {
      title: seo.title?.trim() || null,
      description: seo.description?.trim() || null,
      noIndex: Boolean(seo.noIndex),
      ogImageUrl: seo.ogImageUrl?.trim() || null,
    },
  }
}
