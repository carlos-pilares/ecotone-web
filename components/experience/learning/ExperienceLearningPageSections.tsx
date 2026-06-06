import type { SoqtapataLodge } from '@/data/soqtapataExperienceLocal'
import { ExperienceLodgeSoqtapata } from '@/components/experience/ExperienceLodgeSoqtapata'
import { ExperienceLearningOutcomes } from '@/components/experience/learning/ExperienceLearningOutcomes'
import { ExperienceLearningProgrammeTabs } from '@/components/experience/learning/ExperienceLearningProgrammeTabs'
import { ExperienceLearningProjects } from '@/components/experience/learning/ExperienceLearningProjects'
import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'

import '@/components/experience/learning/experience-learning.css'

type Props = {
  content: ExperienceLearningContent
  lodge: SoqtapataLodge
  showFieldBase?: boolean
  showOutcomes?: boolean
}

/**
 * Experiential Learning programme sections — replaces day-by-day itinerary on EL pages only.
 * Overview, includes, gallery, good-to-know, terms, FAQs, and booking render in the page shell.
 */
export function ExperienceLearningPageSections({
  content,
  lodge,
  showFieldBase = true,
  showOutcomes = true,
}: Props) {
  return (
    <>
      <ExperienceLearningProgrammeTabs
        programmeFlow={content.programmeFlow}
        typicalDay={content.typicalDay}
        programmeSectionEyebrow={content.programmeSectionEyebrow}
        programmeSectionTitle={content.programmeSectionTitle}
        howItWorksPillTitle={content.howItWorksPillTitle}
        typicalDayPillTitle={content.typicalDayPillTitle}
        programmeFlowIntro={content.programmeFlowIntro}
        typicalDayIntro={content.typicalDayIntro}
      />
      <ExperienceLearningProjects projects={content.projects} />
      {showOutcomes ? <ExperienceLearningOutcomes outcomes={content.outcomes} /> : null}
      {showFieldBase && lodge.cards.length > 0 ? (
        <ExperienceLodgeSoqtapata data={lodge} sectionId="field-base" sectionClassName="exp-learning-field-base" />
      ) : null}
    </>
  )
}
