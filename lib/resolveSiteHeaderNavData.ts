import {
  DEFAULT_WHATSAPP_URL,
  HEADER_NAV_ABOUT_SMART_LINK,
  HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT,
  HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK,
  HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT,
  HEADER_NAV_LODGES_SEE_ALL_BLOCK,
  HEADER_NAV_LODGE_GROUPS_DEFAULT,
  HEADER_NAV_ROUTES_SMART_LINK,
} from '@/data/cmsApproved/siteSettingsApprovedContent'
import { canonicalizeLodgeRouteSlug } from '@/data/lodgeSoqtapataResolverDefaults'
import { resolveRouteLabel } from '@/data/lodgeSoqtapataResolverDefaults'
import { formatExperienceNavPriceMeta } from '@/lib/formatExperiencePrice'
import { resolveExperiencePublicHref } from '@/lib/resolveExperiencePublicHref'
import {
  resolveSmartLinkOrLegacy,
  smartLinkIsDisabled,
  type ResolvedSmartLink,
  type SmartLinkGroq,
} from '@/lib/resolveSmartLink'
import {
  HEADER_NAV_BLOG_SMART_LINK_DEFAULT,
} from '@/lib/mergeHeaderSettings'
import type {
  HeaderNavLodgeRouteGroupRow,
  HeaderNavProgramGroupRow,
  HeaderNavProgramTypeGroupRow,
  HeaderNavRouteGroupOverrideRow,
  HeaderNavSeeAllRow,
  SiteHeaderNavExperiencePageRow,
  SiteHeaderNavLodgePageRow,
  SiteHeaderNavRouteNavRow,
  SiteHeaderNavSettingsRow,
} from '@/lib/siteHeaderNavQuery'

import type { ExperienceBookingSummary } from '@/components/booking/types'

export type SiteHeaderNavCta = {
  label: string
  href: string
  openInNewTab: boolean
  rel: string
  /** Tailor Made / book CTAs: opens plan or experience modal when href is `#`. */
  bookingModal?: 'plan' | 'experience'
  bookingSummary?: ExperienceBookingSummary
}


export type SiteHeaderNavExpItem = {
  id: string
  name: string
  href: string
  routeLine: string
  /** @deprecated Use `priceMeta`; kept for legacy callers. */
  metaLine?: string
  priceMeta: import('@/lib/formatExperiencePrice').ExperienceNavPriceMeta
  thumbUrl: string | null
}

export type SiteHeaderNavExpGroup = {
  panelId: string
  sidebarLabel: string
  sidebarMeta: string
  eyebrow: string
  items: SiteHeaderNavExpItem[]
}

export type SiteHeaderNavTailor = {
  panelId: string
  eyebrow: string
  title: string
  subtitle: string
  body: string
  imageUrl: string | null
  imageAlt: string | null
  cta: SiteHeaderNavCta | null
}

export type SiteHeaderNavLodgeItem = {
  id: string
  name: string
  href: string
  imageUrl: string | null
  badges: { label: string; tone: 'own' | 'alliance' | 'neutral' }[]
  description: string
  ctaLabel: string
}

export type SiteHeaderNavLodgeRoute = {
  panelId: string
  /** Canonical route slug from Route documents, or `__other__` for lodges with missing/unknown route. */
  routeSlug: string
  sidebarLabel: string
  sidebarMeta: string
  eyebrow: string
  lodges: SiteHeaderNavLodgeItem[]
}

export type ResolvedSiteHeaderNavExperiences = {
  sideMenuTitle: string
  tailorSidebarLabel: string
  /** Sidebar sublabel under Tailor Made (CMS `sidebarSubLabel`, not panel `subtitle`). */
  tailorSidebarSubLabel: string
  groups: SiteHeaderNavExpGroup[]
  tailorVisible: boolean
  tailor: SiteHeaderNavTailor
  seeAll: SiteHeaderNavCta | null
}

export type ResolvedSiteHeaderNavLodges = {
  sideMenuTitle: string
  routes: SiteHeaderNavLodgeRoute[]
  seeAll: SiteHeaderNavCta | null
}

export type ResolvedSiteHeaderNavTab = {
  key: string
  label: string
  simpleLink: SiteHeaderNavCta | null
  hasDropdown: boolean
  dropdownType: 'none' | 'experiences' | 'lodges'
  btnId: string
  ddId: string
  mobAccId: string
  experiences: ResolvedSiteHeaderNavExperiences | null
  lodges: ResolvedSiteHeaderNavLodges | null
}

export type ResolvedSiteHeaderNav = {
  tabs: ResolvedSiteHeaderNavTab[]
}

/** @deprecated Legacy chrome shape — used only when converting legacy resolver output to tabs. */
export type ResolvedSiteHeaderNavChrome = {
  experiences: { label: string; enabled: boolean }
  lodges: { label: string; enabled: boolean }
  routes: SiteHeaderNavCta | null
  about: SiteHeaderNavCta | null
  blog: SiteHeaderNavCta | null
}

type ExpBucket = 'classic' | 'signature' | 'learning'
type LodgeRK = 'camanti' | 'manu-road' | 'manu-core'

const TAILOR_FALLBACK = {
  eyebrow: 'Tailor Made',
  title: 'Design your program',
  subtitle: 'Any duration · Any group · Fully custom',
  body:
    'We build a program around your goals — school groups, researchers, families, or solo explorers. Any route, any duration.',
} as const

