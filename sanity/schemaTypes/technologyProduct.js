import {defineField, defineType} from 'sanity'

export const technologyProduct = defineType({
  name: 'technologyProduct',
  title: 'Technology product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
    }),
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'Display order label, e.g. "01", "02", "03"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'badgeText',
      title: 'Badge text',
      type: 'string',
      initialValue: 'Only at Ecotone',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', sub: 'number'},
    prepare({title, sub}) {
      return {title: title || 'Untitled', subtitle: sub}
    },
  },
})
