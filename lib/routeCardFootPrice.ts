import { getLowestListedExperienceUsd, type ExperiencePriceInput } from '@/lib/reserveCtaPricing'

export type RouteCardExperienceRow = ExperiencePriceInput & {
  route?: string | null
}

const ROUTE_CARD_IDS = ['camanti', 'manu-road', 'manu-core'] as const

function normalizeRouteKey(route: string | null | undefined): (typeof ROUTE_CARD_IDS)[number] | null {
  const r = route?.trim().toLowerCase()
  if (r === 'camanti') return 'camanti'
  if (r === 'manu-road' || r === 'manuroad' || r === 'manu road') return 'manu-road'
  if (r === 'manu-core' || r === 'manucore' || r === 'manu core') return 'manu-core'
  return null
}

function formatFootPriceHtml(count: number, lowestUsd: number | null): string {
  const countLabel = count === 1 ? '1 experience' : `${count} experiences`
  if (count === 0) {
    return '0 experiences · <span class="routes-price-enquire">Enquire</span>'
  }
  if (lowestUsd != null && lowestUsd > 0) {
    const price = lowestUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return `${countLabel} · from <strong>$${price}</strong>`
  }
  return `${countLabel} · <span class="routes-price-enquire">Enquire</span>`
}

/**
 * Route card foot stats from published experience pages + linked Experience KC.
 */
export function buildRouteFootPriceHtmlById(
  experiences: RouteCardExperienceRow[] | null | undefined,
): Map<string, string> {
  const byRoute = new Map<(typeof ROUTE_CARD_IDS)[number], RouteCardExperienceRow[]>()
  for (const id of ROUTE_CARD_IDS) byRoute.set(id, [])

  for (const row of experiences ?? []) {
    const key = normalizeRouteKey(row.route)
    if (!key) continue
    byRoute.get(key)!.push(row)
  }

  const out = new Map<string, string>()
  for (const id of ROUTE_CARD_IDS) {
    const rows = byRoute.get(id) ?? []
    const lowest = getLowestListedExperienceUsd(rows)
    out.set(id, formatFootPriceHtml(rows.length, lowest))
  }
  return out
}
