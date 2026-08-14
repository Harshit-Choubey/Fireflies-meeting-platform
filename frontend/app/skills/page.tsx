'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Zap, Sparkles, CheckCircle2, Search, Filter } from 'lucide-react';
import { useToast } from '@/providers/ToastContext';

export default function SkillsPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [skills, setSkills] = useState([
    {
      id: '1',
      name: 'Daily Stand-Up Summarizer',
      category: 'Engineering',
      description: 'Extract action items, blockers, and completed tickets from technical standups.',
      enabled: true,
    },
    {
      id: '2',
      name: 'Goal Progress Tracker',
      category: 'Engineering',
      description: 'Automatically track OKR progress and milestone commitments.',
      enabled: true,
    },
    {
      id: '3',
      name: 'BANT Sales Qualification',
      category: 'Sales',
      description: 'Extract Budget, Authority, Need, and Timeline from prospect discovery calls.',
      enabled: false,
    },
    {
      id: '4',
      name: 'Candidate Interview Scorecard',
      category: 'Recruiting',
      description: 'Analyze technical skills, candidate responses, and interviewer ratings.',
      enabled: true,
    },
    {
      id: '5',
      name: 'Competitor Mention Tracker',
      category: 'Marketing',
      description: 'Detect competitor product names and feature comparisons discussed during calls.',
      enabled: false,
    },
  ]);

  const toggleSkill = (id: string, name: string, currentState: boolean) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    showToast(`AI Skill "${name}" ${!currentState ? 'enabled' : 'disabled'}!`, 'success');
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" /> Fireflies AI Apps & 200+ Skills Store
            </h1>
            <p className="text-xs text-gray-500">
              Enable specialized AI skills to automatically extract insights, score calls, and format meeting summaries.
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 200+ AI skills..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#7C4DFF] focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2">
            {['ALL', 'Engineering', 'Sales', 'Recruiting', 'Marketing'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#7C4DFF] text-white border-[#7C4DFF]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs hover:border-purple-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {skill.category}
                  </span>
                  <button
                    onClick={() => toggleSkill(skill.id, skill.name, skill.enabled)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      skill.enabled ? 'bg-[#7C4DFF]' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        skill.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-gray-900">{skill.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{skill.description}</p>
              </div>

              <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                {skill.enabled ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enabled for workspace meetings
                  </span>
                ) : (
                  <span>Click toggle to activate skill</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
