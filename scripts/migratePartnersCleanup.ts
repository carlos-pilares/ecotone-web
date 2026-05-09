/**
 * Partner + Home partners CMS cleanup:
 * - Unsets legacy `order` on all `partner` documents (published + drafts.*).
 * - On `homePage` / `drafts.homePage`: unsets `homeSelectedPartners`; if `partnersEyebrow` and `partnersTitle` are both empty, copies `partnersLabel` → `partnersTitle`; unsets `partnersLabel`.
 * - On `aboutPage` / `drafts.aboutPage`: same label → title migration; unsets `partnersLabel`.
 *
 * Usage:
 *   npm run migrate:partners-cleanup              # dry-run
 *   npm run migrate:partners-cleanup -- --commit  # apply
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { CMS_IDS } from '@/data/cmsApproved/ids'

import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

const HOME_IDS = [CMS_IDS.homePage, `drafts.${CMS_IDS.homePage}`] as const
const ABOUT_IDS = [CMS_IDS.aboutPage, `drafts.${CMS_IDS.aboutPage}`] as const

function hasOwn(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

async function main() {
  const commit = process.argv.includes('--commit')
  const client = writeClient()

  // eslint-disable-next-line no-console
  console.log('=== Partner documents: unset `order` ===\n')

  const publishedPartners = await client.fetch<Array<{ _id: string; order?: unknown }>>(
    `*[_type == "partner" && !(_id in path("drafts.**"))]{ _id, order }`,
  )
  const draftPartners = await client.fetch<Array<{ _id: string; order?: unknown }>>(
    `*[_type == "partner" && _id in path("drafts.**")]{ _id, order }`,
  )

  const partnerRows = [...publishedPartners, ...draftPartners]
  for (const row of partnerRows) {
    const unsetOrder = row.order !== undefined && row.order !== null
    // eslint-disable-next-line no-console
    console.log(`${row._id}: order field ${unsetOrder ? 'present → would unset' : 'absent'}`)
    if (commit && unsetOrder) {
      await client.patch(row._id).unset(['order']).commit()
    }
  }

  // eslint-disable-next-line no-console
  console.log('\n=== Home page: legacy partner fields ===\n')

  const homeDocs = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_id in $ids]{ _id, homeSelectedPartners, partnersOnHome, partnersLabel, partnersEyebrow, partnersTitle }`,
    { ids: [...HOME_IDS] },
  )
  const homeById = new Map(homeDocs.map((d) => [d._id, d]))

  for (const id of HOME_IDS) {
    const doc = homeById.get(id)
    // eslint-disable-next-line no-console
    console.log(`--- ${id} ---`)
    if (!doc) {
      // eslint-disable-next-line no-console
      console.log('(document not found)\n')
      continue
    }

    const hasLegacyRefs = hasOwn(doc, 'homeSelectedPartners')
    const legacyLabel = typeof doc.partnersLabel === 'string' ? doc.partnersLabel.trim() : ''
    const hasPartnersLabel = hasOwn(doc, 'partnersLabel')
    const eyebrow = typeof doc.partnersEyebrow === 'string' ? doc.partnersEyebrow.trim() : ''
    const title = typeof doc.partnersTitle === 'string' ? doc.partnersTitle.trim() : ''
    const wouldCopyTitle = Boolean(legacyLabel && !eyebrow && !title)
    const wouldUnsetRefs = hasLegacyRefs
    const wouldUnsetLabel = hasPartnersLabel

    // eslint-disable-next-line no-console
    console.log(`  homeSelectedPartners on doc: ${wouldUnsetRefs ? 'yes → would unset' : 'no'}`)
    // eslint-disable-next-line no-console
    console.log(`  partnersLabel on doc: ${hasPartnersLabel ? `yes ("${legacyLabel}")` : 'no'}`)
    // eslint-disable-next-line no-console
    console.log(`  partnersEyebrow: ${eyebrow ? `"${eyebrow}"` : '(empty)'}`)
    // eslint-disable-next-line no-console
    console.log(`  partnersTitle: ${title ? `"${title}"` : '(empty)'}`)
    if (wouldCopyTitle) {
      // eslint-disable-next-line no-console
      console.log('  → would set partnersTitle from partnersLabel (eyebrow+title empty), then unset partnersLabel')
    } else if (wouldUnsetLabel) {
      // eslint-disable-next-line no-console
      console.log('  → would unset partnersLabel only')
    }

    if (!commit) {
      // eslint-disable-next-line no-console
      console.log('')
      continue
    }

    let patch = client.patch(id)
    let touched = false
    if (wouldUnsetRefs) {
      patch = patch.unset(['homeSelectedPartners'])
      touched = true
    }
    if (wouldCopyTitle) {
      patch = patch.set({ partnersTitle: legacyLabel })
      touched = true
    }
    if (wouldUnsetLabel) {
      patch = patch.unset(['partnersLabel'])
      touched = true
    }
    if (touched) {
      await patch.commit()
      // eslint-disable-next-line no-console
      console.log('  committed patch.\n')
    } else {
      // eslint-disable-next-line no-console
      console.log('  nothing to patch.\n')
    }
  }

  // eslint-disable-next-line no-console
  console.log('\n=== About page: legacy partnersLabel → partnersTitle ===\n')

  const aboutDocs = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_id in $ids]{ _id, partnersLabel, partnersEyebrow, partnersTitle }`,
    { ids: [...ABOUT_IDS] },
  )
  const aboutById = new Map(aboutDocs.map((d) => [d._id, d]))

  for (const id of ABOUT_IDS) {
    const doc = aboutById.get(id)
    // eslint-disable-next-line no-console
    console.log(`--- ${id} ---`)
    if (!doc) {
      // eslint-disable-next-line no-console
      console.log('(document not found)\n')
      continue
    }

    const legacyLabel = typeof doc.partnersLabel === 'string' ? doc.partnersLabel.trim() : ''
    const hasPartnersLabel = hasOwn(doc, 'partnersLabel')
    const eyebrow = typeof doc.partnersEyebrow === 'string' ? doc.partnersEyebrow.trim() : ''
    const title = typeof doc.partnersTitle === 'string' ? doc.partnersTitle.trim() : ''
    const wouldCopyTitle = Boolean(legacyLabel && !eyebrow && !title)
    const wouldUnsetLabel = hasPartnersLabel

    // eslint-disable-next-line no-console
    console.log(`  partnersLabel on doc: ${hasPartnersLabel ? `yes ("${legacyLabel}")` : 'no'}`)
    // eslint-disable-next-line no-console
    console.log(`  partnersEyebrow: ${eyebrow ? `"${eyebrow}"` : '(empty)'}`)
    // eslint-disable-next-line no-console
    console.log(`  partnersTitle: ${title ? `"${title}"` : '(empty)'}`)
    if (wouldCopyTitle) {
      // eslint-disable-next-line no-console
      console.log('  → would set partnersTitle from partnersLabel (eyebrow+title empty), then unset partnersLabel')
    } else if (wouldUnsetLabel) {
      // eslint-disable-next-line no-console
      console.log('  → would unset partnersLabel only')
    }

    if (!commit) {
      // eslint-disable-next-line no-console
      console.log('')
      continue
    }

    let patch = client.patch(id)
    let touched = false
    if (wouldCopyTitle) {
      patch = patch.set({ partnersTitle: legacyLabel })
      touched = true
    }
    if (wouldUnsetLabel) {
      patch = patch.unset(['partnersLabel'])
      touched = true
    }
    if (touched) {
      await patch.commit()
      // eslint-disable-next-line no-console
      console.log('  committed patch.\n')
    } else {
      // eslint-disable-next-line no-console
      console.log('  nothing to patch.\n')
    }
  }

  if (!commit) {
    // eslint-disable-next-line no-console
    console.log('Dry-run only. Re-run with --commit to apply.')
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
