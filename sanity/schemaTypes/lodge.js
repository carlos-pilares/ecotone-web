import {defineArrayMember, defineField, defineType} from 'sanity'
import {GalleryAccommodationRoomInput} from '../components/lodge/GalleryAccommodationRoomInput'
import {LodgeRouteSlugSelectInput} from '../components/lodge/LodgeRouteSlugSelectInput'

const imgHot = {hotspot: true}

/** Slug-like stable id for accommodation rows (internal / featured room). */
const SLUG_LIKE = /^[a-z0-9][a-z0-9-]*$/

const PHOTO_CATEGORIES = [
  {title: 'Hero', value: 'hero'},
  {title: 'Accommodation', value: 'accommodation'},
  {title: 'Common areas & amenities', value: 'commonAreasAmenities'},
  {title: 'Other', value: 'other'},
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
  title: 'Lodge (knowledge center)',
  type: 'document',
  description: 'Structural lodge data: identity, photos, accommodation types, and amenities. Editorial copy lives on each Lodge page.',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'gallery', title: 'Photos library'},
    {name: 'rooms', title: 'Accommodation types'},
    {name: 'amenities', title: 'Amenities'},
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
      title: 'Route',
      type: 'string',
      group: 'identity',
      components: {input: LodgeRouteSlugSelectInput},
      description:
        'Must match a Route document slug (Knowledge Center → Route). Stored as the canonical slug string (e.g. camanti, manu-road, manu-core).',
      validation: (Rule) => Rule.max(96),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'identity',
      hidden: true,
      description: 'Ej. Camanti Route, Cusco',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'altitudeLegacy',
      title: 'Altitude (legacy)',
      type: 'string',
      group: 'identity',
      hidden: true,
      description:
        'Optional legacy altitude text (e.g. 1200, 1,200 m, or 1,200 m.a.s.l.). Older datasets may still have a legacy `altitude` value (number or string) on the document; the site merges `altitudeLegacy` with that raw field in GROQ. This field is optional and never blocks publishing.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long description',
      type: 'text',
      group: 'identity',
      hidden: true,
      rows: 8,
      validation: (Rule) => Rule.max(8000),
    }),
    defineField({
      name: 'keyElements',
      title: 'Key elements',
      type: 'array',
      group: 'identity',
      hidden: true,
      of: [{type: 'string', validation: (Rule) => Rule.max(200)}],
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'heroGalleryOpenAriaLabel',
      title: 'Hero gallery button (aria label)',
      type: 'string',
      group: 'identity',
      hidden: true,
      description: 'Accesibilidad del botón que abre la galería de fotos en el hero.',
      validation: (Rule) => Rule.max(160),
    }),

    // --- Snapshot ---
    defineField({
      name: 'snapshotItems',
      title: 'Snapshot items',
      type: 'array',
      group: 'identity',
      hidden: true,
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
      title: 'Photos library',
      type: 'array',
      group: 'gallery',
      description:
        'Upload each photo once. Label it, pick a category, and (for accommodation) link it to an accommodation type — no stable keys required.',
      of: [
        {
          type: 'object',
          name: 'lodgeGalleryItem',
          fields: [
            defineField({
              name: 'stableKey',
              title: 'Stable key (legacy)',
              type: 'string',
              hidden: true,
              description: 'Legacy reference key; kept for older content. Not shown to editors.',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: imgHot,
              validation: (Rule) =>
                Rule.custom((img) => {
                  const ref = img?.asset?._ref
                  if (ref) return true
                  return {
                    level: 'warning',
                    message: 'Upload an image when you can. Rows without an asset are skipped on the site.',
                  }
                }),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.max(120),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(500),
            }),
            defineField({
              name: 'altText',
              title: 'Alt text',
              type: 'string',
              description: 'Accessibility; falls back to title if empty.',
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'photoCategory',
              title: 'Category',
              type: 'string',
              initialValue: 'other',
              options: {list: PHOTO_CATEGORIES, layout: 'radio'},
              validation: (Rule) =>
                Rule.custom((v) => {
                  const t = (v ?? '').trim()
                  if (!t) {
                    return {
                      level: 'warning',
                      message: 'Pick a category (Hero, Accommodation, Common areas & amenities, or Other).',
                    }
                  }
                  return true
                }),
            }),
            defineField({
              name: 'accommodationRoomKey',
              title: 'Accommodation type',
              type: 'string',
              components: {input: GalleryAccommodationRoomInput},
              hidden: ({parent}) => parent?.photoCategory !== 'accommodation',
              description: 'Which accommodation type this photo belongs to (uses the row key, not a typed ID).',
            }),
            defineField({
              name: 'usageSection',
              title: 'Category (legacy)',
              type: 'string',
              hidden: true,
              description: 'Older category field; site resolver still reads it when photoCategory is empty.',
            }),
            defineField({
              name: 'roomStableId',
              title: 'Room stable ID (legacy)',
              type: 'string',
              hidden: true,
              description: 'Legacy accommodation link; resolver still uses it when accommodation type is not set above.',
            }),
            defineField({
              name: 'description',
              title: 'Caption (legacy)',
              type: 'text',
              rows: 3,
              hidden: true,
              validation: (Rule) => Rule.max(500),
            }),
            defineField({
              name: 'alt',
              title: 'Alt text (legacy)',
              type: 'string',
              hidden: true,
              validation: (Rule) => Rule.max(200),
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
            select: {t: 'title', media: 'image', cat: 'photoCategory'},
            prepare: ({t, media, cat}) => ({
              title: t || 'Photo',
              subtitle: cat || '',
              media,
            }),
          },
        },
      ],
      validation: (Rule) => Rule.max(60),
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
              description:
                'Short slug for this accommodation type (e.g. private-cottage). Used by gallery photos and lodge pages. Run `npm run migrate:repair-lodge-rooms` to auto-fill from names if needed.',
              validation: (Rule) =>
                Rule.custom((val, ctx) => {
                  const trimmed = (val ?? '').trim()
                  if (!trimmed) {
                    return {
                      level: 'warning',
                      message:
                        'Stable ID is recommended so photos and featured-room settings can target this row. Add a slug (e.g. double-room) or run `npm run migrate:repair-lodge-rooms -- --commit`.',
                    }
                  }
                  if (!SLUG_LIKE.test(trimmed)) {
                    return {
                      level: 'warning',
                      message:
                        'Use lowercase letters, numbers, and hyphens only (e.g. private-cottage). Publish is allowed; fix for reliable linking.',
                    }
                  }
                  const rooms = ctx.document?.rooms ?? []
                  const same = rooms.filter((r) => (r?.stableId ?? '').trim() === trimmed).length
                  if (same > 1) {
                    return 'Duplicate Stable ID: each accommodation type must use a different ID.'
                  }
                  return true
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
              description: 'Optional in Studio; the site may show a placeholder if unset.',
              validation: (Rule) =>
                Rule.custom((v) => {
                  if (v === undefined || v === null) return true
                  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 99) {
                    return {
                      level: 'warning',
                      message: 'If set, use a whole number from 1 to 99 (number of units).',
                    }
                  }
                  return true
                }),
            }),
            defineField({
              name: 'capacity',
              title: 'Capacity per unit',
              type: 'number',
              description: 'Optional; guests per unit when set.',
              validation: (Rule) =>
                Rule.custom((v) => {
                  if (v === undefined || v === null) return true
                  if (typeof v !== 'number' || Number.isNaN(v) || v < 1 || v > 50) {
                    return {
                      level: 'warning',
                      message: 'If set, use a number from 1 to 50 (capacity per unit).',
                    }
                  }
                  return true
                }),
            }),
            defineField({
              name: 'highlights',
              title: 'Highlights',
              type: 'array',
              of: [
                {
                  type: 'string',
                  validation: (Rule) =>
                    Rule.custom((line) => {
                      const s = line == null ? '' : String(line)
                      if (s.length <= 120) return true
                      return {
                        level: 'warning',
                        message: 'Shorten this line to 120 characters or less (or split into two highlights).',
                      }
                    }),
                },
              ],
              validation: (Rule) => Rule.max(5),
            }),
            defineField({
              name: 'mostPopular',
              title: 'Most popular',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'specialMessage',
              title: 'Special message (legacy)',
              type: 'text',
              rows: 2,
              hidden: true,
              validation: (Rule) => Rule.max(400),
            }),
            defineField({
              name: 'galleryItemKeys',
              title: 'Gallery photos (legacy picks)',
              type: 'array',
              hidden: true,
              description: 'Legacy fallback; hidden. Prefer Photos library + accommodation link on each photo.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'lodgeRoomGalleryPick',
                  fields: [
                    defineField({
                      name: 'galleryStableKey',
                      title: 'Gallery stable key',
                      type: 'string',
                      description: 'Legacy pick; not validated against the library (stale keys allowed).',
                    }),
                  ],
                  preview: {
                    select: {k: 'galleryStableKey'},
                    prepare: ({k}) => ({title: k || 'Pick'}),
                  },
                }),
              ],
              validation: (Rule) => Rule.max(24),
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
                      validation: (Rule) =>
                        Rule.custom((img) => {
                          const ref = img?.asset?._ref
                          if (ref) return true
                          return {
                            level: 'warning',
                            message: 'Upload an image for this legacy row when possible.',
                          }
                        }),
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
          const ids = rows.map((r) => (r?.stableId ?? '').trim()).filter(Boolean)
          if (ids.length !== new Set(ids).size) {
            return 'Each accommodation type needs a unique Stable ID when IDs are set (duplicate non-empty IDs).'
          }
          return true
        }),
    }),
    defineField({
      name: 'accommodationSpecialMessage',
      title: 'Accommodation section message',
      type: 'text',
      group: 'rooms',
      rows: 3,
      validation: (Rule) => Rule.max(400),
      description: 'Optional note for the whole accommodation section (not per room type).',
    }),

    // --- Common areas ---
    defineField({
      name: 'commonAreas',
      title: 'Common areas',
      type: 'array',
      group: 'identity',
      hidden: true,
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
                  if (usePick && (val == null || String(val).trim() === '')) {
                    return {
                      level: 'warning',
                      message: 'Stable key is recommended when using a gallery pick (legacy common area row).',
                    }
                  }
                  const t = String(val).trim()
                  if (!SLUG_LIKE.test(t)) {
                    return {
                      level: 'warning',
                      message: 'Use a slug-like stable key (lowercase, hyphens).',
                    }
                  }
                  return true
                }),
            }),
            defineField({
              name: 'galleryStableKey',
              title: 'Photo (Global gallery stable key)',
              type: 'string',
              hidden: true,
              description: 'Legacy pick by stable key; not validated (stale keys allowed).',
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
      group: 'identity',
      hidden: true,
      description: 'Prefijo aria de los tiles grandes (p. ej. “Open gallery:”).',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'facilitiesGalleryStripMoreAriaLabel',
      title: 'Facilities: “more photos” tile aria label',
      type: 'string',
      group: 'identity',
      hidden: true,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'facilitiesStripMoreCount',
      title: 'Facilities: strip “more” count text',
      type: 'string',
      group: 'identity',
      hidden: true,
      description: 'Texto del contador en el tercer tile del strip (p. ej. +12).',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'facilitiesStripMoreLabel',
      title: 'Facilities: strip “more” link label',
      type: 'string',
      group: 'identity',
      hidden: true,
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
      title: 'Amenities section eyebrow (legacy)',
      type: 'string',
      group: 'amenities',
      hidden: true,
      description: 'Rótulo sobre la rejilla de amenidades (p. ej. “What’s included”).',
      validation: (Rule) => Rule.max(120),
    }),

    // --- Location & access ---
    defineField({
      name: 'mapImage',
      title: 'Map image',
      type: 'image',
      group: 'identity',
      hidden: true,
      options: imgHot,
    }),
    defineField({
      name: 'locationMapLabels',
      title: 'Location map (diagram labels)',
      type: 'object',
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
      rows: 4,
      validation: (Rule) => Rule.max(2000),
    }),

    // --- Relationships ---
    defineField({
      name: 'experiences',
      title: 'Related experiences',
      type: 'array',
      group: 'identity',
      hidden: true,
      of: [{type: 'reference', to: [{type: 'experience'}]}],
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      group: 'identity',
      hidden: true,
      of: [{type: 'reference', to: [{type: 'review'}]}],
      validation: (Rule) => Rule.max(48),
    }),
    defineField({
      name: 'experienceCardCtaLabel',
      title: 'Experience cards: CTA label',
      type: 'string',
      group: 'identity',
      hidden: true,
      description: 'Texto del enlace en cada tarjeta de experiencia (p. ej. “View”).',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'experienceCardPricePrefix',
      title: 'Experience cards: price prefix',
      type: 'string',
      group: 'identity',
      hidden: true,
      description: 'Si no hay `priceLabel` en el experience, se antepone al número (p. ej. “USD ”).',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'experienceCardPriceSuffix',
      title: 'Experience cards: price suffix',
      type: 'string',
      group: 'identity',
      hidden: true,
      description: 'Línea secundaria cuando hay precio numérico (p. ej. “per person”).',
      validation: (Rule) => Rule.max(40),
    }),

    // --- FAQs ---
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency code',
      type: 'string',
      group: 'identity',
      hidden: true,
      description: 'Ej. USD',
      initialValue: 'USD',
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'maxGroupSize',
      title: 'Max group size',
      type: 'number',
      group: 'identity',
      hidden: true,
      validation: (Rule) => Rule.min(1).max(500),
    }),
    defineField({
      name: 'availabilityNote',
      title: 'Availability note',
      type: 'string',
      group: 'identity',
      hidden: true,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'bookingMessage',
      title: 'Booking message',
      type: 'text',
      group: 'identity',
      hidden: true,
      rows: 4,
      validation: (Rule) => Rule.max(2000),
    }),
    defineField({
      name: 'bookingDetailRowLabels',
      title: 'Booking block: row labels (left column)',
      type: 'object',
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
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
      group: 'identity',
      hidden: true,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title (legacy / override)',
      type: 'string',
      group: 'identity',
      hidden: true,
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description (legacy / override)',
      type: 'text',
      group: 'identity',
      hidden: true,
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image (legacy / override)',
      type: 'image',
      group: 'identity',
      hidden: true,
      options: imgHot,
      description: 'Preferir `seo.ogImage` si unificas en el objeto SEO.',
    }),

    // --- Hero image (canonical) ---
    defineField({
      name: 'mainImage',
      title: 'Main / hero image',
      type: 'image',
      group: 'identity',
      hidden: true,
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
