//+------------------------------------------------------------------+
//|                                              ThalamusSentinel.mq5|
//|                                  Copyright 2026, Thalamus OBA    |
//|                                             https://thalamus.oba |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Thalamus OBA"
#property link      "https://thalamus.oba"
#property version   "2.01"
#property strict
#property description "Sentinel Bridge: Secure HTTP Liaison & Discipline Protection"

// IMPORTANT: You MUST add the API URL to the list of allowed URLs in:
// Tools -> Options -> Expert Advisors -> Allow WebRequest for listed URL
// Add: http://localhost:3000 (or your server domain)

#include <Trade\Trade.mqh>

//--- Input Parameters
input group "=== CONFIGURATION ==="
input string   InpAccountID = "THA-5234-OBA";         // ID Thalamus
input string   InpApiUrl    = "https://ais-dev-6n3uzutnu4vfywuf7h4xvy-130630791689.europe-west2.run.app/api/trading-data"; // URL CLOUD RUN (STABLE)
input int      InpTimerMs   = 500;                    // Intervalle (ms)
input string   InpSecretKey = "OWENkeya2015.com";     // Clé Secrète obligatoire

input group "=== SÉCURITÉ ==="
input int      InpMagic     = 888123;                 // Magic Number Thalamus
input bool     InpHardLock  = true;                   // Protection Anti-Recul SL
input double   InpMaxDailyLoss = 5.0;                 // Perte Max Journalière (%)

//--- Global Variables
CTrade         g_trade;
datetime       g_last_sync = 0;
datetime       g_last_data_sync = 0;
string         g_last_cmd_id = "";

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   // Configuration du Magic Number
   g_trade.SetExpertMagicNumber(InpMagic);
   
   // Initialisation du Timer
   if(!EventSetMillisecondTimer(InpTimerMs)) {
      Print("THALAMUS ERROR: Failed to set timer.");
      return(INIT_FAILED);
   }
   
   // Création de l'interface visuelle
   CreateDashboard();
   
   Print("THALAMUS SENTINEL: Initialisation réussie.");
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
   ObjectsDeleteAll(0, "THALAMUS_");
}

//+------------------------------------------------------------------+
//| Expert timer function                                            |
//+------------------------------------------------------------------+
void OnTimer()
{
   // 1. Vérifier s'il y a des ordres en attente
   CheckForOrders();
   
   // 2. Synchroniser les données du compte toutes les 5 secondes
   if(TimeCurrent() - g_last_data_sync >= 5)
   {
      SyncAccountData();
      g_last_data_sync = TimeCurrent();
   }
   
   // 3. Vérification de la perte journalière (Seulement si activé et si perte > 0)
   if(InpMaxDailyLoss > 0) CheckDailyLoss();
   
   // 4. Mettre à jour l'interface
   UpdateDashboard();
}

