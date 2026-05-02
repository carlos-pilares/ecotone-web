import type { TechnologyProductDoc } from '@/lib/queries'

/**
 * Soqtapata includes EcoDroneView® and ForestWhisper® on site; EcoSpeciesExplorer® is app-free.
 * IDs match default fallbacks (dtech1, dtech2) when CMS is empty.
 */
export function soqtapataIncludedProductIds(
  products: TechnologyProductDoc[] | null | undefined,
): string[] {
  if (!products?.length) {
    return ['dtech1', 'dtech2']
  }
  const bySub = (s: string) => products.find((p) => p.name?.includes(s))?._id
  const a = bySub('EcoDrone') || products[0]?._id
  const b = bySub('ForestWhisper') || products[1]?._id
  return [a, b].filter(Boolean) as string[]
}
