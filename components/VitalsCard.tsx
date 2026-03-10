
import React, { memo, useMemo } from 'react';
import { Activity, Zap, Heart, Brain, ChevronRight, Watch } from 'lucide-react';
import { Vitals } from '../types';
import { Language, translations } from '../i18n';

interface Props {
  vitals: Vitals;
  source?: string;
  lang?: Language;
}

const VitalsCard: React.FC<Props> = memo(({ vitals, source, lang = 'FR' }) => {
  const isHealthy = vitals.discipline >= 60 && vitals.cognitiveClarity >= 60;
  const t = useMemo(() => translations[lang], [lang]);

  return (
    <div className={`glass-panel p-8 lg:p-10 rounded-[2.5rem] transition-all duration-700 shadow-2xl relative overflow-hidden group border-white/10 ${isHealthy ? 'hover:border-cyan-500/30 glow-cyan' : 'hover:border-red-500/30 glow-red'}`}>
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-1">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">{t.neuralAnalytics}</h3>
          <p className="text-[10px] font-bold text-slate-600 uppercase italic opacity-70">{t.realtimeStream}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] shadow-lg transition-all ${isHealthy ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'}`}>
            {isHealthy ? t.bioOptimized : t.bioAlert}
          </div>
          {source && (
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-emerald-400/70 tracking-widest">
              <Watch size={10} /> {source}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 transition-all hover:bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-cyan-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Discipline</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl lg:text-4xl font-black font-mono text-white italic tracking-tighter">{Math.round(vitals.discipline)}</span>
            <span className="text-[10px] text-slate-600 font-black uppercase">%</span>
          </div>
          <div className="mt-4 h-1 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-1000 rounded-full" 
              style={{ width: `${vitals.discipline}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 transition-all hover:bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Clarté Cognitive</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl lg:text-4xl font-black font-mono text-white italic tracking-tighter">{Math.round(vitals.cognitiveClarity)}</span>
            <span className="text-[10px] text-slate-600 font-black uppercase">%</span>
          </div>
          <div className="mt-4 h-1 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-1000 rounded-full" 
              style={{ width: `${vitals.cognitiveClarity}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 group-hover:border-red-500/20 transition-all">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Activity size={14} className="text-red-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">Impulsivité</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl lg:text-4xl font-black font-mono text-white italic tracking-tighter">{Math.round(vitals.impulsivity)}</span>
            <span className="text-[10px] text-slate-600 font-black uppercase italic">idx</span>
          </div>
        </div>

        <div className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Brain size={14} className="text-purple-400" />
            <span className="text-[9px] font-black uppercase tracking-widest">{t.neuroCharge}</span>
          </div>
          <div className="text-xl lg:text-2xl font-black font-mono text-white italic uppercase tracking-widest">{vitals.stressLevel}</div>
        </div>
      </div>
    </div>
  );
});

export default VitalsCard;
