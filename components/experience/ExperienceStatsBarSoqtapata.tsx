import type { SoqtapataPhase1Stat } from '@/data/soqtapataExperienceLocal'
import { SnapshotBar } from '@/components/shared/SnapshotBar'

/** Stats / snapshot — paridad con `ecotone-experience_2.html` (snapshot-bar). */
export function ExperienceStatsBarSoqtapata({ items }: { items: SoqtapataPhase1Stat[] }) {
  return (
    <SnapshotBar
      items={items.map((s) => ({
        value: s.n,
        label: s.l,
      }))}
    />
  )
}
