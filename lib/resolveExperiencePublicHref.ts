import { DEFAULT_WHATSAPP_URL } from '@/data/cmsApproved/siteSettingsApprovedContent'
import {
  EXPERIENCE_DOCUMENT_SLUG_TO_PUBLIC_SLUG,
  lodgeSoqtapataExperienceCardDefaults,
} from '@/data/lodgeSoqtapataResolverDefaults'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

export type ExperiencePublicHrefInput = {
  experienceLandingSlug?: string | null
  slug?: string | null
}

function waDigitsFromDefaultSiteWhatsapp(): string {
  const m = DEFAULT_WHATSAPP_URL.match(/wa\.me\/(\d+)/)
  return m?.[1] ?? '51974781094'
}

/** Segmento de URL público para `/experiences/[slug]` (prioriza landing `experiencePage`). */
export function resolveExperiencePublicSlug(input: ExperiencePublicHrefInput): string | null {
  const raw = input.experienceLandingSlug?.trim() || input.slug?.trim() || ''
  if (!raw) return null
  return EXPERIENCE_DOCUMENT_SLUG_TO_PUBLIC_SLUG[raw] ?? raw
}

export function resolveExperiencePublicHref(input: ExperiencePublicHrefInput): string | null {
  const seg = resolveExperiencePublicSlug(input)
  return seg ? `/experiences/${seg}` : null
}

export function resolveExperiencePublicHrefOrFallback(input: ExperiencePublicHrefInput): string {
  return resolveExperiencePublicHref(input) ?? lodgeSoqtapataExperienceCardDefaults.defaultExperienceHref
}

/** Igual que en lodge cards: smartLink de enquire solo si hay `linkType`. */
export function enrichSmartLinkWithLabelFallback(
  raw: SmartLinkGroq | null | undefined,
  labelFallback: string,
): SmartLinkGroq | null {
  if (!raw?.linkType?.trim()) return null
  return { ...raw, label: raw.label?.trim() || labelFallback }
}

/** WhatsApp genérico cuando la tarjeta es “Enquire” y no hay lodge en contexto (p. ej. `/routes`). */
export function buildGenericExperienceEnquireWhatsappHref(experienceName: string): string {
  const num = waDigitsFromDefaultSiteWhatsapp()
  const expLine = experienceName.trim() || 'an experience'
  const text = `Hi! I'm interested in "${expLine}" on Ecotone routes. Could you share more information?`
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`
}
