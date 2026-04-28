import type { ReviewDoc } from '@/lib/queries'

/**
 * Shown on the Soqtapata experience page when CMS returns no reviews for this program
 * (curated, program-specific copy — not the global homepage set).
 */
export const soqtapataExperienceReviewFallbacks: ReviewDoc[] = [
  {
    _id: 'soqtapata-fb-1',
    quote:
      'Breathtaking place with amazing people that changed my way of travelling and understanding nature.',
    authorName: 'Vanessa',
    authorCity: 'London',
    authorCountry: 'UK',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
    isFeatured: true,
  },
  {
    _id: 'soqtapata-fb-2',
    quote: 'Super comfortable place. There are no words to describe the beauty of this place.',
    authorName: 'Richard',
    authorCity: 'California',
    authorCountry: 'US',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
    isFeatured: true,
  },
  {
    _id: 'soqtapata-fb-3',
    quote: 'The EcoDroneView above the canopy was one of the most surreal moments of my life.',
    authorName: 'Sofia',
    authorCity: 'Barcelona',
    authorCountry: 'ES',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
    isFeatured: true,
  },
]
