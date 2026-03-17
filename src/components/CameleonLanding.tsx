
import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  Check, 
  ChevronDown, 
  Gift, 
  ArrowRight, 
  Lock, 
  Key, 
  Headphones, 
  RefreshCw, 
  Users,
  Zap,
  Download,
  FileText,
  Copy,
  ExternalLink,
  Monitor
} from 'lucide-react';
import { LicenseService, License } from '../services/LicenseService';

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] } },
        hidden: { opacity: 0, y: 40 }
      }}
    >
      {children}
    </motion.div>
  );
};

export const CameleonLanding: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [generatedLicense, setGeneratedLicense] = useState<License | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!accountNumber) return;
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const license = LicenseService.generateLicense('current-user-id', accountNumber);
      setGeneratedLicense(license);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      {/* Access Modal */}
      <AnimatePresence>
        {showAccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccessModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-[32px] p-8 md:p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowAccessModal(false)} className="text-slate-500 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>

              {!generatedLicense ? (
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Key size={12} /> Activation de Licence
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Configurez votre accès</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Pour protéger l'algorithme et garantir son exclusivité, chaque licence est liée à un numéro de compte MetaTrader 5 unique.
                  </p>
                  
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Numéro de compte MT5</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 12345678"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-emerald-500/50 outline-none transition-all font-mono"
                    />
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={!accountNumber || isGenerating}
                    className="w-full py-5 bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        Générer ma licence <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <ShieldCheck size={12} /> Licence Active
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic text-emerald-500">Accès Autorisé</h2>
                  
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Votre Clé Licence</span>
                      <button 
                        onClick={() => copyToClipboard(generatedLicense.key)}
                        className="text-emerald-500 hover:text-emerald-400 transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        {copied ? 'Copié !' : <><Copy size={14} /> Copier</>}
                      </button>
                    </div>
                    <div className="text-2xl font-mono font-black tracking-wider text-center py-4 bg-black/40 rounded-xl border border-white/5">
                      {generatedLicense.key}
                    </div>
                    <p className="text-[10px] text-center text-slate-500 uppercase font-black tracking-widest">
                      Liée au compte : {generatedLicense.accountNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href="/public/Cameleon_Algo_v1.ex" 
                      download 
                      className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <Download size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Télécharger .EX</span>
                    </a>
                    <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                      <FileText size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Instructions</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-center text-slate-600 uppercase font-black tracking-widest leading-relaxed">
                      Important : Ne partagez jamais votre clé. Elle est cryptée et liée à votre identité Thalamus.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[60] bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onBack}>
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="font-bold tracking-tighter text-xl">PLAN <span className="text-emerald-500">CAMÉLÉON</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition">L'APPROCHE</button>
            <button className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition">L'OFFRE</button>
            <a href="#demo" className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest transition-all">
              DÉMO GRATUITE
            </a>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="min-h-screen flex items-center justify-center relative pt-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/5 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.2em] mb-10 uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Protocole de Survie Activé</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              L'algorithme qui<br />
              <span className="text-slate-600">ne promet rien.</span><br />
              <span className="text-emerald-500">Mais protège tout.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              Vous n'avez pas un problème de stratégie.<br />
              <span className="text-white font-bold">Vous avez un problème de survie.</span>
            </p>

            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
              <a href="#demo" className="w-full md:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                Sécuriser mon capital
              </a>
              <button className="w-full md:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all">
                Voir la vérité
              </button>
            </div>
          </FadeUp>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Section 2: Scénario Dramatique */}
      <section className="py-32 bg-black relative border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-20">
              <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] mb-4 uppercase">Le Cycle de la Ruine</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Vous entrez avec <span className="text-emerald-500">10 000€</span>.</h2>
            </div>

            <div className="space-y-4 relative">
              {/* Timeline line */}
              <div className="absolute left-[20px] top-0 bottom-0 w-px bg-white/5 hidden md:block"></div>

              <div className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-8 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-xs z-10">01</div>
                <div className="flex-1">
                  <h3 className="text-emerald-400 font-bold uppercase text-sm tracking-widest mb-1">Mois 1 : L'Euphorie</h3>
                  <p className="text-lg text-slate-300">Vous gagnez <span className="text-white font-bold">+2 000€</span>. Vous vous croyez intouchable. Vous augmentez vos lots.</p>
                </div>
              </div>
              
              <div className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-8 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-red-500/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-black text-xs z-10">02</div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-bold uppercase text-sm tracking-widest mb-1">Mois 2 : Le Déni</h3>
                  <p className="text-lg text-slate-300">Vous perdez <span className="text-white font-bold">-3 500€</span>. Vous refusez de couper. Vous "vengez" le marché.</p>
                </div>
              </div>
              
              <div className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-10 bg-red-950/20 rounded-3xl border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-black font-black text-xs z-10">03</div>
                <div className="flex-1">
                  <h3 className="text-white font-black uppercase text-sm tracking-widest mb-1">Mois 3 : L'Extinction</h3>
                  <p className="text-2xl text-red-200 font-black tracking-tight">Vous n'êtes plus là.</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-20">
              <p className="text-slate-400 text-lg font-light">
                Ce scénario est la réalité de <span className="text-white font-bold">90% des traders</span>.<br />
                <span className="text-red-500 font-bold uppercase tracking-widest text-sm mt-4 block">Le marché ne vous a pas tué. Votre psychologie l'a fait.</span>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 3: Vérité */}
      <section className="py-32 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="text-7xl md:text-9xl font-black text-red-600 tracking-tighter">90%</div>
                <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">Échouent en moins d'un an</p>
              </div>
              <div className="space-y-4">
                <div className="text-7xl md:text-9xl font-black text-red-600 tracking-tighter">80%</div>
                <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">Abandonnent définitivement</p>
              </div>
              <div className="space-y-4">
                <div className="text-7xl md:text-9xl font-black text-red-600 tracking-tighter">50%</div>
                <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">Perdent leurs économies de vie</p>
              </div>
            </div>
            
            <div className="mt-24 text-center">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                "Le marché n'est pas votre ennemi.<br />
                <span className="text-red-500">Votre cerveau l'est."</span>
              </h2>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 4: Syndrome du Caméléon */}
      <section className="py-40 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeUp>
            <div className="text-center">
              <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-10 opacity-50" />
              <blockquote className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tighter mb-10">
                "Le caméléon ne change pas de couleur pour <span className="text-emerald-500">dominer</span>.<br />
                Il change pour <span className="text-emerald-500">survivre</span>."
              </blockquote>
              <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto">
                En trading, la domination est une illusion de débutant. La survie est la seule métrique qui compte. Plan Caméléon adapte votre comportement aux conditions brutales du marché, sans émotion.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 5: Split Screen */}
      <section className="py-0 border-y border-white/5">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          <div className="p-12 md:p-24 bg-red-950/10 border-r border-white/5 flex flex-col justify-center">
            <FadeUp>
              <h3 className="text-red-500 font-black text-4xl mb-10 tracking-tighter uppercase">Ce n'est pas</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-xl text-slate-400">
                  <X className="text-red-500 shrink-0" /> Prédire l'avenir
                </li>
                <li className="flex items-center gap-4 text-xl text-slate-400">
                  <X className="text-red-500 shrink-0" /> Garantir des gains
                </li>
                <li className="flex items-center gap-4 text-xl text-slate-400">
                  <X className="text-red-500 shrink-0" /> Devenir riche vite
                </li>
              </ul>
            </FadeUp>
          </div>
          <div className="p-12 md:p-24 bg-emerald-950/10 flex flex-col justify-center">
            <FadeUp>
              <h3 className="text-emerald-500 font-black text-4xl mb-10 tracking-tighter uppercase">C'est</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-xl text-white">
                  <Check className="text-emerald-500 shrink-0" /> Imposer la discipline
                </li>
                <li className="flex items-center gap-4 text-xl text-white">
                  <Check className="text-emerald-500 shrink-0" /> Bloquer vos mains
                </li>
                <li className="flex items-center gap-4 text-xl text-white">
                  <Check className="text-emerald-500 shrink-0" /> Sécuriser vos acquis
                </li>
              </ul>
            </FadeUp>
          </div>
        </div>
        <div className="bg-black py-12 text-center border-t border-white/5">
          <p className="text-xl font-bold italic text-slate-500">
            "Votre psychologie est <span className="text-white">externalisée</span>."
          </p>
        </div>
      </section>

      {/* Section 6: Deux Chemins */}
      <section className="py-32 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-4xl md:text-6xl font-black text-center mb-24 tracking-tighter">Deux Chemins.</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8">
                <h4 className="text-red-500 font-black uppercase tracking-widest text-sm">SANS CAMÉLÉON</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400"><Zap size={16} className="text-red-500" /> Émotions brutes</div>
                  <div className="flex items-center gap-3 text-slate-400"><Zap size={16} className="text-red-500" /> Surconfiance aveugle</div>
                  <div className="flex items-center gap-3 text-slate-400"><Zap size={16} className="text-red-500" /> Panique incontrôlée</div>
                  <div className="flex items-center gap-3 text-slate-400"><Zap size={16} className="text-red-500" /> Revenge Trading</div>
                </div>
                <div className="pt-6 border-t border-white/5 text-red-500 font-bold">Issue : Élimination statistique.</div>
              </div>
              <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-8 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                <h4 className="text-emerald-500 font-black uppercase tracking-widest text-sm">AVEC CAMÉLÉON</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white"><ShieldCheck size={16} className="text-emerald-500" /> Discipline algorithmique</div>
                  <div className="flex items-center gap-3 text-white"><ShieldCheck size={16} className="text-emerald-500" /> Garde-fou permanent</div>
                  <div className="flex items-center gap-3 text-white"><ShieldCheck size={16} className="text-emerald-500" /> Protection du capital</div>
                  <div className="flex items-center gap-3 text-white"><ShieldCheck size={16} className="text-emerald-500" /> Sérénité opérationnelle</div>
                </div>
                <div className="pt-6 border-t border-emerald-500/20 text-emerald-500 font-bold">Issue : Survie et croissance.</div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 7: Promesse */}
      <section className="py-40 bg-black text-center border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter leading-tight">
              Nous ne promettons pas de vous rendre riche.<br />
              <span className="text-emerald-500">Nous promettons que vous ne perdrez pas tout en une nuit.</span>
            </h2>
            <p className="text-slate-500 text-lg font-light">
              La richesse est une conséquence de la survie. Si vous ne pouvez pas survivre aux 100 prochains trades, vous ne verrez jamais les 1000 suivants.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Section 8: Offre */}
      <section className="py-32 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-10 md:p-20 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Shield size={200} className="text-emerald-500" />
              </div>
              
              <h2 className="text-4xl font-black mb-12 tracking-tighter">L'OFFRE CAMÉLÉON</h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Lock size={16} className="text-emerald-500" /></div>
                    Algorithme MT5 Natif
                  </li>
                  <li className="flex items-center gap-4 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Key size={16} className="text-emerald-500" /></div>
                    Licence Individuelle
                  </li>
                  <li className="flex items-center gap-4 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Headphones size={16} className="text-emerald-500" /></div>
                    Support Prioritaire
                  </li>
                  <li className="flex items-center gap-4 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><RefreshCw size={16} className="text-emerald-500" /></div>
                    Mises à jour à vie
                  </li>
                  <li className="flex items-center gap-4 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Users size={16} className="text-emerald-500" /></div>
                    Groupe Privé Thalamus
                  </li>
                </ul>
                
                <div className="flex flex-col justify-center space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group hover:border-emerald-500/50 transition-all cursor-pointer">
                    <span className="font-bold text-slate-400 group-hover:text-white">3 MOIS</span>
                    <span className="text-xl font-black">297€</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group hover:border-emerald-500/50 transition-all cursor-pointer">
                    <span className="font-bold text-slate-400 group-hover:text-white">6 MOIS</span>
                    <span className="text-xl font-black">497€</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center group hover:bg-emerald-500/20 transition-all cursor-pointer relative">
                    <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest rounded-full">RECOMMANDÉ</div>
                    <span className="font-bold text-emerald-400">12 MOIS</span>
                    <span className="text-xl font-black text-emerald-400">797€</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 9: CTA Démo */}
      <section id="demo" className="py-32 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <div className="bg-emerald-500 rounded-[40px] p-12 md:p-24 text-center text-black relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                  <Gift size={12} /> Démo Gratuite 30 Jours
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">DÉMARRER LA DÉMO GRATUITE</h2>
                <p className="text-xl font-medium mb-12 opacity-80 max-w-xl mx-auto">
                  Testez la puissance de la protection Caméléon sans aucun risque. Sans CB, sans engagement.
                </p>
                <button 
                  onClick={() => setShowAccessModal(true)}
                  className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-2xl"
                >
                  Activer ma démo <ArrowRight size={20} />
                </button>
                <p className="mt-8 text-xs font-bold opacity-60 uppercase tracking-widest">Installation en 5 minutes sur MT5</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 10: Footer */}
      <footer className="py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-black tracking-tighter">PLAN CAMÉLÉON</span>
              </div>
              <p className="text-xl text-slate-400 leading-relaxed font-light">
                Si vous cherchez à devenir riche sans effort, cette page n'est pas pour vous. Si vous cherchez à survivre — <span className="text-white font-bold">Bienvenue.</span>
              </p>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Légal</h5>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="hover:text-white cursor-pointer transition">CGV</li>
                    <li className="hover:text-white cursor-pointer transition">Confidentialité</li>
                    <li className="hover:text-white cursor-pointer transition">Mentions Légales</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Contact</h5>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="hover:text-white cursor-pointer transition">Support</li>
                    <li className="hover:text-white cursor-pointer transition">Partenariats</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-32 pt-12 border-t border-white/5 text-[10px] text-slate-700 font-mono leading-relaxed uppercase tracking-widest text-center md:text-left">
            AVERTISSEMENT : Le trading comporte des risques élevés. Plan Caméléon est un outil d'aide à la décision et de gestion du risque. Les performances passées ne garantissent pas les résultats futurs. Ne risquez jamais de l'argent que vous ne pouvez pas vous permettre de perdre. © 2026 THALAMUS OBA. TOUS DROITS RÉSERVÉS.
          </div>
        </div>
      </footer>
    </div>
  );
};
