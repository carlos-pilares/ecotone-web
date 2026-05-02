import type { SanityClient } from '@sanity/client'

import { uploadImageFromUrl } from './sanityWriteClient.js'

/**
 * Dedupes uploads when the same URL appears in several fields (gallery, hero, etc.).
 */
export function createUrlImageCache(client: SanityClient) {
  const map = new Map<string, Promise<Record<string, unknown>>>()
  return {
    get(url: string, filename: string) {
      const hit = map.get(url)
      if (hit) return hit
      const p = uploadImageFromUrl(client, url, filename) as Promise<Record<string, unknown>>
      map.set(url, p)
      return p
    },
  }
}
