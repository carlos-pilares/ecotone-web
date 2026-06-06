/** Controlled icon set for Learning Programme → Learning outcomes (Studio + front-end). */
export const LEARNING_OUTCOME_ICON_OPTIONS = [
  'research',
  'wildlife',
  'conservation',
  'community',
  'leadership',
  'teamwork',
  'data',
  'communication',
  'career',
  'fieldwork',
] as const

export type LearningOutcomeIcon = (typeof LEARNING_OUTCOME_ICON_OPTIONS)[number]

const LEGACY_ICON_ALIASES: Record<string, LearningOutcomeIcon> = {
  station: 'fieldwork',
}

export function normalizeLearningOutcomeIcon(value: string | null | undefined): LearningOutcomeIcon | null {
  const raw = value?.trim().toLowerCase()
  if (!raw) return null
  if ((LEARNING_OUTCOME_ICON_OPTIONS as readonly string[]).includes(raw)) {
    return raw as LearningOutcomeIcon
  }
  return LEGACY_ICON_ALIASES[raw] ?? null
}
