import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Settings, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex-shrink-0 flex flex-col">
         <div className="p-6 border-b border-stone-800">
            <Link to="/" className="flex items-center gap-3 text-white mb-2">
              <BookOpen className="h-8 w-8 text-rose-500" />
              <span className="font-bold text-xl">ST Books</span>
            </Link>
            <p className="text-xs text-stone-500 font-semibold tracking-widest uppercase mt-4">Admin Panel</p>
         </div>
         
         <nav className="flex-1 p-4 space-y-2">
            <Link to="/admin" className="flex items-center px-4 py-3 bg-stone-800 text-white rounded-xl font-medium transition-colors">
              <LayoutDashboard className="h-5 w-5 mr-3 text-rose-500" />
              Dashboard
            </Link>
            <a href="#" className="flex items-center px-4 py-3 hover:bg-stone-800 hover:text-white rounded-xl font-medium transition-colors text-stone-400">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </a>
         </nav>
         
         <div className="p-4 border-t border-stone-800">
            <button 
              onClick={() => {
                // Here we would clear auth token
                navigate('/admin/login')
              }}
              className="flex w-full items-center px-4 py-3 hover:bg-rose-500/10 text-rose-500 hover:text-rose-400 rounded-xl font-medium transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full">
         <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
