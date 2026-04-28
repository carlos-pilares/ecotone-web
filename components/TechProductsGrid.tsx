import { buildTechList, buildTechListAll } from '@/lib/techProductsUtils'
import type { TechnologyProductDoc } from '@/lib/queries'
import { cdnImageUrl } from '@/lib/sanity'

type Props = {
  products: TechnologyProductDoc[] | null | undefined
  /** When set, cards whose `_id` is not in this list get `.tech-card.not-included` (experience page). */
  includedProductIds?: string[] | null
  /**
   * Homepage shows exactly 3 cards (padded with defaults). Experience page can show the full
   * technologyProduct set from the query.
   */
  capAtThree?: boolean
  className?: string
}

export function TechProductsGrid({ products, includedProductIds, capAtThree = true, className }: Props) {
  const rows = capAtThree ? buildTechList(products) : buildTechListAll(products)
  const idSet = new Set(
    (includedProductIds || []).filter(Boolean) as string[],
  )
  const dimMissing =
    idSet.size > 0
      ? (id: string) => !idSet.has(id)
      : () => false

  return (
    <div className={['tech-grid', className].filter(Boolean).join(' ')}>
      {rows.map(({ doc, imageFallback, idx }) => {
        const img = cdnImageUrl(doc.image ?? null, 900, imageFallback)
        const notIn = idSet.size > 0 && doc._id ? dimMissing(doc._id) : false
        return (
          <div
            className={notIn ? 'tech-card not-included' : 'tech-card'}
            key={doc._id || idx}
          >
            <div className="tech-img-wrap">
              <img src={img} alt={doc.name ?? ''} />
            </div>
            <div className="tech-card-content">
              <div className="tech-num">{doc.number ?? `0${idx + 1}`}</div>
              <div className="tech-title">{doc.name}</div>
              <div className="tech-desc">{doc.description}</div>
              {notIn ? (
                <span className="tech-badge tech-badge-free">
                  {(doc.badgeTextWhenExcluded ?? '').trim() || 'Not in this program'}
                </span>
              ) : doc.badgeText ? (
                <span className="tech-badge">{doc.badgeText}</span>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
