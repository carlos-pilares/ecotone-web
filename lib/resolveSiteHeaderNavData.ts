import { DEFAULT_WHATSAPP_URL } from '@/data/cmsApproved/siteSettingsApprovedContent'
import { LODGE_SOQTAPATA_PAGE_SLUG } from '@/lib/lodgePageCmsTypes'
import { resolveSmartLinkOrLegacy, type ResolvedSmartLink } from '@/lib/resolveSmartLink'
import { resolveRouteLabel } from '@/data/lodgeSoqtapataResolverDefaults'
import type {
  SiteHeaderNavBundleRow,
  SiteHeaderNavExperiencePageRow,
  SiteHeaderNavLodgePageRow,
} from '@/lib/siteHeaderNavQuery'

export type SiteHeaderNavCta = {
  label: string
  href: string
  openInNewTab: boolean
  rel: string
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
  experiences: {
    groups: SiteHeaderNavExpGroup[]
    tailor: SiteHeaderNavTailor
    seeAll: SiteHeaderNavCta | null
  }
  lodges: {
    routes: SiteHeaderNavLodgeRoute[]
    seeAll: SiteHeaderNavCta | null
  }
}

const TAILOR_FALLBACK = {
  eyebrow: 'Tailor Made',
  title: 'Design your program',
  subtitle: 'Any duration · Any group · Fully custom',
  body:
    'We build a program around your goals — school groups, researchers, families, or solo explorers. Any route, any duration.',
} as const

