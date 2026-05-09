import { Lexend } from 'next/font/google'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import './shell-logo-tokens.css'
import './shell-nav-logo.css'
import '@/components/partners/partners-wall.css'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-lexend',
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'Ecotone — Immersive Nature Experiences · Cusco, Perú',
  description: 'No viajas para escapar del mundo, sino para protegerlo. Immersive all-inclusive nature experiences in the Manu Biosphere Reserve and Camanti, Peru.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={lexend.variable}>
      <body>{children}</body>
    </html>
  )
}
