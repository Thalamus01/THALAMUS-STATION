
import React, { useState, useMemo } from 'react';
import { Search, Star, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Menu, X } from 'lucide-react';
import { useMT5 } from '../../src/hooks/useMT5';

interface MarketItem {
  symbol: string;
  bid: number;
  ask: number;
  change: number;
  group: string;
  isFavorite?: boolean;
}

interface Props {
  symbols: string[];
  currentAsset: string;
  onSelectSymbol: (symbol: string) => void;
  onDoubleClickSymbol: (symbol: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const MarketsDrawer: React.FC<Props> = ({ 
  symbols,
  currentAsset, 
  onSelectSymbol, 
  onDoubleClickSymbol,
  isOpen,
  onToggle
}) => {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['EURUSD', 'GBPUSD', 'XAUUSD']);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['FOREX', 'INDICES', 'CRYPTO', 'COMMODITIES']);
  
  const { ticks } = useMT5(symbols);

  const toggleFavorite = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);
  };

  const filteredMarkets = useMemo(() => {
    const tickList = Object.values(ticks) as any[];
    return tickList.filter(m => m.symbol.toLowerCase().includes(search.toLowerCase()));
  }, [ticks, search]);

  const groups = Array.from(new Set((Object.values(ticks) as any[]).map(t => t.group)));

  return (
    <div className={`h-full bg-[#0D0D0D] border-r border-[#1A1A1A] transition-all duration-300 flex flex-col z-40 ${isOpen ? 'w-[240px]' : 'w-0 overflow-hidden'}`}>
      {/* HEADER */}
      <div className="p-4 border-b border-[#1A1A1A] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Menu size={16} className="text-[#F59E0B]" />
          <span className="text-[12px] font-black uppercase tracking-widest text-[#F5F5F0]">Marchés</span>
        </div>
        <button onClick={onToggle} className="text-[#444] hover:text-[#888]">
          <X size={16} />
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-3 shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input 
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-[#1A1A1A] border border-[#222] rounded px-9 text-[13px] text-[#F5F5F0] focus:border-[#333] outline-none transition-all"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* FAVORITES */}
        {favorites.length > 0 && !search && (
          <div className="mb-4">
            <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-black text-[#444] uppercase tracking-widest">
              <Star size={10} className="text-[#F59E0B]" fill="#F59E0B" />
              Favoris
            </div>
            {filteredMarkets.filter(m => favorites.includes(m.symbol)).map(market => (
              <MarketRow 
                key={market.symbol}
                market={market}
                isActive={currentAsset === market.symbol}
                isFavorite={true}
                onSelect={() => onSelectSymbol(market.symbol)}
                onDoubleClick={() => onDoubleClickSymbol(market.symbol)}
                onToggleFavorite={(e) => toggleFavorite(e, market.symbol)}
              />
            ))}
          </div>
        )}

        {/* GROUPS */}
        {groups.map(group => {
          const groupMarkets = filteredMarkets.filter(m => m.group === group);
          if (groupMarkets.length === 0) return null;
          const isExpanded = expandedGroups.includes(group);

          return (
            <div key={group} className="mb-2">
              <button 
                onClick={() => toggleGroup(group)}
                className="w-full px-4 py-2 flex items-center justify-between text-[10px] font-black text-[#444] uppercase tracking-widest hover:text-[#666]"
              >
                <span>{group}</span>
                {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
              {isExpanded && groupMarkets.map(market => (
                <MarketRow 
                  key={market.symbol}
                  market={market}
                  isActive={currentAsset === market.symbol}
                  isFavorite={favorites.includes(market.symbol)}
                  onSelect={() => onSelectSymbol(market.symbol)}
                  onDoubleClick={() => onDoubleClickSymbol(market.symbol)}
                  onToggleFavorite={(e) => toggleFavorite(e, market.symbol)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface RowProps {
  market: MarketItem;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const MarketRow: React.FC<RowProps> = ({ market, isActive, isFavorite, onSelect, onDoubleClick, onToggleFavorite }) => {
  return (
    <div 
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      className={`group px-4 py-3 flex items-center justify-between cursor-pointer transition-all border-l-[3px] ${
        isActive ? 'bg-[#1A1A1A] border-[#F59E0B]' : 'bg-transparent border-transparent hover:bg-[#1A1A1A]'
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#FFF]">{market.symbol}</span>
          <button onClick={onToggleFavorite} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isFavorite ? 'opacity-100 text-[#F59E0B]' : 'text-[#444]'}`}>
            <Star size={10} fill={isFavorite ? '#F59E0B' : 'transparent'} />
          </button>
        </div>
        <div className={`flex items-center gap-1 text-[12px] ${market.change >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {market.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span>{market.change >= 0 ? '+' : ''}{(market.change || 0).toFixed(2)}%</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[14px] font-mono text-[#FFF]">{(market.ask || 0).toFixed(5)}</span>
        <span className="text-[12px] font-mono text-[#888]">{(market.bid || 0).toFixed(5)}</span>
      </div>
    </div>
  );
};
