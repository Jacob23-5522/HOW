import React, { useState, useEffect, useRef, useCallback } from 'react';
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

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- Types ---
type Screen = 'onboarding' | 'landing' | 'login' | 'signup' | 'home' | 'services' | 'pharmacy' | 'schedule' | 'profile' | 'delivery' | 'payment' | 'assistant' | 'notifications';

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
  const showNav = !['onboarding', 'landing', 'login', 'signup', 'payment'].includes(currentScreen);
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

const LandingPage = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="min-h-full flex flex-col bg-white">
    {/* Hero Section */}
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-b from-health-green/5 to-white">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-health-green rounded-3xl flex items-center justify-center shadow-xl mb-6 mx-auto">
          <span className="text-white text-3xl font-bold">H</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-health-green mb-6 font-['Montserrat'] leading-tight">
          Healthcare Delivered <br className="hidden sm:block" /> to Your Doorstep
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-10">
          Connecting you with licensed doctors and genuine medicines across Uganda. Fast, reliable, and professional care whenever you need it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
          <button 
            onClick={() => setScreen('signup')}
            className="flex-1 py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg hover:bg-bright-green transition-all transform hover:-translate-y-1"
          >
            Get Started Free
          </button>
          <button 
            onClick={() => setScreen('login')}
            className="flex-1 py-4 bg-white text-health-green font-bold rounded-2xl border-2 border-health-green hover:bg-gray-50 transition-all"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>

    {/* How It Works Section */}
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-health-green font-['Montserrat']">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Consult', desc: 'Chat with our AI assistant or book a licensed doctor for a video call.', icon: <MessageSquare className="w-6 h-6" /> },
            { step: '02', title: 'Order', desc: 'Upload your prescription or select medicines from verified pharmacies.', icon: <Pill className="w-6 h-6" /> },
            { step: '03', title: 'Receive', desc: 'Get your genuine medicines delivered to your doorstep in under 60 minutes.', icon: <Truck className="w-6 h-6" /> },
          ].map((item, i) => (
            <div key={i} className="relative p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-health-green text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {item.step}
              </div>
              <div className="w-12 h-12 bg-green-50 text-health-green rounded-2xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Features Grid */}
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-health-green transition-colors">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Expert Doctors</h3>
            <p className="text-sm text-gray-500">Consult with licensed professionals from your home.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-health-green transition-colors">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-500">Genuine medicines delivered in under 60 minutes.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-health-green transition-colors">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Verified Quality</h3>
            <p className="text-sm text-gray-500">100% genuine products from licensed pharmacies.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Testimonials */}
    <div className="py-16 px-6 bg-health-green text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-12 font-['Montserrat']">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-8 bg-white/10 rounded-3xl backdrop-blur-sm text-left">
            <p className="italic mb-6 text-lg">"Health on Wheels saved me when my child fell ill late at night. The doctor was professional and the meds arrived so fast!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div>
                <p className="font-bold">Sarah Namukasa</p>
                <p className="text-xs opacity-70">Kampala Resident</p>
              </div>
            </div>
          </div>
          <div className="p-8 bg-white/10 rounded-3xl backdrop-blur-sm text-left">
            <p className="italic mb-6 text-lg">"I no longer worry about counterfeit medicines. Knowing everything is verified gives me such peace of mind."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div>
                <p className="font-bold">John Okello</p>
                <p className="text-xs opacity-70">Entebbe Resident</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* FAQ Section */}
    <div className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-health-green font-['Montserrat']">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is Health on Wheels available nationwide?', a: 'We currently operate in Kampala and major surrounding towns, with plans to expand nationwide soon.' },
            { q: 'Are the doctors licensed?', a: 'Yes, all doctors on our platform are fully licensed by the Uganda Medical and Dental Practitioners Council.' },
            { q: 'How do I pay for services?', a: 'We accept Mobile Money (MTN & Airtel), Credit/Debit cards, and Cash on Delivery.' },
          ].map((faq, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Final CTA */}
    <div className="py-16 px-6 text-center">
      <h2 className="text-3xl font-bold text-health-green mb-6 font-['Montserrat']">Ready to experience better healthcare?</h2>
      <button 
        onClick={() => setScreen('signup')}
        className="px-12 py-4 bg-health-green text-white font-bold rounded-2xl shadow-xl hover:bg-bright-green transition-all"
      >
        Join Health on Wheels Today
      </button>
    </div>

    {/* Footer Info */}
    <div className="py-8 border-t border-gray-100 text-center bg-gray-50">
      <div className="flex justify-center gap-6 mb-4">
        <button className="text-xs text-gray-500 hover:text-health-green">Terms</button>
        <button className="text-xs text-gray-500 hover:text-health-green">Privacy</button>
        <button className="text-xs text-gray-500 hover:text-health-green">Contact</button>
      </div>
      <p className="text-gray-400 text-xs">© 2026 Health on Wheels Uganda. All rights reserved.</p>
    </div>
  </div>
);

