import {defineField, defineType} from 'sanity'
import {LodgePresentationHeroPreview} from '../../components/experiencePage/LodgePresentationHeroPreview'

const imgHot = {hotspot: true}

/** Gallery / media row on Experience KC (photo or video). */
export const experienceGalleryItem = defineType({
  name: 'experienceGalleryItem',
  title: 'Media item',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Type',
      type: 'string',
      initialValue: 'photo',
      options: {
        list: [
          {title: 'Photo', value: 'photo'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      description: 'Short label for editors and on-page pills.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Longer caption for lightbox / detail views — not shown on thumbnail tiles.',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.max(160),
      description: 'Describe the visual for screen readers.',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: imgHot,
      hidden: ({parent}) => parent?.mediaType === 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent
          if (parent?.mediaType === 'video') return true
          if (!value) return 'Photo image is required'
          return true
        }),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      description: 'YouTube or Vimeo URL.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.mediaType !== 'video') return true
          if (!value || !String(value).trim()) return 'Video URL is required for video items'
          return true
        }),
    }),
    defineField({
      name: 'videoThumbnail',
      title: 'Video thumbnail',
      type: 'image',
      options: imgHot,
      hidden: ({parent}) => parent?.mediaType !== 'video',
      description: 'Poster frame shown with the play button.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.mediaType !== 'video') return true
          if (!value) return 'Video thumbnail is required'
          return true
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category (legacy)',
      type: 'string',
      hidden: true,
      description: 'Deprecated — kept only so older documents retain data.',
    }),
  ],
  preview: {
    select: {title: 'title', caption: 'caption', mediaType: 'mediaType', media: 'image', thumb: 'videoThumbnail'},
    prepare: ({title, caption, mediaType, media, thumb}) => ({
      title: title || caption || (mediaType === 'video' ? 'Video' : 'Photo'),
      subtitle: mediaType === 'video' ? 'Video' : 'Photo',
      media: mediaType === 'video' ? thumb : media,
    }),
  },
})

/** Phase in a programme-flow itinerary (Experiential Learning). */
export const experienceProgrammePhase = defineType({
  name: 'experienceProgrammePhase',
  title: 'Programme phase',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (Rule) => [Rule.required(), Rule.max(600)],
    }),
    defineField({
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: imgHot,
    }),
    defineField({
      name: 'durationLabel',
      title: 'Duration label (optional)',
      type: 'string',
      description: 'e.g. “Days 3–12” or “2 weeks”.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'accommodation',
      title: 'Accommodation (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle', media: 'image'},
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Phase',
      subtitle: subtitle || undefined,
      media,
    }),
  },
})

/** Row in a typical-day itinerary block. */
export const experienceTypicalDayRow = defineType({
  name: 'experienceTypicalDayRow',
  title: 'Typical day row',
  type: 'object',
  fields: [
    defineField({
      name: 'timeLabel',
      title: 'Time label (optional)',
      type: 'string',
      description: 'e.g. “Morning”, “Afternoon”, “Evening”.',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (Rule) => [Rule.required(), Rule.max(400)],
    }),
  ],
  preview: {
    select: {timeLabel: 'timeLabel', title: 'title'},
    prepare: ({timeLabel, title}) => ({
      title: [timeLabel, title].filter(Boolean).join(' — ') || 'Row',
    }),
  },
})

/** Duration option for multi-length experiential programmes. */
export const experienceDurationOption = defineType({
  name: 'experienceDurationOption',
  title: 'Duration option',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. “2 weeks”, “4 weeks”.',
      validation: (Rule) => [Rule.required(), Rule.max(40)],
    }),
    defineField({
      name: 'durationDetail',
      title: 'Duration detail',
      type: 'string',
      description: 'e.g. “16 days / 15 nights”.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'shortBreakdown',
      title: 'Short breakdown (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'price',
      title: 'Price (optional)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'startDates',
      title: 'Start dates (optional)',
      type: 'text',
      rows: 2,
      description: 'One line per date or intake window.',
      validation: (Rule) => Rule.max(300),
    }),
  ],
  preview: {
    select: {label: 'label', enabled: 'enabled', detail: 'durationDetail'},
    prepare: ({label, enabled, detail}) => ({
      title: label || 'Duration',
      subtitle: [enabled === false ? 'Disabled' : null, detail].filter(Boolean).join(' · ') || undefined,
    }),
  },
})

