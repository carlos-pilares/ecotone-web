import {defineField, defineType} from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'experience',
      title: 'Experience (tourism KC)',
      type: 'reference',
      to: [{type: 'experience'}],
      description: 'Tourism Experience Knowledge Center. Use this or Learning Programme below — not both.',
    }),
    defineField({
      name: 'learningProgramme',
      title: 'Learning Programme (experiential learning KC)',
      type: 'reference',
      to: [{type: 'learningProgramme'}],
      description: 'Experiential Learning Knowledge Center. Use this or Experience above — not both.',
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
  validation: (Rule) =>
    Rule.custom((doc) => {
      const hasExp = Boolean(doc?.experience?._ref)
      const hasLp = Boolean(doc?.learningProgramme?._ref)
      if (hasExp && hasLp) {
        return 'Assign either a tourism Experience or a Learning Programme, not both.'
      }
      return true
    }),
  preview: {
    select: {
      title: 'authorName',
      quote: 'quote',
      featured: 'isFeatured',
      expName: 'experience.name',
      lpTitle: 'learningProgramme.title',
    },
    prepare({title, quote, featured, expName, lpTitle}) {
      const product = lpTitle || expName
      const subtitleParts = []
      if (product) subtitleParts.push(product)
      if (quote) subtitleParts.push(String(quote).slice(0, 72) + (String(quote).length > 72 ? '…' : ''))
      return {
        title: featured ? `★ ${title || 'Guest'}` : (title || 'Guest'),
        subtitle: subtitleParts.length ? subtitleParts.join(' · ') : '—',
      }
    },
  },
})
