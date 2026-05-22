import {defineArrayMember, defineField, defineType} from 'sanity'

const experienceRefField = (hiddenWhenAll) =>
  defineField({
    name: 'experiences',
    title: 'Experiences',
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
    description:
      'Select which Experience Knowledge Center programs receive this FAQ. Ignored when “Applies to all experiences” is on.',
    hidden: ({parent}) => (hiddenWhenAll ? parent?.appliesToAll === true : false),
  })

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 8,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'appliesToAll',
      title: 'Applies to all experiences',
      type: 'boolean',
      initialValue: false,
      description:
        'When enabled, this FAQ is available on every current and future experience (unless hidden on the Experience Page picker).',
    }),
    experienceRefField(true),
  ],
  preview: {
    select: {
      title: 'title',
      appliesToAll: 'appliesToAll',
      exp0: 'experiences.0.name',
      exp1: 'experiences.1.name',
      count: 'experiences',
    },
    prepare: ({title, appliesToAll, exp0, exp1, count}) => {
      const n = Array.isArray(count) ? count.length : 0
      let subtitle = appliesToAll ? 'All experiences' : ''
      if (!appliesToAll) {
        if (n === 0) subtitle = 'No experiences selected'
        else if (n === 1) subtitle = exp0 || '1 experience'
        else subtitle = `${exp0 || 'Experience'}, ${exp1 || '…'} +${n - 2} more`
      }
      return {title: title || 'FAQ', subtitle}
    },
  },
})
