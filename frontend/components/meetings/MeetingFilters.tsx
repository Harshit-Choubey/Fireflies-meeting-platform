'use client';

import React from 'react';
import { Search, Filter, Calendar, User, X } from 'lucide-react';

interface MeetingFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  participantFilter: string;
  onParticipantChange: (p: string) => void;
  dateFrom: string;
  onDateFromChange: (d: string) => void;
  dateTo: string;
  onDateToChange: (d: string) => void;
  onClearFilters: () => void;
}

export default function MeetingFilters({
  searchQuery,
  onSearchChange,
  participantFilter,
  onParticipantChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
}: MeetingFiltersProps) {
  const hasActiveFilters = searchQuery || participantFilter || dateFrom || dateTo;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-2xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Title / Participant Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search meetings or people..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden transition-all"
          />
        </div>

        {/* Participant filter */}
        <div className="relative">
          <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={participantFilter}
            onChange={(e) => onParticipantChange(e.target.value)}
            placeholder="Filter by participant name..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden transition-all"
          />
        </div>

        {/* Date From */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            title="Date from"
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden transition-all"
          />
        </div>

        {/* Date To */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            title="Date to"
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-medium">Filters active</span>
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-[#7C4DFF] hover:text-[#6F3FF0] font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset all filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
