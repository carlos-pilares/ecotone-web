import { SECTION_DEFAULTS } from './sectionPresentationDefaults'
import type {
  PresentationValueSource,
  ResolveSectionPresentationCtx,
  ResolvedSectionPresentation,
  SectionModuleKey,
} from './sectionPresentationTypes'

export type {
  ExperiencePresentationSlice,
  LandingSectionOverride,
  PresentationValueSource,
  ResolveSectionPresentationCtx,
  ResolvedSectionPresentation,
  SectionModuleKey,
  SectionPresentationDefaultsRow,
} from './sectionPresentationTypes'

export { SECTION_DEFAULTS } from './sectionPresentationDefaults'

const EMPTY_KEY_FALLBACK: ResolvedSectionPresentation = {
  eyebrow: '',
  title: '',
  text: '',
  visible: true,
  eyebrowSource: 'default',
  titleSource: 'default',
  textSource: 'default',
  visibleSource: 'default',
}

function trimOrEmpty(value: string | null | undefined): string {
  if (value == null) return ''
  return typeof value === 'string' ? value.trim() : String(value).trim()
}

function resolveFirstNonEmpty(args: {
  landing?: string | null
  experience?: string | null
  fallback: string
}): { value: string; source: PresentationValueSource } {
  const L = trimOrEmpty(args.landing)
  if (L !== '') return { value: L, source: 'landing' }
  const E = trimOrEmpty(args.experience)
  if (E !== '') return { value: E, source: 'experience' }
  return { value: args.fallback, source: 'default' }
}

function resolveVisible(landingVisible: boolean | null | undefined): {
  visible: boolean
  visibleSource: PresentationValueSource
} {
  if (landingVisible === false) return { visible: false, visibleSource: 'landing' }
  if (landingVisible === true) return { visible: true, visibleSource: 'landing' }
  return { visible: true, visibleSource: 'default' }
}

/**
 * Resuelve eyebrow, title y texto introductorio para una sección de la landing:
 * **landing override → experience → SECTION_DEFAULTS**.
 *
 * El campo `text` es solo intro / lead; no sustituye el contenido largo del Experience.
 *
 * @example Sin overrides — Itinerary usa solo defaults (text vacío permitido)
 * ```ts
 * resolveSectionPresentation('itinerary', {})
 * // {
 * //   eyebrow: 'Day by day',
 * //   title: "What you'll experience",
 * //   text: '',
 * //   visible: true,
 * //   eyebrowSource: 'default',
 * //   titleSource: 'default',
 * //   textSource: 'default',
 * //   visibleSource: 'default',
 * // }
 * ```
 *
 * @example Itinerary con intro desde landing (preview editorial)
 * ```ts
 * resolveSectionPresentation('itinerary', {
 *   landing: {
 *     sectionText: 'Three immersive days with scientists in primary forest.',
 *   },
 * })
 * // text === 'Three immersive days...', textSource === 'landing';
 * // eyebrow/title siguen siendo los defaults si no se pasan overrides.
 * ```
 *
 * @example Itinerary con texto desde Experience (cuando exista en schema)
 * ```ts
 * resolveSectionPresentation('itinerary', {
 *   landing: {},
 *   experiencePresentation: {
 *     itinerary: {
 *       text: 'Product-authored lead only if stored on Experience.',
 *     },
 *   },
 * })
 * // textSource === 'experience' si landing.sectionText está vacío.
 * ```
 */
export function resolveSectionPresentation(
  sectionKey: SectionModuleKey,
  ctx: ResolveSectionPresentationCtx,
): ResolvedSectionPresentation {
  const defaults = SECTION_DEFAULTS[sectionKey]
  if (!defaults) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console -- útil durante desarrollo si falta una clave
      console.warn(`[resolveSectionPresentation] Unknown sectionKey: ${String(sectionKey)}`)
    }
    return { ...EMPTY_KEY_FALLBACK }
  }

  const land = ctx.landing
  const expSlice = ctx.experiencePresentation?.[sectionKey]

  const eyebrow = resolveFirstNonEmpty({
    landing: land?.eyebrow,
    experience: expSlice?.eyebrow,
    fallback: defaults.eyebrow,
  })
  const title = resolveFirstNonEmpty({
    landing: land?.sectionTitle,
    experience: expSlice?.title,
    fallback: defaults.title,
  })
  const text = resolveFirstNonEmpty({
    landing: land?.sectionText,
    experience: expSlice?.text,
    fallback: defaults.text,
  })

  const { visible, visibleSource } = resolveVisible(land?.visible)

  return {
    eyebrow: eyebrow.value,
    title: title.value,
    text: text.value,
    visible,
    eyebrowSource: eyebrow.source,
    titleSource: title.source,
    textSource: text.source,
    visibleSource,
  }
}
