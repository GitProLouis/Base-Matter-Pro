import React from 'react';
import { Play, User, Users, Search, Activity, ChevronRight } from 'lucide-react';

const ClassesView: React.FC = () => {
  return (
    <div className="pb-32 animate-in fade-in duration-1000">
      <div className="px-6 pt-12 pb-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
               <span className="text-[9px] font-black text-brand uppercase tracking-[0.3em] font-mono">Live Session: active</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Stream<br/><span className="text-brand">Matter.</span>
            </h1>
          </div>
          <button className="w-12 h-12 glass flex items-center justify-center rounded-2xl">
            <Search className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Hero: Featured Live Session */}
      <section className="px-6 mb-12">
        <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden group shadow-2xl border border-white/5">
          <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" alt="Live class" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          
          <div className="absolute top-6 left-6 flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
            <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em] font-mono">LIVE_STREAM</span>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none">PULSE RE-ENGINEERING</h3>
            <div className="flex items-center justify-between">
               <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest flex items-center">
                <Users className="w-3 h-3 mr-2 text-brand" /> 842 RECRUITS ACTIVE
              </p>
              <button className="bg-brand text-black w-12 h-12 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
                <Play className="w-5 h-5 fill-black" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Categories */}
      <section className="px-6 mb-12">
        <h2 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] px-2 mb-6">Archive Modules</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Mechanical', count: '142', metric: 'Force' },
            { name: 'Metabolic', count: '85', metric: 'VO2' },
            { name: 'Structural', count: '210', metric: 'ROM' },
            { name: 'Recovery', count: '42', metric: 'Sleep' },
          ].map((cat) => (
            <div key={cat.name} className="glass p-6 rounded-[32px] hover:border-brand/40 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-brand" />
                 </div>
                 <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-brand transition-colors" />
              </div>
              <h4 className="font-black uppercase tracking-tighter text-lg">{cat.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                 <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{cat.count} Units</span>
                 <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                 <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-widest">{cat.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Optimization Coaches */}
      <section className="px-6">
        <h2 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] px-2 mb-6">Matter Specialists</h2>
        <div className="flex space-x-6 overflow-x-auto hide-scrollbar pb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center min-w-[84px] group">
              <div className="relative w-20 h-20 rounded-[28px] glass p-1.5 mb-3 group-hover:border-brand/30 transition-all">
                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-full h-full rounded-[22px] object-cover grayscale" alt="Specialist" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand rounded-full border-4 border-[#050505] flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">Spec-0{i}</span>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Bio-Lead</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClassesView;