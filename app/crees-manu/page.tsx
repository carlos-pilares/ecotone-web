import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import '../experiences/experience-surface.css'
import './crees-manu-surface.css'

import { CreesResponsiveBackgroundImage } from './CreesResponsiveBackgroundImage'
import { CREES_CLOSING_IMAGES, CREES_HERO_IMAGES } from './crees-manu-images'

export const metadata: Metadata = {
  title: 'CREES Manu and Ecotone | A New Chapter',
  description:
    'CREES Manu and Ecotone have joined forces to expand conservation, field learning and regenerative travel in the Peruvian Amazon.',
}

const LOGO_LOCKUP = '/crees-manu/logo-lockup.png'

const MISSION_CARDS = [
  {
    title: 'Long-term Conservation',
    body: 'Decades of stewardship in Manu, protecting biodiversity, supporting communities, and keeping the forest at the centre of every decision.',
    image: '/crees-manu/mission-long-term-conservation.png',
    imagePosition: 'center 58%',
  },
  {
    title: 'Field-Based Learning',
    body: 'Immersive programmes where people learn beside researchers and conservationists, not from a distance, but inside the living forest.',
    image: '/crees-manu/mission-field-based-learning.png',
    imagePosition: '62% 45%',
  },
  {
    title: 'Science & Impact',
    body: 'Research, monitoring and applied science that inform real conservation outcomes and a wider platform to carry that work further.',
    image: '/crees-manu/mission-science-impact.png',
    imagePosition: '42% 50%',
  },
] as const

const PATH_CARDS = [
  {
    title: 'Conservation Internship',
    body: 'Field-based conservation training in the Peruvian Amazon.',
    cta: 'Explore internship',
    href: '/experiences/conservation-internship',
    image: '/crees-manu/path-conservation-internship.png',
    imagePosition: '40% 35%',
  },
  {
    title: 'Conservation Volunteer',
    body: 'Hands-on conservation and research experience in Manu.',
    cta: 'Explore volunteer programme',
    href: '/experiences/conservation-volunteer',
    image: '/crees-manu/path-conservation-volunteer.png',
    imagePosition: '48% 50%',
  },
  {
    title: 'Discover Ecotone',
    body: 'Learn about Ecotone’s wider platform for conservation, science and immersive travel.',
    cta: 'Visit Ecotone home',
    href: '/',
    image: '/crees-manu/path-discover-ecotone.png',
    imagePosition: 'center 42%',
  },
] as const

function CreesLogoImage({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    // Served unoptimized so Next.js image pipeline preserves PNG alpha transparency.
    <Image
      src={LOGO_LOCKUP}
      alt="Ecotone and CREES Manu"
      width={1024}
      height={209}
      className={className}
      priority={priority}
      unoptimized
    />
  )
}

function CreesMediaImage({
  src,
  alt,
  className,
  style,
  priority,
  sizes,
}: {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  priority?: boolean
  sizes?: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      style={style}
      sizes={sizes ?? '(max-width: 900px) 100vw, 33vw'}
      priority={priority}
    />
  )
}

