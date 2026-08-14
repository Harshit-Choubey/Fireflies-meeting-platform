'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Activity, Smile, Frown, Meh, BarChart2, Users, Clock, Video } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#7C4DFF]" /> Conversation Intelligence & Analytics
          </h1>
          <p className="text-xs text-gray-500">
            Real-time analytics on meeting frequency, speaker talk-time distribution, and emotional sentiment across your workspace.
          </p>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-gray-500">Total Meetings</span>
            <div className="text-2xl font-extrabold text-gray-900">24</div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              +12% this month
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-gray-500">Hours Transcribed</span>
            <div className="text-2xl font-extrabold text-gray-900">18.5 hrs</div>
            <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
              Save ~6.2 hrs notes
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-gray-500">Avg. Talk Ratio</span>
            <div className="text-2xl font-extrabold text-gray-900">58% / 42%</div>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
              Optimal balance
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-gray-500">Positive Sentiment</span>
            <div className="text-2xl font-extrabold text-emerald-600">84%</div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              High team morale
            </span>
          </div>
        </div>

        {/* Main Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Talk Time Distribution */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7C4DFF]" /> Speaker Talk-Time Ratio
              </h3>
              <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                LAST 30 DAYS
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-900">Harshit (Host)</span>
                  <span className="text-[#7C4DFF]">62% (11.4 hrs)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C4DFF] w-[62%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-900">Sarah Jenkins (Product Lead)</span>
                  <span className="text-emerald-600">26% (4.8 hrs)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[26%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-900">Alex Rivera (Senior Engineer)</span>
                  <span className="text-amber-600">12% (2.3 hrs)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[12%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-500" /> Sentiment Breakdown
              </h3>
              <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                AI CLASSIFIED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1 text-center">
                <Smile className="w-5 h-5 text-emerald-600 mx-auto" />
                <div className="text-base font-extrabold text-emerald-700">84%</div>
                <div className="text-[10px] font-bold text-emerald-600">Positive</div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-1 text-center">
                <Meh className="w-5 h-5 text-amber-600 mx-auto" />
                <div className="text-base font-extrabold text-amber-700">12%</div>
                <div className="text-[10px] font-bold text-amber-600">Neutral</div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-1 text-center">
                <Frown className="w-5 h-5 text-rose-600 mx-auto" />
                <div className="text-base font-extrabold text-rose-700">4%</div>
                <div className="text-[10px] font-bold text-rose-600">Blockers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
