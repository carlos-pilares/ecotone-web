import {defineField, defineType} from 'sanity'

/** Override one program column in the Experiences mega menu (keys match grouped experience pages). */
export const headerNavExperienceGroupOverride = defineType({
  name: 'headerNavExperienceGroupOverride',
  title: 'Experience menu — group override',
  type: 'object',
  fields: [
    defineField({
      name: 'groupKey',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          {title: 'Classic Nature (nature-core)', value: 'classic'},
          {title: 'Signature Expeditions (family-adventure)', value: 'signature'},
          {title: 'Experiential Learning (experiential-learning)', value: 'learning'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labelOverride',
      title: 'Label override',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Shown in the sidebar and panel eyebrow. Leave empty for the default label for this group.',
    }),
    defineField({
      name: 'showInMenu',
      title: 'Show in menu',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this column even when experience pages exist in this group.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear higher in the sidebar (0–99).',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (!Number.isInteger(value)) return 'Use a whole number'
          if (value < 0 || value > 99) return 'Between 0 and 99'
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'groupKey', subtitle: 'labelOverride'},
    prepare({title, subtitle}) {
      return {title: title ? `Group: ${title}` : 'Group override', subtitle: subtitle || undefined}
    },
  },
})
