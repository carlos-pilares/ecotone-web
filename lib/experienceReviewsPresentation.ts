import { soqtapataExperienceReviewsLayout } from '@/data/soqtapataExperienceLocal'

/** Layout del bloque reseñas en experience (post-CMS + overrides de sección). */
export type ExperienceReviewsLayoutMutable = {
  eyebrow: string
  headline: string
  averageRating: string
  sectionClassName: string
  contentInnerClassName: string
  useHomepageSampleReviewsIfEmpty: boolean
  sourceLabel: string
  secondaryRatingLine: string | null
  emptyMessage: string
  reviewsRegionAriaLabel: string
  reviewTablistAriaLabel: string
  quoteDotAriaLabelPrefix: string
  reviewDotAriaLabelPrefix: string
  guestFallbackName: string
}

/** Ensures empty carousel message and aria labels when the legacy `reviewsLayout` block omits them. */
export function applyExperienceReviewsLayoutResolvers(
  rl: ExperienceReviewsLayoutMutable,
  _reviewCount: number,
  programTitle: string,
): void {
  const m = rl
  if (!String(m.emptyMessage || '').trim()) {
    const name = programTitle.trim() || 'this program'
    m.emptyMessage = `No guest reviews for ${name} yet. Be the first to share your experience.`
  }
  const u = soqtapataExperienceReviewsLayout
  if (!String(m.reviewsRegionAriaLabel || '').trim()) {
    m.reviewsRegionAriaLabel = u.reviewsRegionAriaLabel
  }
  if (!String(m.reviewTablistAriaLabel || '').trim()) {
    m.reviewTablistAriaLabel = u.reviewTablistAriaLabel
  }
  if (!String(m.quoteDotAriaLabelPrefix || '').trim()) {
    m.quoteDotAriaLabelPrefix = u.quoteDotAriaLabelPrefix
  }
  if (!String(m.reviewDotAriaLabelPrefix || '').trim()) {
    m.reviewDotAriaLabelPrefix = u.reviewDotAriaLabelPrefix
  }
  if (!String(m.guestFallbackName || '').trim()) {
    m.guestFallbackName = u.guestFallbackName
  }
}
