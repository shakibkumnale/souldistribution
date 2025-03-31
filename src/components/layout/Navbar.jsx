// src/components/layout/Navbar.jsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Music } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/artists', label: 'Artists' },
    { href: '/releases', label: 'Releases' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={` top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md shadow-md fixed' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="relative h-10 w-36">
                  <Image
                    src="/images/group/logo.png"
                    alt="Soul Distribution"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex space-x-1">
                {navLinks.map(link => {
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-gradient-primary text-white' 
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Login / Admin Access */}
            <div className="hidden md:block">
              <Link 
                href="/admin" 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-full transition-colors"
              >
                <Music className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="text-gray-300 hover:text-white p-2"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden bg-black/90 backdrop-blur-md ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-gradient-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white bg-pink-600 hover:bg-pink-700 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <Music className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </nav>
      {/* Add increased spacing below the navbar to prevent content overlap */}
      {/* <div className="h-24 md:h-28"></div> */}
    </>
  );
}