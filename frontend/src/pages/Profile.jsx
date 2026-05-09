import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl ring-4 ring-white">
          {user.name?.charAt(0)}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
        <p className="text-slate-500">{user.role}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader title="Account Information" />
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="text-slate-900 font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-slate-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</p>
                <p className="text-slate-900 font-medium">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/30">
          <CardContent className="p-6">
            {/* <h3 className="text-red-900 font-bold mb-2">Danger Zone</h3>
            <p className="text-sm text-red-700 mb-6">Logging out will end your current session on this device.</p> */}
            <button 
              onClick={logout}
              className="btn bg-red-600 text-white hover:bg-red-700 w-full flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Logout from FlowDesk
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
