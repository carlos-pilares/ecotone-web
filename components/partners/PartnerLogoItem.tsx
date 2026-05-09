import type { ReactNode } from 'react'

import type { PartnerDoc } from '@/lib/queries'
import { partnerLogoCdnUrl } from '@/lib/sanity'

export type PartnerLogoItemProps = {
  partner: PartnerDoc
}

/**
 * One partner mark: raster or inline SVG inside the link/static block, or text if no asset.
 * No fixed cell — only max-width/max-height via CSS on the asset.
 */
export function PartnerLogoItem({ partner: p }: PartnerLogoItemProps): ReactNode {
  const name = (p.name ?? '').trim()
  const a11yLabel = name || 'Partner'
  const imgUrl = partnerLogoCdnUrl(p.logoImage ?? null, '')
  const hasRaster = Boolean(imgUrl)
  const svg = (p.logoSvg ?? '').trim()
  const hasSvg = Boolean(svg)
  const hasLogoMark = hasRaster || hasSvg
  const href = p.link?.trim()
  const typeAttr = p.category ?? undefined

  const body: ReactNode = hasRaster ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imgUrl} alt="" decoding="async" className="partner-logo-img" />
  ) : hasSvg ? (
    <span
      className="partner-logo-svg-wrap"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  ) : (
    <span className="partner-fallback-text">{a11yLabel}</span>
  )

  return href ? (
    <a
      className="partner-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={a11yLabel}
      title={a11yLabel}
      data-partner-type={typeAttr}
    >
      {body}
    </a>
  ) : hasLogoMark ? (
    <div className="partner-static" role="img" aria-label={a11yLabel} data-partner-type={typeAttr}>
      {body}
    </div>
  ) : (
    <div className="partner-static" data-partner-type={typeAttr}>
      {body}
    </div>
  )
}
