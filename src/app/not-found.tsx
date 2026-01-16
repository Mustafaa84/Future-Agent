import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo - Same as Header */}
        <Link href="/" className="inline-flex items-center gap-3 group mb-8">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <defs>
              <linearGradient
                id="robot-gradient-404"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>

            {/* Robot antenna */}
            <line
              x1="22"
              y1="6"
              x2="22"
              y2="12"
              stroke="url(#robot-gradient-404)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="22" cy="5" r="2" fill="#06B6D4">
              <animate
                attributeName="fill"
                values="#06B6D4;#C084FC;#06B6D4"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Robot head outline */}
            <rect
              x="10"
              y="12"
              width="24"
              height="20"
              rx="3"
              stroke="url(#robot-gradient-404)"
              strokeWidth="2.5"
              fill="none"
              className="group-hover:fill-cyan-500/10 transition-all"
            />

            {/* Robot eyes */}
            <circle cx="17" cy="20" r="2.5" fill="url(#robot-gradient-404)">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="27" cy="20" r="2.5" fill="url(#robot-gradient-404)">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Robot mouth/display */}
            <rect
              x="15"
              y="26"
              width="14"
              height="3"
              rx="1.5"
              fill="url(#robot-gradient-404)"
              opacity="0.7"
            />

            {/* Side panels */}
            <rect
              x="8"
              y="18"
              width="2"
              height="6"
              rx="1"
              fill="url(#robot-gradient-404)"
              opacity="0.5"
            />
            <rect
              x="34"
              y="18"
              width="2"
              height="6"
              rx="1"
              fill="url(#robot-gradient-404)"
              opacity="0.5"
            />

            {/* Robot body connector */}
            <line
              x1="22"
              y1="32"
              x2="22"
              y2="38"
              stroke="url(#robot-gradient-404)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Circuit lines on head */}
            <line
              x1="13"
              y1="15"
              x2="19"
              y2="15"
              stroke="url(#robot-gradient-404)"
              strokeWidth="1"
              opacity="0.4"
            />
            <line
              x1="25"
              y1="15"
              x2="31"
              y2="15"
              stroke="url(#robot-gradient-404)"
              strokeWidth="1"
              opacity="0.4"
            />
          </svg>

          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-fuchsia-300 transition">
              Future Agent
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              Your AI Guide
            </span>
          </div>
        </Link>

        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-4xl font-bold text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-xl text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            🏠 Go Home
          </Link>
          <Link
            href="/tools"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border-2 border-slate-700 hover:border-cyan-500 transition-all"
          >
            🔍 Browse AI Tools
          </Link>
        </div>

        {/* Illustration */}
        <div className="mt-16 text-8xl opacity-20">🤖</div>
      </div>
    </div>
  )
}
