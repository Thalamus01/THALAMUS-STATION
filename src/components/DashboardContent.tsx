
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Eye, EyeOff, Anchor, ShieldCheck } from 'lucide-react';
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
  children
}) => {
  // Guard against null/undefined data
  const balance = accountData?.balance || 0;
  const profit = accountData?.profit || 0;
  const rawCurrency = accountData?.currency || 'USD';
  const currencySymbol = rawCurrency === 'EUR' ? '€' : rawCurrency === 'USD' ? '$' : rawCurrency;
  const positionsCount = positions?.length || 0;

  console.log("[DASHBOARD DEBUG] Rendering with:", { 
    balance, 
    profit, 
    currencySymbol, 
    rawCurrency,
    hasAccountData: !!accountData 
  });

  const formatValue = (val: number) => {
    return val.toFixed(2);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A] overflow-hidden relative z-[1]">
      {/* Top Stats Bar */}
      <div className="bg-[#0B0E11] border-b border-[#2B2F36] px-8 py-2 flex justify-between items-center shrink-0 z-50">
        <div className="flex gap-12 items-center">
          <div className="flex flex-col select-none">
            <span className="text-[10px] uppercase tracking-[1.5px] text-[#666] mb-0.5 flex items-center gap-1">
              <Brain size={10} /> Solde
            </span>
            <div className="flex items-center gap-2">
              <div className="transition-colors text-[#888]">
                {showBalance ? (
                  <span className="text-[18px] font-bold text-[#F5F5F0]">{formatValue(balance)} {currencySymbol}</span>
                ) : (
                  <div className="h-[27px] flex items-center">
                    <div className="w-16 h-1 bg-white/5 rounded-full" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleRevealBalance}
                className="p-1 hover:bg-white/5 rounded transition-colors text-[#444] hover:text-[#D4AF37]"
                title={showBalance ? "Masquer" : "Afficher"}
              >
                {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col select-none">
            <span className="text-[10px] uppercase tracking-[1.5px] text-[#666] mb-0.5 flex items-center gap-1">
              <Activity size={10} /> Performance
            </span>
            <div className="flex items-center gap-2">
              <div className="transition-colors text-[#F5F5F0]">
                {showProfit ? (
                  <span className={`text-[18px] font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formatValue(profit)} {currencySymbol}
                  </span>
                ) : (
                  <div className="h-[27px] flex items-center">
                    <div className="w-16 h-1 bg-white/5 rounded-full" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleRevealProfit}
                className="p-1 hover:bg-white/5 rounded transition-colors text-[#444] hover:text-[#D4AF37]"
                title={showProfit ? "Masquer" : "Afficher"}
              >
                {showProfit ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[1.5px] text-[#666] mb-0.5 flex items-center gap-1">
              {hasSL ? <Anchor size={10} /> : <ShieldCheck size={10} />} Statut
            </span>
            <div className={`font-bold ${hasSL ? 'text-[18px] text-[#F5F5F0]' : 'text-[14px] text-[#444]'}`}>
              {hasSL ? 'ANCRÉ' : 'EN ATTENTE'}
            </div>
          </div>

          <div className="h-8 flex items-center pl-8 border-l border-[#222] hidden xl:flex overflow-hidden">
            <NeuralTicker disciplineScore={disciplineScore} />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-[12px] uppercase tracking-[1.5px] text-[#666] flex items-center gap-2">
            <ShieldCheck size={12} strokeWidth={1.5} className={mt5Connected ? "text-emerald-500" : "text-red-500"} />
            {mt5Connected && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black animate-pulse">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                LIVE
              </span>
            )}
            Positions actives: <span className="text-[#F5F5F0]">{positionsCount}</span>
            {!mt5Connected && (
              <span className="ml-4 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-[10px] font-black animate-pulse">
                MT5 DÉCONNECTÉ
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
});
