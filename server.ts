import express from "express";
import { createServer as createViteServer } from "vite";
import tradingDataHandler from "./api/trading-data.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON parsing with error handling
  app.use(express.json());
  app.use(express.text({ type: 'text/*' }));
  app.use(express.urlencoded({ extended: true }));

  // Custom error handler for JSON parsing
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
      console.error('[SERVER] JSON Parse Error. Body might be raw text.');
      return next(); // Fall through to other parsers or raw handling
    }
    next(err);
  });

  // MT5 Connection State
  const connectedAccounts = new Map();
  (global as any).connectedAccounts = connectedAccounts;

  // New MT5 API Endpoints (as requested)
  app.use("/api/mt5", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Thalamus-Key');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
  });

  app.get("/api/mt5", (req, res) => {
    const { key, account } = req.query;
    
    if (!key || (key as string).length < 32) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    if (account) {
      console.log(`[MT5] Account ${account} pinged (GET). Total connected: ${connectedAccounts.size + 1}`);
      connectedAccounts.set(account, {
        lastPing: Date.now(),
        key: key,
        status: 'connected'
      });
    }
    
    res.json({
      status: 'ok',
      type: 'PONG',
      timestamp: Date.now(),
      serverTime: new Date().toISOString(),
      account: account,
      message: 'Thalamus Connected'
    });
  });

  app.post("/api/mt5", (req, res) => {
    try {
      const body = req.body || {};
      const account = body.account || body.account_id;
      
      if (account) {
        console.log(`[MT5] Account ${account} pinged (POST).`);
        connectedAccounts.set(account, {
          lastPing: Date.now(),
          status: 'connected'
        });
      }

      console.log('MT5 Message:', body);
      
      switch(body.type) {
        case 'AUTH':
          return res.json({ status: 'authenticated', type: 'AUTH_OK' });
        case 'PING':
          return res.json({ status: 'ok', type: 'PONG', timestamp: Date.now() });
        case 'VIOLATION':
          console.log('VIOLATION:', body);
          return res.json({ status: 'logged' });
        default:
          return res.json({ status: 'unknown_type' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });

  app.get("/api/mt5/status", (req, res) => {
    // Check if any account has pinged in the last 30 seconds
    let isConnected = false;
    for (const acc of connectedAccounts.values()) {
      if (Date.now() - acc.lastPing < 30000) {
        isConnected = true;
        break;
      }
    }

    res.json({
      mt5Connected: isConnected,
      lastPing: Date.now(),
      status: 'operational'
    });
  });

  // API Route (Legacy/Trading Data)
  app.all("/api/trading-data", async (req, res) => {
    try {
      await tradingDataHandler(req, res);
    } catch (error: any) {
      console.error('[SERVER ERROR] Trading Data Handler:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
      }
    }
  });

  // Fallback for MT5 EAs that might hit the root URL with POST
  app.post("/", async (req, res) => {
    try {
      if (req.body && (req.body.account_id || req.body.id || req.body.account)) {
        return await tradingDataHandler(req, res);
      }
      res.status(405).send("Method Not Allowed on Root");
    } catch (error: any) {
      console.error('[SERVER ERROR] Root POST Handler:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
      }
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
