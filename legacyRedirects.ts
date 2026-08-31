type LegacyRedirect = {
  source: string
  destination: string
  permanent: true
}

/**
 * Permanent legacy redirects (Next.js `permanent: true` → HTTP 308).
 * Query strings are preserved by the redirects engine.
 *
 * Rules:
 * - Every source maps directly to a final destination (no chains).
 * - Destinations must not appear as sources (no loops).
 * - Prefer the closest live section/page over `/` when no 1:1 page exists.
 */
export const legacyRedirects: LegacyRedirect[] = [
  // ── Wix / Webflow destinations (lodges) ─────────────────────────────
  {
    source: '/destinations-soqtapata',
    destination: '/lodges/soqtapata-lodge',
    permanent: true,
  },
  {
    source: '/destinations-mbl',
    destination: '/lodges/manu-bio-lodge',
    permanent: true,
  },
  {
    source: '/destinations-mlc',
    destination: '/lodges/manu-learning-centre',
    permanent: true,
  },
  {
    source: '/destinations/lodge-soqtapata',
    destination: '/lodges/soqtapata-lodge',
    permanent: true,
  },
  {
    source: '/destinations/soqtapata-lodge',
    destination: '/lodges/soqtapata-lodge',
    permanent: true,
  },
  {
    source: '/destinations/manu-bio-lodge',
    destination: '/lodges/manu-bio-lodge',
    permanent: true,
  },
  {
    source: '/destinations/manu-learning-centre',
    destination: '/lodges/manu-learning-centre',
    permanent: true,
  },
  {
    source: '/destinations/romero-rainforest-lodge',
    destination: '/lodges/romero-rainforest-lodge',
    permanent: true,
  },
  {
    source: '/destinations/wayqecha-lodge',
    destination: '/lodges/wayqecha-lodge',
    permanent: true,
  },
  // Unknown legacy destination pages → home (no lodges index route).
  { source: '/destinations', destination: '/', permanent: true },
  { source: '/destinations/:slug', destination: '/', permanent: true },

  // ── Wix / Webflow tours ─────────────────────────────────────────────
  {
    source: '/tours-soqtapata-3d2n',
    destination: '/experiences/soqtapata-pristine-immersion-3d-2n',
    permanent: true,
  },
  {
    source: '/tours-mbl-3d2n',
    destination: '/experiences/manu-gradient-expedition-3d-2n',
    permanent: true,
  },
  {
    source: '/tours-mbl-4d3n',
    destination: '/experiences/manu-gradient-expedition-4d-3n',
    permanent: true,
  },
  // No published MLC experience landing — lodge page is the closest equivalent.
  {
    source: '/tours-mlc-3d2n',
    destination: '/lodges/manu-learning-centre',
    permanent: true,
  },
  { source: '/copy-of-soqtapata-3d-2n', destination: '/experiences/andean-cloud-forest-3d-2n', permanent: true },
  {
    source: '/copy-of-soqtapata-3d-2n-1',
    destination: '/experiences/andean-cloud-forest-3d-2n',
    permanent: true,
  },

  // ── Wix contact / about ─────────────────────────────────────────────
  { source: '/contact-4', destination: '/about', permanent: true },
  { source: '/copy-of-programas', destination: '/', permanent: true },
  { source: '/programas', destination: '/routes', permanent: true },
  { source: '/services-4', destination: '/', permanent: true },

  // ── Blog → Journal ──────────────────────────────────────────────────
  { source: '/blog', destination: '/journal', permanent: true },
  { source: '/blog/:slug', destination: '/journal/:slug', permanent: true },

  // ── Missing App Router indexes ──────────────────────────────────────
  { source: '/experiences', destination: '/', permanent: true },
  // No `/lodges` index — home is the lodges discovery surface.
  { source: '/lodges', destination: '/', permanent: true },

  // ── Renamed experience / programme public slugs ─────────────────────
  {
    source: '/experiences/soqtapata-pristine-immersion',
    destination: '/experiences/soqtapata-pristine-immersion-3d-2n',
    permanent: true,
  },
  {
    source: '/experiences/andean-cloud-forest',
    destination: '/experiences/andean-cloud-forest-3d-2n',
    permanent: true,
  },
  {
    source: '/experiences/manu-gradient',
    destination: '/experiences/manu-gradient-expedition-3d-2n',
    permanent: true,
  },
  {
    source: '/experiences/family-discovery',
    destination: '/experiences/family-discovery-quest-5d-4n',
    permanent: true,
  },
  // No published landing — route listing is the closest section.
  { source: '/experiences/manu-core-frontier', destination: '/routes', permanent: true },
  { source: '/experiences/schools', destination: '/', permanent: true },

  // ── Lodge KC slug used as if it were the lodgePage slug ─────────────
  {
    source: '/lodges/lodge-soqtapata',
    destination: '/lodges/soqtapata-lodge',
    permanent: true,
  },
]
