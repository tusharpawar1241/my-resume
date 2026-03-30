import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, UserCircle, BarChart, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Templates' },
    { to: '/my-resumes', icon: FileText, label: 'My Resumes' },
    { to: '/profile-setup', icon: UserCircle, label: 'Profile Settings' },
    { to: '/analytics', icon: BarChart, label: 'Analytics' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-700">ATC Resume</h1>
        <button className="lg:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-md" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* User Section */}
      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold overflow-hidden shrink-0 border border-brand-200">
            {user?.photoURL ? 
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" /> : 
              (user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.displayName || 'User'}</p>
            <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight">{user?.email}</p>
          </div>
        </div>
        
        <button 
          onClick={() => logout()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-[100] flex items-center px-6 justify-between shadow-sm">
        <h1 className="text-xl font-bold text-brand-700 tracking-tight">ATC Resume</h1>
        <button onClick={() => setIsOpen(true)} className="p-2.5 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors active:scale-95">
          <Menu size={20} />
        </button>
      </div>

      <div className="hidden lg:block h-screen sticky top-0 z-10 w-64 shrink-0 bg-white">
        {sidebarContent}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-[200] flex">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }} 
              className="relative w-[280px] max-w-[85vw] h-full bg-white shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
