import {defineField, defineType} from 'sanity'

const INTERNAL_PAGE_LIST = [
  {title: 'Home', value: 'home'},
  {title: 'Experiences index', value: 'experiencesIndex'},
  {title: 'Routes', value: 'routes'},
  {title: 'Lodges index', value: 'lodgesIndex'},
  {title: 'About', value: 'about'},
  {title: 'Experience landing (pick document below)', value: 'experiencePage'},
  {title: 'Lodge landing (pick document below)', value: 'lodgePage'},
  {title: 'Routes page (singleton)', value: 'routesPage'},
  {title: 'About page (singleton)', value: 'aboutPage'},
]

const showInternal = ({parent}) =>
  parent?.linkType === 'internalPage' || parent?.linkType === 'pageSection'


export const smartLink = defineType({
  name: 'smartLink',
  title: 'Link selector',
  type: 'object',
  description: 'Smart link overrides legacy URL when a label is set.',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal page', value: 'internalPage'},
          {title: 'Page + section (anchor)', value: 'pageSection'},
          {title: 'External URL', value: 'externalUrl'},
          {title: 'File download', value: 'file'},
          {title: 'Email', value: 'email'},
          {title: 'WhatsApp', value: 'whatsapp'},
        ],
        layout: 'radio',
      },
      initialValue: 'internalPage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalPage',
      title: 'Page',
      type: 'string',
      options: {list: INTERNAL_PAGE_LIST, layout: 'dropdown'},
      hidden: ({parent}) => !showInternal({parent}),
      description: 'For Experience / Lodge, choose the document below.',
    }),
    defineField({
      name: 'experiencePageRef',
      title: 'Experience landing',
      type: 'reference',
      to: [{type: 'experiencePage'}],
      hidden: ({parent}) => !showInternal({parent}) || parent?.internalPage !== 'experiencePage',
    }),
    defineField({
      name: 'lodgePageRef',
      title: 'Lodge landing',
      type: 'reference',
      to: [{type: 'lodgePage'}],
      hidden: ({parent}) => !showInternal({parent}) || parent?.internalPage !== 'lodgePage',
    }),
    defineField({
      name: 'sectionId',
      title: 'Section id / anchor (without #)',
      type: 'string',
      description: 'Optional hash target, e.g. `who` → …/page#who. For “Page + section”, set this.',
      hidden: ({parent}) => !showInternal({parent}),
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'externalUrl',
      validation: (Rule) =>
        Rule.custom((url, ctx) => {
          const linkType = ctx.parent && typeof ctx.parent === 'object' ? ctx.parent.linkType : undefined
          if (linkType !== 'externalUrl') return true
          if (!url || typeof url !== 'string') return 'URL required'
          const t = url.trim()
          if (!/^https?:\/\//i.test(t)) return 'Use http:// or https://'
          return true
        }),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      hidden: ({parent}) => parent?.linkType !== 'file',
    }),
    defineField({
      name: 'emailAddress',
      title: 'Email address',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'email',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      description: 'E.164 or digits with country code (e.g. 51974781094).',
      hidden: ({parent}) => parent?.linkType !== 'whatsapp',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'Prefilled message (optional)',
      type: 'text',
      rows: 2,
      hidden: ({parent}) => parent?.linkType !== 'whatsapp',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {label: 'label', linkType: 'linkType', internalPage: 'internalPage', externalUrl: 'externalUrl'},
    prepare: ({label, linkType, internalPage, externalUrl}) => ({
      title: label || 'Link',
      subtitle: [linkType, internalPage, externalUrl].filter(Boolean).join(' · '),
    }),
  },
})
