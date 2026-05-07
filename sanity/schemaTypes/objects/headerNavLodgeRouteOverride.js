import {defineField, defineType} from 'sanity'

/** Override one route column in the Lodges mega menu (keys match lodge routes on published pages). */
export const headerNavLodgeRouteOverride = defineType({
  name: 'headerNavLodgeRouteOverride',
  title: 'Lodges menu — route override',
  type: 'object',
  fields: [
    defineField({
      name: 'routeKey',
      title: 'Route',
      type: 'string',
      options: {
        list: [
          {title: 'Camanti', value: 'camanti'},
          {title: 'Manu Road', value: 'manu-road'},
          {title: 'Manu Core', value: 'manu-core'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labelOverride',
      title: 'Label override',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Sidebar and panel eyebrow. Leave empty for the default for this route.',
    }),
    defineField({
      name: 'showInMenu',
      title: 'Show in menu',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this route column even when lodge pages exist on this route.',
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
  preview: {
    select: {title: 'routeKey', subtitle: 'labelOverride'},
    prepare({title, subtitle}) {
      return {title: title ? `Route: ${title}` : 'Route override', subtitle: subtitle || undefined}
    },
  },
})
