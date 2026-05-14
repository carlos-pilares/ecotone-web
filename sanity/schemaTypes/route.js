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
      name: 'shortLabel',
      title: 'Short label (nav)',
      type: 'string',
      description: 'Optional. Shown in the header lodges mega menu sidebar when set; otherwise the route name is used.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'menuOrder',
      title: 'Header menu order',
      type: 'number',
      description: 'Lower numbers appear first in the Lodges mega menu. When empty, routes sort by name.',
    }),
    defineField({
      name: 'showInMenu',
      title: 'Show in Lodges mega menu',
      type: 'boolean',
      initialValue: true,
      description: 'When off, this route column is hidden from the header (lodges still group by slug for URLs/filters).',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Frase corta de identidad',
      hidden: true,
    }),
    defineField({
      name: 'ecosystemType',
      title: 'Tipo de ecosistema',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'altitudeRange',
      title: 'Rango de altitud',
      type: 'string',
      description: 'Ej.: 900–4,700 m.s.n.m.',
      hidden: true,
    }),
    defineField({
      name: 'distanceFromCusco',
      title: 'Distancia desde Cusco',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'fullDescription',
      title: 'Descripción completa',
      type: 'text',
      hidden: true,
    }),
    defineField({
      name: 'wildlife',
      title: 'Fauna emblemática',
      type: 'array',
      of: [{type: 'string'}],
      hidden: true,
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: {hotspot: true},
      hidden: true,
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      hidden: true,
    }),
  ],
})
