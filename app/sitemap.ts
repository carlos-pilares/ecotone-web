import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'

import { getLodgePageSlugsForStaticParams } from '@/lib/lodgePageCms'
import { experienceLandingSlugsQuery } from '@/lib/queries'
import { clientServer } from '@/lib/sanity'

/** Production canonical origin for Search Console / crawlers. */
const BASE_URL = 'https://www.ecotone.eco'

/** Published journal posts that are not marked noIndex, with reliable timestamps. */
const journalSitemapQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && seo.noIndex != true] {
    "slug": slug.current,
    "lastModified": coalesce(publishedAt, _updatedAt)
  }
`

function absoluteUrl(path: string): string {
  if (path === '/') return BASE_URL
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function entry(path: string, lastModified: Date = new Date()): MetadataRoute.Sitemap[number] {
  return { url: absoluteUrl(path), lastModified }
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value || typeof value !== 'string') return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function hasSanityConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() &&
      process.env.NEXT_PUBLIC_SANITY_DATASET?.trim(),
  )
}

/**
 * Public indexable sitemap for Ecotone.
 * Dynamic slugs come from the same Sanity sources used by generateStaticParams.
 * Experience detail routes are omitted until that App Router surface ships on main.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildDate = new Date()

  // Static marketing / legal pages that have real App Router pages (no redirect-only indexes).
  // `/experiences` and `/lodges` permanently redirect to `/` — omitted on purpose.
  // `/blog` permanently redirects to `/journal` — omit `/blog`.
  const staticPaths = [
    '/',
    '/routes',
    '/about',
    '/journal',
    '/crees-manu',
    '/manu-field-crew-2027',
    '/manu-conservation-volunteer',
    '/wonder-beyond-the-wonder',
    '/privacy-policy',
    '/privacy-policy-app',
  ] as const

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => entry(path, buildDate))

  if (!hasSanityConfig()) {
    entries.push(entry('/lodges/soqtapata-lodge', buildDate))
    return entries
  }

  const [experienceSlugs, lodgeRows, journalRows] = await Promise.all([
    clientServer
      .fetch<(string | null)[] | null>(experienceLandingSlugsQuery)
      .catch(() => null),
    getLodgePageSlugsForStaticParams().catch(() => [] as { slug: string }[]),
    clientServer
      .fetch<Array<{ slug: string | null; lastModified?: string | null }> | null>(journalSitemapQuery)
      .catch(() => null),
  ])

  const seen = new Set(entries.map((e) => e.url))

  const pushPath = (path: string, lastModified: Date = buildDate) => {
    const url = absoluteUrl(path)
    if (seen.has(url)) return
    seen.add(url)
    entries.push({ url, lastModified })
  }

  for (const slug of experienceSlugs ?? []) {
    const s = typeof slug === 'string' ? slug.trim() : ''
    if (!s) continue
    pushPath(`/experiences/${s}`, buildDate)
  }

  for (const row of lodgeRows ?? []) {
    const s = typeof row?.slug === 'string' ? row.slug.trim() : ''
    if (!s) continue
    pushPath(`/lodges/${s}`, buildDate)
  }

  for (const row of journalRows ?? []) {
    const s = typeof row?.slug === 'string' ? row.slug.trim() : ''
    if (!s) continue
    pushPath(`/journal/${s}`, parseDate(row.lastModified) ?? buildDate)
  }

  return entries
}
