'use client'

import { useEffect, useMemo, useRef, type ReactNode } from 'react'

import { DEFAULT_FEATURED_QUOTES } from '@/lib/homeQuoteDefaults'

type FullHtmlProps = { html: string; before?: never; after?: never; children?: never; featuredQuoteItems?: never }
type SplitBodyProps = {
  before: string
  after: string
  children: ReactNode
  html?: never
  featuredQuoteItems?: { text: string; attr: string }[] | null
}
type ReactShellProps = {
  children: ReactNode
  html?: never
  before?: never
  after?: never
  featuredQuoteItems?: { text: string; attr: string }[] | null
}

export function EcotoneV2Client(props: FullHtmlProps | SplitBodyProps | ReactShellProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mode: 'full' | 'split' | 'shell' =
    'html' in props && typeof props.html === 'string'
      ? 'full'
      : 'before' in props && 'after' in props
        ? 'split'
        : 'shell'
  const html = 'html' in props ? props.html : undefined
  const before = 'before' in props ? props.before : undefined
  const after = 'after' in props ? props.after : undefined
  const children = 'children' in props ? props.children : null
  const rawFeatured = 'featuredQuoteItems' in props ? props.featuredQuoteItems : undefined
  const quoteList = useMemo(
    () =>
      Array.isArray(rawFeatured) && rawFeatured.length > 0 ? rawFeatured : DEFAULT_FEATURED_QUOTES,
    [rawFeatured],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const cleanups: Array<() => void> = []

    const topNav = document.getElementById('topNav')
    const navWordmark = document.getElementById('navWordmark')
    const navIsotipo = document.getElementById('navIsotipo')

    const onScroll = () => {
      const solid = window.scrollY > 60
      topNav?.classList.toggle('solid', solid)
      if (navWordmark) {
        navWordmark.querySelectorAll('path').forEach((p) => {
          p.setAttribute('fill', solid ? '#906730' : '#ECE5D5')
        })
      }
      const useEl = navIsotipo?.querySelector('use')
      if (useEl) (useEl as SVGUseElement).style.color = solid ? '#906730' : '#ECE5D5'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    cleanups.push(() => window.removeEventListener('scroll', onScroll))

    const ham = document.getElementById('ham')
    const drawer = document.getElementById('drawer')
    const onHam = () => drawer?.classList.toggle('open')
    ham?.addEventListener('click', onHam)
    cleanups.push(() => ham?.removeEventListener('click', onHam))

    if (drawer) {
      const links = Array.from(drawer.querySelectorAll('a'))
      const closeDrawer = () => drawer.classList.remove('open')
      links.forEach((a) => a.addEventListener('click', closeDrawer))
      cleanups.push(() => links.forEach((a) => a.removeEventListener('click', closeDrawer)))
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.04 }
    )
    const fadeEls = root.querySelectorAll('.fade')
    fadeEls.forEach((f) => io.observe(f))
    cleanups.push(() => {
      fadeEls.forEach((f) => io.unobserve(f))
      io.disconnect()
    })

    const tabs = root.querySelectorAll('.filter-tab')
    const cards = root.querySelectorAll('[data-type]')
    tabs.forEach((tab) => {
      const handler = () => {
        tabs.forEach((t) => t.classList.remove('active'))
        tab.classList.add('active')
        const filter = (tab as HTMLElement).dataset.filter ?? 'all'
        cards.forEach((card) => {
          const el = card as HTMLElement
          const isTailor = el.classList.contains('exp-card-tailor')
          const match = filter === 'all' || el.dataset.type === filter
          el.style.display = match || isTailor ? '' : 'none'
        })
      }
      tab.addEventListener('click', handler)
      cleanups.push(() => tab.removeEventListener('click', handler))
    })

    const qText = document.getElementById('quoteText')
    const qAttr = document.getElementById('quoteAttr')
    const qdots = root.querySelectorAll('.qdot')
    if (qText && qAttr) {
      let qCurrent = 0
      let fadeTimer: number | undefined
      let qTimer: number | undefined
      qText.style.transition = 'opacity 0.35s'
      qAttr.style.transition = 'opacity 0.35s'

      const setQuote = (i: number) => {
        const n = Math.max(1, quoteList.length)
        const safeI = ((i % n) + n) % n
        qCurrent = safeI
        if (fadeTimer !== undefined) clearTimeout(fadeTimer)
        qText.style.opacity = '0'
        qAttr.style.opacity = '0'
        fadeTimer = window.setTimeout(() => {
          const item = quoteList[safeI]
          if (item) {
            qText.innerHTML = item.text
            qAttr.textContent = item.attr
          }
          qText.style.opacity = '1'
          qAttr.style.opacity = '1'
        }, 350)
        qdots.forEach((d, idx) => d.classList.toggle('active', idx === safeI))
      }

      const startQuoteTimer = () => {
        if (qTimer !== undefined) window.clearInterval(qTimer)
        qTimer = window.setInterval(() => {
          setQuote((qCurrent + 1) % Math.max(1, quoteList.length))
        }, 5000)
      }

      qdots.forEach((d, i) => {
        const h = () => {
          if (qTimer !== undefined) window.clearInterval(qTimer)
          setQuote(i)
          startQuoteTimer()
        }
        d.addEventListener('click', h)
        cleanups.push(() => d.removeEventListener('click', h))
      })

      startQuoteTimer()
      cleanups.push(() => {
        if (qTimer !== undefined) window.clearInterval(qTimer)
        if (fadeTimer !== undefined) clearTimeout(fadeTimer)
      })
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [html, before, after, mode, quoteList])

  /** Móvil: carrusel de reviews (snap + dots) — desktop con media query no aplica. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const scroll = root.querySelector<HTMLElement>('#revScroll')
    const dotContainer = root.querySelector<HTMLElement>('#revCardDots')
    if (!scroll || !dotContainer) return
    const dots = Array.from(dotContainer.querySelectorAll<HTMLButtonElement>('.rev-dot'))
    const cards = Array.from(scroll.querySelectorAll<HTMLElement>('.rev-card'))
    if (dots.length === 0 || cards.length === 0) return

    const mq = window.matchMedia('(max-width: 699px)')

    const setActive = (index: number) => {
      const i = Math.max(0, Math.min(cards.length - 1, index))
      dots.forEach((d, j) => {
        d.classList.toggle('active', j === i)
        d.setAttribute('aria-selected', j === i ? 'true' : 'false')
      })
    }

    const updateFromScroll = () => {
      if (!mq.matches) return
      const s = scroll.getBoundingClientRect()
      const centerX = s.left + s.width * 0.5
      let bestI = 0
      let bestD = Number.POSITIVE_INFINITY
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect()
        const cx = r.left + r.width * 0.5
        const d = Math.abs(cx - centerX)
        if (d < bestD) {
          bestD = d
          bestI = i
        }
      })
      setActive(bestI)
    }

    let raf = 0
    const onScroll = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(updateFromScroll)
    }

    const cleanups: Array<() => void> = []
    scroll.addEventListener('scroll', onScroll, { passive: true })
    cleanups.push(() => {
      window.cancelAnimationFrame(raf)
      scroll.removeEventListener('scroll', onScroll)
    })

    dots.forEach((dot, i) => {
      const h = () => {
        cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
      dot.addEventListener('click', h)
      cleanups.push(() => dot.removeEventListener('click', h))
    })

    const onLayout = () => updateFromScroll()
    window.addEventListener('resize', onLayout, { passive: true })
    mq.addEventListener('change', onLayout)
    cleanups.push(() => window.removeEventListener('resize', onLayout))
    cleanups.push(() => mq.removeEventListener('change', onLayout))

    updateFromScroll()
    onScroll()

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [html, before, after, mode])

  if (mode === 'full' && html !== undefined) {
    return (
      <div
        ref={rootRef}
        id="ecotone-home-root"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <div ref={rootRef} id="ecotone-home-root">
      {before && (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: before }}
        />
      )}
      {children}
      {after && (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: after }}
        />
      )}
    </div>
  )
}
