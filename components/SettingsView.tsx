import React, { useState } from 'react';
import { UserState } from '../types';
import { ShieldCheck, Cpu, User, Bell, Radio, Database, LogOut, ChevronRight, Activity, Zap, Loader2, Link2 } from 'lucide-react';

interface SettingsViewProps {
  userState: UserState;
  onSignOut: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userState, onSignOut }) => {
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminateLog, setTerminateLog] = useState('');
  const [toggles, setToggles] = useState({
    notifications: true,
    autoSync: false,
    highIntensity: true,
    stealthMode: false
  });

  const handleSignOut = () => {
    setIsTerminating(true);
    const logs = [
      "FLUSHING_LOCAL_BUFFER",
      "DISCONNECTING_MATTER_UPLINK",
      "WIPING_SESSION_TOKEN",
      "CORE_OFFLINE"
    ];

    let i = 0;
    const interval = setInterval(() => {
      setTerminateLog(logs[i]);
      i++;
      if (i === logs.length) {
        clearInterval(interval);
        setTimeout(onSignOut, 800);
      }
    }, 500);
  };

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-brand' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${active ? 'left-6 bg-black' : 'left-1 bg-zinc-600'}`}></div>
    </button>
  );

  if (isTerminating) {
    return (
      <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center font-mono p-10">
        <Loader2 className="w-16 h-16 text-brand animate-spin mb-6" />
        <div className="text-center">
          <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] font-mono animate-pulse">{terminateLog}</p>
          <p className="text-[7px] text-zinc-700 uppercase mt-2 tracking-widest">Secure Disconnection in Progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-36 animate-in fade-in duration-700 bg-[#050505] min-h-screen">
      {/* Header Module exactly as per attachment */}
      <div className="px-6 pt-12 pb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
             <span className="text-[11px] font-black text-brand uppercase tracking-[0.2em] font-mono flex items-center">
                <span className="mr-1.5">•</span> KERNEL_ACCESS: SECURE
             </span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-[-0.06em] leading-[0.75] text-white">
            BASE<br/><span className="text-brand">MATTER.</span>
          </h1>
        </div>
        <div className="w-12 h-12 glass flex items-center justify-center rounded-2xl border-white/5">
           <ShieldCheck className="w-6 h-6 text-brand/40" />
        </div>
      </div>

      {/* Profile Summary Card */}
      <section className="px-6 mb-10">
        <div className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu className="w-20 h-20 text-brand" />
          </div>
          <div className="flex items-center space-x-6 relative z-10">
            <div className="w-20 h-20 rounded-[28px] glass p-1 border-brand/20">
               <img src="https://i.pravatar.cc/150?u=basematter" className="w-full h-full rounded-[22px] grayscale object-cover" alt="Profile" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">RECRUIT_BM01</h3>
              <p className="text-[9px] font-mono text-brand uppercase tracking-widest font-bold font-mono">Matter_ID: 0x82A4..F12</p>
              <div className="flex items-center space-x-2 mt-2">
                 <Link2 className="w-3 h-3 text-zinc-600" />
                 <span className="text-[8px] text-zinc-600 font-mono uppercase font-mono">Uplinked via Google_Auth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Groups */}
      <div className="px-6 space-y-10">
        {/* Biometric Stats */}
        <div>
          <h2 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] px-2 mb-6 font-mono">BIOMETRIC_PROFILE</h2>
          <div className="space-y-4">
            {[
              { label: 'Matter Focus', value: userState.profile?.suggestedFocus[0] || 'Uninitialized', icon: Activity },
              { label: 'Structural Type', value: userState.profile?.bodyType || 'Pending Scan', icon: Zap },
              { label: 'System Recovery', value: '88% Optimal', icon: Radio },
            ].map((item, i) => (
              <div key={i} className="glass px-6 py-5 rounded-[28px] border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                   <item.icon className="w-4 h-4 text-zinc-600" />
                   <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest font-mono">{item.label}</p>
                      <p className="text-sm font-black uppercase tracking-tight text-white">{item.value}</p>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-800" />
              </div>
            ))}
          </div>
        </div>

        {/* System Configuration */}
        <div>
          <h2 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] px-2 mb-6 font-mono">SYSTEM_CONFIGURATION</h2>
          <div className="glass rounded-[36px] border-white/5 divide-y divide-white/5 overflow-hidden">
            {[
              { id: 'notifications', label: 'NEURAL NOTIFICATIONS', sub: 'Critical performance alerts' },
              { id: 'autoSync', label: 'BIOMETRIC AUTO-SYNC', sub: 'Real-time monitoring' },
              { id: 'highIntensity', label: 'HIGH-INTENSITY UI', sub: 'Contrast protocols' },
              { id: 'stealthMode', label: 'STEALTH UPLINK', sub: 'Obfuscate activity' },
            ].map((item) => (
              <div key={item.id} className="px-8 py-6 flex items-center justify-between">
                <div>
                   <p className="text-sm font-black uppercase tracking-tight text-white">{item.label}</p>
                   <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1 font-mono">{item.sub}</p>
                </div>
                <Toggle 
                  active={toggles[item.id as keyof typeof toggles]} 
                  onToggle={() => setToggles(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof toggles] }))} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h2 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] px-2 mb-6 font-mono">MATTER_SECURITY</h2>
          <div className="space-y-4">
            <button className="w-full glass px-8 py-6 rounded-[32px] border-white/5 flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                 <Database className="w-5 h-5 text-zinc-500" />
                 <span className="text-sm font-black uppercase tracking-tight text-white">EXPORT DATA SPLINES</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-brand transition-colors" />
            </button>
            
            <button 
              onClick={handleSignOut}
              className="w-full bg-white/[0.02] border border-red-900/20 px-8 py-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center space-x-4 text-red-500/80 group-hover:text-red-500 transition-colors">
                 <LogOut className="w-5 h-5" />
                 <span className="text-sm font-black uppercase tracking-tight">TERMINATE UPLINK</span>
              </div>
              <span className="text-[7px] font-mono text-red-900/40 uppercase font-black font-mono">Code_0x00</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 px-6 text-center">
         <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.5em] mb-4 font-mono">Base Matter Kernel v0.2.5-Release</p>
         <div className="flex items-center justify-center space-x-4">
            <div className="w-1 h-1 rounded-full bg-zinc-900"></div>
            <div className="w-1 h-1 rounded-full bg-zinc-900"></div>
            <div className="w-1 h-1 rounded-full bg-zinc-900"></div>
         </div>
      </div>
    </div>
  );
};

export default SettingsView;