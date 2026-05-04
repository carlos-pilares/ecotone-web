import {defineField, defineType} from 'sanity'
import {StudioLodgePageTabField} from '../components/lodgePageStudio/StudioLodgePageTabField'

const imgHot = {hotspot: true}

const lodgePreviewField = (name, title, group, section, description) =>
  defineField({
    name,
    title,
    type: 'string',
    readOnly: true,
    group,
    description,
    components: {input: StudioLodgePageTabField},
    options: {section},
  })

/**
 * Lodge page — presentación / curación (una URL).
 * Contenido canónico vive en `lodge`; aquí solo referencia, orden, selección y copy opcional.
 * UX alineada a Experience page: por pestaña → Fuente, Vista previa, Edición de esta landing, Selección.
 */
export const lodgePage = defineType({
  name: 'lodgePage',
  title: 'Lodge page (landing)',
  type: 'document',
  description:
    'Cada pestaña muestra primero la **fuente** (Lodge vinculado), luego la **vista previa** y, si aplica, la **edición solo de esta landing**. Abajo: **selección y orden**.',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'highlights', title: 'Highlights / Snapshot bar'},
    {name: 'navigation', title: 'Navigation bar'},
    {name: 'overview', title: 'Overview'},
    {name: 'accommodations', title: 'Accommodations'},
    {name: 'commonAreas', title: 'Common areas'},
    {name: 'gettingHere', title: 'Getting here'},
    {name: 'science', title: 'Science'},
    {name: 'experiences', title: 'Experiences'},
    {name: 'reviews', title: 'Reviews'},
    {name: 'faq', title: 'FAQs'},
    {name: 'booking', title: 'Ready to stay here'},
  ],
  fields: [
    // --- General ---
    defineField({
      name: 'internalTitle',
      title: 'Nombre interno (solo Studio)',
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
      name: 'lodge',
      title: 'Lodge (fuente principal)',
      type: 'reference',
      to: [{type: 'lodge'}],
      group: 'general',
      validation: (Rule) => Rule.required(),
      description: 'Contenido largo e imágenes se editan en *Content library → Lodges*.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO (esta URL)',
      type: 'seo',
      group: 'general',
      description: 'Título y descripción meta de esta landing.',
    }),
    lodgePreviewField(
      'lpStudioGeneral',
      'Panel editorial (fuente y vista previa)',
      'general',
      'general',
      'Resumen del Lodge vinculado y cómo se combina con esta página.',
    ),

    // --- Hero ---
    lodgePreviewField(
      'lpStudioHero',
      'Panel editorial (fuente y vista previa)',
      'hero',
      'hero',
      'Imagen, highlights y CTA del hero: edítalos en los campos de abajo.',
    ),
    defineField({
      name: 'heroImage',
      title: '4. Selección: imagen del hero (esta landing)',
      type: 'image',
      group: 'hero',
      options: imgHot,
      description: 'Vacío = imagen principal del Lodge.',
    }),
    defineField({
      name: 'heroHighlights',
      title: '4. Selección: hasta 3 highlights (claves del snapshot)',
      type: 'array',
      group: 'hero',
      of: [{type: 'lodgeSnapshotKeyPick'}],
      validation: (Rule) => Rule.max(3),
      description: 'Deben existir en el Lodge → snapshot.',
    }),
    defineField({
      name: 'heroCTA',
      title: '4. Selección: CTA del hero',
      type: 'linkWithLabel',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaSmartLink',
      title: 'Hero CTA (smart link)',
      type: 'smartLink',
      group: 'hero',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),

    // --- Snapshot bar ---
    lodgePreviewField(
      'lpStudioHighlights',
      'Panel editorial (fuente y vista previa)',
      'highlights',
      'highlights',
      'Valores vienen del Lodge; aquí solo eliges qué filas y en qué orden.',
    ),
    defineField({
      name: 'snapshotSelection',
      title: '4. Selección y orden (hasta 6)',
      type: 'array',
      group: 'highlights',
      of: [{type: 'lodgeSnapshotKeyPick'}],
      validation: (Rule) => Rule.max(6),
      description: 'Orden de la lista = orden en la barra.',
    }),

    // --- Navigation ---
    lodgePreviewField(
      'lpStudioNavigation',
      'Panel editorial (fuente y vista previa)',
      'navigation',
      'navigation',
      'Esta barra es solo de esta landing; edita los campos siguientes.',
    ),
    defineField({
      name: 'navTitle',
      title: 'Título del menú',
      type: 'string',
      group: 'navigation',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'navSubtitle',
      title: 'Subtítulo',
      type: 'string',
      group: 'navigation',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'navCTA',
      title: 'CTA',
      type: 'linkWithLabel',
      group: 'navigation',
    }),
    defineField({
      name: 'navCtaSmartLink',
      title: 'Navigation CTA (smart link)',
      type: 'smartLink',
      group: 'navigation',
      description: 'smartLink overrides legacy fields. Optional until editors migrate.',
    }),

    // --- Overview ---
    lodgePreviewField(
      'lpStudioOverview',
      'Panel editorial (fuente, vista previa y edición)',
      'overview',
      'overview',
      'Texto largo y bullets en el Lodge; rótulos opcionales de esta landing en el panel inferior.',
    ),

    // --- Accommodations ---
    lodgePreviewField(
      'lpStudioAccommodations',
      'Panel editorial (fuente, vista previa y edición)',
      'accommodations',
      'accommodations',
      'Habitaciones en el Lodge; destaca una con el campo de abajo.',
    ),
    defineField({
      name: 'featuredRoomStableId',
      title: '4. Selección: habitación destacada',
      type: 'string',
      group: 'accommodations',
      description: 'Debe coincidir con `stableId` en Lodge → rooms.',
      validation: (Rule) =>
        Rule.custom((val) => {
          if (val == null || String(val).trim() === '') return true
          return /^[a-z0-9][a-z0-9-]*$/.test(String(val)) || 'Usa un id estable (ver Lodge → rooms).'
        }),
    }),

    // --- Common areas ---
    lodgePreviewField(
      'lpStudioCommonAreas',
      'Panel editorial (fuente, vista previa y edición)',
      'commonAreas',
      'commonAreas',
      'Zonas comunes y comodidades en el Lodge; rótulos de sección editables abajo.',
    ),

    // --- Getting here ---
    lodgePreviewField(
      'lpStudioGettingHere',
      'Panel editorial (fuente, vista previa y edición)',
      'gettingHere',
      'gettingHere',
      'Pasos y mensaje de acceso en el Lodge.',
    ),

    // --- Science ---
    lodgePreviewField(
      'lpStudioScience',
      'Panel editorial (fuente, vista previa y edición)',
      'science',
      'science',
      'Bloque de investigación en el Lodge.',
    ),

    // --- Experiences ---
    lodgePreviewField(
      'lpStudioExperiences',
      'Panel editorial (fuente, vista previa y edición)',
      'experiences',
      'experiences',
      'Programas del Lodge y curación de esta landing abajo.',
    ),
    defineField({
      name: 'experiencesSelection',
      title: '4. Selección y orden (experiencias)',
      type: 'array',
      group: 'experiences',
      of: [{type: 'reference', to: [{type: 'experience'}]}],
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'fallbackToLodgeRelations',
      title: 'Si la lista está vacía, usar las del Lodge',
      type: 'boolean',
      group: 'experiences',
      initialValue: true,
    }),

    // --- Reviews ---
    lodgePreviewField(
      'lpStudioReviews',
      'Panel editorial (fuente, vista previa y edición)',
      'reviews',
      'reviews',
      'Reseñas referenciadas en el Lodge; elige orden en esta landing abajo.',
    ),
    defineField({
      name: 'reviewsSelection',
      title: '4. Selección y orden (reseñas)',
      type: 'array',
      group: 'reviews',
      of: [{type: 'reference', to: [{type: 'review'}]}],
      validation: (Rule) => Rule.max(48),
    }),
    defineField({
      name: 'reviewsPresentation',
      title: '5. Presentación del bloque reseñas',
      type: 'object',
      group: 'reviews',
      description:
        'Copy visible del carrusel (Trustpilot, rating, líneas, enlace “ver todas”). La cabecera eyebrow/título/cuerpo sigue en `sections.reviews` si la usas desde Studio.',
      fields: [
        defineField({
          name: 'sourceLabel',
          title: 'Source label (e.g. Trustpilot)',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'averageRating',
          title: 'Average rating (display)',
          type: 'string',
          description: 'Texto mostrado junto a las estrellas (p. ej. 5.0).',
          validation: (Rule) => Rule.max(20),
        }),
        defineField({
          name: 'secondaryRatingLine',
          title: 'Secondary line under stars',
          type: 'string',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'carouselEndLabel',
          title: '“View all reviews” link label',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
        defineField({
          name: 'carouselEndHref',
          title: '“View all reviews” link URL',
          type: 'string',
          validation: (Rule) => Rule.max(500),
        }),
        defineField({
          name: 'emptyMessage',
          title: 'Empty state message',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(400),
        }),
      ],
    }),

    // --- FAQs ---
    lodgePreviewField(
      'lpStudioFaq',
      'Panel editorial (fuente, vista previa y edición)',
      'faq',
      'faq',
      'Preguntas en el Lodge; rótulos del bloque editables abajo.',
    ),

    // --- Booking / Ready to stay ---
    lodgePreviewField(
      'lpStudioBooking',
      'Panel editorial (fuente, vista previa y edición)',
      'booking',
      'booking',
      'Precio y confianza en el Lodge; bloque de reserva de esta landing abajo.',
    ),
    defineField({
      name: 'bookingCta',
      title: '4. Selección: bloque reserva / CTAs',
      type: 'lodgePageBookingBlock',
      group: 'booking',
      description: 'Título, texto y botones. La confianza puede sobreescribirse dentro del bloque.',
    }),

    // --- Persistencia interna: overrides de copy por sección (editado desde paneles de arriba) ---
    defineField({
      name: 'sections',
      title: 'Copy por sección (interno)',
      type: 'object',
      hidden: true,
      fields: [
        defineField({name: 'overview', title: 'Overview', type: 'lodgePageSectionCopy'}),
        defineField({name: 'accommodation', title: 'Accommodation', type: 'lodgePageSectionCopy'}),
        defineField({name: 'facilities', title: 'Facilities', type: 'lodgePageSectionCopy'}),
        defineField({name: 'location', title: 'Location', type: 'lodgePageSectionCopy'}),
        defineField({name: 'research', title: 'Research', type: 'lodgePageSectionCopy'}),
        defineField({name: 'experiences', title: 'Experiences', type: 'lodgePageSectionCopy'}),
        defineField({name: 'reviews', title: 'Reviews', type: 'lodgePageSectionCopy'}),
        defineField({name: 'faq', title: 'FAQ', type: 'lodgePageSectionCopy'}),
        defineField({name: 'booking', title: 'Booking', type: 'lodgePageSectionCopy'}),
      ],
      description: 'Relleno automático desde cada pestaña; no hace falta abrir este objeto.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle', slug: 'slug.current', ln: 'lodge.name'},
    prepare: ({t, slug, ln}) => ({
      title: t || 'Lodge page',
      subtitle: [slug && `/${slug}`, ln && `· ${ln}`].filter(Boolean).join(' '),
    }),
  },
})
