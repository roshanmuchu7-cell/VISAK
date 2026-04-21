import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Trophy, Music, Zap, Terminal } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS, Track } from './types';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-cyan/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-magenta/10 blur-[120px] rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grain-y.com/assets/img/grain-dark.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
             <Zap className="text-neon-cyan" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase font-mono italic">
              Neon Beats & <span className="text-neon-magenta">Bites</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">System Rev: 2.0.4</p>
          </div>
        </div>

        <div className="flex gap-8 group">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-gray-500 font-mono uppercase">Current Bitrate</span>
             <span className="text-sm font-mono text-neon-cyan neon-glow-cyan">1411 KBPS</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-gray-500 font-mono uppercase">Global Rank</span>
             <span className="text-sm font-mono text-neon-magenta neon-glow-magenta">#001</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_450px_400px] xl:grid-cols-[300px_1fr_350px] gap-8 p-8 max-w-[1920px] mx-auto w-full h-[calc(100vh-88px)] overflow-hidden">
        
        {/* Left Sidebar: System Info / Playlist */}
        <div className="hidden xl:flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
          <section className="space-y-4">
             <h2 className="text-xs font-mono text-gray-500 flex items-center gap-2">
               <Activity size={14} /> SYSTEM_STATUS
             </h2>
             <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 italic">CPU_LOAD</span>
                  <span className="text-neon-cyan">24%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['20%', '40%', '24%'] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-full bg-neon-cyan" 
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-400 italic">TEMP</span>
                  <span className="text-neon-magenta">42°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 italic">LATENCY</span>
                  <span className="text-neon-cyan">12ms</span>
                </div>
             </div>
          </section>

          <section className="space-y-4 flex-1">
             <h2 className="text-xs font-mono text-gray-500 flex items-center gap-2">
                <Music size={14} /> AI_LIBRARY
             </h2>
             <div className="space-y-2">
                {TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setCurrentTrack(track)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                      currentTrack.id === track.id 
                        ? 'bg-white/10 border border-white/20' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded shrink-0 overflow-hidden">
                       <img src={track.coverUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                       <div className="text-xs font-bold truncate">{track.title}</div>
                       <div className="text-[10px] text-gray-500 truncate">{track.artist}</div>
                    </div>
                  </button>
                ))}
             </div>
          </section>
        </div>

        {/* Center: Snake Game */}
        <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-white/20 select-none">
             MODULE::GAME_CORE.v1
          </div>
          
          <SnakeGame 
            onScoreChange={handleScoreChange} 
            primaryColor={currentTrack.color} 
          />
        </div>

        {/* Right Sidebar: Social & Stats / Player */}
        <div className="flex flex-col gap-6 overflow-y-auto pl-2 custom-scrollbar">
          <section className="space-y-4">
            <h2 className="text-xs font-mono text-gray-500 flex items-center gap-2 uppercase tracking-widest">
               <Trophy size={14} /> Record_Log
            </h2>
            <div className="p-6 bg-gradient-to-br from-neon-cyan/20 to-transparent border border-neon-cyan/20 rounded-2xl flex flex-col items-center shadow-[0_0_40px_rgba(0,204,255,0.05)]">
              <span className="text-[10px] text-neon-cyan font-mono uppercase mb-1">Session High</span>
              <span className="text-4xl font-bold font-mono tracking-tighter tabular-nums neon-glow-cyan text-neon-cyan">
                {highScore.toString().padStart(5, '0')}
              </span>
            </div>
          </section>

          <section className="space-y-4">
             <h2 className="text-xs font-mono text-gray-500 flex items-center gap-2 uppercase tracking-widest">
                <Music size={14} /> Remote_Audio_Unit
             </h2>
             <MusicPlayer 
               currentTrack={currentTrack} 
               onTrackChange={setCurrentTrack} 
             />
          </section>

          <section className="space-y-4 mt-auto">
             <div className="p-4 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal size={14} className="text-gray-500" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Live Console</span>
                </div>
                <div className="font-mono text-[10px] text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                     <span className="text-green-500">[OK]</span> <span>Audio driver initialized</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-neon-cyan">[LOAD]</span> <span>Game grid 20x20 ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-neon-magenta">[AUTH]</span> <span>Pilot verified: {currentTrack.artist}</span>
                  </div>
                  <motion.div 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1 h-3 bg-white ml-0.5 inline-block"
                  />
                </div>
             </div>
          </section>
        </div>
      </main>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

