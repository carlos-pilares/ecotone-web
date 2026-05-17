import {defineField, defineType} from 'sanity'
import {FacilitiesGalleryPhotoSelectInput} from '../components/lodgePage/FacilitiesGalleryPhotoSelectInput'
import {LodgeHeroGalleryOrderInput} from '../components/lodgePage/LodgeHeroGalleryOrderInput'
import {isLodgePageSlugUnique} from '../lib/isLodgePageSlugUnique'

/** Section copy (eyebrow, title, body) on a lodge landing tab. */
const lodgeSectionCopyField = (name, group) =>
  defineField({
    name,
    title: 'Section copy',
    type: 'lodgePageSectionCopy',
    group,
    description: 'Eyebrow, title, and body for this section. Empty fields fall back to lodge or site copy.',
  })

/** Legacy source/preview panels — data preserved; hidden from Studio. */
const lodgeLegacyPreviewField = (name, group, section) =>
  defineField({
    name,
    title: 'Legacy preview panel',
    type: 'string',
    readOnly: true,
    group,
    hidden: true,
    options: {section},
  })

/**
 * Lodge page — editorial / layout for one public URL.
 * Structural lodge data lives in the linked **Lodge (knowledge center)** document.
 */
export const lodgePage = defineType({
  name: 'lodgePage',
  title: 'Lodge page',
  type: 'document',
  description:
    'Editorial and layout for this lodge landing. Photos, rooms, and amenities are edited in the linked Lodge knowledge center.',
  groups: [
    {name: 'general', title: 'General & SEO', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'highlights', title: 'Highlights'},
    {name: 'navigation', title: 'Navigation menu'},
    {name: 'overview', title: 'Overview'},
    {name: 'accommodations', title: "Where you'll sleep"},
    {name: 'commonAreas', title: 'Facilities'},
    {name: 'gettingHere', title: 'Getting here'},
    {name: 'science', title: 'Science'},
    {name: 'experiences', title: 'Experiences'},
    {name: 'reviews', title: 'Reviews'},
    {name: 'faq', title: 'FAQs'},
    {name: 'booking', title: 'Ready to stay'},
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title (Studio only)',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / URL',
      type: 'slug',
      group: 'general',
      options: {
        source: 'internalTitle',
        maxLength: 96,
        isUnique: isLodgePageSlugUnique,
      },
      description:
        'Path segment for `/lodges/{slug}`. Lowercase letters, numbers, hyphens. Unique only among **Lodge page** documents.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const cur = value?.current?.trim()
          if (!cur) return 'Slug is required'
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cur)) {
            return 'Use lowercase letters, numbers, and hyphens only (e.g. soqtapata-lodge)'
          }
          return true
        }),
    }),
    defineField({
      name: 'headerNavOrder',
      title: 'Header mega menu order',
      type: 'number',
      group: 'general',
      hidden: true,
      description: 'Legacy — preserved on existing documents.',
    }),
    defineField({
      name: 'lodge',
      title: 'Lodge (knowledge center)',
      type: 'reference',
      to: [{type: 'lodge'}],
      group: 'general',
      validation: (Rule) => Rule.required(),
      description: 'Structural lodge data (photos, rooms, amenities) is edited in Content library → Lodge knowledge center.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'general',
    }),
    lodgeLegacyPreviewField('lpStudioGeneral', 'general', 'general'),

    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.max(200),
      description: 'Optional override. When empty, the site uses the linked lodge name.',
    }),
    defineField({
      name: 'heroShortDescription',
      title: 'Hero short description',
      type: 'text',
      group: 'hero',
      rows: 3,
      validation: (Rule) => Rule.max(600),
      description: 'Optional override. When empty, the site uses the linked lodge short description.',
    }),
    defineField({
      name: 'heroHighlights',
      title: 'Hero highlight pills (up to 3)',
      type: 'array',
      group: 'hero',
      of: [{type: 'lodgePageHeroHighlightPill'}],
      options: {layout: 'list'},
      validation: (Rule) => Rule.max(3),
      description:
        'Optional short lines shown as pills under the hero title and in the header lodges mega menu. Leave empty for no pills.',
    }),
    defineField({
      name: 'heroGalleryOrderKeys',
      title: 'Hero photos — select & order',
      type: 'array',
      of: [{type: 'string'}],
      group: 'hero',
      components: {input: LodgeHeroGalleryOrderInput},
      validation: (Rule) => Rule.max(24),
      description:
        'Pick photos from the linked Lodge knowledge center media library (no uploads here). First selected photo is the main hero image; the rest appear in the hero gallery. Empty = all KC photos in library order.',
    }),
    defineField({
      name: 'menuThumbnailImage',
      title: 'Menu / card thumbnail',
      type: 'string',
      group: 'hero',
      components: {input: FacilitiesGalleryPhotoSelectInput},
      description:
        'One photo from the lodge KC library for the header mega menu and lodge preview cards. Empty = first hero photo, then first KC gallery photo, then site placeholder.',
    }),
    defineField({
      name: 'heroCtaSmartLink',
      title: 'Primary CTA',
      type: 'smartLink',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaSmartLink',
      title: 'Secondary CTA',
      type: 'smartLink',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image override (legacy)',
      type: 'image',
      group: 'hero',
      hidden: true,
    }),
    defineField({
      name: 'heroCTA',
      title: 'Hero CTA (legacy)',
      type: 'linkWithLabel',
      group: 'hero',
      hidden: true,
    }),
    lodgeLegacyPreviewField('lpStudioHero', 'hero', 'hero'),

    defineField({
      name: 'highlightLines',
      title: 'Highlight items (up to 6)',
      type: 'array',
      group: 'highlights',
      of: [{type: 'lodgePageHighlightLine'}],
      validation: (Rule) => Rule.max(6),
      description: 'Sortable highlights bar. Order matches the site.',
    }),
    defineField({
      name: 'snapshotSelection',
      title: 'Highlight items (legacy snapshot keys)',
      type: 'array',
      group: 'highlights',
      hidden: true,
      of: [{type: 'lodgeSnapshotKeyPick'}],
      validation: (Rule) => Rule.max(6),
    }),
    lodgeLegacyPreviewField('lpStudioHighlights', 'highlights', 'highlights'),

    defineField({
      name: 'menuCtaLabel',
      title: 'Mega menu — CTA label (legacy)',
      type: 'string',
      group: 'navigation',
      hidden: true,
      validation: (Rule) => Rule.max(80),
      description: 'Deprecated — header mega menu uses “View lodge” and `/lodges/{slug}`. Data preserved.',
    }),
    defineField({
      name: 'menuCtaSmartLink',
      title: 'Mega menu — CTA link (legacy)',
      type: 'smartLink',
      group: 'navigation',
      hidden: true,
      options: {relaxTargetValidation: true},
      description: 'Deprecated — not shown in Studio or used on the site. Data preserved.',
    }),
    defineField({
      name: 'navTitle',
      title: 'Menu title',
      type: 'string',
      group: 'navigation',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'navSubtitle',
      title: 'Menu subtitle',
      type: 'string',
      group: 'navigation',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation items',
      type: 'array',
      group: 'navigation',
      of: [{type: 'lodgePageNavItem'}],
      validation: (Rule) => Rule.max(15),
    }),
    defineField({
      name: 'navCtaSmartLink',
      title: 'Navigation CTA',
      type: 'smartLink',
      group: 'navigation',
    }),
    defineField({
      name: 'navCTA',
      title: 'Navigation CTA (legacy)',
      type: 'linkWithLabel',
      group: 'navigation',
      hidden: true,
    }),
    lodgeLegacyPreviewField('lpStudioNavigation', 'navigation', 'navigation'),

    lodgeSectionCopyField('overviewSectionCopy', 'overview'),
    defineField({
      name: 'overviewHighlights',
      title: 'Overview highlight bullets',
      type: 'array',
      group: 'overview',
      of: [{type: 'string', validation: (Rule) => Rule.max(200)}],
      validation: (Rule) => Rule.max(12),
      description: 'Optional bullets for this landing. If empty, the site may use lodge key elements.',
    }),
    lodgeLegacyPreviewField('lpStudioOverview', 'overview', 'overview'),

    lodgeSectionCopyField('accommodationSectionCopy', 'accommodations'),
    defineField({
      name: 'featuredRoomStableId',
      title: 'Featured room (legacy)',
      type: 'string',
      group: 'accommodations',
      hidden: true,
    }),
    lodgeLegacyPreviewField('lpStudioAccommodations', 'accommodations', 'accommodations'),

    lodgeSectionCopyField('facilitiesSectionCopy', 'commonAreas'),
    defineField({
      name: 'facilitiesGallerySelection',
      title: 'Facilities gallery photos',
      type: 'array',
      group: 'commonAreas',
      of: [{type: 'lodgeGalleryStableKeyPick'}],
      options: {layout: 'list'},
      validation: (Rule) => Rule.max(40),
      description:
        'Pick photos from the linked lodge photo library and drag to set order. No stable keys — copy is edited on the lodge.',
    }),
    defineField({
      name: 'facilitiesAmenitiesSelection',
      title: 'Included amenities',
      type: 'array',
      group: 'commonAreas',
      of: [{type: 'lodgeAmenityIconPick'}],
      options: {layout: 'list'},
      validation: (Rule) => Rule.max(40),
      description:
        'Pick amenities from the linked lodge knowledge center and drag to set order. Titles and copy are edited on the lodge, not here.',
    }),
    defineField({
      name: 'facilitiesAmenitiesEyebrow',
      title: '“What’s included” eyebrow',
      type: 'string',
      group: 'commonAreas',
      validation: (Rule) => Rule.max(120),
      description: 'Second eyebrow above the amenities grid on this landing.',
    }),
    lodgeLegacyPreviewField('lpStudioCommonAreas', 'commonAreas', 'commonAreas'),

    lodgeSectionCopyField('locationSectionCopy', 'gettingHere'),
    defineField({
      name: 'gettingHereImage',
      title: 'Map / access image',
      type: 'image',
      group: 'gettingHere',
      options: {hotspot: true},
      description: 'Single static image for this section. If empty, the site uses the lodge map image when available.',
    }),
    defineField({
      name: 'gettingHereIndications',
      title: 'Getting here indications',
      type: 'array',
      group: 'gettingHere',
      of: [
        {
          type: 'object',
          name: 'lodgePageGettingHereIndication',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required().max(120)}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(800)}),
          ],
          preview: {
            select: {title: 'title'},
            prepare: ({title}) => ({title: title || 'Indication'}),
          },
        },
      ],
      validation: (Rule) => Rule.max(10),
    }),
    lodgeLegacyPreviewField('lpStudioGettingHere', 'gettingHere', 'gettingHere'),

    lodgeSectionCopyField('researchSectionCopy', 'science'),
    defineField({
      name: 'scienceHighlights',
      title: 'Science highlights (up to 3)',
      type: 'array',
      group: 'science',
      of: [{type: 'lodgePageHighlightLine'}],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'scienceProjects',
      title: 'Science projects (up to 7)',
      type: 'array',
      group: 'science',
      of: [{type: 'lodgePageHighlightLine'}],
      validation: (Rule) => Rule.max(7),
    }),
    defineField({
      name: 'scienceSpecialText',
      title: 'Science special text',
      type: 'lodgeScienceSpecialText',
      group: 'science',
    }),
    lodgeLegacyPreviewField('lpStudioScience', 'science', 'science'),

    lodgeSectionCopyField('experiencesSectionCopy', 'experiences'),
    defineField({
      name: 'experiencesSelection',
      title: 'Experience selection (legacy)',
      type: 'array',
      group: 'experiences',
      hidden: true,
      of: [{type: 'reference', to: [{type: 'experience'}]}],
    }),
    defineField({
      name: 'fallbackToLodgeRelations',
      title: 'Fallback to lodge experiences (legacy)',
      type: 'boolean',
      group: 'experiences',
      hidden: true,
    }),
    defineField({
      name: 'experiencesTailorCta',
      title: 'Tailor Made (optional band)',
      type: 'lodgePageExperiencesTailorCta',
      group: 'experiences',
      description: 'Shown only when “Show Tailor Made band” is on. Uses CMS copy and smart-link CTA.',
    }),
    lodgeLegacyPreviewField('lpStudioExperiences', 'experiences', 'experiences'),

    defineField({
      name: 'reviewsSection',
      title: 'Reviews',
      type: 'pageReviewsSection',
      group: 'reviews',
      description:
        'Eyebrow, title, optional body, up to 3 highlight quotes, up to 4 review cards. Global rating: Settings → Reviews.',
    }),
    defineField({
      name: 'reviewsSelection',
      title: 'Legacy — review selection',
      type: 'array',
      group: 'reviews',
      hidden: true,
      of: [{type: 'reference', to: [{type: 'review'}]}],
    }),
    defineField({
      name: 'reviewsPresentation',
      title: 'Legacy — presentation',
      type: 'object',
      group: 'reviews',
      hidden: true,
      fields: [
        defineField({name: 'sourceLabel', title: 'Source label', type: 'string'}),
        defineField({name: 'averageRating', title: 'Average rating', type: 'string'}),
        defineField({name: 'secondaryRatingLine', title: 'Secondary line', type: 'string'}),
        defineField({name: 'carouselEndLabel', title: 'View all label', type: 'string'}),
        defineField({name: 'carouselEndHref', title: 'View all URL', type: 'string'}),
        defineField({name: 'emptyMessage', title: 'Empty message', type: 'text', rows: 3}),
      ],
    }),
    lodgeLegacyPreviewField('lpStudioReviews', 'reviews', 'reviews'),

    lodgeSectionCopyField('faqSectionCopy', 'faq'),
    defineField({
      name: 'faqItems',
      title: 'FAQs (up to 10)',
      type: 'array',
      group: 'faq',
      of: [{type: 'lodgePageFaqItem'}],
      validation: (Rule) => Rule.max(10),
    }),
    lodgeLegacyPreviewField('lpStudioFaq', 'faq', 'faq'),

    defineField({
      name: 'reserveCtaSettings',
      title: 'Reserve CTA (#book)',
      type: 'reserveCtaSettings',
      group: 'booking',
    }),
    defineField({
      name: 'bookingCta',
      title: 'Booking block (legacy)',
      type: 'lodgePageBookingBlock',
      group: 'booking',
      hidden: true,
    }),
    lodgeLegacyPreviewField('lpStudioBooking', 'booking', 'booking'),

    defineField({
      name: 'sections',
      title: 'Section copy (internal)',
      type: 'object',
      hidden: true,
      fields: [
        defineField({name: 'overview', title: 'Overview', type: 'lodgePageSectionCopy'}),
        defineField({name: 'accommodation', title: 'Accommodation', type: 'lodgePageSectionCopy'}),
        defineField({name: 'facilities', title: 'Facilities', type: 'lodgePageSectionCopy'}),
        defineField({name: 'location', title: 'Location', type: 'lodgePageSectionCopy'}),
        defineField({name: 'research', title: 'Research', type: 'lodgePageSectionCopy'}),
        defineField({name: 'experiences', title: 'Experiences', type: 'lodgePageSectionCopy'}),
        defineField({name: 'reviews', title: 'Reviews', type: 'lodgePageSectionCopy'}),
        defineField({name: 'faq', title: 'FAQ', type: 'lodgePageSectionCopy'}),
        defineField({name: 'booking', title: 'Booking', type: 'lodgePageSectionCopy'}),
      ],
    }),
  ],
  preview: {
    select: {t: 'internalTitle', slug: 'slug.current', ln: 'lodge.name'},
    prepare: ({t, slug, ln}) => ({
      title: t || 'Lodge page',
      subtitle: [slug && `/${slug}`, ln && `· ${ln}`].filter(Boolean).join(' '),
    }),
  },
})