export const experienceItineraryProgrammeFlow = defineType({
  name: 'experienceItineraryProgrammeFlow',
  title: 'Programme flow',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Section eyebrow (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'title',
      title: 'Section title (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'intro',
      title: 'Intro text (optional)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'phases',
      title: 'Programme phases',
      type: 'array',
      of: [{type: 'experienceProgrammePhase'}],
      validation: (Rule) => Rule.max(12),
    }),
  ],
})

export const experienceItineraryTypicalDay = defineType({
  name: 'experienceItineraryTypicalDay',
  title: 'Typical day in the field',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Section eyebrow (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'title',
      title: 'Section title (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'intro',
      title: 'Intro text (optional)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'rows',
      title: 'Typical day rows',
      type: 'array',
      of: [{type: 'experienceTypicalDayRow'}],
      validation: (Rule) => Rule.max(8),
    }),
  ],
})

/** Lodging line on an itinerary day */
export const experienceItineraryOvernight = defineType({
  name: 'experienceItineraryOvernight',
  title: 'Overnight lodging',
  type: 'object',
  fields: [
    defineField({
      name: 'mode',
      title: 'Night display',
      type: 'string',
      initialValue: 'lodge',
      options: {
        list: [
          {title: 'Stay at lodge (select below)', value: 'lodge'},
          {title: 'Last travel day / no lodge after this day', value: 'none'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lodge',
      title: 'Lodge',
      type: 'reference',
      to: [{type: 'lodge'}],
      hidden: ({parent}) => parent?.mode !== 'lodge',
      description: 'Where guests stay after this day’s activities.',
    }),
  ],
})

export {experienceSnapshotHighlight} from './experienceSnapshotHighlight'

const WILDLIFE_ICONS = [
  {title: 'Bird', value: 'bird'},
  {title: 'Bear / large mammal', value: 'bear'},
  {title: 'Cat / puma', value: 'cat'},
  {title: 'Jaguar / leopard', value: 'jaguar'},
  {title: 'Monkey / primate', value: 'monkey'},
  {title: 'Otter / semi-aquatic', value: 'otter'},
  {title: 'Reptile / amphibian', value: 'reptile'},
  {title: 'Fish / aquatic', value: 'fish'},
  {title: 'Plant / flora', value: 'plant'},
  {title: 'Insect / butterfly', value: 'insect'},
  {title: 'Generic icon', value: 'generic'},
]

/** Species card on Experience KC and Learning Programme KC wildlife tabs. */
export const experienceWildlifeItem = defineType({
  name: 'experienceWildlifeItem',
  title: 'Wildlife species',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Common name',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(40)],
    }),
    defineField({
      name: 'description',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.max(50),
      description: 'Short line under the name (e.g. cloud-forest endemic).',
    }),
    defineField({
      name: 'iconType',
      title: 'Icon (legacy)',
      type: 'string',
      hidden: true,
      options: {list: WILDLIFE_ICONS, layout: 'dropdown'},
      description: 'Deprecated — wildlife cards use photos. Data preserved for legacy documents.',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: imgHot,
      description: 'Species photo for the card. Recommended: horizontal ~16:10 or 4:3, min. ~900px wide.',
    }),
    defineField({
      name: 'badge',
      title: 'Badge (optional)',
      type: 'string',
      description: 'e.g. Rare, Research — shown above the name.',
      validation: (Rule) => Rule.max(28),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'description', media: 'image'},
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Species',
      subtitle: subtitle || undefined,
      media,
    }),
  },
})

