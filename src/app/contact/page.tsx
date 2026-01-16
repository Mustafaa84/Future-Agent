import ContactFormClient from '@/components/ContactFormClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Future Agent',
  description:
    "Get in touch with Future Agent. We're here to help you find the perfect AI tools for your needs.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Have questions about AI tools? Need help choosing the right
            solution? We&apos;re here to help you navigate the world of AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send us a message
            </h2>
            <ContactFormClient />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Email */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:info@futureagent.net"
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    info@futureagent.net
                  </a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Response Time
                  </h3>
                  <p className="text-slate-400">
                    We typically respond within 24-48 hours during business
                    days.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://twitter.com/futureagent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com/company/futureagent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
