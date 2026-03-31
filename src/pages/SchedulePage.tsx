import React from 'react';
import { Calendar, Clock, Stethoscope, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="My Schedule" showBack onBack={() => navigate('/home')} />
      
      <div className="flex gap-4 mb-8">
        <button className="flex-1 py-3 bg-health-green text-white font-bold rounded-2xl shadow-md">Upcoming</button>
        <button className="flex-1 py-3 bg-white text-gray-400 font-bold rounded-2xl border border-gray-100">Past</button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-dark-gray">Dr. Sarah Kato</h3>
                <p className="text-xs text-gray-400">General Consultation</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Confirmed</span>
          </div>
          
          <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Calendar className="w-4 h-4" />
              <span>Tomorrow, 10:30 AM</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock className="w-4 h-4" />
              <span>30 mins</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3 bg-health-green text-white font-bold rounded-xl text-sm shadow-md">Join Call</button>
            <button className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl text-sm">Reschedule</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 opacity-70">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-dark-gray">Lab Test: Malaria</h3>
                <p className="text-xs text-gray-400">Home Sample Collection</p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Pending</span>
          </div>
          
          <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Calendar className="w-4 h-4" />
              <span>Oct 14, 09:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/services')}
        className="w-full py-4 mt-8 bg-soft-white text-health-green font-bold rounded-2xl border-2 border-dashed border-health-green/30 hover:bg-health-green/5 transition-all"
      >
        + Book New Appointment
      </button>
    </div>
  );
};

export default SchedulePage;
