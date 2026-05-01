import {defineField, defineType} from 'sanity'

export const linkWithLabel = defineType({
  name: 'linkWithLabel',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', title: 'URL or path', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {label: 'label', href: 'href'},
    prepare: ({label, href}) => ({title: label || 'Link', subtitle: href}),
  },
})
