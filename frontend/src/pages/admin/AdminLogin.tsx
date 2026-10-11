import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  VenkateshwaraNamamIcon, 
  VenkateshwaraFullEmblem, 
  KireetamIcon, 
  ChakraIcon 
} from '../../components/icons/VenkateshwaraIcons';
import { verifyAdminCredentials, createAdminSession } from '../../config/adminAuth';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (verifyAdminCredentials(username, password)) {
        createAdminSession();
        toast.success('Admin authentication verified successfully.', {
          description: 'Welcome to Sri Thirumala Store Administrative Management Portal.',
        });
        navigate('/admin');
      } else {
        toast.error('Authentication Failed: Invalid Administrator Credentials', {
          description: 'Please check your authorized username and security key.',
        });
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F4F8FB] text-left">
      
      {/* Breadcrumb Navigation to Storefront */}
      <div className="max-w-md w-full mb-4 flex items-center justify-between text-xs font-semibold text-slate-500">
        <Link 
          to="/home" 
          className="inline-flex items-center text-[#2196F3] hover:underline font-bold"
        >
          ← Return to Storefront Homepage
        </Link>
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <KireetamIcon className="w-4 h-4 text-[#FF9800]" /> Kamareddy Central Portal
        </span>
      </div>

      {/* Material-UI-Inspired Elevated Auth Card */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#87CEEB]/40 shadow-xl transition-all">
        
        {/* Sacred Sri Thirumala Venkateshwara Swamy Emblem Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <div className="p-3 bg-[#E3F2FD] rounded-2xl border border-[#87CEEB] shadow-xs">
              <VenkateshwaraFullEmblem className="h-10 w-28" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF9800] block">
              Official Store Administration
            </span>
            <h1 className="text-2xl font-black text-[#0B192C] tracking-tight mt-0.5">
              Sri Thirumala Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Authorized access for bookstore inventory &amp; order fulfillment
            </p>
          </div>
        </div>

        {/* Secure Form (No Demo Credentials Displayed) */}
        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          
          <div className="space-y-4">
            
            {/* Username / Email field */}
            <div>
              <label 
                htmlFor="admin-username"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Administrator Username / Email
              </label>
              <div className="relative">
                <input 
                  id="admin-username"
                  type="text" 
                  required 
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F4F8FB] border border-slate-300 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3]" 
                  placeholder="Enter authorized administrator ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label 
                htmlFor="admin-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Security Key / Password
              </label>
              <div className="relative">
                <input 
                  id="admin-password"
                  type="password" 
                  required 
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F4F8FB] border border-slate-300 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3]" 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Submit Button with Material Ripple Effect */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-md text-xs font-bold text-white bg-[#2196F3] hover:bg-[#1976D2] active:bg-[#0D47A1] transition uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-[#2196F3]/30 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ChakraIcon className="w-4 h-4 animate-spin text-white" />
                  Verifying Credentials...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <VenkateshwaraNamamIcon className="w-4 h-4" />
                  Sign In to Admin Dashboard
                </span>
              )}
            </button>
          </div>

          {/* Secure Environment Security Notice */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ChakraIcon className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Secured with token-based cryptographic session validation</span>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AdminLogin;
