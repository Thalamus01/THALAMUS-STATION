
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
        console.error('[API] Missing ID in POST body:', body);
        return res.status(400).json({ error: 'Missing fields', status: 'error', message: 'account_id is required' });
      }

      // Initialize or get current cache
      const currentCache = cache[effective_id] || { 
        balance: 0, 
        equity: 0, 
        profit: 0, 
        positions: [], 
        symbols: [],
        lastUpdate: 0 
      };

      // Merge incoming data
      const updatedData = {
        ...currentCache,
        ...body,
        lastUpdate: Date.now()
      };

      // Ensure numeric types are correct
      if (body.balance !== undefined) updatedData.balance = parseFloat(body.balance);
      if (body.equity !== undefined) updatedData.equity = parseFloat(body.equity);
      if (body.profit !== undefined) updatedData.profit = parseFloat(body.profit);
      
      // Handle positions specifically to ensure it's an array
      if (body.positions && Array.isArray(body.positions)) {
        updatedData.positions = body.positions;
      }

      // Save back to cache
      cache[effective_id] = updatedData;

      // Handle command queuing (if any)
      if (body.command === 'OPEN_TRADE' || body.command === 'UPDATE_TRADE') {
        const newCmdId = body.cmd_id || "CMD" + Math.floor(Date.now() / 1000);
        if (!commandQueue[effective_id]) commandQueue[effective_id] = [];
        commandQueue[effective_id].push({ 
          ...body,
          cmd_id: newCmdId
        });
        return res.status(200).json({ status: 'ok', received: true, queued: true, cmd_id: newCmdId });
      }

      // Handle command confirmations
      if (body.ticket_id && body.cmd_id) {
        if (!executionResults[effective_id]) executionResults[effective_id] = {};
        executionResults[effective_id][body.cmd_id] = body.ticket_id;
        if (commandQueue[effective_id]) {
          commandQueue[effective_id] = commandQueue[effective_id].filter(o => o.cmd_id !== body.cmd_id);
        }
      }

      console.log(`[API] Synced ${effective_id}: Bal=${updatedData.balance}, Pos=${updatedData.positions.length}`);
      
      return res.status(200).json({ 
        status: 'ok', 
        received: true, 
        synced: true, 
        timestamp: Math.floor(Date.now() / 1000) 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
