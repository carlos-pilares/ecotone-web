import {defineField, defineType} from 'sanity'

const imgHot = {hotspot: true}

/**
 * Banda “Tailor Made” bajo la rejilla de experiencias en `lodgePage` (no es un documento `experience`).
 */
export const lodgePageExperiencesTailorCta = defineType({
  name: 'lodgePageExperiencesTailorCta',
  title: 'Experiences — Tailor Made CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Mostrar banda Tailor Made',
      type: 'boolean',
      initialValue: false,
      description: 'Si está desactivado, la banda no aparece en el sitio (tampoco el fallback estático de la plantilla).',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (kicker)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'image',
      title: 'Imagen (opcional)',
      type: 'image',
      options: imgHot,
      description: 'Reservado para futuras ampliaciones de diseño; la banda actual puede no mostrarla.',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Texto alternativo de la imagen',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA (smart link)',
      type: 'smartLink',
      description: 'Destino del botón de la banda (p. ej. WhatsApp).',
    }),
  ],
})
