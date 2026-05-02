/**
 * Read-only: lista duplicados Soqtapata en Sanity (production / env .env.local).
 * Run: npx tsx scripts/auditSoqtapataCms.ts
 */
import { createClient, type SanityClient } from 'next-sanity'
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { CMS_IDS } from '@/data/cmsApproved/ids'

config({ path: resolve(process.cwd(), '.env.local') })

const SOQTAPATA_SLUG = 'soqtapata-pristine-immersion' as const

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN

function client(): SanityClient {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  }
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token: token || undefined })
}

type Row = Record<string, unknown>

async function incomingRefs(c: SanityClient, id: string) {
  return await c.fetch<Row[]>(`*[references($id)]{_id, _type}`, { id })
}

async function main() {
  const c = client()
  // eslint-disable-next-line no-console
  console.log(`Dataset: ${dataset}  project: ${projectId}\n---\n`)

  const experiencePages = await c.fetch<Row[]>(
    `*[_type == "experiencePage" && slug.current == $slug] | order(_id) {
        _id, internalTitle, "slug": slug.current,
        "expRef": experience._ref,
        "hasPageHero": defined(pageHero),
        "sectionN": count(sectionModules),
        "hasPayloadV1": defined(payloadV1) && length(payloadV1) > 20
     }`,
    { slug: SOQTAPATA_SLUG },
  )
  // eslint-disable-next-line no-console
  console.log('## experiencePage (mismo slug)\n', JSON.stringify(experiencePages, null, 2))
  for (const p of experiencePages) {
    const r = await incomingRefs(c, p._id as string)
    // eslint-disable-next-line no-console
    console.log(`  [references to ${p._id}] count=${r.length}`, r.map((x) => ({ _id: x._id, _type: x._type })))
  }

  const experiences = await c.fetch<Row[]>(
    `*[_type == "experience" && slug.current == $slug] | order(_id) {
        _id, name, "slug": slug.current, "lodge": lodge._ref, "route": route._ref
     }`,
    { slug: SOQTAPATA_SLUG },
  )
  // eslint-disable-next-line no-console
  console.log('\n## experience (mismo slug)\n', JSON.stringify(experiences, null, 2))
  for (const p of experiences) {
    const r = await incomingRefs(c, p._id as string)
    // eslint-disable-next-line no-console
    console.log(`  [references to ${p._id}] count=${r.length}`, r)
  }

  const lodges = await c.fetch<Row[]>(
    `*[_type == "lodge" && name match "*Soqtapata*"] | order(_id) { _id, name }`,
  )
  // eslint-disable-next-line no-console
  console.log('\n## lodge (Soqtapata en nombre)\n', JSON.stringify(lodges, null, 2))
  for (const p of lodges) {
    const r = await incomingRefs(c, p._id as string)
    // eslint-disable-next-line no-console
    console.log(`  [references to ${p._id}] count=${r.length}`, r)
  }

  const routes = await c.fetch<Row[]>(`*[_type == "route" && slug.current == "camanti"]{ _id, name, "slug": slug.current }`)
  // eslint-disable-next-line no-console
  console.log('\n## route (camanti)\n', JSON.stringify(routes, null, 2))

  const nRev = await c.fetch<number>(`count(*[_type == "review"])`)
  const nTech = await c.fetch<number>(`count(*[_type == "technologyProduct"])`)
  // eslint-disable-next-line no-console
  console.log(`\n## Conteos: review documents=${nRev}, technologyProduct documents=${nTech}`)

  // eslint-disable-next-line no-console
  console.log(
    '\n## IDs semilla (referencia; conservar en limpieza)\n',
    JSON.stringify(
      {
        experiencePage: CMS_IDS.experiencePageSoqtapata,
        experience: CMS_IDS.experienceSoqtapata,
        lodge: CMS_IDS.lodgeSoqtapata,
        route: CMS_IDS.routeCamanti,
      },
      null,
      2,
    ),
  )
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
