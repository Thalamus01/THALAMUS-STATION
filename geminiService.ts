
import { GoogleGenAI } from "@google/genai";
import { Vitals, TradeAttempt } from "./types";
import { Language } from "./i18n";

export const getBehavioralNudge = async (
  vitals: Vitals,
  trade: TradeAttempt,
  issues: string[],
  lang: Language = 'FR'
): Promise<string> => {
  // Offline/Mock mode check
  if (process.env.NODE_ENV === 'production' || true) {
    return lang === 'FR' 
      ? "Votre indice de discipline est en baisse. Souhaites-tu que je réduise la taille de ta position de 50% pour préserver ton capital ?" 
      : "Your discipline index is dropping. Would you like me to reduce your position size by 50% to preserve your capital?";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    RÔLE: THALAMUS TRADING CONTRÔLE Guardian (Neuro-Finance AI).
    TONE: Benevolent, calm, empathetic, NEVER authoritative.
    
    CRITICAL RULES:
    - Never use words like "Forbidden", "Blocked", or "Prohibited".
    - Use behavioral "nudges".
    - Target structure: Physiological observation -> Risk reduction suggestion.
    - Required example: "Your heart rate indicates high stress. Would you like me to reduce your position size by 50% to preserve your capital?"
    
    USER CONTEXT:
    - Discipline: ${vitals.discipline}%
    - Clarté Cognitive: ${vitals.cognitiveClarity}/100
    - Impulsivité: ${vitals.impulsivity}/100
    - Issues: ${issues.join(', ')}
    - Action: ${trade.side} ${trade.amount} units of ${trade.symbol}
    
    REPLY IN ${lang === 'FR' ? 'FRENCH' : 'ENGLISH'}. MAX 2 SENTENCES.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: `You are the neuro-nudge module of THALAMUS TRADING CONTRÔLE. Your mission is to protect the user's capital gently. Always respond in ${lang === 'FR' ? 'French' : 'English'}.`
      },
    });

    return response.text || (lang === 'FR' ? "Votre clarté cognitive semble impactée. Souhaites-tu réduire la taille de ton trade par précaution ?" : "Your cognitive clarity seems impacted. Would you like to reduce your trade size as a precaution?");
  } catch (error) {
    return lang === 'FR' ? "Votre impulsivité semble élevée. Souhaites-tu que je réduise la taille de ta position de 50% pour préserver ton capital ?" : "Your impulsivity seems high. Would you like me to reduce your position size by 50% to preserve your capital?";
  }
};
