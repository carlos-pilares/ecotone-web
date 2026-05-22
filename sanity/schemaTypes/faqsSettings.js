import {defineArrayMember, defineField, defineType} from 'sanity'

export const faqsSettings = defineType({
  name: 'faqsSettings',
  title: 'FAQs',
  type: 'document',
  groups: [{name: 'faqs', title: 'FAQs', default: true}],
  fields: [
    defineField({
      name: 'faqItems',
      title: 'FAQs',
      type: 'array',
      group: 'faqs',
      of: [defineArrayMember({type: 'faqItem'})],
      description:
        'Central FAQ library. Experience Pages pick which items to show and in what order. Global FAQs apply to all experiences; others apply only to assigned Experience KC programs.',
    }),
  ],
  preview: {prepare: () => ({title: 'FAQs'})},
})
