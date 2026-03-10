import React, { useState, useMemo } from 'react';
import { Search, Star, ArrowUpRight, ArrowDownRight, Activity, Zap, ShieldCheck } from 'lucide-react';
import { MT5MarketData, MT5MarketSymbol } from '../../src/hooks/useMT5';

interface MarketWatchProps {
  marketData: MT5MarketData | null;
  onSelectSymbol: (symbol: string) => void;
  currentSymbol: string;
}

const MarketWatch: React.FC<MarketWatchProps> = ({ marketData, onSelectSymbol, currentSymbol }) => {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('THALAMUS_FAVORITES');
    return saved ? JSON.parse(saved) : ['EURUSD', 'XAUUSD', 'BTCUSD'];
  });
  const [sortBy, setSortBy] = useState<'name' | 'volume' | 'spread'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const next = prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol];
      localStorage.setItem('THALAMUS_FAVORITES', JSON.stringify(next));
      return next;
    });
  };

  const sortedSymbols = useMemo(() => {
    if (!marketData?.symbols) return [];
    
    let filtered = marketData.symbols.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      // Favorites always on top
      const aFav = favorites.includes(a.name);
      const bFav = favorites.includes(b.name);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      if (sortBy === 'volume') comparison = b.volume - a.volume;
      if (sortBy === 'spread') comparison = a.spread - b.spread;

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [marketData, search, favorites, sortBy, sortOrder]);

  const getStatusColor = () => {
    if (!marketData) return 'bg-red-500';
    const age = (Date.now() - marketData.lastUpdate) / 1000;
    if (age < 2) return 'bg-emerald-500';
    if (age < 5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0E11] border-l border-[#2B2F36]">
      {/* Header */}
      <div className="p-4 border-b border-[#2B2F36] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-500" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Marchés MT5</h3>
        </div>
        <div className="flex items-center gap-2">
          {marketData?.isLive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck size={10} className="text-emerald-500" />
              <span className="text-[8px] font-bold text-emerald-500 uppercase">Connexion Directe MT5</span>
            </div>
          )}
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
          <input 
            type="text"
            placeholder="Rechercher un actif..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-[#2B2F36] rounded-lg py-2 pl-9 pr-4 text-[10px] text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          {(['name', 'volume', 'spread'] as const).map(key => (
            <button
              key={key}
              onClick={() => {
                if (sortBy === key) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                else { setSortBy(key); setSortOrder('asc'); }
              }}
              className={`flex-1 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-tighter border transition-all ${
                sortBy === key 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                  : 'bg-white/[0.02] border-[#2B2F36] text-slate-500 hover:text-slate-300'
              }`}
            >
              {key} {sortBy === key && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          ))}
        </div>
      </div>

      {/* Symbols List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0B0E11] z-10">
            <tr className="border-b border-[#2B2F36]">
              <th className="p-3 text-[8px] font-bold text-slate-500 uppercase tracking-widest">Symbole</th>
              <th className="p-3 text-[8px] font-bold text-slate-500 uppercase tracking-widest text-right">Bid/Ask</th>
              <th className="p-3 text-[8px] font-bold text-slate-500 uppercase tracking-widest text-right">Spread</th>
            </tr>
          </thead>
          <tbody>
            {sortedSymbols.map((s) => (
              <tr 
                key={s.name}
                onClick={() => onSelectSymbol(s.name)}
                className={`group cursor-pointer border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors ${
                  currentSymbol === s.name ? 'bg-emerald-500/[0.05]' : ''
                }`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(s.name); }}
                      className={`transition-colors ${favorites.includes(s.name) ? 'text-amber-500' : 'text-slate-700 group-hover:text-slate-500'}`}
                    >
                      <Star size={10} fill={favorites.includes(s.name) ? 'currentColor' : 'none'} />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-white tracking-tight">{s.name}</div>
                      <div className={`text-[8px] flex items-center gap-0.5 ${s.change && s.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {s.change && s.change >= 0 ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
                        {s.change?.toFixed(3)}%
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="text-[10px] font-mono text-white">{s.bid.toFixed(5)}</div>
                  <div className="text-[9px] font-mono text-slate-500">{s.ask.toFixed(5)}</div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-emerald-500/80">{s.spread}</span>
                    <span className="text-[7px] text-slate-600 font-bold uppercase tracking-tighter">pts</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-black/20 border-t border-[#2B2F36]">
        <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Activité</span>
          <span className="text-white">{marketData?.symbols.length || 0} Actifs</span>
        </div>
      </div>
    </div>
  );
};

export default MarketWatch;
