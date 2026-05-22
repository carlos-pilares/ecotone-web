import {defineArrayMember, defineField, defineType} from 'sanity'

import {validateTermsDocumentsAssignment} from '../lib/termsConditionsValidation'

export const termsConditionsSettings = defineType({
  name: 'termsConditionsSettings',
  title: 'Terms & Conditions',
  type: 'document',
  groups: [
    {name: 'terms', title: 'Terms & Conditions', default: true},
    {name: 'documents', title: 'Documents'},
  ],
  fields: [
    defineField({
      name: 'termsItems',
      title: 'Terms sections',
      type: 'array',
      group: 'terms',
      of: [defineArrayMember({type: 'termsConditionsItem'})],
      description:
        'Central accordion sections reused by Experience Pages. Each Experience Page picks which sections to show and in what order.',
    }),
    defineField({
      name: 'termsDocuments',
      title: 'Terms PDFs',
      type: 'array',
      group: 'documents',
      of: [defineArrayMember({type: 'termsConditionsDocument'})],
      description:
        'Each experience may have one applicable PDF. A specific assignment overrides the global PDF. Experiences with a specific PDF are not covered only by the global PDF.',
      validation: (Rule) =>
        Rule.custom((documents) => validateTermsDocumentsAssignment(documents)),
    }),
  ],
  preview: {prepare: () => ({title: 'Terms & Conditions'})},
})
