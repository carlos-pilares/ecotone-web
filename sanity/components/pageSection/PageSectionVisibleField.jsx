'use client'

import {useCallback, useMemo} from 'react'
import {PatchEvent, set, useFormCallbacks, useFormValue} from 'sanity'
import {PageSectionVisibilityInput} from './PageSectionVisibilityInput'

function newItemKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `pm_${Date.now().toString(36)}_${Math.random().toString(16).slice(2)}`
}

function cloneModules(modules) {
  return (modules || []).map((m) => ({...m}))
}

/**
 * Patches `sectionModules[]` for a single section key — does not use the host field value.
 * @param {{ schemaType?: { options?: { sectionKey?: string, modulesPath?: string[] } } }} props
 */
export function PageSectionVisibleField(props) {
  const sectionKey = props.schemaType?.options?.sectionKey
  const modulesPath = props.schemaType?.options?.modulesPath ?? ['sectionModules']
  const {onChange: documentOnChange} = useFormCallbacks()
  const sectionModules = useFormValue(modulesPath) || []

  const row = useMemo(
    () => (sectionKey ? sectionModules.find((m) => m?.key === sectionKey) : null),
    [sectionKey, sectionModules],
  )

  const visible = row ? row.visible !== false : true

  const apply = useCallback(
    (nextVisible) => {
      if (!sectionKey || !documentOnChange) return
      const next = cloneModules(sectionModules)
      const i = next.findIndex((m) => m?.key === sectionKey)
      if (i >= 0) {
        next[i] = {...next[i], visible: nextVisible}
      } else {
        next.push({
          _type: 'pageModule',
          _key: newItemKey(),
          key: sectionKey,
          visible: nextVisible,
          eyebrow: '',
          sectionTitle: '',
          sectionText: '',
        })
      }
      documentOnChange(PatchEvent.from(set(next, modulesPath)))
    },
    [documentOnChange, modulesPath, sectionKey, sectionModules],
  )

  if (!sectionKey) return null

  return <PageSectionVisibilityInput value={visible} onChange={apply} readOnly={props.readOnly} />
}
