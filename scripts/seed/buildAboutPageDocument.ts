/**
 * Builds the `aboutPage` singleton for Sanity (aligned with `data/aboutStatic.ts`).
 * Used by `seed:cms` / `seed:about-page` after URL image cache is ready.
 */
import type { SanityClient } from '@sanity/client'

import { CMS_IDS } from '@/data/cmsApproved/ids'
import { partnerSeeds } from '@/data/cmsApproved/librarySeeds'
import { aboutPartnersCopy, aboutSeoFallback, aboutStatic } from '@/data/aboutStatic'

import { createUrlImageCache } from './urlImageCache'

type UrlImageCache = ReturnType<typeof createUrlImageCache>

function k(n: string) {
  return { _key: n }
}

function stripUndefinedDeep<T>(input: T): T {
  if (input === undefined || input === null) return input
  if (typeof input !== 'object') return input
  if (Array.isArray(input)) {
    return input
      .map((x) => stripUndefinedDeep(x))
      .filter((x) => x !== undefined) as T
  }
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(input as Record<string, unknown>)) {
    if (val === undefined) continue
    const next = stripUndefinedDeep(val)
    if (next !== undefined) out[key] = next
  }
  return out as T
}

export async function buildAboutPageDocument(client: SanityClient, imageCache?: UrlImageCache) {
  const cache = imageCache ?? createUrlImageCache(client)
  const fb = aboutStatic

  const heroImage = await cache.get(fb.hero.imageUrl, 'about-hero.jpg')
  const whoImage = await cache.get(fb.who.imageUrl, 'about-who.jpg')
  const wayImage = await cache.get(fb.way.imageUrl, 'about-way.jpg')
  const personImages = await Promise.all(
    fb.people.members.map((m, i) => cache.get(m.imageUrl, `about-person-${i + 1}.jpg`)),
  )

  const whoBodyParagraphs = fb.who.paragraphs.map((text, i) => ({
    ...k(`wp-${i}`),
    _type: 'aboutPageParagraph' as const,
    text,
  }))

  const whoPills = fb.who.pills.map((label, i) => ({
    ...k(`pill-${i}`),
    _type: 'aboutPagePill' as const,
    label,
  }))

  const diffCards = fb.difference.cards.map((c, i) => ({
    ...k(`dc-${i}`),
    _type: 'aboutPageDiffCard' as const,
    iconKey: c.key,
    title: c.title,
    description: c.description,
  }))

  const wayBodyParagraphs = fb.way.paragraphs.map((text, i) => ({
    ...k(`wy-${i}`),
    _type: 'aboutPageParagraph' as const,
    text,
  }))

  const peopleCards = fb.people.members.map((m, i) => ({
    ...k(`pc-${i}`),
    _type: 'aboutPagePerson' as const,
    image: personImages[i],
    imageAlt: m.imageAlt,
    name: m.name,
    role: m.role,
    bio: m.bio,
  }))

  const proofStats = fb.proof.stats.map((s, i) => ({
    ...k(`ps-${i}`),
    _type: 'aboutPageStat' as const,
    value: s.number,
    label: s.label,
    description: s.description,
  }))

  const partnerRefs = partnerSeeds.map((p, i) => ({
    _type: 'reference' as const,
    _ref: p._id,
    _key: `pref-${i}`,
  }))

  const finalButtons = fb.finalCta.ctas.map((c, i) => ({
    ...k(`fb-${i}`),
    _type: 'aboutPageCtaButton' as const,
    label: c.label,
    href: c.href,
    variant: c.external && c.variant === 'ghost' ? ('whatsapp' as const) : c.variant === 'secondary' ? ('secondary' as const) : ('primary' as const),
    openInNewTab: c.external === true,
  }))

  const finalTrustItems = fb.finalCta.trust.map((t, i) => ({
    ...k(`ft-${i}`),
    _type: 'aboutPageTrustItem' as const,
    iconKey: t.icon,
    text: t.text,
  }))

  const doc = {
    _id: CMS_IDS.aboutPage,
    _type: 'aboutPage' as const,
    internalTitle: 'About (landing)',
    slug: {_type: 'slug' as const, current: 'about'},
    seo: {
      _type: 'seo' as const,
      title: aboutSeoFallback.title,
      description: aboutSeoFallback.description,
      noIndex: false,
    },
    heroImage,
    heroImageAlt: fb.hero.imageAlt,
    heroEyebrow: fb.hero.eyebrow,
    heroTitle: fb.hero.titleLines.join('\n'),
    heroTagline: fb.hero.tagline,
    heroPrimaryCta: {
      _type: 'linkWithLabel' as const,
      label: fb.hero.primaryLabel,
      href: fb.hero.primaryHref,
      openInNewTab: false,
    },
    heroSecondaryCta: {
      _type: 'linkWithLabel' as const,
      label: fb.hero.secondaryLabel,
      href: fb.hero.secondaryHref,
      openInNewTab: false,
    },
    whoSectionId: fb.who.sectionId,
    whoImage,
    whoImageAlt: fb.who.imageAlt,
    whoEyebrow: fb.who.eyebrow,
    whoTitle: fb.who.headline,
    whoBodyParagraphs,
    whoPills,
    whySectionId: fb.why.sectionId,
    whyEyebrow: fb.why.eyebrow,
    whyTitle: fb.why.headlineLines.join('\n'),
    whyBody: fb.why.body,
    diffSectionId: fb.difference.sectionId,
    diffEyebrow: fb.difference.eyebrow,
    diffTitle: fb.difference.headline,
    diffCards,
    waySectionId: fb.way.sectionId,
    wayImage,
    wayImageAlt: fb.way.imageAlt,
    wayEyebrow: fb.way.eyebrow,
    wayTitle: fb.way.headline,
    wayBodyParagraphs,
    wayPullquote: fb.way.pullquote,
    peopleSectionId: fb.people.sectionId,
    peopleEyebrow: fb.people.eyebrow,
    peopleTitle: fb.people.headline,
    peopleBody: fb.people.intro,
    peopleCards,
    proofSectionId: fb.proof.sectionId,
    proofEyebrow: fb.proof.eyebrow,
    proofTitle: fb.proof.headline,
    proofBody: fb.proof.intro,
    proofStats,
    proofCertLabel: fb.proof.certLabel,
    proofCerts: [...fb.proof.certs],
    partnersLabel: aboutPartnersCopy.label,
    partnersBody: aboutPartnersCopy.body ?? undefined,
    partnerRefs,
    finalSectionId: fb.finalCta.sectionId,
    finalEyebrow: fb.finalCta.eyebrow,
    finalTitle: fb.finalCta.headline,
    finalBody: fb.finalCta.body,
    finalButtons,
    finalTrustItems,
  }

  return stripUndefinedDeep(doc)
}
