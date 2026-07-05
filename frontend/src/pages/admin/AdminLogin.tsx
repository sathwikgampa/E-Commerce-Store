import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default dummy admin credentials for testing
    if (email === 'admin@bookstore.com' && password === 'admin123') {
      localStorage.setItem('admin_token', 'mock_admin_token_123');
      toast.success('Admin login successful!');
      navigate('/admin');
    } else {
      toast.error('Invalid credentials. Try: admin@bookstore.com / admin123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] text-left">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs">
        
        <div className="text-center">
          <div className="bg-[#0A3D91] p-3.5 rounded-full inline-block mb-3.5 shadow-sm">
            <BookOpen className="text-accent w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Portal Login</h2>
          <p className="mt-1.5 text-xs text-slate-505 font-semibold">Secure portal authorization for Sri Thirumala admins</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          
          <div className="space-y-4">
            
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-slate-200 outline-none transition focus:bg-white focus:ring-1 focus:ring-primary" 
                  placeholder="admin@bookstore.com"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-slate-200 outline-none transition focus:bg-white focus:ring-1 focus:ring-primary" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

          </div>

          <div className="pt-2">
             <button type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-[#040D21] hover:bg-[#0A3D91] transition uppercase tracking-wider focus:outline-none">
                Sign in to Dashboard
             </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
            <p className="text-[10px] text-amber-800 font-bold">Demo Login Credentials:</p>
            <p className="text-[10px] text-slate-500 font-bold mt-1">admin@bookstore.com / admin123</p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
