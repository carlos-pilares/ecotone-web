import {defineField, defineType} from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'experience',
      title: 'Experience (product)',
      type: 'reference',
      to: [{type: 'experience'}],
      description: 'Optional. Links this review to a catalog experience (filters, carousels).',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorCity',
      title: 'Author city',
      type: 'string',
    }),
    defineField({
      name: 'authorCountry',
      title: 'Author country',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Legacy — featured flag',
      type: 'boolean',
      hidden: true,
      initialValue: false,
      description: 'Rotating quotes are chosen per page in the Reviews section; this field is unused.',
    }),
  ],
  preview: {
    select: {title: 'authorName', quote: 'quote', featured: 'isFeatured'},
    prepare({title, quote, featured}) {
      return {
        title: featured ? `★ ${title || 'Guest'}` : (title || 'Guest'),
        subtitle: quote ? String(quote).slice(0, 80) + (String(quote).length > 80 ? '…' : '') : '—',
      }
    },
  },
})
