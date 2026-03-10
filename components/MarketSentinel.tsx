
import React, { useState, useEffect, memo } from 'react';
import { TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';

interface AssetData {
  symbol: string;
  label: string;
  price: number;
  change: number;
  strength: number; // 0 to 100
  history: number[];
}

interface Props {
  onSelectAsset: (symbol: string) => void;
  activeAsset: string;
}

const INITIAL_ASSETS: AssetData[] = [
  { symbol: 'BTC/USD', label: 'BITCOIN', price: 98472.15, change: 1.2, strength: 78, history: [40, 45, 42, 48, 46, 52, 50] },
  { symbol: 'XAU/USD', label: 'GOLD', price: 2742.45, change: -0.4, strength: 45, history: [60, 58, 55, 52, 54, 51, 49] },
  { symbol: 'EUR/USD', label: 'EURO', price: 1.0842, change: 0.15, strength: 62, history: [30, 32, 31, 35, 34, 38, 37] },
  { symbol: 'US30', label: 'DOW JONES', price: 44215.80, change: 0.85, strength: 85, history: [20, 25, 30, 28, 35, 40, 45] },
];

const MarketSentinel: React.FC<Props> = memo(({ onSelectAsset, activeAsset }) => {
  const [assets, setAssets] = useState<AssetData[]>(INITIAL_ASSETS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const move = (Math.random() - 0.5) * (asset.price * 0.0005);
        const newPrice = asset.price + move;
        const newHistory = [...asset.history.slice(1), 30 + Math.random() * 40];
        return {
          ...asset,
          price: newPrice,
          change: asset.change + (move / asset.price) * 100,
          history: newHistory,
          strength: Math.min(100, Math.max(0, asset.strength + (Math.random() - 0.5) * 5))
        };
      }));
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/80 border-b border-white/5 backdrop-blur-md overflow-hidden shrink-0 z-40">
      <div className="flex divide-x divide-white/5">
        <div className="px-6 py-4 flex items-center gap-3 bg-cyan-500/5 border-r border-cyan-500/20 shrink-0">
          <Zap size={16} className="text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Market Sentinel</span>
        </div>
        <div className="flex-1 flex overflow-x-auto scrollbar-hide">
          {assets.map((asset) => (
            <button
              key={asset.symbol}
              onClick={() => onSelectAsset(asset.symbol)}
              className={`flex-1 min-w-[220px] px-8 py-5 flex flex-col justify-center transition-all relative group ${activeAsset === asset.symbol ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex flex-col text-left">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${activeAsset === asset.symbol ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{asset.label}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-mono font-black text-white italic tracking-tighter">
                      {asset.symbol === 'EUR/USD' ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${asset.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Alpha Strength</span>
                  <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div 
                      className={`h-full transition-all duration-1000 rounded-full ${activeAsset === asset.symbol ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-600'}`}
                      style={{ width: `${asset.strength}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="w-full h-5 mt-1 opacity-20 group-hover:opacity-60 transition-opacity">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path
                    d={`M ${asset.history.map((h, i) => `${(i / (asset.history.length - 1)) * 100} ${20 - (h / 100) * 20}`).join(' L ')}`}
                    fill="none"
                    stroke={asset.change >= 0 ? '#10b981' : '#ef4444'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>

              {/* BORDURE BRILLANTE FOCUS */}
              {activeAsset === asset.symbol && (
                <>
                  <div className="absolute inset-0 border-b-2 border-cyan-400 pointer-events-none shadow-[0_4px_15px_-3px_rgba(34,211,238,0.3)] animate-in fade-in duration-500" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 animate-pulse rounded-bl-lg shadow-[0_0_10px_#22d3ee]" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MarketSentinel;
