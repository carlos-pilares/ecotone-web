export type ReviewsRatingSummary = {
  ratingValue: number
  reviewCount: number
  reviewProviderName: string
  reviewProviderUrl: string | null
  reviewProviderLogoUrl: string | null
  reviewProviderLogoAlt: string | null
}

export const DEFAULT_REVIEWS_RATING_SUMMARY: ReviewsRatingSummary = {
  ratingValue: 5,
  reviewCount: 0,
  reviewProviderName: 'Trustpilot',
  reviewProviderUrl: null,
  reviewProviderLogoUrl: null,
  reviewProviderLogoAlt: null,
}

/** Clamp each star fill to [0, 1] for 5 slots from a 0–5 rating (e.g. 4.9 → almost five full stars). */
export function starFillsFromRating(ratingValue: number): number[] {
  const v = Math.max(0, Math.min(5, Number.isFinite(ratingValue) ? ratingValue : 0))
  return [0, 1, 2, 3, 4].map((i) => Math.max(0, Math.min(1, v - i)))
}

export function formatRatingScoreDisplay(ratingValue: number): string {
  const v = Math.max(0, Math.min(5, Number.isFinite(ratingValue) ? ratingValue : 0))
  return (Math.round(v * 10) / 10).toFixed(1)
}

export function formatGlobalReviewCountLine(count: number): string {
  const n = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0))
  if (n === 0) return '0 reviews'
  return `${n} verified ${n === 1 ? 'review' : 'reviews'}`
}

export function normalizeReviewsRatingSummary(raw: unknown): ReviewsRatingSummary {
  const d = DEFAULT_REVIEWS_RATING_SUMMARY
  if (!raw || typeof raw !== 'object') return { ...d }
  const o = raw as Record<string, unknown>
  const ratingRaw = o.ratingValue
  const ratingValue =
    typeof ratingRaw === 'number' && Number.isFinite(ratingRaw)
      ? Math.max(0, Math.min(5, ratingRaw))
      : d.ratingValue
  const countRaw = o.reviewCount
  const reviewCount =
    typeof countRaw === 'number' && Number.isFinite(countRaw)
      ? Math.max(0, Math.floor(countRaw))
      : d.reviewCount
  const nameRaw = o.reviewProviderName
  const reviewProviderName =
    typeof nameRaw === 'string' && nameRaw.trim() ? nameRaw.trim() : d.reviewProviderName
  const urlRaw = o.reviewProviderUrl
  const reviewProviderUrl =
    typeof urlRaw === 'string' && urlRaw.trim() ? urlRaw.trim() : null
  const logoUrlRaw = o.reviewProviderLogoUrl
  const reviewProviderLogoUrl =
    typeof logoUrlRaw === 'string' && logoUrlRaw.trim() ? logoUrlRaw.trim() : null
  const altRaw = o.reviewProviderLogoAlt
  const reviewProviderLogoAlt =
    typeof altRaw === 'string' && altRaw.trim() ? altRaw.trim() : null
  return {
    ratingValue,
    reviewCount,
    reviewProviderName,
    reviewProviderUrl,
    reviewProviderLogoUrl,
    reviewProviderLogoAlt,
  }
}
