'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TranscriptSegment } from '@/types';

interface PlayerSyncContextType {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  activeSegmentId: number | null;
  activeSegment: TranscriptSegment | null;
  segments: TranscriptSegment[];
  setSegments: (segments: TranscriptSegment[]) => void;
  seekTo: (seconds: number) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  onTimeUpdate: (seconds: number) => void;
  onDurationChange: (seconds: number) => void;
  onPlayStateChange: (playing: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerSyncContext = createContext<PlayerSyncContextType | undefined>(undefined);

export function PlayerSyncProvider({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [segments, setSegmentsState] = useState<TranscriptSegment[]>([]);
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const [activeSegment, setActiveSegment] = useState<TranscriptSegment | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Binary search to locate active transcript segment for currentTime
  const updateActiveSegment = useCallback((time: number, currentSegments: TranscriptSegment[]) => {
    if (!currentSegments || currentSegments.length === 0) {
      setActiveSegmentId(null);
      setActiveSegment(null);
      return;
    }

    // Binary search to find highest index where start_time <= time
    let low = 0;
    let high = currentSegments.length - 1;
    let foundIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (currentSegments[mid].start_time <= time) {
        foundIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (foundIndex !== -1) {
      const match = currentSegments[foundIndex];
      setActiveSegmentId(match.id);
      setActiveSegment(match);
    } else {
      setActiveSegmentId(null);
      setActiveSegment(null);
    }
  }, []);

  const setSegments = useCallback((newSegments: TranscriptSegment[]) => {
    // Ensure sorted by start_time
    const sorted = [...newSegments].sort((a, b) => a.start_time - b.start_time);
    setSegmentsState(sorted);
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = seconds;
      }
      setCurrentTime(seconds);
      updateActiveSegment(seconds, segments);
    },
    [segments, updateActiveSegment]
  );

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay policy handle
      });
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const onTimeUpdate = useCallback(
    (seconds: number) => {
      setCurrentTime(seconds);
      updateActiveSegment(seconds, segments);
    },
    [segments, updateActiveSegment]
  );

  const onDurationChange = useCallback((secs: number) => {
    setDuration(secs);
  }, []);

  const onPlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  return (
    <PlayerSyncContext.Provider
      value={{
        currentTime,
        duration,
        isPlaying,
        activeSegmentId,
        activeSegment,
        segments,
        setSegments,
        seekTo,
        play,
        pause,
        togglePlayPause,
        onTimeUpdate,
        onDurationChange,
        onPlayStateChange,
        audioRef,
      }}
    >
      {children}
    </PlayerSyncContext.Provider>
  );
}

export function usePlayerSync() {
  const context = useContext(PlayerSyncContext);
  if (!context) {
    throw new Error('usePlayerSync must be used within a PlayerSyncProvider');
  }
  return context;
}
