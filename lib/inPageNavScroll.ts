/** Shared scroll-spy helpers for lodge + experience in-page nav (no CMS imports). */

/** Extra pixels below the spy line so the target section counts as “passed” after hash scroll (rounding / subpixel). */
export const IN_PAGE_NAV_SPY_SLOP = 20

export type InPageNavScrollLink = {
  href: string
  dataActiveWhen?: string
}

export function normalizeHashHref(href: string): string {
  if (!href.startsWith('#')) return href
  return `#${decodeURIComponent(href.slice(1))}`
}

export function collectScrollIdsOrdered(links: InPageNavScrollLink[]): string[] {
  const idSet = new Set<string>()
  const orderFirst: string[] = []
  for (const l of links) {
    if (l.href.startsWith('#')) {
      const id = decodeURIComponent(l.href.slice(1))
      if (id && !idSet.has(id)) {
        idSet.add(id)
        orderFirst.push(id)
      }
    }
    if (l.dataActiveWhen) {
      for (const p of l.dataActiveWhen.split(',')) {
        const id = p.trim()
        if (id && !idSet.has(id)) {
          idSet.add(id)
          orderFirst.push(id)
        }
      }
    }
  }
  const present = orderFirst.filter((id) => document.getElementById(id))
  return present.sort((a, b) => {
    const ea = document.getElementById(a)
    const eb = document.getElementById(b)
    if (!ea || !eb) return 0
    return ea.getBoundingClientRect().top + window.scrollY - (eb.getBoundingClientRect().top + window.scrollY)
  })
}

export function resolveActiveHrefFromScrollId(
  scrollId: string,
  links: InPageNavScrollLink[],
): string {
  for (const l of links) {
    const hid = l.href.startsWith('#') ? decodeURIComponent(l.href.slice(1)) : ''
    if (hid === scrollId) return l.href
    const when = l.dataActiveWhen?.split(',').map((s) => s.trim()) ?? []
    if (when.includes(scrollId)) return l.href
  }
  return links[0]?.href ?? '#'
}

/** Map `location.hash` id to nav `href` (includes `dataActiveWhen` aliases, e.g. `reviews` → Good to know). */
export function activeHrefFromHash(
  hash: string,
  links: InPageNavScrollLink[],
): string | null {
  if (!hash || hash.length < 2) return null
  const id = decodeURIComponent(hash.slice(1))
  if (!id) return null
  return resolveActiveHrefFromScrollId(id, links)
}

function readScrollSpyLinePx(
  pageNav: HTMLElement | null,
  opts: {
    anchorGap: number
    effectiveMainNavH: () => number
    pastHeroBodyClass: string
  },
): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset').trim()
  const parsed = parseInt(raw, 10)
  if (Number.isFinite(parsed) && parsed > 0) return parsed
  const past = document.body.classList.contains(opts.pastHeroBodyClass)
  const mainOff = past ? 0 : opts.effectiveMainNavH()
  const h = pageNav ? pageNav.getBoundingClientRect().height : 0
  return mainOff + h + opts.anchorGap
}

export function computeActiveHrefFromScroll(
  links: InPageNavScrollLink[],
  opts: {
    pageNav: HTMLElement | null
    anchorGap: number
    effectiveMainNavH: () => number
    pastHeroBodyClass: string
    /** Extra tolerance below spy line (default `IN_PAGE_NAV_SPY_SLOP`). */
    spySlop?: number
  },
): string {
  const ids = collectScrollIdsOrdered(links)
  if (ids.length === 0 || !opts.pageNav) return links[0]?.href ?? '#'
  const line = readScrollSpyLinePx(opts.pageNav, opts)
  const slop = opts.spySlop ?? IN_PAGE_NAV_SPY_SLOP
  const threshold = line + slop
  let currentId = ids[0]!
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= threshold) currentId = id
  }
  return resolveActiveHrefFromScrollId(currentId, links)
}
