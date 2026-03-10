import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, Activity, Loader2, ShieldAlert, CheckCircle2, AlertTriangle, Signal, Unplug, ShieldCheck, Radar,
  Wind, Brain, Timer, Lock, Unlock, MessageSquareQuote, Eye, Bell, TrendingDown, TrendingUp, History,
  Coffee, Moon, Sun, RefreshCcw, LogOut, ChevronRight, BarChart3, Star, Users, FileText, Share2,
  ChevronDown, Ghost, Target, Menu, Anchor, X, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TradingViewChart from './components/TradingViewChart';
import { SentinelPanel } from './components/trading/SentinelPanel';
import { ActionPanel } from './components/trading/ActionPanel';
import { PositionsList } from './components/trading/PositionsList';
import MarketWatch from './components/trading/MarketWatch';
import AccountLinkModal from './components/AccountLinkModal';
import NeuralChat from './components/NeuralChat';
import { CognitiveTest } from './src/components/CognitiveTest';
import { CircularClock } from './src/components/CircularClock';
import { GhostTraderStory } from './src/components/GhostTraderStory';
import { EmotionalCostCalculator } from './src/components/EmotionalCostCalculator';
import { EmailTemplates } from './src/components/EmailTemplates';
import { TempleTreasure as TreasureDashboard } from './src/components/TempleTreasure';
import { MOCK_USER_STATS } from './src/mockData';
import { Key, Award, User, PenTool, Mail, HelpCircle, Link } from 'lucide-react';
import { Logo } from './src/components/Logo';
import { FAQ } from './src/components/FAQ';
import { ASSET_CONFIGS, calculateLots } from './constants';
import { FeedbackSystem } from './src/components/FeedbackSystem';
import { DashboardContent } from './src/components/DashboardContent';
import { useMT5 } from './src/hooks/useMT5';
import { ErrorBoundary } from './src/components/ErrorBoundary';

interface Vitals {
  discipline: number;
  baselineDiscipline: number;
  cognitiveClarity: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
  impulsivity: number;
  killSwitchActive: boolean;
  heartRate: number;
  rmssd: number;
  readinessScore: number;
}

interface AccountData {
  id: string;
  platform: string;
  server: string;
  balance: number | null;
  equity: number | null;
  profit: number | null;
  currency?: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'WAITING';
  symbols?: string[];
}

interface Bias {
  id: string;
  name: string;
  count: number;
  impact: string;
  frequency: string;
  status: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface EmotionState {
  intensity: number;
  dominantEmotion: 'FOMO' | 'Revenge' | 'Euphoria' | 'Fatigue' | 'Calm';
  patterns: string[];
  lastUpdate: string;
}

interface BiorhythmZone {
  hour: number;
  status: 'OPTIMAL' | 'RISK' | 'DANGER';
  score: number;
}

interface CycleStats {
  chronotype: 'Lark' | 'Owl' | 'Hybrid';
  cognitiveCapital: number;
  dangerIndex: number;
  currentMode: 'HUNTER' | 'CONSERVATION' | 'SHELTER' | 'RECOVERY';
  zones: BiorhythmZone[];
  nextTransition: {
    time: string;
    type: 'RISK' | 'DANGER' | 'OPTIMAL';
  } | null;
  lastAlertedHour: number | null;
}

interface Intervention {
  id: string;
  type: 'BLOCK' | 'FRICTION' | 'SUGGESTION' | 'COOLDOWN';
  reason: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
}

interface Position {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  sl: number;
  tp: number;
  profit: number;
  timestamp: string;
}

interface SentinelStats {
  disciplineScore: number;
  conformityRate: number;
  optimalWindow: string;
  avoidWindow: string;
  cognitiveReadiness: number;
  detectedBiases: Bias[];
  emotionState: EmotionState;
  interventions: Intervention[];
}

import { BrokerConnection } from './components/BrokerConnection';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { ContextePerdu } from './src/components/ContextePerdu';
import { SuccessPage } from './src/components/SuccessPage';

const EmailPreview: React.FC = () => {
  const [selected, setSelected] = useState<keyof typeof EmailTemplates>('confirmation');
  
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(EmailTemplates).map((key) => (
          <button
            key={key}
            onClick={() => setSelected(key as any)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              selected === key ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-slate-500 hover:bg-white/10'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-100 p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aperçu Email Temple</span>
        </div>
        <div className="h-[600px] overflow-y-auto bg-[#0A0A0A]">
          <div dangerouslySetInnerHTML={{ 
            __html: selected === 'confirmation' ? EmailTemplates.confirmation('Trader') :
                    selected === 'acceptance' ? EmailTemplates.acceptance('Trader', 'La discipline est ma seule loi') :
                    selected === 'expirationReminder' ? EmailTemplates.expirationReminder('Trader') :
                    selected === 'welcome' ? EmailTemplates.welcome('Trader', '1248') :
                    EmailTemplates.challengeSuccess('Trader', 'Connexion 30 jours validée', '71.10')
          }} />
        </div>
      </div>
    </div>
  );
};

import { TempleRitual } from './src/components/TempleSubscription';

// --- CONFIGURATION DE PRODUCTION ---
const isSimulated = false;
const demoMode = false;
const liveTrading = true;
const sentinelProtection = true;
// -----------------------------------

export default function App() {
  const [showHandshake, setShowHandshake] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [mt5Connected, setMt5Connected] = useState(false);
  const [isFluxLive, setIsFluxLive] = useState(false);
  
  const [isResident, setIsResident] = useState(() => {
    const stored = localStorage.getItem('THALAMUS_IS_RESIDENT');
    return stored === 'true';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('THALAMUS_USER_NAME') || 'Trader Anonyme';
  });
  const [activeAssets, setActiveAssets] = useState(() => {
    const stored = localStorage.getItem('THALAMUS_ACTIVE_ASSETS');
    return stored ? JSON.parse(stored) : ['EURUSD', 'GBPUSD', 'XAUUSD', 'USOIL'];
  });
  const [currentAsset, setCurrentAsset] = useState('EURUSD');
  
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  // Use robust MT5 hook
  const { ticks, positions: mt5Positions, accountData: mt5AccountData, isConnected: isMT5SocketConnected, isDemoMode, marketData } = useMT5(activeAssets, (pos, oldSl) => {
    // EXTERNAL VIOLATION DETECTED
    setNotification("TENTATIVE DE VIOLATION EXTERNE BLOQUÉE");
    applyDisciplinePenalty("Recul du Stop Loss (Externe)");
    
    // IMMEDIATE CORRECTION
    updatePosition(pos.id, oldSl, pos.tp);
  });

  // Sync mt5Connected with actual connection status
  useEffect(() => {
    setMt5Connected(isMT5SocketConnected);
  }, [isMT5SocketConnected]);

  useEffect(() => {
    if (mt5AccountData) {
      console.log("[APP DEBUG] Syncing account data:", mt5AccountData);
      setAccountData(prev => ({
        ...(prev || {
          id: mt5AccountData.id,
          platform: 'MT5',
          server: 'Thalamus-Live-Server',
          status: 'CONNECTED'
        }),
        ...mt5AccountData,
        profit: positions.reduce((acc, p) => acc + p.profit, 0) || mt5AccountData.profit
      } as AccountData));
    }
  }, [mt5AccountData, positions]);

  const [isSecondaryBarOpen, setIsSecondaryBarOpen] = useState(false);
  const [showMarketDropdown, setShowMarketDropdown] = useState(false);
  const [syncCharts, setSyncCharts] = useState(false);

  // Discipline Penalty Helper
  const applyDisciplinePenalty = (reason: string) => {
    setSentinelData(prev => ({
      ...prev,
      disciplineScore: Math.max(0, prev.disciplineScore - 15),
      interventions: [{
        id: Date.now().toString(),
        type: 'BLOCK',
        reason: reason,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE'
      }, ...prev.interventions]
    }));
    setNotification(`VIOLATION DÉTECTÉE : ${reason} (-15 pts)`);
  };

  // Bidirectional SL Monitoring (RiskShield) - REMOVED redundant useEffect

  const [currentLot, setCurrentLot] = useState<number>(0.12);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [slPoints, setSlPoints] = useState<number>(50);
  const [tpPoints, setTpPoints] = useState<number>(100);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('THALAMUS_IS_RESIDENT', isResident.toString());
  }, [isResident]);

  useEffect(() => {
    localStorage.setItem('THALAMUS_USER_NAME', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('THALAMUS_ACTIVE_ASSETS', JSON.stringify(activeAssets));
  }, [activeAssets]);

  // Fetch account data from MT5 API
  // REMOVED: Redundant fetch logic, now handled by the main sync effect at line 679.

  // Auto-calculate lots based on risk and asset
  useEffect(() => {
    if (accountData?.balance) {
      const calculated = calculateLots(accountData.balance, riskPercent, slPoints, currentAsset);
      setCurrentLot(calculated);
    }
  }, [accountData?.balance, riskPercent, slPoints, currentAsset]);

  const [showConfirmModal, setShowConfirmModal] = useState<{side: 'BUY' | 'SELL', open: boolean}>({side: 'BUY', open: false});
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTicketId, setLastTicketId] = useState<string | null>(null);
  const [execStep, setExecStep] = useState<'IDLE' | 'SENDING' | 'WAITING_EA' | 'CONFIRMED'>('IDLE');
  const [hasConfirmedRealMode, setHasConfirmedRealMode] = useState(false);
  const [showRealModeWarning, setShowRealModeWarning] = useState(false);
  const [pendingSide, setPendingSide] = useState<'BUY' | 'SELL' | null>(null);
  const [bpm, setBpm] = useState<number>(0);
  
  const [vitals, setVitals] = useState<Vitals>(() => {
    const stored = localStorage.getItem('THALAMUS_VITALS');
    return stored ? JSON.parse(stored) : { 
      impulsivity: 0, 
      discipline: 85, 
      cognitiveClarity: 90, 
      stressLevel: 'Low', 
      killSwitchActive: false, 
      baselineDiscipline: 85,
      heartRate: 72,
      rmssd: 55,
      readinessScore: 85
    };
  });

  useEffect(() => {
    localStorage.setItem('THALAMUS_VITALS', JSON.stringify(vitals));
  }, [vitals]);

  const [huaweiStatus, setHuaweiStatus] = useState<'DISCONNECTED' | 'WAITING' | 'CONNECTED'>('DISCONNECTED');
  const [validationErrors, setValidationErrors] = useState<{lot?: boolean, sl?: boolean, tp?: boolean}>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'COCKPIT' | 'SENTINEL' | 'TREASURE' | 'PROFILE'>('COCKPIT');
  const [sentinelTab, setSentinelTab] = useState<'STATUS' | 'CYCLES' | 'SHIELD' | 'EVOLUTION'>('STATUS');
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [dailyLoss, setDailyLoss] = useState(0);
  const [tradesToday, setTradesToday] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [showCycleAlert, setShowCycleAlert] = useState(false);
  const [showCognitiveTest, setShowCognitiveTest] = useState(false);
  const [showClosingRitual, setShowClosingRitual] = useState(false);
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [rescueAmount, setRescueAmount] = useState(0);
  const [expSubTab, setExpSubTab] = useState<'STORY' | 'CALCULATOR' | 'EMAILS'>('STORY');
  const [vixValue, setVixValue] = useState(18.5);
  const [lastPauseTime, setLastPauseTime] = useState(new Date(Date.now() - 1000 * 60 * 45)); // 45 min ago
  const [sessionStartTime, setSessionStartTime] = useState(new Date());
  const [consecutiveLosses, setConsecutiveLosses] = useState(0);
  const [userOath, setUserOath] = useState('Je m\'engage à respecter la discipline du Temple.');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSentinelMenu, setShowSentinelMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showAccountLinkModal, setShowAccountLinkModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarketsDrawerOpen, setIsMarketsDrawerOpen] = useState(false);
  const [showProfit, setShowProfit] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [tpAlert, setTpAlert] = useState<{open: boolean, message: string}>({open: false, message: ''});
  const [slAlert, setSlAlert] = useState<{open: boolean, message: string}>({open: false, message: ''});
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRevealProfit = () => {
    setShowProfit(!showProfit);
  };

