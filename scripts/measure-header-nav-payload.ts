/**
 * Compares legacy vs slim header nav bundle payload sizes (one-off measurement).
 * Run: npx tsx scripts/measure-header-nav-payload.ts
 */
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'

import {
  GROQ_EXPERIENCE_GALLERY_ITEM,
  GROQ_EXPERIENCE_PHOTO_COLLECTION_FIELD,
  GROQ_EXPERIENCE_PAGE_NAV_THUMB_URL,
  GROQ_HEADER_NAV_EXPERIENCE_FIELDS_SLIM,
} from '../lib/experienceHeroImageGroq'
import { GROQ_LODGE_ALTITUDE_AS_ALTITUDE } from '../lib/lodgeAltitudeGroq'
import { GROQ_SMART_LINK_FIELDS } from '../lib/smartLinkGroq'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false })

const SL = `{ ${GROQ_SMART_LINK_FIELDS} }`

const LEGACY_EXPERIENCE_FIELDS = /* groq */ `
  _id,
  name,
  programType,
  route,
  routeRef->{ _id, "slug": slug.current, shortLabel, name },
  duration,
  price,
  priceLabel,
  mainImage,
  "mainImageUrl": mainImage.asset->url,
  gallery[] ${GROQ_EXPERIENCE_GALLERY_ITEM},
  ${GROQ_EXPERIENCE_PHOTO_COLLECTION_FIELD}
`

const HEADER_SETTINGS_NAV = `
  _id,
  navTabs[]{ _key, label, showInHeader },
  experiencesShowInHeader,
  lodgesShowInHeader
`

const legacyQuery = groq`{
  "headerSettings": *[_type == "headerSettings" && _id == "headerSettings"][0]{ ${HEADER_SETTINGS_NAV} },
  "legacyHeader": *[_id == "siteSettings"][0]{ "experiencesEnabled": header.experiencesEnabled },
  "experiencePages": *[_type == "experiencePage" && defined(slug.current) && defined(experience)] {
    _id,
    "pageSlug": slug.current,
    headerNavOrder,
    galleryOrderKeys,
    "experience": experience-> { ${LEGACY_EXPERIENCE_FIELDS} }
  },
  "learningProgrammes": *[_type == "experiencePage" && defined(learningProgramme._ref) && learningProgramme->status == "active" && defined(slug.current)] {
    "_id": learningProgramme._ref,
    "title": learningProgramme->title,
    "pageSlug": slug.current,
    "mainImageUrl": learningProgramme->mainImage.asset->url
  },
  "lodgePages": *[_type == "lodgePage" && defined(slug.current) && defined(lodge)] {
    _id,
    "pageSlug": slug.current,
    heroTitle,
    heroGalleryOrderKeys,
    menuThumbnailImage,
    "menuThumbnailImageUrl": coalesce(
      select(menuThumbnailImage != "" => lodge->gallery[_key == ^.menuThumbnailImage][0].image.asset->url),
      lodge->mainImage.asset->url
    ),
    "lodge": lodge-> {
      name,
      route,
      shortDescription,
      location,
      ${GROQ_LODGE_ALTITUDE_AS_ALTITUDE},
      certifications[]{ label },
      "mainImageUrl": mainImage.asset->url,
      "firstHeroGalleryUrl": gallery[(photoCategory == "hero" || usageSection == "hero") && defined(image.asset)][0].image.asset->url,
      "firstGalleryUrl": gallery[defined(image.asset)][0].image.asset->url
    }
  },
  "routeNavDocs": *[_type == "route" && defined(slug.current)]{ _id, name, "slug": slug.current }
}`

const slimQuery = groq`{
  "headerSettings": *[_type == "headerSettings" && _id == "headerSettings"][0]{ ${HEADER_SETTINGS_NAV} },
  "legacyHeader": *[_id == "siteSettings"][0]{ "experiencesEnabled": header.experiencesEnabled },
  "experiencePages": *[_type == "experiencePage" && defined(slug.current) && defined(experience)] {
    _id,
    "pageSlug": slug.current,
    headerNavOrder,
    galleryOrderKeys,
    ${GROQ_EXPERIENCE_PAGE_NAV_THUMB_URL},
    "experience": experience-> { ${GROQ_HEADER_NAV_EXPERIENCE_FIELDS_SLIM} }
  },
  "learningProgrammes": *[_type == "experiencePage" && defined(learningProgramme._ref) && learningProgramme->status == "active" && defined(slug.current)] {
    "_id": learningProgramme._ref,
    "title": learningProgramme->title,
    "pageSlug": slug.current,
    "mainImageUrl": learningProgramme->mainImage.asset->url
  },
  "lodgePages": *[_type == "lodgePage" && defined(slug.current) && defined(lodge)] {
    _id,
    "pageSlug": slug.current,
    heroTitle,
    "menuThumbnailImageUrl": coalesce(
      select(menuThumbnailImage != "" => lodge->gallery[_key == ^.menuThumbnailImage][0].image.asset->url),
      lodge->mainImage.asset->url
    ),
    "lodge": lodge-> { name, route, shortDescription }
  },
  "routeNavDocs": *[_type == "route" && defined(slug.current)]{ _id, name, "slug": slug.current }
}`

function byteSize(obj: unknown): number {
  return Buffer.byteLength(JSON.stringify(obj), 'utf8')
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function main() {
  const [legacy, slim] = await Promise.all([
    client.fetch(legacyQuery),
    client.fetch(slimQuery),
  ])

  const legacyBytes = byteSize(legacy)
  const slimBytes = byteSize(slim)
  const legacyExpBytes = byteSize(legacy.experiencePages ?? [])
  const slimExpBytes = byteSize(slim.experiencePages ?? [])
  const legacyLodgeBytes = byteSize(legacy.lodgePages ?? [])
  const slimLodgeBytes = byteSize(slim.lodgePages ?? [])

  console.log(JSON.stringify({
    headerNavBundleTotal: {
      legacy: formatKb(legacyBytes),
      slim: formatKb(slimBytes),
      reduction: `${(((legacyBytes - slimBytes) / legacyBytes) * 100).toFixed(1)}%`,
    },
    experiencePagesSlice: {
      legacy: formatKb(legacyExpBytes),
      slim: formatKb(slimExpBytes),
      reduction: `${(((legacyExpBytes - slimExpBytes) / legacyExpBytes) * 100).toFixed(1)}%`,
    },
    lodgePagesSlice: {
      legacy: formatKb(legacyLodgeBytes),
      slim: formatKb(slimLodgeBytes),
      reduction: `${(((legacyLodgeBytes - slimLodgeBytes) / legacyLodgeBytes) * 100).toFixed(1)}%`,
    },
    counts: {
      experiencePages: (slim.experiencePages ?? []).length,
      lodgePages: (slim.lodgePages ?? []).length,
      learningProgrammes: (slim.learningProgrammes ?? []).length,
    },
  }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
