import type { SanityClient } from '@sanity/client'

import { commitSiteSettingsDocument } from './seed/buildSiteSettingsDocument'
import { writeClient } from './seed/sanityWriteClient.js'

async function main() {
  const client = writeClient() as SanityClient
  await commitSiteSettingsDocument(client)
  // eslint-disable-next-line no-console
  console.log(
    'seed:site-settings — OK (published _id "siteSettings" with header+footer; empty drafts.siteSettings removed if it existed)',
  )
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
