import type { LodgeBookCtaData } from '@/data/lodgeSoqtapataStatic'

import { ReserveCtaSection, type ReserveCtaCta } from '@/components/shared/ReserveCtaSection'

type LodgeBookCtaProps = {
  data: LodgeBookCtaData
}

export function LodgeBookCta({ data }: LodgeBookCtaProps) {
  const ctas: ReserveCtaCta[] = []
  const p = data.primaryCta
  if (p.href.trim() && p.label.trim()) {
    ctas.push({
      label: p.label.trim(),
      href: p.href.trim(),
      variant: 'primary',
      external: /^https?:/i.test(p.href) || p.href.startsWith('mailto:'),
    })
  }
  const s = data.secondaryCta
  if (s.href.trim() && s.label.trim()) {
    ctas.push({
      label: s.label.trim(),
      href: s.href.trim(),
      variant: 'secondary',
      external: true,
      whatsappIcon: true,
    })
  }

  return (
    <ReserveCtaSection
      id="book"
      sectionClassName="content-section bg-warm fade lodge-book-cta"
      titleId="lodge-book-heading"
      eyebrow={data.eyebrow}
      title={data.title}
      body={data.body}
      card={{
        priceLine: data.cardTitle,
        priceSuffix: data.cardPriceSuffix ?? '',
        subline: data.cardSubtitle,
        rows: data.rows.map((r) => ({ label: r.label, value: r.value })),
        ctas,
        termsHref: '/experiences/soqtapata-pristine-immersion#terms',
      }}
    />
  )
}
