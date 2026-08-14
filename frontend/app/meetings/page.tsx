'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import MeetingList from '@/components/meetings/MeetingList';

export default function MeetingsPage() {
  return (
    <AppShell>
      <MeetingList />
    </AppShell>
  );
}
