'use client';

import React from 'react';
import { Sparkles, FileText } from 'lucide-react';
import { Summary } from '@/types';

interface SummaryPanelProps {
  summary: Summary | null;
  isLoading: boolean;
}

export default function SummaryPanel({ summary, isLoading }: SummaryPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-400">
        No AI overview summary available for this meeting.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#7C4DFF] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">AI Overview</h3>
        </div>
        <span className="text-[10px] uppercase font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
          Generated via {summary.generated_by}
        </span>
      </div>

      <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-normal space-y-2">
        {summary.overview}
      </div>
    </div>
  );
}
