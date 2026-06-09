import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Prof. Bola Akanji',
  description: 'Privacy policy for the Professor Bola Akanji research website.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f172a] py-14 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-800/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-800/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-300">
            How we collect, use, and protect your personal information.
          </p>
          <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you fill out a
              contact form, subscribe to our newsletter, or download a resource. This may
              include your name, email address, phone number, organization, and any other
              information you choose to provide.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and requests</li>
              <li>Send you research updates and newsletters (with your consent)</li>
              <li>Process resource download requests</li>
              <li>Improve our website and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable
              information to outside parties except as required to provide our services,
              comply with the law, or protect our rights.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to
              protect your personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission over the
              Internet is 100% secure.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Our website may use cookies and similar technologies to enhance your browsing
              experience, analyze site traffic, and understand how visitors interact with
              our content. You can control cookies through your browser settings.
            </p>

            <h2>6. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible
              for the privacy practices or content of these external sites. We encourage
              you to review the privacy policies of any third-party sites you visit.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>

            <h2>8. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@bolaakanji.org" className="text-emerald-700 hover:underline">
                privacy@bolaakanji.org
              </a>.
            </p>

            <h2>9. Updates</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of
              any changes by posting the new policy on this page and updating the
              &ldquo;Last Updated&rdquo; date.
            </p>

            <p className="text-sm italic">
              Last Updated: March 1, 2025
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
