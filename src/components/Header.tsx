'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-900">
      <nav className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          
         {/* Logo - CONCEPT 3: Robot */}
<Link href="/" className="flex items-center gap-3 group">
  <svg 
    width="44" 
    height="44" 
    viewBox="0 0 44 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <defs>
      <linearGradient id="robot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    </defs>
    
    {/* Robot antenna */}
    <line x1="22" y1="6" x2="22" y2="12" stroke="url(#robot-gradient)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="22" cy="5" r="2" fill="#06B6D4">
      <animate attributeName="fill" values="#06B6D4;#C084FC;#06B6D4" dur="2s" repeatCount="indefinite" />
    </circle>
    
    {/* Robot head outline */}
    <rect 
      x="10" 
      y="12" 
      width="24" 
      height="20" 
      rx="3" 
      stroke="url(#robot-gradient)" 
      strokeWidth="2.5" 
      fill="none"
      className="group-hover:fill-cyan-500/10 transition-all"
    />
    
    {/* Robot eyes */}
    <circle cx="17" cy="20" r="2.5" fill="url(#robot-gradient)">
      <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="27" cy="20" r="2.5" fill="url(#robot-gradient)">
      <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
    </circle>
    
    {/* Robot mouth/display */}
    <rect x="15" y="26" width="14" height="3" rx="1.5" fill="url(#robot-gradient)" opacity="0.7" />
    
    {/* Side panels */}
    <rect x="8" y="18" width="2" height="6" rx="1" fill="url(#robot-gradient)" opacity="0.5" />
    <rect x="34" y="18" width="2" height="6" rx="1" fill="url(#robot-gradient)" opacity="0.5" />
    
    {/* Robot body connector */}
    <line x1="22" y1="32" x2="22" y2="38" stroke="url(#robot-gradient)" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Circuit lines on head */}
    <line x1="13" y1="15" x2="19" y2="15" stroke="url(#robot-gradient)" strokeWidth="1" opacity="0.4" />
    <line x1="25" y1="15" x2="31" y2="15" stroke="url(#robot-gradient)" strokeWidth="1" opacity="0.4" />
  </svg>
  
  <div className="flex flex-col leading-none">
    <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-fuchsia-300 transition">
      Future Agent
    </span>
    <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase hidden sm:block">
      Your AI Guide
    </span>
  </div>
</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium">
              Home
            </Link>
            <Link href="/tools" className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium">
              Directory
            </Link>
            <Link href="/quiz" className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium">
              Tool Finder
            </Link>
            <Link href="/blog" className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium">
              Blog
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/quiz"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-sm font-semibold text-white rounded-lg transition shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              Find My Tool
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4 animate-fadeIn">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/tools" 
                className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Directory
              </Link>
              <Link 
                href="/quiz" 
                className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tool Finder
              </Link>
              <Link 
                href="/blog" 
                className="text-sm text-slate-300 hover:text-cyan-400 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/quiz"
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-sm font-semibold text-white rounded-lg text-center shadow-lg shadow-cyan-500/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find My Tool
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
