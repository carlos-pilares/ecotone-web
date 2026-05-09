import {defineField, defineType} from 'sanity'

/**
 * Singleton (`documentId`: `reviewsSettings`) — global Trustpilot-style summary
 * reused on every page that shows the reviews block.
 */
export const reviewsSettings = defineType({
  name: 'reviewsSettings',
  title: 'Reviews — global summary',
  type: 'document',
  description:
    'One place for the rating block (big score, stars, “N verified reviews”, provider badge) shown on **every** Reviews section. Pages only pick which review **quotes** and **cards** to show — they do not repeat these numbers here.',
  groups: [
    {name: 'score', title: '1 · Score & count', default: true},
    {name: 'provider', title: '2 · Provider & link'},
  ],
  fields: [
    defineField({
      name: 'ratingValue',
      title: 'Overall rating (0–5)',
      type: 'number',
      group: 'score',
      description: 'Shown as the large score and drives the star row (supports decimals, e.g. 4.9).',
      validation: (Rule) => Rule.required().min(0).max(5),
      initialValue: 4.9,
    }),
    defineField({
      name: 'reviewCount',
      title: 'Total review count',
      type: 'number',
      group: 'score',
      description: 'Shown under the stars (e.g. “12 verified reviews”).',
      validation: (Rule) => Rule.required().integer().min(0),
      initialValue: 12,
    }),
    defineField({
      name: 'reviewProviderName',
      title: 'Provider name',
      type: 'string',
      group: 'provider',
      description: 'Label next to the green badge (e.g. Trustpilot).',
      validation: (Rule) => Rule.required().max(80),
      initialValue: 'Trustpilot',
    }),
    defineField({
      name: 'reviewProviderLogo',
      title: 'Provider logo image',
      type: 'image',
      group: 'provider',
      options: {hotspot: true},
      description: 'Optional. If empty, the site uses the default star-in-square mark.',
    }),
    defineField({
      name: 'reviewProviderLogoAlt',
      title: 'Logo alt text',
      type: 'string',
      group: 'provider',
      description: 'Describe the logo for screen readers (e.g. “Trustpilot logo”).',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'reviewProviderUrl',
      title: 'Provider profile URL (optional)',
      type: 'url',
      group: 'provider',
      description: 'If set, clicking the badge opens this URL in a new tab.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Reviews — global summary'}),
  },
})
