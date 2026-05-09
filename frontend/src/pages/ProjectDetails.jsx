import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Users, 
  CheckSquare, 
  Clock, 
  CheckCircle2,
  MoreVertical,
  Edit2,
  Trash2,
  User,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
    projectId: id
  });

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/tasks', taskFormData);
      toast.success('Task created successfully');
      setIsTaskModalOpen(false);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: '',
        projectId: id
      });
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        toast.success('Task deleted');
        fetchProjectDetails();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;
  if (!project) return <div>Project not found</div>;

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-slate-500 mt-2 text-lg leading-relaxed">{project.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={18} className="text-slate-400" />
              <span className="text-sm">Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users size={18} className="text-slate-400" />
              <span className="text-sm">{project.members?.length} Team Members</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <User size={18} className="text-slate-400" />
              <span className="text-sm">Manager: <strong>{project.createdBy?.name}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-center min-w-[80px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Todo</p>
            <p className="text-xl font-bold text-slate-900">{stats.todo}</p>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-center min-w-[80px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Active</p>
            <p className="text-xl font-bold text-slate-900">{stats.inProgress}</p>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-center min-w-[80px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Done</p>
            <p className="text-xl font-bold text-slate-900 text-green-600">{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Project Tasks</h3>
          {isAdmin && (
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="btn btn-primary btn-sm gap-2"
            >
              <Plus size={16} /> Add Task
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Todo', 'In Progress', 'Completed'].map(status => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  {status === 'Todo' && <Clock size={16} />}
                  {status === 'In Progress' && <Loader2 size={16} className="animate-spin" />}
                  {status === 'Completed' && <CheckCircle2 size={16} />}
                  {status}
                </h4>
                <Badge variant="default" className="rounded-md opacity-70">
                  {tasks.filter(t => t.status === status).length}
                </Badge>
              </div>
              
              <div className="space-y-4 min-h-[100px]">
                {tasks.filter(t => t.status === status).map(task => (
                  <Card key={task._id} className="border-slate-200 hover:border-slate-300 transition-all">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={task.priority.toLowerCase()}>
                          {task.priority}
                        </Badge>
                        <div className="flex gap-1">
                          {isAdmin && (
                            <button 
                              onClick={() => deleteTask(task._id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 leading-tight">{task.title}</h5>
                      <p className="text-[12px] text-slate-500 mt-2 line-clamp-2">{task.description}</p>
                      
                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                            {task.assignedTo?.name?.charAt(0)}
                          </div>
                          <span className="text-[11px] text-slate-600 font-medium">{task.assignedTo?.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Status Change Controls */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {status !== 'Todo' && (
                          <button 
                            onClick={() => updateTaskStatus(task._id, 'Todo')}
                            className="text-[10px] font-semibold py-1 px-2 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 transition-colors"
                          >
                            To Todo
                          </button>
                        )}
                        {status !== 'In Progress' && (
                          <button 
                            onClick={() => updateTaskStatus(task._id, 'In Progress')}
                            className="text-[10px] font-semibold py-1 px-2 border border-slate-200 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            To Active
                          </button>
                        )}
                        {status !== 'Completed' && (
                          <button 
                            onClick={() => updateTaskStatus(task._id, 'Completed')}
                            className="text-[10px] font-semibold py-1 px-2 border border-slate-200 rounded text-green-600 hover:bg-green-50 transition-colors col-span-2"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Creation Modal */}
      <Modal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)}
        title="Assign New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Task Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Design homepage mockup"
              value={taskFormData.title}
              onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              className="input min-h-[80px] py-2" 
              placeholder="Details about the task..."
              value={taskFormData.description}
              onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Priority</label>
              <select 
                className="input"
                value={taskFormData.priority}
                onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Due Date</label>
              <input 
                type="date" 
                className="input"
                value={taskFormData.dueDate}
                onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Assign To</label>
            <select 
              className="input"
              value={taskFormData.assignedTo}
              onChange={(e) => setTaskFormData({ ...taskFormData, assignedTo: e.target.value })}
              required
            >
              <option value="">Select Member</option>
              {project.members?.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
              <option value={project.createdBy?._id}>{project.createdBy?.name} (Manager)</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary w-full py-2.5 mt-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Assign Task'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
