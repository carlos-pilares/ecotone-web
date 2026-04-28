import type { SoqtapataResources } from '@/data/soqtapataExperienceLocal'

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export function ExperienceResourcesSoqtapata({ data }: { data: SoqtapataResources }) {
  return (
    <section className="content-section bg-warm fade" id="resources">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        {data.lead ? (
          <p className="body" style={{ fontSize: 14, maxWidth: 560, marginBottom: 16, color: 'var(--n700)' }}>
            {data.lead}
          </p>
        ) : null}
        <div className="downloads-grid">
          {data.cards.map((card) => {
            if (card.kind === 'map') {
              return (
                <div className="download-card" key="map">
                  <div className="download-preview">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 300 100"
                      style={{ background: 'linear-gradient(135deg,#e8f0d8,#c8d8a0)' }}
                    >
                      <path
                        d="M0 50 Q75 30 150 50 Q225 70 300 50"
                        fill="none"
                        stroke="rgba(40,80,20,.25)"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M0 38 Q75 18 150 38 Q225 58 300 38"
                        fill="none"
                        stroke="rgba(40,80,20,.2)"
                        strokeWidth="1"
                      />
                      <path
                        d="M0 62 Q75 42 150 62 Q225 82 300 62"
                        fill="none"
                        stroke="rgba(40,80,20,.2)"
                        strokeWidth="1"
                      />
                      <path
                        d="M0 26 Q75 6 150 26 Q225 46 300 26"
                        fill="none"
                        stroke="rgba(40,80,20,.15)"
                        strokeWidth="1"
                      />
                      <circle cx="150" cy="50" r="5" fill="#906730" opacity=".9" />
                      <circle cx="150" cy="50" r="10" fill="none" stroke="#906730" strokeWidth="1.5" opacity=".3" />
                      <text x="162" y="49" fontSize="9" fill="#563B12" fontFamily="system-ui" fontWeight="600">
                        Soqtapata
                      </text>
                      <text x="162" y="59" fontSize="7" fill="#906730" fontFamily="system-ui">
                        1,200 m
                      </text>
                    </svg>
                  </div>
                  <div className="download-body">
                    <div className="download-title">{card.title}</div>
                    <div className="download-meta">{card.meta}</div>
                    <a href={card.downloadHref} className="download-btn">
                      <DownloadIcon />
                      {card.downloadLabel}
                    </a>
                  </div>
                </div>
              )
            }
            if (card.kind === 'brochure') {
              return (
                <div className="download-card brochure" key="brochure">
                  <div
                    className="download-preview"
                    style={{
                      background: 'linear-gradient(145deg,var(--brown-xdk),var(--brown-dk))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <svg width="24" height="23" viewBox="0 0 105 101" fill="none">
                      <path
                        d="M103.703 59.25C102.343 49.75 97.3635 41.34 89.6735 35.59C89.3235 35.33 88.9635 35.07 88.6035 34.82C88.0135 15.52 72.1235 0 52.6835 0C33.6535 0 18.0434 14.86 16.8234 33.58C11.1834 37.11 6.62343 42.15 3.64343 48.28C-0.556567 56.91 -1.14654 66.66 1.98346 75.74C5.11346 84.81 11.5934 92.13 20.2234 96.33C25.2034 98.75 30.5535 99.98 35.9235 99.98C39.8735 99.98 43.8335 99.32 47.6735 98C49.0635 97.52 50.4034 96.96 51.7134 96.33L51.9534 96.46C56.9534 98.99 62.4335 100.31 68.0535 100.31C69.7735 100.31 71.5035 100.19 73.2335 99.94C82.7335 98.58 91.1434 93.6 96.8934 85.91C102.643 78.22 105.063 68.75 103.703 59.25Z"
                        fill="#ECE5D5"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        color: 'rgba(236,229,213,.65)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Soqtapata · 3D/2N
                    </span>
                  </div>
                  <div className="download-body">
                    <div className="download-title">{card.title}</div>
                    <div className="download-meta">{card.meta}</div>
                    <a href={card.downloadHref} className="download-btn">
                      <DownloadIcon />
                      {card.downloadLabel}
                    </a>
                  </div>
                </div>
              )
            }
            return (
              <div className="download-card" key="terms-pdf">
                <div
                  className="download-preview"
                  style={{
                    background: 'linear-gradient(160deg,var(--n50),var(--n100))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--brown)"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="14" y2="17" />
                  </svg>
                </div>
                <div className="download-body">
                  <div className="download-title">{card.title}</div>
                  <div className="download-meta">{card.meta}</div>
                  <a
                    href={card.downloadHref}
                    className="download-btn"
                    data-terms-pdf
                    download
                  >
                    <DownloadIcon />
                    {card.downloadLabel}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
