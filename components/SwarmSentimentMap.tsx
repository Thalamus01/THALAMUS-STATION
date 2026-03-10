
import React, { useMemo } from 'react';
import { Users, Zap, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  activeTraders: number;
  state: 'CALM' | 'ALERT' | 'PANIC';
  lang?: Language;
}

const SwarmSentimentMap: React.FC<Props> = ({ activeTraders, state, lang = 'FR' }) => {
  const t = translations[lang];
  const dots = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, []);

  const stateColor = state === 'PANIC' ? 'text-red-400' : state === 'ALERT' ? 'text-amber-400' : 'text-cyan-400';
  const stateBg = state === 'PANIC' ? 'bg-red-500/20' : state === 'ALERT' ? 'bg-amber-500/20' : 'bg-cyan-500/20';

  return (
    <div className={`glass-panel p-8 rounded-[2.5rem] relative overflow-hidden transition-all duration-700 border-white/5 ${state === 'PANIC' ? 'border-red-500/30 glow-red' : ''}`}>
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="space-y-1">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Neural Heatmap</h3>
          <p className="text-[10px] font-bold text-slate-600 uppercase italic">{lang === 'FR' ? 'Flux Comportemental Collectif' : 'Collective Behavioral Flow'}</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${stateBg} ${stateColor} border border-current opacity-80`}>
          SWARM_{state}
        </div>
      </div>

      <div className="relative h-40 w-full bg-slate-950/40 rounded-3xl border border-white/5 overflow-hidden">
        {dots.map(dot => (
          <div 
            key={dot.id}
            className={`absolute rounded-full transition-all duration-[3000ms] ${state === 'PANIC' ? 'bg-red-500' : state === 'ALERT' ? 'bg-amber-500' : 'bg-cyan-500'}`}
            style={{ 
              left: `${dot.x}%`, 
              top: `${dot.y}%`, 
              width: `${dot.size}px`, 
              height: `${dot.size}px`, 
              opacity: dot.opacity,
              filter: `blur(${state === 'PANIC' ? '2px' : '4px'})`,
              animation: `pulse ${2 + Math.random() * 3}s infinite alternate`
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-[scan_8s_linear_infinite]" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 relative z-10">
        <div className="space-y-2">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">{lang === 'FR' ? 'Charge Réseau' : 'Network Load'}</span>
           <div className="flex items-center gap-3">
              <Users size={14} className={stateColor} />
              <span className="text-lg font-mono font-black text-white italic">{activeTraders}</span>
           </div>
        </div>
        <div className="space-y-2">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">{lang === 'FR' ? 'Contagion Risque' : 'Risk Contagion'}</span>
           <div className="flex items-center gap-3">
              <Zap size={14} className={stateColor} />
              <span className="text-lg font-mono font-black text-white italic">{state === 'PANIC' ? 'CRITICAL' : state === 'ALERT' ? 'MODERATE' : 'LOW'}</span>
           </div>
        </div>
      </div>

      {state === 'PANIC' && (
        <div className="mt-6 p-4 bg-red-600/10 border border-red-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
           <AlertTriangle size={18} className="text-red-500 shrink-0" />
           <p className="text-[9px] font-black text-red-400 uppercase leading-tight tracking-tight">FOUNDER_OVERRIDE: Protection Active.</p>
        </div>
      )}
    </div>
  );
};

export default SwarmSentimentMap;
