import React from 'react';
import { Truck, MapPin, Clock, ShieldCheck, ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Delivery Status" showBack onBack={() => navigate('/home')} />
      
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-health-green"></div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Order #HW-9283</p>
            <h3 className="font-bold text-lg text-dark-gray">Medicine Delivery</h3>
          </div>
          <span className="bg-health-green/10 text-health-green px-3 py-1 rounded-full text-[10px] font-bold uppercase">In Transit</span>
        </div>

        <div className="space-y-8 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
          
          <div className="flex gap-4 relative z-10">
            <div className="w-6 h-6 bg-health-green rounded-full flex items-center justify-center border-4 border-soft-white shadow-md">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-dark-gray">Picked up from Ddembe Delivers</p>
              <p className="text-[10px] text-gray-400">10:45 AM • Kisementi, Kampala</p>
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            <div className="w-6 h-6 bg-health-green rounded-full flex items-center justify-center border-4 border-soft-white shadow-md animate-pulse">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-dark-gray">Rider is on the way</p>
              <p className="text-[10px] text-gray-400">11:02 AM • Near Acacia Mall</p>
            </div>
          </div>

          <div className="flex gap-4 relative z-10 opacity-30">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center border-4 border-soft-white shadow-md">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-dark-gray">Arriving at your location</p>
              <p className="text-[10px] text-gray-400">Estimated 11:15 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-health-green">
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-dark-gray">Musa K. (Rider)</p>
          <p className="text-xs text-gray-400">4.9 ★ • 1,200+ deliveries</p>
        </div>
        <button className="p-3 bg-health-green text-white rounded-xl shadow-md">
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-dark-gray ml-1">Delivery Details</h3>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-600">Plot 45, Bukoto Street, Kampala</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-600">Estimated delivery: 15 mins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const User = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default DeliveryPage;
