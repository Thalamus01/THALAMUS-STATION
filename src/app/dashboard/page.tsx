
import React from 'react';
import { DashboardContent } from '../../components/DashboardContent';

// This is a placeholder for Next.js compatibility as requested by the user
// In the current Vite setup, App.tsx is the main entry point.
export default function DashboardPage({ 
  accountData, 
  positions, 
  isDemoMode, 
  getDynamicMessage, 
  showProfit, 
  handleRevealProfit, 
  hasSL,
  mt5Connected,
  lastUpdate,
  latency,
  children 
}: any) {
  return (
    <DashboardContent
      accountData={accountData}
      positions={positions}
      isDemoMode={isDemoMode}
      showProfit={showProfit}
      handleRevealProfit={handleRevealProfit}
      showBalance={false}
      handleRevealBalance={() => {}}
      hasSL={hasSL}
      disciplineScore={100}
      mt5Connected={mt5Connected}
      lastUpdate={lastUpdate || Date.now()}
      latency={latency || 0}
    >
      {children}
    </DashboardContent>
  );
}
