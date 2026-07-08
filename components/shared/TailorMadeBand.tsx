'use client'

import { SmartLinkCtaAction } from '@/components/shared/SmartLinkCtaAction'
import type { TailorMadeBandComponentProps, TailorMadeBandResolved } from '@/lib/tailorMadeBand'
import { tailorMadeBandHasCta } from '@/lib/tailorMadeBand'

export type TailorMadeBandProps = TailorMadeBandComponentProps

function BandCopy({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
}: Pick<TailorMadeBandProps, 'eyebrow' | 'title' | 'subtitle' | 'ctaLabel'>) {
  return (
    <>
      <div>
        <div className="lodge-exp-tailor-kicker">{eyebrow}</div>
        <div className="lodge-exp-tailor-title">{title}</div>
        <div className="lodge-exp-tailor-desc">{subtitle}</div>
      </div>
      {ctaLabel?.trim() ? (
        <div style={{ flexShrink: 0 }}>
          <span className="lodge-exp-tailor-cta">{ctaLabel}</span>
        </div>
      ) : null}
    </>
  )
}

export function TailorMadeBand(props: TailorMadeBandProps) {
  const {
    visible,
    className,
    dataType = 'tailor',
    bookingModal,
    bookingSummary,
    eyebrow,
    title,
    subtitle,
    ctaLabel,
    href,
    openInNewTab,
    rel,
    ctaId,
  } = props
  if (!visible) return null

  const band: TailorMadeBandResolved = {
    eyebrow,
    title,
    subtitle,
    ctaLabel: ctaLabel ?? '',
    href: href ?? '',
    openInNewTab,
    rel,
    bookingModal,
    bookingSummary,
  }

  const showCta = tailorMadeBandHasCta(band)
  const outerClass = ['lodge-exp-tailor', className].filter(Boolean).join(' ')

  const inner = (
    <BandCopy
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      ctaLabel={showCta ? ctaLabel : undefined}
    />
  )

  return (
    <SmartLinkCtaAction
      label={showCta ? ctaLabel ?? '' : ''}
      href={href ?? ''}
      openInNewTab={openInNewTab}
      rel={rel}
      bookingModal={bookingModal}
      bookingSummary={bookingSummary}
      ctaId={ctaId}
      className={outerClass}
      dataType={dataType}
    >
      {inner}
    </SmartLinkCtaAction>
  )
}

export { tailorMadeBandFromResolved } from '@/lib/tailorMadeBand'
