import React from 'react';
import { User, CreditCard, ShieldCheck, MessageSquare, Bell, Clock, ChevronRight, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="My Profile" showBack onBack={() => navigate('/home')} />
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-health-green/10 rounded-full flex items-center justify-center mb-4 relative">
          <User className="w-12 h-12 text-health-green" />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-health-green text-white rounded-full flex items-center justify-center border-4 border-soft-white">
            <span className="text-xs font-bold">+</span>
          </button>
        </div>
        <h2 className="text-xl font-bold text-dark-gray">Jacob Karugaba</h2>
        <p className="text-gray-400 text-sm">jacobkarugaba5522@gmail.com</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <ProfileItem icon={<User className="w-5 h-5" />} title="Personal Information" />
          <ProfileItem icon={<CreditCard className="w-5 h-5" />} title="Payment Methods" onClick={() => navigate('/payment')} />
          <ProfileItem icon={<Truck className="w-5 h-5" />} title="Delivery Addresses" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <ProfileItem icon={<Bell className="w-5 h-5" />} title="Notifications" onClick={() => navigate('/notifications')} />
          <ProfileItem icon={<ShieldCheck className="w-5 h-5" />} title="Security & Privacy" />
          <ProfileItem icon={<MessageSquare className="w-5 h-5" />} title="Help & Support" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <ProfileItem icon={<Clock className="w-5 h-5" />} title="Log Out" color="text-red-500" onClick={() => navigate('/landing')} />
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, title, color = "text-dark-gray", onClick }: { icon: React.ReactNode, title: string, color?: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <span className={`font-bold text-sm ${color}`}>{title}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-300" />
  </button>
);

export default ProfilePage;
