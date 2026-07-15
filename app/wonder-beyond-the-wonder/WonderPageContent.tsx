'use client'

import { WBTW_LOGO_LIGHT } from './wonder-brand'
import { WonderCampaignFooter } from './WonderCampaignFooter'
import { WonderCampaignProvider } from './WonderCampaignContext'
import { WonderCtaButton } from './WonderCtaButton'
import {
  IconGuide,
  IconItinerary,
  IconLandscape,
  IconStory,
} from './WonderIcons'
import { WonderJourneyCardImage, WonderResponsiveImage } from './WonderResponsiveImage'
import { WonderTravelFitModal } from './WonderTravelFitModal'
import {
  WBTW_BENEFIT_IMAGES,
  WBTW_CLOSE_IMAGES,
  WBTW_EDITORIAL_IMAGES,
  WBTW_HERO_IMAGES,
  WBTW_JOURNEY_CARD_IMAGES,
  WBTW_WHY_CARD_IMAGES,
} from './wonder-images'

const LOGO = WBTW_LOGO_LIGHT

const STEPS = [
  {
    n: '01',
    title: 'Tell us your plans',
    body: 'Share a few details about your 2026 Peru trip, travel dates and travel style.',
  },
  {
    n: '02',
    title: 'We match your journey',
    body: 'Our team reviews your answers and identifies the Ecotone Experience that best fits your trip.',
  },
  {
    n: '03',
    title: 'Unlock your benefit',
    body: 'If eligible, you may receive an exclusive direct-booking benefit on selected 2026 Ecotone Experiences.',
  },
] as const

const JOURNEYS = [
  {
    title: 'Wonder Beyond the Wonder',
    label: 'For curious travellers',
    body: 'Cloud forest, wildlife and conservation stories for travellers looking for a deeper Peru journey.',
    image: WBTW_JOURNEY_CARD_IMAGES.wonder,
  },
  {
    title: 'Family Quest Beyond Machu Picchu',
    label: 'For families',
    body: 'A meaningful nature experience for families who want children to discover wildlife, forest learning and adventure.',
    image: WBTW_JOURNEY_CARD_IMAGES.family,
  },
  {
    title: 'Wildlife & Photography',
    label: 'For nature observers',
    body: 'Birds, forest life, landscapes and rare encounters for travellers who want biodiversity to be part of the trip.',
    image: WBTW_JOURNEY_CARD_IMAGES.wildlife,
  },
] as const

const WHY_CARDS = [
  {
    title: 'Deeper connection',
    body: 'Step into places where nature and culture thrive in balance.',
    image: WBTW_WHY_CARD_IMAGES.connection,
  },
  {
    title: 'Meaningful impact',
    body: 'Support conservation stories and communities that protect these places.',
    image: WBTW_WHY_CARD_IMAGES.impact,
  },
  {
    title: 'Richer perspective',
    body: 'Experience the many faces of Peru with time to truly connect.',
    image: WBTW_WHY_CARD_IMAGES.perspective,
  },
] as const

const BENEFIT_INCLUDES = [
  { text: 'Stay closer to the forest', Icon: IconLandscape },
  { text: 'Explore with local guides', Icon: IconGuide },
  { text: 'Follow conservation stories', Icon: IconStory },
  { text: 'Travel through Tropical Andes landscapes', Icon: IconLandscape },
  { text: 'Fit it around Cusco and Machu Picchu', Icon: IconItinerary },
] as const

