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
      if (Buffer.isBuffer(body)) {
        body = body.toString('utf8');
      }
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          console.error('[API] Failed to parse string body:', body.substring(0, 100));
          return res.status(400).json({ error: 'Invalid JSON', status: 'error' });
        }
      }
      body = body || {};
      console.log("[API] POST Received:", JSON.stringify(body, null, 2));
    }

    // ✅ CORRIGÉ: Lecture de la clé depuis headers, body ET query params (GET)
    const providedKey = (
      req.headers['x-thalamus-key'] || 
      req.headers['X-Thalamus-Key'] ||
      (body && body.key) || 
      req.query.key || 
      ""
    ).toString().toLowerCase().trim();
    
    const serverKey = (
      process.env.THALAMUS_KEY || 
      process.env.VITE_THALAMUS_KEY || 
      "OWENkeya2015.com"
    ).toLowerCase().trim();
    
    console.log(`[API] Key check: provided="${providedKey}", server="${serverKey}"`);
    
    if (serverKey && providedKey !== serverKey) {
      console.warn('[API] ❌ Unauthorized. Provided key:', providedKey, '| Expected:', serverKey);
      return res.status(401).json({ 
        error: 'Invalid key', 
        status: 'error', 
        received: providedKey,
        expected: serverKey 
      });
    }

    console.log('[API] ✅ Key authorized');

    const { id, get_order, check_cmd } = req.query;

    // --- GESTION DES REQUÊTES GET ---
    if (req.method === 'GET') {
      const effective_id = id || req.query.account_id;
      
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

      // ✅ Retourne les données financières
      const cachedData = cache[effective_id] || {};
      
      const data = { 
        balance: parseFloat(cachedData.balance) || 0,
        equity: parseFloat(cachedData.equity) || 0,
        profit: parseFloat(cachedData.profit) || 0,
        margin: parseFloat(cachedData.margin) || 0,
        margin_free: parseFloat(cachedData.margin_free) || 0,
        account_id: effective_id,
        lastUpdate: cachedData.lastUpdate || 0,
        isLive: (Date.now() - (cachedData.lastUpdate || 0)) < 30000,
        status: 'ok'
      };
      
      console.log(`[API] GET account ${effective_id}:`, data);
      
      return res.status(200).json(data);
    }

    // --- GESTION DES REQUÊTES POST ---
    if (req.method === 'POST') {
      const effective_id = body.account_id || body.id || body.account;

      if (!effective_id) {
        console.error('[API] Missing ID in POST body:', body);
        return res.status(400).json({ error: 'Missing fields', status: 'error', message: 'account_id is required' });
      }

      // Sync balance/equity/profit
      if (body.balance !== undefined || body.equity !== undefined || body.profit !== undefined) {
        const currentCache = cache[effective_id] || { balance: 0, equity: 0, profit: 0, margin: 0, margin_free: 0 };
        
        cache[effective_id] = { 
          ...currentCache,
          account_id: effective_id,
          balance: body.balance !== undefined ? parseFloat(body.balance) : currentCache.balance,
          equity: body.equity !== undefined ? parseFloat(body.equity) : (body.balance !== undefined ? parseFloat(body.balance) : currentCache.equity),
          profit: body.profit !== undefined ? parseFloat(body.profit) : currentCache.profit,
          margin: body.margin !== undefined ? parseFloat(body.margin) : currentCache.margin,
          margin_free: body.margin_free !== undefined ? parseFloat(body.margin_free) : currentCache.margin_free,
          lastUpdate: Date.now()
        };
        
        console.log(`[API] ✅ SYNCED ${effective_id}: Balance=${cache[effective_id].balance}, Equity=${cache[effective_id].equity}, Profit=${cache[effective_id].profit}`);
        
        return res.status(200).json({ 
          status: 'ok', 
          received: true,
          account_id: effective_id,
          balance: cache[effective_id].balance,
          equity: cache[effective_id].equity,
          profit: cache[effective_id].profit
        });
      }

      return res.status(200).json({ status: 'ok', received: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
