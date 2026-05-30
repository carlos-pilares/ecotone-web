import type { ExperiencePromotionTarget, PromotionDoc } from '@/lib/promotionTypes'

const PROGRAM_ALIASES: Record<string, string> = {
  'classic-nature': 'nature-core',
  'nature-core': 'nature-core',
  'signature-expeditions': 'family-adventure',
  'family-adventure': 'family-adventure',
  'experiential-learning': 'experiential-learning',
  'tailor-made': 'tailor-made',
}

export function normalizeProgramType(raw: string | null | undefined): string | null {
  const t = raw?.trim().toLowerCase()
  if (!t) return null
  return PROGRAM_ALIASES[t] ?? t
}

export function isPromotionWithinSchedule(
  promo: Pick<PromotionDoc, 'startDate' | 'endDate'>,
  now: Date = new Date(),
): boolean {
  const ts = now.getTime()
  if (promo.startDate) {
    const start = new Date(promo.startDate).getTime()
    if (!Number.isNaN(start) && ts < start) return false
  }
  if (promo.endDate) {
    const end = new Date(promo.endDate).getTime()
    if (!Number.isNaN(end) && ts > end) return false
  }
  return true
}

export function isPromotionActive(promo: PromotionDoc, now: Date = new Date()): boolean {
  return promo.enabled === true && isPromotionWithinSchedule(promo, now)
}

function refIds(refs: PromotionDoc['routes'] | PromotionDoc['experiences']): Set<string> {
  const out = new Set<string>()
  for (const r of refs ?? []) {
    const id = r?._ref?.trim() || r?._id?.trim()
    if (id) out.add(id)
  }
  return out
}

export function experienceMatchesPromotion(
  target: ExperiencePromotionTarget,
  promo: PromotionDoc,
): boolean {
  if (promo.appliesToAll === true) return true

  const expId = target.experienceId?.trim()
  const expRefs = refIds(promo.experiences)
  if (expId && expRefs.has(expId)) return true

  const routeRefId = target.routeRefId?.trim()
  const routeRefs = refIds(promo.routes)
  if (routeRefId && routeRefs.has(routeRefId)) return true

  const program = normalizeProgramType(target.programType)
  const programTypes = (promo.programTypes ?? [])
    .map((p) => normalizeProgramType(p))
    .filter(Boolean) as string[]
  if (program && programTypes.includes(program)) return true

  return false
}

export function selectBestPromotionForExperience(
  target: ExperiencePromotionTarget,
  promotions: PromotionDoc[] | null | undefined,
  now: Date = new Date(),
): PromotionDoc | null {
  if (!promotions?.length) return null
  let best: PromotionDoc | null = null
  let bestPriority = -Infinity

  for (const promo of promotions) {
    if (!isPromotionActive(promo, now)) continue
    if (!experienceMatchesPromotion(target, promo)) continue
    const p = typeof promo.priority === 'number' && Number.isFinite(promo.priority) ? promo.priority : 0
    if (p > bestPriority) {
      best = promo
      bestPriority = p
    }
  }

  return best
}

/** All active promotions matching an experience, highest priority first. */
export function selectMatchingPromotionsForExperience(
  target: ExperiencePromotionTarget,
  promotions: PromotionDoc[] | null | undefined,
  now: Date = new Date(),
): PromotionDoc[] {
  if (!promotions?.length) return []
  const matched: PromotionDoc[] = []
  for (const promo of promotions) {
    if (!isPromotionActive(promo, now)) continue
    if (!experienceMatchesPromotion(target, promo)) continue
    matched.push(promo)
  }
  matched.sort((a, b) => {
    const pa = typeof a.priority === 'number' && Number.isFinite(a.priority) ? a.priority : 0
    const pb = typeof b.priority === 'number' && Number.isFinite(b.priority) ? b.priority : 0
    return pb - pa
  })
  return matched
}

export function announcementMatchesPage(
  showOnPages: string | null | undefined,
  pathname: string,
): boolean {
  const scope = showOnPages?.trim() || 'all'
  if (scope === 'all') return true
  const path = pathname.split('?')[0] || '/'

  switch (scope) {
    case 'home':
      return path === '/'
    case 'experiences':
      return path === '/experiences' || path.startsWith('/experiences/')
    case 'routes':
      return path === '/routes' || path.startsWith('/routes/')
    case 'lodges':
      return path === '/lodges' || path.startsWith('/lodges/')
    case 'about':
      return path === '/about' || path.startsWith('/about/')
    case 'journal':
      return path === '/journal' || path.startsWith('/journal/')
    default:
      return true
  }
}
