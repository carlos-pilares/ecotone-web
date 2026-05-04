import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeSourceListReadout} from '../components/homePage/HomeSourceListReadout'

const heroCardRow = {
  type: 'object',
  name: 'heroCardRow',
  title: 'Row',
  fields: [
    {name: 'label', title: 'Label', type: 'string'},
    {name: 'value', title: 'Value', type: 'string'},
  ],
  preview: {
    select: {l: 'label', v: 'value'},
    prepare({l, v}) {
      return {title: l || '—', subtitle: v}
    },
  },
}

const statItem = {
  type: 'object',
  name: 'homeStat',
  title: 'Stat',
  fields: [
    {name: 'number', title: 'Number', type: 'string'},
    {name: 'label', title: 'Label', type: 'string'},
  ],
  preview: {
    select: {n: 'number', l: 'label'},
    prepare({n, l}) {
      return {title: n || '—', subtitle: l}
    },
  },
}

const missionItem = {
  type: 'object',
  name: 'missionItem',
  title: 'Mission item',
  fields: [
    {
      name: 'iconType',
      title: 'Icon type',
      type: 'string',
      options: {
        list: [
          {title: 'Transport', value: 'transport'},
          {title: 'Lodge', value: 'lodge'},
          {title: 'Tech', value: 'tech'},
          {title: 'Group', value: 'group'},
          {title: 'Conservation', value: 'conservation'},
        ],
        layout: 'dropdown',
      },
    },
    {name: 'title', title: 'Title', type: 'string'},
    {name: 'subtitle', title: 'Subtitle', type: 'string'},
  ],
  preview: {
    select: {t: 'title', i: 'iconType'},
    prepare({t, i}) {
      return {title: t || 'Item', subtitle: i}
    },
  },
}

const bookingTrustItem = {
  type: 'object',
  name: 'bookingTrustItem',
  title: 'Trust item',
  fields: [
    {
      name: 'iconType',
      title: 'Icon type',
      type: 'string',
      options: {
        list: [
          {title: 'Shield', value: 'shield'},
          {title: 'Chart', value: 'chart'},
          {title: 'Heart', value: 'heart'},
          {title: 'Clock', value: 'clock'},
        ],
        layout: 'dropdown',
      },
    },
    {name: 'text', title: 'Text', type: 'string'},
  ],
  preview: {
    select: {t: 'text', i: 'iconType'},
    prepare({t, i}) {
      return {title: t || '—', subtitle: i}
    },
  },
}

const labelValue = {
  type: 'object',
  name: 'labelValue',
  title: 'Label & value',
  fields: [
    {name: 'label', title: 'Label', type: 'string'},
    {name: 'value', title: 'Value', type: 'string'},
  ],
  preview: {
    select: {l: 'label', v: 'value'},
    prepare({l, v}) {
      return {title: l, subtitle: v}
    },
  },
}

