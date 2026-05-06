import {defineField, defineType} from 'sanity'

export const experiencePageInternalNav = defineType({
  name: 'experiencePageInternalNav',
  title: 'Menú interno (sticky)',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'internalNavItem'}],
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'fromLabel',
      title: 'From label',
      type: 'string',
      validation: (Rule) => Rule.max(40),
      description: 'Etiqueta antes del precio (p. ej. «From»).',
    }),
    defineField({
      name: 'priceText',
      title: 'Price text',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'priceSuffix',
      title: 'Price suffix',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Segunda línea o aclaración (p. ej. «per person»).',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label (legacy)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL (legacy)',
      type: 'url',
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA',
      type: 'smartLink',
      description: 'Primary editor control for the sticky bar CTA.',
    }),
    defineField({
      name: 'ctaVisible',
      title: 'CTA visible',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
