import {defineField, defineType} from 'sanity'

/** Tailor Made row + panel (not tied to experience program types). Copy and CTA use the fields below this block in Site settings. */
export const headerNavExperiencesTailorMenu = defineType({
  name: 'headerNavExperiencesTailorMenu',
  title: 'Experiences — Tailor Made (sidebar row)',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show in menu',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'label',
      title: 'Sidebar label',
      type: 'string',
      initialValue: 'Tailor Made',
      validation: (Rule) => Rule.max(80),
    }),
  ],
})
