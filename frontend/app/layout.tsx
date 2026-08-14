import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastContext';
import { PlayerSyncProvider } from '@/providers/PlayerSyncContext';

export const metadata: Metadata = {
  title: 'Fireflies.ai — Meeting Intelligence Platform',
  description: 'Post-meeting workspace, interactive transcripts, media playback, and automated meeting notes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-[#F7F7FA] min-h-screen">
        <QueryProvider>
          <ToastProvider>
            <PlayerSyncProvider>
              {children}
            </PlayerSyncProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
