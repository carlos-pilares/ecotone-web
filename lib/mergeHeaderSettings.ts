import {
  HEADER_NAV_ABOUT_SMART_LINK,
  HEADER_NAV_BOOK_NOW_SMART_LINK,
  HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT,
  HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK,
  HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT,
  HEADER_NAV_LODGES_SEE_ALL_BLOCK,
  HEADER_NAV_ROUTES_SMART_LINK,
  HEADER_NAV_TAILOR_MADE,
} from '@/data/cmsApproved/siteSettingsApprovedContent'
import type { HeaderNavTabRow } from '@/lib/headerNavTabsAdapter'
import type {
  HeaderNavExperienceGroupOverrideRow,
  HeaderNavProgramGroupRow,
  HeaderNavSeeAllRow,
  SiteHeaderNavSettingsRow,
} from '@/lib/siteHeaderNavQuery'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

/** Raw `headerSettings` singleton from Sanity. */
export type HeaderSettingsDocumentRow = {
  _id?: string
  headerLogoPrimary?: unknown
  headerLogoLight?: unknown
  headerLogoDark?: unknown
  homePath?: string | null
  mobileMenuAriaLabel?: string | null
  experiencesShowInHeader?: boolean | null
  experiencesLabel?: string | null
  experiencesSmartLink?: SmartLinkGroq | null
  experiencesSideMenuTitle?: string | null
  programGroups?: Array<{
    programType?: string | null
    label?: string | null
    showInMenu?: boolean | null
    order?: number | null
    eyebrow?: string | null
    title?: string | null
    subtitle?: string | null
    body?: string | null
    ctaLabel?: string | null
    ctaSmartLink?: SmartLinkGroq | null
    image?: unknown
    imageAlt?: string | null
    imageUrl?: string | null
  }> | null
  experiencesSeeAll?: HeaderNavSeeAllRow | null
  lodgesShowInHeader?: boolean | null
  lodgesLabel?: string | null
  lodgesSmartLink?: SmartLinkGroq | null
  lodgesSideMenuTitle?: string | null
  routeGroupOverrides?: Array<{
    route?: { _ref?: string; slug?: string | null; shortLabel?: string | null; name?: string | null } | null
    labelOverride?: string | null
    showInMenu?: boolean | null
    order?: number | null
  }> | null
  lodgesSeeAll?: HeaderNavSeeAllRow | null
  routesShowInHeader?: boolean | null
  routesLabel?: string | null
  routesSmartLink?: SmartLinkGroq | null
  aboutShowInHeader?: boolean | null
  aboutLabel?: string | null
  aboutSmartLink?: SmartLinkGroq | null
  blogShowInHeader?: boolean | null
  blogLabel?: string | null
  blogSmartLink?: SmartLinkGroq | null
  mainCtaShowInHeader?: boolean | null
  mainCtaLabel?: string | null
  mainCtaSmartLink?: SmartLinkGroq | null
  navTabs?: HeaderNavTabRow[] | null
} | null

/** Legacy `siteSettings.header` nested object. */
export type LegacySiteSettingsHeaderRow = {
  headerLogoFullHorizontal?: unknown
  headerLogoLight?: unknown
  headerLogoDark?: unknown
  homePath?: string | null
  mobileMenuAriaLabel?: string | null
  routesEnabled?: boolean | null
  routesLabel?: string | null
  routesLinkSmartLink?: SmartLinkGroq | null
  aboutEnabled?: boolean | null
  aboutLabel?: string | null
  aboutLinkSmartLink?: SmartLinkGroq | null
  experiencesEnabled?: boolean | null
  experiencesLabel?: string | null
  experiencesGroupOverrides?: HeaderNavExperienceGroupOverrideRow[] | null
  experiencesItemOverrides?: SiteHeaderNavSettingsRow['experiencesItemOverrides']
  experiencesTailorMenu?: SiteHeaderNavSettingsRow['experiencesTailorMenu']
  experiencesGroups?: SiteHeaderNavSettingsRow['experiencesGroups']
  experiencesSeeAll?: HeaderNavSeeAllRow | null
  lodgesEnabled?: boolean | null
  lodgesLabel?: string | null
  lodgesItemOverrides?: SiteHeaderNavSettingsRow['lodgesItemOverrides']
  lodgeGroups?: SiteHeaderNavSettingsRow['lodgeGroups']
  lodgesSeeAll?: HeaderNavSeeAllRow | null
  navBookNowSmartLink?: SmartLinkGroq | null
  primaryCta?: { label?: string; href?: string; openInNewTab?: boolean } | null
  navTailorMadeTitle?: string | null
  navTailorMadeSubtitle?: string | null
  navTailorMadeBody?: string | null
  navTailorMadeSmartLink?: SmartLinkGroq | null
  navExperiencesSeeAllSmartLink?: SmartLinkGroq | null
  navLodgesSeeAllSmartLink?: SmartLinkGroq | null
  mainNav?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
} | null

