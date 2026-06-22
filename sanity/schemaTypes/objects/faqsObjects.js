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

const learningProgrammeRefField = (hiddenWhenAll) =>
  defineField({
    name: 'learningProgrammes',
    title: 'Learning programmes',
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'learningProgramme'}]})],
    description:
      'Select which Learning Programme documents receive this FAQ. Ignored when “Applies to all experiences” is on.',
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
    learningProgrammeRefField(true),
  ],
  preview: {
    select: {
      title: 'title',
      appliesToAll: 'appliesToAll',
      exp0: 'experiences.0.name',
      exp1: 'experiences.1.name',
      expCount: 'experiences',
      lp0: 'learningProgrammes.0.title',
      lp1: 'learningProgrammes.1.title',
      lpCount: 'learningProgrammes',
    },
    prepare: ({title, appliesToAll, exp0, exp1, expCount, lp0, lp1, lpCount}) => {
      if (appliesToAll) {
        return {title: title || 'FAQ', subtitle: 'All experiences'}
      }
      const expN = Array.isArray(expCount) ? expCount.length : 0
      const lpN = Array.isArray(lpCount) ? lpCount.length : 0
      const parts = []
      if (expN > 0) {
        if (expN === 1) parts.push(exp0 || '1 experience')
        else parts.push(`${exp0 || 'Experience'}, ${exp1 || '…'} +${expN - 2} more`)
      }
      if (lpN > 0) {
        let lpLabel = ''
        if (lpN === 1) lpLabel = lp0 || '1 learning programme'
        else lpLabel = `${lp0 || 'Programme'}, ${lp1 || '…'} +${lpN - 2} more`
        parts.push(`Learning programmes: ${lpLabel}`)
      }
      const subtitle = parts.length ? parts.join(' · ') : 'No experiences selected'
      return {title: title || 'FAQ', subtitle}
    },
  },
})
