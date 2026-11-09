'use client'

import Link from 'next/link'

import { PartnersBand } from '@/components/shared/PartnersBand'
import type { PartnerDoc } from '@/lib/queries'
import { trackMfc2027FullProgrammeClick } from '@/lib/trackMfc2027Analytics'

import { WonderJourneyCardImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'
import { ManuVolunteerHeroImage } from '../manu-conservation-volunteer/ManuVolunteerHeroImage'
import { ManuVolunteerMobileCardRail } from '../manu-conservation-volunteer/ManuVolunteerMobileCardRail'
import { ManuVolunteerMobileHScrollRail } from '../manu-conservation-volunteer/ManuVolunteerMobileHScrollRail'
import { ManuVolunteerPhotoCredit } from '../manu-conservation-volunteer/ManuVolunteerPhotoCredit'
import { ManuVolunteerStories } from '../manu-conservation-volunteer/ManuVolunteerStories'
import type {
  McvCollageImage,
  McvFieldworkCard,
  McvStaticImage,
} from '../manu-conservation-volunteer/manu-volunteer-images'
import {
  MCV_ENJOY_COLLAGE,
  MCV_FIELDWORK_FEATURED,
  MCV_FIELDWORK_SUPPORT,
  MCV_OPPORTUNITY_IMAGE,
  MCV_SCIENCE_MAIN,
  MCV_SCIENCE_SUPPORT,
} from '../manu-conservation-volunteer/manu-volunteer-images'

import { Mfc2027CampaignProvider } from './Mfc2027CampaignContext'
import { Mfc2027CtaLink } from './Mfc2027CtaLink'
import { Mfc2027LeadModal } from './Mfc2027LeadModal'
import { Mfc2027StickyHeader } from './Mfc2027StickyHeader'
import {
  MFC2027_CTA_SEE_DEPARTURES,
  MFC2027_DURATION_LABEL,
  MFC2027_EXPLORE_CV_LABEL,
  MFC2027_EXPLORE_CV_SUPPORT_SHORT,
  MFC2027_FULL_PROGRAMME_PATH,
  MFC2027_PRODUCT_CLARITY,
} from './mfc2027-campaign'

export type Mfc2027PartnersBandData = {
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
    title: 'See 2027 departures',
    body: 'Review all fixed Monday start dates for Manu Field Crew 2027.',
  },
  {
    n: '02',
    title: 'Choose your dates',
    body: 'Pick the 4-week departure that fits your calendar.',
  },
  {
    n: '03',
    title: 'Book on WeTravel',
    body: 'Check live availability, review the itinerary, and secure your place.',
  },
] as const

const CTA_ARIA = 'See 2027 Manu Field Crew departures'

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

function InlinePhotoCredit({ credit }: { credit?: string }) {
  if (!credit) return null
  return <ManuVolunteerPhotoCredit credit={credit} className="mfc2027-photo-credit" />
}

