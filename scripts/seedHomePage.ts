/**
 * Idempotent seed: homePage singleton + library collection docs (same content as `npm run seed:cms`, without images).
 * For full assets + Soqtapata + siteSettings, use `npm run seed:cms`. For `siteSettings` only (header/footer
 * copy from `data/cmsApproved/siteSettingsApprovedContent.ts`), use `npm run seed:site-settings`.
 */
import type { SanityClient } from '@sanity/client'
import { createClient } from 'next-sanity'
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { CMS_IDS } from '@/data/cmsApproved/ids'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import {
  blogPostSeeds,
  partnerSeeds,
  reviewSeedsUnlinked,
  technologyProductSeeds,
} from '@/data/cmsApproved/librarySeeds'

config({ path: resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN

function writeClient(): SanityClient {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  }
  if (!token) {
    throw new Error('Missing SANITY_API_TOKEN. Add it to .env.local and run again.')
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })
}

type SeedDoc = Record<string, unknown> & { _id: string; _type: string }

async function main() {
  const client = writeClient()

  const homePageContent: SeedDoc = {
    _type: 'homePage',
    _id: CMS_IDS.homePage,
    ...homePageTextFields,
  }

  const tx = client.transaction()
  tx.createOrReplace(homePageContent)
  for (const r of reviewSeedsUnlinked) {
    tx.createOrReplace(r as SeedDoc)
  }
  for (const t of technologyProductSeeds) {
    tx.createOrReplace(t as SeedDoc)
  }
  for (const p of partnerSeeds) {
    tx.createOrReplace(p as SeedDoc)
  }
  for (const b of blogPostSeeds) {
    tx.createOrReplace(b as SeedDoc)
  }

  await tx.commit()
  console.log('Seed complete: homePage (text only) + reviews + technologyProduct + partner + blogPost')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
