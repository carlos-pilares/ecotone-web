import {defineField, defineType} from 'sanity'

export const routesCompareLodgeCell = defineType({
  name: 'routesCompareLodgeCell',
  title: 'Lodge cell',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare: ({title, subtitle}) => ({title: title || 'Cell', subtitle}),
  },
})

export const routesComparePriceCell = defineType({
  name: 'routesComparePriceCell',
  title: 'Price cell',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {list: [{title: 'Price', value: 'price'}, {title: 'Enquire', value: 'enquire'}]},
      initialValue: 'enquire',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceText',
      title: 'Price text',
      type: 'string',
      description: 'Only when kind is Price (e.g. $986).',
    }),
  ],
  preview: {
    select: {kind: 'kind', priceText: 'priceText'},
    prepare: ({kind, priceText}) => ({
      title: kind === 'price' ? (priceText || 'Price') : 'Enquire',
    }),
  },
})

export const routesCompareRowText = defineType({
  name: 'routesCompareRowText',
  title: 'Compare row · Text',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Row label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'altRow', title: 'Alternate background', type: 'boolean', initialValue: false}),
    defineField({name: 'col1', title: 'Column 1', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'col2', title: 'Column 2', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'col3', title: 'Column 3', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {select: {label: 'label'}, prepare: ({label}) => ({title: `Text · ${label || '—'}`})},
})

export const routesCompareRowDots = defineType({
  name: 'routesCompareRowDots',
  title: 'Compare row · Remoteness dots',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Row label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'altRow', title: 'Alternate background', type: 'boolean', initialValue: false}),
    defineField({
      name: 'dots1',
      title: 'Dots column 1 (0–3 filled)',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(0).max(3).integer(),
    }),
    defineField({
      name: 'dots2',
      title: 'Dots column 2',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.required().min(0).max(3).integer(),
    }),
    defineField({
      name: 'dots3',
      title: 'Dots column 3',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.required().min(0).max(3).integer(),
    }),
  ],
  preview: {select: {label: 'label'}, prepare: ({label}) => ({title: `Dots · ${label || '—'}`})},
})

export const routesCompareRowLodge = defineType({
  name: 'routesCompareRowLodge',
  title: 'Compare row · Lodges',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Row label', type: 'string', initialValue: 'Lodge'}),
    defineField({name: 'altRow', title: 'Alternate background', type: 'boolean', initialValue: false}),
    defineField({name: 'lodge1', title: 'Lodge · column 1', type: 'routesCompareLodgeCell', validation: (Rule) => Rule.required()}),
    defineField({name: 'lodge2', title: 'Lodge · column 2', type: 'routesCompareLodgeCell', validation: (Rule) => Rule.required()}),
    defineField({name: 'lodge3', title: 'Lodge · column 3', type: 'routesCompareLodgeCell', validation: (Rule) => Rule.required()}),
  ],
  preview: {prepare: () => ({title: 'Lodges row'})},
})

export const routesCompareRowBest = defineType({
  name: 'routesCompareRowBest',
  title: 'Compare row · Best for',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Row label', type: 'string', initialValue: 'Best for'}),
    defineField({name: 'altRow', title: 'Alternate background', type: 'boolean', initialValue: true}),
    defineField({name: 'col1', title: 'Column 1', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'col2', title: 'Column 2', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'col3', title: 'Column 3', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {prepare: () => ({title: 'Best for row'})},
})

export const routesCompareRowPrice = defineType({
  name: 'routesCompareRowPrice',
  title: 'Compare row · From price',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Row label', type: 'string', initialValue: 'From price'}),
    defineField({name: 'altRow', title: 'Alternate background', type: 'boolean', initialValue: false}),
    defineField({name: 'cell1', title: 'Cell 1', type: 'routesComparePriceCell', validation: (Rule) => Rule.required()}),
    defineField({name: 'cell2', title: 'Cell 2', type: 'routesComparePriceCell', validation: (Rule) => Rule.required()}),
    defineField({name: 'cell3', title: 'Cell 3', type: 'routesComparePriceCell', validation: (Rule) => Rule.required()}),
  ],
  preview: {prepare: () => ({title: 'Price row'})},
})
