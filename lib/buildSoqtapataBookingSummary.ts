import type { SoqtapataBook, SoqtapataPhase1Hero } from '@/data/soqtapataExperienceLocal'
import type { ExperienceBookingSummary } from '@/components/booking/types'

function rowValue(rows: { label: string; value: string }[], label: string): string {
  const hit = rows.find((r) => r.label.trim().toLowerCase() === label.toLowerCase())
  return (hit?.value ?? '').trim()
}

/** Banner + prefilled copy for the experience booking modal (Soqtapata page). */
export function buildSoqtapataBookingSummary(hero: SoqtapataPhase1Hero, book: SoqtapataBook): ExperienceBookingSummary {
  const main = hero.gallery.find((g) => g.kind === 'main')
  const imageSrc = main?.imageSrc ?? hero.gallery[0]?.imageSrc ?? ''
  const imageAlt = main?.imageAlt ?? hero.gallery[0]?.imageAlt ?? ''
  const badges = hero.badges.map((b) => b.trim()).filter(Boolean)
  const programType = badges[0] ?? rowValue(book.rows, 'Program') ?? 'Nature program'
  const route = badges[1] ?? rowValue(book.rows, 'Route')
  const duration = badges[2] ?? rowValue(book.rows, 'Duration')
  return {
    experienceName: hero.h1.trim(),
    imageSrc,
    imageAlt,
    route: route || rowValue(book.rows, 'Route'),
    duration: duration || rowValue(book.rows, 'Duration'),
    programType,
    priceLine: hero.price.trim(),
    priceSub: hero.priceSub.trim() || undefined,
  }
}
