import React, { useState, useCallback, useMemo, memo } from 'react';
import { Timer, Zap, Play } from 'lucide-react';
import { generateFutureScenarios } from '../constants';
import { Language, translations } from '../i18n';

interface Props { currentPrice: number; lang?: Language; }

const TimeTravelSimulator: React.FC<Props> = memo(({ currentPrice, lang = 'FR' }) => {
  const [scenarios, setScenarios] = useState(() => generateFutureScenarios(currentPrice));
  const [isSimulating, setIsSimulating] = useState(false);
  const t = useMemo(() => translations[lang], [lang]);

  const handleSimulate = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => {
      setScenarios(generateFutureScenarios(currentPrice));
      setIsSimulating(false);
    }, 1200);
  }, [currentPrice]);

  return (
    <div className="glass-panel p-6 rounded-[2.5rem] border-blue-500/10 bg-slate-900/40 flex flex-col h-full group relative overflow-hidden transition-all duration-500 hover:bg-slate-900/60 shadow-2xl">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/30">
            <Timer size={16} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prediction T+4h</h3>
            <span className="text-[7px] font-bold text-blue-500 uppercase tracking-widest">Neural Projection v2.8</span>
          </div>
        </div>
        <button 
          onClick={handleSimulate} 
          disabled={isSimulating} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          {isSimulating ? <Zap size={12} className="animate-spin" /> : <Play size={12} />}
          {isSimulating ? '...' : t.simulateFuture}
        </button>
      </div>

      {/* VISUALISATION SPARKLINE CSS NATIVE */}
      <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 min-h-[120px] relative z-10">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
           <Zap size={60} className="text-blue-400" />
        </div>
        
        {scenarios.map((s, i) => {
          const height = Math.max(20, Math.min(100, ((s.neutral - currentPrice * 0.98) / (currentPrice * 0.04)) * 100));
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
              <div className="relative w-full">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-1000 delay-[${i * 100}ms] ${s.neutral > currentPrice ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}
                  style={{ height: `${height}px` }}
                />
                <div 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 rounded-full transition-all duration-1000 ${s.neutral > currentPrice ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-red-400 shadow-[0_0_8px_#ef4444]'}`}
                  style={{ height: `${height}px` }}
                />
              </div>
              <span className="text-[7px] font-mono text-slate-600 uppercase font-black">{s.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default TimeTravelSimulator;