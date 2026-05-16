/** Keep in sync with `lib/experienceKcStringListKeys.ts` (Studio cannot import TS from app lib). */
export const INCLUDE_LIST_KEY_PREFIX = 'include'
export const NOT_INCLUDE_LIST_KEY_PREFIX = 'not-include'
export const HIGHLIGHT_LIST_KEY_PREFIX = 'highlight'

export function includeListKeyAt(index) {
  return `${INCLUDE_LIST_KEY_PREFIX}-${index}`
}

export function notIncludeListKeyAt(index) {
  return `${NOT_INCLUDE_LIST_KEY_PREFIX}-${index}`
}

export function highlightListKeyAt(index) {
  return `${HIGHLIGHT_LIST_KEY_PREFIX}-${index}`
}
