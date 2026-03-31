import React from 'react';
import { Bell, Menu, Search, Stethoscope, Pill, Truck, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import LocationMarker from '../components/LocationMarker';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
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
            onClick={() => navigate('/notifications')}
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
          onClick={() => navigate('/services')}
          className="p-6 bg-health-green text-white rounded-3xl flex flex-col items-center gap-3 shadow-lg hover:bg-bright-green transition-all transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Stethoscope className="w-7 h-7" />
          </div>
          <span className="font-bold text-sm">Book Doctor</span>
        </button>
        <button 
          onClick={() => navigate('/pharmacy')}
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
          <button onClick={() => navigate('/schedule')} className="text-health-green text-sm font-bold hover:underline">See All</button>
        </div>
        <div 
          onClick={() => navigate('/delivery')}
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

export default HomeScreen;
