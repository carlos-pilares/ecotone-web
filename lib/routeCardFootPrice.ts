import { formatRouteCardFootPriceHtml } from '@/lib/formatExperiencePrice'
import { lowestPromotionalUsdForRows } from '@/lib/promotionPricing'
import type { PromotionDoc } from '@/lib/promotionTypes'
import { getLowestListedExperienceUsd } from '@/lib/reserveCtaPricing'

export { formatRouteCardFootPriceHtml }

export type RouteCardExperienceRow = {
  experienceId?: string | null
  programType?: string | null
  price?: number | null
  priceLabel?: string | null
  /** Route KC document `_id` from `experience.routeRef`. */
  routeRefId?: string | null
  /** @deprecated legacy `experience.route` slug — used only when `routeRefId` is missing in GROQ. */
  route?: string | null
}

const LEGACY_STABLE_ROUTE_IDS = ['camanti', 'manu-road', 'manu-core'] as const

function normalizeRouteKey(route: string | null | undefined): (typeof LEGACY_STABLE_ROUTE_IDS)[number] | null {
  const r = route?.trim().toLowerCase()
  if (r === 'camanti') return 'camanti'
  if (r === 'manu-road' || r === 'manuroad' || r === 'manu road') return 'manu-road'
  if (r === 'manu-core' || r === 'manucore' || r === 'manu core') return 'manu-core'
  return null
}

function lowestUsdForRows(
  rows: RouteCardExperienceRow[],
  promotions?: PromotionDoc[] | null,
): number | null {
  if (promotions?.length) {
    const promoLow = lowestPromotionalUsdForRows(rows, promotions)
    if (promoLow != null) return promoLow
  }
  return getLowestListedExperienceUsd(rows)
}

/**
 * Route card foot stats keyed by Route KC `_id` (published experience pages + linked Experience KC).
 */
export function buildRouteFootPriceHtmlByRouteRef(
  experiences: RouteCardExperienceRow[] | null | undefined,
  promotions?: PromotionDoc[] | null,
): Map<string, string> {
  const byRef = new Map<string, RouteCardExperienceRow[]>()
  for (const row of experiences ?? []) {
    const id = row.routeRefId?.trim()
    if (!id) continue
    const list = byRef.get(id) ?? []
    list.push(row)
    byRef.set(id, list)
  }

  const out = new Map<string, string>()
  for (const [refId, rows] of byRef) {
    const lowest = lowestUsdForRows(rows, promotions)
    out.set(refId, formatRouteCardFootPriceHtml(rows.length, lowest))
  }
  return out
}

/**
 * @deprecated Legacy stableId keys (`camanti`, `manu-road`, `manu-core`) when route cards lack `routeRef`.
 */
export function buildRouteFootPriceHtmlByStableId(
  experiences: RouteCardExperienceRow[] | null | undefined,
  promotions?: PromotionDoc[] | null,
): Map<string, string> {
  const byRoute = new Map<(typeof LEGACY_STABLE_ROUTE_IDS)[number], RouteCardExperienceRow[]>()
  for (const id of LEGACY_STABLE_ROUTE_IDS) byRoute.set(id, [])

  for (const row of experiences ?? []) {
    const key = normalizeRouteKey(row.route)
    if (!key) continue
    byRoute.get(key)!.push(row)
  }

  const out = new Map<string, string>()
  for (const id of LEGACY_STABLE_ROUTE_IDS) {
    const rows = byRoute.get(id) ?? []
    const lowest = lowestUsdForRows(rows, promotions)
    out.set(id, formatRouteCardFootPriceHtml(rows.length, lowest))
  }
  return out
}

/** @deprecated Use `buildRouteFootPriceHtmlByRouteRef` or `buildRouteFootPriceHtmlByStableId`. */
export const buildRouteFootPriceHtmlById = buildRouteFootPriceHtmlByStableId
