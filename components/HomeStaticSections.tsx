import type { ReactNode } from 'react'
import { HeadlineBlock } from '@/components/HeadlineBlock'
import { PartnersBand } from '@/components/shared/PartnersBand'
import { ReserveCtaSection } from '@/components/shared/ReserveCtaSection'
import { MissionItemIcon } from '@/components/sectionIcons'
import { TechProductsSection } from '@/components/TechProductsSection'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import { HOME_BLOG_CARD_IMAGE_FALLBACKS } from '@/lib/homeBlogDefaults'
import type { ResolvedHomePage } from '@/lib/homePageDefaults'
import {
  HOME_MANIFESTO_IMAGE_FALLBACK_URL,
  HOME_MISSION_PHOTO_FALLBACK_URLS,
} from '@/lib/homePageImageFallbacks'
import type { BlogPostDoc, ExperienceFromSanity, PartnerDoc, TechnologyProductDoc } from '@/lib/queries'
import { getLowestActiveExperiencePrice, buildReserveRowsForHome } from '@/lib/reserveCtaPricing'
import { resolveReserveCtaCard } from '@/lib/resolveReserveCtaCard'
import { cdnImageUrl } from '@/lib/sanity'

const BlogArrow = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <line x1="2" y1="6" x2="10" y2="6" />
    <polyline points="7 3 10 6 7 9" />
  </svg>
)

/** Resolved home CTAs: render nothing unless both label and href are non-empty (hidden smartLink clears both). */
function homeCta(label: string | null | undefined, href: string | null | undefined): { label: string; href: string } | null {
  const t = (label ?? '').trim()
  const h = (href ?? '').trim()
  return t && h ? { label: t, href: h } : null
}

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
  homeData: ResolvedHomePage
  /** For derived “from $X / person” from active experience documents. */
  experiences: ExperienceFromSanity[]
  techProducts: TechnologyProductDoc[] | null
  partners: PartnerDoc[] | null
  blogPosts: BlogPostDoc[] | null
  betweenManifestoAndTech: ReactNode
}

