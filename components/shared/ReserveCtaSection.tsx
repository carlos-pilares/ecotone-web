'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { CtaId } from '@/lib/ctaIds'
import { CTA_IDS } from '@/lib/ctaIds'
import { isWhatsappHref, trackWhatsappClick } from '@/lib/trackWhatsappClick'
import {
  isBookIntentLabel,
  trackBookNowClick,
  type BookNowOpenSource,
} from '@/lib/trackBookNowClick'

import './reserve-cta-section.css'

export type ReserveCtaDetailRow = { label: string; value: string }

/** `iconKey`: `shield` | `check` | `heart`, or empty to cycle by index (legacy layout). */
export type ReserveCtaTrustItem = { iconKey: string; text: string }

export type ReserveCtaCta = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
  external?: boolean
  whatsappIcon?: boolean
  bookingModal?: 'plan' | 'experience'
  bookingSummary?: import('@/components/booking/types').ExperienceBookingSummary
  ctaId?: CtaId
}

export type ReserveCtaCardProps = {
  /** Small/light text before the amount (e.g. “from”). */
  pricePrefix?: string
  /** Large price amount (e.g. “USD 1,800”). */
  priceAmount: string
  priceSuffix?: string
  /** @deprecated Use `priceAmount` — legacy callers only. */
  priceLine?: string
  subline: string
  rows: ReserveCtaDetailRow[]
  ctas: ReserveCtaCta[]
  /** If set, terms link label targets this href. */
  termsHref?: string
  termsPrefixText?: string
  termsLinkLabel?: string
  /** When omitted, defaults to a single period. Pass empty string to show nothing after the link. */
  termsSuffixText?: string
  termsOpenInNewTab?: boolean
  termsRel?: string
  trustItems?: ReserveCtaTrustItem[]
}

export type ReserveCtaSectionProps = {
  id?: string
  className?: string
  /** Section element classes (padding, background). */
  sectionClassName?: string
  innerClassName?: string
  /** About: dark parch surface. */
  surface?: 'default' | 'dark'
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  titleId?: string
  card: ReserveCtaCardProps
  /**
   * Experience #book: first primary “Book now” CTA becomes a button (modal). Other CTAs (e.g. WhatsApp) unchanged.
   */
  experienceBookPrimaryModal?: boolean
  onExperienceBookPrimaryClick?: () => void
  /**
   * Experience reserve: trust/terms come from `resolveReserveCtaCard` / CMS — do not apply generic
   * defaults that would mask empty suffix, custom copy, or resolver output.
   */
  experienceReserveTrustTermsExact?: boolean
  /** Passed to book-intent analytics for reserve-section CTAs. */
  bookNowTracking?: Pick<BookNowOpenSource, 'price' | 'promo_label'>
}

const DEFAULT_TRUST_ITEMS: ReserveCtaTrustItem[] = [
  { iconKey: 'shield', text: 'Secure payment' },
  { iconKey: 'check', text: 'Free cancellation' },
  { iconKey: 'heart', text: 'B Corp certified' },
]

function trustGlyphIndex(iconKey: string, fallbackIndex: number): number {
  const k = iconKey.trim().toLowerCase()
  if (k === 'shield' || k === '0') return 0
  if (k === 'check' || k === '1') return 1
  if (k === 'heart' || k === '2') return 2
  return fallbackIndex % 3
}

function TrustGlyph({ iconKey, index }: { iconKey: string; index: number }) {
  const mod = trustGlyphIndex(iconKey, index)
  if (mod === 0) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
  if (mod === 1) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      </svg>
    )
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function isWhatsappCta(cta: ReserveCtaCta): boolean {
  return Boolean(cta.whatsappIcon) || isWhatsappHref(cta.href)
}

function reserveWhatsappClickHandler(cta: ReserveCtaCta) {
  if (!isWhatsappCta(cta)) return undefined
  return () => {
    const summary = cta.bookingSummary
    trackWhatsappClick({
      button_location: 'reserve_section',
      cta_id: CTA_IDS.EXPERIENCE_RESERVE_WHATSAPP,
      ...(summary
        ? {
            experience_name: summary.experienceName,
            route: summary.route,
            program_type: summary.programType,
          }
        : {}),
    })
  }
}

