import type { Metadata } from 'next'
import Link from 'next/link'

import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import { getJournalIndexPage, getJournalPostsIndex } from '@/lib/getJournalCms'
import { HOME_BLOG_CARD_IMAGE_FALLBACKS } from '@/lib/homeBlogDefaults'
import type { BlogPostDoc } from '@/lib/queries'
import { cdnImageUrl } from '@/lib/sanity'
import { absoluteUrl } from '@/lib/siteUrl'

const ReadArrow = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <line x1="2" y1="6" x2="10" y2="6" />
    <polyline points="7 3 10 6 7 9" />
  </svg>
)

function postHref(p: BlogPostDoc): string | null {
  const s = p.slug?.current?.trim()
  return s ? `/journal/${s.replace(/^\//, '')}` : null
}

function collectTags(posts: BlogPostDoc[]): string[] {
  const set = new Set<string>()
  for (const p of posts) {
    for (const t of p.tags ?? []) {
      const x = (t ?? '').trim()
      if (x) set.add(x)
    }
    const c = (p.category ?? '').trim()
    if (c) set.add(c)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export async function generateMetadata(): Promise<Metadata> {
  const j = await getJournalIndexPage()
  const title = j.seo.title || `${j.heroTitle} · Ecotone`
  const description =
    j.seo.description || (j.heroIntro.length > 160 ? `${j.heroIntro.slice(0, 157)}…` : j.heroIntro)
  return {
    title,
    description,
    robots: j.seo.noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical: absoluteUrl('/journal') },
    openGraph: j.seo.ogImageUrl
      ? { title, description, url: absoluteUrl('/journal'), images: [{ url: j.seo.ogImageUrl }] }
      : { title, description, url: absoluteUrl('/journal') },
  }
}

export default async function JournalIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ tag?: string }>
}) {
  const sp = searchParams ? await searchParams : {}
  const activeTag = (sp.tag ?? '').trim()

  const [index, posts] = await Promise.all([getJournalIndexPage(), getJournalPostsIndex()])
  const tags = index.showTagFilter ? collectTags(posts) : []

  const featured = posts.find((p) => p.featured) ?? null
  const rest = featured ? posts.filter((p) => p._id !== featured._id) : posts

  const matchesTag = (p: BlogPostDoc) => {
    if (!activeTag) return true
    const cat = (p.category ?? '').trim()
    const tagLower = activeTag.toLowerCase()
    if (cat.toLowerCase() === tagLower) return true
    return (p.tags ?? []).some((t) => (t ?? '').trim().toLowerCase() === tagLower)
  }

  const gridPosts = rest.filter(matchesTag)
  const showFeatured = featured != null && matchesTag(featured)

  const readLabel = homePageTextFields.blogReadLabel

  return (
    <EcotoneV2Client solidMainNav>
      <div className="journal-page">
        <IsotipoDefs />
        <SiteHeader />
        <header className="journal-index-hero">
          <div className="content-inner fade">
            <div className="eyebrow">{index.heroEyebrow}</div>
            <h1 className="h2">{index.heroTitle}</h1>
            <p className="body journal-index-lead">{index.heroIntro}</p>
            {tags.length > 0 ? (
              <nav className="journal-tag-row" aria-label="Filter by topic">
                <Link href="/journal" className={!activeTag ? 'journal-tag-active' : ''}>
                  All
                </Link>
                {tags.map((t) => {
                  const q = new URLSearchParams({ tag: t })
                  const active = activeTag.toLowerCase() === t.toLowerCase()
                  return (
                    <Link key={t} href={`/journal?${q.toString()}`} className={active ? 'journal-tag-active' : ''}>
                      {t}
                    </Link>
                  )
                })}
              </nav>
            ) : null}
          </div>
        </header>

        <section className="content-section bg-warm fade">
          <div className="content-inner">
            {showFeatured && featured ? (
              <div className="journal-featured">
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  Featured
                </div>
                <article className="journal-featured-card">
                  <div className="journal-featured-img">
                    <img
                      src={cdnImageUrl(
                        featured.image ?? null,
                        1200,
                        HOME_BLOG_CARD_IMAGE_FALLBACKS[0] || '',
                      )}
                      alt={featured.title ?? ''}
                    />
                  </div>
                  <div className="journal-featured-body">
                    <div className="journal-featured-meta">
                      {(featured.category ?? '').trim() || 'Journal'}
                      {featured.readingMinutes != null ? ` · ${featured.readingMinutes} min read` : ''}
                    </div>
                    <h2 className="journal-featured-title">{featured.title}</h2>
                    {featured.excerpt?.trim() ? (
                      <p className="journal-featured-excerpt">{featured.excerpt}</p>
                    ) : null}
                    {postHref(featured) ? (
                      <Link href={postHref(featured)!} className="journal-featured-read">
                        {readLabel} <ReadArrow />
                      </Link>
                    ) : null}
                  </div>
                </article>
              </div>
            ) : null}

            <div className="journal-grid">
              {gridPosts.map((p, i) => {
                const href = postHref(p)
                const fb = HOME_BLOG_CARD_IMAGE_FALLBACKS[i % HOME_BLOG_CARD_IMAGE_FALLBACKS.length] || ''
                const img = cdnImageUrl(p.image ?? null, 800, fb)
                const cat = (p.category ?? '').trim() || 'Journal'
                const min = p.readingMinutes != null ? `${p.readingMinutes} min` : null
                return (
                  <article className="journal-card" key={p._id}>
                    <Link href={href || '#'} className="journal-card-img" aria-hidden={!href}>
                      <img src={img} alt={p.title ?? ''} />
                      <span className="journal-card-tag">
                        {cat}
                        {min ? ` · ${min}` : ''}
                      </span>
                    </Link>
                    <div className="journal-card-body">
                      <div className="journal-card-title">{p.title}</div>
                      {p.excerpt?.trim() ? <p className="journal-card-excerpt">{p.excerpt}</p> : null}
                      {href ? (
                        <Link href={href} className="journal-card-read">
                          {readLabel} <ReadArrow />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>

            {gridPosts.length === 0 ? (
              <p className="body" style={{ marginTop: 24 }}>
                {activeTag ? `No articles tagged “${activeTag}”.` : 'No journal articles yet.'}
              </p>
            ) : null}
          </div>
        </section>

        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
