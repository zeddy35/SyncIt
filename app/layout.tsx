import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SyncIt',
  description: 'Music Database Management App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-zinc-950 text-white">
        <div className="flex min-h-screen">
          <Navbar />
          <main className="flex-1 ml-64 min-h-screen bg-zinc-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
