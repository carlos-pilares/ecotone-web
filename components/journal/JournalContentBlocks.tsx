import Link from 'next/link'
import type { SanityImageSource } from '@sanity/image-url'

import { JournalPortableText } from '@/components/journal/JournalPortableText'
import { HOME_BLOG_CARD_IMAGE_FALLBACKS } from '@/lib/homeBlogDefaults'
import { cdnImageUrl } from '@/lib/sanity'

type ExpRef = {
  _id?: string
  name?: string | null
  slugCurrent?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  tagline?: string | null
  duration?: string | null
}

export type JournalBlock = {
  _key?: string
  _type?: string
  body?: unknown
  image?: SanityImageSource | null
  alt?: string | null
  caption?: string | null
  fullWidth?: boolean | null
  images?: SanityImageSource[] | null
  url?: string | null
  videoAccessibleTitle?: string | null
  quote?: string | null
  attribution?: string | null
  style?: string | null
  label?: string | null
  href?: string | null
  openInNewTab?: boolean | null
  eyebrow?: string | null
  experience?: ExpRef | null
}

function embedFromVideoUrl(raw: string): { src: string; provider: 'youtube' | 'vimeo' } | null {
  try {
    const u = new URL(raw.trim())
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '')
      return id ? {src: `https://www.youtube-nocookie.com/embed/${id}`, provider: 'youtube'} : null
    }
    if (host.endsWith('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return {src: `https://www.youtube-nocookie.com/embed/${v}`, provider: 'youtube'}
      const m = u.pathname.match(/\/embed\/([^/]+)/)
      if (m?.[1]) return {src: `https://www.youtube-nocookie.com/embed/${m[1]}`, provider: 'youtube'}
    }
    if (host.endsWith('vimeo.com')) {
      const m = u.pathname.match(/\/(\d+)/)
      if (m?.[1]) return {src: `https://player.vimeo.com/video/${m[1]}`, provider: 'vimeo'}
    }
  } catch {
    return null
  }
  return null
}

const JOURNAL_IMG_FALLBACK = HOME_BLOG_CARD_IMAGE_FALLBACKS[0] || ''

function experienceHref(exp: ExpRef): string | null {
  const s = exp.slugCurrent?.trim()
  if (s) return `/experiences/${s}`
  return null
}

export function JournalContentBlocks({ blocks }: { blocks: unknown[] | null | undefined }) {
  if (!blocks?.length) return null
  return (
    <div className="journal-blocks">
      {(blocks as JournalBlock[]).map((block) => {
        const k = block._key || block._type
        switch (block._type) {
          case 'journalBlockRichText':
            return (
              <JournalPortableText
                key={k}
                value={Array.isArray(block.body) ? (block.body as never[]) : null}
              />
            )
          case 'journalBlockImage': {
            const src = cdnImageUrl(block.image ?? null, 1400, JOURNAL_IMG_FALLBACK)
            const wrapClass = block.fullWidth ? 'journal-block-img journal-block-img-full' : 'journal-block-img'
            return (
              <figure key={k} className={wrapClass}>
                <img src={src} alt={block.alt || ''} />
                {block.caption?.trim() ? <figcaption className="journal-block-caption">{block.caption}</figcaption> : null}
              </figure>
            )
          }
          case 'journalBlockGallery': {
            const imgs = (block.images ?? []).filter(Boolean) as SanityImageSource[]
            if (!imgs.length) return null
            return (
              <div key={k} className="journal-block-gallery">
                {imgs.map((img, i) => {
                  const url = cdnImageUrl(img, 800, JOURNAL_IMG_FALLBACK)
                  return (
                    <div key={`${k}-g-${i}`} className="journal-block-gallery-cell">
                      <img src={url} alt="" />
                    </div>
                  )
                })}
              </div>
            )
          }
          case 'journalBlockVideoEmbed': {
            const emb = block.url ? embedFromVideoUrl(block.url) : null
            if (!emb) {
              return (
                <p key={k} className="journal-block-video-fallback body">
                  <a href={block.url || '#'}>{block.url}</a>
                </p>
              )
            }
            const title = block.videoAccessibleTitle?.trim() || 'Video'
            return (
              <div key={k} className="journal-block-video">
                <iframe
                  title={title}
                  src={emb.src}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )
          }
          case 'journalBlockQuote':
            return (
              <blockquote key={k} className="journal-block-pullquote">
                <p>{block.quote}</p>
                {block.attribution?.trim() ? <cite>{block.attribution}</cite> : null}
              </blockquote>
            )
          case 'journalBlockDivider':
            return block.style === 'space' ? (
              <div key={k} className="journal-block-space" aria-hidden />
            ) : (
              <hr key={k} className="journal-block-hr" />
            )
          case 'journalBlockCta': {
            const href = (block.href ?? '').trim()
            const label = (block.label ?? '').trim()
            if (!label) return null
            const external = /^https?:\/\//i.test(href)
            const rel = block.openInNewTab && external ? 'noopener noreferrer' : undefined
            const target = block.openInNewTab && external ? '_blank' : undefined
            if (!href) {
              return (
                <span key={k} className="btn btn-secondary journal-block-cta-disabled">
                  {label}
                </span>
              )
            }
            if (external) {
              return (
                <p key={k} className="journal-block-cta-row">
                  <a href={href} className="btn btn-primary" rel={rel} target={target}>
                    {label}
                  </a>
                </p>
              )
            }
            return (
              <p key={k} className="journal-block-cta-row">
                <Link href={href.startsWith('/') ? href : `/${href}`} className="btn btn-primary">
                  {label}
                </Link>
              </p>
            )
          }
          case 'journalBlockRelatedExperience': {
            const exp = block.experience
            if (!exp?.name) return null
            const href = experienceHref(exp)
            const img = cdnImageUrl(exp.mainImage ?? null, 900, exp.mainImageUrl || JOURNAL_IMG_FALLBACK)
            const eb = block.eyebrow?.trim()
            const btn = block.label?.trim() || 'View experience'
            return (
              <aside key={k} className="journal-block-related">
                {eb ? <div className="eyebrow">{eb}</div> : null}
                <div className="journal-block-related-grid">
                  <div className="journal-block-related-img">
                    <img src={img} alt="" />
                  </div>
                  <div>
                    <div className="journal-block-related-name">{exp.name}</div>
                    {exp.tagline?.trim() ? <p className="body journal-block-related-sub">{exp.tagline}</p> : null}
                    {href ? (
                      <Link href={href} className="btn btn-secondary">
                        {btn}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </aside>
            )
          }
          default:
            return null
        }
      })}
    </div>
  )
}