const BUCKET_META: Record<
  ExpBucket,
  {
    panelId: string
    legacyKey: 'classicNature' | 'signatureExpeditions' | 'experientialLearning'
    defaultLabel: string
    defaultOrder: number
  }
> = {
  classic: {
    panelId: 'dd-exp-classic',
    legacyKey: 'classicNature',
    defaultLabel: HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.classicNature.label,
    defaultOrder: HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.classicNature.order,
  },
  signature: {
    panelId: 'dd-exp-signature',
    legacyKey: 'signatureExpeditions',
    defaultLabel: HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.signatureExpeditions.label,
    defaultOrder: HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.signatureExpeditions.order,
  },
  learning: {
    panelId: 'dd-exp-learning',
    legacyKey: 'experientialLearning',
    defaultLabel: HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.experientialLearning.label,
    defaultOrder: HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.experientialLearning.order,
  },
}

const ROUTE_META: Record<
  LodgeRK,
  { panelId: string; legacyKey: 'camanti' | 'manuRoad' | 'manuCore'; defaultLabel: string; defaultOrder: number }
> = {
  camanti: {
    panelId: 'dd-lodges-camanti',
    legacyKey: 'camanti',
    defaultLabel: HEADER_NAV_LODGE_GROUPS_DEFAULT.camanti.label,
    defaultOrder: HEADER_NAV_LODGE_GROUPS_DEFAULT.camanti.order,
  },
  'manu-road': {
    panelId: 'dd-lodges-manu-road',
    legacyKey: 'manuRoad',
    defaultLabel: HEADER_NAV_LODGE_GROUPS_DEFAULT.manuRoad.label,
    defaultOrder: HEADER_NAV_LODGE_GROUPS_DEFAULT.manuRoad.order,
  },
  'manu-core': {
    panelId: 'dd-lodges-manu-core',
    legacyKey: 'manuCore',
    defaultLabel: HEADER_NAV_LODGE_GROUPS_DEFAULT.manuCore.label,
    defaultOrder: HEADER_NAV_LODGE_GROUPS_DEFAULT.manuCore.order,
  },
}

function programBucket(programType: string | null | undefined): ExpBucket | 'tailor' | null {
  const p = programType?.trim().toLowerCase() ?? ''
  if (p === 'nature-core') return 'classic'
  if (p === 'family-adventure') return 'signature'
  if (p === 'experiential-learning') return 'learning'
  if (p === 'tailor-made') return 'tailor'
  return null
}

function normalizeExpGroupKeyFromOverride(raw: string | null | undefined): ExpBucket | null {
  const t = raw?.trim().toLowerCase() ?? ''
  if (t === 'classic') return 'classic'
  if (t === 'signature') return 'signature'
  if (t === 'learning') return 'learning'
  return null
}

function formatExpRouteLine(exp: NonNullable<SiteHeaderNavExperiencePageRow['experience']>): string {
  return resolveRouteLabel(exp.route)
}

function panelIdForProgramType(programType: string): string {
  const safe = programType.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase()
  return `dd-exp-${safe || 'program'}`
}

function defaultLabelForProgramType(programType: string): string {
  const bucket = programBucket(programType)
  if (bucket && bucket !== 'tailor') return BUCKET_META[bucket].defaultLabel
  return programType
}

function ctaFromResolved(r: ResolvedSmartLink): SiteHeaderNavCta {
  return {
    label: r.label,
    href: r.href,
    openInNewTab: r.openInNewTab,
    rel: r.rel,
  }
}

function mergeSmartWithLabel(smart: SmartLinkGroq | null | undefined, labelFallback: string): SmartLinkGroq | null | undefined {
  if (!smart || typeof smart !== 'object') return smart
  const fb = labelFallback?.trim()
  if (fb) return { ...smart, label: fb }
  return smart
}

function effectiveSeeAllBlock(
  next: HeaderNavSeeAllRow | null | undefined,
  legacySmart: SmartLinkGroq | null | undefined,
  approved: { enabled: boolean; label: string; smartLink: SmartLinkGroq },
): HeaderNavSeeAllRow {
  if (next && (next.enabled !== undefined || next.label != null || next.smartLink != null)) {
    return {
      enabled: next.enabled !== false,
      label: next.label ?? null,
      smartLink: next.smartLink ?? null,
    }
  }
  if (legacySmart && typeof legacySmart === 'object') {
    return { enabled: true, label: null, smartLink: legacySmart }
  }
  return { enabled: approved.enabled, label: approved.label, smartLink: approved.smartLink }
}

function resolveSeeAllToCta(
  block: HeaderNavSeeAllRow,
  fallbackLabel: string,
  fallbackHref: string,
): SiteHeaderNavCta | null {
  if (block.enabled === false) return null
  const labelFb = block.label?.trim() || fallbackLabel
  const r = resolveSmartLinkOrLegacy(mergeSmartWithLabel(block.smartLink, labelFb), undefined, {
    label: labelFb,
    href: fallbackHref,
    openInNewTab: false,
  })
  if (!r || !r.href || r.href === '#') return null
  return ctaFromResolved(r)
}

const STRICT_LINK_STUB = { label: '', href: '#' } as const

function resolveSmartLinkStrict(smart: SmartLinkGroq | null | undefined): ResolvedSmartLink | null {
  if (!smart || smartLinkIsDisabled(smart)) return null
  const r = resolveSmartLinkOrLegacy(smart, undefined, STRICT_LINK_STUB)
  if (!r?.href || r.href === '#') return null
  return r
}

