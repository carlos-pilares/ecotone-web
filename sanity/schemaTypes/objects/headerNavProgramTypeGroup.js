import {defineField, defineType} from 'sanity'

const EXPERIENCE_PROGRAM_TYPES = [
  {title: 'Classic Nature', value: 'nature-core'},
  {title: 'Signature Expeditions', value: 'family-adventure'},
  {title: 'Experiential Learning', value: 'experiential-learning'},
  {title: 'Tailor Made', value: 'tailor-made'},
]

/** Program column in Header → Experiences mega menu (matches Experience KC `programType`). */
export const headerNavProgramTypeGroup = defineType({
  name: 'headerNavProgramTypeGroup',
  title: 'Program group',
  type: 'object',
  fields: [
    defineField({
      name: 'programType',
      title: 'Program type',
      type: 'string',
      options: {list: EXPERIENCE_PROGRAM_TYPES},
      validation: (Rule) => Rule.required(),
      description:
        'Published experience pages whose linked Experience KC uses this program type appear in this column automatically.',
    }),
    defineField({
      name: 'label',
      title: 'Sidebar label',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Main title in the Experiences mega menu sidebar and panel eyebrow.',
    }),
    defineField({
      name: 'sidebarSubLabel',
      title: 'Sidebar sublabel',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      description:
        'Small line under the sidebar title (e.g. “3 programs”, “Custom program”). Not used in the panel card — Tailor Made panel copy uses Subtitle below.',
    }),
    defineField({
      name: 'showInMenu',
      title: 'Show in menu',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (!Number.isInteger(value)) return 'Use a whole number'
          if (value < 0 || value > 99) return 'Between 0 and 99'
          return true
        }),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Tailor Made — eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
    }),
    defineField({
      name: 'title',
      title: 'Tailor Made — title',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
    }),
    defineField({
      name: 'subtitle',
      title: 'Tailor Made — subtitle',
      type: 'string',
      validation: (Rule) => Rule.max(160),
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
    }),
    defineField({
      name: 'body',
      title: 'Tailor Made — body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Tailor Made — CTA label',
      type: 'string',
      validation: (Rule) => Rule.max(60),
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
    }),
    defineField({
      name: 'ctaSmartLink',
      title: 'Tailor Made — CTA link',
      type: 'smartLink',
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
    }),
    defineField({
      name: 'image',
      title: 'Tailor Made — card image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
      description: 'Shown on the Tailor Made card in the Experiences mega menu.',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Tailor Made — image alt (optional)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      hidden: ({parent}) => parent?.programType !== 'tailor-made',
    }),
  ],
  preview: {
    select: {programType: 'programType', label: 'label'},
    prepare: ({programType, label}) => ({
      title: label?.trim() || programType || 'Program group',
      subtitle: programType,
    }),
  },
})
