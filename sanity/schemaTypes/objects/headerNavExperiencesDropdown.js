import {defineField, defineType} from 'sanity'

/** Experiences mega menu config (nested under a header nav tab). */
export const headerNavExperiencesDropdown = defineType({
  name: 'headerNavExperiencesDropdown',
  title: 'Experiences dropdown',
  type: 'object',
  fields: [
    defineField({
      name: 'sideMenuTitle',
      title: 'Side menu title',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'programGroups',
      title: 'Program groups',
      type: 'array',
      of: [{type: 'headerNavProgramTypeGroup'}],
      description:
        'Sidebar columns. Published experience pages appear automatically by Experience KC `programType`. Tailor Made row supports custom panel copy.',
    }),
  ],
})