/** Per-lodge editorial modifiers on an experience (lodges tab). */
export const experienceLodgePresentationRow = defineType({
  name: 'experienceLodgePresentationRow',
  title: 'Lodge on this programme',
  type: 'object',
  fields: [
    defineField({
      name: 'lodge',
      title: 'Lodge',
      type: 'reference',
      to: [{type: 'lodge'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nightsLabel',
      title: 'Nights label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'e.g. Nights 1 & 2 · displayed on programme cards.',
    }),
    defineField({
      name: 'highlightLabel',
      title: 'Highlight label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Amber pill on the card (e.g. “Research station”). Not the hero pills below — those come from the Lodge Page.',
    }),
    defineField({
      name: 'highlights',
      title: 'Extra highlights (legacy)',
      type: 'array',
      of: [{type: 'string', validation: (Rule) => Rule.max(120)}],
      validation: (Rule) => Rule.max(12),
      hidden: true,
      description: 'Deprecated — card chips come from Lodge Page → Hero highlight pills.',
    }),
    defineField({
      name: 'lodgePageHeroPreview',
      title: 'Lodge Page hero copy (read only)',
      type: 'string',
      readOnly: true,
      components: {input: LodgePresentationHeroPreview},
      description:
        'Short description, chips, and card image on the public Experience page are edited on the linked **Lodge Page** (Hero → photos / menu thumbnail).',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Button text. Link is always the published Lodge Page URL.',
    }),
    defineField({
      name: 'ctaVisible',
      title: 'Show CTA on card',
      type: 'boolean',
      initialValue: true,
      description: 'When off, hides the lodge card button for this row.',
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA link (legacy)',
      type: 'smartLink',
      hidden: true,
      description: 'Deprecated — link is always `/lodges/{slug}` from the Lodge Page.',
    }),
  ],
  preview: {
    select: {name: 'lodge.name'},
    prepare: ({name}) => ({title: name || 'Lodge'}),
  },
})

/** Legend + editable copy for the three month season levels (peak / great / always). */
export const experienceSeasonLegend = defineType({
  name: 'experienceSeasonLegend',
  title: 'Season legend',
  type: 'object',
  fields: [
    defineField({
      name: 'seasonKeyTitle',
      title: 'Season key title',
      type: 'string',
      initialValue: 'Season key',
      validation: (Rule) => Rule.max(80),
      description: 'Eyebrow above the legend (e.g. “Season key”).',
    }),
    defineField({
      name: 'intro',
      title: 'Legend intro (paragraph)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
      description: 'Explains how to read the month bars.',
    }),
    defineField({
      name: 'peakLabel',
      title: 'Peak — label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Shown in the legend for the peak tier (matches ★★ on month cards).',
    }),
    defineField({
      name: 'peakDescription',
      title: 'Peak — description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'greatLabel',
      title: 'Great — label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Legend label for the great tier (matches ★ on month cards).',
    }),
    defineField({
      name: 'greatDescription',
      title: 'Great — description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'alwaysLabel',
      title: 'Always worthwhile — label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Legend label for neutral / year-round tier.',
    }),
    defineField({
      name: 'alwaysDescription',
      title: 'Always worthwhile — description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Season key title (legacy)',
      type: 'string',
      hidden: true,
      description: 'Superseded by **Season key title**; kept for migration.',
    }),
    defineField({
      name: 'peak',
      title: 'Peak tier (legacy)',
      type: 'object',
      hidden: true,
      fields: [
        defineField({name: 'label', type: 'string'}),
        defineField({name: 'description', type: 'text', rows: 2}),
        defineField({name: 'visualKey', type: 'string', hidden: true}),
      ],
    }),
    defineField({
      name: 'good',
      title: 'Great tier (legacy)',
      type: 'object',
      hidden: true,
      fields: [
        defineField({name: 'label', type: 'string'}),
        defineField({name: 'description', type: 'text', rows: 2}),
        defineField({name: 'visualKey', type: 'string', hidden: true}),
      ],
    }),
    defineField({
      name: 'alwaysGood',
      title: 'Always tier (legacy)',
      type: 'object',
      hidden: true,
      fields: [
        defineField({name: 'label', type: 'string'}),
        defineField({name: 'description', type: 'text', rows: 2}),
        defineField({name: 'visualKey', type: 'string', hidden: true}),
      ],
    }),
  ],
})

const TRAVEL_GUIDE_ROW_ICONS = [
  {title: 'Document', value: 'doc'},
  {title: 'Shield', value: 'shield'},
  {title: 'Check', value: 'check'},
  {title: 'Heart', value: 'heart'},
  {title: 'Package', value: 'package'},
  {title: 'Clock', value: 'clock'},
  {title: 'User', value: 'user'},
]

/** Q&A row (title + body) for traveller guide flex cards. */
export const experienceTravelerGuideRow = defineType({
  name: 'experienceTravelerGuideRow',
  title: 'Q&A row',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Row icon (optional)',
      type: 'string',
      options: {list: TRAVEL_GUIDE_ROW_ICONS, layout: 'dropdown'},
    }),
    defineField({
      name: 'title',
      title: 'Title / question',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(120)],
    }),
    defineField({
      name: 'body',
      title: 'Body / answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => [Rule.required(), Rule.max(800)],
    }),
  ],
})

