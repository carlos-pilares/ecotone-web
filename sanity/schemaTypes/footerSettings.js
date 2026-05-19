import {defineField, defineType} from 'sanity'

/** Legacy nested footer block — hidden; preserves existing Studio data. */
const legacyFooterBlock = [
  defineField({
    name: 'footerLogo',
    title: 'Footer logo (legacy)',
    type: 'image',
    options: {hotspot: true},
  }),
  defineField({
    name: 'footerLogoFullHorizontal',
    title: 'Logo — full horizontal (legacy)',
    type: 'image',
    options: {hotspot: true},
  }),
  defineField({name: 'showBrandDeco', title: 'Show brand deco (legacy)', type: 'boolean'}),
  defineField({name: 'tagline', title: 'Tagline (legacy)', type: 'string'}),
  defineField({
    name: 'descriptionLines',
    title: 'Description lines (legacy)',
    type: 'array',
    of: [{type: 'string'}],
  }),
  defineField({name: 'exploreTitle', title: 'Explore title (legacy)', type: 'string'}),
  defineField({
    name: 'exploreLinks',
    title: 'Explore links (legacy)',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
  }),
  defineField({name: 'contactTitle', title: 'Contact title (legacy)', type: 'string'}),
  defineField({
    name: 'contactLinks',
    title: 'Contact links (legacy)',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
  }),
  defineField({
    name: 'legalLinks',
    title: 'Legal links (legacy)',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
  }),
  defineField({
    name: 'footerCertText',
    title: 'Certification line (legacy)',
    type: 'array',
    of: [{type: 'string'}],
  }),
  defineField({
    name: 'footerCertPartners',
    title: 'Certifications — partners (legacy)',
    type: 'array',
    of: [{type: 'reference', to: [{type: 'partner'}]}],
  }),
]

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  groups: [
    {name: 'column1', title: 'Column 1 — Brand', default: true},
    {name: 'column2', title: 'Column 2 — Links'},
    {name: 'column3', title: 'Column 3 — Links'},
    {name: 'column4', title: 'Column 4 — Links'},
    {name: 'bottom', title: 'Bottom bar'},
    {name: 'social', title: 'Social media'},
    {name: 'site', title: 'Site'},
    {name: 'legacy', title: 'Legacy (hidden)', hidden: true},
  ],
  fields: [
    defineField({
      name: 'column1',
      title: 'Brand column',
      type: 'footerBrandColumn',
      group: 'column1',
    }),
    defineField({
      name: 'column2',
      title: 'Links column 2',
      type: 'footerLinksColumn',
      group: 'column2',
    }),
    defineField({
      name: 'column3',
      title: 'Links column 3',
      type: 'footerLinksColumn',
      group: 'column3',
    }),
    defineField({
      name: 'column4',
      title: 'Links column 4',
      type: 'footerLinksColumn',
      group: 'column4',
    }),
    defineField({
      name: 'bottomBar',
      title: 'Bottom bar',
      type: 'footerBottomBar',
      group: 'bottom',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social media',
      type: 'array',
      of: [{type: 'footerSocialItem'}],
      group: 'social',
      description: 'Icon links shown under the brand column in the footer.',
    }),
    defineField({
      name: 'defaultWhatsappUrl',
      title: 'Default WhatsApp URL (site-wide)',
      type: 'url',
      group: 'site',
      description: 'Fallback when booking CTAs omit a WhatsApp link.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links (legacy)',
      type: 'array',
      of: [{type: 'footerLinkItem'}],
      group: 'legacy',
      hidden: () => true,
    }),
    defineField({
      name: 'footer',
      title: 'Footer (legacy nested)',
      type: 'object',
      group: 'legacy',
      hidden: () => true,
      fields: legacyFooterBlock,
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright (legacy)',
      type: 'string',
      group: 'legacy',
      hidden: () => true,
    }),
  ],
  preview: {prepare: () => ({title: 'Footer settings'})},
})
