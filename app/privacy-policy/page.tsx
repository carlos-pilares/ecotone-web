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
    'Learn how Ecotone S.A.C. collects, uses and protects personal data, including programme enquiries, cookies, analytics and advertising consent.',
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
              <p className="legal-updated">Last updated: 24 August 2026</p>
            </header>

            <section className="legal-section">
              <h2 className="legal-section-title">1. Introduction</h2>
              <p>
                This Privacy &amp; Cookie Policy explains how Ecotone S.A.C. (&ldquo;Ecotone&rdquo;,
                &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) collects, uses, stores and
                protects personal information when you visit{' '}
                <a className="legal-link" href="https://www.ecotone.eco" target="_blank" rel="noopener noreferrer">
                  ecotone.eco
                </a>
                , enquire about a programme or experience, submit an application or booking enquiry,
                contact us, or interact with our advertising and analytics tools.
              </p>
              <p>
                Ecotone S.A.C. operates ecotone.eco and provides conservation, experiential learning
                and nature-based programmes in Peru. For privacy-related questions or requests,
                contact us at{' '}
                <a className="legal-link" href="mailto:info@ecotone.eco">
                  info@ecotone.eco
                </a>
                .
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">2. Who we are</h2>
              <p>
                <span className="legal-meta-label">Data controller:</span> Ecotone S.A.C.
                <br />
                Website:{' '}
                <a className="legal-link" href="https://www.ecotone.eco" target="_blank" rel="noopener noreferrer">
                  https://www.ecotone.eco
                </a>
                <br />
                Privacy contact:{' '}
                <a className="legal-link" href="mailto:info@ecotone.eco">
                  info@ecotone.eco
                </a>
              </p>
              <p>
                We do not publish a business street address on this website. For privacy-related
                correspondence, please use the email address above.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">3. Information we collect</h2>
              <p>
                The information we collect depends on how you interact with Ecotone. We may collect
                the following categories:
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Contact and identity details</strong>, such as full name, email address,
                  and phone or WhatsApp number when you provide them.
                </li>
                <li>
                  <strong>Programme and enquiry details</strong>, such as preferred programme dates
                  or travel period, group size, programme or experience of interest, messages or
                  questions you submit, and alternative dates or options you ask about.
                </li>
                <li>
                  <strong>Application, booking and enquiry administration data</strong>, such as
                  booking or enquiry status, internal notes, and a lead or enquiry identifier created
                  when you submit a form or otherwise contact us about a programme.
                </li>
                <li>
                  <strong>Campaign, source and attribution data</strong>, such as how you reached
                  Ecotone, referral or campaign information, UTM parameters, and similar advertising
                  or analytics attribution data where available.
                </li>
                <li>
                  <strong>Communications</strong> relating to an enquiry or application, including
                  email, WhatsApp, phone or other messages you send to us or we send in response.
                </li>
                <li>
                  <strong>Website usage and technical data</strong>, such as pages visited, device
                  and browser information, interactions with forms or calls to action, and log or
                  security-related data.
                </li>
                <li>
                  <strong>Cookie and consent preference data</strong>, including choices you make
                  through our cookie consent banner.
                </li>
              </ul>
              <p>
                For example, when you use a programme enquiry flow such as Manu Conservation
                Volunteer, we may collect your name, email, optional phone number, preferred join
                period, group size, the page you submitted from, and related campaign or attribution
                data. We do not ask you to provide more information through that form than is needed
                for the enquiry.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">4. How we use information</h2>
              <p>We use personal information for the following purposes:</p>
              <ul className="legal-list">
                <li>
                  <strong>Responding to enquiries:</strong> to provide requested information, show
                  relevant programme options or offers, and answer questions.
                </li>
                <li>
                  <strong>Managing applications and bookings:</strong> to help visitors choose dates,
                  coordinate availability, and administer participation if they decide to proceed.
                </li>
                <li>
                  <strong>Requested follow-up:</strong> to follow up on the specific programme, offer
                  or enquiry requested by the visitor and provide the information or links needed to
                  continue.
                </li>
                <li>
                  <strong>Alternative dates and options:</strong> to assess and respond when someone
                  asks for programme dates or arrangements outside fixed departures or published
                  options.
                </li>
                <li>
                  <strong>Operating and improving Ecotone:</strong> to run our website, respond to
                  support requests, improve user experience, maintain security, and understand how
                  our services are used.
                </li>
                <li>
                  <strong>Analytics and campaign measurement:</strong> to measure website performance
                  and understand which channels generate enquiries, including through Google Analytics
                  and Google Ads where consent or applicable law allows.
                </li>
                <li>
                  <strong>Legal, accounting and regulatory purposes:</strong> including fraud
                  prevention, record-keeping, tax, accounting, compliance and responding to lawful
                  requests.
                </li>
              </ul>
              <p>
                Submitting a programme enquiry or application does not, by itself, mean you have
                agreed to receive unrelated newsletters or indefinite marketing from Ecotone.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">5. Communications and marketing</h2>
              <p>
                If you ask us for information about a particular programme, availability or offer, we
                may contact you to respond to that request and help you complete the enquiry or
                application process.
              </p>
              <p>
                Broader marketing communications about future Ecotone programmes, promotions or
                opportunities will be handled separately and in accordance with applicable marketing
                rules, including consent where required. Where we send marketing messages that require
                an opt-in or allow an opt-out under applicable law, you may unsubscribe using the
                method provided in those communications or by contacting us.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">6. Legal bases</h2>
              <p>
                Where Peruvian data protection law, the EU General Data Protection Regulation
                (GDPR) or the UK GDPR applies, we process personal information on one or more of
                the following bases, depending on the activity:
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Steps at your request before a contract:</strong> for example, when you
                  submit a programme enquiry or application and we need to respond or prepare next
                  steps.
                </li>
                <li>
                  <strong>Performance of a contract:</strong> where processing is necessary to
                  administer a booking or participation agreement with you.
                </li>
                <li>
                  <strong>Legal obligation:</strong> where we must process information to comply with
                  applicable law, tax, accounting or regulatory requirements.
                </li>
                <li>
                  <strong>Legitimate interests:</strong> where appropriate and balanced against your
                  rights, for example to operate and secure our website, measure enquiries, improve
                  services, and maintain business records related to an enquiry you initiated.
                </li>
                <li>
                  <strong>Consent:</strong> where consent is legally required, such as for certain
                  cookies, analytics or advertising storage, or for separate optional marketing
                  communications.
                </li>
              </ul>
              <p>
                Where future marketing consent is required, it is separate and optional from
                submitting a programme enquiry.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">7. Cookies and analytics</h2>
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
              <h2 className="legal-section-title">8. Google services</h2>
              <ul className="legal-list">
                <li>Google Analytics helps us understand website usage and performance.</li>
                <li>Google Ads helps us measure advertising campaigns and enquiries.</li>
                <li>Your consent choices may affect whether Google can use cookies or advertising identifiers.</li>
                <li>Google may process data according to its own policies.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">9. Sharing information</h2>
              <p>
                We do not sell personal information to advertisers. We may share limited information
                with service providers and partners only where needed for the purposes described in
                this policy, including:
              </p>
              <ul className="legal-list">
                <li>Website hosting and infrastructure providers.</li>
                <li>Cloud storage, productivity and collaboration tools.</li>
                <li>Lead and enquiry management systems, such as spreadsheet-based lead records.</li>
                <li>Email delivery providers used to send enquiry notifications.</li>
                <li>Booking or payment platforms used when you proceed to book a programme.</li>
                <li>Analytics and advertising providers, including Google.</li>
                <li>Professional, legal and accounting advisers where reasonably necessary.</li>
                <li>Operational partners where needed to respond to or manage a travel or programme request.</li>
                <li>Authorities, regulators or other parties where legally required.</li>
              </ul>
              <p>
                Service providers are expected to handle information only on our instructions and for
                the relevant purpose, subject to their own privacy and security obligations.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">10. International data transfers</h2>
              <p>
                Ecotone S.A.C. is based in Peru. Because we use international technology and service
                providers, your information may be processed in Peru and in other countries where
                those providers operate.
              </p>
              <p>
                Where applicable law requires safeguards for international transfers, we take
                reasonable steps to use appropriate contractual, organisational or other protections
                offered by relevant providers. We do not represent that a specific transfer mechanism
                applies to every service unless it is actually configured for that provider.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">11. Data retention</h2>
              <p>
                We keep personal information only for as long as reasonably necessary for the
                purposes described in this policy, subject to applicable legal, accounting and
                regulatory requirements. In general:
              </p>
              <ul className="legal-list">
                <li>
                  Enquiries that do not become bookings may generally be retained for up to{' '}
                  <strong>24 months after the last meaningful interaction</strong>, unless a longer
                  period is required or justified.
                </li>
                <li>
                  Booking and customer records may be retained for longer where required for
                  contractual performance, accounting, tax, dispute resolution or other legal reasons.
                </li>
                <li>
                  Marketing information processed on the basis of consent may be retained until
                  consent is withdrawn or until deletion is required under our retention approach or
                  applicable law.
                </li>
                <li>
                  Analytics and cookie-related data is retained according to the configuration of the
                  relevant services and your consent choices.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">12. Your privacy rights</h2>
              <p>
                Depending on your location and applicable law, you may have some or all of the
                following rights in relation to your personal information. These rights are not
                identical in every jurisdiction and may be subject to legal exceptions:
              </p>
              <ul className="legal-list">
                <li>Right of information or access.</li>
                <li>Right to correction or rectification.</li>
                <li>Right to deletion or cancellation.</li>
                <li>Right to object to certain processing.</li>
                <li>Right to restriction of processing.</li>
                <li>Right to data portability, where applicable.</li>
                <li>Right to withdraw consent where processing relies on consent.</li>
              </ul>
              <p>
                Rights under Peruvian data protection law, GDPR and UK GDPR may differ in scope and
                procedure. We will respond in accordance with the law that applies to your request.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">13. How to exercise your privacy rights</h2>
              <p>
                To exercise a privacy right or ask a question about your information, contact us at{' '}
                <a className="legal-link" href="mailto:info@ecotone.eco">
                  info@ecotone.eco
                </a>
                . Please use the subject line &ldquo;Privacy request&rdquo; and tell us what you are
                asking for. We may need to verify your identity before responding where appropriate.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">14. Programme age requirements</h2>
              <p>
                The Manu Conservation Volunteer enquiry and application process is intended for people
                aged 18 or over. We do not knowingly use this programme&apos;s enquiry forms to
                collect personal information from children under 18.
              </p>
              <p>
                Other parts of the Ecotone website may be used by visitors of different ages. This
                section applies specifically to the Manu Conservation Volunteer enquiry and application
                flow.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">15. Managing cookie consent</h2>
              <p>
                When you first visit the site, you can accept or decline non-essential cookies through
                the consent banner. Your choice is stored in a first-party cookie so you are not asked
                again on every visit, and your preference is re-applied when you return.
              </p>
              <p>
                You can change your choice by clearing cookies for this website in your browser, which
                will cause the banner to appear again on your next visit. At present, the site does
                not provide a separate always-visible &ldquo;Manage cookie preferences&rdquo; control
                outside that banner.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">16. Security</h2>
              <p>
                We use reasonable technical and organisational measures to protect personal
                information. However, no method of transmission or storage is completely secure, and
                we cannot guarantee absolute security.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">17. Updates to this policy</h2>
              <p>
                We may update this policy from time to time. Any changes will be reflected on this
                page with a revised &ldquo;Last updated&rdquo; date.
              </p>
              <p>
                <span className="legal-meta-label">Last updated:</span> 24 August 2026
              </p>
            </section>

            <section className="legal-section legal-contact">
              <h2 className="legal-section-title">18. Contact</h2>
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
