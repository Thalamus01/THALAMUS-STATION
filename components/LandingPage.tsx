
import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Zap, Brain, Rocket, ArrowDown, Activity, Link, Target, AlertTriangle, ChevronRight, Globe, Lock, Plus, Youtube, Music, Award, Star, ShieldCheck, Users } from 'lucide-react';
import { getStoredUsers, getRemainingSpots } from '../userManagementService';
import { Logo } from '../src/components/Logo';

interface Props {
  onEnterCockpit: () => void;
}

const FAQ_ITEMS = [
  {
    question: "Quelle est la vision de l'architecte derrière Thalamus ?",
    answer: "Thalamus n’est pas le produit d’une salle de conférence aseptisée. Il est né dans le silence pesant des nuits blanches, là où l’obscurité dévore les ambitions et où les émotions brisent les destins les plus brillants. Le constat était un cri de douleur muet : chaque trader porte en lui le même virus, cette faille humaine qui transforme l’or en poussière.\n\nPourtant, dans l'arène, personne ne cherchait l’antidote. On oubliait la vérité brutale de notre propre biologie :\n\nLe meilleur setup technique ne résiste pas à une amygdale en feu. La stratégie la plus back-testée s'effondre devant un ego blessé. Le plan écrit à froid devient cendres quand le prix bouge trop vite.\n\nÀ l’origine de ce projet, il y a un collectif d'élite. Des vétérans marqués par les cicatrices des plus grandes places boursières mondiales. Derrière leurs succès de façade, ils partageaient une amertume profonde : celle de savoir que même la plus parfaite des logiques s'effondre face à un cœur qui bat trop vite. Ils ont vu des carrières s'éteindre et des vies basculer. Ils ne cherchaient plus seulement un outil, mais une bouée de sauvetage pour automatiser cette discipline qui nous échappe à tous dès que l'écran s'agite.\n\nDans ce vacarme de doutes, une voix s’est élevée. Une figure de l’ombre que l’on nomme Le Sniper.\n\nRespecté pour sa lecture chirurgicale de l'âme des marchés, il a passé dix ans à observer les hommes tomber. Sa mission ? Viser exactement là où la douleur prend racine : l’illusion de contrôle. Fondateur du mouvement New Generation Trader, il a insufflé à Thalamus ce que personne n’avait osé numériser jusqu'ici : l’instinct pur et la rigueur d’une vie de combats.\n\nThalamus n’est pas une simple ligne de code. C’est la fusion sacrée entre la puissance brute d’une IA de pointe et la sagesse d’un homme qui a vu des milliers de regards s’éteindre pour les mêmes erreurs.\n\nVous n’utilisez pas un logiciel. Vous portez en vous l’armure du Sniper. Vous tradez enfin avec l’âme d’un mentor qui ne vous laissera plus jamais brûler seul face au marché."
  },
  {
    question: "Thalamus a-t-il accès à mes fonds ?",
    answer: "Absolument pas. Thalamus est un miroir de données. Le Bridge MT5 est en lecture seule (Read-Only). Il transmet vos statistiques au cockpit mais n'a aucun droit d'exécution, de retrait ou de modification sur votre compte AvaTrade ou autre broker."
  },
  {
    question: "Le système ralentit-il l'exécution de mes ordres ?",
    answer: "Non. Le Bridge utilise la technologie WebRequest asynchrone de MetaTrader 5. La transmission des données vers votre cockpit se fait en arrière-plan et ne crée aucune latence sur votre terminal de trading."
  },
  {
    question: "Mes données de trading sont-elles confidentielles ?",
    answer: "Oui. Vos données sont cryptées de bout en bout. Votre ID Thalamus est anonyme et vos statistiques ne sont jamais partagées ni vendues. Vous êtes le seul maître de votre cockpit."
  },
  {
    question: "Que se passe-t-il si Thalamus se verrouille (MHI critique) ?",
    answer: "Thalamus floute vos graphiques de performance pour stopper la boucle émotionnelle. Cela ne ferme pas vos trades sur MT5, mais vous force à reprendre votre calme avant de continuer l'analyse."
  },
  {
    question: "Est-ce vraiment gratuit ?",
    answer: "L'accès est actuellement gratuit pour les 500 premiers 'Pionniers' afin de finaliser l'entraînement de notre IA. Une fois cette phase terminée, un abonnement sera requis, mais les Pionniers bénéficieront d'un tarif préférentiel."
  }
];

