
import React, { useState } from 'react';
import { Target, TrendingUp, TrendingDown, X, Edit3, DollarSign, Lock as LucideLock } from 'lucide-react';
import { Position } from '../../types';

interface Props {
  positions: Position[];
  onClose: (id: string) => void;
  onModify: (id: string, sl: number, tp: number) => void;
}

export const PositionsList: React.FC<Props> = ({ positions, onClose, onModify }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ sl: 0, tp: 0 });

  const totalPL = positions.reduce((acc, pos) => acc + pos.profit, 0);

  const startEdit = (pos: Position) => {
    setEditingId(pos.id);
    setEditValues({ sl: pos.sl, tp: pos.tp });
  };

  const saveEdit = () => {
    if (editingId) {
      const pos = positions.find(p => p.id === editingId);
      if (pos) {
        const isBuy = pos.side === 'BUY';
        const isRecul = isBuy ? editValues.sl < pos.sl : editValues.sl > pos.sl;
        
        if (isRecul) {
          // Snap back immediately in UI
          setEditValues(prev => ({ ...prev, sl: pos.sl }));
          // The onModify call will still happen but updatePosition will block it and apply penalty
        }
      }
      onModify(editingId, editValues.sl, editValues.tp);
      setEditingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0E11] border-l border-[#2B2F36]">
      <div className="p-6 border-b border-[#2B2F36] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target size={18} className="text-cyan-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-tighter">Positions</h3>
        </div>
        <div className={`px-3 py-1 rounded-lg text-[10px] font-mono font-black ${totalPL >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {totalPL >= 0 ? '+' : ''}{totalPL.toFixed(2)} $
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {positions.length > 0 ? (
          positions.map(pos => (
            <div key={pos.id} className="p-4 rounded-xl bg-white/[0.02] border border-[#2B2F36] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
              {/* SIDE INDICATOR */}
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${pos.side === 'BUY' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white uppercase tracking-tighter">{pos.symbol}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${pos.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {pos.side}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {pos.volume} Lots @ {pos.openPrice}
                  </span>
                </div>
                <div className={`text-sm font-mono font-black ${pos.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {pos.profit >= 0 ? '+' : ''}{pos.profit.toFixed(2)}
                </div>
              </div>

              {editingId === pos.id ? (
                <div className="grid grid-cols-2 gap-2 mb-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Stop Loss</span>
                      <LucideLock size={8} className="text-cyan-500/50" />
                    </div>
                    <input 
                      type="number" 
                      value={editValues.sl} 
                      onChange={(e) => {
                        const newVal = parseInt(e.target.value);
                        setEditValues({ ...editValues, sl: newVal });
                      }}
                      onBlur={() => {
                        // Snap back logic if user tries to increase risk
                        const pos = positions.find(p => p.id === editingId);
                        if (pos) {
                          const isBuy = pos.side === 'BUY';
                          const isRecul = isBuy ? editValues.sl < pos.sl : editValues.sl > pos.sl;
                          if (isRecul) {
                            setEditValues(prev => ({ ...prev, sl: pos.sl }));
                            // We can't easily trigger the notification from here without passing a prop, 
                            // but the saveEdit will call onModify which will trigger it.
                            // Or we can just let saveEdit handle it.
                          }
                        }
                      }}
                      className="bg-black/40 border border-cyan-500/30 rounded-lg p-1.5 text-[10px] font-mono text-white outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Take Profit</span>
                    <input 
                      type="number" 
                      value={editValues.tp} 
                      onChange={(e) => setEditValues({ ...editValues, tp: parseInt(e.target.value) })}
                      className="bg-black/40 border border-cyan-500/30 rounded-lg p-1.5 text-[10px] font-mono text-white outline-none"
                    />
                  </div>
                  <button 
                    onClick={saveEdit}
                    className="col-span-2 py-2 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg mt-1"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Stop Loss</span>
                      <LucideLock size={8} className="text-cyan-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-300">{pos.sl || 'None'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                    <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Take Profit</span>
                    <span className="text-[10px] font-mono text-slate-300">{pos.tp || 'None'}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => startEdit(pos)}
                  className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button 
                  onClick={() => onClose(pos.id)}
                  className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <X size={12} /> Close
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-20">
            <DollarSign size={48} className="text-slate-500" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Aucune position active</p>
          </div>
        )}
      </div>

      {/* SUMMARY FOOTER */}
      {positions.length > 0 && (
        <div className="p-6 bg-black/40 border-t border-[#2B2F36] space-y-3">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-slate-500">Exposition Totale</span>
            <span className="text-white">{(positions.reduce((acc, p) => acc + p.volume, 0)).toFixed(2)} Lots</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-slate-500">Marge Utilisée</span>
            <span className="text-white">Calculée</span>
          </div>
        </div>
      )}
    </div>
  );
};
