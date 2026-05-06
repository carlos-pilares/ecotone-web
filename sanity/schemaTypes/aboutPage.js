import {defineField, defineType} from 'sanity'

/**
 * Singleton `/about` — all on-page copy & media (no separate knowledge base).
 * `_id` must be `aboutPage` (see `CMS_IDS.aboutPage`).
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: [
    {name: 'general', title: 'General & SEO', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'who', title: 'Who we are'},
    {name: 'why', title: 'Why we exist'},
    {name: 'different', title: 'What makes us different'},
    {name: 'way', title: 'Our way'},
    {name: 'people', title: 'People'},
    {name: 'proof', title: 'Proof / Growing platform'},
    {name: 'partners', title: 'Partners'},
    {name: 'finalCta', title: 'Final CTA'},
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title (Studio only)',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / URL',
      type: 'slug',
      group: 'general',
      options: {source: 'internalTitle', maxLength: 96},
      initialValue: {_type: 'slug', current: 'about'},
      description: 'Must stay `about` for the /about route.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'general',
    }),

    // --- Hero ---
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
    }),
    defineField({name: 'heroImageAlt', title: 'Hero image alt', type: 'string', group: 'hero'}),
    defineField({name: 'heroEyebrow', title: 'Eyebrow', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroTitle',
      title: 'Title',
      type: 'text',
      rows: 3,
      description: 'One or two lines. Use a line break between lines.',
      group: 'hero',
    }),
    defineField({name: 'heroTagline', title: 'Tagline', type: 'text', rows: 3, group: 'hero'}),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Primary CTA (legacy)',
      type: 'linkWithLabel',
      group: 'hero',
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Secondary CTA (legacy)',
      type: 'linkWithLabel',
      group: 'hero',
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'heroPrimarySmartLink',
      title: 'Primary CTA',
      type: 'smartLink',
      group: 'hero',
      description: 'Primary editor control for the hero button.',
    }),
    defineField({
      name: 'heroSecondarySmartLink',
      title: 'Secondary CTA',
      type: 'smartLink',
      group: 'hero',
      description: 'Primary editor control for the secondary hero button.',
    }),

    // --- Who we are ---
    defineField({
      name: 'whoSectionId',
      title: 'Section HTML id',
      type: 'string',
      group: 'who',
      initialValue: 'who',
    }),
    defineField({
      name: 'whoImage',
      title: 'Image',
      type: 'image',
      group: 'who',
      options: {hotspot: true},
    }),
    defineField({name: 'whoImageAlt', title: 'Image alt', type: 'string', group: 'who'}),
    defineField({name: 'whoEyebrow', title: 'Eyebrow', type: 'string', group: 'who'}),
    defineField({name: 'whoTitle', title: 'Title', type: 'string', group: 'who'}),
    defineField({
      name: 'whoBodyParagraphs',
      title: 'Body paragraphs',
      type: 'array',
      group: 'who',
      of: [{type: 'aboutPageParagraph'}],
    }),
    defineField({
      name: 'whoPills',
      title: 'Pills',
      type: 'array',
      group: 'who',
      of: [{type: 'aboutPagePill'}],
      validation: (Rule) => Rule.max(12),
    }),

    // --- Why we exist ---
    defineField({
      name: 'whySectionId',
      title: 'Section HTML id',
      type: 'string',
      group: 'why',
      initialValue: 'why',
    }),
    defineField({name: 'whyEyebrow', title: 'Eyebrow', type: 'string', group: 'why'}),
    defineField({
      name: 'whyTitle',
      title: 'Title',
      type: 'text',
      rows: 3,
      description: 'One or two lines; use a line break between lines.',
      group: 'why',
    }),
    defineField({name: 'whyBody', title: 'Body', type: 'text', rows: 5, group: 'why'}),

    // --- What makes us different ---
    defineField({
      name: 'diffSectionId',
      title: 'Section HTML id',
      type: 'string',
      group: 'different',
      initialValue: 'different',
    }),
    defineField({name: 'diffEyebrow', title: 'Eyebrow', type: 'string', group: 'different'}),
    defineField({name: 'diffTitle', title: 'Title', type: 'string', group: 'different'}),
    defineField({
      name: 'diffCards',
      title: 'Cards',
      type: 'array',
      group: 'different',
      of: [{type: 'aboutPageDiffCard'}],
      validation: (Rule) => Rule.max(8),
    }),

    // --- Our way ---
    defineField({
      name: 'waySectionId',
      title: 'Section HTML id',
      type: 'string',
      group: 'way',
      initialValue: 'way',
    }),
    defineField({
      name: 'wayImage',
      title: 'Image',
      type: 'image',
      group: 'way',
      options: {hotspot: true},
    }),
    defineField({name: 'wayImageAlt', title: 'Image alt', type: 'string', group: 'way'}),
    defineField({name: 'wayEyebrow', title: 'Eyebrow', type: 'string', group: 'way'}),
    defineField({name: 'wayTitle', title: 'Title', type: 'string', group: 'way'}),
    defineField({
      name: 'wayBodyParagraphs',
      title: 'Body paragraphs',
      type: 'array',
      group: 'way',
      of: [{type: 'aboutPageParagraph'}],
    }),
    defineField({name: 'wayPullquote', title: 'Pull quote', type: 'text', rows: 2, group: 'way'}),

    // --- People ---
    defineField({
      name: 'peopleSectionId',
      title: 'Section HTML id',
      type: 'string',
      group: 'people',
      initialValue: 'people',
    }),
    defineField({name: 'peopleEyebrow', title: 'Eyebrow', type: 'string', group: 'people'}),
    defineField({name: 'peopleTitle', title: 'Title', type: 'string', group: 'people'}),
    defineField({name: 'peopleBody', title: 'Intro body', type: 'text', rows: 4, group: 'people'}),
    defineField({
      name: 'peopleCards',
      title: 'People',
      type: 'array',
      group: 'people',
      of: [{type: 'aboutPagePerson'}],
      validation: (Rule) => Rule.max(12),
    }),

    // --- Proof ---
    defineField({
      name: 'proofSectionId',
      title: 'Section HTML id',
      type: 'string',
      group: 'proof',
      initialValue: 'proof',
    }),
    defineField({name: 'proofEyebrow', title: 'Eyebrow', type: 'string', group: 'proof'}),
    defineField({name: 'proofTitle', title: 'Title', type: 'string', group: 'proof'}),
    defineField({name: 'proofBody', title: 'Body', type: 'text', rows: 4, group: 'proof'}),
    defineField({
      name: 'proofStats',
      title: 'Stats',
      type: 'array',
      group: 'proof',
      of: [{type: 'aboutPageStat'}],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'proofCertLabel',
      title: 'Cert row label (e.g. “Recognised by”)',
      type: 'string',
      group: 'proof',
    }),
    defineField({
      name: 'proofCerts',
      title: 'Certification labels',
      type: 'array',
      group: 'proof',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.max(20),
    }),

    // --- Partners ---
    defineField({
      name: 'partnersLabel',
      title: 'Band label',
      type: 'string',
      group: 'partners',
    }),
    defineField({
      name: 'partnersBody',
      title: 'Optional intro (below label)',
      type: 'text',
      rows: 3,
      group: 'partners',
    }),
    defineField({
      name: 'partnerRefs',
      title: 'Partners to show (order preserved)',
      type: 'array',
      group: 'partners',
      of: [{type: 'reference', to: [{type: 'partner'}]}],
      description:
        'If empty, the site uses all partners from the library (same as Home when none are curated).',
    }),

    // --- Final CTA ---
    defineField({
      name: 'finalSectionId',
      title: 'Section HTML id',
      type: 'string',
      group: 'finalCta',
      initialValue: 'contact',
    }),
    defineField({name: 'finalEyebrow', title: 'Eyebrow', type: 'string', group: 'finalCta'}),
    defineField({name: 'finalTitle', title: 'Title', type: 'string', group: 'finalCta'}),
    defineField({name: 'finalBody', title: 'Body', type: 'text', rows: 4, group: 'finalCta'}),
    defineField({
      name: 'finalButtons',
      title: 'Buttons',
      type: 'array',
      group: 'finalCta',
      of: [{type: 'aboutPageCtaButton'}],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'finalTrustItems',
      title: 'Trust strip items',
      type: 'array',
      group: 'finalCta',
      of: [{type: 'aboutPageTrustItem'}],
      validation: (Rule) => Rule.max(8),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About page', subtitle: '/about'}
    },
  },
})
