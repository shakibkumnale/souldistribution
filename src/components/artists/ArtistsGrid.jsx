// src/components/artists/ArtistsGrid.jsx
import ArtistCard from './ArtistCard';

export default function ArtistsGrid({ artists }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {artists.map((artist) => (
        <ArtistCard 
          key={artist.id || (artist._id ? artist._id.toString() : `artist-${artist.name}`)} 
          artist={artist} 
        />
      ))}
    </div>
  );
}