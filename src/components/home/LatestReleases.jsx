'use client';

// src/components/home/LatestReleases.jsx
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Music, ChevronLeft } from 'lucide-react';
import ReleasesGrid from '@/components/releases/ReleasesGrid';

export default function LatestReleases({ releases = [] }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);
  
  // Filter to only show featured releases if on homepage
  const releasesToShow = releases.filter(release => release.featured);
  
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      checkScroll();
      
      // Add resize listener to check scroll status when window is resized
      window.addEventListener('resize', checkScroll);
      
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [releases]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <div className="flex items-center">
          <div className="h-6 sm:h-8 w-1 bg-purple-600 rounded-full mr-3"></div>
          <h2 className="text-xl sm:text-3xl font-bold text-white">Latest Releases</h2>
        </div>
        
        {releasesToShow.length > 0 && (
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-1.5 sm:p-2.5 rounded-full ${
                canScrollLeft 
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white hover:from-purple-800 hover:to-purple-700 shadow-lg' 
                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-1.5 sm:p-2.5 rounded-full ${
                canScrollRight 
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white hover:from-purple-800 hover:to-purple-700 shadow-lg' 
                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}
      </div>
      
      <div 
        className="overflow-x-auto scrollbar-none pb-4" 
        ref={scrollRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx global>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {releasesToShow.length > 0 ? (
          <div className="min-w-max">
            <ReleasesGrid releases={releasesToShow} className="flex space-x-4 sm:space-x-6" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full min-h-[320px] bg-gradient-to-b from-gray-900/80 to-black/40 rounded-xl border border-gray-800/30">
            <Music className="h-12 w-12 text-purple-600/40 mb-4" />
            <p className="text-gray-400">No featured releases yet</p>
          </div>
        )}
      </div>
      
      <div className="text-center mt-8 sm:mt-10">
        <Link 
          href="/releases" 
          className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-900/30"
        >
          View All Releases
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
        </Link>
      </div>
    </div>
  );
}