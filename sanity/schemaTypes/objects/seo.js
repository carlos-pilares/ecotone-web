import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Recommended ~50–60 characters.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Recommended ~150–160 characters.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'No index (hide from search engines)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
