/**
 * Count stored attributes per Sanity document (approximates Sanity's 2000/doc limit).
 *
 *   npx tsx scripts/diagnoseSanityDocumentAttributes.ts
 *   npx tsx scripts/diagnoseSanityDocumentAttributes.ts --id=<documentId>
 *   npx tsx scripts/diagnoseSanityDocumentAttributes.ts --type=experiencePage
 *
 * Requires .env.local (project, dataset, SANITY_API_TOKEN).
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'

import { readClient, writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

const LIMIT = 2000
const DOC_TYPES = [
  'experiencePage',
  'learningProgramme',
  'experience',
  'lodgePage',
  'lodge',
  'homePage',
  'routesPage',
  'aboutPage',
] as const

type AttrBreakdown = { path: string; count: number }

function countAttributes(value: unknown, path = ''): { total: number; breakdown: Map<string, number> } {
  const breakdown = new Map<string, number>()

  function walk(v: unknown, p: string): number {
    if (v === null || v === undefined) return 0
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      breakdown.set(p || '(root)', (breakdown.get(p || '(root)') ?? 0) + 1)
      return 1
    }
    if (Array.isArray(v)) {
      let n = 1
      breakdown.set(p || '(root)', (breakdown.get(p || '(root)') ?? 0) + 1)
      for (let i = 0; i < v.length; i++) {
        n += walk(v[i], `${p}[${i}]`)
      }
      return n
    }
    if (typeof v === 'object') {
      let n = 1
      breakdown.set(p || '(root)', (breakdown.get(p || '(root)') ?? 0) + 1)
      for (const [k, child] of Object.entries(v as Record<string, unknown>)) {
        if (k.startsWith('_') && k !== '_key' && k !== '_ref' && k !== '_type') continue
        const childPath = p ? `${p}.${k}` : k
        n += walk(child, childPath)
      }
      return n
    }
    return 0
  }

  const total = walk(value, path)
  return { total, breakdown }
}

function topLevelContributors(doc: Record<string, unknown>): AttrBreakdown[] {
  const out: AttrBreakdown[] = []
  for (const key of Object.keys(doc)) {
    if (key === '_rev' || key === '_updatedAt' || key === '_createdAt') continue
    const { total } = countAttributes(doc[key], key)
    if (total > 0) out.push({ path: key, count: total })
  }
  return out.sort((a, b) => b.count - a.count)
}

function docTitle(doc: Record<string, unknown>): string {
  const t =
    doc.internalTitle ??
    doc.title ??
    doc.name ??
    doc.slug ??
    doc._id
  if (typeof t === 'object' && t && 'current' in t) return String((t as { current?: string }).current ?? doc._id)
  return String(t ?? doc._id)
}

function sanityQueryClient() {
  const token = process.env.SANITY_API_TOKEN?.trim()
  if (token && !token.includes('TU_TOKEN_AQUI')) {
    return writeClient().withConfig({ perspective: 'raw', useCdn: false })
  }
  return readClient().withConfig({ perspective: 'raw', useCdn: false })
}

async function main() {
  const client = sanityQueryClient()
  const idArg = process.argv.find((a) => a.startsWith('--id='))?.split('=')[1]
  const typeArg = process.argv.find((a) => a.startsWith('--type='))?.split('=')[1]

  let query = `*[_type in $types]{ ... }`
  let params: Record<string, unknown> = { types: typeArg ? [typeArg] : DOC_TYPES }

  if (idArg) {
    query = `*[_id in [$id, "drafts." + $id]]{ ... }`
    params = { id: idArg.replace(/^drafts\./, '') }
  }

  const docs = await client.fetch<Array<Record<string, unknown>>>(query, params)

  const ranked = docs
    .map((doc) => ({
      doc,
      total: countAttributes(doc).total,
      top: topLevelContributors(doc),
    }))
    .sort((a, b) => b.total - a.total)

  // eslint-disable-next-line no-console
  console.log(`\n=== Document attribute audit (${docs.length} docs) ===\n`)

  const overLimit = ranked.filter((r) => r.total > LIMIT)
  if (overLimit.length) {
    // eslint-disable-next-line no-console
    console.log(`⚠ ${overLimit.length} document(s) OVER ${LIMIT} attribute limit:\n`)
    for (const r of overLimit) {
      printDocDetail(r.doc, r.total, r.top)
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`No documents exceed ${LIMIT} (highest counts below).\n`)
  }

  // eslint-disable-next-line no-console
  console.log('--- Top 15 by attribute count ---\n')
  for (const r of ranked.slice(0, 15)) {
    printDocSummary(r.doc, r.total, r.top)
  }

  if (idArg && ranked[0]) {
    // eslint-disable-next-line no-console
    console.log('\n--- Nested breakdown (top paths) ---\n')
    const { breakdown } = countAttributes(ranked[0].doc)
    const paths = [...breakdown.entries()]
      .filter(([p]) => p.split('.').length <= 2 || p.includes('['))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
    for (const [p, c] of paths) {
      // eslint-disable-next-line no-console
      console.log(`  ${c.toString().padStart(5)}  ${p}`)
    }
  }
}

function printDocSummary(doc: Record<string, unknown>, total: number, top: AttrBreakdown[]) {
  const flag = total > LIMIT ? ' ⚠ OVER LIMIT' : ''
  // eslint-disable-next-line no-console
  console.log(
    `${total.toString().padStart(5)}  ${String(doc._type).padEnd(18)}  ${String(doc._id).padEnd(40)}  ${docTitle(doc)}${flag}`,
  )
  // eslint-disable-next-line no-console
  console.log(`       top: ${top.slice(0, 5).map((t) => `${t.path}(${t.count})`).join(', ')}\n`)
}

function printDocDetail(doc: Record<string, unknown>, total: number, top: AttrBreakdown[]) {
  // eslint-disable-next-line no-console
  console.log(`DOCUMENT: ${doc._id}`)
  // eslint-disable-next-line no-console
  console.log(`  type:  ${doc._type}`)
  // eslint-disable-next-line no-console
  console.log(`  title: ${docTitle(doc)}`)
  // eslint-disable-next-line no-console
  console.log(`  attrs: ${total} (limit ${LIMIT}, over by ${total - LIMIT})\n`)
  // eslint-disable-next-line no-console
  console.log('  Top-level field contributors:')
  for (const t of top.slice(0, 20)) {
    // eslint-disable-next-line no-console
    console.log(`    ${t.count.toString().padStart(5)}  ${t.path}`)
  }
  // eslint-disable-next-line no-console
  console.log('')
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
