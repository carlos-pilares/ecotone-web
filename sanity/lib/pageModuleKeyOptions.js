import {ABOUT_PAGE_MODULE_LIST} from './aboutPageSectionModules'
import {HOME_PAGE_MODULE_LIST} from './homePageSectionModules'
import {LEARNING_PROGRAMME_MODULE_LIST} from './learningProgrammeSectionModules'
import {MODULE_LIST} from './pageModuleShared'
import {ROUTES_PAGE_MODULE_LIST} from './routesPageSectionModules'

function mergeModuleLists(...lists) {
  const seen = new Set()
  const merged = []
  for (const list of lists) {
    for (const item of list) {
      if (!item?.value || seen.has(item.value)) continue
      seen.add(item.value)
      merged.push(item)
    }
  }
  return merged
}

/**
 * All valid `pageModule.key` values across document types that share the `pageModule` object.
 * Used for Studio list validation so About/Routes/Home toggles do not fail on save.
 */
export const PAGE_MODULE_KEY_LIST = mergeModuleLists(
  MODULE_LIST,
  ABOUT_PAGE_MODULE_LIST,
  ROUTES_PAGE_MODULE_LIST,
  HOME_PAGE_MODULE_LIST,
  LEARNING_PROGRAMME_MODULE_LIST,
)

export const PAGE_MODULE_KEY_SET = new Set(PAGE_MODULE_KEY_LIST.map((m) => m.value))

export const PAGE_MODULE_KEY_DROPDOWN = PAGE_MODULE_KEY_LIST.map((m) => ({
  title: m.title,
  value: m.value,
}))

export function getPageModuleKeyLabel(key) {
  if (!key) return null
  return PAGE_MODULE_KEY_LIST.find((m) => m.value === key)?.title ?? key
}

export function isKnownPageModuleKey(key) {
  return Boolean(key && PAGE_MODULE_KEY_SET.has(key))
}
