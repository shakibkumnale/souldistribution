'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SpotifyPlayer from '@/components/spotify/SpotifyPlayer';

export default function TrendingPlaylistsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isTouching, setIsTouching] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);
  
  const playlists = [
    {
      name: "Hip Hop Hits",
      uri: "spotify:playlist:4em3bjfD0NUHdQ8dOQksb2" 
    },
    {
      name: "Fresh Finds",
      uri: "spotify:playlist:489gNtWbMEtVZh42u8N1bZ"
    },
    {
      name: "Soul Vibes",
      uri: "spotify:playlist:6GLqINUW7l9wPm2X2G2XgI"
    }
  ];
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is standard lg breakpoint
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Update current index based on scroll position
      const slideWidth = clientWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < playlists.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    // Only attach scroll event listeners on mobile
    if (isMobile && scrollRef.current) {
      const scrollEl = scrollRef.current;
      scrollEl.addEventListener('scroll', checkScroll);
      checkScroll();
      
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
      };
    }
  }, [currentIndex, isMobile]);

  // Add resize listener to recheck scroll status when window is resized
  useEffect(() => {
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    setIsTouching(true);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    if (isTouching) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };
  
  const handleTouchEnd = () => {
    setIsTouching(false);
    const touchDiff = touchStart - touchEnd;
    
    // If swipe was significant enough (>50px)
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0 && canScrollRight) {
        // Swipe left
        scroll('right');
      } else if (touchDiff < 0 && canScrollLeft) {
        // Swipe right
        scroll('left');
      }
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="h-6 sm:h-8 w-1 bg-purple-600 rounded-full mr-3"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending Playlists</h2>
        </div>
        
        {isMobile && (
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
      
      {/* Mobile Scrollable View */}
      {isMobile ? (
        <div 
          className="overflow-x-auto scrollbar-none pb-2" 
          ref={scrollRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <style jsx global>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div className="flex snap-x snap-mandatory w-max">
            {playlists.map((playlist, index) => (
              <div 
                key={`playlist-mobile-${index}`}
                className="min-w-[280px] sm:min-w-[350px] flex-shrink-0 px-1 first:pl-0 last:pr-0 snap-center"
              >
                <div className="bg-gradient-to-r from-gray-900/80 via-purple-900/20 to-gray-900/80 rounded-xl overflow-hidden h-[400px] sm:h-[480px]">
                  <SpotifyPlayer 
                    spotifyUri={playlist.uri} 
                    height={400} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop Full-Width Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {playlists.map((playlist, index) => (
            <div 
              key={`playlist-desktop-${index}`}
              className="bg-gradient-to-r from-gray-900/80 via-purple-900/20 to-gray-900/80 rounded-xl overflow-hidden"
            >
              <SpotifyPlayer 
                spotifyUri={playlist.uri} 
                height={480} 
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Mobile Pagination Dots */}
      {isMobile && (
        <div className="flex justify-center mt-4 gap-2">
          {playlists.map((_, index) => (
            <button 
              key={`dot-${index}`}
              onClick={() => {
                if (scrollRef.current) {
                  const { clientWidth } = scrollRef.current;
                  scrollRef.current.scrollTo({
                    left: clientWidth * index,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-purple-600' : 'bg-gray-600'
              }`}
              aria-label={`Go to playlist ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
} 