
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export const FeedbackSystem: React.FC = () => {
  const [show7DayPopup, setShow7DayPopup] = useState(false);
  const [show15DaySurvey, setShow15DaySurvey] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Initialize or get first launch date
    let firstLaunch = localStorage.getItem('thalamus_first_launch');
    if (!firstLaunch) {
      firstLaunch = Date.now().toString();
      localStorage.setItem('thalamus_first_launch', firstLaunch);
    }

    const daysSinceLaunch = Math.floor((Date.now() - parseInt(firstLaunch)) / (1000 * 60 * 60 * 24));
    
    // 7-Day Logic
    const last7DayShown = localStorage.getItem('thalamus_7day_last_shown');
    const today = new Date().toDateString();
    
    if (daysSinceLaunch >= 7 && daysSinceLaunch < 15) {
      if (last7DayShown !== today) {
        setShow7DayPopup(true);
      }
    }

    // 15-Day Logic
    const surveyCompleted = localStorage.getItem('thalamus_survey_completed');
    if (daysSinceLaunch >= 15 && !surveyCompleted) {
      setShow15DaySurvey(true);
      setIsBlocked(true);
    }
  }, []);

  const handle7DayResponse = (response: 'OUI' | 'NON') => {
    localStorage.setItem('thalamus_7day_last_shown', new Date().toDateString());
    setShow7DayPopup(false);
    
    // Optionally store the testimonial
    const testimonials = JSON.parse(localStorage.getItem('thalamus_testimonials') || '[]');
    testimonials.push({ date: new Date().toISOString(), helped: response === 'OUI' });
    localStorage.setItem('thalamus_testimonials', JSON.stringify(testimonials));
  };

  const handleSurveySubmit = () => {
    localStorage.setItem('thalamus_survey_completed', 'true');
    setShow15DaySurvey(false);
    setIsBlocked(false);
  };

  return (
    <>
      {/* 7-Day Popup */}
      <AnimatePresence>
        {show7DayPopup && (
          <div className="fixed bottom-8 right-8 z-[11000] w-80">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="bg-[#0B0E11] border border-[#FFB800]/30 p-6 rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FFB800]" />
              <button 
                onClick={() => setShow7DayPopup(false)}
                className="absolute top-4 right-4 text-[#444] hover:text-white"
              >
                <X size={16} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 flex items-center justify-center border border-[#FFB800]/20">
                  <MessageSquare size={16} className="text-[#FFB800]" />
                </div>
                <h3 className="text-[12px] font-black text-white uppercase tracking-tighter">Sentinel Feedback</h3>
              </div>
              
              <p className="text-[13px] text-slate-300 mb-6 leading-relaxed">
                Thalamus vous a-t-il aidé à éviter un mauvais trade aujourd'hui ?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handle7DayResponse('OUI')}
                  className="flex-1 py-2 bg-[#FFB800] text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-[#FFB800]/90 transition-colors"
                >
                  OUI
                </button>
                <button
                  onClick={() => handle7DayResponse('NON')}
                  className="flex-1 py-2 bg-white/5 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  NON
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 15-Day Blocking Survey */}
      <AnimatePresence>
        {show15DaySurvey && (
          <div className="fixed inset-0 z-[12000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-[#FFB800]/10 rounded-3xl flex items-center justify-center border border-[#FFB800]/20 mx-auto mb-8">
                <Star size={40} className="text-[#FFB800]" />
              </div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Sondage de Satisfaction</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Vous utilisez Thalamus depuis 15 jours. Pour continuer à bénéficier de la protection Sentinel, merci de répondre à ce court sondage.
              </p>
              
              <div className="space-y-6 mb-10 text-left">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Note globale de l'IA</label>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:border-[#FFB800] transition-colors">
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Point fort principal</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#FFB800]">
                    <option>Protection contre l'overtrading</option>
                    <option>Analyse de la fatigue</option>
                    <option>Discipline (SL/TP)</option>
                    <option>Interface & Cockpit</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleSurveySubmit}
                className="w-full py-4 bg-[#FFB800] text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,184,0,0.2)] hover:scale-[1.02] transition-transform"
              >
                VALIDER ET REPRENDRE LE TRADING
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[#444] uppercase tracking-widest">
                <ShieldAlert size={12} />
                Accès temporairement restreint
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
