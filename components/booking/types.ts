export type ExperienceBookingSummary = {
  experienceName: string
  imageSrc: string
  imageAlt?: string
  route: string
  duration: string
  programType: string
  priceLine: string
  priceSub?: string
}

export type PlanJourneyDraft = {
  fullName: string
  travellerType: string | null
  season: string | null
  partySize: string
}
