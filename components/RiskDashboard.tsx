import React, { useMemo, memo } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { Portfolio } from '../types';
import { calculatePortfolioRisk, getEffectiveRiskLimit } from '../constants';
import { Language, translations } from '../i18n';

interface Props {
  portfolio: Portfolio;
  readiness?: number;
  lang?: Language;
}

const RiskDashboard: React.FC<Props> = memo(({ portfolio, readiness = 80, lang = 'FR' }) => {
  const risk = useMemo(() => calculatePortfolioRisk(portfolio), [portfolio]);
  const t = useMemo(() => translations[lang], [lang]);
  const effectiveLimit = useMemo(() => getEffectiveRiskLimit(readiness, portfolio.equity), [readiness, portfolio.equity]);
  
  const percentage = Math.min(risk.varPercentage * 100, 100);
  const limitPercent = effectiveLimit * 100;

  return (
    <div className="glass-panel p-6 rounded-[2rem] h-full flex flex-col relative overflow-hidden border-white/5 bg-slate-900/40 hover:scale-[1.01] transition-all duration-500 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-cyan-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Custodian Protocol</h3>
        </div>
      </div>
      
      {/* JAUGE CIRCULAIRE CSS NATIVE */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[140px]">
        <div className="relative w-32 h-32 rounded-full border-[6px] border-slate-800 flex items-center justify-center shadow-inner">
          <svg className="absolute inset-0 w-full h-full -rotate-90 p-[-4px]">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="transparent"
              stroke={risk.varPercentage > effectiveLimit ? '#ef4444' : '#06b6d4'}
              strokeWidth="8"
              strokeDasharray="377"
              strokeDashoffset={377 - (377 * percentage) / 100}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 8px ${risk.varPercentage > effectiveLimit ? '#ef4444' : '#06b6d4'}88)` }}
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">VaR EXPO</span>
            <span className={`text-xl font-mono font-black italic ${risk.varPercentage > effectiveLimit ? 'text-red-500' : 'text-white'}`}>
              {percentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest mb-2">
              <span className="text-slate-500">Security Limit</span>
              <span className="text-emerald-400">{limitPercent.toFixed(1)}% Max</span>
           </div>
           <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-[1px]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${risk.varPercentage > effectiveLimit ? 'bg-red-500' : 'bg-cyan-500'}`} 
                style={{ width: `${Math.min((percentage / limitPercent) * 100, 100)}%` }} 
              />
           </div>
        </div>

        <div className="flex items-start gap-2 opacity-50">
           <Info size={12} className="text-slate-500 mt-0.5" />
           <p className="text-[7px] font-mono text-slate-500 leading-tight uppercase italic">
             Dynamic limit adjusted by readiness.
           </p>
        </div>
      </div>
    </div>
  );
});

export default RiskDashboard;