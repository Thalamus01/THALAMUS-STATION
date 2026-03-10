
import React, { useMemo, memo } from 'react';
import { BookOpen, Target, Brain, TrendingUp, TrendingDown, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export interface TradeEntry {
  id: string;
  asset: string;
  direction: 'BUY' | 'SELL';
  risk: number;
  result: 'PENDING' | 'WIN' | 'LOSS';
  emotion: 'COLD' | 'EXCITED' | 'FRUSTRATED';
  timestamp: number;
}

interface Props {
  entries: TradeEntry[];
  onDelete: (id: string) => void;
  onUpdateResult: (id: string, result: 'WIN' | 'LOSS') => void;
}

const CombatJournal: React.FC<Props> = memo(({ entries, onDelete, onUpdateResult }) => {
  const disciplineRate = useMemo(() => {
    if (entries.length === 0) return 100;
    const disciplinedTrades = entries.filter(e => e.risk <= 0.5).length;
    return Math.round((disciplinedTrades / entries.length) * 100);
  }, [entries]);

  const emotionMap = {
    COLD: { label: 'FROID (OPTIMAL)', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    EXCITED: { label: 'EXCITÉ (DANGER)', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    FRUSTRATED: { label: 'FRUSTRÉ (INTERDIT)', color: 'text-red-400', bg: 'bg-red-400/10' },
  };

  return (
    <section className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-slate-900/20 shadow-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
            <BookOpen className="text-cyan-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">JOURNAL DE COMBAT DU SNIPER</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Log de discipline neuro-cognitive</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">TAUX DE DISCIPLINE</span>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black italic text-cyan-400">{disciplineRate}%</div>
              <div className="w-12 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-1000 ${disciplineRate > 80 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-red-500'}`} 
                  style={{ width: `${disciplineRate}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
              <th className="px-6 py-4">Horodatage</th>
              <th className="px-6 py-4">Actif</th>
              <th className="px-6 py-4">Direction</th>
              <th className="px-6 py-4">Risque</th>
              <th className="px-6 py-4">État Émotionnel</th>
              <th className="px-6 py-4">Résultat</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-600 font-bold uppercase italic text-xs tracking-widest">
                  Aucune donnée de combat enregistrée. Initialisez une position pour logger.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="group hover:bg-white/5 transition-all animate-in fade-in slide-in-from-left-2">
                  <td className="px-6 py-6 text-[10px] font-mono text-slate-500">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-white italic">{entry.asset}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`flex items-center gap-2 text-[10px] font-black ${entry.direction === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {entry.direction === 'BUY' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {entry.direction}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-xs font-mono font-bold ${entry.risk > 0.5 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {entry.risk.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-current/20 text-[8px] font-black ${emotionMap[entry.emotion].bg} ${emotionMap[entry.emotion].color}`}>
                      <Brain size={10} />
                      {emotionMap[entry.emotion].label}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {entry.result === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button onClick={() => onUpdateResult(entry.id, 'WIN')} className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 rounded-md text-[8px] font-black transition-all">WIN</button>
                        <button onClick={() => onUpdateResult(entry.id, 'LOSS')} className="px-2 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-slate-950 border border-red-500/20 rounded-md text-[8px] font-black transition-all">LOSS</button>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-black italic ${entry.result === 'WIN' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {entry.result}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button onClick={() => onDelete(entry.id)} className="p-2 text-slate-700 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export default CombatJournal;
