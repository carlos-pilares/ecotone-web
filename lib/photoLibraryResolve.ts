import type { SanityImageSource } from '@sanity/image-url'

import type {LodgeGalleryItemRow} from '@/lib/lodgePageCmsTypes'
import {cdnImageUrl, sanityImageUrl} from '@/lib/sanity'

export type PhotoLibraryItemRow = {
  _key?: string
  title?: string | null
  caption?: string | null
  altText?: string | null
  tags?: string[] | null
  usageNotes?: string | null
  photoCategory?: string | null
  active?: boolean | null
  image?: SanityImageSource | null
  imageUrl?: string | null
}

export type PhotoCollectionDoc = {
  _id?: string
  title?: string | null
  photos?: PhotoLibraryItemRow[] | null
} | null

export type ExperienceGalleryLikeRow = {
  _key?: string
  mediaType?: string | null
  title?: string | null
  caption?: string | null
  alt?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  videoUrl?: string | null
  videoThumbnail?: SanityImageSource | null
  videoThumbnailUrl?: string | null
}

function isActivePhoto(row: PhotoLibraryItemRow | null | undefined): boolean {
  return row != null && row.active !== false
}

function photoHasAsset(row: PhotoLibraryItemRow): boolean {
  return Boolean(row.imageUrl?.trim() || cdnImageUrl(row.image, 1, ''))
}

/** Lodge KC + page pickers: photo library rows first, then legacy inline gallery. */
export function mergeLodgeGalleryWithPhotoLibrary(
  photoCollection: PhotoCollectionDoc,
  legacyGallery: LodgeGalleryItemRow[] | null | undefined,
): LodgeGalleryItemRow[] {
  const libRows = (photoCollection?.photos ?? [])
    .filter(isActivePhoto)
    .filter(photoHasAsset)
    .map(photoLibraryItemToLodgeGalleryRow)
  const legacy = legacyGallery ?? []
  return [...libRows, ...legacy]
}

export function photoLibraryItemToLodgeGalleryRow(photo: PhotoLibraryItemRow): LodgeGalleryItemRow {
  const title = photo.title?.trim() || ''
  const caption = photo.caption?.trim() || ''
  const altText = photo.altText?.trim() || title
  const photoCategory = photo.photoCategory?.trim() || 'other'
  return {
    _key: photo._key,
    title,
    caption,
    altText,
    description: caption,
    alt: altText,
    photoCategory,
    usageSection: photoCategory,
    image: photo.image,
    imageUrl:
      sanityImageUrl({ url: photo.imageUrl, image: photo.image, width: 1200, fallback: '' }) || undefined,
  }
}

/** Experience KC + landing gallery: library photos first; legacy KC rows keep videos. */
export function mergeExperienceGalleryWithPhotoLibrary<T extends ExperienceGalleryLikeRow>(
  photoCollection: PhotoCollectionDoc,
  legacyGallery: T[] | null | undefined,
): T[] {
  const libRows = (photoCollection?.photos ?? [])
    .filter(isActivePhoto)
    .filter(photoHasAsset)
    .map(photoLibraryItemToExperienceGalleryRow) as T[]
  const legacy = legacyGallery ?? []
  return [...libRows, ...legacy]
}

export function photoLibraryItemToExperienceGalleryRow(
  photo: PhotoLibraryItemRow,
): ExperienceGalleryLikeRow {
  const title = photo.title?.trim() || ''
  const caption = photo.caption?.trim() || ''
  const alt = photo.altText?.trim() || title
  return {
    _key: photo._key,
    mediaType: 'photo',
    title,
    caption,
    alt,
    image: photo.image,
    imageUrl:
      sanityImageUrl({ url: photo.imageUrl, image: photo.image, width: 1200, fallback: '' }) || undefined,
  }
}
