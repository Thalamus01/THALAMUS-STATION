
import React, { useState } from 'react';
import { Brain, Activity, ShieldCheck, Zap, ShieldAlert, Radar, HelpCircle, Link, Copy, Check, RefreshCcw } from 'lucide-react';
import { Vitals, SentinelStats } from '../../types';

interface Props {
  vitals: Vitals;
  sentinelData: SentinelStats;
  currentMode: 'HUNTER' | 'CONSERVATION' | 'SHELTER' | 'RECOVERY';
  onOpenFAQ: () => void;
  userProfile: any;
  adjustedMaxLoss: number;
}

export const SentinelPanel: React.FC<Props> = ({ vitals, sentinelData, currentMode, onOpenFAQ, userProfile, adjustedMaxLoss }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setTestStatus('testing');
    try {
      const response = await fetch(`${window.location.origin}/api/health`);
      if (response.ok) setTestStatus('success');
      else setTestStatus('error');
    } catch (e) {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const bridgeUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/trading-data` : '...';
  const fallbackUrl = 'https://ais-pre-6n3uzutnu4vfywuf7h4xvy-130630791689.europe-west2.run.app/api/trading-data';
  const bridgeId = 'THA-5234-OBA';

  const getModeColor = () => {
    switch (currentMode) {
      case 'HUNTER': return sentinelData.disciplineScore >= 85 ? 'text-emerald-500 border-emerald-500' : 'text-[#F59E0B] border-[#F59E0B]';
      case 'CONSERVATION': return 'text-[#F59E0B] border-[#F59E0B]';
      case 'SHELTER': return 'text-red-500 border-red-500';
      default: return 'text-[#888] border-[#333]';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 40) return 'text-[#F59E0B]';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 40) return 'bg-[#F59E0B]';
    return 'bg-red-500';
  };

  return (
    <div className="h-full flex flex-col gap-6 p-5 bg-[#0B0E11] border-r border-[#1A1A1A] overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Brain size={20} strokeWidth={1.5} className="text-emerald-500" />
        </div>
        <div>
          <h3 className="text-[12px] uppercase tracking-[1.5px] text-[#F5F5F0] font-black">Sentinel IA</h3>
          <p className="text-[10px] uppercase text-emerald-500 font-bold tracking-widest">
            {userProfile?.name || 'Initialisation...'}
          </p>
        </div>
      </div>

      {/* SHIELD HEALTH */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-[1.5px] text-[#666] flex items-center gap-1">
            <ShieldCheck size={10} /> Santé du Bouclier
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${getScoreColor(sentinelData.disciplineScore)}`}>
            {sentinelData.disciplineScore >= 85 ? 'OPTIMAL' : sentinelData.disciplineScore >= 40 ? 'VIGILANCE' : 'CRITIQUE'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getProgressColor(sentinelData.disciplineScore)}`}
            style={{ width: `${sentinelData.disciplineScore}%` }}
          />
        </div>
      </div>

      {/* UNIVERSAL PROTECTION PANEL */}
      <div className="p-5 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-emerald-500" />
          <span className="text-[12px] uppercase tracking-[1.5px] text-white font-black">Protection Sentinel</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#666] uppercase font-bold">Mode</span>
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">STANDARD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#666] uppercase font-bold">Statut</span>
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACTIF
            </span>
          </div>
          
          <div className="h-px bg-emerald-500/10 my-2" />
          
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-[10px] text-[#888] font-medium">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              Limite jour : <span className="text-white ml-auto">-2%</span>
            </li>
            <li className="flex items-center gap-2 text-[10px] text-[#888] font-medium">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              Max trades/h : <span className="text-white ml-auto">5</span>
            </li>
            <li className="flex items-center gap-2 text-[10px] text-[#888] font-medium">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              SL obligatoire : <span className="text-white ml-auto">OUI</span>
            </li>
            <li className="flex items-center gap-2 text-[10px] text-[#888] font-medium">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              Positions max : <span className="text-white ml-auto">3</span>
            </li>
          </ul>

          <div className="h-px bg-emerald-500/10 my-2" />
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#666] uppercase font-bold">Niveau de Risque</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${getScoreColor(sentinelData.disciplineScore)}`}>
              Mode {currentMode}
            </span>
          </div>
        </div>

        <button className="w-full py-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-[#444] hover:text-red-400 hover:border-red-400/20 transition-all">
          Désactiver temporairement
        </button>
      </div>

      <p className="text-[10px] text-[#666] leading-relaxed text-center px-4 italic">
        "Thalamus protège votre capital avec des règles de trading professionnelles pré-configurées."
      </p>

      {/* DANGER INDEX */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase text-[#444]">Danger Index</span>
          </div>
          <span className={`text-[24px] font-bold ${sentinelData.dangerIndex && sentinelData.dangerIndex > 70 ? 'text-red-500' : sentinelData.dangerIndex && sentinelData.dangerIndex > 40 ? 'text-[#F59E0B]' : 'text-emerald-500'}`}>
            {(sentinelData.dangerIndex || 0).toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${sentinelData.dangerIndex && sentinelData.dangerIndex > 70 ? 'bg-red-500' : sentinelData.dangerIndex && sentinelData.dangerIndex > 40 ? 'bg-[#F59E0B]' : 'bg-emerald-500'}`} 
            style={{ width: `${sentinelData.dangerIndex || 0}%` }} 
          />
        </div>
      </div>

      {/* SENTINEL METRICS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white/[0.02] border border-[#1A1A1A] space-y-2">
          <span className="text-[9px] uppercase text-[#444] font-bold block">Conformité</span>
          <div className="flex items-end gap-1">
            <span className="text-[20px] font-bold text-[#F5F5F0]">{sentinelData.conformityRate}%</span>
          </div>
          <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${sentinelData.conformityRate}%` }} />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-[#1A1A1A] space-y-2">
          <span className="text-[9px] uppercase text-[#444] font-bold block">Vigilance</span>
          <div className="flex items-end gap-1">
            <span className="text-[20px] font-bold text-[#F5F5F0]">{sentinelData.cognitiveReadiness}%</span>
          </div>
          <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500" style={{ width: `${sentinelData.cognitiveReadiness}%` }} />
          </div>
        </div>
      </div>

      {/* DETECTED BIASES */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-[#F59E0B]" />
          <span className="text-[11px] uppercase tracking-widest font-black text-[#F59E0B]">Biais Cognitifs Actifs</span>
        </div>
        <div className="space-y-2">
          {sentinelData.detectedBiases.slice(0, 2).map(bias => (
            <div key={bias.id} className="p-3 rounded-lg bg-white/[0.02] border border-[#1A1A1A] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-white uppercase">{bias.name}</p>
                <p className="text-[8px] text-[#444] uppercase">{bias.frequency} de fréquence</p>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                bias.status === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                bias.status === 'high' ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              }`}>
                {bias.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PREDICTIVE ANALYSIS */}
      <div className="p-5 rounded-lg bg-transparent border border-[#1A1A1A] space-y-3">
        <div className="flex items-center gap-3">
          <Zap size={16} strokeWidth={1.5} className="text-emerald-500" />
          <span className="text-[12px] uppercase tracking-[1.5px] text-[#666]">Analyse Prédictive</span>
        </div>
        <p className="text-[11px] text-[#888] leading-relaxed italic">
          {sentinelData.emotionState.intensity > 50 
            ? `Votre intensité émotionnelle est élevée (${sentinelData.emotionState.intensity}%). Historiquement, à ce niveau, vous prenez 73% de décisions impulsives dans les 10 prochaines minutes.`
            : "État cognitif optimal détecté. La probabilité d'erreur émotionnelle est inférieure à 12% pour la prochaine heure."}
        </p>
      </div>

      {/* EMOTION STATE */}
      <div className="p-5 rounded-lg bg-transparent border border-[#1A1A1A] space-y-4">
        <div className="flex items-center gap-3">
          <Activity size={16} strokeWidth={1.5} className="text-[#666]" />
          <span className="text-[12px] uppercase tracking-[1.5px] text-[#666]">État Émotionnel</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-[#888]">{sentinelData.emotionState.dominantEmotion}</span>
          <span className="text-[24px] font-bold text-[#F5F5F0]">{sentinelData.emotionState.intensity}%</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sentinelData.emotionState.patterns.map((p, i) => (
            <span key={i} className="px-2 py-1 rounded bg-transparent border border-[#1A1A1A] text-[11px] uppercase text-[#444]">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* RECENT ALERTS */}
      <div className="flex-1 space-y-4">
        <h4 className="text-[12px] uppercase tracking-[1.5px] text-[#666] flex items-center gap-2">
          <Radar size={12} strokeWidth={1.5} /> Alertes Récentes
        </h4>
        <div className="space-y-3">
          {sentinelData.interventions.slice(0, 3).map(inv => (
            <div key={inv.id} className="flex gap-3">
              <div className={`w-1 h-8 rounded-full ${inv.type === 'BLOCK' ? 'bg-red-500' : 'bg-[#F59E0B]'}`} />
              <div className="flex-1">
                <p className="text-[11px] uppercase text-[#444] leading-none mb-1">{inv.type}</p>
                <p className="text-[14px] text-[#888] line-clamp-1">{inv.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
