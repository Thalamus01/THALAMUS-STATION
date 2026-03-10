import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, Sparkles, Rocket } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  onComplete: () => void;
}

export const SuccessPage: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<'LOADING' | 'SUCCESS'>('LOADING');
  const [loadingText, setLoadingText] = useState('Initialisation de Thalamus...');

  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadingText('Synchronisation avec Sentinel IA...'), 1500),
      setTimeout(() => setLoadingText('Chargement des protocoles neuro-cognitifs...'), 3000),
      setTimeout(() => setStep('SUCCESS'), 4500)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#22d3ee10_0%,_transparent_50%)]" />
      
      <AnimatePresence mode="wait">
        {step === 'LOADING' ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="space-y-8 relative z-10"
          >
            <Logo variant="hero" size={120} className="mx-auto animate-pulse" />
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={32} className="text-cyan-500 animate-spin" />
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400 animate-pulse">
                {loadingText}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full space-y-12 relative z-10"
          >
            <div className="relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8"
              >
                <ShieldCheck size={48} className="text-emerald-400" />
              </motion.div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-emerald-500/10 rounded-full border-dashed"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                Félicitations !
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Accès Pionnier Confirmé</span>
              </div>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Vous faites partie des <span className="text-white font-black">500 Pionniers</span>. <br/>
                Votre tarif <span className="text-emerald-400 font-black">-50% à vie</span> est activé.
              </p>
            </div>

            <button 
              onClick={onComplete}
              className="group w-full py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              ACCÉDER AU COCKPIT <Rocket size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
