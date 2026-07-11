import { WBTW_LOGO_LIGHT } from './wonder-brand'

const SOCIAL_LINKS = [
  {
    label: 'Ecotone on Instagram',
    href: 'https://www.instagram.com/ecotone.eco/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Ecotone on YouTube',
    href: 'https://www.youtube.com/@Ecotone-Nature',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="M11 10l4.5 2.5L11 15V10Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Ecotone on LinkedIn',
    href: 'https://www.linkedin.com/company/ecotone-eco/posts/?feedView=all',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7M8 7.5v.01" strokeLinecap="round" />
        <path d="M12 17v-4.2c0-1.2.9-2.2 2.1-2.2s1.9 1 1.9 2.2V17" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 10.8V17" strokeLinecap="round" />
      </svg>
    ),
  },
] as const

export function WonderCampaignFooter() {
  return (
    <footer className="wbtw-footer">
      <div className="wbtw-container">
        <div className="wbtw-footer-inner">
          <div className="wbtw-footer-brand">
            <a
              href="https://www.ecotone.eco/"
              className="wbtw-footer-logo-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ecotone home"
            >
              <span className="wbtw-footer-logo-wrap">
                <img
                  src={WBTW_LOGO_LIGHT}
                  alt="Ecotone"
                  className="wbtw-footer-logo-img wbtw-logo-img--light"
                  width={184}
                  height={57}
                  decoding="async"
                />
              </span>
            </a>
            <p className="wbtw-footer-tagline">Ecotone — Beyond Travel</p>
          </div>
          <nav className="wbtw-footer-socials" aria-label="Social media">
            <ul className="wbtw-footer-social-list">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="wbtw-footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="wbtw-footer-copy">© Ecotone. All rights reserved.</p>
      </div>
    </footer>
  )
}
