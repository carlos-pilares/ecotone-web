/**
 * Fallbacks técnicos para el explorador de experiencias en Home.
 * `homePage` puede sobreescribir cada campo equivalente.
 */
export const HOME_EXPLORER_DEFAULTS = {
  priceEnquire: 'Enquire',
  priceCustom: 'Custom pricing',
  cardCtaView: 'View',
  cardCtaEnquire: 'Enquire',
  tailorRouteDurationLabel: 'Any route · Any duration',
  tailorDescriptionFallback: 'We design every detail for your group.',
  tailorCta: 'Design my journey →',
  /** Si `homePage.explorerTailorWhatsappUrl` y `bookingCta2Link` vienen vacíos (sin siteSettings). */
  tailorWhatsappFallback:
    'https://wa.me/51974781094?text=I%20want%20to%20design%20a%20tailor%20made%20Ecotone%20experience',
  learningWhatsappFallback: 'https://wa.me/51974781094',
  nameFallbackTailor: 'Tailor made',
  nameFallbackBadge: 'Ecotone',
  learningBadgeLabels: ['2w', '4w', '6w'] as const,
} as const
