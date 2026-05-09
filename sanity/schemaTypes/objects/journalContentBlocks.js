import {defineArrayMember, defineField, defineType} from 'sanity'

/** Rich text (standard portable text blocks). */
export const journalBlockRichText = defineType({
  name: 'journalBlockRichText',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Rich text'}),
  },
})

export const journalBlockImage = defineType({
  name: 'journalBlockImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({
      name: 'fullWidth',
      title: 'Full width',
      type: 'boolean',
      description: 'Edge-to-edge within the article column.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {alt: 'alt'},
    prepare: ({alt}) => ({title: 'Image', subtitle: alt || '—'}),
  },
})

export const journalBlockGallery = defineType({
  name: 'journalBlockGallery',
  title: 'Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
      validation: (Rule) => Rule.min(1).max(12),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Gallery'}),
  },
})

export const journalBlockVideoEmbed = defineType({
  name: 'journalBlockVideoEmbed',
  title: 'Video embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube or Vimeo watch URL.',
      validation: (Rule) => Rule.required().uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({name: 'title', title: 'Accessible title', type: 'string'}),
  ],
  preview: {
    select: {t: 'title', u: 'url'},
    prepare: ({t, u}) => ({title: 'Video', subtitle: t || u || '—'}),
  },
})

export const journalBlockQuote = defineType({
  name: 'journalBlockQuote',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({name: 'attribution', title: 'Attribution', type: 'string'}),
  ],
  preview: {
    select: {q: 'quote'},
    prepare: ({q}) => ({
      title: 'Quote',
      subtitle: q ? String(q).slice(0, 60) + (String(q).length > 60 ? '…' : '') : '—',
    }),
  },
})

export const journalBlockDivider = defineType({
  name: 'journalBlockDivider',
  title: 'Divider',
  type: 'object',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {list: [{title: 'Line', value: 'line'}, {title: 'Space', value: 'space'}]},
      initialValue: 'line',
    }),
  ],
  preview: {prepare: () => ({title: 'Divider'})},
})

export const journalBlockCta = defineType({
  name: 'journalBlockCta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'href', title: 'URL', type: 'string', description: 'Absolute or site-relative path.'}),
    defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {l: 'label'},
    prepare: ({l}) => ({title: 'CTA', subtitle: l || '—'}),
  },
})

export const journalBlockRelatedExperience = defineType({
  name: 'journalBlockRelatedExperience',
  title: 'Related experience',
  type: 'object',
  fields: [
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'reference',
      to: [{type: 'experience'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'label', title: 'Button label', type: 'string', initialValue: 'View experience'}),
  ],
  preview: {
    select: {e: 'experience->name'},
    prepare: ({e}) => ({title: 'Related experience', subtitle: e || '—'}),
  },
})
