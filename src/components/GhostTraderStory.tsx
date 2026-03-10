import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Quote, History, TrendingUp, ShieldCheck } from 'lucide-react';

export const GhostTraderStory: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          L'Expérience du Trader Fantôme
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
          Le Silence <br /> <span className="text-amber-500">Après la Tempête</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
          Comment un trader anonyme a sauvé son capital et sa santé mentale en confiant son cortex préfrontal à une IA.
        </p>
      </section>

      {/* Interactive Timeline */}
      <section className="space-y-12">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center">Chronologie du Sauvetage</h3>
        <div className="relative border-l border-white/5 ml-4 md:ml-0 md:flex md:border-l-0 md:border-t md:justify-between">
          {[
            { date: 'Mois 1', title: 'Le Chaos', desc: 'Perte de 15% du capital en 2h. Insomnie chronique.', status: 'danger' },
            { date: 'Mois 2', title: 'L\'Installation', desc: 'Premiers logs Sentinel. Détection du biais de revanche.', status: 'risk' },
            { date: 'Mois 4', title: 'La Transition', desc: 'Mode Conservation actif 40% du temps. Stabilisation.', status: 'optimal' },
            { date: 'Mois 6', title: 'Le Fantôme', desc: 'Trading sans émotion. Performance constante.', status: 'optimal' }
          ].map((item, i) => (
            <div key={i} className="relative pl-8 pb-12 md:pl-0 md:pt-8 md:w-1/4">
              <div className={`absolute left-0 top-0 w-3 h-3 rounded-full -translate-x-1/2 md:left-1/2 md:-translate-y-1/2 ${
                item.status === 'danger' ? 'bg-red-500' : item.status === 'risk' ? 'bg-amber-500' : 'bg-emerald-500'
              } shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
              <div className="space-y-2 md:text-center md:px-4">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.date}</span>
                <h4 className="text-xs font-black text-white uppercase tracking-tighter">{item.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Testimony */}
      <section className="p-12 rounded-3xl bg-white/[0.02] border border-[#2B2F36] flex flex-col md:flex-row items-center gap-12">
        <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] flex-shrink-0">
          <Play size={32} className="text-black fill-current ml-1" />
        </div>
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-amber-500">
            <Quote size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Témoignage Audio (Voix Modifiée)</span>
          </div>
          <p className="text-lg font-serif italic text-slate-300 leading-relaxed">
            "Je ne voyais plus les graphiques comme des opportunités, mais comme des ennemis personnels. Thalamus n'a pas seulement sauvé mon compte, il a sauvé mon mariage."
          </p>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            — Trader Anonyme #087, 12 ans d'expérience
          </div>
        </div>
      </section>

      {/* Sentinel Logs Extract */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Extraits Logs Sentinel</h3>
          <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Accès Restreint</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-black border border-white/5 font-mono space-y-4">
            <div className="flex justify-between text-[8px] text-slate-600">
              <span>TIMESTAMP: 2025-11-14 14:32:11</span>
              <span>ID: #087-SNTL</span>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-emerald-500">[DETECTION] Biais de perte détecté (Perte &gt; 2% session)</p>
              <p className="text-[10px] text-amber-500">[ANALYSIS] Dérive comportementale : Vitesse d'exécution +40%. Clarté 18%.</p>
              <p className="text-[10px] text-red-500">[ACTION] Kill Switch activé. Terminal verrouillé pour 2h.</p>
              <p className="text-[10px] text-slate-500">[LOG] Tentative d'ouverture forcée détectée. Rejetée.</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-black border border-white/5 font-mono space-y-4">
            <div className="flex justify-between text-[8px] text-slate-600">
              <span>TIMESTAMP: 2025-11-14 16:35:04</span>
              <span>ID: #087-SNTL</span>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-cyan-500">[STATUS] Cooldown terminé. État cognitif stable (88%).</p>
              <p className="text-[10px] text-slate-500">[LOG] Utilisateur a complété le rituel de respiration.</p>
              <p className="text-[10px] text-emerald-500">[ACTION] Accès restauré. Mode Conservation activé.</p>
              <p className="text-[10px] text-slate-400">[RESULT] Session clôturée à +1.2% (Discipline 100%).</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-24 space-y-8 border-t border-white/5">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Rejoindre l'Ombre</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-md mx-auto">
          Nous n'acceptons que 100 traders par cycle. Entrez votre email pour être informé de la prochaine ouverture des récits et de la liste d'attente.
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input 
            type="email" 
            placeholder="VOTRE EMAIL" 
            className="flex-1 bg-white/[0.02] border border-[#2B2F36] rounded-xl px-6 py-4 text-xs text-white outline-none focus:border-amber-500 transition-all"
          />
          <button className="bg-amber-500 text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all">
            S'inscrire
          </button>
        </div>
      </section>
    </div>
  );
};
