'use client';

import React, { useState } from 'react';
import { Search, Plus, Bell, HelpCircle } from 'lucide-react';
import GlobalSearchModal from '../search/GlobalSearchModal';

interface TopBarProps {
  onOpenCreateModal?: () => void;
}

export default function TopBar({ onOpenCreateModal }: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
        {/* Global Search Trigger */}
        <div className="flex-1 max-w-xl">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-gray-100/80 rounded-lg text-sm text-gray-500 transition-all text-left group"
          >
            <Search className="w-4 h-4 text-gray-400 group-hover:text-[#7C4DFF] transition-colors" />
            <span className="truncate">Search meetings, transcripts, action items...</span>
            <kbd className="hidden sm:inline-block ml-auto px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#7C4DFF] hover:bg-[#6F3FF0] text-white text-sm font-medium rounded-lg shadow-sm shadow-purple-200 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Meeting</span>
            </button>
          )}

          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <GlobalSearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}
