import type { LodgeLocationData } from '@/data/lodgeSoqtapataStatic'

import { LodgeLocationMap } from '@/components/lodge/LodgeLocationMap'
import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'

type LodgeLocationProps = {
  data: LodgeLocationData
}

/** Location — `reference/ecotone-lodge_11.html` `#location`. */
const locationBodyStyle = {
  fontSize: 14,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.8,
  marginBottom: 20,
} as const

export function LodgeLocation({ data }: LodgeLocationProps) {
  return (
    <section className="content-section" id="location">
      <div className="content-inner">
        <LodgeSectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleStyle={{ marginBottom: 6 }}
          bodyStyle={locationBodyStyle}
        />

        <div className="map-container">
          {data.mapAccessImage?.src ? (
            <img
              className="lodge-location-map-photo"
              src={data.mapAccessImage.src}
              alt={data.mapAccessImage.alt}
              width={1200}
              height={360}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <LodgeLocationMap labels={data.mapLabels} />
          )}
        </div>

        <div className="lodge-journey-stack">
          {data.journeySteps.map((step, i) => (
            <div className={step.highlight ? 'journey-step highlight' : 'journey-step'} key={`journey-${i}`}>
              <div className="journey-time">{step.time}</div>
              <div className={step.highlight ? 'journey-step-desc journey-step-desc--emph' : 'journey-step-desc'}>
                {step.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
