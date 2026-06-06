'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.jsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

/** Singleton / settings docs: hide Delete in Studio; all other types keep default actions. */
const DELETE_PROTECTED_SCHEMA_TYPES = new Set([
  'siteSettings',
  'bookingModalSettings',
  'reviewsSettings',
  'homePage',
  'routesPage',
  'aboutPage',
  'journalPage',
])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  document: {
    actions: (prev, context) => {
      if (DELETE_PROTECTED_SCHEMA_TYPES.has(context.schemaType)) {
        return prev.filter((a) => a.action !== 'delete')
      }
      return prev
    },
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
