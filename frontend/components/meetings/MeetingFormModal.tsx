'use client';

import React, { useState } from 'react';
import { X, Sparkles, FileText, UserPlus, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface MeetingFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function MeetingFormModal({ onClose, onSuccess }: MeetingFormModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'transcript'>('manual');
  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [description, setDescription] = useState('');

  // Participant input state
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [participants, setParticipants] = useState<{ name: string; email: string }[]>([
    { name: 'Rahul Sharma', email: 'rahul@company.com' },
  ]);

  // Transcript paste state
  const [transcriptText, setTranscriptText] = useState(
    `[00:00:00] Rahul Sharma: Welcome everyone to our project alignment session.\n[00:00:15] Priya Patel: Thanks Rahul. Let's discuss our architecture milestones.`
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddParticipant = () => {
    if (!pName.trim() || !pEmail.trim()) return;
    setParticipants([...participants, { name: pName.trim(), email: pEmail.trim() }]);
    setPName('');
    setPEmail('');
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Meeting title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createMeeting({
        title: title.trim(),
        meeting_date: new Date(meetingDate).toISOString(),
        duration_seconds: durationMinutes * 60,
        description: description.trim() || undefined,
        participants: participants,
        transcript_text: transcriptText.trim() || undefined,
        media_url: '/media/demo-meeting.mp3',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create meeting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7C4DFF] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Create New Meeting</h2>
              <p className="text-xs text-gray-500">Manual entry or paste transcript</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 px-6 pt-3 gap-6 bg-gray-50/50 text-sm font-medium">
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'border-[#7C4DFF] text-[#7C4DFF]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Meeting Metadata</span>
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'transcript'
                ? 'border-[#7C4DFF] text-[#7C4DFF]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Transcript</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {activeTab === 'manual' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Architecture Sync"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-[#7C4DFF] focus:ring-2 focus:ring-purple-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-[#7C4DFF] focus:ring-2 focus:ring-purple-100 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={480}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-[#7C4DFF] focus:ring-2 focus:ring-purple-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description / Agenda
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief meeting notes or agenda..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-[#7C4DFF] focus:ring-2 focus:ring-purple-100 focus:outline-hidden"
                />
              </div>

              {/* Participants Section */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Participants
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={pEmail}
                    onChange={(e) => setPEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {participants.map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-900 text-xs rounded-full"
                    >
                      <span>{p.name} ({p.email})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(idx)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Transcript Text Contract: <code className="text-[#7C4DFF] bg-purple-50 px-1 py-0.5 rounded">[HH:MM:SS] Speaker Name: text</code>
              </label>
              <textarea
                rows={10}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="[00:00:00] Rahul: Hello everyone..."
                className="w-full font-mono text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:border-[#7C4DFF] focus:ring-2 focus:ring-purple-100 focus:outline-hidden"
              />
              <p className="text-[11px] text-gray-500 mt-1.5">
                Timestamps must be monotonically increasing. Speaker names and segment text are required.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#7C4DFF] hover:bg-[#6F3FF0] text-white text-sm font-semibold rounded-xl shadow-md shadow-purple-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
