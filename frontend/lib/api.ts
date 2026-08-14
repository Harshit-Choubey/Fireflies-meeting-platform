import {
  ActionItem,
  ActionStatus,
  Decision,
  GlobalSearchResult,
  Meeting,
  Summary,
  Tag,
  Topic,
  Transcript,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `API Error ${res.status}`;
    try {
      const errBody = await res.json();
      if (errBody?.detail?.message) {
        errorMessage = errBody.detail.message;
      } else if (errBody?.error?.message) {
        errorMessage = errBody.error.message;
      }
    } catch {
      // fallback
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return {} as T;
  }

  const json = await res.json();
  return json.data;
}

export const api = {
  // Meetings
  getMeetings: (params?: {
    search?: string;
    participant?: string;
    date_from?: string;
    date_to?: string;
    tag_ids?: number[];
    page?: number;
    limit?: number;
  }): Promise<Meeting[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.participant) query.append('participant', params.participant);
    if (params?.date_from) query.append('date_from', params.date_from);
    if (params?.date_to) query.append('date_to', params.date_to);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.tag_ids) {
      params.tag_ids.forEach((id) => query.append('tag_ids', id.toString()));
    }
    const qStr = query.toString();
    return fetchAPI<Meeting[]>(`/meetings${qStr ? `?${qStr}` : ''}`);
  },

  getMeeting: (id: number): Promise<Meeting> => fetchAPI<Meeting>(`/meetings/${id}`),

  createMeeting: (data: {
    title: string;
    meeting_date: string;
    duration_seconds?: number;
    description?: string;
    media_url?: string;
    participants?: { name: string; email: string }[];
    transcript_text?: string;
  }): Promise<Meeting> =>
    fetchAPI<Meeting>('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMeeting: (
    id: number,
    data: { title?: string; description?: string; meeting_date?: string }
  ): Promise<Meeting> =>
    fetchAPI<Meeting>(`/meetings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteMeeting: (id: number): Promise<void> =>
    fetchAPI<void>(`/meetings/${id}`, { method: 'DELETE' }),

  // Transcript & Intelligence
  getTranscript: (meetingId: number): Promise<Transcript> =>
    fetchAPI<Transcript>(`/meetings/${meetingId}/transcript`),

  getSummary: (meetingId: number): Promise<Summary | null> =>
    fetchAPI<Summary | null>(`/meetings/${meetingId}/summary`),

  getTopics: (meetingId: number): Promise<Topic[]> =>
    fetchAPI<Topic[]>(`/meetings/${meetingId}/topics`),

  // Action Items
  getActionItems: (meetingId: number): Promise<ActionItem[]> =>
    fetchAPI<ActionItem[]>(`/meetings/${meetingId}/action-items`),

  createActionItem: (
    meetingId: number,
    data: {
      title: string;
      description?: string;
      assignee_id?: number;
      due_date?: string;
      status?: ActionStatus;
      source_segment_id?: number;
    }
  ): Promise<ActionItem> =>
    fetchAPI<ActionItem>(`/meetings/${meetingId}/action-items`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateActionItem: (
    actionId: number,
    data: {
      title?: string;
      description?: string;
      assignee_id?: number;
      due_date?: string;
      status?: ActionStatus;
    }
  ): Promise<ActionItem> =>
    fetchAPI<ActionItem>(`/action-items/${actionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteActionItem: (actionId: number): Promise<void> =>
    fetchAPI<void>(`/action-items/${actionId}`, { method: 'DELETE' }),

  // Decisions
  getDecisions: (meetingId: number): Promise<Decision[]> =>
    fetchAPI<Decision[]>(`/meetings/${meetingId}/decisions`),

  createDecision: (
    meetingId: number,
    data: {
      decision_text: string;
      rationale?: string;
      source_segment_id?: number;
    }
  ): Promise<Decision> =>
    fetchAPI<Decision>(`/meetings/${meetingId}/decisions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteDecision: (decisionId: number): Promise<void> =>
    fetchAPI<void>(`/decisions/${decisionId}`, { method: 'DELETE' }),

  // Tags
  getTags: (): Promise<Tag[]> => fetchAPI<Tag[]>('/tags'),

  // Global Search
  globalSearch: (q: string): Promise<GlobalSearchResult[]> =>
    fetchAPI<GlobalSearchResult[]>(`/search?q=${encodeURIComponent(q)}`),
};
