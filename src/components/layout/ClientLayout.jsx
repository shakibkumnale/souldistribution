'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import AdminLayout from '@/app/admin/layout';

export default function ClientLayout({ children, interClassName }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className={interClassName}>
      {isAdminRoute ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </>
      )}
    </div>
  );
}