'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, Tag as TagIcon, Trash2 } from 'lucide-react';
import { Meeting } from '@/types';

interface MeetingRowProps {
  meeting: Meeting;
  onDelete?: (id: number) => void;
}

export default function MeetingRow({ meeting, onDelete }: MeetingRowProps) {
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

  const minutes = Math.floor(meeting.duration_seconds / 60);
  const seconds = meeting.duration_seconds % 60;
  const durationStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="group bg-white hover:bg-[#F9F8FF] border border-gray-200 hover:border-purple-200 rounded-xl p-4 sm:p-5 transition-all duration-150 shadow-2xs hover:shadow-md hover:shadow-purple-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <Link href={`/meetings/${meeting.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#7C4DFF] transition-colors truncate">
            {meeting.title}
          </h3>
          {meeting.tags && meeting.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              {meeting.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-full text-white shadow-2xs"
                  style={{ backgroundColor: tag.color || '#7C4DFF' }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{durationStr}</span>
          </div>
        </div>

        {meeting.description && (
          <p className="text-xs text-gray-600 line-clamp-1 mt-2">
            {meeting.description}
          </p>
        )}
      </Link>

      {/* Right section: Participants & Delete action */}
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
        {/* Participant Avatars */}
        <div className="flex items-center -space-x-2 overflow-hidden">
          {meeting.participants && meeting.participants.slice(0, 4).map((p) => (
            <div
              key={p.id}
              title={`${p.name} (${p.email})`}
              className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-2xs uppercase"
              style={{ backgroundColor: p.avatar_color || '#7C4DFF' }}
            >
              {p.name.charAt(0)}
            </div>
          ))}
          {meeting.participants && meeting.participants.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold flex items-center justify-center border-2 border-white">
              +{meeting.participants.length - 4}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(meeting.id);
              }}
              title="Delete Meeting"
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <Link
            href={`/meetings/${meeting.id}`}
            className="p-2 text-gray-400 group-hover:text-[#7C4DFF] group-hover:bg-purple-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
