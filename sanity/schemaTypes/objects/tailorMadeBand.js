import {defineField, defineType} from 'sanity'

/**
 * Shared horizontal Tailor Made band (eyebrow, title, subtitle, smart-link CTA).
 * Used on Home, Lodge, and resolved from Experience page related fields.
 */
export const tailorMadeBand = defineType({
  name: 'tailorMadeBand',
  title: 'Tailor Made band',
  type: 'object',
  fields: [
    defineField({
      name: 'showTailorMade',
      title: 'Show Tailor Made band',
      type: 'boolean',
      initialValue: false,
      description: 'When off, the band is hidden on the public site.',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA (smart link)',
      type: 'smartLink',
      description: 'Button label comes from the smart link. If the link is hidden or off, no button is shown.',
    }),
    defineField({
      name: 'tailorMadeEyebrow',
      title: 'Eyebrow (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'tailorMadeTitle',
      title: 'Title (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'tailorMadeBody',
      title: 'Body (legacy)',
      type: 'text',
      hidden: true,
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'tailorMadeCta',
      title: 'CTA smart link (legacy)',
      type: 'smartLink',
      hidden: true,
      options: {relaxTargetValidation: true},
    }),
    defineField({
      name: 'enabled',
      title: 'Show band (legacy)',
      type: 'boolean',
      hidden: true,
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy)',
      type: 'text',
      hidden: true,
    }),
    defineField({
      name: 'image',
      title: 'Image (legacy)',
      type: 'image',
      hidden: true,
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt (legacy)',
      type: 'string',
      hidden: true,
    }),
  ],
})
