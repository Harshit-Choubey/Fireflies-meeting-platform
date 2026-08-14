'use client';

import React from 'react';
import { ListTree, Play } from 'lucide-react';
import { Topic } from '@/types';
import { usePlayerSync } from '@/providers/PlayerSyncContext';

interface TopicsListProps {
  topics: Topic[];
  isLoading: boolean;
}

export default function TopicsList({ topics, isLoading }: TopicsListProps) {
  const { seekTo, play } = usePlayerSync();

  const formatTimestamp = (secs: number | null) => {
    if (secs == null) return null;
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTopicClick = (startTime: number | null) => {
    if (startTime != null) {
      seekTo(startTime);
      play();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ListTree className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Outline & Key Topics</h3>
        </div>
        <span className="text-[11px] font-medium text-gray-400">
          {topics.length} chapters
        </span>
      </div>

      {topics.length === 0 ? (
        <p className="text-xs text-gray-400">No outline topics generated for this meeting.</p>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.start_time)}
              className="p-3 rounded-xl bg-gray-50/70 hover:bg-purple-50/60 border border-transparent hover:border-purple-100 transition-all cursor-pointer group flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-gray-900 group-hover:text-[#7C4DFF] transition-colors">
                  {topic.title}
                </h4>
                {topic.description && (
                  <p className="text-[11px] text-gray-500 line-clamp-1">{topic.description}</p>
                )}
              </div>

              {topic.start_time != null && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTopicClick(topic.start_time);
                  }}
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white text-gray-600 group-hover:bg-[#7C4DFF] group-hover:text-white transition-colors border border-gray-200 group-hover:border-transparent flex-shrink-0 shadow-2xs"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>{formatTimestamp(topic.start_time)}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
