
import React, { useState } from 'react';
import { X, ShoppingBag, Watch, Sparkles, CheckCircle2, ChevronRight, CreditCard, ShieldCheck, ExternalLink, RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  onClose: () => void;
  lang?: Language;
}

const HardwareStoreModal: React.FC<Props> = ({ onClose, lang = 'FR' }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const t = translations[lang];

  // Liens directs vers les pages produits officielles
  const products = [
    {
      id: 'apple-watch-ultra',
      name: 'Apple Watch Ultra 2',
      brand: 'APPLE x THALAMUS',
      price: '899.00',
      discount: t.neuralDiscount,
      url: 'https://www.apple.com/apple-watch-ultra-2/',
      description: lang === 'FR' ? 'Synchronisation HealthKit de précision. Idéal pour les traders iOS.' : 'Precision HealthKit Sync. Ideal for demanding iOS traders.',
      features: ['Dual-Frequency GPS', 'ECG & VFC Advanced', 'Action Button: Macro Trade'],
      imageColor: 'bg-orange-500/10',
      isHot: true,
      accentColor: 'text-orange-500',
      icon: <Watch size={80} className="text-orange-500/40 group-hover:scale-110 transition-transform duration-700" />
    },
    {
      id: 'neural-strap',
      name: 'Thalamus Neural Strap',
      brand: 'OBA GEAR',
      price: '129.00',
      discount: 'Proprietary Tech',
      url: 'https://www.polar.com/fr/capteurs/capteur-de-frequence-cardiaque-h10',
      description: lang === 'FR' ? 'Capteur thoracique haute précision. Indispensable pour le scalping professionnel.' : 'High-precision chest strap. Essential for professional scalping.',
      features: ['ECG Grade Precision', 'Zero Latency Sync', 'Sweat-Resistant'],
      imageColor: 'bg-cyan-500/20',
      isHot: true,
      accentColor: 'text-cyan-400',
      icon: <Activity size={80} className="text-cyan-400/40 group-hover:scale-110 transition-transform duration-700" />
    },
    {
      id: 'huawei-gt-pro',
      name: 'Huawei Watch GT 4 Pro',
      brand: 'HUAWEI x THALAMUS',
      price: '349.00',
      discount: '15% Off',
      url: 'https://consumer.huawei.com/fr/wearables/watch-gt4/',
      description: lang === 'FR' ? 'Liaison HRV Native. Autonomie record pour sessions de trading prolongées.' : 'Native HRV Liaison. Record battery life for long trading sessions.',
      features: ['RMSSD Tracking', 'Stress Detection v2', 'Battery 14 Days'],
      imageColor: 'bg-red-600/20',
      isHot: false,
      accentColor: 'text-red-500',
      icon: <Watch size={80} className="text-red-500/40 group-hover:scale-110 transition-transform duration-700" />
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="max-w-6xl w-full glass-panel p-8 md:p-12 rounded-[3.5rem] border-white/10 shadow-[0_0_150px_rgba(34,211,238,0.15)] relative overflow-hidden flex flex-col max-h-[92vh]">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-30 p-2 hover:bg-white/5 rounded-full">
          <X size={28} />
        </button>

        <header className="mb-8 relative z-10 shrink-0">
          <div className="flex items-center gap-4 mb-3">
             <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
                <ShoppingBag size={20} className="text-emerald-400" />
             </div>
             <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">{t.storeTitle}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{t.storeSubtitle}</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-cyan-400" /> 
            {lang === 'FR' ? 'Passerelle sécurisée Thalamus vers les fournisseurs officiels' : 'Thalamus Secure Gateway to official suppliers'}
          </p>
        </header>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-hide pb-8 pr-2 min-h-0">
           {products.map(product => (
             <div 
              key={product.id} 
              className="glass-panel p-6 rounded-[2.5rem] border-white/5 hover:border-cyan-500/30 transition-all group flex flex-col relative overflow-hidden bg-slate-900/30"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
             >
                
                {product.isHot && (
                  <div className={`absolute -right-12 top-6 ${product.id === 'apple-watch-ultra' ? 'bg-orange-600' : 'bg-cyan-600'} text-white text-[9px] font-black py-1 px-14 rotate-45 uppercase tracking-widest shadow-xl z-10`}>
                    {product.id === 'apple-watch-ultra' ? 'Best Integration' : 'Bio-Priority'}
                  </div>
                )}

                <div className={`w-full h-36 md:h-40 rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden shrink-0 ${product.imageColor}`}>
                   {product.icon}
                   <Sparkles className="absolute top-6 right-6 text-white/10 animate-pulse" size={30} />
                   {hoveredId === product.id && (
                     <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw size={24} className="text-cyan-400 animate-spin" />
                          <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.2em]">{t.handshake}</span>
                        </div>
                     </div>
                   )}
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{product.brand}</span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-tight">{product.name}</h3>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">{product.description}</p>
                  
                  <div className="space-y-2">
                    {product.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <CheckCircle2 size={10} className="text-emerald-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 shrink-0">
                   <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest line-clamp-1">{product.discount}</span>
                      <span className="text-2xl font-mono font-black text-white tracking-tighter">${product.price}</span>
                   </div>
                   
                   {/* CHANGEMENT CRITIQUE: Utilisation de balise 'a' pour redirection directe et fiable */}
                   <a 
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-cyan-500 text-slate-950 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-cyan-500/30 hover:scale-[1.03] active:scale-95 btn-scan z-20 group/btn"
                   >
                      {t.commander} 
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </a>
                </div>
             </div>
           ))}
        </div>

        <footer className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-6 shrink-0 bg-slate-950/40">
           <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 hidden sm:block">
                 <CreditCard size={18} className="text-slate-500" />
              </div>
              <div className="max-w-md">
                <p className="text-[10px] font-black text-white uppercase tracking-widest italic">{t.iosSymbiosis} / {t.androidReady}</p>
                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tight leading-tight">
                   {lang === 'FR' ? "Liaison directe via protocoles affiliés sécurisés Thalamus OBA." : "Direct link established via secure Thalamus OBA affiliate protocols."}
                </p>
              </div>
           </div>
           
           <div className="flex items-center gap-3 bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/10">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Affiliate Node #OBA-28-SECURED</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default HardwareStoreModal;