export function HomeStaticSections({
  homeData,
  experiences,
  techProducts,
  partners,
  blogPosts,
  betweenManifestoAndTech,
}: Props) {
  const h = homeData

  const stats = (h.stats ?? [])
    .map((s) => ({ number: (s?.number ?? '').trim(), label: (s?.label ?? '').trim() }))
    .filter((s) => s.number && s.label)

  const manImg = cdnImageUrl(h.manifestoImage ?? null, 900, HOME_MANIFESTO_IMAGE_FALLBACK_URL)
  const mPh1 = cdnImageUrl(h.missionPhoto1 ?? null, 800, HOME_MISSION_PHOTO_FALLBACK_URLS[0])
  const mPh2 = cdnImageUrl(h.missionPhoto2 ?? null, 500, HOME_MISSION_PHOTO_FALLBACK_URLS[1])
  const mPh3 = cdnImageUrl(h.missionPhoto3 ?? null, 500, HOME_MISSION_PHOTO_FALLBACK_URLS[2])

  const prList: PartnerDoc[] = partners && partners.length > 0 ? partners : []
  const partnersEmptyMsg = (h.partnersEmptyMessage ?? '').trim() || null
  const partnersTitle = (h.partnersTitle ?? '').trim()
  const partnersEyebrow = (h.partnersEyebrow ?? '').trim() || null
  const showPartnersBand = prList.length > 0 || Boolean(partnersEmptyMsg)

  const blogList: BlogPostDoc[] = blogPosts && blogPosts.length > 0 ? blogPosts : []
  const blogEmptyDisplay = h.blogEmptyMessage?.trim() || homePageTextFields.blogEmptyMessage
  const blogPostLinkFallback =
    h.blogFallbackPostHref?.trim() || homePageTextFields.blogFallbackPostHref

  const hbFb = homePageTextFields
  const reserveSettings = h.reserveCtaSettings
  const lowestActiveUsd = getLowestActiveExperiencePrice(experiences)
  const reserveCard = resolveReserveCtaCard({
    settings: reserveSettings,
    lowestUsd: lowestActiveUsd,
    legacyPriceLine: h.bookingPrice,
    legacyPriceSuffix: h.bookingPriceSuffixSmall,
    legacySubline: h.bookingPriceSubtext,
    defaultSubline: hbFb.bookingPriceSubtext ?? '',
    defaultRows: buildReserveRowsForHome(),
    legacyCtas: {
      primaryLabel: h.bookingCta1Text,
      primaryHref: h.bookingCta1Link,
      secondaryLabel: h.bookingCta2Text,
      secondaryHref: h.bookingCta2Link,
    },
    defaultTermsHref: '/experiences/soqtapata-pristine-immersion#terms',
  })

  return (
    <>
      <div className="stats-band">
        <div className="stats-inner">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-n">{s.number}</div>
              <div className="stat-l">{s.label}</div>
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
              <p className="manifesto-caption">{h.manifestoImageCaption ?? ''}</p>
            </div>
            <div>
              <div className="eyebrow">{h.manifestoEyebrow ?? ''}</div>
              <HeadlineBlock
                text={h.manifestoHeadline ?? ''}
                fallback={h.manifestoHeadline ?? ''}
              />
              <p className="body">{h.manifestoBody1 ?? ''}</p>
              <p className="body" style={{ marginTop: 14 }}>
                {h.manifestoBody2 ?? ''}
              </p>
              {(() => {
                const c1 = homeCta(h.manifestoCta1Text, h.manifestoCta1Link)
                const c2 = homeCta(h.manifestoCta2Text, h.manifestoCta2Link)
                if (!c1 && !c2) return null
                return (
                  <div className="manifesto-cta">
                    {c1 ? (
                      <a href={c1.href} className="btn-primary">
                        {c1.label}
                      </a>
                    ) : null}
                    {c2 ? (
                      <a href={c2.href} className="btn-outline">
                        {c2.label}
                      </a>
                    ) : null}
                  </div>
                )
              })()}
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
              <div className="eyebrow">{h.missionEyebrow ?? ''}</div>
              <HeadlineBlock text={h.missionHeadline ?? ''} fallback={h.missionHeadline ?? ''} />
              <p className="body">{h.missionBody ?? ''}</p>
              <ul className="mission-list">
                {(h.missionItems ?? []).map((m, i) => (
                  <li className="mission-item" key={m._key ?? `mission-${i}`}>
                    <div className="mission-icon">
                      <MissionItemIcon iconType={m.iconType} />
                    </div>
                    <div className="mission-item-text">
                      <div className="mission-item-title">{m.title ?? ''}</div>
                      <div className="mission-item-sub">{m.subtitle ?? ''}</div>
                    </div>
                  </li>
                ))}
              </ul>
              {(() => {
                const m = homeCta(h.missionCtaText, h.missionCtaLink)
                return m ? (
                  <a href={m.href} className="mission-cta">
                    {m.label}
                  </a>
                ) : null
              })()}
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
        <PartnersBand
          eyebrow={partnersEyebrow}
          title={partnersTitle || null}
          body={h.partnersBody?.trim() ? h.partnersBody : null}
          partners={prList}
          emptyMessage={partnersEmptyMsg}
        />
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
              <div className="eyebrow">{h.blogEyebrow ?? homePageTextFields.blogEyebrow}</div>
              <h2 className="h2" style={{ marginBottom: 0 }}>
                {h.blogHeadline ?? homePageTextFields.blogHeadline}
              </h2>
              {h.blogBody?.trim() ? <p className="body" style={{ marginTop: 10 }}>{h.blogBody}</p> : null}
            </div>
            {(() => {
              const allUrl = h.blogAllPostsUrl?.trim() ?? ''
              const allLabel = (h.blogAllPostsLabel?.trim() || (allUrl ? homePageTextFields.blogAllPostsLabel : '')).trim()
              const all = homeCta(allLabel, allUrl)
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
              if (!all) return null
              return (
                <a href={all.href} style={linkStyle}>
                  {all.label} {arrow}
                </a>
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
              const fbMin = h.blogFallbackReadingMinutes ?? homePageTextFields.blogFallbackReadingMinutes
              const min = post.readingMinutes != null ? `${post.readingMinutes} min` : `${fbMin} min`
              const cat =
                (post.category && post.category.trim()) ||
                h.blogFallbackCategory?.trim() ||
                homePageTextFields.blogFallbackCategory
              const readLabel = h.blogReadLabel?.trim() || homePageTextFields.blogReadLabel
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

      <ReserveCtaSection
        id="book"
        sectionClassName="sec bg-warm"
        innerClassName="sec-inner fade"
        titleId="home-book-heading"
        eyebrow={reserveSettings?.eyebrow?.trim() || h.bookingEyebrow || ''}
        title={reserveSettings?.title?.trim() || h.bookingHeadline || ''}
        body={reserveSettings?.body?.trim() || h.bookingBody || ''}
        card={reserveCard}
      />
    </>
  )
}
