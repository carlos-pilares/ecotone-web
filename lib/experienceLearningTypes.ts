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

export type ExperienceLearningMentor = {
  tabLabel?: string
  name?: string
  role?: string
  photoSrc?: string
  photoAlt: string
  biography?: string
  achievements: string[]
  skills: string[]
}

export type ExperienceLearningApplicationStep = {
  id: string
  title: string
  description?: string
}

export type ExperienceLearningApplicationProcess = {
  tabLabel?: string
  intro?: string
  steps: ExperienceLearningApplicationStep[]
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
  mentor: ExperienceLearningMentor | null
  applicationProcess: ExperienceLearningApplicationProcess | null
}
