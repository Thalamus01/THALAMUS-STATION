
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, X, ShieldAlert } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="text-[14px] font-bold uppercase tracking-widest text-[#808080] group-hover:text-[#FFB800] transition-colors">
          {question}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-[#808080] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FFB800]' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-[13px] text-[#808080] leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FAQProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ isOpen, onClose }) => {
  const faqData = [
    {
      question: "Le Score de Discipline : Calcul et Influence",
      answer: "Le Score de Discipline est calculé en temps réel en analysant votre historique d'exécution, le respect de vos limites de risque (SL/TP) et votre stabilité émotionnelle détectée par Sentinel. Un score élevé débloque le mode HUNTER, tandis qu'une baisse sous un seuil critique active automatiquement le Mode Conservation pour prévenir les décisions impulsives."
    },
    {
      question: "Mode Conservation : Protection du Capital",
      answer: "Le Mode Conservation est une mesure de sécurité proactive. Lorsque l'IA détecte un niveau de fatigue élevé (ex: 52%) ou une dégradation de la vigilance, elle restreint l'accès à l'exécution ou réduit drastiquement la taille des lots. L'objectif est de protéger votre capital contre les erreurs induites par la fatigue ou le stress."
    },
    {
      question: "Connexion MT5 : Synchronisation Sécurisée",
      answer: "La synchronisation avec MetaTrader 5 s'effectue via le Thalamus Bridge (script MQ5). Pour une connexion sécurisée : 1. Installez le script dans votre dossier Experts MT5. 2. Autorisez les requêtes Web vers l'URL Thalamus. 3. Activez l'Algo Trading. Vos identifiants ne quittent jamais votre terminal local."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 flex items-center justify-center border border-[#FFB800]/20">
                  <HelpCircle size={20} className="text-[#FFB800]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-black text-white uppercase tracking-tighter">Centre d'Aide & FAQ</h2>
                  <p className="text-[10px] text-[#808080] font-bold uppercase tracking-widest">Thalamus Intelligence</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#808080] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="space-y-2">
                {faqData.map((item, index) => (
                  <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-red-500/5 border-t border-red-500/10">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <ShieldAlert size={18} className="text-red-500/50" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-red-500/70 uppercase tracking-widest mb-2">Avertissement Légal</h4>
                  <p className="text-[11px] text-[#808080] leading-relaxed italic">
                    "Thalamus est un outil d'aide à la décision basé sur l'IA. Les analyses, scores de fatigue et signaux ne constituent en aucun cas un conseil en investissement. L'utilisateur est seul responsable de ses ordres. Thalamus ne peut être tenu responsable des pertes financières, bugs techniques ou erreurs d'exécution via MetaTrader."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
