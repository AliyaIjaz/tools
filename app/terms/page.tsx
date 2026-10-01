import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and Conditions for using Zenveel browser-based utility tools.',
}

export default function TermsAndConditions() {
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
        Terms and Conditions
      </h1>
      <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Last updated: July 30, 2026
      </p>

      <div className="space-y-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p className="text-lg leading-relaxed">
            By accessing or using Zenveel (&ldquo;the Site&rdquo;), you agree to be bound by these Terms and
            Conditions. If you do not agree to these terms, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
          <p className="text-lg leading-relaxed">
            Zenveel provides free, browser-based utility tools including but not limited to: developer tools, text
            processing tools, image tools, and web utilities. All processing occurs client-side in your browser. We
            provide these tools on an &ldquo;as is&rdquo; basis without charge.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Permitted Use</h2>
          <p className="text-lg leading-relaxed mb-3">You may use Zenveel for any lawful personal or commercial purpose. You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <li>Use the Site in any way that violates applicable laws or regulations</li>
            <li>Attempt to interfere with or disrupt the Site&apos;s infrastructure</li>
            <li>Reverse-engineer, scrape, or systematically extract content from the Site</li>
            <li>Use automated bots to access the Site at a rate that places unreasonable load on our servers</li>
            <li>Reproduce or redistribute our tools or UI as a competing product without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. No Warranties</h2>
          <p className="text-lg leading-relaxed">
            Zenveel is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
            either express or implied, including but not limited to implied warranties of merchantability, fitness for
            a particular purpose, or non-infringement. We do not warrant that the tools will be error-free, uninterrupted,
            or produce accurate results for every use case.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Limitation of Liability</h2>
          <p className="text-lg leading-relaxed">
            To the fullest extent permitted by law, Zenveel and its operators shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of (or inability to use) the
            Site or its tools, even if we have been advised of the possibility of such damages. Our total liability for
            any claim related to the Site shall not exceed zero (as the service is provided free of charge).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Your Content & Data</h2>
          <p className="text-lg leading-relaxed">
            Since all tools run entirely in your browser, any files or data you process remain solely on your device.
            You retain full ownership and responsibility for the content you process using our tools. We make no claim
            to any data, files, or output generated through your use of the Site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Intellectual Property</h2>
          <p className="text-lg leading-relaxed">
            All content on this Site — including the name &ldquo;Zenveel&rdquo;, design, branding, and tool
            implementations — is the property of Zenveel and protected by applicable intellectual property laws. You
            may not copy, modify, or redistribute the Site&apos;s content without explicit written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Third-Party Links</h2>
          <p className="text-lg leading-relaxed">
            The Site may contain links to third-party websites or services. We are not responsible for the content,
            privacy practices, or availability of those sites. Linking does not imply endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">9. Changes to Terms</h2>
          <p className="text-lg leading-relaxed">
            We reserve the right to modify these Terms at any time. Updated terms will be posted on this page with a
            revised date. Continued use of the Site after any changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">10. Contact</h2>
          <p className="text-lg leading-relaxed">
            For questions about these Terms, please contact us at{' '}
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
