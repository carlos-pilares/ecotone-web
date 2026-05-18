import {defineField, defineType} from 'sanity'

const PROGRAM_OPTIONS = [
  {title: 'All experiences', value: 'all'},
  {title: 'Classic Nature', value: 'nature-core'},
  {title: 'Signature Expeditions', value: 'family-adventure'},
  {title: 'Experiential Learning', value: 'experiential-learning'},
  {title: 'Tailor Made', value: 'tailor-made'},
]

/** Home experiences section — one program-type tab in display order. */
export const homeExperienceProgramGroup = defineType({
  name: 'homeExperienceProgramGroup',
  title: 'Experience program group',
  type: 'object',
  fields: [
    defineField({
      name: 'programType',
      title: 'Program type',
      type: 'string',
      options: {list: PROGRAM_OPTIONS, layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Tab label (optional)',
      type: 'string',
      description: 'Leave empty to use the default program name.',
      validation: (Rule) => Rule.max(48),
    }),
  ],
  preview: {
    select: {programType: 'programType', label: 'label'},
    prepare({programType, label}) {
      const opt = PROGRAM_OPTIONS.find((o) => o.value === programType)
      return {
        title: label?.trim() || opt?.title || programType || 'Program',
        subtitle: programType,
      }
    },
  },
})
