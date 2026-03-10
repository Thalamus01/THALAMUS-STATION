import React, { useState, useEffect } from 'react';
import { Brain, Timer, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CognitiveTestProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export const CognitiveTest: React.FC<CognitiveTestProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'INTRO' | 'STROOP' | 'MEMORY' | 'REACTION' | 'RESULT'>('INTRO');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);

  // Stroop Test State
  const [stroopTask, setStroopTask] = useState({ word: '', color: '', options: [] as string[] });
  const [stroopCount, setStroopCount] = useState(0);

  // Memory Test State
  const [memoryItems, setMemoryItems] = useState<string[]>([]);
  const [memoryInput, setMemoryInput] = useState<string[]>([]);
  const [showMemory, setShowMemory] = useState(true);

  // Reaction Test State
  const [reactionStart, setReactionStart] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [waitingForClick, setWaitingForClick] = useState(false);

  useEffect(() => {
    if (step !== 'INTRO' && step !== 'RESULT' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // --- STROOP LOGIC ---
  const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
  const generateStroop = () => {
    const word = colors[Math.floor(Math.random() * colors.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setStroopTask({ word, color, options: [...colors].sort(() => Math.random() - 0.5) });
  };

  const handleStroopAnswer = (answer: string) => {
    if (answer === stroopTask.color) {
      setScore(prev => prev + 5);
    }
    if (stroopCount >= 9) {
      setStep('MEMORY');
      generateMemory();
    } else {
      setStroopCount(prev => prev + 1);
      generateStroop();
    }
  };

  // --- MEMORY LOGIC ---
  const items = ['APPLE', 'BRIDGE', 'CANDLE', 'DRAGON', 'EAGLE', 'FOREST', 'GHOST', 'HAMMER'];
  const generateMemory = () => {
    const selected = [...items].sort(() => Math.random() - 0.5).slice(0, 3);
    setMemoryItems(selected);
    setShowMemory(true);
    setTimeout(() => setShowMemory(false), 3000);
  };

  const handleMemoryAnswer = (item: string) => {
    const newInput = [...memoryInput, item];
    setMemoryInput(newInput);
    if (newInput.length === 3) {
      const correct = newInput.filter(i => memoryItems.includes(i)).length;
      setScore(prev => prev + (correct * 10));
      setStep('REACTION');
    }
  };

  // --- REACTION LOGIC ---
  useEffect(() => {
    if (step === 'REACTION') {
      const delay = 2000 + Math.random() * 3000;
      const timeout = setTimeout(() => {
        setWaitingForClick(true);
        setReactionStart(Date.now());
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  const handleReactionClick = () => {
    if (waitingForClick && reactionStart) {
      const time = Date.now() - reactionStart;
      setReactionTime(time);
      setWaitingForClick(false);
      const reactionScore = Math.max(0, 50 - Math.floor(time / 10));
      setScore(prev => prev + reactionScore);
      setTimeout(() => setStep('RESULT'), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-[#0B0E11]/98 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#15191C] border border-[#2B2F36] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-cyan-500 transition-all duration-1000" style={{ width: `${(timeLeft / 90) * 100}%` }} />

        <AnimatePresence mode="wait">
          {step === 'INTRO' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto border border-cyan-500/20">
                <Brain size={40} className="text-cyan-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Test de Vigilance</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">90 secondes pour calibrer votre état cognitif</p>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-cyan-500 mb-1 flex justify-center"><Timer size={16} /></div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Vitesse</span>
                </div>
                <div className="text-center">
                  <div className="text-cyan-500 mb-1 flex justify-center"><Brain size={16} /></div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Mémoire</span>
                </div>
                <div className="text-center">
                  <div className="text-cyan-500 mb-1 flex justify-center"><Eye size={16} /></div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Réaction</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-4 rounded-xl bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Annuler</button>
                <button onClick={() => { setStep('STROOP'); generateStroop(); }} className="flex-1 py-4 rounded-xl bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">Commencer</button>
              </div>
            </motion.div>
          )}

          {step === 'STROOP' && (
            <motion.div 
              key="stroop"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test de Stroop : Choisissez la COULEUR du mot</div>
              <div 
                className="text-5xl font-black uppercase tracking-tighter py-12"
                style={{ color: stroopTask.color.toLowerCase() }}
              >
                {stroopTask.word}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stroopTask.options.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => handleStroopAnswer(opt)}
                    className="py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'MEMORY' && (
            <motion.div 
              key="memory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mémoire de Travail : Mémorisez les 3 mots</div>
              {showMemory ? (
                <div className="flex justify-center gap-4 py-12">
                  {memoryItems.map((item, i) => (
                    <div key={i} className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 font-black text-sm uppercase">{item}</div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 py-12">
                  {items.map(item => (
                    <button 
                      key={item}
                      disabled={memoryInput.includes(item)}
                      onClick={() => handleMemoryAnswer(item)}
                      className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        memoryInput.includes(item) ? 'bg-white/5 border-transparent text-slate-700' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {step === 'REACTION' && (
            <motion.div 
              key="reaction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Temps de Réaction : Cliquez dès que l'écran devient VERT</div>
              <div 
                onClick={handleReactionClick}
                className={`w-full aspect-video rounded-2xl flex items-center justify-center cursor-pointer transition-colors duration-75 ${
                  waitingForClick ? 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-white/5'
                }`}
              >
                {waitingForClick ? (
                  <span className="text-black font-black text-2xl uppercase tracking-tighter">CLIQUEZ !</span>
                ) : (
                  <span className="text-slate-600 font-black text-sm uppercase tracking-widest">Attendez...</span>
                )}
              </div>
            </motion.div>
          )}

          {step === 'RESULT' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Test Terminé</h2>
                <div className="text-5xl font-black text-cyan-500 mt-4">{score}</div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Score de Vigilance Cognitive</p>
              </div>
              <button 
                onClick={() => onComplete(score)}
                className="w-full py-4 rounded-xl bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all"
              >
                Enregistrer & Fermer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
