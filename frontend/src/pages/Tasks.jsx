import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  CheckSquare, 
  Filter, 
  Calendar, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  Search,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { Card, CardContent } from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      let query = '';
      if (filters.status) query += `status=${filters.status}&`;
      if (filters.priority) query += `priority=${filters.priority}&`;
      
      const { data } = await api.get(`/tasks?${query}`);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters.status, filters.priority]);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    task.projectId?.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Explorer</h1>
          <p className="text-slate-500 text-sm">View and manage all your assigned tasks</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks or projects..." 
              className="input pl-10 w-full md:w-64 transition-all focus:border-slate-400"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select 
            className="input w-auto min-w-[120px]"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">Active</option>
            <option value="Completed">Completed</option>
          </select>
          <select 
            className="input w-auto min-w-[120px]"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Task Details</th>
                <th className="px-6 py-4 font-semibold">Project</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length > 0 ? filteredTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                return (
                  <tr key={task._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase size={14} className="text-slate-400" />
                        <span className="text-xs font-medium">{task.projectId?.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
                        <span className="text-xs">
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'default'}>
                        {task.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {task.status !== 'Completed' ? (
                          <button 
                            onClick={() => updateStatus(task._id, 'Completed')}
                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateStatus(task._id, 'In Progress')}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Reopen Task"
                          >
                            <Clock size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <CheckSquare size={48} className="mb-4 opacity-10" />
                      <p className="text-lg font-medium">No tasks found</p>
                      <p className="text-sm">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
