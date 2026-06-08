const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3031;

// Enable CORS for dev
app.use(cors());
app.use(express.json());

// In-memory task list
let tasks = [
  {
    id: 'task-1',
    title: 'Configure Pi Cluster DNS',
    description: 'Set up local DNS mapping using Pi-hole or CoreDNS to resolve .homelab domains locally.',
    column: 'todo',
    priority: 'high',
    dueDate: '2026-06-15',
    assignee: 'Alice Smith',
    tags: ['Network', 'DNS'],
    subtasks: [
      { id: 'sub-1', title: 'Install Pi-hole on master node', completed: true },
      { id: 'sub-2', title: 'Configure local DNS mapping rules', completed: false }
    ],
    createdAt: new Date('2026-06-08T08:00:00.000Z').toISOString()
  },
  {
    id: 'task-2',
    title: 'Set up HCHI Platform Engine',
    description: 'Configure self-hosted runner and deployment scripts for automatic Docker builds.',
    column: 'in_progress',
    priority: 'high',
    dueDate: '2026-06-10',
    assignee: 'Bob Jones',
    tags: ['DevOps', 'Docker'],
    subtasks: [
      { id: 'sub-3', title: 'Spin up runner VM on Homelab hypervisor', completed: true },
      { id: 'sub-4', title: 'Register runner token with platform master', completed: false },
      { id: 'sub-5', title: 'Validate automatic build pipelines', completed: false }
    ],
    createdAt: new Date('2026-06-08T09:00:00.000Z').toISOString()
  },
  {
    id: 'task-3',
    title: 'Dockerize Task Manager App',
    description: 'Create multi-stage Dockerfile and deployment.json following HCHI specifications.',
    column: 'review',
    priority: 'medium',
    dueDate: '2026-06-09',
    assignee: 'Charlie Brown',
    tags: ['Docker', 'HCHI'],
    subtasks: [
      { id: 'sub-6', title: 'Write production-ready multi-stage Dockerfile', completed: true },
      { id: 'sub-7', title: 'Define routing properties in deployment.json', completed: true },
      { id: 'sub-8', title: 'Test container execution footprint', completed: false }
    ],
    createdAt: new Date('2026-06-08T10:00:00.000Z').toISOString()
  },
  {
    id: 'task-4',
    title: 'Read HCHI Standard PDF/MD',
    description: 'Understand the networking and internal routing requirements for deployment.',
    column: 'done',
    priority: 'low',
    dueDate: '2026-06-08',
    assignee: 'Dharun',
    tags: ['Security', 'HCHI'],
    subtasks: [
      { id: 'sub-9', title: 'Review standard routing requirements', completed: true },
      { id: 'sub-10', title: 'Identify allowed external network endpoints', completed: true }
    ],
    createdAt: new Date('2026-06-08T07:00:00.000Z').toISOString()
  }
];

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, 'public')));

// --- API Endpoints ---

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, column, priority, dueDate, assignee, tags, subtasks } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description: description || '',
    column: column || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || '',
    assignee: assignee || '',
    tags: tags || [],
    subtasks: subtasks || [],
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, column, priority, dueDate, assignee, tags, subtasks } = req.body;

  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    column: column !== undefined ? column : tasks[taskIndex].column,
    priority: priority !== undefined ? priority : tasks[taskIndex].priority,
    dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
    assignee: assignee !== undefined ? assignee : tasks[taskIndex].assignee,
    tags: tags !== undefined ? tags : tasks[taskIndex].tags,
    subtasks: subtasks !== undefined ? subtasks : tasks[taskIndex].subtasks
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ message: 'Task deleted successfully', id });
});

// Health check endpoint (for HCHI platform monitoring)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback for single-page routing (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(` HCHI Task Manager Backend Running`);
  console.log(` Port: ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});