/** Header CMS only: see-all when explicitly enabled with a resolvable smart link. */
function resolveSeeAllFromCms(block: HeaderNavSeeAllRow | null | undefined): SiteHeaderNavCta | null {
  if (!block || block.enabled !== true) return null
  const smart = block.smartLink
  if (!smart) return null
  const label = block.label?.trim() || smart.label?.trim() || ''
  if (!label) return null
  const r = resolveSmartLinkStrict(smart)
  if (!r) return null
  return { ...ctaFromResolved(r), label }
}

/** Header CMS only: top-bar link when enabled with label + resolvable smart link. */
function resolveDirectNavCtaFromCms(opts: {
  enabled?: boolean | null
  label?: string | null
  smart?: SmartLinkGroq | null
}): SiteHeaderNavCta | null {
  if (opts.enabled !== true) return null
  const smart = opts.smart
  if (!smart) return null
  const label = opts.label?.trim() || smart.label?.trim() || ''
  if (!label) return null
  const r = resolveSmartLinkStrict(smart)
  if (!r) return null
  return { ...ctaFromResolved(r), label }
}

type LegacyNavBundle = {
  chrome: ResolvedSiteHeaderNavChrome
  experiences: ResolvedSiteHeaderNavExperiences & { enabled: boolean }
  lodges: ResolvedSiteHeaderNavLodges & { enabled: boolean }
}

function legacyNavBundleToTabs(bundle: LegacyNavBundle): ResolvedSiteHeaderNav {
  const tabs: ResolvedSiteHeaderNavTab[] = []

  if (bundle.chrome.experiences.enabled) {
    tabs.push({
      key: 'legacy-experiences',
      label: bundle.chrome.experiences.label,
      simpleLink: null,
      hasDropdown: true,
      dropdownType: 'experiences',
      btnId: 'site-nav-btn-legacy-experiences',
      ddId: 'site-nav-dd-legacy-experiences',
      mobAccId: 'mob-acc-legacy-experiences',
      experiences: {
        sideMenuTitle: bundle.experiences.sideMenuTitle,
        tailorSidebarLabel: bundle.experiences.tailorSidebarLabel,
        tailorSidebarSubLabel: bundle.experiences.tailorSidebarSubLabel,
        tailorVisible: bundle.experiences.tailorVisible,
        groups: bundle.experiences.groups,
        tailor: bundle.experiences.tailor,
        seeAll: bundle.experiences.seeAll,
      },
      lodges: null,
    })
  }

  if (bundle.chrome.lodges.enabled) {
    tabs.push({
      key: 'legacy-lodges',
      label: bundle.chrome.lodges.label,
      simpleLink: null,
      hasDropdown: true,
      dropdownType: 'lodges',
      btnId: 'site-nav-btn-legacy-lodges',
      ddId: 'site-nav-dd-legacy-lodges',
      mobAccId: 'mob-acc-legacy-lodges',
      experiences: null,
      lodges: {
        sideMenuTitle: bundle.lodges.sideMenuTitle,
        routes: bundle.lodges.routes,
        seeAll: bundle.lodges.seeAll,
      },
    })
  }

  const pushDirect = (key: string, cta: SiteHeaderNavCta | null) => {
    if (!cta) return
    tabs.push({
      key,
      label: cta.label,
      simpleLink: cta,
      hasDropdown: false,
      dropdownType: 'none',
      btnId: `site-nav-btn-${key}`,
      ddId: `site-nav-dd-${key}`,
      mobAccId: `mob-acc-${key}`,
      experiences: null,
      lodges: null,
    })
  }

  pushDirect('legacy-routes', bundle.chrome.routes)
  pushDirect('legacy-about', bundle.chrome.about)
  pushDirect('legacy-blog', bundle.chrome.blog)

  return { tabs }
}

function headerSettingsProgramGroupConfigs(
  settings: SiteHeaderNavSettingsRow,
): Array<{ programType: string; label: string; enabled: boolean; order: number }> {
  return (settings.programGroups ?? [])
    .filter(
      (g): g is HeaderNavProgramTypeGroupRow & { programType: string } =>
        Boolean(g?.programType?.trim()) && g.programType !== 'tailor-made',
    )
    .map((g) => ({
      programType: g.programType!.trim().toLowerCase(),
      label: g.label?.trim() ?? '',
      enabled: g.showInMenu !== false,
      order: typeof g.order === 'number' && Number.isFinite(g.order) ? g.order : 999,
    }))
}

function resolveTailorGroupFromHeaderSettings(
  settings: SiteHeaderNavSettingsRow,
): HeaderNavProgramTypeGroupRow | null {
  return (settings.programGroups ?? []).find((g) => g?.programType === 'tailor-made') ?? null
}

function resolveDirectNavCta(opts: {
  enabled: boolean | null | undefined
  label: string | null | undefined
  smart: SmartLinkGroq | null | undefined
  defaultLabel: string
  defaultHref: string
  seedSmart: SmartLinkGroq
}): SiteHeaderNavCta | null {
  if (opts.enabled === false) return null
  const explicit = opts.label?.trim() || opts.defaultLabel
  const raw = opts.smart
  if (raw && smartLinkIsDisabled(raw)) return null
  const smart = raw ?? opts.seedSmart
  const r = resolveSmartLinkOrLegacy(mergeSmartWithLabel(smart, explicit), undefined, {
    label: explicit,
    href: opts.defaultHref,
    openInNewTab: false,
  })
  if (!r) return null
  return { ...ctaFromResolved(r), label: explicit }
}

