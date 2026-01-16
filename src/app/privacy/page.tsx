import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Future Agent',
  description:
    'Learn how Future Agent collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-300">Privacy Policy</span>
        </nav>

        <article className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-8">
            Last updated: December 14, 2025
          </p>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
            <p className="text-slate-300 leading-relaxed">
              At Future Agent, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-white mb-3">
              Personal Information
            </h3>
            <p className="text-slate-300 mb-4">
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Subscribe to our email newsletter</li>
              <li>Fill out our contact form</li>
              <li>Complete our AI tool recommendation quiz</li>
              <li>Interact with our website features</li>
            </ul>
            <p className="text-slate-300 mb-6">
              This information may include your name, email address, and any
              other information you choose to provide.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">
              Automatically Collected Information
            </h3>
            <p className="text-slate-300 mb-4">
              When you visit our website, we may automatically collect certain
              information about your device, including:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device identifiers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-slate-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>
                Send you our email newsletter and updates (only if you
                subscribed)
              </li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and user experience</li>
              <li>Analyze website usage and trends</li>
              <li>Provide personalized AI tool recommendations</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Email Marketing
            </h2>
            <p className="text-slate-300 mb-4">
              We use MailerLite to manage our email newsletter. When you
              subscribe to our newsletter:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Your email address is stored securely with MailerLite</li>
              <li>
                You can unsubscribe at any time using the link in every email
              </li>
              <li>
                We will never sell or share your email address with third
                parties for marketing purposes
              </li>
              <li>
                We send updates about AI tools, reviews, and exclusive
                recommendations
              </li>
            </ul>
            <p className="text-slate-300 mb-6">
              For more information on how MailerLite handles your data, please
              visit their{' '}
              <a
                href="https://www.mailerlite.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p className="text-slate-300 mb-4">
              We use cookies and similar tracking technologies to enhance your
              experience on our website. Cookies are small data files stored on
              your device that help us:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Remember your preferences</li>
              <li>Understand how you use our site</li>
              <li>Improve site performance</li>
              <li>Track affiliate link clicks</li>
            </ul>
            <p className="text-slate-300 mb-6">
              You can control cookies through your browser settings. However,
              disabling cookies may affect your ability to use certain features
              of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Third-Party Services
            </h2>
            <p className="text-slate-300 mb-4">
              We use third-party services that may collect information about
              you:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>
                <strong>MailerLite:</strong> Email marketing and newsletter
                management
              </li>
              <li>
                <strong>Hosting Provider:</strong> Website hosting and
                infrastructure
              </li>
              <li>
                <strong>Analytics Services:</strong> Website traffic and
                behavior analysis (if implemented)
              </li>
            </ul>
            <p className="text-slate-300 mb-6">
              These services have their own privacy policies governing how they
              use your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Affiliate Links
            </h2>
            <p className="text-slate-300 mb-6">
              Our website contains affiliate links to AI tools and services.
              When you click these links and make a purchase, we may earn a
              commission at no additional cost to you. This does not affect how
              we collect or use your personal information. For more details, see
              our{' '}
              <Link
                href="/affiliate-disclaimer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Affiliate Disclaimer
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Data Security
            </h2>
            <p className="text-slate-300 mb-6">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no method
              of transmission over the internet or electronic storage is 100%
              secure. While we strive to protect your data, we cannot guarantee
              absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p className="text-slate-300 mb-4">
              Depending on your location, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>
                <strong>Access:</strong> Request a copy of the personal
                information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Unsubscribe:</strong> Opt out of marketing emails at any
                time
              </li>
              <li>
                <strong>Data Portability:</strong> Request transfer of your data
                to another service
              </li>
            </ul>
            <p className="text-slate-300 mb-6">
              To exercise these rights, please contact us at{' '}
              <a
                href="mailto:hello@futureagent.net"
                className="text-cyan-400 hover:text-cyan-300"
              >
                hello@futureagent.net
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-slate-300 mb-6">
              Our website is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you believe we have collected information from a child
              under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              International Data Transfers
            </h2>
            <p className="text-slate-300 mb-6">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. By using our website, you consent
              to the transfer of your information to these countries.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-slate-300 mb-6">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last updated&quot; date. You are
              advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-slate-300 mb-4">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <ul className="list-none text-slate-300 space-y-2">
              <li>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:hello@futureagent.net"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  hello@futureagent.net
                </a>
              </li>
              <li>
                <strong>Contact Form:</strong>{' '}
                <Link
                  href="/contact"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Contact Page
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  )
}
