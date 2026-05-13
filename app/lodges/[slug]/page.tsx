import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LodgePageView } from '@/app/lodges/LodgePageView'
import { getLodgePageCms, getLodgePageSlugsForStaticParams } from '@/lib/lodgePageCms'
import { lodgeSoqtapataSeoDefault } from '@/lib/lodgePageCmsTypes'

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
    return { title: 'Lodge · Ecotone', description: lodgeSoqtapataSeoDefault.description }
  }
  return {
    title: resolved.seo.title || lodgeSoqtapataSeoDefault.title,
    description: resolved.seo.description || lodgeSoqtapataSeoDefault.description,
  }
}

export default async function LodgePageBySlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resolved = await getLodgePageCms(slug)
  if (resolved.source !== 'cms' || !resolved.doc?.lodgePageId) {
    notFound()
  }
  return <LodgePageView resolved={resolved} />
}
