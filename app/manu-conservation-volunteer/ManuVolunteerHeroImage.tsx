import Image from 'next/image'

/** Local Nikon D7100 master — 6000×4000. Never use chat-attachment downscales. */
import heroSource from './assets/manu-field-crew-hero-master.jpg'

/**
 * Landing hero — Catarata Shintuya field crew.
 *
 * Pipeline: sizes="100vw" + quality={90} (see next.config images.qualities).
 * Next derives responsive candidates from the full master; no pre-downscale.
 */
export function ManuVolunteerHeroImage() {
  return (
    <Image
      src={heroSource}
      alt=""
      fill
      priority
      quality={90}
      sizes="100vw"
      placeholder="blur"
      className="mcv-media mcv-hero-media"
    />
  )
}
