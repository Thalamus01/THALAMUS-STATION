import React from 'react';
import { motion } from 'framer-motion';
import { Key, Shield, Users, Zap, Award, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';
import { MOCK_USER_STATS, MOCK_TEMPLE_DATA } from '../mockData';

export const TempleTreasure: React.FC = () => {
  const challenges = [
    { 
      id: 'connexion', 
      title: 'Connexion 30 jours', 
      reward: '-10% permanent', 
      status: 'IN_PROGRESS', 
      progress: 12, 
      total: 30,
      validation: 'Auto'
    },
    { 
      id: 'discipline', 
      title: '0 alerte rouge ignorée', 
      reward: '-15% permanent', 
      status: 'VALIDATED', 
      progress: 100, 
      total: 100,
      validation: 'Sentinel IA'
    },
    { 
      id: 'community', 
      title: '1 post communautaire', 
      reward: '-10% permanent', 
      status: 'PENDING', 
      progress: 0, 
      total: 1,
      validation: 'Modérateur'
    },
    { 
      id: 'referral', 
      title: 'Parrainage resté 3 mois', 
      reward: '-20% permanent', 
      status: 'LOCKED', 
      progress: 0, 
      total: 3,
      validation: 'Système'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[8px] font-black uppercase tracking-widest">
          <Award size={10} />
          Mon Trésor
        </div>
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter font-display">Défis du <br /> <span className="text-[#D4AF37]">Temple</span></h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
          Les réductions se gagnent par la discipline. <br />
          Chaque défi validé réduit votre tribut mensuel de façon permanente.
        </p>
      </div>

      {/* Current Subscription Status */}
      <section className="p-8 rounded-3xl bg-gradient-to-br from-[#15191C] to-black border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Key size={120} className="text-[#D4AF37] rotate-45" />
        </div>
        
        <div className="space-y-2 relative z-10">
          <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Statut Résident</span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Lien Neural Actif</h3>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-slate-500 uppercase">Tribut de Base</span>
              <span className="text-sm font-mono text-slate-400 line-through">{MOCK_TEMPLE_DATA.pricing.monthly} pts</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-slate-500 uppercase">Tribut de Discipline</span>
              <span className="text-xl font-mono font-black text-white">{MOCK_USER_STATS.currentPrice} pts</span>
            </div>
            <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase">
              -{MOCK_USER_STATS.activeDiscount}% Optimisation
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 relative z-10">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Mérite Accumulé</span>
          <div className="text-3xl font-black text-[#D4AF37] tracking-tighter">142.20 pts</div>
          <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Optimisation maximale : 47 pts/cycle (-40%)</p>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 group hover:border-[#D4AF37]/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{challenge.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest">{challenge.reward}</span>
                  <span className="text-[8px] text-slate-600">•</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Validation: {challenge.validation}</span>
                </div>
              </div>
              {challenge.status === 'VALIDATED' ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                  <CheckCircle2 size={16} />
                </div>
              ) : challenge.status === 'PENDING' ? (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/30">
                  <Clock size={16} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-600 border border-white/10">
                  <Zap size={16} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Progression</span>
                <span>{challenge.progress} / {challenge.total}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${challenge.status === 'VALIDATED' ? 'bg-emerald-500' : 'bg-[#D4AF37]'}`}
                  style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                />
              </div>
            </div>

            {challenge.status === 'IN_PROGRESS' && (
              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                Connectez-vous encore 18 jours pour débloquer cette réduction.
              </p>
            )}
            {challenge.status === 'VALIDATED' && (
              <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest leading-relaxed">
                Réduction active. Maintenez votre discipline pour la conserver.
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Rules Footer */}
      <section className="text-center py-12 border-t border-white/5 space-y-6">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
            <Shield size={12} />
            Règle de perte : 3 absences = retour tribut normal
          </div>
          <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
            <Zap size={12} />
            Optimisation maximale : -40%
          </div>
        </div>
        <p className="text-[10px] text-slate-600 font-medium leading-relaxed uppercase tracking-widest max-w-xl mx-auto italic">
          "Le Temple ne donne rien. Il récompense ceux qui s'élèvent au-dessus du bruit."
        </p>
      </section>
    </div>
  );
};
