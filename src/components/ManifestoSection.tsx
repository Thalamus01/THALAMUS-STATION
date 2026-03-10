import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronRight, BookOpen, Microscope, Zap } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  const articles = [
    {
      title: "Le mythe du trader 24h/24",
      desc: "Pourquoi la disponibilité constante est votre pire ennemie financière.",
      tag: "Neuroscience",
      readTime: "12 min"
    },
    {
      title: "Pourquoi votre routine vous détruit",
      desc: "L'illusion de la discipline sans fondement biologique.",
      tag: "Biologie",
      readTime: "15 min"
    },
    {
      title: "J'ai mesuré mon cortex préfrontal",
      desc: "30 jours de données brutes sur la prise de décision en trading.",
      tag: "Étude de Cas",
      readTime: "20 min"
    },
    {
      title: "La vérité sur le 'flow state'",
      desc: "Ce que personne ne vous dit sur la chimie du cerveau gagnant.",
      tag: "Performance",
      readTime: "18 min"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-24">
      {/* Manifesto Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest">
            <FileText size={10} />
            Le Manifeste
          </div>
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Le Trader <br /> <span className="text-amber-500">Athlète</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-widest">
            Une exploration de 20 pages sur la biologie du trading gagnant. <br />
            Découvrez pourquoi 90% des traders ignorent leur propre cerveau et comment Thalamus change la donne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all group">
              <Download size={16} />
              Télécharger le PDF
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              Lire en ligne
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-[#15191C] to-black border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center space-y-4 relative z-10">
              <BookOpen size={64} className="text-amber-500 mx-auto mb-6" />
              <div className="text-[10px] font-black text-white uppercase tracking-[0.5em]">THALAMUS</div>
              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Édition 2026</div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Blog Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Blog Antiméthode</h3>
          <p className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">La science au service de la discipline</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-[#2B2F36] space-y-6 group cursor-pointer hover:border-amber-500/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="px-2 py-1 rounded bg-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest">{article.tag}</span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{article.readTime}</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-amber-500 transition-colors">{article.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{article.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-[8px] font-black text-amber-500 uppercase tracking-widest pt-4 border-t border-white/5">
                Lire l'article <ChevronRight size={10} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scientific Quote */}
      <section className="text-center py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Microscope size={32} className="text-slate-700 mx-auto" />
          <p className="text-lg font-serif italic text-slate-400 leading-relaxed">
            "Le trading n'est pas une bataille contre le marché, c'est une bataille contre les impulsions archaïques de votre propre cerveau reptilien."
          </p>
          <div className="text-[10px] font-black text-white uppercase tracking-widest">
            Cette réflexion guide chaque ligne de code de THALAMUS.
          </div>
        </div>
      </section>
    </div>
  );
};
