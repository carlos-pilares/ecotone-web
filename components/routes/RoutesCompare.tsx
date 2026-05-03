import type { RoutesCompareColumn, RoutesCompareRow } from '@/data/routesStatic'

export function RoutesCompare({
  section,
  columns,
  rows,
}: {
  section: { sectionId: string; eyebrow: string; h2: string; intro: string }
  columns: RoutesCompareColumn[]
  rows: RoutesCompareRow[]
}) {
  return (
    <section className="content-section bg-cream fade" id={section.sectionId}>
      <div className="content-inner">
        <div className="eyebrow">{section.eyebrow}</div>
        <h2 className="h2">{section.h2}</h2>
        <p className="body routes-compare-intro">{section.intro}</p>

        <div className="routes-compare-scroll">
          <div className="routes-compare-table" role="table" aria-label="Route comparison">
          <div className="routes-compare-thead" role="rowgroup">
            <div className="routes-compare-tr routes-compare-tr-head" role="row">
              <div className="routes-compare-th routes-compare-th-label" role="columnheader" />
              {columns.map((c) => (
                <div
                  key={c.title}
                  className={
                    'routes-compare-th' + (c.tone === 'featured' ? ' routes-compare-th-featured' : '')
                  }
                  role="columnheader"
                >
                  <div className="routes-compare-col-title">{c.title}</div>
                  <div className="routes-compare-col-sub">{c.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="routes-compare-tbody" role="rowgroup">
            {rows.map((row, ri) => {
              const alt = row.alt === true
              if (row.kind === 'text') {
                return (
                  <div
                    key={`${row.label}-${ri}`}
                    className={'routes-compare-tr' + (alt ? ' routes-compare-tr-alt' : '')}
                    role="row"
                  >
                    <div className="routes-compare-td routes-compare-td-label" role="rowheader">
                      {row.label}
                    </div>
                    {row.values.map((v, vi) => (
                      <div key={vi} className="routes-compare-td" role="cell">
                        {v}
                      </div>
                    ))}
                  </div>
                )
              }
              if (row.kind === 'dots') {
                return (
                  <div
                    key={`${row.label}-${ri}`}
                    className={'routes-compare-tr' + (alt ? ' routes-compare-tr-alt' : '')}
                    role="row"
                  >
                    <div className="routes-compare-td routes-compare-td-label" role="rowheader">
                      {row.label}
                    </div>
                    {row.dots.map((filled, vi) => (
                      <div key={vi} className="routes-compare-td routes-compare-td-dots" role="cell">
                        <div className="compare-dots">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className={'compare-dot' + (i < filled ? ' compare-dot-filled' : '')}
                              aria-hidden
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
              if (row.kind === 'lodge') {
                return (
                  <div
                    key={`${row.label}-${ri}`}
                    className={'routes-compare-tr' + (alt ? ' routes-compare-tr-alt' : '')}
                    role="row"
                  >
                    <div className="routes-compare-td routes-compare-td-label" role="rowheader">
                      {row.label}
                    </div>
                    {row.lodges.map((L, vi) => (
                      <div key={vi} className="routes-compare-td" role="cell">
                        <div className="routes-compare-lodge-title">{L.title}</div>
                        <div className="routes-compare-lodge-sub">{L.sub}</div>
                      </div>
                    ))}
                  </div>
                )
              }
              if (row.kind === 'best') {
                return (
                  <div
                    key={`${row.label}-${ri}`}
                    className={'routes-compare-tr' + (alt ? ' routes-compare-tr-alt' : '')}
                    role="row"
                  >
                    <div className="routes-compare-td routes-compare-td-label" role="rowheader">
                      {row.label}
                    </div>
                    {row.values.map((v, vi) => (
                      <div key={vi} className="routes-compare-td routes-compare-td-best" role="cell">
                        {v}
                      </div>
                    ))}
                  </div>
                )
              }
              if (row.kind === 'price') {
                return (
                  <div
                    key={`${row.label}-${ri}`}
                    className={'routes-compare-tr routes-compare-tr-price' + (alt ? ' routes-compare-tr-alt' : '')}
                    role="row"
                  >
                    <div className="routes-compare-td routes-compare-td-label" role="rowheader">
                      {row.label}
                    </div>
                    {row.cells.map((cell, vi) => (
                      <div key={vi} className="routes-compare-td" role="cell">
                        {cell.type === 'price' ? (
                          <span className="routes-compare-price">{cell.text}</span>
                        ) : (
                          <span className="routes-compare-enquire">Enquire</span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
