/**
 * Maps `AboutPageSanityDoc` (schema `aboutPage`) to the shapes consumed by `components/about/*`,
 * merging with `data/aboutStatic.ts` when fields are missing.
 */
import { aboutPartnersCopy, aboutPartnersFallback, aboutSeoFallback, aboutStatic } from '@/data/aboutStatic'
import type { AboutPageSanityDoc } from '@/lib/aboutPageQuery'
import type { PartnerDoc } from '@/lib/queries'
import { resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'

function trimOr(fallback: string, v?: string | null) {
  const t = v?.trim()
  return t ? t : fallback
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
    primaryLabel: string
    primaryHref: string
    primaryOpenInNewTab: boolean
    primaryRel?: string
    secondaryLabel: string
    secondaryHref: string
    secondaryOpenInNewTab: boolean
    secondaryRel?: string
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
    cards: Array<{ key: string; title: string; description: string }>
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
    members: Array<{
      key: string
      name: string
      role: string
      bio: string
      imageUrl: string
      imageAlt: string
    }>
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
      variant: 'primary' | 'secondary' | 'ghost'
      external: boolean
    }>
    trust: Array<{ key: string; text: string; icon: 'check' | 'shield' | 'heart' }>
  }
  partnersBand: {
    label: string
    body: string | null
    partners: PartnerDoc[]
    partnerNameFallback: string
    emptyMessage: string | null
  }
}

const fb = aboutStatic

export function resolveAboutPageData(
  cms: AboutPageSanityDoc | null,
  allPartnersFromLibrary: PartnerDoc[],
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
    primaryLabel: primaryResolved.label,
    primaryHref: primaryResolved.href,
    primaryOpenInNewTab: primaryResolved.openInNewTab,
    primaryRel: primaryResolved.rel || undefined,
    secondaryLabel: secondaryResolved.label,
    secondaryHref: secondaryResolved.href,
    secondaryOpenInNewTab: secondaryResolved.openInNewTab,
    secondaryRel: secondaryResolved.rel || undefined,
    imageUrl: trimOr(fb.hero.imageUrl, c?.heroImageUrl),
    imageAlt: trimOr(fb.hero.imageAlt, c?.heroImageAlt),
  }

  const who = {
    sectionId: trimOr(fb.who.sectionId, c?.whoSectionId),
    eyebrow: trimOr(fb.who.eyebrow, c?.whoEyebrow),
    headline: trimOr(fb.who.headline, c?.whoTitle),
    paragraphs: paragraphsFromCms(c?.whoBodyParagraphs, fb.who.paragraphs),
    imageUrl: trimOr(fb.who.imageUrl, c?.whoImageUrl),
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
      .map((row) => {
        const key = row.iconKey?.trim()
        const title = row.title?.trim()
        const description = row.description?.trim() || ''
        if (!key || !title) return null
        return { key, title, description }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
    if (mapped.length > 0) cards = mapped
  }

  const difference = {
    sectionId: trimOr(fb.difference.sectionId, c?.diffSectionId),
    eyebrow: trimOr(fb.difference.eyebrow, c?.diffEyebrow),
    headline: trimOr(fb.difference.headline, c?.diffTitle),
    cards,
  }

  const way = {
    sectionId: trimOr(fb.way.sectionId, c?.waySectionId),
    eyebrow: trimOr(fb.way.eyebrow, c?.wayEyebrow),
    headline: trimOr(fb.way.headline, c?.wayTitle),
    paragraphs: paragraphsFromCms(c?.wayBodyParagraphs, fb.way.paragraphs),
    pullquote: trimOr(fb.way.pullquote, c?.wayPullquote),
    imageUrl: trimOr(fb.way.imageUrl, c?.wayImageUrl),
    imageAlt: trimOr(fb.way.imageAlt, c?.wayImageAlt),
  }

  let members: Array<{
    key: string
    name: string
    role: string
    bio: string
    imageUrl: string
    imageAlt: string
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
        const imageUrl = p.imageUrl?.trim()
        const imageAlt = p.imageAlt?.trim()
        if (!name || !role || !imageUrl || !imageAlt) return null
        return {
          key: `person-${i}`,
          name,
          role,
          bio,
          imageUrl,
          imageAlt,
        }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
    if (mapped.length > 0) members = mapped
  }

  const people = {
    sectionId: trimOr(fb.people.sectionId, c?.peopleSectionId),
    eyebrow: trimOr(fb.people.eyebrow, c?.peopleEyebrow),
    headline: trimOr(fb.people.headline, c?.peopleTitle),
    intro: trimOr(fb.people.intro, c?.peopleBody),
    members,
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
      .map((b) => {
        const label = b.label?.trim()
        const href = b.href?.trim()
        const variantRaw = b.variant?.trim()
        if (!label || !href) return null
        const openInNew = b.openInNewTab === true
        if (variantRaw === 'whatsapp') {
          return { label, href, variant: 'ghost' as const, external: true }
        }
        const variant = variantRaw === 'secondary' ? ('secondary' as const) : ('primary' as const)
        return { label, href, variant, external: openInNew }
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

  const finalCta = {
    sectionId: trimOr(fb.finalCta.sectionId, c?.finalSectionId),
    eyebrow: trimOr(fb.finalCta.eyebrow, c?.finalEyebrow),
    headline: trimOr(fb.finalCta.headline, c?.finalTitle),
    body: trimOr(fb.finalCta.body, c?.finalBody),
    ctas,
    trust,
  }

  const curated = Array.isArray(c?.partnersResolved)
    ? c.partnersResolved.filter((p): p is PartnerDoc => Boolean(p?._id))
    : []
  const partnersForBand =
    curated.length > 0
      ? curated
      : allPartnersFromLibrary.length > 0
        ? allPartnersFromLibrary
        : aboutPartnersFallback

  const partnersBand = {
    label: trimOr(aboutPartnersCopy.label, c?.partnersLabel),
    body: c?.partnersBody?.trim() ? c.partnersBody.trim() : aboutPartnersCopy.body,
    partners: partnersForBand,
    partnerNameFallback: aboutPartnersCopy.partnerNameFallback,
    emptyMessage: aboutPartnersCopy.emptyMessage,
  }

  return {
    seo,
    hero,
    who,
    why,
    difference,
    way,
    people,
    proof,
    finalCta,
    partnersBand,
  }
}
