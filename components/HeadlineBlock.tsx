import type { ReactNode } from 'react'

export function HeadlineBlock({
  className = 'h2',
  text,
  fallback,
  style,
  id,
}: {
  className?: string
  text?: string | null
  fallback: ReactNode
  style?: React.CSSProperties
  /** For `aria-labelledby` on parent regions */
  id?: string
}) {
  const t = text?.trim()
  if (!t) {
    return (
      <h2 className={className} id={id}>
        {fallback}
      </h2>
    )
  }
  if (t.includes('<')) {
    // eslint-disable-next-line react/no-danger
    return <h2 className={className} style={style} id={id} dangerouslySetInnerHTML={{ __html: t }} />
  }
  const parts = t.split('\n').filter((p) => p.trim())
  if (parts.length > 1) {
    return (
      <h2 className={className} style={style} id={id}>
        {parts.map((line, i) => (
          <span key={i}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </h2>
    )
  }
  return (
    <h2 className={className} style={style} id={id}>
      {t}
    </h2>
  )
}