//+------------------------------------------------------------------+
//| UI Dashboard Creation                                            |
//+------------------------------------------------------------------+
void CreateDashboard()
{
   int x = 10;
   int y = 20;
   
   ObjectCreate(0, "THALAMUS_BG", OBJ_RECTANGLE_LABEL, 0, 0, 0);
   ObjectSetInteger(0, "THALAMUS_BG", OBJPROP_XSIZE, 260);
   ObjectSetInteger(0, "THALAMUS_BG", OBJPROP_YSIZE, 100);
   ObjectSetInteger(0, "THALAMUS_BG", OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, "THALAMUS_BG", OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, "THALAMUS_BG", OBJPROP_BGCOLOR, clrBlack);
   ObjectSetInteger(0, "THALAMUS_BG", OBJPROP_BORDER_TYPE, BORDER_FLAT);
   ObjectSetInteger(0, "THALAMUS_BG", OBJPROP_COLOR, C'43,47,54');
   
   ObjectCreate(0, "THALAMUS_TITLE", OBJ_LABEL, 0, 0, 0);
   ObjectSetString(0, "THALAMUS_TITLE", OBJPROP_TEXT, "THALAMUS SENTINEL ACTIVE");
   ObjectSetInteger(0, "THALAMUS_TITLE", OBJPROP_XDISTANCE, x + 10);
   ObjectSetInteger(0, "THALAMUS_TITLE", OBJPROP_YDISTANCE, y + 10);
   ObjectSetInteger(0, "THALAMUS_TITLE", OBJPROP_COLOR, clrCyan);
   ObjectSetInteger(0, "THALAMUS_TITLE", OBJPROP_FONTSIZE, 10);
   
   ObjectCreate(0, "THALAMUS_ID", OBJ_LABEL, 0, 0, 0);
   ObjectSetString(0, "THALAMUS_ID", OBJPROP_TEXT, "ID: " + InpAccountID);
   ObjectSetInteger(0, "THALAMUS_ID", OBJPROP_XDISTANCE, x + 10);
   ObjectSetInteger(0, "THALAMUS_ID", OBJPROP_YDISTANCE, y + 30);
   ObjectSetInteger(0, "THALAMUS_ID", OBJPROP_COLOR, clrGray);
   ObjectSetInteger(0, "THALAMUS_ID", OBJPROP_FONTSIZE, 8);
   
   ObjectCreate(0, "THALAMUS_STATUS", OBJ_LABEL, 0, 0, 0);
   ObjectSetString(0, "THALAMUS_STATUS", OBJPROP_TEXT, "PROTECTION : ACTIVE");
   ObjectSetInteger(0, "THALAMUS_STATUS", OBJPROP_XDISTANCE, x + 10);
   ObjectSetInteger(0, "THALAMUS_STATUS", OBJPROP_YDISTANCE, y + 55);
   ObjectSetInteger(0, "THALAMUS_STATUS", OBJPROP_COLOR, clrGreen);
   
   ObjectCreate(0, "THALAMUS_SYNC", OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, "THALAMUS_SYNC", OBJPROP_XDISTANCE, x + 10);
   ObjectSetInteger(0, "THALAMUS_SYNC", OBJPROP_YDISTANCE, y + 80);
   ObjectSetInteger(0, "THALAMUS_SYNC", OBJPROP_COLOR, clrGray);
   ObjectSetInteger(0, "THALAMUS_SYNC", OBJPROP_FONTSIZE, 8);
}

//+------------------------------------------------------------------+
//| Update Dashboard Values                                          |
//+------------------------------------------------------------------+
void UpdateDashboard()
{
   string syncStr = "DERNIÈRE SYNC : " + (g_last_sync == 0 ? "EN ATTENTE..." : TimeToString(g_last_sync, TIME_DATE|TIME_SECONDS));
   ObjectSetString(0, "THALAMUS_SYNC", OBJPROP_TEXT, syncStr);
}

