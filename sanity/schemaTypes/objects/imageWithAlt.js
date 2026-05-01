import {defineField, defineType} from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image with alt',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required().max(200)}),
    defineField({name: 'title', title: 'Title (optional)', type: 'string', validation: (r) => r.max(120)}),
    defineField({name: 'caption', title: 'Caption (optional)', type: 'string', validation: (r) => r.max(200)}),
  ],
  preview: {select: {alt: 'alt', media: 'image'}, prepare: ({alt, media}) => ({title: alt || 'Image', media})},
})
