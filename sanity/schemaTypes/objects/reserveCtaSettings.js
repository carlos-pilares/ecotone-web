import {defineField, defineType} from 'sanity'

/**
 * Shared Reserve / #book block: editorial + card overrides + smart CTAs.
 * Pricing is derived from `experience` documents unless overridden here.
 */
export const reserveCtaSettings = defineType({
  name: 'reserveCtaSettings',
  title: 'Reserve CTA (#book)',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (r) => r.max(100),
    }),
    defineField({
      name: 'title',
      title: 'Title (H2)',
      type: 'string',
      validation: (r) => r.max(140),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (r) => r.max(2000),
    }),
    defineField({
      name: 'priceOverrideText',
      title: 'Price line override',
      type: 'string',
      description:
        'Replaces the derived price line (e.g. “from $986”). Leave empty to use lowest active experience price or “Enquire”.',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'pricePrefixOverride',
      title: 'Price prefix override',
      type: 'string',
      description: 'Default on site: “from”. Only used when building price from numeric amount.',
      validation: (r) => r.max(24),
    }),
    defineField({
      name: 'priceSuffixOverride',
      title: 'Price suffix (small, e.g. / person)',
      type: 'string',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'sublineOverride',
      title: 'Subline under price',
      type: 'string',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'rowsOverride',
      title: 'Card rows override',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'reserveCtaRow',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.max(60)}),
            defineField({name: 'value', title: 'Value', type: 'string', validation: (r) => r.max(200)}),
          ],
          validation: (Rule) =>
            Rule.custom((row) => {
              if (!row || typeof row !== 'object') return true
              const l = typeof row.label === 'string' ? row.label.trim() : ''
              const v = typeof row.value === 'string' ? row.value.trim() : ''
              if (!l && !v) return true
              if (l && v) return true
              return 'Add both label and value, or remove this row'
            }),
          preview: {
            select: {l: 'label', v: 'value'},
            prepare: ({l, v}) => ({title: l || '—', subtitle: v}),
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'primaryCtaSmartLink',
      title: 'Primary CTA',
      type: 'smartLink',
    }),
    defineField({
      name: 'secondaryCtaSmartLink',
      title: 'Secondary CTA',
      type: 'smartLink',
    }),
    defineField({
      name: 'termsSmartLink',
      title: 'Terms & Conditions link',
      type: 'smartLink',
      description: 'Optional. Default is the experience terms anchor when unset.',
    }),
  ],
})
