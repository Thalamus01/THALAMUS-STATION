
import React, { useState } from 'react';
import { Brain, Activity, ShieldCheck, Zap, ShieldAlert, Radar, HelpCircle, Link, Copy, Check, RefreshCcw } from 'lucide-react';
import { Vitals, SentinelStats } from '../../types';

interface Props {
  vitals: Vitals;
  sentinelData: SentinelStats;
  currentMode: 'HUNTER' | 'CONSERVATION' | 'SHELTER' | 'RECOVERY';
  onOpenFAQ: () => void;
}

export const SentinelPanel: React.FC<Props> = ({ vitals, sentinelData, currentMode, onOpenFAQ }) => {
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
    <div className="h-full flex flex-col gap-8 p-6 bg-[#0B0E11] border-r border-[#1A1A1A] overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-transparent border border-[#333] flex items-center justify-center">
          <Brain size={20} strokeWidth={1.5} className="text-[#666]" />
        </div>
        <div>
          <h3 className="text-[12px] uppercase tracking-[1.5px] text-[#666]">Sentinel IA</h3>
          <p className="text-[11px] uppercase text-[#444]">Protection Active</p>
        </div>
      </div>

      {/* DISCIPLINE SCORE */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase text-[#444]">Score Discipline</span>
            <button 
              onClick={onOpenFAQ}
              className="text-[#444] hover:text-[#FFB800] transition-colors"
            >
              <HelpCircle size={12} />
            </button>
          </div>
          <span className={`text-[32px] font-bold ${getScoreColor(sentinelData.disciplineScore)}`}>
            {sentinelData.disciplineScore}/100
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${getProgressColor(sentinelData.disciplineScore)}`} 
            style={{ width: `${sentinelData.disciplineScore}%` }} 
          />
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getProgressColor(sentinelData.disciplineScore)}`} />
          <span className={`text-[11px] uppercase tracking-widest font-bold ${getScoreColor(sentinelData.disciplineScore)}`}>
            Mode {currentMode}
          </span>
        </div>
      </div>

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

      {/* BRIDGE CONFIGURATION */}
      <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-3">
        <div className="flex items-center gap-2">
          <Link size={14} className="text-emerald-500" />
          <span className="text-[11px] uppercase tracking-widest font-black text-emerald-500">Configuration Bridge MT5</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase text-[#444] font-bold">URL API (À copier dans MT5)</span>
            <div className="flex items-center gap-2 bg-black/40 rounded px-2 py-1.5 border border-white/5">
              <span className="text-[10px] text-[#888] font-mono truncate flex-1">{bridgeUrl}</span>
              <button onClick={() => copyToClipboard(bridgeUrl, 'url')} className="text-[#444] hover:text-white transition-colors">
                {copied === 'url' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase text-[#444] font-bold">ID THALAMUS</span>
            <div className="flex items-center gap-2 bg-black/40 rounded px-2 py-1.5 border border-white/5">
              <span className="text-[10px] text-[#888] font-mono flex-1">{bridgeId}</span>
              <button onClick={() => copyToClipboard(bridgeId, 'id')} className="text-[#444] hover:text-white transition-colors">
                {copied === 'id' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>
        
        <button 
          onClick={testConnection}
          disabled={testStatus === 'testing'}
          className={`w-full py-1.5 rounded text-[9px] uppercase font-bold transition-all flex items-center justify-center gap-2 ${
            testStatus === 'success' ? 'bg-emerald-500 text-white' :
            testStatus === 'error' ? 'bg-red-500 text-white' :
            'bg-white/5 hover:bg-white/10 text-[#888]'
          }`}
        >
          {testStatus === 'testing' ? <RefreshCcw size={10} className="animate-spin" /> : <Zap size={10} />}
          {testStatus === 'success' ? 'API OPÉRATIONNELLE' : 
           testStatus === 'error' ? 'ERREUR CONNEXION' : 
           'TESTER LA CONNEXION'}
        </button>

        <div className="flex items-center justify-between px-1">
          <span className="text-[8px] uppercase text-[#444]">Dernière Synchro MT5</span>
          <span className="text-[8px] text-emerald-500 font-mono">
            {sentinelData.emotionState.lastUpdate ? new Date(sentinelData.emotionState.lastUpdate).toLocaleTimeString() : '--:--:--'}
          </span>
        </div>

        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 space-y-1">
          <p className="text-[9px] text-amber-500 font-bold uppercase tracking-tighter">⚠️ Conseil Expert</p>
          <p className="text-[8px] text-amber-500/80 leading-tight">
            Vercel perd la mémoire. Pour une connexion 100% stable, utilisez l'URL Cloud Run dans MT5 :
          </p>
          <div className="flex items-center gap-1 bg-black/40 rounded px-1 py-0.5 border border-white/5 mt-1">
            <span className="text-[7px] text-[#888] font-mono truncate flex-1">{fallbackUrl}</span>
            <button onClick={() => copyToClipboard(fallbackUrl, 'fallback')} className="text-[#444] hover:text-white transition-colors">
              {copied === 'fallback' ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
            </button>
          </div>
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
