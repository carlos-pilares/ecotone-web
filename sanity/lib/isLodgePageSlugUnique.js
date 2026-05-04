import {apiVersion} from '../env'

/**
 * Slug unique only among `lodgePage` documents (excludes `lodge`, `experiencePage`, etc.).
 * Excludes the current document’s draft + published ids so editing one does not conflict with itself.
 */
export async function isLodgePageSlugUnique(slug, context) {
  const current = typeof slug === 'string' ? slug.trim() : slug?.current?.trim()
  if (!current) return true

  const {document, getClient} = context
  const docId = document?._id
  if (!docId) return true

  const client = getClient({apiVersion})
  const baseId = docId.replace(/^drafts\./, '')
  const excludeIds = [`drafts.${baseId}`, baseId]

  const count = await client.fetch(
    `count(*[_type == "lodgePage" && slug.current == $slug && !(_id in $excludeIds)])`,
    {slug: current, excludeIds},
  )
  return count === 0
}
