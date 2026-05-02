/**
 * Image URLs aligned with current front fallbacks (`Hero`, `HomeStaticSections`):
 * used only by CMS seeds to upload Sanity assets — not a second design source.
 */
export const HOME_IMAGE_URLS = {
  /** Matches `DEFAULT_HERO_BG` in `components/Hero.tsx` */
  hero: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1800&q=85',
  /** Manifesto column image fallback */
  manifesto: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85',
  missionPhoto1: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=800&q=80',
  missionPhoto2: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&q=80',
  missionPhoto3: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=80',
} as const

/** Blog teaser images (same order as `DEFAULT_BLOG_IMAGES` in `HomeStaticSections.tsx`). */
export const BLOG_TEASER_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
] as const
