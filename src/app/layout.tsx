import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
// import TimezoneWatcher from '@/components/TimezoneWatcher'; // temporarily disabled

export const metadata: Metadata = {
  title: 'MindBody OS',
  description: 'AI Athlete Command Center',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white">
        {/* Left navigation */}
        <Sidebar />

        {/* Page content shifted right of the sidebar */}
        <main className="min-h-[100dvh] pl-64">
          {children}
        </main>

        {/* System-level watcher + bottom pulse banner */}
        {/* <TimezoneWatcher /> */}
      </body>
    </html>
  );
}
