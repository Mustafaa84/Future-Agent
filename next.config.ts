/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ LOCALHOST (dev)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // ✅ UNSPLASH (your image)
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
      // ✅ COMMON AI IMAGE SOURCES
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.openai.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
      // ✅ CATCH-ALL for future Perplexity images
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
