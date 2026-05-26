import {defineArrayMember, defineField, defineType} from 'sanity'

const COLLECTION_TYPES = [
  {title: 'General', value: 'general'},
  {title: 'Lodge', value: 'lodge'},
  {title: 'Experience', value: 'experience'},
]

export const photoCollection = defineType({
  name: 'photoCollection',
  title: 'Photo collection',
  type: 'document',
  description:
    'Central photo library folder. Upload once, then pick photos on lodge and experience pages. One lodge collection per lodge; one experience collection per program family (all duration variants).',
  groups: [
    {name: 'meta', title: 'Collection', default: true},
    {name: 'photos', title: 'Photos'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Collection title',
      type: 'string',
      group: 'meta',
      validation: (Rule) => Rule.required().max(160),
      description: 'e.g. "Soqtapata Lodge" or "Soqtapata Immersive Experience".',
    }),
    defineField({
      name: 'collectionType',
      title: 'Type',
      type: 'string',
      group: 'meta',
      options: {list: COLLECTION_TYPES, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lodgeRef',
      title: 'Lodge',
      type: 'reference',
      to: [{type: 'lodge'}],
      group: 'meta',
      hidden: ({document}) => document?.collectionType !== 'lodge',
      validation: (Rule) =>
        Rule.custom((ref, context) => {
          if (context.document?.collectionType !== 'lodge') return true
          if (ref?._ref) return true
          return 'Select the lodge this collection belongs to'
        }),
      description: 'One collection per lodge knowledge center.',
    }),
    defineField({
      name: 'experienceFamilyName',
      title: 'Experience family name',
      type: 'string',
      group: 'meta',
      hidden: ({document}) => document?.collectionType !== 'experience',
      validation: (Rule) =>
        Rule.custom((name, context) => {
          if (context.document?.collectionType !== 'experience') return true
          const label = (name ?? '').trim()
          const refs = context.document?.experienceRefs
          if (label || (Array.isArray(refs) && refs.length > 0)) return true
          return 'Add a family name and/or link at least one Experience KC variant'
        }),
      description:
        'Display label for editors (e.g. "Soqtapata Immersive Experience"). One collection for all duration variants.',
    }),
    defineField({
      name: 'experienceRefs',
      title: 'Experience KC variants',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
      hidden: ({document}) => document?.collectionType !== 'experience',
      validation: (Rule) =>
        Rule.custom((refs, context) => {
          if (context.document?.collectionType !== 'experience') return true
          const label = (context.document?.experienceFamilyName ?? '').trim()
          if (label || (Array.isArray(refs) && refs.length > 0)) return true
          return 'Link at least one Experience KC or set a family name'
        }),
      description:
        'Link every Experience KC document in this family (3D/2N, 4D/3N, etc.) so landings can share one library.',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      group: 'photos',
      of: [defineArrayMember({type: 'photoLibraryItem'})],
      options: {
        layout: 'grid',
      },
      description:
        'Drag to reorder. Remove a row to take it out of this collection only (the image file stays in Sanity until deleted from the media browser). Archive instead of delete when unsure.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      collectionType: 'collectionType',
      lodgeName: 'lodgeRef.name',
      family: 'experienceFamilyName',
      photoCount: 'photos',
    },
    prepare({title, collectionType, lodgeName, family, photoCount}) {
      const count = Array.isArray(photoCount) ? photoCount.length : 0
      const typeLabel =
        collectionType === 'lodge'
          ? `Lodge · ${lodgeName || '—'}`
          : collectionType === 'experience'
            ? `Experience · ${family || '—'}`
            : 'General'
      return {
        title: title || 'Untitled collection',
        subtitle: `${typeLabel} · ${count} photo${count === 1 ? '' : 's'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
