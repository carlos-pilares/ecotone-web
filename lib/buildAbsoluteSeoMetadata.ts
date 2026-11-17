import type { Metadata } from 'next'

import { absoluteUrl } from '@/lib/siteUrl'

/**
 * Absolute canonical + Open Graph identity for public App Router pages.
 * Uses Sprint A `absoluteUrl()` (production origin unless NEXT_PUBLIC_SITE_URL overrides).
 */
export function buildAbsoluteSeoMetadata(opts: {
  path: string
  title: string
  description?: string | null
  noIndex?: boolean
  ogImageUrl?: string | null
}): Metadata {
  const canonical = absoluteUrl(opts.path)
  const title = opts.title.trim()
  const description = opts.description?.trim() || undefined
  const image = opts.ogImageUrl?.trim()
  const images = image ? [{ url: image }] : undefined

  return {
    title: title || undefined,
    description,
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical },
    openGraph: {
      title: title || undefined,
      description,
      url: canonical,
      ...(images ? { images } : {}),
    },
  }
}
