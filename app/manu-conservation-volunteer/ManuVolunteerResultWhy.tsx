import { WonderJourneyCardImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

import { ManuVolunteerMobileCardRail } from './ManuVolunteerMobileCardRail'
import { MCV_WHY_PILLARS } from './manu-volunteer-images'

const PILLAR_DETAILS: Record<(typeof MCV_WHY_PILLARS)[number]['term'], string> = {
  Stay:
    'Live at a conservation-linked field station, surrounded by the rainforest and the people working to protect it.',
  Contribute:
    'Join real field activities and support the biodiversity monitoring and conservation work happening on the ground.',
  Learn:
    'Build practical field knowledge by learning alongside researchers, local teams and conservation practitioners.',
}

export function ManuVolunteerResultWhy() {
  return (
    <section className="mcv-result-why mcv-section mcv-section--warm" aria-labelledby="mcv-result-why-title">
      <div className="mcv-container">
        <header className="mcv-result-why-head">
          <p className="mcv-section-kicker">Why Ecotone</p>
          <h2 id="mcv-result-why-title" className="mcv-section-title">
            More than a volunteering placement
          </h2>
          <p className="mcv-section-body mcv-result-why-intro">
            Spend four weeks living close to the conservation work protecting Manu, sharing field
            days, learning from the people behind the research, and experiencing the rainforest as
            part of the team.
          </p>
        </header>
      </div>

      <div className="mcv-result-why-rail">
        <div className="mcv-container">
          <ManuVolunteerMobileCardRail
            controlsLabel="Why Ecotone"
            listClassName="mcv-result-why-grid"
            listAriaLabel="Stay, Contribute, and Learn"
            titleClassName="mcv-fieldwork-title mcv-result-why-term"
            bodyClassName="mcv-fieldwork-caption mcv-result-why-detail"
            items={MCV_WHY_PILLARS.map((image) => ({
              key: image.term,
              title: image.term,
              description: PILLAR_DETAILS[image.term],
              image: (
                <WonderJourneyCardImage
                  image={image}
                  className="mcv-fieldwork-img"
                  sizes="(min-width: 900px) 30vw, 85vw"
                />
              ),
            }))}
          />
        </div>
      </div>
    </section>
  )
}
