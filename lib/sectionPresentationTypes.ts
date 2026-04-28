/**
 * Tipos compartidos para la presentación por sección (eyebrow, title, intro).
 * La fuente del contenido largo sigue en Experience / CMS — esto solo cubre rótulos y lead opcional.
 */

/** Claves alineadas con `pageModule.key` / orden editorial de la landing Soqtapata. */
export type SectionModuleKey =
  | 'overview'
  | 'itinerary'
  | 'lodge'
  | 'wildlife'
  | 'includes'
  | 'tech'
  | 'media'
  | 'whenToVisit'
  | 'beforeYouGo'
  | 'reviews'
  | 'terms'
  | 'resources'
  | 'faq'
  | 'related'
  | 'reserve'

/** Origen del valor tras aplicar landing → experience → defaults */
export type PresentationValueSource = 'landing' | 'experience' | 'default'

/** Una fila del mapa editorial por defecto (sin depender del objeto completo `soqtapataExperience`). */
export type SectionPresentationDefaultsRow = {
  eyebrow: string
  title: string
  /**
   * Intro / lead opcional para la sección. Vacío es válido.
   * No sustituye listas, FAQs, itinerario largo, etc.
   */
  text: string
}

/** Overrides desde la landing (p. ej. `pageModule` o campos futuros dedicados). */
export type LandingSectionOverride = {
  eyebrow?: string | null
  /** Equivalente editorial al H2 de la sección */
  sectionTitle?: string | null
  /** Intro / lead solo para esta URL */
  sectionText?: string | null
  visible?: boolean | null
}

/** Solo etiquetas por sección desde el documento Experience (Sanity), cuando existan en schema. */
export type ExperiencePresentationSlice = Partial<
  Record<
    SectionModuleKey,
    {
      eyebrow?: string | null
      title?: string | null
      /** Intro / lead desde producto cuando exista campo dedicado */
      text?: string | null
    }
  >
>

export type ResolveSectionPresentationCtx = {
  landing?: LandingSectionOverride | null
  experiencePresentation?: ExperiencePresentationSlice | null
}

export type ResolvedSectionPresentation = {
  eyebrow: string
  title: string
  /** Siempre presente; puede ser cadena vacía */
  text: string
  visible: boolean
  eyebrowSource: PresentationValueSource
  titleSource: PresentationValueSource
  textSource: PresentationValueSource
  visibleSource: PresentationValueSource
}
