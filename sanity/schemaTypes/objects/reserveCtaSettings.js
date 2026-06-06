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
      name: 'priceSource',
      title: 'Price source',
      type: 'string',
      options: {
        list: [
          {title: 'Use linked product price', value: 'linked'},
          {title: 'Custom price', value: 'custom'},
        ],
        layout: 'radio',
      },
      initialValue: 'linked',
      description:
        'Experience / Learning Programme pages: linked = price from the linked KC. Lodge / Home / Routes: linked = selected or lowest experience price.',
    }),
    defineField({
      name: 'priceLinkedExperienceRef',
      title: 'Experience for price',
      type: 'reference',
      to: [{type: 'experience'}],
      hidden: ({parent, document}) =>
        parent?.priceSource !== 'linked' || document?._type !== 'lodgePage',
      description:
        'Lodge pages only. When set, shows this experience’s price on the reserve card. Empty = lowest price among lodge experiences.',
    }),
    defineField({
      name: 'customPriceText',
      title: 'Custom price',
      type: 'string',
      hidden: ({parent}) => parent?.priceSource !== 'custom',
      description: 'Main price amount when source is Custom (e.g. “USD 1,800”). Prefix and suffix are configured separately below.',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'priceOverrideText',
      title: 'Price line override (legacy)',
      type: 'string',
      hidden: true,
      description: 'Deprecated — use Custom price + prefix/suffix. Still read for older documents.',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'pricePrefixOverride',
      title: 'Price prefix',
      type: 'string',
      description: 'Small text before the amount (e.g. “from”). Empty = hide prefix. Unset on old pages defaults to “from”.',
      validation: (r) => r.max(24),
    }),
    defineField({
      name: 'priceSuffixOverride',
      title: 'Price suffix',
      type: 'string',
      description: 'Small text beside/below the amount (e.g. “per person”). Empty = hide suffix. Unset on old pages defaults to “per person”.',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'sublineOverride',
      title: 'Subline under price',
      type: 'string',
      description: 'Free text under the suffix line (e.g. “all inclusive”). Empty = hide.',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'experienceReserveRows',
      title: 'Reserve card rows — select source or override',
      type: 'array',
      description:
        'Experience landing only: each row pulls from the linked experience (route, duration, pickup summary, etc.) unless you override label/value. Order: use list order, or set “Order” on each row.',
      of: [{type: 'experienceReserveCardRow'}],
      hidden: ({document}) => document?._type !== 'experiencePage',
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'rowsOverride',
      title: 'Card rows override (legacy)',
      type: 'array',
      description:
        'Manual label/value rows. On Experience pages, prefer “Reserve card rows — select source or override” above; this field is hidden there but still works for old content.',
      hidden: ({document}) => document?._type === 'experiencePage',
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
      name: 'trustItems',
      title: 'Trust strip items',
      type: 'array',
      description: 'Icons + labels under the card CTAs. Leave empty to use site defaults.',
      of: [
        {
          type: 'object',
          name: 'reserveCtaTrustItem',
          fields: [
            defineField({
              name: 'iconKey',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Shield', value: 'shield'},
                  {title: 'Check', value: 'check'},
                  {title: 'Heart', value: 'heart'},
                ],
                layout: 'radio',
              },
              initialValue: 'shield',
            }),
            defineField({
              name: 'text',
              title: 'Label',
              type: 'string',
              validation: (r) => r.max(80),
            }),
          ],
          preview: {
            select: {t: 'text', i: 'iconKey'},
            prepare: ({t, i}) => ({title: t || '—', subtitle: i || 'shield'}),
          },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'termsPrefixText',
      title: 'Terms sentence — text before the link',
      type: 'string',
      description: 'Default: “By booking, you agree to our”.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'termsLinkLabel',
      title: 'Terms sentence — link label',
      type: 'string',
      description: 'Default: “Terms & Conditions”.',
      validation: (r) => r.max(120),
    }),
    defineField({
      name: 'termsSuffixText',
      title: 'Terms sentence — after the link',
      type: 'string',
      description: 'Default: a single period (.). Use empty to omit.',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'termsSmartLink',
      title: 'Terms & Conditions link',
      type: 'smartLink',
      description: 'Target URL. Default is the experience terms anchor when unset.',
    }),
  ],
})
