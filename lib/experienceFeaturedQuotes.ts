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

/** Rotación hero cuando no hay reseñas con cita (no atribuye a personas inventadas). */
export const EXPERIENCE_FEATURED_QUOTES_TECHNICAL: { text: string; attr: string }[] = [
  {
    text: '"<span>Guest reviews will appear here when travellers share their experience.</span>"',
    attr: '—',
  },
]

/**
 * Citas destacadas para la experience: `isFeatured` primero; si no hay, cualquier reseña con cita;
 * si no hay reseñas con texto, fallback técnico neutral (no reutiliza muestras de la home).
 */
export function buildFeaturedQuoteItemsForExperience(
  reviews: ReviewDoc[] | null | undefined,
): { text: string; attr: string }[] {
  const list = Array.isArray(reviews) ? reviews : []
  const featured = list.filter((r) => r.isFeatured && r.quote && r.quote.trim())
  if (featured.length > 0) {
    return featured.map((r) => ({
      text: formatQuoteHtml(r.quote!.trim()),
      attr: formatAttr(r),
    }))
  }
  const anyQuoted = list.filter((r) => r.quote && r.quote.trim())
  if (anyQuoted.length > 0) {
    return anyQuoted.map((r) => ({
      text: formatQuoteHtml(r.quote!.trim()),
      attr: formatAttr(r),
    }))
  }
  return EXPERIENCE_FEATURED_QUOTES_TECHNICAL
}
