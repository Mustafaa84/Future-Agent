// src/components/Logo.tsx - Concept 1
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        
        {/* Brain outline */}
        <path 
          d="M20 4C14 4 9 8 8 14c-1 4 0 8 2 11 1 2 3 4 5 5 1 1 3 1 5 1s4 0 5-1c2-1 4-3 5-5 2-3 3-7 2-11-1-6-6-10-12-10z" 
          stroke="url(#brain-gradient)" 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Circuit nodes */}
        <circle cx="20" cy="14" r="2" fill="url(#brain-gradient)" />
        <circle cx="14" cy="20" r="2" fill="url(#brain-gradient)" />
        <circle cx="26" cy="20" r="2" fill="url(#brain-gradient)" />
        <circle cx="20" cy="26" r="2" fill="url(#brain-gradient)" />
        
        {/* Circuit lines */}
        <line x1="20" y1="16" x2="20" y2="24" stroke="url(#brain-gradient)" strokeWidth="1.5" />
        <line x1="16" y1="20" x2="24" y2="20" stroke="url(#brain-gradient)" strokeWidth="1.5" />
        
        {/* AI spark */}
        <path 
          d="M32 8 l2-2 m-2 2 l2 2 m-2-2 h3" 
          stroke="#06B6D4" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
      
      <div className="flex flex-col leading-none">
        <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Future Agent
        </span>
        <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
          AI Tools Directory
        </span>
      </div>
    </div>
  )
}
