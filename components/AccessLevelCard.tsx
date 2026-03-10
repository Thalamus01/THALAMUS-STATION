import React from 'react';
import { Shield, Zap, Crown, Lock, ChevronRight } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  tier: 'NANO' | 'PRO' | 'ELITE';
  onUpgrade: () => void;
  lang?: Language;
}

const AccessLevelCard: React.FC<Props> = ({ tier, onUpgrade, lang = 'FR' }) => {
  const t = translations[lang];
  
  const config = {
    NANO: { 
      icon: <Shield size={20} className="text-slate-400" />, 
      color: 'text-slate-400', 
      bg: 'bg-slate-500/10',
      label: 'NANO-PROTOCOL',
      perks: ['VaR 5%', 'Bio-Lock']
    },
    PRO: { 
      icon: <Zap size={20} className="text-cyan-400" />, 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/10',
      label: 'PRO-SYMBIOSE',
      perks: ['VaR 2%', 'Multi-Link', 'HRV Pro']
    },
    ELITE: { 
      icon: <Crown size={20} className="text-amber-400" />, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10',
      label: 'ELITE-ALPHA',
      perks: ['Shadow Access', 'Founder Vault', 'No Latency']
    }
  };

  const current = config[tier];

  return (
    <div className="glass-panel p-6 rounded-[2rem] border-white/5 bg-slate-900/40 relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${current.bg} border border-white/5`}>
            {current.icon}
          </div>
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-widest ${current.color}`}>{current.label}</h3>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Access State Active</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {current.perks.map(perk => (
          <div key={perk} className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <div className="w-1 h-1 rounded-full bg-cyan-500" />
            {perk}
          </div>
        ))}
      </div>

      {tier !== 'ELITE' && (
        <button 
          onClick={onUpgrade}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black text-white uppercase tracking-[0.2em] transition-all"
        >
          <Lock size={12} /> {lang === 'FR' ? 'Upgrade Niveau' : 'Upgrade Level'}
          <ChevronRight size={10} />
        </button>
      )}
    </div>
  );
};

export default AccessLevelCard;