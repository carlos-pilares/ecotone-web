import type { HeaderNavProgramTypeGroupRow } from '@/lib/siteHeaderNavQuery'
import type { HeaderSettingsDocumentRow } from '@/lib/mergeHeaderSettings'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

export type HeaderNavTabRow = {
  _key?: string
  label?: string | null
  showInHeader?: boolean | null
  smartLink?: SmartLinkGroq | null
  hasDropdown?: boolean | null
  dropdownType?: string | null
  showSeeAll?: boolean | null
  seeAllLabel?: string | null
  seeAllSmartLink?: SmartLinkGroq | null
  experiencesDropdown?: {
    sideMenuTitle?: string | null
    programGroups?: HeaderNavProgramTypeGroupRow[] | null
  } | null
  lodgesDropdown?: {
    sideMenuTitle?: string | null
  } | null
}

function tab(
  partial: HeaderNavTabRow & { _key: string },
): HeaderNavTabRow {
  return partial
}

/**
 * When `navTabs` is empty, build tabs from legacy flat headerSettings fields (Studio migration aid).
 */
export function adaptLegacyHeaderToNavTabs(doc: HeaderSettingsDocumentRow): HeaderNavTabRow[] {
  if (!doc) return []
  const out: HeaderNavTabRow[] = []

  const expLabel = doc.experiencesLabel?.trim()
  if (expLabel || doc.experiencesShowInHeader !== false) {
    const hasDropdown = doc.experiencesShowInHeader !== false
    out.push(
      tab({
        _key: 'legacy-experiences',
        label: expLabel || 'Experiences',
        showInHeader: true,
        smartLink: hasDropdown ? null : doc.experiencesSmartLink,
        hasDropdown,
        dropdownType: hasDropdown ? 'experiences' : 'none',
        showSeeAll: doc.experiencesSeeAll?.enabled === true,
        seeAllLabel: doc.experiencesSeeAll?.label,
        seeAllSmartLink: doc.experiencesSeeAll?.smartLink,
        experiencesDropdown: hasDropdown
          ? {
              sideMenuTitle: doc.experiencesSideMenuTitle,
              programGroups: doc.programGroups,
            }
          : null,
      }),
    )
  }

  const lodgesLabel = doc.lodgesLabel?.trim()
  if (lodgesLabel || doc.lodgesShowInHeader !== false) {
    const hasDropdown = doc.lodgesShowInHeader !== false
    out.push(
      tab({
        _key: 'legacy-lodges',
        label: lodgesLabel || 'Lodges',
        showInHeader: true,
        smartLink: hasDropdown ? null : doc.lodgesSmartLink,
        hasDropdown,
        dropdownType: hasDropdown ? 'lodges' : 'none',
        showSeeAll: doc.lodgesSeeAll?.enabled === true,
        seeAllLabel: doc.lodgesSeeAll?.label,
        seeAllSmartLink: doc.lodgesSeeAll?.smartLink,
        lodgesDropdown: hasDropdown ? { sideMenuTitle: doc.lodgesSideMenuTitle } : null,
      }),
    )
  }

  const pushSimple = (
    key: string,
    label: string | null | undefined,
    show: boolean | null | undefined,
    smart: SmartLinkGroq | null | undefined,
  ) => {
    const lab = label?.trim()
    if (!lab && show !== true) return
    out.push(
      tab({
        _key: key,
        label: lab || key,
        showInHeader: show !== false,
        smartLink: smart,
        hasDropdown: false,
        dropdownType: 'none',
        showSeeAll: false,
      }),
    )
  }

  pushSimple('legacy-routes', doc.routesLabel, doc.routesShowInHeader, doc.routesSmartLink)
  pushSimple('legacy-about', doc.aboutLabel, doc.aboutShowInHeader, doc.aboutSmartLink)
  pushSimple('legacy-blog', doc.blogLabel, doc.blogShowInHeader, doc.blogSmartLink)

  return out
}

/** Published headerSettings: only `navTabs[]` (no legacy flat-field fallback). */
export function resolveHeaderNavTabRows(doc: HeaderSettingsDocumentRow | null | undefined): HeaderNavTabRow[] {
  if (!doc) return []
  const fromTabs = doc.navTabs
  return Array.isArray(fromTabs) ? (fromTabs as HeaderNavTabRow[]) : []
}
