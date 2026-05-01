import type { ReactNode } from 'react'

export type SnapshotBarItem = {
  value: string
  label: string
  icon?: ReactNode
}

export type SnapshotBarProps = {
  items: SnapshotBarItem[]
}

/**
 * Stats strip under the hero (`snapshot-bar` / `snap-item`). Same markup as the former inline component.
 */
export function SnapshotBar({ items }: SnapshotBarProps) {
  return (
    <div className="snapshot-bar">
      <div className="snapshot-inner">
        {items.map((s) => (
          <div className="snap-item" key={`${s.value}-${s.label}`}>
            {s.icon ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }} aria-hidden>
                {s.icon}
              </div>
            ) : null}
            <div className="snap-n">{s.value}</div>
            <div className="snap-l">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
