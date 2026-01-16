import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Future Agent',
  description: 'Read the terms and conditions for using Future Agent website.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-300">Terms of Service</span>
        </nav>

        <article className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-4xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-400 mb-8">Last updated: December 14, 2025</p>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
            <p className="text-slate-300 leading-relaxed">
              Welcome to Future Agent. By accessing or using our website, you
              agree to be bound by these Terms of Service. Please read them
              carefully before using our services.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-300 mb-6">
              By accessing and using Future Agent (&quot;the Website&quot;), you
              accept and agree to be bound by these Terms of Service and our
              Privacy Policy. If you do not agree to these terms, please do not
              use our Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-slate-300 mb-4">Future Agent provides:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Reviews and information about AI tools and software</li>
              <li>Educational content about artificial intelligence</li>
              <li>Recommendations and comparisons of AI products</li>
              <li>Email newsletter with AI tool updates and tips</li>
              <li>AI tool recommendation quiz</li>
            </ul>
            <p className="text-slate-300 mb-6">
              Our content is for informational purposes only and should not be
              considered professional advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. User Conduct
            </h2>
            <p className="text-slate-300 mb-4">
              When using our Website, you agree NOT to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Transmit any viruses, malware, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape, harvest, or collect user data without permission</li>
              <li>Use our content for commercial purposes without authorization</li>
              <li>Post spam or unsolicited messages</li>
              <li>Interfere with the proper functioning of the Website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Intellectual Property
            </h2>
            <p className="text-slate-300 mb-6">
              All content on Future Agent, including text, graphics, logos,
              images, and software, is the property of Future Agent or its
              content suppliers and is protected by copyright, trademark, and
              other intellectual property laws. You may not reproduce,
              distribute, modify, or create derivative works from our content
              without explicit written permission.
            </p>
            <p className="text-slate-300 mb-6">
              You may share links to our content and quote short excerpts with
              proper attribution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Affiliate Relationships
            </h2>
            <p className="text-slate-300 mb-6">
              Future Agent participates in affiliate marketing programs. We may
              earn commissions when you click affiliate links and make
              purchases. This does not affect the price you pay or our editorial
              independence. For full details, see our{' '}
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
              6. Disclaimer of Warranties
            </h2>
            <p className="text-slate-300 mb-6">
              THE WEBSITE AND ITS CONTENT ARE PROVIDED &quot;AS IS&quot; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We do not
              guarantee that:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>The Website will be uninterrupted, secure, or error-free</li>
              <li>
                The information provided is accurate, complete, or up-to-date
              </li>
              <li>Any errors or defects will be corrected</li>
              <li>The Website is free of viruses or harmful components</li>
            </ul>
            <p className="text-slate-300 mb-6">
              You use the Website at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-slate-300 mb-6">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, Future Agent and its
              owners, employees, and affiliates SHALL NOT BE LIABLE for any
              indirect, incidental, special, consequential, or punitive damages,
              or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other
              intangible losses resulting from:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Your use or inability to use the Website</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of the Website</li>
              <li>Any errors or omissions in content</li>
              <li>Your reliance on information obtained from the Website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Third-Party Links
            </h2>
            <p className="text-slate-300 mb-6">
              Our Website contains links to third-party websites and services.
              We are not responsible for the content, privacy policies, or
              practices of any third-party sites. We encourage you to review the
              terms and policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              9. User-Generated Content
            </h2>
            <p className="text-slate-300 mb-6">
              If you submit content to our Website (such as comments, reviews,
              or quiz responses), you grant Future Agent a non-exclusive,
              worldwide, royalty-free license to use, reproduce, modify, and
              display that content. You represent that you own or have
              permission to share any content you submit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Termination
            </h2>
            <p className="text-slate-300 mb-6">
              We reserve the right to terminate or suspend your access to the
              Website at any time, without notice, for any reason, including if
              we believe you have violated these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-slate-300 mb-6">
              We may revise these Terms of Service at any time by updating this
              page. Your continued use of the Website after changes are posted
              constitutes your acceptance of the revised terms. We encourage you
              to review these terms periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              12. Governing Law
            </h2>
            <p className="text-slate-300 mb-6">
              These Terms of Service shall be governed by and construed in
              accordance with the laws of Egypt, without regard to its conflict
              of law provisions. Any disputes arising from these terms shall be
              resolved in the courts of Egypt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              13. Contact Information
            </h2>
            <p className="text-slate-300 mb-4">
              If you have any questions about these Terms of Service, please
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

          <div className="bg-cyan-900/20 border border-cyan-500/50 rounded-lg p-6 mt-8 text-center">
            <p className="text-slate-300 text-sm">
              <strong>Thank you for visiting Future Agent.</strong>
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
