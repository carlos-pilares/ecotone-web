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
                .title('Reviews (reseñas)')
                .icon(StarIcon)
                .id('reviews')
                .child(
                  S.documentTypeList('review')
                    .id('reviewList')
                    .title('Citas, autores, programa (elegir en la landing)'),
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
                .title('Blog posts')
                .icon(BookIcon)
                .id('blogPosts')
                .child(S.documentTypeList('blogPost').title('Blog posts')),
              S.listItem()
                .title('Partners & certifications')
                .icon(ImageIcon)
                .id('partners')
                .child(S.documentTypeList('partner').title('Partners & certifications')),
            ]),
        ),
    ])
