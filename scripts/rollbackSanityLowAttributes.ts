/**
 * Rollback LOW attribute cleanup using the field snapshot JSON.
 *
 * Restores ONLY the exact fields in:
 *   backups/sanity-low-cleanup-before.json
 *
 * Patches individual fields via set() — never replaces full documents.
 *
 * Usage:
 *   npx tsx scripts/rollbackSanityLowAttributes.ts           # dry-run
 *   npx tsx scripts/rollbackSanityLowAttributes.ts --commit  # write
 */
import { config } from 'dotenv'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

const COMMIT = process.argv.includes('--commit')
const SNAPSHOT_PATH = resolve(process.cwd(), 'backups/sanity-low-cleanup-before.json')

type SnapshotEntry = {
  documentId: string
  documentType: string
  exactPath: string
  fullCurrentValue: unknown
}

type SnapshotFile = {
  meta?: Record<string, unknown>
  entries: SnapshotEntry[]
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

function summarize(val: unknown, max = 100): string {
  try {
    const s = JSON.stringify(val)
    if (s == null) return String(val)
    return s.length <= max ? s : s.slice(0, max) + '…'
  } catch {
    return String(val)
  }
}

async function main() {
  const raw = readFileSync(SNAPSHOT_PATH, 'utf8')
  const snapshot = JSON.parse(raw) as SnapshotFile
  if (!Array.isArray(snapshot.entries) || snapshot.entries.length === 0) {
    throw new Error(`No entries in ${SNAPSHOT_PATH}`)
  }

  const byDoc = new Map<string, SnapshotEntry[]>()
  for (const entry of snapshot.entries) {
    if (!entry.documentId || !entry.exactPath) {
      throw new Error(`Invalid snapshot entry: ${JSON.stringify(entry)}`)
    }
    const list = byDoc.get(entry.documentId) ?? []
    list.push(entry)
    byDoc.set(entry.documentId, list)
  }

  console.log('\n========== LOW CLEANUP ROLLBACK ==========')
  console.log(`Snapshot: ${SNAPSHOT_PATH}`)
  console.log(`Entries: ${snapshot.entries.length}`)
  console.log(`Documents: ${byDoc.size}`)
  console.log(`Mode: ${COMMIT ? 'COMMIT (will write)' : 'DRY RUN (no writes)'}`)

  for (const [docId, entries] of byDoc) {
    console.log(`\n### ${entries[0]?.documentType ?? '?'}  ${docId}`)
    for (const e of entries) {
      console.log(`  set ${e.exactPath}`)
      console.log(`      value: ${summarize(e.fullCurrentValue)}`)
    }
  }

  if (!COMMIT) {
    console.log('\nDry-run complete. Re-run with --commit to restore fields.')
    console.log('=========================================\n')
    return
  }

  process.env.SANITY_API_TOKEN = resolveWriteToken()
  const client = writeClient()

  let patched = 0
  for (const [docId, entries] of byDoc) {
    let tx = client.patch(docId)
    for (const e of entries) {
      tx = tx.set({ [e.exactPath]: e.fullCurrentValue })
    }
    await tx.commit({ autoGenerateArrayKeys: false })
    patched += 1
    console.log(`Patched ${docId} (${entries.length} field(s))`)
  }

  console.log(`\nRollback commit complete. Documents patched: ${patched}`)
  console.log('=========================================\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
