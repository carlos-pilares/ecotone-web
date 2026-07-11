import { Analytics } from '@vercel/analytics/react'
import { Lexend } from 'next/font/google'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { BookingModalProvider } from '@/components/booking/BookingModalContext'
import { ConsentBanner } from '@/components/ConsentBanner'
import { FloatingWhatsappButton } from '@/components/FloatingWhatsappButton'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { GaRoutePageView } from '@/components/GaRoutePageView'
import { getBookingModalSettings } from '@/lib/getBookingModalSettings'
import { getSiteSettingsShell } from '@/lib/getSiteSettingsShell'

import './globals.css'
import './announcement-bar.css'
import './shell-logo-tokens.css'
import './shell-nav-logo.css'
import './consent-banner.css'
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [shell, bookingModalCopy] = await Promise.all([getSiteSettingsShell(), getBookingModalSettings()])
  return (
    <html lang="en" className={lexend.variable}>
      <body>
        <BookingModalProvider defaultWhatsappUrl={shell.defaultWhatsappUrl} copy={bookingModalCopy}>
          {children}
          <FloatingWhatsappButton config={shell.floatingWhatsapp} />
        </BookingModalProvider>
        <GoogleAnalytics />
        <GaRoutePageView />
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  )
}
