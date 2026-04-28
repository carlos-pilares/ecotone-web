import type { SoqtapataPhase1Stat } from '@/data/soqtapataExperienceLocal'

/** Stats / snapshot — paridad con `ecotone-experience_2.html` (snapshot-bar). */
export function ExperienceStatsBarSoqtapata({ items }: { items: SoqtapataPhase1Stat[] }) {
  return (
    <div className="snapshot-bar">
      <div className="snapshot-inner">
        {items.map((s) => (
          <div className="snap-item" key={`${s.n}-${s.l}`}>
            <div className="snap-n">{s.n}</div>
            <div className="snap-l">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
