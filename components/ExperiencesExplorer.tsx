import type { ExperienceFromSanity, HomePageDoc } from '@/lib/queries'
import { HeadlineBlock } from '@/components/HeadlineBlock'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import { HOME_EXPLORER_DEFAULTS } from '@/lib/homeExplorerDefaults'
import {
  filterHomeExplorerExperiences,
  resolveHomeExplorerFilterTabs,
  resolveHomeExplorerTailorBand,
} from '@/lib/homeExplorerPrograms'
import { buildHomeExplorerSectionItems } from '@/lib/buildExperienceCardsSectionItems'
import { ExperienceCardsSection } from '@/components/experience/ExperienceCardsSection'
import { tailorMadeBandFromResolved } from '@/lib/tailorMadeBand'

function ExperiencesFallback({ explorer }: { explorer: HomePageDoc | null | undefined }) {
  const e = explorer
  const body =
    e?.explorerEmptyGridMessage?.trim() || homePageTextFields.explorerEmptyGridMessage
  const linkLabel = e?.explorerEmptyGridLinkLabel?.trim() ?? ''
  const linkHref = e?.explorerEmptyGridLinkHref?.trim() ?? ''
  const showLink = Boolean(linkHref) && Boolean(linkLabel)
  return (
    <p className="body" style={{ maxWidth: 560 }}>
      {body}
      {showLink ? (
        <>
          {' '}
          <a href={linkHref}>{linkLabel}</a>.
        </>
      ) : null}
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
  const e = explorer
  const filterTabs = resolveHomeExplorerFilterTabs(e)
  const filteredList = filterHomeExplorerExperiences(experiences, e)
  const cardImageFallback =
    e?.explorerCardImageFallbackUrl?.trim() || HOME_EXPLORER_DEFAULTS.cardImageFallbackUrl
  const cardCtaView = HOME_EXPLORER_DEFAULTS.cardCtaView
  const sectionCards = buildHomeExplorerSectionItems(filteredList, {
    cardImageFallback,
    cardCtaLabel: cardCtaView,
  })
  const tailorProps = tailorMadeBandFromResolved(resolveHomeExplorerTailorBand(e), {
    dataType: 'tailor',
  })

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
        {filterTabs.length > 0 ? (
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
        ) : null}
        <ExperienceCardsSection
          cards={sectionCards}
          cardCtaLabel={cardCtaView}
          tailorMade={tailorProps}
          gridClassName="experience-cards-grid fade fade-d2"
          gridId="expGrid"
          emptyMessage={sectionCards.length === 0 ? <ExperiencesFallback explorer={e} /> : null}
        />
      </div>
    </section>
  )
}
