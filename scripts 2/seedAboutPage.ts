/**
 * Idempotent: upserts only the `aboutPage` singleton (`_id` from `CMS_IDS.aboutPage`).
 * Content from `buildAboutPageDocument` → `data/aboutStatic.ts`.
 *
 * Prerequisite: `partner` documents exist for `partnerRefs` (e.g. `npm run seed:cms`).
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { aboutPageDiagnosticsQuery } from '@/lib/aboutPageQuery'

import { buildAboutPageDocument } from './seed/buildAboutPageDocument'
import { removeAboutPageDraft } from './seed/removeAboutPageDraft'
import { createUrlImageCache } from './seed/urlImageCache'
import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const client = writeClient()
  const cache = createUrlImageCache(client)
  const doc = await buildAboutPageDocument(client, cache)
  await removeAboutPageDraft(client)
  await client.createOrReplace(doc as never)
  // eslint-disable-next-line no-console
  console.log('[seed:about-page] createOrReplace OK', { _id: doc._id, _type: doc._type })

  const summary = await client.fetch<Record<string, unknown>>(aboutPageDiagnosticsQuery)
  // eslint-disable-next-line no-console
  console.log('[seed:about-page] GROQ verify:\n', JSON.stringify(summary, null, 2))
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
