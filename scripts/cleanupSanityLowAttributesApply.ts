/**
 * LOW attribute cleanup — unset experience local guide fields superseded by
 * central Traveller Guide.
 *
 * Scope (from backups/sanity-low-cleanup-before.json):
 *   travelerGuideSubsections, entryRequirements, packingList
 *
 * Before unsetting each path:
 *   1. Fetch the live production value
 *   2. Compare with snapshot fullCurrentValue
 *   3. Unset only if values match exactly
 *   4. Skip + report mismatches; continue with remaining paths
 *
 * Default: DRY RUN. Write: --commit
 *
 * Usage:
 *   npx tsx scripts/cleanupSanityLowAttributesApply.ts
 *   npx tsx scripts/cleanupSanityLowAttributesApply.ts --commit
 */
import { config } from 'dotenv'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@sanity/client'

import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

const COMMIT = process.argv.includes('--commit')
const SNAPSHOT_PATH = resolve(process.cwd(), 'backups/sanity-low-cleanup-before.json')

const ALLOWED_PATHS = new Set([
  'travelerGuideSubsections',
  'entryRequirements',
  'packingList',
])

type SnapshotEntry = {
  documentId: string
  documentType: string
  exactPath: string
  fullCurrentValue: unknown
}

type SnapshotFile = {
  meta?: {
    officialFieldsCountAtSnapshot?: number
    datasetBackup?: string
    pathCount?: number
    documentCount?: number
  }
  entries: SnapshotEntry[]
}

type PathResult = {
  documentId: string
  documentType: string
  exactPath: string
  snapshotValue: unknown
  liveValue: unknown
  matched: boolean
}

function resolveWriteToken(): string {
  let token = process.env.SANITY_API_TOKEN?.trim() ?? ''
  if (token.includes('TU_TOKEN_AQUI')) {
    token = token.replace(/TU_TOKEN_AQUI/g, '').trim()
  }
  if (!token) {
    throw new Error(
      'SANITY_API_TOKEN is missing in .env.local. Add a valid write token from sanity.io/manage → API → Tokens.',
    )
  }
  return token
}

async function fetchFieldCount(projectId: string, dataset: string): Promise<number | null> {
  try {
    const url = `https://${projectId}.api.sanity.io/v1/data/stats/${dataset}`
    const res = await fetch(url)
    if (!res.ok) return null
    const json = (await res.json()) as { fields?: { count?: { value?: number } } }
    const n = json.fields?.count?.value
    return typeof n === 'number' ? n : null
  } catch {
    return null
  }
}

function summarize(val: unknown, max = 160): string {
  if (val === undefined) return '(undefined — path absent)'
  try {
    const s = JSON.stringify(val)
    if (s == null) return String(val)
    return s.length <= max ? s : s.slice(0, max) + '…'
  } catch {
    return String(val)
  }
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value))
}

function sortKeys(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(sortKeys)
  const obj = value as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    out[key] = sortKeys(obj[key])
  }
  return out
}

function valuesMatchExactly(a: unknown, b: unknown): boolean {
  return stableStringify(a) === stableStringify(b)
}

