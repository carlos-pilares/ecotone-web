/** Derive `whatsappNumber` / prefilled message from a `https://wa.me/…` href (seed + CMS migration). */
export function parseWaMeHref(href: string): { number: string; message?: string } {
  const u = new URL(href)
  const number = u.pathname.replace(/\D/g, '')
  if (!number) throw new Error(`[parseWaMeHref] wa.me href has no number: ${href}`)
  const text = u.searchParams.get('text')
  const message = text && text.trim() ? text : undefined
  return { number, ...(message ? { message } : {}) }
}
