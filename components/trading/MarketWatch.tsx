import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, ArrowUpRight, ArrowDownRight, Activity, Zap, ShieldCheck, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketSymbol {
  name: string;
  bid: number;
  ask: number;
  spread: number;
  change?: number;
  category?: string;
}

interface MarketWatchProps {
  marketData: {
    symbols: MarketSymbol[];
    isLive: boolean;
    lastUpdate: number;
  } | null;
  onSelectSymbol: (symbol: string) => void;
  currentSymbol: string;
}

const MarketWatch: React.FC<MarketWatchProps> = ({ marketData, onSelectSymbol, currentSymbol }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('THALAMUS_FAVORITES');
    return saved ? JSON.parse(saved) : ['EURUSD', 'XAUUSD', 'BTCUSD'];
  });
  const [sortBy, setSortBy] = useState<'name' | 'spread'>('name');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [prevPrices, setPrevPrices] = useState<Record<string, number>>({});
  const [highlights, setHighlights] = useState<Record<string, 'up' | 'down' | null>>({});

  const categories = [
    { id: 'ALL', label: 'TOUS', icon: <Activity size={10} /> },
    { id: 'FAV', label: 'FAVORIS', icon: <Star size={10} /> },
    { id: 'FOREX', label: 'FOREX', icon: <Zap size={10} /> },
    { id: 'METAL', label: 'MATIÈRES PREM.', icon: <Zap size={10} /> },
    { id: 'INDEX', label: 'INDICES', icon: <Zap size={10} /> },
    { id: 'CRYPTO', label: 'CRYPTO', icon: <Zap size={10} /> },
  ];

  // Price change highlighting logic
  useEffect(() => {
    if (!marketData?.symbols) return;
    
    const newHighlights: Record<string, 'up' | 'down' | null> = {};
    const newPrevPrices: Record<string, number> = { ...prevPrices };

    marketData.symbols.forEach(s => {
      if (prevPrices[s.name] !== undefined) {
        if (s.bid > prevPrices[s.name]) newHighlights[s.name] = 'up';
        else if (s.bid < prevPrices[s.name]) newHighlights[s.name] = 'down';
      }
      newPrevPrices[s.name] = s.bid;
    });

    setHighlights(newHighlights);
    setPrevPrices(newPrevPrices);

    const timer = setTimeout(() => setHighlights({}), 500);
    return () => clearTimeout(timer);
  }, [marketData?.symbols]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const next = prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol];
      localStorage.setItem('THALAMUS_FAVORITES', JSON.stringify(next));
      return next;
    });
  };

  const sortedSymbols = useMemo(() => {
    if (!marketData?.symbols) return [];
    
    let filtered = marketData.symbols.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const isFavorite = favorites.includes(s.name);
      
      if (activeCategory === 'FAV') return matchesSearch && isFavorite;
      if (activeCategory === 'ALL') return matchesSearch;
      
      // Simple category heuristics if not provided by MT5
      const name = s.name.toUpperCase();
      if (activeCategory === 'FOREX') return matchesSearch && (name.includes('USD') || name.includes('EUR') || name.includes('GBP') || name.includes('JPY'));
      if (activeCategory === 'METAL') return matchesSearch && (name.includes('XAU') || name.includes('XAG') || name.includes('GOLD') || name.includes('SILVER'));
      if (activeCategory === 'INDEX') return matchesSearch && (name.includes('US30') || name.includes('NAS') || name.includes('GER') || name.includes('FRA') || name.includes('UK100'));
      if (activeCategory === 'CRYPTO') return matchesSearch && (name.includes('BTC') || name.includes('ETH') || name.includes('SOL') || name.includes('XRP'));
      
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      if (sortBy === 'spread') comparison = a.spread - b.spread;

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [marketData, search, favorites, sortBy, sortOrder, activeCategory]);

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
      <div className="p-2.5 border-b border-[#2B2F36] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-emerald-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Marchés MT5</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()} animate-pulse`} />
        </div>
      </div>

      {/* Search & Categories */}
      <div className="p-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={10} />
          <input 
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-[#2B2F36] rounded-md py-1.5 pl-8 pr-3 text-[9px] text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded border bg-white/[0.02] border-[#2B2F36] text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
          >
            <div className="flex items-center gap-2">
              {categories.find(c => c.id === activeCategory)?.icon}
              <span>{categories.find(c => c.id === activeCategory)?.label}</span>
            </div>
            <ChevronDown size={10} className={`transition-transform duration-300 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isCategoryMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 bg-[#0D0D0D] border border-[#2B2F36] rounded-lg shadow-2xl z-[100] overflow-hidden"
              >
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${
                      activeCategory === cat.id 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Symbols List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {sortedSymbols.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
              <Filter size={20} className="text-slate-700" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucun marché détecté</p>
              <p className="text-[8px] text-slate-600 uppercase leading-relaxed">
                Vérifiez votre MT5, le MarketWatch et l'EA ThalamusBridge.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#0B0E11] z-10">
              <tr className="border-b border-[#2B2F36]">
                <th className="p-2 text-[7px] font-bold text-slate-500 uppercase tracking-widest">Symbole</th>
                <th className="p-2 text-[7px] font-bold text-slate-500 uppercase tracking-widest text-right">Bid/Ask</th>
                <th className="p-2 text-[7px] font-bold text-slate-500 uppercase tracking-widest text-right">Spread</th>
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
                  <td className="p-2">
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(s.name); }}
                        className={`transition-colors ${favorites.includes(s.name) ? 'text-amber-500' : 'text-slate-700 group-hover:text-slate-500'}`}
                      >
                        <Star size={8} fill={favorites.includes(s.name) ? 'currentColor' : 'none'} />
                      </button>
                      <div>
                        <div className="text-[9px] font-bold text-white tracking-tight leading-none">{s.name}</div>
                        <div className={`text-[7px] flex items-center gap-0.5 mt-0.5 ${s.change && s.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {s.change && s.change >= 0 ? <ArrowUpRight size={6} /> : <ArrowDownRight size={6} />}
                          {(s.change || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className={`text-[9px] font-mono font-bold transition-colors duration-300 leading-none ${
                      highlights[s.name] === 'up' ? 'text-emerald-500' : 
                      highlights[s.name] === 'down' ? 'text-red-500' : 
                      'text-white'
                    }`}>
                      {s.bid.toFixed(5)}
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 mt-0.5">{s.ask.toFixed(5)}</div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-mono text-emerald-500/80 leading-none">{s.spread}</span>
                      <span className="text-[6px] text-slate-600 font-bold uppercase tracking-tighter mt-0.5">pts</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-black/20 border-t border-[#2B2F36]">
        <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Activité Broker</span>
          <span className="text-white">{marketData?.symbols.length || 0} Actifs</span>
        </div>
      </div>
    </div>
  );
};

export default MarketWatch;
