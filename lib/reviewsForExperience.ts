import type { ReviewDoc } from '@/lib/queries'

/** Keeps reviews whose `experienceName` lines up with this program (slug, name, or partial slug). */
export function filterReviewsForExperience(
  reviews: ReviewDoc[] | null | undefined,
  experienceName: string,
  slug: string,
): ReviewDoc[] {
  if (!reviews?.length) return []
  const s = (slug || '').toLowerCase().trim()
  const n = (experienceName || '').toLowerCase().trim()
  return reviews.filter((r) => {
    const ex = (r.experienceName || '').trim()
    if (!ex) return false
    const el = ex.toLowerCase()
    if (s && el === s) return true
    if (n && el === n) return true
    if (s.length > 2 && el.includes(s)) return true
    return false
  })
}
