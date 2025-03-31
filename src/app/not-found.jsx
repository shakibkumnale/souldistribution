'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Music, Disc, Home, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 z-0"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        {/* Animated vinyl record */}
        <div className={`relative mb-8 ${isAnimating ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }}>
          <div className="w-48 h-48 rounded-full bg-black border-8 border-gray-800 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-primary relative">
              <div className="absolute inset-8 rounded-full bg-black"></div>
            </div>
            <div className="absolute inset-0 rounded-full border border-white/10"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Music className="w-12 h-12 text-white/80" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Looks like this track skipped</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary rounded-full hover:opacity-90 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
} 