# FlowDesk

A full-stack Team Task Manager web application that helps teams manage projects, assign tasks, track progress, and collaborate efficiently with role-based access control.

## Live Demo

* Frontend: flowdesk-stayconnected.vercel.app
* Backend API: flowdesk-production-99de.up.railway.app

---

# Project Overview

FlowDesk is a clean and modern project management platform built for teams and organizations.

The application allows admins to create projects, manage team members, assign tasks, and monitor overall task progress. Team members can view assigned tasks, update statuses, and track deadlines.

The project is designed with a professional dashboard UI and a scalable backend architecture.

---

# Features

## Authentication

* User Signup
* User Login
* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Persistent Login State

## Role-Based Access Control

### Admin

Admins can:

* Create projects
* Manage project members
* Create tasks
* Assign tasks
* Update all tasks
* Delete tasks
* View analytics dashboard

### Member

Members can:

* View assigned projects
* View assigned tasks
* Update task status
* Access personal dashboard

---

# Dashboard Features

* Total Tasks Overview
* Completed Tasks Count
* Pending Tasks Count
* Overdue Tasks Count
* Recent Tasks Table
* Upcoming Deadlines
* Task Status Tracking

---

# Project Management

* Create Project
* Edit Project
* Delete Project
* Add Team Members
* View Project Details
* Manage Project Tasks

---

# Task Management

* Create Task
* Edit Task
* Delete Task
* Assign Tasks to Members
* Task Priority Levels
* Task Status Updates
* Due Date Tracking
* Overdue Task Highlighting
* Filter Tasks by:

  * Status
  * Priority
  * Overdue

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Context API / Redux Toolkit
* React Toastify

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* cors

## Deployment

* Railway

---

# Folder Structure

```bash
FlowDesk/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── README.md
├── .gitignore
└── .env.example
```

---

# Database Schema

## User

```js
{
  name,
  email,
  password,
  role
}
```

## Project

```js
{
  title,
  description,
  createdBy,
  members
}
```

## Task

```js
{
  title,
  description,
  priority,
  status,
  dueDate,
  assignedTo,
  projectId,
  createdBy
}
```

---

# API Endpoints

## Authentication

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register User    |
| POST   | /api/auth/login    | Login User       |
| GET    | /api/auth/profile  | Get Current User |

## Projects

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | /api/projects     | Get All Projects |
| POST   | /api/projects     | Create Project   |
| PUT    | /api/projects/:id | Update Project   |
| DELETE | /api/projects/:id | Delete Project   |

## Tasks

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| GET    | /api/tasks     | Get All Tasks |
| POST   | /api/tasks     | Create Task   |
| PUT    | /api/tasks/:id | Update Task   |
| DELETE | /api/tasks/:id | Delete Task   |

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# Installation Guide

## Clone Repository

```bash
git clone https://github.com/your-username/FlowDesk.git
cd FlowDesk
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Demo Credentials

## Admin Account

```bash
Email: admin@test.com
Password: password123
```

## Member Account

```bash
Email: member@test.com
Password: password123
```

---

# Deployment (Railway)

## Backend Deployment

1. Push project to GitHub
2. Create a new Railway project
3. Connect GitHub repository
4. Add environment variables:

```env
MONGO_URI=
JWT_SECRET=
PORT=
```

5. Deploy backend

* Railway

## Frontend Deployment

Deploy frontend using:

* Railway
* Vercel
* Netlify

Update API base URL after deployment.

---

# Security Features

* Password Hashing
* JWT Authentication
* Protected APIs
* Role-Based Authorization
* Input Validation
* Error Handling Middleware

---

# Screenshots

## Login Page

<img width="1912" height="868" alt="image" src="https://github.com/user-attachments/assets/2e2c793d-6cd5-4a2f-b97d-c9e91fe8af3e" />


---

## Dashboard

<img width="1901" height="868" alt="image" src="https://github.com/user-attachments/assets/efe0e32f-08f4-4df9-9c83-803b33b92b65" />


---

## Project Management

<img width="1907" height="874" alt="image" src="https://github.com/user-attachments/assets/58b59755-2dcb-467a-930c-426a09fd8f56" />
<img width="1905" height="864" alt="image" src="https://github.com/user-attachments/assets/1d3d73c7-c9ac-403c-96d1-af1cb1d9bd07" />



---

# Future Improvements

* Real-time notifications
* Team chat system
* Drag and drop Kanban board
* File attachments
* Email notifications
* Activity logs
* Dark mode

---

# Learning Outcomes

This project helped in understanding:

* MERN stack architecture
* REST API development
* Authentication & Authorization
* MongoDB relationships
* State management
* Frontend-backend integration
* Deployment workflows

---

# Author

Soumyajit Bera

GitHub: [https://github.com/Soumyajit003](https://github.com/Soumyajit003)

---

# License

This project is built for educational and internship assi
