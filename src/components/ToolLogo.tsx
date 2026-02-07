'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ToolLogoProps {
    name: string
    logo: string | null
    className?: string
    iconClassName?: string
}

export default function ToolLogo({ name, logo, className = '', iconClassName = '' }: ToolLogoProps) {
    const [error, setError] = useState(false)

    const isImage = logo && (logo.startsWith('http') || logo.startsWith('/'))
    const showImage = isImage && !error

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Fallback Background (Emoji or Initials) */}
            <div className={`w-full h-full flex items-center justify-center font-black text-white bg-gradient-to-br from-sky-500 to-indigo-600 italic ${iconClassName}`}>
                {logo && !logo.startsWith('http') && !logo.startsWith('/') ? (
                    logo
                ) : (
                    name.charAt(0).toUpperCase()
                )}
            </div>

            {/* Actual Image Logo */}
            {showImage && (
                <Image
                    src={logo!}
                    alt={name}
                    fill
                    className="absolute inset-0 object-cover p-3 bg-slate-950"
                    onError={() => setError(true)}
                />
            )}
        </div>
    )
}
