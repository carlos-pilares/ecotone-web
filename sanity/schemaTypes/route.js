import {defineField, defineType} from 'sanity'

export const route = defineType({
  name: 'route',
  title: 'Ruta',
  type: 'document',
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO (optional, route page)',
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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Frase corta de identidad',
    }),
    defineField({
      name: 'ecosystemType',
      title: 'Tipo de ecosistema',
      type: 'string',
    }),
    defineField({
      name: 'altitudeRange',
      title: 'Rango de altitud',
      type: 'string',
      description: 'Ej.: 900–4,700 m.s.n.m.',
    }),
    defineField({
      name: 'distanceFromCusco',
      title: 'Distancia desde Cusco',
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
      name: 'wildlife',
      title: 'Fauna emblemática',
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
