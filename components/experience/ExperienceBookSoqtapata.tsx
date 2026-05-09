'use client'

import { useCallback } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import { ReserveCtaSection, type ReserveCtaCta } from '@/components/shared/ReserveCtaSection'
import type { SoqtapataBook } from '@/data/soqtapataExperienceLocal'

export function ExperienceBookSoqtapata({
  data,
  bookingSummary,
}: {
  data: SoqtapataBook
  bookingSummary: ExperienceBookingSummary
}) {
  const { openExperienceBooking } = useBookingModal()
  const onPrimary = useCallback(() => {
    openExperienceBooking(bookingSummary)
  }, [openExperienceBooking, bookingSummary])

  const ctas: ReserveCtaCta[] = []
  const wt = data.wetravelUrl.trim()
  if (wt) {
    ctas.push({
      label: 'Book now',
      href: wt,
      variant: 'primary',
      external: true,
    })
  }
  const wa = data.whatsappUrl.trim()
  const waLab = data.whatsappLabel.trim()
  if (wa && waLab) {
    ctas.push({
      label: waLab,
      href: wa,
      variant: 'secondary',
      external: true,
      whatsappIcon: true,
    })
  }

  const termsHref = data.termsHash.trim() || undefined

  const cmsTrust = data.reserveTrustItems
  const trustItems =
    cmsTrust && cmsTrust.length > 0
      ? cmsTrust
          .map((t) => {
            const text = typeof t.text === 'string' ? t.text : ''
            const iconKey = typeof t.iconKey === 'string' ? t.iconKey.trim() : ''
            return { iconKey: iconKey || 'shield', text }
          })
          .filter((t) => t.text.trim())
      : undefined

  return (
    <ReserveCtaSection
      id="book"
      titleId="experience-book-heading"
      eyebrow={data.eyebrow}
      title={data.h2}
      body={data.lead?.trim() ? data.lead : undefined}
      experienceBookPrimaryModal
      onExperienceBookPrimaryClick={onPrimary}
      experienceReserveTrustTermsExact
      card={{
        priceLine: data.price,
        priceSuffix: data.priceSmall,
        subline: data.sub,
        rows: data.rows,
        ctas,
        termsHref,
        termsPrefixText:
          data.termsPrefixText !== undefined && data.termsPrefixText !== null
            ? data.termsPrefixText
            : data.termsNote,
        termsLinkLabel: data.termsLinkLabel ?? '',
        termsSuffixText: data.termsSuffixText === null ? undefined : data.termsSuffixText,
        termsOpenInNewTab: data.termsOpenInNewTab === true,
        termsRel: data.termsRel?.trim(),
        trustItems,
      }}
    />
  )
}
