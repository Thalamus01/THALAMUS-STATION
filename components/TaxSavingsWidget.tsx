
import React from 'react';
import { ShieldCheck, ArrowDownRight, Sparkles } from 'lucide-react';
import { Portfolio } from '../types';
import { calculateTaxLossSavings } from '../constants';
import { Language, translations } from '../i18n';

interface Props {
  portfolio: Portfolio;
  lang?: Language;
}

const TaxSavingsWidget: React.FC<Props> = ({ portfolio, lang = 'FR' }) => {
  const savings = calculateTaxLossSavings(portfolio);
  const t = translations[lang];

  return (
    <div className="glass-panel p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5 group hover:bg-emerald-500/10 transition-all cursor-help glow-emerald shimmer-emerald">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">{t.taxSentinel}</span>
        </div>
        <Sparkles size={14} className="text-emerald-400" />
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-mono font-black text-emerald-400 tracking-tighter">
          +${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <ArrowDownRight size={18} className="text-emerald-500 animate-bounce" />
      </div>
      <p className="text-[10px] text-slate-500 mt-3 uppercase font-black tracking-widest border-t border-white/5 pt-3">
        Potential Savings v28.4
      </p>
    </div>
  );
};

export default TaxSavingsWidget;
