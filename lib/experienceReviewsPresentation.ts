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

/**
 * Rellena `sourceLabel`, `secondaryRatingLine` y `emptyMessage` cuando el CMS los deja vacíos
 * (fallback técnico — mismo comportamiento que la página antes de CMS explícito).
 */
export function applyExperienceReviewsLayoutResolvers(
  rl: ExperienceReviewsLayoutMutable,
  reviewCount: number,
  programTitle: string,
): void {
  const m = rl
  if (!String(m.sourceLabel || '').trim()) {
    m.sourceLabel = 'Trustpilot'
  }
  if (m.secondaryRatingLine == null || !String(m.secondaryRatingLine).trim()) {
    m.secondaryRatingLine =
      reviewCount > 0
        ? `${reviewCount} verified ${reviewCount === 1 ? 'review' : 'reviews'}`
        : null
  }
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