export type MergedHeaderShellRow = {
  headerLogoLight: unknown
  headerLogoDark: unknown
  homePath: string | null
  mobileMenuAriaLabel: string | null
  navBookNowSmartLink: SmartLinkGroq | null
  primaryCta: { label?: string; href?: string; openInNewTab?: boolean } | null
}

type ProgramTypeKey = 'nature-core' | 'family-adventure' | 'experiential-learning' | 'tailor-made'

const LEGACY_BUCKET_TO_PROGRAM: Record<string, ProgramTypeKey> = {
  classic: 'nature-core',
  signature: 'family-adventure',
  learning: 'experiential-learning',
}

const PROGRAM_DEFAULT_LABELS: Record<Exclude<ProgramTypeKey, 'tailor-made'>, string> = {
  'nature-core': HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.classicNature.label,
  'family-adventure': HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.signatureExpeditions.label,
  'experiential-learning': HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT.experientialLearning.label,
}

/** Published `headerSettings` document exists (not merely an empty fetch). */
export function hasHeaderSettingsDoc(next: HeaderSettingsDocumentRow | undefined | null): boolean {
  return Boolean(next && typeof next === 'object' && typeof next._id === 'string' && next._id.length > 0)
}

function pickLegacy<T>(next: T | null | undefined, legacy: T | null | undefined): T | null | undefined {
  if (next !== undefined && next !== null) return next
  return legacy
}

function legacyGroupOverridesFromNested(
  legacy: LegacySiteSettingsHeaderRow | null | undefined,
): HeaderNavExperienceGroupOverrideRow[] {
  const overrides = legacy?.experiencesGroupOverrides ?? []
  if (overrides.length) return overrides
  const g = legacy?.experiencesGroups
  if (!g) return []
  const out: HeaderNavExperienceGroupOverrideRow[] = []
  const map: Array<{ key: 'classic' | 'signature' | 'learning'; row: HeaderNavProgramGroupRow | null | undefined }> = [
    { key: 'classic', row: g.classicNature },
    { key: 'signature', row: g.signatureExpeditions },
    { key: 'learning', row: g.experientialLearning },
  ]
  for (const { key, row } of map) {
    if (!row) continue
    out.push({
      groupKey: key,
      labelOverride: row.label,
      showInMenu: row.enabled,
      order: row.order,
    })
  }
  return out
}

function programGroupsFromLegacy(legacy: LegacySiteSettingsHeaderRow | null | undefined) {
  const overrides = legacyGroupOverridesFromNested(legacy)
  const g = legacy?.experiencesGroups
  const types: Array<Exclude<ProgramTypeKey, 'tailor-made'>> = [
    'nature-core',
    'family-adventure',
    'experiential-learning',
  ]
  return types.map((programType, i) => {
    const bucket = Object.entries(LEGACY_BUCKET_TO_PROGRAM).find(([, p]) => p === programType)?.[0]
    const ov = overrides.find((r) => r.groupKey?.trim().toLowerCase() === bucket)
    const lk =
      programType === 'nature-core'
        ? 'classicNature'
        : programType === 'family-adventure'
          ? 'signatureExpeditions'
          : 'experientialLearning'
    const nested = g?.[lk]
    return {
      programType,
      label: ov?.labelOverride?.trim() || nested?.label?.trim() || PROGRAM_DEFAULT_LABELS[programType],
      showInMenu: ov?.showInMenu !== false && nested?.enabled !== false,
      order: ov?.order ?? nested?.order ?? i,
    }
  })
}

