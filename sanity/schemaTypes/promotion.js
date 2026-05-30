import {defineArrayMember, defineField, defineType} from 'sanity'

const PROGRAM_TYPES = [
  {title: 'Classic Nature (nature-core)', value: 'nature-core'},
  {title: 'Signature Expeditions (family-adventure)', value: 'family-adventure'},
  {title: 'Experiential Learning', value: 'experiential-learning'},
  {title: 'Tailor Made', value: 'tailor-made'},
  {title: 'Legacy: classic-nature', value: 'classic-nature'},
  {title: 'Legacy: signature-expeditions', value: 'signature-expeditions'},
]

const PRICING_MODES = [
  {title: 'Label / legal only (no price change)', value: 'none'},
  {title: 'Percentage discount', value: 'percentageDiscount'},
  {title: 'Fixed final price', value: 'fixedFinalPrice'},
]

export const promotion = defineType({
  name: 'promotion',
  title: 'Promotion / Offer',
  type: 'document',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'scope', title: 'Applies to'},
    {name: 'pricing', title: 'Pricing'},
    {name: 'legal', title: 'Legal copy'},
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      group: 'general',
      initialValue: true,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      group: 'general',
      initialValue: 0,
      description: 'Higher number wins when multiple promotions match one experience.',
      validation: (Rule) => Rule.integer().min(0).max(9999),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date (optional)',
      type: 'datetime',
      group: 'general',
      options: {dateFormat: 'YYYY-MM-DD'},
    }),
    defineField({
      name: 'endDate',
      title: 'End date (optional)',
      type: 'datetime',
      group: 'general',
      options: {dateFormat: 'YYYY-MM-DD'},
    }),
    defineField({
      name: 'promoLabel',
      title: 'Promo label (short)',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().max(80),
      description: 'e.g. “Early access offer” — shown on cards when space allows.',
    }),
    defineField({
      name: 'promoMicrocopy',
      title: 'Promo microcopy (optional)',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'appliesToAll',
      title: 'Applies to all experiences',
      type: 'boolean',
      group: 'scope',
      initialValue: false,
    }),
    defineField({
      name: 'routes',
      title: 'Routes',
      type: 'array',
      group: 'scope',
      of: [defineArrayMember({type: 'reference', to: [{type: 'route'}]})],
      hidden: ({parent}) => parent?.appliesToAll === true,
    }),
    defineField({
      name: 'programTypes',
      title: 'Program types',
      type: 'array',
      group: 'scope',
      of: [defineArrayMember({type: 'string', options: {list: PROGRAM_TYPES}})],
      hidden: ({parent}) => parent?.appliesToAll === true,
    }),
    defineField({
      name: 'experiences',
      title: 'Specific experiences',
      type: 'array',
      group: 'scope',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
      hidden: ({parent}) => parent?.appliesToAll === true,
    }),
    defineField({
      name: 'pricingMode',
      title: 'Pricing mode',
      type: 'string',
      group: 'pricing',
      options: {list: PRICING_MODES, layout: 'radio'},
      initialValue: 'none',
    }),
    defineField({
      name: 'percentageDiscount',
      title: 'Percentage discount',
      type: 'number',
      group: 'pricing',
      hidden: ({parent}) => parent?.pricingMode !== 'percentageDiscount',
      validation: (Rule) => Rule.min(1).max(99),
    }),
    defineField({
      name: 'fixedFinalPrice',
      title: 'Fixed final price (USD)',
      type: 'number',
      group: 'pricing',
      hidden: ({parent}) => parent?.pricingMode !== 'fixedFinalPrice',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'fixedFinalPriceLabel',
      title: 'Fixed final price label (optional)',
      type: 'string',
      group: 'pricing',
      hidden: ({parent}) => parent?.pricingMode !== 'fixedFinalPrice',
      validation: (Rule) => Rule.max(40),
      description: 'Display override, e.g. “USD 976”. Used instead of numeric formatting when set.',
    }),
    defineField({
      name: 'legalText',
      title: 'Legal / offer terms',
      type: 'text',
      group: 'legal',
      rows: 6,
    }),
    defineField({
      name: 'legalSmartLink',
      title: 'Legal link (optional)',
      type: 'smartLink',
      group: 'legal',
    }),
  ],
  preview: {
    select: {
      title: 'internalTitle',
      enabled: 'enabled',
      priority: 'priority',
      pricingMode: 'pricingMode',
      promoLabel: 'promoLabel',
      appliesToAll: 'appliesToAll',
      startDate: 'startDate',
      endDate: 'endDate',
    },
    prepare: ({title, enabled, priority, pricingMode, promoLabel, appliesToAll, startDate, endDate}) => {
      const scope = appliesToAll ? 'All experiences' : 'Scoped'
      const dates = [startDate, endDate].filter(Boolean).length ? 'Scheduled' : 'Always on'
      return {
        title: title || 'Promotion',
        subtitle: [
          enabled ? 'Enabled' : 'Disabled',
          scope,
          pricingMode || 'none',
          `P${priority ?? 0}`,
          promoLabel,
          dates,
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
