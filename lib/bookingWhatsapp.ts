import { DEFAULT_WHATSAPP_URL } from '@/data/cmsApproved/siteSettingsApprovedContent'

/** Extract digits after wa.me/ for rebuilding links with a new message. */
export function parseWaMeNumberFromUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  const m = url.trim().match(/wa\.me\/(\d{6,15})/i)
  return m?.[1] ?? null
}

export function defaultWhatsappNumber(fallbackUrl: string | null | undefined): string {
  return parseWaMeNumberFromUrl(fallbackUrl) || parseWaMeNumberFromUrl(DEFAULT_WHATSAPP_URL) || '51974781094'
}

export function buildWaMeLink(number: string, text: string): string {
  const q = encodeURIComponent(text.trim() || ' ')
  return `https://wa.me/${number}?text=${q}`
}
