import { buildWaMeLink, parseWaMeNumberFromUrl } from '@/lib/bookingWhatsapp'

/** Matches `smartLink` website page keys — used for optional hide list. */
export const WHATSAPP_FLOAT_HIDE_PAGE_OPTIONS = [
  { value: 'home', title: 'Home' },
  { value: 'experiencesIndex', title: 'Experiences (all)' },
  { value: 'routes', title: 'Routes' },
  { value: 'lodgesIndex', title: 'Lodges (all)' },
  { value: 'about', title: 'About' },
  { value: 'journal', title: 'Journal (all)' },
  { value: 'studio', title: 'Sanity Studio' },
] as const

export type WhatsappFloatHidePageKey = (typeof WHATSAPP_FLOAT_HIDE_PAGE_OPTIONS)[number]['value']

export type FloatingWhatsappSettings = {
  enabled: boolean
  number: string | null
  defaultMessage: string
  desktopLabel: string
  mobileLabel: string
  hideOnMobile: boolean
  hideOnPages: WhatsappFloatHidePageKey[]
}

export type ResolvedFloatingWhatsapp = FloatingWhatsappSettings & {
  href: string | null
}

export function normalizeWhatsappDigits(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 6 || digits.length > 15) return null
  return digits
}

export function resolveFloatingWhatsappFromCms(
  cms: {
    whatsappFloatingEnabled?: boolean | null
    whatsappNumber?: string | null
    whatsappDefaultMessage?: string | null
    whatsappDesktopLabel?: string | null
    whatsappMobileLabel?: string | null
    whatsappFloatingHideOnMobile?: boolean | null
    whatsappFloatingHideOnPages?: string[] | null
  } | null | undefined,
  fallbackWhatsappUrl: string | null | undefined,
): ResolvedFloatingWhatsapp {
  const enabled = cms?.whatsappFloatingEnabled === true
  const number =
    normalizeWhatsappDigits(cms?.whatsappNumber) ||
    parseWaMeNumberFromUrl(fallbackWhatsappUrl) ||
    null

  const defaultMessage = cms?.whatsappDefaultMessage?.trim() ?? ''
  const desktopLabel = cms?.whatsappDesktopLabel?.trim() || 'WhatsApp'
  const mobileLabel = cms?.whatsappMobileLabel?.trim() || 'Chat with us'
  const hideOnMobile = cms?.whatsappFloatingHideOnMobile === true
  const hideOnPages = (cms?.whatsappFloatingHideOnPages ?? []).filter(
    (k): k is WhatsappFloatHidePageKey =>
      typeof k === 'string' &&
      WHATSAPP_FLOAT_HIDE_PAGE_OPTIONS.some((o) => o.value === k),
  )

  const href = enabled && number ? buildWaMeLink(number, defaultMessage) : null

  return {
    enabled,
    number,
    defaultMessage,
    desktopLabel,
    mobileLabel,
    hideOnMobile,
    hideOnPages,
    href,
  }
}

/** Returns true when the floating button should not render on this pathname. */
export function floatingWhatsappHiddenOnPath(
  pathname: string,
  hideOnPages: WhatsappFloatHidePageKey[],
): boolean {
  if (!hideOnPages.length) return false
  const path = pathname.split('?')[0] || '/'

  for (const key of hideOnPages) {
    switch (key) {
      case 'home':
        if (path === '/') return true
        break
      case 'experiencesIndex':
        if (path === '/experiences' || path.startsWith('/experiences/')) return true
        break
      case 'routes':
        if (path === '/routes' || path.startsWith('/routes/')) return true
        break
      case 'lodgesIndex':
        if (path === '/lodges' || path.startsWith('/lodges/')) return true
        break
      case 'about':
        if (path === '/about' || path.startsWith('/about/')) return true
        break
      case 'journal':
        if (path === '/journal' || path.startsWith('/journal/')) return true
        break
      case 'studio':
        if (path.startsWith('/studio')) return true
        break
      default:
        break
    }
  }
  return false
}
