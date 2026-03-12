
import React, { memo, useState, useMemo } from 'react';
import { Target, Activity, Monitor, Maximize2, Minimize2, Lock as LucideLock, ShieldCheck } from 'lucide-react';

interface Props {
  symbol: string;
  isLive?: boolean;
}

const TradingViewChart: React.FC<Props> = memo(({ symbol, isLive }) => {
  const [style, setStyle] = useState<'1' | '3'>('1'); // 1: Bougies, 3: Ligne/Area
  const [interval, setInterval] = useState('15');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mapping des symboles pour l'URL de l'iframe
  const tvSymbol = useMemo(() => {
    switch (symbol) {
      case 'BTC/USD': 
      case 'BTCUSD': return 'BINANCE:BTCUSDT';
      case 'ETH/USD':
      case 'ETHUSD': return 'BINANCE:ETHUSDT';
      case 'XAU/USD':
      case 'XAUUSD': 
      case 'GOLD': return 'OANDA:XAUUSD';
      case 'EUR/USD':
      case 'EURUSD': return 'FX:EURUSD';
      case 'GBP/USD':
      case 'GBPUSD': return 'FX:GBPUSD';
      case 'USD/JPY':
      case 'USDJPY': return 'FX:USDJPY';
      case 'US30': return 'BLACKBULL:US30';
      case 'NAS100':
      case 'USTEC': return 'OANDA:NAS100USD';
      case 'GER40':
      case 'DAX40': return 'OANDA:DE30EUR';
      default: return symbol.includes('/') ? symbol.replace('/', '') : symbol;
    }
  }, [symbol]);

  const iframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_oba&symbol=${tvSymbol}&interval=${interval}&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=0&saveimage=0&toolbarbg=020617&studies=[]&theme=dark&style=${style}&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=fr&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${tvSymbol}`;

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const timeframes = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1H', value: '60' },
    { label: '4H', value: '240' },
    { label: '1D', value: 'D' },
  ];

  return (
    <div className={`w-full h-full glass-panel border border-white/10 overflow-hidden bg-slate-950 relative group flex flex-col shadow-2xl transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[2000] rounded-none' : 'rounded-[2.5rem]'}`}>
      
      {/* HEADER TACTIQUE AVEC CONTRÔLES D'AFFICHAGE */}
      <div className="absolute top-4 lg:top-5 left-4 lg:left-5 right-4 lg:right-5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-cyan-500/20 flex items-center gap-2 lg:gap-3 shadow-2xl">
            <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-cyan-400'} animate-pulse shadow-[0_0_8px_${isLive ? '#34d399' : '#22d3ee'}]`} />
            <span className="text-[8px] lg:text-[10px] font-black text-white uppercase tracking-widest">{symbol}</span>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <div className="flex items-center gap-1">
              {isLive ? (
                <ShieldCheck size={10} className="text-emerald-500" />
              ) : (
                <LucideLock size={10} className="text-cyan-500/50" />
              )}
              <span className={`text-[7px] font-bold ${isLive ? 'text-emerald-500' : 'text-cyan-500/50'} uppercase tracking-widest`}>
                {isLive ? 'MT5 Direct Sync' : 'Sentinel Protected (SL Drag Disabled)'}
              </span>
            </div>
          </div>

          <div className="flex bg-slate-900/80 backdrop-blur-md rounded-xl p-1 border border-white/5 pointer-events-auto">
            {timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => setInterval(tf.value)}
                className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${
                  interval === tf.value ? 'bg-cyan-500 text-black' : 'text-slate-500 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex bg-slate-900/80 backdrop-blur-md rounded-xl p-1 border border-white/5">
            <button 
              onClick={() => setStyle('1')}
              className={`p-1.5 lg:px-3 lg:py-1.5 rounded-lg transition-all ${
                style === '1' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white'
              }`}
              title="Bougies"
            >
              <Target size={14} />
            </button>
            <button 
              onClick={() => setStyle('3')}
              className={`p-1.5 lg:px-3 lg:py-1.5 rounded-lg transition-all ${
                style === '3' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-white'
              }`}
              title="Ligne"
            >
              <Activity size={14} />
            </button>
          </div>
          
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 lg:p-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 text-slate-500 hover:text-white transition-all"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* IFRAME TRADINGVIEW DIRECTE */}
      <div className="flex-1 w-full h-full relative">
        <iframe
          id="tradingview_oba"
          src={iframeUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-700 pointer-events-auto"
          title="Thalamus Market Feed"
        />
        
        {/* SCANNER GRID OVERLAY EFFECT (Reduced opacity on mobile for visibility) */}
        <div className="absolute inset-0 pointer-events-none border border-cyan-500/5 shadow-[inset_0_0_60px_rgba(34,211,238,0.02)]" />
      </div>

      {/* STATUS FOOTER (Hidden on mobile) */}
      <div className="absolute bottom-5 left-8 z-10 hidden lg:group-hover:flex px-3 py-1.5 bg-slate-900/60 backdrop-blur-md rounded-lg border border-white/5 items-center gap-2 animate-in slide-in-from-left-2">
        <Monitor size={10} className="text-slate-500" />
        <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">OBA-QUANTUM_LIAISON_STABLE</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        iframe { filter: contrast(1.1) brightness(0.9) saturate(1.1); }
      `}} />
    </div>
  );
});

export default TradingViewChart;
