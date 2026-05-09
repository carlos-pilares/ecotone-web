/**
 * Migrates legacy `homeSelectedPartners` on `homePage` into `partnersOnHome` and removes the old field
 * so Studio stops reporting "Unknown field found".
 *
 * Processes both the published document and the draft (`drafts.homePage`), if present.
 *
 * Usage:
 *   npm run migrate:home-partners              # dry-run (log only)
 *   npm run migrate:home-partners -- --commit # apply patches
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { CMS_IDS } from '@/data/cmsApproved/ids'

import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

const PUBLISHED_ID = CMS_IDS.homePage
const DRAFT_ID = `drafts.${CMS_IDS.homePage}`

const TARGET_LABEL: Record<string, string> = {
  [PUBLISHED_ID]: 'Published homePage',
  [DRAFT_ID]: 'Draft drafts.homePage',
}

type RefItem = {
  _type?: string
  _ref?: string
  _key?: string
  _weak?: boolean
}

function isNonEmptyRefArray(v: unknown): v is RefItem[] {
  return Array.isArray(v) && v.length > 0 && v.every((x) => x && typeof x === 'object' && typeof (x as RefItem)._ref === 'string')
}

function partnersOnHomeIsEmpty(doc: Record<string, unknown>): boolean {
  const cur = doc.partnersOnHome
  if (cur == null) return true
  if (!Array.isArray(cur)) return true
  return cur.length === 0
}

function hasLegacyField(doc: Record<string, unknown>): boolean {
  return Object.prototype.hasOwnProperty.call(doc, 'homeSelectedPartners')
}

function cloneRefList(refs: RefItem[]): RefItem[] {
  return refs.map((r, i) => ({
    _type: 'reference' as const,
    _ref: r._ref!,
    ...(r._key ? { _key: r._key } : { _key: `migrated-partner-${i}` }),
    ...(r._weak === true ? { _weak: true } : {}),
  }))
}

function analyze(doc: Record<string, unknown>) {
  const legacy = doc.homeSelectedPartners
  const legacyRefs = isNonEmptyRefArray(legacy) ? legacy : null
  const emptyNew = partnersOnHomeIsEmpty(doc)
  const legacyPresent = hasLegacyField(doc)
  const wouldCopy = Boolean(legacyRefs && emptyNew)
  const wouldUnset = legacyPresent
  const needsCommit = wouldCopy || wouldUnset
  return { legacyRefs, emptyNew, legacyPresent, wouldCopy, wouldUnset, needsCommit }
}

function printReport(docId: string, doc: Record<string, unknown>) {
  const label = TARGET_LABEL[docId] ?? docId
  const { legacyRefs, emptyNew, legacyPresent, wouldCopy, wouldUnset } = analyze(doc)

  // eslint-disable-next-line no-console
  console.log(`\n--- ${label} (${docId}) ---`)
  // eslint-disable-next-line no-console
  console.log(`partnersOnHome empty/missing: ${emptyNew}`)
  // eslint-disable-next-line no-console
  console.log(`homeSelectedPartners present on doc: ${legacyPresent}`)
  if (legacyRefs) {
    // eslint-disable-next-line no-console
    console.log(
      'homeSelectedPartners order (_ref):',
      legacyRefs.map((r) => r._ref).join(', '),
    )
  } else {
    // eslint-disable-next-line no-console
    console.log('homeSelectedPartners: (empty or missing)')
  }

  if (wouldCopy) {
    const next = cloneRefList(legacyRefs!)
    // eslint-disable-next-line no-console
    console.log('Would set partnersOnHome to (same order):', JSON.stringify(next, null, 2))
  } else if (legacyRefs && !emptyNew) {
    // eslint-disable-next-line no-console
    console.log('Would NOT copy: partnersOnHome already has entries; only legacy field removal applies.')
  } else {
    // eslint-disable-next-line no-console
    console.log('Would NOT copy: no non-empty homeSelectedPartners.')
  }

  // eslint-disable-next-line no-console
  console.log(`Would unset homeSelectedPartners: ${wouldUnset ? 'yes' : 'no'}`)
}

async function main() {
  const commit = process.argv.includes('--commit')
  const client = writeClient()

  const rows = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_id in $ids]{ _id, homeSelectedPartners, partnersOnHome }`,
    { ids: [PUBLISHED_ID, DRAFT_ID] },
  )

  const byId = new Map(rows.map((r) => [r._id, r]))

  // eslint-disable-next-line no-console
  console.log('Home partners field migration (homeSelectedPartners → partnersOnHome)')

  for (const id of [PUBLISHED_ID, DRAFT_ID]) {
    const doc = byId.get(id)
    if (!doc) {
      // eslint-disable-next-line no-console
      console.log(`\n--- ${TARGET_LABEL[id] ?? id} (${id}) ---`)
      // eslint-disable-next-line no-console
      console.log('(no document in dataset — skipped)')
      continue
    }
    printReport(id, doc)
  }

  if (!commit) {
    // eslint-disable-next-line no-console
    console.log('\nDry-run only. Re-run with --commit to apply.')
    return
  }

  let anyCommitted = false
  for (const id of [PUBLISHED_ID, DRAFT_ID]) {
    const doc = byId.get(id)
    if (!doc) continue

    const { legacyRefs, wouldCopy, wouldUnset, needsCommit } = analyze(doc)
    if (!needsCommit) {
      // eslint-disable-next-line no-console
      console.log(`\n[${id}] Nothing to apply.`)
      continue
    }

    let patch = client.patch(id)
    if (wouldCopy) {
      patch = patch.set({ partnersOnHome: cloneRefList(legacyRefs!) })
    }
    if (wouldUnset) {
      patch = patch.unset(['homeSelectedPartners'])
    }
    await patch.commit()
    anyCommitted = true
    // eslint-disable-next-line no-console
    console.log(`\n[${id}] Patch committed.`)
  }

  if (!anyCommitted) {
    // eslint-disable-next-line no-console
    console.log('\nNo patches applied (nothing needed).')
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
