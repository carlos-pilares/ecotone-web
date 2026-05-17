import {defineField, defineType} from 'sanity'

/** Optional label/order/visibility for a Route column in the Lodges mega menu. */
export const headerNavRouteGroupOverride = defineType({
  name: 'headerNavRouteGroupOverride',
  title: 'Route group override',
  type: 'object',
  fields: [
    defineField({
      name: 'route',
      title: 'Route',
      type: 'reference',
      to: [{type: 'route'}],
      validation: (Rule) => Rule.required(),
      description: 'Lodges are grouped by Lodge KC → route; this only customizes the column label and order.',
    }),
    defineField({
      name: 'labelOverride',
      title: 'Column label override',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'showInMenu',
      title: 'Show column',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
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
    select: {routeName: 'route.name', label: 'labelOverride'},
    prepare: ({routeName, label}) => ({
      title: label?.trim() || routeName || 'Route group',
      subtitle: routeName,
    }),
  },
})
