import {defineArrayMember, defineField, defineType} from 'sanity'

/** Reviews curation on `experiencePage` — section copy lives in Section presentation (`sectionModules`). */
export const experiencePageReviewsSection = defineType({
  name: 'experiencePageReviewsSection',
  title: 'Reviews section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'title',
      title: 'Title (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body (legacy)',
      type: 'text',
      rows: 4,
      hidden: true,
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
