import React from 'react';
import { Zap, ChevronRight, Activity, ShieldCheck } from 'lucide-react';

interface LandingProps {
  onInitialize: () => void;
}

const Landing: React.FC<LandingProps> = ({ onInitialize }) => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[200] flex flex-col items-center justify-between p-10 overflow-hidden font-mono">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ccff00]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ccff00]/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ccff00 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Top Meta Info */}
      <div className="relative w-full flex justify-between items-start pt-6">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-black text-brand uppercase tracking-[0.2em] font-mono flex items-center">
            <span className="mr-1.5 text-brand">•</span> KERNEL_0.2.5
          </span>
        </div>
        <ShieldCheck className="w-5 h-5 text-zinc-800" />
      </div>

      {/* Primary Brand Block exactly as per attachment */}
      <div className="relative text-left w-full max-w-[280px] mx-auto">
        <div className="mb-12">
          <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.15)]">
            <Zap className="w-8 h-8 text-black fill-black" />
          </div>
        </div>
        <h1 className="text-7xl font-black uppercase tracking-[-0.06em] leading-[0.75] text-white">
          BASE<br/><span className="text-brand">MATTER.</span>
        </h1>
        <p className="mt-8 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.5em] leading-relaxed">
          Human Optimization Engine
        </p>
      </div>

      {/* Bottom Action Area */}
      <div className="relative w-full space-y-12 pb-10">
        <div className="space-y-6 flex flex-col items-center">
          <div className="flex items-center space-x-4 w-full px-2 opacity-40 max-w-[320px]">
            <Activity className="w-4 h-4 text-brand" />
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-mono">STABLE_BUILD</span>
          </div>
          
          <button 
            onClick={onInitialize}
            className="w-full max-w-[280px] bg-brand text-black py-4.5 rounded-[24px] font-black text-base uppercase tracking-tighter flex items-center justify-center space-x-3 shadow-[0_12px_40px_rgba(204,255,0,0.12)] active:scale-95 transition-all group border border-brand/20"
          >
            <span>Initialize Access</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[8px] text-center text-zinc-700 font-bold uppercase tracking-widest leading-relaxed font-mono">
          Data processed via Base_Kernel_v0.2.5<br/>Matter Identity Protocol 0xA4F2
        </p>
      </div>
    </div>
  );
};

export default Landing;