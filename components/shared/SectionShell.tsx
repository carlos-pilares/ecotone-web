import type { CSSProperties, ReactNode } from 'react'

export type SectionShellProps = {
  id?: string
  /** Maps to `bg-warm` / `bg-cream` on `experience-surface`; omit for plain `content-section`. */
  bgVariant?: 'warm' | 'cream'
  /** Extra classes on `<section>` (e.g. `fade`). */
  className?: string
  /** Extra classes on inner wrapper (default `content-inner`). */
  innerClassName?: string
  eyebrow?: ReactNode
  title?: ReactNode
  titleStyle?: CSSProperties
  lead?: ReactNode
  leadStyle?: CSSProperties
  /** When set, applied to the lead `<p>` (e.g. `body`). */
  leadClassName?: string
  children?: ReactNode
}

/**
 * Shared long-form section wrapper (`content-section` + `content-inner` + optional header).
 * Not wired to routes yet in Phase 1; kept API-compatible with FAQ / Resources patterns.
 */
export function SectionShell({
  id,
  bgVariant,
  className,
  innerClassName = 'content-inner',
  eyebrow,
  title,
  titleStyle,
  lead,
  leadStyle,
  leadClassName,
  children,
}: SectionShellProps) {
  const sectionClass = [
    'content-section',
    bgVariant === 'warm' ? 'bg-warm' : null,
    bgVariant === 'cream' ? 'bg-cream' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClass} id={id}>
      <div className={innerClassName}>
        {eyebrow != null && eyebrow !== '' ? <div className="eyebrow">{eyebrow}</div> : null}
        {title != null && title !== '' ? (
          <h2 className="h2" style={titleStyle}>
            {title}
          </h2>
        ) : null}
        {lead != null && lead !== '' ? (
          <p className={leadClassName} style={leadStyle}>
            {lead}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  )
}
