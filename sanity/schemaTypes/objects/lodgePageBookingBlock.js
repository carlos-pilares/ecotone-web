import {defineField, defineType} from 'sanity'

/** Bloque reserva / CTA al pie de la lodge page (override opcional). */
export const lodgePageBookingBlock = defineType({
  name: 'lodgePageBookingBlock',
  title: 'Lodge page — booking block',
  type: 'object',
  fields: [
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
      validation: (Rule) => Rule.max(2000),
    }),
    defineField({
      name: 'ctas',
      title: 'CTA buttons',
      type: 'array',
      of: [{type: 'linkWithLabel'}],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'bookingPrimarySmartLink',
      title: 'Primary CTA (smart link)',
      type: 'smartLink',
      description: 'smartLink overrides legacy fields (first button in CTA list). Optional.',
    }),
    defineField({
      name: 'bookingSecondarySmartLink',
      title: 'Secondary CTA (smart link)',
      type: 'smartLink',
      description: 'smartLink overrides legacy fields (second button in CTA list). Optional.',
    }),
    defineField({
      name: 'trustItemsOverride',
      title: 'Trust items override (optional)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'lodgeTrustOverrideItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              validation: (Rule) => Rule.max(200),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(8),
      description: 'Vacío = usar trustItems del lodge (si aplica en front).',
    }),
  ],
})