function reserveBookClickHandler(
  cta: ReserveCtaCta,
  bookNowTracking?: Pick<BookNowOpenSource, 'price' | 'promo_label'>,
) {
  if (cta.bookingModal) return undefined
  if (isWhatsappCta(cta)) return undefined
  const variant = cta.variant ?? 'primary'
  if (variant !== 'primary' || !isBookIntentLabel(cta.label)) return undefined
  return () => {
    const summary = cta.bookingSummary
    trackBookNowClick({
      cta_id: cta.ctaId ?? CTA_IDS.EXPERIENCE_RESERVE_BOOK,
      button_location: 'reserve_section',
      ...(bookNowTracking?.price ? { price: bookNowTracking.price } : {}),
      ...(bookNowTracking?.promo_label ? { promo_label: bookNowTracking.promo_label } : {}),
      ...(summary
        ? {
            experience_name: summary.experienceName,
            route: summary.route,
            program_type: summary.programType,
            price: bookNowTracking?.price ?? summary.priceLine,
          }
        : {}),
    })
  }
}

function ReserveCtaLink({
  cta,
  bookNowTracking,
}: {
  cta: ReserveCtaCta
  bookNowTracking?: Pick<BookNowOpenSource, 'price' | 'promo_label'>
}) {
  const { openPlanJourney, openExperienceBooking } = useBookingModal()
  const variant = cta.variant ?? 'primary'
  const cls = `reserve-cta-btn ${variant === 'secondary' ? 'reserve-cta-btn--secondary' : 'reserve-cta-btn--primary'}`
  const inner = (
    <>
      {cta.whatsappIcon ? <WhatsAppGlyph /> : null}
      {cta.label}
    </>
  )

  if (cta.bookingModal === 'plan') {
    return (
      <button
        type="button"
        className={cls}
        onClick={() =>
          openPlanJourney({
            cta_id: cta.ctaId ?? CTA_IDS.HOME_DESIGN_PROGRAM,
            button_location: 'reserve_section',
            ...(bookNowTracking?.price ? { price: bookNowTracking.price } : {}),
            ...(bookNowTracking?.promo_label ? { promo_label: bookNowTracking.promo_label } : {}),
          })
        }
      >
        {inner}
      </button>
    )
  }
  if (cta.bookingModal === 'experience' && cta.bookingSummary) {
    const summary: ExperienceBookingSummary = cta.bookingSummary
    return (
      <button
        type="button"
        className={cls}
        onClick={() =>
          openExperienceBooking(summary, {
            cta_id: cta.ctaId ?? CTA_IDS.EXPERIENCE_RESERVE_BOOK,
            button_location: 'reserve_section',
            price: bookNowTracking?.price ?? summary.priceLine,
            ...(bookNowTracking?.promo_label ? { promo_label: bookNowTracking.promo_label } : {}),
          })
        }
      >
        {inner}
      </button>
    )
  }

  const external = cta.external === true
  const href = cta.href.trim()
  const onWhatsappClick = reserveWhatsappClickHandler(cta)
  const onBookClick = reserveBookClickHandler(cta, bookNowTracking)
  const onLinkClick = () => {
    onWhatsappClick?.()
    onBookClick?.()
  }
  if (!external && href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link href={href} className={cls} onClick={onLinkClick}>
        {inner}
      </Link>
    )
  }

  return (
    <a
      className={cls}
      href={href}
      onClick={onLinkClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}

/**
 * Adjusts home-style hash links for inner pages (e.g. `#experiences` → `/experiences`).
 */
export function reserveCtaHrefFromHomeLink(href: string, context: 'home' | 'inner'): string {
  const h = href.trim()
  if (!h || context === 'home') return h
  if (h === '#experiences') return '/experiences'
  if (h.startsWith('#')) return `/${h}`
  return h
}

export function ReserveCtaSection({
  id,
  className,
  sectionClassName = 'content-section bg-warm fade',
  innerClassName = 'content-inner',
  surface = 'default',
  eyebrow,
  title,
  body,
  titleId = 'reserve-cta-heading',
  card,
  experienceBookPrimaryModal,
  onExperienceBookPrimaryClick,
  experienceReserveTrustTermsExact = false,
  bookNowTracking,
}: ReserveCtaSectionProps) {
  const sectionClass = [
    'reserve-cta',
    surface === 'dark' ? 'reserve-cta--surface-dark' : null,
    sectionClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const ctas = card.ctas
    .filter((c) => {
      const label = (c.label ?? '').trim()
      if (!label) return false
      if (c.bookingModal) return true
      return Boolean((c.href ?? '').trim())
    })
    .slice(0, 2)

  const primaryBookModalIdx =
    experienceBookPrimaryModal && typeof onExperienceBookPrimaryClick === 'function'
      ? ctas.findIndex((c) => (c.variant ?? 'primary') === 'primary' && (c.label ?? '').trim().toLowerCase() === 'book now')
      : -1

  const trustItems =
    card.trustItems && card.trustItems.length > 0 ? card.trustItems : DEFAULT_TRUST_ITEMS

  const termsPrefix = experienceReserveTrustTermsExact
    ? card.termsPrefixText ?? ''
    : (card.termsPrefixText ?? '').trim() || 'By booking, you agree to our'
  const termsLinkLbl = experienceReserveTrustTermsExact
    ? card.termsLinkLabel ?? ''
    : (card.termsLinkLabel ?? '').trim() || 'Terms & Conditions'
  const termsSuffix =
    experienceReserveTrustTermsExact
      ? card.termsSuffixText === undefined || card.termsSuffixText === null
        ? ''
        : card.termsSuffixText
      : card.termsSuffixText === undefined || card.termsSuffixText === null
        ? '.'
        : card.termsSuffixText

  const termsHrefTrim = card.termsHref?.trim()
  const termsNewTab = card.termsOpenInNewTab === true
  const termsRelTrim = card.termsRel?.trim()
  const termsRelEffective =
    termsRelTrim || (termsNewTab && termsHrefTrim ? 'noopener noreferrer' : undefined)

  const pricePrefix = card.pricePrefix?.trim() || ''
  const priceAmount = card.priceAmount?.trim() || card.priceLine?.trim() || ''
  const priceSuffix = card.priceSuffix?.trim() || ''

  const hasEyebrow = eyebrow != null && eyebrow !== ''
  const hasBody = body != null && body !== ''

  return (
    <section className={sectionClass} id={id} aria-labelledby={titleId}>
      <div className={`${innerClassName} reserve-cta-inner`}>
        <div className="reserve-cta-editorial">
          <div className="section-shell-head">
            {hasEyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
            <h2 className="h2" id={titleId}>
              {title}
            </h2>
            {hasBody ? (
              <p className="section-shell-lead body" style={{ marginTop: 0 }}>
                {body}
              </p>
            ) : null}
          </div>
        </div>

        <div className="reserve-cta-card">
          <div className="booking-card reserve-cta-booking-card">
            <div className="booking-price-block">
              <div className="booking-price-big">
                {pricePrefix ? (
                  <div className="booking-price-prefix-line">
                    <small className="booking-price-prefix">{pricePrefix}</small>
                  </div>
                ) : null}
                {priceAmount ? (
                  <div className="booking-price-amount-line">
                    <span className="booking-price-amount">{priceAmount}</span>
                  </div>
                ) : null}
                {priceSuffix ? (
                  <div className="booking-price-suffix-line">
                    <small className="booking-price-suffix">{priceSuffix}</small>
                  </div>
                ) : null}
              </div>
              {card.subline?.trim() ? <p className="reserve-cta-subline">{card.subline.trim()}</p> : null}
            </div>
            <div className="booking-divider" />
            <div className="booking-rows">
              {card.rows.map((row) => (
                <div className="booking-row" key={`${row.label}-${row.value}`}>
                  <span className="booking-rl">{row.label}</span>
                  <span className="booking-rv">{row.value}</span>
                </div>
              ))}
            </div>
            {ctas.length > 0 ? (
              <div className="reserve-cta-actions">
                {ctas.map((c, i) => {
                  const useModalBtn = primaryBookModalIdx === i && primaryBookModalIdx >= 0
                  if (useModalBtn) {
                    const cls = 'reserve-cta-btn reserve-cta-btn--primary'
                    return (
                      <button key={`book-modal-${i}`} type="button" className={cls} onClick={onExperienceBookPrimaryClick}>
                        {c.label}
                      </button>
                    )
                  }
                  return <ReserveCtaLink key={`${c.href}-${c.label}-${i}`} cta={c} bookNowTracking={bookNowTracking} />
                })}
              </div>
            ) : null}
            <div className="trust-strip">
              {trustItems.map((item, i) => (
                <div className="trust-item" key={`${item.text}-${i}`}>
                  <TrustGlyph iconKey={item.iconKey} index={i} />
                  {item.text}
                </div>
              ))}
            </div>
            <p className="reserve-cta-terms">
              {termsPrefix}{' '}
              {termsHrefTrim ? (
                <a
                  href={termsHrefTrim}
                  {...(termsNewTab ? { target: '_blank' } : {})}
                  {...(termsRelEffective ? { rel: termsRelEffective } : {})}
                >
                  {termsLinkLbl}
                </a>
              ) : (
                termsLinkLbl
              )}
              {termsSuffix}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
