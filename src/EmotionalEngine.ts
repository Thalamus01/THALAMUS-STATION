export interface EmotionalMetrics {
  intensity: number;
  dangerIndex: number;
  disciplineScore: number;
  detectedBiases: any[];
  mode: 'HUNTER' | 'CONSERVATION' | 'SHELTER';
  prediction: string;
  errorProbability: number;
}

export interface BiasDetection {
  id: string;
  name: string;
  timestamp: number;
  description: string;
  action: string;
}

export class EmotionalEngine {
  private static equityHistory: { timestamp: number; equity: number }[] = [];
  private static tradeHistory: { timestamp: number; result: 'WIN' | 'LOSS' }[] = [];
  private static lastTradeTime: number = 0;

  static calculate(state: any): EmotionalMetrics {
    const now = Date.now();
    
    // 1. Update Equity History (last 60s)
    this.equityHistory.push({ timestamp: now, equity: state.equity });
    this.equityHistory = this.equityHistory.filter(h => now - h.timestamp < 60000);

    // 2. Calculate Volatility (Equity Variation)
    const equityVariation = this.calculateEquityVariation();
    
    // 3. Calculate Emotional Intensity
    const intensity = this.calculateIntensity(state, equityVariation);
    
    // 4. Detect Biases
    const detectedBiases = this.detectBiases(state, equityVariation);
    
    // 5. Calculate Danger Index
    const dangerIndex = this.calculateDangerIndex(state, intensity, equityVariation);
    
    // 6. Calculate Discipline Score
    const disciplineScore = this.calculateDisciplineScore(state);
    
    // 7. Determine Mode
    const mode = this.determineMode(dangerIndex, intensity, detectedBiases);
    
    // 8. Calculate Error Probability
    const errorProbability = this.calculateErrorProbability(intensity, detectedBiases, mode);

    // 9. Generate Prediction
    const prediction = this.generatePrediction(state, errorProbability);

    return {
      intensity,
      dangerIndex,
      disciplineScore,
      detectedBiases: detectedBiases.map(b => ({
        id: b.id,
        name: b.name,
        count: 1,
        impact: 'High',
        frequency: 'Occasional',
        status: 'medium' as const,
        description: b.action
      })),
      mode,
      prediction,
      errorProbability
    };
  }

  private static calculateEquityVariation(): number {
    if (this.equityHistory.length < 2) return 0;
    const first = this.equityHistory[0].equity;
    const last = this.equityHistory[this.equityHistory.length - 1].equity;
    if (first === 0) return 0;
    return Math.abs((last - first) / first) * 100;
  }

  private static calculateIntensity(state: any, variation: number): number {
    const openTrades = state.positions?.length || 0;
    const timeSinceLastTrade = (Date.now() - this.lastTradeTime) / 60000; // minutes
    
    let intensity = (variation * 10) + (openTrades * 5);
    
    // Circadian fatigue (night hours increase intensity/sensitivity)
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) intensity += 15;

    // Recency bias (recent trades increase intensity)
    if (timeSinceLastTrade < 5) intensity += 10;

    return Math.min(100, Math.max(0, intensity));
  }

  private static calculateDangerIndex(state: any, intensity: number, variation: number): number {
    const exposure = this.calculateExposure(state);
    const hoursTrading = 1; // Simplified for now
    
    const index = (intensity * 0.4) + (exposure * 0.3) + (variation * 20) + (hoursTrading * 10);
    return Math.min(100, Math.max(0, index));
  }

  private static calculateExposure(state: any): number {
    if (!state.balance || state.balance === 0) return 0;
    const totalVolume = state.positions?.reduce((acc: number, p: any) => acc + (p.volume || 0), 0) || 0;
    return (totalVolume * 100000 / state.balance) * 100; // Simplified lot-to-exposure
  }

  private static calculateDisciplineScore(state: any): number {
    let score = 100;
    const positions = state.positions || [];
    
    // Rule: SL must be present
    const missingSL = positions.filter((p: any) => !p.sl || p.sl === 0).length;
    score -= missingSL * 20;

    // Rule: Max trades per hour
    if (positions.length > 5) score -= 15;

    return Math.max(0, score);
  }

  private static detectBiases(state: any, variation: number): BiasDetection[] {
    const biases: BiasDetection[] = [];
    const now = Date.now();
    const positions = state.positions || [];

    // FOMO Detection
    if (variation > 0.5 && positions.some((p: any) => (now - p.timestamp) < 60000)) {
      biases.push({
        id: 'fomo',
        name: 'FOMO',
        timestamp: now,
        description: 'Trade ouvert après mouvement violent.',
        action: 'Réduire levier immédiatement.'
      });
    }

    // Revenge Trading Detection
    // (Requires tracking last trade result, simplified for now)
    
    // Overtrading Detection
    if (positions.length > 5) {
      biases.push({
        id: 'overtrading',
        name: 'SURTRADING',
        timestamp: now,
        description: 'Trop de positions simultanées.',
        action: 'Fermer les positions les moins rentables.'
      });
    }

    return biases;
  }

  private static determineMode(danger: number, intensity: number, biases: any[]): 'HUNTER' | 'CONSERVATION' | 'SHELTER' {
    if (danger > 70 || biases.length >= 2) return 'SHELTER';
    if (danger > 40 || biases.length >= 1) return 'CONSERVATION';
    return 'HUNTER';
  }

  private static calculateErrorProbability(intensity: number, biases: any[], mode: string): number {
    let prob = (intensity * 0.5) + (biases.length * 15);
    if (mode === 'SHELTER') prob += 20;
    return Math.min(100, prob);
  }

  private static generatePrediction(state: any, prob: number): string {
    const exposure = this.calculateExposure(state).toFixed(1);
    return `Votre exposition est de ${exposure}%. À ce niveau, la probabilité d'erreur émotionnelle est de ${prob.toFixed(0)}% dans les 10 prochaines minutes.`;
  }
}
