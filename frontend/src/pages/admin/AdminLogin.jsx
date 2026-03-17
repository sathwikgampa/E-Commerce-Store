import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Default dummy admin credentials for testing
    if (email === 'admin@bookstore.com' && password === 'admin123') {
      toast.success('Login Successful');
      navigate('/admin');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-lg border border-stone-200">
        <div className="text-center">
          <BookOpen className="mx-auto text-rose-600 w-16 h-16" />
          <h2 className="mt-6 text-3xl font-extrabold text-stone-900">Admin Login</h2>
          <p className="mt-2 text-sm text-stone-600">Secure access to store dashboard</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium text-stone-700 mb-1 block">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-stone-400" />
                </div>
                <input 
                  type="email" 
                  required 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" 
                  placeholder="admin@bookstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-stone-700 mb-1 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
             <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-stone-900 hover:bg-stone-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900">
                Sign in to Dashboard
             </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-stone-500">Demo login: admin@bookstore.com / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
