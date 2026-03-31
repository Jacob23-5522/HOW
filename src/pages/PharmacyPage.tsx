import React from 'react';
import { ShieldCheck, Search, Star, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { PHARMACIES } from '../constants';

const PharmacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Pharmacy" showBack onBack={() => navigate('/home')} />
      
      <div className="bg-bright-green/10 p-4 rounded-2xl border border-bright-green/20 mb-6 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-bright-green" />
        <p className="text-xs font-medium text-health-green">All medicines are verified and genuine from licensed pharmacies.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search medicines, health products..." 
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-dark-gray">Partner Pharmacies</h2>
          <button className="text-health-green text-sm font-bold hover:underline">View All</button>
        </div>

        {PHARMACIES.map((pharm) => (
          <div key={pharm.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-dark-gray text-lg">{pharm.name}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{pharm.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg text-xs font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>{pharm.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock className="w-4 h-4" />
                <span>{pharm.deliveryTime} delivery</span>
              </div>
              <button 
                onClick={() => navigate('/delivery')}
                className="text-health-green font-bold text-sm hover:underline"
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-soft-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-bold text-dark-gray mb-2">Upload Prescription</h3>
        <p className="text-xs text-gray-500 mb-4">Have a prescription? Upload it and we'll find the best price for you.</p>
        <button className="w-full py-3 bg-health-green text-white font-bold rounded-xl shadow-md">Upload Now</button>
      </div>
    </div>
  );
};

export default PharmacyPage;
