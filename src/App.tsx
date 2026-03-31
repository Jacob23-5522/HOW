import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Stethoscope, 
  Pill, 
  Calendar, 
  User, 
  MapPin, 
  Search, 
  Bell, 
  ChevronRight, 
  Clock, 
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Menu,
  AlertCircle,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Screen = 'onboarding' | 'home' | 'services' | 'pharmacy' | 'schedule' | 'profile' | 'delivery' | 'payment' | 'assistant';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// --- AI Configuration ---
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'AIzaSyCCFxXUW1lduA2ieSvKbiL9hNETUg-303M' });
const model = "gemini-3-flash-preview";
const systemInstruction = `You are the Health on Wheels Online Assistant, a medical and platform AI for "Health on Wheels" in Uganda. 

ABOUT HEALTH ON WHEELS:
Health on Wheels is a Ugandan digital healthcare platform that connects patients to licensed doctors and delivers genuine medicines directly to their doorstep.
It addresses critical healthcare challenges in Uganda:
- Long queues at hospitals and health centers
- Limited access to quality healthcare in rural and peri-urban areas
- Counterfeit and substandard medicines in informal markets
- Lack of convenient, reliable medicine home delivery services

BRAND VOICE: Trustworthy, Caring, Reliable, Modern.

YOUR GOALS:
1. Provide medical consultations and answer health-related questions.
2. Answer questions about the Health on Wheels platform, its services, and its mission.

STRICT RULES:
1. Respond to medical queries AND questions about the Health on Wheels platform. If a user asks about unrelated topics, politely decline and redirect them to health or platform services.
2. Provide clear, empathetic, and professional advice.
3. ALWAYS include a disclaimer for medical advice: "I am an AI assistant. For serious conditions, please consult a licensed doctor immediately via our 'Book Doctor' service."
4. Use Ugandan context where relevant (e.g., mentioning common local health issues like malaria).
5. Keep responses concise and easy to understand.`;

// --- Mock Data ---
const SERVICES = [
  { id: 'malaria', title: 'Malaria Testing', icon: <ShieldCheck className="w-6 h-6" />, price: 'UGX 15,000', color: 'bg-red-100 text-red-600' },
  { id: 'consult', title: 'Doctor Consult', icon: <Stethoscope className="w-6 h-6" />, price: 'UGX 30,000', color: 'bg-blue-100 text-blue-600' },
  { id: 'arv', title: 'ARV Access', icon: <ShieldCheck className="w-6 h-6" />, price: 'UGX 0', color: 'bg-green-100 text-green-600' },
  { id: 'vaccine', title: 'Vaccination', icon: <Pill className="w-6 h-6" />, price: 'UGX 25,000', color: 'bg-purple-100 text-purple-600' },
];

const PHARMACIES = [
  { id: 'ddembe', name: 'Ddembe Delivers', location: 'Kisementi, Kampala', rating: 4.8, deliveryTime: '20-30 mins' },
  { id: 'first-pharm', name: 'First Pharmacy', location: 'Wandegeya', rating: 4.5, deliveryTime: '30-45 mins' },
];

// --- Components ---

