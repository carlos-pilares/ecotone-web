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
  showProgramme?: boolean
  showProjects?: boolean
  showOutcomes?: boolean
  showFieldBase?: boolean
}

/**
 * Experiential Learning programme sections — replaces day-by-day itinerary on EL pages only.
 * Overview, includes, gallery, good-to-know, terms, FAQs, and booking render in the page shell.
 */
export function ExperienceLearningPageSections({
  content,
  lodge,
  showProgramme = true,
  showProjects = true,
  showOutcomes = true,
  showFieldBase = true,
}: Props) {
  return (
    <>
      {showProgramme ? (
        <ExperienceLearningProgrammeTabs
          programmeFlow={content.programmeFlow}
          typicalDay={content.typicalDay}
          mentor={content.mentor}
          applicationProcess={content.applicationProcess}
          programmeSectionEyebrow={content.programmeSectionEyebrow}
          programmeSectionTitle={content.programmeSectionTitle}
          howItWorksPillTitle={content.howItWorksPillTitle}
          typicalDayPillTitle={content.typicalDayPillTitle}
          programmeFlowIntro={content.programmeFlowIntro}
          typicalDayIntro={content.typicalDayIntro}
        />
      ) : null}
      {showProjects ? <ExperienceLearningProjects projects={content.projects} /> : null}
      {showOutcomes ? <ExperienceLearningOutcomes outcomes={content.outcomes} /> : null}
      {showFieldBase && lodge.cards.length > 0 ? (
        <ExperienceLodgeSoqtapata data={lodge} sectionId="field-base" sectionClassName="exp-learning-field-base" />
      ) : null}
    </>
  )
}
