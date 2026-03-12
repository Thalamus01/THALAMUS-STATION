import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());
  app.use(express.text({ type: '*/*' })); // Fallback for non-JSON content types

  // Persistent state
  const cache: Record<string, any> = {};
  const commandQueue: Record<string, any[]> = {};
  const executionResults: Record<string, Record<string, string>> = {};

  // WebSocket handling
  wss.on("connection", (ws: WebSocket) => {
    console.log("[WS] New client connected");
    
    let accountId: string | null = null;

    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "SUBSCRIBE") {
          accountId = data.accountId;
          console.log(`[WS] Client subscribed to ${accountId}`);
          // Send initial data
          if (accountId && cache[accountId]) {
            ws.send(JSON.stringify({ type: "UPDATE", data: cache[accountId] }));
          }
        }
        if (data.type === "HEARTBEAT") {
          ws.send(JSON.stringify({ type: "HEARTBEAT_ACK", timestamp: Date.now() }));
        }
      } catch (e) {
        console.error("[WS] Error parsing message:", e);
      }
    });

    // Broadcast updates to subscribed clients
    const broadcastUpdate = (id: string, update: any) => {
      if (accountId === id && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "UPDATE", data: update }));
      }
    };

    // Store broadcast function in a way we can access it
    (ws as any).broadcastUpdate = broadcastUpdate;

    ws.on("close", () => {
      console.log("[WS] Client disconnected");
    });
  });

  const notifyClients = (id: string, data: any) => {
    wss.clients.forEach((client: any) => {
      if ((client as any).broadcastUpdate) {
        (client as any).broadcastUpdate(id, data);
      }
    });
  };

  // API Routes (Mirroring trading-data.js)
  app.all("/api/trading-data", (req, res) => {
    let body = req.body;

    // Robust parsing for MT5
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Not JSON, keep as string or empty
      }
    }
    
    const providedKey = (req.headers['x-thalamus-key'] || (body && body.key) || req.query.key || "").toString().toLowerCase();
    const serverKey = (process.env.THALAMUS_KEY || process.env.VITE_THALAMUS_KEY || "OWENkeya2015.com").toLowerCase();
    
    if (serverKey && providedKey !== serverKey) {
      return res.status(401).json({ error: 'Invalid key' });
    }

    const { id, get_order, check_cmd } = req.query;

    if (req.method === 'GET') {
      const effective_id = (id || req.query.account_id) as string;
      if (!effective_id) return res.status(400).json({ error: 'Missing ID' });

      if (get_order === '1') {
        const orders = commandQueue[effective_id] || [];
        const order = orders.length > 0 ? orders[0] : null;
        return res.json({ status: 'ok', order });
      }

      if (check_cmd) {
        const ticket = executionResults[effective_id]?.[check_cmd as string];
        return res.json({ status: 'ok', confirmed: !!ticket, ticket_id: ticket });
      }

      const data = cache[effective_id] || { balance: 0, equity: 0, profit: 0, positions: [], symbols: [] };
      return res.json({ ...data, status: 'ok', isLive: (Date.now() - (data.lastUpdate || 0)) < 30000 });
    }

    if (req.method === 'POST') {
      const effective_id = (body.account_id || body.id || body.account) as string;
      if (!effective_id) return res.status(400).json({ error: 'Missing ID' });

      const currentCache = cache[effective_id] || { balance: 0, equity: 0, profit: 0, positions: [], symbols: [], disciplineScore: 100 };
      
      // 1. UNIVERSAL PROTECTION
      const adjustedMaxLoss = 2.0;

      // 2. TRADE VALIDATION
      if (body.type === 'VALIDATE_TRADE') {
        const score = currentCache.disciplineScore || 100;
        const positions = currentCache.positions || [];
        const isBlocked = currentCache.isBlocked || false;
        const canTrade = score > 70 && !isBlocked && positions.length < 3;
        let reason = "OK";
        
        if (score <= 70) reason = "Score Discipline trop bas (" + score + "%)";
        if (isBlocked) reason = "Trading bloqué (Limite journalière atteinte)";
        if (positions.length >= 3) reason = "Maximum de 3 positions simultanées atteint";

        return res.json({ 
          status: 'ok', 
          authorized: canTrade, 
          reason: reason,
          adjustedMaxLoss: adjustedMaxLoss
        });
      }

      // Update cache
      const updatedData = {
        ...currentCache,
        ...body,
        balance: body.balance !== undefined ? parseFloat(body.balance) : currentCache.balance,
        equity: body.equity !== undefined ? parseFloat(body.equity) : currentCache.equity,
        profit: body.profit !== undefined ? parseFloat(body.profit) : currentCache.profit,
        symbols: body.symbols || currentCache.symbols,
        symbol_details: body.symbol_details || currentCache.symbol_details,
        lastUpdate: Date.now(),
        adjustedMaxLoss: adjustedMaxLoss
      };

      // Check Daily Loss
      const dailyLoss = ((updatedData.balance - updatedData.equity) / updatedData.balance) * 100;
      if (dailyLoss >= adjustedMaxLoss) {
        updatedData.isBlocked = true;
        updatedData.blockReason = `Limite de perte journalière atteinte (-${dailyLoss.toFixed(2)}%)`;
      }

      cache[effective_id] = updatedData;

      // Handle commands
      if (body.command === 'OPEN_TRADE' || body.command === 'UPDATE_TRADE') {
        const cmd_id = body.cmd_id || "CMD" + Date.now();
        if (!commandQueue[effective_id]) commandQueue[effective_id] = [];
        commandQueue[effective_id].push({ ...body, cmd_id });
        return res.json({ status: 'ok', cmd_id });
      }

      // Handle confirmations
      if (body.ticket_id && body.cmd_id) {
        if (!executionResults[effective_id]) executionResults[effective_id] = {};
        executionResults[effective_id][body.cmd_id] = body.ticket_id;
        commandQueue[effective_id] = (commandQueue[effective_id] || []).filter(o => o.cmd_id !== body.cmd_id);
      }

      // Notify WS clients
      notifyClients(effective_id, cache[effective_id]);

      return res.json({ status: 'ok' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
