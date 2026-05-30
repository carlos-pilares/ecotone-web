import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import './experiences/experience-surface.css'
import './home-surface.css'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { ExperiencesExplorer } from '@/components/ExperiencesExplorer'
import { Hero } from '@/components/Hero'
import { HomeStaticSections } from '@/components/HomeStaticSections'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { ReviewsSection } from '@/components/ReviewsSection'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { buildRotatingQuoteItemsFromReviews } from '@/lib/reviewQuoteItems'
import { normalizeReviewsRatingSummary } from '@/lib/reviewsRatingSummary'
import { parseEcotoneHomeHtml } from '@/lib/parseEcotoneHomeHtml'
import { getActivePromotions } from '@/lib/getPromotions'
import { getHomePage, type ResolvedHomePage } from '@/lib/getHomePage'
import { defaultHomePageDoc } from '@/lib/homePageDefaults'
import {
  blogPostsQuery,
  experiencesQuery,
  type BlogPostDoc,
  type ExperienceFromSanity,
  type ReviewDoc,
  type TechnologyProductDoc,
  reviewsQuery,
  technologyProductsQuery,
} from '@/lib/queries'
import { filterPublishedPartnerDocs } from '@/lib/partnerDocs'
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
  let blogPosts: BlogPostDoc[] = []
  let experiences: ExperienceFromSanity[] = []
  let promotions: Awaited<ReturnType<typeof getActivePromotions>> = []

  const canFetch = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET,
  )

  if (canFetch) {
    try {
      const [hp, r, t, b, e, promoRows] = await Promise.all([
        getHomePage(),
        client.fetch<ReviewDoc[]>(reviewsQuery),
        client.fetch<TechnologyProductDoc[]>(technologyProductsQuery),
        client.fetch<BlogPostDoc[]>(blogPostsQuery),
        client.fetch<ExperienceFromSanity[]>(experiencesQuery),
        getActivePromotions(),
      ])
      homePage = hp
      reviews = Array.isArray(r) ? r : []
      techProducts = Array.isArray(t) ? t : []
      blogPosts = Array.isArray(b) ? b : []
      experiences = Array.isArray(e) ? e : []
      promotions = promoRows
    } catch {
      // Other lists empty; `homePage` is always resolvable (approved defaults, never null).
      homePage = await getHomePage()
    }
  } else {
    homePage = await getHomePage()
  }

  const rsHome = homePage.reviewsSection
  const cardsFromSection = rsHome?.reviewCards?.filter((r) => r && r._id && r.quote) ?? []
  const reviewsForHome =
    cardsFromSection.length > 0
      ? cardsFromSection
      : homePage.homeSelectedReviews && homePage.homeSelectedReviews.length > 0
        ? homePage.homeSelectedReviews
        : reviews
  const rotatingForHome = buildRotatingQuoteItemsFromReviews(rsHome?.rotatingReviews ?? [])
  const featuredQuoteItems = rotatingForHome
  const reviewsRatingSummary = normalizeReviewsRatingSummary(homePage.reviewsSettings ?? null)
  const techProductsForHome =
    homePage.homeSelectedTechnologyProducts && homePage.homeSelectedTechnologyProducts.length > 0
      ? homePage.homeSelectedTechnologyProducts
      : techProducts
  const partnersForHome = filterPublishedPartnerDocs(homePage.partnersOnHome)
  const blogPostsForHome =
    homePage.homeSelectedBlogPosts && homePage.homeSelectedBlogPosts.length > 0
      ? homePage.homeSelectedBlogPosts
      : blogPosts

  /** Per-request read so dev / deploy never serve a stale concat; order: ecotone → nav rules → tokens last (beats ecotone :root in this sheet). */
  const shellNavLogoCss = readFileSync(join(process.cwd(), 'app/shell-nav-logo.css'), 'utf-8')
  const shellLogoTokensCss = readFileSync(join(process.cwd(), 'app/shell-logo-tokens.css'), 'utf-8')
  /** After ecotone extract: win cascade for root overflow + scroll containment (mobile Safari lateral drag). */
  const viewportOverflowCss = `
html{max-width:100%;overflow-x:hidden;}
body{max-width:100%;position:relative;overflow-x:hidden;}
@supports (overflow:clip){
html{overflow-x:clip;}
body{overflow-x:clip;}
}
#reviews{max-width:100%;box-sizing:border-box;overflow-x:hidden;}
@supports (overflow:clip){#reviews{overflow-x:clip;}}
#reviews .reviews-header{grid-template-columns:minmax(0,1fr) auto;gap:min(20px,4vw);}
#reviews .reviews-header>div:first-child{min-width:0;}
#reviews .quote-text{max-width:100%;overflow-wrap:break-word;}
.filter-tabs,.blog-scroll,.rev-scroll,.hscroll{max-width:100%;box-sizing:border-box;overscroll-behavior-x:contain;}
#ecotone-home-root .hero-bg.hero-bg--video,
#ecotone-home-root .hero-bg.hero-bg--slideshow{background-image:none!important;background-color:var(--brown-xdk)!important;}
#ecotone-home-root .hero-bg.hero-bg--video .hero-bg-video{display:block;min-width:100%;min-height:100%;}
`
  const homeInjectCss = `${homeInjectBaseCss}\n/* shell-nav-logo.css (after ecotone img{...}) */\n${shellNavLogoCss}\n/* shell-logo-tokens.css (must be last in this <style>) */\n${shellLogoTokensCss}\n${viewportOverflowCss}\n`

  return (
    <>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: homeInjectCss }}
      />
      <EcotoneV2Client featuredQuoteItems={featuredQuoteItems}>
        <IsotipoDefs />
        <SiteHeader mainNavSolid={false} overlayOnHero />
        {homePage.sectionVisibility.hero ? <Hero heroData={homePage} /> : null}
        <HomeStaticSections
          homeData={homePage}
          sectionVisibility={homePage.sectionVisibility}
          experiences={experiences}
          techProducts={techProductsForHome}
          partners={partnersForHome}
          blogPosts={blogPostsForHome}
          betweenManifestoAndTech={
            <>
              {homePage.sectionVisibility.explorer ? (
                <ExperiencesExplorer experiences={experiences} explorer={homePage} promotions={promotions} />
              ) : null}
              {homePage.sectionVisibility.reviews ? (
              <ReviewsSection
                sectionClassName="sec bg-cream fade"
                contentInnerClassName="sec-inner"
                eyebrow={
                  rsHome?.eyebrow?.trim() ||
                  homePage.reviewsEyebrow?.trim() ||
                  'What guests say'
                }
                title={
                  rsHome?.title?.trim() ||
                  homePage.reviewsHeadline?.trim() ||
                  'Real experiences'
                }
                body={rsHome?.body?.trim() || homePage.reviewsBody?.trim() || null}
                ratingSummary={reviewsRatingSummary}
                rotatingQuoteItems={featuredQuoteItems}
                reviewCards={reviewsForHome}
                emptyMessage={homePage.reviewsEmptyMessage?.trim() || null}
              />
              ) : null}
            </>
          }
        />
        <SiteFooter />
      </EcotoneV2Client>
    </>
  )
}
