'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExperienceWildlifeGrid } from '@/components/experience/ExperienceWildlifeGrid'
import { ReviewsSection } from '@/components/ReviewsSection'
import { TechProductsSection } from '@/components/TechProductsSection'
import type {
  ExperienceCardTeaser,
  ExperienceDoc,
  ExperienceLodgeDoc,
  ItineraryDay,
  ReviewDoc,
  TechnologyProductDoc,
} from '@/lib/queries'
import { cdnImageUrl } from '@/lib/sanity'
import { formatLodgeAltitudeForSubtitle } from '@/lib/lodgeAltitudeDisplay'
import { DEFAULT_REVIEWS_RATING_SUMMARY } from '@/lib/reviewsRatingSummary'

const U_FALL =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80'

const PROGRAM_BADGE: Record<string, string> = {
  'nature-core': 'Classic Nature',
  'family-adventure': 'Signature Expeditions',
  'experiential-learning': 'Experiential Learning',
  'tailor-made': 'Tailor Made',
}

const ROUTE_LABEL: Record<string, string> = {
  camanti: 'Camanti Route',
  'manu-road': 'Manu Road',
  'manu-core': 'Manu Core',
}

function TcardChevron() {
  return (
    <svg
      className="tcard-ch"
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const NAV: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'includes', label: 'Includes' },
  { id: 'lodges', label: 'Lodges' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'tech', label: 'Tech pack' },
  { id: 'media', label: 'Photos & film' },
  { id: 'when', label: 'When to visit' },
  { id: 'before-you-go', label: 'Before you go' },
  { id: 'terms', label: 'Terms' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQs' },
  { id: 'book', label: 'Book →' },
]

function formatUsd(n: number) {
  return `USD ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function priceLabel(
  e: Pick<ExperienceDoc, 'status' | 'price' | 'programType'>,
): { text: string; sub?: string } {
  if (e.status === 'coming-soon') return { text: 'Enquire' }
  if (e.programType === 'experiential-learning' && (e.price == null || e.price === 0)) {
    return { text: 'Custom pricing' }
  }
  if (e.price != null && e.price > 0) return { text: formatUsd(e.price), sub: 'per person · all inclusive' }
  return { text: 'Enquire', sub: 'per person' }
}

export type ExperiencePageProps = {
  experience: ExperienceDoc
  reviewsFiltered: ReviewDoc[]
  featuredQuoteItems: { text: string; attr: string }[]
  /** Current slug for links */
  slug: string
}

export function ExperiencePage({ experience, reviewsFiltered, featuredQuoteItems, slug }: ExperiencePageProps) {
  const e = experience
  const lodge: ExperienceLodgeDoc = e.lodge ?? null
  const allTech: TechnologyProductDoc[] = e.techProducts ?? []
  const included = e.includedTech ?? []
  const includedIds = included.map((p) => p._id)
  const related: ExperienceCardTeaser[] = (e.related ?? []).filter((x) => x && x._id) as ExperienceCardTeaser[]

  const [sticky, setSticky] = useState(false)
  const [activeNav, setActiveNav] = useState('overview')
  const [gTab, setGTab] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [openBfyg, setOpenBfyg] = useState<string | null>('b1')
  /** Terms accordions: independent open state, default first panel open if present. */
  const [openTerms, setOpenTerms] = useState<Set<string>>(() => new Set(['cancellation']))
  const heroRef = useRef<HTMLDivElement>(null)

  const itinerary: ItineraryDay[] = e.itinerary?.length
    ? e.itinerary
    : [
        {
          dayNumber: 1,
          title: 'Arrival in the cloud forest',
          subtitle: 'Sample day · add itinerary in Sanity',
          photoCaption: 'Primary forest trails',
        },
      ]

  const [openDays, setOpenDays] = useState<Set<number>>(() => {
    const first = itinerary[0]?.dayNumber ?? 1
    return new Set([first])
  })
  const toggleDay = (n: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  const pBadges = e.programType ? PROGRAM_BADGE[e.programType] ?? 'Ecotone' : 'Ecotone'
  const rLabel = e.route ? ROUTE_LABEL[e.route] ?? e.route : 'Route TBC'

  const mainImg = cdnImageUrl(e.mainImage ?? null, 1200, U_FALL)
  const gallery: Array<{ url: string; key: string; label: string }> = useMemo(() => {
    const g =
      (e.gallery as unknown as Array<{ _key?: string; asset?: unknown; title?: string; caption?: string }> | null) ??
      []
    const fromCms = g
      .map((im, i) => {
        const title = (im.title ?? '').trim()
        return {
          url: cdnImageUrl(im as never, 800, U_FALL),
          key: (im as { _key?: string })._key ?? `g${i}`,
          label: title || (i === 0 ? 'Gallery' : `Photo ${i + 1}`),
        }
      })
      .filter((x) => x.url)
    if (fromCms.length >= 2) return fromCms
    return [
      { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80', key: 'a', label: 'Forest' },
      { url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80', key: 'b', label: 'Aerial' },
    ]
  }, [e.gallery])

  const price = priceLabel(e)

  const toggleTerm = (id: string) => {
    setOpenTerms((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const snap = useMemo(() => {
    const l = lodge
    return [
      { n: e.duration || '—', l: 'Duration' },
      { n: e.distanceFromCusco || l?.distanceFromCusco || '~2.5h', l: 'From Cusco' },
      { n: e.altitude || l?.altitude || '—', l: 'Altitude' },
      { n: `Max ${e.groupSizeMax || 8}`, l: 'Group size' },
      { n: 'All-in', l: 'Inclusive' },
      { n: e.ecosystem || l?.ecosystem?.split?.(',')[0] || 'Forest', l: 'Ecosystem' },
    ]
  }, [e.duration, e.distanceFromCusco, e.altitude, e.ecosystem, e.groupSizeMax, lodge])

  const highlights = e.highlights?.length ? e.highlights : [e.shortDescription || 'A curated immersion in pristine nature.']

  const onScroll = useCallback(() => {
    const h = heroRef.current?.offsetHeight ?? 500
    setSticky(window.scrollY > h - 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && en.target.id) {
            setActiveNav(en.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 }
    )
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const bestMonths = e.bestTimeByMonth?.length
    ? e.bestTimeByMonth
    : [
        { month: 'May', highlight: 'Dry season. Great for photography.', level: 'good' as const },
        { month: 'Jun', highlight: 'Peak season — wildlife activity.', level: 'peak' as const },
        { month: 'Jul', highlight: 'Prime birding.', level: 'peak' as const },
        { month: 'Aug', highlight: 'Clear trails.', level: 'peak' as const },
      ]

  const faqs = e.faqs?.length
    ? e.faqs
    : [
        { question: 'What should I pack?', answer: 'Layers, rain shell, and binoculars. Rubber boots are provided on site.' },
        { question: 'Is the experience suitable for children?', answer: 'Family programs are available. Contact us for age limits and custom departures.' },
      ]

  const wildlife = e.wildlife?.length ? e.wildlife : []

  const wildlifeGridItems = useMemo(
    () =>
      wildlife.map((w) => ({
        name: (w.name && w.name.trim()) || 'Species',
        subtitle: (w.description && w.description.trim()) || (w.subtitle && w.subtitle.trim()) || null,
        imageUrl: w.imageUrl?.trim() || null,
        imageAlt: (w.name && w.name.trim()) || 'Species',
        badge: w.badge?.trim() || null,
        iconType: w.iconType,
      })),
    [wildlife],
  )

  const imgAltBase = e.name?.trim() || 'Experience'

  return (
    <main className="exp-page" id="experience-main" aria-label={e.name}>
      <aside
        className={sticky ? 'sticky-bar visible' : 'sticky-bar'}
        aria-label="Quick booking summary for this experience"
      >
        <div className="sticky-bar-inner">
          <div>
            <div className="sticky-name">{e.name}</div>
            <div className="sticky-meta">
              {e.duration || '—'} · {rLabel} · {e.shortDescription ? e.shortDescription.slice(0, 64) : 'All inclusive from Cusco'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div className="sticky-price">{price.text}</div>
              {price.sub ? <div className="sticky-price-sub">{price.sub}</div> : null}
            </div>
            <a className="btn btn-primary" href="#book">
              Book now
            </a>
          </div>
        </div>
      </aside>

      <header className="exp-hero" id="top" ref={heroRef}>
        <div className="gallery-tabs" role="tablist" aria-label="Gallery view options">
          {['All photos', 'Trail & wildlife', 'Lodge', e.videoUrl ? 'Video' : null]
            .filter(Boolean)
            .map((t, i) => (
              <button
                key={t!}
                type="button"
                role="tab"
                aria-selected={gTab === i}
                className={gTab === i ? 'gtab active' : 'gtab'}
                onClick={() => setGTab(i)}
              >
                {t}
              </button>
            ))}
          {e.videoUrl ? (
            <a className="gtab video-tab" href={e.videoUrl} target="_blank" rel="noopener noreferrer">
              Watch film
            </a>
          ) : null}
        </div>
        <div className="gallery-grid">
          <div className="gallery-main" style={{ position: 'relative' }}>
            <img
              src={gTab === 0 ? mainImg : gallery[gTab - 1]?.url ?? mainImg}
              alt={
                gTab === 0
                  ? `${imgAltBase} — main photo`
                  : `${imgAltBase} — ${gallery[gTab - 1]?.label ?? 'gallery photo'}`
              }
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg,rgba(0,0,0,.25) 0%,transparent 25%,transparent 65%,rgba(0,0,0,.55) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
          {gallery.slice(0, 2).map((g, i) => (
            <div className="gallery-thumb" key={g.key}>
              <img src={g.url} alt={`${imgAltBase} — ${g.label}`} />
              <div className="gallery-thumb-overlay" />
              <span className="gallery-label">{g.label}</span>
              {i === 1 && e.gallery && e.gallery.length > 2 ? (
                <span className="gallery-see-all">+{e.gallery.length - 2} more</span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="exp-identity">
          <div className="exp-identity-inner">
            <div>
              <div className="exp-breadcrumb">
                <Link href="/">Home</Link>
                <span style={{ opacity: 0.4 }}>›</span>
                <Link href="/#experiences">Experiences</Link>
                <span style={{ opacity: 0.4 }}>›</span>
                <span style={{ opacity: 0.4 }}>{rLabel}</span>
                <span style={{ opacity: 0.4 }}>›</span>
                <span className="current">{e.name}</span>
              </div>
              <div className="exp-badges">
                <span className="pill pill-amber" style={{ fontSize: 11 }}>
                  {pBadges}
                </span>
                <span
                  className="pill"
                  style={{
                    background: 'rgba(144,103,48,.4)',
                    border: '1px solid rgba(212,170,114,.45)',
                    color: 'var(--b100)',
                    fontSize: 11,
                  }}
                >
                  {rLabel}
                </span>
                {e.duration ? (
                  <span
                    className="pill"
                    style={{
                      background: 'rgba(255,255,255,.1)',
                      border: '1px solid rgba(255,255,255,.28)',
                      color: 'rgba(236,229,213,.85)',
                      fontSize: 11,
                    }}
                  >
                    {e.duration}
                  </span>
                ) : null}
              </div>
              <h1 className="exp-h1">{e.name}</h1>
              <p className="exp-tagline">
                {e.shortDescription || 'Immersive all-inclusive experience. Expert naturalist guide.'}
              </p>
              <div className="exp-rating">
                <div className="stars" style={{ display: 'flex', gap: 2 }} aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="star" style={{ width: 12, height: 12 }} />
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>5.0</span>
                <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,.12)' }} />
                {lodge?.name ? (
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--b200)' }}>{lodge.name}</span>
                ) : null}
              </div>
            </div>
            <div className="exp-price-block">
              <div className="exp-price">{price.text}</div>
              <div className="exp-price-sub">{price.sub ?? 'per person'}</div>
              <a className="btn btn-primary" href="#book" style={{ marginTop: 8, display: 'inline-flex' }}>
                Book now
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="snapshot-bar" aria-label="Experience at a glance">
        <div className="snapshot-inner">
          {snap.map((s, i) => (
            <div className="snap-item" key={i}>
              <div className="snap-n">{s.n}</div>
              <div className="snap-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <nav className="page-nav" id="pageNav" aria-label="On this page">
        <div className="page-nav-inner">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeNav === item.id ? 'pnav-item active' : 'pnav-item'}
              onClick={() => setActiveNav(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section
        className="content-section bg-warm fade"
        id="overview"
        aria-labelledby="overview-heading"
      >
        <div className="content-inner">
          <div className="eyebrow">About this experience</div>
          <h2 className="h2" id="overview-heading">
            The journey
          </h2>
          <div
            className="body"
            style={{ maxWidth: 640, marginBottom: 12, fontSize: 15, color: 'var(--n700)' }}
          >
            {e.fullDescription
              ? e.fullDescription.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: 10 }}>{p}</p>)
              : e.shortDescription || 'We will publish a full story for this program soon.'}
          </div>
          <ul className="highlights" style={{ maxWidth: 560, marginTop: 20 }}>
            {highlights.map((h, i) => (
              <li className="highlight-item" key={i}>
                <span className="highlight-dot" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="content-section fade"
        id="itinerary"
        aria-labelledby="itinerary-heading"
      >
        <div className="content-inner">
          <div className="eyebrow">Day by day</div>
          <h2 className="h2" id="itinerary-heading">
            What you&apos;ll experience
          </h2>
          <div className="itinerary">
            {itinerary.map((day, i) => {
              const n = day.dayNumber ?? i + 1
              const open = openDays.has(n)
              const img = cdnImageUrl(day.image ?? null, 900, U_FALL)
              const dayTitle = day.title || `Day ${n}`
              return (
                <article className={open ? 'day-card open' : 'day-card'} key={n}>
                  <div className="day-header" style={{ display: 'block' }}>
                    <div className="day-photo-strip">
                      <img src={img} alt={`${imgAltBase} — ${dayTitle}`} />
                      <div className="day-photo-overlay" />
                      {day.photoCaption ? <div className="day-photo-caption">{day.photoCaption}</div> : null}
                    </div>
                    <button
                      type="button"
                      className="day-header-row"
                      onClick={() => toggleDay(n)}
                      aria-expanded={open}
                      aria-controls={`day-panel-${n}`}
                      id={`day-trigger-${n}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="day-num" aria-hidden>
                          {n}
                        </div>
                        <div>
                          <h3 className="day-title">{dayTitle}</h3>
                          {day.subtitle ? <div className="day-subtitle">{day.subtitle}</div> : null}
                        </div>
                      </div>
                      <svg className="day-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="2.5">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                  </div>
                  <div className="day-body" id={`day-panel-${n}`} role="region" aria-labelledby={`day-trigger-${n}`}>
                    <div className="day-body-inner">
                      {(day.timeline || []).map((t, j) => (
                        <div className="timeline-item" key={j}>
                          <div className="timeline-time">{t.time || '—'}</div>
                          <div>
                            <div className="timeline-title">{t.title}</div>
                            {t.description ? <div className="timeline-desc">{t.description}</div> : null}
                          </div>
                        </div>
                      ))}
                      {day.lodgeOvernight ? (
                        <div className="day-lodge-badge">
                          <span className="day-lodge-name">{day.lodgeOvernight}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section
        className="content-section bg-warm fade"
        id="includes"
        aria-labelledby="includes-heading"
      >
        <div className="content-inner">
          <div className="eyebrow">What&apos;s covered</div>
          <h2 className="h2" id="includes-heading" style={{ marginBottom: 20 }}>
            Includes &amp; not included
          </h2>
          <div className="includes-grid">
            <div className="includes-col includes-col-yes">
              <h3 className="includes-title includes-title-yes">What&apos;s included</h3>
              <ul className="includes-list">
                {(e.includes?.length ? e.includes : ['Transport, meals, and professional guides · details in confirmation']).map(
                  (x, i) => (
                    <li className="includes-item includes-item-yes" key={i}>
                      <div className="inc-check" />
                      {x}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="includes-col includes-col-no">
              <h3 className="includes-title includes-title-no">Not included</h3>
              <ul className="includes-list">
                {(e.notIncludes?.length ? e.notIncludes : ['Flights to Cusco', 'Travel insurance', 'Alcoholic drinks']).map(
                  (x, i) => (
                    <li className="includes-item includes-item-no" key={i}>
                      <div className="inc-cross" />
                      {x}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        className="content-section fade"
        id="lodges"
        aria-labelledby="lodges-heading"
      >
        <div className="content-inner">
          <div className="eyebrow">Where you&apos;ll stay</div>
          <h2 className="h2" id="lodges-heading" style={{ marginBottom: 6 }}>
            Your base in the forest
          </h2>
          {lodge?.name ? (
            <p className="body" style={{ fontSize: 14, maxWidth: 600, marginBottom: 20 }}>
              {e.shortDescription || lodge.shortDescription || 'Lodge information will appear here.'}
            </p>
          ) : (
            <p className="body" style={{ marginBottom: 20 }}>Lodge details coming soon — our team is updating this program.</p>
          )}
          {lodge?.name ? (
            <div className="lodge-cards">
              <div className="lodge-card">
                <div className="lodge-card-img">
                  <img src={cdnImageUrl(lodge.mainImage ?? null, 800, U_FALL)} alt={lodge.name} />
                </div>
                <div className="lodge-card-body">
                  <div>
                    <div className="lodge-card-header">
                      <div>
                        <span className="lodge-night-badge">{e.lodgeNightLabel || 'Nights 1 & 2'}</span>
                        <h3 className="lodge-card-name" style={{ marginTop: 8 }}>
                          {lodge.name}
                        </h3>
                      </div>
                    </div>
                    <div className="lodge-card-meta" style={{ marginTop: 6 }}>
                      {[formatLodgeAltitudeForSubtitle(lodge.altitude), ROUTE_LABEL[e.route!] || e.route, lodge.capacity ? `Max ${lodge.capacity} guests` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                    {lodge.amenities?.length ? (
                      <div className="lodge-card-chips" style={{ marginTop: 10, marginBottom: 14 }}>
                        {lodge.amenities.slice(0, 5).map((a, i) => (
                          <span className="lodge-chip" key={i}>
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link
                      href={lodge.slug?.current ? `https://www.ecotone.eco/destinations/${lodge.slug.current}` : 'https://www.ecotone.eco/destinations'}
                      className="lodge-card-cta"
                    >
                      View full lodge page
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="var(--brown)" strokeWidth="2">
                        <line x1="2" y1="6" x2="10" y2="6" />
                        <polyline points="7 3 10 6 7 9" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section
        className="content-section bg-cream fade"
        id="wildlife"
        aria-labelledby="wildlife-heading"
      >
        <div className="content-inner">
          <div className="eyebrow">What you might encounter</div>
          <h2 className="h2" id="wildlife-heading" style={{ marginBottom: 6 }}>
            Wildlife
          </h2>
          <p className="body" style={{ fontSize: 14, marginBottom: 20, maxWidth: 560 }}>
            Not guaranteed — this is wild nature. Field teams regularly observe these in this corridor.
          </p>
          {wildlifeGridItems.length > 0 ? <ExperienceWildlifeGrid items={wildlifeGridItems} /> : null}
        </div>
      </section>

      <TechProductsSection
        variant="experience"
        products={allTech}
        includedProductIds={includedIds}
        capAtThree={false}
      />

      <section
        className="content-section fade"
        id="media"
        aria-labelledby="media-heading"
      >
        <div className="content-inner">
          <div className="eyebrow">See it before you go</div>
          <h2 className="h2" id="media-heading" style={{ marginBottom: 14 }}>
            The experience, unfiltered
          </h2>
          {e.videoUrl ? (
            <a
              href={e.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="video-hero"
              style={{ display: 'block' }}
              aria-label={`Watch video about ${imgAltBase}`}
            >
              <img src={mainImg} alt="" role="presentation" />
              <span className="video-overlay" style={{ textDecoration: 'none' }}>
                <span className="play-btn" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--brown)">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
              </span>
            </a>
          ) : (
            <div className="video-hero">
              <img src={mainImg} alt={`${imgAltBase} — preview`} />
            </div>
          )}
          <div className="media-grid">
            {gallery.slice(0, 3).map((g) => (
              <div className="media-thumb" key={g.key}>
                <img src={g.url} alt={`${imgAltBase} — ${g.label}`} />
                <div className="media-overlay" />
                <span className="media-label" style={{ background: 'rgba(0,0,0,.55)' }}>
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section bg-warm fade" id="when">
        <div className="content-inner">
          <div className="eyebrow">When to visit</div>
          <h2 className="h2" style={{ marginBottom: 6 }}>
            Every month has something special
          </h2>
          <p className="body" style={{ maxWidth: 540 }}>
            Weather and species activity shift through the year — we&apos;ll help you time your visit.
          </p>
          <div className="months-grid">
            {bestMonths.map((m, i) => {
              const level = m.level
              const cls =
                level === 'peak'
                  ? 'month-card level-peak'
                  : level === 'good'
                    ? 'month-card good level-good'
                    : 'month-card always-good'
              return (
                <div className={cls} key={i}>
                  <div className="month-bar" />
                  <div className="month-body">
                    <div className="month-name">{m.month || `M${i + 1}`}</div>
                    <div className="month-highlight">{m.highlight || '—'}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="months-legend">
            <div className="legend-item">
              <div className="legend-swatch" style={{ border: '2px solid var(--brown)', background: 'var(--b50)' }} />
              Peak
            </div>
            <div className="legend-item">
              <div
                className="legend-swatch"
                style={{ border: '1.5px solid var(--b200)', background: 'var(--b50)' }}
              />
              Great
            </div>
            <div className="legend-item">
              <div className="legend-swatch" style={{ border: '1px solid var(--n200)', background: 'var(--w)' }} />
              Always good
            </div>
          </div>
        </div>
      </section>

      <section className="content-section fade" id="before-you-go">
        <div className="content-inner">
          <div className="eyebrow">Traveller guide</div>
          <h2 className="h2" style={{ marginBottom: 6 }}>
            Before you go
          </h2>
          <p className="body" style={{ marginBottom: 20, maxWidth: 560 }}>Key tips for {rLabel}.</p>
          {['Entry requirements (Perú)', `Packing · ${e.route || 'jungle'}`, 'Getting to Cusco'].map((title, i) => {
            const id = `b${i + 1}`
            const o = openBfyg === id
            return (
              <div className={o ? 'bfyg-card open' : 'bfyg-card'} key={id}>
                <button
                  type="button"
                  className="bfyg-header"
                  onClick={() => setOpenBfyg(o ? null : id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div className="bfyg-icon" />
                    <div className="bfyg-title">{title}</div>
                  </div>
                  <svg className="bfyg-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="bfyg-body">
                  <div className="bfyg-body-inner">
                    <p className="body" style={{ fontSize: 13 }}>
                      Valid passport, travel insurance, and 1–2 days in Cusco to acclimatise are strongly recommended. We pick up
                      at your hotel the morning of departure.
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {e.mapPdfUrl || e.brochurePdfUrl ? (
        <section className="content-section bg-warm fade">
          <div className="content-inner">
            <div className="eyebrow">Resources</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>
              Download &amp; plan
            </h2>
            <div className="downloads-grid">
              {e.mapPdfUrl ? (
                <div className="download-card">
                  <div className="download-preview" />
                  <div className="download-body" style={{ padding: '12px 14px' }}>
                    <div className="download-title">Route map</div>
                    <a href={e.mapPdfUrl} className="download-btn" target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </div>
                </div>
              ) : null}
              {e.brochurePdfUrl ? (
                <div className="download-card brochure">
                  <div className="download-preview" style={{ minHeight: 100 }} />
                  <div className="download-body" style={{ padding: '12px 14px' }}>
                    <div className="download-title">Brochure</div>
                    <a href={e.brochurePdfUrl} className="download-btn" target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <ReviewsSection
        sectionClassName="sec bg-cream fade"
        contentInnerClassName="sec-inner"
        eyebrow="What guests say"
        title="Real experiences"
        body={null}
        ratingSummary={DEFAULT_REVIEWS_RATING_SUMMARY}
        rotatingQuoteItems={featuredQuoteItems}
        reviewCards={reviewsFiltered}
        emptyMessage={`No guest reviews for ${e.name} yet. Be the first to share your experience.`}
      />

      {(e.cancellationPolicy || e.termsAndConditions || (e.importantNotes?.length ?? 0) > 0) && (
        <section id="terms" className="content-section bg-warm fade" aria-labelledby="terms-heading">
          <div className="content-inner">
            <div className="eyebrow">Terms</div>
            <h2 className="h2" id="terms-heading">
              Terms &amp; conditions
            </h2>

            <div className="tcard-wrap" role="list" aria-label="Terms details">
              {e.cancellationPolicy ? (
                <div
                  className={openTerms.has('cancellation') ? 'tcard open' : 'tcard'}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="tcard-hd"
                    onClick={() => toggleTerm('cancellation')}
                    aria-expanded={openTerms.has('cancellation')}
                    id="terms-hd-cancellation"
                  >
                    <span className="tcard-hd-title">Cancellation policy</span>
                    <TcardChevron />
                  </button>
                  <div
                    className="tcard-bd"
                    role="region"
                    aria-labelledby="terms-hd-cancellation"
                  >
                    <div className="tcard-bd-inner">
                      <p style={{ margin: 0, font: 'inherit' }}>{e.cancellationPolicy}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {e.termsAndConditions ? (
                <div
                  className={openTerms.has('general') ? 'tcard open' : 'tcard'}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="tcard-hd"
                    onClick={() => toggleTerm('general')}
                    aria-expanded={openTerms.has('general')}
                    id="terms-hd-general"
                  >
                    <span className="tcard-hd-title">General terms</span>
                    <TcardChevron />
                  </button>
                  <div
                    className="tcard-bd"
                    role="region"
                    aria-labelledby="terms-hd-general"
                  >
                    <div className="tcard-bd-inner">
                      <p style={{ margin: 0, font: 'inherit' }}>{e.termsAndConditions}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {(e.importantNotes?.length ?? 0) > 0 ? (
                <div
                  className={openTerms.has('important') ? 'tcard open' : 'tcard'}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="tcard-hd"
                    onClick={() => toggleTerm('important')}
                    aria-expanded={openTerms.has('important')}
                    id="terms-hd-important"
                  >
                    <span className="tcard-hd-title">Important notes</span>
                    <TcardChevron />
                  </button>
                  <div
                    className="tcard-bd"
                    role="region"
                    aria-labelledby="terms-hd-important"
                  >
                    <div className="tcard-bd-inner">
                      <ul className="terms-important-list">
                        {e.importantNotes!.map((note, i) => (
                          <li key={i}>
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--brown)',
                                flexShrink: 0,
                                marginTop: '0.45em',
                              }}
                              aria-hidden
                            />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      <section className="content-section bg-warm fade" id="faq" aria-labelledby="faq-heading">
        <div className="content-inner">
          <div className="eyebrow">FAQs</div>
          <h2 className="h2" id="faq-heading">
            Questions we hear often
          </h2>
          <div className="faq-list">
            {faqs.map((f, i) => {
              const o = openFaq === i
              return (
                <div className={o ? 'faq-item open' : 'faq-item'} key={i}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={o}
                    onClick={() => setOpenFaq(o ? null : i)}
                  >
                    {f.question}
                    <span className="faq-chevron" aria-hidden>
                      ▾
                    </span>
                  </button>
                  <div className="faq-a">
                    <div className="faq-a-inner">{f.answer}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="content-section fade" id="related" aria-labelledby="related-heading">
          <div className="content-inner">
            <div className="eyebrow">You may also like</div>
            <h2 className="h2" id="related-heading" style={{ marginBottom: 16 }}>
              Related experiences
            </h2>
            <div className="related-grid">
              {related
                .filter((x) => x.slug?.current !== slug)
                .map((r) => (
                  <Link
                    key={r._id}
                    href={`/experiences/${r.slug?.current}`}
                    className="related-card"
                  >
                    <div className="related-img">
                      <img src={cdnImageUrl(r.mainImage ?? null, 800, U_FALL)} alt={r.name ?? ''} />
                      <div className="related-img-overlay" />
                    </div>
                    <div className="related-body">
                      <div className="related-type">
                        {r.programType ? PROGRAM_BADGE[r.programType] ?? 'Ecotone' : 'Ecotone'}
                      </div>
                      <h3 className="related-name">{r.name}</h3>
                      <div className="related-meta">{r.duration || '·'} · {r.route ? ROUTE_LABEL[r.route] : ''}</div>
                      <div className="related-foot">
                        <span className="related-price">
                          {r.price != null && r.price > 0 ? formatUsd(r.price) : 'Enquire'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="content-section bg-cream fade" id="book" aria-labelledby="book-heading">
        <div className="content-inner" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            Reserve
          </div>
          <h2 className="h2" id="book-heading" style={{ marginBottom: 12 }}>
            Ready to go?
          </h2>
          <div className="booking-card-exp">
            <div className="booking-price-big">
              {price.text}
              {price.sub ? <small> {price.sub}</small> : null}
            </div>
            <div className="booking-divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <div className="booking-row">
                <span className="body" style={{ color: 'var(--n400)' }}>Program</span>
                <span style={{ fontWeight: 600 }}>{pBadges}</span>
              </div>
              <div className="booking-row">
                <span className="body" style={{ color: 'var(--n400)' }}>Route</span>
                <span style={{ fontWeight: 600 }}>{rLabel}</span>
              </div>
              {e.duration ? (
                <div className="booking-row">
                  <span className="body" style={{ color: 'var(--n400)' }}>Duration</span>
                  <span style={{ fontWeight: 600 }}>{e.duration}</span>
                </div>
              ) : null}
            </div>
            <a className="btn-book-main" href="https://www.wetravel.com" target="_blank" rel="noopener noreferrer">
              Book with Ecotone
            </a>
            <a
              className="btn-wa-main"
              href="https://wa.me/51974781094?text=I%20want%20details%20about%20" 
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask via WhatsApp
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
