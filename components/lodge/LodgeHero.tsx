'use client'

import Link from 'next/link'
import { Fragment } from 'react'

import type { LodgeHeroData } from '@/data/lodgeSoqtapataStatic'
import { openGallery } from '@/lib/galleryLightboxBus'

type LodgeHeroProps = {
  data: LodgeHeroData
}

export function LodgeHero({ data }: LodgeHeroProps) {
  const galleryItems = data.gallery.map((p) => ({
    src: p.src,
    alt: p.alt,
    title: p.title,
    description: p.description,
  }))

  return (
    <section className="lodge-hero" id="top">
      <div className="lodge-hero-fullbleed">
        <img src={data.imageSrc} alt={data.imageAlt} width={1600} height={900} />
        <div className="lodge-hero-overlay" aria-hidden />
        <button
          type="button"
          className="lodge-hero-photos"
          aria-label={data.galleryOpenAriaLabel}
          onClick={() => openGallery(galleryItems, 0)}
        >
          {data.photoCountLabel}
        </button>
        <div className="lodge-hero-identity">
          <div className="lodge-hero-identity-inner">
            <div className="lodge-breadcrumb">
              {data.breadcrumbs.map((crumb, i) => (
                <Fragment key={`${crumb.href}-${crumb.label}`}>
                  {i > 0 ? (
                    <span className="lodge-bc-sep" aria-hidden>
                      ›
                    </span>
                  ) : null}
                  <Link href={crumb.href}>{crumb.label}</Link>
                </Fragment>
              ))}
              <span className="lodge-bc-sep" aria-hidden>
                ›
              </span>
              <span className="current">{data.currentCrumbLabel}</span>
            </div>

            <div className="lodge-badges">
              {data.badges.map((label) => (
                <span key={label} className="pill pill-glass">
                  {label}
                </span>
              ))}
            </div>

            <h1 className="lodge-h1">{data.title}</h1>
            <p className="lodge-tagline">{data.tagline}</p>

            <div className="lodge-identity-foot">
              <div className="lodge-rating">
                <div className="stars" aria-hidden>
                  <div className="star" />
                  <div className="star" />
                  <div className="star" />
                  <div className="star" />
                  <div className="star" />
                </div>
                <span className="lodge-rating-score">{data.ratingScore}</span>
                <span className="lodge-rating-reviews">· {data.reviewCountLabel}</span>
                <span className="lodge-rating-divider" aria-hidden />
                <span className="lodge-rating-meta">{data.secondaryMeta}</span>
              </div>
              <Link href={data.primaryCta.href} className="btn btn-primary">
                {data.primaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
