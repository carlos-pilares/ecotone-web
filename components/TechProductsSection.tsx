import { HeadlineBlock } from '@/components/HeadlineBlock'
import { TechProductsGrid } from '@/components/TechProductsGrid'
import type { ResolvedHomePage } from '@/lib/homePageDefaults'
import type { HomePageDoc, TechnologyProductDoc } from '@/lib/queries'

const DEFAULT_EXPERIENCE_DESCRIPTION =
  'This experience includes EcoDroneView® and ForestWhisper® in your pack. EcoSpeciesExplorer® is available free on your device.'

const DEFAULT_HOME_BODY =
  'Designed for eco-travellers seeking adventure with purpose. We combine immersive technology, sustainable lodging, and direct impact on local communities.'

type TechProductsHomeProps = {
  variant?: 'home'
  homeData: ResolvedHomePage | HomePageDoc | null
  products: TechnologyProductDoc[] | null | undefined
  includedProductIds?: string[] | null
  capAtThree?: boolean
  id?: string
  sectionClassName?: string
  contentInnerClassName?: string
}

type TechProductsExperienceProps = {
  variant: 'experience'
  homeData?: null
  products: TechnologyProductDoc[] | null | undefined
  includedProductIds?: string[] | null
  capAtThree?: boolean
  id?: string
  sectionClassName?: string
  contentInnerClassName?: string
  /** Optional copy overrides (future CMS or A/B) */
  eyebrow?: string
  /** Replaces the default h2; keep in sync with Home when overriding. */
  title?: string
  /** Long-form intro under the title; alias of `body`. */
  description?: string
  body?: string
}

export type TechProductsSectionProps = TechProductsHomeProps | TechProductsExperienceProps

/**
 * Single source of truth for the technology / tech-pack block.
 * Used on the homepage (`variant` default) and on experience detail pages (`variant="experience"`).
 */
export function TechProductsSection(props: TechProductsSectionProps) {
  const {
    products,
    includedProductIds,
    capAtThree = true,
    id = 'tech',
  } = props

  const isExperience = props.variant === 'experience'

  const sectionClass =
    props.sectionClassName ??
    (isExperience ? 'content-section bg-warm fade' : 'sec bg-warm')
  const innerClass =
    props.contentInnerClassName ?? (isExperience ? 'content-inner' : 'sec-inner fade')

  if (isExperience) {
    const p = props as TechProductsExperienceProps
    const eyebrow = p.eyebrow ?? 'Exclusive technology'
    const description = p.description ?? p.body ?? DEFAULT_EXPERIENCE_DESCRIPTION
    const title = p.title ?? "What's in your tech pack"
    return (
      <section className={sectionClass} id={id} aria-labelledby="tech-section-heading">
        <div className={innerClass}>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="h2" id="tech-section-heading" style={{ marginBottom: 6 }}>
            {title}
          </h2>
          <p className="body" style={{ maxWidth: 540, marginBottom: 0 }}>
            {description}
          </p>
          <TechProductsGrid
            products={products}
            includedProductIds={includedProductIds ?? null}
            capAtThree={p.capAtThree ?? true}
          />
        </div>
      </section>
    )
  }

  const h = (props as TechProductsHomeProps).homeData
  return (
    <section className={sectionClass} id={id} aria-labelledby="home-tech-heading">
      <div className={innerClass}>
        <div className="eyebrow">{h?.techEyebrow ?? 'Exclusive technology'}</div>
        <HeadlineBlock
          id="home-tech-heading"
          text={h?.techHeadline ?? null}
          fallback={
            <>
              A commitment to
              <br />
              preserving pristine nature
            </>
          }
        />
        <p className="body" style={{ maxWidth: 560 }}>
          {h?.techBody ?? DEFAULT_HOME_BODY}
        </p>
        <TechProductsGrid
          products={products}
          includedProductIds={includedProductIds ?? null}
          capAtThree={capAtThree}
        />
      </div>
    </section>
  )
}
