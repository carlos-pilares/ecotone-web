import {defineField, defineType} from 'sanity'
import {StudioSoqtapataActualReadout} from '../components/experiencePageStudio/StudioSoqtapataActualReadout'
import {StudioSectionTabField} from '../components/experiencePageStudio/StudioSectionTabField'

const previewField = (name, title, group, section, description, extraOptions = {}) =>
  defineField({
    name,
    title,
    type: 'string',
    readOnly: true,
    group,
    description,
    components: {input: StudioSectionTabField},
    options: {section, ...extraOptions},
  })

const soqtapataActualField = (name, title, part, group, description, extra = {}) =>
  defineField({
    name,
    title,
    type: 'string',
    readOnly: true,
    group,
    description,
    components: {input: StudioSoqtapataActualReadout},
    options: {part},
    ...extra,
  })

/**
 * Landing de experiencia: presentación (URL, hero, SEO, curación).
 * Overrides por bloque se persisten en `sectionModules` (campo oculto), editados desde cada pestaña.
 */
export const experiencePage = defineType({
  name: 'experiencePage',
  title: 'Experience page (landing)',
  type: 'document',
  description:
    'Cada **pestaña** corresponde a un bloque de la URL: primero la vista canónica (solo lectura) y luego los **overrides de esta landing** en el mismo panel.',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'internalNav', title: 'Internal menu'},
    {name: 'hero', title: 'Hero'},
    {name: 'highlights', title: 'Highlights'},
    {name: 'overview', title: 'Overview'},
    {name: 'itinerary', title: 'Itinerary'},
    {name: 'lodge', title: 'Lodge'},
    {name: 'wildlife', title: 'Wildlife'},
    {name: 'included', title: 'Includes'},
    {name: 'tech', title: 'Technology'},
    {name: 'gallery', title: 'Gallery'},
    {name: 'when', title: 'When to visit'},
    {name: 'beforeYou', title: 'Guía'},
    {name: 'reviews', title: 'Reviews'},
    {name: 'terms', title: 'Terms'},
    {name: 'resources', title: 'Resources'},
    {name: 'faq', title: 'FAQs'},
    {name: 'related', title: 'Also like'},
    {name: 'reserve', title: 'Reserve'},
    {name: 'legacy', title: 'Legacy'},
  ],
  fields: [
    // --- General ---
    defineField({
      name: 'internalTitle',
      title: 'Nombre interno (solo Studio)',
      type: 'string',
      group: 'general',
      description: 'Para la lista y el equipo. No es el H1 del sitio.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / URL',
      type: 'slug',
      group: 'general',
      options: {source: 'internalTitle', maxLength: 96},
      validation: (Rule) => Rule.required(),
      description: 'Segmento de ruta (p. ej. `soqtapata-pristine-immersion`).',
    }),
    defineField({
      name: 'experience',
      title: 'Experiencia vinculada (fuente principal)',
      type: 'reference',
      to: [{type: 'experience'}],
      group: 'general',
      validation: (Rule) => Rule.required(),
      options: {disableNew: false},
      description:
        'Programa canónico: itinerario, precio base, gallery, términos, lodge, etc. ' +
        'Se edita en *Content library → Experiences*.',
    }),
    previewField(
      'stPrevGeneral',
      'Resumen de la experiencia (solo lectura)',
      'general',
      'general',
      'Vista de nombre, estado y precio de referencia en el documento Experiencia. El SEO de **esta** URL va debajo.',
    ),
    defineField({
      name: 'seo',
      title: 'SEO básico (esta URL)',
      type: 'seo',
      group: 'general',
      description: 'Título y descripción meta de **esta** landing. Pueden diferir del SEO del documento Experiencia.',
    }),

    // --- Internal menu ---
    previewField(
      'stPrevInternalNav',
      'Referencia (solo lectura)',
      'internalNav',
      'internalNav',
      'Configura el menú interno sticky en los campos de abajo. El contenido largo de cada sección sigue en Experiencia.',
    ),
    defineField({
      name: 'internalNav',
      title: 'Menú interno',
      type: 'experiencePageInternalNav',
      group: 'internalNav',
      description: 'Título, subtítulo, ítems, precios y CTA del bloque de navegación en esta landing.',
    }),

    // --- Hero ---
    previewField(
      'stPrevHero',
      'Qué se verá en el hero: Experiencia vs campos de esta landing',
      'hero',
      'hero',
      'Vista de herencia (nombre, tagline, precio, ruta) y qué pisa el bloque de Hero de abajo si lo rellenan.',
    ),
    defineField({
      name: 'pageHero',
      title: 'Hero: overrides solo de esta URL',
      type: 'landingHero',
      group: 'hero',
      description:
        'Campos opcionales **Override for this landing only**. Vacío = el sitio hereda título, tagline, precio o imagen del documento **Experiencia** según reglas del front.',
    }),

    // --- Highlights (= barra de stats bajo el hero) ---
    previewField(
      'stPrevHighlights',
      'Barra de stats (solo lectura — fuente Experiencia)',
      'highlights',
      'highlights',
      'Valores y etiquetas canónicos vienen de la **Experiencia** (logística). Abajo eliges hasta 6 stats, orden y visibilidad solo para esta landing.',
    ),
    defineField({
      name: 'snapshotStatSelections',
      title: 'Stats mostrados en esta landing (orden)',
      type: 'array',
      of: [{type: 'experiencePageSnapshotStatPick'}],
      group: 'highlights',
      validation: (Rule) =>
        Rule.max(6).custom((rows) => {
          const slots = (rows || []).map((r) => r?.slot).filter(Boolean)
          if (slots.length !== new Set(slots).size) {
            return 'No puedes repetir el mismo stat en la lista.'
          }
          return true
        }),
      description:
        'Hasta 6 entradas. Cada fila = **qué** stat (slot canónico) y si es **visible** en esta URL. Valor y label se leen de Experiencia; aquí no se editan (overrides explícitos serían otra fase).',
    }),

    // --- Overview … FAQs: preview + overrides vía StudioSectionTabField ---
    previewField(
      'stPrevOverview',
      '1. Fuente',
      'overview',
      'overview',
      'Contenido base de la sección desde Experiencia.',
    ),
    previewField(
      'stPrevItinerary',
      '1. Fuente',
      'itinerary',
      'itinerary',
      'Contenido base del itinerario desde Experiencia.',
    ),
    previewField(
      'stPrevLodge',
      '1. Fuente',
      'lodge',
      'lodge',
      'Contenido base del lodge vinculado.',
    ),
    previewField(
      'stPrevWildlife',
      '1. Fuente',
      'wildlife',
      'wildlife',
      'Contenido base de fauna desde Experiencia.',
    ),
    previewField(
      'stPrevIncludes',
      '1. Fuente',
      'included',
      'includes',
      'Contenido base de incluye y no incluye.',
    ),
    previewField(
      'stPrevTech',
      '1. Fuente',
      'tech',
      'tech',
      'Contenido base de productos de tecnología.',
    ),
    defineField({
      name: 'techProductRefs',
      title: '4. Selección y orden',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'technologyProduct'}]}],
      group: 'tech',
      validation: (Rule) => Rule.max(12),
      description:
        'Selecciona y ordena los productos que se mostrarán en esta landing.',
    }),
    defineField({
      name: 'includedTechProductIds',
      title: 'IDs estables de productos «incluidos en el pack» (opcional)',
      type: 'array',
      of: [{type: 'string'}],
      group: 'tech',
      description: 'Alinea con `stableId` de cada producto (badges, etc.).',
    }),
    previewField(
      'stPrevGallery',
      '1. Fuente',
      'gallery',
      'gallery',
      'Galería y vídeo canónicos desde la Experiencia. Debajo: vista previa y edición de esta landing.',
    ),
    previewField(
      'stPrevWhen',
      '1. Fuente',
      'when',
      'when',
      'Calendario mes a mes desde la Experiencia. Debajo: vista previa y edición de esta landing.',
    ),
    previewField(
      'stPrevBefore',
      '1. Fuente',
      'beforeYou',
      'beforeYou',
      'Guía del viajero (antes de viajar) desde la Experiencia. Debajo: vista previa y edición de esta landing.',
    ),
    previewField(
      'stPrevReviews',
      '1. Fuente',
      'reviews',
      'reviews',
      'Contenido base de reseñas desde la librería.',
    ),
    defineField({
      name: 'reviewRefs',
      title: '4. Selección y orden',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'review'}]}],
      group: 'reviews',
      validation: (Rule) => Rule.max(24),
      description: 'Selecciona y ordena las reseñas de esta landing.',
    }),
    defineField({
      name: 'reviewsLayout',
      title: 'Bloque de reseñas: eyebrow, título, rating (esta landing)',
      type: 'reviewsLayoutBlock',
      group: 'reviews',
      description: 'Rótulos del **bloque** en esta URL; el texto de la reseña no se edita aquí.',
    }),
    previewField(
      'stPrevTerms',
      '1. Fuente',
      'terms',
      'terms',
      'Cancelación, términos y notas desde la Experiencia. Debajo: vista previa y edición de esta landing.',
    ),
    previewField(
      'stPrevResources',
      '1. Fuente',
      'resources',
      'resources',
      'Contenido base de recursos y descargas.',
    ),
    previewField(
      'stPrevFaq',
      '1. Fuente',
      'faq',
      'faq',
      'Preguntas frecuentes desde la Experiencia. Debajo: vista previa y edición de esta landing.',
    ),
    soqtapataActualField(
      'stActualWebRelated',
      'Actual en la web (referencia)',
      'related',
      'related',
      'Lectura según la misma lógica que la experiencia en producción: fusiona **esta landing** + **fallback** local. No se guarda. Debajo, overrides editables; vacío = se usa lo mostrado aquí.',
      {hidden: true},
    ),
    previewField(
      'stPrevRelated',
      '1. Fuente',
      'related',
      'related',
      'Contenido base de experiencias relacionadas.',
      {},
    ),
    defineField({
      name: 'relatedExperienceRefs',
      title: '4. Selección y orden',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'experience'}]}],
      group: 'related',
      validation: (Rule) => Rule.max(6),
      description:
        'Selecciona y ordena las experiencias relacionadas para esta landing.',
    }),
    defineField({
      name: 'relatedSectionEyebrow',
      title: 'Override: eyebrow de sección',
      type: 'string',
      group: 'related',
      validation: (Rule) => Rule.max(100),
      description: '**Vacío =** el valor resuelto en «Actual en la web» (arriba).',
    }),
    defineField({
      name: 'relatedSectionTitle',
      title: 'Override: título de sección',
      type: 'string',
      group: 'related',
      validation: (Rule) => Rule.max(120),
      description: '**Vacío =** el valor resuelto en «Actual en la web» (arriba).',
    }),

    previewField(
      'stPrevReserve',
      '1. Fuente',
      'reserve',
      'reserve',
      'Experiencia vinculada + resolución del bloque reserva (vista previa). Después: edición del módulo y overrides del bloque.',
    ),
    defineField({
      name: 'reserveBlock',
      title: 'Override: bloque reserva (esta URL)',
      type: 'landingReserveBlock',
      group: 'reserve',
      description:
        'Cada subcampo vacío conserva el valor resuelto en la vista previa de esta pestaña. No sustituye al hero (pestaña **Hero**).',
    }),
    soqtapataActualField(
      'stActualWebReserve',
      'Actual en la web (referencia)',
      'reserve',
      'reserve',
      'Misma resolución que el bloque #book en la URL pública. No se guarda. La vista previa principal está arriba en «1. Fuente».',
      {hidden: true},
    ),

    defineField({
      name: 'sectionModules',
      title: 'sectionModules (persistencia interna)',
      type: 'array',
      of: [{type: 'pageModule'}],
      hidden: true,
      description:
        'Fuente única guardada para visible / eyebrow / título / intro por bloque. Se edita desde cada pestaña Overview→Reserve mediante el panel de overrides.',
    }),

    defineField({
      name: 'payloadV1',
      title: 'DEPRECATED: legacy JSON v1',
      type: 'text',
      rows: 4,
      group: 'legacy',
      readOnly: true,
      hidden: true,
      description: 'Migración antigua. El front no lo usa como fuente principal.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle', slug: 'slug.current', exp: 'experience.name'},
    prepare: ({t, slug, exp}) => ({
      title: t || 'Experience page',
      subtitle: [slug && `/${slug}`, exp && `· ${exp}`].filter(Boolean).join(' '),
    }),
  },
})
