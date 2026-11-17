import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LodgePageView } from '@/app/lodges/LodgePageView'
import { buildAbsoluteSeoMetadata } from '@/lib/buildAbsoluteSeoMetadata'
import { getActivePromotions } from '@/lib/getPromotions'
import { getLodgePageCms, getLodgePageSlugsForStaticParams } from '@/lib/lodgePageCms'

/** ISR: match `app/lodges/soqtapata-lodge/page.tsx`. */
export const revalidate = 60

export async function generateStaticParams() {
  return getLodgePageSlugsForStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const resolved = await getLodgePageCms(slug)
  if (resolved.source !== 'cms' || !resolved.doc?.lodgePageId) {
    return { title: 'Lodge · Ecotone' }
  }
  return buildAbsoluteSeoMetadata({
    path: `/lodges/${slug}`,
    title: resolved.seo.title,
    description: resolved.seo.description,
    noIndex: resolved.seo.noIndex,
    ogImageUrl: resolved.seo.ogImageUrl,
  })
}

export default async function LodgePageBySlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [resolved, promotions] = await Promise.all([getLodgePageCms(slug), getActivePromotions()])
  if (resolved.source !== 'cms' || !resolved.doc?.lodgePageId) {
    notFound()
  }
  return <LodgePageView resolved={resolved} promotions={promotions} />
}
