import { useState, useEffect, useRef } from 'react';

export interface MT5Tick {
  symbol: string;
  bid: number;
  ask: number;
  change: number;
  group: 'FOREX' | 'INDICES' | 'CRYPTO' | 'COMMODITIES';
}

export interface MT5Position {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  sl: number;
  tp: number;
  profit: number;
}

export interface MT5AccountData {
  balance: number;
  equity: number;
  currency: string;
  profit: number;
  id: string;
}

export interface MT5MarketSymbol {
  name: string;
  bid: number;
  ask: number;
  spread: number;
  volume: number;
  change?: number;
}

export interface MT5MarketData {
  symbols: MT5MarketSymbol[];
  lastUpdate: number;
  isLive: boolean;
}

export const useMT5 = (symbols: string[], onViolation?: (pos: MT5Position, oldSl: number) => void) => {
  const [ticks, setTicks] = useState<Record<string, MT5Tick>>({});
  const [positions, setPositions] = useState<MT5Position[]>([]);
  const [accountData, setAccountData] = useState<MT5AccountData | null>(null);
  const [marketData, setMarketData] = useState<MT5MarketData | null>(null);
  const prevPositionsRef = useRef<MT5Position[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const lastUpdateRef = useRef<number>(Date.now());
  const prevMarketDataRef = useRef<Record<string, number>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let demoInterval: NodeJS.Timeout | null = null;

    // High-fidelity simulation for training
    const startDemoMode = () => {
      setIsDemoMode(true);
      setIsConnected(false);
      
      const initialTicks: Record<string, MT5Tick> = {};
      symbols.forEach(s => {
        const basePrice = s.includes('USD') ? 1.08 + Math.random() * 0.1 : 2000 + Math.random() * 100;
        initialTicks[s] = {
          symbol: s,
          bid: basePrice,
          ask: basePrice + 0.0002,
          change: (Math.random() - 0.5) * 2,
          group: s.includes('USD') || s.includes('EUR') ? 'FOREX' : s.includes('XAU') ? 'COMMODITIES' : 'INDICES'
        };
      });
      setTicks(initialTicks);

      setAccountData({
        balance: 10000,
        equity: 10000,
        currency: 'USD',
        profit: 0,
        id: 'DEMO-1234'
      });

      setMarketData({
        symbols: symbols.map(s => ({
          name: s,
          bid: initialTicks[s].bid,
          ask: initialTicks[s].ask,
          spread: 2,
          volume: Math.floor(Math.random() * 1000),
          change: initialTicks[s].change
        })),
        lastUpdate: Date.now(),
        isLive: false
      });

      demoInterval = setInterval(() => {
        setTicks(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(s => {
            if (next[s]) {
              const movement = (Math.random() - 0.5) * 0.0001;
              next[s].bid += movement;
              next[s].ask = next[s].bid + 0.0002;
              next[s].change += (Math.random() - 0.5) * 0.01;
            }
          });
          return next;
        });
      }, 1000);
    };

    // Attempt WebSocket connection to Thalamus Bridge
    const connectMT5 = () => {
      // 3 seconds timeout for connection
      timeoutRef.current = setTimeout(() => {
        if (!isConnected && Date.now() - lastUpdateRef.current > 5000) {
          // Fallback to high-fidelity simulation if bridge is unreachable
          startDemoMode();
        }
      }, 3000);

      // Structure for real bridge communication
      const establishLiaison = async () => {
        try {
          // Check if bridge API is responsive
          // Using current origin to support both preview and deployed environments
          const origin = typeof window !== 'undefined' ? window.location.origin : 'https://thalamus-ai.vercel.app';
          
          // Try current origin first
          let bridgeUrl = `${origin}/api/trading-data?id=THA-5234-OBA&get_market=1&key=OWENkeya2015.com`;
          let response = await fetch(bridgeUrl);
          
          // If current origin fails or returns empty, and we are on Vercel, try the Cloud Run URL
          if ((!response.ok || isDemoMode) && origin.includes('vercel.app')) {
             const fallbackOrigin = 'https://ais-pre-6n3uzutnu4vfywuf7h4xvy-130630791689.europe-west2.run.app';
             bridgeUrl = `${fallbackOrigin}/api/trading-data?id=THA-5234-OBA&get_market=1&key=OWENkeya2015.com`;
             response = await fetch(bridgeUrl);
          }
          
          if (response.ok) {
            const data = await response.json();
            
            // Debug log for critical balance issue
            console.log("[MT5 DEBUG] Raw data received:", data);
            console.log("API Response:", data);
            
            setIsDemoMode(false);
            setIsConnected(true);
            lastUpdateRef.current = Date.now();

            // Handle balance parsing (string or number)
            const rawBalance = data.balance;
            const parsedBalance = typeof rawBalance === 'string' ? parseFloat(rawBalance) : rawBalance;
            const rawEquity = data.equity;
            const parsedEquity = typeof rawEquity === 'string' ? parseFloat(rawEquity) : rawEquity;

            if (parsedBalance !== undefined && parsedBalance !== null) {
              setAccountData({
                balance: parsedBalance,
                equity: parsedEquity || parsedBalance,
                currency: data.currency || 'EUR',
                profit: data.profit || 0,
                id: data.account_id || 'THA-5234-OBA'
              });
            }

            // Handle Market Data
            if (data.symbols) {
              const enrichedSymbols = data.symbols.map((s: any) => {
                const prevBid = prevMarketDataRef.current[s.name];
                let change = 0;
                if (prevBid && s.bid) {
                  change = ((s.bid - prevBid) / prevBid) * 100;
                }
                prevMarketDataRef.current[s.name] = s.bid;
                return { ...s, change };
              });

              setMarketData({
                symbols: enrichedSymbols,
                lastUpdate: data.lastUpdate || Date.now(),
                isLive: data.isLive || false
              });
            }

            if (data.positions) {
              // Bidirectional Monitoring Logic
              data.positions.forEach((newPos: MT5Position) => {
                const oldPos = prevPositionsRef.current.find(p => p.id === newPos.id);
                if (oldPos && newPos.sl !== oldPos.sl) {
                  const isBuy = newPos.side === 'BUY';
                  const isViolation = isBuy ? newPos.sl < oldPos.sl : newPos.sl > oldPos.sl;
                  
                  if (isViolation && onViolation) {
                    onViolation(newPos, oldPos.sl);
                  }
                }
              });
              
              setPositions(data.positions);
              prevPositionsRef.current = data.positions;
            }
          } else {
            if (Date.now() - lastUpdateRef.current > 10000) {
              setIsConnected(false);
            }
          }
        } catch (err) {
          if (Date.now() - lastUpdateRef.current > 10000) {
            setIsConnected(false);
          }
        }
      };

      establishLiaison();
      
      // Continuous polling for positions and ticks
      const pollInterval = setInterval(establishLiaison, 2000);
      return () => clearInterval(pollInterval);
    };

    const cleanup = connectMT5();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (socketRef.current) socketRef.current.close();
      if (demoInterval) clearInterval(demoInterval);
      if (cleanup) cleanup();
    };
  }, [symbols]);

  return { ticks, positions, accountData, isConnected, isDemoMode, marketData };
};
