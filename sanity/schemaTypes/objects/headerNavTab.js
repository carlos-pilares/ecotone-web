import {defineField, defineType} from 'sanity'

const DROPDOWN_TYPES = [
  {title: 'None (simple link)', value: 'none'},
  {title: 'Experiences mega menu', value: 'experiences'},
  {title: 'Lodges mega menu', value: 'lodges'},
]

/** One top-level header navigation tab (order = array order). */
export const headerNavTab = defineType({
  name: 'headerNavTab',
  title: 'Header tab',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'showInHeader',
      title: 'Show in header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'smartLink',
      title: 'Link',
      type: 'smartLink',
      description: 'Used when “Has dropdown” is off — simple top-nav link.',
    }),
    defineField({
      name: 'hasDropdown',
      title: 'Has dropdown',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'dropdownType',
      title: 'Dropdown type',
      type: 'string',
      options: {list: DROPDOWN_TYPES, layout: 'radio'},
      initialValue: 'none',
      hidden: ({parent}) => !parent?.hasDropdown,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const p = context.parent
          if (!p?.hasDropdown) return true
          if (!value) return 'Choose a dropdown type'
          return true
        }),
    }),
    defineField({
      name: 'showSeeAll',
      title: 'Show “see all” in dropdown sidebar',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => !parent?.hasDropdown,
    }),
    defineField({
      name: 'seeAllLabel',
      title: 'See all — label',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      hidden: ({parent}) => !parent?.hasDropdown || !parent?.showSeeAll,
    }),
    defineField({
      name: 'seeAllSmartLink',
      title: 'See all — link',
      type: 'smartLink',
      hidden: ({parent}) => !parent?.hasDropdown || !parent?.showSeeAll,
    }),
    defineField({
      name: 'experiencesDropdown',
      title: 'Experiences dropdown config',
      type: 'headerNavExperiencesDropdown',
      hidden: ({parent}) => !parent?.hasDropdown || parent?.dropdownType !== 'experiences',
    }),
    defineField({
      name: 'lodgesDropdown',
      title: 'Lodges dropdown config',
      type: 'headerNavLodgesDropdown',
      hidden: ({parent}) => !parent?.hasDropdown || parent?.dropdownType !== 'lodges',
    }),
  ],
  preview: {
    select: {label: 'label', show: 'showInHeader', hasDropdown: 'hasDropdown', dropdownType: 'dropdownType'},
    prepare: ({label, show, hasDropdown, dropdownType}) => ({
      title: label || 'Tab',
      subtitle: [
        show === false ? 'hidden' : 'visible',
        hasDropdown ? dropdownType || 'dropdown' : 'link',
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
