//+------------------------------------------------------------------+
//|                                              ThalamusBridge.mq5  |
//|                                  Copyright 2026, Thalamus Quant  |
//|                                       https://thalamus-quant.ai  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Thalamus Quant"
#property link      "https://thalamus-quant.ai"
#property version   "2.05"
#property strict
#property description "Sentinel Bridge: Secure HTTP Liaison & SL Hard-Lock Protection"

// IMPORTANT: You MUST add the API URL to the list of allowed URLs in:
// Tools -> Options -> Expert Advisors -> Allow WebRequest for listed URL
// Add: http://localhost:3000 (or your server domain)

#include <Trade\Trade.mqh>
#include <Arrays\ArrayObj.mqh>

//--- ENUMS
enum ENUM_CONN_STATUS {
   CONN_CONNECTED,
   CONN_RECONNECTING,
   CONN_DISCONNECTED,
   CONN_EMERGENCY
};

//--- INPUTS
input group "=== CONNEXION ==="
input string   InpAccountID      = "THA-5234-OBA";      // Thalamus ID (CORRECT)
input string   InpServerUrl      = "https://ais-dev-6n3uzutnu4vfywuf7h4xvy-130630791689.europe-west2.run.app/api/trading-data"; // Vercel Bridge URL
input int      InpTimerMs        = 500;                 // Refresh Interval (ms)
input string   InpThalamusKey    = "OWENkeya2015.com";  // Secret Key (REQUIRED)

input group "=== PROTECTIONS ==="
input bool     InpAntiReculActive = true;               // SL Hard-Lock Active
input bool     InpMonitorAll      = true;               // Surveiller TOUS les EAs (Supervision Globale)
input int      InpMagicNumber    = 888123;              // Magic Number Thalamus
input double   InpMaxDailyLoss   = 5.0;                 // Max Daily Loss %

//--- CONSTANTS
#define UI_PREFIX "THALAMUS_UI_"

//--- STRUCTS
struct PositionGuard {
   ulong ticket;
   double guarded_sl;
   string symbol;
};

//--- GLOBAL VARIABLES
CTrade         g_trade;
ENUM_CONN_STATUS g_status = CONN_DISCONNECTED;
PositionGuard  g_guarded_positions[];
datetime       g_last_sync = 0;
datetime       g_last_data_sync = 0;
string         g_last_cmd_id = "";
string         g_last_violation = "None";

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   g_trade.SetExpertMagicNumber(InpMagicNumber);
   
   // Create UI
   CreateUI();
   
   // Set Timers
   if(!EventSetMillisecondTimer(InpTimerMs)) return(INIT_FAILED);
   
   Print("THALAMUS SENTINEL: Initialized. Mode: ", InpMonitorAll ? "GLOBAL" : "LOCAL");
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
   ObjectsDeleteAll(0, UI_PREFIX);
}

//+------------------------------------------------------------------+
//| Expert timer function                                            |
//+------------------------------------------------------------------+
void OnTimer()
{
   // 1. Check for orders
   CheckForOrders();
   
   // 2. Sync account data
   if(TimeCurrent() - g_last_data_sync >= 5)
   {
      SyncAccountData();
      g_last_data_sync = TimeCurrent();
   }
   
   // 3. Security Scan (SL Hard-Lock)
   if(InpAntiReculActive) {
      ScanPositions();
   }
   
   // 4. Daily Loss Protection
   CheckDailyLoss();
   
   // 5. Update UI
   UpdateUI();
}

//+------------------------------------------------------------------+
//| UI Dashboard Creation                                            |
//+------------------------------------------------------------------+
void CreateUI()
{
   int x = 10, y = 30;
   CreateRect(UI_PREFIX + "BG", x, y, 220, 160, clrBlack);
   CreateLabel(UI_PREFIX + "TITLE", x + 10, y + 10, "THALAMUS SENTINEL v2.0", 10, clrCyan);
   CreateLabel(UI_PREFIX + "STATUS", x + 10, y + 35, "Status: Disconnected", 9, clrRed);
   CreateLabel(UI_PREFIX + "POSITIONS", x + 10, y + 55, "Guarded: 0", 9, clrWhite);
   CreateLabel(UI_PREFIX + "VIOLATION", x + 10, y + 75, "Last Violation: None", 8, clrOrange);
   
   CreateButton(UI_PREFIX + "BTN_PANIC", x + 10, y + 100, 200, 30, "PANIC EXIT ALL", clrRed);
}

