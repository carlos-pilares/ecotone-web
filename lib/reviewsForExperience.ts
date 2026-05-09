import type { ReviewDoc } from '@/lib/queries'

/** Prefer `review.experience` ref; else legacy manual programme/name text. */
export function filterReviewsForExperience(
  reviews: ReviewDoc[] | null | undefined,
  experienceName: string,
  slug: string,
): ReviewDoc[] {
  if (!reviews?.length) return []
  const s = (slug || '').toLowerCase().trim()
  const n = (experienceName || '').toLowerCase().trim()
  return reviews.filter((r) => {
    const refSlug = r.experience?.slug?.current?.toLowerCase().trim() || ''
    const refName = r.experience?.name?.toLowerCase().trim() || ''
    if (s && refSlug === s) return true
    if (n && refName === n) return true
    if (s.length > 2 && refSlug.includes(s)) return true
    if (s.length > 2 && refName.includes(s)) return true

    const ex = (r.experienceProgramme || r.experienceName || '').trim()
    if (!ex) return false
    const el = ex.toLowerCase()
    if (s && el === s) return true
    if (n && el === n) return true
    if (s.length > 2 && el.includes(s)) return true
    return false
  })
}
