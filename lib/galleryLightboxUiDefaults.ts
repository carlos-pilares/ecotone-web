/** Copy por defecto del lightbox a pantalla completa (Experience + Lodge). */
export const GALLERY_LIGHTBOX_UI_DEFAULTS = {
  dialogAriaLabel: 'Photo gallery',
  closeAriaLabel: 'Close gallery',
  previousAriaLabel: 'Previous photo',
  nextAriaLabel: 'Next photo',
} as const

export type GalleryLightboxUiDefaults = typeof GALLERY_LIGHTBOX_UI_DEFAULTS
