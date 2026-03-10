import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Lock, ChevronRight, Share2, Award, Star } from 'lucide-react';

export const CommunityHub: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[8px] font-black uppercase tracking-widest">
          <Users size={10} />
          Le Cercle des 100
        </div>
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Communauté <br /> <span className="text-cyan-500">Exclusive</span></h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
          Un espace de haute performance où la discipline est la seule monnaie d'échange.
        </p>
      </div>

      {/* Invitation System */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-[#2B2F36] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Lock size={18} className="text-cyan-500" />
              Système d'Invitation
            </h3>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">87/100 Places</span>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Votre Statut : Aspirant</h4>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Utilisation Thalamus : 12 jours / 30 requis pour inviter</p>
              </div>
            </div>
            
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-[40%]" />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-not-allowed">
                Générer un Code (Bloqué)
              </button>
              <button className="px-6 py-4 rounded-xl bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">
                Rejoindre la File d'Attente
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
              <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Position File d'Attente</span>
              <div className="text-xl font-black text-white">#1,432</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
              <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Temps d'Attente Estimé</span>
              <div className="text-xl font-black text-white">14 Jours</div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-cyan-500/5 border border-cyan-500/20 space-y-8">
          <h3 className="text-sm font-black text-white uppercase tracking-tighter">Onboarding Rituel</h3>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Le Serment', desc: 'Engagement à la discipline absolue.' },
              { step: '02', title: 'La Calibration', desc: '7 jours de tests cognitifs.' },
              { step: '03', title: 'L\'Entrée', desc: 'Accès aux salons privés.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-xs font-black text-cyan-500/50">{item.step}</span>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{item.title}</h4>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 rounded-xl border border-cyan-500/30 text-cyan-500 font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500/10 transition-all">
            Lire le Manifeste
          </button>
        </div>
      </section>

      {/* Community Channels */}
      <section className="space-y-8">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center">Salons Thématiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Star size={18} />, title: '#victoires', desc: 'Screens disciplinés uniquement.' },
            { icon: <ShieldCheck size={18} />, title: '#sauvetages', desc: 'Alertes qui ont tout changé.' },
            { icon: <History size={18} />, title: '#confessions', desc: 'Thérapie collective anonyme.' },
            { icon: <Activity size={18} />, title: '#cycles', desc: 'Partage biologique mutuel.' }
          ].map((channel, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-[#2B2F36] space-y-4 group hover:border-cyan-500 transition-all cursor-pointer">
              <div className="text-slate-500 group-hover:text-cyan-500 transition-colors">{channel.icon}</div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{channel.title}</h4>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{channel.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Event Banner */}
      <section className="p-12 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-transparent border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Event : La Confession</span>
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Mardi 04 Mars — 20:00</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Session live anonymisée sur la gestion du FOMO post-perte.</p>
        </div>
        <button className="px-8 py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
          Réserver ma place
        </button>
      </section>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => <Users size={size} className={className} />;
const Activity = ({ size, className }: { size: number, className?: string }) => <Users size={size} className={className} />;
const History = ({ size, className }: { size: number, className?: string }) => <Users size={size} className={className} />;
