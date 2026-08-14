'use client';

import React, { useState } from 'react';
import { Search, X, ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { TranscriptSegment as TranscriptSegmentType } from '@/types';
import { usePlayerSync } from '@/providers/PlayerSyncContext';
import TranscriptSegment from './TranscriptSegment';

interface TranscriptPanelProps {
  segments: TranscriptSegmentType[];
  isLoading: boolean;
}

export default function TranscriptPanel({ segments, isLoading }: TranscriptPanelProps) {
  const { activeSegmentId } = usePlayerSync();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('ALL');

  // Extract unique speaker list
  const speakers = Array.from(new Set(segments.map((s) => s.speaker_label))).sort();

  // Filter segments by search query and speaker
  const filteredSegments = segments.filter((s) => {
    const matchesQuery =
      !searchQuery.trim() ||
      s.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker_label.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpeaker = selectedSpeaker === 'ALL' || s.speaker_label === selectedSpeaker;

    return matchesQuery && matchesSpeaker;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col h-full overflow-hidden shadow-xs">
      {/* Header & Search Bar */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7C4DFF]" />
            <h3 className="text-sm font-bold text-gray-900">Interactive Transcript</h3>
          </div>
          <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {filteredSegments.length} of {segments.length} segments
          </span>
        </div>

        {/* Local Transcript Search & Speaker Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search within transcript..."
              className="w-full pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Speaker Filter Dropdown */}
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            className="py-1.5 px-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden transition-all"
          >
            <option value="ALL">All Speakers</option>
            {speakers.map((speaker) => (
              <option key={speaker} value={speaker}>
                {speaker}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading && (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredSegments.length === 0 && (
          <div className="py-12 text-center text-xs text-gray-400">
            {searchQuery ? 'No matching transcript segments.' : 'No transcript segments available.'}
          </div>
        )}

        {!isLoading &&
          filteredSegments.map((segment) => (
            <TranscriptSegment
              key={segment.id}
              segment={segment}
              isActive={segment.id === activeSegmentId}
              searchQuery={searchQuery}
            />
          ))}
      </div>
    </div>
  );
}
