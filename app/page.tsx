import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { ExperiencesExplorer } from '@/components/ExperiencesExplorer'
import { FooterHome } from '@/components/FooterHome'
import { Hero } from '@/components/Hero'
import { HomeStaticSections } from '@/components/HomeStaticSections'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { ReviewsSection } from '@/components/ReviewsSection'
import { TopNav } from '@/components/TopNav'
import { buildFeaturedQuoteItems } from '@/lib/featuredQuotes'
import { parseEcotoneHomeHtml } from '@/lib/parseEcotoneHomeHtml'
import {
  blogPostsQuery,
  experiencesQuery,
  homePageQuery,
  partnersQuery,
  type BlogPostDoc,
  type ExperienceFromSanity,
  type HomePageDoc,
  type PartnerDoc,
  type ReviewDoc,
  type TechnologyProductDoc,
  reviewsQuery,
  technologyProductsQuery,
} from '@/lib/queries'
import { client } from '@/lib/sanity'

const raw = readFileSync(join(process.cwd(), 'ecotone-home-final.html'), 'utf-8')
const { css } = parseEcotoneHomeHtml(raw)

export default async function Home() {
  let homePage: HomePageDoc = null
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
        client.fetch<HomePageDoc>(homePageQuery),
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
      // Use empty fallbacks; components show hardcoded content.
    }
  }

  const featuredQuoteItems = buildFeaturedQuoteItems(reviews)

  return (
    <>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: css }}
      />
      <EcotoneV2Client featuredQuoteItems={featuredQuoteItems}>
        <IsotipoDefs />
        <TopNav />
        <Hero heroData={homePage} />
        <HomeStaticSections
          homeData={homePage}
          techProducts={techProducts}
          partners={partners}
          blogPosts={blogPosts}
          betweenManifestoAndTech={
            <>
              <ExperiencesExplorer experiences={experiences} explorer={homePage} />
              <ReviewsSection
                homeData={homePage}
                reviews={reviews}
                featuredQuoteItems={featuredQuoteItems}
              />
            </>
          }
        />
        <FooterHome />
      </EcotoneV2Client>
    </>
  )
}
