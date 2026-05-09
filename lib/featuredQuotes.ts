import type { ReviewDoc } from '@/lib/queries'
import { getReviewExperienceLabel } from '@/lib/reviewsTypes'

function formatQuoteHtml(quote: string): string {
  const t = quote.trim()
  const idx = t.lastIndexOf('. ')
  if (idx > 8 && idx < t.length - 4) {
    const a = t.slice(0, idx + 1)
    const b = t.slice(idx + 2)
    return `"${a} <span>${b}"</span>`
  }
  return `"<span>${t}</span>"`
}

function formatAttr(r: ReviewDoc): string {
  const loc = [r.authorCity, r.authorCountry].filter(Boolean).join(', ')
  const exp = getReviewExperienceLabel(r)
  const name = r.authorName?.trim() || 'Guest'
  return `— ${name}${loc ? ` · ${loc}` : ''}${exp ? ` · ${exp}` : ''}`
}

const MAX_HOME_FEATURED = 5

/**
 * Home featured quotes: `isFeatured` first, else first reviews with quotes.
 * Returns [] when there is no review content (no invented defaults).
 */
export function buildFeaturedQuoteItems(reviews: ReviewDoc[] | null | undefined): {
  text: string
  attr: string
}[] {
  const list = Array.isArray(reviews) ? reviews : []
  const withQuote = list.filter((r) => r.quote && r.quote.trim())
  if (withQuote.length === 0) return []
  const featured = withQuote.filter((r) => r.isFeatured)
  const source = featured.length > 0 ? featured : withQuote.slice(0, MAX_HOME_FEATURED)
  return source.map((r) => ({
    text: formatQuoteHtml(r.quote!.trim()),
    attr: formatAttr(r),
  }))
}
