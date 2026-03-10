import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Lock, ShieldCheck, Unplug, Target, Zap, Activity } from 'lucide-react';
import { Vitals, Portfolio, TradeAttempt, ValidationResult } from '../types';
import { calculatePortfolioRisk, getEffectiveRiskLimit } from '../constants';
import { getBehavioralNudge } from '../geminiService';
import { Language, translations } from '../i18n';
import CardiacCoherence from './CardiacCoherence';

interface Props {
  vitals: Vitals;
  portfolio: Portfolio;
  connectionStatus: 'disconnected' | 'linked';
  accountType?: 'REAL' | 'DEMO';
  lang?: Language;
  onTradeExecuted: (trade: TradeAttempt) => void;
}

const TradePanel: React.FC<Props> = ({ vitals, portfolio, connectionStatus, accountType, lang = 'FR', onTradeExecuted }) => {
  const [symbol, setSymbol] = useState('BTC/USD');
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(98450.20);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);

  const t = translations[lang];
  
  // RÈGLE CRITIQUE PHYSIOLOGIQUE : Verrouillage si RMSSD < 40 ou HR > 100
  const isNeuralLocked = vitals.heartRate > 100 || vitals.rmssd < 40 || vitals.killSwitchActive;
  const isDisconnected = connectionStatus === 'disconnected';
  
  const riskContext = calculatePortfolioRisk(portfolio);
  const effectiveLimit = getEffectiveRiskLimit(vitals.readinessScore, portfolio.equity);

  const handleAction = async (side: 'BUY' | 'SELL') => {
    if (isNeuralLocked || isDisconnected) return;
    
    setIsValidating(true);
    const trade: TradeAttempt = { symbol, side, amount, price };
    
    const issues: string[] = [];
    if (vitals.stressLevel === 'High') issues.push("Stress cortical détecté");
    if (vitals.rmssd < 45) issues.push("Résilience HRV faible");
    if (riskContext.varPercentage > effectiveLimit) issues.push("Risque portfolio excessif");
    
    try {
      const nudge = await getBehavioralNudge(vitals, trade, issues, lang as Language);
      setLastValidation({ 
        allowed: !isNeuralLocked, 
        behavioralNudge: nudge 
      });

      if (!isNeuralLocked) {
        onTradeExecuted(trade);
      }
    } catch (e) {
      console.error("Audit failed", e);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className={`glass-panel p-8 lg:p-10 rounded-[3rem] border-2 transition-all duration-700 relative overflow-hidden ${isNeuralLocked ? 'border-red-500/40 bg-red-500/5' : 'border-white/10'}`}>
      
      {/* OVERLAY DÉCONNEXION */}
      {isDisconnected && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-[40] flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
          <Unplug size={64} className="text-cyan-400 mb-6 animate-pulse" />
          <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Terminal non lié</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            Établissez une liaison "Neural Handshake" via le header pour débloquer l'exécution.
          </p>
        </div>
      )}

      {/* OVERLAY NEURAL LOCK */}
      {!isDisconnected && isNeuralLocked && (
        <div className="absolute top-0 right-0 p-6 z-10">
           <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/40 animate-pulse">
              <Lock size={14} className="text-red-400" />
              <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">NEURAL LOCK</span>
           </div>
        </div>
      )}

      <div className="space-y-8 relative z-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{t.strikeTerminal}</h3>
            <input 
              type="text" 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
              className="bg-transparent text-4xl font-mono font-black text-white outline-none tracking-tighter italic border-b-2 border-transparent focus:border-cyan-500/30 transition-all w-full uppercase" 
            />
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">MARKET_MODE</span>
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-lg border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-black text-emerald-400">OPEN</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">AMOUNT</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-xl font-mono text-white outline-none focus:border-cyan-500/20" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">PRICE ($)</label>
            <div className="w-full bg-slate-950/30 p-4 rounded-2xl border border-white/5 text-xl font-mono text-slate-400 flex items-center justify-between">
              {price.toLocaleString()}
              <Target size={16} className="opacity-30" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4">
          <button 
            disabled={isNeuralLocked || isDisconnected}
            onClick={() => handleAction('BUY')} 
            className={`group relative py-6 rounded-2xl font-black uppercase text-sm italic tracking-[0.2em] transition-all shadow-xl active:scale-95 flex flex-col items-center justify-center gap-2 ${isNeuralLocked ? 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-500/20'}`}
          >
            <div className="flex items-center gap-2">
               <TrendingUp size={18} /> BUY
            </div>
            <span className="text-[8px] font-bold opacity-50 tracking-widest">BULL_ENGAGEMENT</span>
          </button>
          
          <button 
            disabled={isNeuralLocked || isDisconnected}
            onClick={() => handleAction('SELL')} 
            className={`group relative py-6 rounded-2xl font-black uppercase text-sm italic tracking-[0.2em] transition-all shadow-xl active:scale-95 flex flex-col items-center justify-center gap-2 ${isNeuralLocked ? 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-slate-950 shadow-red-500/20'}`}
          >
            <div className="flex items-center gap-2">
               <TrendingDown size={18} /> SELL
            </div>
            <span className="text-[8px] font-bold opacity-50 tracking-widest">BEAR_EXECUTION</span>
          </button>
        </div>

        {isValidating && (
          <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex items-center justify-center gap-4 animate-pulse">
            <RefreshCw size={20} className="text-cyan-400 animate-spin" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">AUDIT PHYSIOLOGIQUE_IA...</span>
          </div>
        )}

        {lastValidation && !isValidating && (
          <div className="animate-in slide-in-from-top-4 duration-500">
             <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/5 relative group">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-black text-cyan-400 uppercase tracking-widest">
                   THALAMUS_NUDGE
                </div>
                <p className="text-[11px] text-slate-300 italic leading-relaxed font-medium">
                  "{lastValidation.behavioralNudge}"
                </p>
                {isNeuralLocked && (
                  <button 
                    onClick={() => setShowBreathing(true)}
                    className="mt-4 flex items-center gap-2 text-[9px] font-black text-amber-400 uppercase tracking-widest hover:text-amber-300 transition-colors"
                  >
                    <Activity size={14} className="animate-pulse" /> Lancer protocole de stabilisation
                  </button>
                )}
             </div>
          </div>
        )}
      </div>

      {showBreathing && <CardiacCoherence onClose={() => setShowBreathing(false)} lang={lang} />}
    </div>
  );
};

export default TradePanel;