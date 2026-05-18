import { EXPERIENCE_PROGRAM_TYPE_LABEL } from '@/lib/experienceCardLabels'
import { HOME_EXPERIENCE_PROGRAM_TO_FILTER } from '@/lib/homeExperienceCatalogLabels'
import {
  resolveTailorMadeBand,
  tailorMadeBandHasCta,
  type TailorMadeBandCmsRow,
  type TailorMadeBandResolved,
} from '@/lib/tailorMadeBand'
import type { ExperienceFromSanity, HomePageDoc } from '@/lib/queries'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import { lodgeSoqtapataExperiences } from '@/data/lodgeSoqtapataStatic'
import { DEFAULT_WHATSAPP_URL } from '@/data/cmsApproved/siteSettingsApprovedContent'

export type HomeExplorerFilterTab = {
  filterKey: string
  label: string
}

export type HomeExplorerProgramType =
  | 'all'
  | 'nature-core'
  | 'family-adventure'
  | 'experiential-learning'
  | 'tailor-made'

const DEFAULT_PROGRAM_GROUPS: Array<{ programType: HomeExplorerProgramType; label?: string }> = [
  { programType: 'all', label: 'All experiences' },
  { programType: 'nature-core' },
  { programType: 'family-adventure' },
  { programType: 'experiential-learning' },
  { programType: 'tailor-made' },
]

const HOME_TAILOR_CTA_FALLBACK = {
  ctaLabel: lodgeSoqtapataExperiences.tailor.ctaLabel,
  href: lodgeSoqtapataExperiences.tailor.href,
  openInNewTab: true as const,
}

function defaultLabel(programType: string): string {
  if (programType === 'all') return 'All experiences'
  return EXPERIENCE_PROGRAM_TYPE_LABEL[programType] ?? programType
}

function filterKeyForProgram(programType: string): string {
  return HOME_EXPERIENCE_PROGRAM_TO_FILTER[programType] ?? programType
}

function programGroupsFromHome(home: HomePageDoc | null | undefined) {
  const groups = home?.explorerProgramGroups
  if (groups && groups.length > 0) {
    return groups
      .map((g) => ({
        programType: g.programType?.trim() ?? '',
        label: g.label?.trim() ?? '',
      }))
      .filter((g) => g.programType)
  }
  const legacy = home?.explorerFilterTabs
  if (legacy && legacy.length > 0) {
    const reverse: Record<string, HomeExplorerProgramType> = {
      all: 'all',
      nature: 'nature-core',
      family: 'family-adventure',
      learning: 'experiential-learning',
      tailor: 'tailor-made',
    }
    return legacy
      .map((t) => {
        const key = t.filterKey?.trim()
        if (!key) return null
        const programType = reverse[key]
        if (!programType) return null
        return { programType, label: t.label?.trim() ?? '' }
      })
      .filter((g): g is { programType: HomeExplorerProgramType; label: string } => g != null)
  }
  return DEFAULT_PROGRAM_GROUPS.map((g) => ({
    programType: g.programType,
    label: g.label ?? '',
  }))
}

export function resolveHomeExplorerFilterTabs(
  home: HomePageDoc | null | undefined,
): HomeExplorerFilterTab[] {
  return programGroupsFromHome(home).map((g) => ({
    filterKey: filterKeyForProgram(g.programType),
    label: g.label || defaultLabel(g.programType),
  }))
}

export function homeExplorerIncludesTailorMade(home: HomePageDoc | null | undefined): boolean {
  return programGroupsFromHome(home).some((g) => g.programType === 'tailor-made')
}

function legacyHomeTailorRow(home: HomePageDoc | null | undefined): TailorMadeBandCmsRow {
  if (!home) return null
  const hasLegacy =
    home.explorerTailorWhatsappSmartLink ||
    home.explorerTailorCtaText ||
    home.explorerTailorWhatsappUrl
  if (!hasLegacy) return null
  return {
    showTailorMade: true,
    eyebrow: EXPERIENCE_PROGRAM_TYPE_LABEL['tailor-made'],
    title: 'Design your own program',
    subtitle:
      home.explorerTailorDescriptionFallback?.trim() ||
      homePageTextFields.explorerTailorDescriptionFallback,
    ctaSmartLink: home.explorerTailorWhatsappSmartLink ?? undefined,
    tailorMadeCta: home.explorerTailorWhatsappSmartLink ?? undefined,
  }
}

function homeTailorCtaFallback(home: HomePageDoc | null | undefined) {
  const wa =
    home?.explorerTailorWhatsappUrl?.trim() ||
    home?.bookingCta2Link?.trim() ||
    DEFAULT_WHATSAPP_URL
  return {
    ...HOME_TAILOR_CTA_FALLBACK,
    href: wa,
    ctaLabel: home?.explorerTailorCtaText?.trim() || HOME_TAILOR_CTA_FALLBACK.ctaLabel,
  }
}

/** Tailor Made band on Home — from `homePage.explorerTailorBand` when Tailor Made is in program groups. */
export function resolveHomeExplorerTailorBand(
  home: HomePageDoc | null | undefined,
): TailorMadeBandResolved | undefined {
  if (!homeExplorerIncludesTailorMade(home)) return undefined

  const bandRow = home?.explorerTailorBand
  if (bandRow && typeof bandRow === 'object') {
    if (bandRow.showTailorMade !== true && bandRow.enabled !== true) return undefined
    return resolveTailorMadeBand(bandRow, {
      eyebrow: '',
      title: '',
      subtitle: '',
      ctaLabel: '',
      href: '',
    }, {
      strict: true,
      ctaFallback: homeTailorCtaFallback(home),
    })
  }

  const legacy = legacyHomeTailorRow(home)
  if (!legacy) return undefined
  return resolveTailorMadeBand(
    legacy,
    {
      eyebrow: legacy.eyebrow ?? '',
      title: legacy.title ?? '',
      subtitle: typeof legacy.subtitle === 'string' ? legacy.subtitle : '',
      ctaLabel: homeTailorCtaFallback(home).ctaLabel,
      href: homeTailorCtaFallback(home).href,
      openInNewTab: true,
    },
    { ctaFallback: homeTailorCtaFallback(home) },
  )
}

export { tailorMadeBandHasCta }

/** Published experiences for the home grid (never includes tailor-made program cards). */
export function filterHomeExplorerExperiences(
  experiences: ExperienceFromSanity[] | null | undefined,
  home: HomePageDoc | null | undefined,
): ExperienceFromSanity[] {
  const groups = programGroupsFromHome(home)
  const programTypes = groups.map((g) => g.programType)

  return (experiences ?? []).filter((doc) => {
    if (doc.programType === 'tailor-made') return false
    if (programTypes.includes('all')) return true
    const filterKey = filterKeyForProgram(doc.programType ?? '')
    const allowed = new Set(
      programTypes
        .filter((t) => t !== 'tailor-made' && t !== 'all')
        .map((t) => filterKeyForProgram(t)),
    )
    return allowed.has(filterKey)
  })
}
