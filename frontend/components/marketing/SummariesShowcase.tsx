'use client';

import React, { useState } from 'react';
import { FileText, CheckSquare, ListOrdered, Edit3, Share2, Scissors } from 'lucide-react';

export default function SummariesShowcase() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bullet_points' | 'action_items' | 'custom_notes'>('overview');

  return (
    <section className="bg-white text-gray-900 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Comprehensive <span className="text-[#7C4DFF]">AI Summaries</span>
          </h2>
          <p className="text-base text-gray-600">
            Get detailed notes, action items, and customized summaries instantly after every meeting.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl gap-1 border border-gray-200 shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#7C4DFF] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bullet_points')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bullet_points'
                  ? 'bg-[#7C4DFF] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bullet Points
            </button>
            <button
              onClick={() => setActiveTab('action_items')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'action_items'
                  ? 'bg-[#7C4DFF] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Action Items
            </button>
            <button
              onClick={() => setActiveTab('custom_notes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'custom_notes'
                  ? 'bg-[#7C4DFF] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Custom Notes
            </button>
          </div>
        </div>

        {/* Mock Summary Display Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C4DFF] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Kickoff Call — Fireflies.ai x Acme</h3>
                <p className="text-xs text-gray-500">Sarah Watts • Mar 15 • 11:30 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs">
                <Scissors className="w-3.5 h-3.5 text-[#7C4DFF]" /> Soundbite
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C4DFF] text-white rounded-xl text-xs font-semibold hover:bg-[#6F3FF0] shadow-xs">
                <Share2 className="w-3.5 h-3.5" /> Share Notes
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed font-normal bg-white p-6 rounded-2xl border border-gray-200 shadow-xs min-h-[220px]">
            {activeTab === 'overview' && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Executive Summary</span>
                <p>
                  The meeting successfully outlined best practices for implementing Fireflies automated note-taking. Participants gained clarity on guidelines for using Fireflies in both internal sprint reviews and external client meetings.
                </p>
                <p>
                  Key features such as Chrome & Zoom integrations, AI customization, and transcript export workflows were discussed in detail.
                </p>
              </div>
            )}

            {activeTab === 'bullet_points' && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Key Takeaways</span>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-800">
                  <li>Provide a final list of 50 users for initial onboarding by Thursday.</li>
                  <li>Schedule training sessions for team leads with weekly feedback calls.</li>
                  <li>Saves 5+ hours per week on note-taking and meeting synthesis.</li>
                  <li>Allows team members to focus on client engagement instead of manual transcription.</li>
                </ul>
              </div>
            )}

            {activeTab === 'action_items' && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Extracted Action Items</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 bg-purple-50 border border-purple-100 rounded-xl text-purple-900 font-medium">
                    <CheckSquare className="w-4 h-4 text-[#7C4DFF]" />
                    <span>Provide final list of 50 users for initial training (Assigned to Sarah)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                    <span>Schedule weekly feedback calls (Assigned to Alex)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'custom_notes' && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Custom Prompts & Notes</span>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono">
                  USP Advantage Tracker: Efficiency Gains, AI-powered meeting summaries, and bespoke AI skills for specific engineering workflows.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
