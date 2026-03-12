
// Persistent state in global scope to survive some serverless restarts
const getGlobalState = () => {
  const g = (typeof global !== 'undefined' ? global : {});
  if (!g.__THALAMUS_CACHE) g.__THALAMUS_CACHE = {};
  if (!g.__THALAMUS_QUEUE) g.__THALAMUS_QUEUE = {};
  if (!g.__THALAMUS_RESULTS) g.__THALAMUS_RESULTS = {};
  return {
    cache: g.__THALAMUS_CACHE,
    commandQueue: g.__THALAMUS_QUEUE,
    executionResults: g.__THALAMUS_RESULTS
  };
};

export default async function handler(req, res) {
  const { cache, commandQueue, executionResults } = getGlobalState();
  try {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Thalamus-Key, Accept');

    if (req.method === 'OPTIONS') return res.status(200).end();

    let body = req.body;
    
    // --- PARSING ROBUSTE DU BODY ---
    if (req.method === 'POST') {
      // Handle Buffer (common in some serverless environments)
      if (Buffer.isBuffer(body)) {
        body = body.toString('utf8');
      }

      // Handle cases where body might be a string (common with MT5 WebRequest)
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          console.error('[API] Failed to parse string body:', body.substring(0, 100));
        }
      }
      
      body = body || {};
      console.log("Received:", body);
    }

    // Security Check (Case-insensitive)
    const providedKey = (req.headers['x-thalamus-key'] || (body && body.key) || "").toString().toLowerCase();
    const serverKey = (process.env.THALAMUS_KEY || process.env.VITE_THALAMUS_KEY || "OWENkeya2015.com").toLowerCase();
    
    if (serverKey && providedKey !== serverKey) {
      console.warn('[API] Unauthorized access attempt with key:', providedKey);
      return res.status(401).json({ error: 'Invalid key', status: 'error', received: providedKey });
    }

    const { id, get_order, check_cmd } = req.query;

    // --- GESTION DES REQUÊTES GET ---
    if (req.method === 'GET') {
      const effective_id = id || (req.query.account_id);
      if (!effective_id && req.query.health !== '1') {
        return res.status(400).json({ error: 'Missing ID', status: 'error' });
      }

      if (req.query.health === '1') {
        return res.status(200).json({ status: 'ok', health: 'good' });
      }

      if (get_order === '1') {
        const orders = commandQueue[effective_id] || [];
        const order = orders.length > 0 ? orders[0] : null;
        if (cache[effective_id]) cache[effective_id].lastUpdate = Date.now();
        
        return res.status(200).json({ 
          status: 'ok',
          order: order ? {
            cmd_id: order.cmd_id,
            ticket_id: order.ticket_id,
            side: order.side,
            volume: (order.volume || 0).toString(),
            sl_points: order.sl_points || 0,
            tp_points: order.tp_points || 0
          } : null 
        });
      }

      if (check_cmd) {
        const ticket = executionResults[effective_id] ? executionResults[effective_id][check_cmd] : null;
        return res.status(200).json({ status: 'ok', confirmed: !!ticket, ticket_id: ticket });
      }

      const defaultData = { 
        balance: 0, equity: 0, profit: 0, lastUpdate: 0, positions: [],
        symbols: [
          { name: 'EURUSD', bid: 1.0850, ask: 1.0852, spread: 2, volume: 100 },
          { name: 'GBPUSD', bid: 1.2650, ask: 1.2653, spread: 3, volume: 80 },
          { name: 'XAUUSD', bid: 2030.50, ask: 2030.80, spread: 30, volume: 150 }
        ]
      };
      
      const cachedData = cache[effective_id] || {};
      const data = { ...defaultData, ...cachedData };
      const isLive = (Date.now() - (data.lastUpdate || 0)) < 30000;
      return res.status(200).json({ ...data, isLive, status: 'ok' });
    }

    // --- GESTION DES REQUÊTES POST ---
    if (req.method === 'POST') {
      const effective_id = body.account_id || body.id || body.account;

      if (!effective_id) {
        return res.status(400).json({ error: 'Missing account_id', status: 'error' });
      }

      // Initialize or get current cache
      const currentCache = cache[effective_id] || { 
        balance: 0, equity: 0, profit: 0, margin: 0, margin_level: 0,
        positions: [], symbols: [], lastUpdate: 0, disciplineScore: 100
      };

      // 1. UNIVERSAL PROTECTION (Fixed 2% Daily Loss)
      const adjustedMaxLoss = 2.0; 

      // 2. TRADE VALIDATION LOGIC
      if (body.type === 'VALIDATE_TRADE') {
        const score = currentCache.disciplineScore || 100;
        const positions = currentCache.positions || [];
        const canTrade = score > 70 && !currentCache.isBlocked && positions.length < 3;
        let reason = "OK";
        
        if (score <= 70) reason = "Score Discipline trop bas (" + score + "%)";
        if (currentCache.isBlocked) reason = "Trading bloqué (Limite journalière atteinte)";
        if (positions.length >= 3) reason = "Maximum de 3 positions simultanées atteint";

        return res.status(200).json({ 
          status: 'ok', 
          authorized: canTrade, 
          reason: reason,
          adjustedMaxLoss: adjustedMaxLoss
        });
      }

      // 3. MERGE DATA
      const updatedData = {
        ...currentCache,
        ...body,
        lastUpdate: Date.now(),
        adjustedMaxLoss: adjustedMaxLoss
      };

      // Ensure numeric types
      if (body.balance !== undefined) updatedData.balance = parseFloat(body.balance);
      if (body.equity !== undefined) updatedData.equity = parseFloat(body.equity);
      if (body.profit !== undefined) updatedData.profit = parseFloat(body.profit);
      if (body.margin !== undefined) updatedData.margin = parseFloat(body.margin);
      
      // Handle symbols and details
      if (body.symbols) updatedData.symbols = body.symbols;
      if (body.symbol_details) updatedData.symbol_details = body.symbol_details;
      
      // Check Daily Loss Limit
      const dailyLoss = ((updatedData.balance - updatedData.equity) / updatedData.balance) * 100;
      if (dailyLoss >= adjustedMaxLoss) {
        updatedData.isBlocked = true;
        updatedData.blockReason = "Limite journalière de " + adjustedMaxLoss + "% atteinte";
      }

      cache[effective_id] = updatedData;

      return res.status(200).json({ 
        status: 'ok', 
        received: true, 
        isBlocked: !!updatedData.isBlocked,
        adjustedMaxLoss: adjustedMaxLoss
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
