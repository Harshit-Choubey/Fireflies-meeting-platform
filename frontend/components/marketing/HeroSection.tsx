'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-[#0F0826] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-b border-white/5">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-900/40 via-[#7C4DFF]/30 to-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
        {/* Rating Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-200">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span>Rated 4.8 / 5 on G2 & Capterra</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">GDPR & SOC2 Type II Certified</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          The <span className="bg-gradient-to-r from-purple-300 via-[#7C4DFF] to-indigo-400 bg-clip-text text-transparent">#1 AI Assistant</span> For Your Meetings
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Transcribe, summarize, search, and analyze all your team conversations automatically. Over 1 million professionals save 5+ hours every week.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C4DFF] to-purple-600 hover:from-[#6F3FF0] hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-950/80 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/meetings"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current text-purple-400" /> Explore App Workspace
          </Link>
        </div>

        {/* Social Proof Logos Marquee */}
        <div className="pt-10 border-t border-white/10 max-w-4xl mx-auto">
          <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-5">
            USED ACROSS 1 MILLION+ COMPANIES WORLDWIDE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="text-sm font-black text-gray-300 font-mono tracking-wider">AssemblyAI</span>
            <span className="text-sm font-black text-gray-300 font-serif tracking-widest uppercase">EMAAR</span>
            <span className="text-sm font-black text-gray-300 tracking-wider">Leonardo.Ai</span>
            <span className="text-sm font-black text-gray-300 font-serif tracking-widest">PENN</span>
          </div>
        </div>

        {/* Product UI Interactive Frame Preview */}
        <div className="pt-6 relative max-w-5xl mx-auto">
          <div className="bg-[#170E3B] border border-white/15 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-purple-950/80">
            {/* Fake Mac Window Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-black/30 rounded-2xl mb-3 border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-[11px] font-mono text-gray-400 bg-white/5 px-3 py-0.5 rounded-full border border-white/10">
                app.fireflies.ai/meetings/demo-kickoff
              </div>
              <div className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Workspace
              </div>
            </div>

            {/* Preview Banner Grid */}
            <div className="bg-[#10072F] rounded-2xl p-4 text-left grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-purple-300">Kickoff Call — Fireflies.ai x Acme</div>
                <div className="text-[11px] text-gray-400">Sarah Watts • 3m 15s • 3 Participants</div>
                <div className="pt-2 text-xs text-gray-300 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[#7C4DFF] font-bold">Overview:</span> The team aligned on SQLite WAL mode, binary search sync, and AI summary notes export.
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-amber-300">Action Items Extracted (3)</div>
                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Configure SQLite FK listener</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Implement player sync hook</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-emerald-300">AskFred AI Assistant</div>
                <div className="text-xs text-gray-300 italic bg-purple-950/40 p-2 rounded-lg border border-purple-800/40">
                  "What were the primary decisions made regarding query optimization?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