//+------------------------------------------------------------------+
//| Update UI Values                                                 |
//+------------------------------------------------------------------+
void UpdateUI()
{
   string status_text = "Status: ";
   color status_color = clrWhite;
   
   if(g_last_sync == 0) {
      status_text += "DISCONNECTED";
      status_color = clrRed;
   } else if(TimeCurrent() - g_last_sync > 10) {
      status_text += "LATENCY HIGH";
      status_color = clrOrange;
   } else {
      status_text += "CONNECTED";
      status_color = clrLime;
   }
   
   ObjectSetString(0, UI_PREFIX + "STATUS", OBJPROP_TEXT, status_text);
   ObjectSetInteger(0, UI_PREFIX + "STATUS", OBJPROP_COLOR, status_color);
   
   ObjectSetString(0, UI_PREFIX + "POSITIONS", OBJPROP_TEXT, "Guarded: " + (string)ArraySize(g_guarded_positions));
   ObjectSetString(0, UI_PREFIX + "VIOLATION", OBJPROP_TEXT, "Violation: " + g_last_violation);
}

//+------------------------------------------------------------------+
//| Web Engine: Check for Orders (GET)                               |
//+------------------------------------------------------------------+
void CheckForOrders()
{
   string url = InpServerUrl + "?id=" + InpAccountID + "&get_order=1";
   uchar post[], result[];
   string res_headers;
   string req_headers = "X-Thalamus-Key: " + InpThalamusKey + "\r\n";
   
   int res = WebRequest("GET", url, "", "", 500, post, 0, result, res_headers);
   
   if(res == 200)
   {
      g_last_sync = TimeCurrent();
      string jsonStr = CharArrayToString(result);
      
      if(StringFind(jsonStr, "\"order\":null") == -1)
      {
         string cmd_id = ExtractJsonValue(jsonStr, "cmd_id");
         string side   = ExtractJsonValue(jsonStr, "side");
         string symbol = ExtractJsonValue(jsonStr, "symbol");
         double volume = StringToDouble(ExtractJsonValue(jsonStr, "volume"));
         int sl_pts    = (int)StringToInteger(ExtractJsonValue(jsonStr, "sl_points"));
         int tp_pts    = (int)StringToInteger(ExtractJsonValue(jsonStr, "tp_points"));
         
         if(cmd_id != "" && cmd_id != g_last_cmd_id)
         {
            if(symbol == "") symbol = _Symbol;
            ExecuteTrade(cmd_id, side, symbol, volume, sl_pts, tp_pts);
            g_last_cmd_id = cmd_id;
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Trade Engine: Execution                                          |
//+------------------------------------------------------------------+
void ExecuteTrade(string cmd_id, string side, string symbol, double volume, int sl_pts, int tp_pts)
{
   double price = 0, sl = 0, tp = 0;
   double point = SymbolInfoDouble(symbol, SYMBOL_POINT);
   int digits   = (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS);
   
   if(side == "BUY")
   {
      price = SymbolInfoDouble(symbol, SYMBOL_ASK);
      if(sl_pts > 0) sl = NormalizeDouble(price - sl_pts * point, digits);
      if(tp_pts > 0) tp = NormalizeDouble(price + tp_pts * point, digits);
      if(g_trade.Buy(volume, symbol, price, sl, tp)) ConfirmOrder(cmd_id, g_trade.ResultOrder());
   }
   else if(side == "SELL")
   {
      price = SymbolInfoDouble(symbol, SYMBOL_BID);
      if(sl_pts > 0) sl = NormalizeDouble(price + sl_pts * point, digits);
      if(tp_pts > 0) tp = NormalizeDouble(price - tp_pts * point, digits);
      if(g_trade.Sell(volume, symbol, price, sl, tp)) ConfirmOrder(cmd_id, g_trade.ResultOrder());
   }
}

//+------------------------------------------------------------------+
//| Web Engine: Confirm Order (POST)                                 |
//+------------------------------------------------------------------+
void ConfirmOrder(string cmd_id, ulong ticket)
{
   string body = "{\"account_id\":\"" + InpAccountID + "\",\"cmd_id\":\"" + cmd_id + "\",\"ticket_id\":\"" + (string)ticket + "\",\"key\":\"" + InpThalamusKey + "\"}";
   uchar post_data[], result_data[];
   string req_headers = "Content-Type: application/json\r\n" + "X-Thalamus-Key: " + InpThalamusKey + "\r\n";
   string res_headers = "";
   
   int data_len = StringToCharArray(body, post_data);
   if(data_len > 0) ArrayResize(post_data, data_len - 1);
   
   WebRequest("POST", InpServerUrl, req_headers, 1000, post_data, result_data, res_headers);
}

//+------------------------------------------------------------------+
//| Web Engine: Sync Account Data (POST)                             |
//+------------------------------------------------------------------+
void SyncAccountData()
{
   // 1. Récupération des positions ouvertes (TOUTES)
   string positionsJson = "[";
   int posCount = 0;
   for(int i=0; i<PositionsTotal(); i++)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket > 0 && PositionSelectByTicket(ticket))
      {
         if(posCount > 0) positionsJson += ",";
         positionsJson += "{";
         positionsJson += "\"id\":\"" + IntegerToString(ticket) + "\",";
         positionsJson += "\"symbol\":\"" + PositionGetString(POSITION_SYMBOL) + "\",";
         positionsJson += "\"side\":\"" + (PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_BUY ? "BUY" : "SELL") + "\",";
         positionsJson += "\"volume\":" + DoubleToString(PositionGetDouble(POSITION_VOLUME), 2) + ",";
         positionsJson += "\"profit\":" + DoubleToString(PositionGetDouble(POSITION_PROFIT), 2) + ",";
         positionsJson += "\"magic\":" + IntegerToString(PositionGetInteger(POSITION_MAGIC));
         positionsJson += "}";
         posCount++;
      }
   }
   positionsJson += "]";

   // 2. Récupération des symboles du Market Watch
   string symbolsJson = "[";
   int totalSymbols = SymbolsTotal(true);
   for(int i=0; i<totalSymbols; i++)
   {
      string name = SymbolName(i, true);
      double bid = SymbolInfoDouble(name, SYMBOL_BID);
      double ask = SymbolInfoDouble(name, SYMBOL_ASK);
      long spread = SymbolInfoInteger(name, SYMBOL_SPREAD);
      
      symbolsJson += "{\"name\":\"" + name + "\",\"bid\":" + DoubleToString(bid, 5) + ",\"ask\":" + DoubleToString(ask, 5) + ",\"spread\":" + (string)spread + "}";
      if(i < totalSymbols - 1) symbolsJson += ",";
   }
   symbolsJson += "]";

   string body = "{\"account_id\":\"" + InpAccountID + "\"," +
                 "\"balance\":" + DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE), 2) + "," +
                 "\"equity\":" + DoubleToString(AccountInfoDouble(ACCOUNT_EQUITY), 2) + "," +
                 "\"profit\":" + DoubleToString(AccountInfoDouble(ACCOUNT_PROFIT), 2) + "," +
                 "\"key\":\"" + InpThalamusKey + "\"," +
                 "\"positions\":" + positionsJson + "," +
                 "\"symbols\":" + symbolsJson + "}";
   
   uchar post_data[], result_data[];
   string req_headers = "Content-Type: application/json\r\n" + "X-Thalamus-Key: " + InpThalamusKey + "\r\n";
   string res_headers = "";
   
   int data_len = StringToCharArray(body, post_data);
   if(data_len > 0) ArrayResize(post_data, data_len - 1);
   
   WebRequest("POST", InpServerUrl, req_headers, 1000, post_data, result_data, res_headers);
}

