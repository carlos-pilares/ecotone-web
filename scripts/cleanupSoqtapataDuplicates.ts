/**
 * Limpia duplicados Soqtapata en Sanity. Por defecto SOLO reporta (dry run).
 * NO borra homePage, siteSettings, ni la fuente de verdad con IDs en `CMS_IDS`.
 *
 * Uso:
 *   npx tsx scripts/cleanupSoqtapataDuplicates.ts
 *   npx tsx scripts/cleanupSoqtapataDuplicates.ts --delete
 *   # Requiere confirmación con variable (evita accidentes en CI):
 *   SANITY_SOQTAPATA_CLEANUP_CONFIRM=DELETE npx tsx scripts/cleanupSoqtapataDuplicates.ts --delete
 */
import { createClient, type SanityClient } from 'next-sanity'
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { CMS_IDS } from '@/data/cmsApproved/ids'

config({ path: resolve(process.cwd(), '.env.local') })

const PROTECTED = new Set<string>([
  CMS_IDS.homePage,
  CMS_IDS.siteSettings,
  CMS_IDS.experiencePageSoqtapata,
  CMS_IDS.experienceSoqtapata,
  CMS_IDS.lodgeSoqtapata,
  CMS_IDS.routeCamanti,
  // Reseñas y tech de seed (usados por home + página canónica)
  CMS_IDS.review1,
  CMS_IDS.review2,
  CMS_IDS.review3,
  CMS_IDS.review4,
  CMS_IDS.review5,
  CMS_IDS.tech1,
  CMS_IDS.tech2,
  CMS_IDS.tech3,
])

type Expected = { _type: string; note: string }

/**
 * Orden seguro: primero `experiencePage` (referencian `experience`), luego
 * `experience` duplicada, luego `lodge` duplicada. La experiencia UUID huérfana al final.
 * Ajusta esta lista si el audit vuelve a mostrar ids distintos.
 */
const DELETE_PLAN: { _id: string; expect: Expected }[] = [
  { _id: 'experiencePage-soqtapata-pristine', expect: { _type: 'experiencePage', note: 'duplicado legacy (sin pageHero/sections)' } },
  { _id: 'page-soqtapata-3d2n', expect: { _type: 'experiencePage', note: 'duplicado legacy' } },
  { _id: 'experience-soqtapata-3d2n', expect: { _type: 'experience', note: 'duplicado; lodge lodge-soqtapata' } },
  { _id: 'lodge-soqtapata', expect: { _type: 'lodge', note: 'duplicado; canonical es lodgeSoqtapata' } },
  { _id: 'aa4cb48c-2780-43f2-9b1a-afcbfb023b2d', expect: { _type: 'experience', note: 'huérfana (sin ref desde lodge/otros en auditoría 2026-04)' } },
]

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN

function makeClient(options: { forWrite: boolean }): SanityClient {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  }
  if (options.forWrite && !token) {
    throw new Error('SANITY_API_TOKEN is required for --delete (Editor token or write-capable).')
  }
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token: token || undefined })
}

const wantsDelete = process.argv.includes('--delete')

function assertProtected(id: string) {
  if (PROTECTED.has(id) || id.startsWith('drafts.')) {
    throw new Error(`Refusing: ${id} is protected`)
  }
}

async function main() {
  if (DELETE_PLAN.some((d) => PROTECTED.has(d._id))) {
    throw new Error('DELETE_PLAN contains a protected id; fix the script')
  }
  // eslint-disable-next-line no-console
  console.log(`[cleanup:soqtapata] ${wantsDelete ? 'MODE: DELETE' : 'MODE: DRY RUN (no writes)'}`)
  // eslint-disable-next-line no-console
  console.log(`  dataset=${dataset} project=${projectId}\n`)

  const c = makeClient({ forWrite: wantsDelete })

  for (const step of DELETE_PLAN) {
    const doc = await c.fetch<null | { _id: string; _type: string; _rev?: string }>(`*[_id == $id][0]{ _id, _type, _rev }`, {
      id: step._id,
    })
    if (!doc) {
      // eslint-disable-next-line no-console
      console.log(`SKIP (missing): ${step._id} — ${step.expect.note}`)
      continue
    }
    if (doc._type !== step.expect._type) {
      throw new Error(`Abort: ${step._id} is _type=${doc._type}, expected ${step.expect._type}`)
    }
    // eslint-disable-next-line no-console
    console.log(`PENDING ${wantsDelete ? 'DELETE' : 'would delete'}: ${doc._id}  _type=${doc._type}  # ${step.expect.note}`)
    for (const r of await c.fetch<{ _id: string; _type: string }[]>(`*[references($id)]{_id, _type}`, { id: step._id })) {
      // eslint-disable-next-line no-console
      console.log(`   ← referenced by: ${r._id} (${r._type})`)
    }
  }

  if (!wantsDelete) {
    // eslint-disable-next-line no-console
    console.log('\nDry run only. Re-run with --delete and SANITY_SOQTAPATA_CLEANUP_CONFIRM=DELETE to remove.')
    return
  }

  if (process.env.SANITY_SOQTAPATA_CLEANUP_CONFIRM !== 'DELETE') {
    // eslint-disable-next-line no-console
    console.log('\nRefusing --delete: set SANITY_SOQTAPATA_CLEANUP_CONFIRM=DELETE')
    process.exit(2)
  }

  for (const step of DELETE_PLAN) {
    assertProtected(step._id)
    const doc = await c.fetch<null | { _id: string; _type: string }>(`*[_id == $id][0]{ _id, _type }`, { id: step._id })
    if (!doc) {
      // eslint-disable-next-line no-console
      console.log(`(already gone) ${step._id}`)
      continue
    }
    if (doc._type !== step.expect._type) {
      throw new Error(`Refusing: ${step._id} has wrong _type ${doc._type}`)
    }
    // eslint-disable-next-line no-console
    console.log(`DELETING ${doc._id}...`)
    await c.delete(doc._id)
  }
  // eslint-disable-next-line no-console
  console.log('Done. Re-run: npx tsx scripts/auditSoqtapataCms.ts')
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
