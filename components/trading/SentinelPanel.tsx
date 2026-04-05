
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
    <div className="h-full flex flex-col gap-6 p-5 bg-[#080808] border-r border-white/5 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Brain size={20} strokeWidth={1.5} className="text-emerald-500" />
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[2px] text-white font-black">Sentinel IA</h3>
          <p className="text-[9px] uppercase text-[#444] font-bold tracking-widest">
            Système de Protection
          </p>
        </div>
      </div>

      {/* NEURAL BRIDGE STATUS */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-[10px] uppercase tracking-[1.5px] text-white font-black">Neural Bridge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Sync</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-[#444]">
            <span>Liaison MT5</span>
            <span className="text-white font-bold">Active</span>
          </div>
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-[#444]">
            <span>Latence Flux</span>
            <span className="text-white font-bold">12ms</span>
          </div>
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-[#444]">
            <span>Protocole</span>
            <span className="text-[#666] font-bold italic">CML_v2</span>
          </div>
        </div>
      </div>

      {/* PROTECTION RULES */}
      <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] uppercase tracking-[1.5px] text-white font-black">Règles de Protection</span>
        </div>
        
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-[#444] uppercase font-bold">Mode Actif</span>
            <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">{currentMode}</span>
          </div>
          
          <div className="h-px bg-white/5 my-1" />
          
          <ul className="space-y-2">
            <li className="flex items-center justify-between text-[9px] text-[#666] font-medium">
              <span className="uppercase tracking-widest">Limite Jour</span>
              <span className="text-white">-2.0%</span>
            </li>
            <li className="flex items-center justify-between text-[9px] text-[#666] font-medium">
              <span className="uppercase tracking-widest">Max Trades/H</span>
              <span className="text-white">5</span>
            </li>
            <li className="flex items-center justify-between text-[9px] text-[#666] font-medium">
              <span className="uppercase tracking-widest">SL Obligatoire</span>
              <span className="text-emerald-500">OUI</span>
            </li>
            <li className="flex items-center justify-between text-[9px] text-[#666] font-medium">
              <span className="uppercase tracking-widest">Positions Max</span>
              <span className="text-white">3</span>
            </li>
          </ul>

          <div className="h-px bg-white/5 my-1" />
          
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-[#444] uppercase font-bold">Perte Max Adj.</span>
            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">
              -{adjustedMaxLoss}%
            </span>
          </div>
        </div>
      </div>

      {/* RECENT INTERVENTIONS */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <h4 className="text-[10px] uppercase tracking-[2px] text-[#444] flex items-center gap-2 font-black">
          <Radar size={12} strokeWidth={2} /> Journal Sentinel
        </h4>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
          {sentinelData.interventions.length > 0 ? (
            sentinelData.interventions.slice(0, 5).map(inv => (
              <div key={inv.id} className="p-3 rounded-lg bg-white/[0.01] border border-white/5 flex gap-3">
                <div className={`w-0.5 h-full min-h-[24px] rounded-full ${inv.type === 'BLOCK' ? 'bg-red-500' : 'bg-[#F59E0B]'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${inv.type === 'BLOCK' ? 'text-red-500' : 'text-[#F59E0B]'}`}>
                      {inv.type}
                    </span>
                    <span className="text-[7px] text-[#333] font-bold uppercase">Il y a 2m</span>
                  </div>
                  <p className="text-[10px] text-[#666] leading-tight line-clamp-2">{inv.reason}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 opacity-20">
              <ShieldCheck size={24} className="text-[#444] mb-2" />
              <p className="text-[8px] uppercase tracking-widest text-[#444]">Aucune intervention</p>
            </div>
          )}
        </div>
      </div>

      {/* SYSTEM INFO */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[8px] font-black text-[#222] uppercase tracking-[0.2em]">
          <span>Version 2.0.4</span>
          <span>Build: Stable</span>
        </div>
      </div>
    </div>
  );
};
