import {defineField, defineType} from 'sanity'
import {
  experienceGalleryItem,
  experienceItineraryOvernight,
  experienceKnowledgeResource,
  experienceLodgePresentationRow,
  experienceSeasonLegend,
  experienceTermsPanel,
  experienceTravelerGuideSection,
  experienceTravelerGuideSubsection,
} from './objects/experienceKnowledgeObjects'

const PROGRAM_TYPE_OPTIONS = [
  {title: 'Nature Core', value: 'nature-core'},
  {title: 'Family Adventure', value: 'family-adventure'},
  {title: 'Experiential Learning', value: 'experiential-learning'},
  {title: 'Tailor Made', value: 'tailor-made'},
]

const ROUTE_OPTIONS = [
  {title: 'Camanti', value: 'camanti'},
  {title: 'Manu Road', value: 'manu-road'},
  {title: 'Manu Core', value: 'manu-core'},
]

const STATUS_OPTIONS = [
  {title: 'Activo (visible y bookeable)', value: 'active'},
  {title: 'Coming soon (visible sin booking)', value: 'coming-soon'},
]

const WILDLIFE_ICONS = [
  {title: 'Pájaro / Ave', value: 'bird'},
  {title: 'Oso / Mamífero grande', value: 'bear'},
  {title: 'Felino / Puma', value: 'cat'},
  {title: 'Jaguar / Leopardo', value: 'jaguar'},
  {title: 'Mono / Primate', value: 'monkey'},
  {title: 'Nutria / Semiacuático', value: 'otter'},
  {title: 'Reptil / Anfibio', value: 'reptile'},
  {title: 'Pez / Acuático', value: 'fish'},
  {title: 'Planta / Flora', value: 'plant'},
  {title: 'Insecto / Mariposa', value: 'insect'},
  {title: 'Icono genérico', value: 'generic'},
]

const MONTHS = [
  {title: 'Enero', value: 'january'},
  {title: 'Febrero', value: 'february'},
  {title: 'Marzo', value: 'march'},
  {title: 'Abril', value: 'april'},
  {title: 'Mayo', value: 'may'},
  {title: 'Junio', value: 'june'},
  {title: 'Julio', value: 'july'},
  {title: 'Agosto', value: 'august'},
  {title: 'Septiembre', value: 'september'},
  {title: 'Octubre', value: 'october'},
  {title: 'Noviembre', value: 'november'},
  {title: 'Diciembre', value: 'december'},
]

/** Canonical month band: peak → two stars · great → one star · always → neutral bar, no stars. Legacy values still accepted in the API. */
const SEASON_MONTH_LEVEL = [
  {title: 'Peak — strongest band, two ★★', value: 'peak'},
  {title: 'Great — medium band, one ★', value: 'great'},
  {title: 'Always worthwhile — neutral band, no ★', value: 'always'},
]

const imgHot = {hotspot: true}

