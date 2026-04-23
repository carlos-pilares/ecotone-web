import type { ReactNode } from 'react'

export function HeadlineBlock({
  className = 'h2',
  text,
  fallback,
  style,
}: {
  className?: string
  text?: string | null
  fallback: ReactNode
  style?: React.CSSProperties
}) {
  const t = text?.trim()
  if (!t) {
    return <h2 className={className}>{fallback}</h2>
  }
  if (t.includes('<')) {
    // eslint-disable-next-line react/no-danger
    return <h2 className={className} style={style} dangerouslySetInnerHTML={{ __html: t }} />
  }
  const parts = t.split('\n').filter((p) => p.trim())
  if (parts.length > 1) {
    return (
      <h2 className={className} style={style}>
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
    <h2 className={className} style={style}>
      {t}
    </h2>
  )
}
