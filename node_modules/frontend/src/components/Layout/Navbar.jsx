import { Bell, Search, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/projects') return 'Projects';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path === '/tasks') return 'Tasks';
    if (path === '/profile') return 'Your Profile';
    return 'Ethara Task';
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>

      <div className="flex items-center gap-4">
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-64 transition-all"
          />
        </div> */}
        
        {/* <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button> */}

        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-slate-700 hidden sm:block">Hello, {user?.name.split(' ')[0]}</p>
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-100 uppercase">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
