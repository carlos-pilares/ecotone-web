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
import { LODGE_SOQTAPATA_PAGE_SLUG } from '@/lib/lodgePageCmsTypes'
import { formatLodgeAltitudeForSubtitle } from '@/lib/lodgeAltitudeDisplay'
import { resolveRouteLabel } from '@/data/lodgeSoqtapataResolverDefaults'
import { resolveExperiencePublicSlug } from '@/lib/resolveExperiencePublicHref'
import {
  resolveSmartLinkOrLegacy,
  smartLinkIsDisabled,
  type ResolvedSmartLink,
  type SmartLinkGroq,
} from '@/lib/resolveSmartLink'
import type {
  HeaderNavLodgeRouteGroupRow,
  HeaderNavProgramGroupRow,
  HeaderNavSeeAllRow,
  SiteHeaderNavExperiencePageRow,
  SiteHeaderNavLodgePageRow,
  SiteHeaderNavSettingsRow,
} from '@/lib/siteHeaderNavQuery'

export type SiteHeaderNavCta = {
  label: string
  href: string
  openInNewTab: boolean
  rel: string
}

export type SiteHeaderNavChrome = {
  experiences: { label: string; enabled: boolean }
  lodges: { label: string; enabled: boolean }
  routes: SiteHeaderNavCta | null
  about: SiteHeaderNavCta | null
}

export type SiteHeaderNavExpItem = {
  id: string
  name: string
  href: string
  routeLine: string
  metaLine: string
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
  cta: SiteHeaderNavCta | null
}

export type SiteHeaderNavLodgeItem = {
  id: string
  name: string
  href: string
  imageUrl: string | null
  badges: { label: string; tone: 'own' | 'alliance' | 'neutral' }[]
  description: string
}

export type SiteHeaderNavLodgeRoute = {
  panelId: string
  routeKey: 'camanti' | 'manu-road' | 'manu-core'
  sidebarLabel: string
  sidebarMeta: string
  eyebrow: string
  lodges: SiteHeaderNavLodgeItem[]
}

