
import React, { useState, useEffect } from 'react';
import { X, Fingerprint, ShieldAlert, Terminal, Lock, ChevronRight, Gavel, Coins, Zap } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  onClose: () => void;
  lang?: Language;
}

const FoundersVaultModal: React.FC<Props> = ({ onClose, lang = 'FR' }) => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'GRANTED'>('IDLE');
  const t = translations[lang];

  const startScan = () => {
    setStatus('SCANNING');
    setTimeout(() => {
      setStatus('GRANTED');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="max-w-4xl w-full glass-panel p-12 rounded-[3.5rem] border-white/10 shadow-[0_0_150px_rgba(34,211,238,0.1)] relative overflow-hidden min-h-[600px] flex flex-col">
        
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors z-50">
          <X size={28} />
        </button>

        {status !== 'GRANTED' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
            <div className="relative group cursor-pointer" onClick={startScan}>
              <div className={`absolute -inset-8 rounded-full blur-3xl transition-all duration-1000 ${status === 'SCANNING' ? 'bg-cyan-500/40 animate-pulse' : 'bg-cyan-500/10 group-hover:bg-cyan-500/20'}`} />
              <div className={`w-32 h-32 rounded-3xl border flex items-center justify-center transition-all duration-700 relative overflow-hidden ${status === 'SCANNING' ? 'border-cyan-400 bg-cyan-500/10 scale-110' : 'border-white/10 bg-slate-900 group-hover:border-cyan-500/50'}`}>
                <Fingerprint size={64} className={status === 'SCANNING' ? 'text-cyan-400' : 'text-slate-600 group-hover:text-cyan-500'} />
                {status === 'SCANNING' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-[scan-line_2s_ease-in-out_infinite] shadow-[0_0_15px_cyan]" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t.vaultAccess}</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">
                {status === 'SCANNING' ? t.vaultScanning : 'Placez votre empreinte pour initialiser le handshake'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
            <header className="flex items-center justify-between border-b border-white/5 pb-8">
               <div className="flex items-center gap-4">
                  <div className="bg-cyan-500/20 p-2 rounded-xl border border-cyan-500/30">
                     <ShieldAlert size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{t.vaultIdentity}: #78193</h2>
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em]">Status: Founder Legacy</p>
                  </div>
               </div>
               <div className="px-4 py-1.5 bg-slate-900 rounded-full border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {t.classified}
               </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-slate-900/40 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Gavel size={18} className="text-amber-400" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">{t.votingPower}</span>
                     </div>
                     <span className="text-xl font-mono font-black text-amber-400 italic">4.2%</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 glow-amber" style={{ width: '42%' }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Prochaine proposition : Optimisation de l'exposition Shadow Pool v29.</p>
               </div>

               <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-slate-900/40 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Coins size={18} className="text-emerald-400" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">{t.shadowRewards}</span>
                     </div>
                     <span className="text-xl font-mono font-black text-emerald-400 italic">$12,482.00</span>
                  </div>
                  <button className="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-emerald-600/20">
                    Réclamer Rewards
                  </button>
               </div>
            </div>

            <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-slate-950 flex-1 flex flex-col min-h-0">
               <div className="flex items-center gap-3 mb-6">
                  <Terminal size={18} className="text-cyan-400" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">{t.alphaFeed}</span>
               </div>
               <div className="flex-1 space-y-4 overflow-y-auto pr-4 scrollbar-hide text-[11px] font-mono opacity-80">
                  <div className="flex gap-4 text-emerald-400">
                    <span className="shrink-0">[14:22]</span>
                    <span>WHALE_WATCH: $450M USDT Inflow detecté sur Shadow Pool B.</span>
                  </div>
                  <div className="flex gap-4 text-slate-500">
                    <span className="shrink-0">[14:05]</span>
                    <span>SYSTEM: Déploiement du patch Thalamus-782-X terminé.</span>
                  </div>
                  <div className="flex gap-4 text-amber-400">
                    <span className="shrink-0">[13:48]</span>
                    <span>ALPHA: Opportunité de d'arbitrage NVDA/TSLA via Nexus Node 4.</span>
                  </div>
                  <div className="flex gap-4 text-slate-500">
                    <span className="shrink-0">[13:12]</span>
                    <span>SECURITY: Tentative de liaison non autorisée bloquée.</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default FoundersVaultModal;
