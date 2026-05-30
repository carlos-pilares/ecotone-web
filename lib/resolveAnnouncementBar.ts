import type { AnnouncementBarDoc, ResolvedAnnouncementBar } from '@/lib/promotionTypes'
import {
  announcementMatchesPage,
  isPromotionWithinSchedule,
} from '@/lib/promotionMatching'
import { resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'

export function resolveAnnouncementBar(
  doc: AnnouncementBarDoc | null | undefined,
  pathname: string,
  now: Date = new Date(),
): ResolvedAnnouncementBar | null {
  if (!doc?.enabled) return null
  const message = doc.message?.trim() ?? ''
  if (!message) return null

  if (!isPromotionWithinSchedule({ startDate: doc.startDate, endDate: doc.endDate }, now)) {
    return null
  }

  if (!announcementMatchesPage(doc.showOnPages, pathname)) return null

  let cta: ResolvedAnnouncementBar['cta'] = null
  const ctaLabel = doc.ctaLabel?.trim()
  const smart = doc.ctaSmartLink
  if (ctaLabel && smart && smart.enabled !== false) {
    const resolved = resolveSmartLinkOrLegacy(smart, null, { label: ctaLabel, href: '#', openInNewTab: false })
    if (resolved?.href && resolved.href !== '#') {
      cta = {
        label: resolved.label || ctaLabel,
        href: resolved.href,
        openInNewTab: resolved.openInNewTab,
        rel: resolved.rel,
      }
    }
  }

  return {
    visible: true,
    message,
    secondaryText: doc.secondaryText?.trim() ?? '',
    cta,
    dismissible: doc.dismissible !== false,
    storageKey: 'ecotone-announcement-dismissed-v1',
  }
}
