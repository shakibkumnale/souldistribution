// src/components/layout/Footer.jsx
import Link from 'next/link';
import { Instagram, Twitter, Youtube, Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Soul Distribution</h3>
            <p className="text-gray-400">
              Empowering independent artists with global music distribution and YouTube OAC services.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com/souldistribution_" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/souldistribution_" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@3in1soulrap" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#premium" className="text-gray-400 hover:text-white">Premium Plan</Link>
              </li>
              <li>
                <Link href="/services#pro" className="text-gray-400 hover:text-white">Pro Plan</Link>
              </li>
              <li>
                <Link href="/services#basic" className="text-gray-400 hover:text-white">Basic Plan</Link>
              </li>
              <li>
                <Link href="/services#lifetime" className="text-gray-400 hover:text-white">Lifetime Plan</Link>
              </li>
              <li>
                <Link href="/services#youtube-oac" className="text-gray-400 hover:text-white">YouTube OAC</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/artists" className="text-gray-400 hover:text-white">Our Artists</Link>
              </li>
              <li>
                <Link href="/releases" className="text-gray-400 hover:text-white">Releases</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/services#refund" className="text-gray-400 hover:text-white">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Soul Distribution. All rights reserved.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <Music className="h-4 w-4 mr-2 text-orange-500" />
            <span className="text-sm">#SoulOnRepeat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
