import type { LearningOutcomeIcon } from '@/lib/learningOutcomeIcons'

export type ExperienceLearningPurpose = {
  eyebrow: string
  title: string
  body: string
  highlights: string[]
}

export type ExperienceLearningFlowStep = {
  id: string
  title: string
  subtitle?: string
  body?: string
}

export type ExperienceLearningProgrammeFlowContent = {
  steps: ExperienceLearningFlowStep[]
  imageSrc: string
  imageAlt: string
  imageCaption?: string
}

export type ExperienceLearningTypicalDayRow = {
  id: string
  timeLabel: string
  title: string
  body?: string
}

export type ExperienceLearningTypicalDayContent = {
  rows: ExperienceLearningTypicalDayRow[]
  imageSrc: string
  imageAlt: string
  imageCaption?: string
  footnote?: string
}

export type ExperienceLearningProject = {
  id: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
}


export type ExperienceLearningOutcome = {
  id: string
  title: string
  description: string
  icon: LearningOutcomeIcon
}

export type ExperienceLearningFieldBaseCopy = {
  eyebrow: string
  title: string
  intro: string
}

export type ExperienceLearningContent = {
  purpose: ExperienceLearningPurpose
  programmeSectionEyebrow?: string
  programmeSectionTitle?: string
  howItWorksPillTitle?: string
  typicalDayPillTitle?: string
  programmeFlow: ExperienceLearningProgrammeFlowContent
  programmeFlowIntro?: string
  typicalDay: ExperienceLearningTypicalDayContent
  typicalDayIntro?: string
  projects: ExperienceLearningProject[]
  outcomes: ExperienceLearningOutcome[]
  fieldBase: ExperienceLearningFieldBaseCopy
}
