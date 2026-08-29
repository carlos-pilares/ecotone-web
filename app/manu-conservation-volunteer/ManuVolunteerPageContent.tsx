'use client'

import { PartnersBand } from '@/components/shared/PartnersBand'
import type { PartnerDoc } from '@/lib/queries'

import { WonderJourneyCardImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

import { ManuVolunteerBrandLogo } from './ManuVolunteerBrandLogo'
import { ManuVolunteerCampaignFooter } from './ManuVolunteerCampaignFooter'
import { ManuVolunteerCampaignProvider } from './ManuVolunteerCampaignContext'
import { ManuVolunteerCtaButton } from './ManuVolunteerCtaButton'
import { ManuVolunteerHeroImage } from './ManuVolunteerHeroImage'
import { ManuVolunteerMobileCardRail } from './ManuVolunteerMobileCardRail'
import { ManuVolunteerMobileHScrollRail } from './ManuVolunteerMobileHScrollRail'
import { ManuVolunteerPhotoCredit } from './ManuVolunteerPhotoCredit'
import { ManuVolunteerQualificationModal } from './ManuVolunteerQualificationModal'
import type { McvCollageImage, McvFieldworkCard, McvStaticImage } from './manu-volunteer-images'
import {
  MCV_ENJOY_COLLAGE,
  MCV_FIELDWORK_FEATURED,
  MCV_FIELDWORK_SUPPORT,
  MCV_OPPORTUNITY_IMAGE,
  MCV_SCIENCE_MAIN,
  MCV_SCIENCE_SUPPORT,
} from './manu-volunteer-images'

export type ManuVolunteerPartnersBandData = {
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  emptyMessage?: string | null
  partners: PartnerDoc[]
}

const REASONS = [
  {
    num: '01',
    title: 'Do something real.',
    body: 'Contribute to conservation and biodiversity monitoring in Manu.',
  },
  {
    num: '02',
    title: 'Live somewhere wild.',
    body: 'Spend four weeks immersed in the Manu rainforest.',
  },
  {
    num: '03',
    title: 'Find your people.',
    body: 'Share the experience with people who came for the same reason.',
  },
] as const

const HOW_STEPS = [
  {
    n: '01',
    title: 'Tell us about you',
    body: 'Answer a few quick questions.',
  },
  {
    n: '02',
    title: 'See what you qualify for',
    body: "We'll show you the available 2026 support.",
  },
  {
    n: '03',
    title: 'Choose your dates',
    body: 'See the full programme and pick the field dates that work for you.',
  },
] as const

const CTA_VISIBLE = 'See if you qualify'
const CTA_ARIA = 'See if you qualify for a 2026 supported place'

function FieldworkCardMedia({ card, sizes }: { card: McvFieldworkCard; sizes: string }) {
  if (card.staticSrc) {
    return (
      <img
        src={card.staticSrc}
        alt={card.alt}
        className="mcv-fieldwork-img"
        style={card.staticPosition ? { objectPosition: card.staticPosition } : undefined}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <WonderJourneyCardImage image={card} className="mcv-fieldwork-img" sizes={sizes} />
  )
}

function CollageImage({ item, sizes }: { item: McvCollageImage; sizes: string }) {
  if (item.staticSrc) {
    return (
      <img
        src={item.staticSrc}
        alt={item.alt}
        className="mcv-collage-img"
        style={item.staticPosition ? { objectPosition: item.staticPosition } : undefined}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return <WonderJourneyCardImage image={item} className="mcv-collage-img" sizes={sizes} />
}

function ScienceMedia({
  item,
  className,
  sizes,
}: {
  item: McvStaticImage
  className: string
  sizes: string
}) {
  if (item.basePath && item.sizes) {
    return (
      <WonderJourneyCardImage
        image={{
          basePath: item.basePath,
          sizes: item.sizes,
          width: item.width,
          height: item.height,
          alt: item.alt,
          objectPosition: item.objectPosition,
        }}
        className={className}
        sizes={sizes}
      />
    )
  }

  if (!item.src) return null

  return (
    <img
      src={item.src}
      alt={item.alt}
      className={className}
      style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
      loading="lazy"
      decoding="async"
    />
  )
}

function ManuVolunteerPageInner({ partnersBand }: { partnersBand: ManuVolunteerPartnersBandData }) {
  const showPartners =
    partnersBand.partners.length > 0 || Boolean(partnersBand.emptyMessage?.trim())

  return (
    <main className="mcv-page">
      {/* 01 — Hero */}
      <section className="mcv-hero" aria-labelledby="mcv-hero-title">
        <header className="mcv-topbar">
          <div className="mcv-container mcv-topbar-inner">
            <ManuVolunteerBrandLogo />
            <ManuVolunteerCtaButton
              variant="nav"
              className="mcv-topbar-cta"
              ctaLocation="header"
              ariaLabel={CTA_ARIA}
            >
              {CTA_VISIBLE}
            </ManuVolunteerCtaButton>
          </div>
        </header>

        <div className="mcv-hero-bg" aria-hidden>
          <ManuVolunteerHeroImage />
          <div className="mcv-hero-overlay" />
        </div>

        <div className="mcv-container mcv-hero-container">
          <div className="mcv-hero-inner">
            <h1 id="mcv-hero-title" className="mcv-hero-title">
              <span className="mcv-hero-title-join">Join the</span>
              <span className="mcv-hero-title-line mcv-hero-title-line--manu">Manu</span>
              <span className="mcv-hero-title-line mcv-hero-title-line--crew">Field Crew.</span>
            </h1>
            <div className="mcv-hero-action">
              <p className="mcv-hero-lead">
                Four weeks of conservation, rainforest life and people who care about nature as much as you
                do.
              </p>
              <ManuVolunteerCtaButton className="mcv-hero-cta" ctaLocation="hero" ariaLabel={CTA_ARIA}>
                {CTA_VISIBLE}
              </ManuVolunteerCtaButton>
              <p className="mcv-hero-offer" aria-label="Campaign availability">
                <span className="mcv-hero-offer-dot" aria-hidden="true" />
                <span className="mcv-hero-offer-text">
                  2026 supported places available · 2027 applications open
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — This isn't a tour */}
      <section className="mcv-section mcv-section--warm mcv-not-a-tour" aria-labelledby="mcv-not-a-tour-title">
        <div className="mcv-container">
          <div className="mcv-section-head mcv-not-a-tour-head">
            <h2 id="mcv-not-a-tour-title" className="mcv-display-title mcv-display-title--dark mcv-display-title--large">
              <span className="mcv-display-line">This isn&apos;t a tour.</span>
              <span className="mcv-display-line mcv-display-line--accent">It&apos;s conservation.</span>
            </h2>
            <p className="mcv-section-kicker">You won&apos;t just observe. You&apos;ll contribute.</p>
            <p className="mcv-section-support">Real field work. Real conservation. Real impact.</p>
          </div>
        </div>

        <div className="mcv-fieldwork-showcase">
          <div className="mcv-container mcv-fieldwork-showcase-inner">
            <article className="mcv-fieldwork-feature">
              <div className="mcv-fieldwork-feature-media">
                <div className="mcv-fieldwork-image">
                  <FieldworkCardMedia
                    card={MCV_FIELDWORK_FEATURED}
                    sizes="(min-width: 900px) min(1120px, 92vw), 100vw"
                  />
                </div>
                <div className="mcv-fieldwork-copy">
                  {MCV_FIELDWORK_FEATURED.photoCredit ? (
                    <ManuVolunteerPhotoCredit credit={MCV_FIELDWORK_FEATURED.photoCredit} />
                  ) : null}
                  <h3 className="mcv-fieldwork-title">{MCV_FIELDWORK_FEATURED.title}</h3>
                  <p className="mcv-fieldwork-caption">{MCV_FIELDWORK_FEATURED.caption}</p>
                </div>
              </div>
            </article>

            <ManuVolunteerMobileCardRail
              controlsLabel="Field activities"
              items={MCV_FIELDWORK_SUPPORT.map((card) => ({
                key: card.title,
                title: card.title,
                description: card.caption,
                credit: card.photoCredit ? (
                  <ManuVolunteerPhotoCredit credit={card.photoCredit} />
                ) : undefined,
                image: (
                  <FieldworkCardMedia
                    card={card}
                    sizes="(min-width: 900px) 22vw, 85vw"
                  />
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {showPartners ? (
        <PartnersBand
          className="mcv-partners-band"
          eyebrow={partnersBand.eyebrow}
          title={partnersBand.title}
          body={partnersBand.body}
          partners={partnersBand.partners}
          emptyMessage={partnersBand.emptyMessage}
        />
      ) : null}

      {/* 03 — Three reasons */}
      <section className="mcv-section mcv-section--dark mcv-reasons" aria-labelledby="mcv-reasons-title">
        <div className="mcv-container">
          <h2 id="mcv-reasons-title" className="mcv-section-title mcv-section-title--center mcv-section-title--large">
            Three reasons to join the crew
          </h2>
          <ul className="mcv-reasons-grid">
            {REASONS.map((item) => (
              <li key={item.title} className="mcv-reason-card">
                <span className="mcv-reason-num">{item.num}</span>
                <h3 className="mcv-reason-title">{item.title}</h3>
                <p className="mcv-reason-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Yes, you'll also enjoy it */}
      <section className="mcv-section mcv-section--warm mcv-enjoy" aria-labelledby="mcv-enjoy-title">
        <div className="mcv-container mcv-enjoy-shell">
          <div className="mcv-enjoy-copy">
            <h2 id="mcv-enjoy-title" className="mcv-display-title mcv-display-title--dark mcv-display-title--large">
              <span className="mcv-display-line">It&apos;s serious work.</span>
              <span className="mcv-display-line mcv-display-line--accent">
                It&apos;s also an incredible way to spend four weeks.
              </span>
            </h2>
            <p className="mcv-section-body">
              There is time to explore, slow down, enjoy the rainforest, build friendships and simply live
              somewhere extraordinary.
            </p>
            <p className="mcv-enjoy-tagline">
              Work hard. Live wild. Enjoy the people you&apos;re sharing it with.
            </p>
          </div>

          <ManuVolunteerMobileHScrollRail controlsLabel="Life in the Manu rainforest">
            <ul className="mcv-collage mcv-mobile-hscroll" aria-label="Life in the Manu rainforest">
              {MCV_ENJOY_COLLAGE.map((item) => (
                <li key={item.label} className="mcv-collage-item">
                  <article className="mcv-collage-card">
                    <div className="mcv-collage-frame mcv-hscroll-card-media">
                      <CollageImage item={item} sizes="(min-width: 900px) 28vw, 82vw" />
                    </div>
                    <h3 className="mcv-collage-title">{item.label}</h3>
                  </article>
                  {item.photoCredit ? (
                    <ManuVolunteerPhotoCredit
                      credit={item.photoCredit}
                      className="mcv-photo-credit--collage"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </ManuVolunteerMobileHScrollRail>
        </div>
      </section>

      {/* 05 — Real science. Real impact. */}
      <section className="mcv-section mcv-section--parchment mcv-science" aria-labelledby="mcv-science-title">
        <div className="mcv-container mcv-science-shell">
          <div className="mcv-science-copy">
            <h2 id="mcv-science-title" className="mcv-display-title mcv-display-title--dark mcv-display-title--large">
              <span className="mcv-display-line">Real science.</span>
              <span className="mcv-display-line mcv-display-line--accent">Real impact.</span>
            </h2>
            <p className="mcv-section-body">
              Your field work supports ongoing biodiversity monitoring and conservation in Manu, alongside
              the team protecting one of the world&apos;s most biodiverse landscapes.
            </p>
          </div>

          <div className="mcv-science-visuals">
            <div className="mcv-science-main">
              <ScienceMedia
                item={MCV_SCIENCE_MAIN}
                className="mcv-science-main-img"
                sizes="(min-width: 900px) 40vw, 100vw"
              />
              {MCV_SCIENCE_MAIN.label ? (
                <span className="mcv-science-label" aria-hidden="true">
                  {MCV_SCIENCE_MAIN.label}
                </span>
              ) : null}
            </div>
            <ul className="mcv-science-support">
              {MCV_SCIENCE_SUPPORT.map((item) => (
                <li key={item.label} className="mcv-science-support-item">
                  <div className="mcv-science-support-frame">
                    <ScienceMedia
                      item={item}
                      className="mcv-science-support-img"
                      sizes="(min-width: 900px) 22vw, 50vw"
                    />
                    {item.label ? (
                      <span className="mcv-science-label" aria-hidden="true">
                        {item.label}
                      </span>
                    ) : null}
                  </div>
                  {item.photoCredit ? (
                    <ManuVolunteerPhotoCredit
                      credit={item.photoCredit}
                      className="mcv-photo-credit--science"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 06 — 2026 opportunity */}
      <section className="mcv-section mcv-section--cream mcv-opportunity" aria-labelledby="mcv-opportunity-title">
        <div className="mcv-container">
          <div className="mcv-opportunity-band">
            <div className="mcv-opportunity-copy">
              <p className="mcv-opportunity-eyebrow">2026 supported places</p>
              <h2 id="mcv-opportunity-title" className="mcv-display-title mcv-display-title--dark mcv-display-title--large">
                Thinking about doing something meaningful in 2026?
              </h2>
              <p className="mcv-section-body">
                A limited number of supported places are available for selected 2026 departures.
              </p>
              <p className="mcv-opportunity-lead">Find out what support you qualify for.</p>
              <ManuVolunteerCtaButton
                variant="prominent"
                ctaLocation="opportunity"
                ariaLabel={CTA_ARIA}
              >
                {CTA_VISIBLE}
              </ManuVolunteerCtaButton>
              <p className="mcv-opportunity-note">Can&apos;t make 2026? 2027 applications are also open.</p>
            </div>
            <div className="mcv-opportunity-visual">
              <img
                src={MCV_OPPORTUNITY_IMAGE.src}
                alt={MCV_OPPORTUNITY_IMAGE.alt}
                className="mcv-opportunity-img"
                style={
                  MCV_OPPORTUNITY_IMAGE.objectPosition
                    ? { objectPosition: MCV_OPPORTUNITY_IMAGE.objectPosition }
                    : undefined
                }
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 07 — How it works */}
      <section className="mcv-section mcv-section--warm mcv-how" aria-labelledby="mcv-how-title">
        <div className="mcv-container">
          <h2 id="mcv-how-title" className="mcv-section-title mcv-section-title--center mcv-section-title--large">
            How it works
          </h2>
          <ol className="mcv-how-steps">
            {HOW_STEPS.map((step) => (
              <li key={step.n} className="mcv-how-step">
                <span className="mcv-how-step-num">{step.n}</span>
                <h3 className="mcv-how-step-title">{step.title}</h3>
                <p className="mcv-how-step-body">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mcv-how-cta">
            <ManuVolunteerCtaButton
              variant="prominent"
              ctaLocation="how_it_works"
              ariaLabel={CTA_ARIA}
            >
              {CTA_VISIBLE}
            </ManuVolunteerCtaButton>
          </div>
        </div>
      </section>

      <ManuVolunteerCampaignFooter />
      <ManuVolunteerQualificationModal />
    </main>
  )
}

export function ManuVolunteerPageContent({
  partnersBand,
}: {
  partnersBand: ManuVolunteerPartnersBandData
}) {
  return (
    <ManuVolunteerCampaignProvider>
      <ManuVolunteerPageInner partnersBand={partnersBand} />
    </ManuVolunteerCampaignProvider>
  )
}
