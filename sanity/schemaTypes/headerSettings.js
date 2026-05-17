import {defineField, defineType} from 'sanity'

const menuLinkFields = (prefix, defaults) => [
  defineField({
    name: `${prefix}ShowInHeader`,
    title: `${defaults.title} — show in header`,
    type: 'boolean',
    initialValue: defaults.enabled ?? true,
    hidden: true,
  }),
  defineField({
    name: `${prefix}Label`,
    title: `${defaults.title} — label`,
    type: 'string',
    initialValue: defaults.label,
    validation: (Rule) => Rule.max(40),
    hidden: true,
  }),
  defineField({
    name: `${prefix}SmartLink`,
    title: `${defaults.title} — link`,
    type: 'smartLink',
    description: defaults.linkDescription,
    hidden: true,
  }),
]

export const headerSettings = defineType({
  name: 'headerSettings',
  title: 'Header',
  type: 'document',
  groups: [
    {name: 'logos', title: 'Logos', default: true},
    {name: 'navigation', title: 'Navigation tabs'},
    {name: 'mainCta', title: 'Main CTA'},
    {name: 'legacy', title: 'Legacy (hidden)'},
  ],
  fields: [
    defineField({
      name: 'headerLogoPrimary',
      title: 'Logo — primary (full horizontal)',
      type: 'image',
      options: {hotspot: true},
      group: 'logos',
    }),
    defineField({
      name: 'headerLogoLight',
      title: 'Logo — light (on dark hero)',
      type: 'image',
      options: {hotspot: true},
      group: 'logos',
    }),
    defineField({
      name: 'headerLogoDark',
      title: 'Logo — dark (solid / light bar)',
      type: 'image',
      options: {hotspot: true},
      group: 'logos',
    }),
    defineField({
      name: 'homePath',
      title: 'Logo link target',
      type: 'string',
      group: 'logos',
      initialValue: '/',
    }),
    defineField({
      name: 'mobileMenuAriaLabel',
      title: 'Mobile menu button (aria label)',
      type: 'string',
      group: 'logos',
      initialValue: 'Open menu',
    }),

    defineField({
      name: 'navTabs',
      title: 'Navigation tabs',
      type: 'array',
      group: 'navigation',
      of: [{type: 'headerNavTab'}],
      description:
        'Top navigation order = list order. Each tab: label, show/hide, link or dropdown. When this list has items, it is the only source for the site header.',
    }),

    defineField({
      name: 'mainCtaShowInHeader',
      title: 'Main CTA — show in header',
      type: 'boolean',
      group: 'mainCta',
      initialValue: true,
    }),
    defineField({
      name: 'mainCtaLabel',
      title: 'Main CTA — label',
      type: 'string',
      group: 'mainCta',
      initialValue: 'Book now',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'mainCtaSmartLink',
      title: 'Main CTA — link',
      type: 'smartLink',
      group: 'mainCta',
    }),

    // —— Legacy flat fields (hidden); used only when navTabs is empty ——
    defineField({
      name: 'experiencesShowInHeader',
      title: 'Experiences — show dropdown',
      type: 'boolean',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'experiencesLabel',
      type: 'string',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'experiencesSmartLink',
      type: 'smartLink',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'experiencesSideMenuTitle',
      type: 'string',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'programGroups',
      type: 'array',
      of: [{type: 'headerNavProgramTypeGroup'}],
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'experiencesSeeAll',
      type: 'headerNavSeeAll',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'lodgesShowInHeader',
      type: 'boolean',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'lodgesLabel',
      type: 'string',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'lodgesSmartLink',
      type: 'smartLink',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'lodgesSideMenuTitle',
      type: 'string',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'routeGroupOverrides',
      type: 'array',
      of: [{type: 'headerNavRouteGroupOverride'}],
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'lodgesSeeAll',
      type: 'headerNavSeeAll',
      group: 'legacy',
      hidden: true,
    }),
    ...menuLinkFields('routes', {title: 'Routes', label: 'Routes', enabled: true}).map((f) => ({
      ...f,
      group: 'legacy',
    })),
    ...menuLinkFields('about', {title: 'About', label: 'About', enabled: true}).map((f) => ({
      ...f,
      group: 'legacy',
    })),
    ...menuLinkFields('blog', {title: 'Blog', label: 'Blog', enabled: false}).map((f) => ({
      ...f,
      group: 'legacy',
    })),
  ],
  preview: {prepare: () => ({title: 'Header settings'})},
})
