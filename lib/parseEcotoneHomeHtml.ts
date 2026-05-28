const EXP_MARKER = '<!-- @ECOTONE_EXPERIENCES_INJECT -->'

/**
 * Splits the standalone `ecotone-home-final.html` into CSS, body before/after the
 * experiences block, and a flag for the inject point. The experiences section is
 * rendered by `ExperiencesExplorer` in React. Inline <script> is stripped from the tail.
 */
export function parseEcotoneHomeHtml(raw: string) {
  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i)
  if (!styleMatch) {
    throw new Error('ecotone-home-final.html: missing <style>')
  }
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (!bodyMatch) {
    throw new Error('ecotone-home-final.html: missing <body>')
  }
  const bodyWithScript = bodyMatch[1].replace(/<script>[\s\S]*?<\/script>\s*$/i, '').trim()
  if (!bodyWithScript.includes(EXP_MARKER)) {
    throw new Error('ecotone-home-final.html: missing experiences inject marker')
  }
  const [beforeExperiences, afterExperiences] = bodyWithScript.split(EXP_MARKER, 2)
  return {
    css: stripLegacyHeroBgFromHomeCss(styleMatch[1]),
    beforeExperiences,
    afterExperiences,
  }
}

/**
 * Legacy `ecotone-home-final.html` baked a static Unsplash URL into `.hero-bg`.
 * React `HeroMedia` owns the background; keep layout/animation only.
 */
export function stripLegacyHeroBgFromHomeCss(css: string): string {
  return css.replace(
    /\.hero-bg\{[^}]*\}/,
    '.hero-bg{position:absolute;inset:0;transform:scale(1.06);animation:hz 28s ease-in-out infinite alternate;background:var(--brown-xdk)}',
  )
}
