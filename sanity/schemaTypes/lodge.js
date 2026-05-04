import {defineArrayMember, defineField, defineType} from 'sanity'
import {RoomStableIdSelectInput} from '../components/lodge/RoomStableIdSelectInput'

const imgHot = {hotspot: true}

const GALLERY_USAGE_SECTION = [
  {title: 'Hero', value: 'hero'},
  {title: 'Accommodation', value: 'accommodation'},
  {title: 'Common areas & amenities', value: 'commonAreas'},
]

/** IDs alineables con iconos del front (p. ej. LodgeFacilities). */
const AMENITY_ICON_OPTIONS = [
  {title: 'Meals', value: 'meals'},
  {title: 'Guide', value: 'guide'},
  {title: 'Transport', value: 'transport'},
  {title: 'Boots / gear', value: 'boots'},
  {title: 'Flask / station', value: 'flask'},
  {title: 'WiFi', value: 'wifi'},
  {title: 'Shield / showers', value: 'shield'},
  {title: 'Book / library', value: 'book'},
  {title: 'Droplet / water', value: 'droplet'},
]

/**
 * Lodge — fuente de verdad (contenido canónico).
 * La landing pública se cura en `lodgePage` (presentación).
 */
export const lodge = defineType({
  name: 'lodge',
  title: 'Lodge',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'hero', title: 'Hero & descriptions'},
    {name: 'snapshot', title: 'Snapshot'},
    {name: 'gallery', title: 'Global gallery'},
    {name: 'rooms', title: 'Accommodation'},
    {name: 'common', title: 'Common areas'},
    {name: 'amenities', title: 'Amenities'},
    {name: 'location', title: 'Location & access'},
    {name: 'science', title: 'Science / research'},
    {name: 'relations', title: 'Relationships'},
    {name: 'faq', title: 'FAQs'},
    {name: 'booking', title: 'Booking context'},
    {name: 'trust', title: 'Trust'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // --- Identity ---
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'route',
      title: 'Route (optional)',
      type: 'string',
      group: 'identity',
      description: 'Ruta comercial o segmento libre si no basta el slug.',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'identity',
      description: 'Ej. Camanti Route, Cusco',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'altitude',
      title: 'Altitude (m)',
      type: 'number',
      group: 'identity',
      description: 'Metros sobre el nivel del mar (número).',
      validation: (Rule) => Rule.min(0).max(9000),
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      group: 'identity',
      of: [
        {
          type: 'object',
          name: 'lodgeCertification',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'detail',
              title: 'Detail',
              type: 'string',
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {t: 'label', d: 'detail'},
            prepare: ({t, d}) => ({title: t, subtitle: d}),
          },
        },
      ],
      validation: (Rule) => Rule.max(20),
    }),

    // --- Hero / descriptions ---
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      group: 'hero',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long description',
      type: 'text',
      group: 'hero',
      rows: 8,
      validation: (Rule) => Rule.max(8000),
    }),
    defineField({
      name: 'keyElements',
      title: 'Key elements',
      type: 'array',
      group: 'hero',
      of: [{type: 'string', validation: (Rule) => Rule.max(200)}],
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'heroGalleryOpenAriaLabel',
      title: 'Hero gallery button (aria label)',
      type: 'string',
      group: 'hero',
      description: 'Accesibilidad del botón que abre la galería de fotos en el hero.',
      validation: (Rule) => Rule.max(160),
    }),

    // --- Snapshot ---
    defineField({
      name: 'snapshotItems',
      title: 'Snapshot items',
      type: 'array',
      group: 'snapshot',
      description:
        'Hechos clave. Cada ítem necesita `key` estable para que `lodgePage` pueda referenciarlo (hero highlights / snapshot bar).',
      of: [
        {
          type: 'object',
          name: 'lodgeSnapshotItem',
          fields: [
            defineField({
              name: 'key',
              title: 'Stable key',
              type: 'string',
              description: 'Slug único en este lodge, p. ej. max-guests',
              validation: (Rule) =>
                Rule.required().regex(/^[a-z0-9][a-z0-9-]*$/, {
                  name: 'slug-like',
                  invert: false,
                }),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
          ],
          preview: {
            select: {k: 'key', l: 'label', v: 'value'},
            prepare: ({k, l, v}) => ({title: `${l}: ${v}`, subtitle: k}),
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((rows) => {
          if (!rows?.length) return true
          const keys = rows.map((r) => r?.key).filter(Boolean)
          if (keys.length !== new Set(keys).size) return 'Cada `key` debe ser única.'
          return true
        }),
    }),

    // --- Global gallery (single source of truth for lodge images) ---
    defineField({
      name: 'gallery',
      title: 'Global gallery',
      type: 'array',
      group: 'gallery',
      description:
        'Upload each photo once here. Rooms and common areas pick from this list by **stable key** — do not duplicate uploads on room/common rows.',
      of: [
        {
          type: 'object',
          name: 'lodgeGalleryItem',
          fields: [
            defineField({
              name: 'stableKey',
              title: 'Stable key',
              type: 'string',
              description: 'Unique within this lodge (e.g. hero-0, room-private-cottage-1). Used by rooms / common areas to reference this row.',
              validation: (Rule) =>
                Rule.required().regex(/^[a-z0-9][a-z0-9-]*$/, {
                  name: 'slug-like',
                  invert: false,
                }),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: imgHot,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(500),
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Accessibility; falls back to title if empty.',
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'usageSection',
              title: 'Usage section',
              type: 'string',
              options: {list: GALLERY_USAGE_SECTION, layout: 'radio'},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'roomStableId',
              title: 'Room stable ID',
              type: 'string',
              components: {input: RoomStableIdSelectInput},
              hidden: ({parent}) => parent?.usageSection !== 'accommodation',
              description: 'Required only when Usage section is Accommodation.',
              validation: (Rule) =>
                Rule.custom((val, ctx) => {
                  const section = ctx.parent?.usageSection
                  const roomId = val?.trim()
                  if (section !== 'accommodation') return true
                  if (!roomId) return 'Room stable ID is required for Accommodation photos'
                  const stableIds = new Set((ctx.document?.rooms ?? []).map((r) => r?.stableId).filter(Boolean))
                  if (stableIds.size > 0 && !stableIds.has(roomId)) {
                    return `Room stable ID must match one of lodge.rooms[].stableId (${Array.from(stableIds).join(', ')})`
                  }
                  return /^[a-z0-9][a-z0-9-]*$/.test(roomId) ? true : 'Use slug-like format'
                }),
            }),
            defineField({
              name: 'category',
              title: 'Category (legacy)',
              type: 'string',
              hidden: true,
            }),
            defineField({
              name: 'relatedRoomStableId',
              title: 'Related room (legacy)',
              type: 'string',
              hidden: true,
            }),
            defineField({
              name: 'relatedCommonAreaKey',
              title: 'Related common area key (legacy)',
              type: 'string',
              hidden: true,
            }),
          ],
          preview: {
            select: {sk: 'stableKey', t: 'title', media: 'image', use: 'usageSection'},
            prepare: ({sk, t, media, use}) => ({title: sk ? `${sk} · ${t}` : t, subtitle: use, media}),
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(60).custom((rows) => {
          if (!rows?.length) return true
          const keys = rows.map((r) => r?.stableKey).filter(Boolean)
          if (keys.length !== new Set(keys).size) return 'Each gallery row needs a unique stable key'
          return true
        }),
    }),

    // --- Accommodation ---
    defineField({
      name: 'rooms',
      title: 'Rooms',
      type: 'array',
      group: 'rooms',
      of: [
        {
          type: 'object',
          name: 'lodgeRoom',
          fields: [
            defineField({
              name: 'stableId',
              title: 'Stable ID',
              type: 'string',
              description: 'Identificador estable para `lodgePage.featuredRoomStableId`.',
              validation: (Rule) =>
                Rule.required().regex(/^[a-z0-9][a-z0-9-]*$/, {
                  name: 'slug-like',
                  invert: false,
                }),
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'numberOfRooms',
              title: 'Number of rooms (units)',
              type: 'number',
              validation: (Rule) => Rule.required().integer().min(1).max(99),
            }),
            defineField({
              name: 'capacity',
              title: 'Capacity (guests per unit or total — define in description)',
              type: 'number',
              validation: (Rule) => Rule.min(1).max(50),
            }),
            defineField({
              name: 'highlights',
              title: 'Highlights',
              type: 'array',
              of: [{type: 'string', validation: (Rule) => Rule.max(120)}],
              validation: (Rule) => Rule.max(12),
            }),
            defineField({
              name: 'galleryItemKeys',
              title: 'Gallery photos (legacy picks)',
              type: 'array',
              hidden: true,
              description: 'Legacy fallback. New workflow uses Global gallery usageSection + roomStableId.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'lodgeRoomGalleryPick',
                  fields: [
                    defineField({
                      name: 'galleryStableKey',
                      title: 'Gallery stable key',
                      type: 'string',
                      validation: (Rule) =>
                        Rule.required().regex(/^[a-z0-9][a-z0-9-]*$/, {
                          name: 'slug-like',
                          invert: false,
                        }),
                    }),
                  ],
                  preview: {
                    select: {k: 'galleryStableKey'},
                    prepare: ({k}) => ({title: k || 'Pick'}),
                  },
                }),
              ],
              validation: (Rule) =>
                Rule.max(24).custom((picks, ctx) => {
                  const doc = ctx.document
                  const gKeys = new Set((doc?.gallery ?? []).map((g) => g?.stableKey).filter(Boolean))
                  if (!Array.isArray(picks) || picks.length === 0) return true
                  if (!gKeys.size) return 'Add **Global gallery** rows with stable keys before picking photos here'
                  for (const p of picks) {
                    const k = p?.galleryStableKey?.trim()
                    if (k && !gKeys.has(k)) return `Unknown gallery stable key: ${k}`
                  }
                  return true
                }),
            }),
            defineField({
              name: 'gallery',
              title: 'Gallery (legacy — uploads)',
              type: 'array',
              hidden: ({parent}) => Array.isArray(parent?.galleryItemKeys) && parent.galleryItemKeys.length > 0,
              description: 'Deprecated: add photos to **Global gallery** and pick them above. Hidden when picks are set.',
              of: [
                {
                  type: 'object',
                  name: 'lodgeRoomGalleryItem',
                  fields: [
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: imgHot,
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      validation: (Rule) => Rule.max(120),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2,
                      validation: (Rule) => Rule.max(400),
                    }),
                  ],
                  preview: {
                    select: {t: 'title', media: 'image'},
                    prepare: ({t, media}) => ({title: t || 'Image', media}),
                  },
                },
              ],
              validation: (Rule) => Rule.max(24),
            }),
          ],
          preview: {
            select: {n: 'name', sid: 'stableId'},
            prepare: ({n, sid}) => ({title: n, subtitle: sid}),
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((rows) => {
          if (!rows?.length) return true
          const ids = rows.map((r) => r?.stableId).filter(Boolean)
          if (ids.length !== new Set(ids).size) return 'Cada `stableId` de habitación debe ser único.'
          return true
        }),
    }),

    // --- Common areas ---
    defineField({
      name: 'commonAreas',
      title: 'Common areas',
      type: 'array',
      group: 'common',
      of: [
        {
          type: 'object',
          name: 'lodgeCommonArea',
          fields: [
            defineField({
              name: 'stableKey',
              title: 'Stable key',
              type: 'string',
              hidden: true,
              description: 'Id for this row (e.g. terrace). Links from gallery `relatedCommonAreaKey`.',
              validation: (Rule) =>
                Rule.custom((val, ctx) => {
                  const parent = ctx.parent
                  const usePick = Boolean(parent?.galleryStableKey?.trim())
                  if (!usePick && (val == null || String(val).trim() === '')) return true
                  if (usePick && (val == null || String(val).trim() === '')) return 'Required when using a gallery pick'
                  const t = String(val).trim()
                  return /^[a-z0-9][a-z0-9-]*$/.test(t) || 'Slug-like key'
                }),
            }),
            defineField({
              name: 'galleryStableKey',
              title: 'Photo (Global gallery stable key)',
              type: 'string',
              hidden: true,
              description: 'Pick an image from **Global gallery** by its stable key. Preferred over uploading here.',
              validation: (Rule) =>
                Rule.custom((val, ctx) => {
                  const doc = ctx.document
                  const gKeys = new Set((doc?.gallery ?? []).map((g) => g?.stableKey).filter(Boolean))
                  const k = val?.trim()
                  if (!k) return true
                  if (gKeys.size && !gKeys.has(k)) return `Unknown gallery stable key: ${k}`
                  return true
                }),
            }),
            defineField({
              name: 'image',
              title: 'Image (legacy upload)',
              type: 'image',
              options: imgHot,
              hidden: true,
              description: 'Deprecated if you use a Global gallery pick above.',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(500),
            }),
          ],
          preview: {
            select: {t: 'title', media: 'image', gsk: 'galleryStableKey', sk: 'stableKey'},
            prepare: ({t, media, gsk, sk}) => ({
              title: t,
              subtitle: gsk ? `pick: ${gsk}` : sk || '',
              media,
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(24).custom((rows) => {
          if (!rows?.length) return true
          return true
        }),
    }),
    defineField({
      name: 'facilitiesGalleryTileAriaPrefix',
      title: 'Facilities: gallery tile aria prefix',
      type: 'string',
      group: 'common',
      description: 'Prefijo aria de los tiles grandes (p. ej. “Open gallery:”).',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'facilitiesGalleryStripMoreAriaLabel',
      title: 'Facilities: “more photos” tile aria label',
      type: 'string',
      group: 'common',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'facilitiesStripMoreCount',
      title: 'Facilities: strip “more” count text',
      type: 'string',
      group: 'common',
      description: 'Texto del contador en el tercer tile del strip (p. ej. +12).',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'facilitiesStripMoreLabel',
      title: 'Facilities: strip “more” link label',
      type: 'string',
      group: 'common',
      validation: (Rule) => Rule.max(120),
    }),

    // --- Amenities ---
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      group: 'amenities',
      of: [
        {
          type: 'object',
          name: 'lodgeAmenity',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: AMENITY_ICON_OPTIONS, layout: 'dropdown'},
              description: 'Enum estable para mapear a SVG en front.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(400),
            }),
          ],
          preview: {
            select: {t: 'title', i: 'icon'},
            prepare: ({t, i}) => ({title: t, subtitle: i}),
          },
        },
      ],
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'facilitiesAmenitiesEyebrow',
      title: 'Amenities section eyebrow',
      type: 'string',
      group: 'amenities',
      description: 'Rótulo sobre la rejilla de amenidades (p. ej. “What’s included”).',
      validation: (Rule) => Rule.max(120),
    }),

    // --- Location & access ---
    defineField({
      name: 'mapImage',
      title: 'Map image',
      type: 'image',
      group: 'location',
      options: imgHot,
    }),
    defineField({
      name: 'locationMapLabels',
      title: 'Location map (diagram labels)',
      type: 'object',
      group: 'location',
      fields: [
        defineField({
          name: 'cuscoTitle',
          title: 'Cusco — title',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'cuscoSubtitle',
          title: 'Cusco — subtitle',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
        defineField({
          name: 'trailheadLabel',
          title: 'Trailhead label',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'walkHint',
          title: 'Walk hint',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'lodgeTitle',
          title: 'Lodge marker — title',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'lodgeSubtitle',
          title: 'Lodge marker — subtitle',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
      ],
    }),
    defineField({
      name: 'journeySteps',
      title: 'Journey steps',
      type: 'array',
      group: 'location',
      of: [
        {
          type: 'object',
          name: 'lodgeJourneyStep',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(600),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),

    // --- Science / research ---
    defineField({
      name: 'highlights',
      title: 'Science highlights',
      type: 'array',
      group: 'science',
      description: 'Máximo 3 tarjetas destacadas (research / science).',
      of: [
        {
          type: 'object',
          name: 'lodgeScienceHighlight',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              validation: (Rule) => Rule.max(200),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'researchAreas',
      title: 'Research areas',
      type: 'array',
      group: 'science',
      of: [
        {
          type: 'object',
          name: 'lodgeResearchArea',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.max(1200),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'specialMessage',
      title: 'Special message',
      type: 'text',
      group: 'science',
      rows: 4,
      validation: (Rule) => Rule.max(2000),
    }),

    // --- Relationships ---
    defineField({
      name: 'experiences',
      title: 'Related experiences',
      type: 'array',
      group: 'relations',
      of: [{type: 'reference', to: [{type: 'experience'}]}],
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      group: 'relations',
      of: [{type: 'reference', to: [{type: 'review'}]}],
      validation: (Rule) => Rule.max(48),
    }),
    defineField({
      name: 'experienceCardCtaLabel',
      title: 'Experience cards: CTA label',
      type: 'string',
      group: 'relations',
      description: 'Texto del enlace en cada tarjeta de experiencia (p. ej. “View”).',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'experienceCardPricePrefix',
      title: 'Experience cards: price prefix',
      type: 'string',
      group: 'relations',
      description: 'Si no hay `priceLabel` en el experience, se antepone al número (p. ej. “USD ”).',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'experienceCardPriceSuffix',
      title: 'Experience cards: price suffix',
      type: 'string',
      group: 'relations',
      description: 'Línea secundaria cuando hay precio numérico (p. ej. “per person”).',
      validation: (Rule) => Rule.max(40),
    }),

    // --- FAQs ---
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          name: 'lodgeFaq',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required().max(200),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required().max(4000),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(30),
    }),

    // --- Booking context ---
    defineField({
      name: 'startingPrice',
      title: 'Starting price',
      type: 'number',
      group: 'booking',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency code',
      type: 'string',
      group: 'booking',
      description: 'Ej. USD',
      initialValue: 'USD',
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'maxGroupSize',
      title: 'Max group size',
      type: 'number',
      group: 'booking',
      validation: (Rule) => Rule.min(1).max(500),
    }),
    defineField({
      name: 'availabilityNote',
      title: 'Availability note',
      type: 'string',
      group: 'booking',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'bookingMessage',
      title: 'Booking message',
      type: 'text',
      group: 'booking',
      rows: 4,
      validation: (Rule) => Rule.max(2000),
    }),
    defineField({
      name: 'bookingDetailRowLabels',
      title: 'Booking block: row labels (left column)',
      type: 'object',
      group: 'booking',
      description:
        'Etiquetas de las filas del resumen de reserva. Los valores (derecha) siguen viniendo de precio / grupo / disponibilidad.',
      fields: [
        defineField({
          name: 'shortestProgram',
          title: 'Shortest program',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'startingFrom',
          title: 'Starting from',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'groupSize',
          title: 'Group size',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'availability',
          title: 'Availability',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
      ],
    }),

    // --- Trust ---
    defineField({
      name: 'trustItems',
      title: 'Trust items',
      type: 'array',
      group: 'trust',
      of: [
        {
          type: 'object',
          name: 'lodgeTrustItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              validation: (Rule) => Rule.max(200),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title (legacy / override)',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description (legacy / override)',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image (legacy / override)',
      type: 'image',
      group: 'seo',
      options: imgHot,
      description: 'Preferir `seo.ogImage` si unificas en el objeto SEO.',
    }),

    // --- Hero image (canonical) ---
    defineField({
      name: 'mainImage',
      title: 'Main / hero image',
      type: 'image',
      group: 'hero',
      options: imgHot,
      description: 'Imagen principal del lodge (hero canónico).',
    }),
  ],
  preview: {
    select: {t: 'name', route: 'location'},
    prepare: ({t, route}) => ({
      title: t || 'Lodge',
      subtitle: route,
    }),
  },
})
