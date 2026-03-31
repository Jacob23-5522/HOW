import React from 'react';
import { Truck, Calendar, ShieldCheck, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto">
      <Header title="Notifications" showBack onBack={() => navigate('/home')} />
      
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
};

export default NotificationsPage;
