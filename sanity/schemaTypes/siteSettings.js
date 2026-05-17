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

  // --- Header nav (matches live mega menu) ---
  defineField({
    name: 'routesEnabled',
    title: 'Routes — show in header',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'routesLabel',
    title: 'Routes — label',
    type: 'string',
    initialValue: 'Routes',
    validation: (Rule) => Rule.max(40),
  }),
  defineField({
    name: 'routesLinkSmartLink',
    title: 'Routes — link',
    type: 'smartLink',
    description: 'Usually “Page within the website” → Routes. If empty, the site links to /routes.',
  }),
  defineField({
    name: 'aboutEnabled',
    title: 'About — show in header',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'aboutLabel',
    title: 'About — label',
    type: 'string',
    initialValue: 'About',
    validation: (Rule) => Rule.max(40),
  }),
  defineField({
    name: 'aboutLinkSmartLink',
    title: 'About — link',
    type: 'smartLink',
    description: 'Usually “Page within the website” → About. If empty, the site links to /about.',
  }),

  defineField({
    name: 'experiencesEnabled',
    title: 'Experiences — show dropdown',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'experiencesLabel',
    title: 'Experiences — top nav label',
    type: 'string',
    initialValue: 'Experiences',
    validation: (Rule) => Rule.max(40),
  }),
  defineField({
    name: 'experiencesGroupOverrides',
    title: 'Experiences — group overrides',
    type: 'array',
    of: [{type: 'headerNavExperienceGroupOverride'}],
    description:
      'Optional. One row per program group you want to customize. Valid group keys come from published experience pages: **classic** (nature-core), **signature** (family-adventure), **learning** (experiential-learning). Groups with no visible experiences are hidden automatically.',
  }),
  defineField({
    name: 'experiencesItemOverrides',
    title: 'Experiences — item overrides',
    type: 'array',
    of: [{type: 'headerNavExperienceItemOverride'}],
    description: 'Hide, relabel, or re-order individual experience landings in the mega menu.',
  }),
  defineField({
    name: 'experiencesTailorMenu',
    title: 'Experiences — Tailor Made (sidebar)',
    type: 'headerNavExperiencesTailorMenu',
    description: 'Tailor Made is a fixed CTA column (not derived from experience types). Panel copy uses “Tailor Made” fields below.',
  }),
  defineField({
    name: 'experiencesGroups',
    title: 'Legacy — Experiences program groups',
    type: 'headerNavExperiencesGroups',
    hidden: () => true,
    description:
      'Legacy fixed Classic / Signature / Learning / Tailor rows. Hidden from editors. Used only as fallback when “Group overrides” is empty.',
  }),
  defineField({
    name: 'experiencesSeeAll',
    title: 'Experiences — “See all” link',
    type: 'headerNavSeeAll',
    description: 'Footer link in the Experiences dropdown. Disable if you do not want this CTA.',
  }),

  defineField({
    name: 'lodgesEnabled',
    title: 'Lodges — show dropdown',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'lodgesLabel',
    title: 'Lodges — top nav label',
    type: 'string',
    initialValue: 'Lodges',
    validation: (Rule) => Rule.max(40),
  }),
  defineField({
    name: 'lodgesRouteOverrides',
    title: 'Legacy — Lodges route overrides',
    type: 'array',
    of: [{type: 'headerNavLodgeRouteOverride'}],
    hidden: () => true,
    description:
      'Deprecated. Route columns come from Route documents + lodge.route. Data preserved for rollback; not read by the site.',
  }),
  defineField({
    name: 'lodgesItemOverrides',
    title: 'Lodges — item overrides',
    type: 'array',
    of: [{type: 'headerNavLodgeItemOverride'}],
    description: 'Hide, relabel, or re-order individual lodge landings in the mega menu.',
  }),
  defineField({
    name: 'lodgeGroups',
    title: 'Legacy — Lodges route groups',
    type: 'headerNavLodgeGroups',
    hidden: () => true,
    description: 'Legacy fixed Camanti / Manu Road / Manu Core. Hidden from editors. Fallback when “Route overrides” is empty.',
  }),
  defineField({
    name: 'lodgesSeeAll',
    title: 'Lodges — “See all” link',
    type: 'headerNavSeeAll',
    description: 'Footer link in the Lodges dropdown. Disable if you do not want this CTA.',
  }),

  defineField({
    name: 'navBookNowSmartLink',
    title: 'Book now (smart link)',
    type: 'smartLink',
    description:
      'Sticky header “Book now” button. When set with a label, this replaces the legacy Primary CTA below for the live site.',
  }),
  defineField({
    name: 'primaryCta',
    title: 'Primary CTA (legacy fallback)',
    type: 'cta',
    description:
      'Fallback when Book now smart link is empty or incomplete. Hidden when Book now smart link has a label. Legacy: kept for older content.',
    hidden: ({parent}) => Boolean(parent?.navBookNowSmartLink?.label?.trim()),
  }),
  defineField({
    name: 'mobileMenuAriaLabel',
    title: 'Mobile menu button (aria label)',
    type: 'string',
    initialValue: 'Open menu',
  }),
  defineField({
    name: 'navTailorMadeSmartLink',
    title: 'Tailor Made — CTA (mega menu)',
    type: 'smartLink',
    description: 'Destination for the Tailor Made panel (e.g. WhatsApp).',
  }),
  defineField({
    name: 'navTailorMadeTitle',
    title: 'Tailor Made — title',
    type: 'string',
    validation: (Rule) => Rule.max(120),
  }),
  defineField({
    name: 'navTailorMadeSubtitle',
    title: 'Tailor Made — subtitle',
    type: 'string',
    validation: (Rule) => Rule.max(160),
  }),
  defineField({
    name: 'navTailorMadeBody',
    title: 'Tailor Made — body (optional)',
    type: 'text',
    rows: 3,
    validation: (Rule) => Rule.max(400),
  }),

  defineField({
    name: 'mainNav',
    title: 'Main navigation (legacy)',
    type: 'array',
    of: [{type: 'linkWithLabel'}],
    hidden: () => true,
    description:
      'Legacy: old flat link list (Experiences hash, external Lodges, etc.). Hidden from editors. The live header uses the structured fields above. Kept only as a fallback for older tooling.',
  }),
  defineField({
    name: 'navExperiencesSeeAllSmartLink',
    title: 'Legacy — “All experiences” smart link',
    type: 'smartLink',
    hidden: () => true,
    description: 'Superseded by “Experiences — See all link”. Merged at read time if the new block is empty.',
  }),
  defineField({
    name: 'navLodgesSeeAllSmartLink',
    title: 'Legacy — “All lodges” smart link',
    type: 'smartLink',
    hidden: () => true,
    description: 'Superseded by “Lodges — See all link”. Merged at read time if the new block is empty.',
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
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Brand & defaults', default: true},
    {name: 'library', title: 'Brand assets (optional)'},
    {name: 'header', title: 'Header (legacy)', hidden: true},
    {name: 'footer', title: 'Footer (legacy)', hidden: true},
    {name: 'social', title: 'Social & legal (legacy)', hidden: true},
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
    defineField({
      name: 'header',
      title: 'Header (legacy — use Settings → Header)',
      type: 'object',
      group: 'header',
      fields: headerBlock,
      hidden: () => true,
      description: 'Preserved for migration. Edit Header settings instead.',
    }),
    defineField({
      name: 'footer',
      title: 'Footer (legacy — use Settings → Footer)',
      type: 'object',
      group: 'footer',
      fields: footerBlock,
      hidden: () => true,
      description: 'Preserved for migration. Edit Footer settings instead.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links (legacy)',
      type: 'array',
      of: [{type: 'linkWithLabel'}],
      group: 'social',
      hidden: () => true,
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright (legacy)',
      type: 'string',
      group: 'social',
      validation: (r) => r.max(200),
      hidden: () => true,
    }),
    defineField({
      name: 'defaultWhatsappUrl',
      title: 'Default WhatsApp URL (legacy)',
      type: 'url',
      group: 'social',
      hidden: () => true,
      description: 'Moved to Settings → Footer. Kept for fallback reads.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
