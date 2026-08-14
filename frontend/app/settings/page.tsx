'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Settings as SettingsIcon, User, Bell, Shield, Sliders, Globe } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { title: 'Profile & Account', icon: User, desc: 'Manage default logged-in user profile, avatars, and display names.' },
    { title: 'Appearance & Themes', icon: Sliders, desc: 'Customize workspace dark mode preferences and layout density.' },
    { title: 'Notifications & Digest', icon: Bell, desc: 'Configure automated post-meeting summary emails and action item alerts.' },
    { title: 'Integrations & Bots', icon: Globe, desc: 'Connect Zoom, Google Meet, Microsoft Teams, and CRM webhooks.' },
    { title: 'Security & Access', icon: Shield, desc: 'API token management, single sign-on (SSO), and workspace permissions.' },
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#7C4DFF]" />
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Workspace configuration and integration preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-3 relative overflow-hidden group hover:border-purple-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C4DFF] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-gray-100 text-gray-600 border border-gray-200">
                    Coming Soon
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{sec.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{sec.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
