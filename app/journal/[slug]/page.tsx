import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JournalContentBlocks } from '@/components/journal/JournalContentBlocks'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getJournalAllSlugs, getJournalPostBySlug } from '@/lib/getJournalCms'
import { HOME_BLOG_CARD_IMAGE_FALLBACKS } from '@/lib/homeBlogDefaults'
import { cdnImageUrl } from '@/lib/sanity'
import { absoluteUrl } from '@/lib/siteUrl'

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

export async function generateStaticParams() {
  const slugs = await getJournalAllSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getJournalPostBySlug(slug)
  if (!post) return { title: 'Journal · Ecotone' }

  const path = `/journal/${slug}`
  const baseTitle = (post.title ?? 'Journal').trim() || 'Journal'
  const resolvedTitle = post.seo?.title?.trim() || `${baseTitle} · Ecotone`
  const description = (
    post.seo?.description ??
    post.excerpt ??
    ''
  ).trim()
  const og =
    post.seo?.ogImageUrl?.trim() ||
    cdnImageUrl(post.image ?? null, 1200, HOME_BLOG_CARD_IMAGE_FALLBACKS[0] || '')

  return {
    title: resolvedTitle,
    description: description || undefined,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: 'article',
      title: resolvedTitle,
      description: description || undefined,
      url: absoluteUrl(path),
      images: og ? [{ url: og }] : undefined,
    },
  }
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getJournalPostBySlug(slug)
  if (!post) notFound()

  const hero = cdnImageUrl(post.image ?? null, 1600, HOME_BLOG_CARD_IMAGE_FALLBACKS[0] || '')
  const cat = (post.category ?? '').trim() || 'Journal'
  const dateLine = formatDate(post.publishedAt ?? undefined)
  const read =
    post.readingMinutes != null && post.readingMinutes > 0 ? `${post.readingMinutes} min read` : null

  const path = `/journal/${slug}`
  const heroAbsolute = /^https?:\/\//i.test(hero) ? hero : absoluteUrl(hero)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.publishedAt || undefined,
    author: post.author ? {'@type': 'Person', name: post.author} : undefined,
    image: [heroAbsolute],
    mainEntityOfPage: absoluteUrl(path),
  }

  return (
    <EcotoneV2Client solidMainNav>
      <div className="journal-page">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- JSON-LD for SEO
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <IsotipoDefs />
        <SiteHeader />
        <article>
          <header className="journal-article-hero">
            <div className="journal-article-hero-img">
              <img src={hero} alt="" />
              <div className="journal-article-hero-overlay" aria-hidden />
              <div className="journal-article-hero-inner">
                <div className="content-inner">
                  <p className="journal-article-kicker">{cat}</p>
                  <h1 className="journal-article-h1">{post.title}</h1>
                  {post.excerpt?.trim() ? <p className="journal-article-dek">{post.excerpt}</p> : null}
                  <div className="journal-article-meta-row">
                    {dateLine ? <span>{dateLine}</span> : null}
                    {read ? <span>{read}</span> : null}
                    {post.author?.trim() ? <span>{post.author}</span> : null}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="journal-article-body bg-warm">
            <div className="journal-article-prose fade">
              <JournalContentBlocks blocks={(post.contentBlocks ?? []) as unknown[]} />
            </div>
            <div className="content-inner fade" style={{ marginTop: 40 }}>
              <Link href="/journal" className="btn btn-ghost">
                ← Back to Journal
              </Link>
            </div>
          </div>
        </article>
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