function getAtPath(doc: Record<string, unknown> | null | undefined, path: string): unknown {
  if (!doc) return undefined
  const parts = path.split('.')
  let cur: unknown = doc
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  }

  const raw = readFileSync(SNAPSHOT_PATH, 'utf8')
  const snapshot = JSON.parse(raw) as SnapshotFile
  if (!Array.isArray(snapshot.entries) || snapshot.entries.length === 0) {
    throw new Error(`No entries in ${SNAPSHOT_PATH}`)
  }

  for (const entry of snapshot.entries) {
    if (!ALLOWED_PATHS.has(entry.exactPath)) {
      throw new Error(
        `Snapshot contains disallowed path ${entry.exactPath} on ${entry.documentId}`,
      )
    }
  }

  if (snapshot.entries.length !== 18) {
    console.warn(
      `Warning: expected 18 LOW paths, found ${snapshot.entries.length} in snapshot JSON`,
    )
  }

  const readClient = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    useCdn: false,
  })

  const ids = [...new Set(snapshot.entries.map((e) => e.documentId))]
  const liveDocs = await readClient.fetch<Array<Record<string, unknown>>>(
    `*[_id in $ids]`,
    { ids },
  )
  const liveById = new Map(liveDocs.map((d) => [String(d._id), d]))

  const results: PathResult[] = []
  for (const entry of snapshot.entries) {
    const liveDoc = liveById.get(entry.documentId)
    const liveValue = getAtPath(liveDoc, entry.exactPath)
    const matched =
      liveValue !== undefined && valuesMatchExactly(entry.fullCurrentValue, liveValue)
    results.push({
      documentId: entry.documentId,
      documentType: entry.documentType,
      exactPath: entry.exactPath,
      snapshotValue: entry.fullCurrentValue,
      liveValue,
      matched,
    })
  }

  const matched = results.filter((r) => r.matched)
  const mismatched = results.filter((r) => !r.matched)

  const matchedByDoc = new Map<string, PathResult[]>()
  for (const r of matched) {
    const list = matchedByDoc.get(r.documentId) ?? []
    list.push(r)
    matchedByDoc.set(r.documentId, list)
  }

  const before = await fetchFieldCount(projectId, dataset)

  console.log('\n========== LOW ATTRIBUTE CLEANUP APPLY ==========')
  console.log(`Dataset: ${projectId}/${dataset}`)
  console.log(`Snapshot: ${SNAPSHOT_PATH}`)
  console.log(`Dataset backup (manual): ${snapshot.meta?.datasetBackup ?? '(see backups/)'}`)
  console.log(`Official fields.count now: ${before != null ? before : '(unavailable)'}`)
  console.log(`Snapshot fields.count: ${snapshot.meta?.officialFieldsCountAtSnapshot ?? 'n/a'}`)
  console.log(`Snapshot paths: ${snapshot.entries.length}`)
  console.log(`Snapshot documents: ${ids.length}`)
  console.log(`Mode: ${COMMIT ? 'COMMIT (will write matched only)' : 'DRY RUN (no writes)'}`)

  console.log('\n--- Matched paths (would unset / will unset) ---')
  if (!matched.length) {
    console.log('(none)')
  } else {
    for (const r of matched) {
      console.log(`  ✓ ${r.documentType} ${r.documentId}`)
      console.log(`      path: ${r.exactPath}`)
      console.log(`      value: ${summarize(r.liveValue)}`)
    }
  }

  console.log('\n--- Mismatched / skipped paths ---')
  if (!mismatched.length) {
    console.log('(none)')
  } else {
    for (const r of mismatched) {
      console.log(`  ✗ ${r.documentType} ${r.documentId}`)
      console.log(`      path:     ${r.exactPath}`)
      console.log(`      snapshot: ${summarize(r.snapshotValue)}`)
      console.log(`      live:     ${summarize(r.liveValue)}`)
    }
  }

  console.log('\n--- Summary ---')
  console.log(`Matched paths:               ${matched.length}`)
  console.log(`Mismatched/skipped paths:    ${mismatched.length}`)
  console.log(`Paths that would be mutated: ${matched.length}`)

  if (!COMMIT) {
    console.log('\nDry-run complete. Zero mutations executed.')
    console.log('Re-run with --commit only after explicit approval.')
    console.log('=================================================\n')
    return
  }

  if (!matched.length) {
    console.log('\nNo matched paths — nothing to commit.')
    console.log('=================================================\n')
    return
  }

  process.env.SANITY_API_TOKEN = resolveWriteToken()
  const client = writeClient()

  let patchedDocs = 0
  let unsetPaths = 0
  for (const [docId, entries] of matchedByDoc) {
    const paths = entries.map((e) => e.exactPath)
    await client.patch(docId).unset(paths).commit()
    patchedDocs += 1
    unsetPaths += paths.length
    console.log(`Unset on ${docId}: ${paths.join(', ')}`)
  }

  const after = await fetchFieldCount(projectId, dataset)
  console.log(`\nApply commit complete.`)
  console.log(`Documents patched: ${patchedDocs}`)
  console.log(`Paths unset: ${unsetPaths}`)
  console.log(`Official fields.count before: ${before != null ? before : '(unavailable)'}`)
  console.log(`Official fields.count after:  ${after != null ? after : '(unavailable)'}`)
  console.log('=================================================\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
