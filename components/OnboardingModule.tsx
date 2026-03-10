
import React, { useState, useEffect } from 'react';
// Fixed: Changed 'Unlocked' to 'Unlock' as per lucide-react exports
import { ShieldCheck, Cpu, Zap, Target, Users, ArrowRight, Lock, Fingerprint, Sparkles, Loader2, Unlock } from 'lucide-react';
import { Language, translations } from '../i18n';
import { Logo } from '../src/components/Logo';

interface Props {
  onComplete: (isTrial?: boolean) => void;
  lang?: Language;
}

const OnboardingModule: React.FC<Props> = ({ onComplete, lang = 'FR' }) => {
  const [step, setStep] = useState<'intro' | 'pricing' | 'syncing'>('intro');
  const [activatingTier, setActivatingTier] = useState<string | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [showTrialConfirm, setShowTrialConfirm] = useState(false);
  const [socialFeed, setSocialFeed] = useState<{id: string, action: string}>({ id: '089', action: 'Shadow Liquidity' });
  const t = translations[lang];

  useEffect(() => {
    const actions = [
      'Shadow Liquidity', 'Founders Vault', 'Nano-Protocol', 'Neural Sync', 'Sub-1ms Latency'
    ];
    const interval = setInterval(() => {
      setSocialFeed({
        id: Math.floor(Math.random() * 999).toString().padStart(3, '0'),
        action: actions[Math.floor(Math.random() * actions.length)]
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Correction : Utilisation d'un timer robuste pour la fin de l'onboarding
  useEffect(() => {
    if (step === 'syncing') {
      const timer = setTimeout(() => {
        onComplete(activatingTier === 'PRO');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete, activatingTier]);

  const handleActivateTier = (tierName: string) => {
    if (tierName === 'PRO') {
      setShowTrialConfirm(true);
      return;
    }
    startActivation(tierName);
  };

  const startActivation = (tierName: string) => {
    setActivatingTier(tierName);
    setShowTrialConfirm(false);
    
    if (tierName === 'ELITE') {
      setIsVibrating(true);
      setTimeout(() => {
        setIsVibrating(false);
        setStep('syncing');
      }, 3000);
    } else {
      setTimeout(() => {
        setStep('syncing');
      }, 1500);
    }
  };

  const pricingTiers = [
    {
      name: 'NANO',
      price: '0',
      description: lang === 'FR' ? 'Pour les capitaux < 1000€' : 'For capitals < 1000€',
      features: ['VaR Adaptative 5%', 'Kill-switch Bio', 'Micro-lot Sync'],
      accent: 'border-slate-800'
    },
    {
      name: 'PRO',
      price: '49',
      description: lang === 'FR' ? 'Scalping Professionnel' : 'Professional Scalping',
      features: ['VaR 2% Native', 'Multi-Terminal Link', 'HRV Analytics Pro'],
      accent: 'border-cyan-500/30',
      hasTrial: true
    },
    {
      name: 'ELITE',
      price: '149',
      description: lang === 'FR' ? 'Accès Alpha Total' : 'Total Alpha Access',
      features: ['Shadow Pool Access', 'Tax-Loss Harvesting', 'IA Priority Nudge'],
      accent: 'border-amber-500/50',
      isRecommended: true
    }
  ];

  return (
    <div className={`fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center overflow-hidden font-mono transition-all duration-300 ${isVibrating ? 'alpha-vibration bg-amber-950/20' : ''}`}>
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full transition-colors duration-1000 ${isVibrating ? 'bg-[radial-gradient(circle_at_50%_50%,_#f59e0b22_0%,_transparent_50%)]' : 'bg-[radial-gradient(circle_at_50%_50%,_#22d3ee22_0%,_transparent_50%)]'}`} />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Social Proof Floating Window */}
      {!showTrialConfirm && step !== 'syncing' && (
        <div className="absolute bottom-10 left-10 animate-in slide-in-from-left-20 duration-1000">
          <div className="glass-panel px-6 py-4 rounded-2xl border-emerald-500/30 bg-emerald-500/5 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              {lang === 'FR' ? `Utilisateur ${socialFeed.id} vient de déverrouiller: ${socialFeed.action}` : `User ${socialFeed.id} just unlocked: ${socialFeed.action}`}
            </span>
          </div>
        </div>
      )}

      {/* Induction Confirmation Modal */}
      {showTrialConfirm && (
        <div className="absolute inset-0 z-[350] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-xl w-full glass-panel p-12 rounded-[3.5rem] border-cyan-500/30 shadow-[0_0_80px_rgba(34,211,238,0.2)] text-center space-y-10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
             <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-2xl">
                <Zap size={32} className="text-cyan-400 animate-pulse" />
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">{t.inductionTitle}</h3>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed">{t.inductionBody}</p>
             </div>
             <div className="flex flex-col gap-4">
                <button 
                  onClick={() => startActivation('PRO')}
                  className="w-full py-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-[0.5em] rounded-2xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 btn-scan"
                >
                   {t.launchSync}
                </button>
                <button 
                  onClick={() => setShowTrialConfirm(false)}
                  className="w-full py-4 text-slate-500 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all"
                >
                   Retour aux offres
                </button>
             </div>
          </div>
        </div>
      )}

      <div className={`max-w-6xl w-full p-8 relative z-10 transition-all duration-700 ${isVibrating ? 'scale-95' : ''} ${showTrialConfirm ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
        {step === 'intro' && (
          <div className="flex flex-col items-center text-center space-y-12 animate-in fade-in zoom-in duration-700">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-cyan-500" />
                <Cpu className="text-cyan-400 animate-pulse" size={40} />
                <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-cyan-500" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
                THALAMUS<br/><span className="text-cyan-500">OBA v28</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-bold uppercase tracking-[0.2em] italic max-w-3xl mx-auto">
                {lang === 'FR' ? "Arrêtez de trader contre le marché. Commencez à trader avec votre système nerveux." : "Stop trading against the market. Start trading with your nervous system."}
              </p>
            </div>

            <button 
              onClick={() => setStep('pricing')}
              className="group relative px-12 py-8 bg-white hover:bg-cyan-500 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-cyan-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 text-slate-950 font-black text-lg uppercase tracking-[0.5em] flex items-center gap-4">
                INITIER LA LIAISON SYNAPTIQUE <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">Sub-latency neural link encrypted (AES-4096)</p>
          </div>
        )}

        {step === 'pricing' && (
          <div className="animate-in slide-in-from-bottom-12 duration-1000 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Choisissez votre niveau d'intégration</h2>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Protocoles de déploiement universels</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-500 ${isVibrating ? 'opacity-20' : 'opacity-100'}`}>
              {pricingTiers.map((tier) => (
                <div key={tier.name} className={`glass-panel p-8 rounded-[3rem] border-2 transition-all duration-500 flex flex-col relative group ${tier.isRecommended ? 'bg-white/5 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.1)]' : 'bg-slate-900/40 border-white/5'}`}>
                  {tier.hasTrial && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] text-center">
                       <div className="bg-gradient-to-r from-cyan-600 via-white to-cyan-600 p-[1px] rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-[glow_2s_infinite]">
                          <div className="bg-slate-950 px-4 py-2 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{t.flashOffer}</span>
                          </div>
                       </div>
                    </div>
                  )}

                  {tier.isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} /> Recommandé par l'IA
                    </div>
                  )}
                  
                  <div className="mb-8 mt-2">
                    <h3 className="text-2xl font-black text-white italic tracking-widest mb-2">{tier.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-10">
                    <span className="text-4xl font-black text-white italic tracking-tighter">€{tier.price}</span>
                    <span className="text-slate-600 text-[10px] font-black uppercase">/ month</span>
                  </div>

                  <ul className="space-y-4 flex-1">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
                        {/* Fixed: Changed 'Unlocked' to 'Unlock' as per lucide-react exports */}
                        {tier.hasTrial ? <Unlock size={14} className="text-emerald-500" /> : <ShieldCheck size={14} className="text-emerald-500" />}
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button 
                    disabled={!!activatingTier}
                    onClick={() => handleActivateTier(tier.name)}
                    className={`mt-10 w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                      tier.name === 'PRO' ? 'pro-trial-button text-slate-950' : 
                      tier.isRecommended ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 
                      'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {activatingTier === tier.name ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : null}
                    {activatingTier === tier.name ? 'Connexion...' : 'Activer Liaison'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'syncing' && (
          <div className="flex flex-col items-center justify-center space-y-12 py-20 animate-in fade-in duration-1000">
            <div className="relative">
               <Logo variant="hero" size={120} className="animate-pulse" />
               <div className="absolute inset-0 bg-cyan-400/10 blur-3xl animate-pulse" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-widest">Initialisation du Bio-Lien...</h2>
              <div className="w-80 h-1 bg-slate-900 rounded-full overflow-hidden mx-auto shadow-inner border border-white/5">
                <div className="h-full bg-cyan-500 animate-[loading-bar_4s_ease-in-out_forwards] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] max-w-xs text-center leading-relaxed">
              Synchronisation RMSSD, Baseline HRV, et VaR Adaptive en cours... Veuillez rester immobile.
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes vibrate {
          0% { transform: translate(0,0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0,0); }
        }
        @keyframes glow {
          0% { filter: brightness(1) drop-shadow(0 0 5px rgba(34, 211, 238, 0.2)); }
          50% { filter: brightness(1.3) drop-shadow(0 0 15px rgba(34, 211, 238, 0.6)); }
          100% { filter: brightness(1) drop-shadow(0 0 5px rgba(34, 211, 238, 0.2)); }
        }
        @keyframes pro-glow {
          0% { background-color: #22d3ee; box-shadow: 0 0 10px rgba(34, 211, 238, 0.4); }
          50% { background-color: #f59e0b; box-shadow: 0 0 30px rgba(245, 158, 11, 0.8); }
          100% { background-color: #22d3ee; box-shadow: 0 0 10px rgba(34, 211, 238, 0.4); }
        }
        .alpha-vibration {
          animation: vibrate 0.15s infinite;
        }
        .pro-trial-button {
          animation: pro-glow 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default OnboardingModule;