//+------------------------------------------------------------------+
//| Anti-Recul SL Rule Implementation                                |
//+------------------------------------------------------------------+
void CheckSLViolation(ulong ticket)
{
   if(!PositionSelectByTicket(ticket)) return;
   
   double current_sl = PositionGetDouble(POSITION_SL);
   if(current_sl == 0) return;
   
   int idx = -1;
   for(int i = 0; i < ArraySize(g_guarded_positions); i++) {
      if(g_guarded_positions[i].ticket == ticket) { idx = i; break; }
   }
   
   if(idx == -1) {
      int size = ArraySize(g_guarded_positions);
      ArrayResize(g_guarded_positions, size + 1);
      g_guarded_positions[size].ticket = ticket;
      g_guarded_positions[size].guarded_sl = current_sl;
      g_guarded_positions[size].symbol = PositionGetString(POSITION_SYMBOL);
      return;
   }
   
   double old_sl = g_guarded_positions[idx].guarded_sl;
   if(current_sl == old_sl) return;
   
   ENUM_POSITION_TYPE type = (ENUM_POSITION_TYPE)PositionGetInteger(POSITION_TYPE);
   bool violation = false;
   
   if(type == POSITION_TYPE_BUY) {
      if(current_sl < old_sl) violation = true;
   } else {
      if(current_sl > old_sl) violation = true;
   }
   
   if(violation) {
      Print("SENTINEL: SL VIOLATION on #", ticket, ". Restoring to ", old_sl);
      g_trade.PositionModify(ticket, old_sl, PositionGetDouble(POSITION_TP));
      g_last_violation = TimeToString(TimeCurrent()) + " SL_RECUL #" + (string)ticket;
   } else {
      g_guarded_positions[idx].guarded_sl = current_sl;
   }
}

