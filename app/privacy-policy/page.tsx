import type { Metadata } from 'next'

import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import '../experiences/experience-surface.css'
import './privacy-surface.css'

export const metadata: Metadata = {
  title: 'Privacy & Cookie Policy | Ecotone',
  description:
    'Learn how Ecotone collects, uses and protects personal data, including cookies, analytics and advertising consent.',
}

export default function PrivacyPolicyPage() {
  return (
    <EcotoneV2Client solidMainNav>
      <div className="legal-page">
        <IsotipoDefs />
        <SiteHeader />
        <main className="legal-main">
          <div className="legal-inner">
            <header className="legal-header">
              <h1 className="legal-title">Privacy &amp; Cookie Policy</h1>
              <p className="legal-updated">Last updated: July 2026</p>
            </header>

            <section className="legal-section">
              <h2 className="legal-section-title">1. Introduction</h2>
              <p>
                This Privacy &amp; Cookie Policy explains how Ecotone collects, uses and protects
                personal information when you visit{' '}
                <a className="legal-link" href="https://www.ecotone.eco" target="_blank" rel="noopener noreferrer">
                  ecotone.eco
                </a>
                , enquire about a trip, submit a form, contact us, or interact with our advertising
                and analytics tools. It is intended to help you understand what information we handle
                and the choices available to you.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">2. Who we are</h2>
              <p>
                <span className="legal-meta-label">Ecotone Nature</span>
                <br />
                Website:{' '}
                <a className="legal-link" href="https://www.ecotone.eco" target="_blank" rel="noopener noreferrer">
                  https://www.ecotone.eco
                </a>
                <br />
                Contact email:{' '}
                <a className="legal-link" href="mailto:info@ecotone.eco">
                  info@ecotone.eco
                </a>
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">3. Information we collect</h2>
              <ul className="legal-list">
                <li>Contact details submitted through forms, such as name, email, phone number and message.</li>
                <li>
                  Trip enquiry information, such as travel interests, preferred destination, dates,
                  group type, number of travellers and any details you choose to share.
                </li>
                <li>Communication data from email, WhatsApp, calls or other contact channels.</li>
                <li>
                  Website usage data, such as pages visited, referral source, campaign information,
                  device/browser information and interactions with CTAs or forms.
                </li>
                <li>Cookie and consent preference data.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">4. How we use information</h2>
              <ul className="legal-list">
                <li>To respond to enquiries and trip requests.</li>
                <li>To prepare or personalise travel proposals.</li>
                <li>To manage customer communication.</li>
                <li>To improve website performance and user experience.</li>
                <li>To measure marketing campaigns and understand which channels generate enquiries.</li>
                <li>To run and measure Google Ads and analytics activity.</li>
                <li>To comply with legal, security and administrative obligations.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">5. Cookies and analytics</h2>
              <p>This website uses cookies and similar technologies for:</p>
              <ul className="legal-list">
                <li>Essential website functionality.</li>
                <li>Analytics and performance measurement.</li>
                <li>Advertising measurement and campaign attribution.</li>
                <li>Consent preference storage.</li>
              </ul>
              <p>
                We use Google Analytics 4 and Google Ads through the Google tag, together with Google
                Consent Mode v2. This setup is designed to support consent-based measurement. In plain
                English: visitors in the UK and EEA are asked for consent before analytics or
                advertising storage is granted, and you can accept or decline through the cookie
                banner shown on the site.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">6. Google services</h2>
              <ul className="legal-list">
                <li>Google Analytics helps us understand website usage and performance.</li>
                <li>Google Ads helps us measure advertising campaigns and enquiries.</li>
                <li>Your consent choices may affect whether Google can use cookies or advertising identifiers.</li>
                <li>Google may process data according to its own policies.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">7. Legal bases</h2>
              <p>
                Depending on the context, Ecotone may rely on consent, legitimate interests,
                contractual necessity or legal obligations. Consent is used where required for
                cookies, analytics and advertising storage.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">8. Sharing information</h2>
              <p>We may share limited data with:</p>
              <ul className="legal-list">
                <li>Website hosting and technology providers.</li>
                <li>Analytics and advertising providers such as Google.</li>
                <li>CRM, email or communication tools used to respond to enquiries.</li>
                <li>Operational partners only when needed to respond to or manage a travel request.</li>
                <li>Authorities where legally required.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">9. International transfers</h2>
              <p>
                Because Ecotone operates internationally and uses global technology providers, your
                data may be processed outside your country. We take reasonable steps to use providers
                with appropriate safeguards.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">10. Data retention</h2>
              <p>
                We keep personal information only for as long as reasonably necessary for the purposes
                described, including responding to enquiries, managing customer relationships,
                legal/accounting needs and marketing measurement.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">11. Your rights</h2>
              <p>
                Depending on your location, you may have the right to request access, correction,
                deletion, restriction, objection, withdrawal of consent and portability of your
                personal information where applicable. To exercise any of these rights, contact us at{' '}
                <a className="legal-link" href="mailto:info@ecotone.eco">
                  info@ecotone.eco
                </a>
                .
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">12. Managing cookie consent</h2>
              <p>
                You can accept or decline cookies through the banner shown on the site. Your choice is
                stored so you are not asked again on future visits, and you can change it by clearing
                your browser cookies for this site.
              </p>
              {/* Placeholder: a future "Manage cookie preferences" button can be added here to let users reopen the consent banner. */}
              <p>
                A “Manage cookie preferences” option may be added here in future so you can update
                your choice at any time.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">13. Security</h2>
              <p>
                We use reasonable technical and organisational measures to protect personal
                information. However, no method of transmission or storage is completely secure, and
                we cannot guarantee absolute security.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">14. Updates</h2>
              <p>
                We may update this policy from time to time. Any changes will be reflected on this
                page with a revised “Last updated” date.
              </p>
              <p>
                <span className="legal-meta-label">Last updated:</span> July 2026
              </p>
            </section>

            <section className="legal-section legal-contact">
              <h2 className="legal-section-title">15. Contact</h2>
              <p>For any questions about this policy or your personal information, contact us at:</p>
              <p>
                <a className="legal-link" href="mailto:info@ecotone.eco">
                  info@ecotone.eco
                </a>
              </p>
            </section>
          </div>
        </main>
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
