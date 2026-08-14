'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/providers/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = (provider: string) => {
    setLoading(true);
    showToast(`Signing in with ${provider}...`, 'info');

    setTimeout(() => {
      showToast('Successfully authenticated as Rahul Sharma!', 'success');
      router.push('/meetings');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0F0826] text-white flex flex-col justify-between">
      {/* Header */}
      <header className="p-6 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C4DFF] to-purple-400 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            fireflies<span className="text-[#7C4DFF]">.ai</span>
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Public Site
        </Link>
      </header>

      {/* Main Login Card Grid */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="bg-[#170E3B] border border-white/10 rounded-3xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl shadow-purple-950/90">
          {/* Left Column Auth Form */}
          <div className="p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7C4DFF]/20 border border-[#7C4DFF]/40 text-[#7C4DFF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Get the #1 AI Assistant for Your Meetings
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                By continuing, you agree to Fireflies's Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleLogin('Google')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all flex items-center justify-center gap-3 active:scale-98 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                  />
                </svg>
                Continue with Google
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto" />
              </button>

              <button
                onClick={() => handleLogin('Microsoft')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all flex items-center justify-center gap-3 active:scale-98 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#7FBA00" d="M13 1h10v10H13z" />
                  <path fill="#00A4EF" d="M1 13h10v10H1z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                Continue with Microsoft
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto" />
              </button>

              <div className="pt-2 text-center">
                <button
                  onClick={() => handleLogin('SSO')}
                  className="text-xs font-semibold text-purple-300 hover:text-white underline transition-colors"
                >
                  Use Single Sign-On (SSO)
                </button>
              </div>
            </div>

            {/* Security Badges */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> SOC 2 TYPE II
              </span>
              <span>GDPR COMPLIANT</span>
              <span>256-BIT ENCRYPTION</span>
            </div>
          </div>

          {/* Right Column Testimonial & Preview Card */}
          <div className="bg-[#10072F] p-8 sm:p-10 border-l border-white/10 flex flex-col justify-between space-y-6">
            {/* Priority Card Preview */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Marketing Sync Notes</span>
                <span className="text-[10px] text-gray-400 font-mono">Jan 15 • 11:30 AM</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1 text-xs text-gray-300">
                <div className="text-[#7C4DFF] font-bold text-[11px]">🚀 Priorities: 00:00 - 10:12</div>
                <p>Ensure clarity on messaging, target audience, and primary campaign channels.</p>
              </div>
            </div>

            {/* Quote */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-300 italic leading-relaxed">
                "Fireflies keeps me 100% present in meetings without losing any of the critical notes or action items."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7C4DFF] text-white font-bold text-xs flex items-center justify-center">
                  S
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sarup Banskota</div>
                  <div className="text-[10px] text-gray-400">Head of Growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-500 font-mono">
        © 2026 Fireflies.ai Corp. All rights reserved.
      </footer>
    </div>
  );
}
