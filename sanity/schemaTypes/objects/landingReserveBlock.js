import {defineField, defineType} from 'sanity'

/**
 * Bloque #book (Reserve your spot) — overrides opcionales solo de esta URL.
 * El sitio combina: Experiencia (producto) + hero de esta landing (pageHero) + esto si hay valores.
 * No duplica términos legales largos: enlace a la sección Terms.
 */
export const landingReserveBlock = defineType({
  name: 'landingReserveBlock',
  title: 'Bloque reserva (override de landing)',
  type: 'object',
  description:
    '**Override de esta landing.** Vacío en un subcampo = se conserva el valor mostrado en «Actual en la web» en la misma pestaña.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (p. ej. «Reserve your spot»)',
      type: 'string',
      validation: (r) => r.max(100),
      description: 'Vacío = usa el eyebrow de «Actual en la web».',
    }),
    defineField({
      name: 'headline',
      title: 'Headline (H2 del bloque)',
      type: 'string',
      validation: (r) => r.max(120),
      description: 'Vacío = usa el headline de «Actual en la web».',
    }),
    defineField({
      name: 'price',
      title: 'Precio (línea principal)',
      type: 'string',
      validation: (r) => r.max(40),
      description: 'Vacío = usa la línea de precio resuelta arriba.',
    }),
    defineField({
      name: 'priceNote',
      title: 'Nota de precio (p. ej. «/ person»)',
      type: 'string',
      validation: (r) => r.max(40),
      description: 'Vacío = usa la nota de precio de «Actual en la web».',
    }),
    defineField({
      name: 'priceSub',
      title: 'Subtítulo bajo el precio (p. ej. all inclusive, Cusco…)',
      type: 'string',
      validation: (r) => r.max(120),
      description: 'Vacío = usa el subtítulo de «Actual en la web».',
    }),
    defineField({
      name: 'infoRows',
      title: 'Filas informativas (etiqueta / valor)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'reserveInfoRow',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Etiqueta', validation: (r) => r.max(60)}),
            defineField({name: 'value', type: 'string', title: 'Valor', validation: (r) => r.max(120)}),
          ],
        },
      ],
      validation: (r) => r.max(10),
      description: 'Array vacío = se mantienen las filas informativas de «Actual en la web».',
    }),
    defineField({
      name: 'wetravelUrl',
      title: 'URL CTA principal (WeTravel u otro)',
      type: 'url',
      description: 'Vacío = URL del CTA en «Actual en la web».',
    }),
    defineField({
      name: 'wetravelLabel',
      title: 'Texto CTA principal',
      type: 'string',
      validation: (r) => r.max(80),
      description: 'Vacío = texto del CTA de «Actual en la web».',
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'URL WhatsApp',
      type: 'url',
      description: 'Vacío = enlace WhatsApp de «Actual en la web».',
    }),
    defineField({
      name: 'whatsappLabel',
      title: 'Texto botón WhatsApp',
      type: 'string',
      validation: (r) => r.max(60),
      description: 'Vacío = etiqueta WhatsApp de «Actual en la web».',
    }),
    defineField({
      name: 'legalNote',
      title: 'Texto legal (antes del enlace a términos)',
      type: 'text',
      rows: 2,
      description: 'P. ej. «By booking, you agree to our». Vacío = texto legal de «Actual en la web».',
    }),
    defineField({
      name: 'legalTermsLink',
      title: 'Ancla o URL de términos (p. ej. #terms)',
      type: 'string',
      description: 'Vacío = ancla/URL de términos de «Actual en la web».',
    }),
  ],
})
