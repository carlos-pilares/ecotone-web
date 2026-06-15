import type { ReviewDoc } from '@/lib/queries'

/** Display label: linked KC name first, then legacy manual fields. */
export function getReviewExperienceLabel(r: ReviewDoc): string {
  const fromLp = r.learningProgramme?.title?.trim()
  if (fromLp) return fromLp
  const fromRef = r.experience?.name?.trim()
  if (fromRef) return fromRef
  return r.experienceProgramme?.trim() || r.experienceName?.trim() || ''
}

/**
 * Normalized testimonial for UI (map from `ReviewDoc` or build manually).
 * `experienceSlug` is optional and may be set when associating a review to an experience route.
 */
export type TestimonialReview = {
  id: string
  quote: string
  name: string
  location: string
  experienceName: string | null
  experienceSlug: string | null
  rating: number
  initials: string
}

export function reviewDocToTestimonial(
  r: ReviewDoc,
  experienceSlug: string | null = null,
): TestimonialReview {
  const name = (r.authorName || 'Guest').trim()
  const a = r.authorCity?.trim()
  const c = r.authorCountry?.trim()
  const location = a && c ? `${a}, ${c}` : a || c || ''
  const initial = name.slice(0, 1).toUpperCase() || 'G'
  return {
    id: r._id,
    quote: (r.quote || '').trim(),
    name,
    location,
    experienceName: getReviewExperienceLabel(r) || null,
    experienceSlug,
    rating: r.rating ?? 5,
    initials: initial,
  }
}

export function soqtapataReviewKey(): { programLabel: string; slug: string; displayName: string } {
  return {
    programLabel: 'Soqtapata 3D/2N',
    slug: 'soqtapata-pristine-immersion',
    displayName: 'Soqtapata Pristine Immersion',
  }
}
