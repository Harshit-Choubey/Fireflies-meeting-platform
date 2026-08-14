'use client';

import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Decision } from '@/types';
import { usePlayerSync } from '@/providers/PlayerSyncContext';

interface DecisionListProps {
  decisions: Decision[];
  isLoading: boolean;
}

export default function DecisionList({ decisions, isLoading }: DecisionListProps) {
  const { seekTo, play } = usePlayerSync();

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
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Key Decisions</h3>
        </div>
        <span className="text-[11px] font-medium text-gray-400">
          {decisions.length} decisions
        </span>
      </div>

      {decisions.length === 0 ? (
        <p className="text-xs text-gray-400">No decisions recorded for this meeting.</p>
      ) : (
        <div className="space-y-2.5">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-gray-900 leading-snug">
                  ● {decision.decision_text}
                </h4>
              </div>

              {decision.rationale && (
                <p className="text-[11px] text-gray-600 pl-3 border-l-2 border-amber-300 italic">
                  Why: {decision.rationale}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