export default function CreesManuPage() {
  return (
    <EcotoneV2Client solidMainNav>
      <div className="crees-manu-page">
        <IsotipoDefs />
        <SiteHeader />

        <header className="crees-hero fade in">
          <div className="crees-hero-bg" aria-hidden>
            <CreesResponsiveBackgroundImage manifest={CREES_HERO_IMAGES} priority />
          </div>
          <div className="crees-hero-overlay" aria-hidden />
          <div className="crees-hero-lockup" aria-label="CREES Manu and Ecotone">
            <CreesLogoImage className="crees-hero-lockup-img" priority />
          </div>
          <div className="crees-hero-inner">
            <div className="crees-hero-lockup-spacer" aria-hidden />

            <p className="crees-hero-eyebrow">A new chapter</p>
            <h1 className="crees-hero-h1">CREES Manu and Ecotone have joined forces.</h1>
            <p className="crees-hero-lead">
              Building on CREES&apos; decades of conservation, research and field-learning experience in
              Manu, this new chapter brings our work together under one shared platform for greater
              impact.
            </p>
            <p className="crees-hero-note">You have been redirected from CREES Manu.</p>
          </div>
        </header>

        <section
          className="content-section crees-mission-section bg-warm fade"
          aria-labelledby="crees-mission-heading"
        >
          <div className="content-inner">
            <div className="crees-section-head crees-section-head--center">
              <div className="eyebrow">Our shared purpose</div>
              <h2 id="crees-mission-heading" className="h2">
                The mission continues with greater reach.
              </h2>
            </div>
            <p className="crees-section-lead crees-section-lead--center">
              For years, CREES Manu has helped connect people with conservation in one of the most
              biodiverse places on Earth. Together with Ecotone, that experience now becomes part of a
              wider platform for conservation-led learning, science and regenerative travel.
            </p>
            <div className="crees-mission-cards">
              {MISSION_CARDS.map((card) => (
                <article key={card.title} className="crees-mission-card">
                  <div className="crees-mission-card-media">
                    <CreesMediaImage
                      src={card.image}
                      alt=""
                      className="crees-media"
                      style={{ objectPosition: card.imagePosition }}
                    />
                  </div>
                  <div className="crees-mission-card-body">
                    <h3 className="crees-mission-card-title">{card.title}</h3>
                    <p className="crees-mission-card-text">{card.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="crees-path-section fade" aria-labelledby="crees-path-heading">
          <div className="content-inner">
            <div className="crees-section-head">
              <div className="eyebrow">Where to next</div>
              <h2 id="crees-path-heading" className="h2">
                Choose your next step
              </h2>
              <p className="crees-section-lead" style={{ marginTop: 12 }}>
                The programmes, knowledge and conservation legacy you trusted in CREES Manu continue
                here, with new ways to go deeper.
              </p>
            </div>
            <div className="crees-path-grid">
              {PATH_CARDS.map((card) => (
                <article key={card.title} className="crees-path-card">
                  <div className="crees-mission-card-media crees-path-card-media">
                    <CreesMediaImage
                      src={card.image}
                      alt=""
                      className="crees-media"
                      style={{ objectPosition: card.imagePosition }}
                    />
                  </div>
                  <div className="crees-path-card-content">
                    <h3 className="crees-path-card-title">{card.title}</h3>
                    <p className="crees-path-card-body">{card.body}</p>
                    <Link href={card.href} className="btn btn-primary">
                      {card.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section crees-press-section fade" aria-labelledby="crees-press-heading">
          <div className="content-inner">
            <div className="crees-press-inner">
              <div className="eyebrow">Announcement</div>
              <h2 id="crees-press-heading" className="h2">
                Read the announcement
              </h2>
              <p className="crees-press-body">
                Read the full statement from founder Quinn Meyer on the vision behind the union between
                CREES Manu and Ecotone.
              </p>
              <a href="#" className="btn btn-secondary">
                Read the statement
              </a>
            </div>
          </div>
        </section>

        <section className="crees-closing fade" aria-label="Closing message">
          <div className="crees-closing-bg" aria-hidden>
            <CreesResponsiveBackgroundImage manifest={CREES_CLOSING_IMAGES} />
          </div>
          <div className="crees-closing-overlay" aria-hidden />
          <div className="crees-closing-inner">
            <div className="crees-closing-logos" aria-label="CREES Manu and Ecotone">
              <CreesLogoImage className="crees-closing-lockup-img" />
            </div>
            <blockquote className="crees-closing-quote">
              The forest remains at the centre. The experience continues.
            </blockquote>
            <p className="crees-closing-body">
              What you knew in CREES Manu, the field knowledge, the conservation commitment, the
              people who live this work every day, carries forward inside Ecotone. This is not an
              ending. It is the next step in a story that began in Manu and now reaches further.
            </p>
          </div>
        </section>

        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