function programBucket(programType: string | null | undefined): 'classic' | 'signature' | 'learning' | 'tailor' | null {
  const p = programType?.trim().toLowerCase() ?? ''
  if (p === 'nature-core') return 'classic'
  if (p === 'family-adventure') return 'signature'
  if (p === 'experiential-learning') return 'learning'
  if (p === 'tailor-made') return 'tailor'
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

function lodgeRouteKey(route: string | null | undefined): 'camanti' | 'manu-road' | 'manu-core' | null {
  const r = route?.trim().toLowerCase() ?? ''
  if (r === 'camanti') return 'camanti'
  if (r === 'manu-road' || r === 'manuroad') return 'manu-road'
  if (r === 'manu-core' || r === 'manucore') return 'manu-core'
  return null
}

function lodgeEyebrow(k: SiteHeaderNavLodgeRoute['routeKey']): string {
  if (k === 'camanti') return 'Camanti Route'
  if (k === 'manu-road') return 'Manu Road'
  return 'Manu Core'
}

function lodgeSidebarLabel(k: SiteHeaderNavLodgeRoute['routeKey']): string {
  if (k === 'camanti') return 'Camanti'
  if (k === 'manu-road') return 'Manu Road'
  return 'Manu Core'
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
  if (lodge.altitude != null) bits.push(`${lodge.altitude} m`)
  if (lodge.location?.trim()) bits.push(lodge.location.trim())
  return bits.join(' · ')
}

function emptyNav(): ResolvedSiteHeaderNav {
  const fbExp = resolveSmartLinkOrLegacy(undefined, undefined, {
    label: 'All experiences',
    href: '/#experiences',
    openInNewTab: false,
  })
  const fbLodges = resolveSmartLinkOrLegacy(undefined, undefined, {
    label: 'All lodges',
    href: `/lodges/${LODGE_SOQTAPATA_PAGE_SLUG}`,
    openInNewTab: false,
  })
  const fbTailor = resolveSmartLinkOrLegacy(undefined, undefined, {
    label: 'Enquire',
    href: DEFAULT_WHATSAPP_URL,
    openInNewTab: true,
  })
  const cta = (r: ResolvedSmartLink): SiteHeaderNavCta => ({
    label: r.label,
    href: r.href,
    openInNewTab: r.openInNewTab,
    rel: r.rel,
  })
  return {
    experiences: {
      groups: [
        { panelId: 'dd-exp-classic', sidebarLabel: 'Classic Nature', sidebarMeta: '0 programs', eyebrow: 'Classic Nature', items: [] },
        {
          panelId: 'dd-exp-signature',
          sidebarLabel: 'Signature Expeditions',
          sidebarMeta: '0 programs',
          eyebrow: 'Signature Expeditions',
          items: [],
        },
        {
          panelId: 'dd-exp-learning',
          sidebarLabel: 'Experiential Learning',
          sidebarMeta: '0 programs',
          eyebrow: 'Experiential Learning',
          items: [],
        },
      ],
      tailor: {
        panelId: 'dd-exp-tailor',
        eyebrow: TAILOR_FALLBACK.eyebrow,
        title: TAILOR_FALLBACK.title,
        subtitle: TAILOR_FALLBACK.subtitle,
        body: TAILOR_FALLBACK.body,
        cta: cta(fbTailor!),
      },
      seeAll: cta(fbExp!),
    },
    lodges: {
      routes: [
        { panelId: 'dd-lodges-camanti', routeKey: 'camanti', sidebarLabel: 'Camanti', sidebarMeta: '0 lodges', eyebrow: lodgeEyebrow('camanti'), lodges: [] },
        {
          panelId: 'dd-lodges-manu-road',
          routeKey: 'manu-road',
          sidebarLabel: 'Manu Road',
          sidebarMeta: '0 lodges',
          eyebrow: lodgeEyebrow('manu-road'),
          lodges: [],
        },
        {
          panelId: 'dd-lodges-manu-core',
          routeKey: 'manu-core',
          sidebarLabel: 'Manu Core',
          sidebarMeta: '0 lodges',
          eyebrow: lodgeEyebrow('manu-core'),
          lodges: [],
        },
      ],
      seeAll: cta(fbLodges!),
    },
  }
}

export function resolveSiteHeaderNavData(
  settings: SiteHeaderNavBundleRow['settings'],
  experiencePages: SiteHeaderNavExperiencePageRow[] | null | undefined,
  lodgePages: SiteHeaderNavLodgePageRow[] | null | undefined,
): ResolvedSiteHeaderNav {
  const base = emptyNav()
  const pages = Array.isArray(experiencePages) ? experiencePages : []
  const lodges = Array.isArray(lodgePages) ? lodgePages : []

  const classic: SiteHeaderNavExpItem[] = []
  const signature: SiteHeaderNavExpItem[] = []
  const learning: SiteHeaderNavExpItem[] = []

  for (const row of pages) {
    const slug = row.pageSlug?.trim()
    const exp = row.experience
    if (!slug || !exp?.name?.trim()) continue
    const bucket = programBucket(exp.programType)
    if (bucket === 'tailor' || bucket == null) continue
    const item: SiteHeaderNavExpItem = {
      id: exp._id,
      name: exp.name!.trim(),
      href: `/experiences/${slug}`,
      routeLine: formatExpRouteLine(exp),
      metaLine: formatExpMeta(exp),
      thumbUrl: exp.mainImageUrl?.trim() || null,
    }
    if (bucket === 'classic') classic.push(item)
    else if (bucket === 'signature') signature.push(item)
    else learning.push(item)
  }

  const expSee = resolveSmartLinkOrLegacy(settings?.navExperiencesSeeAllSmartLink, undefined, {
    label: 'All experiences',
    href: '/#experiences',
    openInNewTab: false,
  })
  const lodgeSee = resolveSmartLinkOrLegacy(settings?.navLodgesSeeAllSmartLink, undefined, {
    label: 'All lodges',
    href: `/lodges/${LODGE_SOQTAPATA_PAGE_SLUG}`,
    openInNewTab: false,
  })
  const tailorResolved = resolveSmartLinkOrLegacy(settings?.navTailorMadeSmartLink, undefined, {
    label: 'Enquire',
    href: DEFAULT_WHATSAPP_URL,
    openInNewTab: true,
  })

  base.experiences.groups = [
    {
      panelId: 'dd-exp-classic',
      sidebarLabel: 'Classic Nature',
      sidebarMeta: `${classic.length} program${classic.length === 1 ? '' : 's'}`,
      eyebrow: 'Classic Nature',
      items: classic,
    },
    {
      panelId: 'dd-exp-signature',
      sidebarLabel: 'Signature Expeditions',
      sidebarMeta: `${signature.length} program${signature.length === 1 ? '' : 's'}`,
      eyebrow: 'Signature Expeditions',
      items: signature,
    },
    {
      panelId: 'dd-exp-learning',
      sidebarLabel: 'Experiential Learning',
      sidebarMeta: `${learning.length} program${learning.length === 1 ? '' : 's'}`,
      eyebrow: 'Experiential Learning',
      items: learning,
    },
  ]
  base.experiences.seeAll = expSee
    ? {
        label: expSee.label,
        href: expSee.href,
        openInNewTab: expSee.openInNewTab,
        rel: expSee.rel,
      }
    : null
  base.experiences.tailor = {
    panelId: 'dd-exp-tailor',
    eyebrow: TAILOR_FALLBACK.eyebrow,
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

  const byRoute: Record<'camanti' | 'manu-road' | 'manu-core', SiteHeaderNavLodgeItem[]> = {
    camanti: [],
    'manu-road': [],
    'manu-core': [],
  }

  for (const row of lodges) {
    const pageSlug = row.pageSlug?.trim()
    const lodge = row.lodge
    if (!pageSlug || !lodge?.name?.trim()) continue
    const rk = lodgeRouteKey(lodge.route)
    if (!rk) continue
    byRoute[rk].push({
      id: `${rk}-${pageSlug}`,
      name: lodge.name.trim(),
      href: `/lodges/${pageSlug}`,
      imageUrl: lodge.mainImageUrl?.trim() || null,
      badges: lodgeBadges(lodge).slice(0, 3),
      description: lodgeDescription(lodge),
    })
  }

  const routeOrder: SiteHeaderNavLodgeRoute['routeKey'][] = ['camanti', 'manu-road', 'manu-core']
  base.lodges.routes = routeOrder.map((rk) => {
    const list = byRoute[rk]
    return {
      panelId: `dd-lodges-${rk}`,
      routeKey: rk,
      sidebarLabel: lodgeSidebarLabel(rk),
      sidebarMeta: `${list.length} lodge${list.length === 1 ? '' : 's'}`,
      eyebrow: lodgeEyebrow(rk),
      lodges: list,
    }
  })
  base.lodges.seeAll = lodgeSee
    ? {
        label: lodgeSee.label,
        href: lodgeSee.href,
        openInNewTab: lodgeSee.openInNewTab,
        rel: lodgeSee.rel,
      }
    : null

  return base
}
