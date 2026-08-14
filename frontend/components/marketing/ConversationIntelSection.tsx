'use client';

import React from 'react';
import { Activity, Smile, Frown, Meh, BarChart2 } from 'lucide-react';

export default function ConversationIntelSection() {
  return (
    <section className="bg-white text-gray-900 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-[#7C4DFF] rounded-full text-xs font-bold">
            <Activity className="w-3.5 h-3.5" /> Conversation Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Drive Insights With <br />
            <span className="text-[#7C4DFF]">Conversation Intelligence</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Detailed analytics to help you uncover insights across every conversation — track speaker talk time, AI prompt filters, and emotional sentiment.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1">
              <h4 className="text-xs font-bold text-gray-900">Speaker Talk-Time Ratio</h4>
              <p className="text-xs text-gray-500">Measure speaking vs listening metrics for sales and interview coaching.</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1">
              <h4 className="text-xs font-bold text-gray-900">Sentiment Analysis</h4>
              <p className="text-xs text-gray-500">Understand the emotional tone of your meetings — detect positive, negative, or neutral responses.</p>
            </div>
          </div>
        </div>

        {/* Right Column Visual Card */}
        <div className="bg-[#10072F] text-white border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#7C4DFF]" />
              <span className="text-xs font-bold">Meeting Analytics Overview</span>
            </div>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              LIVE DATA
            </span>
          </div>

          {/* Talk Time Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-300">Harshit (Host) — 62%</span>
              <span className="text-purple-300">Sarah (Client) — 38%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#7C4DFF] w-[62%]" />
              <div className="h-full bg-emerald-400 w-[38%]" />
            </div>
          </div>

          {/* Sentiment Badges */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Sentiment Breakdown</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">82% Positive</div>
                  <div className="text-[10px] text-gray-400">High engagement</div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-center gap-2">
                <Meh className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-amber-300">14% Neutral</div>
                  <div className="text-[10px] text-gray-400">Information sharing</div>
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl flex items-center gap-2">
                <Frown className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="text-xs font-bold text-rose-300">4% Negative</div>
                  <div className="text-[10px] text-gray-400">Blockers mentioned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
