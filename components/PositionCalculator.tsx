
import React, { useState, useMemo, useEffect } from 'react';
import { Target, AlertTriangle, Calculator, Zap, ShieldCheck, Lock, Unlock, Save, Brain } from 'lucide-react';

interface Props {
  initialCapital?: number;
  assetName?: string;
  onSaveTrade?: (data: { asset: string, risk: number, direction: 'BUY' | 'SELL', emotion: 'COLD' | 'EXCITED' | 'FRUSTRATED' }) => void;
}

const PositionCalculator: React.FC<Props> = ({ initialCapital = 15446148, assetName = 'BTC/USD', onSaveTrade }) => {
  const [capital, setCapital] = useState<number>(initialCapital);
  const [riskPercent, setRiskPercent] = useState<number>(0.5);
  const [stopLoss, setStopLoss] = useState<number>(20);
  const [isRiskLocked, setIsRiskLocked] = useState(false);
  const [initialLockedRisk, setInitialLockedRisk] = useState<number | null>(null);
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [emotion, setEmotion] = useState<'COLD' | 'EXCITED' | 'FRUSTRATED'>('COLD');

  useEffect(() => {
    setCapital(initialCapital);
  }, [initialCapital]);

  const isExcessiveRisk = riskPercent > 3;
  const noStopLoss = stopLoss <= 0 || isNaN(stopLoss);

  const lotSize = useMemo(() => {
    if (noStopLoss) return 0;
    const amountToRisk = capital * (riskPercent / 100);
    const pipValue = assetName.includes('XAU') ? 1 : assetName.includes('US30') ? 1 : 10;
    return amountToRisk / (stopLoss * pipValue);
  }, [capital, riskPercent, stopLoss, assetName, noStopLoss]);

  const isDisciplineViolated = useMemo(() => {
    if (!isRiskLocked || initialLockedRisk === null) return false;
    return riskPercent > initialLockedRisk;
  }, [isRiskLocked, initialLockedRisk, riskPercent]);

  const handleLockRisk = () => {
    if (noStopLoss) return;
    setIsRiskLocked(!isRiskLocked);
    if (!isRiskLocked) {
      setInitialLockedRisk(riskPercent);
    }
  };

  const handleSave = () => {
    if (noStopLoss || isDisciplineViolated) return;
    if (onSaveTrade) {
      onSaveTrade({
        asset: assetName,
        risk: riskPercent,
        direction: direction,
        emotion: emotion
      });
    }
  };

  return (
    <div className={`glass-panel p-6 lg:p-8 rounded-[2.5rem] border-2 transition-all duration-500 shadow-2xl relative overflow-hidden ${
      noStopLoss ? 'border-red-600 bg-red-950/20' : 
      isDisciplineViolated ? 'border-orange-600 bg-orange-950/20 animate-pulse' :
      isRiskLocked ? 'border-emerald-500/30 bg-emerald-950/10' :
      'border-cyan-500/30 bg-slate-900/40'
    }`}>
      
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 pointer-events-none transition-colors duration-500 ${
        noStopLoss || isDisciplineViolated ? 'bg-red-600' : isRiskLocked ? 'bg-emerald-500' : 'bg-cyan-500'
      }`} />

      <div className="relative z-10 space-y-6 lg:space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator size={20} className={noStopLoss ? 'text-red-500' : isRiskLocked ? 'text-emerald-400' : 'text-cyan-400'} />
            <div className="flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Calculateur Tactique</h3>
              <span className={`text-[9px] font-black uppercase tracking-widest ${noStopLoss ? 'text-red-400' : isRiskLocked ? 'text-emerald-500' : 'text-cyan-500'}`}>
                {assetName} Target
              </span>
            </div>
          </div>
          <button 
            onClick={handleLockRisk}
            className={`p-3 rounded-xl transition-all ${isRiskLocked ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          >
            {isRiskLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </header>

        <div className="space-y-5 lg:space-y-6">
          <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
            <button onClick={() => setDirection('BUY')} className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${direction === 'BUY' ? 'bg-emerald-600 text-slate-950 shadow-lg' : 'text-slate-500'}`}>ACHAT</button>
            <button onClick={() => setDirection('SELL')} className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${direction === 'SELL' ? 'bg-red-600 text-slate-950 shadow-lg' : 'text-slate-500'}`}>VENTE</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Risque (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={riskPercent} 
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className={`w-full bg-black/40 border p-4.5 rounded-xl text-sm font-mono outline-none transition-all ${
                  isDisciplineViolated ? 'border-red-500 text-red-500' : 
                  'border-white/5 text-white focus:border-cyan-500/30'
                }`}
              />
            </div>
            
            <div className="space-y-2">
              <label className={`text-[9px] font-black uppercase tracking-widest ml-2 ${noStopLoss ? 'text-red-500' : 'text-slate-500'}`}>
                Stop Loss *
              </label>
              <input 
                type="number" 
                value={stopLoss} 
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className={`w-full bg-black/40 border p-4.5 rounded-xl text-sm font-mono outline-none transition-all ${
                  noStopLoss ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-white/5 text-white focus:border-cyan-500/30'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <Brain size={12} /> État Émotionnel
            </label>
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              <button onClick={() => setEmotion('COLD')} className={`py-4 text-[8px] font-black uppercase tracking-widest rounded-xl border transition-all ${emotion === 'COLD' ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-lg' : 'bg-black/20 border-white/5 text-slate-600'}`}>Froid</button>
              <button onClick={() => setEmotion('EXCITED')} className={`py-4 text-[8px] font-black uppercase tracking-widest rounded-xl border transition-all ${emotion === 'EXCITED' ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-lg' : 'bg-black/20 border-white/5 text-slate-600'}`}>Excité</button>
              <button onClick={() => setEmotion('FRUSTRATED')} className={`py-4 text-[8px] font-black uppercase tracking-widest rounded-xl border transition-all ${emotion === 'FRUSTRATED' ? 'bg-red-600/20 border-red-500 text-red-400 shadow-lg' : 'bg-black/20 border-white/5 text-slate-600'}`}>Frustré</button>
            </div>
          </div>
        </div>

        <div className={`p-6 lg:p-8 rounded-[2rem] border transition-all duration-500 text-center space-y-2 relative group ${
          noStopLoss ? 'bg-red-600/10 border-red-500/30' : 
          isDisciplineViolated ? 'bg-orange-600/10 border-orange-500/30' :
          'bg-slate-950/60 border-white/5 shadow-inner'
        }`}>
          {!noStopLoss && !isDisciplineViolated && (
            <div className="absolute top-2 right-4 flex items-center gap-1.5">
               <ShieldCheck size={12} className="text-emerald-400" />
               <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">VÉRIFIÉ</span>
            </div>
          )}
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Volume Recommandé</span>
          <div className={`text-4xl lg:text-5xl font-black italic tracking-tighter ${noStopLoss ? 'text-red-500 opacity-20' : isDisciplineViolated ? 'text-orange-500' : 'text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {noStopLoss ? '0.00' : lotSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleSave}
            disabled={noStopLoss || isDisciplineViolated}
            className={`w-full py-5 lg:py-6 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.4em] transition-all italic shadow-2xl ${
              noStopLoss || isDisciplineViolated ? 'bg-slate-900 text-slate-700 cursor-not-allowed opacity-50' : 'bg-white text-slate-950 hover:bg-cyan-500 hover:scale-[1.02] active:scale-95'
            }`}
          >
            <Save size={18} /> ENREGISTRER LE COMBAT
          </button>
          
          <p className="text-[7px] lg:text-[8px] font-bold text-slate-600 uppercase text-center leading-tight tracking-[0.2em] opacity-60">
            Note : L'enregistrement dans Thalamus ne constitue pas une exécution réelle d'ordre.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PositionCalculator;
