
import React, { useState } from 'react';
import { Watch, Smartphone, X, RefreshCw, Bluetooth, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  onClose: () => void;
  onSuccess: (details: {model: string, source: string}) => void;
  lang?: Language;
}

const BiometricBridgeModal: React.FC<Props> = ({ onClose, onSuccess, lang = 'FR' }) => {
  const [step, setStep] = useState<'selection' | 'pairing'>('selection');
  const [selectedBrand, setSelectedBrand] = useState<'HUAWEI' | 'APPLE'>('HUAWEI');
  const t = translations[lang];

  const handlePairing = () => {
    setStep('pairing');
    setTimeout(() => {
      onSuccess({ model: `${selectedBrand} WATCH`, source: 'OBA Bio-Bridge' });
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="glass-panel max-w-lg w-full p-10 rounded-[3rem] border-white/10 shadow-[0_0_150px_rgba(16,185,129,0.1)] relative overflow-hidden group">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Watch size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">{t.biometricBridge}</h2>
        </div>

        {step === 'selection' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setSelectedBrand('HUAWEI')} className={`p-6 rounded-3xl border flex flex-col items-center gap-4 transition-all ${selectedBrand === 'HUAWEI' ? 'bg-red-600/10 border-red-500 text-white' : 'bg-slate-900/40 border-white/5 text-slate-500'}`}>
                <Smartphone size={24} className="text-red-500" />
                <span className="text-[11px] font-black uppercase tracking-widest">Huawei</span>
              </button>
              <button onClick={() => setSelectedBrand('APPLE')} className={`p-6 rounded-3xl border flex flex-col items-center gap-4 transition-all ${selectedBrand === 'APPLE' ? 'bg-white/10 border-white text-white' : 'bg-slate-900/40 border-white/5 text-slate-500'}`}>
                <div className="text-white"></div>
                <span className="text-[11px] font-black uppercase tracking-widest">Apple</span>
              </button>
            </div>
            <button onClick={handlePairing} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-[0.4em] rounded-2xl transition-all shadow-xl btn-scan">Initialiser Pairing</button>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center gap-8">
            <RefreshCw size={80} className="text-emerald-400 animate-spin" />
            <Bluetooth size={30} className="text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <p className="text-xl font-black text-white animate-pulse uppercase italic">{t.calculating}</p>
          </div>
        )}
        <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest mt-8 flex items-center justify-center gap-2"><ShieldCheck size={12} className="text-emerald-500" /> {t.biometricShield}</p>
      </div>
    </div>
  );
};

export default BiometricBridgeModal;
