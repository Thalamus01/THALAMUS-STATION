
import React from 'react';
import { ShieldAlert, Key, MessageCircle, ArrowRight, XCircle } from 'lucide-react';

interface Props {
  reason: 'NOT_FOUND' | 'INACTIVE' | 'EXPIRED';
  syncId: string;
  onRetry: () => void;
}

const LicenseExpiredPage: React.FC<Props> = ({ reason, syncId, onRetry }) => {
  const messages = {
    NOT_FOUND: "ID de synchronisation non reconnu par Thalamus.",
    INACTIVE: "Votre accès a été suspendu par l'administrateur.",
    EXPIRED: "Votre licence Thalamus OBA a expiré."
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#020617] flex items-center justify-center p-6 text-white font-mono">
      <div className="max-w-xl w-full glass-panel p-10 lg:p-14 rounded-[3rem] border border-red-500/20 bg-red-500/5 shadow-[0_0_100px_rgba(239,68,68,0.1)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-10 shadow-2xl">
          <ShieldAlert size={48} className="text-red-500 animate-bounce" />
        </div>

        <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-4">ACCÈS VERROUILLÉ</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic">Security Protocol OBA-28-LOCK</p>

        <div className="p-6 bg-slate-950/60 rounded-2xl border border-white/5 mb-10 text-left space-y-4">
          <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">
            <span>Terminal ID</span>
            <span className="text-red-400">{syncId}</span>
          </div>
          <p className="text-xs font-bold text-slate-300 leading-relaxed italic uppercase">
            {messages[reason]} Veuillez contacter votre fournisseur pour renouveler votre accès aux flux neuronaux.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a 
            href="#" 
            className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-red-500 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            CONTACTER LE SUPPORT <MessageCircle size={16} />
          </a>
          <button 
            onClick={onRetry}
            className="w-full py-4 text-slate-500 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Key size={12} /> Tenter une nouvelle liaison
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseExpiredPage;
