import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Activity, Zap, ShieldAlert, Target, TrendingUp, 
  AlertTriangle, CheckCircle2, MessageSquare, Info, Gauge
} from 'lucide-react';

interface NeuralBehavioralDashboardProps {
  disciplineScore: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
  cognitiveClarity: number;
  impulsivity: number;
  detectedBiases: Array<{ name: string; status: string; description: string }>;
  accountProfit: number;
  mt5Connected: boolean;
}

export const NeuralBehavioralDashboard: React.FC<NeuralBehavioralDashboardProps> = ({
  disciplineScore,
  stressLevel,
  cognitiveClarity,
  impulsivity,
  detectedBiases,
  accountProfit,
  mt5Connected
}) => {
  return (
    <div className="flex-1 bg-[#050505] p-8 overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* MAIN BEHAVIORAL GAUGE */}
        <div className="flex flex-col items-center justify-center py-12 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/[0.03]"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={690.8}
                initial={{ strokeDashoffset: 690.8 }}
                animate={{ strokeDashoffset: 690.8 - (690.8 * disciplineScore) / 100 }}
                className={disciplineScore > 80 ? "text-emerald-500" : disciplineScore > 50 ? "text-[#F59E0B]" : "text-red-500"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-[#444] uppercase tracking-[0.4em] mb-2">Discipline</span>
              <span className="text-7xl font-black text-white tracking-tighter leading-none">{disciplineScore}%</span>
              <span className={`text-[9px] font-bold uppercase tracking-widest mt-4 ${disciplineScore > 80 ? 'text-emerald-500' : 'text-[#F59E0B]'}`}>
                {disciplineScore > 80 ? 'État de Flow' : 'Vigilance Requise'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* SECONDARY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Activity className="text-cyan-500" size={16} />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Clarté Cognitive</span>
              </div>
              <span className="text-sm font-bold text-white">{cognitiveClarity}%</span>
            </div>
            <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${cognitiveClarity}%` }}
                className="h-full bg-cyan-500"
              />
            </div>
            <p className="text-[9px] text-[#444] leading-relaxed uppercase font-bold tracking-wider">
              Vitesse de traitement et cohérence décisionnelle.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Zap className={stressLevel === 'High' ? "text-red-500" : "text-[#F59E0B]"} size={16} />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Niveau de Stress</span>
              </div>
              <span className={`text-sm font-bold ${stressLevel === 'High' ? "text-red-500" : "text-[#F59E0B]"}`}>{stressLevel}</span>
            </div>
            <div className="flex gap-1.5 h-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i}
                  className={`flex-1 rounded-full ${
                    i <= (stressLevel === 'Low' ? 2 : stressLevel === 'Moderate' ? 5 : 8)
                      ? (stressLevel === 'High' ? 'bg-red-500' : 'bg-[#F59E0B]')
                      : 'bg-white/[0.03]'
                  }`}
                />
              ))}
            </div>
            <p className="text-[9px] text-[#444] leading-relaxed uppercase font-bold tracking-wider">
              Réactivité émotionnelle et charge nerveuse.
            </p>
          </motion.div>
        </div>

        {/* NEURAL LOG: BIASES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert className="text-[#444]" size={16} />
            <span className="text-[10px] font-black text-[#444] uppercase tracking-[0.3em]">Neural Log : Biais Détectés</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detectedBiases.length > 0 ? detectedBiases.map((bias, idx) => (
              <div key={idx} className="bg-white/[0.01] rounded-xl p-5 border border-white/5 flex items-start gap-4 group hover:bg-white/[0.02] transition-all">
                <div className={`p-2 rounded-lg ${bias.status === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                  <AlertTriangle size={14} />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-white uppercase tracking-widest">{bias.name}</div>
                  <div className="text-[9px] text-[#666] font-bold uppercase leading-tight">{bias.description}</div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <CheckCircle2 className="text-emerald-500/20 mb-3" size={32} />
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Esprit Rationnel</p>
                <p className="text-[9px] text-[#333] font-bold uppercase mt-2 tracking-widest">Aucune distorsion cognitive détectée</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
