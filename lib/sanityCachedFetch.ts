import { unstable_cache } from 'next/cache'

import { clientServer } from '@/lib/sanity'

/** Cross-request TTL for global Sanity singletons (10–15 min window). */
export const SANITY_CACHE_REVALIDATE_SECONDS = 12 * 60

type SanityCacheOpts = {
  key: string[]
  tags: string[]
}

/**
 * Wraps a Sanity GROQ fetch with Next.js `unstable_cache` for cross-request reuse.
 * Per-request dedupe remains the caller's responsibility (`cache()` from React).
 */
export function sanityCachedFetch<T>(query: string, params: Record<string, unknown> | undefined, opts: SanityCacheOpts): Promise<T> {
  const paramKey = params ? JSON.stringify(params) : ''
  return unstable_cache(
    async () => clientServer.fetch<T>(query, params ?? {}),
    [...opts.key, paramKey],
    { revalidate: SANITY_CACHE_REVALIDATE_SECONDS, tags: opts.tags },
  )()
}

export function sanityCachedFetchNoParams<T>(query: string, opts: SanityCacheOpts): Promise<T> {
  return sanityCachedFetch<T>(query, undefined, opts)
}
