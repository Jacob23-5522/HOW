import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Pill, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
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
              onClick={() => navigate('/signup')}
              className="flex-1 py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg hover:bg-bright-green transition-all transform hover:-translate-y-1"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/login')}
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
                <div className="w-12 h-12 bg-soft-white rounded-2xl flex items-center justify-center text-health-green mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark-gray">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 px-6 bg-health-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-12 font-['Montserrat']">Trusted by Thousands of Ugandans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 bg-white/10 rounded-3xl backdrop-blur-sm text-left">
              <p className="italic mb-6 text-lg">"Health on Wheels saved me when my baby had a fever at 2 AM. The doctor was professional and the meds arrived so fast!"</p>
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
          onClick={() => navigate('/signup')}
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
};

export default LandingPage;
