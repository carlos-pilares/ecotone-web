import {defineField, defineType} from 'sanity'

/** Singleton `_id == "journalPage"` — copy for `/journal` index hero + index SEO. */
export const journalPage = defineType({
  name: 'journalPage',
  title: 'Journal (index)',
  type: 'document',
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero intro',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'showTagFilter',
      title: 'Show tag filter on index',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Journal index'}),
  },
})
