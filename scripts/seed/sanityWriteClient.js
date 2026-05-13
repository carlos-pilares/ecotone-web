import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'node:path'

config({ path: resolve(process.cwd(), '.env.local') })

/**
 * Read env at call time so scripts can `import './loadEnvLocal'` (or call `config()`)
 * after this module is evaluated — module-level captures would stay undefined and
 * mutations would run without a token (`Unauthorized - Session not found`).
 */
export function writeClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
  const token = process.env.SANITY_API_TOKEN?.trim()
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  }
  if (!token) {
    throw new Error('Missing SANITY_API_TOKEN. Add it to .env.local and run again.')
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false })
}

/** Public GROQ (no token). Use when the dataset allows CDN reads; falls back if write token is missing or invalid. */
export function readClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  }
  return createClient({ projectId, dataset, apiVersion, useCdn: true })
}

/**
 * @param {import('@sanity/client').SanityClient} client
 * @param {string} url
 * @param {string} filename
 */
export async function uploadImageFromUrl(client, url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${url} (${res.status})`)
  const buf = Buffer.from(await res.arrayBuffer())
  const type = res.headers.get('content-type') || 'image/jpeg'
  const doc = await client.assets.upload('image', buf, {
    contentType: type,
    filename: filename || 'image.jpg',
  })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: doc._id,
    },
  }
}

/**
 * Upload a local file (e.g. SVG) as a Sanity image asset. Same shape as `uploadImageFromUrl` for `image` fields.
 * @param {import('@sanity/client').SanityClient} client
 * @param {string} absolutePath
 * @param {string} [filename] Filename stored in the asset (defaults to basename of path)
 */
export async function uploadImageFileFromPath(client, absolutePath, filename) {
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing file: ${absolutePath}`)
  }
  const buf = await readFile(absolutePath)
  const name = filename || absolutePath.split(/[/\\]/).pop() || 'asset'
  const lower = name.toLowerCase()
  const contentType = lower.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
  const doc = await client.assets.upload('image', buf, {
    contentType,
    filename: name,
  })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: doc._id,
    },
  }
}
