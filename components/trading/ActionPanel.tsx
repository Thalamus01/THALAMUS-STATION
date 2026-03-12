
import React, { useEffect } from 'react';
import { ArrowUp, ArrowDown, Lock as LucideLock } from 'lucide-react';

import { ASSET_CONFIGS, calculateLots } from '../../constants';

interface Props {
  onExecute: (side: 'BUY' | 'SELL') => void;
  isExecuting: boolean;
  currentMode: string;
  riskPercent: number;
  setRiskPercent: (val: number) => void;
  slPoints: number;
  setSlPoints: (val: number) => void;
  tpPoints: number;
  setTpPoints: (val: number) => void;
  currentLot: number;
  balance: number;
  symbol: string;
  ticks: Record<string, any>;
}

export const ActionPanel: React.FC<Props> = ({ 
  onExecute, 
  isExecuting, 
  currentMode,
  riskPercent,
  setRiskPercent,
  slPoints,
  setSlPoints,
  tpPoints,
  setTpPoints,
  currentLot,
  balance,
  symbol,
  ticks
}) => {
  const [flash, setFlash] = React.useState(false);
  
  const currentTick = ticks[symbol] || { bid: 0, ask: 0 };
  const prices = {
    bid: currentTick.bid || 0,
    ask: currentTick.ask || 0
  };

  useEffect(() => {
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timer);
  }, [symbol, prices.bid]);

  const suggestedLots = calculateLots(balance, riskPercent, slPoints, symbol);
  const monetaryRisk = (balance * (riskPercent / 100)).toFixed(2);
  
  const isRiskTooHigh = riskPercent > 3;
  const isRiskExcessive = riskPercent > 10;
  const isSlZero = slPoints <= 0;
  const isDisabled = isExecuting || currentMode === 'SHELTER' || isRiskTooHigh || isSlZero;

  const getRiskColor = () => {
    if (isRiskExcessive) return 'bg-red-600';
    if (riskPercent <= 1) return 'bg-emerald-500';
    if (riskPercent <= 2) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getSymbolColor = () => {
    if (symbol === 'XAUUSD') return 'text-[#F59E0B]'; // Gold
    if (['EURUSD', 'GBPUSD', 'USDJPY'].includes(symbol)) return 'text-[#22C55E]'; // Green
    if (symbol === 'USOIL') return 'text-[#666]'; // Gray/Black
    return 'text-cyan-500'; // Default
  };

  return (
    <div className={`h-full w-[280px] bg-[#0B0E11] border-l border-[#2B2F36] flex flex-col p-5 overflow-y-auto no-scrollbar transition-colors duration-500 ${flash ? 'bg-[#1A1A1A]' : ''}`}>
      {/* PRICE SECTION */}
      <div className="w-full flex flex-col items-center mb-4 relative">
        {flash && (
          <div className="absolute inset-0 bg-white/5 animate-pulse rounded-lg -m-2 pointer-events-none" />
        )}
        <div className={`text-[14px] font-black uppercase tracking-[3px] transition-colors duration-300 ${flash ? 'text-white' : getSymbolColor()}`}>
          {symbol}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="text-[11px] uppercase tracking-[1.5px] text-[#444]">Spread 0.3</div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-[9px] font-bold text-emerald-500/50 uppercase tracking-tighter ml-1">Secure Link</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#222] mb-4" />

      {/* INPUTS SECTION */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase tracking-widest text-[#444] font-bold">Risque par Trade</label>
            <span className={`text-[10px] font-bold ${isRiskTooHigh ? 'text-red-500' : 'text-emerald-500'}`}>
              {monetaryRisk}€
            </span>
          </div>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] text-[12px]">%</span>
            <input 
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full h-9 bg-[#1A1A1A] border border-[#333] rounded pl-3 pr-8 text-[14px] text-[#F5F5F0] focus:border-[#555] outline-none transition-all font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-[#444] font-bold">Volume Suggéré</label>
          <div className={`w-full h-9 bg-[#0D0D0D] border rounded flex items-center px-3 text-[14px] font-mono transition-colors ${isRiskExcessive ? 'border-red-600 text-red-600' : isRiskTooHigh ? 'border-red-500/50 text-red-500' : 'border-[#222] text-[#888]'}`}>
            {suggestedLots} <span className="ml-2 text-[10px] opacity-50 uppercase">Lots</span>
            {isRiskExcessive && <div className="ml-auto w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
            {!isRiskExcessive && isRiskTooHigh && <div className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            {!isRiskTooHigh && riskPercent > 0 && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />}
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] text-[#444] font-bold uppercase">Risque Monétaire</span>
            <span className={`text-[9px] font-mono ${isRiskExcessive ? 'text-red-600' : 'text-[#666]'}`}>
              -{monetaryRisk} €
            </span>
          </div>
        </div>

        {/* RISK SECTION */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-end">
            <label className="text-[10px] uppercase tracking-widest text-[#444] font-bold">
              Validation Sentinel
            </label>
            <span className={`text-[10px] font-bold uppercase ${isRiskExcessive ? 'text-red-600 animate-pulse' : isRiskTooHigh ? 'text-red-500' : 'text-slate-500'}`}>
              {isRiskExcessive ? 'RISQUE EXCESSIF' : isRiskTooHigh ? 'Risque Critique' : riskPercent > 2 ? 'Risque Élevé' : 'Risque Sécurisé'}
            </span>
          </div>
          <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getRiskColor()}`}
              style={{ width: `${Math.min(riskPercent * 10, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label className="text-[10px] uppercase tracking-widest text-[#444] font-bold">Stop Loss</label>
                <LucideLock size={8} className="text-[#F59E0B]" />
              </div>
              <span className="text-[8px] font-black text-[#F59E0B] uppercase tracking-widest">Hard-Lock Active</span>
            </div>
            <input 
              type="number"
              value={slPoints}
              onChange={(e) => setSlPoints(Number(e.target.value))}
              className="w-full h-9 bg-[#1A1A1A] border border-[#333] rounded px-3 text-[14px] text-[#F5F5F0] focus:border-[#555] outline-none transition-all font-mono"
              placeholder="Pips/Pts"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-[#444] font-bold">Take Profit</label>
            <input 
              type="number"
              value={tpPoints}
              onChange={(e) => setTpPoints(Number(e.target.value))}
              className="w-full h-9 bg-[#1A1A1A] border border-[#333] rounded px-3 text-[14px] text-[#F5F5F0] focus:border-[#555] outline-none transition-all font-mono"
              placeholder="Pips/Pts"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#222] mb-4" />

      {/* SIDE BY SIDE BUTTONS SECTION */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onExecute('SELL')}
            disabled={isDisabled}
            className="w-full h-[48px] bg-transparent border border-[#EF4444] rounded-[4px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group hover:bg-[#EF4444]/10"
          >
            <span className="text-[14px] font-bold text-[#EF4444] tracking-widest">SELL</span>
          </button>
          <div className="text-center text-[12px] font-mono text-[#666]">{prices.bid}</div>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onExecute('BUY')}
            disabled={isDisabled}
            className="w-full h-[48px] bg-transparent border border-[#22C55E] rounded-[4px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group hover:bg-[#22C55E]/10"
          >
            <span className="text-[14px] font-bold text-[#22C55E] tracking-widest">BUY</span>
          </button>
          <div className="text-center text-[12px] font-mono text-[#666]">{prices.ask}</div>
        </div>
      </div>
    </div>
  );
};
