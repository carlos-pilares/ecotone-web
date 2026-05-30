import type { RoutesExpCardStatic, RoutesExpFilterPill } from '@/data/routesStatic'
import { toExperienceCardDataFromListedPage } from '@/lib/experienceCardData'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

export type RoutesPagePublishedRouteRow = {
  _id?: string | null
  name?: string | null
  shortLabel?: string | null
  slug?: string | null
}

export type RoutesPageListedExperiencePageRow = {
  experienceId?: string | null
  landingSlug?: string | null
  routeRefId?: string | null
  routeSlug?: string | null
  routeLabel?: string | null
  name?: string | null
  experienceSlug?: string | null
  duration?: string | null
  programType?: string | null
  shortDescription?: string | null
  tagline?: string | null
  price?: number | null
  priceLabel?: string | null
  status?: string | null
  mainImageUrl?: string | null
  lodgeEnquireSmartLink?: SmartLinkGroq | null
}

const ALL_ROUTES_FILTER_ID = 'all' as const
const ALL_ROUTES_LABEL = 'All routes'

const PROGRAM_TYPE_PUBLIC_LABEL: Record<string, string> = {
  'nature-core': 'Classic Nature',
  'family-adventure': 'Signature Expeditions',
  'experiential-learning': 'Experiential Learning',
  'tailor-made': 'Tailor Made',
}

function typePillLabel(programType: string | null | undefined): string {
  const p = programType?.trim().toLowerCase()
  if (p && PROGRAM_TYPE_PUBLIC_LABEL[p]) return PROGRAM_TYPE_PUBLIC_LABEL[p]
  if (p === 'signature') return 'Signature Expeditions'
  if (p === 'custom') return 'Tailor Made'
  return 'Classic Nature'
}

function routeTabLabel(route: RoutesPagePublishedRouteRow): string {
  return route.shortLabel?.trim() || route.name?.trim() || route.slug?.trim() || 'Route'
}

/** CMS route order first; remaining routes keep default GROQ order. */
export function orderPublishedRoutes(
  routes: RoutesPagePublishedRouteRow[] | null | undefined,
  orderRefs: Array<{ _ref?: string | null } | string> | null | undefined,
): RoutesPagePublishedRouteRow[] {
  const all = routes ?? []
  const refs = (orderRefs ?? [])
    .map((r) => (typeof r === 'string' ? r : r?._ref ?? ''))
    .filter(Boolean)
  if (refs.length === 0) return all

  const byId = new Map(all.map((r) => [r._id ?? '', r]))
  const ordered: RoutesPagePublishedRouteRow[] = []
  const seen = new Set<string>()
  for (const ref of refs) {
    const route = byId.get(ref)
    if (route) {
      ordered.push(route)
      if (route._id) seen.add(route._id)
    }
  }
  for (const route of all) {
    if (route._id && seen.has(route._id)) continue
    ordered.push(route)
  }
  return ordered
}

/**
 * Tabs: “All routes” + one pill per published Route KC (menu order, then name).
 */
export function buildRoutesExpFiltersFromPublishedRoutes(
  routes: RoutesPagePublishedRouteRow[] | null | undefined,
): RoutesExpFilterPill[] {
  const pills: RoutesExpFilterPill[] = [{ id: ALL_ROUTES_FILTER_ID, label: ALL_ROUTES_LABEL }]
  for (const route of routes ?? []) {
    const slug = route.slug?.trim()
    if (!slug) continue
    pills.push({ id: slug, label: routeTabLabel(route) })
  }
  return pills
}

/**
 * Published experience pages whose Experience KC is `active` or `coming-soon` (or unset).
 * Cards without a resolvable route slug appear only under “All routes”.
 */
export function buildRoutesExpCardsFromListedExperiencePages(
  pages: RoutesPageListedExperiencePageRow[] | null | undefined,
  opts?: { ctaLabel?: string },
): RoutesExpCardStatic[] {
  const out: RoutesExpCardStatic[] = []
  for (const row of pages ?? []) {
    const card = toExperienceCardDataFromListedPage(row, opts)
    if (card) out.push({ ...card, route: card.routeSlug || '' })
  }
  return out
}
