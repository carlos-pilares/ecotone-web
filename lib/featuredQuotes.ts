import { DEFAULT_FEATURED_QUOTES } from '@/lib/homeQuoteDefaults'
import type { ReviewDoc } from '@/lib/queries'

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
  const exp = r.experienceName?.trim()
  const name = r.authorName?.trim() || 'Guest'
  return `— ${name}${loc ? ` · ${loc}` : ''}${exp ? ` · ${exp}` : ''}`
}

/** Uses `isFeatured` reviews for rotation; falls back to DEFAULT_FEATURED_QUOTES. */
export function buildFeaturedQuoteItems(reviews: ReviewDoc[] | null | undefined): {
  text: string
  attr: string
}[] {
  const list = Array.isArray(reviews) ? reviews : []
  const featured = list.filter((r) => r.isFeatured && r.quote && r.quote.trim())
  if (featured.length === 0) return DEFAULT_FEATURED_QUOTES
  return featured.map((r) => ({
    text: formatQuoteHtml(r.quote!.trim()),
    attr: formatAttr(r),
  }))
}
