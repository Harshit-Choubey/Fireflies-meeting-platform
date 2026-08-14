'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  iconBg: string;
}

export default function AISkillsBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Engineering');

  const categories = [
    'Engineering',
    'Sales',
    'Recruiting',
    'Marketing',
    'User Research',
    'Healthcare',
    'Venture Capital',
  ];

  const skills: Skill[] = [
    {
      id: '1',
      name: 'Daily Stand-Up',
      category: 'Engineering',
      description: 'Summarize action items and blockers in your daily standups automatically.',
      iconBg: 'bg-amber-500',
    },
    {
      id: '2',
      name: 'Goal Progress Tracker',
      category: 'Engineering',
      description: 'Track progress towards engineering sprint goals discussed in technical syncs.',
      iconBg: 'bg-emerald-500',
    },
    {
      id: '3',
      name: 'Issue Extractor',
      category: 'Engineering',
      description: 'Extract technical bugs and architecture issues mentioned during meetings.',
      iconBg: 'bg-[#7C4DFF]',
    },
    {
      id: '4',
      name: 'Resource Needs Identifier',
      category: 'Engineering',
      description: 'Identify headcount and infrastructure resource requirements mentioned by leads.',
      iconBg: 'bg-sky-500',
    },
    {
      id: '5',
      name: 'BANT Sales Qualification',
      category: 'Sales',
      description: 'Automatically extract Budget, Authority, Need, and Timeline from prospect calls.',
      iconBg: 'bg-rose-500',
    },
    {
      id: '6',
      name: 'Candidate Interview Scorecard',
      category: 'Recruiting',
      description: 'Extract technical skills, culture fit rating, and interviewer consensus.',
      iconBg: 'bg-indigo-500',
    },
  ];

  const filteredSkills = skills.filter(
    (s) => s.category === selectedCategory || selectedCategory === 'Engineering'
  );

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-[#7C4DFF] rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Fireflies AI Apps & Apps Library
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Go Beyond Notetaking With <span className="text-[#7C4DFF]">200+ AI Skills</span>
          </h2>
          <p className="text-base text-gray-600">
            AI Skills help you automatically extract key details, generate follow-up emails, score candidates, and other insights from meetings.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {filteredSkills.slice(0, 4).map((skill) => (
            <div
              key={skill.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div
                className={`w-9 h-9 rounded-xl ${skill.iconBg} text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-xs`}
              >
                +
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold text-gray-900">{skill.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{skill.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
