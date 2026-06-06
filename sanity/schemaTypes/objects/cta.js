import {defineField, defineType} from 'sanity'

const STYLE_OPTIONS = [
  {title: 'Primary', value: 'primary'},
  {title: 'Secondary', value: 'secondary'},
  {title: 'Ghost', value: 'ghost'},
  {title: 'Nav book (header style)', value: 'navBook'},
]

function trimOrEmpty(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/** Empty CTA is valid; partial fill requires both label and href. */
function validateOptionalCtaPair(label, href) {
  const l = trimOrEmpty(label)
  const h = trimOrEmpty(href)
  if (!l && !h) return true
  if (!l) return 'Label is required when URL or path is set'
  if (!h) return 'URL or path is required when label is set'
  return true
}

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((val, ctx) => validateOptionalCtaPair(val, ctx.parent?.href)),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((val, ctx) => validateOptionalCtaPair(ctx.parent?.label, val)),
    }),
    defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
    defineField({
      name: 'style',
      title: 'Style hint',
      type: 'string',
      options: {list: STYLE_OPTIONS, layout: 'radio'},
    }),
  ],
  validation: (Rule) =>
    Rule.custom((obj) => {
      if (!obj || typeof obj !== 'object') return true
      return validateOptionalCtaPair(obj.label, obj.href)
    }),
  preview: {
    select: {label: 'label', href: 'href', style: 'style'},
    prepare: ({label, href, style}) => ({title: label || 'CTA', subtitle: [style, href].filter(Boolean).join(' · ')}),
  },
})
