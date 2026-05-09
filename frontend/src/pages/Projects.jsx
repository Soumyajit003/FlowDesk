import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Briefcase, Users, Calendar, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    members: []
  });

  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/projects', formData);
      toast.success('Project created successfully');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', members: [] });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm">Manage and track your team projects</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary gap-2"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map((project) => (
          <Card key={project._id} className="group hover:shadow-md transition-all border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Briefcase size={20} />
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(project._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <Link to={`/projects/${project._id}`}>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700">{project.title}</h3>
              </Link>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px]">
                {project.description}
              </p>
              
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Users size={14} />
                  <span className="text-xs font-medium">{project.members?.length || 0} Members</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
            <Briefcase size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No projects found</p>
            {isAdmin && <p className="text-sm mt-1">Click "New Project" to get started</p>}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Project Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Website Redesign"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              className="input min-h-[100px] py-2" 
              placeholder="Briefly describe the project goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Team Members</label>
            <div className="max-h-[150px] overflow-y-auto border border-slate-200 rounded-md p-2 space-y-1">
              {users.map(u => (
                <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.members.includes(u._id)}
                    onChange={(e) => {
                      const newMembers = e.target.checked 
                        ? [...formData.members, u._id]
                        : formData.members.filter(id => id !== u._id);
                      setFormData({ ...formData, members: newMembers });
                    }}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary w-full py-2.5 mt-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Project'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
