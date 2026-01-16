import Link from 'next/link';
import Image from 'next/image';

type BlogPostTemplateProps = {
  children: React.ReactNode;
};

export default function BlogPostTemplate({ children }: BlogPostTemplateProps) {
  return (
    <article className="text-slate-200 leading-relaxed prose prose-invert max-w-none">
      {children}
    </article>
  );
}

// Reusable components for blog posts
export function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-8 ${className}`}>{children}</div>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-bold text-white mb-6 mt-12">{children}</h2>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-2xl font-bold text-white mb-4 mt-8">{children}</h3>;
}

export function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xl font-semibold text-white mb-3 mt-6">{children}</h4>;
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-300 leading-relaxed mb-4">{children}</p>;
}

export function InfoBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-cyan-900/20 border border-cyan-500/50 rounded-lg p-6 my-6">
      {title && <p className="text-slate-300 font-semibold mb-2">💡 {title}</p>}
      <div className="text-slate-300">{children}</div>
    </div>
  );
}

export function ContentBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 my-6">
      {title && <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>}
      <div>{children}</div>
    </div>
  );
}

export function StepBox({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
        {number}
      </div>
      <div className="text-slate-300">{children}</div>
    </div>
  );
}

export function CTABox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-2 border-cyan-500/50 rounded-lg p-8 my-12">
      {children}
    </div>
  );
}

export function ToolCard({ href, icon, title, description, tools }: { 
  href?: string; 
  icon: string; 
  title: string; 
  description: string;
  tools?: { name: string; href: string }[];
}) {
  const content = (
    <>
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-sm mb-3">{description}</p>
      {tools && (
        <div className="space-y-2">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="block text-cyan-400 hover:text-cyan-300 text-sm">
              → {tool.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block bg-slate-900/50 border border-slate-800 rounded-lg p-5">
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
      {content}
    </div>
  );
}

export function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 my-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start text-slate-300">
          <span className="text-cyan-400 mr-3">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ComparisonBox({ before, after }: { 
  before: { title: string; items: string[] };
  after: { title: string; items: string[] };
}) {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700 rounded-lg p-8 my-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-bold text-red-400 mb-4">❌ {before.title}</h4>
          <ul className="space-y-2 text-slate-300">
            {before.items.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-green-400 mb-4">✓ {after.title}</h4>
          <ul className="space-y-2 text-slate-300">
            {after.items.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function BlogImage({ 
  src, 
  alt, 
  caption 
}: { 
  src: string; 
  alt: string; 
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <div className="relative w-full h-64 md:h-96 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-slate-400 text-center mt-3 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function InfographicBox({ 
  src, 
  alt, 
  title 
}: { 
  src: string; 
  alt: string; 
  title?: string;
}) {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700 rounded-lg p-6 my-8">
      {title && <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>}
      <div className="relative w-full h-96 bg-slate-900/50 rounded overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
    </div>
  );
}

export function PlaceholderImage({ 
  title, 
  color = 'cyan' 
}: { 
  title: string; 
  color?: 'cyan' | 'blue' | 'purple';
}) {
  const colorClasses = {
    cyan: 'from-cyan-900/40 to-cyan-700/40 text-cyan-300 border-cyan-800',
    blue: 'from-blue-900/40 to-blue-700/40 text-blue-300 border-blue-800',
    purple: 'from-purple-900/40 to-purple-700/40 text-purple-300 border-purple-800',
  };

  return (
    <div className={`relative w-full h-64 md:h-96 bg-gradient-to-br ${colorClasses[color]} rounded-lg border flex items-center justify-center my-8`}>
      <p className="text-xl md:text-2xl font-bold text-center px-6">{title}</p>
    </div>
  );
}
