import type { SanityClient } from '@sanity/client'

export const ABOUT_PAGE_DRAFT_ID = 'drafts.aboutPage'

export async function removeAboutPageDraft(client: SanityClient): Promise<void> {
  try {
    await client.delete(ABOUT_PAGE_DRAFT_ID)
  } catch (e) {
    const s = e instanceof Error ? e.message : String(e)
    if (/\bnot\s*found\b|HTTP\s*404|404|does not exist|Document not found/i.test(s)) {
      return
    }
    throw e
  }
}
