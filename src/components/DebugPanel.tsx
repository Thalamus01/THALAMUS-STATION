import React from 'react';

interface DebugPanelProps {
  sentinelState: any;
  metrics: any;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ sentinelState, metrics }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#444] hover:text-white transition-all"
      >
        {isOpen ? 'CLOSE DEBUG' : 'OPEN DEBUG'}
      </button>

      {isOpen && (
        <div className="mt-2 w-[400px] max-h-[500px] bg-[#0B0E11] border border-[#2B2F36] rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-[#2B2F36] bg-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Sentinel Debug Logs</span>
            <span className="text-[9px] text-emerald-500 font-mono">WS: {sentinelState.isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <div className="space-y-1">
              <h4 className="text-[9px] font-black text-[#444] uppercase">Raw WS Data</h4>
              <pre className="text-[10px] font-mono text-emerald-500/80 bg-black/40 p-2 rounded border border-white/5 overflow-x-auto">
                {JSON.stringify(sentinelState, null, 2)}
              </pre>
            </div>

            <div className="space-y-1">
              <h4 className="text-[9px] font-black text-[#444] uppercase">Calculated Metrics</h4>
              <pre className="text-[10px] font-mono text-cyan-500/80 bg-black/40 p-2 rounded border border-white/5 overflow-x-auto">
                {JSON.stringify(metrics, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
