/**
 * Experience page `internalNav` (Sanity) → `SoqtapataPhase1PageNav` usado por `ExperiencePageNavSoqtapata`.
 * `targetSection` coincide con valores de `sanity/lib/pageModuleShared` (`MODULE_LIST`).
 */
import type { SoqtapataPhase1NavLink, SoqtapataPhase1PageNav } from '@/data/soqtapataExperienceLocal'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled } from '@/lib/resolveSmartLink'

export type CmsInternalNavItem = {
  _key?: string
  label?: string | null
  targetSection?: string | null
  visible?: boolean | null
  order?: number | null
}

export type CmsInternalNav = {
  title?: string | null
  subtitle?: string | null
  items?: CmsInternalNavItem[] | null
  fromLabel?: string | null
  priceText?: string | null
  priceSuffix?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  ctaSmartLink?: SmartLinkGroq | null
  ctaVisible?: boolean | null
}

/** Ancla + `data-active-when` alineados con la barra sticky y el scroll-spy actual. */
const INTERNAL_NAV_TARGET_META: Record<string, { href: string; dataActiveWhen?: string }> = {
  overview: { href: '#overview' },
  itinerary: { href: '#itinerary' },
  lodge: { href: '#lodges', dataActiveWhen: 'lodges,wildlife' },
  wildlife: { href: '#lodges', dataActiveWhen: 'lodges,wildlife' },
  includes: { href: '#includes', dataActiveWhen: 'includes,tech' },
  tech: { href: '#includes', dataActiveWhen: 'includes,tech' },
  media: { href: '#media', dataActiveWhen: 'media,when' },
  whenToVisit: { href: '#when', dataActiveWhen: 'media,when' },
  beforeYouGo: { href: '#before-you-go', dataActiveWhen: 'before-you-go,reviews,resources' },
  reviews: { href: '#reviews', dataActiveWhen: 'before-you-go,reviews,resources' },
  terms: { href: '#terms', dataActiveWhen: 'terms' },
  resources: { href: '#resources', dataActiveWhen: 'before-you-go,reviews,resources' },
  faq: { href: '#faq' },
  related: { href: '#also-camanti', dataActiveWhen: 'also-camanti,book' },
  reserve: { href: '#book', dataActiveWhen: 'also-camanti,book' },
}

function hasAnyValidVisibleItem(nav: CmsInternalNav | null | undefined): boolean {
  if (!nav?.items?.length) return false
  return nav.items.some((i) => {
    if (i.visible === false) return false
    const label = String(i.label ?? '').trim()
    if (!label) return false
    const key = i.targetSection
    return Boolean(key && INTERNAL_NAV_TARGET_META[key])
  })
}

/**
 * Si el CMS no aporta al menos un ítem visible con sección conocida, devuelve `null` (mantener `base`).
 */
export function mergeInternalNavIntoPageNav(
  nav: CmsInternalNav | null | undefined,
  base: SoqtapataPhase1PageNav,
): SoqtapataPhase1PageNav | null {
  if (!hasAnyValidVisibleItem(nav)) return null
  const doc = nav!

  const rows = (doc.items ?? [])
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.visible !== false && String(item.label ?? '').trim())
    .filter(({ item }) => {
      const key = item.targetSection
      return Boolean(key && INTERNAL_NAV_TARGET_META[key])
    })

  rows.sort((a, b) => {
    const ao = a.item.order
    const bo = b.item.order
    if (ao != null && bo != null && ao !== bo) return ao - bo
    if (ao != null && bo == null) return -1
    if (ao == null && bo != null) return 1
    return a.idx - b.idx
  })

  const links: SoqtapataPhase1NavLink[] = rows.map(({ item }) => {
    const key = item.targetSection!
    const meta = INTERNAL_NAV_TARGET_META[key]!
    const link: SoqtapataPhase1NavLink = {
      href: meta.href,
      label: String(item.label).trim(),
      className: 'pnav-top pnav-item',
    }
    if (meta.dataActiveWhen) link.dataActiveWhen = meta.dataActiveWhen
    return link
  })

  const fromLabel = doc.fromLabel?.trim() || base.fromLabel
  const fromNum = doc.priceText?.trim() || base.fromNum
  const fromSub = doc.priceSuffix?.trim() || base.fromSub
  const leadName = doc.title?.trim() || base.leadName
  const leadDays = doc.subtitle?.trim() || base.leadDays

  const fromAriaLabel = [fromLabel, fromNum, fromSub].filter(Boolean).join(' ').trim() || base.fromAriaLabel

  const ctaResolved = resolveSmartLinkOrLegacy(
    doc.ctaSmartLink,
    { label: doc.ctaLabel, href: doc.ctaUrl != null ? String(doc.ctaUrl).trim() : undefined, openInNewTab: false },
    { label: base.bookLabel, href: base.bookHref, openInNewTab: false },
  )
  const smartOff = smartLinkIsDisabled(doc.ctaSmartLink)
  const bookHref = smartOff ? '' : (ctaResolved?.href ?? base.bookHref)
  const bookLabel = smartOff ? '' : (ctaResolved?.label ?? base.bookLabel)

  return {
    ...base,
    leadName,
    leadDays,
    fromLabel,
    fromNum,
    fromSub,
    fromAriaLabel,
    bookHref,
    bookLabel,
    links,
    bookVisible: !smartOff && doc.ctaVisible !== false,
  }
}
