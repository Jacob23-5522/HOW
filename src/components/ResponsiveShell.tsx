import React, { useState, useEffect } from 'react';
import { Home, Stethoscope, MessageSquare, Pill, User, AlertCircle, Bell, Menu } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface ResponsiveShellProps {
  children: React.ReactNode;
}

const ResponsiveShell: React.FC<ResponsiveShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const showNav = !['/', '/onboarding', '/landing', '/login', '/signup', '/payment'].includes(currentPath);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSOS = () => {
    if (confirm("Are you sure you want to call Emergency Services (999)?")) {
      window.location.href = 'tel:999';
    }
  };

  const navItems = [
    { id: 'home', path: '/home', icon: <Home />, label: 'Home' },
    { id: 'services', path: '/services', icon: <Stethoscope />, label: 'Services' },
    { id: 'assistant', path: '/assistant', icon: <MessageSquare />, label: 'Assistant' },
    { id: 'pharmacy', path: '/pharmacy', icon: <Pill />, label: 'Pharmacy' },
    { id: 'profile', path: '/profile', icon: <User />, label: 'Profile' },
  ];

  if (isMobile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200 p-0 sm:p-4 font-['Lato']">
        <div className="relative w-full max-w-[400px] h-screen sm:h-[800px] bg-soft-white sm:rounded-[3rem] shadow-2xl overflow-hidden sm:border-[8px] border-dark-gray">
          {/* Notch */}
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-dark-gray rounded-b-2xl z-50"></div>
          
          {/* Content */}
          <div className="h-full overflow-y-auto pb-24 pt-8 px-6">
            {children}
          </div>

          {/* SOS Button */}
          {showNav && (
            <button 
              onClick={handleSOS}
              className="absolute bottom-24 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
            >
              <AlertCircle className="w-8 h-8" />
              <span className="absolute -top-8 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-bounce">SOS</span>
            </button>
          )}

          {/* WhatsApp Button */}
          {showNav && (
            <a 
              href="https://wa.me/256754558016" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-40 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          )}

          {/* Navigation Bar */}
          {showNav && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-between items-center z-40">
              {navItems.map(item => (
                <NavButton key={item.id} icon={item.icon} active={currentPath === item.path} onClick={() => navigate(item.path)} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Top Navigation */}
      {showNav && (
        <nav className="sticky top-0 bg-white border-b border-gray-200 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
          <Link to="/home" className="flex items-center gap-4 cursor-pointer">
            <div className="w-10 h-10 bg-health-green rounded-xl flex items-center justify-center text-white font-bold">H</div>
            <h1 className="text-xl font-bold text-health-green font-['Montserrat']">Health on Wheels</h1>
          </Link>
          <div className="flex items-center gap-8">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 font-bold transition-colors ${currentPath === item.path ? 'text-health-green' : 'text-gray-500 hover:text-health-green'}`}
              >
                {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5' })}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Bell className="w-5 h-5 text-gray-600" /></button>
            <button 
              onClick={handleSOS}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition-colors"
            >
              SOS Emergency
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto p-8 ${!showNav ? 'h-screen flex items-center justify-center' : ''}`}>
        {children}
      </main>

      {/* Floating WhatsApp for Desktop */}
      {showNav && (
        <a 
          href="https://wa.me/256754558016" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-xl transition-all ${active ? 'bg-health-green text-white shadow-lg' : 'text-gray-400 hover:text-health-green'}`}
  >
    {icon}
  </button>
);

export default ResponsiveShell;
