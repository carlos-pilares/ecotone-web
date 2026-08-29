const LOGO_CREAM = '/brand/logo-full-horizontal-ece5d5.svg'
const LOGO_GOLD = '/brand/logo-full-horizontal-906730.svg'

/** Intrinsic lockup size of `logo-full-horizontal-*.svg`. */
export const MCV_LOGO_INTRINSIC = { width: 184, height: 57 } as const

export type ManuVolunteerBrandLogoProps = {
  /** Extra class on the anchor (e.g. `mcv-footer-logo-link`). */
  className?: string
  /** Extra class on the size wrap (e.g. `mcv-logo-wrap--footer`). */
  wrapClassName?: string
  /** Decorative when parent already labels the link. */
  decorative?: boolean
  /** Cream mark for dark/hero surfaces; gold for light campaign chrome. */
  tone?: 'cream' | 'gold'
}

/**
 * Safari-safe Ecotone mark: fixed-height wrap + contain, so global `img{width:100%;object-fit:cover}`
 * cannot stretch/crop the SVG (Chrome often masks this; Safari does not).
 */
export function ManuVolunteerBrandLogo({
  className = '',
  wrapClassName = '',
  decorative = false,
  tone = 'cream',
}: ManuVolunteerBrandLogoProps) {
  const src = tone === 'gold' ? LOGO_GOLD : LOGO_CREAM

  return (
    <a
      href="https://www.ecotone.eco/"
      className={`mcv-logo-link ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ecotone home"
    >
      <span className={`mcv-logo-wrap ${wrapClassName}`.trim()}>
        <img
          src={src}
          alt={decorative ? '' : 'Ecotone'}
          className="mcv-logo-img"
          width={MCV_LOGO_INTRINSIC.width}
          height={MCV_LOGO_INTRINSIC.height}
          decoding="async"
        />
      </span>
    </a>
  )
}
