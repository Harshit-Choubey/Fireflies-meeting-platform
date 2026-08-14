'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ChevronDown,
  Monitor,
  Bot,
  UserCheck,
  Smartphone,
  Mail,
  Chrome,
  Zap,
  Code,
  DollarSign,
  Briefcase,
  Users,
  Target,
  Activity,
  Calendar,
  PhoneCall,
  Video,
  FileText,
  Database,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Globe,
  LogIn,
} from 'lucide-react';

export default function MarketingHeader() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleSimulatedLogin = () => {
    router.push('/login');
  };

  return (
    <header className="bg-[#0F0826] text-white border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C4DFF] to-purple-400 flex items-center justify-center shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-0.5">
              fireflies<span className="text-[#7C4DFF] font-extrabold">.ai</span>
            </span>
          </Link>

          {/* Desktop Mega-Menu Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {/* Product Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu('product')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 text-gray-300 hover:text-white py-2 transition-colors">
                Product <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {activeMenu === 'product' && (
                <div className="absolute top-full left-0 w-[640px] bg-[#170E3B] border border-white/10 rounded-2xl shadow-2xl p-5 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold tracking-wider text-purple-400 uppercase">
                      Core Products
                    </span>
                    <Link
                      href="/meetings"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <Monitor className="w-5 h-5 text-[#7C4DFF] mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-sm font-semibold text-white">Desktop App</div>
                        <div className="text-xs text-gray-400">Capture & transcribe meeting audio</div>
                      </div>
                    </Link>
                    <Link
                      href="/skills"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <Zap className="w-5 h-5 text-amber-400 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                          Fireflies AI Skills
                          <span className="bg-purple-500/20 text-purple-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                            NEW
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">200+ specialized prompt apps</div>
                      </div>
                    </Link>
                    <Link
                      href="/analytics"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <Activity className="w-5 h-5 text-emerald-400 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-sm font-semibold text-white">Conversation Intelligence</div>
                        <div className="text-xs text-gray-400">Talk-time & sentiment analytics</div>
                      </div>
                    </Link>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
                        <Bot className="w-4 h-4 text-[#7C4DFF]" />
                        AskFred AI Assistant
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Query your entire meeting history using natural language powered by GPT-4o.
                      </p>
                    </div>
                    <Link
                      href="/login"
                      className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#7C4DFF] hover:bg-[#6F3FF0] py-2 px-3 rounded-lg transition-colors"
                    >
                      Try AskFred Free <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions / Use Cases Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu('solutions')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 text-gray-300 hover:text-white py-2 transition-colors">
                Solutions <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {activeMenu === 'solutions' && (
                <div className="absolute top-full left-0 w-[520px] bg-[#170E3B] border border-white/10 rounded-2xl shadow-2xl p-5 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <Link href="/meetings" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-gray-200">Sales & CRM Notes</span>
                  </Link>
                  <Link href="/meetings" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-gray-200">Recruiting & Interviews</span>
                  </Link>
                  <Link href="/meetings" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5">
                    <Code className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-gray-200">Engineering Standups</span>
                  </Link>
                  <Link href="/meetings" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5">
                    <Target className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold text-gray-200">Marketing & Strategy</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Integrations Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu('integrations')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 text-gray-300 hover:text-white py-2 transition-colors">
                Integrations <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {activeMenu === 'integrations' && (
                <div className="absolute top-full left-0 w-[420px] bg-[#170E3B] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="text-[11px] font-bold text-purple-400 uppercase px-2">Supported Apps</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <Video className="w-3.5 h-3.5 text-blue-400" /> Zoom & Meet
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> Slack & Teams
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Salesforce & HubSpot
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Asana & Jira
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-[#7C4DFF]" />
            Login
          </Link>

          <Link
            href="/request-demo"
            className="hidden sm:inline-flex text-xs font-semibold text-white bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
          >
            Request Demo
          </Link>

          <Link
            href="/login"
            className="text-xs font-bold text-white bg-gradient-to-r from-[#7C4DFF] to-purple-600 hover:from-[#6F3FF0] hover:to-purple-700 px-4 py-2 rounded-xl shadow-lg shadow-purple-900/50 transition-all active:scale-95 flex items-center gap-1"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
