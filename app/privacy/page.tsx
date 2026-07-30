import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Zenveel — learn how we handle your data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1
        className="text-3xl font-bold mb-2"
        style={{
          background: 'linear-gradient(90deg, var(--color-dev), var(--color-image))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-orbitron)',
        }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Last updated: July 30, 2026
      </p>

      <div className="space-y-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Overview</h2>
          <p className="text-base leading-relaxed">
            Zenveel (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website at zenveel.com. We
            are committed to protecting your privacy. This policy explains what information we collect, how we use it,
            and your rights in relation to it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. No Personal Data Collection</h2>
          <p className="text-base leading-relaxed">
            All tools on Zenveel run entirely in your browser. <strong className="text-white">We do not collect,
            transmit, or store any files, text, or data you process using our tools.</strong> Your input never leaves
            your device. We have no accounts, no logins, and no user profiles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Automatically Collected Information</h2>
          <p className="text-base leading-relaxed mb-3">
            Like most websites, our hosting infrastructure may automatically log standard technical information when
            your browser requests a page, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <li>IP address (anonymized where possible)</li>
            <li>Browser type and version</li>
            <li>Referring URL</li>
            <li>Pages visited and time of visit</li>
            <li>Operating system</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            This information is used solely for security monitoring and aggregate traffic analysis. It is not linked to
            any personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Cookies</h2>
          <p className="text-base leading-relaxed">
            We do not set our own tracking or advertising cookies. We may use essential browser local storage to
            preserve your preferences within your session. Third-party services we use (such as Google AdSense) may
            set their own cookies — see section 6 for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Third-Party Services</h2>
          <p className="text-base leading-relaxed">
            We may use third-party services for hosting and analytics (such as Vercel or Google Analytics). These
            services have their own privacy policies. We configure such services to minimize data collection and do not
            share personally identifiable information with them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Advertising (Google AdSense)</h2>
          <p className="text-base leading-relaxed mb-3">
            Zenveel uses Google AdSense to display advertisements. Google AdSense is a service provided by Google LLC.
            As a third-party vendor, Google uses cookies (including the DoubleClick cookie) to serve ads based on your
            prior visits to this site or other sites on the internet.
          </p>
          <p className="text-base leading-relaxed mb-3">
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to
            Zenveel and/or other sites on the Internet. You may opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--color-image)' }}
            >
              Google Ads Settings
            </a>
            .
          </p>
          <p className="text-base leading-relaxed">
            For more information on how Google uses data when you use our site, please visit{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--color-image)' }}
            >
              How Google uses information from sites or apps that use our services
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Changes to This Policy</h2>
          <p className="text-base leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be reflected by an updated date at the
            top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Contact</h2>
          <p className="text-base leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a
              href="mailto:thesaturndevelopers@gmail.com"
              style={{ color: 'var(--color-image)' }}
              className="underline"
            >
              thesaturndevelopers@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
