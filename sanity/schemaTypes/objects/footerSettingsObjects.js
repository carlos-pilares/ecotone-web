import {defineArrayMember, defineField, defineType} from 'sanity'

const footerLinkTypeIs = (t) => (parent) => (parent?.linkType ?? 'smartLink') === t

export const footerLinkItem = defineType({
  name: 'footerLinkItem',
  title: 'Footer link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Smart link', value: 'smartLink'},
          {title: 'Document / PDF', value: 'document'},
        ],
        layout: 'radio',
      },
      initialValue: 'smartLink',
      description: 'Existing links without a type keep using Smart link.',
    }),
    defineField({
      name: 'smartLink',
      title: 'Smart link',
      type: 'smartLink',
      description: 'Internal page, URL, WhatsApp, file via smart link, etc.',
      hidden: ({parent}) => footerLinkTypeIs('document')(parent),
    }),
    defineField({
      name: 'document',
      title: 'Document',
      type: 'file',
      description: 'PDF or other file. Label still shows if no file is uploaded.',
      hidden: ({parent}) => !footerLinkTypeIs('document')(parent),
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,application/pdf',
      },
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => !footerLinkTypeIs('document')(parent),
      description: 'Recommended for PDFs and downloads.',
    }),
  ],
  preview: {
    select: {label: 'label', linkType: 'linkType', sl: 'smartLink.label'},
    prepare: ({label, linkType, sl}) => {
      const typeLabel = linkType === 'document' ? 'Document' : 'Smart link'
      const dest = linkType === 'document' ? 'Uploaded file' : sl || 'No link set'
      return {title: label || 'Link', subtitle: `${typeLabel} · ${dest}`}
    },
  },
})

export const footerLinksColumn = defineType({
  name: 'footerLinksColumn',
  title: 'Footer links column',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Column title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'footerLinkItem'})],
      validation: (Rule) => Rule.max(10),
    }),
  ],
  preview: {
    select: {title: 'title', count: 'links'},
    prepare: ({title, count}) => ({
      title: title || 'Links column',
      subtitle: `${Array.isArray(count) ? count.length : 0} link(s)`,
    }),
  },
})

export const footerBrandColumn = defineType({
  name: 'footerBrandColumn',
  title: 'Footer brand column',
  type: 'object',
  fields: [
    defineField({
      name: 'footerLogo',
      title: 'Footer logo (optional)',
      type: 'image',
      options: {hotspot: true},
      description: 'If empty, the horizontal footer logo or header primary logo is used.',
    }),
    defineField({
      name: 'footerLogoFullHorizontal',
      title: 'Logo — full horizontal (footer)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'showBrandDeco',
      title: 'Show large isotipo in footer background',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'descriptionLine1',
      title: 'Description line 1',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'descriptionLine2',
      title: 'Description line 2',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
  ],
})

export const footerCredentialItem = defineType({
  name: 'footerCredentialItem',
  title: 'Credential / badge',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'smartLink',
      title: 'Link (optional)',
      type: 'smartLink',
      description: 'Leave link empty for plain text (e.g. “B Corp”).',
    }),
  ],
  preview: {
    select: {label: 'label'},
    prepare: ({label}) => ({title: label || 'Credential'}),
  },
})

export const footerSocialItem = defineType({
  name: 'footerSocialItem',
  title: 'Social media item',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon / logo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'smartLink',
      title: 'Link',
      type: 'smartLink',
      description: 'Optional. When set, the icon opens this destination in a new tab.',
    }),
  ],
  preview: {
    select: {alt: 'alt', media: 'icon'},
    prepare: ({alt, media}) => ({title: alt || 'Social icon', media}),
  },
})

export const footerBottomBar = defineType({
  name: 'footerBottomBar',
  title: 'Footer bottom bar',
  type: 'object',
  fields: [
    defineField({
      name: 'leftText',
      title: 'Left text',
      type: 'string',
      validation: (Rule) => Rule.max(240),
      description: 'e.g. “© 2026 Ecotone · HERPIRO · All rights reserved.”',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials / badges',
      type: 'array',
      of: [defineArrayMember({type: 'footerCredentialItem'})],
      validation: (Rule) => Rule.max(12),
    }),
  ],
})
