'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import mongoose from 'mongoose';

export default function ArtistDebugInfo({ artists, selectedArtists }) {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <div className="mt-2">
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-xs text-gray-500"
          onClick={() => setShowDebug(true)}
        >
          Show Debug Info
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Artist IDs Debug Information</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowDebug(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-2 space-y-3">
        <div>
          <h4 className="text-xs font-medium mb-1">Available Artists from API:</h4>
          <ul className="space-y-1 text-xs">
            {artists.map((artist) => {
              const id = artist._id || artist.id;
              const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
              
              return (
                <li key={id} className="flex items-center gap-2">
                  {isValidObjectId ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span className="font-mono">
                    {id} 
                    {artist.spotifyArtistId && ` (Spotify: ${artist.spotifyArtistId})`}
                  </span>
                  - {artist.name}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-1">Selected Artists:</h4>
          <ul className="space-y-1 text-xs">
            {selectedArtists.map((artistId) => {
              const isValidObjectId = mongoose.Types.ObjectId.isValid(
                typeof artistId === 'object' ? (artistId._id || artistId.id) : artistId
              );
              
              return (
                <li key={artistId} className="flex items-center gap-2">
                  {isValidObjectId ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span className="font-mono">{typeof artistId === 'object' ? JSON.stringify(artistId) : artistId}</span>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="text-xs text-gray-500 italic">
          <p>Green checkmark = Valid MongoDB ObjectId</p>
          <p>Red X = Not a valid MongoDB ObjectId (needs to be converted before saving)</p>
        </div>
      </div>
    </div>
  );
} 