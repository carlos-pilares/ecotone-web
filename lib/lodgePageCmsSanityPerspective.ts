import { createClient, type SanityClient } from 'next-sanity'

import type { LodgePageResolvedPayload, LodgeStructuredPageRow } from '@/lib/lodgePageCmsTypes'

/**
 * Perspectiva de la API Content Lake para `getLodgePageCms` / `getSoqtapataLodgePageCms`.
 *
 * - **published** (por defecto): solo documentos publicados → overrides no publicados no aparecen.
 * - **previewDrafts**: borrador fusionado sobre publicado → requiere token con lectura.
 * - **raw**: documentos tal cual en API (avanzado) → requiere token.
 *
 * Diagnóstico: `SANITY_LODGE_PAGE_CMS_PERSPECTIVE=drafts` (o `previewDrafts`) + token de lectura.
 */
export type LodgePageCmsSanityPerspective = 'published' | 'previewDrafts' | 'raw'

/** Perspectiva que acepta `@sanity/client` v7 (`previewDrafts` → `drafts` en API). */
export type LodgePageCmsSanityApiPerspective = 'published' | 'drafts' | 'raw'

export type LodgePageCmsSanityFetchMeta = {
  requestedPerspective: LodgePageCmsSanityPerspective
  /** Perspectiva lógica (puede forzarse a `published` si falta token). */
  effectivePerspective: LodgePageCmsSanityPerspective
  /** Argumento real `perspective` del cliente Sanity. */
  sanityApiPerspective: LodgePageCmsSanityApiPerspective
  tokenPresent: boolean
  fallbackReason: string | null
}

function toSanityApiPerspective(p: LodgePageCmsSanityPerspective): LodgePageCmsSanityApiPerspective {
  if (p === 'previewDrafts') return 'drafts'
  if (p === 'raw') return 'raw'
  return 'published'
}

function parsePerspective(v: string | undefined): LodgePageCmsSanityPerspective {
  const t = v?.trim().toLowerCase()
  if (!t || t === 'published') return 'published'
  if (t === 'previewdrafts' || t === 'preview_drafts' || t === 'drafts') return 'previewDrafts'
  if (t === 'raw') return 'raw'
  return 'published'
}

function readSanityReadToken(): string {
  return (
    process.env.SANITY_API_READ_TOKEN?.trim() ||
    process.env.SANITY_API_TOKEN?.trim() ||
    ''
  )
}

export function resolveLodgePageCmsSanityFetchMeta(): LodgePageCmsSanityFetchMeta {
  const requestedPerspective = parsePerspective(process.env.SANITY_LODGE_PAGE_CMS_PERSPECTIVE)
  const token = readSanityReadToken()
  const needsToken = requestedPerspective === 'previewDrafts' || requestedPerspective === 'raw'

  if (needsToken && !token) {
    return {
      requestedPerspective,
      effectivePerspective: 'published',
      sanityApiPerspective: 'published',
      tokenPresent: false,
      fallbackReason:
        'SANITY_LODGE_PAGE_CMS_PERSPECTIVE is drafts/previewDrafts/raw but SANITY_API_READ_TOKEN / SANITY_API_TOKEN is missing; using published.',
    }
  }

  const effectivePerspective = requestedPerspective
  return {
    requestedPerspective,
    effectivePerspective,
    sanityApiPerspective: toSanityApiPerspective(effectivePerspective),
    tokenPresent: Boolean(token),
    fallbackReason: null,
  }
}

/** Cliente dedicado a la query `lodgePage` (perspective + token acotados a esta lectura). */
export function createLodgePageCmsSanityClient(): {
  client: SanityClient
  meta: LodgePageCmsSanityFetchMeta
} {
  const meta = resolveLodgePageCmsSanityFetchMeta()
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
  const token = readSanityReadToken()

  if (meta.fallbackReason && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn('[lodgePageCms]', meta.fallbackReason)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: meta.sanityApiPerspective,
    ...(meta.sanityApiPerspective !== 'published' && token ? { token } : {}),
  })

  return { client, meta }
}

/** Log único en dev: discrimina A–E (guardado / draft / wire / merge / UI) sin tocar diseño. */
export function logLodgePageCmsDiagnosis(args: {
  slug: string
  meta: LodgePageCmsSanityFetchMeta
  row: LodgeStructuredPageRow | null
  cmsError: string | null
  merged: LodgePageResolvedPayload
}): void {
  if (process.env.NODE_ENV !== 'development') return

  const { slug, meta, row, cmsError, merged } = args
  const sec = row?.sections

  const notes: string[] = []
  if (cmsError) notes.push(`Fetch error: ${cmsError} → revisar red / proyecto / dataset (rama C parcial).`)
  if (!row) notes.push('row es null → slug sin documento publicado en esta perspective, o query vacía (C).')
  else if (!row.lodge) notes.push('row.lodge es null → referencia rota o permisos; merge cae en fallback (C/D límite).')
  if (meta.requestedPerspective === 'published' && meta.effectivePerspective === 'published') {
    notes.push(
      'Perspective published: si solo guardaste borrador en Studio, publica el documento o usa SANITY_LODGE_PAGE_CMS_PERSPECTIVE=drafts + token (B vs A).',
    )
  }
  if (meta.fallbackReason) notes.push(meta.fallbackReason)

  const overviewOverrideTitle =
    typeof sec?.overview?.title === 'string' ? sec.overview.title.trim() : ''
  const mergedTitle = merged.overview.title
  if (row?.lodge && merged.source === 'cms' && overviewOverrideTitle && mergedTitle !== overviewOverrideTitle) {
    notes.push('sections.overview.title distinto de resolved.overview.title → sospecha D (merge) o E (componente).')
  }

  // eslint-disable-next-line no-console
  console.log(
    '[lodgePageCms DIAG]',
    JSON.stringify(
      {
        slug,
        requestedSanityPerspective: meta.requestedPerspective,
        effectiveSanityPerspective: meta.effectivePerspective,
        sanityApiPerspective: meta.sanityApiPerspective,
        sanityTokenPresent: meta.tokenPresent,
        perspectiveFallbackReason: meta.fallbackReason,
        lodgePageId: merged.doc?.lodgePageId ?? row?._id ?? null,
        source: merged.source,
        cmsError,
        'sections.overview': sec?.overview ?? null,
        'sections.accommodation': sec?.accommodation ?? null,
        'sections.facilities': sec?.facilities ?? null,
        'sections.reviews': sec?.reviews ?? null,
        'resolved.overview.title': merged.overview.title,
        'resolved.overview.body': merged.overview.body,
        notes,
        sanityVisionQueryPublished:
          '*[_type == "lodgePage" && slug.current == "soqtapata-lodge"][0]{ _id, sections }',
      },
      null,
      2,
    ),
  )
}
