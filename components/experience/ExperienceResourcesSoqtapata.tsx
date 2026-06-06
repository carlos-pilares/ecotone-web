import type { SoqtapataResources } from '@/data/soqtapataExperienceLocal'
import { ResourceCards } from '@/components/shared/ResourceCards'

export function ExperienceResourcesSoqtapata({
  data,
  experienceName,
}: {
  data: SoqtapataResources
  experienceName?: string
}) {
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
          mapPreviewTitle={data.mapPreviewTitle}
          mapPreviewSubtitle={data.mapPreviewSubtitle}
          brochurePreviewBadge={data.brochurePreviewBadge}
          experienceName={experienceName}
        />
      </div>
    </section>
  )
}
