/**
 * Validation helpers for `termsConditionsSettings.termsDocuments`.
 */

function normalizeExperienceRefs(experiences) {
  if (!Array.isArray(experiences)) return []
  return experiences
    .map((ref) => {
      if (!ref) return ''
      if (typeof ref === 'string') return ref
      return ref._ref || ref._id || ''
    })
    .filter(Boolean)
}

/**
 * @param {Array<{appliesToAll?: boolean, experiences?: unknown[]}> | undefined} documents
 * @returns {string | true}
 */
export function validateTermsDocumentsAssignment(documents) {
  if (!Array.isArray(documents) || documents.length === 0) return true

  const globalCount = documents.filter((d) => d?.appliesToAll === true).length
  if (globalCount > 1) {
    return 'Only one global Terms PDF is allowed (one row with “Applies to all experiences” enabled).'
  }

  const seen = new Map()
  for (let i = 0; i < documents.length; i++) {
    const row = documents[i]
    if (!row || row.appliesToAll === true) continue
    const refs = normalizeExperienceRefs(row.experiences)
    for (const ref of refs) {
      if (seen.has(ref)) {
        return `Experience “${seen.get(ref)}” is assigned to more than one specific Terms PDF (rows ${seen.get(ref)} and ${i + 1}). Each experience may have only one specific PDF.`
      }
      seen.set(ref, i + 1)
    }
  }

  return true
}
