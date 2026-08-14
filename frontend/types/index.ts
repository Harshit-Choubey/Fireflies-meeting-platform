export interface Participant {
  id: number;
  name: string;
  email: string;
  avatar_color: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Meeting {
  id: number;
  title: string;
  meeting_date: string;
  duration_seconds: number;
  media_url: string | null;
  media_duration_seconds: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  tags: Tag[];
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  participant_id: number | null;
  speaker_label: string;
  text: string;
  start_time: number;
  end_time: number;
  sequence: number;
}

export interface Transcript {
  meeting_id: number;
  segments: TranscriptSegment[];
}

export interface Summary {
  id: number;
  meeting_id: number;
  overview: string;
  generated_by: string;
  generated_at: string;
}

export interface Topic {
  id: number;
  meeting_id: number;
  title: string;
  description: string | null;
  start_time: number | null;
  end_time: number | null;
  order_index: number;
}

export type ActionStatus = 'pending' | 'in_progress' | 'completed';

export interface ActionItem {
  id: number;
  meeting_id: number;
  source_segment_id: number | null;
  title: string;
  description: string | null;
  assignee: Participant | null;
  due_date: string | null;
  status: ActionStatus;
  created_at: string;
  updated_at: string;
}

export interface Decision {
  id: number;
  meeting_id: number;
  source_segment_id: number | null;
  decision_text: string;
  rationale: string | null;
  created_at: string;
}

export interface GlobalSearchResult {
  type: 'meeting' | 'participant' | 'transcript' | 'summary' | 'topic' | 'action_item' | 'decision';
  meeting_id: number;
  title: string;
  snippet: string;
  segment_id: number | null;
  timestamp: number | null;
}
