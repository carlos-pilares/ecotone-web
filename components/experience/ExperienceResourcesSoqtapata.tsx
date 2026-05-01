import type { SoqtapataResources } from '@/data/soqtapataExperienceLocal'
import { ResourceCards } from '@/components/shared/ResourceCards'

/** Placeholder copy for built-in map/brochure preview art on this route only. */
const SOQTAPATA_MAP_TITLE = 'Soqtapata'
const SOQTAPATA_MAP_SUBTITLE = '1,200 m'
const SOQTAPATA_BROCHURE_BADGE = 'Soqtapata · 3D/2N'

export function ExperienceResourcesSoqtapata({ data }: { data: SoqtapataResources }) {
  return (
    <section className="content-section bg-warm fade" id="resources">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        {data.lead ? (
          <p className="body" style={{ fontSize: 14, maxWidth: 560, marginBottom: 16, color: 'var(--n700)' }}>
            {data.lead}
          </p>
        ) : null}
        <ResourceCards
          resources={data.cards}
          mapPreviewTitle={SOQTAPATA_MAP_TITLE}
          mapPreviewSubtitle={SOQTAPATA_MAP_SUBTITLE}
          brochurePreviewBadge={SOQTAPATA_BROCHURE_BADGE}
        />
      </div>
    </section>
  )
}
