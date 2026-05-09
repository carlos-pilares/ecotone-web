import {defineArrayMember, defineField, defineType} from 'sanity'

/** Curated reviews block: copy + ordered refs (shared by Home, Routes, Experience page, Lodge page). */
export const pageReviewsSection = defineType({
  name: 'pageReviewsSection',
  title: 'Reviews section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      description: 'Optional. When empty, nothing is shown (no placeholder spacing).',
    }),
    defineField({
      name: 'rotatingReviews',
      title: 'Rotating quotes (hero)',
      type: 'array',
      description: 'Up to 3. Order is preserved on the site.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'review'}],
        }),
      ],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: 'reviewCards',
      title: 'Review cards (carousel)',
      type: 'array',
      description: 'Up to 4. Order is preserved on the site.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'review'}],
        }),
      ],
      validation: (Rule) => Rule.max(4).unique(),
    }),
  ],
})
