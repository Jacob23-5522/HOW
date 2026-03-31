import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { SERVICES } from '../constants';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Health Services" showBack onBack={() => navigate('/home')} />
      
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
};

export default ServicesPage;
