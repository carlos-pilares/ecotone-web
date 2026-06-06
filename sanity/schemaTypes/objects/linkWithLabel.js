import {defineField, defineType} from 'sanity'

function trimOrEmpty(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/** Empty link is valid; partial fill requires both label and href. */
function validateOptionalLinkPair(label, href) {
  const l = trimOrEmpty(label)
  const h = trimOrEmpty(href)
  if (!l && !h) return true
  if (!l) return 'Label is required when URL or path is set'
  if (!h) return 'URL or path is required when label is set'
  return true
}

export const linkWithLabel = defineType({
  name: 'linkWithLabel',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((val, ctx) => validateOptionalLinkPair(val, ctx.parent?.href)),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((val, ctx) => validateOptionalLinkPair(ctx.parent?.label, val)),
    }),
    defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
  ],
  validation: (Rule) =>
    Rule.custom((obj) => {
      if (!obj || typeof obj !== 'object') return true
      return validateOptionalLinkPair(obj.label, obj.href)
    }),
  preview: {
    select: {label: 'label', href: 'href'},
    prepare: ({label, href}) => ({title: label || 'Link', subtitle: href}),
  },
})
