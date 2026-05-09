import type { ReactNode } from 'react'

import { PartnersWall } from '@/components/partners/PartnersWall'
import type { PartnerDoc } from '@/lib/queries'

export type PartnersBandProps = {
  /** Small line above the title (optional). */
  eyebrow?: string | null
  /** Centered section label — only shown when non-empty in CMS. */
  title?: string | null
  body?: string | null
  partners: PartnerDoc[]
  emptyMessage?: string | null
  className?: string
}

/**
 * Editorial wrapper for the partners section; logo grid lives in `PartnersWall`.
 */
export function PartnersBand({
  eyebrow,
  title,
  body,
  partners,
  emptyMessage,
  className = '',
}: PartnersBandProps): ReactNode {
  const prList = partners
  const partnersEmptyMsg = emptyMessage?.trim() || null
  const eyebrowT = (eyebrow ?? '').trim()
  const titleT = (title ?? '').trim()

  return (
    <div className={`partners-band fade ${className}`.trim()}>
      <div className="partners-inner">
        {eyebrowT ? <div className="eyebrow">{eyebrowT}</div> : null}
        {titleT ? <div className="partners-label">{titleT}</div> : null}
        {body?.trim() ? <p className="body partners-body">{body}</p> : null}
        {prList.length > 0 ? <PartnersWall partners={prList} /> : null}
        {prList.length === 0 && partnersEmptyMsg ? (
          <p className="body partners-body" style={{ marginBottom: 0 }}>
            {partnersEmptyMsg}
          </p>
        ) : null}
      </div>
    </div>
  )
}
