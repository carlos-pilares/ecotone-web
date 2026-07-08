/** Stable analytics identifiers for lead CTAs — never derive from visible labels. */
export const CTA_IDS = {
  HEADER_BOOK_NOW: 'header_book_now',
  HEADER_TAILOR_PROGRAM: 'header_tailor_program',
  HEADER_TAILOR_BOOK: 'header_tailor_book',
  HOME_DESIGN_PROGRAM: 'home_design_program',
  LODGE_DESIGN_PROGRAM: 'lodge_design_program',
  EXPERIENCE_TAILOR_PROGRAM: 'experience_tailor_program',
  EXPERIENCE_HERO_BOOK: 'experience_hero_book',
  EXPERIENCE_STICKY_BOOK: 'experience_sticky_book',
  EXPERIENCE_RESERVE_BOOK: 'experience_reserve_book',
  EXPERIENCE_RESERVE_WHATSAPP: 'experience_reserve_whatsapp',
  FOOTER_WHATSAPP: 'footer_whatsapp',
  FLOATING_WHATSAPP: 'floating_whatsapp',
  BOOKING_MODAL_WHATSAPP: 'booking_modal_whatsapp',
} as const

export type CtaId = (typeof CTA_IDS)[keyof typeof CTA_IDS]
