import type { ResolvedHomePage } from '@/lib/homePageDefaults'
import { HOME_HERO_BACKGROUND_FALLBACK_URL } from '@/lib/homePageImageFallbacks'
import { cdnImageUrl } from '@/lib/sanity'

const PILL_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>,
]

export function Hero({ heroData }: { heroData: ResolvedHomePage }) {
  const h = heroData
  const bgFallback = h.heroImageFallbackUrl?.trim() || HOME_HERO_BACKGROUND_FALLBACK_URL
  const bgUrl = cdnImageUrl(h.heroImage ?? null, 1800, bgFallback)
  const rows = (h.heroCardRows ?? [])
    .map((r) => ({ label: (r?.label ?? '').trim(), value: (r?.value ?? '').trim() }))
    .filter((r) => r.label && r.value)

  return (
    <section className="hero" id="top">
      <div
        className="hero-bg"
        style={{
          background: `linear-gradient(110deg,rgba(0,0,0,.65) 0%,rgba(0,0,0,.15) 52%,rgba(0,0,0,.55) 100%), url('${bgUrl}') center/cover no-repeat`,
        }}
      />
      <div className="hero-brand-mark" aria-hidden>
        <svg viewBox="0 0 105 101" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <use href="#isotipo" style={{ color: 'white' }} />
        </svg>
      </div>
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow">{h.heroEyebrow ?? ''}</div>
          <h1 className="hero-h1">
            {h.heroHeadline ?? ''}
            <span>{h.heroHeadlineLight ?? ''}</span>
          </h1>
          <p className="hero-sub">{h.heroSubheadline ?? ''}</p>
          <div className="hero-pills">
            {(h.heroPills ?? []).map((p, i) => (
              <div key={i} className="hero-pill">
                {PILL_ICONS[i % PILL_ICONS.length]}
                {p}
              </div>
            ))}
          </div>
          <div className="hero-ctas">
            <a href={h.heroCta1Link ?? '#'} className="btn-primary">
              {h.heroCta1Text ?? ''}{' '}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href={h.heroCta2Link ?? '#'} className="hero-ghost">
              {h.heroCta2Text ?? ''}
            </a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-price">
              {h.heroCardPrice ?? ''}
              <small>{h.heroCardPriceSuffix ?? ''}</small>
            </div>
            <div className="hero-card-sub">{h.heroCardSubprice ?? ''}</div>
            <div className="hero-card-div" />
            <div className="hero-card-rows">
              {rows.map((row, i) => (
                <div className="hero-card-row" key={i}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
            <a className="btn-hero-book" href={h.heroCardCtaLink ?? '#'}>
              {h.heroCardCtaText ?? ''}
            </a>
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        <span>{h.heroScrollLabel ?? ''}</span>
      </div>
    </section>
  )
}
