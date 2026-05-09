// https://www.sanity.io/docs/structure-builder-cheat-sheet
import {
  ActivityIcon,
  ArrowRightIcon,
  CogIcon,
  DocumentIcon,
  DocumentTextIcon,
  HomeIcon,
  BookIcon,
  ImageIcon,
  StarIcon,
} from '@sanity/icons'

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .id('settingsGroup')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Site settings')
                .icon(CogIcon)
                .id('siteSettingsItem')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Site: header, footer & brand'),
                ),
              S.listItem()
                .title('Booking modals')
                .icon(DocumentTextIcon)
                .id('bookingModalSettingsItem')
                .child(
                  S.document()
                    .schemaType('bookingModalSettings')
                    .documentId('bookingModalSettings')
                    .title('Plan journey & book experience copy'),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .id('pagesGroup')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home page')
                .icon(HomeIcon)
                .id('home')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .title('Home page'),
                ),
              S.listItem()
                .title('Routes page')
                .icon(ArrowRightIcon)
                .id('routesPagePinned')
                .child(
                  S.document()
                    .schemaType('routesPage')
                    .documentId('routesPage')
                    .title('Routes · landing'),
                ),
              S.listItem()
                .title('About page')
                .icon(DocumentTextIcon)
                .id('aboutPagePinned')
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                    .title('About · landing'),
                ),
              S.listItem()
                .title('Lodge Pages')
                .icon(DocumentTextIcon)
                .id('lodgePages')
                .child(
                  S.list()
                    .title('Pages · Lodge landings')
                    .items([
                      S.listItem()
                        .title('Soqtapata Lodge — landing')
                        .icon(DocumentTextIcon)
                        .id('lodgePageSoqtapataPinned')
                        .child(
                          S.document()
                            .schemaType('lodgePage')
                            .documentId('lodgePage-soqtapata-lodge')
                            .title('Soqtapata Lodge — landing'),
                        ),
                      S.divider(),
                      S.listItem()
                        .title('All lodge pages')
                        .icon(DocumentTextIcon)
                        .id('lodgePageListItem')
                        .child(
                          S.documentTypeList('lodgePage')
                            .id('lodgePageList')
                            .title('All lodge pages'),
                        ),
                    ]),
                ),
              S.listItem()
                .title('Experience landings (URLs)')
                .icon(DocumentTextIcon)
                .id('experiencePages')
                .child(
                  S.documentTypeList('experiencePage')
                    .id('experiencePageList')
                    .title('Landings: hero, SEO, orden de módulos, curación'),
                ),
              S.listItem()
                .title('Journal')
                .icon(BookIcon)
                .id('journalInPages')
                .child(
                  S.list()
                    .title('Journal')
                    .items([
                      S.listItem()
                        .title('Journal index (/journal)')
                        .icon(DocumentTextIcon)
                        .id('journalPagePinned')
                        .child(
                          S.document()
                            .schemaType('journalPage')
                            .documentId('journalPage')
                            .title('Journal · landing copy & SEO'),
                        ),
                      S.listItem()
                        .title('Articles')
                        .icon(BookIcon)
                        .id('journalArticlesInPages')
                        .child(
                          S.documentTypeList('blogPost')
                            .id('journalArticleListPages')
                            .title('Journal articles'),
                        ),
                    ]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Content library')
        .icon(BookIcon)
        .id('libraryGroup')
        .child(
          S.list()
            .title('Content library')
            .items([
              S.listItem()
                .title('Experiences (contenido del programa)')
                .icon(ActivityIcon)
                .id('experiences')
                .child(
                  S.documentTypeList('experience')
                    .id('experienceList')
                    .title('Itinerario, medios, FAQ, términos, lodge ref… (fuente de verdad)'),
                ),
              S.listItem()
                .title('Tech products (fichas)')
                .icon(ImageIcon)
                .id('techProducts')
                .child(
                  S.documentTypeList('technologyProduct')
                    .id('techProductList')
                    .title('Nombres, textos, imágenes de producto'),
                ),
              S.listItem()
                .title('Reviews')
                .icon(StarIcon)
                .id('reviews')
                .child(
                  S.list()
                    .title('Reviews')
                    .items([
                      S.listItem()
                        .title('Individual reviews')
                        .icon(StarIcon)
                        .id('reviewDocuments')
                        .child(
                          S.documentTypeList('review')
                            .id('reviewList')
                            .title('Quotes, authors, experience link'),
                        ),
                      S.listItem()
                        .title('Global summary (site-wide)')
                        .icon(CogIcon)
                        .id('reviewsGlobalSummary')
                        .child(
                          S.document()
                            .schemaType('reviewsSettings')
                            .documentId('reviewsSettings')
                            .title('Rating, count, provider — used on every Reviews block'),
                        ),
                    ]),
                ),
              S.listItem()
                .title('Lodges')
                .icon(HomeIcon)
                .id('lodges')
                .child(S.documentTypeList('lodge').title('Lodges')),
              S.listItem()
                .title('Routes')
                .icon(ArrowRightIcon)
                .id('routes')
                .child(S.documentTypeList('route').title('Routes')),
              S.listItem()
                .title('Journal articles')
                .icon(BookIcon)
                .id('journalArticlesLibrary')
                .child(S.documentTypeList('blogPost').title('Journal articles (same as Pages → Journal)')),
              S.listItem()
                .title('Partners & certifications')
                .icon(ImageIcon)
                .id('partners')
                .child(S.documentTypeList('partner').title('Partners & certifications')),
            ]),
        ),
    ])
