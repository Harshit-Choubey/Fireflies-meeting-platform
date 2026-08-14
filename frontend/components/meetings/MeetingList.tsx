'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, LayoutDashboard, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import MeetingRow from './MeetingRow';
import MeetingFilters from './MeetingFilters';
import MeetingFormModal from './MeetingFormModal';

export default function MeetingList() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [participantFilter, setParticipantFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch meetings with filters
  const {
    data: meetings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'meetings',
      { search: searchQuery, participant: participantFilter, dateFrom, dateTo },
    ],
    queryFn: () =>
      api.getMeetings({
        search: searchQuery || undefined,
        participant: participantFilter || undefined,
        date_from: dateFrom ? new Date(dateFrom).toISOString() : undefined,
        date_to: dateTo ? new Date(dateTo).toISOString() : undefined,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });

  const handleDeleteMeeting = (id: number) => {
    if (confirm('Are you sure you want to delete this meeting? All associated transcripts, summaries, and action items will be permanently removed.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setParticipantFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#7C4DFF]" />
            Meetings Library
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse, search, and manage past meeting intelligence & interactive transcripts.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7C4DFF] hover:bg-[#6F3FF0] text-white text-sm font-semibold rounded-xl shadow-md shadow-purple-200 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Meeting</span>
        </button>
      </div>

      {/* Filter panel */}
      <MeetingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        participantFilter={participantFilter}
        onParticipantChange={setParticipantFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
      />

      {/* Content Area */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse flex flex-col gap-3"
            >
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="font-semibold text-base">Could not load meetings</h3>
          <p className="text-xs text-red-600">{(error as Error)?.message || 'Internal API Error'}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {!isLoading && !isError && meetings && meetings.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7C4DFF] flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No meetings found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery || participantFilter || dateFrom || dateTo
              ? 'Try adjusting your search query or filter settings.'
              : 'Create your first meeting or paste a transcript to generate intelligence.'}
          </p>
          {(searchQuery || participantFilter || dateFrom || dateTo) ? (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#7C4DFF] hover:bg-[#6F3FF0] text-white text-xs font-medium rounded-lg transition-colors"
            >
              Create New Meeting
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && meetings && meetings.length > 0 && (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <MeetingRow
              key={meeting.id}
              meeting={meeting}
              onDelete={handleDeleteMeeting}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isCreateModalOpen && (
        <MeetingFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
          }}
        />
      )}
    </div>
  );
}
