
import React, { useMemo } from 'react';
import { Target } from 'lucide-react';
import { Vitals } from '../types';
import { calculateConvergenceScore } from '../constants';
import { Language, translations } from '../i18n';

interface Props {
  vitals: Vitals;
  lang?: Language;
}

const ThalamusConvergence: React.FC<Props> = ({ vitals, lang = 'FR' }) => {
  const socialSentiment = useMemo(() => 50 + Math.random() * 35, []);
  const score = calculateConvergenceScore(vitals, socialSentiment);
  const isWeak = score < 60;
  const t = translations[lang];

  return (
    <div className="glass-panel p-6 rounded-3xl border-blue-500/10 bg-blue-500/5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-blue-400" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t.convergence}</h3>
        </div>
        <div className={`text-[10px] font-black px-3 py-1 rounded-full ${isWeak ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {isWeak ? (lang === 'FR' ? 'SIGNAL FAIBLE' : 'WEAK SIGNAL') : 'OPTIMAL'}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-4 relative">
        <div className="w-32 h-32 rounded-full border-4 border-slate-900 flex items-center justify-center relative shadow-inner">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="64" cy="64" r="58" fill="transparent" stroke="#1e293b" strokeWidth="8" />
            <circle cx="64" cy="64" r="58" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray={364} strokeDashoffset={364 - (364 * score) / 100} className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-white">{score.toFixed(0)}%</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{t.confidence}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThalamusConvergence;
