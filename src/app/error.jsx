'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 z-0"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Playback Error</h1>
        <div className="bg-black/40 backdrop-blur-md border border-red-500/20 rounded-lg p-6 mb-8 w-full max-w-lg">
          <p className="text-gray-300 mb-4">
            Looks like we hit a sour note. Something unexpected happened while trying to load this page.
          </p>
          
          <div className="bg-red-900/20 border border-red-800 rounded p-3 text-left">
            <p className="text-red-400 font-mono text-sm truncate">
              {error?.message || 'Unknown error occurred'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary rounded-full hover:opacity-90 transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 