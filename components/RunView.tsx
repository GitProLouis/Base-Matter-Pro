import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, MapPin, Activity, Timer, Zap, ChevronRight, Navigation2, Crosshair, Settings, Share2, X, Volume2, VolumeX, Gauge, Info, ShieldAlert, Cpu } from 'lucide-react';

interface RunMetrics {
  distance: number; // in km
  time: number; // in seconds
  pace: string;
  heartRate: number;
  cadence: number;
}

interface RunConfig {
  acousticFeedback: boolean;
  autoHalt: boolean;
  trackingPrecision: 'Standard' | 'High' | 'Military';
  unitSystem: 'Metric' | 'Imperial';
}

const RunView: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'PAUSED' | 'FINISHED'>('IDLE');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<RunConfig>({
    acousticFeedback: true,
    autoHalt: false,
    trackingPrecision: 'High',
    unitSystem: 'Metric'
  });

  const [metrics, setMetrics] = useState<RunMetrics>({
    distance: 0,
    time: 0,
    pace: "0'00\"",
    heartRate: 72,
    cadence: 0
  });
  
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const timerRef = useRef<number | null>(null);
  const watchRef = useRef<number | null>(null);

  // Simulated GPS path for the "Base Matter" aesthetic
  const [path, setPath] = useState<{x: number, y: number}[]>([]);

  const startRun = () => {
    setStatus('RUNNING');
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: config.trackingPrecision !== 'Standard',
        timeout: 5000,
        maximumAge: 0
      };
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          // Update simulated path
          setPath(prev => [...prev, { x: (longitude % 1) * 1000, y: (latitude % 1) * 1000 }]);
        },
        (err) => console.error(err),
        options
      );
    }
  };

  const pauseRun = () => {
    setStatus('PAUSED');
  };

  const stopRun = () => {
    setStatus('FINISHED');
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
  };

  useEffect(() => {
    if (status === 'RUNNING') {
      timerRef.current = window.setInterval(() => {
        setMetrics(prev => {
          const newTime = prev.time + 1;
          const newDist = prev.distance + (0.003 + Math.random() * 0.001); // Simulated distance
          const totalMinutes = newTime / 60;
          const paceMin = newDist > 0 ? totalMinutes / newDist : 0;
          const pMin = Math.floor(paceMin);
          const pSec = Math.floor((paceMin % 1) * 60);
          
          return {
            ...prev,
            time: newTime,
            distance: newDist,
            pace: `${pMin}'${pSec.toString().padStart(2, '0')}"`,
            heartRate: 140 + Math.floor(Math.random() * 20), // Simulated active HR
            cadence: 165 + Math.floor(Math.random() * 10)
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleConfig = (key: keyof RunConfig) => {
    setConfig(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
    }));
  };

  return (
    <div className="pb-32 animate-in fade-in duration-1000 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-center relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'RUNNING' ? 'bg-brand animate-pulse' : 'bg-zinc-700'}`}></div>
            <span className="text-[9px] font-black text-brand uppercase tracking-[0.3em] font-mono">Uplink: {status}</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Kinetic<br/><span className="text-brand">Matter.</span></h1>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className={`w-12 h-12 glass flex items-center justify-center rounded-2xl border-white/5 transition-all active:scale-90 ${showSettings ? 'border-brand/40 shadow-[0_0_20px_rgba(204,255,0,0.1)]' : ''}`}
        >
          <Settings className={`w-5 h-5 transition-transform duration-500 ${status === 'RUNNING' ? 'animate-spin-slow' : ''} ${showSettings ? 'text-brand rotate-90' : 'text-zinc-500'}`} />
        </button>
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl animate-in fade-in slide-in-from-right duration-500 font-mono">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ccff00 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="p-8 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
                <Cpu className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Kinetic Config</h2>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest">System_Protocol_v2.4</p>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="p-3 glass rounded-full hover:bg-white/10 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-10 overflow-y-auto max-h-[80vh] hide-scrollbar">
            {/* Audio Section */}
            <div>
              <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                <Volume2 className="w-3 h-3 mr-2" /> Acoustic Core
              </h3>
              <button 
                onClick={() => toggleConfig('acousticFeedback')}
                className="w-full glass p-6 rounded-[32px] flex items-center justify-between border-white/5 group active:scale-[0.98] transition-all"
              >
                <div className="text-left">
                  <p className="text-sm font-black uppercase tracking-tight text-white group-hover:text-brand transition-colors">Voice Feedback</p>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1">Status metrics via synthetic uplink</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${config.acousticFeedback ? 'bg-brand' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${config.acousticFeedback ? 'left-7 bg-black' : 'left-1 bg-zinc-600'}`}></div>
                </div>
              </button>
            </div>

            {/* Automation Section */}
            <div>
              <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                <Gauge className="w-3 h-3 mr-2" /> Automation Protocols
              </h3>
              <button 
                onClick={() => toggleConfig('autoHalt')}
                className="w-full glass p-6 rounded-[32px] flex items-center justify-between border-white/5 group active:scale-[0.98] transition-all"
              >
                <div className="text-left">
                  <p className="text-sm font-black uppercase tracking-tight text-white group-hover:text-brand transition-colors">Kinetic Auto-Halt</p>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1">Pause session when motion is undetected</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${config.autoHalt ? 'bg-brand' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${config.autoHalt ? 'left-7 bg-black' : 'left-1 bg-zinc-600'}`}></div>
                </div>
              </button>
            </div>

            {/* Precision Section */}
            <div>
              <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                <Crosshair className="w-3 h-3 mr-2" /> Uplink Resolution
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(['Standard', 'High', 'Military'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfig(prev => ({ ...prev, trackingPrecision: level }))}
                    className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                      config.trackingPrecision === level 
                        ? 'bg-brand text-black border-brand shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
                        : 'glass text-zinc-500 border-white/5'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-start space-x-2 px-2">
                <ShieldAlert className="w-3 h-3 text-zinc-700 mt-0.5" />
                <p className="text-[7px] text-zinc-700 uppercase leading-tight tracking-wider">Higher resolution increases metabolic load on localized hardware battery cells.</p>
              </div>
            </div>

            {/* Unit Section */}
            <div>
              <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                <Info className="w-3 h-3 mr-2" /> Data Formatting
              </h3>
              <div className="flex glass p-2 rounded-[24px] border-white/5">
                {(['Metric', 'Imperial'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setConfig(prev => ({ ...prev, unitSystem: unit }))}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      config.unitSystem === unit 
                        ? 'bg-white/10 text-white' 
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-8 right-8">
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-5 bg-brand text-black rounded-[24px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
            >
              Commit Configuration
            </button>
          </div>
        </div>
      )}

      {/* Main Metrics View */}
      <section className="px-6 mb-8 relative z-10">
        <div className="text-center py-12">
          <p className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">Total Displacement</p>
          <div className="flex items-baseline justify-center space-x-2">
            <h2 className="text-8xl font-black tracking-tighter tabular-nums">{metrics.distance.toFixed(2)}</h2>
            <span className="text-brand font-black text-2xl uppercase italic">{config.unitSystem === 'Metric' ? 'KM' : 'MI'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-[32px] border-white/5">
            <div className="flex items-center space-x-2 mb-2">
              <Timer className="w-4 h-4 text-zinc-500" />
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest font-mono">Duration</span>
            </div>
            <p className="text-3xl font-black font-mono tracking-tighter">{formatTime(metrics.time)}</p>
          </div>
          <div className="glass p-6 rounded-[32px] border-white/5">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-brand" />
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest font-mono">Avg Pace</span>
            </div>
            <p className="text-3xl font-black font-mono tracking-tighter text-brand">{metrics.pace}</p>
          </div>
        </div>
      </section>

      {/* Map & Live Stats */}
      <section className="px-6 mb-10 relative z-10">
        <div className="relative aspect-[4/3] glass rounded-[40px] overflow-hidden border border-white/5 group">
          {/* Simulated Technical Map */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.4194,37.7749,12/400x300?access_token=YOUR_TOKEN')] bg-cover grayscale contrast-125"></div>
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ccff00 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', opacity: 0.1 }}></div>
          
          {/* Animated Route Line (Simulated) */}
          <svg className="absolute inset-0 w-full h-full p-10 opacity-60">
            <polyline 
              points={path.map(p => `${p.x % 300},${p.y % 200}`).join(' ')} 
              fill="none" 
              stroke="#ccff00" 
              strokeWidth="3" 
              strokeLinejoin="round" 
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]"
            />
            {location && <circle cx="150" cy="100" r="6" fill="#ccff00" className="animate-pulse" />}
          </svg>

          {/* UI Overlays */}
          <div className="absolute top-6 left-6 flex items-center space-x-2 glass-dark px-3 py-1.5 rounded-xl border border-white/10">
            <Navigation2 className="w-3 h-3 text-brand fill-brand rotate-45" />
            <span className="text-[8px] font-mono font-bold text-white uppercase tracking-widest">Tracking_Live</span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
             <div className="space-y-2">
                <div className="flex items-center space-x-3">
                   <div className={`w-2 h-2 rounded-full ${config.trackingPrecision === 'Military' ? 'bg-red-500 animate-ping' : 'bg-brand animate-ping'}`}></div>
                   <div className="glass px-2 py-1 rounded-md text-[7px] font-mono text-zinc-400">SIGNAL: {config.trackingPrecision === 'Military' ? 'ULTRA' : 'STABLE'} (98%)</div>
                </div>
                <div className="glass px-3 py-2 rounded-2xl border-white/10 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-xl font-black font-mono tracking-tighter">{metrics.heartRate}</span>
                    <span className="text-[7px] font-mono text-zinc-500 uppercase mt-1">BPM</span>
                  </div>
                  <div className="w-px h-6 bg-white/5"></div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-brand" />
                    <span className="text-xl font-black font-mono tracking-tighter">{metrics.cadence}</span>
                    <span className="text-[7px] font-mono text-zinc-500 uppercase mt-1">SPM</span>
                  </div>
                </div>
             </div>
             <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-brand/20 active:scale-95 transition-transform">
               <Crosshair className="w-5 h-5 text-brand" />
             </button>
          </div>
        </div>
      </section>

      {/* Control Module */}
      <div className="fixed bottom-32 left-0 right-0 px-8 flex justify-center items-center space-x-8 z-20">
        {status === 'IDLE' ? (
          <button 
            onClick={startRun}
            className="w-24 h-24 bg-brand rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(204,255,0,0.3)] active:scale-95 transition-all group"
          >
            <Play className="w-10 h-10 text-black fill-black" />
          </button>
        ) : status === 'RUNNING' ? (
          <>
            <button 
              onClick={pauseRun}
              className="w-20 h-20 glass rounded-full flex items-center justify-center border-white/10 active:scale-95 transition-all"
            >
              <Pause className="w-8 h-8 text-white fill-white" />
            </button>
          </>
        ) : status === 'PAUSED' ? (
          <div className="flex items-center space-x-8">
            <button 
              onClick={startRun}
              className="w-24 h-24 bg-brand rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(204,255,0,0.3)] active:scale-95 transition-all"
            >
              <Play className="w-10 h-10 text-black fill-black" />
            </button>
            <button 
              onDoubleClick={stopRun} // Long press or double click to prevent accident
              onClick={() => alert("Double tap to finalize sequence.")}
              className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-red-500/30 text-red-500 active:scale-95 transition-all"
            >
              <Square className="w-8 h-8 fill-red-500" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => {
              setStatus('IDLE');
              setMetrics({ distance: 0, time: 0, pace: "0'00\"", heartRate: 72, cadence: 0 });
              setPath([]);
            }}
            className="px-10 py-5 bg-brand text-black rounded-[24px] font-black uppercase tracking-widest flex items-center space-x-3 active:scale-95 transition-all shadow-xl"
          >
            <Share2 className="w-5 h-5" />
            <span>Sync Sequence</span>
          </button>
        )}
      </div>

      {status === 'FINISHED' && (
        <div className="px-6 animate-in slide-in-from-bottom duration-500 relative z-10">
           <div className="glass p-6 rounded-[32px] border-brand/20 shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-tighter text-brand mb-4">Sequence Logged</h3>
              <p className="text-xs text-zinc-400 font-mono mb-6 leading-relaxed uppercase">
                 matter successfully displaced. biometric synchronization complete. efficiency score: 94.2%
              </p>
              <div className="flex space-x-3">
                 <button className="flex-1 py-4 glass rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-500">View Splines</button>
                 <button className="flex-1 py-4 glass rounded-2xl text-[9px] font-black uppercase tracking-widest text-brand border-brand/30">Broadcast Result</button>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default RunView;