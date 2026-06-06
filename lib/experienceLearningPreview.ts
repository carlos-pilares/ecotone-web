import { EXPERIENCE_LEARNING_FALLBACK } from '@/data/experienceLearningFallback'
import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'

/** Query param: `?previewLearning=1` — dev/local only. */
export const EXPERIENCE_LEARNING_PREVIEW_PARAM = 'previewLearning'

/**
 * True when `?previewLearning=1` (or `true`) is present and `NODE_ENV === 'development'`.
 * Always false in production builds — the param is ignored.
 */
export function isExperienceLearningPreviewRequest(
  searchParams: Record<string, string | string[] | undefined> | null | undefined,
): boolean {
  if (process.env.NODE_ENV !== 'development') return false
  const raw = searchParams?.[EXPERIENCE_LEARNING_PREVIEW_PARAM]
  const value = (Array.isArray(raw) ? raw[0] : raw)?.trim().toLowerCase()
  return value === '1' || value === 'true'
}

/** Sample/fake EL section copy for local visual preview — no CMS reads. */
export function getExperienceLearningPreviewContent(): ExperienceLearningContent {
  return EXPERIENCE_LEARNING_FALLBACK
}
