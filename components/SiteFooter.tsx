import { Fragment } from 'react'

import { getSiteSettingsShell } from '@/lib/getSiteSettingsShell'

function InlineFooterWordmark() {
  return (
    <svg
      className="nav-logo-wordmark"
      viewBox="0 0 176 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: 20 }}
    >
      <path
        d="M8.08002 33.61L20.73 28.67V35.43H0V1.40997H18.01V7.16998L8.08002 3.21997V15.15H15.93V17.78H8.08002V33.61Z"
        fill="#ECE5D5"
      />
      <path
        d="M44.7401 16.55L36.6201 10.2C32.9001 11.38 30.5401 15.51 30.5401 20.4C30.5401 26.48 34.5801 30.29 39.1101 30.29C42.1001 30.29 44.6001 29.29 46.4601 27.02L46.9101 27.34C45.2801 32.15 41.3801 35.87 35.3901 35.87C28.5001 35.87 22.8301 30.29 22.8301 22.63C22.8301 14.97 28.6801 8.62 37.4801 8.62C40.6101 8.62 43.1901 9.52999 44.7401 10.43V16.55Z"
        fill="#ECE5D5"
      />
      <path
        d="M76.8098 22.04C76.8098 29.75 71.1398 35.87 63.2498 35.87C55.3598 35.87 49.0098 30.06 49.0098 22.54C49.0098 14.87 54.5398 8.62 62.6198 8.62C70.6398 8.62 76.8098 14.56 76.8098 22.04ZM69.4198 25.4C69.4198 22.59 68.5998 19.73 67.1498 17.28C65.2898 14.15 62.5198 11.7 59.1698 10.79C57.2198 12.6 56.3998 15.82 56.3998 19.04C56.3998 21.94 57.3098 24.94 58.8498 27.48C60.7098 30.43 63.4298 32.74 66.6998 33.65C68.6498 31.84 69.4198 28.62 69.4198 25.4Z"
        fill="#ECE5D5"
      />
      <path d="M87.3998 0V9.07001H92.6198V12.93H87.3998V35.43H79.7798V6.17999L87.3998 0Z" fill="#ECE5D5" />
      <path
        d="M120.89 22.04C120.89 29.75 115.22 35.87 107.33 35.87C99.4398 35.87 93.0898 30.06 93.0898 22.54C93.0898 14.87 98.6198 8.62 106.7 8.62C114.73 8.62 120.89 14.56 120.89 22.04ZM113.5 25.4C113.5 22.59 112.68 19.73 111.23 17.28C109.37 14.15 106.6 11.7 103.25 10.79C101.3 12.6 100.48 15.82 100.48 19.04C100.48 21.94 101.39 24.94 102.93 27.48C104.79 30.43 107.51 32.74 110.78 33.65C112.73 31.84 113.5 28.62 113.5 25.4Z"
        fill="#ECE5D5"
      />
      <path
        d="M124.27 35.42V9.07001H131.89V12.11C135.7 10.02 138.74 8.62 141.46 8.62C145.41 8.62 147.45 11.02 147.45 15.11V35.43H139.83V15.97C139.83 13.61 138.88 12.34 136.79 12.34C135.7 12.34 134.3 12.52 131.89 13.7V35.43H124.27V35.42Z"
        fill="#ECE5D5"
      />
      <path
        d="M163.88 35.88C156.31 35.88 150.55 30.3 150.55 22.41C150.55 13.93 156.85 8.62 163.11 8.62C170.55 8.62 174.31 13.9299 175.08 19.0099H158.16C158.16 19.2399 158.16 19.51 158.16 19.78C158.16 26.67 162.24 30.3 167.32 30.3C170.45 30.3 172.85 29.08 174.71 26.81L175.16 27.17C173.77 31.43 169.91 35.88 163.88 35.88ZM158.39 16.69H167.69C166.83 14.01 164.47 11.11 161.2 10.52C159.93 11.66 158.85 13.7 158.39 16.69Z"
        fill="#ECE5D5"
      />
    </svg>
  )
}

/**
 * Site-wide footer (same markup as the home page).
 * Uses `siteSettings` (footer + brand assets); same fallbacks as `siteSettingsApprovedContent` when missing.
 * Large background mark uses `brandIsotipo` when set, else the shared SVG def; `showBrandDeco` from CMS.
 */
export async function SiteFooter() {
  const shell = await getSiteSettingsShell()
  const { footerLogoUrl, brandIsotipoUrl, homePath, footer, copyright, footerCertText } = shell
  const rawHome = (homePath || '/').trim()
  const logoLinkHref = /^https?:\/\//i.test(rawHome)
    ? rawHome
    : rawHome.startsWith('/')
      ? rawHome
      : `/${rawHome}`

  const decDivider = { width: 1, height: 12, background: 'rgba(236,229,213,.15)' } as const

  return (
    <footer className="footer">
      {footer.showBrandDeco && (
        <div className="footer-brand-deco" aria-hidden>
          {brandIsotipoUrl ? (
            <img
              className="footer-brand-deco-cms"
              src={brandIsotipoUrl}
              alt=""
              width={105}
              height={101}
            />
          ) : (
            <svg
              viewBox="0 0 105 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >
              <use href="#isotipo" style={{ color: 'white' }} />
            </svg>
          )}
        </div>
      )}
      <div className="footer-inner">
        <div>
          <div className="foot-logo">
            <a href={logoLinkHref} className="nav-logo" aria-label="Ecotone home">
              {footerLogoUrl ? (
                <span className="nav-logo-full-wrap">
                  <img
                    className="nav-logo-full"
                    src={footerLogoUrl}
                    alt=""
                    width={184}
                    height={57}
                    sizes="(max-width: 640px) 85vw, 150px"
                    decoding="async"
                  />
                </span>
              ) : (
                <>
                  <svg
                    className="nav-logo-isotipo"
                    viewBox="0 0 105 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="#isotipo" style={{ color: '#ECE5D5' }} />
                  </svg>
                  <InlineFooterWordmark />
                </>
              )}
            </a>
          </div>
          <div className="foot-tagline">{footer.tagline}</div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(236,229,213,.38)',
              lineHeight: 1.65,
              marginTop: 10,
            }}
          >
            {footer.descriptionLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
        <div className="foot-col">
          <h5>{footer.exploreTitle}</h5>
          <ul className="foot-links">
            {footer.exploreLinks.map((item, i) => (
              <li key={`exp-${i}`}>
                <a
                  href={item.href}
                  {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h5>{footer.contactTitle}</h5>
          <ul className="foot-links">
            {footer.contactLinks.map((item, i) => (
              <li key={`con-${i}`}>
                <a
                  href={item.href}
                  {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <p className="foot-copy">{copyright}</p>
        <div className="foot-certs">
          {footerCertText.map((t, i) => (
            <Fragment key={`cert-${i}`}>
              {i > 0 ? <span style={decDivider} /> : null}
              <span className="foot-cert">{t}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </footer>
  )
}
