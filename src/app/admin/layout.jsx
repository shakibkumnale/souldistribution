'use client';

// src/app/admin/layout.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Toaster } from '@/components/ui/toaster';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated as admin on mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify-admin');
        const data = await response.json();
        
        if (data.isAdmin) {
          setUsername(data.username);
        } else {
          // If not admin, redirect to login
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    // Check if mobile screen and close sidebar by default
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkAuth();
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <header className="bg-gray-800 text-white p-4 w-full z-50 fixed top-0 left-0 right-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-700"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold">DiStroSoul Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Welcome, {username}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 mt-16">
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main 
          className={`flex-1 p-4 transition-all duration-300 ${
            sidebarOpen ? 'md:ml-32' : 'ml-0'
          }`}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
          <Toaster />
        </main>
      </div>
    </div>
  );
}