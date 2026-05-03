import { Fragment, type ReactNode } from 'react'
import { HeadlineBlock } from '@/components/HeadlineBlock'
import { PartnerMarkByName } from '@/components/partnerLogos'
import { MissionItemIcon, TrustItemIcon } from '@/components/sectionIcons'
import { TechProductsSection } from '@/components/TechProductsSection'
import type { BlogPostDoc, HomePageDoc, PartnerDoc, TechnologyProductDoc } from '@/lib/queries'
import { cdnImageUrl } from '@/lib/sanity'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import { HOME_BLOG_CARD_IMAGE_FALLBACKS } from '@/lib/homeBlogDefaults'

const U_MANI = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85'
const U_M1 = 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=800&q=80'
const U_M2 = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&q=80'
const U_M3 = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=80'
const DEFAULT_STATS: { number: string; label: string }[] = [
  { number: '3', label: 'Routes' },
  { number: '~10', label: 'Experiences' },
  { number: '1,200+', label: 'Species observed' },
  { number: '5.0 ★', label: 'Guest rating' },
]

const DEFAULT_MISSION_ITEMS: Array<{
  iconType: string
  title: string
  subtitle: string
}> = [
  {
    iconType: 'transport',
    title: 'All-inclusive from Cusco',
    subtitle: 'Certified naturalist guides · pickup at your hotel',
  },
  {
    iconType: 'lodge',
    title: 'Exclusive eco-lodges',
    subtitle: 'Located in high-biodiversity conservation zones',
  },
  {
    iconType: 'tech',
    title: 'Technology-enhanced immersion',
    subtitle: 'EcoDroneView® · ForestWhisper® · EcoSpeciesExplorer®',
  },
  {
    iconType: 'group',
    title: 'Max 8 people per group',
    subtitle: 'Always intimate · never a mass tour',
  },
  {
    iconType: 'conservation',
    title: 'Direct conservation impact',
    subtitle: 'Every booking funds active research and local communities',
  },
]

const DEFAULT_TRUST: Array<{ iconType: string; text: string }> = [
  { iconType: 'shield', text: 'Secure payment — multiple methods accepted' },
  { iconType: 'chart', text: 'Free cancellation up to 15 days before departure' },
  { iconType: 'heart', text: 'Committed to responsible and regenerative tourism' },
  { iconType: 'clock', text: 'All-inclusive from Cusco — pickup from your hotel' },
]

const DEFAULT_BOOKING_ROWS: { label: string; value: string }[] = [
  { label: 'Routes', value: 'Camanti · Manu Route · Core' },
  { label: 'Group size', value: '2 – 8 people' },
  { label: 'Duration', value: '3 days – 6 weeks' },
  { label: 'Pickup', value: '4:30–5:00 AM · Cusco' },
]

const BlogArrow = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <line x1="2" y1="6" x2="10" y2="6" />
    <polyline points="7 3 10 6 7 9" />
  </svg>
)

