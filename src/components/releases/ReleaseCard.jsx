// src/components/releases/ReleaseCard.jsx
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import OptimizedReleaseImage from '@/components/shared/OptimizedReleaseImage';

export default function ReleaseCard({ release, className, priority = false }) {
  return (
    <Link 
      href={`/releases/${release.slug}`} 
      className={cn("group block", className)}
      itemScope
      itemType="https://schema.org/MusicRecording"
    >
      <div className="relative overflow-hidden rounded-lg bg-black aspect-square">
        <OptimizedReleaseImage
          src={release.coverImage}
          releaseName={release.title}
          artistName={release.artistName}
          fill
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-2 space-y-1">
        <h3 
          className="font-bold text-white truncate group-hover:text-green-400 transition-colors"
          itemProp="name"
        >
          {release.title}
        </h3>
        <p 
          className="text-sm text-gray-400 truncate"
          itemProp="byArtist"
        >
          {release.artistName}
        </p>
        <p 
          className="text-xs text-gray-500"
          itemProp="datePublished"
        >
          {formatDate(release.releaseDate)}
        </p>
      </div>
    </Link>
  );
}
