'use client';

import React from 'react';
import { ShieldCheck, Lock, Key, FileCheck } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10 text-center">
        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-[#7C4DFF] rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Enterprise-Grade Security
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Enterprise-Grade Security & Privacy
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Fireflies is the preferred platform for CIOs across Fortune 500 companies offering robust admin controls and stringent security protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-900">SOC 2 Type II Certified</h4>
            <p className="text-xs text-gray-500">Rigorous security standards for data privacy, confidentiality, and availability.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-900">GDPR & HIPAA Compliant</h4>
            <p className="text-xs text-gray-500">Complete data protection meeting European and US healthcare standards.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C4DFF] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-900">256-Bit Encryption</h4>
            <p className="text-xs text-gray-500">Data encrypted in transit using TLS 1.3 and at rest with AES-256 keys.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-900">Zero Data Retention</h4>
            <p className="text-xs text-gray-500">Your meeting data is never used for model training or shared with third parties.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
