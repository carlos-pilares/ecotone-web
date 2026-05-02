import type { CSSProperties } from 'react'

import type { LodgeSectionHeaderFields } from '@/data/lodgeSoqtapataStatic'

/**
 * CMS-oriented block: eyebrow + H2 + optional intro body.
 * Visual tokens: `.eyebrow`, `.h2`, and `<p>` — spacing left to callers via `titleStyle` / `bodyStyle`.
 */
export type LodgeSectionHeadingProps = LodgeSectionHeaderFields & {
  titleStyle?: CSSProperties
  bodyStyle?: CSSProperties
  titleId?: string
}

export function LodgeSectionHeading({
  eyebrow,
  title,
  body,
  titleStyle,
  bodyStyle,
  titleId,
}: LodgeSectionHeadingProps) {
  return (
    <>
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2 className="h2" id={titleId} style={titleStyle}>
        {title}
      </h2>
      {body ? <p style={bodyStyle}>{body}</p> : null}
    </>
  )
}
