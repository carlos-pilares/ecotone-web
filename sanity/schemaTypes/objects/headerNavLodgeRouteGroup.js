import {defineField, defineType} from 'sanity'

/** One route column in the Lodges mega menu (Camanti / Manu Road / Manu Core). */
export const headerNavLodgeRouteGroup = defineType({
  name: 'headerNavLodgeRouteGroup',
  title: 'Header — lodge route group',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Shown in the mega menu sidebar and as the panel eyebrow.',
    }),
    defineField({
      name: 'enabled',
      title: 'Show in menu',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide lodges on this route from the header dropdown.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear higher in the sidebar (0–99).',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (!Number.isInteger(value)) return 'Use a whole number'
          if (value < 0 || value > 99) return 'Between 0 and 99'
          return true
        }),
    }),
  ],
})
