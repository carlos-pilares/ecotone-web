/** Row shapes from central Traveller Guide CK (GROQ). */
export type TravellerGuideQaRow = {
  _key?: string | null
  _type?: string | null
  iconKey?: string | null
  title?: string | null
  body?: string | null
  appliesToAll?: boolean | null
  experienceIds?: string[] | null
  experiences?: Array<{ _id?: string | null }> | null
}

export type TravellerGuideChecklistRow = {
  _key?: string | null
  _type?: string | null
  iconKey?: string | null
  label?: string | null
  appliesToAll?: boolean | null
  experienceIds?: string[] | null
  experiences?: Array<{ _id?: string | null }> | null
}

export type TravellerGuideRowUnion = TravellerGuideQaRow | TravellerGuideChecklistRow

export type TravellerGuideSectionCms = {
  _key?: string | null
  title?: string | null
  cardHeaderIcon?: string | null
  rowLayout?: string | null
  rows?: TravellerGuideRowUnion[] | null
}

export type TravellerGuideSettingsRow = {
  travellerGuideSections?: TravellerGuideSectionCms[] | null
} | null

/** Runtime subsection shape (matches Experience KC `travelerGuideSubsections`). */
export type TravellerGuideSubsectionResolved = {
  _key: string
  displayType: 'qa' | 'checklist'
  headerIcon: string
  title: string
  rows: Array<
    | {
        _type: 'experienceTravelerGuideChecklistRow'
        _key?: string
        iconKey?: string
        label: string
      }
    | {
        _type?: string
        _key?: string
        iconKey?: string
        title: string
        body: string
      }
  >
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

function rowAppliesToExperience(
  row: { appliesToAll?: boolean | null; experienceIds?: string[] | null; experiences?: Array<{ _id?: string | null }> | null },
  experienceId: string,
): boolean {
  if (row.appliesToAll === true) return true
  const ids = normalizeExperienceIds(row)
  return ids.some((id) => experienceIdMatches(id, experienceId))
}

function isChecklistRowType(t: string | null | undefined): boolean {
  return t === 'travellerGuideChecklistRow' || t === 'experienceTravelerGuideChecklistRow'
}

function mapRowForRuntime(
  row: TravellerGuideRowUnion,
  layout: 'qa' | 'checklist',
): TravellerGuideSubsectionResolved['rows'][number] | null {
  const key = row._key?.trim()
  if (!key) return null
  if (layout === 'checklist' || isChecklistRowType(row._type)) {
    const label = 'label' in row ? row.label?.trim() : ''
    if (!label) return null
    return {
      _type: 'experienceTravelerGuideChecklistRow',
      _key: key,
      iconKey: row.iconKey?.trim() || undefined,
      label,
    }
  }
  const title = 'title' in row ? row.title?.trim() : ''
  const body = 'body' in row ? row.body?.trim() : ''
  if (!title || !body) return null
  return {
    _key: key,
    iconKey: row.iconKey?.trim() || undefined,
    title,
    body,
  }
}

/** One central section with rows applicable to an experience; null if none. */
export function centralTravellerGuideSectionForExperience(
  section: TravellerGuideSectionCms,
  experienceId: string,
): TravellerGuideSubsectionResolved | null {
  if (!experienceId.trim()) return null
  const title = section.title?.trim() ?? ''
  if (!title) return null
  const sectionKey = section._key?.trim()
  if (!sectionKey) return null
  const layout: 'qa' | 'checklist' = section.rowLayout?.trim() === 'checklist' ? 'checklist' : 'qa'
  const rawRows = section.rows ?? []
  const rows: TravellerGuideSubsectionResolved['rows'] = []
  for (const row of rawRows) {
    if (!row || !rowAppliesToExperience(row, experienceId)) continue
    const mapped = mapRowForRuntime(row, layout)
    if (mapped) rows.push(mapped)
  }
  if (!rows.length) return null
  const rawHi = section.cardHeaderIcon?.trim()
  const headerIcon =
    rawHi === 'luggage' || rawHi === 'phone' || rawHi === 'entry' ? rawHi : 'entry'
  return {
    _key: sectionKey,
    displayType: layout,
    headerIcon,
    title,
    rows,
  }
}

/** Sections that have at least one applicable row for an experience. */
export function centralTravellerGuideSectionsForExperience(
  settings: TravellerGuideSettingsRow | null | undefined,
  experienceId: string | null | undefined,
): TravellerGuideSubsectionResolved[] {
  if (!settings?.travellerGuideSections?.length || !experienceId?.trim()) return []
  const out: TravellerGuideSubsectionResolved[] = []
  for (const section of settings.travellerGuideSections) {
    if (!section) continue
    const resolved = centralTravellerGuideSectionForExperience(section, experienceId)
    if (resolved) out.push(resolved)
  }
  return out
}

export function hasCentralTravellerGuideContent(
  settings: TravellerGuideSettingsRow | null | undefined,
): boolean {
  return Boolean(
    settings?.travellerGuideSections?.some((s) => {
      const title = s?.title?.trim()
      const rows = s?.rows?.length
      return Boolean(title && rows)
    }),
  )
}

/** @internal Legacy Experience KC subsection shape. */
export type LegacyTravellerGuideSubsection = {
  _key?: string | null
  displayType?: string | null
  headerIcon?: string | null
  title?: string | null
  rows?: unknown[] | null
}

/** Central sections when any match; otherwise legacy Experience KC subsections. */
export function mergeTravellerGuideSubsectionsSource(
  settings: TravellerGuideSettingsRow | null | undefined,
  experienceId: string | null | undefined,
  legacySubsections: LegacyTravellerGuideSubsection[] | null | undefined,
): TravellerGuideSubsectionResolved[] {
  const central = centralTravellerGuideSectionsForExperience(settings, experienceId)
  if (central.length) return central
  if (!legacySubsections?.length) return []
  const out: TravellerGuideSubsectionResolved[] = []
  for (const s of legacySubsections) {
    const key = s._key?.trim()
    const title = s.title?.trim() ?? ''
    if (!key || !title) continue
    const layout: 'qa' | 'checklist' = s.displayType?.trim() === 'checklist' ? 'checklist' : 'qa'
    const rawHi = s.headerIcon?.trim()
    const headerIcon =
      rawHi === 'luggage' || rawHi === 'phone' || rawHi === 'entry' ? rawHi : 'entry'
    const rows: TravellerGuideSubsectionResolved['rows'] = []
    for (const row of s.rows ?? []) {
      if (!row || typeof row !== 'object') continue
      const r = row as Record<string, unknown>
      const rowKey = typeof r._key === 'string' ? r._key.trim() : ''
      if (isChecklistRowType(r._type as string)) {
        const label = typeof r.label === 'string' ? r.label.trim() : ''
        if (!label) continue
        rows.push({
          _type: 'experienceTravelerGuideChecklistRow',
          _key: rowKey || undefined,
          iconKey: typeof r.iconKey === 'string' ? r.iconKey.trim() : undefined,
          label,
        })
      } else {
        const t = typeof r.title === 'string' ? r.title.trim() : ''
        const body = typeof r.body === 'string' ? r.body.trim() : ''
        if (!t || !body) continue
        rows.push({
          _key: rowKey || undefined,
          iconKey: typeof r.iconKey === 'string' ? r.iconKey.trim() : undefined,
          title: t,
          body,
        })
      }
    }
    if (!rows.length) continue
    out.push({ _key: key, displayType: layout, headerIcon, title, rows })
  }
  return out
}
