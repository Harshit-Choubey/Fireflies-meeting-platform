'use client';

import React from 'react';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import HeroSection from '@/components/marketing/HeroSection';
import SummariesShowcase from '@/components/marketing/SummariesShowcase';
import AISkillsBrowser from '@/components/marketing/AISkillsBrowser';
import ConversationIntelSection from '@/components/marketing/ConversationIntelSection';
import SecuritySection from '@/components/marketing/SecuritySection';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <MarketingHeader />
      <HeroSection />
      <SummariesShowcase />
      <AISkillsBrowser />
      <ConversationIntelSection />
      <SecuritySection />
      <MarketingFooter />
    </div>
  );
}
