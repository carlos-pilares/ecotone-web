import type { ReviewDoc } from '@/lib/queries'
import { getReviewExperienceLabel } from '@/lib/reviewsTypes'

export function formatReviewQuoteHtml(quote: string): string {
  const t = quote.trim()
  const idx = t.lastIndexOf('. ')
  if (idx > 8 && idx < t.length - 4) {
    const a = t.slice(0, idx + 1)
    const b = t.slice(idx + 2)
    return `"${a} <span>${b}</span>"`
  }
  return `"<span>${t}</span>"`
}

export function formatReviewQuoteAttr(r: ReviewDoc): string {
  const loc = [r.authorCity, r.authorCountry].filter(Boolean).join(', ')
  const exp = getReviewExperienceLabel(r)
  const name = r.authorName?.trim() || 'Guest'
  return `— ${name}${loc ? ` · ${loc}` : ''}${exp ? ` · ${exp}` : ''}`
}

/**
 * Builds rotating quote items in CMS order. Skips entries without quote text.
 */
export function buildRotatingQuoteItemsFromReviews(
  reviews: (ReviewDoc | null | undefined)[] | null | undefined,
): { text: string; attr: string }[] {
  if (!Array.isArray(reviews) || reviews.length === 0) return []
  const out: { text: string; attr: string }[] = []
  for (const r of reviews) {
    if (!r || !r.quote?.trim()) continue
    out.push({
      text: formatReviewQuoteHtml(r.quote.trim()),
      attr: formatReviewQuoteAttr(r),
    })
  }
  return out
}
