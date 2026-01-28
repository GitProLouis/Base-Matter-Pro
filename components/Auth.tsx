import React, { useState } from 'react';
import { Apple, ChevronLeft, Loader2, ShieldCheck, Cpu, Zap } from 'lucide-react';

interface AuthProps {
  onAuthenticated: () => void;
  onBack: () => void;
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Auth: React.FC<AuthProps> = ({ onAuthenticated, onBack }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyLog, setVerifyLog] = useState<string>('');

  const handleLogin = (platform: string) => {
    setIsVerifying(true);
    const logs = [
      "REQUESTING_SECURE_CHANNEL",
      "HANDSHAKE_INITIATED",
      `VERIFYING_${platform.toUpperCase()}_TOKEN`,
      "TOKEN_VALIDATED",
      "SYNCING_MATTER_PROFILE",
      "ACCESS_GRANTED"
    ];

    let i = 0;
    const interval = setInterval(() => {
      setVerifyLog(logs[i]);
      i++;
      if (i === logs.length) {
        clearInterval(interval);
        setTimeout(onAuthenticated, 800);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-[210] flex flex-col p-8 font-mono overflow-hidden">
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-12 pt-6">
        <button onClick={onBack} className="p-3 glass rounded-full active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center space-x-3 glass px-4 py-2 rounded-2xl border-white/5">
           <Cpu className="w-4 h-4 text-brand" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">Gateway_Secure</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Branding Module exactly as per attachment */}
        <div className="mb-14">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.2em] font-mono flex items-center">
              <span className="mr-1.5 text-brand">•</span> KERNEL_0.2.5
            </span>
          </div>
          <h2 className="text-6xl font-black uppercase tracking-[-0.06em] leading-[0.75] text-white">
            BASE<br/><span className="text-brand">MATTER.</span>
          </h2>
          <div className="mt-8 flex items-center space-x-3 opacity-40">
            <div className="h-px w-8 bg-brand"></div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] leading-none font-mono">
              Access Portal Active
            </p>
          </div>
        </div>

        {isVerifying ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-brand animate-spin" />
              <div className="absolute inset-0 bg-brand/20 blur-2xl animate-pulse rounded-full"></div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] font-mono animate-pulse">{verifyLog}</p>
              <p className="text-[7px] text-zinc-600 uppercase font-mono mt-1 tracking-widest">Biometric Gateway Encrypted</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('google')}
              className="w-full glass py-6 rounded-[28px] border-white/5 flex items-center justify-center space-x-4 active:scale-95 transition-all hover:border-white/20 group"
            >
              <GoogleIcon className="w-5 h-5" />
              <div className="text-left">
                 <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-1 font-mono">Sync Google</p>
                 <p className="text-[7px] text-zinc-500 uppercase font-mono tracking-widest">OAuth_2.0 Gateway</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('apple')}
              className="w-full glass py-6 rounded-[28px] border-white/5 flex items-center justify-center space-x-4 active:scale-95 transition-all hover:border-white/20"
            >
              <Apple className="w-5 h-5 text-white fill-white" />
              <div className="text-left">
                 <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-1 font-mono">Sync Apple</p>
                 <p className="text-[7px] text-zinc-500 uppercase font-mono tracking-widest">Secure_Enclave Link</p>
              </div>
            </button>

            <div className="relative flex items-center py-8">
              <div className="flex-1 h-px bg-white/5"></div>
              <span className="px-4 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] font-mono">Alternative Uplink</span>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>

            <button 
              className="w-full py-5 rounded-[28px] border border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all font-mono"
            >
              Continue as Guest Protocol
            </button>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="pb-10 pt-10 text-center">
         <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
            <Zap className="w-3 h-3 text-brand/20" />
            <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
         </div>
         <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.5em] font-mono leading-relaxed">
            Data processed via Base_Kernel_v0.2.5<br/>Matter Identity Protocol 0xA4F2
         </p>
      </div>
    </div>
  );
};

export default Auth;