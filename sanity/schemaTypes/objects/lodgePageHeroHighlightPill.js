import {defineField, defineType} from 'sanity'

/** Plain text pill under the hero title (no lodge snapshot keys). */
export const lodgePageHeroHighlightPill = defineType({
  name: 'lodgePageHeroHighlightPill',
  title: 'Hero highlight',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      description: 'Short line shown as a glass pill under the hero title (max 3 pills).',
    }),
  ],
  preview: {
    select: {text: 'text'},
    prepare: ({text}) => ({
      title: (text ?? '').trim() || 'Empty',
    }),
  },
})
