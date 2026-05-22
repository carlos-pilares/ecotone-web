import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

export type TermsConditionsItemRow = {
  _key?: string | null
  title?: string | null
  text?: string | null
  appliesToAll?: boolean | null
  experienceIds?: string[] | null
  experiences?: Array<{ _id?: string | null }> | null
}

export type TermsConditionsDocumentRow = {
  _key?: string | null
  title?: string | null
  appliesToAll?: boolean | null
  pdfUrl?: string | null
  experienceIds?: string[] | null
  experiences?: Array<{ _id?: string | null }> | null
}

export type TermsConditionsSettingsRow = {
  termsItems?: TermsConditionsItemRow[] | null
  termsDocuments?: TermsConditionsDocumentRow[] | null
} | null

export type CentralTermsPanel = {
  _key: string
  title: string
  text: string
}

function normalizeExperienceIds(
  row: { experienceIds?: string[] | null; experiences?: Array<{ _id?: string | null }> | null },
): string[] {
  if (row.experienceIds?.length) {
    return row.experienceIds.map((id) => id?.trim()).filter(Boolean) as string[]
  }
  if (!row.experiences?.length) return []
  return row.experiences
    .map((e) => e?._id?.trim())
    .filter(Boolean) as string[]
}

function experienceIdMatches(storedId: string, experienceId: string): boolean {
  const a = storedId.replace(/^drafts\./, '')
  const b = experienceId.replace(/^drafts\./, '')
  return a === b
}

function termAppliesToExperience(item: TermsConditionsItemRow, experienceId: string): boolean {
  if (item.appliesToAll === true) return true
  const ids = normalizeExperienceIds(item)
  return ids.some((id) => experienceIdMatches(id, experienceId))
}

function documentAppliesToExperience(doc: TermsConditionsDocumentRow, experienceId: string): boolean {
  if (doc.appliesToAll === true) return true
  const ids = normalizeExperienceIds(doc)
  return ids.some((id) => experienceIdMatches(id, experienceId))
}

/** Terms sections from central CK applicable to an experience (global + assigned). */
export function centralTermsPanelsForExperience(
  settings: TermsConditionsSettingsRow | null | undefined,
  experienceId: string | null | undefined,
): CentralTermsPanel[] {
  if (!settings?.termsItems?.length || !experienceId?.trim()) return []
  const out: CentralTermsPanel[] = []
  for (const item of settings.termsItems) {
    if (!item || !termAppliesToExperience(item, experienceId)) continue
    const title = item.title?.trim() ?? ''
    const text = item.text?.trim() ?? ''
    if (!title || !text) continue
    const key = item._key?.trim()
    if (!key) continue
    out.push({ _key: key, title, text })
  }
  return out
}

/** Resolved Terms PDF URL: specific beats global; legacy fallback when central has no match. */
export function resolveTermsPdfUrlForExperience(
  settings: TermsConditionsSettingsRow | null | undefined,
  experienceId: string | null | undefined,
  legacyPdfUrl: string | null | undefined,
): string | null {
  const legacy = legacyPdfUrl?.trim() || null
  if (!settings?.termsDocuments?.length || !experienceId?.trim()) {
    return legacy
  }

  const docs = settings.termsDocuments.filter((d) => d?.pdfUrl?.trim())
  if (!docs.length) return legacy

  const specific = docs.find(
    (d) => d.appliesToAll !== true && documentAppliesToExperience(d, experienceId),
  )
  if (specific?.pdfUrl?.trim()) return specific.pdfUrl.trim()

  const global = docs.find((d) => d.appliesToAll === true)
  if (global?.pdfUrl?.trim()) return global.pdfUrl.trim()

  return legacy
}

export function hasCentralTermsContent(settings: TermsConditionsSettingsRow | null | undefined): boolean {
  return Boolean(
    settings?.termsItems?.length || settings?.termsDocuments?.some((d) => d?.pdfUrl?.trim()),
  )
}

/** @internal Legacy panels shape for fallback merge. */
export type LegacyTermsPanelRow = {
  _key?: string | null
  title?: string | null
  text?: string | null
}

export function mergeTermsPanelsSource(
  settings: TermsConditionsSettingsRow | null | undefined,
  experienceId: string | null | undefined,
  legacyPanels: LegacyTermsPanelRow[] | null | undefined,
): LegacyTermsPanelRow[] {
  const central = centralTermsPanelsForExperience(settings, experienceId)
  if (central.length) {
    return central.map((p) => ({ _key: p._key, title: p.title, text: p.text }))
  }
  return legacyPanels ?? []
}
