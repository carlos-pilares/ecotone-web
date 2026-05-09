import {defineField, defineType} from 'sanity'

const SOURCE_FIELD_OPTIONS = [
  {title: 'Route', value: 'route'},
  {title: 'Duration', value: 'duration'},
  {title: 'Group size', value: 'groupSize'},
  {title: 'Pickup — time window (short)', value: 'pickupTime'},
  {title: 'Pickup — location / meet point (short)', value: 'pickupLocation'},
  {title: 'Pickup — summary (distance + short title, no long copy)', value: 'pickupSummary'},
  {title: 'Includes (first items)', value: 'includes'},
  {title: 'Price', value: 'price'},
  {title: 'Program type', value: 'programType'},
  {title: 'Difficulty (when available on experience)', value: 'difficulty'},
  {title: 'Custom (manual label + value)', value: 'custom'},
]

/**
 * One row for the Experience landing reserve card: bind to structured experience data
 * or override label/value. Used only when `reserveCtaSettings` is on an `experiencePage`.
 */
export const experienceReserveCardRow = defineType({
  name: 'experienceReserveCardRow',
  title: 'Reserve card row',
  type: 'object',
  fields: [
    defineField({
      name: 'sourceField',
      title: 'Source field',
      type: 'string',
      options: {list: SOURCE_FIELD_OPTIONS, layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labelOverride',
      title: 'Label override (optional)',
      type: 'string',
      description: 'Replaces the default label for this source (e.g. “Pickup time”).',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'valueOverride',
      title: 'Value override (optional)',
      type: 'string',
      description: 'Replaces the value from the experience. Use for short pickup lines.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'show',
      title: 'Show row',
      type: 'boolean',
      description: 'Turn off to hide this row without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'orderRank',
      title: 'Order (optional)',
      type: 'number',
      description: 'Lower numbers appear first. If empty, list order in the CMS is used.',
    }),
  ],
  preview: {
    select: {sourceField: 'sourceField', labelOverride: 'labelOverride', valueOverride: 'valueOverride', show: 'show'},
    prepare: ({sourceField, labelOverride, valueOverride, show}) => ({
      title: labelOverride?.trim() || sourceField || '—',
      subtitle: [show === false ? 'hidden' : null, valueOverride?.trim() || `← ${sourceField || ''}`]
        .filter(Boolean)
        .join(' · '),
    }),
  },
  validation: (Rule) =>
    Rule.custom((row) => {
      if (!row || typeof row !== 'object') return true
      if (row.sourceField !== 'custom') return true
      const l = typeof row.labelOverride === 'string' ? row.labelOverride.trim() : ''
      const v = typeof row.valueOverride === 'string' ? row.valueOverride.trim() : ''
      if (l && v) return true
      return 'Custom rows need both label override and value override'
    }),
})
