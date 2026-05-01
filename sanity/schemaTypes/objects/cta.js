import {defineField, defineType} from 'sanity'

const STYLE_OPTIONS = [
  {title: 'Primary', value: 'primary'},
  {title: 'Secondary', value: 'secondary'},
  {title: 'Ghost', value: 'ghost'},
  {title: 'Nav book (header style)', value: 'navBook'},
]

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', title: 'URL or path', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
    defineField({
      name: 'style',
      title: 'Style hint',
      type: 'string',
      options: {list: STYLE_OPTIONS, layout: 'radio'},
    }),
  ],
  preview: {
    select: {label: 'label', href: 'href', style: 'style'},
    prepare: ({label, href, style}) => ({title: label || 'CTA', subtitle: [style, href].filter(Boolean).join(' · ')}),
  },
})
