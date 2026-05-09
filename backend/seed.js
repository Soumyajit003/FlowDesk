const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    console.log('Data cleared!');

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);
    const memberPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123', // Model pre-save will hash this
      role: 'Admin',
    });

    const member = await User.create({
      name: 'Team Member',
      email: 'member@test.com',
      password: 'password123',
      role: 'Member',
    });

    console.log('Users created!');

    // Create Project
    const project = await Project.create({
      title: 'Marketing Campaign 2026',
      description: 'Strategic planning and execution of the Q3 marketing campaign for Ethara.AI products.',
      createdBy: admin._id,
      members: [member._id],
    });

    console.log('Project created!');

    // Create Tasks
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const overdueDate = new Date(today);
    overdueDate.setDate(overdueDate.getDate() - 5);

    await Task.create([
      {
        title: 'Draft Campaign Strategy',
        description: 'Create the initial strategy document for the summer launch.',
        priority: 'High',
        status: 'Completed',
        dueDate: today,
        assignedTo: admin._id,
        projectId: project._id,
        createdBy: admin._id,
      },
      {
        title: 'Design Social Media Assets',
        description: 'Create 10 templates for Instagram and LinkedIn posts.',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: nextWeek,
        assignedTo: member._id,
        projectId: project._id,
        createdBy: admin._id,
      },
      {
        title: 'Fix Email Template Bug',
        description: 'The footer is broken on mobile devices in the newsletter template.',
        priority: 'High',
        status: 'Todo',
        dueDate: overdueDate,
        assignedTo: member._id,
        projectId: project._id,
        createdBy: admin._id,
      },
      {
        title: 'Market Research Report',
        description: 'Analyze competitor pricing and features for the new module.',
        priority: 'Low',
        status: 'Todo',
        dueDate: tomorrow,
        assignedTo: member._id,
        projectId: project._id,
        createdBy: admin._id,
      }
    ]);

    console.log('Tasks created!');
    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
