import type { SoqtapataWildlife } from '@/data/soqtapataExperienceLocal'

import { ExperienceWildlifeGrid } from '@/components/experience/ExperienceWildlifeGrid'

/** Maps local icon index to CMS `iconType` keys (placeholder watermark only). */
const ICON_TYPE_BY_ID: Record<number, string> = {
  0: 'bird',
  1: 'bear',
  2: 'cat',
  3: 'jaguar',
  4: 'bird',
  5: 'monkey',
  6: 'generic',
}

/** `section#wildlife` — editorial photo grid (parity with generic `ExperiencePage` wildlife). */
export function ExperienceWildlifeSoqtapata({ data }: { data: SoqtapataWildlife }) {
  const items = data.species.map((s) => ({
    name: s.name,
    subtitle: s.sub,
    imageUrl: s.imageSrc?.trim() || null,
    imageAlt: (s.imageAlt && s.imageAlt.trim()) || s.name,
    badge: s.badge?.trim() || null,
    iconType: ICON_TYPE_BY_ID[s.iconId] ?? 'generic',
  }))

  return (
    <section className="content-section bg-cream fade" id="wildlife">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        <p style={data.introStyle}>{data.intro}</p>
        <ExperienceWildlifeGrid items={items} />
      </div>
    </section>
  )
}
