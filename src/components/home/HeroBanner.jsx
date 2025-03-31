// src/components/home/HeroBanner.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-black h-[600px]">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/image.png" 
          alt="Soul Distribution - Music Distribution Service" 
          fill 
          className="object-cover opacity-80"
          priority
          sizes="100vw"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 speakable">
            <span className="block">Get Your Music</span>
            <span className="block text-purple-700">To The World</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 speakable">
            Distribute your music to 150+ Indian & International platforms. 
            Get verified on Spotify & YouTube. Keep 100% of your royalties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/services" 
              className="px-6 py-3 bg-gradient-primary text-white font-medium rounded-md transition-colors"
              aria-label="View our music distribution plans"
            >
              View Plans
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
              aria-label="Contact us about music distribution"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
