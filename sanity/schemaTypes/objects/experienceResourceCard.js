import {defineField, defineType} from 'sanity'

const RESOURCE_TYPES = [
  {title: 'Mapa', value: 'map'},
  {title: 'Brochure', value: 'brochure'},
  {title: 'Terms & Conditions (central CK)', value: 'termsConditions'},
  {title: 'Terms PDF (central CK, legacy value)', value: 'termsPdf'},
  {title: 'Términos / PDF legal (legacy)', value: 'terms'},
  {title: 'Personalizado', value: 'custom'},
]

const VISUAL_PRESETS = [
  {title: 'Automático (según tipo)', value: 'auto'},
  {title: 'Preview tipo mapa', value: 'map'},
  {title: 'Preview tipo brochure', value: 'brochure'},
  {title: 'Preview tipo documento', value: 'terms'},
  {title: 'Preview neutro (documento)', value: 'custom'},
]

export const experienceResourceCard = defineType({
  name: 'experienceResourceCard',
  title: 'Tarjeta de recurso',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(120)],
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo / descripción (línea meta)',
      type: 'text',
      rows: 3,
      description: 'Aparece bajo el título en la tarjeta (ej. formato PDF, tamaño). Máx 220 caracteres.',
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'resourceType',
      title: 'Tipo de recurso',
      type: 'string',
      options: {list: RESOURCE_TYPES, layout: 'radio'},
      initialValue: 'custom',
      validation: (Rule) => Rule.required(),
      description:
        '“Terms & Conditions (central CK)” uses the applicable PDF from Content Library → Terms & Conditions (no upload here).',
    }),
    defineField({
      name: 'visualPreset',
      title: 'Plantilla visual sin imagen',
      type: 'string',
      description: 'Si no subes imagen, define qué ilustración de marca usar (o “Automático” para seguir el tipo).',
      options: {list: VISUAL_PRESETS},
      initialValue: 'auto',
    }),
    defineField({
      name: 'previewImage',
      title: 'Imagen de preview (opcional)',
      type: 'imageWithAlt',
      description: 'Si existe, sustituye la plantilla gráfica superior de la tarjeta.',
    }),
    defineField({
      name: 'fileUrl',
      title: 'URL del archivo (enlace externo)',
      type: 'url',
      description: 'Drive, Dropbox, PDF público, etc. Usar si no subes PDF a Sanity.',
      hidden: ({parent}) =>
        parent?.resourceType === 'termsPdf' || parent?.resourceType === 'termsConditions',
    }),
    defineField({
      name: 'file',
      title: 'PDF en Sanity (opcional)',
      type: 'file',
      options: {accept: 'application/pdf'},
      description: 'Prioridad sobre la URL si ambos existen.',
      hidden: ({parent}) =>
        parent?.resourceType === 'termsPdf' || parent?.resourceType === 'termsConditions',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Texto del botón de descarga',
      type: 'string',
      validation: (Rule) => [Rule.max(80)],
    }),
    defineField({
      name: 'visible',
      title: 'Visible en la web',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Menor número = primero. Vacío = al final.',
    }),
  ],
  preview: {
    select: {title: 'title', type: 'resourceType', media: 'previewImage.image'},
    prepare: ({title, type, media}) => ({
      title: title || 'Recurso',
      subtitle: type,
      media,
    }),
  },
})
