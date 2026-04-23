import {defineField, defineType} from 'sanity'

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

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
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
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
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
    defineField({name: 'heroCta2Text', title: 'CTA 2 text', type: 'string', group: 'hero'}),
    defineField({name: 'heroCta2Link', title: 'CTA 2 link', type: 'string', group: 'hero'}),
    defineField({name: 'heroCardPrice', title: 'Hero card — price', type: 'string', group: 'hero'}),
    defineField({name: 'heroCardSubprice', title: 'Hero card — subprice line', type: 'string', group: 'hero'}),
    defineField({name: 'heroCardRows', title: 'Hero card — rows', type: 'array', of: [heroCardRow], group: 'hero'}),
    defineField({name: 'heroCardCtaText', title: 'Hero card — CTA text', type: 'string', group: 'hero'}),
    defineField({name: 'heroCardCtaLink', title: 'Hero card — CTA link', type: 'string', group: 'hero'}),

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
    defineField({name: 'manifestoCta2Text', title: 'CTA 2 text', type: 'string', group: 'manifesto'}),
    defineField({name: 'manifestoCta2Link', title: 'CTA 2 link', type: 'string', group: 'manifesto'}),

    defineField({name: 'explorerEyebrow', title: 'Eyebrow', type: 'string', group: 'explorer'}),
    defineField({name: 'explorerHeadline', title: 'Headline', type: 'string', group: 'explorer'}),
    defineField({name: 'explorerSubheadline', title: 'Subheadline', type: 'text', group: 'explorer', rows: 3}),

    defineField({name: 'reviewsEyebrow', title: 'Eyebrow', type: 'string', group: 'reviews'}),
    defineField({name: 'reviewsHeadline', title: 'Headline', type: 'string', group: 'reviews'}),
    defineField({
      name: 'reviewsScore',
      title: 'Score (display)',
      type: 'string',
      initialValue: '5.0',
      group: 'reviews',
    }),

    defineField({name: 'techEyebrow', title: 'Eyebrow', type: 'string', group: 'tech'}),
    defineField({name: 'techHeadline', title: 'Headline', type: 'string', group: 'tech'}),
    defineField({name: 'techBody', title: 'Body', type: 'text', group: 'tech', rows: 4}),

    defineField({name: 'missionEyebrow', title: 'Eyebrow', type: 'string', group: 'mission'}),
    defineField({name: 'missionHeadline', title: 'Headline', type: 'string', group: 'mission'}),
    defineField({name: 'missionBody', title: 'Body', type: 'text', group: 'mission', rows: 4}),
    defineField({name: 'missionItems', title: 'Items', type: 'array', of: [missionItem], group: 'mission'}),
    defineField({name: 'missionCtaText', title: 'CTA text', type: 'string', group: 'mission'}),
    defineField({name: 'missionCtaLink', title: 'CTA link', type: 'string', group: 'mission'}),
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

    defineField({name: 'blogEyebrow', title: 'Eyebrow', type: 'string', group: 'blog'}),
    defineField({name: 'blogHeadline', title: 'Headline', type: 'string', group: 'blog'}),

    defineField({name: 'bookingEyebrow', title: 'Eyebrow', type: 'string', group: 'booking'}),
    defineField({name: 'bookingHeadline', title: 'Headline', type: 'string', group: 'booking'}),
    defineField({name: 'bookingBody', title: 'Body', type: 'text', group: 'booking', rows: 4}),
    defineField({name: 'bookingTrustItems', title: 'Trust items', type: 'array', of: [bookingTrustItem], group: 'booking'}),
    defineField({name: 'bookingPrice', title: 'Price line', type: 'string', group: 'booking'}),
    defineField({name: 'bookingPriceSubtext', title: 'Price subtext', type: 'string', group: 'booking'}),
    defineField({name: 'bookingCardRows', title: 'Card rows (label / value)', type: 'array', of: [labelValue], group: 'booking'}),
    defineField({name: 'bookingCta1Text', title: 'CTA 1 text', type: 'string', group: 'booking'}),
    defineField({name: 'bookingCta1Link', title: 'CTA 1 link', type: 'string', group: 'booking'}),
    defineField({name: 'bookingCta2Text', title: 'CTA 2 text', type: 'string', group: 'booking'}),
    defineField({name: 'bookingCta2Link', title: 'CTA 2 link', type: 'string', group: 'booking'}),
  ],
  preview: {
    prepare() {
      return {title: 'Home page'}
    },
  },
})