function legacyExpProgramRow(settings: SiteHeaderNavSettingsRow | null | undefined, bucket: ExpBucket): HeaderNavProgramGroupRow {
  const lk = BUCKET_META[bucket].legacyKey
  const g = settings?.experiencesGroups?.[lk]
  const d = HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT[lk]
  return {
    label: g?.label ?? d.label,
    enabled: g?.enabled ?? d.enabled,
    order: g?.order ?? d.order,
  }
}

function legacyTailorRow(settings: SiteHeaderNavSettingsRow | null | undefined): HeaderNavProgramGroupRow {
  const g = settings?.experiencesGroups?.tailorMade
  const d = HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.tailorMade
  return {
    label: g?.label ?? d.label,
    enabled: g?.enabled ?? d.enabled,
    order: g?.order ?? d.order,
  }
}

function legacyLodgeRouteRow(settings: SiteHeaderNavSettingsRow | null | undefined, rk: LodgeRK): HeaderNavLodgeRouteGroupRow {
  const lk = ROUTE_META[rk].legacyKey
  const g = settings?.lodgeGroups?.[lk]
  const d = HEADER_NAV_LODGE_GROUPS_DEFAULT[lk]
  return {
    label: g?.label ?? d.label,
    enabled: g?.enabled ?? d.enabled,
    order: g?.order ?? d.order,
  }
}

/** Merge new array overrides → legacy nested object → defaults. */
function effectiveExpGroupConfig(
  settings: SiteHeaderNavSettingsRow | null | undefined,
  bucket: ExpBucket,
): { label: string; enabled: boolean; order: number } {
  const base = BUCKET_META[bucket]
  const fromArr = (settings?.experiencesGroupOverrides ?? []).find(
    (r) => normalizeExpGroupKeyFromOverride(r.groupKey) === bucket,
  )
  const legacy = legacyExpProgramRow(settings, bucket)
  const label = fromArr?.labelOverride?.trim() || legacy.label?.trim() || base.defaultLabel
  const enabled = fromArr?.showInMenu !== false && legacy.enabled !== false
  const orderRaw = fromArr?.order ?? legacy.order ?? base.defaultOrder
  const order = typeof orderRaw === 'number' && Number.isFinite(orderRaw) ? orderRaw : base.defaultOrder
  return { label, enabled, order }
}

function tailorMenuResolved(settings: SiteHeaderNavSettingsRow | null | undefined): { enabled: boolean; label: string } {
  const t = settings?.experiencesTailorMenu
  if (t && (t.enabled !== undefined || t.label != null)) {
    return {
      enabled: t.enabled !== false,
      label: t.label?.trim() || HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT.label,
    }
  }
  const legacy = legacyTailorRow(settings)
  return {
    enabled: legacy.enabled !== false,
    label: legacy.label?.trim() || HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT.label,
  }
}

function experienceItemOverrideMap(
  settings: SiteHeaderNavSettingsRow | null | undefined,
): Map<string, { show?: boolean | null; label?: string | null; order?: number | null }> {
  const m = new Map<string, { show?: boolean | null; label?: string | null; order?: number | null }>()
  for (const row of settings?.experiencesItemOverrides ?? []) {
    const id = row.experiencePageId?.trim()
    if (!id) continue
    m.set(id, { show: row.showInMenu, label: row.labelOverride, order: row.order })
  }
  return m
}

function lodgeItemOverrideMap(
  settings: SiteHeaderNavSettingsRow | null | undefined,
): Map<string, { show?: boolean | null; label?: string | null; order?: number | null }> {
  const m = new Map<string, { show?: boolean | null; label?: string | null; order?: number | null }>()
  for (const row of settings?.lodgesItemOverrides ?? []) {
    const id = row.lodgePageId?.trim()
    if (!id) continue
    m.set(id, { show: row.showInMenu, label: row.labelOverride, order: row.order })
  }
  return m
}

const OTHER_ROUTE_SLUG = '__other__' as const

function panelIdForLodgeRouteSlug(slug: string): string {
  if (slug === OTHER_ROUTE_SLUG) return 'dd-lodges-other'
  const safe = slug.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase()
  return `dd-lodges-${safe || 'route'}`
}

function trimUrl(s: string | null | undefined): string | null {
  const t = s?.trim()
  return t || null
}

function lodgeMenuImageUrl(row: SiteHeaderNavLodgePageRow): string | null {
  return trimUrl(row.menuThumbnailImageUrl) || null
}

function lodgeMenuBadges(row: SiteHeaderNavLodgePageRow): { label: string; tone: 'own' | 'alliance' | 'neutral' }[] {
  const hl = row.heroHighlights?.filter(Boolean) as { text?: string | null }[] | undefined
  if (!hl?.length) return []
  return hl
    .map((h) => {
      const t = h?.text?.trim()
      return t ? { label: t, tone: 'neutral' as const } : null
    })
    .filter(Boolean) as { label: string; tone: 'own' | 'alliance' | 'neutral' }[]
}

