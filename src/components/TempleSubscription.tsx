import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, Send, Clock, Shield, Users, MessageSquare, HelpCircle } from 'lucide-react';
import { MOCK_TEMPLE_DATA } from '../mockData';
import { Logo } from './Logo';

import { ThalamusUser, addUser } from '../../userManagementService';

export const TempleRitual: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'HERO' | 'STEP1' | 'STEP2' | 'STEP3' | 'TRANSITION' | 'PENDING'>('HERO');
  const [form, setForm] = useState({
    email: '',
    pseudo: '',
    why: '',
    weakness: '',
    discipline: ''
  });
  const [counters, setCounters] = useState({ 
    open: MOCK_TEMPLE_DATA.openDoorsCount, 
    active: MOCK_TEMPLE_DATA.residentsCount 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        open: prev.open + (Math.random() > 0.7 ? 1 : 0),
        active: prev.active + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = (next: typeof step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!form.email || !form.pseudo) {
      alert("Veuillez remplir tous les champs d'identification.");
      return;
    }

    setStep('TRANSITION');
    
    // Create a real pending user in the system
    const newUser: ThalamusUser = {
      id: form.pseudo.toUpperCase().trim(),
      email: form.email.trim(),
      status: 'PENDING',
      registrationDate: Date.now(),
      expiryDate: Date.now() + (1000 * 60 * 60 * 24 * 7), // 7 days trial pending
      isOnline: false,
      lastBalance: 0,
      mhiScore: 0,
      platform: 'WEB'
    };

    setTimeout(() => {
      addUser(newUser);
      setStep('PENDING');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-[#F5F5F0] font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {step === 'HERO' && (
          <motion.section 
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 relative"
          >
            <Logo variant="icon" size={128} className="mb-4" />

            <div className="space-y-2">
              <h1 className="text-6xl font-black font-display tracking-widest text-[#F5F5F0]">THALAMUS</h1>
              <p className="text-lg font-medium text-[#888] tracking-[0.3em] uppercase">Le Temple des Traders Disciplinés</p>
            </div>

            <div className="w-[200px] h-px bg-[#D4AF37]/40 mx-auto" />

            <div className="max-w-xl space-y-4 font-serif italic text-xl text-[#D4AF37]/80 leading-relaxed">
              <p>"Autrefois, THALAMUS n'accueillait que 100 élus."</p>
              <p>"Les portes sont ouvertes désormais."</p>
              <p>"Mais le Temple choisit encore ses résidents."</p>
            </div>

            <div className="flex gap-12 pt-8">
              <div className="text-center">
                <div className="text-2xl font-black font-mono text-white">{counters.open.toLocaleString()}</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Portes ouvertes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black font-mono text-white">{counters.active.toLocaleString()}</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Résidents actifs</div>
              </div>
            </div>

            <button 
              onClick={() => handleNext('STEP1')}
              className="mt-12 px-16 py-5 rounded-full border border-[#D4AF37] text-[#D4AF37] font-black uppercase tracking-[0.4em] text-xs hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            >
              Demander ma clé
            </button>
          </motion.section>
        )}

        {['STEP1', 'STEP2', 'STEP3'].includes(step) && (
          <motion.section 
            key="form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 max-w-2xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <Logo variant="icon" size={64} className="mx-auto mb-6" />
              <div className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em]">
                Étape {step === 'STEP1' ? '1' : step === 'STEP2' ? '2' : '3'} sur 3
              </div>
              <h2 className="text-3xl font-black font-display text-white uppercase tracking-tighter">
                {step === 'STEP1' ? 'Identification & Motivation' : 
                 step === 'STEP2' ? 'Ta plus grande faiblesse émotionnelle ?' : 
                 'Que signifie \'discipline\' pour toi ?'}
              </h2>
            </div>

            <div className="w-full space-y-6">
              {step === 'STEP1' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Email</label>
                    <input 
                      type="email" 
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder="votre@email.com"
                      className="w-full bg-[#141414] border border-[#333] rounded-xl p-4 text-white outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Pseudo (ID Thalamus)</label>
                    <input 
                      type="text" 
                      value={form.pseudo}
                      onChange={(e) => setForm({...form, pseudo: e.target.value})}
                      placeholder="ex: ALPHA-7"
                      className="w-full bg-[#141414] border border-[#333] rounded-xl p-4 text-white outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <textarea 
                  value={step === 'STEP1' ? form.why : step === 'STEP2' ? form.weakness : form.discipline}
                  onChange={(e) => setForm({
                    ...form, 
                    [step === 'STEP1' ? 'why' : step === 'STEP2' ? 'weakness' : 'discipline']: e.target.value
                  })}
                  placeholder={step === 'STEP1' ? "Pourquoi souhaites-tu rejoindre Thalamus ?" : "Écrivez ici..."}
                  className="w-full h-[200px] bg-[#141414] border border-[#333] rounded-2xl p-8 text-white font-serif text-lg outline-none focus:border-[#D4AF37] transition-all resize-none shadow-inner"
                />
                {step === 'STEP1' && (
                  <div className="absolute bottom-6 right-8 flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${form.why.length >= 50 ? 'text-emerald-500' : 'text-slate-600'}`}>
                      {form.why.length} / 50 minimum
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-6">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                  {step === 'STEP1' ? 'Réfléchis. Le Temple lit chaque mot.' : 
                   step === 'STEP2' ? 'Sois honnête. C\'est ta première protection.' : 
                   'Le serment final avant l\'étude.'}
                </p>

                {step === 'STEP1' && (
                  <button 
                    disabled={form.why.length < 50 || !form.email || !form.pseudo}
                    onClick={() => handleNext('STEP2')}
                    className={`px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all ${
                      (form.why.length >= 50 && form.email && form.pseudo)
                        ? 'bg-[#D4AF37] text-black hover:bg-[#C4A030]' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    Continuer →
                  </button>
                )}

                {step === 'STEP2' && (
                  <button 
                    onClick={() => handleNext('STEP3')}
                    className="px-12 py-4 rounded-full bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs hover:bg-[#C4A030] transition-all"
                  >
                    Continuer →
                  </button>
                )}

                {step === 'STEP3' && (
                  <button 
                    onClick={handleSubmit}
                    className="px-12 py-4 rounded-full bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs hover:bg-[#C4A030] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                  >
                    Soumettre ma demande au Temple
                  </button>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {step === 'TRANSITION' && (
          <motion.section 
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8"
          >
            <div className="relative">
               <Logo variant="icon" size={100} className="animate-pulse" />
               <div className="absolute inset-0 bg-[#D4AF37]/10 blur-3xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-black font-display text-white uppercase tracking-widest">Vos mots voyagent vers le Temple...</h2>
          </motion.section>
        )}

        {step === 'PENDING' && (
          <motion.section 
            key="pending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-md mx-auto"
          >
            <div className="relative mb-4">
               <Logo variant="icon" size={80} className="animate-pulse" />
               <div className="absolute inset-0 bg-[#D4AF37]/10 blur-2xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black font-display text-white uppercase tracking-tighter">Accès Accordé par le Temple.</h2>
              <p className="text-sm text-[#D4AF37]/70 font-serif italic leading-relaxed">
                "La discipline est votre seule loi désormais."
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-widest leading-relaxed pt-4">
                Votre ID Thalamus est activé. Bienvenue chez vous.
              </p>
            </div>
            <button 
              onClick={onComplete}
              className="mt-12 px-12 py-4 rounded-full bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs hover:bg-[#C4A030] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              Entrer dans le Cockpit
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TempleSubscriptionInfo: React.FC = () => {
  const inclusions = [
    { icon: <Shield size={16} />, title: "Sentinel IA Complète", desc: "Tous les modules de protection active." },
    { icon: <Users size={16} />, title: "Communauté Privée", desc: "Accès exclusif au Discord des Résidents." },
    { icon: <MessageSquare size={16} />, title: "Coaching Mensuel", desc: "Une session de groupe en direct." },
    { icon: <HelpCircle size={16} />, title: "Support Prioritaire", desc: "Réponse garantie en moins de 24h." }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {inclusions.map((item, i) => (
        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="text-[#D4AF37]">{item.icon}</div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest">{item.title}</h4>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-widest">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};
