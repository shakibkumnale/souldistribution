// src/components/artists/ArtistCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProfileIcon from '@/components/profile-icon';

export default function ArtistCard({ artist, className }) {
  // Check if artist has a valid image
  const hasImage = artist.image && artist.image !== '/images/placeholder-artist.jpg';

  return (
    <Link href={`/artists/${artist.slug}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-lg bg-black aspect-square">
        {hasImage ? (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <ProfileIcon size={120} className="opacity-90" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="flex items-center gap-1">
            <h3 className="text-xl font-bold text-white truncate">{artist.name}</h3>
            {artist.isVerified && (
              <CheckCircle className="w-4 h-4 text-blue-400" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}