/** Checklist row (label only) — packing-style lines. */
export const experienceTravelerGuideChecklistRow = defineType({
  name: 'experienceTravelerGuideChecklistRow',
  title: 'Checklist row',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Row icon (optional)',
      type: 'string',
      options: {list: TRAVEL_GUIDE_ROW_ICONS, layout: 'dropdown'},
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(120)],
    }),
  ],
})

/**
 * Flexible traveller guide: any number of accordion cards; each card has icon + title + Q&A rows.
 * (Replaces editor flow of bucket-based `experienceTravelerGuideSection`; legacy objects kept for old docs.)
 */
export const experienceTravelerGuideSubsection = defineType({
  name: 'experienceTravelerGuideSubsection',
  title: 'Traveller guide card',
  type: 'object',
  fields: [
    defineField({
      name: 'displayType',
      title: 'Row layout',
      type: 'string',
      initialValue: 'qa',
      options: {
        list: [
          {title: 'Q&A — title + body per row', value: 'qa'},
          {title: 'Checklist — label only per row (packing list)', value: 'checklist'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'headerIcon',
      title: 'Card header icon',
      type: 'string',
      initialValue: 'entry',
      options: {
        list: [
          {title: 'Entry / documents', value: 'entry'},
          {title: 'Luggage', value: 'luggage'},
          {title: 'Phone / logistics', value: 'phone'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'title',
      title: 'Card title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(120)],
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(40),
      description:
        'Choose **Q&A** for paragraphs; **Checklist** for simple packing-style lines (no body). Add only rows that match the layout.',
      of: [{type: 'experienceTravelerGuideRow'}, {type: 'experienceTravelerGuideChecklistRow'}],
    }),
  ],
  preview: {
    select: {title: 'title', rows: 'rows'},
    prepare: ({title, rows}) => ({
      title: title || 'Traveller guide card',
      subtitle: rows?.length != null ? `${rows.length} row${rows.length === 1 ? '' : 's'}` : undefined,
    }),
  },
})

/** @deprecated Hidden field — bucket merge into 3 fixed cards; prefer `experienceTravelerGuideSubsection`. */
export const experienceTravelerGuideSection = defineType({
  name: 'experienceTravelerGuideSection',
  title: 'Traveller guide subsection (legacy)',
  type: 'object',
  fields: [
    defineField({
      name: 'bucket',
      title: 'Maps to section',
      type: 'string',
      options: {
        list: [
          {title: 'Entry / visas / insurance', value: 'entry'},
          {title: 'Packing list', value: 'packing'},
          {title: 'Getting there / logistics', value: 'logistics'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Multiple rows can share one bucket — they merge into the same accordion on the site.',
    }),
    defineField({
      name: 'headerIcon',
      title: 'Header icon',
      type: 'string',
      initialValue: 'entry',
      options: {
        list: [
          {title: 'Entry / documents', value: 'entry'},
          {title: 'Luggage', value: 'luggage'},
          {title: 'Phone / logistics', value: 'phone'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'title',
      title: 'Accordion title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(120)],
    }),
    defineField({
      name: 'packingLead',
      title: 'Packing intro (only for packing bucket)',
      type: 'text',
      rows: 3,
      hidden: ({parent}) => parent?.bucket !== 'packing',
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'pairItems',
      title: 'Q&A rows (title + body)',
      type: 'array',
      hidden: ({parent}) => parent?.bucket === 'packing',
      of: [
        {
          type: 'object',
          name: 'travelerPairItem',
          fields: [
            defineField({
              name: 'iconKey',
              title: 'Row icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Document', value: 'doc'},
                  {title: 'Shield', value: 'shield'},
                  {title: 'Check', value: 'check'},
                  {title: 'Heart', value: 'heart'},
                  {title: 'Package', value: 'package'},
                  {title: 'Clock', value: 'clock'},
                  {title: 'User', value: 'user'},
                ],
                layout: 'dropdown',
              },
              description: 'Maps to existing icon slots on the live page (cycles if there are many rows).',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => [Rule.required(), Rule.max(80)],
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              validation: (Rule) => [Rule.required(), Rule.max(600)],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'bulletItems',
      title: 'Bullet lines (packing bucket)',
      type: 'array',
      hidden: ({parent}) => parent?.bucket !== 'packing',
      of: [{type: 'string', validation: (Rule) => Rule.max(100)}],
      validation: (Rule) => Rule.max(40),
    }),
  ],
  preview: {
    select: {bucket: 'bucket', title: 'title'},
    prepare: ({bucket, title}) => ({
      title: title || 'Subsection',
      subtitle: bucket,
    }),
  },
})

export const experienceTermsPanel = defineType({
  name: 'experienceTermsPanel',
  title: 'Terms panel',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(120)],
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 6,
      validation: (Rule) => [Rule.required(), Rule.max(4000)],
    }),
  ],
})

const isTermsConditions = ({parent}) => parent?.resourceType === 'termsConditions'

export const experienceKnowledgeResource = defineType({
  name: 'experienceKnowledgeResource',
  title: 'Resource',
  type: 'object',
  fields: [
    defineField({
      name: 'resourceType',
      title: 'Resource type',
      type: 'string',
      options: {
        list: [
          {title: 'Map', value: 'map'},
          {title: 'Brochure', value: 'brochure'},
          {title: 'Terms & Conditions', value: 'termsConditions'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'radio',
      },
      initialValue: 'custom',
      validation: (Rule) => Rule.required(),
      description:
        '“Terms & Conditions” opens the applicable PDF from Content Library → Terms & Conditions (no manual PDF here). You can still set a preview image below for the card thumbnail.',
    }),
    defineField({
      name: 'image',
      title: 'Preview image',
      type: 'imageWithAlt',
      description:
        'Optional thumbnail for the resource card. Independent of the PDF source — required for Terms & Conditions when you want a custom preview instead of the default document art.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(120)],
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.resourceType === 'termsConditions') return true
          if (value && String(value).length > 400) {
            return 'Maximum 400 characters for non–Terms & Conditions resources.'
          }
          return true
        }),
    }),
    defineField({
      name: 'showCta',
      title: 'Show CTA',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      hidden: ({parent}) => parent?.showCta === false,
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA link',
      type: 'smartLink',
      hidden: ({parent}) => parent?.showCta === false || parent?.resourceType === 'termsConditions',
    }),
  ],
  preview: {
    select: {title: 'title', resourceType: 'resourceType', media: 'image.image'},
    prepare: ({title, resourceType, media}) => ({
      title: title || 'Resource',
      subtitle:
        resourceType === 'termsConditions'
          ? 'Terms & Conditions (central PDF)'
          : resourceType || 'custom',
      media,
    }),
  },
})
