
export interface Vitals {
  discipline: number; // 0-100
  baselineDiscipline: number;
  cognitiveClarity: number; // 0-100
  stressLevel: 'Low' | 'Moderate' | 'High';
  impulsivity: number; // 0-100
  killSwitchActive: boolean;
  heartRate: number;
  rmssd: number;
  readinessScore: number;
}

export interface Portfolio {
  equity: number;
  cash: number;
  assets: Asset[];
}

export interface Asset {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  volatility: number; 
}

export interface TradeAttempt {
  symbol: string;
  side: 'BUY' | 'SELL';
  amount: number;
  price: number;
}

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  behavioralNudge?: string;
  confidenceScore?: number;
  riskMetrics?: {
    varValue: number;
    varPercentage: number;
  };
  complianceIssues?: string[];
}

export interface Position {
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

export interface SentinelStats {
  disciplineScore: number;
  dangerIndex?: number;
  conformityRate: number;
  optimalWindow: string;
  avoidWindow: string;
  cognitiveReadiness: number;
  detectedBiases: {
    id: string;
    name: string;
    count: number;
    impact: string;
    frequency: string;
    status: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  emotionState: {
    intensity: number;
    dominantEmotion: string;
    patterns: string[];
    lastUpdate: string;
  };
  interventions: {
    id: string;
    type: string;
    reason: string;
    timestamp: string;
    status: string;
  }[];
}

export interface FutureScenario {
  timestamp: string;
  optimistic: number;
  neutral: number;
  pessimistic: number;
  actual?: number;
}
