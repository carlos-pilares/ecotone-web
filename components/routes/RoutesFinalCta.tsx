function TrustIcon({ kind }: { kind: 'shield' | 'check' | 'heart' }) {
  if (kind === 'shield') {
    return (
      <svg className="routes-final-cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3 5 6v6c0 5 3.5 9 7 10 3.5-1 7-5 7-10V6l-7-3Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'check') {
    return (
      <svg className="routes-final-cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20 6 9 17l-5-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg className="routes-final-cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  )
}

export function RoutesFinalCta({
  data,
}: {
  data: {
    sectionId: string
    eyebrow: string
    h2: string
    body: string
    whatsappHref: string
    whatsappLabel: string
    whatsappRel?: string
    secondaryHref: string
    secondaryLabel: string
    secondaryRel?: string
    secondaryOpenInNewTab?: boolean
    trustItems: { label: string; icon: 'shield' | 'check' | 'heart' }[]
  }
}) {
  const showWa = Boolean(data.whatsappHref?.trim() && data.whatsappLabel?.trim())
  const showSecondary = Boolean(data.secondaryHref?.trim() && data.secondaryLabel?.trim())

  return (
    <section className="routes-final-cta fade" id={data.sectionId} aria-labelledby="routes-final-cta-heading">
      <div className="content-inner routes-final-cta-inner">
        <p className="routes-final-cta-eyebrow">{data.eyebrow}</p>
        <h2 id="routes-final-cta-heading" className="routes-final-cta-h2">
          {data.h2}
        </h2>
        <p className="routes-final-cta-body">{data.body}</p>
        {showWa || showSecondary ? (
          <div className="routes-final-cta-actions">
            {showWa ? (
              <a
                href={data.whatsappHref}
                className="btn routes-final-cta-wa"
                target="_blank"
                rel={data.whatsappRel || 'noopener noreferrer'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                {data.whatsappLabel}
              </a>
            ) : null}
            {showSecondary ? (
              <a
                href={data.secondaryHref}
                className="btn routes-final-cta-secondary"
                {...(data.secondaryOpenInNewTab
                  ? { target: '_blank' as const, rel: data.secondaryRel || 'noopener noreferrer' }
                  : {})}
              >
                {data.secondaryLabel}
              </a>
            ) : null}
          </div>
        ) : null}
        <div className="routes-trust-strip" role="list">
          {data.trustItems.map((t) => (
            <div key={t.label} className="routes-trust-item" role="listitem">
              <TrustIcon kind={t.icon} />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
