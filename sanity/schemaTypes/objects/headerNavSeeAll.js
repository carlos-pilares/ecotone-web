import {defineField, defineType} from 'sanity'

/** “See all” row in a mega menu (footer of the sidebar). */
export const headerNavSeeAll = defineType({
  name: 'headerNavSeeAll',
  title: 'Header — see all link',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show link',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off if there is no “all experiences / all lodges” page yet, or you do not want this CTA.',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      description: 'Button text. If empty, the smart link label or a site default is used.',
    }),
    defineField({
      name: 'smartLink',
      title: 'Link',
      type: 'smartLink',
      description: 'Destination. If empty when enabled, the site uses a sensible default URL.',
    }),
  ],
})