function tailorProgramGroupFromLegacy(
  legacy: LegacySiteSettingsHeaderRow | null | undefined,
): NonNullable<HeaderSettingsDocumentRow>['programGroups'] extends (infer U)[] | null | undefined ? U : never {
  const t = legacy?.experiencesTailorMenu
  const g = legacy?.experiencesGroups?.tailorMade
  return {
    programType: 'tailor-made',
    label: t?.label?.trim() || g?.label?.trim() || HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT.label,
    showInMenu: t?.enabled !== false && g?.enabled !== false,
    order: g?.order ?? 99,
    eyebrow: HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT.label,
    title: legacy?.navTailorMadeTitle?.trim() || HEADER_NAV_TAILOR_MADE.title,
    subtitle: legacy?.navTailorMadeSubtitle?.trim() || HEADER_NAV_TAILOR_MADE.subtitle,
    body: legacy?.navTailorMadeBody?.trim() || HEADER_NAV_TAILOR_MADE.body,
    ctaLabel: HEADER_NAV_TAILOR_MADE.smartLink.label,
    ctaSmartLink: legacy?.navTailorMadeSmartLink ?? HEADER_NAV_TAILOR_MADE.smartLink,
    imageUrl: null,
    imageAlt: null,
  }
}

/**
 * Merge Header settings + legacy siteSettings.header into resolver input.
 * When `headerSettings` exists, its values win — no legacy labels, groups, or overrides.
 */
export function mergeHeaderNavSettings(
  next: HeaderSettingsDocumentRow | null | undefined,
  legacy: LegacySiteSettingsHeaderRow | null | undefined,
): SiteHeaderNavSettingsRow & {
  usesHeaderSettings: boolean
  experiencesSideMenuTitle: string
  lodgesSideMenuTitle: string
  programGroups: NonNullable<HeaderSettingsDocumentRow>['programGroups']
  blogEnabled?: boolean | null
  blogLabel?: string | null
  blogLinkSmartLink?: SmartLinkGroq | null
} {
  const useNext = hasHeaderSettingsDoc(next)

  if (useNext) {
    return {
      usesHeaderSettings: true,
      routesEnabled: next!.routesShowInHeader,
      routesLabel: next!.routesLabel,
      routesLinkSmartLink: next!.routesSmartLink,
      aboutEnabled: next!.aboutShowInHeader,
      aboutLabel: next!.aboutLabel,
      aboutLinkSmartLink: next!.aboutSmartLink,
      blogEnabled: next!.blogShowInHeader,
      blogLabel: next!.blogLabel,
      blogLinkSmartLink: next!.blogSmartLink,
      experiencesEnabled: next!.experiencesShowInHeader,
      experiencesLabel: next!.experiencesLabel,
      experiencesGroupOverrides: [],
      experiencesItemOverrides: [],
      experiencesTailorMenu: null,
      experiencesGroups: null,
      experiencesSeeAll: next!.experiencesSeeAll ?? null,
      lodgesEnabled: next!.lodgesShowInHeader,
      lodgesLabel: next!.lodgesLabel,
      lodgesItemOverrides: [],
      lodgeGroups: null,
      lodgesSeeAll: next!.lodgesSeeAll ?? null,
      navTailorMadeTitle: null,
      navTailorMadeSubtitle: null,
      navTailorMadeBody: null,
      navTailorMadeSmartLink: null,
      navExperiencesSeeAllSmartLink: null,
      navLodgesSeeAllSmartLink: null,
      experiencesSideMenuTitle: next!.experiencesSideMenuTitle?.trim() ?? '',
      lodgesSideMenuTitle: next!.lodgesSideMenuTitle?.trim() ?? '',
      programGroups: next!.programGroups ?? [],
      routeGroupOverrides: next!.routeGroupOverrides ?? [],
    }
  }

  const legacyGroups = programGroupsFromLegacy(legacy)
  const tailorRow = tailorProgramGroupFromLegacy(legacy)
  const programGroups = [...legacyGroups, tailorRow]

  return {
    usesHeaderSettings: false,
    routesEnabled: pickLegacy(next?.routesShowInHeader, legacy?.routesEnabled),
    routesLabel: pickLegacy(next?.routesLabel, legacy?.routesLabel),
    routesLinkSmartLink: pickLegacy(next?.routesSmartLink, legacy?.routesLinkSmartLink),
    aboutEnabled: pickLegacy(next?.aboutShowInHeader, legacy?.aboutEnabled),
    aboutLabel: pickLegacy(next?.aboutLabel, legacy?.aboutLabel),
    aboutLinkSmartLink: pickLegacy(next?.aboutSmartLink, legacy?.aboutLinkSmartLink),
    blogEnabled: pickLegacy(next?.blogShowInHeader, false),
    blogLabel: pickLegacy(next?.blogLabel, null),
    blogLinkSmartLink: pickLegacy(next?.blogSmartLink, null),
    experiencesEnabled: pickLegacy(next?.experiencesShowInHeader, legacy?.experiencesEnabled),
    experiencesLabel: pickLegacy(next?.experiencesLabel, legacy?.experiencesLabel),
    experiencesGroupOverrides: legacyGroupOverridesFromNested(legacy),
    experiencesItemOverrides: legacy?.experiencesItemOverrides ?? [],
    experiencesTailorMenu: legacy?.experiencesTailorMenu ?? HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT,
    experiencesGroups: legacy?.experiencesGroups ?? null,
    experiencesSeeAll: pickLegacy(next?.experiencesSeeAll, legacy?.experiencesSeeAll) ?? HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK,
    lodgesEnabled: pickLegacy(next?.lodgesShowInHeader, legacy?.lodgesEnabled),
    lodgesLabel: pickLegacy(next?.lodgesLabel, legacy?.lodgesLabel),
    lodgesItemOverrides: legacy?.lodgesItemOverrides ?? [],
    lodgeGroups: legacy?.lodgeGroups ?? null,
    lodgesSeeAll: pickLegacy(next?.lodgesSeeAll, legacy?.lodgesSeeAll) ?? HEADER_NAV_LODGES_SEE_ALL_BLOCK,
    navTailorMadeTitle: tailorRow?.title ?? legacy?.navTailorMadeTitle,
    navTailorMadeSubtitle: tailorRow?.subtitle ?? legacy?.navTailorMadeSubtitle,
    navTailorMadeBody: tailorRow?.body ?? legacy?.navTailorMadeBody,
    navTailorMadeSmartLink: tailorRow?.ctaSmartLink ?? legacy?.navTailorMadeSmartLink,
    navExperiencesSeeAllSmartLink: legacy?.navExperiencesSeeAllSmartLink,
    navLodgesSeeAllSmartLink: legacy?.navLodgesSeeAllSmartLink,
    experiencesSideMenuTitle: pickLegacy(next?.experiencesSideMenuTitle, null)?.trim() || 'PROGRAMS',
    lodgesSideMenuTitle: pickLegacy(next?.lodgesSideMenuTitle, null)?.trim() || 'BY ROUTE',
    programGroups,
    routeGroupOverrides: [],
  }
}

