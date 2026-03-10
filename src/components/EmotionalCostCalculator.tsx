import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingDown, AlertTriangle, Share2, ChevronRight, Upload } from 'lucide-react';

export const EmotionalCostCalculator: React.FC = () => {
  const [step, setStep] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [data, setData] = useState({
    capital: 10000,
    monthlyTrades: 20,
    avgLoss: 200,
    emotionalTrades: 30 // % of trades that are emotional
  });

  const calculateCost = () => {
    const emotionalCount = (data.monthlyTrades * data.emotionalTrades) / 100;
    const monthlyCost = emotionalCount * data.avgLoss;
    const yearlyCost = monthlyCost * 12;
    return { monthlyCost, yearlyCost };
  };

  const { monthlyCost, yearlyCost } = calculateCost();

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <AnimatePresence mode="wait">
        {step === 'INPUT' ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest">
                <AlertTriangle size={10} />
                Analyse de Vulnérabilité
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Calculateur de <br /> <span className="text-red-500">Coût Émotionnel</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Combien vos biais vous coûtent-ils réellement ?</p>
            </div>

            <div className="space-y-8 p-8 rounded-3xl bg-white/[0.02] border border-[#2B2F36]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest">Capital de Trading</label>
                    <span className="text-xs font-mono text-slate-400">${data.capital.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="1000" max="100000" step="1000"
                    value={data.capital}
                    onChange={(e) => setData({...data, capital: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest">Trades par Mois</label>
                    <span className="text-xs font-mono text-slate-400">{data.monthlyTrades}</span>
                  </div>
                  <input 
                    type="range" min="5" max="100" step="5"
                    value={data.monthlyTrades}
                    onChange={(e) => setData({...data, monthlyTrades: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest">Perte Moyenne (Emotion)</label>
                    <span className="text-xs font-mono text-slate-400">${data.avgLoss}</span>
                  </div>
                  <input 
                    type="range" min="50" max="2000" step="50"
                    value={data.avgLoss}
                    onChange={(e) => setData({...data, avgLoss: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest">% de Trades Émotionnels</label>
                    <span className="text-xs font-mono text-slate-400">{data.emotionalTrades}%</span>
                  </div>
                  <input 
                    type="range" min="5" max="100" step="5"
                    value={data.emotionalTrades}
                    onChange={(e) => setData({...data, emotionalTrades: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <button 
                  onClick={() => setStep('RESULT')}
                  className="w-full py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-400 transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                >
                  Calculer l'Impact Financier
                </button>
                <div className="flex items-center justify-center gap-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                  <Upload size={10} />
                  Ou uploader votre historique CSV (MetaTrader/TradingView)
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Verdict <br /> <span className="text-red-500">Financier</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">L'hémorragie invisible de votre capital</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-[#2B2F36] text-center space-y-2">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Perte Mensuelle</span>
                <div className="text-4xl font-black text-white tracking-tighter">${monthlyCost.toLocaleString()}</div>
              </div>
              <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/30 text-center space-y-2">
                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Perte Annuelle</span>
                <div className="text-4xl font-black text-white tracking-tighter">${yearlyCost.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-6">
              <div className="flex items-center gap-3 text-emerald-500">
                <Brain size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Solution Thalamus</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed uppercase font-bold tracking-widest">
                Sentinel aurait détecté 92% de ces trades émotionnels avant leur exécution. <br />
                Économie potentielle : <span className="text-emerald-500">${(yearlyCost * 0.92).toLocaleString()} / an</span>.
              </p>
              <button className="w-full py-4 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Rejoindre la Liste d'Attente Prioritaire
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                <Share2 size={14} />
                Partager mon résultat (Anonyme)
              </button>
              <button 
                onClick={() => setStep('INPUT')}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Refaire le test
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
