/** Shared `--anchor-offset` + shim sync when in-page nav layout changes (drawer open/close, resize). */

import { effectiveHeaderStackH } from '@/lib/headerStackMetrics'

const ANCHOR_GAP = 8
const PAST_HERO_BODY_CLASS = 'ecotone-exp-past-hero'

export function refreshInPageNavAnchorMetrics() {
  const pageNav = document.getElementById('pageNav')
  const h = pageNav ? pageNav.getBoundingClientRect().height : 0
  const past = document.body.classList.contains(PAST_HERO_BODY_CLASS)
  const mainNav = past ? 0 : effectiveHeaderStackH()
  document.documentElement.style.setProperty('--anchor-offset', `${Math.round(mainNav + h + ANCHOR_GAP)}px`)

  const shim = document.getElementById('pnavScrollShim') as HTMLElement | null
  if (!shim) return
  if (!past) {
    shim.style.removeProperty('height')
    return
  }
  const ph = pageNav ? Math.round(pageNav.offsetHeight || pageNav.getBoundingClientRect().height) : 0
  if (ph > 0) shim.style.height = `${ph}px`
  else shim.style.removeProperty('height')
}
