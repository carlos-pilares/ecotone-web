'use client'

import { useEffect } from 'react'

/**
 * Renders the standalone experience `body` HTML and executes the source inline script once
 * (nav scroll, sticky bar, hamburger, accordions, quote rotation, etc.).
 */
export function EcotoneExperienceStaticClient({ bodyHtml, script }: { bodyHtml: string; script: string }) {
  useEffect(() => {
    if (!script) return
    const el = document.createElement('script')
    el.setAttribute('data-ecotone-experience-inline', '1')
    el.textContent = script
    document.body.appendChild(el)
    return () => {
      el.remove()
    }
  }, [script])

  return (
    // eslint-disable-next-line react/no-danger
    <div id="ecotone-experience-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
  )
}
