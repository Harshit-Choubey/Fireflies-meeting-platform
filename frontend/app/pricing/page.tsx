'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      <MarketingHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
            Simple, Transparent <span className="text-[#7C4DFF]">Pricing</span>
          </h1>
          <p className="text-sm text-gray-600">
            Automate notes, action items, and conversation intelligence across all your team meetings.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-semibold ${annual ? 'text-gray-900' : 'text-gray-500'}`}>
              Billed Annually <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Save 40%</span>
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${annual ? 'bg-[#7C4DFF]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-semibold ${!annual ? 'text-gray-900' : 'text-gray-500'}`}>
              Billed Monthly
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-sm font-bold text-gray-900">Free</div>
              <div className="text-3xl font-extrabold text-gray-900">$0 <span className="text-xs font-normal text-gray-500">/ forever</span></div>
              <p className="text-xs text-gray-500">For individuals wanting basic meeting notes.</p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Limited transcription credits</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> 800 mins storage / seat</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Key takeaways & summaries</li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl text-center">
              Start Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border-2 border-[#7C4DFF] rounded-3xl p-6 shadow-xl relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C4DFF] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
              MOST POPULAR
            </div>
            <div className="space-y-4">
              <div className="text-sm font-bold text-[#7C4DFF]">Pro</div>
              <div className="text-3xl font-extrabold text-gray-900">{annual ? '$10' : '$18'} <span className="text-xs font-normal text-gray-500">/ seat / mo</span></div>
              <p className="text-xs text-gray-500">For fast-growing teams & professionals.</p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Unlimited transcription credits</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> 8,000 mins storage / seat</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Action item extraction & search</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> AskFred AI Assistant access</li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-2.5 bg-[#7C4DFF] hover:bg-[#6F3FF0] text-white text-xs font-bold rounded-xl text-center shadow-md">
              Try Pro Free
            </Link>
          </div>

          {/* Business Tier */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-sm font-bold text-gray-900">Business</div>
              <div className="text-3xl font-extrabold text-gray-900">{annual ? '$19' : '$29'} <span className="text-xs font-normal text-gray-500">/ seat / mo</span></div>
              <p className="text-xs text-gray-500">For revenue, sales & hiring teams.</p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Conversation Intelligence</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Speaker talk-time analytics</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Custom AI Prompts & Skills</li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl text-center">
              Get Started
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-sm font-bold text-gray-900">Enterprise</div>
              <div className="text-3xl font-extrabold text-gray-900">Custom</div>
              <p className="text-xs text-gray-500">For large organizations needing custom SSO & security.</p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Dedicated account manager</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Custom SSO & SAML auth</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Custom data retention policy</li>
              </ul>
            </div>
            <Link href="/request-demo" className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl text-center">
              Contact Sales
            </Link>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
