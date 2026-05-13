import {defineField, defineType} from 'sanity'

const imgHot = {hotspot: true}

/**
 * “Tailor Made” band below the experience cards on `lodgePage`.
 * Legacy field names (`enabled`, `eyebrow`, …) remain for older documents; resolver prefers the `tailorMade*` fields.
 */
export const lodgePageExperiencesTailorCta = defineType({
  name: 'lodgePageExperiencesTailorCta',
  title: 'Experiences — Tailor Made',
  type: 'object',
  fields: [
    defineField({
      name: 'showTailorMade',
      title: 'Show Tailor Made band',
      type: 'boolean',
      initialValue: false,
      description: 'When off, the Tailor Made module is hidden on the public lodge page.',
    }),
    defineField({
      name: 'tailorMadeEyebrow',
      title: 'Tailor Made — eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'tailorMadeTitle',
      title: 'Tailor Made — title',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'tailorMadeBody',
      title: 'Tailor Made — body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'tailorMadeCta',
      title: 'Tailor Made — CTA (smart link)',
      type: 'smartLink',
      description: 'Destination for the Tailor Made button.',
    }),
    defineField({
      name: 'image',
      title: 'Image (optional, reserved)',
      type: 'image',
      options: imgHot,
      hidden: true,
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'enabled',
      title: 'Show band (legacy)',
      type: 'boolean',
      hidden: true,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow / kicker (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy)',
      type: 'text',
      hidden: true,
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'CTA smart link (legacy)',
      type: 'smartLink',
      hidden: true,
    }),
  ],
})
