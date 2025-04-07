// src/app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Soul Distribution - Music Distribution & YouTube OAC Services',
  description: 'Distribute your music worldwide and get verified on YouTube with Soul Distribution',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout interClassName={inter.className}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}