function lodgeMenuDescription(row: SiteHeaderNavLodgePageRow): string {
  const fromHero = row.heroShortDescription?.trim()
  if (fromHero) return fromHero
  return row.lodge?.shortDescription?.trim() || ''
}

type LodgeRouteCol = { slug: string; panelId: string; label: string; order: number }

function applyRouteGroupOverrides(
  cols: LodgeRouteCol[],
  overrides: HeaderNavRouteGroupOverrideRow[] | null | undefined,
): LodgeRouteCol[] {
  if (!overrides?.length) return cols
  const bySlug = new Map(cols.map((c) => [c.slug, { ...c }]))
  for (const ov of overrides) {
    const slug = ov.route?.slug?.trim().toLowerCase()
    if (!slug) continue
    if (ov.showInMenu === false) {
      bySlug.delete(slug)
      continue
    }
    const label = (ov.labelOverride?.trim() || ov.route?.shortLabel?.trim() || ov.route?.name?.trim() || slug).trim()
    const order = typeof ov.order === 'number' && Number.isFinite(ov.order) ? ov.order : 999
    const existing = bySlug.get(slug)
    if (existing) {
      bySlug.set(slug, { ...existing, label, order })
    } else {
      bySlug.set(slug, { slug, panelId: panelIdForLodgeRouteSlug(slug), label, order })
    }
  }
  return [...bySlug.values()].sort((a, b) =>
    a.order !== b.order ? a.order - b.order : a.label.localeCompare(b.label),
  )
}

function buildLodgeRouteColumns(
  settings: SiteHeaderNavSettingsRow | null | undefined,
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined,
): LodgeRouteCol[] {
  const docs = Array.isArray(routeNavDocs) ? routeNavDocs : []
  const fromCms: LodgeRouteCol[] = []
  for (const d of docs) {
    const slug = d.slug?.trim().toLowerCase()
    if (!slug || d.showInMenu === false) continue
    const order = typeof d.menuOrder === 'number' && Number.isFinite(d.menuOrder) ? d.menuOrder : 999
    const label = (d.shortLabel?.trim() || d.name?.trim() || slug).trim()
    fromCms.push({ slug, panelId: panelIdForLodgeRouteSlug(slug), label, order })
  }
  fromCms.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.label.localeCompare(b.label)))
  if (fromCms.length) {
    return applyRouteGroupOverrides(fromCms, settings?.routeGroupOverrides)
  }

  if (settings?.usesHeaderSettings) {
    return applyRouteGroupOverrides([], settings?.routeGroupOverrides)
  }

  const legacyKeys: LodgeRK[] = ['camanti', 'manu-road', 'manu-core']
  const out: LodgeRouteCol[] = []
  for (const rk of legacyKeys) {
    const leg = legacyLodgeRouteRow(settings, rk)
    if (leg.enabled === false) continue
    const meta = ROUTE_META[rk]
    out.push({
      slug: rk,
      panelId: meta.panelId,
      label: (leg.label?.trim() || meta.defaultLabel).trim(),
      order: typeof leg.order === 'number' ? leg.order : meta.defaultOrder,
    })
  }
  out.sort((a, b) => a.order - b.order)
  return out
}

function sortLodgeTmpList(
  arr: { it: SiteHeaderNavLodgeItem; sk: number; sn: string }[],
): SiteHeaderNavLodgeItem[] {
  const copy = [...arr]
  copy.sort((a, z) => {
    if (a.sk !== z.sk) return a.sk - z.sk
    return a.sn.localeCompare(z.sn)
  })
  return copy.map((x) => x.it)
}

function emptyNav(): LegacyNavBundle {
  const routes = resolveDirectNavCta({
    enabled: true,
    label: 'Routes',
    smart: HEADER_NAV_ROUTES_SMART_LINK,
    defaultLabel: 'Routes',
    defaultHref: '/routes',
    seedSmart: HEADER_NAV_ROUTES_SMART_LINK,
  })
  const about = resolveDirectNavCta({
    enabled: true,
    label: 'About',
    smart: HEADER_NAV_ABOUT_SMART_LINK,
    defaultLabel: 'About',
    defaultHref: '/about',
    seedSmart: HEADER_NAV_ABOUT_SMART_LINK,
  })
  const blog = resolveDirectNavCta({
    enabled: false,
    label: 'Blog',
    smart: HEADER_NAV_BLOG_SMART_LINK_DEFAULT,
    defaultLabel: 'Blog',
    defaultHref: '/journal',
    seedSmart: HEADER_NAV_BLOG_SMART_LINK_DEFAULT,
  })
  const fbExp = resolveSeeAllToCta(
    effectiveSeeAllBlock(undefined, undefined, {
      enabled: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.enabled,
      label: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.label,
      smartLink: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.smartLink,
    }),
    'All experiences',
    '/#experiences',
  )
  const fbLodges = resolveSeeAllToCta(
    effectiveSeeAllBlock(undefined, undefined, {
      enabled: HEADER_NAV_LODGES_SEE_ALL_BLOCK.enabled,
      label: HEADER_NAV_LODGES_SEE_ALL_BLOCK.label,
      smartLink: HEADER_NAV_LODGES_SEE_ALL_BLOCK.smartLink,
    }),
    'All lodges',
    '/lodges',
  )
  const fbTailor = resolveSmartLinkOrLegacy(undefined, undefined, {
    label: 'Enquire',
    href: DEFAULT_WHATSAPP_URL,
    openInNewTab: true,
  })
  const tailorRow = tailorMenuResolved(null)
  return {
    chrome: {
      experiences: { label: 'Experiences', enabled: true },
      lodges: { label: 'Lodges', enabled: true },
      routes,
      about,
      blog,
    },
    experiences: {
      enabled: true,
      sideMenuTitle: 'PROGRAMS',
      tailorSidebarLabel: tailorRow.label,
      tailorSidebarSubLabel: '',
      tailorVisible: tailorRow.enabled,
      groups: [],
      tailor: {
        panelId: 'dd-exp-tailor',
        eyebrow: tailorRow.label,
        title: TAILOR_FALLBACK.title,
        subtitle: TAILOR_FALLBACK.subtitle,
        body: TAILOR_FALLBACK.body,
        imageUrl: null,
        imageAlt: null,
        cta: fbTailor ? ctaFromResolved(fbTailor) : null,
      },
      seeAll: fbExp,
    },
    lodges: {
      enabled: true,
      sideMenuTitle: 'BY ROUTE',
      routes: [],
      seeAll: fbLodges,
    },
  }
}

