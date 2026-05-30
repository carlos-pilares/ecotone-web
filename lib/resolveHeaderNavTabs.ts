/**
 * Header navigation from CMS `navTabs[]` (order = array order).
 * When headerSettings exists, this is the only resolver path.
 */
import {
  canonicalizeLodgeRouteSlug,
  lodgeSoqtapataRouteLabels,
  normalizeLodgeRouteKey,
} from '@/data/lodgeSoqtapataResolverDefaults'
import { formatExperienceNavPriceMetaWithPromotions } from '@/lib/formatExperiencePrice'
import type { PromotionDoc } from '@/lib/promotionTypes'
import { resolveExperienceHeroImageUrl } from '@/lib/experienceHeroImage'
import { resolveExperiencePublicHref } from '@/lib/resolveExperiencePublicHref'
import type { HeaderNavTabRow } from '@/lib/headerNavTabsAdapter'
import { resolveHeaderNavTabRows } from '@/lib/headerNavTabsAdapter'
import type { HeaderSettingsDocumentRow } from '@/lib/mergeHeaderSettings'
import {
  resolveSmartLinkOrLegacy,
  smartLinkIsDisabled,
  type ResolvedSmartLink,
  type SmartLinkGroq,
} from '@/lib/resolveSmartLink'
import type {
  HeaderNavProgramTypeGroupRow,
  SiteHeaderNavExperiencePageRow,
  SiteHeaderNavExperienceRouteRefRow,
  SiteHeaderNavLodgePageRow,
  SiteHeaderNavRouteNavRow,
} from '@/lib/siteHeaderNavQuery'
import type {
  ResolvedSiteHeaderNav,
  ResolvedSiteHeaderNavTab,
  SiteHeaderNavCta,
  SiteHeaderNavExpGroup,
  SiteHeaderNavExpItem,
  SiteHeaderNavLodgeItem,
  SiteHeaderNavLodgeRoute,
  SiteHeaderNavTailor,
} from '@/lib/resolveSiteHeaderNavData'

const STRICT_LINK_STUB = { label: '', href: '#' } as const

function resolveSmartLinkStrict(smart: SmartLinkGroq | null | undefined): ResolvedSmartLink | null {
  if (!smart || smartLinkIsDisabled(smart)) return null
  const r = resolveSmartLinkOrLegacy(smart, undefined, STRICT_LINK_STUB)
  if (!r?.href || r.href === '#') return null
  return r
}

function ctaFromResolved(r: ResolvedSmartLink): SiteHeaderNavCta {
  return { label: r.label, href: r.href, openInNewTab: r.openInNewTab, rel: r.rel }
}

/** Tailor Made CTA from program group — supports book modals (`href` `#`) and normal links. */
function resolveTailorCtaFromCms(group: HeaderNavProgramTypeGroupRow | null): SiteHeaderNavCta | null {
  if (!group) return null
  const label = group.ctaLabel?.trim() ?? ''
  if (!label) return null
  const smart = group.ctaSmartLink
  if (!smart || smartLinkIsDisabled(smart)) return null

  const resolved = resolveSmartLinkOrLegacy(smart, undefined, {
    label,
    href: '#',
    openInNewTab: false,
  })
  if (!resolved) return null

  if (resolved.bookingModal === 'plan') {
    return {
      label,
      href: resolved.href || '#',
      openInNewTab: false,
      rel: '',
      bookingModal: 'plan',
    }
  }
  if (resolved.bookingModal === 'experience' && resolved.bookingSummary) {
    return {
      label,
      href: resolved.href || '#',
      openInNewTab: false,
      rel: '',
      bookingModal: 'experience',
      bookingSummary: resolved.bookingSummary,
    }
  }

  if (!resolved.href || resolved.href === '#') return null

  return {
    label,
    href: resolved.href,
    openInNewTab: resolved.openInNewTab,
    rel: resolved.rel,
  }
}

