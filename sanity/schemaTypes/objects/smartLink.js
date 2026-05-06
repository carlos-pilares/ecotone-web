import {defineField, defineType} from 'sanity'

import {SmartLinkSamePageSectionInput} from '../../components/smartLink/SmartLinkSamePageSectionInput'
import {SmartLinkWebsitePageSectionInput} from '../../components/smartLink/SmartLinkWebsitePageSectionInput'

const WEBSITE_PAGE_LIST = [
  {title: 'Home', value: 'home'},
  {title: 'Experiences index', value: 'experiencesIndex'},
  {title: 'Routes', value: 'routes'},
  {title: 'Lodges index', value: 'lodgesIndex'},
  {title: 'About', value: 'about'},
  {title: 'Experience landing (pick document)', value: 'experiencePage'},
  {title: 'Lodge landing (pick document)', value: 'lodgePage'},
]

const linkTypeIs = (t) => (parent) => parent?.linkType === t

/** When off, only “Show on site” stays visible; no link fields are required. */
const hiddenWhenDisabled = (parent) => parent?.enabled === false

export const smartLink = defineType({
  name: 'smartLink',
  title: 'Link selector',
  type: 'object',
  description: 'Primary control for CTAs. When “Show on site” is off, the button is hidden on the website.',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show on site',
      type: 'boolean',
      description: 'Turn off to hide this CTA for visitors (Studio keeps the data).',
      initialValue: true,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      hidden: ({parent}) => hiddenWhenDisabled(parent),
      validation: (Rule) =>
        Rule.max(160).custom((label, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object') return true
          if (p.enabled === false) return true
          return label?.trim() ? true : 'Label is required when the CTA is enabled'
        }),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      hidden: ({parent}) => hiddenWhenDisabled(parent),
      options: {
        list: [
          {title: 'A. Section within this page', value: 'samePageSection'},
          {title: 'B. Page within the website', value: 'websitePage'},
          {title: 'C. External page', value: 'externalUrl'},
          {title: 'D. File download', value: 'file'},
          {title: 'E. Book (flow pending — optional fallback URL)', value: 'book'},
          {title: 'F. WhatsApp', value: 'whatsapp'},
        ],
        layout: 'radio',
      },
      initialValue: 'websitePage',
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object') return true
          if (p.enabled === false) return true
          return v?.trim() ? true : 'Pick a link type'
        }),
    }),
    defineField({
      name: 'samePageSectionId',
      title: 'Section on this page',
      type: 'string',
      description: 'Scroll target on the current page (hash only).',
      hidden: ({parent}) => !linkTypeIs('samePageSection')(parent),
      components: {
        input: SmartLinkSamePageSectionInput,
      },
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'samePageSection') return true
          return v?.trim() ? true : 'Pick a section'
        }),
    }),
    defineField({
      name: 'internalPage',
      title: 'Site page',
      type: 'string',
      description: 'Target page on this website.',
      options: {list: WEBSITE_PAGE_LIST, layout: 'dropdown'},
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('websitePage')(parent),
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'websitePage') return true
          return v?.trim() ? true : 'Pick a site page'
        }),
    }),
    defineField({
      name: 'experiencePageRef',
      title: 'Experience landing',
      type: 'reference',
      to: [{type: 'experiencePage'}],
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !linkTypeIs('websitePage')(parent) || parent?.internalPage !== 'experiencePage',
      validation: (Rule) =>
        Rule.custom((ref, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'websitePage' || p.internalPage !== 'experiencePage') return true
          return ref?._ref ? true : 'Pick an experience page'
        }),
    }),
    defineField({
      name: 'lodgePageRef',
      title: 'Lodge landing',
      type: 'reference',
      to: [{type: 'lodgePage'}],
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !linkTypeIs('websitePage')(parent) || parent?.internalPage !== 'lodgePage',
      validation: (Rule) =>
        Rule.custom((ref, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'websitePage' || p.internalPage !== 'lodgePage') return true
          return ref?._ref ? true : 'Pick a lodge page'
        }),
    }),
    defineField({
      name: 'websitePageSectionId',
      title: 'Anchor on that page (optional)',
      type: 'string',
      description: 'Scroll to a section after navigation. Omit to open the top of the page.',
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !linkTypeIs('websitePage')(parent) || !parent?.internalPage?.trim(),
      components: {
        input: SmartLinkWebsitePageSectionInput,
      },
    }),
    defineField({
      name: 'sectionId',
      title: 'Anchor on that page (legacy)',
      type: 'string',
      description: 'Legacy field — kept for old content. Use “Anchor on that page” above for new links.',
      hidden: () => true,
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('externalUrl')(parent),
      validation: (Rule) =>
        Rule.custom((url, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'externalUrl') return true
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
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('file')(parent),
      validation: (Rule) =>
        Rule.custom((file, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'file') return true
          return file?.asset ? true : 'Upload a file'
        }),
    }),
    defineField({
      name: 'bookFallbackUrl',
      title: 'Temporary booking URL (optional)',
      type: 'url',
      description:
        'Booking flow pending. If set, visitors use this URL until the real booking flow is wired. Must be http(s).',
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('book')(parent),
      validation: (Rule) =>
        Rule.custom((url, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'book') return true
          if (url == null || url === '') return true
          const t = String(url).trim()
          if (!/^https?:\/\//i.test(t)) return 'Use http:// or https://'
          return true
        }),
    }),
    defineField({
      name: 'emailAddress',
      title: 'Email address (legacy)',
      type: 'string',
      hidden: () => true,
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      description: 'E.164 or digits with country code (e.g. 51974781094).',
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('whatsapp')(parent),
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || p.enabled === false) return true
          if (p.linkType !== 'whatsapp') return true
          const t = v?.trim()
          if (!t) return 'WhatsApp number is required'
          const d = t.replace(/\D/g, '')
          return d.length > 0 ? true : 'Use digits with country code'
        }),
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'Prefilled message (optional)',
      type: 'text',
      rows: 2,
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('whatsapp')(parent),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      description: 'External links and file downloads often open in a new tab.',
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !['externalUrl', 'file', 'whatsapp'].includes(parent?.linkType),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      enabled: 'enabled',
      linkType: 'linkType',
      internalPage: 'internalPage',
      externalUrl: 'externalUrl',
      samePageSectionId: 'samePageSectionId',
      websitePageSectionId: 'websitePageSectionId',
    },
    prepare: ({
      label,
      enabled,
      linkType,
      internalPage,
      externalUrl,
      samePageSectionId,
      websitePageSectionId,
    }) => ({
      title: enabled === false ? `[Hidden] ${label || 'Link'}` : label || 'Link',
      subtitle: [linkType, samePageSectionId, websitePageSectionId, internalPage, externalUrl]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