function effectiveProgramGroupConfigs(
  settings: SiteHeaderNavSettingsRow | null | undefined,
): Array<{ programType: string; label: string; enabled: boolean; order: number }> {
  const fromSettings = (settings?.programGroups ?? []).filter(
    (g): g is HeaderNavProgramTypeGroupRow & { programType: string } =>
      Boolean(g?.programType?.trim()) && g.programType !== 'tailor-made',
  )
  if (settings?.usesHeaderSettings) {
    return fromSettings.map((g) => ({
      programType: g.programType!.trim().toLowerCase(),
      label: g.label?.trim() || defaultLabelForProgramType(g.programType!),
      enabled: g.showInMenu !== false,
      order: typeof g.order === 'number' && Number.isFinite(g.order) ? g.order : 999,
    }))
  }
  if (fromSettings.length) {
    return fromSettings.map((g) => ({
      programType: g.programType!.trim().toLowerCase(),
      label: g.label?.trim() || defaultLabelForProgramType(g.programType!),
      enabled: g.showInMenu !== false,
      order: typeof g.order === 'number' && Number.isFinite(g.order) ? g.order : 999,
    }))
  }
  const buckets: ExpBucket[] = ['classic', 'signature', 'learning']
  return buckets.map((bucket) => {
    const cfg = effectiveExpGroupConfig(settings, bucket)
    const pt =
      bucket === 'classic' ? 'nature-core' : bucket === 'signature' ? 'family-adventure' : 'experiential-learning'
    return { programType: pt, label: cfg.label, enabled: cfg.enabled, order: cfg.order }
  })
}

function resolveTailorGroup(
  settings: SiteHeaderNavSettingsRow | null | undefined,
): HeaderNavProgramTypeGroupRow | null {
  const fromGroups = (settings?.programGroups ?? []).find((g) => g.programType === 'tailor-made')
  if (fromGroups) return fromGroups
  if (settings?.usesHeaderSettings) return null
  const menu = tailorMenuResolved(settings)
  return {
    programType: 'tailor-made',
    label: menu.label,
    showInMenu: menu.enabled,
    title: settings?.navTailorMadeTitle,
    subtitle: settings?.navTailorMadeSubtitle,
    body: settings?.navTailorMadeBody,
    ctaSmartLink: settings?.navTailorMadeSmartLink,
  }
}

