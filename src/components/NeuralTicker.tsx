
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralTickerProps {
  disciplineScore: number;
}

const TRADING_PSYCHOLOGY = [
  "La discipline est le pont entre vos objectifs et vos résultats.",
  "Le marché ne vous doit rien, respectez votre plan.",
  "Une perte est une leçon, pas un échec émotionnel.",
  "La patience paie plus que l'agitation.",
  "Ne tradez pas pour l'excitation, tradez pour la précision.",
  "Votre plus grand ennemi est dans le miroir.",
  "Le trading est 10% de technique et 90% de psychologie.",
  "Acceptez l'incertitude, contrôlez le risque.",
  "Un bon trader attend que le marché vienne à lui.",
  "La vengeance contre le marché est le chemin le plus court vers la ruine.",
  "Restez humble dans la victoire, résilient dans la défaite.",
  "Le profit est le résultat d'un processus rigoureux.",
  "Ne laissez pas un trade définir votre valeur personnelle.",
  "La sur-activité est le signe d'une anxiété non gérée.",
  "Le silence intérieur est nécessaire pour entendre le marché.",
  "Chaque bougie est une information, pas une invitation.",
  "Protégez votre capital mental autant que votre capital financier.",
  "La régularité bat l'intensité sur le long terme.",
  "Apprenez à ne rien faire quand le signal n'est pas là.",
  "Le trading est un marathon, pas un sprint."
];

const WISDOM = [
  "Ce qui ne dépend pas de toi ne doit pas t'inquiéter. - Épictète",
  "L'art de la guerre, c'est de soumettre l'ennemi sans combat. - Sun Tzu",
  "Tout ce que nous entendons est une opinion, pas un fait. - Marc Aurèle",
  "Connais ton ennemi et connais-toi toi-même. - Sun Tzu",
  "Le bonheur ne dépend que de nous. - Aristote",
  "La meilleure vengeance est de ne pas ressembler à celui qui t'a blessé.",
  "Celui qui sait quand il peut combattre et quand il ne le peut pas sera victorieux.",
  "L'obstacle est le chemin. - Marc Aurèle",
  "Ne cherche pas à ce que les événements arrivent comme tu le souhaites.",
  "La victoire appartient à celui qui persévère.",
  "Un général avisé évite l'armée ennemie quand son moral est haut.",
  "La tranquillité de l'esprit est le fruit de la discipline.",
  "Le sage ne s'afflige pas de ce qu'il n'a pas, il se réjouit de ce qu'il a.",
  "Dans le chaos, il y a aussi une opportunité. - Sun Tzu",
  "Maîtriser les autres est la force, se maîtriser soi-même est le vrai pouvoir."
];

const GENERAL_KNOWLEDGE = [
  "La lumière met 8 minutes et 20 secondes pour voyager du Soleil à la Terre.",
  "Le cerveau humain génère assez d'électricité pour allumer une petite ampoule.",
  "Les pieuvres ont trois cœurs et le sang bleu.",
  "L'ADN humain est identique à 50% à celui d'une banane.",
  "Un jour sur Vénus est plus long qu'une année sur Vénus.",
  "Le mont Everest grandit d'environ 4 millimètres chaque année.",
  "Les abeilles peuvent reconnaître les visages humains.",
  "Le diamant est la substance naturelle la plus dure connue.",
  "L'eau peut bouillir et geler en même temps au point triple.",
  "Les fourmis ne dorment jamais et n'ont pas de poumons.",
  "La Grande Muraille de Chine n'est pas visible depuis la Lune à l'œil nu.",
  "Un nuage moyen pèse environ 500 tonnes.",
  "Le cœur d'une baleine bleue est de la taille d'une voiture.",
  "Les flamants roses sont roses à cause de leur alimentation en crevettes.",
  "Le son voyage environ 4 fois plus vite dans l'eau que dans l'air."
];

const CALM_PROTOCOLS = [
  "Respirez profondément. Expirez lentement.",
  "Détachez vos mains du clavier. Reculez de 30 cm.",
  "Buvez un verre d'eau. Observez l'horizon.",
  "Fermez les yeux pendant 60 secondes. Écoutez votre souffle.",
  "Le marché sera là demain. Votre sérénité est prioritaire.",
  "Identifiez l'émotion présente. Nommez-la sans jugement.",
  "Réduisez la luminosité de l'écran. Calmez le système nerveux.",
  "Un trade manqué vaut mieux qu'un capital détruit.",
  "Revenez à votre centre. La discipline est votre bouclier.",
  "Le chaos extérieur ne doit pas devenir votre chaos intérieur."
];

const CYCLE_TIME = 5 * 60 * 1000; // 5 minutes

export const NeuralTicker: React.FC<NeuralTickerProps> = React.memo(({ disciplineScore }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const stored = localStorage.getItem('THALAMUS_TICKER_INDEX');
    return stored ? parseInt(stored) : 0;
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    localStorage.setItem('THALAMUS_TICKER_INDEX', currentIndex.toString());
  }, [currentIndex]);

  const isLowDiscipline = disciplineScore < 75;

  const currentPool = useMemo(() => {
    if (isLowDiscipline) {
      return [...CALM_PROTOCOLS, ...TRADING_PSYCHOLOGY.slice(0, 10)];
    }
    return [...TRADING_PSYCHOLOGY, ...WISDOM, ...GENERAL_KNOWLEDGE];
  }, [isLowDiscipline]);

  const currentPhrase = currentPool[currentIndex % currentPool.length];

  // Timer logic with pause
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && !isGlitching) {
        setElapsedTime(prev => {
          const next = prev + 100;
          if (next >= CYCLE_TIME) {
            setIsGlitching(true);
            setShowPulse(true);
            setTimeout(() => {
              setCurrentIndex(c => c + 1);
              setIsGlitching(false);
              setElapsedTime(0);
              setTimeout(() => setShowPulse(false), 1000);
            }, 500);
            return CYCLE_TIME;
          }
          return next;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isHovered, isGlitching]);

  const progress = Math.max(0, 100 - (elapsedTime / CYCLE_TIME) * 100);

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-w-[300px] h-full group cursor-help transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulse Effect Border */}
      <AnimatePresence>
        {showPulse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.98, 1.02, 1] }}
            className={`absolute inset-0 border border-current rounded-sm pointer-events-none ${isLowDiscipline ? 'text-orange-500/30' : 'text-white/10'}`}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhrase + isGlitching}
          initial={{ opacity: 0, x: -5 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            filter: isGlitching ? 'hue-rotate(90deg) skewX(10deg) blur(1px)' : 'none',
            scale: isHovered ? 1.02 : 1
          }}
          exit={{ opacity: 0, x: 5 }}
          transition={{ duration: 0.3 }}
          className={`font-mono text-[11px] tracking-wide text-center px-4 transition-colors duration-300 ${isLowDiscipline ? 'text-orange-500' : isHovered ? 'text-[#AAA]' : 'text-[#666]'}`}
        >
          <Typewriter text={currentPhrase} />
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Bar */}
      <div className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-white/5 overflow-hidden">
        <motion.div 
          className={`h-full transition-colors duration-300 ${isLowDiscipline ? 'bg-orange-500/50' : isHovered ? 'bg-white/40' : 'bg-[#666]/30'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* Hover Indicator */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-6 text-[8px] uppercase tracking-widest text-white/20 font-bold"
          >
            TEMPS SUSPENDU • MÉDITATION EN COURS
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const Typewriter: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [text]);

  return <span>"{displayedText}"</span>;
};
