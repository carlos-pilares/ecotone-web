import type { HomePageDoc } from '@/lib/queries'
import { cdnImageUrl } from '@/lib/sanity'

const DEFAULT_HERO_BG =
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1800&q=85'

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

const DEFAULT_ROWS: { label: string; value: string }[] = [
  { label: 'Routes', value: '3 territories' },
  { label: 'Experiences', value: '~10 programs' },
  { label: 'Group', value: 'Up to 8 people' },
  { label: 'Duration', value: '3 days – 6 weeks' },
]

const DEFAULT_PILLS = ['3 Routes', '~10 Experiences', 'Max 8 per group', 'All inclusive']

export function Hero({ heroData }: { heroData: HomePageDoc | null }) {
  const h = heroData
  const headline = h?.heroHeadline ?? 'The forest'
  const headlineLight = h?.heroHeadlineLight ?? 'is waiting for you.'
  const sub = h?.heroSubheadline ?? 'Immersive all-inclusive experiences in the most biodiverse ecosystems on Earth. All-inclusive from Cusco.'
  const pills = Array.isArray(h?.heroPills) && h!.heroPills!.length > 0 ? h!.heroPills! : DEFAULT_PILLS
  const cta1Text = h?.heroCta1Text ?? 'Explore experiences'
  const cta1Link = h?.heroCta1Link ?? '#experiences'
  const cta2Text = h?.heroCta2Text ?? 'Our routes ↓'
  const cta2Link = h?.heroCta2Link ?? '#routes'
  const cardPrice = h?.heroCardPrice ?? 'from $380'
  const cardSub = h?.heroCardSubprice ?? 'All inclusive · departure from Cusco'
  const cardCta = h?.heroCardCtaText ?? 'Check availability →'
  const cardCtaLink = h?.heroCardCtaLink ?? '#book'
  const rowsFromCms = h?.heroCardRows
  const rows =
    Array.isArray(rowsFromCms) && rowsFromCms.length > 0
      ? rowsFromCms
          .map((r) => ({ label: r?.label ?? '', value: r?.value ?? '' }))
          .filter((r) => r.label || r.value)
      : DEFAULT_ROWS

  const bgUrl = cdnImageUrl(h?.heroImage ?? null, 1800, DEFAULT_HERO_BG)

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
          <div className="hero-eyebrow">Manu Biosphere Reserve &amp; Camanti · Cusco, Perú</div>
          <h1 className="hero-h1">
            {headline}
            <span>{headlineLight}</span>
          </h1>
          <p className="hero-sub">{sub}</p>
          <div className="hero-pills">
            {pills.map((p, i) => (
              <div key={i} className="hero-pill">
                {PILL_ICONS[i % PILL_ICONS.length]}
                {p}
              </div>
            ))}
          </div>
          <div className="hero-ctas">
            <a href={cta1Link} className="btn-primary">
              {cta1Text}{' '}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href={cta2Link} className="hero-ghost">
              {cta2Text}
            </a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-price">
              {cardPrice}
              <small>/person</small>
            </div>
            <div className="hero-card-sub">{cardSub}</div>
            <div className="hero-card-div" />
            <div className="hero-card-rows">
              {rows.map((row, i) => (
                <div className="hero-card-row" key={i}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
            <a className="btn-hero-book" href={cardCtaLink}>
              {cardCta}
            </a>
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}
