import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { ExperiencesExplorer } from '@/components/ExperiencesExplorer'
import { Hero } from '@/components/Hero'
import { HomeStaticSections } from '@/components/HomeStaticSections'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { ReviewsSection } from '@/components/ReviewsSection'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { buildFeaturedQuoteItems } from '@/lib/featuredQuotes'
import { parseEcotoneHomeHtml } from '@/lib/parseEcotoneHomeHtml'
import { getHomePage, type ResolvedHomePage } from '@/lib/getHomePage'
import { defaultHomePageDoc } from '@/lib/homePageDefaults'
import {
  blogPostsQuery,
  experiencesQuery,
  partnersQuery,
  type BlogPostDoc,
  type ExperienceFromSanity,
  type PartnerDoc,
  type ReviewDoc,
  type TechnologyProductDoc,
  reviewsQuery,
  technologyProductsQuery,
} from '@/lib/queries'
import { client } from '@/lib/sanity'

const raw = readFileSync(join(process.cwd(), 'ecotone-home-final.html'), 'utf-8')
const { css: homeInjectBaseCss } = parseEcotoneHomeHtml(raw)

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage()
  const s = { ...defaultHomePageDoc.seo, ...home.seo }
  const title = s.title?.trim() || undefined
  const description = s.description?.trim() || undefined
  const images = s.ogImageUrl?.trim() ? [{ url: s.ogImageUrl.trim() }] : undefined
  return {
    title,
    description,
    robots: s.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      ...(images ? { images } : {}),
    },
  }
}

export default async function Home() {
  let homePage: ResolvedHomePage
  let reviews: ReviewDoc[] = []
  let techProducts: TechnologyProductDoc[] = []
  let partners: PartnerDoc[] = []
  let blogPosts: BlogPostDoc[] = []
  let experiences: ExperienceFromSanity[] = []

  const canFetch = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET,
  )

  if (canFetch) {
    try {
      const [hp, r, t, p, b, e] = await Promise.all([
        getHomePage(),
        client.fetch<ReviewDoc[]>(reviewsQuery),
        client.fetch<TechnologyProductDoc[]>(technologyProductsQuery),
        client.fetch<PartnerDoc[]>(partnersQuery),
        client.fetch<BlogPostDoc[]>(blogPostsQuery),
        client.fetch<ExperienceFromSanity[]>(experiencesQuery),
      ])
      homePage = hp
      reviews = Array.isArray(r) ? r : []
      techProducts = Array.isArray(t) ? t : []
      partners = Array.isArray(p) ? p : []
      blogPosts = Array.isArray(b) ? b : []
      experiences = Array.isArray(e) ? e : []
    } catch {
      // Other lists empty; `homePage` is always resolvable (approved defaults, never null).
      homePage = await getHomePage()
    }
  } else {
    homePage = await getHomePage()
  }

  const reviewsForHome =
    homePage.homeSelectedReviews && homePage.homeSelectedReviews.length > 0
      ? homePage.homeSelectedReviews
      : reviews
  const techProductsForHome =
    homePage.homeSelectedTechnologyProducts && homePage.homeSelectedTechnologyProducts.length > 0
      ? homePage.homeSelectedTechnologyProducts
      : techProducts
  const partnersForHome =
    homePage.homeSelectedPartners && homePage.homeSelectedPartners.length > 0
      ? homePage.homeSelectedPartners
      : partners
  const blogPostsForHome =
    homePage.homeSelectedBlogPosts && homePage.homeSelectedBlogPosts.length > 0
      ? homePage.homeSelectedBlogPosts
      : blogPosts

  const featuredQuoteItems = buildFeaturedQuoteItems(reviewsForHome)

  /** Per-request read so dev / deploy never serve a stale concat; order: ecotone → nav rules → tokens last (beats ecotone :root in this sheet). */
  const shellNavLogoCss = readFileSync(join(process.cwd(), 'app/shell-nav-logo.css'), 'utf-8')
  const shellLogoTokensCss = readFileSync(join(process.cwd(), 'app/shell-logo-tokens.css'), 'utf-8')
  const homeInjectCss = `${homeInjectBaseCss}\n/* shell-nav-logo.css (after ecotone img{...}) */\n${shellNavLogoCss}\n/* shell-logo-tokens.css (must be last in this <style>) */\n${shellLogoTokensCss}\n`

  return (
    <>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: homeInjectCss }}
      />
      <EcotoneV2Client featuredQuoteItems={featuredQuoteItems}>
        <IsotipoDefs />
        <SiteHeader mainNavSolid={false} />
        <Hero heroData={homePage} />
        <HomeStaticSections
          homeData={homePage}
          techProducts={techProductsForHome}
          partners={partnersForHome}
          blogPosts={blogPostsForHome}
          betweenManifestoAndTech={
            <>
              <ExperiencesExplorer experiences={experiences} explorer={homePage} />
              <ReviewsSection
                homeData={homePage}
                reviews={reviewsForHome}
                featuredQuoteItems={featuredQuoteItems}
              />
            </>
          }
        />
        <SiteFooter />
      </EcotoneV2Client>
    </>
  )
}