export const experience = defineType({
  name: 'experience',
  title: 'Experiencia',
  type: 'document',
  groups: [
    {name: 'identity', title: '① Identidad', default: true},
    {name: 'media', title: '② Media'},
    {name: 'content', title: '③ Overview · datos'},
    {name: 'itinerary', title: '④ Itinerario'},
    {name: 'lodges', title: '⑤ Lodges'},
    {name: 'logistics', title: '⑥ Logística'},
    {name: 'wildlife', title: '⑦ Wildlife'},
    {name: 'tech', title: '⑧ Tecnología'},
    {name: 'seasonal', title: '⑨ Cuándo ir'},
    {name: 'practical', title: '⑩ Guía viajero'},
    {name: 'terms', title: '⑪ Términos'},
    {name: 'resources', title: '⑫ Recursos'},
    {name: 'related', title: '⑬ Relacionadas'},
    {name: 'faq', title: '⑭ FAQs'},
    {name: 'seo', title: '⑮ SEO'},
  ],
  fields: [
    // --- Identity ---
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      group: 'identity',
      description: 'Nombre de la experiencia. Máx 60 caracteres. Aparece en títulos, cards y nav.',
      validation: (Rule) => [Rule.required(), Rule.max(60)],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'name', maxLength: 96},
      description: 'URL de la experiencia. Se genera desde el nombre.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'programType',
      title: 'Tipo de programa',
      type: 'string',
      group: 'identity',
      options: {list: PROGRAM_TYPE_OPTIONS, layout: 'radio'},
      description: 'Tipo de programa. Define el filtro en la homepage.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'routeRef',
      title: 'Route',
      type: 'reference',
      to: [{type: 'route'}],
      group: 'identity',
      description:
        'Canonical route from **Route Knowledge Center**. Display name comes from that document; slug drives filters and resolving.',
    }),
    defineField({
      name: 'route',
      title: 'Route slug (legacy)',
      type: 'string',
      group: 'identity',
      hidden: true,
      options: {list: ROUTE_OPTIONS, layout: 'radio'},
      description: 'Deprecated — use Route reference. Kept for migration.',
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      group: 'identity',
      options: {list: STATUS_OPTIONS, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duración',
      type: 'string',
      group: 'identity',
      description: 'Ej: 3D / 2N · 6W. Máx 10 caracteres. Aparece en cards, snapshot bar y nav interno.',
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'price',
      title: 'Precio base (USD)',
      type: 'number',
      group: 'identity',
      description: 'Precio base en USD. Usado para ordenar. Para tailor-made dejar en 0.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'priceLabel',
      title: 'Etiqueta de precio',
      type: 'string',
      group: 'identity',
      description: 'Texto del precio. Ej: USD 986 · Enquire · Custom pricing. Máx 20 caracteres.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'lodgeEnquireSmartLink',
      title: 'Lodge card — Enquire link (sin precio)',
      type: 'smartLink',
      group: 'identity',
      description:
        'Cuando la tarjeta de experiencia en la página del lodge muestra Enquire (sin precio numérico), el clic usa este enlace. Si está vacío, se abre WhatsApp con un mensaje prefijado.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'identity',
      description: 'Frase corta bajo el título en el hero. Máx 120 caracteres. Ej: The untouched cloud forest. 10,000 ha reserve.',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'text',
      group: 'identity',
      rows: 3,
      description: 'Para cards en homepage y listados. Máx 160 caracteres. Sin saltos de línea.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Descripción overview (legacy)',
      type: 'text',
      group: 'identity',
      rows: 6,
      hidden: true,
      description:
        'Deprecated: editorial overview body belongs on **Experience page**. Highlights stay here as product facts.',
      validation: (Rule) => Rule.max(600),
    }),

    // --- Media ---
    defineField({
      name: 'mainImage',
      title: 'Imagen hero',
      type: 'image',
      group: 'media',
      options: imgHot,
      description:
        'Imagen hero principal. Aparece en: hero de la experiencia, cards de homepage, modal de routes. Recomendado: 1600×900px mínimo, ratio 16:9. Formato JPG.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Media gallery',
      type: 'array',
      group: 'media',
      of: [{type: 'experienceGalleryItem'}],
      description:
        'Photos and videos for this experience. Each landing page picks and orders items from this list.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL del vídeo (legacy)',
      type: 'url',
      group: 'media',
      hidden: true,
      description: 'Deprecated — add videos as **Media gallery** items (type Video). Kept for migration.',
    }),
    defineField({
      name: 'videoTitle',
      title: 'Título del video (legacy)',
      type: 'string',
      group: 'media',
      hidden: true,
      validation: (Rule) => Rule.max(60),
      description: 'Deprecated — use a video media item title instead.',
    }),
    defineField({
      name: 'videoDuration',
      title: 'Duración (legacy)',
      type: 'string',
      group: 'media',
      hidden: true,
      validation: (Rule) => Rule.max(8),
      description: 'Deprecated.',
    }),

    // --- Content (highlights) ---
    defineField({
      name: 'highlights',
      title: 'Overview highlights / product facts',
      type: 'array',
      group: 'content',
      of: [{type: 'string', validation: (Rule) => Rule.max(100)}],
      description:
        'Short factual bullets only (no editorial overview body — that lives on Experience pages). Max 5 lines.',
      validation: (Rule) => Rule.max(5),
    }),

    // --- Itinerary ---
    defineField({
      name: 'itinerary',
      title: 'Itinerario',
      type: 'array',
      group: 'itinerary',
      description: 'Un objeto por día. El orden determina Day 1, Day 2, etc.',
      of: [
        {
          type: 'object',
          name: 'itineraryDay',
          fields: [
            defineField({
              name: 'dayNumber',
              title: 'Día nº',
              type: 'number',
              description: 'Número del día (1, 2, 3...)',
              validation: (Rule) => [Rule.required().integer().min(1)],
            }),
            defineField({
              name: 'title',
              title: 'Título',
              type: 'string',
              description: 'Título del día. Aparece en el acordeón. Máx 50 caracteres.',
              validation: (Rule) => [Rule.required(), Rule.max(50)],
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtítulo',
              type: 'string',
              description: 'Actividades del día separadas por ·. Aparece colapsado bajo el título. Máx 100 caracteres.',
              validation: (Rule) => Rule.max(100),
            }),
            defineField({
              name: 'image',
              title: 'Foto del día',
              type: 'image',
              options: imgHot,
              description: 'Foto del día. Recomendado: 1400×600px, ratio 7:3.',
            }),
            defineField({
              name: 'photoCaption',
              title: 'Caption de la foto',
              type: 'string',
              description: 'Aparece superpuesto sobre la imagen expandida. Máx 80 caracteres.',
              validation: (Rule) => Rule.max(80),
            }),
            defineField({
              name: 'timeline',
              title: 'Cronograma',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'timeBlock',
                  fields: [
                    defineField({
                      name: 'time',
                      type: 'string',
                      title: 'Hora',
                      description: 'Ej: 4:30 AM. Máx 12 caracteres.',
                      validation: (Rule) => Rule.max(12),
                    }),
                    defineField({
                      name: 'title',
                      type: 'string',
                      title: 'Título actividad',
                      validation: (Rule) => [Rule.required(), Rule.max(60)],
                    }),
                    defineField({
                      name: 'description',
                      type: 'text',
                      title: 'Descripción',
                      validation: (Rule) => Rule.max(200),
                    }),
                  ],
                },
              ],
              description: 'Actividades del día en orden cronológico. Máx 8 actividades.',
              validation: (Rule) => Rule.max(8),
            }),
            defineField({
              name: 'overnight',
              title: 'Overnight lodging',
              type: 'experienceItineraryOvernight',
              description:
                'Pick the lodge guests stay at after this day, or “no lodge” on the final travel day.',
            }),
            defineField({
              name: 'lodgeOvernight',
              title: 'Lodge label (legacy)',
              type: 'string',
              hidden: true,
              validation: (Rule) => Rule.max(50),
              description: 'Deprecated — use Overnight lodging.',
            }),
            defineField({
              name: 'lodgeSub',
              title: 'Detalle alojamiento (legacy)',
              type: 'string',
              hidden: true,
              validation: (Rule) => Rule.max(70),
              description: 'Deprecated.',
            }),
          ],
        },
      ],
    }),

    // --- Lodges (presentation per lodge used on this programme) ---
    defineField({
      name: 'lodgePresentationRows',
      title: 'Lodges on this programme',
      type: 'array',
      group: 'lodges',
      of: [{type: 'experienceLodgePresentationRow'}],
      description:
        'One row per lodge guests stay at (typically matches itinerary overnight lodges). Sets nights label, bullets and CTA for **Your lodge** — name and description always come from Lodge KC.',
      validation: (Rule) => Rule.max(8),
    }),

    // --- Logistics ---
    defineField({
      name: 'includes',
      title: 'Incluye',
      type: 'array',
      group: 'logistics',
      of: [{type: 'string', validation: (Rule) => Rule.max(80)}],
      description: "Lista de qué incluye. Aparece con check verde. Máx 15 items.",
      validation: (Rule) => Rule.max(15),
    }),
    defineField({
      name: 'notIncludes',
      title: 'No incluye',
      type: 'array',
      group: 'logistics',
      of: [{type: 'string', validation: (Rule) => Rule.max(80)}],
      description: 'Aparece con X gris. Máx 10 items.',
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'lodge',
      title: 'Lodge principal (legacy)',
      type: 'reference',
      to: [{type: 'lodge'}],
      group: 'logistics',
      hidden: true,
      description: 'Deprecated — use Lodges tab + itinerary overnight references.',
    }),
    defineField({
      name: 'lodgeNightLabel',
      title: 'Etiqueta de noches (legacy)',
      type: 'string',
      group: 'logistics',
      hidden: true,
      description: 'Deprecated — use Lodges tab.',
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: 'groupSizeMin',
      title: 'Grupo mín.',
      type: 'number',
      group: 'logistics',
      hidden: true,
      description:
        'Hidden from Logistics — still used for reserve/snapshot product facts where needed. Legacy data preserved.',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'groupSizeMax',
      title: 'Grupo máx.',
      type: 'number',
      group: 'logistics',
      hidden: true,
      description:
        'Hidden from Logistics — still used in hero snapshot stats when set. Legacy data preserved.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'altitude',
      title: 'Altitud (destino)',
      type: 'string',
      group: 'logistics',
      hidden: true,
      description:
        'Hidden from Logistics — still drives snapshot altitude line when set. Legacy data preserved.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'distanceFromCusco',
      title: 'Distancia / tiempo desde Cusco',
      type: 'string',
      group: 'logistics',
      hidden: true,
      description: 'Hidden from Logistics — still used in snapshot stats when set.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'ecosystem',
      title: 'Ecosistema',
      type: 'string',
      group: 'logistics',
      hidden: true,
      description: 'Hidden from Logistics — still used in snapshot stats when set.',
      validation: (Rule) => Rule.max(30),
    }),

    // --- Wildlife ---
    defineField({
      name: 'wildlife',
      title: 'Vida silvestre',
      type: 'array',
      group: 'wildlife',
      of: [
        {
          type: 'object',
          name: 'wildlifeItem',
          fields: [
            defineField({
              name: 'name',
              title: 'Nombre',
              type: 'string',
              validation: (Rule) => [Rule.required(), Rule.max(40)],
            }),
            defineField({
              name: 'description',
              title: 'Subtítulo',
              type: 'string',
              validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: 'iconType',
              title: 'Icono',
              type: 'string',
              options: {list: WILDLIFE_ICONS, layout: 'dropdown'},
              description: 'Icono SVG en la card. Elige el más representativo de la especie.',
            }),
            defineField({
              name: 'image',
              title: 'Foto (opcional)',
              type: 'image',
              options: imgHot,
              description:
                'Foto editorial de la especie (opcional). Recomendado: horizontal ~16:10 o 4:3, mín. ~900px de ancho.',
            }),
            defineField({
              name: 'badge',
              title: 'Badge (opcional)',
              type: 'string',
              description: 'Ej. Rare, Research — aparece sobre el nombre.',
              validation: (Rule) => Rule.max(28),
            }),
          ],
        },
      ],
      description: 'Especies que se pueden observar. Máx 10 especies.',
      validation: (Rule) => Rule.max(10),
    }),

    // --- Tech ---
    defineField({
      name: 'includedTechProducts',
      title: 'Productos tecnológicos incluidos',
      type: 'array',
      group: 'tech',
      of: [{type: 'reference', to: [{type: 'technologyProduct'}]}],
      description:
        "Productos tech incluidos con badge 'Only at Ecotone'. Los demás se muestran dimmed. Máx 3. Si no seleccionas ninguno, los 3 aparecen como disponibles (en front).",
      validation: (Rule) => Rule.max(3),
    }),

    // --- Seasonal ---
    defineField({
      name: 'bestTimeByMonth',
      title: 'Mejor época por mes',
      type: 'array',
      group: 'seasonal',
      of: [
        {
          type: 'object',
          name: 'bestMonth',
          fields: [
            defineField({
              name: 'month',
              title: 'Mes',
              type: 'string',
              options: {list: MONTHS, layout: 'dropdown'},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'highlight',
              title: 'Destacado',
              type: 'string',
              description: 'Qué se puede ver o vivir este mes. Siempre positivo. Máx 70 caracteres.',
              validation: (Rule) => [Rule.required(), Rule.max(70)],
            }),
            defineField({
              name: 'level',
              title: 'Season level',
              type: 'string',
              options: {list: SEASON_MONTH_LEVEL, layout: 'radio'},
              validation: (Rule) => Rule.required(),
              description:
                'Controls the month card bar intensity and ★ markers. Editors set labels for these tiers in Season legend.',
            }),
          ],
        },
      ],
      description: 'Un objeto por mes. Máx 12. Todos los meses deben tener contenido — no hay meses malos, solo diferentes.',
      validation: (Rule) => [
        Rule.max(12),
        Rule.custom((rows) => {
          if (!rows || rows.length === 0) return true
          if (rows.length !== 12) return 'Añade exactamente 12 filas, una por mes.'
          return true
        }),
      ],
    }),
    defineField({
      name: 'seasonLegend',
      title: 'Season legend & level definitions',
      type: 'experienceSeasonLegend',
      group: 'seasonal',
      description:
        'Legend eyebrow/intro and copy for peak / great / always-worthwhile tiers (shown next to the month grid).',
    }),

    // --- Practical ---
    defineField({
      name: 'travelerGuideSubsections',
      title: 'Traveller guide',
      type: 'array',
      group: 'practical',
      of: [{type: 'experienceTravelerGuideSubsection'}],
      description:
        'Any number of accordion cards: header icon, title, and Q&A rows each. Prefer this over legacy bucket sections.',
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'travelerGuideSections',
      title: 'Subsections (legacy — buckets)',
      type: 'array',
      group: 'practical',
      hidden: true,
      of: [{type: 'experienceTravelerGuideSection'}],
      description: 'Deprecated — use **Traveller guide**. Kept for existing documents; resolver fallback.',
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'entryRequirements',
      title: 'Requisitos de entrada (legacy)',
      type: 'array',
      group: 'practical',
      hidden: true,
      of: [
        {
          type: 'object',
          name: 'entryBlock',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Título',
              validation: (Rule) => [Rule.required(), Rule.max(40)],
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Descripción',
              validation: (Rule) => [Rule.required(), Rule.max(250)],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'packingList',
      title: 'Lista de equipaje (legacy)',
      type: 'array',
      group: 'practical',
      hidden: true,
      of: [{type: 'string', validation: (Rule) => Rule.max(60)}],
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'gettingHereInfo',
      title: 'Cómo llegar (legacy)',
      type: 'array',
      group: 'practical',
      hidden: true,
      of: [
        {
          type: 'object',
          name: 'gettingBlock',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Título',
              validation: (Rule) => [Rule.required(), Rule.max(40)],
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Descripción',
              validation: (Rule) => [Rule.required(), Rule.max(250)],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // --- Terms ---
    defineField({
      name: 'termsPanels',
      title: 'Terms sections',
      type: 'array',
      group: 'terms',
      of: [{type: 'experienceTermsPanel'}],
      validation: (Rule) => Rule.max(10),
      description: 'Up to 10 titled sections. Shown as accordion cards on the experience page.',
    }),
    defineField({
      name: 'fullTermsPdf',
      title: 'Full terms PDF',
      type: 'file',
      group: 'terms',
      options: {accept: 'application/pdf'},
      description: 'Download for “full terms” — surfaced via existing Terms PDF control.',
    }),
    defineField({
      name: 'cancellationPolicy',
      title: 'Política de cancelación (legacy)',
      type: 'text',
      group: 'terms',
      rows: 4,
      hidden: true,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'termsAndConditions',
      title: 'Términos — texto largo (legacy)',
      type: 'text',
      group: 'terms',
      rows: 6,
      hidden: true,
      validation: (Rule) => Rule.max(800),
    }),
    defineField({
      name: 'importantNotes',
      title: 'Notas importantes (legacy)',
      type: 'array',
      group: 'terms',
      hidden: true,
      of: [{type: 'string', validation: (Rule) => Rule.max(100)}],
      validation: (Rule) => Rule.max(5),
    }),

    // --- Resources ---
    defineField({
      name: 'knowledgeResources',
      title: 'Resources',
      type: 'array',
      group: 'resources',
      of: [{type: 'experienceKnowledgeResource'}],
      description: 'Download / link cards (image, copy, optional CTA).',
    }),
    defineField({
      name: 'resources',
      title: 'Tarjetas de recursos (legacy)',
      type: 'array',
      group: 'resources',
      hidden: true,
      of: [{type: 'experienceResourceCard'}],
    }),
    defineField({
      name: 'mapPdfUrl',
      title: 'Mapa PDF — URL (legacy)',
      type: 'url',
      group: 'resources',
      hidden: true,
      readOnly: true,
      description:
        'Oculto: mantenido solo por compatibilidad / fallback técnico si no hay tarjetas. Preferir “Tarjetas de recursos”.',
    }),
    defineField({
      name: 'mapPdfLabel',
      title: 'Etiqueta del mapa (legacy)',
      type: 'string',
      group: 'resources',
      hidden: true,
      readOnly: true,
      description: 'Oculto: ver “Tarjetas de recursos”.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'brochurePdfUrl',
      title: 'Brochure PDF — URL (legacy)',
      type: 'url',
      group: 'resources',
      hidden: true,
      readOnly: true,
      description: 'Oculto: ver “Tarjetas de recursos”.',
    }),
    defineField({
      name: 'brochurePdfLabel',
      title: 'Etiqueta del brochure (legacy)',
      type: 'string',
      group: 'resources',
      hidden: true,
      readOnly: true,
      description: 'Oculto: ver “Tarjetas de recursos”.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'relatedExperiences',
      title: 'Experiencias relacionadas (legacy)',
      type: 'array',
      group: 'related',
      of: [{type: 'reference', to: [{type: 'experience'}]}],
      hidden: true,
      description:
        'Deprecated — related cards are curated on each **Experience page** landing. Kept for old documents only.',
      validation: (Rule) => Rule.max(3),
    }),

    // --- FAQ ---
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Pregunta',
              validation: (Rule) => [Rule.required(), Rule.max(120)],
            }),
            defineField({
              name: 'answer',
              type: 'text',
              title: 'Respuesta',
              validation: (Rule) => [Rule.required(), Rule.max(500)],
            }),
          ],
        },
      ],
      description: 'Máx 10.',
      validation: (Rule) => Rule.max(10),
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO (recomendado)',
      type: 'seo',
      group: 'seo',
      description: 'Preferir meta title/description y OG aquí. Los campos sueltos de abajo se conservan para migración.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO — título (legacy)',
      type: 'string',
      group: 'seo',
      description: 'Si vacío se usa el nombre. Máx 60 caracteres. Preferir el objeto SEO arriba.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO — descripción (legacy)',
      type: 'string',
      group: 'seo',
      description: 'Si vacío se usa shortDescription. Máx 160 caracteres. Preferir el objeto SEO arriba.',
      validation: (Rule) => Rule.max(160),
    }),
  ],
})
