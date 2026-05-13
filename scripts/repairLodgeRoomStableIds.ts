/**
 * Normalizes `lodge.rooms[].stableId` when missing or not slug-like, derived from `name`
 * (and ensures uniqueness). Preserves `_key` and other room fields.
 *
 * Usage:
 *   npx tsx scripts/repairLodgeRoomStableIds.ts           # dry-run (log only)
 *   npx tsx scripts/repairLodgeRoomStableIds.ts -- --commit
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 *
 * First import must load `.env.local` before `sanityWriteClient` is evaluated (ESM import order).
 */
import './loadEnvLocal.js'

import { readClient, writeClient } from './seed/sanityWriteClient.js'

const SLUG_LIKE = /^[a-z0-9][a-z0-9-]*$/

const LODGE_QUERY = `*[_type == "lodge"]{ _id, name, rooms }`

type RoomRow = {
  _key?: string
  stableId?: string | null
  name?: string | null
  [k: string]: unknown
}

type LodgeFetchRow = {_id: string; name?: string; rooms?: RoomRow[] | null}

function is401(err: unknown): boolean {
  const e = err as { statusCode?: number; response?: { statusCode?: number } }
  return e?.statusCode === 401 || e?.response?.statusCode === 401
}

async function fetchLodgesForDryRun(): Promise<LodgeFetchRow[]> {
  try {
    return await writeClient().fetch<LodgeFetchRow[]>(LODGE_QUERY)
  } catch (err) {
    if (is401(err)) {
      // eslint-disable-next-line no-console
      console.warn(
        '[repair-lodge-rooms] Authenticated GROQ failed (401). Using public CDN read (no token). ' +
          'This is fine for dry-run. For --commit, set SANITY_API_TOKEN to a real API token (sk…) with Editor access from https://www.sanity.io/manage → API → Tokens.',
      )
      return readClient().fetch<LodgeFetchRow[]>(LODGE_QUERY)
    }
    throw err
  }
}

async function fetchLodgesForCommit(): Promise<LodgeFetchRow[]> {
  try {
    return await writeClient().fetch<LodgeFetchRow[]>(LODGE_QUERY)
  } catch (err) {
    if (is401(err)) {
      throw new Error(
        'Cannot commit: SANITY_API_TOKEN was rejected (401 Unauthorized / Session not found). ' +
          'Use a robot API token from https://www.sanity.io/manage → your project → API → Tokens (Editor). ' +
          'Do not use a Studio session string or a placeholder value in .env.local.',
      )
    }
    throw err
  }
}

function slugFromName(name: string, index1: number): string {
  const raw = (name ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  if (raw && SLUG_LIKE.test(raw)) return raw
  const fallback = `room-${index1}`
  let s = raw || fallback
  if (!/^[a-z0-9]/.test(s)) s = `r-${s}`
  s = s.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || fallback
  if (!SLUG_LIKE.test(s)) return fallback
  return s
}

function needsRepair(id: string | undefined | null): boolean {
  const t = (id ?? '').trim()
  return !t || !SLUG_LIKE.test(t)
}

function uniquifyStableIds(rooms: RoomRow[]): RoomRow[] {
  const used = new Set<string>()
  return rooms.map((r, i) => {
    let id = (r.stableId ?? '').trim()
    if (needsRepair(id)) {
      id = slugFromName(String(r.name ?? ''), i + 1)
    }
    let candidate = id
    let n = 2
    while (used.has(candidate)) {
      candidate = `${id}-${n}`
      n += 1
    }
    used.add(candidate)
    if (candidate === (r.stableId ?? '').trim()) return r
    return { ...r, stableId: candidate }
  })
}

function roomsChanged(before: RoomRow[], after: RoomRow[]): boolean {
  if (before.length !== after.length) return true
  for (let i = 0; i < before.length; i++) {
    if ((before[i]?.stableId ?? '').trim() !== (after[i]?.stableId ?? '').trim()) return true
  }
  return false
}

async function main() {
  const commit = process.argv.includes('--commit')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? ''
  const tokenPresent = Boolean(process.env.SANITY_API_TOKEN?.trim())

  // eslint-disable-next-line no-console
  console.log('[repair-lodge-rooms] diagnostics (no secrets printed)')
  // eslint-disable-next-line no-console
  console.log(`  projectId: ${projectId || '(missing)'}`)
  // eslint-disable-next-line no-console
  console.log(`  dataset: ${dataset || '(missing)'}`)
  // eslint-disable-next-line no-console
  console.log(`  SANITY_API_TOKEN present: ${tokenPresent ? 'yes' : 'no'}`)
  // eslint-disable-next-line no-console
  console.log(`  commit mode: ${commit ? 'yes' : 'no'}`)

  const client = commit ? writeClient() : null
  const lodges = commit ? await fetchLodgesForCommit() : await fetchLodgesForDryRun()

  let patched = 0
  for (const doc of lodges) {
    const rooms = Array.isArray(doc.rooms) ? doc.rooms : []
    if (!rooms.length) continue
    const next = uniquifyStableIds(rooms)
    if (!roomsChanged(rooms, next)) continue
    // eslint-disable-next-line no-console
    console.log(`[${commit ? 'APPLY' : 'dry-run'}] ${doc._id} (${doc.name ?? 'untitled'})`)
    for (let i = 0; i < rooms.length; i++) {
      const a = (rooms[i]?.stableId ?? '').trim()
      const b = (next[i]?.stableId ?? '').trim()
      if (a !== b) {
        // eslint-disable-next-line no-console
        console.log(`  room[${i}] stableId: ${JSON.stringify(a)} -> ${JSON.stringify(b)} (name: ${JSON.stringify(rooms[i]?.name)})`)
      }
    }
    if (commit) {
      await client!.patch(doc._id).set({rooms: next}).commit()
      patched += 1
    }
  }
  if (!commit) {
    // eslint-disable-next-line no-console
    console.log('\nDry run only. Re-run with -- --commit to write patches.')
  } else {
    // eslint-disable-next-line no-console
    console.log(`\nPatched ${patched} lodge document(s).`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
