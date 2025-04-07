// src/components/releases/ReleaseCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ReleaseCard({ release, className }) {
  return (
    <Link href={`/releases/${release.slug}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-lg bg-black aspect-square">
        <Image
          src={release.coverImage || '/images/placeholder-cover.jpg'}
          alt={release.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="font-bold text-white truncate group-hover:text-green-400 transition-colors">
          {release.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{release.artistName}</p>
        <p className="text-xs text-gray-500">{formatDate(release.releaseDate)}</p>
      </div>
    </Link>
  );
}
