import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Wind, Lock, Timer, RefreshCcw } from 'lucide-react';

interface Props {
  reason: string;
  onForceResume: () => void;
}

export const ShelterOverlay: React.FC<Props> = ({ reason, onForceResume }) => {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [showForceInput, setShowForceInput] = useState(false);
  const [forceText, setForceText] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    const breathTimer = setInterval(() => {
      setPhase(prev => prev === 'inhale' ? 'hold' : prev === 'hold' ? 'exhale' : 'inhale');
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(breathTimer);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[2000] bg-[#0A0A0A]/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500"
          >
            <ShieldAlert size={48} />
          </motion.div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Mode Shelter Activé</h2>
          <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-500 text-sm font-bold uppercase tracking-widest">{reason}</p>
          </div>
        </div>

        {/* Breathing Exercise */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
              opacity: phase === 'inhale' ? 0.5 : 0.2
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-emerald-500/20 border border-emerald-500/30"
          />
          <div className="relative z-10 space-y-2">
            <Wind size={32} className="text-emerald-500 mx-auto" />
            <p className="text-emerald-500 font-black uppercase tracking-[4px] text-xl">
              {phase === 'inhale' ? 'Inspirer' : phase === 'hold' ? 'Maintenir' : 'Expirer'}
            </p>
          </div>
        </div>

        {/* Countdown & Info */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-md">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <Timer size={20} className="text-[#444] mx-auto" />
            <p className="text-3xl font-mono font-bold text-white">{formatTime(timeLeft)}</p>
            <p className="text-[10px] text-[#444] uppercase tracking-widest">Pause Obligatoire</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <Lock size={20} className="text-[#444] mx-auto" />
            <p className="text-3xl font-mono font-bold text-white">BLOQUÉ</p>
            <p className="text-[10px] text-[#444] uppercase tracking-widest">Statut Trading</p>
          </div>
        </div>

        {/* Force Resume */}
        <div className="w-full max-w-md space-y-4">
          {!showForceInput ? (
            <button 
              onClick={() => setShowForceInput(true)}
              className="text-[#333] hover:text-red-500/50 text-[10px] uppercase tracking-widest transition-colors"
            >
              Forcer la reprise (Non recommandé)
            </button>
          ) : (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
              <p className="text-[10px] text-red-500 uppercase tracking-widest">Tapez "JE PRENDS LA RESPONSABILITÉ" pour débloquer</p>
              <input 
                type="text" 
                value={forceText}
                onChange={(e) => setForceText(e.target.value.toUpperCase())}
                placeholder="..."
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-center font-mono text-sm focus:border-red-500 outline-none transition-colors"
              />
              {forceText === 'JE PRENDS LA RESPONSABILITÉ' && (
                <button 
                  onClick={onForceResume}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-black uppercase tracking-widest text-xs animate-pulse"
                >
                  Débloquer Sentinel
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
