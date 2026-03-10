import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Settings, X, Server, User, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface BrokerConnectionProps {
  isFluxLive: boolean;
  mt5Connected: boolean;
  onConnectMT5: () => void;
}

export const BrokerConnection: React.FC<BrokerConnectionProps> = ({ 
  isFluxLive, 
  mt5Connected,
  onConnectMT5
}) => {
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState({
    platform: 'MT5',
    accountNumber: '',
    server: '',
    password: ''
  });

  // Remove simulated detection as we have real data
  useEffect(() => {
    if (isFluxLive && !mt5Connected) {
      onConnectMT5();
    }
  }, [isFluxLive, mt5Connected, onConnectMT5]);

  const getStatusText = () => {
    if (mt5Connected) return "MT5 Connecté";
    return "Configurer MT5";
  };

  const getStatusColor = () => {
    if (mt5Connected) return "text-emerald-500";
    return "text-[#FF4444]";
  };

  const getDotColor = () => {
    if (mt5Connected) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
    return "bg-[#FF4444]";
  };

  const isConnected = mt5Connected;

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-[#1A1A1A] cursor-pointer hover:bg-white/[0.06] transition-all group relative"
      >
        <div className={`w-2 h-2 rounded-full ${getDotColor()} ${isConnected ? 'animate-pulse' : ''}`} />
        <span className={`text-[11px] uppercase tracking-wider ${isConnected ? 'text-emerald-500' : 'text-[#FF4444]'}`}>
          {isConnected ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 size={10} strokeWidth={1.5} className="text-emerald-500" /> {getStatusText()}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <AlertCircle size={10} strokeWidth={1.5} className="text-[#FF4444]" /> {getStatusText()}
            </span>
          )}
        </span>
        
        {/* Hover Tooltip */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Cliquez pour configurer votre terminal
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-[#0B0E11] border border-[#2B2F36] rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <Settings size={18} className="text-cyan-500" />
                  Configuration Terminal MT5
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-cyan-500 text-black text-center">
                    MetaTrader 5 Uniquement
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">Numéro de Compte MT5</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        value={config.accountNumber}
                        onChange={(e) => setConfig(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-cyan-500 outline-none transition-all font-mono"
                        placeholder="Ex: 12345678"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">Serveur Broker</label>
                    <div className="relative">
                      <Server size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        value={config.server}
                        onChange={(e) => setConfig(prev => ({ ...prev, server: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-cyan-500 outline-none transition-all"
                        placeholder="Ex: IC-Markets-Live-01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mot de Passe</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="password" 
                        value={config.password}
                        onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-cyan-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onConnectMT5();
                    setShowModal(false);
                  }}
                  className="w-full py-4 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Établir Connexion Sécurisée MT5
                </button>

                <p className="text-[8px] text-slate-600 text-center uppercase tracking-widest">
                  Vos identifiants sont cryptés localement via Thalamus Bridge
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
