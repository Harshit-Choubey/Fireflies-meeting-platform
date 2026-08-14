'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Share2, Video, MessageSquare, Briefcase, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/providers/ToastContext';

export default function IntegrationsPage() {
  const { showToast } = useToast();

  const [apps, setApps] = useState([
    { id: '1', name: 'Google Meet', category: 'Video Conferencing', connected: true, icon: Video, color: 'text-blue-500' },
    { id: '2', name: 'Zoom', category: 'Video Conferencing', connected: true, icon: Video, color: 'text-blue-600' },
    { id: '3', name: 'Microsoft Teams', category: 'Video Conferencing', connected: false, icon: Video, color: 'text-indigo-600' },
    { id: '4', name: 'Slack', category: 'Collaboration', connected: true, icon: MessageSquare, color: 'text-pink-500' },
    { id: '5', name: 'Salesforce', category: 'CRM', connected: false, icon: Briefcase, color: 'text-sky-500' },
    { id: '6', name: 'HubSpot', category: 'CRM', connected: true, icon: Briefcase, color: 'text-amber-500' },
    { id: '7', name: 'Asana', category: 'Project Management', connected: true, icon: Share2, color: 'text-rose-500' },
  ]);

  const toggleConnect = (id: string, name: string, isConnected: boolean) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, connected: !app.connected } : app))
    );
    showToast(`${name} ${!isConnected ? 'connected successfully' : 'disconnected'}!`, 'success');
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-[#7C4DFF]" /> Integrations & Connected Apps
          </h1>
          <p className="text-xs text-gray-500">
            Automatically send notes, audio transcripts, and action items to your favorite work tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 bg-gray-50 border border-gray-200 rounded-xl ${app.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{app.name}</h4>
                    <span className="text-[10px] text-gray-400 font-medium">{app.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleConnect(app.id, app.name, app.connected)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                    app.connected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#7C4DFF] text-white border-[#7C4DFF] hover:bg-[#6F3FF0]'
                  }`}
                >
                  {app.connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
