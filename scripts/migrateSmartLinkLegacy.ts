/**
 * Normalizes legacy smartLink values in Sanity so Studio uses current linkType / internalPage keys.
 *
 * Transforms (in copies committed via patch):
 * - linkType internalPage + internalPage aboutPage → websitePage + about
 * - linkType internalPage + internalPage routesPage → websitePage + routes
 * - linkType internalPage (other internalPage) → websitePage (unchanged key)
 * - linkType pageSection + internalPage set → websitePage + normalized internalPage + websitePageSectionId from sectionId when needed
 * - linkType pageSection + only section hash → samePageSection + samePageSectionId
 *
 * Usage:
 *   npx tsx scripts/migrateSmartLinkLegacy.ts           # dry-run (log only)
 *   npx tsx scripts/migrateSmartLinkLegacy.ts --commit  # apply patches
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

const DOC_TYPES = [
  'homePage',
  'aboutPage',
  'routesPage',
  'siteSettings',
  'lodgePage',
  'experiencePage',
  'experience',
] as const

type SmartLinkish = Record<string, unknown> & { linkType?: string; _type?: string }

function normalizeInternalPageKey(ip: string): string {
  if (ip === 'aboutPage') return 'about'
  if (ip === 'routesPage') return 'routes'
  return ip
}

/** @returns true if the object was mutated */
function normalizeSmartLink(sl: SmartLinkish): boolean {
  let changed = false
  const lt = typeof sl.linkType === 'string' ? sl.linkType.trim() : ''

  if (lt === 'internalPage') {
    sl.linkType = 'websitePage'
    if (typeof sl.internalPage === 'string') {
      const next = normalizeInternalPageKey(sl.internalPage.trim())
      if (next !== sl.internalPage) {
        sl.internalPage = next
      }
    }
    changed = true
  }

  if (lt === 'pageSection') {
    const hash = String(sl.websitePageSectionId ?? sl.sectionId ?? '')
      .trim()
    const ip = typeof sl.internalPage === 'string' ? sl.internalPage.trim() : ''

    if (ip) {
      sl.linkType = 'websitePage'
      const nextIp = normalizeInternalPageKey(ip)
      sl.internalPage = nextIp
      if (hash) {
        sl.websitePageSectionId = hash
        if (sl.sectionId != null) delete sl.sectionId
      }
      changed = true
    } else if (hash) {
      sl.linkType = 'samePageSection'
      sl.samePageSectionId = hash
      if (sl.websitePageSectionId != null) delete sl.websitePageSectionId
      if (sl.sectionId != null) delete sl.sectionId
      changed = true
    }
  }

  return changed
}

function collectSmartLinkPatches(
  val: unknown,
  basePath: string,
  out: { path: string; value: Record<string, unknown> }[],
): void {
  if (val == null || typeof val !== 'object') return

  if (Array.isArray(val)) {
    val.forEach((item, i) => {
      const p = basePath ? `${basePath}[${i}]` : `[${i}]`
      collectSmartLinkPatches(item, p, out)
    })
    return
  }

  const obj = val as Record<string, unknown>
  if (obj._type === 'smartLink') {
    const copy = structuredClone(obj) as SmartLinkish
    if (normalizeSmartLink(copy)) {
      out.push({ path: basePath, value: copy as Record<string, unknown> })
    }
    return
  }

  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('_')) continue
    const p = basePath ? `${basePath}.${k}` : k
    collectSmartLinkPatches(v, p, out)
  }
}

async function main() {
  const commit = process.argv.includes('--commit')
  const client = writeClient()

  const docs = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_type in $types]`,
    { types: [...DOC_TYPES] },
  )

  let totalPatches = 0

  for (const doc of docs) {
    const id = doc._id
    const patches: { path: string; value: Record<string, unknown> }[] = []
    collectSmartLinkPatches(doc, '', patches)
    if (patches.length === 0) continue

    // eslint-disable-next-line no-console
    console.log(id, patches.map((x) => x.path || '(root)').join(', '))
    totalPatches += patches.length

    if (commit) {
      let patch = client.patch(id)
      for (const { path, value } of patches) {
        const key = path || ''
        if (!key) {
          throw new Error(`Unexpected root-level smartLink on ${id}`)
        }
        patch = patch.set({ [key]: value })
      }
      await patch.commit()
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    commit ? `Committed ${totalPatches} smartLink update(s) on ${docs.length} doc type(s).` : `Dry-run: ${totalPatches} smartLink update(s) (add --commit to apply).`,
  )
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
