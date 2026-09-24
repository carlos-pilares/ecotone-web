/** GROQ projection for a Sanity image field used by the Ecotone responsive pipeline. */
export const GROQ_ECOTONE_IMAGE_FIELDS = `
  asset->{
    _id,
    url,
    metadata {
      dimensions { width, height, aspectRatio }
    }
  },
  crop,
  hotspot
`
