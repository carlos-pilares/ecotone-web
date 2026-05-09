import type { SoqtapataBook } from '@/data/soqtapataExperienceLocal'

import { ReserveCtaSection, type ReserveCtaCta } from '@/components/shared/ReserveCtaSection'

export function ExperienceBookSoqtapata({ data }: { data: SoqtapataBook }) {
  const ctas: ReserveCtaCta[] = []
  const wt = data.wetravelUrl.trim()
  if (wt) {
    ctas.push({
      label: 'Book now',
      href: wt,
      variant: 'primary',
      external: true,
    })
  }
  const wa = data.whatsappUrl.trim()
  const waLab = data.whatsappLabel.trim()
  if (wa && waLab) {
    ctas.push({
      label: waLab,
      href: wa,
      variant: 'secondary',
      external: true,
      whatsappIcon: true,
    })
  }

  const termsHref = data.termsHash.trim() || undefined
  const trustIconCycle = ['shield', 'check', 'heart'] as const
  const trustItems = data.trustStripItems.map((t, i) => ({
    iconKey: trustIconCycle[i % trustIconCycle.length]!,
    text: t.text,
  }))

  return (
    <ReserveCtaSection
      id="book"
      titleId="experience-book-heading"
      eyebrow={data.eyebrow}
      title={data.h2}
      body={data.lead?.trim() ? data.lead : undefined}
      card={{
        priceLine: data.price,
        priceSuffix: data.priceSmall,
        subline: data.sub,
        rows: data.rows,
        ctas,
        termsHref,
        termsPrefixText: data.termsNote?.trim(),
        termsLinkLabel: data.termsLinkLabel?.trim(),
        termsSuffixText: '.',
        trustItems,
      }}
    />
  )
}
