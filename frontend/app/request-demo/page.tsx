'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Send, ArrowLeft } from 'lucide-react';
import { useToast } from '@/providers/ToastContext';

export default function RequestDemoPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Demo request submitted successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="bg-[#0F0826] text-white p-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C4DFF] to-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              fireflies<span className="text-[#7C4DFF]">.ai</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="max-w-xl mx-auto w-full p-6 my-auto">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Get a Personalized Demo with Fireflies.ai
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              Trusted by over 500K businesses and 20M users to automatically transform meetings into a powerful, searchable knowledge base.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">First Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Last Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="Sharma"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company Name*</label>
                <input
                  type="text"
                  required
                  placeholder="Acme Tech Inc."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Work Email*</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@acmetech.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company Size*</label>
                <select className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#7C4DFF]">
                  <option>10 - 50 employees</option>
                  <option>50 - 250 employees</option>
                  <option>250 - 1000 employees</option>
                  <option>1000+ Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">What are you hoping to learn?</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your team's meeting workflows..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#7C4DFF] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7C4DFF] hover:bg-[#6F3FF0] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2"
              >
                Submit Demo Request <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                ✓
              </div>
              <h3 className="text-lg font-bold text-gray-900">Demo Scheduled!</h3>
              <p className="text-xs text-gray-600">
                Our team will reach out to schedule your personalized Fireflies.ai walk-through.
              </p>
              <button
                onClick={() => router.push('/meetings')}
                className="px-6 py-2.5 bg-[#7C4DFF] text-white text-xs font-bold rounded-xl"
              >
                Go to Workspace App
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-gray-400">
        © 2026 Fireflies.ai Corp. All rights reserved.
      </footer>
    </div>
  );
}
