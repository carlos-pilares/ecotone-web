/**
 * Maps `AboutPageSanityDoc` (schema `aboutPage`) to the shapes consumed by `components/about/*`,
 * merging with `data/aboutStatic.ts` when fields are missing.
 */
import type { ReserveCtaCardProps } from '@/components/shared/ReserveCtaSection'
import { aboutSeoFallback, aboutStatic } from '@/data/aboutStatic'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import type { AboutPageSanityDoc } from '@/lib/aboutPageQuery'
import {
  resolveAboutPageSectionVisibility,
  type AboutPageSectionVisibility,
} from '@/lib/aboutPageSectionVisibility'
import type { PartnerDoc } from '@/lib/queries'
import { filterPublishedPartnerDocs } from '@/lib/partnerDocs'
import { getLowestActiveExperiencePrice, buildReserveRowsForHome, type ExperiencePriceInput } from '@/lib/reserveCtaPricing'
import { resolveReserveCtaCard } from '@/lib/resolveReserveCtaCard'
import { isExternalHref, resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'
import { optimizeSanityImageDelivery, SANITY_IMG } from '@/lib/sanity'

function trimOr(fallback: string, v?: string | null) {
  const t = v?.trim()
  return t ? t : fallback
}

function aboutImage(cms: string | null | undefined, fallback: string, width: number): string {
  return optimizeSanityImageDelivery(trimOr(fallback, cms), width)
}

function splitTitleLines(cms: string | null | undefined, fallback: readonly string[]): string[] {
  const t = cms?.trim()
  if (!t) return [...fallback]
  const lines = t
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
  return lines.length > 0 ? lines : [...fallback]
}

function paragraphsFromCms(
  blocks: Array<{ text?: string | null }> | null | undefined,
  fallback: readonly string[],
): string[] {
  if (!Array.isArray(blocks) || blocks.length === 0) return [...fallback]
  const out = blocks.map((b) => b.text?.trim()).filter((x): x is string => Boolean(x))
  return out.length > 0 ? out : [...fallback]
}

function pillsFromCms(
  pills: Array<{ label?: string | null }> | null | undefined,
  fallback: readonly string[],
): string[] {
  if (!Array.isArray(pills) || pills.length === 0) return [...fallback]
  const out = pills.map((p) => p.label?.trim()).filter((x): x is string => Boolean(x))
  return out.length > 0 ? out : [...fallback]
}

function mapTrustIcon(k: string | null | undefined): 'check' | 'shield' | 'heart' {
  if (k === 'shield') return 'shield'
  if (k === 'heart') return 'heart'
  return 'check'
}

export type AboutPageResolved = {
  sectionVisibility: AboutPageSectionVisibility
  seo: {
    title: string
    description: string
    noIndex: boolean
    ogImageUrl: string | null
  }
  hero: {
    eyebrow: string
    titleLines: string[]
    tagline: string
    primaryCta: { label: string; href: string; openInNewTab: boolean; rel?: string } | null
    secondaryCta: { label: string; href: string; openInNewTab: boolean; rel?: string } | null
    imageUrl: string
    imageAlt: string
  }
  who: {
    sectionId: string
    eyebrow: string
    headline: string
    paragraphs: string[]
    imageUrl: string
    imageAlt: string
    pills: string[]
  }
  why: {
    sectionId: string
    eyebrow: string
    headlineLines: string[]
    body: string
  }
  difference: {
    sectionId: string
    eyebrow: string
    headline: string
    intro: string
    imageUrl: string
    imageAlt: string
    cards: Array<{ key: string; title: string; description: string }>
  }
  crees: {
    sectionId: string
    eyebrow: string
    title: string
    subtitle: string
    paragraphs: string[]
    imageUrl: string
    imageAlt: string
    lockupUrl: string
    lockupAlt: string
    cta: {
      label: string
      href: string
      openInNewTab: boolean
      rel?: string
    } | null
  }
  way: {
    sectionId: string
    eyebrow: string
    headline: string
    paragraphs: string[]
    pullquote: string
    imageUrl: string
    imageAlt: string
  }
  people: {
    sectionId: string
    eyebrow: string
    headline: string
    intro: string
    initialVisibleCount: number
    members: Array<{
      key: string
      name: string
      role: string
      affiliation?: string
      bio: string
      imageUrl: string
      imageAlt: string
      /** Optional LinkedIn profile URL — omit when absent. */
      linkedinUrl?: string
    }>
  }
  bcorp: {
    sectionId: string
    eyebrow: string
    title: string
    paragraphs: string[]
    logoMaskUrl: string
    logoAlt: string
    primaryCta: {
      label: string
      href: string
      openInNewTab: boolean
      rel?: string
    } | null
    secondaryCta: {
      label: string
      href: string
      openInNewTab: boolean
      rel?: string
    } | null
  }
  proof: {
    sectionId: string
    eyebrow: string
    headline: string
    intro: string
    stats: Array<{ number: string; label: string; description: string }>
    certLabel: string
    certs: string[]
  }
  finalCta: {
    sectionId: string
    eyebrow: string
    headline: string
    body: string
    ctas: Array<{
      label: string
      href: string
      variant: 'primary' | 'secondary' | 'ghost' | 'whatsapp'
      external: boolean
    }>
    trust: Array<{ key: string; text: string; icon: 'check' | 'shield' | 'heart' }>
    /** Reserve CTA card: CMS `reserveCtaSettings` + lowest active experience price + legacy fallbacks. */
    reserveCard: ReserveCtaCardProps
  }
  partnersBand: {
    eyebrow: string
    title: string
    body: string | null
    partners: PartnerDoc[]
    emptyMessage: string | null
  }
}

const fb = aboutStatic

export function resolveAboutPageData(
  cms: AboutPageSanityDoc | null,
  experiencesForPricing: ExperiencePriceInput[] = [],
): AboutPageResolved {
  const c = cms && cms._id ? cms : null

  const seo = {
    title: trimOr(aboutSeoFallback.title, c?.seo?.title),
    description: trimOr(aboutSeoFallback.description, c?.seo?.description),
    noIndex: c?.seo?.noIndex === true,
    ogImageUrl: c?.seo?.ogImageUrl?.trim() || aboutSeoFallback.ogImageUrl || null,
  }

  const primaryResolved = resolveSmartLinkOrLegacy(
    c?.heroPrimarySmartLink,
    c?.heroPrimaryCta,
    { label: fb.hero.primaryLabel, href: fb.hero.primaryHref, openInNewTab: false },
  )
  const secondaryResolved = resolveSmartLinkOrLegacy(
    c?.heroSecondarySmartLink,
    c?.heroSecondaryCta,
    { label: fb.hero.secondaryLabel, href: fb.hero.secondaryHref, openInNewTab: false },
  )

  const hero = {
    eyebrow: trimOr(fb.hero.eyebrow, c?.heroEyebrow),
    titleLines: splitTitleLines(c?.heroTitle, fb.hero.titleLines),
    tagline: trimOr(fb.hero.tagline, c?.heroTagline),
    primaryCta: primaryResolved
      ? {
          label: primaryResolved.label,
          href: primaryResolved.href,
          openInNewTab: primaryResolved.openInNewTab,
          rel: primaryResolved.rel || undefined,
        }
      : null,
    secondaryCta: secondaryResolved
      ? {
          label: secondaryResolved.label,
          href: secondaryResolved.href,
          openInNewTab: secondaryResolved.openInNewTab,
          rel: secondaryResolved.rel || undefined,
        }
      : null,
    imageUrl: aboutImage(c?.heroImageUrl, fb.hero.imageUrl, SANITY_IMG.HERO),
    imageAlt: trimOr(fb.hero.imageAlt, c?.heroImageAlt),
  }

  const who = {
    sectionId: trimOr(fb.who.sectionId, c?.whoSectionId),
    eyebrow: trimOr(fb.who.eyebrow, c?.whoEyebrow),
    headline: trimOr(fb.who.headline, c?.whoTitle),
    paragraphs: paragraphsFromCms(c?.whoBodyParagraphs, fb.who.paragraphs),
    imageUrl: aboutImage(c?.whoImageUrl, fb.who.imageUrl, SANITY_IMG.SECTION),
    imageAlt: trimOr(fb.who.imageAlt, c?.whoImageAlt),
    pills: pillsFromCms(c?.whoPills, fb.who.pills),
  }

  const why = {
    sectionId: trimOr(fb.why.sectionId, c?.whySectionId),
    eyebrow: trimOr(fb.why.eyebrow, c?.whyEyebrow),
    headlineLines: splitTitleLines(c?.whyTitle, fb.why.headlineLines),
    body: trimOr(fb.why.body, c?.whyBody),
  }

  const diffCardsCms = c?.diffCards
  let cards: Array<{ key: string; title: string; description: string }> = fb.difference.cards.map((x) => ({
    key: x.key,
    title: x.title,
    description: x.description,
  }))
  if (Array.isArray(diffCardsCms) && diffCardsCms.length > 0) {
    const mapped = diffCardsCms
      .map((row, i) => {
        const title = row.title?.trim()
        const description = row.description?.trim() || ''
        const key = row.iconKey?.trim() || `principle-${i + 1}`
        if (!title) return null
        return { key, title, description }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
    if (mapped.length > 0) cards = mapped
  }

  const difference = {
    sectionId: trimOr(fb.difference.sectionId, c?.diffSectionId),
    eyebrow: trimOr(fb.difference.eyebrow, c?.diffEyebrow),
    headline: trimOr(fb.difference.headline, c?.diffTitle),
    intro: trimOr(fb.difference.intro, c?.diffIntro),
    imageUrl: aboutImage(c?.diffImageUrl, fb.difference.imageUrl, SANITY_IMG.SECTION),
    imageAlt: trimOr(fb.difference.imageAlt, c?.diffImageAlt),
    cards,
  }

  const creesCtaResolved = resolveSmartLinkOrLegacy(
    c?.creesCtaSmartLink,
    { label: c?.creesCtaLabel, href: c?.creesCtaHref, openInNewTab: false },
    { label: fb.crees.ctaLabel, href: fb.crees.ctaHref, openInNewTab: false },
  )

  const crees = {
    sectionId: trimOr(fb.crees.sectionId, c?.creesSectionId),
    eyebrow: trimOr(fb.crees.eyebrow, c?.creesEyebrow),
    title: trimOr(fb.crees.title, c?.creesTitle),
    subtitle: trimOr(fb.crees.subtitle, c?.creesSubtitle),
    paragraphs: paragraphsFromCms(c?.creesBodyParagraphs, fb.crees.paragraphs),
    imageUrl: aboutImage(c?.creesImageUrl, fb.crees.imageUrl, SANITY_IMG.SECTION),
    imageAlt: trimOr(fb.crees.imageAlt, c?.creesImageAlt),
    lockupUrl: trimOr(fb.crees.lockupUrl, c?.creesLockupUrl),
    lockupAlt: trimOr(fb.crees.lockupAlt, c?.creesLockupAlt),
    cta: creesCtaResolved
      ? {
          label: creesCtaResolved.label,
          href: creesCtaResolved.href,
          openInNewTab: creesCtaResolved.openInNewTab,
          rel: creesCtaResolved.rel || undefined,
        }
      : null,
  }

  const way = {
    sectionId: trimOr(fb.way.sectionId, c?.waySectionId),
    eyebrow: trimOr(fb.way.eyebrow, c?.wayEyebrow),
    headline: trimOr(fb.way.headline, c?.wayTitle),
    paragraphs: paragraphsFromCms(c?.wayBodyParagraphs, fb.way.paragraphs),
    pullquote: trimOr(fb.way.pullquote, c?.wayPullquote),
    imageUrl: aboutImage(c?.wayImageUrl, fb.way.imageUrl, SANITY_IMG.SECTION),
    imageAlt: trimOr(fb.way.imageAlt, c?.wayImageAlt),
  }

  let members: Array<{
    key: string
    name: string
    role: string
    affiliation?: string
    bio: string
    imageUrl: string
    imageAlt: string
    linkedinUrl?: string
  }> = fb.people.members.map((m) => ({
    key: m.key,
    name: m.name,
    role: m.role,
    bio: m.bio,
    imageUrl: m.imageUrl,
    imageAlt: m.imageAlt,
  }))
  const peopleCms = c?.peopleCards
  if (Array.isArray(peopleCms) && peopleCms.length > 0) {
    const mapped = peopleCms
      .map((p, i) => {
        const name = p.name?.trim()
        const role = p.role?.trim()
        const bio = p.bio?.trim() || ''
        const affiliation = p.affiliation?.trim() || undefined
        const imageUrl = p.imageUrl?.trim()
        const imageAlt = p.imageAlt?.trim()
        const linkedinUrl = p.linkedinUrl?.trim() || undefined
        if (!name || !role || !imageUrl || !imageAlt) return null
        return {
          key: `person-${i}`,
          name,
          role,
          bio,
          imageUrl: optimizeSanityImageDelivery(imageUrl, SANITY_IMG.ABOUT_PORTRAIT),
          imageAlt,
          ...(affiliation ? { affiliation } : {}),
          ...(linkedinUrl ? { linkedinUrl } : {}),
        }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
    if (mapped.length > 0) members = mapped
  }

  const initialFromCms =
    typeof c?.peopleInitialVisibleCount === 'number' &&
    Number.isFinite(c.peopleInitialVisibleCount) &&
    c.peopleInitialVisibleCount > 0
      ? Math.floor(c.peopleInitialVisibleCount)
      : null

  const people = {
    sectionId: trimOr(fb.people.sectionId, c?.peopleSectionId),
    eyebrow: trimOr(fb.people.eyebrow, c?.peopleEyebrow),
    headline: trimOr(fb.people.headline, c?.peopleTitle),
    intro: trimOr(fb.people.intro, c?.peopleBody),
    initialVisibleCount: initialFromCms ?? fb.people.initialVisibleCount,
    members,
  }

  const bcorpPrimaryResolved = resolveSmartLinkOrLegacy(
    c?.bcorpPrimarySmartLink,
    { label: c?.bcorpPrimaryCtaLabel, href: c?.bcorpPrimaryCtaHref, openInNewTab: true },
    { label: fb.bcorp.primaryCtaLabel, href: fb.bcorp.primaryCtaHref, openInNewTab: false },
  )
  const bcorpSecondaryResolved = resolveSmartLinkOrLegacy(
    c?.bcorpSecondarySmartLink,
    { label: c?.bcorpSecondaryCtaLabel, href: c?.bcorpSecondaryCtaHref, openInNewTab: true },
    { label: fb.bcorp.secondaryCtaLabel, href: fb.bcorp.secondaryCtaHref, openInNewTab: false },
  )

  const bcorp = {
    sectionId: trimOr(fb.bcorp.sectionId, c?.bcorpSectionId),
    eyebrow: trimOr(fb.bcorp.eyebrow, c?.bcorpEyebrow),
    title: trimOr(fb.bcorp.title, c?.bcorpTitle),
    paragraphs: paragraphsFromCms(c?.bcorpBodyParagraphs, fb.bcorp.paragraphs),
    logoMaskUrl: trimOr(fb.bcorp.logoMaskUrl, c?.bcorpLogoUrl),
    logoAlt: trimOr(fb.bcorp.logoAlt, c?.bcorpLogoAlt),
    primaryCta: bcorpPrimaryResolved
      ? {
          label: bcorpPrimaryResolved.label,
          href: bcorpPrimaryResolved.href,
          openInNewTab: bcorpPrimaryResolved.openInNewTab,
          rel: bcorpPrimaryResolved.rel || undefined,
        }
      : null,
    secondaryCta: bcorpSecondaryResolved
      ? {
          label: bcorpSecondaryResolved.label,
          href: bcorpSecondaryResolved.href,
          openInNewTab: bcorpSecondaryResolved.openInNewTab,
          rel: bcorpSecondaryResolved.rel || undefined,
        }
      : null,
  }

  let stats: Array<{ number: string; label: string; description: string }> = fb.proof.stats.map((s) => ({
    number: s.number,
    label: s.label,
    description: s.description,
  }))
  const statsCms = c?.proofStats
  if (Array.isArray(statsCms) && statsCms.length > 0) {
    const mapped = statsCms
      .map((s) => {
        const number = s.value?.trim()
        const label = s.label?.trim()
        const description = s.description?.trim() || ''
        if (!number || !label) return null
        return { number, label, description }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
    if (mapped.length > 0) stats = mapped
  }

  let certs: string[] = [...fb.proof.certs]
  const certsCms = c?.proofCerts
  if (Array.isArray(certsCms) && certsCms.length > 0) {
    const mapped = certsCms.map((x) => String(x).trim()).filter(Boolean)
    if (mapped.length > 0) certs = mapped
  }

  const proof = {
    sectionId: trimOr(fb.proof.sectionId, c?.proofSectionId),
    eyebrow: trimOr(fb.proof.eyebrow, c?.proofEyebrow),
    headline: trimOr(fb.proof.headline, c?.proofTitle),
    intro: trimOr(fb.proof.intro, c?.proofBody),
    stats,
    certLabel: trimOr(fb.proof.certLabel, c?.proofCertLabel),
    certs,
  }

  const finalButtonsCms = c?.finalButtons
  let ctas: AboutPageResolved['finalCta']['ctas'] = fb.finalCta.ctas.map((x) => ({
    label: x.label,
    href: x.href,
    variant: x.variant,
    external: x.external,
  }))
  if (Array.isArray(finalButtonsCms) && finalButtonsCms.length > 0) {
    const mapped = finalButtonsCms
      .map((b, i) => {
        const fbBtn = fb.finalCta.ctas[i] ?? fb.finalCta.ctas[fb.finalCta.ctas.length - 1]
        const resolved = resolveSmartLinkOrLegacy(
          b.smartLink,
          { label: b.label, href: b.href, openInNewTab: b.openInNewTab },
          { label: fbBtn.label, href: fbBtn.href, openInNewTab: fbBtn.external },
        )
        if (!resolved) return null
        const label = resolved.label?.trim()
        const href = resolved.href?.trim()
        if (!label || !href) return null

        const smartHasLabel = Boolean(b.smartLink?.label?.trim() && b.smartLink?.enabled !== false)
        const smartWa = smartHasLabel && b.smartLink?.linkType === 'whatsapp'
        const legacyWa = b.variant?.trim() === 'whatsapp'
        const looksLikeWa = /wa\.me\//i.test(href)
        const useWhatsappStyle = smartWa || legacyWa || looksLikeWa

        let variant: 'primary' | 'secondary' | 'ghost' | 'whatsapp'
        if (useWhatsappStyle) {
          variant = 'whatsapp'
        } else if (smartHasLabel) {
          const vr = b.variant?.trim()
          variant = vr === 'secondary' ? 'secondary' : 'primary'
        } else {
          const variantRaw = b.variant?.trim()
          if (variantRaw === 'whatsapp') {
            variant = 'whatsapp'
          } else if (variantRaw === 'secondary') {
            variant = 'secondary'
          } else if (variantRaw === 'ghost') {
            variant = 'ghost'
          } else {
            variant = 'primary'
          }
        }

        const external =
          variant === 'whatsapp' || resolved.openInNewTab === true || isExternalHref(href)

        return { label, href, variant, external }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
    if (mapped.length > 0) ctas = mapped
  }

  let trust: AboutPageResolved['finalCta']['trust'] = fb.finalCta.trust.map((t) => ({
    key: t.key,
    text: t.text,
    icon: t.icon,
  }))
  const trustCms = c?.finalTrustItems
  if (Array.isArray(trustCms) && trustCms.length > 0) {
    const mapped = trustCms
      .map((t, i) => {
        const text = t.text?.trim()
        if (!text) return null
        return {
          key: `trust-${i}`,
          text,
          icon: mapTrustIcon(t.iconKey),
        }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
    if (mapped.length > 0) trust = mapped
  }

  const hb = homePageTextFields
  const rawB0 = c?.finalButtons?.[0]
  const rawB1 = c?.finalButtons?.[1]
  const fb0 = fb.finalCta.ctas[0]!
  const fb1 = fb.finalCta.ctas[1]!
  const reserveCard = resolveReserveCtaCard({
    settings: c?.reserveCtaSettings,
    lowestUsd: getLowestActiveExperiencePrice(experiencesForPricing),
    legacyPriceLine: hb.bookingPrice,
    legacyPriceSuffix: hb.bookingPriceSuffixSmall,
    legacySubline: hb.bookingPriceSubtext,
    defaultSubline: hb.bookingPriceSubtext ?? '',
    defaultRows: buildReserveRowsForHome(),
    legacyCtas: {
      primarySmart: rawB0?.smartLink,
      primaryLabel: rawB0?.label ?? fb0.label,
      primaryHref: rawB0?.href ?? fb0.href,
      secondarySmart: rawB1?.smartLink,
      secondaryLabel: rawB1?.label ?? fb1.label,
      secondaryHref: rawB1?.href ?? fb1.href,
    },
    defaultTermsHref: '/experiences/soqtapata-pristine-immersion-3d-2n#terms',
  })

  const rs = c?.reserveCtaSettings
  const finalCta = {
    sectionId: trimOr(fb.finalCta.sectionId, c?.finalSectionId),
    eyebrow: rs?.eyebrow?.trim() || trimOr(fb.finalCta.eyebrow, c?.finalEyebrow),
    headline: rs?.title?.trim() || trimOr(fb.finalCta.headline, c?.finalTitle),
    body: rs?.body?.trim() || trimOr(fb.finalCta.body, c?.finalBody),
    ctas,
    trust,
    reserveCard,
  }

  const partnersForBand = filterPublishedPartnerDocs(
    Array.isArray(c?.partnersResolved) ? c.partnersResolved : [],
  )

  const partnersBand = {
    eyebrow: (c?.partnersEyebrow ?? '').trim(),
    title: (c?.partnersTitle ?? '').trim(),
    body: c?.partnersBody?.trim() ? c.partnersBody.trim() : null,
    partners: partnersForBand,
    emptyMessage: (c?.partnersEmptyMessage ?? '').trim() || null,
  }

  const sectionVisibility = resolveAboutPageSectionVisibility(c?.sectionModules ?? null)

  return {
    sectionVisibility,
    seo,
    hero,
    who,
    why,
    crees,
    difference,
    way,
    people,
    bcorp,
    proof,
    finalCta,
    partnersBand,
  }
}
