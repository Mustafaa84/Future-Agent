'use client'

import Link from 'next/link'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-900">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand + Social */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 44 44" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <defs>
                  <linearGradient id="footer-robot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#C084FC" />
                  </linearGradient>
                </defs>
                
                <line x1="22" y1="6" x2="22" y2="12" stroke="url(#footer-robot-gradient)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="22" cy="5" r="2" fill="#06B6D4" opacity="0.8" />
                
                <rect 
                  x="10" 
                  y="12" 
                  width="24" 
                  height="20" 
                  rx="3" 
                  stroke="url(#footer-robot-gradient)" 
                  strokeWidth="2.5" 
                  fill="none"
                />
                
                <circle cx="17" cy="20" r="2.5" fill="url(#footer-robot-gradient)" opacity="0.7" />
                <circle cx="27" cy="20" r="2.5" fill="url(#footer-robot-gradient)" opacity="0.7" />
                
                <rect x="15" y="26" width="14" height="3" rx="1.5" fill="url(#footer-robot-gradient)" opacity="0.5" />
                
                <rect x="8" y="18" width="2" height="6" rx="1" fill="url(#footer-robot-gradient)" opacity="0.4" />
                <rect x="34" y="18" width="2" height="6" rx="1" fill="url(#footer-robot-gradient)" opacity="0.4" />
                
                <line x1="22" y1="32" x2="22" y2="38" stroke="url(#footer-robot-gradient)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              
              <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                Future Agent
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your trusted AI tools directory and insights hub.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools" className="text-slate-400 hover:text-cyan-400 transition">
                  AI Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-slate-400 hover:text-cyan-400 transition">
                  Tool Finder Quiz
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-cyan-400 transition">
                  Blog & Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-cyan-400 transition">
                  Latest Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-cyan-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:hello@future-agent.com" 
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Email Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-cyan-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-cyan-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclaimer" className="text-slate-400 hover:text-cyan-400 transition">
                  Affiliate Disclaimer
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Future Agent. All rights reserved.</p>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition group"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <svg className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
