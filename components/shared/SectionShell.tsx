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
 * Header block uses `section-shell-head`; body stays in `children`. Rhythm CSS may target `.section-shell` (e.g. lodge-surface).
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

  const hasEyebrow = eyebrow != null && eyebrow !== ''
  const hasTitle = title != null && title !== ''
  const hasLead = lead != null && lead !== ''
  const hasHead = hasEyebrow || hasTitle || hasLead

  const leadClasses = ['section-shell-lead', leadClassName].filter(Boolean).join(' ')

  const shellLayout =
    !hasHead ? null : hasLead ? 'section-shell--has-lead' : 'section-shell--no-lead'

  const innerClasses = [innerClassName, 'section-shell', shellLayout].filter(Boolean).join(' ')

  return (
    <section className={sectionClass} id={id}>
      <div className={innerClasses}>
        {hasHead ? (
          <div className="section-shell-head">
            {hasEyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
            {hasTitle ? (
              <h2 className="h2" style={titleStyle}>
                {title}
              </h2>
            ) : null}
            {hasLead ? (
              <p className={leadClasses} style={leadStyle}>
                {lead}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
