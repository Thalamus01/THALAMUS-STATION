
import { Portfolio, TradeAttempt, FutureScenario } from './types';

export const BASELINE_RMSSD = 45;
export const STANDARD_MAX_VAR = 0.02; // 2%
export const MICRO_MAX_VAR = 0.05; // 5% pour Nano
export const SOVEREIGN_MAX_VAR = 0.01; // 1% pour gros comptes

export const getEffectiveRiskLimit = (readiness: number, equity: number): number => {
  let baseLimit = STANDARD_MAX_VAR;
  if (equity < 1000) baseLimit = MICRO_MAX_VAR;
  else if (equity > 50000) baseLimit = SOVEREIGN_MAX_VAR;
  
  // Nudge physiologique : si Readiness faible, on divise par 2
  return readiness < 55 ? baseLimit / 2 : baseLimit;
};

export const calculatePortfolioRisk = (portfolio: Portfolio, trade?: TradeAttempt): { varValue: number; varPercentage: number; breach: boolean; limitUsed: number; mode: 'NANO' | 'STANDARD' | 'SOVEREIGN' } => {
  const totalEquity = portfolio.equity;
  const zScore = 1.65;
  const baseVolatility = 0.022;
  
  let mode: 'NANO' | 'STANDARD' | 'SOVEREIGN' = 'STANDARD';
  let limitUsed = STANDARD_MAX_VAR;
  
  if (totalEquity < 1000) {
    mode = 'NANO';
    limitUsed = MICRO_MAX_VAR;
  } else if (totalEquity > 50000) {
    mode = 'SOVEREIGN';
    limitUsed = SOVEREIGN_MAX_VAR;
  }
  
  let currentRisk = totalEquity * baseVolatility * zScore;
  
  if (trade) {
    const tradeValue = trade.amount * trade.price;
    currentRisk += (tradeValue * 0.035 * zScore);
  }

  const percentage = currentRisk / totalEquity;
  return {
    varValue: currentRisk,
    varPercentage: percentage,
    breach: percentage > limitUsed,
    limitUsed,
    mode
  };
};

export const calculateTaxLossSavings = (portfolio: Portfolio): number => {
  const unrealizedLosses = portfolio.assets.reduce((acc, asset) => {
    const loss = (asset.currentPrice - asset.avgPrice) * asset.quantity;
    return loss < 0 ? acc + Math.abs(loss) : acc;
  }, 0);
  return unrealizedLosses * 0.30;
};

export const calculateConvergenceScore = (vitals: any, socialSentiment: number): number => {
  const stressPenalty = vitals.stressLevel === 'High' ? 40 : vitals.stressLevel === 'Moderate' ? 15 : 0;
  const readinessBonus = (vitals.readinessScore / 100) * 30;
  const sentimentBonus = socialSentiment * 0.4; 
  
  const score = 30 + readinessBonus + sentimentBonus - stressPenalty;
  return Math.max(0, Math.min(100, score));
};

export const generateFutureScenarios = (currentPrice: number): FutureScenario[] => {
  const scenarios: FutureScenario[] = [];
  const now = new Date();
  
  for (let i = 0; i <= 4; i++) {
    const time = new Date(now.getTime() + i * 3600000);
    const drift = i * 0.005;
    const vol = i * 0.01;
    
    scenarios.push({
      timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      optimistic: currentPrice * (1 + drift + vol * Math.random()),
      neutral: currentPrice * (1 + (Math.random() - 0.5) * vol),
      pessimistic: currentPrice * (1 - drift - vol * Math.random()),
      actual: i === 0 ? currentPrice : undefined
    });
  }
  return scenarios;
};

export const ASSET_CONFIGS: Record<string, { tickSize: number; contractSize: number }> = {
  'EURUSD': { tickSize: 0.0001, contractSize: 100000 },
  'GBPUSD': { tickSize: 0.0001, contractSize: 100000 },
  'USDJPY': { tickSize: 0.01, contractSize: 100000 },
  'XAUUSD': { tickSize: 0.01, contractSize: 100 },
  'USOIL': { tickSize: 0.01, contractSize: 1000 },
  'SP500': { tickSize: 1.00, contractSize: 1 },
  'NAS100': { tickSize: 1.00, contractSize: 1 },
  'GER40': { tickSize: 1.00, contractSize: 1 },
  'BTCUSD': { tickSize: 1.00, contractSize: 1 },
};

export const calculateLots = (balance: number, riskPercent: number, slPoints: number, symbol: string) => {
  if (slPoints <= 0 || balance <= 0) return 0;
  const config = ASSET_CONFIGS[symbol] || { tickSize: 0.0001, contractSize: 100000 };
  const riskAmount = balance * (riskPercent / 100);
  const slValuePerLot = slPoints * config.tickSize * config.contractSize;
  
  if (slValuePerLot > 0) {
    return Number((riskAmount / slValuePerLot).toFixed(2));
  }
  return 0;
};
