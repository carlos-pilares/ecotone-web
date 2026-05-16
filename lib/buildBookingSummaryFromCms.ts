import type { ExperienceBookingSummary } from '@/components/booking/types'

/** Matches hero / reserve pricing line on experience landings. */
export const EXPERIENCE_BOOKING_PRICE_SUB = 'per person · all inclusive'

const PROGRAM: Record<string, string> = {
  'classic-nature': 'Classic Nature',
  signature: 'Signature',
  learning: 'Learning',
  'tailor-made': 'Tailor Made',
}

export type CmsBookingExperienceRow = {
  name?: string | null
  tagline?: string | null
  programType?: string | null
  route?: string | null
  duration?: string | null
  price?: number | null
  priceLabel?: string | null
  mainImageUrl?: string | null
}

/** Build modal banner payload from a dereferenced Experience KC row. */
export function buildBookingSummaryFromCmsExperience(
  exp: CmsBookingExperienceRow | null | undefined,
): ExperienceBookingSummary | null {
  if (!exp) return null
  const name = exp.name?.trim()
  if (!name) return null

  const programType = (exp.programType && PROGRAM[exp.programType]) || exp.programType?.trim() || 'Nature program'
  const route = exp.route?.trim() || ''
  const duration = exp.duration?.trim() || ''
  let priceLine = 'Enquire'
  if (exp.price != null && exp.price > 0) priceLine = `from $${exp.price}`
  else if (exp.priceLabel?.trim()) priceLine = exp.priceLabel.trim()

  return {
    experienceName: name,
    imageSrc: exp.mainImageUrl?.trim() || '',
    imageAlt: name,
    route,
    duration,
    programType,
    priceLine,
    priceSub: EXPERIENCE_BOOKING_PRICE_SUB,
  }
}
