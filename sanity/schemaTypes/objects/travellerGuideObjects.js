import {defineArrayMember, defineField, defineType} from 'sanity'

const TRAVEL_GUIDE_ROW_ICONS = [
  {title: 'Document', value: 'doc'},
  {title: 'Shield', value: 'shield'},
  {title: 'Check', value: 'check'},
  {title: 'Heart', value: 'heart'},
  {title: 'Package', value: 'package'},
  {title: 'Clock', value: 'clock'},
  {title: 'User', value: 'user'},
]

const experienceRefField = (hiddenWhenAll) =>
  defineField({
    name: 'experiences',
    title: 'Experiences',
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
    description:
      'Which Experience KC programs see this row. Ignored when “Applies to all experiences” is on.',
    hidden: ({parent}) => (hiddenWhenAll ? parent?.appliesToAll === true : false),
  })

export const travellerGuideQaRow = defineType({
  name: 'travellerGuideQaRow',
  title: 'Q&A row',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Row icon (optional)',
      type: 'string',
      options: {list: TRAVEL_GUIDE_ROW_ICONS, layout: 'dropdown'},
    }),
    defineField({
      name: 'title',
      title: 'Title / question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body / answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'appliesToAll',
      title: 'Applies to all experiences',
      type: 'boolean',
      initialValue: false,
      description:
        'When enabled, this row appears on every current and future experience that shows this section.',
    }),
    experienceRefField(true),
  ],
  preview: {
    select: {
      title: 'title',
      appliesToAll: 'appliesToAll',
      exp0: 'experiences.0.name',
      count: 'experiences',
    },
    prepare: ({title, appliesToAll, exp0, count}) => {
      const n = Array.isArray(count) ? count.length : 0
      const scope = appliesToAll
        ? 'All experiences'
        : n === 0
          ? 'No experiences'
          : n === 1
            ? exp0 || '1 experience'
            : `${n} experiences`
      return {title: title || 'Q&A row', subtitle: scope}
    },
  },
})

export const travellerGuideChecklistRow = defineType({
  name: 'travellerGuideChecklistRow',
  title: 'Checklist row',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Row icon (optional)',
      type: 'string',
      options: {list: TRAVEL_GUIDE_ROW_ICONS, layout: 'dropdown'},
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'appliesToAll',
      title: 'Applies to all experiences',
      type: 'boolean',
      initialValue: false,
    }),
    experienceRefField(true),
  ],
  preview: {
    select: {
      label: 'label',
      appliesToAll: 'appliesToAll',
      exp0: 'experiences.0.name',
      count: 'experiences',
    },
    prepare: ({label, appliesToAll, exp0, count}) => {
      const n = Array.isArray(count) ? count.length : 0
      const scope = appliesToAll
        ? 'All experiences'
        : n === 0
          ? 'No experiences'
          : n === 1
            ? exp0 || '1 experience'
            : `${n} experiences`
      return {title: label || 'Checklist row', subtitle: scope}
    },
  },
})

export const travellerGuideSection = defineType({
  name: 'travellerGuideSection',
  title: 'Traveller guide section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'cardHeaderIcon',
      title: 'Card header icon',
      type: 'string',
      initialValue: 'entry',
      options: {
        list: [
          {title: 'Entry / documents', value: 'entry'},
          {title: 'Luggage', value: 'luggage'},
          {title: 'Phone / logistics', value: 'phone'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'rowLayout',
      title: 'Row layout',
      type: 'string',
      initialValue: 'qa',
      options: {
        list: [
          {title: 'Q&A — title + body per row', value: 'qa'},
          {title: 'Checklist — label only per row', value: 'checklist'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [defineArrayMember({type: 'travellerGuideQaRow'}), defineArrayMember({type: 'travellerGuideChecklistRow'})],
      validation: (Rule) =>
        Rule.custom((rows, context) => {
          const layout = context.parent?.rowLayout
          if (!Array.isArray(rows) || rows.length === 0) {
            return 'Add at least one row.'
          }
          for (const row of rows) {
            const t = row?._type
            if (layout === 'qa' && t === 'travellerGuideChecklistRow') {
              return 'Checklist rows are not allowed when layout is Q&A. Remove them or switch layout.'
            }
            if (layout === 'checklist' && t === 'travellerGuideQaRow') {
              return 'Q&A rows are not allowed when layout is Checklist. Remove them or switch layout.'
            }
          }
          return true
        }),
      description:
        'Applicability is set per row (not per section). A section only appears on an experience when it has at least one applicable row.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      rowLayout: 'rowLayout',
      rows: 'rows',
    },
    prepare: ({title, rowLayout, rows}) => {
      const list = Array.isArray(rows) ? rows : []
      const total = list.length
      const global = list.filter((r) => r?.appliesToAll === true).length
      const layoutLabel = rowLayout === 'checklist' ? 'Checklist' : 'Q&A'
      const subtitle = [
        layoutLabel,
        `${total} row${total === 1 ? '' : 's'}`,
        global ? `${global} global` : null,
        total - global > 0 ? `${total - global} specific` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      return {title: title || 'Traveller guide section', subtitle}
    },
  },
})
