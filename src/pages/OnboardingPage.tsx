import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ShieldCheck, Stethoscope, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Health on Wheels",
      desc: "Your trusted partner for healthcare delivery in Uganda.",
      icon: <div className="w-24 h-24 bg-health-green rounded-3xl flex items-center justify-center shadow-2xl mb-8"><span className="text-white text-4xl font-bold">H</span></div>,
      color: "bg-health-green"
    },
    {
      title: "Consult Licensed Doctors",
      desc: "Connect with medical professionals via video or chat from anywhere.",
      icon: <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center shadow-2xl mb-8"><Stethoscope className="w-12 h-12 text-white" /></div>,
      color: "bg-blue-500"
    },
    {
      title: "Genuine Medicines Fast",
      desc: "Verified medicines delivered to your doorstep in under 60 minutes.",
      icon: <div className="w-24 h-24 bg-bright-green rounded-3xl flex items-center justify-center shadow-2xl mb-8"><Truck className="w-12 h-12 text-white" /></div>,
      color: "bg-bright-green"
    }
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate('/landing');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="flex flex-col items-center"
        >
          {steps[step].icon}
          <h2 className="text-3xl font-bold text-dark-gray mb-4 font-['Montserrat']">{steps[step].title}</h2>
          <p className="text-gray-500 mb-12 leading-relaxed">{steps[step].desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-health-green' : 'w-2 bg-gray-200'}`}></div>
        ))}
      </div>

      <button 
        onClick={next}
        className={`w-full py-4 ${steps[step].color} text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 group transition-all transform hover:scale-105 active:scale-95`}
      >
        <span>{step === steps.length - 1 ? "Get Started" : "Next"}</span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <button 
        onClick={() => navigate('/landing')}
        className="mt-6 text-gray-400 font-bold text-sm hover:text-health-green transition-colors"
      >
        Skip
      </button>
    </div>
  );
};

export default Onboarding;
