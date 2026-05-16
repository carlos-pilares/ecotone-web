import type { SoqtapataPhase1Stat } from '@/data/soqtapataExperienceLocal'
import { formatLodgeAltitudeForSubtitle } from '@/lib/lodgeAltitudeDisplay'

export const SNAPSHOT_BAR_SLOT_ORDER = [
  'duration',
  'distanceFromCusco',
  'altitude',
  'groupSize',
  'inclusive',
  'ecosystem',
] as const

export type SnapshotBarSlot = (typeof SNAPSHOT_BAR_SLOT_ORDER)[number]

const SNAPSHOT_BAR_LABELS: Record<SnapshotBarSlot, string> = {
  duration: 'Duration',
  distanceFromCusco: 'From Cusco',
  altitude: 'Altitude',
  groupSize: 'Group size',
  inclusive: 'Inclusive',
  ecosystem: 'Ecosystem',
}

type ExperienceStatSource = {
  duration?: string | null
  distanceFromCusco?: string | null
  altitude?: string | null
  groupSizeMax?: number | null
  ecosystem?: string | null
}

/** Resolve one stats-bar cell from Experience KC fields (matches Studio `snapshotBarShared`). */
export function resolveSnapshotStatForExperience(
  experience: ExperienceStatSource | null | undefined,
  slot: string,
): SoqtapataPhase1Stat | null {
  if (!experience || !slot) return null
  switch (slot) {
    case 'duration': {
      const n = experience.duration?.trim()
      if (!n) return null
      return { n, l: SNAPSHOT_BAR_LABELS.duration }
    }
    case 'distanceFromCusco': {
      const n = experience.distanceFromCusco?.trim()
      if (!n) return null
      return { n, l: SNAPSHOT_BAR_LABELS.distanceFromCusco }
    }
    case 'altitude': {
      const n = formatLodgeAltitudeForSubtitle(experience.altitude) ?? experience.altitude?.trim()
      if (!n) return null
      return { n, l: SNAPSHOT_BAR_LABELS.altitude }
    }
    case 'groupSize': {
      const max = experience.groupSizeMax
      if (max == null) return null
      return { n: `Max ${max}`, l: SNAPSHOT_BAR_LABELS.groupSize }
    }
    case 'inclusive':
      return { n: 'All-in', l: SNAPSHOT_BAR_LABELS.inclusive }
    case 'ecosystem': {
      const n = experience.ecosystem?.trim()
      if (!n) return null
      return { n, l: SNAPSHOT_BAR_LABELS.ecosystem }
    }
    default:
      return null
  }
}

export type SnapshotStatSelectionRow = {
  slot?: string | null
  visible?: boolean | null
}

/**
 * Page CMS stats bar: selected visible slots only, in order.
 * Empty selection → all canonical KC slots in default order.
 */
export function buildStatsBarFromPageCms(
  experience: ExperienceStatSource,
  selections: SnapshotStatSelectionRow[] | null | undefined,
  localFallback: SoqtapataPhase1Stat[],
): SoqtapataPhase1Stat[] {
  const visiblePicks = (selections ?? []).filter((s) => s?.visible !== false && s?.slot?.trim())
  const slots =
    visiblePicks.length > 0
      ? visiblePicks.map((s) => String(s.slot).trim())
      : [...SNAPSHOT_BAR_SLOT_ORDER]

  const out: SoqtapataPhase1Stat[] = []
  for (const slot of slots) {
    const cell = resolveSnapshotStatForExperience(experience, slot)
    if (cell) out.push(cell)
  }
  return out.length > 0 ? out : localFallback
}
