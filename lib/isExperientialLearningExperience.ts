import { normalizeProgramType } from '@/lib/promotionMatching'

export const EXPERIENTIAL_LEARNING_PROGRAM_TYPE = 'experiential-learning'

/** True when Experience KC `programType` is Experiential Learning. */
export function isExperientialLearningProgramType(raw: string | null | undefined): boolean {
  return normalizeProgramType(raw) === EXPERIENTIAL_LEARNING_PROGRAM_TYPE
}
