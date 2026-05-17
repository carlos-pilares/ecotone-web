import {defineField, defineType} from 'sanity'

/** Lodges mega menu config (nested under a header nav tab). */
export const headerNavLodgesDropdown = defineType({
  name: 'headerNavLodgesDropdown',
  title: 'Lodges dropdown',
  type: 'object',
  fields: [
    defineField({
      name: 'sideMenuTitle',
      title: 'Side menu title',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
  ],
  description:
    'Route columns come from Route documents; lodges are grouped by Lodge KC route. No manual lodge assignment here.',
})
