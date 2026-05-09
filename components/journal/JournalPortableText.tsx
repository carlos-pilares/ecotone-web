import type { ReactNode } from 'react'

type MarkDef = {_key?: string; _type?: string; href?: string | null}

type SpanChild = {
  _type?: string
  text?: string
  marks?: string[]
}

type PortableBlock = {
  _type?: string
  _key?: string
  style?: string
  listItem?: string
  level?: number
  children?: SpanChild[]
  markDefs?: MarkDef[]
}

function renderMarks(text: string, marks: string[] | undefined, markDefs: MarkDef[] | undefined): ReactNode {
  let out: ReactNode = text
  const defs = markDefs ?? []
  for (const m of marks ?? []) {
    if (m === 'strong') {
      out = <strong>{out}</strong>
    } else if (m === 'em') {
      out = <em>{out}</em>
    } else {
      const def = defs.find((d) => d._key === m)
      if (def?._type === 'link' && def.href) {
        const ext = /^https?:\/\//i.test(def.href)
        out = (
          <a href={def.href} {...(ext ? {rel: 'noopener noreferrer', target: '_blank'} : {})}>
            {out}
          </a>
        )
      }
    }
  }
  return out
}

function blockChildren(block: PortableBlock): ReactNode {
  const markDefs = block.markDefs
  return (block.children ?? []).map((ch, i) => {
    if (ch._type && ch._type !== 'span') return null
    const t = ch.text ?? ''
    return (
      <span key={`${block._key ?? 'b'}-${i}`}>
        {renderMarks(t, ch.marks, markDefs)}
      </span>
    )
  })
}

export function JournalPortableText({ value }: { value: PortableBlock[] | null | undefined }) {
  if (!value?.length) return null
  const nodes: ReactNode[] = []
  let listBuf: PortableBlock[] = []

  const flushList = () => {
    if (!listBuf.length) return
    const useOl = listBuf[0]?.listItem === 'number'
    const ListTag = useOl ? 'ol' : 'ul'
    nodes.push(
      <ListTag
        key={`list-${nodes.length}`}
        className={useOl ? 'journal-rt-list journal-rt-ol' : 'journal-rt-list'}
      >
        {listBuf.map((b) => (
          <li key={b._key ?? `li-${b.listItem}`} className="journal-rt-li">
            {blockChildren(b)}
          </li>
        ))}
      </ListTag>,
    )
    listBuf = []
  }

  for (const block of value) {
    if (block._type !== 'block') continue
    if (block.listItem) {
      listBuf.push(block)
      continue
    }
    flushList()
    const style = block.style || 'normal'
    const k = block._key ?? `blk-${nodes.length}`
    if (style === 'h2') {
      nodes.push(
        <h2 key={k} className="journal-rt-h2">
          {blockChildren(block)}
        </h2>,
      )
    } else if (style === 'h3') {
      nodes.push(
        <h3 key={k} className="journal-rt-h3">
          {blockChildren(block)}
        </h3>,
      )
    } else if (style === 'h4') {
      nodes.push(
        <h4 key={k} className="journal-rt-h4">
          {blockChildren(block)}
        </h4>,
      )
    } else if (style === 'blockquote') {
      nodes.push(
        <blockquote key={k} className="journal-rt-quote">
          {blockChildren(block)}
        </blockquote>,
      )
    } else {
      nodes.push(
        <p key={k} className="journal-rt-p">
          {blockChildren(block)}
        </p>,
      )
    }
  }
  flushList()

  return <div className="journal-richtext">{nodes}</div>
}
