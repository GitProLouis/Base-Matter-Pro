import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Workout, Exercise } from '../types';
import { Play, ChevronLeft, Heart, Share2, MoreHorizontal, Pause, FastForward, Plus, CheckCircle2, Zap, Info, Box, X, Instagram, Facebook, Edit3, Check, Target, Youtube, MonitorPlay, Maximize2, Link2, Copy, CheckCircle, Download, Loader2, Settings2, Sliders, Activity, Radio, Cpu, Dumbbell, ListChecks, Search } from 'lucide-react';

interface ExerciseProgress {
  completed: boolean;
  note: string;
}

interface WorkoutDetailProps {
  workout: Workout;
  onClose: () => void;
}

type WorkoutVariant = 'Standard' | 'Beginner' | 'Advanced' | 'Quick';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.11-1.47-.17-.12-.33-.26-.5-.39v5.8c.03 3.41-2.14 6.64-5.3 7.85-2.85 1.11-6.19.46-8.38-1.74a7.92 7.92 0 01-2.14-5.58c0-3.35 2.1-6.52 5.23-7.75.84-.33 1.73-.5 2.63-.51v4.02c-.4.02-.8.11-1.17.26a3.86 3.86 0 00-2.3 3.7c.01 1.71 1.39 3.19 3.09 3.23.16.01.32.01.48 0 1.76-.11 3.14-1.63 3.11-3.39V0z"/>
  </svg>
);

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({ workout: initialWorkout, onClose }) => {
  const [activeVariant, setActiveVariant] = useState<WorkoutVariant>('Standard');
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const storageKey = `basematter_v2_progress_${initialWorkout.id}_${activeVariant}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const workout = useMemo(() => {
    const calibrated = { ...initialWorkout };
    switch (activeVariant) {
      case 'Beginner':
        calibrated.title = `${initialWorkout.title} [Lite]`;
        calibrated.exercises = initialWorkout.exercises.map(ex => ({
          ...ex,
          duration: ex.duration.includes('sec') 
            ? `${Math.max(15, Math.floor(parseInt(ex.duration) * 0.75))} sec`
            : `${Math.max(1, Math.floor(parseInt(ex.duration) * 0.75))} min`,
          description: `[Low Impact] ${ex.description}`
        }));
        break;
      case 'Advanced':
        calibrated.title = `${initialWorkout.title} [Pro]`;
        calibrated.exercises = initialWorkout.exercises.map(ex => ({
          ...ex,
          duration: ex.duration.includes('sec') 
            ? `${Math.floor(parseInt(ex.duration) * 1.5)} sec`
            : `${Math.floor(parseInt(ex.duration) * 1.5)} min`,
          description: `[Peak Intensity] ${ex.description}`
        }));
        break;
      case 'Quick':
        calibrated.title = `${initialWorkout.title} [Rapid]`;
        calibrated.exercises = initialWorkout.exercises.slice(0, Math.ceil(initialWorkout.exercises.length / 2)).map(ex => ({
          ...ex,
          duration: ex.duration.includes('sec') 
            ? `${Math.max(20, Math.floor(parseInt(ex.duration) * 0.6))} sec`
            : `${Math.max(1, Math.floor(parseInt(ex.duration) * 0.6))} min`
        }));
        break;
      default:
        break;
    }
    return calibrated;
  }, [initialWorkout, activeVariant]);

  const [exerciseProgress, setExerciseProgress] = useState<Record<number, ExerciseProgress>>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    const initialState: Record<number, ExerciseProgress> = {};
    workout.exercises.forEach((_, idx) => {
      initialState[idx] = { completed: false, note: "" };
    });
    return initialState;
  });

  const [activeTimerIdx, setActiveTimerIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Exercise | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(exerciseProgress));
  }, [exerciseProgress, storageKey]);

  const handleVariantChange = (variant: WorkoutVariant) => {
    if (variant === activeVariant) return;
    setIsRecalibrating(true);
    setTimeout(() => {
      setActiveVariant(variant);
      setIsRecalibrating(false);
    }, 800);
  };

  const parseDuration = (duration: string): number => {
    const num = parseInt(duration.match(/\d+/)?.[0] || '60');
    if (duration.toLowerCase().includes('min')) return num * 60;
    return num;
  };

  const startTimer = (idx: number) => {
    if (activeTimerIdx === idx && isTimerRunning) {
      setIsTimerRunning(false);
      return;
    }
    if (activeTimerIdx !== idx) {
      setActiveTimerIdx(idx);
      setTimeLeft(parseDuration(workout.exercises[idx].duration));
    }
    setIsTimerRunning(true);
  };

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
    setActiveTimerIdx(null);
    setTimeLeft(0);
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (activeTimerIdx !== null) toggleExercise(activeTimerIdx, true);
            stopTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, timeLeft, activeTimerIdx, stopTimer]);

  const toggleExercise = (idx: number, forceValue?: boolean) => {
    setExerciseProgress(prev => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        completed: forceValue !== undefined ? forceValue : !prev[idx].completed
      }
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async () => {
    const text = `Initiating Base Matter protocol: ${workout.title}. Efficiency: 98%. https://basematter.pro/p/${workout.id}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) { console.error(err); }
  };

  const generateProtocolCard = (): Promise<File | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      canvas.width = 1080; canvas.height = 1920;
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ccff00'; ctx.font = '900 120px Inter, sans-serif';
      ctx.fillText('BASE', 80, 200); ctx.fillText('MATTER.', 80, 320);
      ctx.strokeStyle = 'rgba(204, 255, 0, 0.3)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(80, 380); ctx.lineTo(1000, 380); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.font = '900 80px Inter, sans-serif';
      ctx.fillText(workout.title.toUpperCase(), 80, 520);
      const completed = (Object.values(exerciseProgress) as ExerciseProgress[]).filter(p => p.completed).length;
      const total = workout.exercises.length;
      const percent = total > 0 ? (completed / total) : 0;
      ctx.beginPath(); ctx.arc(540, 1100, 300, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 40; ctx.stroke();
      ctx.beginPath(); ctx.arc(540, 1100, 300, -Math.PI / 2, (-Math.PI / 2) + (Math.PI * 2 * percent));
      ctx.strokeStyle = '#ccff00'; ctx.lineWidth = 40; ctx.lineCap = 'round'; ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.font = '900 180px Inter, sans-serif';
      ctx.fillText(`${Math.round(percent * 100)}%`, 540, 1140);
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        resolve(new File([blob], 'base-matter-protocol.png', { type: 'image/png' }));
      });
    });
  };

  const shareWorkout = async (platform: string) => {
    setIsGeneratingCard(true);
    const cardFile = await generateProtocolCard();
    setIsGeneratingCard(false);
    const shareData: any = {
      title: 'Base Matter Protocol',
      text: `Initiating ${workout.title} protocol. Join the evolution.`,
      url: `https://basematter.pro/p/${workout.id}`
    };
    if (platform === 'Native' && navigator.share) {
      try {
        const nativeData = { ...shareData };
        if (cardFile && navigator.canShare && navigator.canShare({ files: [cardFile] })) nativeData.files = [cardFile];
        await navigator.share(nativeData);
        setShowShareModal(false); return;
      } catch (err) { console.log(err); }
    }
    if (platform === 'Instagram' || platform === 'TikTok') {
      if (cardFile) {
        const url = URL.createObjectURL(cardFile);
        const a = document.createElement('a'); a.href = url; a.download = 'BaseMatter_Protocol.png'; a.click();
      }
      copyToClipboard();
    } else if (platform === 'Facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
    }
    setShowShareModal(false);
  };

  const completedCount = (Object.values(exerciseProgress) as ExerciseProgress[]).filter(p => p.completed).length;

  const filteredExercises = useMemo(() => {
    return workout.exercises
      .map((ex, originalIdx) => ({ ex, originalIdx }))
      .filter(item => item.ex.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [workout.exercises, searchQuery]);

  return (
    <div className="fixed inset-0 bg-[#050505] z-[110] flex flex-col overflow-y-auto hide-scrollbar animate-in slide-in-from-bottom duration-700">
      <canvas ref={canvasRef} className="hidden" />

      {/* Visual Header */}
      <div className="relative h-[45vh] shrink-0">
        <img src={workout.image} className="w-full h-full object-cover grayscale-[0.4]" alt={workout.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center z-20">
          <button onClick={onClose} className="p-3 glass rounded-full active:scale-90 transition-transform"><ChevronLeft className="w-6 h-6" /></button>
          <div className="flex space-x-3">
            <button className="p-3 glass rounded-full"><Heart className="w-5 h-5" /></button>
            <button onClick={() => setShowShareModal(true)} className="p-3 glass rounded-full text-brand"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="absolute bottom-12 left-0 right-0 px-8">
          <div className="flex items-center space-x-2 mb-3">
            <div className="px-2 py-0.5 border border-brand/40 rounded-sm"><span className="text-[8px] font-bold text-brand uppercase tracking-[0.4em] font-mono">{workout.type} Protocol</span></div>
            <div className="px-2 py-0.5 bg-brand/10 border border-brand/20 rounded-sm"><span className="text-[8px] font-bold text-brand uppercase tracking-[0.2em] font-mono">{activeVariant} Mode</span></div>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.8] mb-2">{workout.title}</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] font-mono">Module Intensity: {activeVariant === 'Advanced' ? 'Peak' : 'Nominal'}</p>
        </div>
      </div>

      {/* Variant Selector Control */}
      <div className="px-6 py-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center space-x-3 mb-4">
          <Sliders className="w-3.5 h-3.5 text-zinc-500" />
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Intensity Calibration</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(['Beginner', 'Standard', 'Advanced', 'Quick'] as WorkoutVariant[]).map((v) => (
            <button key={v} onClick={() => handleVariantChange(v)} className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${activeVariant === v ? 'bg-brand text-black border-brand shadow-[0_0_15px_rgba(204,255,0,0.2)]' : 'glass text-zinc-600 border-white/5'}`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Tutorial Modal */}
      {selectedTutorial && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-3xl flex flex-col animate-in fade-in duration-500">
           {/* Top Info Bar */}
           <div className="p-8 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                   <span className="text-[9px] font-black text-brand uppercase tracking-widest font-mono">Streaming Demonstration Module</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{selectedTutorial.name}</h3>
              </div>
              <button onClick={() => setSelectedTutorial(null)} className="p-4 glass rounded-full active:scale-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
           </div>
           
           <div className="flex-1 px-8 flex flex-col overflow-y-auto hide-scrollbar">
              {/* Main Player Display */}
              <div className="relative aspect-video bg-zinc-900 rounded-[40px] overflow-hidden border border-white/10 group flex items-center justify-center shrink-0">
                 <img src={selectedTutorial.image} className="w-full h-full object-cover opacity-20 blur-md" alt="" />
                 <div className="absolute inset-0 bg-black/40"></div>
                 
                 {/* Player HUD */}
                 <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                    <div className="glass px-3 py-1.5 rounded-xl border-white/5 text-[8px] font-mono text-white uppercase tracking-widest flex items-center">
                       <Radio className="w-3 h-3 text-brand mr-2 animate-pulse" />
                       Matter_Uplink: 1080p@60fps
                    </div>
                    <div className="glass px-3 py-1.5 rounded-xl border-white/5 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                       ID: {Math.floor(Math.random() * 999999)}
                    </div>
                 </div>

                 <div className="relative z-10 text-center px-12">
                    <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(204,255,0,0.3)] hover:scale-110 transition-transform cursor-pointer group/play">
                       <Play className="w-10 h-10 fill-black text-black ml-1 group-hover/play:scale-110 transition-transform" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2 text-white">Initialize Visual Guide</h4>
                    <p className="text-xs text-zinc-500 font-mono">Tap to stream kinetic instructions</p>
                 </div>

                 <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                    <div className="flex space-x-4 items-center">
                       <button className="p-3 glass rounded-xl"><Pause className="w-4 h-4" /></button>
                       <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-brand w-1/4 animate-pulse"></div>
                       </div>
                       <span className="text-[10px] font-mono text-zinc-500">01:24 / 04:30</span>
                    </div>
                    <button className="p-3 glass rounded-xl"><Maximize2 className="w-4 h-4" /></button>
                 </div>
              </div>

              {/* Technical Briefing Section */}
              <div className="py-10 space-y-10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-6 rounded-[32px] border-brand/10">
                       <div className="flex items-center space-x-2 mb-3">
                          <Cpu className="w-4 h-4 text-brand" />
                          <p className="text-[9px] font-black text-brand uppercase tracking-widest font-mono">Engine Calibration</p>
                       </div>
                       <p className="text-sm font-black uppercase tracking-tight">Kinetic Precision: 98%</p>
                    </div>
                    <div className="glass p-6 rounded-[32px] border-white/5">
                       <div className="flex items-center space-x-2 mb-3">
                          <Activity className="w-4 h-4 text-zinc-500" />
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Load Factor</p>
                       </div>
                       <p className="text-sm font-black uppercase tracking-tight">Recruitment: Peak</p>
                    </div>
                 </div>

                 <div>
                    <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono mb-4 flex items-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand mr-2"></div>
                       Movement Protocol Briefing
                    </h5>
                    <p className="text-zinc-300 text-base leading-relaxed font-medium">{selectedTutorial.description}</p>
                 </div>

                 {selectedTutorial.tips && (
                    <div className="space-y-4">
                       <h5 className="text-[10px] font-black text-brand uppercase tracking-widest font-mono">Kinetic Optimization Points</h5>
                       <div className="grid gap-3">
                          {selectedTutorial.tips.map((tip, i) => (
                             <div key={i} className="glass p-5 rounded-[24px] border-white/5 flex items-start space-x-4">
                                <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                                   <span className="text-[10px] font-black text-brand">{i+1}</span>
                                </div>
                                <span className="text-sm text-zinc-400 font-medium">{tip}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 <div className="pb-20">
                    <div className="glass p-6 rounded-[32px] border-white/5">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono mb-3">Matter Acquisition Tools</p>
                       <div className="flex flex-wrap gap-2">
                          {selectedTutorial.equipment?.map((eq, i) => (
                             <span key={i} className="px-3 py-1.5 glass rounded-xl border-white/5 text-[9px] font-black uppercase tracking-tighter text-zinc-400">{eq}</span>
                          )) || <span className="text-[9px] text-zinc-600 uppercase font-mono tracking-widest italic">Standard Gear Only</span>}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Protocol Modules List */}
      <div className="px-6 py-10">
        <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500 font-mono">Evolution: Execution</h2>
            <p className="text-2xl font-black uppercase tracking-tighter mt-1">Matter Tasks</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-bold text-brand font-mono">{completedCount} / {workout.exercises.length}</span>
             <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-brand transition-all duration-1000" style={{ width: `${(completedCount / workout.exercises.length) * 100}%` }} />
             </div>
          </div>
        </div>

        {/* Exercise Search Module */}
        <div className="mb-10 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-700 group-focus-within:text-brand transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER PROTOCOLS..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:border-brand/40 transition-all font-mono"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-5 flex items-center text-zinc-700 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-16 pb-44">
          {filteredExercises.length > 0 ? filteredExercises.map(({ ex: exercise, originalIdx: idx }) => {
            const progress = exerciseProgress[idx] || { completed: false, note: "" };
            const isCompleted = progress.completed;
            const equipment = exercise.equipment || ["Standard Gear"];
            const tips = exercise.tips || ["Focus on breathing", "Control the movement"];

            return (
              <div key={`${activeVariant}-${idx}`} className="flex flex-col space-y-6 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-start space-x-6">
                  <div className="relative w-24 h-24 rounded-[28px] overflow-hidden shrink-0 cursor-pointer border border-white/5 group-hover:border-brand/40 transition-all duration-500" onClick={() => startTimer(idx)}>
                    <img src={exercise.image} className={`w-full h-full object-cover transition-all duration-700 ${isCompleted ? 'opacity-20 grayscale' : 'opacity-80 group-hover:scale-110'}`} alt="" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-brand fill-brand" />
                    </div>
                    {isCompleted && <div className="absolute inset-0 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-brand shadow-[0_0_15px_var(--brand)]" /></div>}
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 mr-2">
                        <h4 className={`font-black text-xl uppercase tracking-tighter leading-none transition-colors ${isCompleted ? 'text-zinc-700 line-through' : 'text-white'}`}>{exercise.name}</h4>
                        <p className={`text-brand text-[9px] font-bold mt-2 font-mono uppercase tracking-widest ${isCompleted ? 'opacity-40' : ''}`}>{exercise.duration}</p>
                      </div>
                      <button onClick={() => toggleExercise(idx)} className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 shrink-0 ${isCompleted ? 'bg-brand border-brand shadow-[0_0_20px_rgba(204,255,0,0.3)]' : 'bg-white/5 border-white/10 active:scale-90'}`}>
                        {isCompleted ? <Check className="w-5 h-5 text-black stroke-[4px]" /> : <Target className="w-5 h-5 text-zinc-700" />}
                      </button>
                    </div>

                    <div className="mt-4 space-y-4">
                        {/* Equipment Section */}
                        <div className="flex items-center space-x-3">
                           <div className="p-2 glass border border-white/5 rounded-xl">
                              <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
                           </div>
                           <div>
                              <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest font-mono">Tools Needed</p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                 {equipment.map((eq, i) => (
                                    <span key={i} className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">{eq}{i < equipment.length - 1 ? " •" : ""}</span>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Tips Section */}
                        <div className="flex items-start space-x-3">
                           <div className="p-2 glass border border-white/5 rounded-xl mt-1">
                              <ListChecks className="w-3.5 h-3.5 text-brand" />
                           </div>
                           <div className="flex-1">
                              <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest font-mono">Optimization Technique</p>
                              <ul className="mt-2 space-y-2">
                                 {tips.map((tip, i) => (
                                    <li key={i} className="flex items-start space-x-2 group/tip">
                                       <div className="w-1 h-1 rounded-full bg-brand/40 mt-1.5 group-hover/tip:bg-brand transition-colors"></div>
                                       <span className="text-[10px] text-zinc-500 leading-tight font-medium group-hover/tip:text-zinc-300 transition-colors">{tip}</span>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                    </div>
                    
                    {/* Watch Tutorial Trigger */}
                    <div className="mt-6">
                      <button 
                        onClick={() => setSelectedTutorial(exercise)} 
                        className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-brand transition-all group/tutorial"
                      >
                        <div className="w-8 h-8 rounded-xl glass border border-white/5 flex items-center justify-center group-hover/tutorial:border-brand/40 group-hover/tutorial:scale-110 transition-all relative">
                          <MonitorPlay className="w-4 h-4" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                        </div>
                        <span>Watch Demonstration</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-px w-full bg-white/5"></div>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-[40px] border border-white/5 font-mono">
              <Search className="w-12 h-12 text-zinc-800 mb-4 animate-pulse" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No Matching Protocol Modules</p>
              <p className="text-[8px] text-zinc-700 mt-2 uppercase">Input query does not align with active tasks</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent z-30">
        <button onClick={() => { const n = workout.exercises.findIndex((_,i)=>!exerciseProgress[i]?.completed); if(n!==-1)startTimer(n); }} className="w-full bg-brand text-black py-6 rounded-[32px] font-black text-xl uppercase tracking-tighter shadow-2xl active:scale-[0.98] transition-all hover:shadow-[0_0_40px_rgba(204,255,0,0.3)] flex items-center justify-center space-x-4">
          <Zap className="w-6 h-6 fill-black" />
          <span>Launch Protocol</span>
        </button>
      </div>

      {activeTimerIdx !== null && (
        <div className="fixed inset-0 bg-[#050505] z-[120] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 px-8 font-mono">
           <button onClick={stopTimer} className="absolute top-12 left-6 p-4 glass rounded-[24px] active:scale-90 transition-transform"><ChevronLeft className="w-6 h-6" /></button>
           <div className="text-center mb-10">
              <p className="text-brand text-[10px] font-black tracking-widest uppercase mb-4">Module Execution_Active</p>
              <h3 className="text-4xl font-black uppercase tracking-tighter text-white">{workout.exercises[activeTimerIdx!].name}</h3>
           </div>
           <h2 className="text-[160px] font-black text-white leading-none mb-16 tracking-tighter tabular-nums flex items-baseline select-none">
             {formatTime(timeLeft)}
             <span className="text-brand text-sm ml-2 animate-pulse">SEC</span>
           </h2>
           <div className="flex space-x-8 items-center">
             <button onClick={() => setTimeLeft(prev => prev + 30)} className="w-16 h-16 rounded-3xl glass flex items-center justify-center text-zinc-400 hover:text-white transition-colors"><Plus className="w-6 h-6" /></button>
             <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="w-24 h-24 bg-white text-black rounded-[40px] flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
               {isTimerRunning ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 fill-black" />}
             </button>
             <button onClick={() => { toggleExercise(activeTimerIdx!, true); stopTimer(); }} className="w-16 h-16 rounded-3xl glass flex items-center justify-center text-zinc-400 hover:text-brand transition-colors"><FastForward className="w-6 h-6" /></button>
           </div>
        </div>
      )}

      {isRecalibrating && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Settings2 className="w-16 h-16 text-brand animate-spin mb-6" />
          <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] font-mono animate-pulse">Recalibrating Biometrics...</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;