export type ResolvedSiteHeaderNav = {
  chrome: SiteHeaderNavChrome
  experiences: {
    enabled: boolean
    tailorSidebarLabel: string
    groups: SiteHeaderNavExpGroup[]
    tailorVisible: boolean
    tailor: SiteHeaderNavTailor
    seeAll: SiteHeaderNavCta | null
  }
  lodges: {
    enabled: boolean
    routes: SiteHeaderNavLodgeRoute[]
    seeAll: SiteHeaderNavCta | null
  }
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

function lodgeRouteKeyFromLodge(route: string | null | undefined): LodgeRK | null {
  const r = route?.trim().toLowerCase() ?? ''
  if (r === 'camanti') return 'camanti'
  if (r === 'manu-road' || r === 'manuroad') return 'manu-road'
  if (r === 'manu-core' || r === 'manucore') return 'manu-core'
  return null
}

function normalizeLodgeRouteOverrideKey(raw: string | null | undefined): LodgeRK | null {
  const t = raw?.trim().toLowerCase() ?? ''
  if (t === 'camanti') return 'camanti'
  if (t === 'manu-road' || t === 'manuroad') return 'manu-road'
  if (t === 'manu-core' || t === 'manucore') return 'manu-core'
  return null
}

function formatExpMeta(exp: NonNullable<SiteHeaderNavExperiencePageRow['experience']>): string {
  const routeLbl = resolveRouteLabel(exp.route)
  const dur = exp.duration?.trim() || ''
  const pl = exp.priceLabel?.trim() ?? ''
  const hasPrice = typeof exp.price === 'number' && exp.price > 0
  const pricePart = pl || (hasPrice ? `from USD ${exp.price}` : 'Enquire')
  return [routeLbl, dur, pricePart].filter(Boolean).join(' · ')
}

function formatExpRouteLine(exp: NonNullable<SiteHeaderNavExperiencePageRow['experience']>): string {
  const routeLbl = resolveRouteLabel(exp.route)
  const dur = exp.duration?.trim() || ''
  return [routeLbl, dur].filter(Boolean).join(' · ')
}

function lodgeBadges(certs: SiteHeaderNavLodgePageRow['lodge']): { label: string; tone: 'own' | 'alliance' | 'neutral' }[] {
  const list = certs?.certifications?.filter(Boolean) as { label?: string | null }[] | undefined
  if (!list?.length) return []
  return list
    .map((c) => (c?.label?.trim() ? { label: c.label!.trim(), tone: 'neutral' as const } : null))
    .filter(Boolean) as { label: string; tone: 'own' | 'alliance' | 'neutral' }[]
}

function lodgeDescription(lodge: NonNullable<SiteHeaderNavLodgePageRow['lodge']>): string {
  const sd = lodge.shortDescription?.trim()
  if (sd) return sd
  const bits: string[] = []
  const alt = formatLodgeAltitudeForSubtitle(lodge.altitude)
  if (alt) bits.push(alt)
  if (lodge.location?.trim()) bits.push(lodge.location.trim())
  return bits.join(' · ')
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
  const lb = smart.label?.trim()
  if (lb) return smart
  return { ...smart, label: labelFallback }
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

function effectiveLodgeRouteConfig(
  settings: SiteHeaderNavSettingsRow | null | undefined,
  rk: LodgeRK,
): { label: string; enabled: boolean; order: number } {
  const base = ROUTE_META[rk]
  const fromArr = (settings?.lodgesRouteOverrides ?? []).find((r) => normalizeLodgeRouteOverrideKey(r.routeKey) === rk)
  const legacy = legacyLodgeRouteRow(settings, rk)
  const label = fromArr?.labelOverride?.trim() || legacy.label?.trim() || base.defaultLabel
  const enabled = fromArr?.showInMenu !== false && legacy.enabled !== false
  const order = fromArr?.order ?? legacy.order ?? base.defaultOrder
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

function emptyNav(): ResolvedSiteHeaderNav {
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
    `/lodges/${LODGE_SOQTAPATA_PAGE_SLUG}`,
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
    },
    experiences: {
      enabled: true,
      tailorSidebarLabel: tailorRow.label,
      tailorVisible: tailorRow.enabled,
      groups: [],
      tailor: {
        panelId: 'dd-exp-tailor',
        eyebrow: tailorRow.label,
        title: TAILOR_FALLBACK.title,
        subtitle: TAILOR_FALLBACK.subtitle,
        body: TAILOR_FALLBACK.body,
        cta: fbTailor ? ctaFromResolved(fbTailor) : null,
      },
      seeAll: fbExp,
    },
    lodges: {
      enabled: true,
      routes: [],
      seeAll: fbLodges,
    },
  }
}

export function resolveSiteHeaderNavData(
  settings: SiteHeaderNavSettingsRow | null | undefined,
  experiencePages: SiteHeaderNavExperiencePageRow[] | null | undefined,
  lodgePages: SiteHeaderNavLodgePageRow[] | null | undefined,
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

  const expItemOv = experienceItemOverrideMap(settings)
  type ExpTmp = { it: SiteHeaderNavExpItem; sk: number; sn: string }
  const bucketsTmp: Record<ExpBucket, ExpTmp[]> = {
    classic: [],
    signature: [],
    learning: [],
  }

  for (const row of pages) {
    const slug = row.pageSlug?.trim()
    const exp = row.experience
    const pageId = row._id?.trim()
    if (!slug || !exp?.name?.trim() || !pageId) continue
    const bucket = programBucket(exp.programType)
    if (bucket === 'tailor' || bucket == null) continue
    const io = expItemOv.get(pageId)
    if (io?.show === false) continue
    const pathSeg = resolveExperiencePublicSlug({ slug }) ?? slug
    const sk = (typeof io?.order === 'number' ? io.order : row.headerNavOrder) ?? 999
    const name = io?.label?.trim() || exp.name!.trim()
    const item: SiteHeaderNavExpItem = {
      id: pageId,
      name,
      href: `/experiences/${pathSeg}`,
      routeLine: formatExpRouteLine(exp),
      metaLine: formatExpMeta(exp),
      thumbUrl: exp.mainImageUrl?.trim() || null,
    }
    bucketsTmp[bucket].push({ it: item, sk, sn: name.toLowerCase() })
  }

  const buckets: Record<ExpBucket, SiteHeaderNavExpItem[]> = {
    classic: [],
    signature: [],
    learning: [],
  }
  for (const b of Object.keys(bucketsTmp) as ExpBucket[]) {
    bucketsTmp[b].sort((a, z) => {
      if (a.sk !== z.sk) return a.sk - z.sk
      return a.sn.localeCompare(z.sn)
    })
    buckets[b] = bucketsTmp[b].map((x) => x.it)
  }

  const expGroupsBuilt: Array<{
    order: number
    panelId: string
    sidebarLabel: string
    sidebarMeta: string
    eyebrow: string
    items: SiteHeaderNavExpItem[]
  }> = []

  for (const bucket of Object.keys(buckets) as ExpBucket[]) {
    const items = buckets[bucket]
    if (!items.length) continue
    const cfg = effectiveExpGroupConfig(settings, bucket)
    if (!cfg.enabled) continue
    const meta = BUCKET_META[bucket]
    expGroupsBuilt.push({
      order: cfg.order,
      panelId: meta.panelId,
      sidebarLabel: cfg.label,
      sidebarMeta: `${items.length} program${items.length === 1 ? '' : 's'}`,
      eyebrow: cfg.label,
      items,
    })
  }
  expGroupsBuilt.sort((a, b) => a.order - b.order)

  /* Empty CMS lists leave no sidebar tabs; SiteHeader assumes ≥1 group when experiences nav is on. */
  if (expGroupsBuilt.length === 0) {
    const shells: typeof expGroupsBuilt = []
    for (const bucket of Object.keys(buckets) as ExpBucket[]) {
      const cfg = effectiveExpGroupConfig(settings, bucket)
      if (!cfg.enabled) continue
      const meta = BUCKET_META[bucket]
      shells.push({
        order: cfg.order,
        panelId: meta.panelId,
        sidebarLabel: cfg.label,
        sidebarMeta: '0 programs',
        eyebrow: cfg.label,
        items: [],
      })
    }
    shells.sort((a, b) => a.order - b.order)
    if (shells.length) {
      expGroupsBuilt.push(...shells)
    } else {
      const bucket: ExpBucket = 'classic'
      const cfg = effectiveExpGroupConfig(settings, bucket)
      const meta = BUCKET_META[bucket]
      expGroupsBuilt.push({
        order: cfg.order,
        panelId: meta.panelId,
        sidebarLabel: cfg.label,
        sidebarMeta: '0 programs',
        eyebrow: cfg.label,
        items: [],
      })
    }
  }

  const tailorRow = tailorMenuResolved(settings)
  base.experiences.enabled = settings?.experiencesEnabled !== false
  base.experiences.tailorVisible = tailorRow.enabled
  base.experiences.tailorSidebarLabel = tailorRow.label
  base.experiences.groups = expGroupsBuilt.map(({ order: _o, ...rest }) => rest)

  const expSeeBlock = effectiveSeeAllBlock(settings?.experiencesSeeAll, settings?.navExperiencesSeeAllSmartLink, {
    enabled: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.enabled,
    label: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.label,
    smartLink: HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK.smartLink,
  })
  base.experiences.seeAll = resolveSeeAllToCta(expSeeBlock, 'All experiences', '/#experiences')

  const tailorResolved = resolveSmartLinkOrLegacy(settings?.navTailorMadeSmartLink, undefined, {
    label: 'Enquire',
    href: DEFAULT_WHATSAPP_URL,
    openInNewTab: true,
  })
  base.experiences.tailor = {
    panelId: 'dd-exp-tailor',
    eyebrow: base.experiences.tailorSidebarLabel,
    title: settings?.navTailorMadeTitle?.trim() || TAILOR_FALLBACK.title,
    subtitle: settings?.navTailorMadeSubtitle?.trim() || TAILOR_FALLBACK.subtitle,
    body: settings?.navTailorMadeBody?.trim() || TAILOR_FALLBACK.body,
    cta: tailorResolved
      ? {
          label: tailorResolved.label,
          href: tailorResolved.href,
          openInNewTab: tailorResolved.openInNewTab,
          rel: tailorResolved.rel,
        }
      : null,
  }

  const lodgeItemOv = lodgeItemOverrideMap(settings)
  type LodgeTmp = { it: SiteHeaderNavLodgeItem; sk: number; sn: string }
  const byRouteTmp: Record<LodgeRK, LodgeTmp[]> = {
    camanti: [],
    'manu-road': [],
    'manu-core': [],
  }

  for (const row of lodges) {
    const pageSlug = row.pageSlug?.trim()
    const lodge = row.lodge
    const pageId = row._id?.trim()
    if (!pageSlug || !lodge?.name?.trim() || !pageId) continue
    const rk = lodgeRouteKeyFromLodge(lodge.route) ?? 'camanti'
    const io = lodgeItemOv.get(pageId)
    if (io?.show === false) continue
    const sk = (typeof io?.order === 'number' ? io.order : row.headerNavOrder) ?? 999
    const name = io?.label?.trim() || lodge.name.trim()
    const item: SiteHeaderNavLodgeItem = {
      id: pageId,
      name,
      href: `/lodges/${pageSlug}`,
      imageUrl: lodge.mainImageUrl?.trim() || null,
      badges: lodgeBadges(lodge).slice(0, 3),
      description: lodgeDescription(lodge),
    }
    byRouteTmp[rk].push({ it: item, sk, sn: name.toLowerCase() })
  }

  const byRoute: Record<LodgeRK, SiteHeaderNavLodgeItem[]> = {
    camanti: [],
    'manu-road': [],
    'manu-core': [],
  }
  for (const rk of Object.keys(byRouteTmp) as LodgeRK[]) {
    byRouteTmp[rk].sort((a, z) => {
      if (a.sk !== z.sk) return a.sk - z.sk
      return a.sn.localeCompare(z.sn)
    })
    byRoute[rk] = byRouteTmp[rk].map((x) => x.it)
  }

  base.lodges.enabled = settings?.lodgesEnabled !== false
  const lodgeRoutesBuilt: Array<{
    order: number
    panelId: string
    routeKey: LodgeRK
    sidebarLabel: string
    sidebarMeta: string
    eyebrow: string
    lodges: SiteHeaderNavLodgeItem[]
  }> = []

  for (const rk of Object.keys(byRoute) as LodgeRK[]) {
    const list = byRoute[rk]
    if (!list.length) continue
    const cfg = effectiveLodgeRouteConfig(settings, rk)
    if (!cfg.enabled) continue
    const meta = ROUTE_META[rk]
    lodgeRoutesBuilt.push({
      order: cfg.order,
      panelId: meta.panelId,
      routeKey: rk,
      sidebarLabel: cfg.label,
      sidebarMeta: `${list.length} lodge${list.length === 1 ? '' : 's'}`,
      eyebrow: cfg.label,
      lodges: list,
    })
  }
  lodgeRoutesBuilt.sort((a, b) => a.order - b.order)

  if (lodgeRoutesBuilt.length === 0) {
    const shells: typeof lodgeRoutesBuilt = []
    for (const rk of Object.keys(byRoute) as LodgeRK[]) {
      const cfg = effectiveLodgeRouteConfig(settings, rk)
      if (!cfg.enabled) continue
      const meta = ROUTE_META[rk]
      shells.push({
        order: cfg.order,
        panelId: meta.panelId,
        routeKey: rk,
        sidebarLabel: cfg.label,
        sidebarMeta: '0 lodges',
        eyebrow: cfg.label,
        lodges: [],
      })
    }
    shells.sort((a, b) => a.order - b.order)
    if (shells.length) {
      lodgeRoutesBuilt.push(...shells)
    } else {
      const rk: LodgeRK = 'camanti'
      const cfg = effectiveLodgeRouteConfig(settings, rk)
      const meta = ROUTE_META[rk]
      lodgeRoutesBuilt.push({
        order: cfg.order,
        panelId: meta.panelId,
        routeKey: rk,
        sidebarLabel: cfg.label,
        sidebarMeta: '0 lodges',
        eyebrow: cfg.label,
        lodges: [],
      })
    }
  }

  base.lodges.routes = lodgeRoutesBuilt.map(({ order: _o, ...rest }) => rest)

  const lodgeSeeBlock = effectiveSeeAllBlock(settings?.lodgesSeeAll, settings?.navLodgesSeeAllSmartLink, {
    enabled: HEADER_NAV_LODGES_SEE_ALL_BLOCK.enabled,
    label: HEADER_NAV_LODGES_SEE_ALL_BLOCK.label,
    smartLink: HEADER_NAV_LODGES_SEE_ALL_BLOCK.smartLink,
  })
  base.lodges.seeAll = resolveSeeAllToCta(lodgeSeeBlock, 'All lodges', `/lodges/${LODGE_SOQTAPATA_PAGE_SLUG}`)

  return base
}
