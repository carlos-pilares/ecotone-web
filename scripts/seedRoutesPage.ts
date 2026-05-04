/**
 * Idempotent: upserts only the `routesPage` singleton (`_id` from `CMS_IDS.routesPage`).
 * Content comes from `buildRoutesPageDocument` → `data/routesStatic.ts`.
 *
 * La verificación GROQ usa `routesPageDiagnosticsQuery` (mismos paths que el schema). Si un tab
 * en Studio se ve vacío, suele ser porque ese campo concreto no está en el documento o el nombre
 * no coincide con `sanity/schemaTypes/routesPage.js`.
 *
 * Prerrequisito: existan los `review` referenciados (p. ej. `npm run seed:cms` o al menos `npm run seed`).
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { routesPageDiagnosticsQuery } from '@/lib/routesPageQuery'

import { buildRoutesPageDocument } from './seed/buildRoutesPageDocument'
import { removeRoutesPageDraft } from './seed/removeRoutesPageDraft'
import { createUrlImageCache } from './seed/urlImageCache'
import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const client = writeClient()
  const cache = createUrlImageCache(client)
  const doc = await buildRoutesPageDocument(client, cache)
  await removeRoutesPageDraft(client)
  // Sanity client typings expect IdentifiedSanityDocumentStub; seed payload is structurally valid.
  await client.createOrReplace(doc as never)
  // eslint-disable-next-line no-console
  console.log('[seed:routes-page] createOrReplace OK', { _id: doc._id, _type: doc._type })

  const summary = await client.fetch<Record<string, unknown>>(routesPageDiagnosticsQuery)
  // eslint-disable-next-line no-console
  console.log('[seed:routes-page] GROQ verify:\n', JSON.stringify(summary, null, 2))
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
