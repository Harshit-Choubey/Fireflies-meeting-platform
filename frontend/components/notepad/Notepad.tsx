'use client';

import React, { useState } from 'react';
import SummaryPanel from './SummaryPanel';
import TopicsList from './TopicsList';
import ActionItemList from './ActionItemList';
import DecisionList from './DecisionList';
import AskFredPanel from './AskFredPanel';
import { ActionItem, Decision, Participant, Summary, Topic, TranscriptSegment } from '@/types';
import { Sparkles, Bot, LayoutList } from 'lucide-react';

interface NotepadProps {
  meetingId: number;
  meetingTitle: string;
  summary: Summary | null;
  topics: Topic[];
  actionItems: ActionItem[];
  decisions: Decision[];
  participants: Participant[];
  transcriptSegments: TranscriptSegment[];
  isLoadingSummary: boolean;
  isLoadingTopics: boolean;
  isLoadingActions: boolean;
  isLoadingDecisions: boolean;
}

export default function Notepad({
  meetingId,
  meetingTitle,
  summary,
  topics,
  actionItems,
  decisions,
  participants,
  transcriptSegments,
  isLoadingSummary,
  isLoadingTopics,
  isLoadingActions,
  isLoadingDecisions,
}: NotepadProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'askfred'>('notes');

  return (
    <div className="space-y-4 h-full overflow-y-auto pr-1">
      {/* Sub-nav switcher */}
      <div className="bg-white border border-gray-200 rounded-xl p-1.5 flex items-center gap-2 text-xs font-semibold shadow-2xs">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'notes'
              ? 'bg-[#7C4DFF] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutList className="w-3.5 h-3.5" />
          <span>AI Intelligence Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('askfred')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'askfred'
              ? 'bg-[#7C4DFF] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AskFred Meeting Q&A</span>
        </button>
      </div>

      {activeTab === 'notes' ? (
        <>
          {/* 1. Summary Overview */}
          <SummaryPanel summary={summary} isLoading={isLoadingSummary} />

          {/* 2. Topics / Outline */}
          <TopicsList topics={topics} isLoading={isLoadingTopics} />

          {/* 3. Key Decisions */}
          <DecisionList decisions={decisions} isLoading={isLoadingDecisions} />

          {/* 4. Action Items */}
          <ActionItemList
            meetingId={meetingId}
            actionItems={actionItems}
            participants={participants}
            isLoading={isLoadingActions}
          />
        </>
      ) : (
        <AskFredPanel
          meetingTitle={meetingTitle}
          transcriptSegments={transcriptSegments}
          summaryOverview={summary?.overview}
        />
      )}
    </div>
  );
}
