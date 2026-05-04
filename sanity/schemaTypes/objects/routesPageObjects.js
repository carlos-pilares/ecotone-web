import {defineField, defineType} from 'sanity'

export const routesPageStatLine = defineType({
  name: 'routesPageStatLine',
  title: 'Snapshot stat',
  type: 'object',
  fields: [
    defineField({name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {value: 'value', label: 'label'},
    prepare: ({value, label}) => ({title: `${value || '—'} · ${label || ''}`}),
  },
})

export const routesPageTerritoryStripChip = defineType({
  name: 'routesPageTerritoryStripChip',
  title: 'Territory strip chip',
  type: 'object',
  fields: [
    defineField({name: 'id', title: 'Id (anchor / analytics)', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'meta', title: 'Meta line', type: 'string'}),
    defineField({
      name: 'variant',
      title: 'Visual',
      type: 'string',
      options: {list: [{title: 'Active', value: 'active'}, {title: 'Neutral', value: 'neutral'}]},
      initialValue: 'neutral',
    }),
  ],
  preview: {
    select: {name: 'name', meta: 'meta'},
    prepare: ({name, meta}) => ({title: name, subtitle: meta}),
  },
})

export const routesPageRouteBadge = defineType({
  name: 'routesPageRouteBadge',
  title: 'Badge',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          {title: 'Amber', value: 'amber'},
          {title: 'Neutral', value: 'neutral'},
          {title: 'Custom class', value: 'custom'},
        ],
      },
      initialValue: 'neutral',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customClassName',
      title: 'Custom CSS class',
      type: 'string',
      description: 'Only when tone is Custom (e.g. routes-pill-outline).',
    }),
  ],
  preview: {
    select: {label: 'label', tone: 'tone'},
    prepare: ({label, tone}) => ({title: label, subtitle: tone}),
  },
})

