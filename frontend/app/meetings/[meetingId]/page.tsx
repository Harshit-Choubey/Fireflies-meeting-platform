'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, Download, Share2, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { usePlayerSync } from '@/providers/PlayerSyncContext';
import AppShell from '@/components/layout/AppShell';
import Notepad from '@/components/notepad/Notepad';
import TranscriptPanel from '@/components/transcript/TranscriptPanel';
import MediaPlayer from '@/components/player/MediaPlayer';

export default function MeetingWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = Number(params.meetingId);

  const { setSegments } = usePlayerSync();

  // Queries
  const { data: meeting, isLoading: isLoadingMeeting } = useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: () => api.getMeeting(meetingId),
    enabled: !!meetingId,
  });

  const { data: transcript, isLoading: isLoadingTranscript } = useQuery({
    queryKey: ['transcript', meetingId],
    queryFn: () => api.getTranscript(meetingId),
    enabled: !!meetingId,
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['summary', meetingId],
    queryFn: () => api.getSummary(meetingId),
    enabled: !!meetingId,
  });

  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ['topics', meetingId],
    queryFn: () => api.getTopics(meetingId),
    enabled: !!meetingId,
  });

  const { data: actionItems, isLoading: isLoadingActions } = useQuery({
    queryKey: ['actionItems', meetingId],
    queryFn: () => api.getActionItems(meetingId),
    enabled: !!meetingId,
  });

  const { data: decisions, isLoading: isLoadingDecisions } = useQuery({
    queryKey: ['decisions', meetingId],
    queryFn: () => api.getDecisions(meetingId),
    enabled: !!meetingId,
  });

  // Load transcript segments into PlayerSyncContext for O(log n) synchronization
  useEffect(() => {
    if (transcript?.segments) {
      setSegments(transcript.segments);
    }
  }, [transcript, setSegments]);

  const handleDeleteMeeting = async () => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      await api.deleteMeeting(meetingId);
      router.push('/meetings');
    }
  };

  // Export TXT / Markdown
  const handleExportText = (format: 'txt' | 'md') => {
    if (!meeting) return;

    let content = '';
    if (format === 'md') {
      content += `# ${meeting.title}\n`;
      content += `**Date:** ${new Date(meeting.meeting_date).toLocaleString()}\n\n`;
      if (summary) {
        content += `## AI Summary\n${summary.overview}\n\n`;
      }
      if (actionItems && actionItems.length > 0) {
        content += `## Action Items\n`;
        actionItems.forEach((a) => {
          content += `- [${a.status === 'completed' ? 'x' : ' '}] ${a.title}\n`;
        });
        content += `\n`;
      }
      if (transcript?.segments) {
        content += `## Transcript\n`;
        transcript.segments.forEach((s) => {
          content += `**${s.speaker_label}**: ${s.text}\n\n`;
        });
      }
    } else {
      content += `${meeting.title.toUpperCase()}\n`;
      content += `Date: ${new Date(meeting.meeting_date).toLocaleString()}\n\n`;
      if (summary) {
        content += `SUMMARY:\n${summary.overview}\n\n`;
      }
      if (transcript?.segments) {
        content += `TRANSCRIPT:\n`;
        transcript.segments.forEach((s) => {
          content += `${s.speaker_label}: ${s.text}\n`;
        });
      }
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meeting.title.replace(/\s+/g, '_')}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingMeeting) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto p-8 animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-100 rounded w-1/4"></div>
        </div>
      </AppShell>
    );
  }

  if (!meeting) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-16 text-center space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Meeting Not Found</h2>
          <Link href="/meetings" className="text-sm text-[#7C4DFF] font-semibold">
            Return to Meetings Library
          </Link>
        </div>
      </AppShell>
    );
  }

  const dateObj = new Date(meeting.meeting_date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F7F7FA]">
      <AppShell>
        <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-7xl mx-auto w-full gap-4 pb-2">
          {/* Workspace Meeting Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs flex-shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/meetings"
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  {meeting.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 pl-7 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formattedDate} at {formattedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {Math.floor(meeting.duration_seconds / 60)} minutes
                </span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => handleExportText('md')}
                title="Export Markdown"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export MD</span>
              </button>

              <button
                onClick={() => handleExportText('txt')}
                title="Export TXT"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>TXT</span>
              </button>

              <button
                onClick={handleDeleteMeeting}
                title="Delete Meeting"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Two-Panel Fireflies Notepad Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
            {/* Left Panel: Notepad / Intelligence (Overview, Topics, Decisions, Action Items, AskFred) */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <Notepad
                meetingId={meetingId}
                meetingTitle={meeting.title}
                summary={summary || null}
                topics={topics || []}
                actionItems={actionItems || []}
                decisions={decisions || []}
                participants={meeting.participants || []}
                transcriptSegments={transcript?.segments || []}
                isLoadingSummary={isLoadingSummary}
                isLoadingTopics={isLoadingTopics}
                isLoadingActions={isLoadingActions}
                isLoadingDecisions={isLoadingDecisions}
              />
            </div>

            {/* Right Panel: Interactive Transcript */}
            <div className="lg:col-span-5 h-full overflow-hidden">
              <TranscriptPanel
                segments={transcript?.segments || []}
                isLoading={isLoadingTranscript}
              />
            </div>
          </div>

          {/* Media Player Sticky Bottom */}
          <MediaPlayer
            mediaUrl={meeting.media_url}
            durationSeconds={meeting.media_duration_seconds || meeting.duration_seconds}
          />
        </div>
      </AppShell>
    </div>
  );
}