function WonderPageInner() {
  return (
    <main className="wbtw-page">
      {/* Hero */}
      <section className="wbtw-hero" aria-labelledby="wbtw-hero-title">
        <header className="wbtw-topbar">
          <div className="wbtw-container wbtw-topbar-inner">
            <a
              href="https://www.ecotone.eco/"
              className="wbtw-logo-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ecotone home"
            >
              <span className="wbtw-logo-wrap">
                <img
                  src={LOGO}
                  alt="Ecotone"
                  className="wbtw-logo-img wbtw-logo-img--light"
                  width={184}
                  height={57}
                  decoding="async"
                />
              </span>
            </a>
            <WonderCtaButton variant="nav" className="wbtw-topbar-cta" ctaLocation="header">
              Check my travel fit
            </WonderCtaButton>
          </div>
        </header>
        <div className="wbtw-hero-bg" aria-hidden>
          <WonderResponsiveImage manifest={WBTW_HERO_IMAGES} priority sizes="100vw" />
          <div className="wbtw-hero-overlay" />
          <div className="wbtw-hero-overlay-bottom" />
        </div>
        <div className="wbtw-container">
          <div className="wbtw-hero-inner">
            <p className="wbtw-eyebrow">Travelling to Peru in 2026?</p>
            <h1 id="wbtw-hero-title" className="wbtw-hero-title">
              <span className="wbtw-hero-title-line">
                Go <strong className="wbtw-hero-beyond">beyond</strong>
              </span>
              <span className="wbtw-hero-title-line wbtw-nowrap">Machu Picchu</span>
            </h1>
            <p className="wbtw-hero-lead">
              Machu Picchu may be the wonder that brings you to Peru.
              <br />
              But beyond it, <strong className="wbtw-emphasis">another wonder is alive</strong>.
            </p>
            <p className="wbtw-hero-support">Cloud forests. Wildlife. Conservation stories. The road to Manu.</p>
            <p className="wbtw-benefit-line">
              Tell us about your Peru plans and be considered for exclusive direct-booking benefits on selected 2026
              Ecotone Experiences.
            </p>
            <WonderCtaButton className="wbtw-hero-cta" ctaLocation="hero">
              Check my travel fit
            </WonderCtaButton>
            <p className="wbtw-small-note">For travellers planning Peru in 2026 or early 2027.</p>
            <ul className="wbtw-chips" aria-label="Journey highlights">
              <li>Cloud forest</li>
              <li>Wildlife</li>
              <li>Conservation stories</li>
              <li>4-night experience</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cinematic editorial */}
      <section id="wbtw-idea" className="wbtw-cinematic wbtw-cinematic--editorial" aria-labelledby="wbtw-idea-title">
        <div className="wbtw-cinematic-bg" aria-hidden>
          <WonderResponsiveImage manifest={WBTW_EDITORIAL_IMAGES} sizes="100vw" />
          <div className="wbtw-cinematic-overlay" />
          <div className="wbtw-cinematic-glow" aria-hidden />
        </div>
        <div className="wbtw-container wbtw-cinematic-shell">
          <div className="wbtw-cinematic-content">
            <p className="wbtw-eyebrow">Wonder beyond the wonder</p>
            <h2 id="wbtw-idea-title" className="wbtw-section-title wbtw-section-title--bold wbtw-cinematic-headline">
              Peru doesn&apos;t end at Machu Picchu
            </h2>
            <p className="wbtw-editorial-lead">
              Beyond the classic trail lies <strong>another Peru — untamed, biodiverse and deeply human</strong>.
            </p>
            <p className="wbtw-editorial-body">
              From cloud forests alive with wildlife to conservation stories unfolding on the ground, Ecotone helps
              travellers add a deeper nature experience to their Peru journey.
            </p>
            <p className="wbtw-closing-line">
              <span className="wbtw-closing-accent" aria-hidden />
              This is where wonder becomes connection.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="wbtw-how" className="wbtw-section wbtw-section--how">
        <div className="wbtw-how-atmosphere" aria-hidden />
        <div className="wbtw-container">
          <div className="wbtw-section-head wbtw-section-head--center wbtw-how-head">
            <h2 className="wbtw-section-title wbtw-section-title--bold wbtw-how-title">How it works</h2>
            <p className="wbtw-section-intro wbtw-how-intro">
              Complete a short travel-fit form and our team will help match you with the right Ecotone Experience for
              your Peru journey.
            </p>
          </div>
          <ol className="wbtw-how-steps">
            {STEPS.map((step, index) => (
              <li
                key={step.n}
                className={`wbtw-how-step${index === 1 ? ' wbtw-how-step--accent' : ''}`}
              >
                <span className="wbtw-how-step-num" aria-hidden>
                  {step.n}
                </span>
                <div className="wbtw-how-step-content">
                  <h3 className="wbtw-how-step-title">{step.title}</h3>
                  <p className="wbtw-how-step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="wbtw-how-cta">
            <WonderCtaButton ctaLocation="how_it_works">Check my travel fit</WonderCtaButton>
          </div>
        </div>
      </section>

      {/* Journey types */}
      <section id="wbtw-journeys" className="wbtw-section wbtw-section--journeys">
        <div className="wbtw-container">
          <div className="wbtw-section-head wbtw-section-head--center">
            <p className="wbtw-eyebrow">Choose your experience style</p>
            <h2 className="wbtw-section-title wbtw-section-title--bold">
              Find the Ecotone Experience that fits your Peru trip
            </h2>
            <p className="wbtw-section-intro">
              Your answers help us recommend the right 4-night experience beyond Machu Picchu — whether you are travelling
              as a couple, a family, with friends or for wildlife and photography.
            </p>
          </div>
          <ul className="wbtw-journey-cards">
            {JOURNEYS.map((card) => (
              <li key={card.title} className="wbtw-journey-card">
                <div className="wbtw-journey-card-media">
                  <WonderJourneyCardImage image={card.image} />
                  <div className="wbtw-journey-card-gradient" aria-hidden />
                </div>
                <div className="wbtw-journey-card-content">
                  <p className="wbtw-journey-card-label">{card.label}</p>
                  <h3 className="wbtw-journey-card-title">{card.title}</h3>
                  <p className="wbtw-journey-card-body">{card.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="wbtw-section-cta">
            <WonderCtaButton ctaLocation="experience_section">Check my travel fit</WonderCtaButton>
          </div>
        </div>
      </section>

      {/* Benefit */}
      <section id="wbtw-benefit" className="wbtw-section wbtw-section--benefit">
        <div className="wbtw-benefit-bg" aria-hidden>
          <WonderResponsiveImage manifest={WBTW_BENEFIT_IMAGES} sizes="100vw" />
          <div className="wbtw-benefit-overlay" />
          <div className="wbtw-benefit-warm" aria-hidden />
          <div className="wbtw-benefit-vignette" aria-hidden />
          <div className="wbtw-benefit-atmosphere" />
        </div>
        <div className="wbtw-container">
          <div className="wbtw-benefit-layout">
            <div className="wbtw-benefit-head">
              <h2 className="wbtw-section-title wbtw-section-title--bold wbtw-benefit-title">
                Your 2026 benefit can unlock more of Peru
              </h2>
              <p className="wbtw-section-intro wbtw-benefit-intro-text">
                Eligible travellers may receive a special direct-booking benefit for a 4-night Ecotone Experience beyond
                Machu Picchu, available on selected 2026 dates.
              </p>
            </div>
            <div className="wbtw-benefit-offer" aria-label="Up to 50% off selected 2026 Ecotone Experiences">
              <div className="wbtw-benefit-offer-glow" aria-hidden />
              <div className="wbtw-benefit-offer-stack">
                <span className="wbtw-benefit-offer-prefix">Up to</span>
                <span className="wbtw-benefit-offer-pct">50%</span>
                <span className="wbtw-benefit-offer-suffix">off</span>
              </div>
              <p className="wbtw-benefit-offer-detail">selected 2026 Ecotone Experiences</p>
            </div>
            <div className="wbtw-benefit-body">
              <p className="wbtw-benefit-list-label">What it can apply to</p>
              <ul className="wbtw-benefit-items">
                {BENEFIT_INCLUDES.map((item) => (
                  <li key={item.text}>
                    <item.Icon className="wbtw-benefit-item-icon" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="wbtw-small-note wbtw-small-note--muted wbtw-benefit-note">
                Flights are not included. Benefits are subject to availability and campaign conditions.
              </p>
              <WonderCtaButton className="wbtw-benefit-cta" ctaLocation="benefit_section">
                Check my travel fit
              </WonderCtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* Why — ivory with image cards */}
      <section className="wbtw-section wbtw-section--why">
        <div className="wbtw-why-band" aria-hidden>
          <WonderResponsiveImage manifest={WBTW_EDITORIAL_IMAGES} sizes="100vw" />
          <div className="wbtw-why-band-overlay" />
        </div>
        <div className="wbtw-container">
          <header className="wbtw-why-head">
            <p className="wbtw-why-eyebrow">Why go beyond</p>
            <h2 className="wbtw-why-title">
              <span className="wbtw-why-title-line">Why go beyond</span>
              <span className="wbtw-why-title-line">Machu Picchu?</span>
            </h2>
          </header>
          <ul className="wbtw-why-grid">
            {WHY_CARDS.map((card) => (
              <li key={card.title} className="wbtw-why-card">
                <div className="wbtw-why-card-media">
                  <WonderJourneyCardImage image={card.image} />
                  <div className="wbtw-why-card-gradient" aria-hidden />
                </div>
                <div className="wbtw-why-card-body-wrap">
                  <h3 className="wbtw-why-card-title">{card.title}</h3>
                  <p className="wbtw-why-card-body">{card.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wbtw-cinematic wbtw-cinematic--close" aria-labelledby="wbtw-close-title">
        <div className="wbtw-cinematic-bg" aria-hidden>
          <WonderResponsiveImage manifest={WBTW_CLOSE_IMAGES} sizes="100vw" />
          <div className="wbtw-cinematic-overlay wbtw-cinematic-overlay--close" />
          <div className="wbtw-close-warm" aria-hidden />
          <div className="wbtw-close-vignette" aria-hidden />
        </div>
        <div className="wbtw-container">
          <div className="wbtw-close-content">
            <h2 id="wbtw-close-title" className="wbtw-section-title wbtw-section-title--bold wbtw-close-title">
              Ready to go beyond Machu Picchu?
            </h2>
            <p className="wbtw-close-copy">
              Tell us about your Peru plans and we&apos;ll help match you with the Ecotone Experience that fits your
              journey — including any 2026 benefit that may apply.
            </p>
            <WonderCtaButton className="wbtw-close-cta" ctaLocation="final_cta">
              Check my travel fit
            </WonderCtaButton>
            <p className="wbtw-small-note wbtw-close-trust">
              No commitment required. We&apos;ll only use your answers to follow up with relevant options.
            </p>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="wbtw-section wbtw-section--legal" aria-labelledby="wbtw-conditions-title">
        <div className="wbtw-container wbtw-legal-inner">
          <h2 id="wbtw-conditions-title" className="wbtw-legal-title">
            Campaign conditions
          </h2>
          <p className="wbtw-legal-copy">
            Benefits apply to selected 4-night Ecotone Experiences on selected 2026 dates. Valid for direct B2C
            bookings only. Subject to availability. International and domestic flights are not included. Benefits cannot
            be combined with other promotions. Travellers who are not selected for the highest campaign benefit may
            still receive an exclusive direct-booking offer after completing the form.
          </p>
        </div>
      </section>

      <WonderCampaignFooter />

      <WonderTravelFitModal />
    </main>
  )
}

export function WonderPageContent() {
  return (
    <WonderCampaignProvider>
      <WonderPageInner />
    </WonderCampaignProvider>
  )
}
