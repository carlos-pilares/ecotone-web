import {defineField, defineType} from 'sanity'
import {PageSectionVisibilityInput} from '../../components/pageSection/PageSectionVisibilityInput'

/** Copy opcional por sección en `lodgePage` (vacío = hereda del lodge o del front). */
export const lodgePageSectionCopy = defineType({
  name: 'lodgePageSectionCopy',
  title: 'Section copy override',
  type: 'object',
  fields: [
    defineField({
      name: 'visible',
      title: 'Show this section on the website',
      type: 'boolean',
      initialValue: true,
      components: {input: PageSectionVisibilityInput},
    }),
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
