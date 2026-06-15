/**
 * Section keys for Experiential Learning experience pages (`experiencePage.sectionModules`).
 * Content lives on the linked Learning Programme KC; these keys control visibility and optional copy overrides.
 */
export const LEARNING_PROGRAMME_MODULE_LIST = [
  {value: 'programme', title: 'Programme (how it works / typical day / mentor / application)'},
  {value: 'projects', title: 'Projects you can join'},
  {value: 'learningOutcomes', title: 'Learning outcomes'},
  {value: 'fieldBase', title: 'Field base / lodge'},
]

export const LEARNING_PROGRAMME_MODULE_KEY_SET = new Set(LEARNING_PROGRAMME_MODULE_LIST.map((m) => m.value))

export function isLearningProgrammeModuleKey(key) {
  return Boolean(key && LEARNING_PROGRAMME_MODULE_KEY_SET.has(key))
}
