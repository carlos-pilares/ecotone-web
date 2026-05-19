'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  splitFooterColumnLinks,
  type FooterLinksColumnResolved,
  type FooterShellLink,
} from '@/lib/resolveFooterShell'

function FooterOptionalLink({ item }: { item: FooterShellLink }) {
  if (item.href) {
    return (
      <a
        href={item.href}
        {...(item.openInNewTab ? { target: '_blank', rel: item.rel || 'noopener noreferrer' } : {})}
      >
        {item.label}
      </a>
    )
  }
  return <span className="foot-link-plain">{item.label}</span>
}

function FooterLinkList({ links, listKey }: { links: FooterShellLink[]; listKey: string }) {
  return (
    <ul className="foot-links">
      {links.map((item, i) => (
        <li key={`${listKey}-${i}`}>
          <FooterOptionalLink item={item} />
        </li>
      ))}
    </ul>
  )
}

function FooterColumnLinks({ column, colKey }: { column: FooterLinksColumnResolved; colKey: string }) {
  const { primary, secondary } = splitFooterColumnLinks(column.links)
  const split = secondary.length > 0
  return (
    <div className={split ? 'foot-col-links-split' : undefined}>
      <FooterLinkList links={primary} listKey={`${colKey}-a`} />
      {split ? <FooterLinkList links={secondary} listKey={`${colKey}-b`} /> : null}
    </div>
  )
}

function FooterLinksColumnAccordion({
  column,
  colKey,
  panelId,
  isOpen,
  onToggle,
}: {
  column: FooterLinksColumnResolved
  colKey: string
  panelId: string
  isOpen: boolean
  onToggle: () => void
}) {
  const title = column.title?.trim() || 'Links'

  return (
    <div className="foot-col foot-col--accordion">
      <h5 className="foot-accordion__title-visually-hidden" id={`${panelId}-label`}>
        {title}
      </h5>
      <button
        type="button"
        className="foot-accordion__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        id={`${panelId}-trigger`}
        onClick={onToggle}
      >
        <span className="foot-accordion__trigger-label">{title}</span>
        <span className="foot-accordion__chevron" aria-hidden />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-label`}
        className="foot-accordion__panel"
        hidden={!isOpen}
      >
        <FooterColumnLinks column={column} colKey={colKey} />
      </div>
    </div>
  )
}

export type FooterMobileAccordionsProps = {
  linkColumns: Array<{ column: FooterLinksColumnResolved; index: number }>
  baseId: string
}

export function FooterMobileAccordions({ linkColumns, baseId }: FooterMobileAccordionsProps) {
  const [openColumnIndex, setOpenColumnIndex] = useState<number | null>(
    () => linkColumns[0]?.index ?? null,
  )

  useEffect(() => {
    const first = linkColumns[0]?.index
    if (first === undefined) return
    setOpenColumnIndex((prev) => {
      if (prev !== null && linkColumns.some(({ index }) => index === prev)) return prev
      return first
    })
  }, [linkColumns])

  const toggleColumn = useCallback((index: number) => {
    setOpenColumnIndex((prev) => (prev === index ? null : index))
  }, [])

  if (!linkColumns.length) return null

  return (
    <div className="foot-cols-mobile">
      {linkColumns.map(({ column, index }) => (
        <FooterLinksColumnAccordion
          key={`col-${index}`}
          column={column}
          colKey={`col-${index}`}
          panelId={`${baseId}-col-${index}`}
          isOpen={openColumnIndex === index}
          onToggle={() => toggleColumn(index)}
        />
      ))}
    </div>
  )
}
