import React from 'react';
import { Bell, Menu, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, onBack }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-dark-gray" />
        </button>
      )}
      <h1 className="text-xl font-bold text-health-green font-['Montserrat']">{title}</h1>
    </div>
    <div className="flex gap-2">
      <button className="p-2 bg-white rounded-full shadow-sm"><Bell className="w-5 h-5 text-gray-500" /></button>
      <button className="p-2 bg-white rounded-full shadow-sm"><Menu className="w-5 h-5 text-gray-500" /></button>
    </div>
  </div>
);

export default Header;
