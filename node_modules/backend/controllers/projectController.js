const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { title, description, members } = req.body;

  const project = new Project({
    title,
    description,
    createdBy: req.user._id,
    members: members || [],
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({}).populate('createdBy', 'name email');
  } else {
    // Member only sees projects they are part of
    projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).populate('createdBy', 'name email');
  }
  res.json(projects);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('members', 'name email');

  if (project) {
    // Check access
    if (
      req.user.role !== 'Admin' &&
      !project.members.some((m) => m._id.toString() === req.user._id.toString()) &&
      project.createdBy._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this project');
    }
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  const { title, description, members } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    project.members = members || project.members;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
