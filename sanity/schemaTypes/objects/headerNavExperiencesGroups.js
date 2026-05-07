import {defineField, defineType} from 'sanity'

export const headerNavExperiencesGroups = defineType({
  name: 'headerNavExperiencesGroups',
  title: 'Experiences mega menu — groups',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'classicNature',
      title: 'Classic Nature',
      type: 'headerNavProgramGroup',
    }),
    defineField({
      name: 'signatureExpeditions',
      title: 'Signature Expeditions',
      type: 'headerNavProgramGroup',
    }),
    defineField({
      name: 'experientialLearning',
      title: 'Experiential Learning',
      type: 'headerNavProgramGroup',
    }),
    defineField({
      name: 'tailorMade',
      title: 'Tailor Made (sidebar row)',
      type: 'headerNavProgramGroup',
      description: 'Controls the extra sidebar row that opens the Tailor Made panel (copy below).',
    }),
  ],
})
