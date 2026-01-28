import React from 'react';
import { Calendar, Award, Zap, Activity, ChevronRight, Binary } from 'lucide-react';

const ProgramsView: React.FC = () => {
  const programs = [
    { title: 'Mechanical Overhaul', duration: '4 Weeks', metric: '94% Efficiency', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400' },
    { title: 'Neural Recruitment', duration: '2 Weeks', metric: '62% Latency', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=400' },
    { title: 'Endocrine Reset', duration: '8 Weeks', metric: '88% Optimal', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="pb-32 animate-in fade-in duration-1000">
      <div className="px-6 pt-12 pb-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
               <span className="text-[9px] font-black text-brand uppercase tracking-[0.3em] font-mono">System: Sequence Active</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Plan<br/><span className="text-brand">Matter.</span>
            </h1>
          </div>
          <button className="w-12 h-12 glass flex items-center justify-center rounded-2xl">
            <Binary className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Active Protocol Module */}
      <section className="px-6 mb-12">
        <div className="glass p-8 rounded-[40px] relative overflow-hidden group shadow-2xl border-brand/20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/5 blur-[50px] rounded-full"></div>
          <div className="flex justify-between items-start mb-6">
             <div className="px-3 py-1 bg-brand/10 border border-brand/30 rounded-full">
                <span className="text-[8px] font-black text-brand uppercase tracking-[0.3em] font-mono">Current Sequence</span>
             </div>
             <Zap className="w-5 h-5 text-brand" />
          </div>
          
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 leading-none">STRUCTURAL<br/>REINFORCEMENT</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Progression Status</p>
              <span className="text-xl font-black text-white font-mono">65%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand shadow-[0_0_10px_rgba(204,255,0,0.5)] transition-all duration-1000" style={{ width: '65%' }}></div>
            </div>
            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest text-center pt-2">Phase 02 / 03: Hypertrophy Phase</p>
          </div>
        </div>
      </section>

      {/* Protocol Library */}
      <section className="px-6">
        <h2 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] px-2 mb-6">Sequence Library</h2>
        <div className="space-y-5">
          {programs.map((p, idx) => (
            <div key={idx} className="glass p-5 rounded-[36px] flex items-center space-x-6 hover:border-brand/40 transition-all group cursor-pointer">
              <div className="w-24 h-24 rounded-[28px] overflow-hidden shrink-0 border border-white/5 relative">
                <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-lg uppercase tracking-tighter leading-tight group-hover:text-brand transition-colors">{p.title}</h4>
                <div className="mt-2 space-y-1 font-mono">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{p.duration} Cycle</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-3 h-3 text-brand" />
                    <span className="text-[9px] font-bold text-brand uppercase tracking-widest">{p.metric}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <ChevronRight className="w-5 h-5 text-zinc-600" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProgramsView;