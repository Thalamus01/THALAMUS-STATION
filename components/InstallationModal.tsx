
import React, { useState } from 'react';
import { Download, Copy, CheckCircle2, Terminal, Monitor, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Logo } from '../src/components/Logo';

interface Props {
  onComplete: () => void;
  syncId: string;
}

const InstallationModal: React.FC<Props> = ({ onComplete, syncId }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(syncId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    // Simulation de téléchargement
    setTimeout(() => {
      setDownloading(false);
      // En production, ici on déclencherait le téléchargement réel du fichier .ex5
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="max-w-2xl w-full glass-panel p-8 md:p-12 rounded-[3.5rem] border border-white/10 bg-black/80 shadow-[0_0_100px_rgba(34,211,238,0.15)] relative overflow-hidden flex flex-col">
        {/* PROGRESS BAR ANIMATION */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-900">
          <div className="h-full bg-cyan-500 animate-[loading-bar_4s_ease-in-out_infinite] shadow-[0_0_15px_#22d3ee]" />
        </div>

        <header className="text-center mb-10">
          <Logo variant="icon" size={64} className="mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400">Phase d'Induction Active</span>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">INITIALISATION DU NEURAL LINK</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Suivez le protocole pour lier votre terminal</p>
        </header>

        <div className="space-y-8">
          {/* ÉTAPE 1: TÉLÉCHARGEMENT */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black">1</div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Téléchargement du Bridge</h3>
            </div>
            <button 
              onClick={handleDownload}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${downloading ? 'bg-slate-800 text-slate-500' : 'bg-white text-black hover:bg-cyan-500 hover:scale-[1.02]'}`}
            >
              {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              {downloading ? 'GÉNÉRATION DU FICHIER...' : 'TÉLÉCHARGER LE BRIDGE (.EX5)'}
            </button>
          </section>

          {/* ÉTAPE 2: IDENTIFICATION */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black">2</div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Identification unique</h3>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex items-center justify-between group">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">VOTRE ID THALAMUS</span>
                <div className="text-xl font-mono font-black text-cyan-400 tracking-widest">{syncId}</div>
              </div>
              <button 
                onClick={handleCopy}
                className={`p-4 rounded-xl border transition-all ${copied ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}
              >
                {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </section>

          {/* ÉTAPE 3: ACTIVATION */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black">3</div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Activation Terminale</h3>
            </div>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tight">
                Placez le fichier dans le dossier <span className="text-white italic">MQL5/Experts</span> de votre terminal MT5, activez le <span className="text-white italic">Trading Algorithmique</span>, et entrez votre ID dans les réglages de l'expert.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <button 
            onClick={onComplete}
            className="w-full py-8 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(34,211,238,0.3)] flex items-center justify-center gap-4 group"
          >
            LANCER LE COCKPIT <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
};

export default InstallationModal;