export function mergeHeaderShellFields(
  next: HeaderSettingsDocumentRow | null | undefined,
  legacy: LegacySiteSettingsHeaderRow | null | undefined,
): MergedHeaderShellRow {
  const useNext = hasHeaderSettingsDoc(next)
  const logoPrimary = useNext ? next?.headerLogoPrimary : legacy?.headerLogoFullHorizontal
  const logoLight = useNext ? next?.headerLogoLight : pickLegacy(next?.headerLogoLight, legacy?.headerLogoLight) ?? logoPrimary
  const logoDark = useNext ? next?.headerLogoDark : pickLegacy(next?.headerLogoDark, legacy?.headerLogoDark)
  const mainSmart = useNext
    ? next?.mainCtaSmartLink
    : pickLegacy(next?.mainCtaSmartLink, legacy?.navBookNowSmartLink) ?? HEADER_NAV_BOOK_NOW_SMART_LINK
  const mainLabel = useNext
    ? next?.mainCtaLabel?.trim() ?? ''
    : pickLegacy(next?.mainCtaLabel, legacy?.navBookNowSmartLink?.label) ?? 'Book now'

  return {
    headerLogoLight: logoLight ?? logoPrimary,
    headerLogoDark: logoDark,
    homePath: (useNext ? next?.homePath : pickLegacy(next?.homePath, legacy?.homePath))?.trim() || '/',
    mobileMenuAriaLabel:
      (useNext ? next?.mobileMenuAriaLabel : pickLegacy(next?.mobileMenuAriaLabel, legacy?.mobileMenuAriaLabel))?.trim() ||
      'Open menu',
    navBookNowSmartLink:
      useNext && mainSmart && typeof mainSmart === 'object'
        ? { ...mainSmart, label: mainSmart.label?.trim() || mainLabel }
        : useNext
          ? null
          : mainSmart && typeof mainSmart === 'object'
            ? { ...mainSmart, label: mainSmart.label?.trim() || mainLabel }
            : HEADER_NAV_BOOK_NOW_SMART_LINK,
    primaryCta: useNext ? null : legacy?.primaryCta ?? null,
  }
}

/** Default blog smart link when legacy path has no CMS link. */
export const HEADER_NAV_BLOG_SMART_LINK_DEFAULT = {
  enabled: true,
  label: 'Blog',
  linkType: 'websitePage' as const,
  internalPage: 'journal' as const,
  openInNewTab: false,
} satisfies SmartLinkGroq
