'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Calendar, FileText, CheckCircle2, AlertCircle, Tag, User } from 'lucide-react';
import { api } from '@/lib/api';
import { GlobalSearchResult } from '@/types';

interface GlobalSearchModalProps {
  onClose: () => void;
}

export default function GlobalSearchModal({ onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.globalSearch(query.trim());
        setResults(res);
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'participant':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'transcript':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'action_item':
        return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
      case 'decision':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Tag className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Search className="w-5 h-5 text-[#7C4DFF]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings, transcripts, decisions, action items..."
            className="flex-1 bg-transparent text-base font-medium text-gray-900 placeholder-gray-400 border-none outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {loading && (
            <div className="py-8 text-center text-sm text-gray-400 animate-pulse">
              Searching meeting intelligence repository...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No results found for &quot;{query}&quot;.
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-xs text-gray-400">
              Type to search across titles, transcripts, decisions, and action items.
            </div>
          )}

          {!loading &&
            results.map((item, idx) => (
              <Link
                key={idx}
                href={`/meetings/${item.meeting_id}`}
                onClick={onClose}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50/60 border border-transparent hover:border-purple-100 transition-all group"
              >
                <div className="p-2 bg-gray-100 group-hover:bg-white rounded-lg flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#7C4DFF]">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#7C4DFF] truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 font-normal">
                    {item.snippet}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
