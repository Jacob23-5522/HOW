import React, { useState } from 'react';
import { ArrowLeft, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto px-4">
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/landing')} className="mb-6 p-2 hover:bg-gray-100 rounded-full inline-block transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </button>
        <div className="w-16 h-16 bg-health-green rounded-2xl flex items-center justify-center shadow-lg mb-6 mx-auto">
          <span className="text-white text-2xl font-bold">H</span>
        </div>
        <h2 className="text-3xl font-bold text-health-green mb-2 font-['Montserrat']">Welcome Back</h2>
        <p className="text-gray-500">Login to access your health dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-green transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-health-green"
            >
              <span className="text-xs font-bold uppercase">{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-health-green focus:ring-health-green cursor-pointer" />
            <span className="text-gray-600 group-hover:text-health-green transition-colors">Remember me</span>
          </label>
          <button type="button" className="text-health-green font-bold hover:underline">Forgot Password?</button>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-health-green text-white font-bold rounded-2xl shadow-lg hover:bg-bright-green transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-soft-white px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.548 0-1.411.516-1.411 1.304 0 .914 1.357 1.346 1.357 2.136 0 .623-.391.925-.934.925-.29 0-.57-.106-.908-.317L9.444 12c.411.429 1.143.733 1.975.733 1.447 0 2.408-.935 2.408-2.222 0-1.167-.812-1.545-1.666-2.043-.537-.312-.733-.587-.733-.893 0-.399.317-.61.772-.61.341 0 .58.12.897.346l.714-1.088c-.444-.313-1.033-.53-1.659-.53zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z" fill="currentColor"/>
            </svg>
            Apple
          </button>
        </div>
      </form>

      <div className="mt-auto py-8 text-center">
        <p className="text-gray-500">
          Don't have an account? {' '}
          <button onClick={() => navigate('/signup')} className="text-health-green font-bold hover:underline">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
