import {defineField, defineType} from 'sanity'

/** One cell in the Experience page stats/snapshot bar (title + subtitle). */
export const experienceSnapshotHighlight = defineType({
  name: 'experienceSnapshotHighlight',
  title: 'Snapshot highlight',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(40)],
      description: 'Primary line (e.g. “4D · 3N”, “All-in”, “Max 8”).',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => [Rule.required(), Rule.max(40)],
      description: 'Label under the title (e.g. “Duration”, “From Cusco”, “Group size”).',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare: ({title, subtitle}) => ({
      title: (title && String(title).trim()) || 'Snapshot highlight',
      subtitle: (subtitle && String(subtitle).trim()) || '',
    }),
  },
})
