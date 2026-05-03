import {defineField, defineType} from 'sanity'

const headerBlock = [
  defineField({
    name: 'headerLogoFullHorizontal',
    title: 'Logo — full horizontal (primary)',
    type: 'image',
    options: {hotspot: true},
    description:
      'Default lockup; used for header and footer if the light/dark/footer-specific images below are not set. Keep this the canonical asset.',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'headerLogoLight',
    title: 'Header logo — light (on dark hero)',
    type: 'image',
    options: {hotspot: true},
    description: 'Cream / light mark over photography or dark hero. If empty, the primary horizontal logo is used.',
  }),
  defineField({
    name: 'headerLogoDark',
    title: 'Header logo — dark (solid / light bar)',
    type: 'image',
    options: {hotspot: true},
    description: 'Darker mark for the sticky, light background header. If empty, the primary is used; upload a separate asset for best contrast.',
  }),
  defineField({name: 'homePath', title: 'Logo link target', type: 'string', initialValue: '/'}),
  defineField({
    name: 'mainNav',
    title: 'Main navigation',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
  }),
  defineField({name: 'primaryCta', title: 'Primary CTA (e.g. Book now)', type: 'cta'}),
  defineField({
    name: 'mobileMenuAriaLabel',
    title: 'Mobile menu button (aria label)',
    type: 'string',
    initialValue: 'Open menu',
  }),
]

const footerBlock = [
  defineField({
    name: 'footerLogo',
    title: 'Footer logo (optional)',
    type: 'image',
    options: {hotspot: true},
    description: 'If empty, the “full horizontal (footer)” field or the header primary logo is used.',
  }),
  defineField({
    name: 'footerLogoFullHorizontal',
    title: 'Logo — full horizontal (footer)',
    type: 'image',
    options: {hotspot: true},
    description:
      'Default footer mark: one full lockup, same as header unless you need a different treatment. ' +
      'Superseded by “Footer logo” when that is set. Not composed from isotipo + name.',
  }),
  defineField({name: 'showBrandDeco', title: 'Show large isotipo in footer background', type: 'boolean', initialValue: true}),
  defineField({name: 'tagline', title: 'Tagline', type: 'string', validation: (r) => r.max(80)}),
  defineField({name: 'descriptionLines', title: 'Description / location lines', type: 'array', of: [{type: 'string'}], validation: (r) => r.max(6)}),
  defineField({name: 'exploreTitle', title: 'Column title — explore', type: 'string', initialValue: 'Explore'}),
  defineField({name: 'exploreLinks', title: 'Explore links', type: 'array', of: [{type: 'linkWithLabel'}]}),
  defineField({name: 'contactTitle', title: 'Column title — contact & links', type: 'string', initialValue: 'Contact'}),
  defineField({name: 'contactLinks', title: 'Contact & secondary links', type: 'array', of: [{type: 'linkWithLabel'}]}),
  defineField({name: 'legalLinks', title: 'Legal links (footer)', type: 'array', of: [{type: 'linkWithLabel'}]}),
  defineField({name: 'footerCertText', title: 'Certification line (raw text, optional)', type: 'array', of: [{type: 'string'}], description: 'e.g. B Corp · ATTA — if not using partner references.'}),
  defineField({
    name: 'footerCertPartners',
    title: 'Certifications (from Partners library)',
    type: 'array',
    of: [{type: 'reference', to: [{type: 'partner'}]}],
  }),
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site: header, footer & brand',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Brand & defaults', default: true},
    {name: 'library', title: 'Brand assets (optional)'},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
    {name: 'social', title: 'Social & legal'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name (brand)',
      type: 'string',
      group: 'brand',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO (site-wide fallback)',
      type: 'seo',
      group: 'brand',
    }),
    defineField({
      name: 'brandIsotipo',
      title: 'Isotipo (library)',
      type: 'image',
      options: {hotspot: true},
      group: 'library',
      description:
        'Mark only. For favicon, app icons, or decorative use. Do not use with wordmark to assemble the main header/footer — use full horizontal there.',
    }),
    defineField({
      name: 'brandLogoFullVertical',
      title: 'Logo full vertical (library)',
      type: 'image',
      options: {hotspot: true},
      group: 'library',
      description: 'Stacked/vertical full lockup for special layouts, print, or social — not the default shell logo.',
    }),
    defineField({
      name: 'brandLogoNombre',
      title: 'Logo nombre / wordmark (library)',
      type: 'image',
      options: {hotspot: true},
      group: 'library',
      description: 'Name/text mark alone. For rare cases; header/footer use the full horizontal lockup, not isotipo + this.',
    }),
    defineField({name: 'header', title: 'Header', type: 'object', group: 'header', fields: headerBlock}),
    defineField({name: 'footer', title: 'Footer', type: 'object', group: 'footer', fields: footerBlock}),
    defineField({
      name: 'socialLinks',
      title: 'Social links (optional, icon mapping in front later)',
      type: 'array',
      of: [{type: 'linkWithLabel'}],
      group: 'social',
    }),
    defineField({name: 'copyright', title: 'Copyright line', type: 'string', group: 'social', validation: (r) => r.max(200)}),
    defineField({
      name: 'defaultWhatsappUrl',
      title: 'Default WhatsApp URL (site-wide)',
      type: 'url',
      group: 'social',
      description:
        'Used when Home booking or explorer CTAs omit a WhatsApp link. Include https://wa.me/… with optional ?text=.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
