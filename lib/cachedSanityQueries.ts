import type { BookingModalSettingsRow } from '@/lib/bookingModalCopy'
import { bookingModalSettingsQuery } from '@/lib/bookingModalSettingsQuery'
import type { AnnouncementBarDoc, PromotionDoc } from '@/lib/promotionTypes'
import { activePromotionsQuery, announcementBarSettingsQuery } from '@/lib/promotionsQuery'
import {
  faqsSettingsQuery,
  siteSettingsShellQuery,
  termsConditionsSettingsQuery,
  travellerGuideSettingsQuery,
} from '@/lib/queries'
import type { FaqsSettingsRow } from '@/lib/faqsCms'
import type { TermsConditionsSettingsRow } from '@/lib/termsConditionsCms'
import type { TravellerGuideSettingsRow } from '@/lib/travellerGuideCms'
import { sanityCachedFetchNoParams } from '@/lib/sanityCachedFetch'
import { siteHeaderNavBundleQuery, type SiteHeaderNavBundleRow } from '@/lib/siteHeaderNavQuery'
import type { SiteSettingsShellBundleRow } from '@/lib/getSiteSettingsShell'

export function fetchSiteSettingsShellCached(): Promise<SiteSettingsShellBundleRow> {
  return sanityCachedFetchNoParams<SiteSettingsShellBundleRow>(siteSettingsShellQuery, {
    key: ['sanity', 'siteSettingsShell'],
    tags: ['sanity:siteSettingsShell'],
  })
}

export function fetchBookingModalSettingsCached(): Promise<BookingModalSettingsRow> {
  return sanityCachedFetchNoParams<BookingModalSettingsRow>(bookingModalSettingsQuery, {
    key: ['sanity', 'bookingModalSettings'],
    tags: ['sanity:bookingModalSettings'],
  })
}

export function fetchAnnouncementBarSettingsCached(): Promise<AnnouncementBarDoc | null> {
  return sanityCachedFetchNoParams<AnnouncementBarDoc | null>(announcementBarSettingsQuery, {
    key: ['sanity', 'announcementBarSettings'],
    tags: ['sanity:announcementBarSettings'],
  })
}

export function fetchActivePromotionsCached(): Promise<PromotionDoc[] | null> {
  return sanityCachedFetchNoParams<PromotionDoc[] | null>(activePromotionsQuery, {
    key: ['sanity', 'activePromotions'],
    tags: ['sanity:activePromotions'],
  })
}

export function fetchTermsConditionsSettingsCached(): Promise<TermsConditionsSettingsRow> {
  return sanityCachedFetchNoParams<TermsConditionsSettingsRow>(termsConditionsSettingsQuery, {
    key: ['sanity', 'termsConditionsSettings'],
    tags: ['sanity:termsConditionsSettings'],
  })
}

export function fetchFaqsSettingsCached(): Promise<FaqsSettingsRow> {
  return sanityCachedFetchNoParams<FaqsSettingsRow>(faqsSettingsQuery, {
    key: ['sanity', 'faqsSettings'],
    tags: ['sanity:faqsSettings'],
  })
}

export function fetchTravellerGuideSettingsCached(): Promise<TravellerGuideSettingsRow> {
  return sanityCachedFetchNoParams<TravellerGuideSettingsRow>(travellerGuideSettingsQuery, {
    key: ['sanity', 'travellerGuideSettings'],
    tags: ['sanity:travellerGuideSettings'],
  })
}

export function fetchSiteHeaderNavBundleCached(): Promise<SiteHeaderNavBundleRow> {
  return sanityCachedFetchNoParams<SiteHeaderNavBundleRow>(siteHeaderNavBundleQuery, {
    key: ['sanity', 'siteHeaderNavBundle'],
    tags: ['sanity:siteHeaderNavBundle'],
  })
}