function resolveSimpleTabLink(tab: HeaderNavTabRow): SiteHeaderNavCta | null {
  if (tab.hasDropdown) return null
  const smart = tab.smartLink
  if (!smart) return null
  const label = tab.label?.trim() || smart.label?.trim() || ''
  if (!label) return null
  const r = resolveSmartLinkStrict(smart)
  if (!r) return null
  return { ...ctaFromResolved(r), label }
}

function resolveTabSeeAll(tab: HeaderNavTabRow): SiteHeaderNavCta | null {
  if (tab.showSeeAll !== true) return null
  const smart = tab.seeAllSmartLink
  if (!smart) return null
  const label = tab.seeAllLabel?.trim() || smart.label?.trim() || ''
  if (!label) return null
  const r = resolveSmartLinkStrict(smart)
  if (!r) return null
  return { ...ctaFromResolved(r), label }
}


function buildRouteLabelBySlug(routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined): Map<string, string> {
  const map = new Map<string, string>()
  for (const doc of routeNavDocs ?? []) {
    const slug = doc.slug?.trim().toLowerCase()
    if (!slug) continue
    const label = doc.shortLabel?.trim() || doc.name?.trim()
    if (label) map.set(slug, label)
  }
  for (const [slug, label] of Object.entries(lodgeSoqtapataRouteLabels)) {
    if (!map.has(slug)) map.set(slug, label)
  }
  return map
}

function routeLabelFromSlug(slug: string, routeBySlug: Map<string, string>): string {
  const key = slug.trim().toLowerCase()
  if (!key) return ''
  const fromMap = routeBySlug.get(key)
  if (fromMap) return fromMap
  const canon = normalizeLodgeRouteKey(key)
  if (canon && lodgeSoqtapataRouteLabels[canon]) return lodgeSoqtapataRouteLabels[canon]
  return ''
}

function resolveHeaderExperienceRoutePill(
  exp: NonNullable<SiteHeaderNavExperiencePageRow['experience']>,
  routeBySlug: Map<string, string>,
): string {
  const ref: SiteHeaderNavExperienceRouteRefRow | null | undefined = exp.routeRef
  if (ref && typeof ref === 'object') {
    const fromDoc = ref.shortLabel?.trim() || ref.name?.trim()
    if (fromDoc) return fromDoc
    const slug = ref.slug?.trim()
    if (slug) return routeLabelFromSlug(slug, routeBySlug)
    return ''
  }

  const legacy = exp.route?.trim()
  if (!legacy) return ''
  return routeLabelFromSlug(canonicalizeLodgeRouteSlug(legacy) || legacy, routeBySlug)
}

function programGroupSidebarMeta(group: HeaderNavProgramTypeGroupRow, itemCount: number): string {
  const sub = group.sidebarSubLabel?.trim()
  if (sub) return sub
  return `${itemCount} program${itemCount === 1 ? '' : 's'}`
}

function panelIdForProgramType(programType: string): string {
  const safe = programType.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase()
  return `dd-exp-${safe || 'program'}`
}

function panelIdForLodgeRouteSlug(slug: string): string {
  if (slug === '__other__') return 'dd-lodges-other'
  const safe = slug.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase()
  return `dd-lodges-${safe || 'route'}`
}

const OTHER_ROUTE_SLUG = '__other__' as const

type LodgeRouteCol = { slug: string; panelId: string; label: string; order: number }

function buildLodgeRouteColumns(routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined): LodgeRouteCol[] {
  const fromCms: LodgeRouteCol[] = []
  for (const d of routeNavDocs ?? []) {
    const slug = d.slug?.trim().toLowerCase()
    if (!slug || d.showInMenu === false) continue
    const order = typeof d.menuOrder === 'number' && Number.isFinite(d.menuOrder) ? d.menuOrder : 999
    const label = (d.shortLabel?.trim() || d.name?.trim() || slug).trim()
    fromCms.push({ slug, panelId: panelIdForLodgeRouteSlug(slug), label, order })
  }
  fromCms.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.label.localeCompare(b.label)))
  return fromCms
}

