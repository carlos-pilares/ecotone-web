import {defineField, defineType} from 'sanity'

/**
 * Selección de un ítem del snapshot canónico del lodge (`snapshotItems[].key`).
 * El front resuelve label/value desde el documento lodge.
 */
export const lodgeSnapshotKeyPick = defineType({
  name: 'lodgeSnapshotKeyPick',
  title: 'Snapshot item (by key)',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Snapshot key',
      type: 'string',
      description: 'Debe coincidir con el campo `key` de una fila en Lodge → snapshotItems.',
      validation: (Rule) => Rule.required().regex(/^[a-z0-9][a-z0-9-]*$/, {
        name: 'slug-like',
        invert: false,
      }),
    }),
  ],
  preview: {
    select: {key: 'key'},
    prepare: ({key}) => ({title: key || 'Pick'}),
  },
})
