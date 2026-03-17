
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Eye, EyeOff, Anchor, ShieldCheck, ShieldAlert } from 'lucide-react';
import { NeuralTicker } from './NeuralTicker';

interface DashboardContentProps {
  accountData: any;
  positions: any[];
  isDemoMode: boolean;
  showProfit: boolean;
  handleRevealProfit: () => void;
  showBalance: boolean;
  handleRevealBalance: () => void;
  hasSL: boolean;
  disciplineScore: number;
  mt5Connected: boolean;
  lastUpdate: number;
  latency: number;
  sentinelData: any;
  onShowCameleon?: () => void;
  children: React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = React.memo(({
  accountData,
  positions,
  isDemoMode,
  showProfit,
  handleRevealProfit,
  showBalance,
  handleRevealBalance,
  hasSL,
  disciplineScore,
  mt5Connected,
  lastUpdate,
  latency,
  sentinelData,
  onShowCameleon,
  children
}) => {
  // Guard against null/undefined data
  const balance = accountData?.balance || 0;
  const profit = accountData?.profit || 0;
  const margin = accountData?.margin || 0;
  const marginLevel = accountData?.margin_level || 0;
  const rawCurrency = accountData?.currency || 'USD';
  const currencySymbol = rawCurrency === 'EUR' ? '€' : rawCurrency === 'USD' ? '$' : rawCurrency;
  const positionsCount = positions?.length || 0;

  const [timeAgo, setTimeAgo] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo((Date.now() - lastUpdate) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Audio Alert Logic
  React.useEffect(() => {
    if (sentinelData?.dangerIndex > 70) {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      }
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  }, [sentinelData?.dangerIndex]);

  const freshness = timeAgo < 3 ? { label: 'Données temps réel', color: 'text-emerald-500', bg: 'bg-emerald-500' } :
                    timeAgo < 10 ? { label: 'Latence élevée', color: 'text-amber-500', bg: 'bg-amber-500' } :
                    { label: 'Déconnecté', color: 'text-red-500', bg: 'bg-red-500' };

  const formatValue = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A] overflow-hidden relative z-[1]">
      {/* PROMOTIONAL BANNER: PLAN CAMÉLÉON */}
      <div 
        className="bg-emerald-500/10 border-b border-emerald-500/20 px-8 py-3 flex justify-between items-center cursor-pointer group hover:bg-emerald-500/20 transition-all"
        onClick={onShowCameleon}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Offre Exclusive : Plan Caméléon</p>
            <p className="text-[12px] font-bold text-white uppercase tracking-tight">Activez l'armure algorithmique pour sécuriser vos profits.</p>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-md group-hover:scale-105 transition-transform">
          Découvrir
        </button>
      </div>

      {/* Top Stats Bar */}
      <div className="bg-[#0B0E11] border-b border-[#2B2F36] px-8 py-2 flex justify-between items-center shrink-0 z-50">
        <div className="flex gap-10 items-center">
          {/* Balance */}
          <div className="flex flex-col select-none">
            <span className="text-[9px] uppercase tracking-[1.5px] text-[#666] mb-0.5 flex items-center gap-1">
              <Brain size={10} /> Solde
            </span>
            <div className="flex items-center gap-2">
              <div className="transition-colors text-[#888]">
                {showBalance ? (
                  balance > 0 ? (
                    <span className="text-[16px] font-bold text-[#F5F5F0]">{formatValue(balance)} {currencySymbol}</span>
                  ) : (
                    <span className="text-[12px] font-bold text-[#444] animate-pulse">EN ATTENTE MT5...</span>
                  )
                ) : (
                  <div className="h-[24px] flex items-center">
                    <div className="w-16 h-1 bg-white/5 rounded-full" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleRevealBalance}
                className="p-1 hover:bg-white/5 rounded transition-colors text-[#444] hover:text-[#D4AF37]"
              >
                {showBalance ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          </div>

          {/* Performance */}
          <div className="flex flex-col select-none">
            <span className="text-[9px] uppercase tracking-[1.5px] text-[#666] mb-0.5 flex items-center gap-1">
              <Activity size={10} /> Performance
            </span>
            <div className="flex items-center gap-2">
              <div className="transition-colors text-[#F5F5F0]">
                {showProfit ? (
                  <span className={`text-[16px] font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {profit >= 0 ? '+' : ''}{formatValue(profit)} {currencySymbol}
                  </span>
                ) : (
                  <div className="h-[24px] flex items-center">
                    <div className="w-16 h-1 bg-white/5 rounded-full" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleRevealProfit}
                className="p-1 hover:bg-white/5 rounded transition-colors text-[#444] hover:text-[#D4AF37]"
              >
                {showProfit ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          </div>

          {/* Positions Count */}
          <div className="flex flex-col select-none border-l border-white/5 pl-10">
            <span className="text-[9px] uppercase tracking-[1.5px] text-[#666] mb-0.5 flex items-center gap-1">
              <Anchor size={10} /> Positions
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-[#F5F5F0]">{positionsCount}</span>
              <span className="text-[9px] text-[#444] uppercase tracking-widest font-bold">actives</span>
            </div>
          </div>

          <div className="h-8 flex items-center pl-8 border-l border-[#222] hidden xl:flex overflow-hidden">
            <NeuralTicker disciplineScore={disciplineScore} />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-[12px] uppercase tracking-[1.5px] text-[#666] flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#444] font-mono">LATENCE:</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {latency}ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Contextual Alerts Overlay */}
        <div className="absolute top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
          {sentinelData?.detectedBiases?.slice(0, 2).map((bias: any, idx: number) => (
            <div key={idx} className="bg-red-500/10 border border-red-500/20 backdrop-blur-md p-3 rounded-lg shadow-2xl animate-bounce">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Alerte Sentinel</span>
              </div>
              <p className="text-[11px] text-white font-medium uppercase tracking-tight">
                {bias.name === 'FOMO' ? '⚠️ FOMO détecté : Vous accélérez vos prises de position après une perte.' : 
                 bias.name === 'Fatigue' ? '🧠 Fatigue cognitive : 4h de trading continue. Pause recommandée.' : 
                 bias.name}
              </p>
            </div>
          ))}
        </div>
        {children}
      </main>
    </div>
  );
});
