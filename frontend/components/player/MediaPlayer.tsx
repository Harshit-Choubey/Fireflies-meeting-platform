'use client';

import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { usePlayerSync } from '@/providers/PlayerSyncContext';

interface MediaPlayerProps {
  mediaUrl: string | null;
  durationSeconds: number;
}

export default function MediaPlayer({ mediaUrl, durationSeconds }: MediaPlayerProps) {
  const {
    currentTime,
    duration,
    isPlaying,
    togglePlayPause,
    seekTo,
    onTimeUpdate,
    onDurationChange,
    onPlayStateChange,
    audioRef,
  } = usePlayerSync();

  const [muted, setMuted] = React.useState(false);

  const effectiveDuration = duration || durationSeconds || 180;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seekTo(val);
  };

  const skipSeconds = (delta: number) => {
    const newTime = Math.max(0, Math.min(effectiveDuration, currentTime + delta));
    seekTo(newTime);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="bg-[#10072F] text-white px-4 py-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4 flex-shrink-0 z-30 shadow-2xl">
      {/* HTML5 Native Audio Element */}
      <audio
        ref={audioRef}
        src={mediaUrl || '/media/demo-meeting.mp3'}
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => onDurationChange(e.currentTarget.duration)}
        onPlay={() => onPlayStateChange(true)}
        onPause={() => onPlayStateChange(false)}
        onEnded={() => onPlayStateChange(false)}
        preload="metadata"
      />

      {/* Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => skipSeconds(-10)}
          title="Skip backward 10s"
          className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-[#7C4DFF] hover:bg-[#6F3FF0] text-white flex items-center justify-center shadow-lg shadow-purple-950/50 transition-all active:scale-95 flex-shrink-0"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <button
          onClick={() => skipSeconds(10)}
          title="Skip forward 10s"
          className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Timestamp & Progress Slider */}
      <div className="flex-1 flex items-center gap-3 w-full">
        <span className="text-xs font-mono text-gray-300 w-12 text-right flex-shrink-0">
          {formatTime(currentTime)}
        </span>

        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={effectiveDuration}
            step={0.1}
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#7C4DFF]"
          />
        </div>

        <span className="text-xs font-mono text-gray-400 w-12 text-left flex-shrink-0">
          {formatTime(effectiveDuration)}
        </span>
      </div>

      {/* Volume toggle */}
      <div className="flex items-center gap-2 flex-shrink-0 hidden sm:flex">
        <button
          onClick={toggleMute}
          className="p-1.5 text-gray-400 hover:text-white transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
