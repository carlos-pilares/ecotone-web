import {defineField, defineType} from 'sanity'

export const reviewsLayoutBlock = defineType({
  name: 'reviewsLayoutBlock',
  title: 'Bloque de reseñas (solo esta página)',
  type: 'object',
  description:
    'Textos del **contenedor** del bloque de reseñas en esta landing (eyebrow, titular, rating mostrado, clases opcionales). ' +
    'Las **reseñas en sí** (cita, autor, programa) son canónicas en cada documento *Review* seleccionado en la pestaña de reseñas.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow del bloque',
      type: 'string',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'headline',
      title: 'Titular del bloque',
      type: 'string',
      validation: (r) => r.max(120),
    }),
    defineField({
      name: 'averageRating',
      title: 'Valoración media (texto mostrado)',
      type: 'string',
      validation: (r) => r.max(20),
      description: 'Cadena mostrada junto a estrellas (p. ej. «5.0»), no sustituye datos de las reseñas individuales.',
    }),
    defineField({
      name: 'sectionClassName',
      title: 'Clase CSS de la sección (avanzado)',
      type: 'string',
      description: 'Solo si el front necesita una variante de estilo para esta landing.',
    }),
    defineField({
      name: 'contentInnerClassName',
      title: 'Clase CSS del contenedor interior (avanzado)',
      type: 'string',
    }),
    defineField({
      name: 'useHomepageSampleReviewsIfEmpty',
      title: 'Si no hay reseñas, usar muestras de la home',
      type: 'boolean',
      initialValue: false,
      description: 'Comportamiento de fallback del componente; las reseñas reales siguen viniendo de la librería cuando existen.',
    }),
  ],
})
