'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Settings,
  HelpCircle,
  Sparkles,
  Bot,
  Layers,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Meetings', href: '/meetings', icon: LayoutDashboard },
    { label: 'Apps & Integrations', href: '#', icon: Layers, comingSoon: true },
    { label: 'Meeting Assistant Bot', href: '#', icon: Bot, comingSoon: true },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-16 lg:w-56 bg-[#10072F] text-white flex flex-col justify-between flex-shrink-0 h-screen sticky top-0 border-r border-navy-light z-30 transition-all duration-200">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C4DFF] to-[#B388FF] flex items-center justify-center shadow-lg shadow-purple-900/30 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden lg:block font-bold text-lg tracking-tight">
            fireflies<span className="text-[#7C4DFF]">.ai</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href) && item.href !== '#';

            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.comingSoon ? '#' : item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#7C4DFF] text-white shadow-md shadow-purple-950'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  } ${item.comingSoon ? 'opacity-60 cursor_not_allowed' : ''}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                  {item.comingSoon && (
                    <span className="hidden lg:inline-block ml-auto text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-white/20 text-white/80">
                      Soon
                    </span>
                  )}
                </Link>

                {/* Tooltip for collapsed sidebar on tablet */}
                <div className="lg:hidden absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label} {item.comingSoon ? '(Coming Soon)' : ''}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile snippet */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
            RS
          </div>
          <div className="hidden lg:block min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">Rahul Sharma</div>
            <div className="text-[11px] text-gray-400 truncate">rahul@company.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
