import {defineField, defineType} from 'sanity'
import {SNAPSHOT_BAR_SLOT_OPTIONS} from '../../lib/snapshotBarShared'

/**
 * Una celda elegida para la barra de stats en esta landing: slot canónico + visible.
 * value/label se resuelven desde Experiencia en runtime; no se duplican aquí salvo overrides futuros.
 */
export const experiencePageSnapshotStatPick = defineType({
  name: 'experiencePageSnapshotStatPick',
  title: 'Stat de la barra (snapshot)',
  type: 'object',
  fields: [
    defineField({
      name: 'slot',
      title: 'Stat',
      type: 'string',
      options: {list: SNAPSHOT_BAR_SLOT_OPTIONS, layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
      description: 'Misma fuente canónica que la Experiencia vinculada (campos logísticos / reglas de preview).',
    }),
    defineField({
      name: 'visible',
      title: 'Visible en esta landing',
      type: 'boolean',
      initialValue: true,
      description: 'Si está desmarcado, este stat no se muestra en esta URL (cuando el front consuma este campo).',
    }),
  ],
  preview: {
    select: {slot: 'slot', visible: 'visible'},
    prepare: ({slot, visible}) => {
      const t = SNAPSHOT_BAR_SLOT_OPTIONS.find((o) => o.value === slot)?.title || slot || 'Stat'
      return {
        title: t,
        subtitle: visible === false ? 'Oculto en esta landing' : 'Visible',
      }
    },
  },
})
