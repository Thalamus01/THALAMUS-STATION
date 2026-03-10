
import React, { useState, useEffect } from 'react';
import { Wind, X } from 'lucide-react';
import { Language, translations } from '../i18n';

interface Props {
  onClose: () => void;
  lang?: Language;
}

const CardiacCoherence: React.FC<Props> = ({ onClose, lang = 'FR' }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Exhale'>('Inhale');
  const [timeLeft, setTimeLeft] = useState(60);
  const t = translations[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase(p => p === 'Inhale' ? 'Exhale' : 'Inhale');
    }, 5000); // 5s in, 5s out

    const countdown = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(countdown);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countdown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-center relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={24} />
        </button>

        <Wind className="mx-auto text-blue-400 mb-6 animate-pulse" size={48} />
        
        <h2 className="text-2xl font-bold mb-2">{t.coherenceTitle}</h2>
        <p className="text-slate-400 mb-8">{t.coherenceSubtitle}</p>

        <div className="relative h-48 flex items-center justify-center">
          <div className={`absolute w-32 h-32 rounded-full border-4 border-blue-500/30 transition-all duration-[5000ms] ease-in-out ${phase === 'Inhale' ? 'scale-150 border-blue-400' : 'scale-75 border-blue-600 opacity-50'}`} />
          <span className="text-xl font-medium uppercase tracking-widest text-blue-300">
            {phase === 'Inhale' ? t.inhale : t.exhale}
          </span>
        </div>

        <div className="mt-8 text-4xl font-mono text-slate-500">
          0:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default CardiacCoherence;
