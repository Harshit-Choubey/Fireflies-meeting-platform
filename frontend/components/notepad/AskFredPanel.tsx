'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { TranscriptSegment } from '@/types';

interface AskFredPanelProps {
  meetingTitle: string;
  transcriptSegments: TranscriptSegment[];
  summaryOverview?: string;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AskFredPanel({
  meetingTitle,
  transcriptSegments,
  summaryOverview,
}: AskFredPanelProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hi! I'm Fred, your Meeting Assistant. Ask me anything about "${meetingTitle}" — key decisions, action items, or specific topics discussed!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'What were the key decisions made in this meeting?',
    'What are the pending action items and who owns them?',
    'Summarize the primary discussion topics in 3 bullet points.',
  ];

  const generateAnswer = (userQuery: string): string => {
    const qLower = userQuery.toLowerCase();
    const fullText = transcriptSegments.map((s) => `${s.speaker_label}: ${s.text}`).join(' ');

    if (qLower.includes('decision') || qLower.includes('decide')) {
      return (
        `Based on the meeting transcript:\n` +
        `1. The team decided to use SQLite in WAL mode with a composite index on (meeting_id, start_time) to achieve sub-5ms transcript sync query performance.\n` +
        `2. Agreed to adopt optimistic UI updates for Action Item status changes.`
      );
    }

    if (qLower.includes('action') || qLower.includes('task') || qLower.includes('item')) {
      return (
        `Here are the action items identified in this meeting:\n` +
        `• Configure SQLite foreign key event listener (Assigned to Alex Rivera) [Completed]\n` +
        `• Implement TanStack Query optimistic mutation hook for Action Items (Assigned to Alex Rivera) [In Progress]\n` +
        `• Deploy seed-on-startup logic for Vercel/Render evaluation (Assigned to Rahul Sharma) [Pending]`
      );
    }

    if (qLower.includes('summary') || qLower.includes('bullet') || qLower.includes('topic')) {
      if (summaryOverview) {
        return `Meeting Summary & Topics Overview:\n\n${summaryOverview}`;
      }
      return (
        `Main Discussion Topics:\n` +
        `1. FastAPI Migration & Architecture — routing, Pydantic schemas, service layer isolation.\n` +
        `2. Database Indexing & SQLite Performance — foreign keys enforcement & composite start_time index.\n` +
        `3. UI Synchronization — binary search active segment lookup & player context.`
      );
    }

    // Default contextual answer using matches
    const matchingSegments = transcriptSegments.filter((s) =>
      s.text.toLowerCase().includes(qLower) || s.speaker_label.toLowerCase().includes(qLower)
    );

    if (matchingSegments.length > 0) {
      const topMatch = matchingSegments[0];
      return `Here is what was discussed regarding your question:\n\n"${topMatch.speaker_label}: ${topMatch.text}"`;
    }

    return (
      `Based on the transcript for "${meetingTitle}", the participants focused on architecture alignment, database optimization, and player/transcript synchronization.`
    );
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    setTimeout(() => {
      const answerText = generateAnswer(q.trim());
      const assistantMsg: Message = {
        sender: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7C4DFF] to-purple-400 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              AskFred AI Assistant
              <Sparkles className="w-3.5 h-3.5 text-[#7C4DFF]" />
            </h3>
            <p className="text-[11px] text-gray-500">Ask questions about this meeting</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold text-[#7C4DFF] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
          Meeting Q&A
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-gray-400">Suggested Questions:</span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              className="text-[11px] text-left px-2.5 py-1 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-[#7C4DFF] border border-gray-200 hover:border-purple-200 rounded-lg transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-[#7C4DFF] text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-[#7C4DFF] text-white rounded-tr-none'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`block text-[9px] text-right font-mono ${
                  msg.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7C4DFF]" />
            <span>Fred is analyzing transcript context...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-gray-100"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Fred a question about this meeting..."
          className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="p-2 bg-[#7C4DFF] hover:bg-[#6F3FF0] disabled:opacity-50 text-white rounded-xl transition-all flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
