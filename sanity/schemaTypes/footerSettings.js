import {defineField, defineType} from 'sanity'

const footerBlock = [
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
  defineField({name: 'tagline', title: 'Tagline', type: 'string', validation: (r) => r.max(80)}),
  defineField({
    name: 'descriptionLines',
    title: 'Description / location lines',
    type: 'array',
    of: [{type: 'string'}],
    validation: (r) => r.max(6),
  }),
  defineField({
    name: 'exploreTitle',
    title: 'Column title — explore',
    type: 'string',
    initialValue: 'Explore',
  }),
  defineField({
    name: 'exploreLinks',
    title: 'Explore links',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
  }),
  defineField({
    name: 'contactTitle',
    title: 'Column title — contact & links',
    type: 'string',
    initialValue: 'Contact',
  }),
  defineField({
    name: 'contactLinks',
    title: 'Contact & secondary links',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
  }),
  defineField({
    name: 'legalLinks',
    title: 'Legal links',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
  }),
  defineField({
    name: 'footerCertText',
    title: 'Certification line (raw text, optional)',
    type: 'array',
    of: [{type: 'string'}],
  }),
  defineField({
    name: 'footerCertPartners',
    title: 'Certifications (from Partners library)',
    type: 'array',
    of: [{type: 'reference', to: [{type: 'partner'}]}],
  }),
]

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  groups: [
    {name: 'footer', title: 'Footer content', default: true},
    {name: 'social', title: 'Social & legal'},
  ],
  fields: [
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: footerBlock,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{type: 'linkWithLabel'}],
      group: 'social',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright line',
      type: 'string',
      group: 'social',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'defaultWhatsappUrl',
      title: 'Default WhatsApp URL (site-wide)',
      type: 'url',
      group: 'social',
      description: 'Fallback when booking CTAs omit a WhatsApp link.',
    }),
  ],
  preview: {prepare: () => ({title: 'Footer settings'})},
})