//+------------------------------------------------------------------+
//| Web Engine: Check for Orders (GET)                               |
//+------------------------------------------------------------------+
void CheckForOrders()
{
   string url = InpApiUrl + "?id=" + InpAccountID + "&get_order=1";
   uchar post[], result[];
   string res_headers;
   string req_headers = "X-Thalamus-Key: " + InpSecretKey + "\r\n";
   
   // Utilisation de la version 9 paramètres de WebRequest pour plus de contrôle
   int res = WebRequest("GET", url, "", "", 500, post, 0, result, res_headers);
   
   if(res == 200)
   {
      g_last_sync = TimeCurrent();
      string jsonStr = CharArrayToString(result);
      
      // Vérification basique si un ordre est présent
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
   else if(res != -1) {
      Print("THALAMUS DEBUG: CheckForOrders failed. Code: ", res, " URL: ", url);
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
      
      if(g_trade.Buy(volume, symbol, price, sl, tp)) {
         ConfirmOrder(cmd_id, g_trade.ResultOrder());
      } else {
         Print("THALAMUS ERROR: Buy failed. Code: ", g_trade.ResultRetcode());
      }
   }
   else if(side == "SELL")
   {
      price = SymbolInfoDouble(symbol, SYMBOL_BID);
      if(sl_pts > 0) sl = NormalizeDouble(price + sl_pts * point, digits);
      if(tp_pts > 0) tp = NormalizeDouble(price - tp_pts * point, digits);
      
      if(g_trade.Sell(volume, symbol, price, sl, tp)) {
         ConfirmOrder(cmd_id, g_trade.ResultOrder());
      } else {
         Print("THALAMUS ERROR: Sell failed. Code: ", g_trade.ResultRetcode());
      }
   }
}

//+------------------------------------------------------------------+
//| Web Engine: Confirm Order (POST)                                 |
//+------------------------------------------------------------------+
void ConfirmOrder(string cmd_id, ulong ticket)
{
   string body = "{\"account_id\":\"" + InpAccountID + "\",\"cmd_id\":\"" + cmd_id + "\",\"ticket_id\":\"" + (string)ticket + "\"}";
   uchar post_data[], result_data[];
   string req_headers = "Content-Type: application/json\r\n" + "X-Thalamus-Key: " + InpSecretKey + "\r\n";
   string res_headers = "";
   
   int data_len = StringToCharArray(body, post_data);
   if(data_len > 0) ArrayResize(post_data, data_len - 1); // Remove null terminator
   
   WebRequest("POST", InpApiUrl, req_headers, 1000, post_data, result_data, res_headers);
}

//+------------------------------------------------------------------+
//| Daily Loss Check                                                 |
//+------------------------------------------------------------------+
void CheckDailyLoss()
{
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   
   if(balance <= 1.0) return; // Éviter calcul sur compte vide ou erreur
   
   double loss_pct = (balance - equity) / balance * 100.0;
   
   // On ne déclenche que si la perte est réelle et supérieure au seuil
   if(loss_pct >= InpMaxDailyLoss && loss_pct < 100.0) {
      int closed_count = 0;
      for(int i = PositionsTotal() - 1; i >= 0; i--) {
         ulong ticket = PositionGetTicket(i);
         if(PositionSelectByTicket(ticket)) {
            // On ferme tout si HardLock est actif, sinon seulement le Magic Thalamus
            if(InpHardLock || PositionGetInteger(POSITION_MAGIC) == InpMagic) {
               if(g_trade.PositionClose(ticket)) closed_count++;
            }
         }
      }
      if(closed_count > 0) {
         Print("THALAMUS: Protection active. Perte: ", DoubleToString(loss_pct, 2), "%. ", closed_count, " positions fermées.");
      }
   }
}

//+------------------------------------------------------------------+
//| Web Engine: Sync Account Data (POST)                             |
//+------------------------------------------------------------------+
void SyncAccountData()
{
   // Récupération des symboles du Market Watch
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
                 "\"key\":\"" + InpSecretKey + "\"," +
                 "\"symbols\":" + symbolsJson + "}";
   
   uchar post_data[], result_data[];
   string req_headers = "Content-Type: application/json\r\n" + "X-Thalamus-Key: " + InpSecretKey + "\r\n";
   string res_headers = "";
   
   int data_len = StringToCharArray(body, post_data);
   if(data_len > 0) ArrayResize(post_data, data_len - 1);
   
   int res = WebRequest("POST", InpApiUrl, req_headers, 1000, post_data, result_data, res_headers);
   if(res != 200) {
      Print("THALAMUS DEBUG: SyncAccountData failed. Code: ", res, " URL: ", InpApiUrl);
   }
}

//+------------------------------------------------------------------+
//| Helper: Extract JSON Value (Robust Version)                      |
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
   while(start < len && (StringSubstr(json, start, 1) == " " || StringSubstr(json, start, 1) == "\t"))
      start++;

   int end = -1;
   if(StringSubstr(json, start, 1) == "\"")
   {
      start++;
      end = StringFind(json, "\"", start);
   }
   else
   {
      int end1 = StringFind(json, ",", start);
      int end2 = StringFind(json, "}", start);
      int end3 = StringFind(json, "]", start);
      
      if(end1 != -1) end = end1;
      if(end2 != -1 && (end == -1 || end2 < end)) end = end2;
      if(end3 != -1 && (end == -1 || end3 < end)) end = end3;
   }
   
   if(end == -1) return "";
   return StringSubstr(json, start, end - start);
}
