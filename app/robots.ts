import type { MetadataRoute } from 'next'

import { PUBLIC_SITE_ORIGIN } from '@/lib/siteUrl'

/**
 * Site-wide robots rules. Campaign and public marketing pages remain crawlable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api/'],
    },
    sitemap: `${PUBLIC_SITE_ORIGIN}/sitemap.xml`,
  }
}
