import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Affiliate Disclaimer | Future Agent',
  description:
    "Learn about Future Agent's affiliate relationships and how we earn commissions.",
}

export default function AffiliateDisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-300">Affiliate Disclaimer</span>
        </nav>

        <article className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-4xl font-bold text-white mb-4">
            Affiliate Disclaimer
          </h1>
          <p className="text-slate-400 mb-8">Last updated: December 14, 2025</p>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
            <p className="text-slate-300 leading-relaxed">
              Future Agent participates in affiliate marketing programs and may
              earn commissions from purchases made through links on our website.
              This disclosure is made in accordance with the Federal Trade
              Commission&apos;s guidelines on endorsements and testimonials.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              What Are Affiliate Links?
            </h2>
            <p className="text-slate-300 mb-6">
              Affiliate links are special tracking URLs that allow us to earn a
              commission when you click on a link to a product or service and
              make a purchase. These links contain unique identifiers that let
              the merchant know you were referred by Future Agent.
            </p>
            <p className="text-slate-300 mb-6">
              When you see buttons or links on our site like &quot;Try
              ChatGPT,&quot; &quot;Get Started,&quot; or &quot;Visit Jasper
              AI,&quot; these are often affiliate links.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              How We Earn Commissions
            </h2>
            <p className="text-slate-300 mb-4">
              We earn affiliate commissions when:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>You click an affiliate link on our website</li>
              <li>
                You make a purchase or sign up for a service within a specified
                time period (usually 30-90 days)
              </li>
              <li>The merchant tracks and confirms the transaction</li>
            </ul>
            <p className="text-slate-300 mb-6">
              <strong className="text-white">Important:</strong> Using our
              affiliate links costs you nothing extra. You pay the same price as
              going directly to the merchant&apos;s website. In some cases, you
              may even get exclusive discounts through our links.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Our Affiliate Partners
            </h2>
            <p className="text-slate-300 mb-4">
              We participate in affiliate programs with various AI tool
              providers and affiliate networks, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>
                Individual AI tool companies (OpenAI, Jasper, Copy.ai, etc.)
              </li>
              <li>
                Affiliate networks (ShareASale, Impact, Commission Junction)
              </li>
              <li>Other technology and software providers</li>
            </ul>
            <p className="text-slate-300 mb-6">
              The specific affiliate relationships may change over time as we
              add new partnerships.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Our Editorial Independence
            </h2>
            <p className="text-slate-300 mb-6">
              While we earn commissions from affiliate links, our reviews and
              recommendations are based on genuine research and testing. We are
              committed to providing honest, unbiased information about AI
              tools.
            </p>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">We promise to:</strong>
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Only recommend tools we genuinely believe provide value</li>
              <li>Clearly state both pros and cons in our reviews</li>
              <li>
                Update reviews when products change or new information becomes
                available
              </li>
              <li>Never let affiliate commissions influence our editorial content</li>
              <li>Disclose affiliate relationships where applicable</li>
            </ul>
            <p className="text-slate-300 mb-6">
              If we don&apos;t think a tool is worth recommending, we won&apos;t
              promote it, regardless of potential commissions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Testing and Research
            </h2>
            <p className="text-slate-300 mb-6">
              Our reviews are based on a combination of:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Hands-on testing of AI tools and services</li>
              <li>Research into features, pricing, and user experiences</li>
              <li>Analysis of user reviews and feedback from multiple sources</li>
              <li>Comparison with competing products in the market</li>
              <li>Regular updates as tools evolve and improve</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">No Guarantees</h2>
            <p className="text-slate-300 mb-6">
              While we strive to provide accurate and helpful information, we
              cannot guarantee specific results from using any AI tool we
              recommend. Your experience may differ based on your specific
              needs, use cases, and how you implement the tools.
            </p>
            <p className="text-slate-300 mb-6">
              We are not responsible for any issues, losses, or damages that may
              occur from using products or services we review or recommend.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Price and Availability
            </h2>
            <p className="text-slate-300 mb-6">
              Prices, features, and availability of AI tools can change without
              notice. While we try to keep our content up-to-date, there may be
              times when pricing or feature information is outdated. Always
              verify current pricing and features on the vendor&apos;s website
              before making a purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Supporting Future Agent
            </h2>
            <p className="text-slate-300 mb-6">
              By using our affiliate links, you help support Future Agent at no
              extra cost to you. These commissions help us:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
              <li>Maintain and improve our website</li>
              <li>Research and test new AI tools</li>
              <li>Create in-depth reviews and guides</li>
              <li>Keep our content free and accessible to everyone</li>
            </ul>
            <p className="text-slate-300 mb-6">
              We truly appreciate your support!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Affiliates
            </h2>
            <p className="text-slate-300 mb-4">
              If you have questions about our affiliate relationships or want to
              know if a specific link is an affiliate link, please contact us:
            </p>
            <ul className="list-none text-slate-300 space-y-2 mb-6">
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

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              FTC Disclosure
            </h2>
            <p className="text-slate-300 mb-6">
              In accordance with the Federal Trade Commission&apos;s 16 CFR,
              Part 255: &quot;Guides Concerning the Use of Endorsements and
              Testimonials in Advertising,&quot; we disclose that we have
              financial relationships with some of the products and services
              mentioned on this website. We may be compensated if you click on
              links and take actions such as signing up or making a purchase.
            </p>
          </section>

          <div className="bg-cyan-900/20 border border-cyan-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-3">Disclaimer:</h3>
            <p className="text-slate-300 mb-0">
              We only recommend AI tools we believe in, and we&apos;re
              transparent about earning commissions. Your trust is more valuable
              to us than any affiliate payment. We&apos;re committed to
              providing honest, helpful reviews that serve your interests first.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
