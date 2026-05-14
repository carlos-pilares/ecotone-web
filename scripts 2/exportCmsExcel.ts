import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import ExcelJS from 'exceljs'
import { createClient } from 'next-sanity'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env.local') })

type ExportRow = {
  documentId: string
  titleOrName: string
  section: string
  field: string
  value: string
  status?: string
  notes?: string
  referenceId?: string
  referenceTitle?: string
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN
const outputPath = resolve(process.cwd(), 'exports', 'cms-content-export.xlsx')

if (!projectId || !dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: token || undefined,
})

function toCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map((v) => toCell(v)).filter(Boolean).join(' | ')
  if (typeof value === 'object') {
    if ('current' in (value as Record<string, unknown>)) return toCell((value as { current?: unknown }).current)
    return JSON.stringify(value)
  }
  return String(value)
}

function addSheet(workbook: ExcelJS.Workbook, name: string, rows: ExportRow[]) {
  const ws = workbook.addWorksheet(name)
  ws.columns = [
    { header: 'documentId', key: 'documentId', width: 26 },
    { header: 'titleOrName', key: 'titleOrName', width: 34 },
    { header: 'section', key: 'section', width: 20 },
    { header: 'field', key: 'field', width: 34 },
    { header: 'value', key: 'value', width: 72 },
    { header: 'status', key: 'status', width: 16 },
    { header: 'notes', key: 'notes', width: 26 },
    { header: 'referenceId', key: 'referenceId', width: 28 },
    { header: 'referenceTitle', key: 'referenceTitle', width: 34 },
  ]
  ws.getRow(1).font = { bold: true }
  ws.views = [{ state: 'frozen', ySplit: 1 }]
  rows.forEach((r) => ws.addRow(r))
}

function push(rows: ExportRow[], row: ExportRow) {
  rows.push({
    ...row,
    value: toCell(row.value),
    status: row.status || '',
    notes: row.notes || '',
    referenceId: row.referenceId || '',
    referenceTitle: row.referenceTitle || '',
  })
}