const explorerFilterTab = {
  type: 'object',
  name: 'homeExplorerFilterTab',
  title: 'Filter tab',
  fields: [
    {
      name: 'filterKey',
      title: 'Filter',
      type: 'string',
      options: {
        list: [
          {title: 'All', value: 'all'},
          {title: 'Nature Core', value: 'nature'},
          {title: 'Family Adventure', value: 'family'},
          {title: 'Exp. Learning', value: 'learning'},
          {title: 'Tailor Made', value: 'tailor'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {name: 'label', title: 'Label (visible)', type: 'string', validation: (Rule) => Rule.required()},
  ],
  preview: {
    select: {k: 'filterKey', l: 'label'},
    prepare({k, l}) {
      return {title: l || k || 'Tab', subtitle: k}
    },
  },
}

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'meta', title: 'SEO & metadata'},
    {name: 'hero', title: 'Hero', default: true},
    {name: 'stats', title: 'Stats'},
    {name: 'manifesto', title: 'Manifesto'},
    {name: 'explorer', title: 'Explorer (experiences section)'},
    {name: 'reviews', title: 'Reviews'},
    {name: 'tech', title: 'Tech'},
    {name: 'mission', title: 'Mission'},
    {name: 'partners', title: 'Partners'},
    {name: 'blog', title: 'Blog'},
    {name: 'booking', title: 'Booking CTA'},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO (home /)',
      type: 'seo',
      group: 'meta',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Eyebrow (location line)',
      type: 'string',
      group: 'hero',
    }),
    defineField({name: 'heroHeadline', title: 'Headline (bold)', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadlineLight', title: 'Headline (light)', type: 'string', group: 'hero'}),
    defineField({name: 'heroSubheadline', title: 'Subheadline', type: 'text', group: 'hero', rows: 3}),
    defineField({
      name: 'heroPills',
      title: 'Hero pills',
      type: 'array',
      of: [{type: 'string'}],
      group: 'hero',
    }),
    defineField({name: 'heroCta1Text', title: 'CTA 1 text', type: 'string', group: 'hero'}),
    defineField({name: 'heroCta1Link', title: 'CTA 1 link', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroCta1SmartLink',
      title: 'CTA 1 (smart link)',
      type: 'smartLink',
      group: 'hero',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),
    defineField({name: 'heroCta2Text', title: 'CTA 2 text', type: 'string', group: 'hero'}),
    defineField({name: 'heroCta2Link', title: 'CTA 2 link', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroCta2SmartLink',
      title: 'CTA 2 (smart link)',
      type: 'smartLink',
      group: 'hero',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),
    defineField({name: 'heroCardPrice', title: 'Hero card — price', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroCardPriceSuffix',
      title: 'Hero card — price line suffix',
      type: 'string',
      description: 'e.g. “per person” or “/person” (small text beside the price).',
      initialValue: '/person',
      group: 'hero',
    }),
    defineField({name: 'heroCardSubprice', title: 'Hero card — subprice line', type: 'string', group: 'hero'}),
    defineField({name: 'heroCardRows', title: 'Hero card — rows', type: 'array', of: [heroCardRow], group: 'hero'}),
    defineField({name: 'heroCardCtaText', title: 'Hero card — CTA text', type: 'string', group: 'hero'}),
    defineField({name: 'heroCardCtaLink', title: 'Hero card — CTA link', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroCardCtaSmartLink',
      title: 'Hero card — CTA (smart link)',
      type: 'smartLink',
      group: 'hero',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),
    defineField({
      name: 'heroScrollLabel',
      title: 'Scroll indicator label',
      type: 'string',
      description: 'Short word next to the scroll line (e.g. “scroll”).',
      group: 'hero',
    }),
    defineField({
      name: 'heroImageFallbackUrl',
      title: 'Hero image fallback URL',
      type: 'url',
      description: 'Used when no hero image asset is set (technical fallback).',
      group: 'hero',
    }),

    defineField({
      name: 'stats',
      title: 'Stats (4 items)',
      type: 'array',
      of: [statItem],
      validation: (Rule) => Rule.max(4).min(0),
      group: 'stats',
    }),

    defineField({name: 'manifestoEyebrow', title: 'Eyebrow', type: 'string', group: 'manifesto'}),
    defineField({name: 'manifestoHeadline', title: 'Headline', type: 'string', group: 'manifesto'}),
    defineField({name: 'manifestoBody1', title: 'Body 1', type: 'text', group: 'manifesto', rows: 4}),
    defineField({name: 'manifestoBody2', title: 'Body 2', type: 'text', group: 'manifesto', rows: 4}),
    defineField({
      name: 'manifestoImage',
      title: 'Image',
      type: 'image',
      group: 'manifesto',
      options: {hotspot: true},
    }),
    defineField({name: 'manifestoImageCaption', title: 'Image caption', type: 'string', group: 'manifesto'}),
    defineField({name: 'manifestoCta1Text', title: 'CTA 1 text', type: 'string', group: 'manifesto'}),
    defineField({name: 'manifestoCta1Link', title: 'CTA 1 link', type: 'string', group: 'manifesto'}),
    defineField({
      name: 'manifestoCta1SmartLink',
      title: 'CTA 1 (smart link)',
      type: 'smartLink',
      group: 'manifesto',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),
    defineField({name: 'manifestoCta2Text', title: 'CTA 2 text', type: 'string', group: 'manifesto'}),
    defineField({name: 'manifestoCta2Link', title: 'CTA 2 link', type: 'string', group: 'manifesto'}),
    defineField({
      name: 'manifestoCta2SmartLink',
      title: 'CTA 2 (smart link)',
      type: 'smartLink',
      group: 'manifesto',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),

    defineField({name: 'explorerEyebrow', title: 'Eyebrow', type: 'string', group: 'explorer'}),
    defineField({name: 'explorerHeadline', title: 'Headline', type: 'string', group: 'explorer'}),
    defineField({name: 'explorerSubheadline', title: 'Subheadline', type: 'text', group: 'explorer', rows: 3}),
    defineField({
      name: 'explorerFilterTabs',
      title: 'Filter tabs (labels)',
      type: 'array',
      of: [explorerFilterTab],
      group: 'explorer',
      description: 'Order matches display. Keys must align with experience program types (data-type on cards).',
    }),
    defineField({
      name: 'explorerPriceEnquireLabel',
      title: 'Price label — enquire / coming soon',
      type: 'string',
      group: 'explorer',
    }),
    defineField({
      name: 'explorerPriceCustomLabel',
      title: 'Price label — custom programs',
      type: 'string',
      group: 'explorer',
    }),
    defineField({name: 'explorerCardCtaViewLabel', title: 'Card CTA — view program', type: 'string', group: 'explorer'}),
    defineField({
      name: 'explorerCardCtaEnquireLabel',
      title: 'Card CTA — enquire',
      type: 'string',
      group: 'explorer',
    }),
    defineField({
      name: 'explorerTailorRouteDurationLabel',
      title: 'Tailor card — route/duration badge',
      type: 'string',
      group: 'explorer',
    }),
    defineField({
      name: 'explorerTailorDescriptionFallback',
      title: 'Tailor card — description fallback',
      type: 'text',
      rows: 2,
      group: 'explorer',
    }),
    defineField({name: 'explorerTailorCtaText', title: 'Tailor card — CTA text', type: 'string', group: 'explorer'}),
    defineField({
      name: 'explorerTailorWhatsappUrl',
      title: 'Tailor card — WhatsApp URL (optional)',
      type: 'url',
      group: 'explorer',
      description: 'If empty, uses Booking CTA 2 link or Site settings default WhatsApp.',
    }),
    defineField({
      name: 'explorerTailorWhatsappSmartLink',
      title: 'Tailor card — WhatsApp (smart link)',
      type: 'smartLink',
      group: 'explorer',
      description:
        'smartLink overrides legacy fields (Tailor CTA text + WhatsApp URL above). Optional.',
    }),
    defineField({
      name: 'explorerLearningBadgeLabels',
      title: 'Exp. learning — duration badges (3)',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.max(3),
      group: 'explorer',
    }),
    defineField({
      name: 'explorerEmptyGridMessage',
      title: 'Empty grid — message (no experiences loaded)',
      type: 'text',
      rows: 3,
      group: 'explorer',
    }),
    defineField({
      name: 'explorerEmptyGridLinkLabel',
      title: 'Empty grid — link label',
      type: 'string',
      group: 'explorer',
    }),
    defineField({
      name: 'explorerEmptyGridLinkHref',
      title: 'Empty grid — link URL',
      type: 'string',
      group: 'explorer',
    }),
    defineField({
      name: 'explorerEmptyGridSmartLink',
      title: 'Empty grid — link (smart link)',
      type: 'smartLink',
      group: 'explorer',
      description: 'smartLink overrides legacy fields (empty grid link label + URL). Optional.',
    }),
    defineField({
      name: 'explorerCardImageFallbackUrl',
      title: 'Card image fallback URL',
      type: 'url',
      group: 'explorer',
      description: 'When an experience has no main image. Leave empty to use the built-in technical placeholder.',
    }),
    defineField({
      name: 'explorerCatalogReadout',
      title: 'Experience catalog (read-only)',
      type: 'text',
      rows: 1,
      group: 'explorer',
      readOnly: true,
      components: {input: HomeSourceListReadout},
      options: {catalog: 'experiences'},
    }),

    defineField({name: 'reviewsEyebrow', title: 'Eyebrow', type: 'string', group: 'reviews'}),
    defineField({name: 'reviewsHeadline', title: 'Headline', type: 'string', group: 'reviews'}),
    defineField({
      name: 'reviewsBody',
      title: 'Intro / body',
      type: 'text',
      rows: 4,
      group: 'reviews',
      description: 'Optional intro under the reviews heading on Home (when the site reads this field).',
    }),
    defineField({
      name: 'reviewsScore',
      title: 'Score (display)',
      type: 'string',
      initialValue: '5.0',
      group: 'reviews',
    }),
    defineField({
      name: 'reviewsSourceLabel',
      title: 'Source label (e.g. Trustpilot)',
      type: 'string',
      group: 'reviews',
    }),
    defineField({
      name: 'reviewsEmptyMessage',
      title: 'Empty state — no review documents',
      type: 'text',
      rows: 3,
      group: 'reviews',
      description: 'Shown when there are no reviews to list on Home.',
    }),
    defineField({
      name: 'homeSelectedReviews',
      title: 'Reviews on Home (order)',
      type: 'array',
      group: 'reviews',
      description:
        'Drag to set order. Canonical quote and author live on each Review document — edit there, not here.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'review'}],
          options: {disableNew: true},
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),

    defineField({name: 'techEyebrow', title: 'Eyebrow', type: 'string', group: 'tech'}),
    defineField({name: 'techHeadline', title: 'Headline', type: 'string', group: 'tech'}),
    defineField({name: 'techBody', title: 'Body', type: 'text', group: 'tech', rows: 4}),
    defineField({
      name: 'technologyCatalogReadout',
      title: 'Tech product catalog (read-only)',
      type: 'text',
      rows: 1,
      group: 'tech',
      readOnly: true,
      components: {input: HomeSourceListReadout},
      options: {catalog: 'technologyProducts'},
    }),
    defineField({
      name: 'homeSelectedTechnologyProducts',
      title: 'Tech products on Home (order)',
      type: 'array',
      group: 'tech',
      description:
        'Optional curated list and order. Leave empty to fall back to site rules (e.g. all products). Edit each product under Content → Tech product.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'technologyProduct'}],
          options: {disableNew: true},
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),

    defineField({name: 'missionEyebrow', title: 'Eyebrow', type: 'string', group: 'mission'}),
    defineField({name: 'missionHeadline', title: 'Headline', type: 'string', group: 'mission'}),
    defineField({name: 'missionBody', title: 'Body', type: 'text', group: 'mission', rows: 4}),
    defineField({name: 'missionItems', title: 'Items', type: 'array', of: [missionItem], group: 'mission'}),
    defineField({name: 'missionCtaText', title: 'CTA text', type: 'string', group: 'mission'}),
    defineField({name: 'missionCtaLink', title: 'CTA link', type: 'string', group: 'mission'}),
    defineField({
      name: 'missionCtaSmartLink',
      title: 'Mission — CTA (smart link)',
      type: 'smartLink',
      group: 'mission',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),
    defineField({name: 'missionPhoto1', title: 'Photo 1', type: 'image', group: 'mission', options: {hotspot: true}}),
    defineField({name: 'missionPhoto2', title: 'Photo 2', type: 'image', group: 'mission', options: {hotspot: true}}),
    defineField({name: 'missionPhoto3', title: 'Photo 3', type: 'image', group: 'mission', options: {hotspot: true}}),

    defineField({
      name: 'partnersLabel',
      title: 'Section label',
      type: 'string',
      initialValue: 'Certified by & affiliated with',
      group: 'partners',
    }),
    defineField({
      name: 'partnersBody',
      title: 'Intro / body',
      type: 'text',
      rows: 4,
      group: 'partners',
      description: 'Optional text under the partners heading on Home (when the site reads this field).',
    }),
    defineField({
      name: 'partnersEmptyMessage',
      title: 'When no partners load — message (optional)',
      type: 'text',
      rows: 3,
      group: 'partners',
      description:
        'If the partner list is empty, show this text instead of the logo row. Leave empty to hide the whole partners band.',
    }),
    defineField({
      name: 'partnerNameFallback',
      title: 'Fallback partner name (missing name on document)',
      type: 'string',
      group: 'partners',
    }),
    defineField({
      name: 'partnersCatalogReadout',
      title: 'Partner catalog (read-only)',
      type: 'text',
      rows: 1,
      group: 'partners',
      readOnly: true,
      components: {input: HomeSourceListReadout},
      options: {catalog: 'partners'},
    }),
    defineField({
      name: 'homeSelectedPartners',
      title: 'Partners on Home (order)',
      type: 'array',
      group: 'partners',
      description:
        'Drag to set order. Names, logos, and links are edited on each Partner document — not here.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'partner'}],
          options: {disableNew: true},
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),

    defineField({name: 'blogEyebrow', title: 'Eyebrow', type: 'string', group: 'blog'}),
    defineField({name: 'blogHeadline', title: 'Headline', type: 'string', group: 'blog'}),
    defineField({
      name: 'blogAllPostsLabel',
      title: '“All posts” link label',
      type: 'string',
      group: 'blog',
    }),
    defineField({
      name: 'blogAllPostsUrl',
      title: '“All posts” URL',
      type: 'url',
      group: 'blog',
      description: 'External blog index or in-site path. Avoid a bare “#”.',
    }),
    defineField({
      name: 'blogAllPostsSmartLink',
      title: '“All posts” (smart link)',
      type: 'smartLink',
      group: 'blog',
      description: 'smartLink overrides legacy fields (all posts label + URL). Optional.',
    }),
    defineField({
      name: 'blogReadLabel',
      title: 'Card “Read” link label',
      type: 'string',
      group: 'blog',
    }),
    defineField({
      name: 'blogFallbackCategory',
      title: 'Fallback category tag',
      type: 'string',
      group: 'blog',
      description: 'When a post has no category in CMS.',
    }),
    defineField({
      name: 'blogFallbackReadingMinutes',
      title: 'Fallback reading time (minutes)',
      type: 'number',
      group: 'blog',
    }),
    defineField({
      name: 'blogEmptyMessage',
      title: 'When no posts load — message',
      type: 'text',
      rows: 3,
      group: 'blog',
    }),
    defineField({
      name: 'blogFallbackPostHref',
      title: 'Card link fallback (no external URL / slug)',
      type: 'string',
      group: 'blog',
      description: 'e.g. #blog or https://… Used when a post has no external link or slug.',
    }),
    defineField({
      name: 'blogBody',
      title: 'Intro / body',
      type: 'text',
      rows: 4,
      group: 'blog',
      description: 'Optional intro under the blog heading on Home (when the site reads this field).',
    }),
    defineField({
      name: 'blogCatalogReadout',
      title: 'Blog post catalog (read-only)',
      type: 'text',
      rows: 1,
      group: 'blog',
      readOnly: true,
      components: {input: HomeSourceListReadout},
      options: {catalog: 'blogPosts'},
    }),
    defineField({
      name: 'homeSelectedBlogPosts',
      title: 'Blog posts on Home (order)',
      type: 'array',
      group: 'blog',
      description:
        'Drag to set order. Titles, images, and links are edited on each Blog post — not here.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'blogPost'}],
          options: {disableNew: true},
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),

    defineField({name: 'bookingEyebrow', title: 'Eyebrow', type: 'string', group: 'booking'}),
    defineField({name: 'bookingHeadline', title: 'Headline', type: 'string', group: 'booking'}),
    defineField({name: 'bookingBody', title: 'Body', type: 'text', group: 'booking', rows: 4}),
    defineField({name: 'bookingTrustItems', title: 'Trust items', type: 'array', of: [bookingTrustItem], group: 'booking'}),
    defineField({name: 'bookingPrice', title: 'Price line', type: 'string', group: 'booking'}),
    defineField({
      name: 'bookingPriceSuffixSmall',
      title: 'Price suffix (small)',
      type: 'string',
      description: 'Small text beside the price (e.g. “/ person”).',
      group: 'booking',
    }),
    defineField({name: 'bookingPriceSubtext', title: 'Price subtext', type: 'string', group: 'booking'}),
    defineField({name: 'bookingCardRows', title: 'Card rows (label / value)', type: 'array', of: [labelValue], group: 'booking'}),
    defineField({name: 'bookingCta1Text', title: 'CTA 1 text', type: 'string', group: 'booking'}),
    defineField({name: 'bookingCta1Link', title: 'CTA 1 link', type: 'string', group: 'booking'}),
    defineField({
      name: 'bookingCta1SmartLink',
      title: 'CTA 1 (smart link)',
      type: 'smartLink',
      group: 'booking',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),
    defineField({name: 'bookingCta2Text', title: 'CTA 2 text', type: 'string', group: 'booking'}),
    defineField({name: 'bookingCta2Link', title: 'CTA 2 link', type: 'string', group: 'booking'}),
    defineField({
      name: 'bookingCta2SmartLink',
      title: 'CTA 2 (smart link)',
      type: 'smartLink',
      group: 'booking',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home page'}
    },
  },
})
