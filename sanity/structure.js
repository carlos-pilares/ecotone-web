// https://www.sanity.io/docs/structure-builder-cheat-sheet
import {HomeIcon} from '@sanity/icons'

const SINGLETONS = new Set(['homePage'])

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home page')
        .id('home')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Home page'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return id && !SINGLETONS.has(id)
      }),
    ])
