'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { CheckSquare, Clock, User, CheckCircle2, Search, Filter } from 'lucide-react';
import { useToast } from '@/providers/ToastContext';

interface Task {
  id: string;
  meetingTitle: string;
  text: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
}

export default function TasksPage() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const [taskList, setTaskList] = useState<Task[]>([
    {
      id: '1',
      meetingTitle: 'Product Architecture & API Refactor Sync',
      text: 'Configure SQLite foreign key event listener in database.py',
      assignee: 'Alex Rivera',
      status: 'completed',
      dueDate: 'Aug 16, 2026',
    },
    {
      id: '2',
      meetingTitle: 'Product Architecture & API Refactor Sync',
      text: 'Implement TanStack Query optimistic mutation hook for Action Items',
      assignee: 'Alex Rivera',
      status: 'in_progress',
      dueDate: 'Aug 18, 2026',
    },
    {
      id: '3',
      meetingTitle: 'Q3 Customer Feedback & Feature Roadmap',
      text: 'Deploy seed-on-startup logic for Vercel/Render evaluation',
      assignee: 'Rahul Sharma',
      status: 'pending',
      dueDate: 'Aug 20, 2026',
    },
    {
      id: '4',
      meetingTitle: 'Weekly Engineering Standup & Deployment Check',
      text: 'Export transcript & action items as printable PDF document',
      assignee: 'Sarah Watts',
      status: 'completed',
      dueDate: 'Aug 14, 2026',
    },
  ]);

  const toggleTaskStatus = (id: string) => {
    setTaskList((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          showToast(`Task status updated to "${nextStatus}"!`, 'success');
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const filteredTasks = taskList.filter((t) => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'completed' ? t.status === 'completed' : t.status !== 'completed';
    const matchesSearch =
      !search.trim() ||
      t.text.toLowerCase().includes(search.toLowerCase()) ||
      t.meetingTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-[#7C4DFF]" /> Tasks & Action Items
            </h1>
            <p className="text-xs text-gray-500">
              Manage and track all meeting action items across your workspace in one central location.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Status:</span>
            <div className="inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-[#7C4DFF] text-white shadow-xs' : 'text-gray-600'}`}
              >
                All ({taskList.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-lg ${filter === 'pending' ? 'bg-[#7C4DFF] text-white shadow-xs' : 'text-gray-600'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg ${filter === 'completed' ? 'bg-[#7C4DFF] text-white shadow-xs' : 'text-gray-600'}`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, meetings, or assignees..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#7C4DFF] focus:outline-hidden"
          />
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTaskStatus(task.id)}
              className={`p-4 bg-white border rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 shadow-xs hover:border-purple-300 ${
                task.status === 'completed' ? 'border-gray-200 bg-gray-50/50 opacity-75' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    task.status === 'completed' ? 'bg-[#7C4DFF] text-white' : 'border-2 border-gray-300 hover:border-[#7C4DFF]'
                  }`}
                >
                  {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <div className="space-y-1">
                  <p className={`text-xs font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {task.text}
                  </p>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Meeting: <span className="text-gray-700">{task.meetingTitle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs flex-shrink-0">
                <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg font-medium border border-purple-100">
                  <User className="w-3 h-3" /> {task.assignee}
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-[11px] font-mono">
                  <Clock className="w-3 h-3" /> {task.dueDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