const LoginPage = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      setScreen('home');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto px-4">
      <div className="mb-10 text-center">
        <button onClick={() => setScreen('landing')} className="mb-6 p-2 hover:bg-gray-100 rounded-full inline-block transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </button>
        <div className="w-16 h-16 bg-health-green rounded-2xl flex items-center justify-center shadow-lg mb-6 mx-auto">
          <span className="text-white text-2xl font-bold">H</span>
        </div>
        <h2 className="text-3xl font-bold text-health-green mb-2 font-['Montserrat']">Welcome Back</h2>
        <p className="text-gray-500">Login to access your health dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-health-green"
            >
              <span className="text-xs font-bold uppercase">{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-health-green focus:ring-health-green cursor-pointer" />
            <span className="text-gray-600 group-hover:text-health-green transition-colors">Remember me</span>
          </label>
          <button type="button" className="text-health-green font-bold hover:underline">Forgot Password?</button>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg hover:bg-bright-green transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-soft-white px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.548 0-1.411.516-1.411 1.304 0 .914 1.357 1.346 1.357 2.136 0 .623-.391.925-.934.925-.29 0-.57-.106-.908-.317L9.444 12c.411.429 1.143.733 1.975.733 1.447 0 2.408-.935 2.408-2.222 0-1.167-.812-1.545-1.666-2.043-.537-.312-.733-.587-.733-.893 0-.399.317-.61.772-.61.341 0 .58.12.897.346l.714-1.088c-.444-.313-1.033-.53-1.659-.53zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z" fill="currentColor"/>
            </svg>
            Apple
          </button>
        </div>
      </form>

      <div className="mt-auto py-8 text-center">
        <p className="text-gray-500">
          Don't have an account? {' '}
          <button onClick={() => setScreen('signup')} className="text-health-green font-bold hover:underline">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

const SignupPage = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup delay
    setTimeout(() => {
      setIsLoading(false);
      setScreen('home');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto px-4">
      <div className="mb-10 text-center">
        <button onClick={() => setScreen('landing')} className="mb-6 p-2 hover:bg-gray-100 rounded-full inline-block transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </button>
        <div className="w-16 h-16 bg-health-green rounded-2xl flex items-center justify-center shadow-lg mb-6 mx-auto">
          <span className="text-white text-2xl font-bold">H</span>
        </div>
        <h2 className="text-3xl font-bold text-health-green mb-2 font-['Montserrat']">Create Account</h2>
        <p className="text-gray-500">Join Health on Wheels today</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-health-green"
            >
              <span className="text-xs font-bold uppercase">{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 px-1 leading-relaxed">
          By signing up, you agree to our <span className="text-health-green font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-health-green font-bold cursor-pointer hover:underline">Privacy Policy</span>.
        </p>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg hover:bg-bright-green transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-soft-white px-2 text-gray-400">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.548 0-1.411.516-1.411 1.304 0 .914 1.357 1.346 1.357 2.136 0 .623-.391.925-.934.925-.29 0-.57-.106-.908-.317L9.444 12c.411.429 1.143.733 1.975.733 1.447 0 2.408-.935 2.408-2.222 0-1.167-.812-1.545-1.666-2.043-.537-.312-.733-.587-.733-.893 0-.399.317-.61.772-.61.341 0 .58.12.897.346l.714-1.088c-.444-.313-1.033-.53-1.659-.53zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z" fill="currentColor"/>
            </svg>
            Apple
          </button>
        </div>
      </form>

      <div className="mt-auto py-8 text-center">
        <p className="text-gray-500">
          Already have an account? {' '}
          <button onClick={() => setScreen('login')} className="text-health-green font-bold hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
};

const Onboarding = ({ onFinish, setScreen }: { onFinish: () => void, setScreen: (s: Screen) => void }) => (
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
      <button 
        onClick={() => setScreen('login')}
        className="w-full py-4 bg-white text-health-green font-bold rounded-2xl border-2 border-health-green"
      >
        Login
      </button>
    </div>
  </div>
);

const LocationMarker = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  const handleLocate = useCallback(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14);
    });
  }, [map]);

  useEffect(() => {
    handleLocate();
  }, [handleLocate]);

  return (
    <>
      {position && (
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLocate();
          }}
          className="p-3 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
          title="Locate Me"
        >
          <MapPin className="w-6 h-6 text-health-green group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </>
  );
};

const HomeScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const ugandaCenter: [number, number] = [1.3733, 32.2903]; // Center of Uganda

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Good Morning,</p>
          <h1 className="text-2xl font-bold text-health-green font-['Montserrat']">Jacob Karugaba</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setScreen('notifications')}
            className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 relative group hover:border-health-green transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500 group-hover:text-health-green" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-health-green transition-colors">
            <Menu className="w-5 h-5 text-gray-500 group-hover:text-health-green" />
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search doctors, medicines..." 
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => setScreen('services')}
          className="p-6 bg-health-green text-white rounded-3xl flex flex-col items-center gap-3 shadow-lg hover:bg-bright-green transition-all transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Stethoscope className="w-7 h-7" />
          </div>
          <span className="font-bold text-sm">Book Doctor</span>
        </button>
        <button 
          onClick={() => setScreen('pharmacy')}
          className="p-6 bg-bright-green text-white rounded-3xl flex flex-col items-center gap-3 shadow-lg hover:bg-health-green transition-all transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Pill className="w-7 h-7" />
          </div>
          <span className="font-bold text-sm">Order Meds</span>
        </button>
      </div>

      {/* Map Integration */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-dark-gray">Health Services Near You</h2>
          <button className="text-health-green text-sm font-bold hover:underline">View Map</button>
        </div>
        <div className="h-80 bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-200 z-0 relative">
          <MapContainer center={ugandaCenter} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            {/* Mock markers for services across Uganda */}
            <Marker position={[0.3476, 32.5825]}>
              <Popup>Mulago Hospital - Kampala</Popup>
            </Marker>
            <Marker position={[0.3136, 32.5811]}>
              <Popup>City Pharmacy - Kampala</Popup>
            </Marker>
            <Marker position={[0.0512, 32.4637]}>
              <Popup>Entebbe General Hospital</Popup>
            </Marker>
            <Marker position={[2.2489, 32.9022]}>
              <Popup>Lira Regional Referral Hospital</Popup>
            </Marker>
            <Marker position={[3.0253, 30.9111]}>
              <Popup>Arua Regional Referral Hospital</Popup>
            </Marker>
            <Marker position={[-0.6072, 30.6545]}>
              <Popup>Mbarara Regional Referral Hospital</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-dark-gray">Recent Activity</h2>
          <button onClick={() => setScreen('schedule')} className="text-health-green text-sm font-bold hover:underline">See All</button>
        </div>
        <div 
          onClick={() => setScreen('delivery')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-health-green transition-colors group"
        >
          <div className="w-14 h-14 bg-soft-white rounded-2xl flex items-center justify-center text-health-green group-hover:bg-health-green group-hover:text-white transition-colors">
            <Truck className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-dark-gray">Medicine Delivery</p>
            <p className="text-xs text-gray-400">Order #HW-9283 • Arriving in 15 mins</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-health-green transition-colors" />
        </div>
      </div>
    </div>
  );
};

const NotificationsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="max-w-md mx-auto">
    <Header title="Notifications" showBack onBack={() => setScreen('home')} />
    
    <div className="space-y-4">
      {[
        { id: 1, title: 'Delivery Update', desc: 'Your medicine order has been picked up by the rider.', time: '2 mins ago', icon: <Truck className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', unread: true },
        { id: 2, title: 'Appointment Reminder', desc: 'You have a consultation with Dr. Sarah Kato tomorrow at 10:30 AM.', time: '1 hour ago', icon: <Calendar className="w-5 h-5" />, color: 'bg-green-100 text-green-600', unread: true },
        { id: 3, title: 'Health Tip', desc: 'Stay hydrated! Drinking enough water is crucial for your health in this heat.', time: '5 hours ago', icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600', unread: false },
        { id: 4, title: 'Payment Success', desc: 'Your payment of UGX 15,000 for Malaria Testing was successful.', time: 'Yesterday', icon: <CreditCard className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600', unread: false },
      ].map(notif => (
        <div key={notif.id} className={`p-5 rounded-3xl border transition-all flex gap-4 ${notif.unread ? 'bg-white border-health-green/20 shadow-md' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.color}`}>
            {notif.icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-sm text-dark-gray">{notif.title}</h3>
              <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
          </div>
          {notif.unread && <div className="w-2 h-2 bg-health-green rounded-full mt-2"></div>}
        </div>
      ))}
    </div>

    <button className="w-full py-4 text-sm font-bold text-gray-400 mt-8 hover:text-health-green transition-colors">
      Mark all as read
    </button>
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

const PaymentScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [method, setMethod] = useState<'momo' | 'airtel' | 'card'>('momo');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setScreen('home');
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto">
      <Header title="Secure Checkout" showBack onBack={() => setScreen('delivery')} />
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-50">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Total Amount</p>
            <h2 className="text-3xl font-bold text-health-green">UGX 45,000</h2>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-health-green">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
        
        <p className="font-bold text-sm mb-4">Select Payment Method</p>
        <div className="space-y-3">
          <button 
            onClick={() => setMethod('momo')}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${method === 'momo' ? 'border-health-green bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">M</div>
              <span className="font-bold text-sm">MTN MoMo</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'momo' ? 'border-health-green' : 'border-gray-200'}`}>
              {method === 'momo' && <div className="w-2.5 h-2.5 bg-health-green rounded-full"></div>}
            </div>
          </button>
          
          <button 
            onClick={() => setMethod('airtel')}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${method === 'airtel' ? 'border-health-green bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">A</div>
              <span className="font-bold text-sm">Airtel Money</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'airtel' ? 'border-health-green' : 'border-gray-200'}`}>
              {method === 'airtel' && <div className="w-2.5 h-2.5 bg-health-green rounded-full"></div>}
            </div>
          </button>

          <button 
            onClick={() => setMethod('card')}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${method === 'card' ? 'border-health-green bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 shadow-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm">Credit Card</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'card' ? 'border-health-green' : 'border-gray-200'}`}>
              {method === 'card' && <div className="w-2.5 h-2.5 bg-health-green rounded-full"></div>}
            </div>
          </button>
        </div>
      </div>

      <div className="mt-auto pb-6">
        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg hover:bg-bright-green transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay UGX 45,000`}
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> 256-bit Secure Encryption
        </p>
      </div>
    </div>
  );
};

const ProfileScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="max-w-md mx-auto">
    <Header title="My Profile" />
    
    <div className="flex flex-col items-center mb-10">
      <div className="relative">
        <div className="w-28 h-28 bg-health-green rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-xl border-4 border-white">
          JK
        </div>
        <button className="absolute bottom-4 right-0 w-8 h-8 bg-bright-green text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
          <ChevronRight className="w-4 h-4 rotate-90" />
        </button>
      </div>
      <h2 className="text-2xl font-bold text-dark-gray">Jacob Karugaba</h2>
      <p className="text-gray-400 text-sm flex items-center gap-1">
        <MapPin className="w-3 h-3" /> Kampala, Uganda
      </p>
    </div>

    <div className="space-y-3">
      <ProfileItem icon={<Clock className="w-5 h-5" />} title="Medical History" />
      <ProfileItem icon={<CreditCard className="w-5 h-5" />} title="Payment Methods" />
      <ProfileItem icon={<MapPin className="w-5 h-5" />} title="Saved Addresses" />
      <ProfileItem icon={<ShieldCheck className="w-5 h-5" />} title="Insurance Details" />
      <ProfileItem icon={<Bell className="w-5 h-5" />} title="Notification Settings" />
      <div className="pt-6">
        <ProfileItem 
          icon={<ArrowLeft className="w-5 h-5 rotate-180" />} 
          title="Logout" 
          color="text-red-500" 
          onClick={() => setScreen('landing')}
        />
      </div>
    </div>

    <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
      <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">App Version</p>
      <p className="text-sm font-bold text-gray-500">v2.4.0 (Stable)</p>
    </div>
  </div>
);

const ProfileItem = ({ icon, title, color = "text-dark-gray", onClick }: { icon: React.ReactNode, title: string, color?: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-health-green transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 bg-soft-white rounded-xl transition-colors group-hover:bg-health-green/10 ${color}`}>{icon}</div>
      <span className={`font-bold text-sm ${color}`}>{title}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-health-green transition-colors" />
  </button>
);

const ScheduleScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="max-w-md mx-auto">
    <Header title="My Schedule" showBack onBack={() => setScreen('home')} />
    
    <div className="space-y-4">
      {[
        { id: 1, title: 'General Consultation', doctor: 'Dr. Sarah Kato', date: 'Oct 24, 2026', time: '10:30 AM', status: 'Upcoming' },
        { id: 2, title: 'Dental Checkup', doctor: 'Dr. John Bosco', date: 'Oct 28, 2026', time: '02:15 PM', status: 'Pending' },
      ].map(apt => (
        <div key={apt.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-dark-gray">{apt.title}</h3>
              <p className="text-xs text-gray-400">{apt.doctor}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.status === 'Upcoming' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {apt.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-health-green" />
              <span>{apt.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-health-green" />
              <span>{apt.time}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex gap-3">
            <button className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Cancel</button>
            <button className="flex-1 py-2 bg-soft-white text-health-green rounded-xl text-xs font-bold hover:bg-health-green hover:text-white transition-all">Reschedule</button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={() => setScreen('services')}
        className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-health-green hover:text-health-green transition-all bg-white"
      >
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-health-green/10">
          <Calendar className="w-5 h-5" />
        </div>
        <span className="font-bold text-sm">Book New Appointment</span>
      </button>
    </div>
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
            <Onboarding onFinish={() => setScreen('landing')} setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'login' && (
          <motion.div key="login" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
            <LoginPage setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'signup' && (
          <motion.div key="signup" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
            <SignupPage setScreen={setScreen} />
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
        {screen === 'notifications' && (
          <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <NotificationsScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileScreen setScreen={setScreen} />
          </motion.div>
        )}
        {screen === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScheduleScreen setScreen={setScreen} />
          </motion.div>
        )}
      </AnimatePresence>
    </ResponsiveShell>
  );
}
