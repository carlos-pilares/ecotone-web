import {defineField, defineType} from 'sanity'
import {FacilitiesAmenitySelectInput} from '../../components/lodgePage/FacilitiesAmenitySelectInput'
import {FacilitiesGalleryPhotoPickPreview} from '../../components/lodgePage/FacilitiesGalleryPhotoPickPreview'
import {FacilitiesGalleryPhotoSelectInput} from '../../components/lodgePage/FacilitiesGalleryPhotoSelectInput'
import {LodgeAmenityPickPreview} from '../../components/lodgePage/LodgeAmenityPickPreview'
import {LODGE_PAGE_NAV_TARGETS} from '../../lib/lodgePageNavTargets'

export const lodgePageHighlightLine = defineType({
  name: 'lodgePageHighlightLine',
  title: 'Highlight line',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare: ({title, subtitle}) => ({title: title || 'Highlight', subtitle}),
  },
})

export const lodgePageNavItem = defineType({
  name: 'lodgePageNavItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'targetSection',
      title: 'Target section',
      type: 'string',
      options: {list: LODGE_PAGE_NAV_TARGETS, layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionId',
      title: 'Target section id (legacy)',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.max(80),
    }),
  ],
  preview: {
    select: {label: 'label', targetSection: 'targetSection', sectionId: 'sectionId'},
    prepare: ({label, targetSection, sectionId}) => ({
      title: label,
      subtitle: targetSection || sectionId ? `#${targetSection || sectionId}` : '',
    }),
  },
})

export const lodgeGalleryStableKeyPick = defineType({
  name: 'lodgeGalleryStableKeyPick',
  title: 'Facilities photo',
  type: 'object',
  preview: {
    select: {
      galleryRowKey: 'galleryRowKey',
      galleryStableKey: 'galleryStableKey',
    },
    prepare({galleryRowKey, galleryStableKey}) {
      return {
        galleryRowKey: typeof galleryRowKey === 'string' ? galleryRowKey : '',
        galleryStableKey: typeof galleryStableKey === 'string' ? galleryStableKey : '',
      }
    },
  },
  components: {
    preview: FacilitiesGalleryPhotoPickPreview,
  },
  fields: [
    defineField({
      name: 'galleryRowKey',
      title: 'Photo',
      type: 'string',
      components: {input: FacilitiesGalleryPhotoSelectInput},
      description: 'Choose from the linked lodge photo library. Drag rows to set order.',
    }),
    defineField({
      name: 'galleryStableKey',
      title: 'Gallery stable key (legacy)',
      type: 'string',
      hidden: true,
      description: 'Legacy key; the site still resolves it when Photo above is empty.',
    }),
  ],
})

export const lodgeAmenityIconPick = defineType({
  name: 'lodgeAmenityIconPick',
  title: 'Amenity pick',
  type: 'object',
  preview: {
    select: {
      amenityRowKey: 'amenityRowKey',
      amenityIcon: 'amenityIcon',
    },
    prepare({amenityRowKey, amenityIcon}) {
      return {
        amenityRowKey: typeof amenityRowKey === 'string' ? amenityRowKey : '',
        amenityIcon: typeof amenityIcon === 'string' ? amenityIcon : '',
      }
    },
  },
  components: {
    preview: LodgeAmenityPickPreview,
  },
  fields: [
    defineField({
      name: 'amenityRowKey',
      title: 'Amenity',
      type: 'string',
      components: {input: FacilitiesAmenitySelectInput},
      description: 'Choose from the linked lodge knowledge center list. Reorder rows with drag and drop.',
    }),
    defineField({
      name: 'amenityIcon',
      title: 'Amenity icon (legacy)',
      type: 'string',
      hidden: true,
      description: 'Legacy manual key; the site still resolves it when Amenity above is empty.',
    }),
  ],
})

export const lodgeScienceSpecialText = defineType({
  name: 'lodgeScienceSpecialText',
  title: 'Science special text',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Shield', value: 'shield'},
          {title: 'Check', value: 'check'},
          {title: 'Heart', value: 'heart'},
          {title: 'Leaf', value: 'leaf'},
          {title: 'Star', value: 'star'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(800),
    }),
  ],
  preview: {
    select: {text: 'text', iconKey: 'iconKey'},
    prepare: ({text, iconKey}) => ({title: text || 'Special text', subtitle: iconKey}),
  },
})

export const lodgePageFaqItem = defineType({
  name: 'lodgePageFaqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(2000),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'FAQ'}),
  },
})
