import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

const variantClass: Record<'primary' | 'secondary' | 'text', string> = {
  primary: 'ec-btn ec-btn--primary',
  secondary: 'ec-btn ec-btn--secondary',
  text: 'ec-btn ec-btn--text',
}

type Variant = keyof typeof variantClass

type BaseProps = {
  variant?: Variant
  className?: string
  children: ReactNode
}

function classNames(v: Variant, className?: string) {
  return [variantClass[v], className].filter(Boolean).join(' ').trim()
}

export function EcotoneButton({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classNames(variant, className)} {...rest}>
      {children}
    </button>
  )
}

export function EcotoneButtonLink({
  variant = 'primary',
  className,
  children,
  ...rest
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classNames(variant, className)} {...rest}>
      {children}
    </a>
  )
}