export const routesPageRouteCard = defineType({
  name: 'routesPageRouteCard',
  title: 'Route card',
  type: 'object',
  fields: [
    defineField({name: 'stableId', title: 'Stable id', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'variant',
      title: 'Layout variant',
      type: 'string',
      options: {list: [{title: 'Featured', value: 'featured'}, {title: 'Default', value: 'default'}]},
      initialValue: 'default',
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}, validation: (Rule) => Rule.required()}),
    defineField({name: 'imageAlt', title: 'Image alt', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'numLabel', title: 'Number label (e.g. ① Camanti)', type: 'string'}),
    defineField({name: 'altitudeLine', title: 'Altitude / time line', type: 'string'}),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{type: 'routesPageRouteBadge'}],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({name: 'name', title: 'Route name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 5}),
    defineField({name: 'chips', title: 'Chips (tags)', type: 'array', of: [{type: 'string'}], validation: (Rule) => Rule.max(12)}),
    defineField({
      name: 'footPriceHtml',
      title: 'Footer price line (HTML)',
      type: 'text',
      rows: 2,
      description: 'Small HTML allowed (e.g. <strong>, <span class="routes-price-enquire">).',
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA link selector',
      type: 'smartLink',
      description: 'Primary control for the card button. Smart link overrides legacy label + URL below.',
    }),
    defineField({
      name: 'cta',
      title: 'CTA (legacy fallback)',
      type: 'object',
      hidden: ({parent}) => Boolean(parent?.ctaSmartLink?.label?.trim()),
      fields: [
        defineField({name: 'label', title: 'Button label', type: 'string'}),
        defineField({name: 'href', title: 'URL or path (legacy)', type: 'string'}),
        defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
      ],
      description: 'Used when no link selector is set. Smart link overrides legacy URL.',
    }),
    defineField({
      name: 'ctaButtonVariant',
      title: 'CTA button style',
      type: 'string',
      options: {list: [{title: 'Primary', value: 'primary'}, {title: 'Secondary', value: 'secondary'}]},
      initialValue: 'secondary',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((card) => {
      if (!card || typeof card !== 'object') return true
      if (card.ctaSmartLink?.label?.trim()) return true
      const c = card.cta
      if (c?.label?.trim() && c?.href?.trim()) return true
      return 'Add CTA smart link (recommended) or legacy button label + URL'
    }),
  preview: {
    select: {name: 'name', variant: 'variant'},
    prepare: ({name, variant}) => ({title: name || 'Route', subtitle: variant}),
  },
})

export const routesPageCompareColumn = defineType({
  name: 'routesPageCompareColumn',
  title: 'Compare column',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({
      name: 'tone',
      title: 'Column tone',
      type: 'string',
      options: {list: [{title: 'Featured', value: 'featured'}, {title: 'Default', value: 'default'}]},
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare: ({title, subtitle}) => ({title, subtitle}),
  },
})

export const routesPageExpFilterPill = defineType({
  name: 'routesPageExpFilterPill',
  title: 'Filter pill',
  type: 'object',
  fields: [
    defineField({
      name: 'filterId',
      title: 'Filter id',
      type: 'string',
      description: 'Must match frontend: all | camanti | manu-road | manu-core',
      options: {
        list: [
          {title: 'All routes', value: 'all'},
          {title: 'Camanti', value: 'camanti'},
          {title: 'Manu Road', value: 'manu-road'},
          {title: 'Manu Core', value: 'manu-core'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {filterId: 'filterId', label: 'label'},
    prepare: ({filterId, label}) => ({title: label, subtitle: filterId}),
  },
})

export const routesPageExpCard = defineType({
  name: 'routesPageExpCard',
  title: 'Experience card',
  type: 'object',
  fields: [
    defineField({
      name: 'routeKey',
      title: 'Route key (filter)',
      type: 'string',
      options: {
        list: [
          {title: 'Camanti', value: 'camanti'},
          {title: 'Manu Road', value: 'manu-road'},
          {title: 'Manu Core', value: 'manu-core'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hrefSmartLink',
      title: 'Card link (recommended)',
      type: 'smartLink',
      description: 'Smart link overrides legacy href below (card title is used as fallback label).',
    }),
    defineField({
      name: 'href',
      title: 'Link path or URL (legacy)',
      type: 'string',
      description: 'e.g. /experiences/soqtapata-pristine-immersion',
      hidden: ({parent}) => Boolean(parent?.hrefSmartLink?.label?.trim()),
      validation: (Rule) =>
        Rule.custom((href, ctx) => {
          if (ctx.parent?.hrefSmartLink?.label?.trim()) return true
          return href?.trim() ? true : 'Required when no smart link is set'
        }),
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}, validation: (Rule) => Rule.required()}),
    defineField({name: 'imageAlt', title: 'Image alt', type: 'string'}),
    defineField({name: 'typePill', title: 'Type pill', type: 'string'}),
    defineField({name: 'duration', title: 'Duration', type: 'string'}),
    defineField({name: 'routeLine', title: 'Route line', type: 'string'}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'priceKind',
      title: 'Price display',
      type: 'string',
      options: {
        list: [
          {title: 'Amount', value: 'amount'},
          {title: 'Enquire', value: 'enquire'},
          {title: 'Custom label', value: 'custom'},
        ],
      },
      initialValue: 'enquire',
    }),
    defineField({name: 'priceText', title: 'Price / custom text', type: 'string'}),
  ],
  validation: (Rule) =>
    Rule.custom((card) => {
      if (!card || typeof card !== 'object') return true
      if (card.hrefSmartLink?.label?.trim()) return true
      if (card.href?.trim()) return true
      return 'Add smart link or legacy href'
    }),
  preview: {
    select: {name: 'name', routeKey: 'routeKey'},
    prepare: ({name, routeKey}) => ({title: name, subtitle: routeKey}),
  },
})

export const routesPageFeaturedQuote = defineType({
  name: 'routesPageFeaturedQuote',
  title: 'Featured quote (rotating)',
  type: 'object',
  fields: [
    defineField({
      name: 'quoteHtml',
      title: 'Quote (HTML)',
      type: 'text',
      rows: 4,
      description: 'Allows <span> for emphasis. Rendered with dangerouslySetInnerHTML.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'attribution', title: 'Attribution line', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {attribution: 'attribution'},
    prepare: ({attribution}) => ({title: attribution || 'Quote'}),
  },
})

export const routesPageTrustItem = defineType({
  name: 'routesPageTrustItem',
  title: 'Trust line',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Shield', value: 'shield'},
          {title: 'Check', value: 'check'},
          {title: 'Heart', value: 'heart'},
        ],
      },
      initialValue: 'check',
    }),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {label: 'label'},
    prepare: ({label}) => ({title: label}),
  },
})
