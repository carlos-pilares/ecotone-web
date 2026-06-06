export type FaqItemRow = {
  _key?: string | null
  title?: string | null
  body?: string | null
  appliesToAll?: boolean | null
  experienceIds?: string[] | null
  experiences?: Array<{ _id?: string | null }> | null
  learningProgrammeIds?: string[] | null
  learningProgrammes?: Array<{ _id?: string | null }> | null
}

export type FaqsSettingsRow = {
  faqItems?: FaqItemRow[] | null
} | null

export type CentralFaq = {
  _key: string
  title: string
  body: string
}

export type MergedFaqRow = {
  _key: string
  question: string
  answer: string
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

function faqAppliesToExperience(item: FaqItemRow, experienceId: string): boolean {
  if (item.appliesToAll === true) return true
  const ids = normalizeExperienceIds(item)
  return ids.some((id) => experienceIdMatches(id, experienceId))
}

/** FAQs from central CK applicable to an experience (global + assigned). */
export function centralFaqsForExperience(
  settings: FaqsSettingsRow | null | undefined,
  experienceId: string | null | undefined,
): CentralFaq[] {
  if (!settings?.faqItems?.length || !experienceId?.trim()) return []
  const out: CentralFaq[] = []
  for (const item of settings.faqItems) {
    if (!item || !faqAppliesToExperience(item, experienceId)) continue
    const title = item.title?.trim() ?? ''
    const body = item.body?.trim() ?? ''
    if (!title || !body) continue
    const key = item._key?.trim()
    if (!key) continue
    out.push({ _key: key, title, body })
  }
  return out
}

export function hasCentralFaqsContent(settings: FaqsSettingsRow | null | undefined): boolean {
  return Boolean(settings?.faqItems?.some((f) => f?.title?.trim() && f?.body?.trim()))
}

/** @internal Legacy FAQ shape on Experience KC. */
export type LegacyFaqRow = {
  _key?: string | null
  question?: string | null
  answer?: string | null
}

function normalizeLearningProgrammeIds(
  row: { learningProgrammeIds?: string[] | null; learningProgrammes?: Array<{ _id?: string | null }> | null },
): string[] {
  if (row.learningProgrammeIds?.length) {
    return row.learningProgrammeIds.map((id) => id?.trim()).filter(Boolean) as string[]
  }
  if (!row.learningProgrammes?.length) return []
  return row.learningProgrammes.map((e) => e?._id?.trim()).filter(Boolean) as string[]
}

function faqAppliesToLearningProgramme(item: FaqItemRow, programmeId: string): boolean {
  if (item.appliesToAll === true) return true
  const ids = normalizeLearningProgrammeIds(item)
  return ids.some((id) => experienceIdMatches(id, programmeId))
}

/** FAQs from central CK applicable to a learning programme (global + assigned). */
export function centralFaqsForLearningProgramme(
  settings: FaqsSettingsRow | null | undefined,
  programmeId: string | null | undefined,
): CentralFaq[] {
  if (!settings?.faqItems?.length || !programmeId?.trim()) return []
  const out: CentralFaq[] = []
  for (const item of settings.faqItems) {
    if (!item || !faqAppliesToLearningProgramme(item, programmeId)) continue
    const title = item.title?.trim() ?? ''
    const body = item.body?.trim() ?? ''
    if (!title || !body) continue
    const key = item._key?.trim()
    if (!key) continue
    out.push({ _key: key, title, body })
  }
  return out
}

/** Central FAQs when present; otherwise legacy Experience KC `faqs`. */
export function mergeFaqsSource(
  settings: FaqsSettingsRow | null | undefined,
  experienceId: string | null | undefined,
  legacyFaqs: LegacyFaqRow[] | null | undefined,
): MergedFaqRow[] {
  const central = centralFaqsForExperience(settings, experienceId)
  if (central.length) {
    return central.map((f) => ({
      _key: f._key,
      question: f.title,
      answer: f.body,
    }))
  }
  if (!legacyFaqs?.length) return []
  const out: MergedFaqRow[] = []
  for (const f of legacyFaqs) {
    const question = f.question?.trim() ?? ''
    const answer = f.answer?.trim() ?? ''
    const key = f._key?.trim()
    if (!question || !answer || !key) continue
    out.push({ _key: key, question, answer })
  }
  return out
}
