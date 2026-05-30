import { groq } from 'next-sanity'

import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'

export const activePromotionsQuery = groq`
  *[_type == "promotion" && enabled == true] | order(priority desc, internalTitle asc) {
    _id,
    internalTitle,
    enabled,
    priority,
    startDate,
    endDate,
    promoLabel,
    promoMicrocopy,
    legalText,
    legalSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    appliesToAll,
    "routes": routes[]->{ _id },
    programTypes,
    "experiences": experiences[]->{ _id },
    pricingMode,
    percentageDiscount,
    fixedFinalPrice,
    fixedFinalPriceLabel
  }
`

export const announcementBarSettingsQuery = groq`
  *[_id == "announcementBarSettings"][0]{
    enabled,
    message,
    secondaryText,
    ctaLabel,
    ctaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    startDate,
    endDate,
    showOnPages,
    dismissible
  }
`
