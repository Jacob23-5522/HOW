import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';
import { AI_MODEL, SYSTEM_INSTRUCTION, GEMINI_API_KEY } from '../constants';

const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm the Health on Wheels Online Assistant. How can I help you with your health or our services today?", sender: 'ai', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const chat = ai.models.generateContent({
        model: AI_MODEL,
        contents: [{ role: 'user', parts: [{ text: input }] }],
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });

      const response = await chat;
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm sorry, I couldn't process that. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please check your connection or try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Header title="Health on Wheels Online Assistant" showBack onBack={() => navigate('/home')} />
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-health-green text-white rounded-tr-none' 
                : 'bg-white text-dark-gray shadow-sm border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
              <p className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none">
              <Loader2 className="w-5 h-5 animate-spin text-health-green" />
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a medical question..." 
          className="w-full pl-4 pr-12 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-health-green"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-health-green text-white rounded-xl disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AssistantPage;
