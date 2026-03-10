
import React, { useState, useRef, useEffect } from 'react';
import { Brain, X, Send, Loader2, Activity, ShieldAlert } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Redefining interface locally to ensure Vercel build doesn't fail on missing type imports
interface LocalVitals {
  discipline: number;
  impulsivity: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
}

interface Props {
  vitals: LocalVitals;
  lang?: 'FR' | 'EN';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const NeuralChat: React.FC<Props> = ({ vitals, lang = 'FR' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: lang === 'FR' 
        ? "Liaison synaptique établie. Je surveille vos constantes. Comment puis-je optimiser votre session ?" 
        : "Synaptic liaison established. I am monitoring your vitals. How can I optimize your session?" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      // Use direct process.env.API_KEY as per the rules.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemPrompt = `Vous êtes Thalamus OBA, l'IA sentinelle d'un système de neuro-trading. 
      Votre ton est professionnel, futuriste, calme et analytique.
      CONTEXTE COMPORTEMENTAL ACTUEL DU TRADER:
      - Indice de Discipline: ${vitals.discipline}%
      - Niveau d'Impulsivité: ${Math.round(vitals.impulsivity)}/100
      - État de Stress: ${vitals.stressLevel}
      
      Si la Discipline est < 60 ou l'Impulsivité > 70, soyez plus protecteur et suggérez le calme ou une pause de trading.
      Répondez en ${lang === 'FR' ? 'Français' : 'Anglais'}. Soyez concis (max 3 phrases).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const fullResponse = response.text || "";
      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      
    } catch (error) {
      console.error("Neural Link Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: lang === 'FR' ? "Erreur de liaison. Relancez le handshake." : "Liaison error. Reset handshake." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] font-mono">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-110 active:scale-90 group relative"
        >
          <Brain size={28} className="group-hover:animate-pulse" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping" />
        </button>
      )}

      {isOpen && (
        <div className="w-[380px] h-[500px] glass-panel rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 bg-slate-950/90 backdrop-blur-xl">
          <div className="p-6 border-b border-white/5 bg-slate-900/40 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Brain size={18} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Neural Assistant</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7px] text-slate-500 uppercase font-black">Liaison Active</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-cyan-600 text-slate-950 font-bold ml-4' 
                    : 'bg-slate-900/60 border border-white/5 text-slate-300 mr-4 shadow-xl'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl">
                  <Loader2 size={12} className="animate-spin text-cyan-400" />
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-2 bg-slate-950/40 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-cyan-500" />
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Context: Discipline {vitals.discipline.toFixed(0)}%</span>
            </div>
            {vitals.discipline < 60 && (
              <div className="flex items-center gap-1">
                <ShieldAlert size={10} className="text-red-500" />
                <span className="text-[7px] font-black text-red-500 uppercase">Biais Détecté</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900/60 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'FR' ? "Interroger Thalamus..." : "Query Thalamus..."}
              className="flex-1 bg-slate-950 border border-white/5 p-3 rounded-xl text-[10px] text-white outline-none focus:border-cyan-500/30 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="p-3 bg-cyan-600 text-slate-950 rounded-xl hover:bg-cyan-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default NeuralChat;
