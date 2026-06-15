import {defineField, defineType} from 'sanity'
import {EXPERIENCE_PAGE_ALL_INTERNAL_NAV_TARGETS} from '../../lib/internalNavTargetOptions'

export const internalNavItem = defineType({
  name: 'internalNavItem',
  title: 'Ítem del menú interno',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'targetSection',
      title: 'Target section',
      type: 'string',
      description: 'Ancla / bloque de destino en la página.',
      options: {
        list: EXPERIENCE_PAGE_ALL_INTERNAL_NAV_TARGETS,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description:
        'Opcional. Si está vacío, el orden en la página puede derivarse del orden de esta lista en el formulario.',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  preview: {
    select: {label: 'label', targetSection: 'targetSection', visible: 'visible'},
    prepare: ({label, targetSection, visible}) => ({
      title: label || 'Ítem',
      subtitle: [visible === false ? 'Oculto' : 'Visible', targetSection].filter(Boolean).join(' · '),
    }),
  },
})
