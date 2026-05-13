/**
 * Unsets one-off legacy top-level fields on the Soqtapata experience page document.
 * They are not in the current schema and are not read by GROQ or the app.
 * Run: npm run clean:experience-page-legacy-fields
 * Requires .env.local (SANITY_API_TOKEN, project, dataset) like other seeds.
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

/** Document to clean; default Soqtapata landing. */
const DOCUMENT_ID = 'experiencePageSoqtapataPristine' as const

/**
 * Fields that appeared as "Unknown fields" in Studio — never in current
 * `experiencePage` schema; never referenced in app queries or `seedCmsAll`.
 * Replaced conceptually by: `pageHero` (cta, price), `reviewRefs` / reviews,
 * `experience` (status, pricing), `seo` / `sectionModules.
 */
const LEGACY_ROOT_FIELDS = [
  'bookingCtaLabel',
  'bookingUrl',
  'featuredQuoteAuthor',
  'featuredQuoteText',
  'priceSuffix',
  'status',
  'whatsappMessage',
] as const

async function main() {
  const client = writeClient()
  await client.patch(DOCUMENT_ID).unset([...LEGACY_ROOT_FIELDS]).commit()
  // eslint-disable-next-line no-console
  console.log(
    'Removed legacy fields from',
    DOCUMENT_ID,
    ':',
    LEGACY_ROOT_FIELDS.join(', '),
  )
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
