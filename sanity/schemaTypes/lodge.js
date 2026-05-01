import {defineField, defineType} from 'sanity'

const ROUTE_OPTIONS = [
  {title: 'Camanti', value: 'camanti'},
  {title: 'Manu Road', value: 'manu-road'},
  {title: 'Manu Core', value: 'manu-core'},
]

export const lodge = defineType({
  name: 'lodge',
  title: 'Lodge',
  type: 'document',
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO (optional, lodge page)',
      type: 'seo',
    }),
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
      name: 'route',
      title: 'Ruta',
      type: 'string',
      options: {
        list: ROUTE_OPTIONS,
        layout: 'radio',
      },
    }),
    defineField({
      name: 'altitude',
      title: 'Altitud',
      type: 'string',
      description: 'Ej.: 1,200 m.s.n.m.',
    }),
    defineField({
      name: 'distanceFromCusco',
      title: 'Distancia desde Cusco',
      type: 'string',
      description: 'Ej.: ~2.5 hrs',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacidad máxima de huéspedes',
      type: 'number',
    }),
    defineField({
      name: 'ecosystem',
      title: 'Ecosistema',
      type: 'string',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'string',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Descripción completa',
      type: 'text',
    }),
    defineField({
      name: 'researchStation',
      title: 'Estación de investigación',
      type: 'object',
      fields: [
        defineField({name: 'name', title: 'Nombre', type: 'string'}),
        defineField({name: 'description', title: 'Descripción', type: 'text'}),
        defineField({name: 'organization', title: 'Organización', type: 'string'}),
      ],
    }),
    defineField({
      name: 'amenities',
      title: 'Servicios / amenidades',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'roomTypes',
      title: 'Tipos de habitación',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'roomType',
          title: 'Tipo de habitación',
          fields: [
            defineField({name: 'name', title: 'Nombre', type: 'string'}),
            defineField({name: 'capacity', title: 'Capacidad', type: 'number'}),
            defineField({name: 'bedType', title: 'Tipo de cama', type: 'string'}),
            defineField({
              name: 'hasPrivateBathroom',
              title: 'Baño privado',
              type: 'boolean',
            }),
            defineField({name: 'description', title: 'Descripción', type: 'text'}),
          ],
        },
      ],
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