function trimUrl(s: string | null | undefined): string | null {
  const t = s?.trim()
  return t || null
}

function lodgeMenuImageUrl(row: SiteHeaderNavLodgePageRow): string | null {
  return trimUrl(row.menuThumbnailImageUrl)
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

function sortLodgeTmpList(
  arr: { it: SiteHeaderNavLodgeItem; sk: number; sn: string }[],
): SiteHeaderNavLodgeItem[] {
  const copy = [...arr]
  copy.sort((a, b) => (a.sk !== b.sk ? a.sk - b.sk : a.sn.localeCompare(b.sn)))
  return copy.map((x) => x.it)
}

function headerNavPriceMetaForExperience(
  exp: NonNullable<SiteHeaderNavExperiencePageRow['experience']>,
  promotions?: PromotionDoc[] | null,
) {
  return formatExperienceNavPriceMetaWithPromotions(
    {
      experienceId: exp._id,
      routeRefId: exp.routeRef?._id,
      programType: exp.programType,
      price: exp.price,
      priceLabel: exp.priceLabel,
    },
    promotions,
  )
}

function buildExperiencesDropdown(
  tab: HeaderNavTabRow,
  tabKey: string,
  experiencePages: SiteHeaderNavExperiencePageRow[],
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined,
  promotions?: PromotionDoc[] | null,
): NonNullable<ResolvedSiteHeaderNavTab['experiences']> {
  const cfg = tab.experiencesDropdown
  const programGroups = cfg?.programGroups ?? []
  const pages = experiencePages
  const routeBySlug = buildRouteLabelBySlug(routeNavDocs)

  const byProgramType = new Map<string, { it: SiteHeaderNavExpItem; sk: number; sn: string }[]>()
  for (const row of pages) {
    const slug = row.pageSlug?.trim()
    const exp = row.experience
    const pageId = row._id?.trim()
    if (!slug || !exp?.name?.trim() || !pageId) continue
    const programType = exp.programType?.trim().toLowerCase() ?? ''
    if (!programType || programType === 'tailor-made') continue
    const href = resolveExperiencePublicHref({ experienceLandingSlug: slug })
    if (!href) continue
    const sk = row.headerNavOrder ?? 999
    const name = exp.name!.trim()
    const item: SiteHeaderNavExpItem = {
      id: pageId,
      name,
      href,
      routeLine: resolveHeaderExperienceRoutePill(exp, routeBySlug),
      priceMeta: headerNavPriceMetaForExperience(exp, promotions),
      thumbUrl:
        resolveExperienceHeroImageUrl({
          gallery: exp.gallery,
          galleryOrderKeys: row.galleryOrderKeys,
          photoCollection: exp.photoCollection,
          mainImage: exp.mainImage,
          mainImageUrl: exp.mainImageUrl,
          width: 600,
        }) || null,
    }
    const list = byProgramType.get(programType) ?? []
    list.push({ it: item, sk, sn: name.toLowerCase() })
    byProgramType.set(programType, list)
  }
  for (const list of byProgramType.values()) {
    list.sort((a, z) => (a.sk !== z.sk ? a.sk - z.sk : a.sn.localeCompare(z.sn)))
  }

  const groupConfigs = programGroups
    .filter(
      (g): g is HeaderNavProgramTypeGroupRow & { programType: string } =>
        Boolean(g?.programType?.trim()) && g.programType !== 'tailor-made',
    )
    .map((g) => ({
      programType: g.programType!.trim().toLowerCase(),
      label: g.label?.trim() ?? '',
      sidebarSubLabel: g.sidebarSubLabel?.trim() ?? '',
      enabled: g.showInMenu !== false,
      order: typeof g.order === 'number' && Number.isFinite(g.order) ? g.order : 999,
    }))
    .sort((a, b) => (a.order !== b.order ? a.order - b.order : a.label.localeCompare(b.label)))

  const groups: SiteHeaderNavExpGroup[] = []
  for (const gc of groupConfigs) {
    if (!gc.enabled) continue
    const tmp = byProgramType.get(gc.programType) ?? []
    const items = tmp.map((x) => x.it)
    const groupRow = programGroups.find((g) => g?.programType?.trim().toLowerCase() === gc.programType)
    const sidebarMeta = groupRow
      ? programGroupSidebarMeta(groupRow, items.length)
      : `${items.length} program${items.length === 1 ? '' : 's'}`
    groups.push({
      panelId: `${panelIdForProgramType(gc.programType)}--${tabKey}`,
      sidebarLabel: gc.label,
      sidebarMeta,
      eyebrow: gc.label,
      items,
    })
  }

  const tailorGroup = programGroups.find((g) => g?.programType === 'tailor-made') ?? null
  const tailorPanelId = `dd-exp-tailor--${tabKey}`
  const tailor: SiteHeaderNavTailor = {
    panelId: tailorPanelId,
    eyebrow: tailorGroup?.eyebrow?.trim() ?? '',
    title: tailorGroup?.title?.trim() ?? '',
    subtitle: tailorGroup?.subtitle?.trim() ?? '',
    body: tailorGroup?.body?.trim() ?? '',
    imageUrl: tailorGroup?.imageUrl?.trim() || null,
    imageAlt: tailorGroup?.imageAlt?.trim() || null,
    cta: resolveTailorCtaFromCms(tailorGroup),
  }

  return {
    sideMenuTitle: cfg?.sideMenuTitle?.trim() ?? '',
    tailorSidebarLabel: tailorGroup?.label?.trim() ?? '',
    tailorSidebarSubLabel: tailorGroup?.sidebarSubLabel?.trim() ?? '',
    tailorVisible: Boolean(tailorGroup && tailorGroup.showInMenu !== false),
    groups,
    tailor,
    seeAll: resolveTabSeeAll(tab),
  }
}

function buildLodgesDropdown(
  tab: HeaderNavTabRow,
  tabKey: string,
  lodgePages: SiteHeaderNavLodgePageRow[],
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined,
): NonNullable<ResolvedSiteHeaderNavTab['lodges']> {
  const sideMenuTitle = tab.lodgesDropdown?.sideMenuTitle?.trim() ?? ''
  const routeColsBase = buildLodgeRouteColumns(routeNavDocs)
  const knownSlugs = new Set(routeColsBase.map((c) => c.slug))
  const bySlug = new Map<string, { it: SiteHeaderNavLodgeItem; sk: number; sn: string }[]>()
  for (const c of routeColsBase) bySlug.set(c.slug, [])
  const otherBucket: { it: SiteHeaderNavLodgeItem; sk: number; sn: string }[] = []

  for (const row of lodgePages) {
    const pageSlug = row.pageSlug?.trim()
    const lodge = row.lodge
    const pageId = row._id?.trim()
    if (!pageSlug || !lodge?.name?.trim() || !pageId) continue
    const canon = canonicalizeLodgeRouteSlug(lodge.route)
    const bucketSlug = canon && knownSlugs.has(canon) ? canon : OTHER_ROUTE_SLUG
    const sk = row.headerNavOrder ?? 999
    const name = row.heroTitle?.trim() || lodge.name.trim()
    const item: SiteHeaderNavLodgeItem = {
      id: pageId,
      name,
      href: `/lodges/${pageSlug}`,
      imageUrl: lodgeMenuImageUrl(row),
      badges: lodgeMenuBadges(row).slice(0, 3),
      description: lodgeMenuDescription(row),
      ctaLabel: 'View lodge',
    }
    const tmp = { it: item, sk, sn: name.toLowerCase() }
    if (bucketSlug === OTHER_ROUTE_SLUG) otherBucket.push(tmp)
    else {
      const list = bySlug.get(bucketSlug)
      if (list) list.push(tmp)
      else otherBucket.push(tmp)
    }
  }

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

  const routes: SiteHeaderNavLodgeRoute[] = colsForShells.map((col) => {
    const rawTmp = col.slug === OTHER_ROUTE_SLUG ? otherBucket : bySlug.get(col.slug) ?? []
    const lodgesSorted = sortLodgeTmpList(rawTmp)
    return {
      panelId: `${col.panelId}--${tabKey}`,
      routeSlug: col.slug,
      sidebarLabel: col.label,
      sidebarMeta: `${lodgesSorted.length} lodge${lodgesSorted.length === 1 ? '' : 's'}`,
      eyebrow: col.label,
      lodges: lodgesSorted,
    }
  })

  return {
    sideMenuTitle,
    routes,
    seeAll: resolveTabSeeAll(tab),
  }
}

function tabKeyFromRow(tab: HeaderNavTabRow, index: number): string {
  const k = tab._key?.trim()
  if (k) return k.replace(/[^a-zA-Z0-9_-]/g, '-')
  return `tab-${index}`
}

function resolveNavTab(
  tab: HeaderNavTabRow,
  index: number,
  experiencePages: SiteHeaderNavExperiencePageRow[],
  lodgePages: SiteHeaderNavLodgePageRow[],
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined,
  promotions?: PromotionDoc[] | null,
): ResolvedSiteHeaderNavTab | null {
  if (tab.showInHeader === false) return null
  const label = tab.label?.trim() ?? ''
  if (!label) return null

  const key = tabKeyFromRow(tab, index)
  const hasDropdown = tab.hasDropdown === true
  const dropdownType = (tab.dropdownType?.trim().toLowerCase() || 'none') as 'none' | 'experiences' | 'lodges'

  const btnId = `site-nav-btn-${key}`
  const ddId = `site-nav-dd-${key}`
  const mobAccId = `mob-acc-${key}`

  if (!hasDropdown || dropdownType === 'none') {
    const simpleLink = resolveSimpleTabLink(tab)
    if (!simpleLink) return null
    return {
      key,
      label,
      simpleLink,
      hasDropdown: false,
      dropdownType: 'none',
      btnId,
      ddId,
      mobAccId,
      experiences: null,
      lodges: null,
    }
  }

  if (dropdownType === 'experiences') {
    return {
      key,
      label,
      simpleLink: null,
      hasDropdown: true,
      dropdownType: 'experiences',
      btnId,
      ddId,
      mobAccId,
      experiences: buildExperiencesDropdown(tab, key, experiencePages, routeNavDocs, promotions),
      lodges: null,
    }
  }

  if (dropdownType === 'lodges') {
    return {
      key,
      label,
      simpleLink: null,
      hasDropdown: true,
      dropdownType: 'lodges',
      btnId,
      ddId,
      mobAccId,
      experiences: null,
      lodges: buildLodgesDropdown(tab, key, lodgePages, routeNavDocs),
    }
  }

  return null
}

export function resolveSiteHeaderNavFromNavTabs(
  headerDoc: HeaderSettingsDocumentRow,
  experiencePages: SiteHeaderNavExperiencePageRow[] | null | undefined,
  lodgePages: SiteHeaderNavLodgePageRow[] | null | undefined,
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null | undefined,
  promotions?: PromotionDoc[] | null,
): ResolvedSiteHeaderNav {
  const tabRows = resolveHeaderNavTabRows(headerDoc)
  const pages = Array.isArray(experiencePages) ? experiencePages : []
  const lodges = Array.isArray(lodgePages) ? lodgePages : []

  const tabs: ResolvedSiteHeaderNavTab[] = []
  tabRows.forEach((row, index) => {
    const resolved = resolveNavTab(row, index, pages, lodges, routeNavDocs, promotions)
    if (resolved) tabs.push(resolved)
  })

  return { tabs }
}
