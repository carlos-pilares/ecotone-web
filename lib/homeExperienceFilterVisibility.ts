/**
 * Home `#experiences` filter tab visibility (EcotoneV2Client + `[data-type]` grid items).
 *
 * Rules:
 * - `all` — all experience cards + Tailor Made band
 * - `tailor` — Tailor Made band only
 * - program keys (`nature`, `family`, `learning`, …) — matching cards only; band hidden
 */
export function isHomeExperienceFilterItemVisible(
  dataType: string,
  activeFilter: string,
): boolean {
  const filter = activeFilter.trim() || 'all'
  const type = dataType.trim()

  if (filter === 'all') return true
  if (filter === 'tailor') return type === 'tailor'
  return type === filter
}