  const handleRevealBalance = () => {
    setShowBalance(!showBalance);
  };

  const addAssetFromMT5 = (symbol: string) => {
    if (activeAssets.includes(symbol)) {
      setCurrentAsset(symbol);
      return;
    }
    if (activeAssets.length >= 8) {
      setNotification("SENTINEL : Limite de 8 marchés atteinte pour préserver la fluidité.");
      return;
    }
    setActiveAssets(prev => [...prev, symbol]);
    setCurrentAsset(symbol);
    setNotification(`EA MT5 : ${symbol} ajouté au Cockpit.`);
  };

  const removeAsset = (symbol: string) => {
    setActiveAssets(prev => {
      const next = prev.filter(s => s !== symbol);
      if (currentAsset === symbol && next.length > 0) {
        setCurrentAsset(next[0]);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1' && activeAssets[0]) setCurrentAsset(activeAssets[0]);
        if (e.key === '2' && activeAssets[1]) setCurrentAsset(activeAssets[1]);
        if (e.key === '3' && activeAssets[2]) setCurrentAsset(activeAssets[2]);
        if (e.key === '4' && activeAssets[3]) setCurrentAsset(activeAssets[3]);
        if (e.key === '5' && activeAssets[4]) setCurrentAsset(activeAssets[4]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAssets]);

  const secondaryAssets = activeAssets.filter(a => a !== currentAsset);

  const hasSL = positions.length > 0 && positions.every(p => p.sl > 0);

  // Sync positions with MT5
  useEffect(() => {
    if (mt5Positions && mt5Positions.length > 0) {
      setPositions(mt5Positions.map(p => ({
        ...p,
        currentPrice: ticks[p.symbol]?.bid || p.openPrice,
        timestamp: new Date().toISOString()
      })));
    } else if (!isDemoMode) {
      setPositions([]);
    }
  }, [mt5Positions, ticks, isDemoMode]);

  useEffect(() => {
    if (positions.length === 0) {
      setAccountData(prev => prev ? { ...prev, profit: 0 } : null);
      return;
    }
    const totalProfit = positions.reduce((acc, pos) => acc + pos.profit, 0);
    setAccountData(prev => prev ? { ...prev, profit: totalProfit } : null);
  }, [positions]);

  useEffect(() => {
    if (positions.length === 0) return;
    // Real-time profit is synced from MT5 positions
  }, [positions.length]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (positions.length === 0) return;
    // Sentinel Monitoring is now handled by the useMT5 hook and updatePosition
  }, [positions.length]);
  
  const [cycleData, setCycleData] = useState<CycleStats>({
    chronotype: 'Hybrid',
    cognitiveCapital: 85,
    dangerIndex: 15,
    currentMode: 'HUNTER',
    zones: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      status: i >= 9 && i <= 12 ? 'OPTIMAL' : i >= 14 && i <= 16 ? 'OPTIMAL' : i >= 22 || i <= 5 ? 'DANGER' : 'RISK',
      score: i >= 9 && i <= 12 ? 90 : i >= 14 && i <= 16 ? 85 : i >= 22 || i <= 5 ? 20 : 55
    })),
    nextTransition: { time: '16:30', type: 'RISK' },
    lastAlertedHour: null
  });
  
  const [sentinelData, setSentinelData] = useState<SentinelStats>(() => {
    const stored = localStorage.getItem('THALAMUS_SENTINEL_DATA');
    return stored ? JSON.parse(stored) : {
      disciplineScore: 85,
      conformityRate: 92,
      optimalWindow: '10:00-12:00',
      avoidWindow: '16:00-18:00',
      cognitiveReadiness: 85,
      detectedBiases: [
        { id: 'fomo', name: 'FOMO', count: 1198, impact: '-2.3R', frequency: '73%', status: 'high', description: 'Volume anormal + Impulsivité ↑ + Discipline ↓' },
        { id: 'revenge', name: 'Trading Vengeur', count: 534, impact: '-3.1R', frequency: '68%', status: 'critical', description: 'Trade dans les 5min après perte >2R' },
        { id: 'fatigue', name: 'Fatigue Cognitive', count: 23, impact: '-1.8R', frequency: '4j/5', status: 'medium', description: 'Win rate chute de 62% à 31% après 16h' },
        { id: 'overconf', name: 'Surconfiance', count: 856, impact: '+0.8R manqué', frequency: '52%', status: 'low', description: 'Clôture winners à 40% du TP cible' }
      ],
      emotionState: {
        intensity: 24,
        dominantEmotion: 'Calm',
        patterns: ['Stabilité respiratoire', 'Focus optimal'],
        lastUpdate: new Date().toISOString()
      },
      interventions: []
    };
  });

  useEffect(() => {
    localStorage.setItem('THALAMUS_SENTINEL_DATA', JSON.stringify(sentinelData));
  }, [sentinelData]);

  const executeTrade = async () => {
    if (!isLinked) {
      setNotification("ERREUR : Neural Handshake non établi.");
      return;
    }
    if (!accountData) return;

    // 1. CONNEXION CHECK
    if (!mt5Connected) {
      setNotification("ERREUR : Aucun terminal détecté. Ouvrez MT5.");
      return;
    }

    // 3. SÉCURITÉ SENTINEL
    if (sentinelData.disciplineScore < 40 && !showReflection) {
      setNotification("DISCIPLINE FAIBLE : Sentinel exige une double confirmation.");
      setShowReflection(true);
      return;
    }

    if (cycleData.currentMode === 'SHELTER') {
      setNotification("MODE SHELTER ACTIF : Entrées bloquées par Sentinel Cycles.");
      return;
    }

    if (cooldownActive) {
      setNotification(`PROTECTION ACTIVE : Cooldown en cours (${cooldownTimeLeft}s)`);
      return;
    }

    if (sentinelData.emotionState.intensity > 85) {
      setCooldownActive(true);
      setCooldownTimeLeft(300); 
      setSentinelData(prev => ({
        ...prev,
        interventions: [{
          id: Date.now().toString(),
          type: 'BLOCK',
          reason: `Intensité émotionnelle critique (${prev.emotionState.intensity}%)`,
          timestamp: new Date().toISOString(),
          status: 'ACTIVE'
        }, ...prev.interventions]
      }));
      setNotification("SENTINEL : État émotionnel instable. Trade bloqué pour votre protection.");
      return;
    }

    if (!showReflection && sentinelData.emotionState.intensity > 60) {
      setShowReflection(true);
      return;
    }

    if (!mt5Connected && !isDemoMode) {
      setNotification("ERREUR : Connexion MT5 requise pour trader en mode réel.");
      return;
    }

    if (liveTrading && !hasConfirmedRealMode) {
      setPendingSide(showConfirmModal.side);
      setShowRealModeWarning(true);
      setShowConfirmModal({ side: 'BUY', open: false });
      return;
    }

    // Validation
    const errors: {lot?: boolean, sl?: boolean, tp?: boolean} = {};
    if (!currentLot || currentLot <= 0) errors.lot = true;
    if (slPoints === undefined || slPoints < 0) errors.sl = true;
    if (tpPoints === undefined || tpPoints < 0) errors.tp = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setTimeout(() => setValidationErrors({}), 2000);
      return;
    }
    
    setIsExecuting(true);
    setExecStep('SENDING');
    
    try {
      // Sentinel Verification
      if (sentinelProtection) {
        await new Promise(r => setTimeout(r, 50));
      }
      
      const finalVolume = cycleData.currentMode === 'CONSERVATION' ? currentLot / 2 : currentLot;
      
      const payload = {
        account_id: "THA-5234-OBA",
        key: "OWENkeya2015.com",
        command: 'OPEN_TRADE',
        cmd_id: Date.now().toString(),
        side: showConfirmModal.side,
        symbol: currentAsset,
        volume: finalVolume,
        sl_points: slPoints,
        tp_points: tpPoints,
        comment: `Thalamus ${cycleData.currentMode} REAL`
      };

      setExecStep('WAITING_EA');
      const response = await fetch('/api/trading-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.status === 'queued') {
        setNotification('ORDRE RÉEL ENVOYÉ AU MARCHÉ');
        setExecStep('CONFIRMED');
        
        setTimeout(() => setNotification(null), 3000);
        pollForConfirmation(data.cmd_id, showConfirmModal.side, finalVolume);
      }
    } catch (err) {
      console.error("Real Execution Failed:", err);
      setIsExecuting(false);
      setExecStep('IDLE');
    }
  };

  const confirmRealMode = () => {
    setHasConfirmedRealMode(true);
    setShowRealModeWarning(false);
    if (pendingSide) {
      setShowConfirmModal({ side: pendingSide, open: true });
    }
  };

  const updatePosition = async (id: string, newSl: number, newTp: number) => {
    const position = positions.find(p => p.id === id);
    if (!position) return;

    // SL Non-Recul Rule (Frontend Guard)
    if (newSl !== position.sl) {
      const isBuy = position.side === 'BUY';
      const isRecul = isBuy ? newSl < position.sl : newSl > position.sl;

      if (isRecul) {
        setNotification("VIOLATION DE PROTOCOLE THALAMUS DÉTECTÉ");
        applyDisciplinePenalty("Tentative de recul du Stop Loss");
        return;
      }
    }

    // Simulate MT5 Bridge Communication
    try {
      // 1. SEND UPDATE TO BRIDGE
      const response = await fetch('/api/trading-data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Thalamus-Key': 'OWENkeya2015.com'
        },
        body: JSON.stringify({
          account_id: accountData?.id,
          key: "OWENkeya2015.com",
          command: 'UPDATE_TRADE',
          ticket_id: id,
          sl_points: newSl,
          tp_points: newTp
        })
      });

      if (!response.ok) throw new Error("Bridge Offline");

      setPositions(prev => prev.map(p => 
        p.id === id ? { ...p, sl: newSl, tp: newTp } : p
      ));
      setNotification("POSITION MODIFIÉE");
    } catch (err) {
      // Intercept MT5 errors related to SL and show specific message
      setNotification("Modification refusée par Sentinel");
      console.error("MT5 Modification Error:", err);
    }
  };

  const closePosition = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    setNotification("POSITION CLÔTURÉE");
  };

  const pollForConfirmation = (cmdId: string, side: 'BUY' | 'SELL', volume: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/trading-data?id=${accountData?.id}&check_cmd=${cmdId}&key=OWENkeya2015.com`);
        const data = await response.json();
        
        if (data.confirmed) {
          clearInterval(pollInterval);
          setLastTicketId(data.ticket_id || "TKT-" + Math.floor(Math.random() * 10000));
          setExecStep('CONFIRMED');
          
          setTimeout(() => {
            setIsExecuting(false);
            setExecStep('IDLE');
            setShowConfirmModal({ ...showConfirmModal, open: false });
          }, 1000);

          // 4. FEEDBACK : Add position to list
          const newPosition: Position = {
            id: data.ticket_id || "TKT-" + Math.floor(Math.random() * 10000),
            symbol: currentAsset,
            side: side,
            volume: volume,
            openPrice: data.open_price || ticks[currentAsset]?.bid || 1.0845,
            currentPrice: ticks[currentAsset]?.bid || 1.0845,
            sl: slPoints,
            tp: tpPoints,
            profit: 0,
            timestamp: new Date().toISOString()
          };
          setPositions(prev => [newPosition, ...prev]);
          setNotification("POSITION OUVERTE AVEC SUCCÈS");
        }
      } catch (err) {
        console.error("Poll Error:", err);
      }
    }, 1000);
  };

  // MT5 data is now handled by the useMT5 hook at the top level
  useEffect(() => {
    if (marketData) {
      setIsFluxLive(marketData.isLive);
    } else if (mt5Connected) {
      setIsFluxLive(true);
    }
    if (mt5Connected) {
      setIsLinked(true);
    }
  }, [marketData, mt5Connected]);

  useEffect(() => {
    if (huaweiStatus !== 'CONNECTED') return;
    const interval = setInterval(() => {
      const simulatedImpulsivity = Math.floor(20 + Math.random() * 60);
      setBpm(simulatedImpulsivity);
      setVitals({
        impulsivity: simulatedImpulsivity,
        discipline: Math.max(30, 100 - (simulatedImpulsivity / 2)), 
        cognitiveClarity: Math.max(0, 100 - (simulatedImpulsivity - 40)),
        stressLevel: simulatedImpulsivity > 75 ? 'High' : simulatedImpulsivity > 50 ? 'Moderate' : 'Low',
        killSwitchActive: false,
        baselineDiscipline: 65,
        heartRate: simulatedImpulsivity,
        rmssd: Math.max(20, 100 - simulatedImpulsivity),
        readinessScore: Math.max(10, 100 - (simulatedImpulsivity / 1.5))
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [huaweiStatus]);

  // Cooldown Timer
  useEffect(() => {
    if (!cooldownActive || cooldownTimeLeft <= 0) {
      if (cooldownActive && cooldownTimeLeft <= 0) setCooldownActive(false);
      return;
    }
    const timer = setInterval(() => {
      setCooldownTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownActive, cooldownTimeLeft]);

  // Emotion Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSentinelData(prev => {
        let intensity = prev.emotionState.intensity;
        let dominant = prev.emotionState.dominantEmotion;
        let patterns = [...prev.emotionState.patterns];

        // Logic based on vitals
        const currentHour = new Date().getHours();
        const isLateNight = currentHour >= 22 || currentHour <= 4;

        if (vitals.impulsivity > 75) {
          intensity = Math.min(100, intensity + 5);
          dominant = 'FOMO';
          patterns = ['Impulsivité critique', 'Vitesse d\'exécution ↑'];
        } else if (vitals.stressLevel === 'High') {
          intensity = Math.min(100, intensity + 3);
          dominant = 'Revenge';
          patterns = ['Dérive comportementale', 'Biais de perte actif'];
        } else if (vitals.cognitiveClarity < 40 || isLateNight) {
          intensity = Math.min(100, intensity + 2);
          dominant = 'Fatigue';
          patterns = ['Temps de réaction ↑', 'Baisse de vigilance', isLateNight ? 'Heure tardive' : 'Clarté cognitive basse'];
        } else {
          intensity = Math.max(10, intensity - 2);
          dominant = intensity < 30 ? 'Calm' : dominant;
          patterns = intensity < 30 ? ['Stabilité comportementale', 'Focus optimal'] : patterns;
        }

        return {
          ...prev,
          emotionState: {
            ...prev.emotionState,
            intensity,
            dominantEmotion: dominant,
            patterns,
            lastUpdate: new Date().toISOString()
          }
        };
      });

      // Update Cognitive Capital & Modes
      setCycleData(prev => {
        const hour = new Date().getHours();
        const zone = prev.zones[hour];
        let capital = prev.cognitiveCapital;
        let mode = prev.currentMode;

        // Simulate VIX fluctuation
        setVixValue(v => Math.max(12, Math.min(35, v + (Math.random() - 0.5))));

        // Drain capital based on intensity, time since last pause, and session duration
        const sessionDurationHours = (Date.now() - sessionStartTime.getTime()) / (1000 * 60 * 60);
        const timeSincePauseHours = (Date.now() - lastPauseTime.getTime()) / (1000 * 60 * 60);
        
        const drainRate = (sentinelData.emotionState.intensity / 400) + (sessionDurationHours / 20) + (timeSincePauseHours / 10);
        capital = Math.max(0, capital - drainRate);
        
        // Danger Index = (Volatility_VIX * Fatigue_Trader) / (Discipline_Historique + 1) / 2
        const fatigue = 100 - capital;
        const discipline = sentinelData.disciplineScore / 100;
        const danger = (vixValue * fatigue) / ((discipline + 1) * 2.5);

        // Auto-switch modes based on thresholds (SHELTER disabled for preview)
        if (danger > 95 || capital < 10) {
          // mode = 'SHELTER'; // Disabled auto-shelter to let user work
        } else if (danger > 70 || zone.status === 'DANGER' || capital < 25) {
          if (mode !== 'CONSERVATION' && mode !== 'SHELTER') {
            mode = 'CONSERVATION';
            setNotification("MODE CONSERVATION : Fatigue ou Zone Risquée détectée.");
          }
        } else if (consecutiveLosses >= 2) {
          mode = 'RECOVERY';
        } else if (zone.status === 'OPTIMAL' && capital > 70 && danger < 30) {
          mode = 'HUNTER';
        }

        // Trigger alert if transitioning to risk soon (30 min before)
        const nextHour = (hour + 1) % 24;
        if (prev.zones[nextHour].status !== zone.status && !showCycleAlert && prev.lastAlertedHour !== nextHour) {
          setShowCycleAlert(true);
          return {
            ...prev,
            cognitiveCapital: Number(capital.toFixed(1)),
            dangerIndex: Number(Math.min(100, danger).toFixed(1)),
            currentMode: mode,
            lastAlertedHour: nextHour
          };
        }

        // Trigger Rescue Modal if high intensity and not recently shown (DISABLED AS REQUESTED)
        /*
        if (sentinelData.emotionState.intensity > 85 && !showRescueModal) {
          setRescueAmount(currentLot * 100); // Simulated rescue amount
          setShowRescueModal(true);
        }
        */

        return {
          ...prev,
          cognitiveCapital: Number(capital.toFixed(1)),
          dangerIndex: Number(Math.min(100, danger).toFixed(1)),
          currentMode: mode
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [vitals, sentinelData.emotionState.intensity]);

  const isNeuralLocked = false;

  if (showSuccess) {
    return <SuccessPage onComplete={() => { setShowSuccess(false); setIsLinked(true); }} />;
  }

  if (!isLinked) {
    return <LandingPage onEnterCockpit={() => setShowSuccess(true)} />;
  }

  // BANDEAU BAS (UNIFICATION)
  const AlertBanner: React.FC<{ mode: string, score: number }> = ({ mode, score }) => {
    const getBannerConfig = () => {
      switch (mode) {
        case 'HUNTER': return { color: score >= 85 ? '#22C55E' : '#F59E0B', desc: 'Capacité maximale' };
        case 'CONSERVATION': return { color: '#F59E0B', desc: 'Fatigue détectée' };
        case 'SHELTER': return { color: '#EF4444', desc: 'Protection active' };
        case 'RECOVERY': return { color: '#06B6D4', desc: 'Récupération' };
        default: return { color: '#F59E0B', desc: 'Fatigue détectée' };
      }
    };
    const config = getBannerConfig();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="fixed bottom-0 left-0 w-full h-[32px] z-[9999] bg-black/95 backdrop-blur-md border-t border-[#1A1A1A] flex items-center justify-between px-6 text-[11px] text-[#666] font-medium uppercase">
        <div className="flex items-center gap-2 shrink-0">
          {mode === 'CONSERVATION' ? (
            <div className="flex items-center gap-2 text-[#F59E0B] animate-pulse">
              <AlertTriangle size={12} />
              <span className="font-black">MODE CONSERVATION : FATIGUE OU ZONE RISQUÉE DÉTECTÉE</span>
            </div>
          ) : (
            <>
              <span>MODE {mode}</span>
              <span className="mx-1">—</span>
              <span>{config.desc}</span>
            </>
          )}
        </div>

        <div className="flex-1 flex justify-center px-4 overflow-hidden">
          <span className="text-[8px] tracking-[0.05em] opacity-30 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
            AVERTISSEMENT : THALAMUS EST UN OUTIL D'AIDE À LA DÉCISION. LE TRADING COMPORTE DES RISQUES.
          </span>
        </div>

        <div className="flex items-center shrink-0">
          <span>{score}/100 • {time}</span>
        </div>
      </div>
    );
  };

  if (!isResident) {
    return <TempleRitual onComplete={() => setIsResident(true)} />;
  }

  return (
    <div className={`h-screen flex flex-col overflow-y-auto bg-[#0A0A0A] text-slate-300 font-sans transition-all duration-1000 pb-8 ${cycleData.currentMode === 'RECOVERY' ? 'grayscale contrast-75' : ''} ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* ALERTE CRITIQUE / SHELTER MODAL */}
      {cycleData.currentMode === 'SHELTER' && (
        <div className="fixed inset-0 z-[10000] bg-[#2A0A0A]/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-[#1A0505] border border-red-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.2)] text-center space-y-8 animate-pulse-slow">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/40">
              <ShieldAlert size={40} className="text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Mode Shelter Activé</h2>
              <p className="text-red-400/80 text-sm font-medium leading-relaxed">
                RÉSONANCE CRITIQUE DÉTECTÉE. Le système a verrouillé toutes les entrées pour protéger votre capital émotionnel et financier.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setCycleData(prev => ({ ...prev, currentMode: 'HUNTER', cognitiveCapital: 100, dangerIndex: 0 }))}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl transition-all"
              >
                REPRENDRE LE CONTRÔLE (HUNTER)
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCycleData(prev => ({ ...prev, currentMode: 'CONSERVATION' }))}
                  className="py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all text-xs"
                >
                  MODE CONSERVATION
                </button>
                <button 
                  onClick={() => setActiveTab('SENTINEL')}
                  className="py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all text-xs"
                >
                  ANALYSE SENTINEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTO-OPENING CYCLE ALERT */}
      {showCycleAlert && cycleData.currentMode !== 'SHELTER' && (
        <div className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full bg-[#0B0E11] border border-amber-500/30 p-8 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                <AlertTriangle size={24} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Transition de Cycle</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Alerte Sentinel Cycles</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              Une transition vers une zone de <span className="text-amber-500 font-bold">RISQUE</span> est imminente. Sentinel recommande de passer en mode Conservation.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => { setCycleData(prev => ({ ...prev, currentMode: 'CONSERVATION' })); setShowCycleAlert(false); }}
                className="flex-1 py-3 bg-amber-500 text-black font-black uppercase tracking-widest rounded-lg text-[10px]"
              >
                MODE CONSERVATION
              </button>
              <button 
                onClick={() => setShowCycleAlert(false)}
                className="flex-1 py-3 bg-white/5 text-white font-bold uppercase tracking-widest rounded-lg text-[10px] border border-white/10"
              >
                IGNORER
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <header className={`h-[60px] border-b border-[#1A1A1A] bg-[#0A0A0A] flex items-center justify-between px-6 z-50 transition-all duration-300 shrink-0
        ${cycleData.currentMode === 'SHELTER' ? 'bg-[#1A0505]' : ''}
        ${isScrolled ? 'h-[50px]' : ''}`}>
        
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMarketsDrawerOpen(!isMarketsDrawerOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#888] hover:text-[#F59E0B]"
            >
              <Menu size={20} />
            </button>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('COCKPIT')}>
            <div className="relative">
              <Logo variant="icon" size={32} className="transition-all" />
              {cycleData.dangerIndex > 70 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0A0A0A]" />
              )}
            </div>
            <div className="relative py-1">
              <span className={`text-[14px] font-black tracking-[0.25em] transition-all uppercase ${activeTab === 'COCKPIT' ? 'text-[#D4AF37]' : 'text-[#F5F5F0] group-hover:text-[#D4AF37]'}`}>THALAMUS</span>
              {activeTab === 'COCKPIT' && <div className="absolute bottom-[-18px] left-0 w-full h-[2px] bg-[#D4AF37]" />}
            </div>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-10">
          <button
            onClick={() => { setActiveTab('SENTINEL'); setSentinelTab('STATUS'); }}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
              activeTab === 'SENTINEL' && sentinelTab === 'STATUS' ? 'text-[#D4AF37]' : 'text-[#888] hover:text-[#D4AF37]'
            }`}
          >
            Sentinel IA
            {activeTab === 'SENTINEL' && sentinelTab === 'STATUS' && <div className="absolute bottom-[-18px] left-0 w-full h-[2px] bg-[#D4AF37]" />}
          </button>

          <button
            onClick={() => { setActiveTab('SENTINEL'); setSentinelTab('CYCLES'); }}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
              activeTab === 'SENTINEL' && sentinelTab === 'CYCLES' ? 'text-[#D4AF37]' : 'text-[#888] hover:text-[#D4AF37]'
            }`}
          >
            Cycles
            {activeTab === 'SENTINEL' && sentinelTab === 'CYCLES' && <div className="absolute bottom-[-18px] left-0 w-full h-[2px] bg-[#D4AF37]" />}
          </button>

          <button
            onClick={() => { setActiveTab('SENTINEL'); setSentinelTab('SHIELD'); }}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
              activeTab === 'SENTINEL' && sentinelTab === 'SHIELD' ? 'text-[#D4AF37]' : 'text-[#888] hover:text-[#D4AF37]'
            }`}
          >
            Protection
            {activeTab === 'SENTINEL' && sentinelTab === 'SHIELD' && <div className="absolute bottom-[-18px] left-0 w-full h-[2px] bg-[#D4AF37]" />}
          </button>
        </nav>
        </div>

        <div className="flex items-center gap-8">
          <BrokerConnection 
            isFluxLive={isFluxLive} 
            mt5Connected={mt5Connected} 
            onConnectMT5={() => setMt5Connected(true)} 
          />
          {/* PROFIL DROPDOWN */}
          <div className="relative group hidden md:block">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onMouseEnter={() => setShowProfileMenu(true)}
              className={`text-[14px] transition-all flex items-center gap-2 py-1 ${
                ['TREASURE', 'PROFILE'].includes(activeTab) ? 'text-[#D4AF37]' : 'text-[#888] hover:text-[#D4AF37]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#2B2F36] flex items-center justify-center overflow-hidden">
                <User size={16} strokeWidth={1.5} />
              </div>
              <span>Profil</span>
              <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              {['TREASURE', 'PROFILE'].includes(activeTab) && <div className="absolute bottom-[-18px] left-0 w-full h-[2px] bg-[#D4AF37]" />}
            </button>

            {showProfileMenu && (
              <div 
                className="absolute top-full right-0 mt-2 w-56 bg-[#0D0D0D]/90 backdrop-blur-[10px] border border-[#333] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-3 animate-in fade-in zoom-in duration-200 z-[1000]"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-[12px] uppercase tracking-[1.5px] text-[#666]">{userName}</p>
                  <p className="text-[11px] text-[#444] font-medium truncate uppercase">ngtinfos@gmail.com</p>
                </div>
                {[
                  { id: 'TREASURE', label: 'Mon Trésor', icon: <Award size={14} strokeWidth={1.5} /> },
                  { id: 'PROFILE', label: 'Paramètres', icon: <User size={14} strokeWidth={1.5} /> },
                  { id: 'ADMIN', label: 'Admin Console', icon: <ShieldCheck size={14} strokeWidth={1.5} /> },
                  { id: 'FAQ', label: 'Aide & FAQ', icon: <HelpCircle size={14} strokeWidth={1.5} /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { 
                      if (item.id === 'LINK') {
                        setShowAccountLinkModal(true);
                      } else if (item.id === 'FAQ') {
                        setShowFAQ(true);
                      } else if (item.id === 'ADMIN') {
                        setShowAdminDashboard(true);
                      } else {
                        setActiveTab(item.id as any);
                      }
                      setShowProfileMenu(false); 
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] transition-colors ${
                      activeTab === item.id ? 'text-[#D4AF37] bg-white/5' : 'text-[#888] hover:bg-white/5 hover:text-[#D4AF37]'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="h-px bg-[#333] my-2 mx-2" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Unplug size={14} strokeWidth={1.5} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden flex items-center gap-4">
            {isFluxLive && (
              <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            )}
            <button 
              className="p-2 text-[#F5F5F0]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <Ghost size={24} /> : <Activity size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-black/98 z-[100] flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <Logo variant="icon" size={40} />
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                  <Ghost size={32} />
                </button>
              </div>
              
              <nav className="flex flex-col gap-10">
                <button 
                  onClick={() => { setActiveTab('COCKPIT'); setIsMobileMenuOpen(false); }}
                  className={`text-3xl font-black tracking-tighter text-left uppercase ${activeTab === 'COCKPIT' ? 'text-[#D4AF37]' : 'text-white'}`}
                >
                  THALAMUS
                </button>
                
                <button 
                  onClick={() => { setActiveTab('SENTINEL'); setSentinelTab('STATUS'); setIsMobileMenuOpen(false); }}
                  className={`text-3xl font-black tracking-tighter text-left uppercase ${activeTab === 'SENTINEL' && sentinelTab === 'STATUS' ? 'text-[#D4AF37]' : 'text-white'}`}
                >
                  SENTINEL IA
                </button>

                <button 
                  onClick={() => { setActiveTab('SENTINEL'); setSentinelTab('CYCLES'); setIsMobileMenuOpen(false); }}
                  className={`text-3xl font-black tracking-tighter text-left uppercase ${activeTab === 'SENTINEL' && sentinelTab === 'CYCLES' ? 'text-[#D4AF37]' : 'text-white'}`}
                >
                  CYCLES
                </button>

                <button 
                  onClick={() => { setActiveTab('SENTINEL'); setSentinelTab('SHIELD'); setIsMobileMenuOpen(false); }}
                  className={`text-3xl font-black tracking-tighter text-left uppercase ${activeTab === 'SENTINEL' && sentinelTab === 'SHIELD' ? 'text-[#D4AF37]' : 'text-white'}`}
                >
                  PROTECTION
                </button>

                <div className="h-px bg-white/10 my-4" />

                <div className="space-y-6">
                  <button onClick={() => { setActiveTab('TREASURE'); setIsMobileMenuOpen(false); }} className="text-xl font-bold text-slate-300 block w-full text-left">Récompenses</button>
                  <button onClick={() => { setActiveTab('PROFILE'); setIsMobileMenuOpen(false); }} className="text-xl font-bold text-slate-300 block w-full text-left">Paramètres</button>
                  <button className="text-xl font-bold text-red-400 block w-full text-left">Déconnexion</button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {activeTab === 'COCKPIT' ? (
        <ErrorBoundary>
          <DashboardContent
            accountData={accountData}
            positions={positions}
            isDemoMode={isDemoMode}
            showProfit={showProfit}
            handleRevealProfit={handleRevealProfit}
            showBalance={showBalance}
            handleRevealBalance={handleRevealBalance}
            hasSL={hasSL}
            disciplineScore={sentinelData.disciplineScore}
            mt5Connected={mt5Connected}
          >
          <div className="h-full flex flex-row overflow-hidden">
            {/* LEFT DRAWER: MARKETS */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 flex overflow-hidden">
                {/* LEFT: SENTINEL IA */}
                <aside className="hidden lg:block w-[280px] border-r border-[#2B2F36]">
                  <SentinelPanel 
                    vitals={vitals} 
                    sentinelData={sentinelData} 
                    currentMode={cycleData.currentMode} 
                    onOpenFAQ={() => setShowFAQ(true)}
                  />
                </aside>

                {/* LEFT-CENTER: MARKET WATCH */}
                <aside className="hidden xl:block w-[300px] border-r border-[#2B2F36]">
                  <MarketWatch 
                    marketData={marketData}
                    onSelectSymbol={(s) => addAssetFromMT5(s)}
                    currentSymbol={currentAsset}
                  />
                </aside>

                {/* CENTER: CHART(S) */}
                <section className="flex-1 relative bg-black flex flex-col overflow-hidden">
                  {activeAssets.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Activity size={32} className="text-[#444]" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Cockpit Vide</h3>
                        <p className="text-[#666] text-xs uppercase tracking-wider">Ajoutez un marché depuis MT5 ou le menu latéral</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col relative">
                      {/* PRINCIPAL CHART */}
                      <div className="flex-1 relative">
                        <TradingViewChart symbol={currentAsset} isLive={isFluxLive} />
                        
                        {/* MARKET TABS (Inside Chart Area) */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 max-w-[calc(100%-100px)] overflow-x-auto no-scrollbar pb-2">
                          {activeAssets.map((asset, idx) => (
                            <button
                              key={asset}
                              onClick={() => setCurrentAsset(asset)}
                              className={`px-3 py-1.5 rounded bg-black/80 backdrop-blur-md border transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 whitespace-nowrap ${
                                currentAsset === asset 
                                  ? 'border-[#F59E0B] text-[#F5F5F0]' 
                                  : 'border-white/10 text-[#666] hover:text-[#888] hover:border-white/20'
                              }`}
                            >
                              {currentAsset === asset && <span className="w-1 h-1 rounded-full bg-[#F59E0B]" />}
                              {asset}
                              <span className="text-[8px] opacity-30 ml-1">Alt+{idx + 1}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* SECONDARY BAR */}
                      {secondaryAssets.length > 0 && (
                        <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${isSecondaryBarOpen ? 'h-[200px]' : 'h-10'}`}>
                          {/* TOGGLE BAR */}
                          <button 
                            onClick={() => setIsSecondaryBarOpen(!isSecondaryBarOpen)}
                            className="w-full h-10 bg-[#0D0D0D] border-t border-[#1A1A1A] flex items-center justify-between px-6 hover:bg-[#151515] transition-colors"
                          >
                            <div className="flex items-center gap-3 text-[10px] font-black text-[#888] uppercase tracking-widest">
                              <ChevronUp size={14} className={`transition-transform duration-300 ${isSecondaryBarOpen ? 'rotate-180' : ''}`} />
                              {secondaryAssets.length} marchés secondaires
                            </div>
                            <div className="text-[9px] text-[#444] font-bold uppercase tracking-widest">
                              {secondaryAssets.join(' • ')}
                            </div>
                          </button>

                          {/* MINI CHARTS GRID */}
                          {isSecondaryBarOpen && (
                            <div className="h-[160px] bg-[#0A0A0A] flex gap-1 p-1">
                              {secondaryAssets.map(asset => (
                                <div 
                                  key={asset}
                                  onClick={() => setCurrentAsset(asset)}
                                  className="flex-1 relative group cursor-pointer border border-white/5 hover:border-[#F59E0B]/30 transition-all overflow-hidden"
                                >
                                  <div className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                                    <TradingViewChart symbol={asset} />
                                  </div>
                                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-black text-[#666] group-hover:text-[#F5F5F0] uppercase tracking-widest">
                                    {asset}
                                  </div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); removeAsset(asset); }}
                                    className="absolute top-2 right-2 z-10 p-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[#444] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <X size={10} />
                                  </button>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest bg-black/60 px-2 py-1 rounded border border-white/10">Swap Principal</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* RIGHT: ACTIONS */}
                <aside className="hidden xl:block w-[280px]">
                  {positions.length > 0 ? (
                    <div className="h-full flex flex-col gap-4">
                      <div className="flex-1">
                        <PositionsList 
                          positions={positions}
                          onClose={closePosition}
                          onModify={(id, sl, tp) => updatePosition(id, sl, tp)}
                        />
                      </div>
                      <div className="h-auto">
                        <ContextePerdu 
                          tempsEcoule={Math.floor((Date.now() - new Date(positions[0].timestamp).getTime()) / 60000)}
                          onVoirPrix={() => setShowProfit(true)}
                        />
                      </div>
                    </div>
                  ) : (
                    <ActionPanel 
                      onExecute={(side) => setShowConfirmModal({ side, open: true })}
                      isExecuting={isExecuting}
                      currentMode={cycleData.currentMode}
                      riskPercent={riskPercent}
                      setRiskPercent={setRiskPercent}
                      slPoints={slPoints}
                      setSlPoints={setSlPoints}
                      tpPoints={tpPoints}
                      setTpPoints={setTpPoints}
                      currentLot={currentLot}
                      balance={accountData?.balance || 0}
                      symbol={currentAsset}
                    />
                  )}
                </aside>
              </div>

              {/* BOTTOM BANNER */}
              <AlertBanner mode={cycleData.currentMode} score={sentinelData.disciplineScore} />
            </div>
          </div>
        </DashboardContent>
      </ErrorBoundary>
      ) : (
        <main className="flex-1 overflow-auto pb-12 px-6">
          {activeTab === 'SENTINEL' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* SENTINEL HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-[12px] uppercase tracking-[1.5px] text-[#666]">Sentinel AI</h2>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 text-[11px] uppercase text-[#444] border border-cyan-500/20">v2.0</span>
                </div>
                <p className="text-[11px] uppercase text-[#444]">Cœur du Système de Protection Thalamus</p>
              </div>
              
              {/* INTERNAL TABS */}
              <div className="flex bg-[#0B0E11] p-1 rounded-xl border border-[#2B2F36]">
                {[
                  { id: 'STATUS', label: 'ÉTAT', sub: 'live' },
                  { id: 'CYCLES', label: 'RYTHMES', sub: 'cycles' },
                  { id: 'SHIELD', label: 'BOUCLIER', sub: 'protect' },
                  { id: 'EVOLUTION', label: 'ÉVOLUTION', sub: 'progrès' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSentinelTab(tab.id as any)}
                    className={`px-6 py-2.5 rounded-lg transition-all flex flex-col items-center min-w-[100px] ${
                      sentinelTab === tab.id 
                        ? 'bg-cyan-500/10 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                        : 'text-[#888] hover:text-[#D4AF37]'
                    }`}
                  >
                    <span className="text-[11px] uppercase text-[#444]">{tab.label}</span>
                    <span className="text-[11px] uppercase text-[#444] opacity-50">({tab.sub})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-auto">
              {sentinelTab === 'STATUS' && (
                <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Logo variant="hero" size={200} />
                      </div>
                      <div className="flex items-center gap-6 mb-10">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all ${
                          sentinelData.emotionState.intensity > 70 ? 'bg-red-500/10 border-red-500/20' : 'bg-cyan-500/10 border-cyan-500/20'
                        }`}>
                          <Radar size={40} strokeWidth={1.5} className={sentinelData.emotionState.intensity > 70 ? 'text-red-500' : 'text-cyan-500'} />
                        </div>
                        <div>
                          <h3 className="text-[12px] uppercase tracking-[1.5px] text-[#666]">État de Résonance</h3>
                          <p className="text-[11px] uppercase text-[#444] mt-1">Analyse Émotionnelle Multi-Couche Active</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-[#2B2F36]">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] uppercase text-[#444] block">Score Discipline</span>
                            <button 
                              onClick={() => setShowFAQ(true)}
                              className="text-[#444] hover:text-[#FFB800] transition-colors"
                            >
                              <HelpCircle size={14} />
                            </button>
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="text-[32px] font-bold text-[#F5F5F0]">{sentinelData.disciplineScore}</span>
                            <span className="text-[#888] text-[14px] mb-2">/100</span>
                          </div>
                          <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-[#F59E0B]" style={{ width: `${sentinelData.disciplineScore}%` }} />
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-[#2B2F36]">
                          <span className="text-[11px] uppercase text-[#444] block mb-3">Intensité Émotionnelle</span>
                          <div className="flex items-end gap-2">
                            <span className={`text-[32px] font-bold ${sentinelData.emotionState.intensity > 70 ? 'text-red-500' : 'text-[#F5F5F0]'}`}>
                              {sentinelData.emotionState.intensity}%
                            </span>
                          </div>
                          <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${sentinelData.emotionState.intensity > 70 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${sentinelData.emotionState.intensity}%` }} />
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-[#2B2F36]">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] uppercase text-[#444] block">MT5 Bridge</span>
                            {!isFluxLive && (
                              <button 
                                onClick={() => setMt5Connected(true)}
                                className="text-[10px] font-black text-cyan-500 hover:text-cyan-400 uppercase tracking-widest"
                              >
                                Reconnecter
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <div className={`w-3 h-3 rounded-full ${isFluxLive ? 'bg-[#F59E0B] animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[24px] font-bold text-[#F5F5F0] uppercase">{isFluxLive ? 'ACTIF' : 'OFFLINE'}</span>
                          </div>
                          <p className="text-[11px] uppercase text-[#444] mt-2">Latence: 12ms</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3 mb-8">
                          <AlertTriangle size={18} className="text-amber-500" />
                          Biais Cognitifs Actifs
                        </h3>
                        <div className="space-y-4">
                          {sentinelData.detectedBiases.slice(0, 2).map(bias => (
                            <div key={bias.id} className="p-4 rounded-xl bg-white/[0.02] border border-[#2B2F36] flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-500">
                                  {bias.id === 'fomo' ? <Zap size={20} /> : <ShieldAlert size={20} />}
                                </div>
                                <div>
                                  <p className="text-xs font-black text-white uppercase tracking-widest">{bias.name}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Impact: {bias.impact}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">DÉTECTÉ</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3 mb-8">
                          <History size={18} className="text-cyan-500" />
                          Dernières Alertes
                        </h3>
                        <div className="space-y-4">
                          {sentinelData.interventions.slice(0, 3).map(inv => (
                            <div key={inv.id} className="flex gap-4">
                              <div className={`w-1 h-10 rounded-full ${inv.type === 'BLOCK' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{inv.type}</p>
                                <p className="text-[9px] text-slate-500 font-medium line-clamp-1">{inv.reason}</p>
                                <p className="text-[8px] text-slate-600 font-mono mt-1">{new Date(inv.timestamp).toLocaleTimeString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                      <h3 className="text-sm font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                        <Brain size={18} className="text-purple-500" />
                        Analyse Prédictive
                      </h3>
                      <div className="space-y-8">
                        <div className="relative p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                          <p className="text-xs text-purple-200 font-medium italic leading-relaxed">
                            "Votre fatigue cognitive augmente. Sentinel prévoit une baisse de discipline de 15% dans les 45 prochaines minutes si aucune pause n'est prise."
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Probabilité d'Erreur</span>
                            <span className="text-xl font-black text-white tracking-tighter">24%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: '24%' }} />
                          </div>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                          <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                            Lancer Test Cognitif
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {sentinelTab === 'CYCLES' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 24H CIRCULAR CLOCK */}
                    <div className="lg:col-span-8 p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36] flex flex-col items-center justify-center relative">
                      <div className="absolute top-8 left-8">
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Thalamus Cycles</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Cartographie Biorhythmique 24h</p>
                      </div>

                      <div className="mt-12 w-full">
                        <CircularClock 
                          zones={cycleData.zones} 
                          currentHour={new Date().getHours()} 
                          currentMinute={new Date().getMinutes()} 
                        />
                      </div>

                      <div className="mt-12 grid grid-cols-4 gap-8 w-full">
                        <div className="text-center">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Chronotype</span>
                          <span className="text-sm font-black text-white uppercase tracking-tighter flex items-center justify-center gap-2">
                            {cycleData.chronotype === 'Hybrid' ? <RefreshCcw size={14} className="text-cyan-500" /> : 
                             cycleData.chronotype === 'Lark' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-500" />}
                            {cycleData.chronotype}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Zone Actuelle</span>
                          <span className={`text-sm font-black uppercase tracking-tighter ${
                            cycleData.zones[new Date().getHours()].status === 'OPTIMAL' ? 'text-[#F59E0B]' :
                            cycleData.zones[new Date().getHours()].status === 'RISK' ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {cycleData.zones[new Date().getHours()].status}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Capital Cognitif</span>
                          <span className="text-sm font-black text-white uppercase tracking-tighter">{cycleData.cognitiveCapital}%</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Indice Danger</span>
                          <span className={`text-sm font-black uppercase tracking-tighter ${cycleData.dangerIndex > 70 ? 'text-red-500' : 'text-white'}`}>
                            {cycleData.dangerIndex}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ADAPTIVE MODES & RESONANCE */}
                    <div className="lg:col-span-4 space-y-6">
                      <section className="p-6 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                        <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
                          <Timer size={14} className="text-cyan-500" />
                          Mode Adaptatif Auto
                        </h3>
                        <div className="space-y-3">
                          {[
                            { id: 'HUNTER', label: 'Mode Chasseur', desc: 'Pleine capacité, pas de limites', color: 'bg-[#F59E0B]', active: cycleData.currentMode === 'HUNTER' },
                            { id: 'CONSERVATION', label: 'Mode Conservation', desc: 'Lots réduits (50%), SL serrés', color: 'bg-amber-500', active: cycleData.currentMode === 'CONSERVATION' },
                            { id: 'SHELTER', label: 'Mode Shelter', desc: 'Lecture seule, blocage entrées', color: 'bg-red-500', active: cycleData.currentMode === 'SHELTER' },
                            { id: 'RECOVERY', label: 'Mode Recovery', desc: 'Pause forcée après perte', color: 'bg-cyan-500', active: cycleData.currentMode === 'RECOVERY' }
                          ].map(mode => (
                            <div 
                              key={mode.id} 
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                mode.active ? `bg-white/[0.03] border-white/20` : 'bg-transparent border-transparent opacity-40 hover:opacity-100'
                              }`}
                              onClick={() => setCycleData(prev => ({ ...prev, currentMode: mode.id as any }))}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${mode.color}`} />
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{mode.label}</span>
                                </div>
                                {mode.active && <CheckCircle2 size={12} className="text-[#F59E0B]" />}
                              </div>
                              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{mode.desc}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="p-6 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                        <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
                          <BarChart3 size={14} className="text-cyan-500" />
                          Résonance Marché-Trader
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Volatilité (VIX)</span>
                            <span className="text-xs font-mono font-bold text-white">{vixValue.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Fatigue Trader</span>
                            <span className="text-xs font-mono font-bold text-white">{(100 - cycleData.cognitiveCapital).toFixed(1)}%</span>
                          </div>
                          <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-white uppercase tracking-tighter">Danger Index</span>
                              <span className={`text-lg font-black tracking-tighter ${cycleData.dangerIndex > 70 ? 'text-red-500' : 'text-cyan-500'}`}>
                                {cycleData.dangerIndex}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${cycleData.dangerIndex > 70 ? 'bg-red-500' : 'bg-cyan-500'}`}
                                style={{ width: `${cycleData.dangerIndex}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* RECOVERY & TESTS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <section className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3">
                          <Wind size={18} className="text-cyan-500" />
                          Micro-Pauses
                        </h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entre Trades</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Respiration 4-7-8', time: '2 min', icon: <Wind size={16} /> },
                          { label: 'Reset Visuel', time: '1 min', icon: <Eye size={16} /> }
                        ].map((item, i) => (
                          <button key={i} className="p-4 rounded-xl bg-white/[0.02] border border-[#2B2F36] flex flex-col items-center gap-2 hover:border-cyan-500 transition-all group">
                            <div className="text-slate-500 group-hover:text-cyan-500 transition-colors">{item.icon}</div>
                            <span className="text-[8px] font-black text-white uppercase tracking-widest text-center leading-tight">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3">
                          <Coffee size={18} className="text-cyan-500" />
                          Pause Session
                        </h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Toutes les 90m</span>
                      </div>
                      <div className="p-6 rounded-xl bg-white/[0.02] border border-[#2B2F36] text-center space-y-4">
                        <div className="text-2xl font-mono font-black text-white">15:00</div>
                        <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                          Lancer Pause (15 min)
                        </button>
                      </div>
                    </section>

                    <section className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3">
                          <LogOut size={18} className="text-cyan-500" />
                          Rituel Fermeture
                        </h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Obligatoire</span>
                      </div>
                      <button 
                        onClick={() => setShowClosingRitual(true)}
                        className="w-full p-6 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col items-center gap-3 hover:bg-red-500/20 transition-all group"
                      >
                        <LogOut size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Terminer Session</span>
                      </button>
                    </section>
                  </div>

                  {/* TEST DE VIGILANCE */}
                  <section className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Brain size={18} className="text-cyan-500" />
                        Test de Vigilance Cognitive
                      </h3>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calibrage 3x / Jour</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      <div className="md:col-span-2 space-y-4">
                        <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
                          Mesurez votre temps de réaction, votre mémoire de travail et votre vitesse de décision pour affiner votre cartographie biorhythmique.
                        </p>
                        <div className="flex gap-4">
                          <div className="px-4 py-2 rounded-lg bg-white/[0.03] border border-[#2B2F36]">
                            <span className="text-[8px] font-bold text-slate-500 uppercase block">Dernier Score</span>
                            <span className="text-sm font-black text-white">92/100</span>
                          </div>
                          <div className="px-4 py-2 rounded-lg bg-white/[0.03] border border-[#2B2F36]">
                            <span className="text-[8px] font-bold text-slate-500 uppercase block">Tendance</span>
                            <span className="text-sm font-black text-[#F59E0B]">+4%</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowCognitiveTest(true)}
                        className="px-8 py-4 rounded-xl bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                      >
                        Lancer le Test (90s)
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {sentinelTab === 'SHIELD' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {[
                    { title: "Radar de Biais Cognitifs", sub: "ANALYSE COMPORTEMENTALE", val: "92 %", desc: "Analyse en temps réel de vos patterns d'exécution pour détecter les biais (FOMO, Revenge Trading) avant qu'ils ne corrompent votre stratégie.", status: "Actif", color: "text-[#F59E0B]" },
                    { title: "Neural Readiness", sub: "ÉTAT COGNITIF", val: "87 %", desc: "Analyse de votre état mental et de votre capacité de concentration pour optimiser les moments de trading.", status: "Actif", color: "text-cyan-500" },
                    { title: "Stress Index", sub: "NIVEAU DE STRESS", val: "LOW", desc: "Mesure continue de votre charge stressante. Le système bloque les trades lorsque le stress est trop élevé.", status: "Actif", color: "text-[#F59E0B]" },
                    { title: "Protection Émotionnelle", sub: "SÉCURITÉ IA", val: "ON", desc: "L'IA neuro-cognitive intercepte les décisions impulsives basées sur la peur ou la cupidité.", status: "Actif", color: "text-cyan-500" },
                    { title: "Synchronisation MT5", sub: "BRIDGE ACTIF", val: "12 ms", desc: "Connexion directe et sécurisée à votre terminal MetaTrader 5 avec latence minimale.", status: "Actif", color: "text-cyan-500" },
                    { title: "Analyse Prédictive", sub: "MACHINE LEARNING", val: "94 %", desc: "Algorithmes avancés qui apprennent de vos patterns de trading pour améliorer vos performances.", status: "Actif", color: "text-[#F59E0B]" }
                  ].map((card, i) => (
                    <div key={i} className="p-8 rounded-2xl bg-[#0B0E11] border border-[#2B2F36] hover:border-slate-700 transition-all group">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{card.sub}</h4>
                          <h3 className="text-lg font-black text-white uppercase tracking-tighter">{card.title}</h3>
                        </div>
                        <span className={`text-2xl font-black tracking-tighter ${card.color}`}>{card.val}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">{card.desc}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${card.color.replace('text', 'bg')}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${card.color}`}>{card.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sentinelTab === 'EVOLUTION' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="flex justify-center">
                    <div className="inline-flex p-1 bg-[#15191C] rounded-xl border border-[#2B2F36]">
                      {[
                        { id: 'STORY', label: 'Récits', icon: <History size={12} /> },
                        { id: 'CALCULATOR', label: 'Calculateur', icon: <TrendingDown size={12} /> },
                        { id: 'EMAILS', label: 'Emails', icon: <Mail size={12} /> }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setExpSubTab(sub.id as any)}
                          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            expSubTab === sub.id ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {sub.icon}
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-auto">
                    {expSubTab === 'STORY' && <GhostTraderStory />}
                    {expSubTab === 'CALCULATOR' && <EmotionalCostCalculator />}
                    {expSubTab === 'EMAILS' && <EmailPreview />}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {activeTab === 'TREASURE' && <TreasureDashboard />}

        {activeTab === 'PROFILE' && (
          <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <User size={48} className="text-slate-500" />
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-display">{userName}</h2>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em]">Résident du Temple</p>
            </div>

            <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8">
              <div className="flex items-center gap-3 text-white">
                <PenTool size={20} className="text-[#D4AF37]" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Mon Engagement</h3>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest leading-relaxed">
                  Ce serment est votre boussole. Il est affiché sur votre profil public et guide vos décisions.
                </p>
                <div className="relative">
                  <span className="absolute top-4 left-4 text-slate-600 font-serif italic text-lg">"Je, {userName}, m'engage à..."</span>
                  <textarea 
                    value={userOath}
                    onChange={(e) => setUserOath(e.target.value)}
                    placeholder="Définissez votre propre loi de discipline..."
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-8 pt-12 text-white font-serif italic text-lg outline-none focus:border-[#D4AF37] transition-all resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button className="px-8 py-3 rounded-full bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#C4A030] transition-all">
                    Sceller mon serment
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Détails du Résident</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Abonnement</span>
                  <span className="text-xs font-black text-white uppercase tracking-widest">Temple Pass (79€)</span>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Réduction Active</span>
                  <span className="text-xs font-black text-[#F59E0B] uppercase tracking-widest">-{MOCK_USER_STATS.activeDiscount}% (Défis)</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      )}

      {/* REAL MODE WARNING MODAL */}
      <AnimatePresence>
        {showRealModeWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-[#0B0E11] border border-red-500/30 rounded-2xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
                <ShieldAlert size={40} className="text-red-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Activation Mode Réel</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Vous passez en <span className="text-red-500 font-bold">MODE RÉEL</span>. Vos ordres seront exécutés directement sur le marché via votre compte MT5.
                </p>
              </div>
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-[10px] text-red-400 font-bold uppercase tracking-widest leading-loose">
                ⚠️ Sentinel Protection Active : SL/TP immuables. <br />
                Aucun recul de Stop Loss ne sera toléré.
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowRealModeWarning(false)}
                  className="flex-1 py-4 rounded-xl bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmRealMode}
                  className="flex-1 py-4 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfirmModal.open && (
        <div className="fixed inset-0 z-[1000] bg-[#0B0E11]/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
          <div className={`max-w-sm w-full p-8 rounded-xl border border-[#2B2F36] bg-[#0B0E11] shadow-2xl transition-all duration-500`}>
            {showReflection ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 text-amber-500 mb-4">
                  <Brain size={24} />
                  <h3 className="text-lg font-black uppercase tracking-tighter">Pause de Réflexion</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sentinel détecte une intensité émotionnelle de <span className="text-amber-500 font-bold">{sentinelData.emotionState.intensity}%</span>. 
                  Pourquoi prenez-vous ce trade maintenant ?
                </p>
                <textarea 
                  value={reflectionAnswer}
                  onChange={(e) => setReflectionAnswer(e.target.value)}
                  placeholder="Décrivez votre intention..."
                  className="w-full h-24 bg-white/[0.02] border border-[#2B2F36] rounded-lg p-3 text-xs text-white outline-none focus:border-cyan-500 transition-colors"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setShowReflection(false); setShowConfirmModal({side: 'BUY', open: false}); }}
                    className="flex-1 py-3 rounded-lg border border-[#2B2F36] text-[10px] font-bold uppercase tracking-widest hover:bg-white/5"
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={reflectionAnswer.length < 10}
                    onClick={() => { setShowReflection(false); executeTrade(); }}
                    className="flex-1 py-3 rounded-lg bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 disabled:opacity-50"
                  >
                    Valider
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Order Verification</div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    {execStep === 'CONFIRMED' ? 'ORDER EXECUTED' : 'CONFIRM TRANSACTION'}
                  </h3>
                  {sentinelData.emotionState.intensity > 40 && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-amber-500">
                      <Eye size={12} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Mode Miroir : Risque de FOMO détecté</span>
                    </div>
                  )}
                  <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 tracking-tighter">
                    {execStep === 'IDLE' ? 'Awaiting Handshake...' : 
                     execStep === 'SENDING' ? 'Transmitting Command...' :
                     execStep === 'WAITING_EA' ? 'Bridge Synchronization...' :
                     `Confirmed - Ticket #${lastTicketId}`}
                  </p>
                </div>
                <div className="bg-white/[0.02] p-5 rounded-lg space-y-3 border border-[#2B2F36] text-[10px] font-bold uppercase tracking-widest">
                   <div className="flex justify-between"><span className="text-slate-500">Side</span><span className={showConfirmModal.side === 'BUY' ? 'text-[#F5F5F0]' : 'text-red-500'}>{showConfirmModal.side}</span></div>
                   <div className="flex justify-between"><span className="text-slate-500">Asset</span><span className="text-white">{currentAsset}</span></div>
                   <div className="flex justify-between"><span className="text-slate-500">S/L | T/P</span><span className="text-white font-mono">{slPoints} | {tpPoints}</span></div>
                   
                   {/* DYNAMIC RISK CALCULATOR IN MODAL */}
                   <div className="pt-3 border-t border-[#2B2F36] space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-slate-500">Risque (%)</span>
                       <div className="flex items-center gap-2">
                         <input 
                           type="number" 
                           step="0.1"
                           value={riskPercent}
                           onChange={(e) => setRiskPercent(Number(e.target.value))}
                           className="w-16 bg-black/40 border border-[#333] rounded px-2 py-1 text-right text-white outline-none focus:border-cyan-500 transition-colors"
                         />
                         <span className="text-slate-600">%</span>
                       </div>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-500">Risque ({accountData?.currency === 'EUR' ? '€' : '$'})</span>
                       <span className={riskPercent > 3 ? 'text-red-500' : 'text-emerald-500'}>
                         {((accountData?.balance || 0) * (riskPercent / 100)).toFixed(2)}€
                       </span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-500">Volume Suggéré</span>
                       <span className={`font-mono ${riskPercent > 3 ? 'text-red-500' : 'text-white'}`}>
                         {calculateLots(accountData?.balance || 0, riskPercent, slPoints, currentAsset)} LOTS
                       </span>
                     </div>
                     
                     {/* SENTINEL VALIDATION LIGHT */}
                     <div className="flex items-center gap-2 pt-1">
                       <div className={`w-2 h-2 rounded-full animate-pulse ${
                         riskPercent > 3 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                         riskPercent > 2 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                         'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                       }`} />
                       <span className={`text-[8px] ${
                         riskPercent > 3 ? 'text-red-500' : 
                         riskPercent > 2 ? 'text-amber-500' : 
                         'text-emerald-500'
                       }`}>
                         {riskPercent > 3 ? 'SENTINEL : RISQUE CRITIQUE - CONFIRMATION BLOQUÉE' : 
                          riskPercent > 2 ? 'SENTINEL : RISQUE ÉLEVÉ - PRUDENCE' : 
                          'SENTINEL : RISQUE VALIDÉ'}
                       </span>
                     </div>
                   </div>

                   <div className="flex justify-between border-t border-[#2B2F36] pt-3"><span className="text-slate-500">Clarté Cognitive</span><span className="text-white font-mono">{Math.round(sentinelData.cognitiveReadiness)}%</span></div>
                </div>
                <div className="flex gap-3">
                   <button disabled={isExecuting} onClick={() => setShowConfirmModal({...showConfirmModal, open: false})} className="flex-1 py-3 text-[10px] font-bold uppercase text-slate-500 hover:text-white transition-colors">Cancel</button>
                   <button 
                     onClick={executeTrade} 
                     disabled={isExecuting || riskPercent > 3} 
                     className={`flex-[2] py-3 rounded text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                       riskPercent > 3 ? 'bg-red-900/20 text-red-900 cursor-not-allowed border border-red-900/30' : 'bg-cyan-600 hover:bg-cyan-500'
                     }`}
                   >
                     {isExecuting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                     {execStep === 'SENDING' ? 'EXECUTION...' : execStep === 'WAITING_EA' ? 'SYNCING' : 'CONFIRM'}
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COOLDOWN OVERLAY */}
      {cooldownActive && (
        <div className="fixed inset-0 z-[2000] bg-[#0B0E11]/98 flex items-center justify-center p-6 animate-in fade-in duration-700">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 flex items-center justify-center">
                <Timer size={48} className="text-cyan-500 animate-pulse" />
              </div>
              <svg className="absolute inset-0 w-32 h-32 -rotate-90">
                <circle 
                  cx="64" cy="64" r="60" 
                  fill="none" stroke="currentColor" strokeWidth="4" 
                  className="text-cyan-500"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (377 * cooldownTimeLeft / 300)}
                />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Forced Cooldown</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                Sentinel a détecté un risque émotionnel critique
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-[#2B2F36] space-y-4">
              <div className="flex items-center gap-3 text-cyan-500">
                <Wind size={20} className="animate-bounce" />
                <span className="text-xs font-black uppercase tracking-widest">Exercice de Respiration</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">
                Inspirez pendant 4 secondes... Bloquez 4 secondes... Expirez 4 secondes...
              </p>
              <div className="text-4xl font-mono font-black text-white">
                {Math.floor(cooldownTimeLeft / 60)}:{(cooldownTimeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              Le terminal sera déverrouillé après stabilisation bio-métrique
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SENTINEL WIDGET */}
      <div className="fixed bottom-8 right-8 z-[100] group">
        <div className="absolute bottom-full right-0 mb-4 w-64 p-4 rounded-xl bg-[#0B0E11] border border-[#2B2F36] shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                cycleData.currentMode === 'HUNTER' ? 'bg-[#F59E0B]' :
                cycleData.currentMode === 'CONSERVATION' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Mode {cycleData.currentMode}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-bold text-slate-500 uppercase">{sentinelData.emotionState.dominantEmotion}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-bold text-slate-600 uppercase">
                <span>Capital Cognitif</span>
                <span>{cycleData.cognitiveCapital}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    cycleData.cognitiveCapital > 70 ? 'bg-[#F59E0B]' : 
                    cycleData.cognitiveCapital > 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${cycleData.cognitiveCapital}%` }} 
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-bold text-slate-600 uppercase">
                <span>Danger Index</span>
                <span>{cycleData.dangerIndex}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${cycleData.dangerIndex > 70 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                  style={{ width: `${cycleData.dangerIndex}%` }} 
                />
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prochaine Zone</div>
            <div className="text-[7px] text-slate-500 flex items-center gap-2 uppercase">
              <Timer size={10} />
              {cycleData.nextTransition?.time} - {cycleData.nextTransition?.type}
            </div>
          </div>
        </div>
        <button 
          onClick={() => { setActiveTab('SENTINEL'); setSentinelTab('CYCLES'); }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shadow-2xl ${
            cycleData.dangerIndex > 70 
              ? 'bg-red-500 border-red-400 text-white animate-pulse' 
              : 'bg-[#0B0E11] border-[#2B2F36] text-cyan-500 hover:border-cyan-500'
          }`}
        >
          <Timer size={24} />
        </button>
      </div>

      {/* CYCLE ALERT MODAL */}
      {showCycleAlert && (
        <div className="fixed inset-0 z-[3000] bg-[#0B0E11]/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-md w-full p-8 rounded-2xl border border-amber-500/30 bg-[#0B0E11] shadow-[0_0_50px_rgba(245,158,11,0.2)] space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Timer size={40} className="text-amber-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Alerte Transition Cycle</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  Sentinel Prédit une baisse de performance cognitive
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.02] border border-[#2B2F36] space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed text-center">
                Votre zone <span className="text-amber-500 font-bold">RISK</span> commence dans <span className="text-white font-bold">30 minutes</span>. 
                Historiquement, votre taux d'erreur augmente de <span className="text-red-500 font-bold">42%</span> dans cette phase.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { setCycleData(prev => ({ ...prev, currentMode: 'CONSERVATION' })); setShowCycleAlert(false); }}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-between px-6"
              >
                <span>Passer en Mode Conservation</span>
                <span className="text-amber-500">Lots -50%</span>
              </button>
              <button 
                onClick={() => { setCycleData(prev => ({ ...prev, currentMode: 'SHELTER' })); setShowCycleAlert(false); }}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-between px-6"
              >
                <span>Activer Mode Shelter</span>
                <span className="text-red-500">Blocage Entrées</span>
              </button>
              <button 
                onClick={() => setShowCycleAlert(false)}
                className="w-full py-4 rounded-xl bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all"
              >
                Ignorer (Risque Élevé)
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && !notification.includes("MODE CONSERVATION") && (
        <div className="fixed bottom-28 right-8 z-[2000] bg-[#F59E0B]/90 backdrop-blur-md text-black px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-xl border border-black/10 animate-in slide-in-from-right-4 max-w-[280px]">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* showRescueModal DISABLED AS REQUESTED */}
      {false && showRescueModal && (
        <div className="fixed inset-0 z-[6000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-[#15191C] border border-[#F59E0B]/30 rounded-3xl p-8 shadow-2xl space-y-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#F59E0B]/20 flex items-center justify-center mx-auto">
              <ShieldCheck size={40} className="text-[#F59E0B]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Sauvetage Sentinel</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Une perte émotionnelle vient d'être évitée</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F59E0B]/5 border border-[#F59E0B]/20">
              <span className="text-[8px] font-black text-[#F59E0B] uppercase tracking-widest block mb-1">Économie Estimée</span>
              <div className="text-4xl font-black text-white tracking-tighter">${rescueAmount.toFixed(2)}</div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
              Sentinel a bloqué ce trade car votre intensité émotionnelle était trop élevée. <br />
              Voulez-vous partager ce sauvetage anonymement pour inspirer la communauté ?
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => { setShowRescueModal(false); setNotification("SAUVETAGE PARTAGÉ : +10 Points de Discipline"); }}
                className="w-full py-4 rounded-xl bg-[#F59E0B] text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#E58E0B] transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={14} />
                Partager Anonymement
              </button>
              <button 
                onClick={() => setShowRescueModal(false)}
                className="w-full py-4 rounded-xl bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Ignorer
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {showCognitiveTest && (
        <CognitiveTest 
          onComplete={(score) => {
            setCycleData(prev => ({ ...prev, cognitiveCapital: Math.min(100, prev.cognitiveCapital + (score / 5)) }));
            setShowCognitiveTest(false);
            setNotification("TEST RÉUSSI : Capital cognitif restauré.");
          }}
          onCancel={() => setShowCognitiveTest(false)}
        />
      )}

      {showClosingRitual && (
        <div className="fixed inset-0 z-[4000] bg-[#0B0E11]/98 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#15191C] border border-[#2B2F36] rounded-3xl p-8 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Rituel de Fermeture</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Fermeture symbolique de votre session</p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white/[0.02] border border-[#2B2F36] space-y-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">1. Review des Trades</h4>
                <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                  <span>Trades du jour</span>
                  <span className="text-white">{tradesToday}</span>
                </div>
                <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                  <span>P/L Session</span>
                  <span className={dailyLoss >= 0 ? 'text-[#F59E0B]' : 'text-red-500'}>${dailyLoss.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">2. Note Émotionnelle</h4>
                <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase">
                  <span>Calme</span>
                  <span>Stressé</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">3. Objectif Demain</h4>
                <textarea 
                  placeholder="Une phrase sur votre discipline..."
                  className="w-full p-4 rounded-xl bg-white/[0.02] border border-[#2B2F36] text-xs text-white placeholder:text-slate-700 focus:border-cyan-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              onClick={() => { setShowClosingRitual(false); }}
              className="w-full py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-400 transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              Fermeture Symbolique de Session
            </button>
          </div>
        </div>
      )}

      {/* TP ALERT */}
      {tpAlert.open && (
        <div className="fixed inset-0 z-[7000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-[#15191C] border border-[#F5F5F0]/20 rounded-3xl p-8 shadow-2xl space-y-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#F5F5F0]/10 flex items-center justify-center mx-auto">
              <Target size={40} className="text-[#F5F5F0]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Objectif Atteint</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{tpAlert.message}</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => setTpAlert({ open: false, message: '' })}
                className="w-full py-4 rounded-xl bg-[#F5F5F0] text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#AAA] transition-all"
              >
                Fermer
              </button>
              <button 
                onClick={() => setTpAlert({ open: false, message: '' })}
                className="w-full py-4 rounded-xl bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Laisser courir
              </button>
              <button 
                onClick={() => setTpAlert({ open: false, message: '' })}
                className="w-full py-4 rounded-xl bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Journal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* SL ALERT */}
      {slAlert.open && (
        <div className="fixed inset-0 z-[7000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-[#15191C] border border-[#F5F5F0]/20 rounded-3xl p-8 shadow-2xl space-y-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#F5F5F0]/10 flex items-center justify-center mx-auto">
              <ShieldCheck size={40} className="text-[#F5F5F0]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Stop Respecté</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{slAlert.message}</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => setSlAlert({ open: false, message: '' })}
                className="w-full py-4 rounded-xl bg-[#F5F5F0] text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#AAA] transition-all"
              >
                Pause 15min
              </button>
              <button 
                onClick={() => setSlAlert({ open: false, message: '' })}
                className="w-full py-4 rounded-xl bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Analyse
              </button>
              <button 
                onClick={() => setSlAlert({ open: false, message: '' })}
                className="w-full py-4 rounded-xl bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Reprendre
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <NeuralChat vitals={vitals} lang="FR" />
      <AlertBanner mode={cycleData.currentMode} score={sentinelData.disciplineScore} />
      <FAQ isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
      <FeedbackSystem />

      <AnimatePresence>
        {showAdminDashboard && (
          <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
        )}
      </AnimatePresence>

      {showAccountLinkModal && (
        <AccountLinkModal 
          onClose={() => setShowAccountLinkModal(false)}
          onSuccess={() => {
            setShowAccountLinkModal(false);
            setMt5Connected(true);
            setNotification("LIAISON NEURALE MT5 ÉTABLIE");
          }}
        />
      )}
    </div>
  );
}
