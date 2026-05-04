import {defineField, defineType} from 'sanity'

/**
 * Single URL for `/routes` — all sections inline (no `route` document refs as source of truth).
 */
export const routesPage = defineType({
  name: 'routesPage',
  title: 'Routes page',
  type: 'document',
  groups: [
    {name: 'general', title: 'General & SEO', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'snapshot', title: 'Snapshot bar'},
    {name: 'territory', title: 'Territory'},
    {name: 'routeCards', title: 'Route cards'},
    {name: 'compare', title: 'Comparison table'},
    {name: 'experiences', title: 'Experiences grid'},
    {name: 'reviews', title: 'Reviews'},
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
    defineField({name: 'heroTitleLine1', title: 'Title line 1', type: 'string', group: 'hero'}),
    defineField({name: 'heroTitleLine2', title: 'Title line 2', type: 'string', group: 'hero'}),
    defineField({name: 'heroTagline', title: 'Tagline', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroPrimaryCta', title: 'Primary CTA', type: 'linkWithLabel', group: 'hero'}),
    defineField({name: 'heroSecondaryCta', title: 'Secondary CTA', type: 'linkWithLabel', group: 'hero'}),

    // --- Snapshot ---
    defineField({
      name: 'snapshotStats',
      title: 'Snapshot stats',
      type: 'array',
      group: 'snapshot',
      of: [{type: 'routesPageStatLine'}],
      validation: (Rule) => Rule.max(8),
    }),

    // --- Territory ---
    defineField({name: 'territorySectionId', title: 'Section HTML id', type: 'string', group: 'territory', initialValue: 'territory'}),
    defineField({name: 'territoryEyebrow', title: 'Eyebrow', type: 'string', group: 'territory'}),
    defineField({name: 'territoryH2', title: 'Heading', type: 'string', group: 'territory'}),
    defineField({name: 'territoryBody', title: 'Body', type: 'text', rows: 4, group: 'territory'}),
    defineField({
      name: 'territoryStrip',
      title: 'Strip chips',
      type: 'array',
      group: 'territory',
      of: [{type: 'routesPageTerritoryStripChip'}],
      validation: (Rule) => Rule.max(6),
    }),

    // --- Route cards ---
    defineField({
      name: 'routeCards',
      title: 'Route cards',
      type: 'array',
      group: 'routeCards',
      of: [{type: 'routesPageRouteCard'}],
      validation: (Rule) => Rule.max(6),
    }),

    // --- Compare ---
    defineField({name: 'compareSectionId', title: 'Section HTML id', type: 'string', group: 'compare', initialValue: 'compare'}),
    defineField({name: 'compareEyebrow', title: 'Eyebrow', type: 'string', group: 'compare'}),
    defineField({name: 'compareH2', title: 'Heading', type: 'string', group: 'compare'}),
    defineField({name: 'compareIntro', title: 'Intro', type: 'text', rows: 3, group: 'compare'}),
    defineField({
      name: 'compareColumns',
      title: 'Columns (3)',
      type: 'array',
      group: 'compare',
      of: [{type: 'routesPageCompareColumn'}],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
    defineField({
      name: 'compareRows',
      title: 'Rows',
      type: 'array',
      group: 'compare',
      of: [
        {type: 'routesCompareRowText'},
        {type: 'routesCompareRowDots'},
        {type: 'routesCompareRowLodge'},
        {type: 'routesCompareRowBest'},
        {type: 'routesCompareRowPrice'},
      ],
    }),

    // --- Experiences ---
    defineField({name: 'experiencesSectionId', title: 'Section HTML id', type: 'string', group: 'experiences', initialValue: 'experiences'}),
    defineField({name: 'experiencesEyebrow', title: 'Eyebrow', type: 'string', group: 'experiences'}),
    defineField({name: 'experiencesH2', title: 'Heading', type: 'string', group: 'experiences'}),
    defineField({name: 'experiencesIntro', title: 'Intro', type: 'text', rows: 3, group: 'experiences'}),
    defineField({name: 'experiencesAllLabel', title: '“See all” link label', type: 'string', group: 'experiences'}),
    defineField({name: 'experiencesAllHref', title: '“See all” link URL', type: 'string', group: 'experiences'}),
    defineField({
      name: 'experiencesFilters',
      title: 'Filter pills (optional)',
      description: 'If empty, the site uses default filters (All, Camanti, Manu Road, Manu Core).',
      type: 'array',
      group: 'experiences',
      of: [{type: 'routesPageExpFilterPill'}],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'experienceCards',
      title: 'Experience cards',
      type: 'array',
      group: 'experiences',
      of: [{type: 'routesPageExpCard'}],
      validation: (Rule) => Rule.max(24),
    }),

    // --- Reviews ---
    defineField({
      name: 'reviewsFeaturedQuotes',
      title: 'Featured rotating quotes',
      type: 'array',
      group: 'reviews',
      of: [{type: 'routesPageFeaturedQuote'}],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'reviewsRefs',
      title: 'Review documents (carousel)',
      type: 'array',
      group: 'reviews',
      of: [{type: 'reference', to: [{type: 'review'}]}],
      validation: (Rule) => Rule.max(48),
    }),
    defineField({name: 'reviewsEyebrow', title: 'Eyebrow', type: 'string', group: 'reviews'}),
    defineField({name: 'reviewsHeadline', title: 'Headline', type: 'string', group: 'reviews'}),
    defineField({name: 'reviewsSectionLead', title: 'Intro under headline', type: 'text', rows: 3, group: 'reviews'}),
    defineField({name: 'reviewsAverageRating', title: 'Average rating (display)', type: 'string', group: 'reviews', initialValue: '5.0'}),
    defineField({name: 'reviewsSourceLabel', title: 'Source label', type: 'string', group: 'reviews', initialValue: 'Trustpilot'}),
    defineField({name: 'reviewsSecondaryRatingLine', title: 'Line under stars', type: 'string', group: 'reviews'}),

    // --- Final CTA ---
    defineField({name: 'finalCtaSectionId', title: 'Section HTML id', type: 'string', group: 'finalCta', initialValue: 'contact'}),
    defineField({name: 'finalCtaEyebrow', title: 'Eyebrow', type: 'string', group: 'finalCta'}),
    defineField({name: 'finalCtaH2', title: 'Heading', type: 'string', group: 'finalCta'}),
    defineField({name: 'finalCtaBody', title: 'Body', type: 'text', rows: 4, group: 'finalCta'}),
    defineField({name: 'finalCtaWhatsappHref', title: 'WhatsApp URL', type: 'string', group: 'finalCta'}),
    defineField({name: 'finalCtaWhatsappLabel', title: 'WhatsApp button label', type: 'string', group: 'finalCta'}),
    defineField({name: 'finalCtaSecondaryHref', title: 'Secondary link URL', type: 'string', group: 'finalCta'}),
    defineField({name: 'finalCtaSecondaryLabel', title: 'Secondary link label', type: 'string', group: 'finalCta'}),
    defineField({
      name: 'finalCtaTrustItems',
      title: 'Trust strip',
      type: 'array',
      group: 'finalCta',
      of: [{type: 'routesPageTrustItem'}],
      validation: (Rule) => Rule.max(8),
    }),
  ],
  preview: {
    select: {t: 'internalTitle', slug: 'slug.current'},
    prepare: ({t, slug}) => ({
      title: t || 'Routes page',
      subtitle: slug ? `/${slug}` : '',
    }),
  },
})
