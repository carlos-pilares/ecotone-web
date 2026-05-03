import { urlFor } from '@/lib/sanity'
import type { ExperienceFromSanity, HomePageDoc } from '@/lib/queries'
import { HeadlineBlock } from '@/components/HeadlineBlock'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import {
  HOME_EXPERIENCE_PROGRAM_BADGE,
  HOME_EXPERIENCE_PROGRAM_TO_FILTER,
  HOME_EXPERIENCE_ROUTE_LABEL,
} from '@/lib/homeExperienceCatalogLabels'
import { HOME_EXPLORER_DEFAULTS } from '@/lib/homeExplorerDefaults'

const IMG_PLACEHOLDER =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80'

function dataTypeFromProgram(programType: string | null | undefined): 'nature' | 'family' | 'learning' | 'tailor' {
  if (!programType) return 'nature'
  return HOME_EXPERIENCE_PROGRAM_TO_FILTER[programType] ?? 'nature'
}

function formatUsd(n: number) {
  return `USD ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function mainImageUrl(mainImage: ExperienceFromSanity['mainImage']): string {
  if (!mainImage) return IMG_PLACEHOLDER
  try {
    return String(urlFor(mainImage).width(900).quality(85).url())
  } catch {
    return IMG_PLACEHOLDER
  }
}

const CANONICAL_SOQTAPATA_PATH = '/experiences/soqtapata-pristine-immersion'

function slugLooksLikeSoqtapata(raw: string): boolean {
  return raw.toLowerCase().includes('soqtapata')
}

function tourHref(doc: Pick<ExperienceFromSanity, 'slug'>): string {
  const raw = doc.slug?.current?.trim()
  if (!raw) return '#'
  if (/^https?:\/\//i.test(raw)) return raw
  if (slugLooksLikeSoqtapata(raw)) return CANONICAL_SOQTAPATA_PATH
  const path = raw.replace(/^\//, '')
  if (path.startsWith('experiences/')) return `/${path}`
  return `/experiences/${path}`
}

type ExplorerGridCopy = ReturnType<typeof resolveExplorerGridCopy>

function resolveExplorerGridCopy(e: HomePageDoc | null | undefined) {
  const d = HOME_EXPLORER_DEFAULTS
  const booking = e?.bookingCta2Link?.trim() || ''
  return {
    priceEnquire: e?.explorerPriceEnquireLabel?.trim() || d.priceEnquire,
    priceCustom: e?.explorerPriceCustomLabel?.trim() || d.priceCustom,
    cardCtaView: e?.explorerCardCtaViewLabel?.trim() || d.cardCtaView,
    cardCtaEnquire: e?.explorerCardCtaEnquireLabel?.trim() || d.cardCtaEnquire,
    tailorRouteDuration: e?.explorerTailorRouteDurationLabel?.trim() || d.tailorRouteDurationLabel,
    tailorDescFallback: e?.explorerTailorDescriptionFallback?.trim() || d.tailorDescriptionFallback,
    tailorCta: e?.explorerTailorCtaText?.trim() || d.tailorCta,
    tailorWhatsapp: e?.explorerTailorWhatsappUrl?.trim() || booking || d.tailorWhatsappFallback,
    learningWhatsapp: booking || d.learningWhatsappFallback,
    nameFallbackTailor: d.nameFallbackTailor,
    nameFallbackBadge: d.nameFallbackBadge,
    learningBadges:
      e?.explorerLearningBadgeLabels && e.explorerLearningBadgeLabels.length > 0
        ? e.explorerLearningBadgeLabels
        : [...d.learningBadgeLabels],
  }
}

function priceLabel(doc: ExperienceFromSanity, copy: ExplorerGridCopy): { text: string; muted?: boolean } {
  if (doc.status === 'coming-soon') return { text: copy.priceEnquire }
  if (doc.programType === 'experiential-learning' && (doc.price == null || doc.price === 0)) {
    return { text: copy.priceCustom, muted: true }
  }
  if (doc.price != null && doc.price > 0) return { text: formatUsd(doc.price) }
  return { text: copy.priceEnquire }
}

const Arrow = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <line x1="2" y1="6" x2="10" y2="6" />
    <polyline points="7 3 10 6 7 9" />
  </svg>
)

function CmsGrid({ list, copy }: { list: ExperienceFromSanity[]; copy: ExplorerGridCopy }) {
  return (
    <>
      {list.map((doc) => {
        const dataType = dataTypeFromProgram(doc.programType)
        const isTailor = doc.programType === 'tailor-made'
        const badge = doc.programType
          ? HOME_EXPERIENCE_PROGRAM_BADGE[doc.programType] ?? copy.nameFallbackBadge
          : copy.nameFallbackBadge
        const route = doc.route ? HOME_EXPERIENCE_ROUTE_LABEL[doc.route] ?? doc.route : null
        const imageUrl = mainImageUrl(doc.mainImage)
        const desc = doc.shortDescription ?? ''
        const href = isTailor
          ? copy.tailorWhatsapp
          : doc.programType === 'experiential-learning'
            ? copy.learningWhatsapp
            : tourHref(doc)
        const price = priceLabel(doc, copy)

        if (isTailor) {
          return (
            <div className="exp-card-tailor" data-type="tailor" key={doc._id}>
              <div className="exp-card-tailor-img">
                <img src={imageUrl} alt={doc.name} />
                <div className="exp-card-overlay" />
                <span className="badge-type">{badge}</span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 9,
                    left: 9,
                    fontSize: 11,
                    fontWeight: 700,
                    background: 'rgba(144,103,48,.55)',
                    border: '1px solid rgba(212,170,114,.5)',
                    color: 'var(--b100)',
                    padding: '4px 10px',
                    borderRadius: 100,
                  }}
                >
                  {copy.tailorRouteDuration}
                </span>
              </div>
              <div className="exp-card-tailor-body">
                <div className="exp-card-tailor-title">{doc.name || copy.nameFallbackTailor}</div>
                <div className="exp-card-tailor-desc">{desc || copy.tailorDescFallback}</div>
                <a href={href} className="btn-tailor">
                  {copy.tailorCta}
                </a>
              </div>
            </div>
          )
        }

        return (
          <div className="exp-card" data-type={dataType} key={doc._id}>
            <div className="exp-card-img">
              <img src={imageUrl} alt={doc.name} />
              <div className="exp-card-overlay" />
              <span className="badge-type">{badge}</span>
              {doc.duration ? <span className="badge-dur">{doc.duration}</span> : null}
              {doc.programType === 'experiential-learning' ? (
                <div style={{ position: 'absolute', top: 9, right: 9, display: 'flex', gap: 3 }}>
                  {copy.learningBadges.slice(0, 3).map((label, bi) => (
                    <span
                      key={`${doc._id}-lb-${bi}`}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: 'var(--brown)',
                        color: '#fff',
                        padding: '4px 7px',
                        borderRadius: 100,
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
              {route ? <span className="badge-route">{route}</span> : null}
            </div>
            <div className="exp-card-body">
              <div className="exp-card-title">{doc.name}</div>
              <div className="exp-card-desc">{desc}</div>
              <div className="exp-card-foot">
                {price.muted ? (
                  <span style={{ fontSize: 12, fontWeight: 300, color: 'var(--n400)' }}>{price.text}</span>
                ) : (
                  <span className="exp-card-price">{price.text}</span>
                )}
                <a href={href} className="exp-card-cta">
                  {doc.programType === 'experiential-learning' ? copy.cardCtaEnquire : copy.cardCtaView}{' '}
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

function ExperiencesFallback({ explorer }: { explorer: HomePageDoc | null | undefined }) {
  const e = explorer
  const body =
    e?.explorerEmptyGridMessage?.trim() || homePageTextFields.explorerEmptyGridMessage
  const linkLabel =
    e?.explorerEmptyGridLinkLabel?.trim() || homePageTextFields.explorerEmptyGridLinkLabel
  const linkHref =
    e?.explorerEmptyGridLinkHref?.trim() || homePageTextFields.explorerEmptyGridLinkHref
  return (
    <p className="body" style={{ maxWidth: 560, gridColumn: '1 / -1' }}>
      {body}{' '}
      <a href={linkHref}>{linkLabel}</a>.
    </p>
  )
}

export function ExperiencesExplorer({
  experiences,
  explorer,
}: {
  experiences?: ExperienceFromSanity[] | null
  explorer?: HomePageDoc | null
}) {
  const fromCms = Array.isArray(experiences) && experiences.length > 0
  const e = explorer
  const gridCopy = resolveExplorerGridCopy(e)
  const filterTabs =
    e?.explorerFilterTabs && e.explorerFilterTabs.length > 0
      ? e.explorerFilterTabs
      : homePageTextFields.explorerFilterTabs

  return (
    <section className="sec" id="experiences">
      <div className="sec-inner">
        <div className="fade">
          <div className="eyebrow">{e?.explorerEyebrow ?? homePageTextFields.explorerEyebrow}</div>
          <HeadlineBlock
            text={e?.explorerHeadline ?? null}
            fallback={
              <>
                Choose how you
                <br />
                want to go deep
              </>
            }
          />
          <p className="body" style={{ maxWidth: 540, marginBottom: 0 }}>
            {e?.explorerSubheadline ?? homePageTextFields.explorerSubheadline}
          </p>
        </div>
        <div className="filter-tabs fade fade-d1" id="filterTabs">
          {filterTabs.map((tab, i) => {
            const key = tab.filterKey ?? `tab-${i}`
            const isTailor = tab.filterKey === 'tailor'
            return (
              <button
                key={key}
                type="button"
                className={'filter-tab' + (i === 0 ? ' active' : '') + (isTailor ? ' tailor' : '')}
                data-filter={tab.filterKey ?? 'all'}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="exp-grid fade fade-d2" id="expGrid">
          {fromCms && experiences ? <CmsGrid list={experiences} copy={gridCopy} /> : <ExperiencesFallback explorer={e} />}
        </div>
      </div>
    </section>
  )
}
