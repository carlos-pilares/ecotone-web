import { getSiteSettingsShell } from '@/lib/getSiteSettingsShell'

import { SiteFooterView } from '@/components/SiteFooterView'

/**
 * Site-wide footer (same markup on every page).
 * Content from `footerSettings` when present; legacy `siteSettings.footer` only if that document is missing.
 */
export async function SiteFooter() {
  const shell = await getSiteSettingsShell()
  const { footerLogoUrl, brandIsotipoUrl, homePath, footer } = shell
  const rawHome = (homePath || '/').trim()
  const logoLinkHref = /^https?:\/\//i.test(rawHome)
    ? rawHome
    : rawHome.startsWith('/')
      ? rawHome
      : `/${rawHome}`

  return (
    <SiteFooterView
      footer={footer}
      footerLogoUrl={footerLogoUrl}
      brandIsotipoUrl={brandIsotipoUrl}
      logoLinkHref={logoLinkHref}
    />
  )
}
