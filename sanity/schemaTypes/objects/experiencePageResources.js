import {defineField, defineType} from 'sanity'

/**
 * Bloque Resources solo en `experiencePage`: prioridad sobre `experience.resources`
 * para tarjetas y copy de preview map/brochure cuando no hay imagen.
 */
export const experiencePageResources = defineType({
  name: 'experiencePageResources',
  title: 'Resources (esta landing)',
  type: 'object',
  fields: [
    defineField({
      name: 'mapPreviewTitle',
      title: 'Preview mapa — título (SVG)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Línea principal del arte “mapa” si la tarjeta no tiene imagen. Vacío = fallback técnico del sitio.',
    }),
    defineField({
      name: 'mapPreviewSubtitle',
      title: 'Preview mapa — subtítulo',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'brochurePreviewBadge',
      title: 'Preview brochure — badge',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Texto bajo el isotipo en la plantilla brochure.',
    }),
    defineField({
      name: 'cards',
      title: 'Tarjetas (orden = orden en la web)',
      type: 'array',
      of: [{type: 'experienceResourceCard'}],
      validation: (Rule) => Rule.max(12),
      description:
        '**Prioridad 1:** si hay al menos una tarjeta visible con título, sustituye la lista de la Experiencia para esta URL.',
    }),
  ],
})
