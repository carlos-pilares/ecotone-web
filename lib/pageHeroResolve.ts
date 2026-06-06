import type { SoqtapataPhase1Hero } from '@/data/soqtapataExperienceLocal'

export type PageHeroRatingFields = {
  manualRatingValue?: string | null
  manualReviewCount?: number | null
  manualReviewProviderLabel?: string | null
}

export type PageHeroPriceMicrocopyFields = {
  heroPricePrefix?: string | null
  heroPriceSuffix?: string | null
  heroPriceFootnote?: string | null
  /** When true, the footnote line is hidden regardless of `heroPriceFootnote`. */
  hideHeroPriceFootnote?: boolean | null
}

export type ResolvedHeroPriceParts = {
  from: string
  amount: string
  suffix: string
  footnote: string
  originalAmount?: string
  promoLabel?: string
  promoMicrocopy?: string
}

function cmsHeroPriceLine(raw: string | null | undefined): string {
  if (raw == null) return ''
  return raw.trim()
}

function resolveHeroPriceFootnote(ph?: PageHeroPriceMicrocopyFields | null): string {
  if (ph?.hideHeroPriceFootnote === true) return ''
  return cmsHeroPriceLine(ph?.heroPriceFootnote)
}

/**
 * Main hero price microcopy — values come only from Experience Page `pageHero`.
 * No JS defaults; empty/null/undefined CMS values render nothing for that line.
 */
export function resolvePageHeroPriceMicrocopy(
  ph?: PageHeroPriceMicrocopyFields | null,
): { prefix: string; suffix: string; footnote: string } {
  return {
    prefix: cmsHeroPriceLine(ph?.heroPricePrefix),
    suffix: cmsHeroPriceLine(ph?.heroPriceSuffix),
    footnote: resolveHeroPriceFootnote(ph),
  }
}

/** Merge pageHero microcopy with KC/promo amount fields for the main hero price block. */
export function mergePageHeroPriceMicrocopyWithAmount(
  ph: PageHeroPriceMicrocopyFields | null | undefined,
  amount: Pick<ResolvedHeroPriceParts, 'amount' | 'originalAmount' | 'promoLabel' | 'promoMicrocopy'>,
): ResolvedHeroPriceParts {
  const microcopy = resolvePageHeroPriceMicrocopy(ph)
  return {
    from: microcopy.prefix,
    amount: amount.amount,
    suffix: microcopy.suffix,
    footnote: microcopy.footnote,
    ...(amount.originalAmount ? { originalAmount: amount.originalAmount } : {}),
    ...(amount.promoLabel ? { promoLabel: amount.promoLabel } : {}),
    ...(amount.promoMicrocopy ? { promoMicrocopy: amount.promoMicrocopy } : {}),
  }
}

export function resolvePageHeroRating(
  ph: PageHeroRatingFields | null | undefined,
  fallback: Pick<SoqtapataPhase1Hero, 'ratingScore' | 'ratingReviews'>,
): { ratingScore: string; ratingReviews: string } {
  const ratingScore = ph?.manualRatingValue?.trim() || fallback.ratingScore
  const ratingReviews = (() => {
    const n = ph?.manualReviewCount
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
      const suffix = n === 1 ? 'review' : 'reviews'
      const prov = ph?.manualReviewProviderLabel?.trim()
      return `· ${n} ${suffix}${prov ? ` · ${prov}` : ''}`
    }
    return fallback.ratingReviews
  })()
  return { ratingScore, ratingReviews }
}

/** Sticky nav label — capitalise a lowercase CMS prefix when present. */
export function heroPricePrefixForNav(prefix: string): string {
  const t = prefix.trim()
  if (!t) return ''
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export function combineHeroPriceSubLines(suffix: string, footnote?: string | null): string {
  return [suffix.trim(), footnote?.trim()].filter(Boolean).join(' · ')
}

/** Apply CMS-resolved price lines to hero — strips any prior `priceFootnote` when cleared. */
export function applyPageHeroPriceToHero(
  hero: SoqtapataPhase1Hero,
  price: ResolvedHeroPriceParts,
): SoqtapataPhase1Hero {
  const { priceFootnote: _drop, priceOriginalAmount: _dropOrig, promoLabel: _dropPromo, promoMicrocopy: _dropMicro, ...rest } =
    hero
  return {
    ...rest,
    priceFrom: price.from,
    priceAmount: price.amount,
    priceSub: price.suffix,
    ...(price.footnote ? { priceFootnote: price.footnote } : {}),
    ...(price.originalAmount ? { priceOriginalAmount: price.originalAmount } : {}),
    ...(price.promoLabel ? { promoLabel: price.promoLabel } : {}),
    ...(price.promoMicrocopy ? { promoMicrocopy: price.promoMicrocopy } : {}),
  }
}

/** Dev-only trace for hero price microcopy resolution. */
export function debugPageHeroPriceMicrocopy(
  slug: string,
  ph: PageHeroPriceMicrocopyFields | null | undefined,
): void {
  if (process.env.NODE_ENV !== 'development') return
  // eslint-disable-next-line no-console
  console.debug('[pageHero price microcopy]', slug, {
    raw: {
      heroPricePrefix: ph?.heroPricePrefix,
      heroPriceSuffix: ph?.heroPriceSuffix,
      heroPriceFootnote: ph?.heroPriceFootnote,
      hideHeroPriceFootnote: ph?.hideHeroPriceFootnote,
    },
    resolved: resolvePageHeroPriceMicrocopy(ph),
  })
}
