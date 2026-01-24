import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ LOCALHOST (dev)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // ✅ UNSPLASH
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // ✅ iSTOCKPHOTO (Perplexity images)
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '/**',
      },
      // ✅ OpenAI CDN
      {
        protocol: 'https',
        hostname: 'cdn.openai.com',
        pathname: '/**',
      },
      // ✅ Supabase Storage (for uploaded images)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      // ✅ Common image CDNs
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