const ResponsiveShell = ({ children, currentScreen, setScreen }: { children: React.ReactNode, currentScreen: Screen, setScreen: (s: Screen) => void }) => {
  const showNav = !['onboarding', 'payment'].includes(currentScreen);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSOS = () => {
    if (confirm("Are you sure you want to call Emergency Services (999)?")) {
      window.location.href = 'tel:999';
    }
  };

  const navItems = [
    { id: 'home', icon: <Home />, label: 'Home' },
    { id: 'services', icon: <Stethoscope />, label: 'Services' },
    { id: 'assistant', icon: <MessageSquare />, label: 'Assistant' },
    { id: 'pharmacy', icon: <Pill />, label: 'Pharmacy' },
    { id: 'profile', icon: <User />, label: 'Profile' },
  ];

  if (isMobile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200 p-0 sm:p-4 font-['Lato']">
        <div className="relative w-full max-w-[400px] h-screen sm:h-[800px] bg-soft-white sm:rounded-[3rem] shadow-2xl overflow-hidden sm:border-[8px] border-dark-gray">
          {/* Notch */}
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-dark-gray rounded-b-2xl z-50"></div>
          
          {/* Content */}
          <div className="h-full overflow-y-auto pb-24 pt-8 px-6">
            {children}
          </div>

          {/* SOS Button */}
          {showNav && (
            <button 
              onClick={handleSOS}
              className="absolute bottom-24 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
            >
              <AlertCircle className="w-8 h-8" />
              <span className="absolute -top-8 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-bounce">SOS</span>
            </button>
          )}

          {/* WhatsApp Button */}
          {showNav && (
            <a 
              href="https://wa.me/256754558016" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-40 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          )}

          {/* Navigation Bar */}
          {showNav && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-between items-center z-40">
              {navItems.map(item => (
                <NavButton key={item.id} icon={item.icon} active={currentScreen === item.id} onClick={() => setScreen(item.id as Screen)} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Top Navigation */}
      {showNav && (
        <nav className="sticky top-0 bg-white border-b border-gray-200 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setScreen('home')}>
            <div className="w-10 h-10 bg-health-green rounded-xl flex items-center justify-center text-white font-bold">H</div>
            <h1 className="text-xl font-bold text-health-green font-['Montserrat']">Health on Wheels</h1>
          </div>
          <div className="flex items-center gap-8">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setScreen(item.id as Screen)}
                className={`flex items-center gap-2 font-bold transition-colors ${currentScreen === item.id ? 'text-health-green' : 'text-gray-500 hover:text-health-green'}`}
              >
                {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5' })}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Bell className="w-5 h-5 text-gray-600" /></button>
            <button 
              onClick={handleSOS}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition-colors"
            >
              SOS Emergency
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto p-8 ${!showNav ? 'h-screen flex items-center justify-center' : ''}`}>
        {children}
      </main>

      {/* Floating WhatsApp for Desktop */}
      {showNav && (
        <a 
          href="https://wa.me/256754558016" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-xl transition-all ${active ? 'bg-health-green text-white shadow-lg' : 'text-gray-400 hover:text-health-green'}`}
  >
    {icon}
  </button>
);

const Header = ({ title, showBack, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-dark-gray" />
        </button>
      )}
      <h1 className="text-xl font-bold text-health-green font-['Montserrat']">{title}</h1>
    </div>
    <div className="flex gap-2">
      <button className="p-2 bg-white rounded-full shadow-sm"><Bell className="w-5 h-5 text-gray-500" /></button>
      <button className="p-2 bg-white rounded-full shadow-sm"><Menu className="w-5 h-5 text-gray-500" /></button>
    </div>
  </div>
);

// --- Screens ---

const Onboarding = ({ onFinish }: { onFinish: () => void }) => (
  <div className="h-full flex flex-col items-center justify-center text-center">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mb-8"
    >
      <div className="w-32 h-32 bg-health-green rounded-3xl flex items-center justify-center shadow-xl mb-6 mx-auto">
        <span className="text-white text-5xl font-bold">H</span>
      </div>
      <h1 className="text-3xl font-bold text-health-green mb-2 font-['Montserrat']">Health on Wheels</h1>
      <p className="text-gray-500 italic">"Healthcare Delivered to Your Door."</p>
    </motion.div>
    
    <div className="w-full space-y-4 mt-12">
      <button 
        onClick={onFinish}
        className="w-full py-4 bg-bright-green text-white font-bold rounded-2xl shadow-lg hover:bg-health-green transition-colors"
      >
        Get Started
      </button>
      <button className="w-full py-4 bg-white text-health-green font-bold rounded-2xl border-2 border-health-green">
        Login
      </button>
    </div>
  </div>
);

const HomeScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div>
    <Header title="Health on Wheels" />
    
    {/* Search Bar */}
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input 
        type="text" 
        placeholder="Search doctors, medicines..." 
        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-health-green"
      />
    </div>

    {/* Map Placeholder */}
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Around You</h2>
        <button className="text-health-green text-sm font-bold">View Map</button>
      </div>
      <div className="relative h-48 bg-gray-200 rounded-3xl overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 20 L100 20 M0 50 L100 50 M0 80 L100 80 M20 0 L20 100 M50 0 L50 100 M80 0 L80 100" stroke="black" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <MapPin className="w-8 h-8 text-bright-green fill-bright-green/20" />
        </motion.div>
        <div className="absolute top-10 left-20"><MapPin className="w-5 h-5 text-health-green" /></div>
        <div className="absolute bottom-12 right-16"><Truck className="w-5 h-5 text-blue-500" /></div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-2 gap-4 mb-8">
      <button 
        onClick={() => setScreen('services')}
        className="p-6 bg-health-green text-white rounded-3xl flex flex-col items-center gap-3 shadow-lg"
      >
        <Stethoscope className="w-8 h-8" />
        <span className="font-bold text-sm">Book Doctor</span>
      </button>
      <button 
        onClick={() => setScreen('pharmacy')}
        className="p-6 bg-bright-green text-white rounded-3xl flex flex-col items-center gap-3 shadow-lg"
      >
        <Pill className="w-8 h-8" />
        <span className="font-bold text-sm">Order Meds</span>
      </button>
    </div>

    {/* Recent Activity */}
    <div className="mb-4">
      <h2 className="font-bold text-lg mb-4">Recent Activity</h2>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-soft-white rounded-xl flex items-center justify-center text-health-green">
          <Truck className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Medicine Delivery</p>
          <p className="text-xs text-gray-400">Arriving in 15 mins</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>
    </div>
  </div>
);

const AssistantScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'AIzaSyCCFxXUW1lduA2ieSvKbiL9hNETUg-303M' });
      const chat = ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: input }] }],
        config: { systemInstruction }
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
      <Header title="Health on Wheels Online Assistant" showBack onBack={() => setScreen('home')} />
      
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

const ServicesScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div>
    <Header title="Health Services" showBack onBack={() => setScreen('home')} />
    
    <div className="space-y-4">
      {SERVICES.map((service) => (
        <div key={service.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.color}`}>
            {service.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-dark-gray">{service.title}</h3>
            <p className="text-sm text-health-green font-bold">{service.price}</p>
          </div>
          <button className="bg-bright-green text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
            Book
          </button>
        </div>
      ))}
    </div>

    <div className="mt-8 p-6 bg-health-green rounded-3xl text-white relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2">Need Urgent Care?</h3>
        <p className="text-sm opacity-90 mb-4">Our mobile clinic can be at your doorstep in under 60 minutes.</p>
        <button className="bg-white text-health-green px-6 py-2 rounded-xl font-bold">Call Now</button>
      </div>
      <Stethoscope className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
    </div>
  </div>
);

const PharmacyScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div>
    <Header title="Pharmacy" showBack onBack={() => setScreen('home')} />
    
    <div className="bg-bright-green/10 p-4 rounded-2xl border border-bright-green/20 mb-6 flex items-center gap-3">
      <ShieldCheck className="w-6 h-6 text-bright-green" />
      <p className="text-xs font-medium text-health-green">All medicines are verified and genuine from licensed pharmacies.</p>
    </div>

    <h2 className="font-bold text-lg mb-4">Partner Pharmacies</h2>
    <div className="space-y-4">
      {PHARMACIES.map((pharm) => (
        <div 
          key={pharm.id} 
          onClick={() => setScreen('delivery')}
          className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:border-health-green transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-dark-gray">{pharm.name}</h3>
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
              ⭐ {pharm.rating}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
            <MapPin className="w-3 h-3" />
            <span>{pharm.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-health-green text-xs font-bold">
              <Clock className="w-4 h-4" />
              <span>{pharm.deliveryTime}</span>
            </div>
            <button className="text-bright-green text-sm font-bold">Order Now</button>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8">
      <h2 className="font-bold text-lg mb-4">Upload Prescription</h2>
      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-white">
        <div className="w-12 h-12 bg-soft-white rounded-full flex items-center justify-center text-health-green">
          <ChevronRight className="w-6 h-6 rotate-90" />
        </div>
        <p className="text-sm font-medium text-gray-500">Tap to upload your prescription</p>
        <p className="text-[10px] text-gray-300 uppercase tracking-widest">PDF, JPG or PNG</p>
      </div>
    </div>
  </div>
);

const DeliveryScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div>
    <Header title="Track Delivery" showBack onBack={() => setScreen('pharmacy')} />
    
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-soft-white rounded-2xl flex items-center justify-center">
          <Truck className="w-8 h-8 text-health-green" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Order #HW-9283</p>
          <h3 className="font-bold text-lg">On the way</h3>
        </div>
      </div>
      
      <div className="space-y-6 relative">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-6 h-6 rounded-full bg-health-green flex items-center justify-center border-4 border-white shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-bold">Order Picked Up</p>
            <p className="text-xs text-gray-400">Ddembe Delivers Pharmacy • 12:45 PM</p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-6 h-6 rounded-full bg-bright-green flex items-center justify-center border-4 border-white shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-bold">Rider is nearby</p>
            <p className="text-xs text-gray-400">Estimated arrival: 5 mins</p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10 opacity-30">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-sm">
          </div>
          <div>
            <p className="text-sm font-bold">Delivered</p>
            <p className="text-xs text-gray-400">Waiting for arrival</p>
          </div>
        </div>
      </div>
    </div>

    <button 
      onClick={() => setScreen('payment')}
      className="w-full py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg"
    >
      Complete Payment
    </button>
  </div>
);

const PaymentScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="h-full flex flex-col">
    <Header title="Payment" showBack onBack={() => setScreen('delivery')} />
    
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
      <p className="text-center text-gray-400 text-sm mb-2">Amount to Pay</p>
      <h2 className="text-center text-3xl font-bold text-health-green mb-6">UGX 45,000</h2>
      
      <div className="space-y-4">
        <button className="w-full p-4 rounded-2xl border-2 border-health-green bg-soft-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-white">M</div>
            <span className="font-bold">MTN MoMo</span>
          </div>
          <div className="w-5 h-5 rounded-full border-4 border-health-green"></div>
        </button>
        
        <button className="w-full p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white">A</div>
            <span className="font-bold">Airtel Money</span>
          </div>
          <div className="w-5 h-5 rounded-full border border-gray-200"></div>
        </button>

        <button className="w-full p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-gray-400" />
            <span className="font-bold">Credit Card</span>
          </div>
          <div className="w-5 h-5 rounded-full border border-gray-200"></div>
        </button>
      </div>
    </div>

    <div className="mt-auto pb-4">
      <button 
        onClick={() => {
          alert("Payment Successful!");
          setScreen('home');
        }}
        className="w-full py-4 bg-bright-green text-white font-bold rounded-2xl shadow-lg"
      >
        Pay Securely
      </button>
    </div>
  </div>
);

const ProfileScreen = () => (
  <div>
    <Header title="My Profile" />
    
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 bg-health-green rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
        JK
      </div>
      <h2 className="text-xl font-bold">Jacob Karugaba</h2>
      <p className="text-gray-400 text-sm">Kampala, Uganda</p>
    </div>

    <div className="space-y-2">
      <ProfileItem icon={<Clock />} title="Medical History" />
      <ProfileItem icon={<CreditCard />} title="Payment Methods" />
      <ProfileItem icon={<MapPin />} title="Saved Addresses" />
      <ProfileItem icon={<ShieldCheck />} title="Insurance" />
      <ProfileItem icon={<Bell />} title="Notifications" />
      <div className="pt-4">
        <ProfileItem icon={<ArrowLeft className="rotate-180" />} title="Logout" color="text-red-500" />
      </div>
    </div>
  </div>
);

const ProfileItem = ({ icon, title, color = "text-dark-gray" }: { icon: React.ReactNode, title: string, color?: string }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4">
      <div className={`p-2 bg-soft-white rounded-lg ${color}`}>{icon}</div>
      <span className={`font-bold text-sm ${color}`}>{title}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-300" />
  </div>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');

  return (
    <ResponsiveShell currentScreen={screen} setScreen={setScreen}>
      <AnimatePresence mode="wait">
        {screen === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Onboarding onFinish={() => setScreen('home')} />
          </motion.div>
        )}
        {screen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'services' && (
          <motion.div key="services" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
            <ServicesScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'assistant' && (
          <motion.div key="assistant" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            <AssistantScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'pharmacy' && (
          <motion.div key="pharmacy" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
            <PharmacyScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'delivery' && (
          <motion.div key="delivery" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            <DeliveryScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PaymentScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileScreen />
          </motion.div>
        )}
        {screen === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Header title="My Schedule" />
            <div className="flex flex-col items-center justify-center h-96 text-center text-gray-400">
              <Calendar className="w-16 h-16 mb-4 opacity-20" />
              <p>No upcoming appointments</p>
              <button 
                onClick={() => setScreen('services')}
                className="mt-4 text-health-green font-bold"
              >
                Book a Service
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ResponsiveShell>
  );
}
