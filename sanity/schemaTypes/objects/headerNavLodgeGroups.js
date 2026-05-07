import {defineField, defineType} from 'sanity'

export const headerNavLodgeGroups = defineType({
  name: 'headerNavLodgeGroups',
  title: 'Lodges mega menu — routes',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'camanti',
      title: 'Camanti',
      type: 'headerNavLodgeRouteGroup',
    }),
    defineField({
      name: 'manuRoad',
      title: 'Manu Road',
      type: 'headerNavLodgeRouteGroup',
    }),
    defineField({
      name: 'manuCore',
      title: 'Manu Core',
      type: 'headerNavLodgeRouteGroup',
    }),
  ],
})