function blogPostHref(p: BlogPostDoc, fallbackHref: string): string {
  const ext = p.externalLink?.trim()
  if (ext && /^https?:\/\//i.test(ext)) return ext
  const raw = p.slug?.current?.trim()
  if (raw) {
    if (/^https?:\/\//i.test(raw)) return raw
    const path = raw.replace(/^\//, '')
    if (path.startsWith('blog/')) return `/${path}`
    return `/blog/${path}`
  }
  return fallbackHref
}

type Props = {
  homeData: HomePageDoc | null
  techProducts: TechnologyProductDoc[] | null
  partners: PartnerDoc[] | null
  blogPosts: BlogPostDoc[] | null
  betweenManifestoAndTech: ReactNode
}

export function HomeStaticSections({
  homeData,
  techProducts,
  partners,
  blogPosts,
  betweenManifestoAndTech,
}: Props) {
  const h = homeData

  const stats =
    h?.stats && Array.isArray(h.stats) && h.stats.length > 0
      ? h.stats
          .map((s) => ({ number: s?.number ?? '', label: s?.label ?? '' }))
          .filter((s) => s.number || s.label)
      : DEFAULT_STATS

  const manImg = cdnImageUrl(h?.manifestoImage ?? null, 900, U_MANI)
  const mPh1 = cdnImageUrl(h?.missionPhoto1 ?? null, 800, U_M1)
  const mPh2 = cdnImageUrl(h?.missionPhoto2 ?? null, 500, U_M2)
  const mPh3 = cdnImageUrl(h?.missionPhoto3 ?? null, 500, U_M3)

  const missionItems =
    h?.missionItems && h.missionItems.length > 0 ? h.missionItems : DEFAULT_MISSION_ITEMS

  const prList: PartnerDoc[] = partners && partners.length > 0 ? partners : []
  const partnersEmptyMsg =
    h?.partnersEmptyMessage?.trim() || homePageTextFields.partnersEmptyMessage?.trim()
  const showPartnersBand = prList.length > 0 || Boolean(partnersEmptyMsg)
  const partnerNameFb = h?.partnerNameFallback?.trim() || homePageTextFields.partnerNameFallback

  const blogList: BlogPostDoc[] = blogPosts && blogPosts.length > 0 ? blogPosts : []
  const blogEmptyDisplay = h?.blogEmptyMessage?.trim() || homePageTextFields.blogEmptyMessage
  const blogPostLinkFallback =
    h?.blogFallbackPostHref?.trim() || homePageTextFields.blogFallbackPostHref

  const bookingRows =
    h?.bookingCardRows && h.bookingCardRows.length > 0
      ? h.bookingCardRows
          .map((r) => ({ label: r?.label ?? '', value: r?.value ?? '' }))
          .filter((r) => r.label || r.value)
      : DEFAULT_BOOKING_ROWS

  const trustItems =
    h?.bookingTrustItems && h.bookingTrustItems.length > 0
      ? h.bookingTrustItems.map((t) => ({ iconType: t?.iconType ?? 'shield', text: t?.text ?? '' }))
      : DEFAULT_TRUST

  return (
    <>
      <div className="stats-band">
        <div className="stats-inner">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-n">{s.number || '—'}</div>
              <div className="stat-l">{s.label || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="sec bg-warm" id="about">
        <div className="sec-inner">
          <div className="manifesto-grid fade">
            <div>
              <div className="manifesto-img">
                <img src={manImg} alt="" />
              </div>
              <p className="manifesto-caption">
                {h?.manifestoImageCaption ?? 'Soqtapata · 3,200 m.a.s.l. · Camanti Route'}
              </p>
            </div>
            <div>
              <div className="eyebrow">{h?.manifestoEyebrow ?? 'Our purpose'}</div>
              <HeadlineBlock
                text={h?.manifestoHeadline ?? null}
                fallback={
                  <>
                    Not a tour.
                    <br />
                    An immersion.
                  </>
                }
              />
              <p className="body">
                {h?.manifestoBody1 ??
                  'We design all-inclusive journeys where technology deepens your connection with nature — not replaces it. Every trail, every sound, every species encountered becomes part of a story you carry home.'}
              </p>
              <p className="body" style={{ marginTop: 14 }}>
                {h?.manifestoBody2 ??
                  'Three routes through the Manu Biosphere Reserve and Camanti cloud forest. Four ways to travel with purpose. One commitment: protect what matters.'}
              </p>
              <div className="manifesto-cta">
                <a href={h?.manifestoCta1Link ?? '#about'} className="btn-primary">
                  {h?.manifestoCta1Text ?? 'Our story'}
                </a>
                <a href={h?.manifestoCta2Link ?? '#experiences'} className="btn-outline">
                  {h?.manifestoCta2Text ?? 'Explore programs'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {betweenManifestoAndTech}

      <TechProductsSection homeData={h} products={techProducts} />

      <section className="sec" id="mission">
        <div className="sec-inner fade">
          <div className="mission-grid">
            <div>
              <div className="eyebrow">{h?.missionEyebrow ?? 'Why travel with us'}</div>
              <HeadlineBlock
                text={h?.missionHeadline ?? null}
                fallback={
                  <>
                    Travel deeper.
                    <br />
                    Protect what matters.
                  </>
                }
              />
              <p className="body">
                {h?.missionBody ??
                  'Every booking directly funds conservation in the Manu Biosphere Reserve and Camanti cloud forest.'}
              </p>
              <ul className="mission-list">
                {missionItems.map((m, i) => {
                  const d = DEFAULT_MISSION_ITEMS[i]
                  return (
                    <li className="mission-item" key={m.title ?? i}>
                      <div className="mission-icon">
                        <MissionItemIcon iconType={m.iconType} />
                      </div>
                      <div className="mission-item-text">
                        <div className="mission-item-title">{m.title ?? d?.title}</div>
                        <div className="mission-item-sub">{m.subtitle ?? d?.subtitle}</div>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <a href={h?.missionCtaLink ?? '#'} className="mission-cta">
                {h?.missionCtaText ?? 'Read our impact →'}
              </a>
            </div>
            <div className="mission-photos">
              <div className="mission-photo-main">
                <img src={mPh1} alt="" />
              </div>
              <div className="mission-photo-row">
                <div className="mission-photo-sm">
                  <img src={mPh2} alt="" />
                </div>
                <div className="mission-photo-sm">
                  <img src={mPh3} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showPartnersBand ? (
        <div className="partners-band fade">
          <div className="partners-inner">
            <div className="partners-label">
              {h?.partnersLabel ?? homePageTextFields.partnersLabel}
            </div>
            {h?.partnersBody?.trim() ? <p className="body partners-body">{h.partnersBody}</p> : null}
            {prList.length > 0 ? (
              <div className="partners-row">
                {prList.map((p, i) => {
                  const name = p.name?.trim() || partnerNameFb
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
      ) : null}

      <section className="sec bg-warm" id="blog">
        <div className="sec-inner fade">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'end',
              gap: 16,
              marginBottom: 0,
            }}
          >
            <div>
              <div className="eyebrow">{h?.blogEyebrow ?? homePageTextFields.blogEyebrow}</div>
              <h2 className="h2" style={{ marginBottom: 0 }}>
                {h?.blogHeadline ?? homePageTextFields.blogHeadline}
              </h2>
              {h?.blogBody?.trim() ? <p className="body" style={{ marginTop: 10 }}>{h.blogBody}</p> : null}
            </div>
            {(() => {
              const allUrl = h?.blogAllPostsUrl?.trim()
              const allLabel = h?.blogAllPostsLabel?.trim() || homePageTextFields.blogAllPostsLabel
              const linkStyle = {
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--brown)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap' as const,
              }
              const arrow = (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <line x1="2" y1="6" x2="10" y2="6" />
                  <polyline points="7 3 10 6 7 9" />
                </svg>
              )
              if (allUrl) {
                return (
                  <a href={allUrl} style={linkStyle}>
                    {allLabel} {arrow}
                  </a>
                )
              }
              return (
                <span style={{ ...linkStyle, cursor: 'default' }}>
                  {allLabel} {arrow}
                </span>
              )
            })()}
          </div>
          <div className="blog-scroll">
            {blogList.length === 0 ? (
              <p className="body" style={{ maxWidth: 560 }}>
                {blogEmptyDisplay}
              </p>
            ) : null}
            {blogList.map((post, i) => {
              const href = blogPostHref(post, blogPostLinkFallback)
              const fbImg =
                HOME_BLOG_CARD_IMAGE_FALLBACKS[i % HOME_BLOG_CARD_IMAGE_FALLBACKS.length] ??
                HOME_BLOG_CARD_IMAGE_FALLBACKS[0]!
              const img = cdnImageUrl(post.image ?? null, 600, fbImg)
              const fbMin = h?.blogFallbackReadingMinutes ?? homePageTextFields.blogFallbackReadingMinutes
              const min = post.readingMinutes != null ? `${post.readingMinutes} min` : `${fbMin} min`
              const cat =
                (post.category && post.category.trim()) ||
                h?.blogFallbackCategory?.trim() ||
                homePageTextFields.blogFallbackCategory
              const readLabel = h?.blogReadLabel?.trim() || homePageTextFields.blogReadLabel
              return (
                <div className="blog-card" key={post._id}>
                  <div className="blog-img">
                    <img src={img} alt={post.title ?? ''} />
                    <div className="blog-img-overlay" />
                    <span className="blog-tag">
                      {cat} · {min}
                    </span>
                  </div>
                  <div className="blog-body">
                    <div className="blog-title">{post.title}</div>
                    <a href={href} className="blog-read">
                      {readLabel} <BlogArrow />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sec" id="book">
        <div className="sec-inner fade">
          <div className="eyebrow">{h?.bookingEyebrow ?? 'Reserve your spot'}</div>
          <h2 className="h2">{h?.bookingHeadline ?? 'Ready to disconnect?'}</h2>
          <div className="booking-layout">
            <div>
              <p className="body">
                {h?.bookingBody ??
                  'Small groups. Fixed departures. Limited spots. Choose from ~10 immersive experiences across 3 routes — or let us design something entirely yours.'}
              </p>
              <ul className="trust-list">
                {trustItems.map((t, i) => (
                  <li className="trust-item" key={i}>
                    <TrustItemIcon iconType={t.iconType} />
                    {t.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="book-card">
                <div className="book-price">
                  {h?.bookingPrice ?? 'from $380'}
                  <small>/ person</small>
                </div>
                <div className="book-price-sub">
                  {h?.bookingPriceSubtext ?? 'All inclusive · departure from Cusco'}
                </div>
                <div className="book-divider" />
                <div className="book-rows">
                  {bookingRows.map((r, i) => (
                    <div className="book-row" key={i}>
                      <span className="book-rl">{r.label}</span>
                      <span className="book-rv">{r.value}</span>
                    </div>
                  ))}
                </div>
                <a href={h?.bookingCta1Link ?? '#experiences'} className="btn-book">
                  {h?.bookingCta1Text ?? 'Explore all experiences →'}
                </a>
                <a href={h?.bookingCta2Link ?? homePageTextFields.bookingCta2Link} className="btn-wa">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {h?.bookingCta2Text ?? 'Ask via WhatsApp'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
