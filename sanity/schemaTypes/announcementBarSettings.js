import {defineField, defineType} from 'sanity'

const SHOW_ON_PAGES = [
  {title: 'All pages', value: 'all'},
  {title: 'Home', value: 'home'},
  {title: 'Experiences', value: 'experiences'},
  {title: 'Routes', value: 'routes'},
  {title: 'Lodges', value: 'lodges'},
  {title: 'About', value: 'about'},
  {title: 'Journal', value: 'journal'},
]

export const announcementBarSettings = defineType({
  name: 'announcementBarSettings',
  title: 'Announcement bar',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show announcement bar',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'secondaryText',
      title: 'Secondary text (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA link (optional)',
      type: 'smartLink',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date (optional)',
      type: 'datetime',
      options: {dateFormat: 'YYYY-MM-DD'},
    }),
    defineField({
      name: 'endDate',
      title: 'End date (optional)',
      type: 'datetime',
      options: {dateFormat: 'YYYY-MM-DD'},
    }),
    defineField({
      name: 'showOnPages',
      title: 'Show on pages',
      type: 'string',
      options: {list: SHOW_ON_PAGES, layout: 'radio'},
      initialValue: 'all',
    }),
    defineField({
      name: 'dismissible',
      title: 'Allow visitors to dismiss',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {enabled: 'enabled', message: 'message'},
    prepare: ({enabled, message}) => ({
      title: 'Announcement bar',
      subtitle: [enabled ? 'Enabled' : 'Disabled', message].filter(Boolean).join(' · '),
    }),
  },
})
