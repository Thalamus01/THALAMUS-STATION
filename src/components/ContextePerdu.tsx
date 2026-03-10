import React from 'react';
import { Brain, RefreshCw, Eye } from 'lucide-react';
import { useContextePerdu } from '../hooks/useContextePerdu';
import { motion } from 'framer-motion';

interface Props {
  tempsEcoule: number; // in minutes
  onVoirPrix: () => void;
}

export const ContextePerdu: React.FC<Props> = ({ tempsEcoule, onVoirPrix }) => {
  const { fact, loading, refresh } = useContextePerdu();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full bg-slate-950/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-8 font-mono"
    >
      <div className="flex items-center gap-3 text-cyan-400">
        <Brain size={24} className="animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-[0.3em]">Contexte Perdu</h3>
      </div>

      <div className="min-h-[80px] flex items-center justify-center">
        {loading ? (
          <RefreshCw size={24} className="text-slate-700 animate-spin" />
        ) : (
          <p className="text-lg font-bold text-white italic leading-relaxed max-w-md">
            "{fact}"
          </p>
        )}
      </div>

      <button 
        onClick={refresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95"
      >
        <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        Nouveau fait
      </button>

      <div className="w-full h-px bg-white/5" />

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-black text-white uppercase tracking-tighter italic">Votre position est ancrée.</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thalamus veille.</p>
        </div>
        
        <div className="text-2xl font-black italic text-cyan-400">
          Temps écoulé : {tempsEcoule} min
        </div>

        <button 
          onClick={onVoirPrix}
          className="flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all active:scale-95 mx-auto"
        >
          <Eye size={18} /> Voir le prix
        </button>
      </div>
    </motion.div>
  );
};
