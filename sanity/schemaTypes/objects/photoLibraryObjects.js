import {defineArrayMember, defineField, defineType} from 'sanity'

const imgHot = {hotspot: true}

/** One photo in a Photo Library collection (not a standalone document). */
export const photoLibraryItem = defineType({
  name: 'photoLibraryItem',
  title: 'Photo',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: imgHot,
      validation: (Rule) =>
        Rule.custom((img) => {
          if (img?.asset?._ref) return true
          return 'Upload an image'
        }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'caption',
      title: 'Caption / description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'altText',
      title: 'Alt text',
      type: 'string',
      description: 'Accessibility; falls back to title on the site when empty.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Optional labels for editors (search/filter in Studio).',
    }),
    defineField({
      name: 'usageNotes',
      title: 'Usage notes',
      type: 'text',
      rows: 2,
      description: 'Internal notes for editors (not shown on the site).',
    }),
    defineField({
      name: 'photoCategory',
      title: 'Category (lodge collections)',
      type: 'string',
      options: {
        list: [
          {title: 'Hero', value: 'hero'},
          {title: 'Accommodation', value: 'accommodation'},
          {title: 'Common areas & amenities', value: 'commonAreasAmenities'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      initialValue: 'other',
      description:
        'Used on lodge landings for hero / facilities grouping. Ignored for General and Experience collections.',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description:
        'Turn off to archive a photo. Archived photos stay in this collection but are hidden from page pickers and the live site. Removing a row from the list only removes it from this collection — it does not delete the file from Sanity.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      caption: 'caption',
      media: 'image',
      active: 'active',
    },
    prepare({title, caption, media, active}) {
      const t = title?.trim() || caption?.trim()?.slice(0, 48) || 'Untitled photo'
      return {
        title: active === false ? `${t} (archived)` : t,
        subtitle: active === false ? 'Archived — hidden on site' : 'Active',
        media,
      }
    },
  },
})
