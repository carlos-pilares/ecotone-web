import {defineField, defineType} from 'sanity'

import {SmartLinkInternalPageInput} from '../../components/smartLink/SmartLinkInternalPageInput'
import {SmartLinkLinkTypeInput} from '../../components/smartLink/SmartLinkLinkTypeInput'
import {SmartLinkSamePageSectionInput} from '../../components/smartLink/SmartLinkSamePageSectionInput'
import {SmartLinkWebsitePageSectionInput} from '../../components/smartLink/SmartLinkWebsitePageSectionInput'

import {
  SMART_LINK_INTERNAL_PAGE_LEGACY_ALIASES,
  SMART_LINK_LINK_TYPE_EDITOR_OPTIONS,
  SMART_LINK_LINK_TYPE_LEGACY,
  SMART_LINK_WEBSITE_PAGE_EDITOR_OPTIONS,
} from './smartLinkEditorOptions'

const linkTypeIs = (t) => (parent) => parent?.linkType === t

/** @param {Record<string, unknown> | null | undefined} parent */
function websitePageLike(parent) {
  const t = parent?.linkType
  return t === 'websitePage' || t === 'internalPage' || t === 'pageSection'
}

/** When off, only “Show on site” stays visible; no link fields are required. */
const hiddenWhenDisabled = (parent) => parent?.enabled === false

const ALLOWED_LINK_TYPES = new Set([
  ...SMART_LINK_LINK_TYPE_EDITOR_OPTIONS.map((o) => o.value),
  ...SMART_LINK_LINK_TYPE_LEGACY,
])

const ALLOWED_INTERNAL_PAGE = new Set([
  ...SMART_LINK_WEBSITE_PAGE_EDITOR_OPTIONS.map((o) => o.value),
  ...SMART_LINK_INTERNAL_PAGE_LEGACY_ALIASES,
])

/**
 * Optional smartLink fields (e.g. reserve CTAs): no label ⇒ not a real CTA — do not validate
 * link targets (avoids `initialValue` on linkType forcing picks while the block is unused).
 * `enabled === false` ⇒ same.
 */
function skipSmartLinkTargetValidation(parent) {
  if (!parent || typeof parent !== 'object') return true
  if (parent.enabled === false) return true
  const label = typeof parent.label === 'string' ? parent.label.trim() : ''
  if (!label) return true
  return false
}

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
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      hidden: ({parent}) => hiddenWhenDisabled(parent),
      description: 'Legacy stored types (internalPage, pageSection, email) remain valid until migrated.',
      components: {
        input: SmartLinkLinkTypeInput,
      },
      initialValue: 'websitePage',
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object') return true
          if (skipSmartLinkTargetValidation(p)) return true
          const t = typeof v === 'string' ? v.trim() : ''
          if (!t) return 'Pick a link type'
          if (!ALLOWED_LINK_TYPES.has(t)) return 'Invalid or unsupported link type'
          return true
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
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (p.linkType !== 'samePageSection') return true
          return v?.trim() ? true : 'Pick a section'
        }),
    }),
    defineField({
      name: 'internalPage',
      title: 'Site page',
      type: 'string',
      description: 'Target page on this website. Legacy keys (e.g. aboutPage) stay valid until migrated.',
      components: {
        input: SmartLinkInternalPageInput,
      },
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !websitePageLike(parent),
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (!websitePageLike(p)) return true
          const t = typeof v === 'string' ? v.trim() : ''
          if (!t) return 'Pick a site page'
          if (!ALLOWED_INTERNAL_PAGE.has(t)) return 'Pick a site page'
          return true
        }),
    }),
    defineField({
      name: 'experiencePageRef',
      title: 'Experience landing',
      type: 'reference',
      to: [{type: 'experiencePage'}],
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !websitePageLike(parent) || parent?.internalPage !== 'experiencePage',
      validation: (Rule) =>
        Rule.custom((ref, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (!websitePageLike(p) || p.internalPage !== 'experiencePage') return true
          return ref?._ref ? true : 'Pick an experience page'
        }),
    }),
    defineField({
      name: 'lodgePageRef',
      title: 'Lodge landing',
      type: 'reference',
      to: [{type: 'lodgePage'}],
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !websitePageLike(parent) || parent?.internalPage !== 'lodgePage',
      validation: (Rule) =>
        Rule.custom((ref, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (!websitePageLike(p) || p.internalPage !== 'lodgePage') return true
          return ref?._ref ? true : 'Pick a lodge page'
        }),
    }),
    defineField({
      name: 'websitePageSectionId',
      title: 'Anchor on that page (optional)',
      type: 'string',
      description: 'Scroll to a section after navigation. Omit to open the top of the page.',
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !websitePageLike(parent) || !parent?.internalPage?.trim(),
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
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
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
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (p.linkType !== 'file') return true
          return file?.asset ? true : 'Upload a file'
        }),
    }),
    defineField({
      name: 'bookingMode',
      title: 'Booking mode',
      type: 'string',
      initialValue: 'general',
      options: {
        list: [
          {title: 'General — Plan your journey', value: 'general'},
          {title: 'Specific — Book this experience', value: 'specific'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('book')(parent),
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (p.linkType !== 'book') return true
          const t = typeof v === 'string' ? v.trim() : ''
          return t === 'general' || t === 'specific' ? true : 'Pick a booking mode'
        }),
    }),
    defineField({
      name: 'bookingExperiencePageRef',
      title: 'Experience page (specific booking)',
      type: 'reference',
      to: [{type: 'experiencePage'}],
      description:
        'Required for “Specific” mode. Opens the booking modal for that experience. If unset on a live page, the current page experience is used when available.',
      hidden: ({parent}) =>
        hiddenWhenDisabled(parent) || !linkTypeIs('book')(parent) || parent?.bookingMode !== 'specific',
      validation: (Rule) =>
        Rule.custom((ref, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (p.linkType !== 'book' || p.bookingMode !== 'specific') return true
          return ref?._ref ? true : 'Pick an experience page for specific booking'
        }),
    }),
    defineField({
      name: 'bookFallbackUrl',
      title: 'Booking fallback URL (optional)',
      type: 'url',
      description:
        'Used only when “Specific” mode has no experience data to load. Must be http(s).',
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('book')(parent),
      validation: (Rule) =>
        Rule.custom((url, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (p.linkType !== 'book') return true
          if (url == null || url === '') return true
          const t = String(url).trim()
          if (!/^https?:\/\//i.test(t)) return 'Use http:// or https://'
          return true
        }),
    }),
    defineField({
      name: 'emailAddress',
      title: 'Email address',
      type: 'string',
      description: 'Used when link type is Email (legacy).',
      hidden: ({parent}) => hiddenWhenDisabled(parent) || !linkTypeIs('email')(parent),
      validation: (Rule) =>
        Rule.custom((v, ctx) => {
          const p = ctx.parent
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
          if (p.linkType !== 'email') return true
          return v?.trim() ? true : 'Email address is required'
        }),
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
          if (!p || typeof p !== 'object' || skipSmartLinkTargetValidation(p)) return true
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
