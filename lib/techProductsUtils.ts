import type { TechnologyProductDoc } from '@/lib/queries'

const U_T1 = 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=85'
const U_T2 = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85'
const U_T3 = 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?w=900&q=85'

export const DEFAULT_TECH_IMAGES = [U_T1, U_T2, U_T3]

const DEFAULT_TECH: Array<
  Pick<
    TechnologyProductDoc,
    '_id' | 'name' | 'number' | 'description' | 'badgeText' | 'badgeTextWhenExcluded' | 'image'
  >
> = [
  {
    _id: 'dtech1',
    name: 'EcoDroneView®',
    number: '01',
    description:
      'A journey beyond the trails, soaring above the canopy and exploring remote landscapes inaccessible by foot.',
    badgeText: 'Only at Ecotone',
    image: null,
  },
  {
    _id: 'dtech2',
    name: 'ForestWhisper®',
    number: '02',
    description:
      "Immerse yourself in the rainforest's enchanting sounds through premium 360° microphones and high-fidelity headphones.",
    badgeText: 'Only at Ecotone',
    image: null,
  },
  {
    _id: 'dtech3',
    name: 'EcoSpeciesExplorer®',
    number: '03',
    description:
      'This comprehensive platform reveals all kinds of incredible species found in our conservation destinations. Live on iOS.',
    badgeText: 'Only at Ecotone',
    badgeTextWhenExcluded: 'Download free on iOS',
    image: null,
  },
]

export function buildTechList(
  products: TechnologyProductDoc[] | null | undefined,
): Array<{ doc: TechnologyProductDoc; imageFallback: string; idx: number }> {
  const def = DEFAULT_TECH as TechnologyProductDoc[]
  const list: TechnologyProductDoc[] =
    products && products.length > 0 ? [...products] : [...def]
  while (list.length < 3) {
    list.push(def[list.length]!)
  }
  return list.slice(0, 3).map((doc, idx) => ({
    doc,
    imageFallback: DEFAULT_TECH_IMAGES[idx] ?? U_T1,
    idx,
  }))
}

export function buildTechListAll(
  products: TechnologyProductDoc[] | null | undefined,
): Array<{ doc: TechnologyProductDoc; imageFallback: string; idx: number }> {
  const def = DEFAULT_TECH as TechnologyProductDoc[]
  const base = products && products.length > 0 ? [...products] : [...def]
  return base.map((doc, idx) => ({
    doc,
    imageFallback: DEFAULT_TECH_IMAGES[idx % DEFAULT_TECH_IMAGES.length]!,
    idx,
  }))
}
