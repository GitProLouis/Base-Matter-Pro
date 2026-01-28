import React, { useState, useEffect, useRef } from 'react';
import { UserState, Workout, AnalysisResult } from '../types';
import { Play, Flame, Timer, ScanFace, Search, Activity, ChevronRight, Zap, Music, Cpu, MessageSquare, Send, X, Music2, Apple, Pause, FastForward, Loader2, Link2, ShieldCheck, RefreshCcw } from 'lucide-react';
import WorkoutDetail from './WorkoutDetail';
import { analyzeGoals, generateMusicRecommendation } from '../services/geminiService';

interface DashboardProps {
  userState: UserState;
  onScanRequest: () => void;
}

const CATEGORIES = ['All', 'Cardio', 'Strength', 'Flexibility'];

const Dashboard: React.FC<DashboardProps> = ({ userState, onScanRequest }) => {
  const { profile, currentWorkouts } = userState;
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showAILayer, setShowAILayer] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Music State
  const [activeMusicService, setActiveMusicService] = useState<'spotify' | 'apple' | null>(null);
  const [isSyncingMusic, setIsSyncingMusic] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(30);
  const [currentTrack, setCurrentTrack] = useState<{track: string, artist: string, bpm: number}>({
    track: "MATTER_PHASE_01",
    artist: "PROTOCOL_ARCHITECT",
    bpm: 128
  });

  const filteredWorkouts = currentWorkouts.filter(w => 
    activeCategory === 'All' || w.type.toLowerCase() === activeCategory.toLowerCase()
  );

  // Simulated Track Progression
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTrackProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSyncMusic = (service: 'spotify' | 'apple') => {
    setIsSyncingMusic(true);
    const statuses = [
      "ESTABLISHING_UPLINK",
      "AUTHORIZING_OAUTH_2.0",
      "EXCHANGING_HANDSHAKE_TOKENS",
      "INDEXING_LOCAL_BUFFER",
      "SYNC_COMPLETE"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setSyncStatus(statuses[i]);
      i++;
      if (i === statuses.length) {
        clearInterval(interval);
        setTimeout(() => {
          setActiveMusicService(service);
          setIsSyncingMusic(false);
          setIsPlaying(true);
          // Initial AI recommendation
          fetchNewRecommendation();
        }, 800);
      }
    }, 1200);
  };

  const fetchNewRecommendation = async () => {
    try {
      const rec = await generateMusicRecommendation(
        selectedWorkout?.title || "Passive State",
        selectedWorkout?.type || "General"
      );
      setCurrentTrack(rec);
    } catch (e) {
      console.error("Music rec error", e);
    }
  };

  const handleAIAnalysis = async () => {
    if (!aiQuery.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeGoals(aiQuery, profile);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="pb-36 animate-in fade-in duration-700 bg-[#050505]">
      {selectedWorkout && (
        <WorkoutDetail 
          workout={selectedWorkout} 
          onClose={() => setSelectedWorkout(null)} 
        />
      )}

      {/* Header Module exactly as per attachment */}
      <div className="px-5 pt-10 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.2em] font-mono flex items-center">
              <span className="mr-1.5 text-brand">•</span> KERNEL_0.2.5
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-[-0.06em] leading-[0.75] text-white">
            BASE<br/><span className="text-brand">MATTER.</span>
          </h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAILayer(true)}
            className="w-10 h-10 glass flex items-center justify-center rounded-xl border-brand/20 shadow-brand/10 shadow-lg"
          >
            <Cpu className="w-5 h-5 text-brand" />
          </button>
          <div className="w-10 h-10 glass flex items-center justify-center rounded-xl">
            <Activity className="w-5 h-5 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Metabolic Status Nodes */}
      <div className="px-5 mb-8 overflow-x-auto hide-scrollbar flex space-x-3">
        {[
          { label: 'HRV', value: '74ms', trend: '+4%', status: 'Stable' },
          { label: 'RECOVERY', value: '88%', trend: 'Opt', status: 'Peaking' },
          { label: 'CAL/H', value: '112', trend: '-2%', status: 'Low' },
          { label: 'LOAD', value: '0.8', trend: 'Base', status: 'Primed' },
        ].map((node, i) => (
          <div key={i} className="min-w-[100px] glass p-3 rounded-2xl border border-white/5 flex flex-col justify-between">
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest font-mono">{node.label}</p>
            <h4 className="text-lg font-black tracking-tighter text-white my-1">{node.value}</h4>
            <div className="flex justify-between items-center">
              <span className="text-[6px] font-mono text-brand">{node.trend}</span>
              <span className="text-[6px] font-mono text-zinc-500 uppercase">{node.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Intelligence Access */}
      <section className="px-5 mb-8">
        <button 
          onClick={() => setShowAILayer(true)}
          className="w-full glass p-5 rounded-[28px] flex items-center space-x-4 border-brand/10 hover:border-brand/30 transition-all text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-3xl rounded-full group-hover:bg-brand/10 transition-all"></div>
          <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center border border-brand/20">
            <MessageSquare className="w-6 h-6 text-brand" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black uppercase tracking-tighter text-white">CENTRAL INTELLIGENCE</h3>
            <p className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-widest mt-0.5">Ask performance analysis</p>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700" />
        </button>
      </section>

      {/* Audio Uplink - Music Integration Layer */}
      <section className="px-5 mb-10">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">Audio Uplink</h2>
          {activeMusicService && (
            <div className="flex items-center space-x-2">
               <div className="w-1 h-1 rounded-full bg-brand animate-ping"></div>
               <span className="text-[7px] font-mono text-brand uppercase">Synchronized</span>
            </div>
          )}
        </div>
        
        <div className="glass rounded-[32px] p-6 border-white/5 relative overflow-hidden">
          {isSyncingMusic ? (
            <div className="flex flex-col items-center py-4 space-y-4">
               <div className="w-12 h-12 relative">
                  <Loader2 className="w-full h-full text-brand animate-spin" />
                  <Link2 className="absolute inset-0 m-auto w-4 h-4 text-brand" />
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black text-brand uppercase tracking-[0.4em] font-mono animate-pulse">{syncStatus}</p>
                  <p className="text-[7px] text-zinc-600 uppercase font-mono mt-1">Encrypted Gateway Active</p>
               </div>
            </div>
          ) : !activeMusicService ? (
            <div className="flex flex-col items-center py-2">
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] font-mono mb-6 text-center">Architect kinetic environment</p>
              <div className="flex space-x-3 w-full">
                <button 
                  onClick={() => handleSyncMusic('spotify')}
                  className="flex-1 glass p-5 rounded-3xl flex flex-col items-center group active:scale-95 transition-all border-white/5 hover:border-[#1DB954]/30"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center mb-3 group-hover:bg-[#1DB954]/20 transition-colors">
                    <Music2 className="w-6 h-6 text-[#1DB954]" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Spotify Sync</span>
                </button>
                <button 
                  onClick={() => handleSyncMusic('apple')}
                  className="flex-1 glass p-5 rounded-3xl flex flex-col items-center group active:scale-95 transition-all border-white/5 hover:border-white/30"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Apple Sync</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 shrink-0">
                  <div className="w-full h-full bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
                    <img 
                      src={`https://picsum.photos/200?sig=${currentTrack.bpm}`} 
                      className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-60' : 'opacity-20 grayscale'}`} 
                      alt="Album art" 
                    />
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex items-end space-x-1 h-6">
                        {[0.4, 0.8, 0.5, 0.9, 0.3].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-brand animate-wave" 
                            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.15}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                     {activeMusicService === 'spotify' ? <Music2 className="w-3 h-3 text-[#1DB954]" /> : <Apple className="w-3 h-3 text-white" />}
                     <span className="text-[8px] font-mono text-brand uppercase tracking-widest font-bold font-mono">Uplink: {currentTrack.bpm} BPM</span>
                  </div>
                  <h4 className="text-base font-black text-white truncate uppercase tracking-tighter leading-tight">{currentTrack.track}</h4>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest truncate">{currentTrack.artist}</p>
                </div>

                <div className="flex flex-col space-y-2">
                   <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                   >
                     {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                   </button>
                   <button 
                    onClick={fetchNewRecommendation}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                   >
                     <FastForward className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Technical Scrubber */}
              <div className="space-y-2">
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute inset-y-0 left-0 bg-brand transition-all duration-1000 ease-linear shadow-[0_0_10px_var(--brand)]" 
                      style={{ width: `${trackProgress}%` }}
                    />
                 </div>
                 <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 uppercase tracking-widest font-mono">
                    <span>Matter_Phase: {Math.floor(trackProgress)}%</span>
                    <button onClick={() => setActiveMusicService(null)} className="hover:text-red-500 flex items-center space-x-1">
                       <RefreshCcw className="w-2.5 h-2.5" />
                       <span>Terminate Sync</span>
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Biometric Sync Module */}
      {profile ? (
        <section className="px-5 mb-8">
          <div className="glass p-5 rounded-[32px] relative overflow-hidden group border-white/10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em] font-mono">Biometric Signal: Synced</p>
              <span className="text-[14px] font-black text-brand font-mono leading-none">98.2%</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden">
                <div className="w-full h-full opacity-50 bg-[radial-gradient(circle_at_center,_var(--brand)_0%,_transparent_70%)]"></div>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-white leading-tight">{profile.bodyType}</h3>
                <p className="text-[9px] text-zinc-500 font-medium uppercase mt-0.5 tracking-wider font-mono">Protocol: {profile.suggestedFocus[0]}</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-5 mb-8">
          <button 
            onClick={onScanRequest}
            className="w-full bg-brand p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(204,255,0,0.15)]"
          >
            <div className="text-left">
              <h3 className="text-xl font-black uppercase tracking-tighter text-black leading-none mb-1">Initialize Scan</h3>
              <p className="text-black/60 text-[8px] font-bold uppercase tracking-widest font-mono">Map Structural Matter</p>
            </div>
            <div className="bg-black w-12 h-12 rounded-xl flex items-center justify-center">
              <ScanFace className="w-6 h-6 text-brand" />
            </div>
          </button>
        </section>
      )}

      {/* Protocol Selection Module */}
      <div className="px-5 mb-6 flex space-x-6 overflow-x-auto hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all relative pb-2 shrink-0 font-mono ${
              activeCategory === cat ? 'text-brand' : 'text-zinc-600'
            }`}
          >
            {cat}
            {activeCategory === cat && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      <section className="px-5 space-y-4">
        <h2 className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] px-2">Active Protocols</h2>
        {filteredWorkouts.map((w) => (
          <button 
            key={w.id}
            onClick={() => setSelectedWorkout(w)}
            className="w-full glass rounded-[28px] flex items-center p-4 text-left group hover:border-brand/40 transition-all duration-300 border-white/5"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-black/40">
              <img src={w.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60" alt="" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-4 h-4 text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex-1 ml-4 overflow-hidden">
              <h4 className="font-black uppercase tracking-tighter text-base leading-tight truncate group-hover:text-brand transition-colors">{w.title}</h4>
              <div className="flex items-center space-x-3 mt-1.5 font-mono">
                <div className="flex items-center space-x-1">
                  <Timer className="w-2.5 h-2.5 text-zinc-500" />
                  <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">{w.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-2.5 h-2.5 text-brand" />
                  <span className="text-[7px] font-bold text-brand uppercase tracking-widest">{w.type}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-brand transition-colors ml-2" />
          </button>
        ))}
      </section>

      {/* AI Intelligence Layer */}
      {showAILayer && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 font-mono">
          <div className="p-6 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center space-x-3">
              <Cpu className="w-6 h-6 text-brand" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">CENTRAL INTELLIGENCE</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                  <span className="text-[8px] text-zinc-500 uppercase font-mono">Analysis_Engine v2.1</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowAILayer(false)} className="p-3 glass rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
            {!analysisResult && !isAnalyzing ? (
              <div className="space-y-6 pt-10">
                <div className="glass p-6 rounded-[32px] border-brand/10">
                  <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-tighter font-mono">
                    I am the Central Performance Intelligence. I analyze biometric matter to optimize physiological efficiency. State target query.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest px-2 font-mono">Preset Protocols</p>
                  {[
                    "Analyze hypertrophy readiness",
                    "Simulate metabolic response",
                    "Optimize recovery split",
                    "Predict structural breakdown"
                  ].map((preset, i) => (
                    <button 
                      key={i}
                      onClick={() => { setAiQuery(preset); }}
                      className="glass p-4 rounded-2xl text-[10px] text-left hover:border-brand/40 hover:text-brand transition-all text-zinc-500 font-mono"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="w-20 h-20 relative">
                  <div className="absolute inset-0 border-2 border-brand/20 rounded-full"></div>
                  <div className="absolute inset-0 border-t-2 border-brand rounded-full animate-spin"></div>
                  <div className="absolute inset-0 bg-brand/10 blur-2xl animate-pulse rounded-full"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand animate-pulse font-mono">Running Neural Simulation</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass p-6 rounded-[32px] border-brand/30 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 text-right">
                      <div className="text-[24px] font-black text-brand font-mono">{analysisResult?.readiness}%</div>
                      <p className="text-[7px] text-zinc-600 uppercase font-mono">READINESS</p>
                   </div>
                   <h3 className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-4 font-mono">Analysis Insights</h3>
                   <p className="text-sm text-white leading-relaxed mb-6 font-mono font-bold uppercase tracking-tighter">{analysisResult?.insight}</p>
                   
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 font-mono">Recommendation</h3>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-xs text-zinc-300 leading-relaxed font-mono">{analysisResult?.recommendation}</p>
                   </div>

                   <button 
                    onClick={() => setAnalysisResult(null)}
                    className="w-full mt-8 py-4 border border-zinc-800 rounded-2xl text-[10px] uppercase font-black text-zinc-600 hover:text-white hover:border-white/20 transition-all font-mono"
                   >
                     Reset Kernel
                   </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#050505] border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIAnalysis()}
                placeholder="INPUT PERFORMANCE QUERY..."
                className="w-full bg-zinc-900 border border-white/5 rounded-[24px] py-5 px-6 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand/40 transition-all uppercase font-mono font-bold"
              />
              <button 
                onClick={handleAIAnalysis}
                disabled={!aiQuery.trim() || isAnalyzing}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"
              >
                <Send className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;