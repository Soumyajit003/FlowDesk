import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full text-slate-400 mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/dashboard" 
          className="btn btn-primary inline-flex items-center gap-2 px-8 py-3"
        >
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
