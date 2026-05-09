import {defineField, defineType} from 'sanity'

export const partner = defineType({
  name: 'partner',
  title: 'Partner / certification',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Certification / badge', value: 'certification'},
          {title: 'Partner / affiliate', value: 'partner'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      initialValue: 'certification',
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo (image)',
      type: 'image',
      options: {hotspot: true},
      description: 'Prefer uploading here instead of pasting SVG, when available.',
    }),
    defineField({
      name: 'logoSvg',
      title: 'Logo SVG (legacy)',
      type: 'text',
      rows: 6,
      description: 'Raw SVG — optional if logo image is set.',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: true, scheme: ['http', 'https']}),
    }),
  ],
  orderings: [{title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', media: 'logoImage', category: 'category'},
    prepare({title, media, category}) {
      return {
        title: title || 'Partner',
        subtitle: category || undefined,
        media,
      }
    },
  },
})
