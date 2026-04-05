
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Cpu, 
  Lock, 
  Unlock, 
  Brain, 
  Signal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Terminal,
  MessageSquare,
  TrendingUp,
  Target
} from 'lucide-react';

interface Advice {
  id: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
  message: string;
  timestamp: number;
}

interface NeuralSupervisorProps {
  isConnected?: boolean;
}

export const NeuralSupervisor: React.FC<NeuralSupervisorProps> = ({ isConnected: externalConnected }) => {
  const [internalConnected, setInternalConnected] = useState(false);
  const [isSupervisionActive, setIsSupervisionActive] = useState(true);
  const [advices, setAdvices] = useState<Advice[]>([]);

  const isConnected = externalConnected !== undefined ? externalConnected : internalConnected;

  // Simulation de connexion avec l'EA (seulement si non fourni par le parent)
  useEffect(() => {
    if (externalConnected !== undefined) return;
    const timer = setTimeout(() => setInternalConnected(true), 2000);
    return () => clearTimeout(timer);
  }, [externalConnected]);

  // Simulation de conseils du Co-Pilote
  useEffect(() => {
    if (!isConnected) return;

    const adviceList: Advice[] = [
      { id: '1', type: 'INFO', message: "Volatilité basse sur l'Or. Attendez la cassure du range.", timestamp: Date.now() },
      { id: '2', type: 'WARNING', message: "Attention : Vous avez pris 2 trades perdants. Risque de Revenge Trading.", timestamp: Date.now() },
      { id: '3', type: 'SUCCESS', message: "Discipline parfaite sur le dernier trade. Ratio R:R respecté.", timestamp: Date.now() },
      { id: '4', type: 'WARNING', message: "Stress détecté (MHI: 85). Prenez 5 min de respiration.", timestamp: Date.now() }
    ];

    const adviceTimer = setInterval(() => {
      const randomAdvice = adviceList[Math.floor(Math.random() * adviceList.length)];
      setAdvices(prev => [{ ...randomAdvice, id: Math.random().toString(), timestamp: Date.now() }, ...prev].slice(0, 5));
    }, 8000);

    return () => clearInterval(adviceTimer);
  }, [isConnected]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#080808] p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
            <Brain size={18} className={isConnected ? 'text-emerald-500' : 'text-red-500'} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none mb-1">Co-Pilote Neural</h3>
            <div className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[8px] font-bold text-[#444] uppercase tracking-widest">
                {isConnected ? 'MT5 Neural Link Active' : 'Liaison MT5 Interrompue'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Feed */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare size={12} className="text-[#444]" />
            <span className="text-[9px] font-black text-[#444] uppercase tracking-[0.3em]">Conseils en Temps Réel</span>
          </div>
          <span className="text-[8px] font-bold text-[#222] uppercase tracking-widest">Live Feed</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          <AnimatePresence initial={false}>
            {advices.map((advice) => (
              <motion.div 
                key={advice.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border transition-all ${
                  advice.type === 'WARNING' ? 'bg-red-500/[0.02] border-red-500/10' :
                  advice.type === 'SUCCESS' ? 'bg-emerald-500/[0.02] border-emerald-500/10' :
                  'bg-white/[0.01] border-white/5'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`mt-0.5 ${
                    advice.type === 'WARNING' ? 'text-red-500' :
                    advice.type === 'SUCCESS' ? 'text-emerald-500' :
                    'text-cyan-400'
                  }`}>
                    {advice.type === 'WARNING' ? <AlertTriangle size={12} /> : 
                     advice.type === 'SUCCESS' ? <CheckCircle2 size={12} /> : 
                     <Brain size={12} />}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888] font-bold leading-relaxed uppercase tracking-tight">
                      {advice.message}
                    </p>
                    <span className="text-[7px] font-black text-[#333] mt-2 block uppercase tracking-widest">
                      {new Date(advice.timestamp).toLocaleTimeString()} • Thalamus Advisor
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {advices.length === 0 && (
            <div className="h-32 flex flex-col items-center justify-center opacity-10">
              <Signal size={24} className="mb-2" />
              <span className="text-[8px] font-black uppercase tracking-widest">Analyse comportementale...</span>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Kill Switch */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <button 
          onClick={() => setIsSupervisionActive(!isSupervisionActive)}
          className={`w-full py-3.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
            isSupervisionActive 
              ? 'bg-red-500/5 border-red-500/10 text-red-500 hover:bg-red-500/10' 
              : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
          }`}
        >
          <Lock size={12} />
          {isSupervisionActive ? 'Kill Switch (Urgence)' : 'Supervision Désactivée'}
        </button>
        <p className="text-[7px] text-[#333] text-center mt-3 uppercase font-black tracking-[0.2em]">
          Fermeture instantanée de toutes les positions MT5
        </p>
      </div>
    </div>
  );
};
