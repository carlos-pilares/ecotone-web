import type { ReviewDoc } from '@/lib/queries'

/** Prefer linked KC refs (`experience`, `learningProgramme`); else legacy manual programme/name text. */
export function filterReviewsForExperience(
  reviews: ReviewDoc[] | null | undefined,
  experienceName: string,
  slug: string,
  learningProgrammeId?: string | null,
): ReviewDoc[] {
  if (!reviews?.length) return []
  const s = (slug || '').toLowerCase().trim()
  const n = (experienceName || '').toLowerCase().trim()
  const lpId = learningProgrammeId?.trim() || ''
  return reviews.filter((r) => {
    if (lpId && r.learningProgramme?._id === lpId) return true
    const lpTitle = r.learningProgramme?.title?.toLowerCase().trim() || ''
    const lpSlug = r.learningProgramme?.slug?.current?.toLowerCase().trim() || ''
    if (n && lpTitle === n) return true
    if (s && lpSlug === s) return true

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
