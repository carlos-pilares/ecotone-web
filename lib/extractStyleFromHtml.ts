/** Returns the first `<style>...</style>` block as a string, or an empty string. */
export function extractFirstStyleFromHtml(raw: string): string {
  const m = raw.match(/<style>([\s\S]*?)<\/style>/i)
  return m?.[1] ?? ''
}
