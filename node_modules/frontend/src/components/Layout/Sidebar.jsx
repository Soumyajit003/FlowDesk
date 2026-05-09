import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white text-xs">FD</div>
          FlowDesk
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.name}
              </div>
              {isActive && <ChevronRight size={14} className="text-slate-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
