/**
 * Compara `sections` del mismo `lodgePage` con perspective **published** vs **previewDrafts**.
 * Carga `.env.local` vía primer import.
 *
 * Uso: `npm run diag:lodge-page-sections`
 *
 * Interpretación:
 * - Iguales y vacíos → A (no guardado) o overrides nunca escritos en `sections`.
 * - previewDrafts con datos, published vacío / distinto → B (solo borrador / no publicado).
 * - Iguales y con datos → publicado OK en API (entonces C–E en app: perspective del fetch, merge, UI, cache).
 */
import './loadEnvLocal'

import { createClient } from 'next-sanity'

import { lodgeStructuredPageBySlugQuery } from '@/lib/queries'

const SLUG = 'soqtapata-lodge'

const base = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20',
}

const token =
  process.env.SANITY_API_READ_TOKEN?.trim() || process.env.SANITY_API_TOKEN?.trim() || ''

async function fetchPerspective(perspective: 'published' | 'drafts') {
  const client = createClient({
    ...base,
    useCdn: false,
    perspective,
    ...(perspective === 'drafts' && token ? { token } : {}),
  })
  return client.fetch<{
    _id?: string
    slug?: { current?: string | null }
    internalTitle?: string | null
    sections?: unknown
  } | null>(lodgeStructuredPageBySlugQuery, { slug: SLUG })
}

async function main() {
  if (!base.projectId || !base.dataset) {
    // eslint-disable-next-line no-console
    console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET')
    process.exit(1)
  }

  // eslint-disable-next-line no-console
  console.log('--- published (API perspective=published) ---')
  const pub = await fetchPerspective('published')
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        documentIsNull: pub == null,
        _id: pub?._id ?? null,
        slug: pub?.slug?.current ?? null,
        internalTitle: pub?.internalTitle ?? null,
        sections: pub?.sections ?? null,
      },
      null,
      2,
    ),
  )

  if (!token) {
    // eslint-disable-next-line no-console
    console.log('\n--- drafts: omitido (define SANITY_API_READ_TOKEN o SANITY_API_TOKEN) ---')
    process.exit(0)
  }

  // eslint-disable-next-line no-console
  console.log('\n--- drafts (API perspective=drafts; borrador fusionado; requiere token) ---')
  const draft = await fetchPerspective('drafts')
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        documentIsNull: draft == null,
        _id: draft?._id ?? null,
        slug: draft?.slug?.current ?? null,
        internalTitle: draft?.internalTitle ?? null,
        sections: draft?.sections ?? null,
      },
      null,
      2,
    ),
  )

  const a = JSON.stringify(pub?.sections ?? null)
  const b = JSON.stringify(draft?.sections ?? null)
  // eslint-disable-next-line no-console
  console.log('\n--- diff ---')
  if (pub == null && draft == null) {
    // eslint-disable-next-line no-console
    console.log(
      'Ninguna perspective devolvió documento → slug / dataset / _type (no es A vs B sin doc).',
    )
  } else {
    // eslint-disable-next-line no-console
    console.log(
      a === b
        ? 'sections JSON idéntico entre published y drafts (mismo payload API).'
        : 'sections JSON distinto entre published y drafts → típico de B (solo borrador) o cambio no publicado.',
    )
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
