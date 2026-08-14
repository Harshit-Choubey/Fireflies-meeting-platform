'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import MeetingList from '@/components/meetings/MeetingList';

export default function HomePage() {
  return (
    <AppShell>
      <MeetingList />
    </AppShell>
  );
}
