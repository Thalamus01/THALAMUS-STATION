
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Error logging could go here
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-[#0B0E11] border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Flux de données interrompu</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tentative de reconnexion automatique...</p>
          </div>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black text-[#D4AF37] uppercase tracking-widest transition-all"
          >
            <RefreshCcw size={12} /> Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
