import {defineField, defineType} from 'sanity'

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

const GALLERY_CATEGORY = [
  {title: 'Trail & Wildlife', value: 'trail-wildlife'},
  {title: 'Lodge', value: 'lodge'},
  {title: 'Drone footage', value: 'drone-footage'},
  {title: 'Research station', value: 'research'},
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

const SEASONAL_LEVELS = [
  {title: 'Verde — Siempre bueno', value: 'always-good'},
  {title: 'Ámbar ★ — Gran temporada', value: 'good'},
  {title: 'Marrón ★★ — Temporada pico', value: 'peak'},
]

const imgHot = {hotspot: true}

export const experience = defineType({
  name: 'experience',
  title: 'Experiencia',
  type: 'document',
  groups: [
    {name: 'identity', title: '① Identidad', default: true},
    {name: 'media', title: '② Media'},
    {name: 'content', title: '③ Contenido'},
    {name: 'itinerary', title: '④ Itinerario'},
    {name: 'logistics', title: '⑤ Logística'},
    {name: 'wildlife', title: '⑥ Wildlife'},
    {name: 'tech', title: '⑦ Tecnología'},
    {name: 'seasonal', title: '⑧ Cuándo ir'},
    {name: 'practical', title: '⑨ Antes de viajar'},
    {name: 'terms', title: '⑩ Términos'},
    {name: 'resources', title: '⑪ Recursos'},
    {name: 'faq', title: '⑫ FAQs'},
    {name: 'seo', title: '⑬ SEO'},
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
      name: 'route',
      title: 'Ruta',
      type: 'string',
      group: 'identity',
      options: {list: ROUTE_OPTIONS, layout: 'radio'},
      validation: (Rule) => Rule.required(),
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
      title: 'Descripción completa (Overview)',
      type: 'text',
      group: 'identity',
      rows: 6,
      description: 'Descripción larga del Overview. Máx 600 caracteres. 2-3 párrafos cortos.',
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
      title: 'Galería',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'object',
          name: 'galleryItem',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: imgHot,
              validation: (Rule) => Rule.required(),
              description: '1200×800px mínimo, ratio 3:2',
            }),
            defineField({
              name: 'caption',
              title: 'Pie de foto / overlay',
              type: 'string',
              description: 'Texto que aparece sobre la imagen en la galería. Máx 80 caracteres.',
              validation: (Rule) => Rule.max(80),
            }),
            defineField({
              name: 'category',
              title: 'Categoría',
              type: 'string',
              options: {list: GALLERY_CATEGORY, layout: 'dropdown'},
              description: 'Filtra las fotos en los tabs de la galería.',
            }),
          ],
          preview: {select: {title: 'caption', media: 'image', subtitle: 'category'}},
        },
      ],
      description: 'Galería completa de la experiencia. Recomendado: 1200×800px, ratio 3:2. Máx 20 fotos.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL del vídeo',
      type: 'url',
      group: 'media',
      description:
        'URL del video principal. YouTube o Vimeo. La sección See it before you go solo aparece si hay video o fotos de galería.',
    }),
    defineField({
      name: 'videoTitle',
      title: 'Título del video',
      type: 'string',
      group: 'media',
      description: 'Título del video. Aparece en el badge sobre el player. Máx 60 caracteres.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'videoDuration',
      title: 'Duración',
      type: 'string',
      group: 'media',
      description: 'Duración. Ej: 3:24. Máx 8 caracteres.',
      validation: (Rule) => Rule.max(8),
    }),

    // --- Content (highlights) ---
    defineField({
      name: 'highlights',
      title: 'Highlights (Overview)',
      type: 'array',
      group: 'content',
      of: [{type: 'string', validation: (Rule) => Rule.max(100)}],
      description:
        'Bullets del Overview. Máx 5. Cada item máx 100 caracteres. Usa verbos en infinitivo: Fly the canopy with EcoDroneView®.',
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
              name: 'lodgeOvernight',
              title: 'Lodge (noche)',
              type: 'string',
              description: 'Dejar vacío en el último día. Máx 50 caracteres.',
              validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: 'lodgeSub',
              title: 'Detalle alojamiento',
              type: 'string',
              description: 'Ej: Private bungalow · full board. Máx 70 caracteres.',
              validation: (Rule) => Rule.max(70),
            }),
          ],
        },
      ],
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
      title: 'Lodge principal',
      type: 'reference',
      to: [{type: 'lodge'}],
      group: 'logistics',
      description: "Lodge principal. Aparece en Where you'll stay.",
    }),
    defineField({
      name: 'lodgeNightLabel',
      title: 'Etiqueta de noches',
      type: 'string',
      group: 'logistics',
      description: 'Ej: Nights 1 & 2 · Night 2 only. Máx 30 caracteres.',
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: 'groupSizeMin',
      title: 'Grupo mín.',
      type: 'number',
      group: 'logistics',
      description: 'Tamaño mínimo del grupo.',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'groupSizeMax',
      title: 'Grupo máx.',
      type: 'number',
      group: 'logistics',
      description: 'Tamaño máximo del grupo. Aparece en snapshot bar como Max 8.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'altitude',
      title: 'Altitud (destino)',
      type: 'string',
      group: 'logistics',
      description: 'Ej: 1,200 m · 3,400 m. Máx 20 caracteres. Aparece en snapshot bar.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'distanceFromCusco',
      title: 'Distancia / tiempo desde Cusco',
      type: 'string',
      group: 'logistics',
      description: 'Ej: ~2.5h · ~8h. Máx 20 caracteres. Aparece en snapshot bar.',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'ecosystem',
      title: 'Ecosistema',
      type: 'string',
      group: 'logistics',
      description: 'Ej: Cloud forest · Deep jungle. Máx 30 caracteres. Aparece en snapshot bar.',
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
              description: 'Foto de la especie (opcional). Recomendado: 400×400px, ratio 1:1.',
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
              title: 'Nivel',
              type: 'string',
              options: {list: SEASONAL_LEVELS, layout: 'radio'},
              validation: (Rule) => Rule.required(),
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

    // --- Practical ---
    defineField({
      name: 'entryRequirements',
      title: 'Requisitos de entrada',
      type: 'array',
      group: 'practical',
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
      description: "Requisitos. Acordeón 'Entry requirements' pre-expandido. Máx 6 items.",
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'packingList',
      title: 'Lista de equipaje',
      type: 'array',
      group: 'practical',
      of: [{type: 'string', validation: (Rule) => Rule.max(60)}],
      description: "Acordeón 'Packing list'. Máx 20 items.",
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'gettingHereInfo',
      title: 'Cómo llegar / logística',
      type: 'array',
      group: 'practical',
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
      description: "Acordeón 'Getting to Cusco'. Máx 4 items.",
      validation: (Rule) => Rule.max(4),
    }),

    // --- Terms ---
    defineField({
      name: 'cancellationPolicy',
      title: 'Política de cancelación',
      type: 'text',
      group: 'terms',
      rows: 4,
      description: 'Aparece en la sección Terms. Máx 400 caracteres.',
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'termsAndConditions',
      title: 'Términos y condiciones',
      type: 'text',
      group: 'terms',
      rows: 6,
      description: 'Términos completos. Aparece expandible en la sección Terms. Máx 800 caracteres.',
      validation: (Rule) => Rule.max(800),
    }),
    defineField({
      name: 'importantNotes',
      title: 'Notas importantes',
      type: 'array',
      group: 'terms',
      of: [{type: 'string', validation: (Rule) => Rule.max(100)}],
      description: 'Bullets adicionales en la sección Terms. Máx 5 items.',
      validation: (Rule) => Rule.max(5),
    }),

    // --- Resources (maps, brochure, related) ---
    defineField({
      name: 'resources',
      title: 'Tarjetas de recursos',
      type: 'array',
      group: 'resources',
      of: [{type: 'experienceResourceCard'}],
      description:
        'Contenido editorial de la sección Resources (título, subtítulo, preview, PDF/enlace, CTA). Si esta lista tiene ítems visibles, sustituye las tarjetas de respaldo hardcodeadas en el sitio.',
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
      title: 'Experiencias relacionadas',
      type: 'array',
      group: 'resources',
      of: [{type: 'reference', to: [{type: 'experience'}]}],
      description: 'Máx 3. No te incluyas a ti mismo.',
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
