/**
 * Read-only: fetch key documents and print which string/array fields are empty.
 * Run: npx tsx scripts/auditCms.ts
 * Requires NEXT_PUBLIC_SANITY_* in .env.local (token optional for public dataset read — uses API token if set).
 */
import { createClient } from 'next-sanity'
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { CMS_IDS } from '@/data/cmsApproved/ids'

config({ path: resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === 'object') {
    if ('asset' in (v as object) && (v as { asset?: { _ref?: string } }).asset?._ref) return false
    if ('_ref' in (v as object) && (v as { _ref?: string })._ref) return false
  }
  return false
}

function missingFields(obj: unknown, path = ''): string[] {
  if (obj === null || obj === undefined) return [path || '(null)']
  if (Array.isArray(obj)) {
    if (obj.length === 0) return [path || '(array)']
    return obj.flatMap((x, i) => missingFields(x, `${path}[${i}]`))
  }
  if (typeof obj !== 'object') return isEmpty(obj) ? [path] : []
  const o = obj as Record<string, unknown>
  const keys = Object.keys(o)
  if (keys.length === 0) return [path]
  const out: string[] = []
  for (const k of keys) {
    if (k === '_id' || k === '_type' || k === '_rev' || k === '_createdAt' || k === '_updatedAt') continue
    const v = o[k]
    const p = path ? `${path}.${k}` : k
    if (v === null || v === undefined) {
      out.push(p)
    } else if (typeof v === 'string' && v.trim() === '') {
      out.push(p)
    } else if (Array.isArray(v) && v.length === 0) {
      out.push(p)
    } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      if ('_type' in v && (v as { _type: string })._type === 'image' && 'asset' in v) {
        if (!(v as { asset?: { _ref?: string } }).asset?._ref) out.push(p)
        continue
      }
      if ('_type' in v && (v as { _type: string })._type === 'reference' && '_ref' in v) {
        if (!(v as { _ref?: string })._ref) out.push(p)
        continue
      }
      if ('_type' in v && (v as { _type: string })._type === 'slug' && 'current' in v) {
        if (isEmpty((v as { current?: string }).current)) out.push(p)
        continue
      }
      if ('_key' in v) continue
      out.push(...missingFields(v, p))
    }
  }
  return out
}

const IDS = [
  CMS_IDS.siteSettings,
  CMS_IDS.homePage,
  CMS_IDS.experienceSoqtapata,
  CMS_IDS.experiencePageSoqtapata,
  CMS_IDS.routeCamanti,
  CMS_IDS.lodgeSoqtapata,
] as const

async function main() {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or DATASET')
  }
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: token || undefined,
  })
  for (const id of IDS) {
    const q = `*[_id == $id][0]`
    const doc = await client.fetch<Record<string, unknown> | null>(q, { id })
    if (!doc) {
      // eslint-disable-next-line no-console
      console.log(`\n[${id}] — NOT FOUND (run seed or seed:cms).`)
      continue
    }
    const m = missingFields(doc)
    // eslint-disable-next-line no-console
    console.log(`\n[${id}] _type=${doc._type}`)
    // eslint-disable-next-line no-console
    if (m.length) console.log('  empty / missing:', m.slice(0, 40).join(', ') + (m.length > 40 ? ` … +${m.length - 40}` : ''))
    else console.log('  (no empty top-level string/array branches detected in shallow scan)')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
