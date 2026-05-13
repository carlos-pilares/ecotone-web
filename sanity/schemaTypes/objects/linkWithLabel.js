import {defineField, defineType} from 'sanity'

/** Legacy `heroCTA` / `navCTA` on `lodgePage` must not block publish when empty. */
function linkOptionalOnLodgePage(ctx) {
  return ctx.document?._type === 'lodgePage'
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
        Rule.custom((val, ctx) => {
          if (linkOptionalOnLodgePage(ctx)) return true
          const t = (val ?? '').trim()
          if (!t) return 'Label is required'
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          if (linkOptionalOnLodgePage(ctx)) return true
          const t = (val ?? '').trim()
          if (!t) return 'URL or path is required'
          return true
        }),
    }),
    defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {label: 'label', href: 'href'},
    prepare: ({label, href}) => ({title: label || 'Link', subtitle: href}),
  },
})
