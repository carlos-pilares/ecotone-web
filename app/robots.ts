import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.ecotone.eco'

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
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
