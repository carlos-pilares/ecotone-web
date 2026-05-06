import {defineField, defineType} from 'sanity'

export const aboutPageParagraph = defineType({
  name: 'aboutPageParagraph',
  title: 'Paragraph',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {text: 'text'},
    prepare: ({text}) => ({
      title: text ? String(text).slice(0, 60) + (String(text).length > 60 ? '…' : '') : 'Paragraph',
    }),
  },
})

export const aboutPagePill = defineType({
  name: 'aboutPagePill',
  title: 'Pill',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {label: 'label'},
    prepare: ({label}) => ({title: label || 'Pill'}),
  },
})

export const aboutPageDiffCard = defineType({
  name: 'aboutPageDiffCard',
  title: 'Difference card',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Immersive (home)', value: 'immersive'},
          {title: 'Field knowledge (person)', value: 'guides'},
          {title: 'Conservation (shield)', value: 'conservation'},
          {title: 'Meaningful travellers (sun)', value: 'meaningful'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
  ],
  preview: {
    select: {title: 'title', iconKey: 'iconKey'},
    prepare: ({title, iconKey}) => ({title: title || 'Card', subtitle: iconKey}),
  },
})

export const aboutPagePerson = defineType({
  name: 'aboutPagePerson',
  title: 'Person',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'imageAlt', title: 'Image alt', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 3}),
  ],
  preview: {
    select: {name: 'name', role: 'role'},
    prepare: ({name, role}) => ({title: name || 'Person', subtitle: role}),
  },
})

export const aboutPageStat = defineType({
  name: 'aboutPageStat',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {value: 'value', label: 'label'},
    prepare: ({value, label}) => ({title: `${value} — ${label}`}),
  },
})

function smartLinkUsable(sl) {
  return Boolean(sl && sl.enabled !== false && sl.label?.trim())
}

export const aboutPageCtaButton = defineType({
  name: 'aboutPageCtaButton',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'smartLink',
      title: 'Link selector',
      type: 'smartLink',
      description: 'Primary control for this button.',
    }),
    defineField({
      name: 'label',
      title: 'Label (legacy fallback)',
      type: 'string',
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'href',
      title: 'URL or path (legacy fallback)',
      type: 'string',
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'variant',
      title: 'Variant (legacy styling hint)',
      type: 'string',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'WhatsApp (green)', value: 'whatsapp'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      validation: (Rule) => Rule.required(),
      description: 'Used when smart link does not imply WhatsApp. Smart link type WhatsApp overrides to green.',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab (legacy)',
      type: 'boolean',
      initialValue: false,
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((btn) => {
      if (!btn || typeof btn !== 'object') return true
      if (btn.smartLink?.enabled === false) return true
      if (smartLinkUsable(btn.smartLink)) return true
      if (btn.label?.trim() && btn.href?.trim()) return true
      return 'Add a smart link or keep legacy label + URL for fallback.'
    }),
  preview: {
    select: {label: 'label', sl: 'smartLink.label', variant: 'variant', sen: 'smartLink.enabled'},
    prepare: ({label, sl, variant, sen}) => ({
      title: (sl && String(sl).trim()) || label || 'Button',
      subtitle: sen === false ? 'Hidden' : sl ? 'Smart link' : variant,
    }),
  },
})

export const aboutPageTrustItem = defineType({
  name: 'aboutPageTrustItem',
  title: 'Trust line',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Check', value: 'check'},
          {title: 'Shield', value: 'shield'},
          {title: 'Heart', value: 'heart'},
        ],
        layout: 'radio',
      },
      initialValue: 'check',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'text', title: 'Text', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {text: 'text', iconKey: 'iconKey'},
    prepare: ({text, iconKey}) => ({title: text, subtitle: iconKey}),
  },
})
