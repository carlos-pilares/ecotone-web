import type { SanityClient } from '@sanity/client'

/** Borrador que Studio puede abrir en lugar del publicado; vacío → pestañas sin arrays/imagen. */
export const ROUTES_PAGE_DRAFT_ID = 'drafts.routesPage'

export async function removeRoutesPageDraft(client: SanityClient): Promise<void> {
  try {
    await client.delete(ROUTES_PAGE_DRAFT_ID)
  } catch (e) {
    const s = e instanceof Error ? e.message : String(e)
    if (/\bnot\s*found\b|HTTP\s*404|404|does not exist|Document not found/i.test(s)) {
      return
    }
    throw e
  }
}
