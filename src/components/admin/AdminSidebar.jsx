// src/components/admin/AdminSidebar.jsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Users, Music, Settings, LogOut, 
  BarChart3, AlbumIcon, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSidebar({ className }) {
  const pathname = usePathname();
  
  const links = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/artists', label: 'Artists', icon: Users },
    { href: '/admin/releases', label: 'Releases', icon: AlbumIcon },
    { href: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];
  
  return (
    <div className={cn("h-screen border-r border-zinc-800 bg-black flex flex-col", className)}>
      <div className="p-4 border-b border-zinc-800">
        <Link href="/" className="inline-flex items-center text-sm hover:text-green-400">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Site
        </Link>
      </div>
      
      <div className="p-4 space-y-1 flex-grow">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-lg text-sm",
                isActive 
                  ? "bg-green-950 text-green-400" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center w-full py-2 px-3 rounded-lg text-sm text-red-400 hover:bg-red-950">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