function Mfc2027PageInner({ partnersBand }: { partnersBand: Mfc2027PartnersBandData }) {
  const showPartners =
    partnersBand.partners.length > 0 || Boolean(partnersBand.emptyMessage?.trim())

  return (
    <main className="mcv-page mfc2027-page">
      <Mfc2027StickyHeader />

      <section className="mcv-hero" aria-labelledby="mfc2027-hero-title">
        <div className="mcv-hero-bg" aria-hidden>
          <ManuVolunteerHeroImage />
          <div className="mcv-hero-overlay" />
        </div>

        <div className="mcv-container mcv-hero-container">
          <div className="mcv-hero-inner">
            <h1 id="mfc2027-hero-title" className="mcv-hero-title">
              <span className="mcv-hero-title-join">Join the</span>
              <span className="mcv-hero-title-line mcv-hero-title-line--manu">Manu</span>
              <span className="mcv-hero-title-line mcv-hero-title-line--crew">Field Crew.</span>
            </h1>
            <div className="mcv-hero-action mfc2027-hero-action">
              <p className="mcv-hero-lead">
                Four weeks of conservation, rainforest life and people who care about nature as much
                as you do — with fixed 2027 Monday departures.
              </p>
              <p className="mfc2027-product-clarity">{MFC2027_PRODUCT_CLARITY}</p>
              <Mfc2027CtaLink
                className="mcv-hero-cta"
                variant="prominent"
                ctaLocation="hero"
                ariaLabel={CTA_ARIA}
              >
                {MFC2027_CTA_SEE_DEPARTURES}
              </Mfc2027CtaLink>
              <p className="mfc2027-hero-secondary">
                Looking for another programme length?{' '}
                <Link
                  href={MFC2027_FULL_PROGRAMME_PATH}
                  className="mfc2027-secondary-link mfc2027-secondary-link--on-hero"
                  onClick={() =>
                    trackMfc2027FullProgrammeClick({ cta_location: 'hero' })
                  }
                >
                  {MFC2027_EXPLORE_CV_LABEL}
                </Link>
              </p>
              <p className="mcv-hero-offer" aria-label="Campaign availability">
                <span className="mcv-hero-offer-dot" aria-hidden="true" />
                <span className="mcv-hero-offer-text">
                  2027 fixed departures open · Book directly on WeTravel
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mcv-section mcv-section--warm mcv-not-a-tour"
        aria-labelledby="mfc2027-not-a-tour-title"
      >
        <div className="mcv-container">
          <div className="mcv-section-head mcv-not-a-tour-head">
            <h2
              id="mfc2027-not-a-tour-title"
              className="mcv-display-title mcv-display-title--dark mcv-display-title--large"
            >
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
                <div className="mcv-fieldwork-image mfc2027-media-frame">
                  <FieldworkCardMedia
                    card={MCV_FIELDWORK_FEATURED}
                    sizes="(min-width: 900px) min(1120px, 92vw), 100vw"
                  />
                  <InlinePhotoCredit credit={MCV_FIELDWORK_FEATURED.photoCredit} />
                </div>
                <div className="mcv-fieldwork-copy">
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
                image: (
                  <div className="mfc2027-media-frame mfc2027-media-frame--fill">
                    <FieldworkCardMedia
                      card={card}
                      sizes="(min-width: 900px) 22vw, 85vw"
                    />
                    <InlinePhotoCredit credit={card.photoCredit} />
                  </div>
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

      <section
        className="mcv-section mcv-section--dark mcv-reasons"
        aria-labelledby="mfc2027-reasons-title"
      >
        <div className="mcv-container">
          <h2
            id="mfc2027-reasons-title"
            className="mcv-section-title mcv-section-title--center mcv-section-title--large"
          >
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
          <div className="mcv-section-cta mfc2027-section-cta">
            <Mfc2027CtaLink ctaLocation="reasons" ariaLabel={CTA_ARIA}>
              {MFC2027_CTA_SEE_DEPARTURES}
            </Mfc2027CtaLink>
          </div>
        </div>
      </section>

      <section
        className="mcv-section mcv-section--warm mcv-enjoy"
        aria-labelledby="mfc2027-enjoy-title"
      >
        <div className="mcv-container mcv-enjoy-shell">
          <div className="mcv-enjoy-copy mfc2027-copy-stack">
            <h2
              id="mfc2027-enjoy-title"
              className="mcv-display-title mcv-display-title--dark mcv-display-title--large"
            >
              <span className="mcv-display-line">It&apos;s serious work.</span>
              <span className="mcv-display-line mcv-display-line--accent">
                It&apos;s also an incredible way to spend four weeks.
              </span>
            </h2>
            <p className="mcv-section-body">
              There is time to explore, slow down, enjoy the rainforest, build friendships and simply
              live somewhere extraordinary.
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
                    <div className="mcv-collage-frame mcv-hscroll-card-media mfc2027-media-frame">
                      <CollageImage item={item} sizes="(min-width: 900px) 28vw, 82vw" />
                      <InlinePhotoCredit credit={item.photoCredit} />
                    </div>
                    <h3 className="mcv-collage-title">{item.label}</h3>
                  </article>
                </li>
              ))}
            </ul>
          </ManuVolunteerMobileHScrollRail>
        </div>
      </section>

      <ManuVolunteerStories />

      <section
        className="mcv-section mcv-section--parchment mcv-science"
        aria-labelledby="mfc2027-science-title"
      >
        <div className="mcv-container mcv-science-shell">
          <div className="mcv-science-copy mfc2027-copy-stack">
            <h2
              id="mfc2027-science-title"
              className="mcv-display-title mcv-display-title--dark mcv-display-title--large"
            >
              <span className="mcv-display-line">Real science.</span>
              <span className="mcv-display-line mcv-display-line--accent">Real impact.</span>
            </h2>
            <p className="mcv-section-body">
              Your field work supports ongoing biodiversity monitoring and conservation in Manu,
              alongside the team protecting one of the world&apos;s most biodiverse landscapes.
            </p>
            <Mfc2027CtaLink ctaLocation="science" ariaLabel={CTA_ARIA}>
              {MFC2027_CTA_SEE_DEPARTURES}
            </Mfc2027CtaLink>
          </div>

          <div className="mcv-science-visuals">
            <div className="mcv-science-main mfc2027-media-frame">
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
              <InlinePhotoCredit credit={MCV_SCIENCE_MAIN.photoCredit} />
            </div>
            <ul className="mcv-science-support">
              {MCV_SCIENCE_SUPPORT.map((item) => (
                <li key={item.label} className="mcv-science-support-item">
                  <div className="mcv-science-support-frame mfc2027-media-frame">
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
                    <InlinePhotoCredit credit={item.photoCredit} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="mcv-section mcv-section--cream mcv-opportunity mfc2027-opportunity"
        aria-labelledby="mfc2027-opportunity-title"
      >
        <div className="mcv-container">
          <div className="mcv-opportunity-band">
            <div className="mcv-opportunity-copy mfc2027-copy-stack mfc2027-opportunity-copy">
              <p className="mcv-opportunity-eyebrow">Manu Field Crew 2027</p>
              <h2
                id="mfc2027-opportunity-title"
                className="mcv-display-title mcv-display-title--dark mcv-display-title--large"
              >
                Ready for four weeks in the Manu rainforest?
              </h2>
              <p className="mcv-section-body">
                Choose a fixed Monday departure for the {MFC2027_DURATION_LABEL} programme at the
                Manu Learning Centre, then book and pay independently on WeTravel.
              </p>
              <p className="mcv-opportunity-lead">See every 2027 start date and continue to booking.</p>
              <Mfc2027CtaLink
                variant="prominent"
                ctaLocation="opportunity"
                ariaLabel={CTA_ARIA}
              >
                {MFC2027_CTA_SEE_DEPARTURES}
              </Mfc2027CtaLink>
              <p className="mfc2027-opportunity-alt">
                <span className="mfc2027-opportunity-alt__support">
                  {MFC2027_EXPLORE_CV_SUPPORT_SHORT}
                </span>{' '}
                <Link
                  href={MFC2027_FULL_PROGRAMME_PATH}
                  className="mfc2027-secondary-link"
                  onClick={() =>
                    trackMfc2027FullProgrammeClick({ cta_location: 'opportunity' })
                  }
                >
                  {MFC2027_EXPLORE_CV_LABEL}
                </Link>
              </p>
            </div>
            <div className="mcv-opportunity-visual mfc2027-media-frame">
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
              <InlinePhotoCredit credit={MCV_OPPORTUNITY_IMAGE.photoCredit} />
            </div>
          </div>
        </div>
      </section>

      <section
        className="mcv-section mcv-section--warm mcv-how"
        aria-labelledby="mfc2027-how-title"
      >
        <div className="mcv-container">
          <h2
            id="mfc2027-how-title"
            className="mcv-section-title mcv-section-title--center mcv-section-title--large"
          >
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
            <Mfc2027CtaLink
              variant="prominent"
              ctaLocation="how_it_works"
              ariaLabel={CTA_ARIA}
            >
              {MFC2027_CTA_SEE_DEPARTURES}
            </Mfc2027CtaLink>
          </div>
        </div>
      </section>

      <Mfc2027LeadModal />
    </main>
  )
}

export function Mfc2027PageContent({ partnersBand }: { partnersBand: Mfc2027PartnersBandData }) {
  return (
    <Mfc2027CampaignProvider>
      <Mfc2027PageInner partnersBand={partnersBand} />
    </Mfc2027CampaignProvider>
  )
}
