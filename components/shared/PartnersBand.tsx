import { Fragment, type ReactNode } from 'react'
import { PartnerMarkByName } from '@/components/partnerLogos'
import type { PartnerDoc } from '@/lib/queries'

export type PartnersBandProps = {
  label: string
  body?: string | null
  partners: PartnerDoc[]
  partnerNameFallback: string
  emptyMessage?: string | null
  className?: string
}

/**
 * Same structure and classes as the partners row on Home (`HomeStaticSections`).
 * Used on About without duplicating markup in the page file.
 */
export function PartnersBand({
  label,
  body,
  partners,
  partnerNameFallback,
  emptyMessage,
  className = '',
}: PartnersBandProps): ReactNode {
  const prList = partners
  const partnersEmptyMsg = emptyMessage?.trim() || null

  return (
    <div className={`partners-band fade ${className}`.trim()}>
      <div className="partners-inner">
        <div className="partners-label">{label}</div>
        {body?.trim() ? <p className="body partners-body">{body}</p> : null}
        {prList.length > 0 ? (
          <div className="partners-row">
            {prList.map((p, i) => {
              const name = p.name?.trim() || partnerNameFallback
              const markFromCms =
                p.logoSvg && p.logoSvg.trim() ? (
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: p.logoSvg }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  />
                ) : null
              const mark = markFromCms ?? <PartnerMarkByName name={name} />
              const logoBlock = (
                <div className="partner-logo">
                  {mark}
                  <div className="partner-wordmark">{name}</div>
                </div>
              )
              return (
                <Fragment key={p._id}>
                  {i > 0 ? <div className="partner-sep" /> : null}
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {logoBlock}
                    </a>
                  ) : (
                    logoBlock
                  )}
                </Fragment>
              )
            })}
          </div>
        ) : partnersEmptyMsg ? (
          <p className="body partners-body" style={{ marginBottom: 0 }}>
            {partnersEmptyMsg}
          </p>
        ) : null}
      </div>
    </div>
  )
}
