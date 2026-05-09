import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: CheckSquare, color: 'text-slate-600', bg: 'bg-slate-100' },
    { title: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Pending', value: stats?.pendingTasks || 0, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader 
            title="Recent Tasks" 
            subtitle="Latest activity from your team"
            action={
              <Link to="/tasks" className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            }
          />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Task</th>
                    <th className="px-6 py-3 font-semibold">Project</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentTasks?.length > 0 ? stats.recentTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">{task.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <User size={12} className="text-slate-400" />
                          <span className="text-[11px] text-slate-500">{task.assignedTo?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="info">{task.projectId?.title}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'default'}>
                          {task.status}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500 text-sm">No recent tasks found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader 
            title="Upcoming Deadlines" 
            subtitle="Tasks that need immediate attention"
          />
          <CardContent className="p-6">
            <div className="space-y-4">
              {stats?.upcomingDeadlines?.length > 0 ? stats.upcomingDeadlines.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={task.priority === 'High' ? 'text-red-500 mt-1' : 'text-slate-400 mt-1'}>
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.projectId?.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar size={14} />
                      <span className="text-xs font-medium">
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <Badge variant={task.priority.toLowerCase()} className="mt-1">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500 text-sm">No upcoming deadlines</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
