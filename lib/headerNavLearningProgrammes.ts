import { resolveExperienceRouteLabel } from '@/lib/experienceCardLabels'
import { formatExperienceNavPriceMetaWithPromotions } from '@/lib/formatExperiencePrice'
import { EXPERIENTIAL_LEARNING_PROGRAM_TYPE } from '@/lib/isExperientialLearningExperience'
import type { PromotionDoc } from '@/lib/promotionTypes'
import { resolveExperiencePublicHref } from '@/lib/resolveExperiencePublicHref'
import type { SiteHeaderNavExpItem } from '@/lib/resolveSiteHeaderNavData'
import type { SiteHeaderNavLearningProgrammeRow } from '@/lib/siteHeaderNavQuery'

type NavBucketItem = { it: SiteHeaderNavExpItem; sk: number; sn: string }

function learningProgrammeRouteLine(row: SiteHeaderNavLearningProgrammeRow): string {
  const route = resolveExperienceRouteLabel({
    routeLabel: row.routeRef?.shortLabel || row.routeRef?.name,
    routeSlug: row.routeRef?.slug,
  })
  const duration = row.durationDisplay?.trim()
  return [route, duration].filter(Boolean).join(' · ')
}

/** Adds active learning programmes to the Experiential Learning nav bucket. */
export function appendLearningProgrammesToNavMap(
  byProgramType: Map<string, NavBucketItem[]>,
  rows: SiteHeaderNavLearningProgrammeRow[] | null | undefined,
  promotions?: PromotionDoc[] | null,
): void {
  const programType = EXPERIENTIAL_LEARNING_PROGRAM_TYPE
  for (const row of rows ?? []) {
    const slug = row.pageSlug?.trim()
    const name = row.title?.trim()
    const id = row._id?.trim()
    if (!slug || !name || !id) continue
    const href = resolveExperiencePublicHref({ experienceLandingSlug: slug })
    if (!href) continue
    const item: SiteHeaderNavExpItem = {
      id,
      name,
      href,
      routeLine: learningProgrammeRouteLine(row),
      priceMeta: formatExperienceNavPriceMetaWithPromotions(
        {
          experienceId: id,
          routeRefId: row.routeRef?._id?.trim(),
          programType,
          price: row.price,
          priceLabel: row.priceLabel,
        },
        promotions,
      ),
      thumbUrl: row.mainImageUrl?.trim() || null,
    }
    const list = byProgramType.get(programType) ?? []
    list.push({ it: item, sk: row.headerNavOrder ?? 999, sn: name.toLowerCase() })
    byProgramType.set(programType, list)
  }
}
