const LOGO = '/brand/logo-full-horizontal-ece5d5.svg'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/ecotone.eco/', ariaLabel: 'Ecotone on Instagram' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Ecotone-Nature', ariaLabel: 'Ecotone on YouTube' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ecotone-eco/posts/?feedView=all',
    ariaLabel: 'Ecotone on LinkedIn',
  },
] as const

export function ManuVolunteerCampaignFooter() {
  return (
    <footer className="mcv-footer">
      <div className="mcv-container">
        <div className="mcv-footer-inner">
          <div className="mcv-footer-brand">
            <a
              href="https://www.ecotone.eco/"
              className="mcv-footer-logo-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ecotone home"
            >
              <img src={LOGO} alt="" className="mcv-footer-logo" width={184} height={57} decoding="async" />
            </a>
            <p className="mcv-footer-tagline">Ecotone — Beyond Travel</p>
          </div>
          <nav className="mcv-footer-socials" aria-label="Social media">
            <ul className="mcv-footer-social-list">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="mcv-footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mcv-footer-copy">© Ecotone. All rights reserved.</p>
      </div>
    </footer>
  )
}
