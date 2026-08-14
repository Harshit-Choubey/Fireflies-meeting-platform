'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  Activity,
  Share2,
  Settings,
  Sparkles,
  Globe,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Meetings', href: '/meetings', icon: LayoutDashboard },
    { label: 'Tasks & Actions', href: '/tasks', icon: CheckSquare },
    { label: 'AI Apps & Skills', href: '/skills', icon: Zap },
    { label: 'Analytics', href: '/analytics', icon: Activity },
    { label: 'Integrations', href: '/integrations', icon: Share2 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-16 lg:w-56 bg-[#10072F] text-white flex flex-col justify-between flex-shrink-0 h-screen sticky top-0 border-r border-white/10 z-30 transition-all duration-200">
      <div>
        {/* Brand Header */}
        <Link href="/" className="h-16 flex items-center px-4 gap-3 border-b border-white/10 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C4DFF] to-[#B388FF] flex items-center justify-center shadow-lg shadow-purple-900/30 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden lg:block font-bold text-lg tracking-tight">
            fireflies<span className="text-[#7C4DFF]">.ai</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/meetings' && pathname.startsWith('/meetings'));

            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#7C4DFF] text-white shadow-md shadow-purple-950 font-bold'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                </Link>

                {/* Tooltip for collapsed sidebar */}
                <div className="lg:hidden absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Links & User Profile */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4 text-purple-400" />
          <span className="hidden lg:inline">Public Website</span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
            RS
          </div>
          <div className="hidden lg:block min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">Rahul Sharma</div>
            <div className="text-[11px] text-gray-400 truncate">rahul@company.com</div>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 hidden lg:block hover:text-rose-400 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
