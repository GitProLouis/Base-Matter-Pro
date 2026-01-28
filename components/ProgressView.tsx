import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Activity, Zap, Target, TrendingUp, BarChart3, ChevronRight, Download, RefreshCw, FileText, ArrowUpRight, ArrowDownRight, Target as GoalIcon, ZoomIn, ZoomOut, ChevronLeft } from 'lucide-react';

interface CompositionMetric {
  metric: string;
  value: number;
  unit: string;
  previousValue: number;
  goal: number;
  status: string;
  color: string;
}

// Generate more historical data for zoom/pan demonstration
const generateHistoricalData = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const base = 40 + Math.sin(i / 3) * 20 + (i / count) * 30;
    return Math.max(10, Math.min(100, base + (Math.random() - 0.5) * 10));
  });
};

const ProgressView: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'none' | 'previous' | 'goal'>('none');

  // Zoom and Pan State
  const fullData = useMemo(() => generateHistoricalData(40), []);
  const [viewWindow, setViewWindow] = useState({ start: 30, size: 10 }); // Start index and number of visible bars
  
  const visibleData = useMemo(() => {
    return fullData.slice(viewWindow.start, viewWindow.start + viewWindow.size);
  }, [fullData, viewWindow]);

  const handleZoom = (delta: number) => {
    setViewWindow(prev => {
      const newSize = Math.max(5, Math.min(prev.size + delta, fullData.length));
      const newStart = Math.min(prev.start, fullData.length - newSize);
      return { start: Math.max(0, newStart), size: newSize };
    });
  };

  const handlePan = (direction: number) => {
    setViewWindow(prev => {
      const newStart = Math.max(0, Math.min(prev.start + direction, fullData.length - prev.size));
      return { ...prev, start: newStart };
    });
  };

  const compositionMetrics: CompositionMetric[] = [
    { metric: 'MUSCLE MASS', value: 62.4, unit: 'KG', previousValue: 60.2, goal: 65.0, status: 'OPT', color: 'var(--brand)' },
    { metric: 'BODY FAT %', value: 14.2, unit: '%', previousValue: 15.4, goal: 12.0, status: 'DEF', color: '#3b82f6' },
    { metric: 'METABOLIC AGE', value: 26, unit: 'YRS', previousValue: 28, goal: 24, status: 'STR', color: '#ef4444' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    // Simulation of data processing for "Matter" vibe
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      // Actual browser print call - in high-end apps, window.print() 
      // is the most robust way to trigger a "Save as PDF" workflow.
      window.print();
      setTimeout(() => setExportComplete(false), 3000);
    }, 1800);
  };

  const renderProgressBar = (m: CompositionMetric) => {
    const min = Math.min(m.value, m.previousValue, m.goal) * 0.8;
    const max = Math.max(m.value, m.previousValue, m.goal) * 1.2;
    const range = max - min;
    
    const currentPos = ((m.value - min) / range) * 100;
    const prevPos = ((m.previousValue - min) / range) * 100;
    const goalPos = ((m.goal - min) / range) * 100;

    const isDecreasingMetric = m.metric.includes('FAT') || m.metric.includes('AGE');
    const isSuccess = isDecreasingMetric ? m.value < m.previousValue : m.value > m.previousValue;

    return (
      <div key={m.metric} className="glass p-6 rounded-[32px] border border-white/5 hover:border-brand/20 transition-all group relative overflow-hidden break-inside-avoid">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-tighter text-white print:text-black mb-1">{m.metric}</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black font-mono tracking-tighter print:text-black">{m.value}{m.unit}</span>
              {comparisonMode === 'previous' && (
                <div className={`flex items-center text-[10px] font-mono font-bold ${isSuccess ? 'text-brand print:text-green-700' : 'text-red-500'}`}>
                  {isSuccess ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {Math.abs(m.value - m.previousValue).toFixed(1)}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[7px] font-black font-mono bg-brand/10 text-brand print:text-green-800 print:bg-green-50 px-2 py-0.5 rounded uppercase">{m.status}</div>
            <p className="text-[8px] font-bold font-mono text-zinc-500 uppercase mt-1 tracking-widest">Protocol Sync</p>
          </div>
        </div>

        <div className="relative h-4 mt-2">
          <div className="absolute inset-0 bg-white/5 print:bg-gray-100 rounded-full h-1.5 top-1/2 -translate-y-1/2 overflow-hidden">
            <div 
              className="h-full bg-brand/20 print:bg-green-600 transition-all duration-1000" 
              style={{ width: `${currentPos}%` }}
            />
          </div>
          <div 
            className="absolute top-0 w-px h-full bg-white/20 print:bg-gray-300 border-x border-white/5 transition-all duration-700"
            style={{ left: `${goalPos}%` }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <GoalIcon className="w-2 h-2 text-white/40 print:text-gray-400" />
            </div>
          </div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-brand rounded-full border-4 border-black print:border-white shadow-[0_0_15px_var(--brand)] print:shadow-none transition-all duration-1000 z-10"
            style={{ left: `${currentPos}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">Efficiency: Optimal</p>
          <div className="flex space-x-4">
             <div className="flex items-center space-x-1">
                <div className="w-1 h-1 rounded-full bg-zinc-700 print:bg-gray-300"></div>
                <span className="text-[7px] font-mono text-zinc-600 uppercase">Goal: {m.goal}{m.unit}</span>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-32 animate-in fade-in duration-1000 print:p-10 print:bg-white print:text-black">
      {/* Print-Only Branded Header */}
      <div className="hidden print:block mb-10 border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight">BASE MATTER.</h1>
        <p className="text-[10px] font-mono font-black mt-2">BIOMETRIC MATTER PERFORMANCE REPORT // ID: {Math.floor(Math.random() * 999999)}</p>
        <p className="text-[8px] font-mono mt-1 uppercase">TIMESTAMP: {new Date().toISOString()}</p>
      </div>

      <div className="px-6 pt-12 pb-8 flex justify-between items-start print:hidden">
        <div>
          <div className="flex items-center space-x-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
             <span className="text-[11px] font-black text-brand uppercase tracking-widest font-mono flex items-center">
                <span className="mr-1.5">•</span> BIOMETRICS: SYNCED
             </span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-[-0.05em] leading-[0.85] text-white">
            STAT<br/><span className="text-brand">MATTER.</span>
          </h1>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-12 h-12 glass flex items-center justify-center rounded-2xl relative group overflow-hidden active:scale-95 transition-all glow-brand"
          >
            {isExporting ? <RefreshCw className="w-5 h-5 text-brand animate-spin" /> : <Download className="w-5 h-5 text-zinc-400" />}
          </button>
          <button className="w-12 h-12 glass flex items-center justify-center rounded-2xl">
            <BarChart3 className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Export Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center font-mono print:hidden">
          <RefreshCw className="w-16 h-16 mb-6 text-brand animate-spin" />
          <p className="text-brand text-xs font-black uppercase tracking-[0.4em] animate-pulse">Compiling Biometric Data Splines</p>
          <p className="text-zinc-500 text-[8px] mt-4 uppercase tracking-widest">Generating Matter Report Protocol...</p>
        </div>
      )}

      {/* Core Metrics Grid */}
      <div className="px-6 grid grid-cols-2 gap-5 mb-10 print:grid-cols-4 print:mb-12">
        {[
          { label: 'Matter Synced', value: '24', icon: Zap, color: 'text-brand print:text-green-700' },
          { label: 'Avg Pulse', value: '142', icon: Activity, color: 'text-white print:text-black' },
          { label: 'Efficiency', value: '92%', icon: Target, color: 'text-brand print:text-green-700' },
          { label: 'Persistence', value: '08d', icon: TrendingUp, color: 'text-white print:text-black' },
        ].map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-[36px] border border-white/5 relative group overflow-hidden print:border-gray-200">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1 font-mono print:text-gray-600">{stat.label}</p>
            <h4 className="text-3xl font-black uppercase tracking-tighter font-mono print:text-black">{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Technical Data Visualization with Zoom/Pan */}
      <section className="px-6 mb-12 break-inside-avoid">
        <div className="glass p-8 rounded-[48px] border border-white/5 relative overflow-hidden print:border-gray-200">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
               <h3 className="font-black uppercase tracking-tighter text-lg print:text-black">Growth Analysis</h3>
               <p className="text-[9px] text-zinc-500 font-mono font-bold uppercase mt-1 tracking-widest">Deep Historical Scan</p>
            </div>
            
            {/* View Controls - Hidden during print */}
            <div className="flex items-center space-x-2 bg-black/40 p-1.5 rounded-xl border border-white/5 print:hidden">
              <button onClick={() => handleZoom(2)} className="p-1.5 text-zinc-400 hover:text-white transition-colors"><ZoomOut className="w-3.5 h-3.5" /></button>
              <div className="w-px h-3 bg-white/5"></div>
              <button onClick={() => handleZoom(-2)} className="p-1.5 text-zinc-400 hover:text-white transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          
          <div className="relative h-64 group/chart pt-4 print:h-48">
            {/* Y-Axis Grid */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2 print:opacity-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-zinc-800 print:bg-gray-400"></div>
              ))}
            </div>

            {/* Bars Area */}
            <div className="h-[200px] print:h-[150px] flex items-end justify-between space-x-2 relative z-10 px-2 overflow-hidden">
              {visibleData.map((h, i) => {
                const globalIdx = viewWindow.start + i;
                const isActive = hoveredIndex === globalIdx;
                const isDimmed = hoveredIndex !== null && !isActive;

                return (
                  <div 
                    key={globalIdx} 
                    className={`flex-1 flex flex-col items-center relative transition-opacity duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                  >
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 relative ${globalIdx === fullData.length - 1 || isActive ? 'bg-brand print:bg-green-600' : 'bg-white/10 print:bg-gray-200'} `}
                      style={{ height: `${h}%` }}
                    />
                    <span className={`text-[6px] font-bold font-mono uppercase mt-4 print:text-gray-400 ${isActive ? 'text-brand' : 'text-zinc-700'}`}>
                      C{globalIdx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Navigator / Scrub Bar - Hidden during print */}
            <div className="mt-8 relative h-8 px-2 print:hidden">
              <div className="absolute inset-x-2 inset-y-2 bg-white/5 rounded-md overflow-hidden flex items-end opacity-40">
                {fullData.map((h, i) => (
                  <div key={i} className="flex-1 bg-white/20" style={{ height: `${h/2}%` }}></div>
                ))}
              </div>
              
              <div 
                className="absolute inset-y-1 bg-brand/10 border-x border-brand transition-all duration-300 pointer-events-none"
                style={{ 
                  left: `${(viewWindow.start / fullData.length) * 100}%`, 
                  width: `${(viewWindow.size / fullData.length) * 100}%` 
                }}
              />
            </div>

            {/* Pan Buttons - Hidden during print */}
            <div className="mt-4 flex justify-between items-center px-2 print:hidden">
               <button 
                 onClick={() => handlePan(-1)} 
                 disabled={viewWindow.start === 0}
                 className="p-2 glass rounded-full disabled:opacity-20 active:scale-90 transition-all"
               >
                 <ChevronLeft className="w-4 h-4 text-zinc-400" />
               </button>
               <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest flex items-center">
                 <Terminal className="w-2.5 h-2.5 mr-2 text-brand" />
                 FRAME: {viewWindow.start + 1} — {viewWindow.start + viewWindow.size}
               </div>
               <button 
                 onClick={() => handlePan(1)} 
                 disabled={viewWindow.start + viewWindow.size >= fullData.length}
                 className="p-2 glass rounded-full disabled:opacity-20 active:scale-90 transition-all"
               >
                 <ChevronRight className="w-4 h-4 text-zinc-400" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Composition Breakdown */}
      <section className="px-6 pb-20 print:pb-0">
        <div className="flex justify-between items-end mb-6 px-2 print:mb-8">
          <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] print:text-black">Matter Composition Breakdown</h3>
          <div className="flex space-x-2 print:hidden">
            {['none', 'previous', 'goal'].map((mode) => (
              <button
                key={mode}
                onClick={() => setComparisonMode(mode as any)}
                className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border transition-all ${
                  comparisonMode === mode ? 'bg-brand text-black border-brand' : 'bg-white/5 text-zinc-500 border-white/5'
                }`}
              >
                {mode === 'none' ? 'Current' : mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {compositionMetrics.map(renderProgressBar)}
        </div>
      </section>

      {/* Print Footer */}
      <div className="hidden print:block mt-12 text-center border-t border-gray-100 pt-6">
        <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Base Matter Performance Kernel v0.2.5 — All Data Encrypted via Matter Identity Protocol</p>
      </div>
    </div>
  );
};

const Terminal = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

export default ProgressView;