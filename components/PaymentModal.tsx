
import React, { useState } from 'react';
import { X, CreditCard, Coins, ShieldCheck, Zap, ArrowRight, Bitcoin, Wallet, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  onClose: () => void;
  lang?: Language;
}

const PaymentModal: React.FC<Props> = ({ onClose, lang = 'FR' }) => {
  const [method, setMethod] = useState<'CRYPTO' | 'CARD'>('CRYPTO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState('');
  const t = translations[lang];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      alert(lang === 'FR' ? "Transaction initialisée sur le réseau." : "Transaction initialized on the network.");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="glass-panel max-w-xl w-full p-10 rounded-[3rem] border-white/10 shadow-[0_0_100px_rgba(245,158,11,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse" />
        
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-2xl">
            <Zap size={32} className="text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">DÉVERROUILLER L'ACCÈS ELITE</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Initialisation du protocole de paiement sécurisé</p>
        </div>

        <div className="flex p-1 bg-slate-950 rounded-2xl border border-white/5 mb-8">
          <button 
            onClick={() => setMethod('CRYPTO')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'CRYPTO' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Coins size={14} /> CRYPTO PAY
          </button>
          <button 
            onClick={() => setMethod('CARD')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'CARD' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <CreditCard size={14} /> CREDIT CARD
          </button>
        </div>

        <form onSubmit={handlePay} className="space-y-6">
          {method === 'CRYPTO' ? (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div className="flex justify-center gap-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <Bitcoin className="text-amber-500" size={24} />
                  <span className="text-[8px] font-black text-slate-500">BTC</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="text-blue-400 font-bold text-lg">Ξ</div>
                  <span className="text-[8px] font-black text-slate-500">ETH</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="text-emerald-400 font-bold text-lg">₮</div>
                  <span className="text-[8px] font-black text-slate-500">USDT</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Wallet Address</label>
                <div className="relative">
                  <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter your source address..." 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950/60 p-5 pl-14 rounded-2xl border border-white/5 text-sm font-mono text-white outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              <p className="text-[9px] text-center text-amber-500/70 font-black uppercase tracking-widest leading-relaxed">
                <CheckCircle2 size={12} className="inline mr-2" />
                Accès instantané après confirmation sur la blockchain
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-center gap-8 py-4 bg-white/5 rounded-2xl border border-white/5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </div>

              <div className="space-y-4">
                <input required type="text" placeholder="Card Number" className="w-full bg-slate-950/60 p-5 rounded-2xl border border-white/5 text-sm font-mono text-white outline-none focus:border-amber-500/50" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="MM/YY" className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 text-sm font-mono text-white outline-none focus:border-amber-500/50" />
                  <input required type="text" placeholder="CVC" className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 text-sm font-mono text-white outline-none focus:border-amber-500/50" />
                </div>
              </div>

              <p className="text-[9px] text-center text-slate-500 font-black uppercase tracking-widest">
                <ShieldCheck size={12} className="inline mr-2 text-emerald-500" />
                Secure transaction via Stripe Gateway
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full py-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-[0.4em] rounded-2xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="animate-pulse">PROCESS_TX...</span>
            ) : (
              <>INITIALIZE TRANSACTION <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">OBA_SECURE_NODE_781</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
