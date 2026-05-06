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
      title: 'CTA buttons (legacy)',
      type: 'array',
      of: [{type: 'linkWithLabel'}],
      validation: (Rule) => Rule.max(4),
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'bookingPrimarySmartLink',
      title: 'Primary CTA',
      type: 'smartLink',
      description: 'Primary editor control for the first booking button.',
    }),
    defineField({
      name: 'bookingSecondarySmartLink',
      title: 'Secondary CTA',
      type: 'smartLink',
      description: 'Primary editor control for the second booking button.',
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
