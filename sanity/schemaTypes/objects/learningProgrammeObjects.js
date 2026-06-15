import {defineField, defineType} from 'sanity'

const LEARNING_OUTCOME_ICON_OPTIONS = [
  {title: 'Research', value: 'research'},
  {title: 'Wildlife', value: 'wildlife'},
  {title: 'Conservation', value: 'conservation'},
  {title: 'Community', value: 'community'},
  {title: 'Leadership', value: 'leadership'},
  {title: 'Teamwork', value: 'teamwork'},
  {title: 'Data', value: 'data'},
  {title: 'Communication', value: 'communication'},
  {title: 'Career', value: 'career'},
  {title: 'Fieldwork', value: 'fieldwork'},
]

export const learningProgrammeStep = defineType({
  name: 'learningProgrammeStep',
  title: 'Programme step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'label',
      title: 'Eyebrow / label',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(600),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'label'},
    prepare: ({title, subtitle}) => ({
      title: title || 'Step',
      subtitle,
    }),
  },
})

export const learningProgrammeTypicalDayRow = defineType({
  name: 'learningProgrammeTypicalDayRow',
  title: 'Typical day row',
  type: 'object',
  fields: [
    defineField({
      name: 'timeLabel',
      title: 'Time label',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(40)],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'timeLabel'},
    prepare: ({title, subtitle}) => ({title: title || 'Row', subtitle}),
  },
})

export const learningProgrammeProject = defineType({
  name: 'learningProgrammeProject',
  title: 'Project',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => [Rule.required(), Rule.max(220)],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'iconKey',
      title: 'Icon key (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'tag',
      title: 'Tag (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
    prepare: ({title, media}) => ({title: title || 'Project', media}),
  },
})

export const learningProgrammeMentor = defineType({
  name: 'learningProgrammeMentor',
  title: 'Mentor / programme lead',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'role',
      title: 'Role / position',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'biography',
      title: 'Short biography',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.max(1200),
    }),
    defineField({
      name: 'achievements',
      title: 'Key achievements',
      type: 'array',
      of: [{type: 'string', validation: (Rule) => Rule.max(120)}],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'skills',
      title: 'Skills & experience',
      type: 'array',
      of: [{type: 'string', validation: (Rule) => Rule.max(80)}],
      validation: (Rule) => Rule.max(12),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Mentor',
      subtitle: subtitle || 'Programme lead',
      media,
    }),
  },
})

export const learningProgrammeApplicationStep = defineType({
  name: 'learningProgrammeApplicationStep',
  title: 'Application step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Step title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'description',
      title: 'Step description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
    prepare: ({title, subtitle}) => ({
      title: title || 'Step',
      subtitle: subtitle ? `${subtitle.slice(0, 60)}…` : '',
    }),
  },
})

export const learningProgrammeOutcome = defineType({
  name: 'learningProgrammeOutcome',
  title: 'Learning outcome',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => [Rule.required(), Rule.max(280)],
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: LEARNING_OUTCOME_ICON_OPTIONS, layout: 'dropdown'},
      initialValue: 'research',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description', icon: 'icon'},
    prepare: ({title, subtitle, icon}) => ({
      title: title || 'Outcome',
      subtitle: [icon, subtitle ? `${subtitle.slice(0, 60)}…` : ''].filter(Boolean).join(' · '),
    }),
  },
})
