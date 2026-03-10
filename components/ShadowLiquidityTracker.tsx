import React, { useState, useEffect, useMemo, memo } from 'react';
import { Radar, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  lang?: Language;
}

interface WhaleEvent {
  id: string;
  name: string;
  type: 'ACC' | 'DIST';
  amount: string;
  timestamp: string;
}

const WHALE_NAMES = [
  'MicroStrategy Node',
  'BlackRock Sub-Wallet 04',
  'Binance Cold Storage',
  'Jump Trading Aggregator',
  'Fidelity Digital Vault',
  'Grayscale Trust Node 12',
  'Ark Invest Liaison',
  'Founders Vault Shadow'
];

const ShadowLiquidityTracker: React.FC<Props> = memo(({ lang = 'FR' }) => {
  const [liquidity, setLiquidity] = useState(65);
  const [events, setEvents] = useState<WhaleEvent[]>([]);
  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      setLiquidity(prev => {
        const delta = (Math.random() - 0.48) * 3;
        return Math.max(5, Math.min(95, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const generateEvent = () => {
      if (document.hidden) return;
      const isAcc = Math.random() > 0.45;
      const amount = (Math.random() * 500 + 100).toFixed(0);
      const newEvent: WhaleEvent = {
        id: Math.random().toString(36).substr(2, 9),
        name: WHALE_NAMES[Math.floor(Math.random() * WHALE_NAMES.length)],
        type: isAcc ? 'ACC' : 'DIST',
        amount: isAcc ? `+${amount} BTC` : `-${amount} BTC`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 3)]);
    };

    const interval = setInterval(generateEvent, 4000);
    generateEvent();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-[2.5rem] border-purple-500/10 bg-purple-500/5 relative overflow-hidden group glow-purple h-full flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-[scan_4s_linear_infinite]" />
      
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Radar size={20} className="text-purple-400 animate-[spin_4s_linear_infinite]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">{t.whaleTracker}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
           <Zap size={10} className="text-purple-400 animate-pulse" />
           <span className="text-[8px] font-black text-purple-300 font-mono">LIVE</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-3 mb-6 overflow-hidden">
        {events.map((event, i) => (
          <div key={event.id} className={`p-3 rounded-2xl border transition-all duration-700 ${event.type === 'ACC' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`} style={{ opacity: 1 - i * 0.2 }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black text-white truncate max-w-[120px]">{event.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest ${event.type === 'ACC' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {event.type === 'ACC' ? t.accumulationMassive : t.distributionInst}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-black ${event.type === 'ACC' ? 'text-emerald-400' : 'text-red-400'}`}>{event.amount}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-[1px]">
           <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.4)]" style={{ width: `${liquidity}%` }} />
        </div>
      </div>
    </div>
  );
});

export default ShadowLiquidityTracker;