import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI SEO Writer — Generate Full Blog Articles | FutureAgent',
  description: 'Free AI-powered SEO blog writer. Enter a keyword and get a complete optimised article with meta title, description, slug and tags in 60 seconds.',
}

export default function AIWriterLayout({ children }: { children: React.ReactNode }) {
  return children
}
