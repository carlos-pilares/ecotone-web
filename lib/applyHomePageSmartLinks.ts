/**
 * After `mergeHomePageWithDefaults`, applies optional `homePage.*SmartLink` fields so that
 * smartLink overrides legacy string pairs when present (same contract as About/Routes).
 */
import type { ResolvedHomePage } from '@/lib/homePageDefaults'
import type { HomePageDoc } from '@/lib/queries'
import { resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

function str(v: unknown): string {
  if (v == null) return ''
  return String(v).trim()
}

function applyPair(
  smart: SmartLinkGroq | null | undefined,
  legacyLabel: string | null | undefined,
  legacyHref: string | null | undefined,
  fbLabel: string,
  fbHref: string,
  setLabel: (v: string) => void,
  setHref: (v: string) => void,
) {
  const r = resolveSmartLinkOrLegacy(
    smart,
    { label: legacyLabel, href: legacyHref, openInNewTab: false },
    { label: fbLabel, href: fbHref, openInNewTab: false },
  )
  setLabel(r.label)
  setHref(r.href)
}

export function applyHomePageSmartLinks(cms: HomePageDoc | null, merged: ResolvedHomePage): ResolvedHomePage {
  if (!cms) return merged
  const o = { ...merged }

  applyPair(
    cms.heroCta1SmartLink,
    cms.heroCta1Text,
    cms.heroCta1Link,
    o.heroCta1Text ?? '',
    o.heroCta1Link ?? '',
    (v) => {
      o.heroCta1Text = v
    },
    (v) => {
      o.heroCta1Link = v
    },
  )
  applyPair(
    cms.heroCta2SmartLink,
    cms.heroCta2Text,
    cms.heroCta2Link,
    o.heroCta2Text ?? '',
    o.heroCta2Link ?? '',
    (v) => {
      o.heroCta2Text = v
    },
    (v) => {
      o.heroCta2Link = v
    },
  )
  applyPair(
    cms.heroCardCtaSmartLink,
    cms.heroCardCtaText,
    cms.heroCardCtaLink,
    o.heroCardCtaText ?? '',
    o.heroCardCtaLink ?? '',
    (v) => {
      o.heroCardCtaText = v
    },
    (v) => {
      o.heroCardCtaLink = v
    },
  )

  applyPair(
    cms.manifestoCta1SmartLink,
    cms.manifestoCta1Text,
    cms.manifestoCta1Link,
    o.manifestoCta1Text ?? '',
    o.manifestoCta1Link ?? '',
    (v) => {
      o.manifestoCta1Text = v
    },
    (v) => {
      o.manifestoCta1Link = v
    },
  )
  applyPair(
    cms.manifestoCta2SmartLink,
    cms.manifestoCta2Text,
    cms.manifestoCta2Link,
    o.manifestoCta2Text ?? '',
    o.manifestoCta2Link ?? '',
    (v) => {
      o.manifestoCta2Text = v
    },
    (v) => {
      o.manifestoCta2Link = v
    },
  )

  applyPair(
    cms.missionCtaSmartLink,
    cms.missionCtaText,
    cms.missionCtaLink,
    o.missionCtaText ?? '',
    o.missionCtaLink ?? '',
    (v) => {
      o.missionCtaText = v
    },
    (v) => {
      o.missionCtaLink = v
    },
  )

  applyPair(
    cms.explorerEmptyGridSmartLink,
    cms.explorerEmptyGridLinkLabel,
    cms.explorerEmptyGridLinkHref,
    o.explorerEmptyGridLinkLabel ?? '',
    o.explorerEmptyGridLinkHref ?? '',
    (v) => {
      o.explorerEmptyGridLinkLabel = v
    },
    (v) => {
      o.explorerEmptyGridLinkHref = v
    },
  )

  applyPair(
    cms.explorerTailorWhatsappSmartLink,
    cms.explorerTailorCtaText,
    cms.explorerTailorWhatsappUrl,
    o.explorerTailorCtaText ?? '',
    o.explorerTailorWhatsappUrl ?? '',
    (v) => {
      o.explorerTailorCtaText = v
    },
    (v) => {
      o.explorerTailorWhatsappUrl = v
    },
  )

  applyPair(
    cms.blogAllPostsSmartLink,
    cms.blogAllPostsLabel,
    cms.blogAllPostsUrl != null ? str(cms.blogAllPostsUrl) : null,
    o.blogAllPostsLabel ?? '',
    o.blogAllPostsUrl ?? '',
    (v) => {
      o.blogAllPostsLabel = v
    },
    (v) => {
      o.blogAllPostsUrl = v
    },
  )

  applyPair(
    cms.bookingCta1SmartLink,
    cms.bookingCta1Text,
    cms.bookingCta1Link,
    o.bookingCta1Text ?? '',
    o.bookingCta1Link ?? '',
    (v) => {
      o.bookingCta1Text = v
    },
    (v) => {
      o.bookingCta1Link = v
    },
  )
  applyPair(
    cms.bookingCta2SmartLink,
    cms.bookingCta2Text,
    cms.bookingCta2Link,
    o.bookingCta2Text ?? '',
    o.bookingCta2Link ?? '',
    (v) => {
      o.bookingCta2Text = v
    },
    (v) => {
      o.bookingCta2Link = v
    },
  )

  return o
}
