import type { LodgeBookCtaData, LodgeBookTrustItem } from '@/data/lodgeSoqtapataStatic'

import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'

type LodgeBookCtaProps = {
  data: LodgeBookCtaData
}

function TrustGlyph({ icon }: { icon: LodgeBookTrustItem['icon'] }) {
  if (icon === 'shield') {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
  if (icon === 'check') {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const bookBodyStyle = {
  fontSize: 14,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.8,
  marginBottom: 18,
} as const

/**
 * Final commercial block — `reference/ecotone-lodge_11.html` (`#book`).
 * Uses shared `booking-card`, `trust-strip`, and `.btn` from `experience-surface.css`.
 */
export function LodgeBookCta({ data }: LodgeBookCtaProps) {
  const hasBody = Boolean(data.body)
  return (
    <section id="book" className="content-section bg-warm lodge-book-cta" aria-labelledby="lodge-book-heading">
      <div className="content-inner">
        <LodgeSectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleId="lodge-book-heading"
          titleStyle={{ marginBottom: hasBody ? 6 : 24 }}
          bodyStyle={hasBody ? bookBodyStyle : undefined}
        />
        <div className="booking-card lodge-book-card">
          <div className="lodge-book-card-head">
            <div className="lodge-book-card-title">{data.cardTitle}</div>
            <div className="lodge-book-card-sub">{data.cardSubtitle}</div>
          </div>
          <div className="lodge-book-detail-box">
            {data.rows.map((row) => (
              <div className="booking-row" key={row.label}>
                <span className="booking-rl">{row.label}</span>
                <span
                  className="booking-rv"
                  style={row.valueAccent ? { color: 'var(--brown)' } : undefined}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          {data.primaryCta.href.trim() && data.primaryCta.label.trim() ? (
            <a className="btn btn-primary lodge-book-btn-primary" href={data.primaryCta.href}>
              {data.primaryCta.label}
            </a>
          ) : null}
          {data.secondaryCta.href.trim() && data.secondaryCta.label.trim() ? (
            <a
              className="btn btn-ghost lodge-book-btn-secondary"
              href={data.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppGlyph />
              {data.secondaryCta.label}
            </a>
          ) : null}
          <div className="trust-strip lodge-book-trust">
            {data.trustItems.map((item) => (
              <div className="trust-item" key={item.text}>
                <TrustGlyph icon={item.icon} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