async function main() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'ecotone-web'
  workbook.created = new Date()

  const home = await client.fetch<any>(`*[_id == "homePage"][0]{
    _id,
    heroEyebrow, heroHeadline, heroHeadlineLight, heroSubheadline, heroPills, heroCta1Text, heroCta1Link, heroCta2Text, heroCta2Link,
    heroCardPrice, heroCardPriceSuffix, heroCardSubprice, heroCardRows, heroCardCtaText, heroCardCtaLink,
    stats,
    manifestoEyebrow, manifestoHeadline, manifestoBody1, manifestoBody2, manifestoImageCaption, manifestoCta1Text, manifestoCta1Link, manifestoCta2Text, manifestoCta2Link,
    explorerEyebrow, explorerHeadline, explorerSubheadline,
    reviewsEyebrow, reviewsHeadline, reviewsBody, reviewsScore,
    "homeSelectedReviews": homeSelectedReviews[]->{_id, "title": coalesce(authorName, quote)},
    techEyebrow, techHeadline, techBody,
    "homeSelectedTechnologyProducts": homeSelectedTechnologyProducts[]->{_id, name},
    missionEyebrow, missionHeadline, missionBody, missionItems, missionCtaText, missionCtaLink,
    partnersEyebrow, partnersTitle, partnersLabel, partnersBody, partnersEmptyMessage,
    "partnersOnHome": coalesce(partnersOnHome, homeSelectedPartners)[]->{_id, name},
    blogEyebrow, blogHeadline, blogBody,
    "homeSelectedBlogPosts": homeSelectedBlogPosts[]->{_id, title},
    bookingEyebrow, bookingHeadline, bookingBody, bookingTrustItems, bookingPrice, bookingPriceSubtext, bookingCardRows, bookingCta1Text, bookingCta1Link, bookingCta2Text, bookingCta2Link
  }`)

  const experiences = await client.fetch<any[]>(`*[_type == "experience"] | order(name asc){
    _id, name, "slug": slug.current, tagline, programType, route, status, duration, price, priceLabel, shortDescription, fullDescription,
    highlights, includes, notIncludes, lodgeNightLabel, groupSizeMin, groupSizeMax, altitude, distanceFromCusco, ecosystem,
    "lodgeRef": lodge->{_id, name},
    "routeRef": *[_type=="route" && slug.current == ^.route][0]{_id, name},
    "includedTechProducts": includedTechProducts[]->{_id, name},
    "relatedExperiences": relatedExperiences[]->{_id, name},
    resources[]{
      _key, title, subtitle, resourceType, visualPreset, fileUrl, ctaLabel, visible, order,
      "fileAssetUrl": file.asset->url
    }
  }`)

  const experiencePages = await client.fetch<any[]>(`*[_type == "experiencePage"] | order(internalTitle asc){
    _id, internalTitle, "slug": slug.current,
    "experienceRef": experience->{_id, name},
    relatedSectionEyebrow, relatedSectionTitle,
    "reviewRefs": reviewRefs[]->{_id, "title": coalesce(authorName, quote)},
    "techProductRefs": techProductRefs[]->{_id, name},
    "relatedExperienceRefs": relatedExperienceRefs[]->{_id, name},
    internalNav{
      title, subtitle, fromLabel, priceText, priceSuffix, ctaLabel, ctaUrl, ctaVisible,
      items[]{label, targetSection, visible, order}
    },
    pageHero{eyebrow, headline, headlineSub, pills, priceLine, priceSub},
    sectionModules[]{key, visible, anchorId, eyebrow, sectionTitle, sectionText}
  }`)

  const reviews = await client.fetch<any[]>(`*[_type == "review"] | order(_createdAt desc){
    _id, quote, authorName, authorCity, authorCountry, experienceName, rating, isFeatured
  }`)
  const techProducts = await client.fetch<any[]>(`*[_type == "technologyProduct"] | order(order asc){
    _id, name, number, description, badgeText, badgeTextWhenExcluded, order, "slug": slug.current
  }`)
  const partners = await client.fetch<any[]>(`*[_type == "partner"] | order(name asc){
    _id, name, link, category, logoSvg
  }`)
  const blogPosts = await client.fetch<any[]>(`*[_type == "blogPost"] | order(publishedAt desc){
    _id, title, category, readingMinutes, externalLink, "slug": slug.current, publishedAt
  }`)
  const lodges = await client.fetch<any[]>(`*[_type == "lodge"] | order(name asc){
    _id, name, "slug": slug.current, tagline, shortDescription, "altitude": coalesce(altitudeLegacy, altitude), route, ecosystem, amenities
  }`)
  const routes = await client.fetch<any[]>(`*[_type == "route"] | order(name asc){
    _id, name, "slug": slug.current, tagline, shortDescription, highlights
  }`)

  const homeRows: ExportRow[] = []
  if (home) {
    const id = home._id || 'homePage'
    const title = 'Home page'
    const simple: Array<[string, string, unknown]> = [
      ['hero', 'heroEyebrow', home.heroEyebrow],
      ['hero', 'heroHeadline', home.heroHeadline],
      ['hero', 'heroHeadlineLight', home.heroHeadlineLight],
      ['hero', 'heroSubheadline', home.heroSubheadline],
      ['manifesto', 'manifestoHeadline', home.manifestoHeadline],
      ['reviews', 'reviewsHeadline', home.reviewsHeadline],
      ['tech', 'techHeadline', home.techHeadline],
      ['mission', 'missionHeadline', home.missionHeadline],
      ['partners', 'partnersEyebrow', home.partnersEyebrow],
      ['partners', 'partnersTitle', home.partnersTitle ?? home.partnersLabel],
      ['partners', 'partnersBody', home.partnersBody],
      ['partners', 'partnersEmptyMessage', home.partnersEmptyMessage],
      ['blog', 'blogEyebrow', home.blogEyebrow],
      ['blog', 'blogHeadline', home.blogHeadline],
      ['blog', 'blogBody', home.blogBody],
      ['booking', 'bookingHeadline', home.bookingHeadline],
      ['booking', 'bookingBody', home.bookingBody],
    ]
    simple.forEach(([section, field, value]) => {
      if (toCell(value)) push(homeRows, { documentId: id, titleOrName: title, section, field, value: toCell(value) })
    })
    ;(home.homeSelectedTechnologyProducts || []).forEach((ref: any, idx: number) =>
      push(homeRows, {
        documentId: id,
        titleOrName: title,
        section: 'tech',
        field: `homeSelectedTechnologyProducts[${idx}]`,
        value: ref?.name || '',
        referenceId: ref?._id,
        referenceTitle: ref?.name,
      }),
    )
    ;(home.partnersOnHome || []).forEach((ref: any, idx: number) =>
      push(homeRows, {
        documentId: id,
        titleOrName: title,
        section: 'partners',
        field: `partnersOnHome[${idx}]`,
        value: ref?.name || '',
        referenceId: ref?._id,
        referenceTitle: ref?.name,
      }),
    )
    ;(home.homeSelectedBlogPosts || []).forEach((ref: any, idx: number) =>
      push(homeRows, {
        documentId: id,
        titleOrName: title,
        section: 'blog',
        field: `homeSelectedBlogPosts[${idx}]`,
        value: ref?.title || '',
        referenceId: ref?._id,
        referenceTitle: ref?.title,
      }),
    )
  }

  const experienceRows: ExportRow[] = []
  const resourcesRows: ExportRow[] = []
  experiences.forEach((doc) => {
    const id = doc._id
    const title = doc.name || '(untitled experience)'
    ;[
      ['summary', 'name', doc.name],
      ['summary', 'slug', doc.slug],
      ['summary', 'tagline', doc.tagline],
      ['summary', 'programType', doc.programType],
      ['summary', 'route', doc.route],
      ['summary', 'status', doc.status],
      ['summary', 'duration', doc.duration],
      ['summary', 'price', doc.price],
      ['summary', 'priceLabel', doc.priceLabel],
      ['content', 'shortDescription', doc.shortDescription],
      ['content', 'fullDescription', doc.fullDescription],
      ['details', 'altitude', doc.altitude],
      ['details', 'distanceFromCusco', doc.distanceFromCusco],
      ['details', 'ecosystem', doc.ecosystem],
    ].forEach(([section, field, value]) => {
      if (toCell(value)) push(experienceRows, { documentId: id, titleOrName: title, section: String(section), field: String(field), value: toCell(value) })
    })
    ;(doc.highlights || []).forEach((v: string, i: number) => push(experienceRows, { documentId: id, titleOrName: title, section: 'content', field: `highlights[${i}]`, value: v }))
    ;(doc.includes || []).forEach((v: string, i: number) => push(experienceRows, { documentId: id, titleOrName: title, section: 'content', field: `includes[${i}]`, value: v }))
    ;(doc.notIncludes || []).forEach((v: string, i: number) => push(experienceRows, { documentId: id, titleOrName: title, section: 'content', field: `notIncludes[${i}]`, value: v }))
    if (doc.lodgeRef?._id) {
      push(experienceRows, { documentId: id, titleOrName: title, section: 'references', field: 'lodge', value: doc.lodgeRef.name || '', referenceId: doc.lodgeRef._id, referenceTitle: doc.lodgeRef.name })
    }
    if (doc.routeRef?._id) {
      push(experienceRows, { documentId: id, titleOrName: title, section: 'references', field: 'route', value: doc.routeRef.name || '', referenceId: doc.routeRef._id, referenceTitle: doc.routeRef.name })
    }
    ;(doc.includedTechProducts || []).forEach((ref: any, i: number) => push(experienceRows, { documentId: id, titleOrName: title, section: 'references', field: `includedTechProducts[${i}]`, value: ref?.name || '', referenceId: ref?._id, referenceTitle: ref?.name }))
    ;(doc.relatedExperiences || []).forEach((ref: any, i: number) => push(experienceRows, { documentId: id, titleOrName: title, section: 'references', field: `relatedExperiences[${i}]`, value: ref?.name || '', referenceId: ref?._id, referenceTitle: ref?.name }))
    ;(doc.resources || []).forEach((res: any, i: number) => {
      const resourceTitle = res?.title || `Resource ${i + 1}`
      ;[
        ['resource', `resources[${i}].title`, res?.title],
        ['resource', `resources[${i}].subtitle`, res?.subtitle],
        ['resource', `resources[${i}].resourceType`, res?.resourceType],
        ['resource', `resources[${i}].visualPreset`, res?.visualPreset],
        ['resource', `resources[${i}].ctaLabel`, res?.ctaLabel],
        ['resource', `resources[${i}].fileUrl`, res?.fileUrl || res?.fileAssetUrl],
      ].forEach(([section, field, value]) => {
        if (toCell(value)) push(resourcesRows, { documentId: id, titleOrName: title, section: String(section), field: String(field), value: toCell(value), notes: resourceTitle })
      })
      push(resourcesRows, { documentId: id, titleOrName: title, section: 'resource', field: `resources[${i}].visible`, value: toCell(Boolean(res?.visible)), status: res?.visible ? 'visible' : 'hidden', notes: resourceTitle })
      if (res?.order !== undefined && res?.order !== null) {
        push(resourcesRows, { documentId: id, titleOrName: title, section: 'resource', field: `resources[${i}].order`, value: toCell(res.order), notes: resourceTitle })
      }
    })
  })

  const experiencePageRows: ExportRow[] = []
  experiencePages.forEach((doc) => {
    const id = doc._id
    const title = doc.internalTitle || '(untitled page)'
    ;[
      ['summary', 'internalTitle', doc.internalTitle],
      ['summary', 'slug', doc.slug],
      ['hero', 'pageHero.headline', doc.pageHero?.headline],
      ['hero', 'pageHero.headlineSub', doc.pageHero?.headlineSub],
      ['related', 'relatedSectionEyebrow', doc.relatedSectionEyebrow],
      ['related', 'relatedSectionTitle', doc.relatedSectionTitle],
    ].forEach(([section, field, value]) => {
      if (toCell(value)) push(experiencePageRows, { documentId: id, titleOrName: title, section: String(section), field: String(field), value: toCell(value) })
    })
    if (doc.experienceRef?._id) {
      push(experiencePageRows, { documentId: id, titleOrName: title, section: 'references', field: 'experience', value: doc.experienceRef.name || '', referenceId: doc.experienceRef._id, referenceTitle: doc.experienceRef.name })
    }
    ;(doc.reviewRefs || []).forEach((ref: any, i: number) => push(experiencePageRows, { documentId: id, titleOrName: title, section: 'references', field: `reviewRefs[${i}]`, value: ref?.title || '', referenceId: ref?._id, referenceTitle: ref?.title }))
    ;(doc.techProductRefs || []).forEach((ref: any, i: number) => push(experiencePageRows, { documentId: id, titleOrName: title, section: 'references', field: `techProductRefs[${i}]`, value: ref?.name || '', referenceId: ref?._id, referenceTitle: ref?.name }))
    ;(doc.relatedExperienceRefs || []).forEach((ref: any, i: number) => push(experiencePageRows, { documentId: id, titleOrName: title, section: 'references', field: `relatedExperienceRefs[${i}]`, value: ref?.name || '', referenceId: ref?._id, referenceTitle: ref?.name }))
    ;(doc.internalNav?.items || []).forEach((item: any, i: number) => {
      push(experiencePageRows, { documentId: id, titleOrName: title, section: 'internalNav', field: `items[${i}].label`, value: item?.label || '' })
      push(experiencePageRows, { documentId: id, titleOrName: title, section: 'internalNav', field: `items[${i}].targetSection`, value: item?.targetSection || '' })
      push(experiencePageRows, { documentId: id, titleOrName: title, section: 'internalNav', field: `items[${i}].visible`, value: toCell(Boolean(item?.visible)), status: item?.visible ? 'visible' : 'hidden' })
    })
    ;(doc.sectionModules || []).forEach((m: any, i: number) => {
      push(experiencePageRows, { documentId: id, titleOrName: title, section: 'sectionModules', field: `[${i}].key`, value: m?.key || '' })
      push(experiencePageRows, { documentId: id, titleOrName: title, section: 'sectionModules', field: `[${i}].sectionTitle`, value: m?.sectionTitle || '' })
      push(experiencePageRows, { documentId: id, titleOrName: title, section: 'sectionModules', field: `[${i}].visible`, value: toCell(Boolean(m?.visible)), status: m?.visible ? 'visible' : 'hidden' })
    })
  })

  const reviewRows: ExportRow[] = reviews.flatMap((doc) => {
    const title = doc.authorName || 'Review'
    return [
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'quote', value: toCell(doc.quote), status: doc.isFeatured ? 'featured' : '' },
      { documentId: doc._id, titleOrName: title, section: 'author', field: 'authorName', value: toCell(doc.authorName) },
      { documentId: doc._id, titleOrName: title, section: 'author', field: 'authorCity', value: toCell(doc.authorCity) },
      { documentId: doc._id, titleOrName: title, section: 'author', field: 'authorCountry', value: toCell(doc.authorCountry) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'experienceName', value: toCell(doc.experienceName) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'rating', value: toCell(doc.rating) },
    ].filter((r) => r.value)
  })

  const techRows: ExportRow[] = techProducts.flatMap((doc) => {
    const title = doc.name || 'Tech Product'
    return [
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'name', value: toCell(doc.name) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'number', value: toCell(doc.number) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'description', value: toCell(doc.description) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'badgeText', value: toCell(doc.badgeText) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'badgeTextWhenExcluded', value: toCell(doc.badgeTextWhenExcluded) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'slug', value: toCell(doc.slug) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'order', value: toCell(doc.order) },
    ].filter((r) => r.value)
  })

  const partnerRows: ExportRow[] = partners.flatMap((doc) => {
    const title = doc.name || 'Partner'
    return [
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'name', value: toCell(doc.name) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'link', value: toCell(doc.link) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'category', value: toCell(doc.category) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'logoSvg', value: doc.logoSvg ? '[svg present]' : '' },
    ].filter((r) => r.value)
  })

  const blogRows: ExportRow[] = blogPosts.flatMap((doc) => {
    const title = doc.title || 'Blog Post'
    return [
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'title', value: toCell(doc.title) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'category', value: toCell(doc.category) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'readingMinutes', value: toCell(doc.readingMinutes) },
      { documentId: doc._id, titleOrName: title, section: 'links', field: 'externalLink', value: toCell(doc.externalLink) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'slug', value: toCell(doc.slug) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'publishedAt', value: toCell(doc.publishedAt) },
    ].filter((r) => r.value)
  })

  const lodgeRows: ExportRow[] = lodges.flatMap((doc) => {
    const title = doc.name || 'Lodge'
    const base: ExportRow[] = [
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'name', value: toCell(doc.name) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'tagline', value: toCell(doc.tagline) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'shortDescription', value: toCell(doc.shortDescription) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'slug', value: toCell(doc.slug) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'route', value: toCell(doc.route) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'altitude', value: toCell(doc.altitude) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'ecosystem', value: toCell(doc.ecosystem) },
    ].filter((r) => r.value)
    ;(doc.amenities || []).forEach((a: string, i: number) => base.push({ documentId: doc._id, titleOrName: title, section: 'amenities', field: `amenities[${i}]`, value: a }))
    return base
  })

  const routeRows: ExportRow[] = routes.flatMap((doc) => {
    const title = doc.name || 'Route'
    const base: ExportRow[] = [
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'name', value: toCell(doc.name) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'tagline', value: toCell(doc.tagline) },
      { documentId: doc._id, titleOrName: title, section: 'content', field: 'shortDescription', value: toCell(doc.shortDescription) },
      { documentId: doc._id, titleOrName: title, section: 'meta', field: 'slug', value: toCell(doc.slug) },
    ].filter((r) => r.value)
    ;(doc.highlights || []).forEach((h: string, i: number) => base.push({ documentId: doc._id, titleOrName: title, section: 'highlights', field: `highlights[${i}]`, value: h }))
    return base
  })

  addSheet(workbook, 'Home', homeRows)
  addSheet(workbook, 'Experience', experienceRows)
  addSheet(workbook, 'Experience Page', experiencePageRows)
  addSheet(workbook, 'Resources', resourcesRows)
  addSheet(workbook, 'Reviews', reviewRows)
  addSheet(workbook, 'Tech Products', techRows)
  addSheet(workbook, 'Partners', partnerRows)
  addSheet(workbook, 'Blog Posts', blogRows)
  addSheet(workbook, 'Lodges', lodgeRows)
  addSheet(workbook, 'Routes', routeRows)

  await mkdir(dirname(outputPath), { recursive: true })
  await workbook.xlsx.writeFile(outputPath)
  // eslint-disable-next-line no-console
  console.log(`CMS Excel export generated: ${outputPath}`)
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
