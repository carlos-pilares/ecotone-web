import type { ReactNode } from 'react'

import type { PartnerDoc } from '@/lib/queries'

import { PartnerLogoItem } from '@/components/partners/PartnerLogoItem'

export type PartnersWallProps = {
  partners: PartnerDoc[]
}

/**
 * Centered flex-wrap strip. Order matches CMS `partners` array.
 */
export function PartnersWall({ partners }: PartnersWallProps): ReactNode {
  return (
    <div className="partners-wall">
      {partners.map((p, i) => (
        <PartnerLogoItem key={`${p._id}-${i}`} partner={p} />
      ))}
    </div>
  )
}
