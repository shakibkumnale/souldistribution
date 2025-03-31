'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function InfiniteLogos({ dsps }) {
  // Triple the array to create a seamless loop
  const allDSPs = [...dsps, ...dsps, ...dsps];
  const [duration, setDuration] = useState(25);

  // Adjust animation duration based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDuration(15); // Faster on small screens
      } else {
        setDuration(25);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-6 sm:py-8 mb-8 sm:mb-12 rounded-xl bg-gradient-to-r from-gray-900/40 via-gray-900/20 to-gray-900/40">
      {/* Left shadow gradient - narrower on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
      
      {/* Right shadow gradient - narrower on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>
      
      <motion.div 
        className="flex items-center gap-3 sm:gap-8 px-8 sm:px-12"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ 
          duration: duration, 
          ease: "linear", 
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        {allDSPs.map((dsp, index) => (
          <div 
            key={`dsp-${index}`} 
            className={`flex-shrink-0 flex flex-col items-center justify-center p-3 sm:p-5 rounded-lg ${dsp.highlight ? 'bg-gradient-to-b from-purple-900/40 to-gray-900/90 shadow-md hover:shadow-purple-900/30 transition-shadow duration-300' : 'bg-black/40 hover:bg-black/50 transition-colors duration-300'}`}
            style={{ 
              width: 'min(120px, 30vw)', 
              height: 'min(130px, 32vw)', 
              maxWidth: '150px',
              maxHeight: '170px'
            }}
          >
            <div className="relative w-12 h-12 sm:w-20 sm:h-20 mb-2 sm:mb-3">
              <Image
                src={dsp.logo}
                alt={dsp.name}
                fill
                sizes="(max-width: 640px) 48px, 80px"
                className="object-contain"
              />
            </div>
            <div className="w-full max-w-[90%] text-center">
              <span className="text-xs sm:text-sm font-medium inline-block text-white bg-black/50 px-2 py-0.5 rounded-full truncate max-w-full">{dsp.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
} 