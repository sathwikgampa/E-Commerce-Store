import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email && password) {
        toast.success(`Welcome back to Sri Thirumala Store!`);
        navigate('/');
      } else {
        toast.error('Please enter valid email and password.');
      }
    } else {
      if (name && email && password) {
        toast.success(`Account created successfully!`, {
          description: 'You can now sign in using your credentials.',
        });
        setIsLogin(true);
      } else {
        toast.error('Please fill in all registration fields.');
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-store-accent">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-left">
        
        {/* Title details */}
        <div className="text-center">
          <div className="bg-store-primary text-white p-3.5 rounded-full inline-block mb-4 shadow-sm">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
             {isLogin ? 'Customer Sign In' : 'Create Account'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-semibold">
             {isLogin ? 'Access your wishlist, purchases, and orders.' : 'Join Sri Thirumala to track orders and save favorites.'}
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {/* Registration Name field */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-slate-200 outline-none transition focus:bg-white focus:ring-1 focus:ring-store-primary" 
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-slate-200 outline-none transition focus:bg-white focus:ring-1 focus:ring-store-primary" 
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-slate-200 outline-none transition focus:bg-white focus:ring-1 focus:ring-store-primary" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-store-primary hover:bg-store-primary-dark transition uppercase tracking-wider focus:outline-none min-h-[48px]">
              {isLogin ? 'Sign In' : 'Register Now'}
            </button>
          </div>

        </form>

        <div className="text-center mt-6 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-4">
          {isLogin ? (
            <p>New to Sri Thirumala? <button onClick={() => setIsLogin(false)} className="text-store-primary font-bold hover:underline">Create an account</button></p>
          ) : (
            <p>Already registered? <button onClick={() => setIsLogin(true)} className="text-store-primary font-bold hover:underline">Sign in instead</button></p>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserLogin;
