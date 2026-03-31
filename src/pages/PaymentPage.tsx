import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Payment Successful!");
      navigate('/home');
    }, 2000);
  };

  return (
    <div>
      <Header title="Payment Method" showBack onBack={() => navigate('/profile')} />
      
      <div className="space-y-6">
        <div className="p-6 bg-health-green rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-8 bg-white/20 rounded-lg"></div>
              <ShieldCheck className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-xl font-bold tracking-widest mb-4">•••• •••• •••• 4242</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] opacity-70 uppercase tracking-widest">Card Holder</p>
                <p className="font-bold text-sm">Jacob Karugaba</p>
              </div>
              <div>
                <p className="text-[10px] opacity-70 uppercase tracking-widest">Expires</p>
                <p className="font-bold text-sm">12/28</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-dark-gray ml-1">Other Methods</h3>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <PaymentOption icon={<div className="w-6 h-6 bg-yellow-400 rounded-full"></div>} title="Mobile Money (MTN)" />
            <PaymentOption icon={<div className="w-6 h-6 bg-red-600 rounded-full"></div>} title="Mobile Money (Airtel)" />
            <PaymentOption icon={<CreditCard className="w-5 h-5" />} title="Add New Card" />
          </div>
        </div>

        <button 
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg hover:bg-bright-green transition-all mt-8 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
};

const PaymentOption = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <span className="font-bold text-sm text-dark-gray">{title}</span>
    </div>
    <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
  </button>
);

export default PaymentPage;