void ScanPositions()
{
   for(int i = 0; i < PositionsTotal(); i++) {
      ulong ticket = PositionGetTicket(i);
      if(PositionSelectByTicket(ticket)) {
         if(PositionGetInteger(POSITION_MAGIC) == InpMagicNumber) {
            CheckSLViolation(ticket);
         }
      }
   }
}

void CheckDailyLoss()
{
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   
   if(balance <= 0) return; // Sécurité : ne rien faire si le compte n'est pas chargé
   
   double loss_pct = (balance - equity) / balance * 100.0;
   
   if(loss_pct >= InpMaxDailyLoss) {
      int closed_count = 0;
      for(int i = PositionsTotal() - 1; i >= 0; i--) {
         ulong ticket = PositionGetTicket(i);
         if(PositionSelectByTicket(ticket)) {
            if(InpMonitorAll || PositionGetInteger(POSITION_MAGIC) == InpMagicNumber) {
               if(g_trade.PositionClose(ticket)) closed_count++;
            }
         }
      }
      if(closed_count > 0) {
         Print("THALAMUS: Max Daily Loss Reached. ", closed_count, " positions closed.");
      }
   }
}

//+------------------------------------------------------------------+
//| UI HELPERS                                                       |
//+------------------------------------------------------------------+
void CreateRect(string name, int x, int y, int w, int h, color bg) {
   ObjectCreate(0, name, OBJ_RECTANGLE_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_XSIZE, w);
   ObjectSetInteger(0, name, OBJPROP_YSIZE, h);
   ObjectSetInteger(0, name, OBJPROP_BGCOLOR, bg);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
}

void CreateLabel(string name, int x, int y, string text, int size, color c) {
   ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, size);
   ObjectSetInteger(0, name, OBJPROP_COLOR, c);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
}

void CreateButton(string name, int x, int y, int w, int h, string text, color bg) {
   ObjectCreate(0, name, OBJ_BUTTON, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_XSIZE, w);
   ObjectSetInteger(0, name, OBJPROP_YSIZE, h);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetInteger(0, name, OBJPROP_BGCOLOR, bg);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clrWhite);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
}

//+------------------------------------------------------------------+
//| Helper: Extract JSON Value                                       |
//+------------------------------------------------------------------+
string ExtractJsonValue(string json, string key)
{
   string search = "\"" + key + "\"";
   int pos = StringFind(json, search);
   if(pos == -1) return "";
   int start = StringFind(json, ":", pos + StringLen(search));
   if(start == -1) return "";
   start++;
   int len = StringLen(json);
   while(start < len && (StringSubstr(json, start, 1) == " " || StringSubstr(json, start, 1) == ":")) start++;
   int end = -1;
   if(StringSubstr(json, start, 1) == "\"") {
      start++;
      end = StringFind(json, "\"", start);
   } else {
      int end1 = StringFind(json, ",", start), end2 = StringFind(json, "}", start), end3 = StringFind(json, "]", start);
      if(end1 != -1) end = end1;
      if(end2 != -1 && (end == -1 || end2 < end)) end = end2;
      if(end3 != -1 && (end == -1 || end3 < end)) end = end3;
   }
   if(end == -1) return "";
   return StringSubstr(json, start, end - start);
}
