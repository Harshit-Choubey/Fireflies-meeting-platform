'use client';

import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { TranscriptSegment as TranscriptSegmentType } from '@/types';
import { usePlayerSync } from '@/providers/PlayerSyncContext';

interface TranscriptSegmentProps {
  segment: TranscriptSegmentType;
  isActive: boolean;
  searchQuery: string;
}

export default function TranscriptSegment({
  segment,
  isActive,
  searchQuery,
}: TranscriptSegmentProps) {
  const { seekTo, play } = usePlayerSync();
  const segmentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active segment into view
  useEffect(() => {
    if (isActive && segmentRef.current) {
      segmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isActive]);

  const formatTimestamp = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSegmentClick = () => {
    seekTo(segment.start_time);
    play();
  };

  // Highlight search terms
  const renderTextWithHighlight = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="search-highlight">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      ref={segmentRef}
      onClick={handleSegmentClick}
      className={`group p-3.5 rounded-xl transition-all cursor-pointer border ${
        isActive
          ? 'bg-purple-50/80 border-purple-300 shadow-sm shadow-purple-500/5'
          : 'bg-white hover:bg-gray-50/80 border-transparent hover:border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {/* Avatar circle */}
          <div className="w-6 h-6 rounded-full bg-[#7C4DFF] text-white text-[10px] font-bold flex items-center justify-center uppercase shadow-2xs">
            {segment.speaker_label.charAt(0)}
          </div>
          <span className="text-xs font-bold text-gray-900">
            {segment.speaker_label}
          </span>
        </div>

        {/* Timestamp button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSegmentClick();
          }}
          className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md transition-colors ${
            isActive
              ? 'bg-[#7C4DFF] text-white font-semibold'
              : 'text-gray-400 group-hover:text-[#7C4DFF] group-hover:bg-purple-100/60'
          }`}
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>{formatTimestamp(segment.start_time)}</span>
        </button>
      </div>

      <p className="text-xs text-gray-700 leading-relaxed font-normal pl-8">
        {renderTextWithHighlight(segment.text, searchQuery)}
      </p>
    </div>
  );
}
