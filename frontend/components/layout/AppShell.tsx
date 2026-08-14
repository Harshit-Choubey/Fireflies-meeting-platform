'use client';

import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
  onOpenCreateModal?: () => void;
}

export default function AppShell({ children, onOpenCreateModal }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar onOpenCreateModal={onOpenCreateModal} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
