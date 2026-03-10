
import React, { useState } from 'react';
import { X, Link as LinkIcon, RefreshCw, Terminal, Monitor, Server, Lock, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  onClose: () => void;
  onSuccess: (details: {id: string, type: 'REAL' | 'DEMO', method: string, platform: string, server: string, status: 'WAITING' | 'CONNECTED'}) => void;
  lang?: Language;
}

const AccountLinkModal: React.FC<Props> = ({ onClose, onSuccess, lang = 'FR' }) => {
  const [isLinking, setIsLinking] = useState(false);
  const [platform, setPlatform] = useState<'MT5' | 'WEB'>('MT5');
  const [formData, setFormData] = useState({ accountId: '', password: '', server: '' });
  const t = translations[lang];

  const isFormValid = formData.server.trim() !== '' && formData.accountId.trim() !== '' && formData.password.trim() !== '';

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLinking(true);
    
    // Simulation du Handshake Neural Quantique (3 secondes)
    setTimeout(() => {
      onSuccess({ 
        id: formData.accountId, 
        type: 'REAL', 
        method: 'DIRECT', 
        platform: platform,
        server: formData.server,
        status: 'WAITING'
      });
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="glass-panel max-w-xl w-full p-10 rounded-[3rem] border-white/10 shadow-[0_0_100px_rgba(34,211,238,0.1)] relative overflow-hidden group">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <LinkIcon size={28} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">OBA NODE LIAISON</h2>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocole de réception des flux MT5</p>
          
          <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">SSL ENCRYPTED</span>
          </div>
        </div>

        {isLinking ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6">
            <RefreshCw size={60} className="text-cyan-400 animate-spin" />
            <p className="text-xl font-black text-white animate-pulse uppercase italic">
              LIAISON LIVE EN COURS...
            </p>
          </div>
        ) : (
          <form onSubmit={handleLink} className="space-y-4 relative z-10">
            
            <div className="grid grid-cols-2 gap-3 mb-2">
              {['MT5', 'WEB'].map((p) => (
                <button 
                  key={p}
                  type="button" 
                  onClick={() => setPlatform(p as any)}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${platform === p ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg' : 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60'}`}
                >
                  <Terminal size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{p}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Server className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input required type="text" placeholder="Serveur Broker" value={formData.server} onChange={e => setFormData({...formData, server: e.target.value})} className="w-full bg-slate-950/60 p-4 pl-14 rounded-2xl border border-white/5 text-sm font-mono text-white outline-none focus:border-cyan-500/30" />
              </div>
              
              <div className="relative">
                <Monitor className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input required type="text" placeholder="Account ID" value={formData.accountId} onChange={e => setFormData({...formData, accountId: e.target.value})} className="w-full bg-slate-950/60 p-4 pl-14 rounded-2xl border border-white/5 text-sm font-mono text-white outline-none focus:border-cyan-500/30" />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input required type="password" placeholder="Mot de Passe Master" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/60 p-4 pl-14 rounded-2xl border border-white/5 text-sm font-mono text-white outline-none focus:border-cyan-500/30" />
              </div>

              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <p className="text-[9px] text-blue-400/80 font-medium leading-relaxed uppercase tracking-tight text-center">
                  Vos données de solde seront synchronisées via un webhook sécurisé.
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!isFormValid}
              className={`w-full py-5 font-black text-xs uppercase tracking-[0.4em] rounded-2xl transition-all shadow-xl ${
                isFormValid ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
              }`}
            >
              ACTIVER LA RÉCEPTION LIVE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountLinkModal;