const LandingPage: React.FC<Props> = ({ onEnterCockpit }) => {
  const [scrollY, setScrollY] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [remainingSpots, setRemainingSpots] = useState(getRemainingSpots());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setRemainingSpots(getRemainingSpots());
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const totalEquity = useMemo(() => {
    const users = getStoredUsers();
    const localEquity = users.reduce((acc, u) => acc + (u.lastBalance || 0), 0);
    return 15000000 + localEquity;
  }, []);

  const scannerPosition = (scrollY / (typeof document !== 'undefined' ? Math.max(1, document.body.scrollHeight - window.innerHeight) : 1)) * 100;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden pt-[40px]">
      {/* SCARCITY BAR */}
      <div className="fixed top-0 left-0 w-full h-[40px] bg-black border-b border-[#FFB800] z-[200] flex items-center justify-center px-4">
        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white">
          Accès Pionnier Gratuit : Plus que <span className="text-[#FFB800]">{remainingSpots}</span> places sur 500. 
          <button 
            onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
            className="ml-4 text-[#FFB800] hover:underline underline-offset-4"
          >
            [Réserver maintenant]
          </button>
        </p>
      </div>

      {/* SCANNER LINE */}
      <div 
        className="fixed left-0 w-full h-px bg-cyan-500/50 shadow-[0_0_15px_#22d3ee] z-[100] pointer-events-none transition-all duration-300"
        style={{ top: `${scannerPosition}%` }}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#22d3ee08_0%,_transparent_50%)]" />
        
        <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-1000">
          <Logo variant="hero" size={150} className="mx-auto mb-4" />
          
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
            <Globe size={14} className="text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Réseau OBA Actif - Global Node</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-[0.9] bg-gradient-to-b from-white via-white to-slate-600 bg-clip-text text-transparent">
            NE TRADEZ <br/>PLUS SEUL.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-bold uppercase tracking-widest italic max-w-2xl mx-auto">
            Tradez avec votre jumeau numérique.
          </p>

          {/* PIONEER COUNTER */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <Users size={18} className="text-cyan-400" />
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400/70">Places Pionniers Restantes</span>
                <span className="text-2xl font-black italic text-white leading-none">{remainingSpots} <span className="text-xs text-slate-500 not-italic">/ 500</span></span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">Accès gratuit pour les premiers inscrits</p>
          </div>

          <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
            Thalamus synchronise votre biologie et votre terminal MT5 pour éliminer l'erreur humaine par l'IA neuro-cognitive.
          </p>

          <div className="pt-10">
            <button 
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="group w-[90%] md:w-auto px-10 py-6 bg-[#FFB800] text-black rounded-2xl font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 mx-auto transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,184,0,0.2)] animate-pulse-gold"
            >
              RÉSERVER MON ACCÈS PIONNIER <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION LE PROBLÈME */}
      <section id="problem" className="relative py-32 px-6 bg-[#050505] overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="flex justify-center mb-8">
            <AlertTriangle size={48} className="text-red-600 animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none glitch-text" data-text="L'ERREUR HUMAINE EST VOTRE PIRE ENNEMI.">
            L'ERREUR HUMAINE EST VOTRE PIRE ENNEMI.
          </h2>
          
          <div className="space-y-6 text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
            <p>90% des traders échouent à cause de l'émotion.</p>
            <p className="text-white">Thalamus est le premier système au monde qui verrouille votre interface quand votre cerveau panique.</p>
          </div>
        </div>
      </section>

      {/* SECTION LA SOLUTION (LES 3 PILIERS) */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">UNE NOUVELLE ÈRE DE CONTRÔLE.</h2>
            <div className="h-1 w-24 bg-cyan-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-700 relative overflow-hidden">
              <div className="absolute -inset-24 bg-cyan-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <Target size={40} className="text-cyan-400 mb-8" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Analyse Comportementale</h3>
              <p className="text-sm text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
                Thalamus décode vos schémas d'action directement sur le graphique. Chaque clic, chaque hésitation est analysée pour identifier vos biais en temps réel.
              </p>
            </div>

            <div className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-700 relative overflow-hidden">
              <div className="absolute -inset-24 bg-emerald-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <Link size={40} className="text-emerald-400 mb-8" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Neural Handshake</h3>
              <p className="text-sm text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
                Synchronisation sécurisée ultra-rapide avec MT5 via Bridge EX5 propriétaire. Latence sub-1ms garantie pour vos ordres.
              </p>
            </div>

            <div className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-700 relative overflow-hidden">
              <div className="absolute -inset-24 bg-purple-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <Brain size={40} className="text-purple-400 mb-8" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Mental Health Index</h3>
              <p className="text-sm text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
                Le garde-fou algorithmique qui protège votre capital. Le MHI calcule votre lucidité en continu pour autoriser ou bloquer les flux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CTA FINAL (WOW EFFECT) */}
      <section className="py-40 px-6 bg-black text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[400px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Preuve Sociale Neural Node</span>
            <div className="text-5xl md:text-8xl font-black italic tracking-tighter text-white">
              ${totalEquity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sous surveillance neuro-quantique active.</p>
          </div>

          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white max-w-xl mx-auto leading-tight">
            VOTRE COCKPIT VOUS ATTEND. <br/>DÉPASSEZ VOS LIMITES BIOLOGIQUES.
          </h2>

          <div className="pt-8">
            <button 
              onClick={onEnterCockpit}
              className="group relative w-[90%] md:w-auto px-20 py-10 bg-[#FFB800] text-black rounded-[2.5rem] font-black text-lg uppercase tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-[0_30px_70px_rgba(255,184,0,0.3)] flex items-center justify-center gap-6 mx-auto overflow-hidden animate-pulse-gold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              ENTRER DANS LE COCKPIT <Rocket size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION FAQ */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">QUESTIONS FRÉQUENTES</h2>
            <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full mt-6" />
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div 
                key={index}
                className={`group border rounded-[2rem] transition-all duration-500 overflow-hidden ${openFaqIndex === index ? 'border-cyan-500/30 bg-white/[0.03]' : 'border-white/5 bg-transparent hover:border-white/10'}`}
              >
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-8 py-8 flex items-center justify-between text-left"
                >
                  <span className={`text-lg font-black uppercase italic tracking-tight transition-colors ${openFaqIndex === index ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {item.question}
                  </span>
                  <div className={`p-2 rounded-full border border-white/10 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-45 bg-cyan-500 text-black border-cyan-500' : 'text-slate-500'}`}>
                    <Plus size={20} />
                  </div>
                </button>
                
                <div 
                  className={`px-8 transition-all duration-700 ease-in-out ${openFaqIndex === index ? 'max-h-[2000px] pb-12 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-400 font-medium leading-relaxed max-w-3xl whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center space-y-10">
         <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <Logo variant="footer" size={52} />
            <span className="text-xl font-black font-display tracking-[0.3em] text-[#F5F5F0]">THALAMUS</span>
         </div>
         <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-slate-600 text-xs leading-relaxed max-w-3xl mx-auto">
              AVERTISSEMENT : Le trading sur marge comporte un niveau de risque élevé et peut ne pas convenir à tous les investisseurs. L’effet de levier peut agir aussi bien en votre défaveur qu’en votre faveur. Thalamus est une infrastructure d'aide à la décision et ne constitue en aucun cas un conseil en investissement. Vous êtes seul responsable de vos capitaux.
            </p>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">THALAMUS OBA © 2025 - SYSTÈME DE TRADING NEURO-QUANTIQUE STABLE</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .glitch-text {
          position: relative;
        }
        .glitch-text::before, .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
          animation: glitch-anim2 1s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% { clip: rect(31px, 9999px, 94px, 0); }
          5% { clip: rect(70px, 9999px, 71px, 0); }
          10% { clip: rect(10px, 9999px, 10px, 0); }
          15% { clip: rect(81px, 9999px, 20px, 0); }
          20% { clip: rect(50px, 9999px, 30px, 0); }
          100% { clip: rect(50px, 9999px, 30px, 0); }
        }
        @keyframes glitch-anim2 {
          0% { clip: rect(80px, 9999px, 90px, 0); }
          100% { clip: rect(10px, 9999px, 40px, 0); }
        }
        @keyframes pulse-gold {
          0% { box-shadow: 0 0 0 0 rgba(255, 184, 0, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(255, 184, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 184, 0, 0); }
        }
        .animate-pulse-gold {
          animation: pulse-gold 3s infinite;
        }
        .sniper-glow {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        }
      `}} />
    </div>
  );
};

export default LandingPage;
