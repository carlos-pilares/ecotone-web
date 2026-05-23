import {defineArrayMember, defineField, defineType} from 'sanity'

export const travellerGuideSettings = defineType({
  name: 'travellerGuideSettings',
  title: 'Traveller Guide',
  type: 'document',
  groups: [{name: 'guide', title: 'Traveller Guide', default: true}],
  fields: [
    defineField({
      name: 'travellerGuideSections',
      title: 'Traveller Guide',
      type: 'array',
      group: 'guide',
      of: [defineArrayMember({type: 'travellerGuideSection'})],
      description:
        'Central Before You Go / Traveller Guide library. Experience Pages pick which sections to show; rows inside each section are filtered by per-row applicability.',
    }),
  ],
  preview: {prepare: () => ({title: 'Traveller Guide'})},
})
