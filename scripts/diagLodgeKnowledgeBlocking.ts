/**
 * Prints **error-level** data issues for Lodge Knowledge Center documents that would
 * still block publish after schema relaxations (e.g. duplicate room or gallery stable IDs).
 *
 * Usage:
 *   npx tsx scripts/diagLodgeKnowledgeBlocking.ts
 *
 * Read-only. Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * (uses CDN read; token optional for private datasets).
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { createClient } from 'next-sanity'

config({ path: resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-20'

const SLUG_LIKE = /^[a-z0-9][a-z0-9-]*$/

async function main() {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  }
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const lodges = await client.fetch<
    Array<{
      _id: string
      name?: string | null
      slug?: {current?: string | null} | null
      rooms?: Array<{stableId?: string | null; name?: string | null}> | null
      gallery?: Array<{stableKey?: string | null}> | null
    }>
  >(`*[_type == "lodge"]{ _id, name, slug, rooms[]{ stableId, name }, gallery[]{ stableKey } }`)

  let found = 0
  for (const doc of lodges) {
    const issues: string[] = []
    if (!(doc.name ?? '').trim()) issues.push('Lodge name is empty (schema: required).')
    if (!(doc.slug?.current ?? '').trim()) issues.push('Lodge slug is empty (schema: required).')

    const rooms = doc.rooms ?? []
    const trimmedIds = rooms.map((r) => (r.stableId ?? '').trim()).filter(Boolean)
    if (trimmedIds.length !== new Set(trimmedIds).size) {
      issues.push('Duplicate non-empty room stableId values in rooms[].')
    }
    for (let i = 0; i < rooms.length; i++) {
      const nm = (rooms[i]?.name ?? '').trim()
      if (!nm) issues.push(`rooms[${i}]: name is required but empty.`)
    }

    const gKeys = (doc.gallery ?? []).map((g) => (g.stableKey ?? '').trim()).filter(Boolean)
    if (gKeys.length !== new Set(gKeys).size) {
      issues.push('Duplicate non-empty gallery stableKey values in gallery[].')
    }

    if (issues.length) {
      found++
      console.log(`\n## ${doc._id} — ${doc.name ?? '(no name)'}`)
      for (const m of issues) console.log(`  - ${m}`)
    }
  }
  if (!found) {
    console.log('No document-level blocking issues detected by this diagnostic (duplicates / missing name / missing slug).')
    console.log('Note: Studio may still warn on optional fields; run `npm run migrate:repair-lodge-rooms` if room IDs need repair.')
  } else {
    console.log(`\nTotal lodges with reported issues: ${found}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
