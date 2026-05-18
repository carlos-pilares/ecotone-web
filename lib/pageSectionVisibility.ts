/** Shared helpers for CMS `sectionModules[].visible` and lodge section copy visibility. */

export type PageSectionModuleRow = {
  key?: string | null
  visible?: boolean | null
}

export function isPageSectionVisible(visible?: boolean | null): boolean {
  return visible !== false
}

export function visibilityMapFromSectionModules(
  modules: PageSectionModuleRow[] | null | undefined,
): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const m of modules ?? []) {
    const key = m?.key?.trim()
    if (!key) continue
    out[key] = isPageSectionVisible(m.visible)
  }
  return out
}

export function isSectionVisibleInMap(
  map: Record<string, boolean>,
  key: string,
  defaultVisible = true,
): boolean {
  if (Object.prototype.hasOwnProperty.call(map, key)) return map[key]!
  return defaultVisible
}