export function resolveSiteHeaderNavData(
  settings: SiteHeaderNavSettingsRow | null | undefined,
  experiencePages: SiteHeaderNavExperiencePageRow[] | null | undefined,
  lodgePages: SiteHeaderNavLodgePageRow[] | null | undefined,
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined,
): ResolvedSiteHeaderNav {
  const base = emptyNav()
  const pages = Array.isArray(experiencePages) ? experiencePages : []
  const lodges = Array.isArray(lodgePages) ? lodgePages : []

  base.chrome.experiences = {
    label: settings?.experiencesLabel?.trim() || 'Experiences',
    enabled: settings?.experiencesEnabled !== false,
  }
  base.chrome.lodges = {
    label: settings?.lodgesLabel?.trim() || 'Lodges',
    enabled: settings?.lodgesEnabled !== false,
  }
  base.chrome.routes = resolveDirectNavCta({
    enabled: settings?.routesEnabled,
    label: settings?.routesLabel,
    smart: settings?.routesLinkSmartLink ?? undefined,
    defaultLabel: 'Routes',
    defaultHref: '/routes',
    seedSmart: HEADER_NAV_ROUTES_SMART_LINK,
  })
  base.chrome.about = resolveDirectNavCta({
    enabled: settings?.aboutEnabled,
    label: settings?.aboutLabel,
    smart: settings?.aboutLinkSmartLink ?? undefined,
    defaultLabel: 'About',
    defaultHref: '/about',
    seedSmart: HEADER_NAV_ABOUT_SMART_LINK,
  })
  base.chrome.blog = resolveDirectNavCta({
    enabled: settings?.blogEnabled,
    label: settings?.blogLabel,
    smart: settings?.blogLinkSmartLink ?? undefined,
    defaultLabel: 'Blog',
    defaultHref: '/journal',
    seedSmart: HEADER_NAV_BLOG_SMART_LINK_DEFAULT,
  })

  const expItemOv = experienceItemOverrideMap(settings)
  type ExpTmp = { it: SiteHeaderNavExpItem; sk: number; sn: string }
  const byProgramType = new Map<string, ExpTmp[]>()

  for (const row of pages) {
    const slug = row.pageSlug?.trim()
    const exp = row.experience
    const pageId = row._id?.trim()
    if (!slug || !exp?.name?.trim() || !pageId) continue
    const programType = exp.programType?.trim().toLowerCase() ?? ''
    if (!programType || programType === 'tailor-made') continue
    const io = expItemOv.get(pageId)
    if (io?.show === false) continue
    const href = resolveExperiencePublicHref({ experienceLandingSlug: slug })
    if (!href) continue
    const sk = (typeof io?.order === 'number' ? io.order : row.headerNavOrder) ?? 999
    const name = io?.label?.trim() || exp.name!.trim()
    const thumb =
      exp.navImageUrl?.trim() || exp.mainImageUrl?.trim() || null
    const item: SiteHeaderNavExpItem = {
      id: pageId,
      name,
      href,
      routeLine: formatExpRouteLine(exp),
      priceMeta: formatExperienceNavPriceMeta(exp),
      thumbUrl: thumb,
    }
    const list = byProgramType.get(programType) ?? []
    list.push({ it: item, sk, sn: name.toLowerCase() })
    byProgramType.set(programType, list)
  }

  for (const list of byProgramType.values()) {
    list.sort((a, z) => (a.sk !== z.sk ? a.sk - z.sk : a.sn.localeCompare(z.sn)))
  }

  const groupConfigs = effectiveProgramGroupConfigs(settings)
  const expGroupsBuilt: Array<{
    order: number
    panelId: string
    sidebarLabel: string
    sidebarMeta: string
    eyebrow: string
    items: SiteHeaderNavExpItem[]
  }> = []

  for (const cfg of groupConfigs) {
    if (!cfg.enabled) continue
    const tmp = byProgramType.get(cfg.programType) ?? []
    const items = tmp.map((x) => x.it)
    if (!items.length) continue
    expGroupsBuilt.push({
      order: cfg.order,
      panelId: panelIdForProgramType(cfg.programType),
      sidebarLabel: cfg.label,
      sidebarMeta: `${items.length} program${items.length === 1 ? '' : 's'}`,
      eyebrow: cfg.label,
      items,
    })
  }
  expGroupsBuilt.sort((a, b) => a.order - b.order)

  if (expGroupsBuilt.length === 0) {
    const shells: typeof expGroupsBuilt = []
    for (const cfg of groupConfigs) {
      if (!cfg.enabled) continue
      shells.push({
        order: cfg.order,
        panelId: panelIdForProgramType(cfg.programType),
        sidebarLabel: cfg.label,
        sidebarMeta: '0 programs',
        eyebrow: cfg.label,
        items: [],
      })
    }
    shells.sort((a, b) => a.order - b.order)
    if (shells.length) expGroupsBuilt.push(...shells)
    else if (groupConfigs[0] && !settings?.usesHeaderSettings) {
      const cfg = groupConfigs[0]
      expGroupsBuilt.push({
        order: cfg.order,
        panelId: panelIdForProgramType(cfg.programType),
        sidebarLabel: cfg.label,
        sidebarMeta: '0 programs',
        eyebrow: cfg.label,
        items: [],
      })
    }
  }

  const tailorMenu = tailorMenuResolved(settings)
  const tailorGroup = resolveTailorGroup(settings)
  base.experiences.enabled = settings?.experiencesEnabled !== false
  base.experiences.sideMenuTitle = settings?.experiencesSideMenuTitle?.trim() || 'PROGRAMS'
  base.experiences.tailorVisible = tailorGroup?.showInMenu !== false && tailorMenu.enabled
  base.experiences.tailorSidebarLabel = tailorGroup?.label?.trim() || tailorMenu.label
  base.experiences.tailorSidebarSubLabel = tailorGroup?.sidebarSubLabel?.trim() ?? ''
  base.experiences.groups = expGroupsBuilt.map(({ order: _o, ...rest }) => rest)

  const expSeeBlock = settings?.usesHeaderSettings
    ? ({
        enabled: settings?.experiencesSeeAll?.enabled !== false && Boolean(settings?.experiencesSeeAll),
        label: settings?.experiencesSeeAll?.label ?? null,
        smartLink: settings?.experiencesSeeAll?.smartLink ?? null,
      } satisfies HeaderNavSeeAllRow)
    : effectiveSeeAllBlock(settings?.experiencesSeeAll, settings?.navExperiencesSeeAllSmartLink, {
        enabled: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.enabled,
        label: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.label,
        smartLink: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.smartLink,
      })
  base.experiences.seeAll = resolveSeeAllToCta(expSeeBlock, 'All experiences', '/#experiences')

  const tailorCtaLabel = tailorGroup?.ctaLabel?.trim() || 'Enquire'
  const tailorResolved = resolveSmartLinkOrLegacy(
    tailorGroup?.ctaSmartLink ?? settings?.navTailorMadeSmartLink,
    undefined,
    {
      label: tailorCtaLabel,
      href: DEFAULT_WHATSAPP_URL,
      openInNewTab: true,
    },
  )
  const tailorImageUrl = tailorGroup?.imageUrl?.trim() || null
  base.experiences.tailor = {
    panelId: 'dd-exp-tailor',
    eyebrow: tailorGroup?.eyebrow?.trim() || base.experiences.tailorSidebarLabel,
    title: tailorGroup?.title?.trim() || settings?.navTailorMadeTitle?.trim() || TAILOR_FALLBACK.title,
    subtitle:
      tailorGroup?.subtitle?.trim() || settings?.navTailorMadeSubtitle?.trim() || TAILOR_FALLBACK.subtitle,
    body: tailorGroup?.body?.trim() || settings?.navTailorMadeBody?.trim() || TAILOR_FALLBACK.body,
    imageUrl: tailorImageUrl,
    imageAlt: tailorGroup?.imageAlt?.trim() || null,
    cta: tailorResolved
      ? {
          label: tailorCtaLabel || tailorResolved.label,
          href: tailorResolved.href,
          openInNewTab: tailorResolved.openInNewTab,
          rel: tailorResolved.rel,
        }
      : null,
  }

  const lodgeItemOv = lodgeItemOverrideMap(settings)
  type LodgeTmp = { it: SiteHeaderNavLodgeItem; sk: number; sn: string }

  const routeColsBase = buildLodgeRouteColumns(settings, routeNavDocs)
  const knownSlugs = new Set(routeColsBase.map((c) => c.slug))
  const bySlug = new Map<string, LodgeTmp[]>()
  for (const c of routeColsBase) bySlug.set(c.slug, [])
  const otherBucket: LodgeTmp[] = []

  for (const row of lodges) {
    const pageSlug = row.pageSlug?.trim()
    const lodge = row.lodge
    const pageId = row._id?.trim()
    if (!pageSlug || !lodge?.name?.trim() || !pageId) continue

    const canon = canonicalizeLodgeRouteSlug(lodge.route)
    const bucketSlug = canon && knownSlugs.has(canon) ? canon : OTHER_ROUTE_SLUG

    const io = lodgeItemOv.get(pageId)
    if (io?.show === false) continue
    const sk = (typeof io?.order === 'number' ? io.order : row.headerNavOrder) ?? 999
    const href = `/lodges/${pageSlug}`
    const ctaLabel = 'View lodge'

    const name = io?.label?.trim() || row.heroTitle?.trim() || lodge.name.trim()
    const item: SiteHeaderNavLodgeItem = {
      id: pageId,
      name,
      href,
      imageUrl: lodgeMenuImageUrl(row),
      badges: lodgeMenuBadges(row).slice(0, 3),
      description: lodgeMenuDescription(row),
      ctaLabel,
    }
    const tmp: LodgeTmp = { it: item, sk, sn: name.toLowerCase() }
    if (bucketSlug === OTHER_ROUTE_SLUG) otherBucket.push(tmp)
    else {
      const list = bySlug.get(bucketSlug)
      if (list) list.push(tmp)
      else otherBucket.push(tmp)
    }
  }

  base.lodges.enabled = settings?.lodgesEnabled !== false
  base.lodges.sideMenuTitle = settings?.lodgesSideMenuTitle?.trim() || 'BY ROUTE'

  const colsForShells: LodgeRouteCol[] = [...routeColsBase]
  if (otherBucket.length) {
    colsForShells.push({
      slug: OTHER_ROUTE_SLUG,
      panelId: panelIdForLodgeRouteSlug(OTHER_ROUTE_SLUG),
      label: 'Other',
      order: 100000,
    })
  }
  colsForShells.sort((a, b) => a.order - b.order)

  const lodgeRoutesBuilt: SiteHeaderNavLodgeRoute[] = colsForShells.map((col) => {
    const rawTmp = col.slug === OTHER_ROUTE_SLUG ? otherBucket : bySlug.get(col.slug) ?? []
    const lodgesSorted = sortLodgeTmpList(rawTmp)
    return {
      panelId: col.panelId,
      routeSlug: col.slug,
      sidebarLabel: col.label,
      sidebarMeta: `${lodgesSorted.length} lodge${lodgesSorted.length === 1 ? '' : 's'}`,
      eyebrow: col.label,
      lodges: lodgesSorted,
    }
  })

  base.lodges.routes = lodgeRoutesBuilt.length ? lodgeRoutesBuilt : buildLodgeRouteColumns(settings, routeNavDocs).map((col) => ({
    panelId: col.panelId,
    routeSlug: col.slug,
    sidebarLabel: col.label,
    sidebarMeta: '0 lodges',
    eyebrow: col.label,
    lodges: [],
  }))

  const lodgeSeeBlock = settings?.usesHeaderSettings
    ? ({
        enabled: settings?.lodgesSeeAll?.enabled !== false && Boolean(settings?.lodgesSeeAll),
        label: settings?.lodgesSeeAll?.label ?? null,
        smartLink: settings?.lodgesSeeAll?.smartLink ?? null,
      } satisfies HeaderNavSeeAllRow)
    : effectiveSeeAllBlock(settings?.lodgesSeeAll, settings?.navLodgesSeeAllSmartLink, {
        enabled: HEADER_NAV_LODGES_SEE_ALL_BLOCK.enabled,
        label: HEADER_NAV_LODGES_SEE_ALL_BLOCK.label,
        smartLink: HEADER_NAV_LODGES_SEE_ALL_BLOCK.smartLink,
      })
  base.lodges.seeAll = resolveSeeAllToCta(lodgeSeeBlock, 'All lodges', '/lodges')

  return legacyNavBundleToTabs(base)
}
