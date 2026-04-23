import {defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'readingMinutes',
      title: 'Reading minutes',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'externalLink',
      title: 'External link',
      type: 'url',
      description: 'URL on the external blog (ecotone.eco or similar)',
      validation: (Rule) =>
        Rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
  ],
  orderings: [
    {
      title: 'Published, newest',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', category: 'category'},
    prepare({title, date, category}) {
      return {
        title: title || 'Untitled',
        subtitle: [category, date && new Date(date).toLocaleDateString()].filter(Boolean).join(' · '),
      }
    },
  },
})
