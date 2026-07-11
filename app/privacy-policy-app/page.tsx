import type { Metadata } from 'next'

import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import '../experiences/experience-surface.css'
import '../privacy-policy/privacy-surface.css'

export const metadata: Metadata = {
  title: 'EcoSpecies Explorer Privacy Policy | Ecotone',
  description: 'Privacy policy for the EcoSpecies Explorer mobile application by Ecotone S.A.C.',
}

export default function EcoSpeciesExplorerPrivacyPolicyPage() {
  return (
    <EcotoneV2Client solidMainNav>
      <div className="legal-page">
        <IsotipoDefs />
        <SiteHeader />
        <main className="legal-main">
          <div className="legal-inner">
            <header className="legal-header">
              <h1 className="legal-title">Privacy Policy</h1>
              <p className="legal-updated">Effective date: 28 March 2026</p>
            </header>

            <section className="legal-section">
              <p>
                EcoSpecies Explorer is operated by Ecotone S.A.C. (“Ecotone,” “we,” “our,” or “us”).
                This Privacy Policy explains how we collect, use, and protect information when you use
                the EcoSpecies Explorer mobile application.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">1. Information We Collect</h2>
              <p>We may collect the following information through the app:</p>

              <p>
                <span className="legal-meta-label">Information you provide directly</span>
              </p>
              <ul className="legal-list">
                <li>Your name and email address when submitting comments</li>
                <li>Your ratings and comments on species content</li>
              </ul>

              <p>
                <span className="legal-meta-label">Information stored locally on your device</span>
              </p>
              <ul className="legal-list">
                <li>Your saved favorite species</li>
                <li>Your downloaded offline content</li>
                <li>Certain app preferences and interface settings</li>
              </ul>

              <p>
                <span className="legal-meta-label">Technical and service-related information</span>
              </p>
              <ul className="legal-list">
                <li>
                  We may use third-party services such as Firebase to support app functionality,
                  content delivery, and data storage.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">2. How We Use Information</h2>
              <p>We use information to:</p>
              <ul className="legal-list">
                <li>Provide and improve the app experience</li>
                <li>Display and manage user-submitted comments and ratings</li>
                <li>Support offline content access</li>
                <li>Maintain and improve content and functionality</li>
                <li>Respond to support or privacy inquiries</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">3. Sharing of Information</h2>
              <p>We do not sell your personal information.</p>
              <p>
                We may share data only with service providers that help us operate the app, such as
                hosting and backend infrastructure providers, strictly as needed to provide the
                service.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">4. External Links</h2>
              <p>
                The app may include links to external websites and social media pages, including
                Ecotone’s website, Instagram, LinkedIn, TikTok, and YouTube. We are not responsible
                for the privacy practices of external sites or platforms.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">5. Data Retention</h2>
              <p>
                We retain information for as long as necessary to operate the app, provide its
                features, comply with legal obligations, and resolve disputes.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">6. Your Choices</h2>
              <p>You may choose not to submit comments or ratings.</p>
              <p>You may also remove the app from your device at any time.</p>
              <p>
                For requests related to your personal information, you may contact us using the
                details below.
              </p>
            </section>

            <section className="legal-section legal-contact">
              <h2 className="legal-section-title">7. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or your data, please contact:</p>
              <p>
                <span className="legal-meta-label">Ecotone S.A.C.</span>
                <br />
                Website:{' '}
                <a className="legal-link" href="https://www.ecotone.eco" target="_blank" rel="noopener noreferrer">
                  https://www.ecotone.eco
                </a>
                <br />
                Email:{' '}
                <a className="legal-link" href="mailto:info@ecotone.eco">
                  info@ecotone.eco
                </a>
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any updates will be posted at
                this page with a revised effective date.
              </p>
            </section>
          </div>
        </main>
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
