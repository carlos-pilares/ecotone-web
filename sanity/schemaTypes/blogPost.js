import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * On-site editorial: `/journal/[slug]`. Legacy `externalLink` still supported for off-site teasers.
 */
export const blogPost = defineType({
  name: 'blogPost',
  title: 'Journal article',
  type: 'document',
  groups: [
    {name: 'editorial', title: 'Editorial', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'content', title: 'Body'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'editorial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (on-site URL)',
      type: 'slug',
      group: 'editorial',
      options: {source: 'title', maxLength: 96},
      description: 'Required for articles on `/journal/[slug]`. Leave empty only for pure external teasers.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / subtitle',
      type: 'text',
      rows: 3,
      group: 'editorial',
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      group: 'editorial',
      options: {hotspot: true},
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'editorial',
    }),
    defineField({
      name: 'author',
      title: 'Author (optional)',
      type: 'string',
      group: 'editorial',
    }),
    defineField({
      name: 'readingMinutes',
      title: 'Read time (minutes)',
      type: 'number',
      group: 'editorial',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'category',
      title: 'Category / primary tag',
      type: 'string',
      group: 'editorial',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'editorial',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Journal index',
      type: 'boolean',
      group: 'editorial',
      initialValue: false,
    }),
    defineField({
      name: 'externalLink',
      title: 'External link (optional)',
      type: 'url',
      group: 'editorial',
      description: 'If the card should open an external site instead of `/journal/[slug]`, set this. On-site articles should use slug above.',
      validation: (Rule) =>
        Rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Article body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'journalBlockRichText'}),
        defineArrayMember({type: 'journalBlockImage'}),
        defineArrayMember({type: 'journalBlockGallery'}),
        defineArrayMember({type: 'journalBlockVideoEmbed'}),
        defineArrayMember({type: 'journalBlockQuote'}),
        defineArrayMember({type: 'journalBlockDivider'}),
        defineArrayMember({type: 'journalBlockCta'}),
        defineArrayMember({type: 'journalBlockRelatedExperience'}),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published, newest',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', category: 'category', featured: 'featured'},
    prepare({title, date, category, featured}) {
      return {
        title: featured ? `★ ${title || 'Untitled'}` : title || 'Untitled',
        subtitle: [category, date && new Date(date).toLocaleDateString()].filter(Boolean).join(' · '),
      }
    },
  },
})
