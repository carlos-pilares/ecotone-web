import { urlFor } from '@/lib/sanity'
import type { ExperienceFromSanity, HomePageDoc } from '@/lib/queries'
import { HeadlineBlock } from '@/components/HeadlineBlock'

const PROGRAM_TO_FILTER: Record<string, 'nature' | 'family' | 'learning' | 'tailor'> = {
  'nature-core': 'nature',
  'family-adventure': 'family',
  'experiential-learning': 'learning',
  'tailor-made': 'tailor',
}

const PROGRAM_BADGE: Record<string, string> = {
  'nature-core': 'Nature Core',
  'family-adventure': 'Family Adventure',
  'experiential-learning': 'Exp. Learning',
  'tailor-made': 'Tailor Made',
}

const ROUTE_LABEL: Record<string, string> = {
  camanti: 'Camanti Route',
  'manu-road': 'Manu Route',
  'manu-core': 'Manu Core',
}

const IMG_PLACEHOLDER =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80'

function dataTypeFromProgram(programType: string | null | undefined): 'nature' | 'family' | 'learning' | 'tailor' {
  if (!programType) return 'nature'
  return PROGRAM_TO_FILTER[programType] ?? 'nature'
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

function priceLabel(doc: ExperienceFromSanity): { text: string; muted?: boolean } {
  if (doc.status === 'coming-soon') return { text: 'Enquire' }
  if (doc.programType === 'experiential-learning' && (doc.price == null || doc.price === 0)) {
    return { text: 'Custom pricing', muted: true }
  }
  if (doc.price != null && doc.price > 0) return { text: formatUsd(doc.price) }
  return { text: 'Enquire' }
}

const Arrow = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <line x1="2" y1="6" x2="10" y2="6" />
    <polyline points="7 3 10 6 7 9" />
  </svg>
)

function CmsGrid({ list }: { list: ExperienceFromSanity[] }) {
  return (
    <>
      {list.map((doc) => {
        const dataType = dataTypeFromProgram(doc.programType)
        const isTailor = doc.programType === 'tailor-made'
        const badge = doc.programType ? (PROGRAM_BADGE[doc.programType] ?? 'Ecotone') : 'Ecotone'
        const route = doc.route ? (ROUTE_LABEL[doc.route] ?? doc.route) : null
        const imageUrl = mainImageUrl(doc.mainImage)
        const desc = doc.shortDescription ?? ''
        const href = isTailor
          ? 'https://wa.me/51974781094?text=I%20want%20to%20design%20a%20tailor%20made%20Ecotone%20experience'
          : doc.programType === 'experiential-learning'
            ? 'https://wa.me/51974781094'
            : tourHref(doc)
        const price = priceLabel(doc)

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
                  Any route · Any duration
                </span>
              </div>
              <div className="exp-card-tailor-body">
                <div className="exp-card-tailor-title">{doc.name || 'Tailor made'}</div>
                <div className="exp-card-tailor-desc">
                  {desc || 'We design every detail for your group.'}
                </div>
                <a href={href} className="btn-tailor">
                  Design my journey →
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
                <div
                  style={{ position: 'absolute', top: 9, right: 9, display: 'flex', gap: 3 }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'var(--brown)',
                      color: '#fff',
                      padding: '4px 7px',
                      borderRadius: 100,
                    }}
                  >
                    2w
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'var(--brown)',
                      color: '#fff',
                      padding: '4px 7px',
                      borderRadius: 100,
                    }}
                  >
                    4w
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'var(--brown)',
                      color: '#fff',
                      padding: '4px 7px',
                      borderRadius: 100,
                    }}
                  >
                    6w
                  </span>
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
                  {doc.programType === 'experiential-learning' ? 'Enquire' : 'View'} <Arrow />
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

function ExperiencesFallback() {
  return (
    <p className="body" style={{ maxWidth: 560, gridColumn: '1 / -1' }}>
      Experience programs are not available right now. When your CMS connection is working, they will
      appear here. You can still <a href="#book">plan a trip</a>.
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
  return (
    <section className="sec" id="experiences">
      <div className="sec-inner">
        <div className="fade">
          <div className="eyebrow">{e?.explorerEyebrow ?? 'Find your journey'}</div>
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
            {e?.explorerSubheadline ??
              '4 ways to travel with purpose. All-inclusive from Cusco. Filter by experience type.'}
          </p>
        </div>
        <div className="filter-tabs fade fade-d1" id="filterTabs">
          <button type="button" className="filter-tab active" data-filter="all">
            All
          </button>
          <button type="button" className="filter-tab" data-filter="nature">
            Nature Core
          </button>
          <button type="button" className="filter-tab" data-filter="family">
            Family Adventure
          </button>
          <button type="button" className="filter-tab" data-filter="learning">
            Exp. Learning
          </button>
          <button type="button" className="filter-tab tailor" data-filter="tailor">
            Tailor Made
          </button>
        </div>
        <div className="exp-grid fade fade-d2" id="expGrid">
          {fromCms && experiences ? <CmsGrid list={experiences} /> : <ExperiencesFallback />}
        </div>
      </div>
    </section>
  )
}
