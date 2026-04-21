import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { Track, TRACKS } from '../types';

interface MusicPlayerProps {
  onTrackChange: (track: Track) => void;
  currentTrack: Track;
}

export default function MusicPlayer({ onTrackChange, currentTrack }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);

  // Mock progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p + 0.5) % 100);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSkip = (direction: 'next' | 'prev') => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = TRACKS.length - 1;
    onTrackChange(TRACKS[nextIndex]);
    setProgress(0);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
      {/* Track Info */}
      <div className="flex items-center gap-4">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg"
          style={{ boxShadow: `0 0 20px ${currentTrack.color}44` }}
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Music2 className="text-white animate-pulse" size={20} />
            </div>
          )}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate text-lg">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm truncate font-medium">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex items-end justify-between h-12 gap-1 px-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying 
                ? [Math.random() * 20 + 20, Math.random() * 40 + 8, Math.random() * 20 + 20] 
                : 4
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
            className="w-1.5 rounded-full"
            style={{ backgroundColor: currentTrack.color }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: currentTrack.color }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
          <span>0:{Math.floor(progress * 2).toString().padStart(2, '0')}</span>
          <span>{currentTrack.duration}</span>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => handleSkip('prev')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform shadow-xl"
            style={{ boxShadow: `0 0 20px ${currentTrack.color}88` }}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="translate-x-0.5" fill="currentColor" />}
          </button>

          <button 
            onClick={() => handleSkip('next')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Volume & Details */}
      <div className="flex items-center gap-4 pt-2">
        <Volume2 size={16} className="text-gray-500" />
        <input 
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="flex-1 accent-white h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
