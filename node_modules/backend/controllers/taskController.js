const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignedTo, projectId } = req.body;

  const task = new Task({
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    projectId,
    createdBy: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  const { status, priority, projectId } = req.query;
  let query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (projectId) query.projectId = projectId;

  // If Member, only show tasks assigned to them
  if (req.user.role === 'Member') {
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title')
    .populate('createdBy', 'name email')
    .sort({ dueDate: 1 });

  res.json(tasks);
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title');

  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, priority, status, dueDate, assignedTo } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    // Admins can update everything, Members can only update status
    if (req.user.role === 'Admin') {
      task.title = title || task.title;
      task.description = description || task.description;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;
    } else {
      // Member access - check if assigned to them
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this task');
      }
      task.status = status || task.status;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
const getStats = async (req, res) => {
  let query = {};
  if (req.user.role === 'Member') {
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  
  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.dueDate) < now
  ).length;

  // Recent tasks (last 5)
  const recentTasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  // Upcoming deadlines (next 5)
  const upcomingDeadlines = await Task.find({
    ...query,
    status: { $ne: 'Completed' },
    dueDate: { $gte: now }
  })
    .populate('projectId', 'title')
    .sort({ dueDate: 1 })
    .limit(5);

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    recentTasks,
    upcomingDeadlines
  });
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getStats,
};
