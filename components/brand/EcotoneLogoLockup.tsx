import type { CSSProperties } from 'react'
import { ECOTONE_LOGO_LOCKUP_PATH_D } from './ecotoneLogoLockupPath'

type Props = {
  className?: string
  'aria-label'?: string
  style?: CSSProperties
  width?: number
  height?: number
  /** If set, overrides width/height; aspect ratio ~1.19 */
  size?: number
}

export function EcotoneLogoLockup({ className, 'aria-label': ariaLabel = 'Ecotone', style, size, width, height }: Props) {
  const w = size ?? width ?? 113
  const h = size != null ? Math.round((size * 95) / 113) : height ?? 95

  return (
    <svg
      className={className}
      width={w}
      height={h}
      viewBox="0 0 113 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      style={style}
    >
      <path fill="currentColor" d={ECOTONE_LOGO_LOCKUP_PATH_D} />
    </svg>
  )
}
