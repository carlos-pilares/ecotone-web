import { cache } from 'react'

import { mergeJournalPage } from '@/lib/journalDefaults'
import {
  journalAllSlugsQuery,
  journalPageQuery,
  journalPostBySlugQuery,
  journalPostsIndexQuery,
  type JournalPageDoc,
  type JournalPostDetailDoc,
  type BlogPostDoc,
} from '@/lib/queries'
import { clientServer } from '@/lib/sanity'

/** CMS singleton `journalPage` merged with editorial fallbacks. */
export const getJournalIndexPage = cache(async () => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return mergeJournalPage(null)
  }
  try {
    const doc = await clientServer.fetch<JournalPageDoc | null>(journalPageQuery)
    return mergeJournalPage(doc)
  } catch {
    return mergeJournalPage(null)
  }
})

export const getJournalPostsIndex = cache(async (): Promise<BlogPostDoc[]> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return []
  }
  try {
    const rows = await clientServer.fetch<BlogPostDoc[]>(journalPostsIndexQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
})

export const getJournalPostBySlug = cache(async (slug: string): Promise<JournalPostDetailDoc | null> => {
  if (!slug || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return null
  }
  try {
    const doc = await clientServer.fetch<JournalPostDetailDoc | null>(journalPostBySlugQuery, {slug})
    return doc && doc._id ? doc : null
  } catch {
    return null
  }
})

export async function getJournalAllSlugs(): Promise<{slug: string}[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return []
  }
  try {
    const rows = await clientServer.fetch<{slug: string | null}[]>(journalAllSlugsQuery)
    if (!Array.isArray(rows)) return []
    return rows
      .map((r) => (typeof r.slug === 'string' && r.slug.trim() ? {slug: r.slug.trim()} : null))
      .filter((x): x is {slug: string} => x != null)
  } catch {
    return []
  }
}
