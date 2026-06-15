import type { ExperienceFromSanity } from '@/lib/queries'
import {
  resolveExperienceProgramTypeLabel,
  resolveExperienceRouteLabel,
} from '@/lib/experienceCardLabels'
import {
  buildGenericExperienceEnquireWhatsappHref,
  enrichSmartLinkWithLabelFallback,
  resolveExperienceCardHref,
} from '@/lib/resolveExperiencePublicHref'
import { isListedExperienceStatus } from '@/lib/reserveCtaPricing'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled } from '@/lib/resolveSmartLink'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import type { RoutesPageListedExperiencePageRow } from '@/lib/routesPageExperiencesSection'
import { optimizeSanityImageDelivery, SANITY_IMG } from '@/lib/sanity'

export type ExperienceCardData = {
  imageUrl: string
  imageAlt: string
  routeLabel: string
  programTypeLabel: string
  title: string
  description: string
  price?: number | null
  priceLabel?: string | null
  /** Experience KC `_id` — promotion matching. */
  experienceId?: string | null
  routeRefId?: string | null
  programType?: string | null
  href: string
  ctaLabel?: string
  /** Route KC slug — used for Routes page tab filtering. */
  routeSlug?: string
}

export type ExperienceCardSourceRow = {
  experienceId?: string | null
  routeRefId?: string | null
  name?: string | null
  experienceSlug?: string | null
  experienceLandingSlug?: string | null
  programType?: string | null
  route?: string | null
  routeSlug?: string | null
  routeLabel?: string | null
  shortDescription?: string | null
  tagline?: string | null
  price?: number | null
  priceLabel?: string | null
  status?: string | null
  mainImageUrl?: string | null
  duration?: string | null
  lodgeEnquireSmartLink?: SmartLinkGroq | null
}

const DEFAULT_CTA_LABEL = 'View'

export function resolveExperienceCardPublicHref(input: {
  experienceLandingSlug?: string | null
  experienceSlug?: string | null
  slug?: { current?: string | null } | null
}): string {
  return resolveExperienceCardHref(input)
}

export function toExperienceCardData(
  row: ExperienceCardSourceRow,
  opts?: { href?: string; ctaLabel?: string },
): ExperienceCardData | null {
  const title = row.name?.trim()
  const imageUrlRaw = row.mainImageUrl?.trim()
  if (!title || !imageUrlRaw) return null
  const imageUrl = optimizeSanityImageDelivery(imageUrlRaw, SANITY_IMG.CARD_LARGE)

  const href = opts?.href?.trim() || resolveExperienceCardPublicHref(row)
  if (!href || href === '#') return null

  const description = row.shortDescription?.trim() ?? ''

  return {
    imageUrl,
    imageAlt: title,
    routeLabel: resolveExperienceRouteLabel({
      routeLabel: row.routeLabel,
      routeSlug: row.routeSlug,
      route: row.route,
    }),
    programTypeLabel: resolveExperienceProgramTypeLabel(row.programType),
    title,
    description,
    price: row.price,
    priceLabel: row.priceLabel,
    experienceId: row.experienceId?.trim() || undefined,
    routeRefId: row.routeRefId?.trim() || undefined,
    programType: row.programType?.trim() || undefined,
    href,
    ctaLabel: opts?.ctaLabel?.trim() || DEFAULT_CTA_LABEL,
    routeSlug: row.routeSlug?.trim() || row.route?.trim() || undefined,
  }
}

export function toExperienceCardDataFromSanity(
  doc: ExperienceFromSanity,
  opts: { href: string; imageUrl: string; ctaLabel?: string },
): ExperienceCardData | null {
  const href = opts.href?.trim()
  if (!href || href === '#') return null

  return (
    toExperienceCardData(
      {
        name: doc.name,
        mainImageUrl: opts.imageUrl,
        programType: doc.programType,
        route: doc.route,
        routeSlug: doc.routeSlug ?? doc.route,
        routeLabel: doc.routeLabel,
        shortDescription: doc.shortDescription,
        price: doc.price,
        priceLabel: doc.priceLabel,
        experienceId: doc._id?.trim(),
        routeRefId: doc.routeRefId?.trim(),
        experienceSlug: doc.slug?.current,
        experienceLandingSlug: doc.experienceLandingSlug,
      },
      { href, ctaLabel: opts.ctaLabel },
    ) ?? null
  )
}

export function toExperienceCardDataFromListedPage(
  row: RoutesPageListedExperiencePageRow,
  opts?: { ctaLabel?: string },
): ExperienceCardData | null {
  const name = row.name?.trim()
  const imageSrc = row.mainImageUrl?.trim()
  const landingSlug = row.landingSlug?.trim()
  const routeSlug = row.routeSlug?.trim()
  if (!name || !imageSrc || !landingSlug) return null
  if (!isListedExperienceStatus(row.status)) return null

  const priceLabelRaw = row.priceLabel?.trim() ?? ''
  const hasSellingPrice = typeof row.price === 'number' && row.price > 0
  const priceLabelLooksPriced = /\d/.test(priceLabelRaw)
  const useExperienceHref = hasSellingPrice || priceLabelLooksPriced
  const enquireLabel = priceLabelRaw || (hasSellingPrice ? String(row.price) : 'Enquire')
  const waFallback = buildGenericExperienceEnquireWhatsappHref(name)
  const enquireSmart = enrichSmartLinkWithLabelFallback(row.lodgeEnquireSmartLink, enquireLabel)
  const tourHref = resolveExperienceCardPublicHref({
    experienceLandingSlug: landingSlug,
    experienceSlug: row.experienceSlug?.trim(),
  })
  const enquireDisabled = smartLinkIsDisabled(row.lodgeEnquireSmartLink)
  const href = useExperienceHref
    ? tourHref
    : enquireDisabled
      ? tourHref
      : enquireSmart
        ? (resolveSmartLinkOrLegacy(enquireSmart, undefined, {
            label: enquireLabel,
            href: waFallback,
            openInNewTab: true,
          })?.href ?? waFallback)
        : waFallback

  return toExperienceCardData(
    {
      name,
      mainImageUrl: imageSrc,
      programType: row.programType,
      routeSlug,
      routeLabel: row.routeLabel,
      shortDescription: row.shortDescription,
      price: row.price,
      priceLabel: row.priceLabel,
      experienceId: row.experienceId?.trim(),
      routeRefId: row.routeRefId?.trim(),
      experienceLandingSlug: landingSlug,
      experienceSlug: row.experienceSlug?.trim(),
    },
    { href, ctaLabel: opts?.ctaLabel },
  )
}
