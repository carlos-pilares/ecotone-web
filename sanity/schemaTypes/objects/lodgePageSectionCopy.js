import {defineField, defineType} from 'sanity'

/** Copy opcional por sección en `lodgePage` (vacío = hereda del lodge o del front). */
export const lodgePageSectionCopy = defineType({
  name: 'lodgePageSectionCopy',
  title: 'Section copy override',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.max(4000),
    }),
  ],
})
