import {defineField, defineType} from 'sanity'

export const landingHero = defineType({
  name: 'landingHero',
  title: 'Hero de la landing',
  type: 'object',
  description:
    'Capa **solo de esta página**: titulares, badges, precio mostrado y CTA del hero. ' +
    'El producto canónico sigue siendo el documento **Experiencia** enlazado; aquí defines overrides opcionales para esta URL.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (override, opcional)',
      type: 'string',
      validation: (r) => r.max(80),
      description: 'Si lo dejas vacío, el sitio puede usar el valor por defecto del componente.',
    }),
    defineField({
      name: 'headline',
      title: 'Titular H1 (override)',
      type: 'string',
      validation: (r) => r.max(120),
      description: 'Sustituye el nombre del programa en el hero **para esta landing**. Vacío = suele usarse el nombre de la Experiencia enlazada.',
    }),
    defineField({
      name: 'headlineSub',
      title: 'Subtítulo / tagline (override)',
      type: 'text',
      rows: 2,
      description: 'Texto bajo el H1. Vacío = suele tomarse del campo tagline de la **Experiencia**.',
    }),
    defineField({
      name: 'pills',
      title: 'Badges / pastillas (override)',
      type: 'array',
      of: [{type: 'string'}],
      validation: (r) => r.max(8),
      description: 'Si rellenas el array, sustituye las pastillas por defecto (tipo de programa, ruta, duración). Si lo dejas vacío, el sitio puede derivarlas de la Experiencia.',
    }),
    defineField({
      name: 'priceLine',
      title: 'Línea de precio (mostrada)',
      type: 'string',
      validation: (r) => r.max(40),
      description: 'Texto corto de precio en el hero (p. ej. «from $380»). Ver también «Usar precio del producto».',
    }),
    defineField({
      name: 'priceSub',
      title: 'Subtítulo de precio',
      type: 'string',
      validation: (r) => r.max(80),
      description: 'Segunda línea bajo el precio (p. ej. «per person · all inclusive»).',
    }),
    defineField({
      name: 'useProductPrice',
      title: 'Usar precio del producto enlazado si no hay override arriba',
      type: 'boolean',
      initialValue: true,
      description: 'Si está activo y no rellenas línea de precio, el front puede mostrar el precio de la **Experiencia**.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen del hero (override)',
      type: 'imageWithAlt',
      description:
        'Imagen opcional **solo para esta landing**. Si está vacía, el sitio suele usar la imagen principal de la **Experiencia**.',
    }),
    defineField({
      name: 'bookCta',
      title: 'CTA principal (reserva) — legacy',
      type: 'cta',
      hidden: true,
      description: 'Legacy fallback — hidden from normal editing.',
    }),
    defineField({
      name: 'bookCtaSmartLink',
      title: 'CTA principal (reserva)',
      type: 'smartLink',
      description: 'Primary editor control for the hero booking button.',
    }),
  ],
})
