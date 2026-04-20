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
  {title: 'Activo', value: 'active'},
  {title: 'Próximamente', value: 'coming-soon'},
]

export const experience = defineType({
  name: 'experience',
  title: 'Experiencia',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio (USD)',
      type: 'number',
    }),
    defineField({
      name: 'duration',
      title: 'Duración',
      type: 'string',
      description: 'Ej.: 3D / 2N',
    }),
    defineField({
      name: 'programType',
      title: 'Tipo de programa',
      type: 'string',
      options: {
        list: PROGRAM_TYPE_OPTIONS,
        layout: 'radio',
      },
    }),
    defineField({
      name: 'route',
      title: 'Ruta',
      type: 'string',
      options: {
        list: ROUTE_OPTIONS,
        layout: 'radio',
      },
    }),
    defineField({
      name: 'lodge',
      title: 'Lodge',
      type: 'reference',
      to: [{type: 'lodge'}],
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: STATUS_OPTIONS,
        layout: 'radio',
      },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta (cards)',
      type: 'string',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Descripción completa',
      type: 'text',
    }),
    defineField({
      name: 'highlights',
      title: 'Puntos clave',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'includes',
      title: 'Incluye',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'notIncludes',
      title: 'No incluye',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
  ],
})
