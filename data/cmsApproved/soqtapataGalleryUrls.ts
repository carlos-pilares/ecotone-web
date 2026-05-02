import { soqtapataPhase1, soqtapataPhase4Media } from '@/data/soqtapataExperienceLocal'

const CATS = ['trail-wildlife', 'lodge', 'drone-footage', 'research'] as const

export type GalleryRow = { url: string; caption: string; category: (typeof CATS)[number] }

/** Same asset family as the experience hero / prior seed (`seedCmsAll` main image). */
export const SOQTAPATA_MAIN_HERO_URL =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85'

/**
 * Distinct image URLs for the Soqtapata experience gallery, in page order,
 * derived from the same module the live page uses (no `payloadV1`).
 */
export function collectSoqtapataGalleryRows(): GalleryRow[] {
  const raw: GalleryRow[] = []
  let i = 0
  for (const c of soqtapataPhase1.hero.gallery) {
    const url = i === 0 ? SOQTAPATA_MAIN_HERO_URL : c.imageSrc
    raw.push({
      url,
      caption: c.galleryLabel || c.imageAlt || 'Soqtapata',
      category: CATS[i % 4],
    })
    i += 1
  }
  raw.push({
    url: soqtapataPhase4Media.video.imageSrc,
    caption: soqtapataPhase4Media.video.filmPill,
    category: 'drone-footage',
  })
  for (const t of soqtapataPhase4Media.thumbs) {
    raw.push({
      url: t.imageSrc,
      caption: t.label,
      category: CATS[i % 4],
    })
    i += 1
  }

  const seen = new Set<string>()
  const out: GalleryRow[] = []
  for (const row of raw) {
    if (seen.has(row.url)) continue
    seen.add(row.url)
    out.push(row)
  }
  return out.slice(0, 18)
}
