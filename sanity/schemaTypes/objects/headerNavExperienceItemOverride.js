import {defineField, defineType} from 'sanity'

/** Hide, relabel, or re-order one experience in the header mega menu. */
export const headerNavExperienceItemOverride = defineType({
  name: 'headerNavExperienceItemOverride',
  title: 'Experience menu — item override',
  type: 'object',
  fields: [
    defineField({
      name: 'experiencePage',
      title: 'Experience page',
      type: 'reference',
      to: [{type: 'experiencePage'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showInMenu',
      title: 'Show in menu',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this landing from the header while keeping the page published.',
    }),
    defineField({
      name: 'labelOverride',
      title: 'Title override',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      description: 'Optional. Defaults to the linked experience name.',
    }),
    defineField({
      name: 'order',
      title: 'Order in group',
      type: 'number',
      description: 'Lower numbers appear first within the program group. Leave empty to use the page’s Header order, then name.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (!Number.isInteger(value)) return 'Use a whole number'
          if (value < 0 || value > 999) return 'Between 0 and 999'
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'experiencePage.internalTitle', media: 'experiencePage.heroImage'},
    prepare({title}) {
      return {title: title || 'Experience page override'}
    },
  },
})
