import Link from 'next/link';

interface TagBadgeProps {
  slug: string;
  name: string;
  icon?: string;
  color?: string;
  clickable?: boolean;
}

export default function TagBadge({ slug, name, icon, color = 'purple', clickable = true }: TagBadgeProps) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-600/20 border-green-600/30',
    purple: 'bg-purple-600/20 border-purple-600/30',
    blue: 'bg-blue-600/20 border-blue-600/30',
    indigo: 'bg-indigo-600/20 border-indigo-600/30',
    cyan: 'bg-cyan-600/20 border-cyan-600/30',
    pink: 'bg-pink-600/20 border-pink-600/30',
    orange: 'bg-orange-600/20 border-orange-600/30',
    yellow: 'bg-yellow-600/20 border-yellow-600/30',
    teal: 'bg-teal-600/20 border-teal-600/30',
    slate: 'bg-slate-600/20 border-slate-600/30',
  };

  const badge = (
    <span className={`inline-flex items-center gap-1 px-3 py-1 ${colorClasses[color] || colorClasses.purple} border rounded-full text-xs font-semibold text-white`}>
      {icon && <span>{icon}</span>}
      <span>{name}</span>
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/tag/${slug}`} className="hover:scale-105 transition">
        {badge}
      </Link>
    );
  }

  return badge;
}
