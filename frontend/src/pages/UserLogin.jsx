import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const UserLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if(email && password) {
        toast.success(`Welcome back!`);
        navigate('/');
      } else {
        toast.error('Please enter valid details');
      }
    } else {
      if(name && email && password) {
        toast.success(`Account created successfully!`);
        setIsLogin(true);
      } else {
        toast.error('Please fill all fields');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 bg-stone-50">
      <div className="max-w-2xl w-full space-y-10 bg-white p-14 rounded-3xl shadow-lg border border-stone-200 text-lg">
        <div className="text-center">
          <User className="mx-auto text-rose-600 w-24 h-24 mb-6" />
          <h2 className="text-5xl font-extrabold text-stone-900 tracking-tight">
             {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="mt-4 text-xl text-stone-600">
             {isLogin ? 'Sign in to access your orders and wishlist' : 'Join our E-Commerce Store'}
          </p>
        </div>
        
        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <label className="text-xl font-medium text-stone-700 mb-2 block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <User className="h-6 w-6 text-stone-400" />
                </div>
                <input 
                  type="text" 
                  required={!isLogin}
                  className="w-full pl-14 pr-6 py-4 text-xl rounded-2xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="relative">
            <label className="text-xl font-medium text-stone-700 mb-2 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Mail className="h-6 w-6 text-stone-400" />
              </div>
              <input 
                type="email" 
                required 
                className="w-full pl-14 pr-6 py-4 text-xl rounded-2xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="text-xl font-medium text-stone-700 mb-2 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Lock className="h-6 w-6 text-stone-400" />
              </div>
              <input 
                type="password" 
                required 
                className="w-full pl-14 pr-6 py-4 text-xl rounded-2xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
             <button type="submit" className="w-full flex justify-center py-5 px-6 border border-transparent rounded-2xl shadow-sm text-2xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600">
                {isLogin ? 'Sign In' : 'Sign Up'}
             </button>
          </div>
        </form>

        <div className="text-center mt-8 text-lg text-stone-600">
          {isLogin ? (
            <p>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-rose-600 font-bold hover:underline">Register here</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)} className="text-rose-600 font-bold hover:underline">Sign in</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
