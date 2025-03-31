'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Users, BarChart, Settings, LogOut, LineChart, X } from 'lucide-react';

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <BarChart className="w-5 h-5" /> },
    { href: '/admin/artists', label: 'Artists', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/releases', label: 'Releases', icon: <Music className="w-5 h-5" /> },
    { href: '/admin/analytics', label: 'Analytics', icon: <LineChart className="w-5 h-5" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      
      <aside 
        className={`bg-gradient-to-b from-blue-900 to-purple-900 text-white fixed top-0 h-full z-40 shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'left-0' : '-left-64 md:left-0'
        } w-64`}
        style={{ paddingTop: '4rem' }}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-6">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-white">Soul Distribution</h1>
            </Link>
          </div>
          
          <nav className="px-4 space-y-1 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-4 px-4 pb-4">
            <Link
              href="/"
              className="flex items-center px-3 py-3 text-blue-100 hover:bg-blue-700 hover:text-white rounded-md transition-colors"
            >
              <span className="mr-3"><LogOut className="w-5 h-5" /></span>
              <span className="font-medium">Exit Admin</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}