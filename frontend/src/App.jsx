import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Activity,
  AlertTriangle,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  User,
  BarChart3,
  Sparkles,
  ArrowUpDown,
  TrendingUp,
  Cpu,
  HardDrive,
  Thermometer,
  Database,
  ClipboardList,
  CheckCircle2,
  Bell,
  Terminal,
  RefreshCw,
  Eye
} from 'lucide-react';

const getColumnIcon = (columnId, size = 16) => {
  switch (columnId) {
    case 'todo':
      return <ClipboardList size={size} className="text-blue-500" />;
    case 'in_progress':
      return <Activity size={size} className="text-amber-500 animate-pulse-slow" />;
    case 'review':
      return <Eye size={size} className="text-purple-500" />;
    case 'done':
      return <CheckCircle2 size={size} className="text-emerald-500" />;
    default:
      return <ClipboardList size={size} />;
  }
};

const createLogEntry = (type, message) => ({
  id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  type,
  message,
  timestamp: new Date()
});

const INITIAL_LOGS = [
  {
    id: 'pre-1',
    type: 'system',
    message: 'HCHI platform engine initiated. Self-hosted runner online.',
    timestamp: new Date(Date.now() - 3600000 * 2.5)
  },
  {
    id: 'pre-2',
    type: 'build',
    message: 'Docker container build succeeded for hchi-task-manager-backend.',
    timestamp: new Date(Date.now() - 3600000 * 1.8)
  },
  {
    id: 'pre-3',
    type: 'system',
    message: 'Reverse proxy created: task-manager.homelab routing to host port 3031.',
    timestamp: new Date(Date.now() - 3600000 * 1.2)
  }
];

const formatLogTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  
  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});
};

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-t-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/5' },
  { id: 'in_progress', title: 'In Progress', color: 'border-t-amber-500 text-amber-700 dark:text-amber-400 bg-amber-500/5' },
  { id: 'review', title: 'Review', color: 'border-t-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/5' },
  { id: 'done', title: 'Done', color: 'border-t-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5' }
];

const generateParticles = () => {
  const particles = [];
  const colors = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];
  const shapes = ['circle', 'square', 'triangle'];
  for (let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 65 + Math.random() * 125;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity - 25; // float upwards
    const rot = Math.random() * 360 + 360;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    particles.push({
      id: `p-${Date.now()}-${i}-${Math.random()}`,
      dx: `${dx}px`,
      dy: `${dy}px`,
      rot: `${rot}deg`,
      color,
      shape,
      size: `${4 + Math.random() * 8}px`
    });
  }
  return particles;
};

// Stable avatar gradient generator
const getAvatarGradient = (name) => {
  if (!name) return 'from-slate-400 to-slate-500';
  const gradients = [
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-purple-500 to-indigo-500',
    'from-cyan-500 to-sky-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Tag color classes
const getTagColorClass = (tag) => {
  const lower = tag.toLowerCase();
  if (lower === 'network' || lower === 'dns') {
    return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20';
  }
  if (lower === 'devops' || lower === 'docker') {
    return 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20';
  }
  if (lower === 'hchi' || lower === 'homelab') {
    return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20';
  }
  if (lower === 'security') {
    return 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20';
  }
  if (lower === 'database' || lower === 'backend' || lower === 'frontend') {
    return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20';
  }
  return 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20';
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hchi-theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hchi-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Dashboard state
  const [showDashboard, setShowDashboard] = useState(() => {
    return localStorage.getItem('hchi-dashboard-visible') !== 'false';
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('none'); // 'none', 'priority', 'dueDate', 'createdAt'

  // Confetti state
  const [confettiParticles, setConfettiParticles] = useState([]);

  // Expanded subtasks state for individual cards
  const [expandedCardSubtasks, setExpandedCardSubtasks] = useState({});

  // Form states for Tags & Subtasks
  const [newTagInput, setNewTagInput] = useState('');
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null means creating a new task
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    column: 'todo',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: [],
    subtasks: []
  });
  const [formError, setFormError] = useState('');

  // Drag and Drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);

  // Node Monitor and Sidebar Drawer States
  const [logFilter, setLogFilter] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activityLogs, setActivityLogs] = useState(() => INITIAL_LOGS);

  const [nodeStats, setNodeStats] = useState({
    pi5: { cpu: 28, ram: 5.2, temp: 48, containers: 6, status: 'active', ip: '192.168.1.10', cpuHistory: [25, 28, 26, 30, 24, 29, 27, 28, 31, 28] },
    pi4_1: { cpu: 14, ram: 2.1, temp: 43, containers: 3, status: 'active', ip: '192.168.1.11', cpuHistory: [12, 14, 15, 13, 16, 12, 15, 14, 13, 14] },
    pi4_2: { cpu: 0, ram: 0, temp: 0, containers: 0, status: 'standby', ip: '192.168.1.12', cpuHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
  });

  const addActivityLog = (type, message) => {
    setActivityLogs(prev => [createLogEntry(type, message), ...prev]);
  };

  const handleBootNode = (key) => {
    setNodeStats(prev => {
      const next = { ...prev };
      next[key] = {
        ...next[key],
        status: 'active',
        containers: 2,
        ram: 1.1,
        temp: 36,
        cpu: 15,
        cpuHistory: [0, 0, 0, 0, 0, 0, 0, 0, 5, 15]
      };
      return next;
    });
    
    const nodeName = key === 'pi5' ? 'hchi-pi5-master' : key === 'pi4_1' ? 'hchi-pi4-worker1' : 'hchi-pi4-worker2';
    addActivityLog('system', `WOL boot command executed for node ${nodeName}. Node is now active.`);
  };

  const filteredLogs = activityLogs.filter(log => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  // Simulated node telemetry update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setNodeStats(prev => {
        const next = { ...prev };
        
        // hchi-pi5-master
        if (next.pi5.status === 'active') {
          const nextCpu = Math.max(5, Math.min(95, Math.round(next.pi5.cpu + (Math.random() * 10 - 5))));
          const nextHistory = [...next.pi5.cpuHistory.slice(1), nextCpu];
          const nextTemp = Math.max(45, Math.min(75, Math.round(next.pi5.temp + (Math.random() * 2 - 1))));
          next.pi5 = { ...next.pi5, cpu: nextCpu, cpuHistory: nextHistory, temp: nextTemp };
        }
        
        // hchi-pi4-worker1
        if (next.pi4_1.status === 'active') {
          const nextCpu = Math.max(5, Math.min(95, Math.round(next.pi4_1.cpu + (Math.random() * 8 - 4))));
          const nextHistory = [...next.pi4_1.cpuHistory.slice(1), nextCpu];
          const nextTemp = Math.max(40, Math.min(65, Math.round(next.pi4_1.temp + (Math.random() * 1.6 - 0.8))));
          next.pi4_1 = { ...next.pi4_1, cpu: nextCpu, cpuHistory: nextHistory, temp: nextTemp };
        }
        
        // hchi-pi4-worker2
        if (next.pi4_2.status === 'active') {
          const nextCpu = Math.max(5, Math.min(95, Math.round(next.pi4_2.cpu + (Math.random() * 8 - 4))));
          const nextHistory = [...next.pi4_2.cpuHistory.slice(1), nextCpu];
          const nextTemp = Math.max(40, Math.min(65, Math.round(next.pi4_2.temp + (Math.random() * 2 - 1))));
          next.pi4_2 = { ...next.pi4_2, cpu: nextCpu, cpuHistory: nextHistory, temp: nextTemp };
        } else {
          next.pi4_2 = { ...next.pi4_2, cpu: 0, temp: 0, cpuHistory: [...next.pi4_2.cpuHistory.slice(1), 0] };
        }
        
        return next;
      });

      // Occasionally trigger a build simulation or a small platform alert log
      if (Math.random() < 0.1) {
        const events = [
          { type: 'build', message: 'HCHI Engine: Completed periodic application health check. All endpoints responsive.' },
          { type: 'system', message: 'Nginx Proxy Manager: DNS configuration validated for task-manager.homelab.' },
          { type: 'build', message: 'HCHI Runner: Cleaned up untagged docker build cache on hchi-pi5-master.' }
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        addActivityLog(randomEvent.type, randomEvent.message);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);


  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setApiOnline(true);
    } catch (error) {
      console.error('API Fetch Error:', error);
      setApiOnline(false);
      // Fallback dummy data if completely offline (so frontend still behaves beautifully)
      setTasks([
        {
          id: 'local-1',
          title: 'DNS Resolution Offline Demo',
          description: 'This is a demo task showing offline state because the backend was unreachable.',
          column: 'todo',
          priority: 'high',
          dueDate: new Date().toISOString().split('T')[0],
          assignee: 'Alice Smith',
          tags: ['Network', 'DNS'],
          subtasks: [
            { id: 'sub-l1', title: 'Verify router endpoints', completed: false },
            { id: 'sub-l2', title: 'Test network loopback', completed: true }
          ],
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) {
        loadTasks();
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  // Confetti generator
  const triggerConfetti = () => {
    setConfettiParticles(generateParticles());
    setTimeout(() => {
      setConfettiParticles([]);
    }, 1200);
  };

  // Toggle dashboard visibility
  const toggleDashboard = () => {
    setShowDashboard(prev => {
      const next = !prev;
      localStorage.setItem('hchi-dashboard-visible', String(next));
      return next;
    });
  };

  // Toggle subtask check directly on card
  const handleToggleSubtask = async (taskId, subtaskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map(s => {
          if (s.id === subtaskId) {
            return { ...s, completed: !s.completed };
          }
          return s;
        });
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    });
    setTasks(updatedTasks);

    const oldTask = tasks.find(t => t.id === taskId);
    const sub = oldTask?.subtasks?.find(s => s.id === subtaskId);
    if (oldTask && sub) {
      addActivityLog('board', `Subtask "${sub.title}" in task "${oldTask.title}" marked as ${!sub.completed ? 'completed' : 'incomplete'}`);
    }

    const taskToUpdate = updatedTasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToUpdate)
      });
      if (!response.ok) throw new Error('Failed to toggle subtask');
      setApiOnline(true);
    } catch (error) {
      console.error('Subtask Toggle Sync Error:', error);
      setApiOnline(false);
      loadTasks();
    }
  };

  // Toggle subtask expanded view on card
  const toggleCardSubtasksExpand = (taskId) => {
    setExpandedCardSubtasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };



  // Check API health periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch {
        setApiOnline(false);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // CRUD Operations
  const handleOpenCreateModal = (columnId = 'todo') => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      column: columnId,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignee: '',
      tags: [],
      subtasks: []
    });
    setNewTagInput('');
    setNewSubtaskInput('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      column: task.column,
      priority: task.priority,
      dueDate: task.dueDate || '',
      assignee: task.assignee || '',
      tags: task.tags || [],
      subtasks: task.subtasks || []
    });
    setNewTagInput('');
    setNewSubtaskInput('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    const subtaskTitle = newSubtaskInput.trim();
    const newSubtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: subtaskTitle,
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }));
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(s => s.id !== subtaskId)
    }));
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      column: formData.column,
      priority: formData.priority,
      dueDate: formData.dueDate,
      assignee: formData.assignee.trim(),
      tags: formData.tags,
      subtasks: formData.subtasks
    };

    // Optimistic UI updates
    const tempId = editingTask ? editingTask.id : `temp-${Date.now()}`;
    const taskForState = {
      id: tempId,
      ...payload,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
    };

    if (editingTask) {
      // Edit mode
      setTasks(prev => prev.map(t => t.id === editingTask.id ? taskForState : t));
      addActivityLog('board', `Task "${payload.title}" details updated`);
    } else {
      // Add mode
      setTasks(prev => [...prev, taskForState]);
      addActivityLog('board', `New task "${payload.title}" created in "${COLUMNS.find(c => c.id === payload.column)?.title || payload.column}"`);
    }

    setIsModalOpen(false);

    // Sync with backend
    try {
      let response;
      if (editingTask) {
        response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) throw new Error('Failed to save task to backend');
      const syncedTask = await response.json();
      
      // Update correct ID if we just created
      setTasks(prev => prev.map(t => t.id === tempId ? syncedTask : t));
      setApiOnline(true);
    } catch (error) {
      console.error('Save Sync Error:', error);
      setApiOnline(false);
      // Revert in case of edit failure (or load again)
      if (editingTask) {
        loadTasks();
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Confirm delete dialog or direct delete (opt-in)
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    // Optimistic UI update
    const previousTasks = [...tasks];
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (taskToDelete) {
      addActivityLog('board', `Task "${taskToDelete.title}" was deleted`);
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setApiOnline(true);
    } catch (error) {
      console.error('Delete Sync Error:', error);
      setApiOnline(false);
      // Revert UI state
      setTasks(previousTasks);
    }
  };

  const moveTaskColumn = async (taskId, newColumn) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, column: newColumn };
      }
      return t;
    });
    setTasks(updatedTasks);

    const taskToMove = tasks.find(t => t.id === taskId);
    if (taskToMove) {
      const oldCol = COLUMNS.find(c => c.id === taskToMove.column)?.title || taskToMove.column;
      const newCol = COLUMNS.find(c => c.id === newColumn)?.title || newColumn;
      addActivityLog('board', `Moved task "${taskToMove.title}" from "${oldCol}" to "${newCol}"`);
    }

    if (newColumn === 'done') {
      triggerConfetti();
    }

    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskToUpdate, column: newColumn })
      });
      if (!response.ok) throw new Error('Failed to update task column');
      setApiOnline(true);
    } catch (error) {
      console.error('Move Column Sync Error:', error);
      setApiOnline(false);
      loadTasks(); // reload in case of failure to align state
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Add transparent drag image or customize opacity in class
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTaskId) {
      moveTaskColumn(draggedTaskId, columnId);
    }
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  // Mobile navigation Helper (move left/right)
  const shiftTaskColumn = (taskId, currentColumn, direction) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === currentColumn);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      moveTaskColumn(taskId, COLUMNS[nextIndex].id);
    }
  };

  // Search & Filter computation
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.05)] dark:shadow-[0_0_8px_rgba(244,63,94,0.1)]';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20';
      case 'low':
      default:
        return 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20';
    }
  };

  // Calculate dashboard statistics
  const completedTasksCount = tasks.filter(t => t.column === 'done').length;
  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date(new Date().setHours(0,0,0,0)) && t.column !== 'done').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.column !== 'done').length;
  const completionPercentage = tasks.length ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const sortTasks = (taskList) => {
    if (sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return [...taskList].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    }
    if (sortBy === 'dueDate') {
      return [...taskList].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    if (sortBy === 'createdAt') {
      return [...taskList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return taskList;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Banner - API Offline Warning */}
      {!apiOnline && (
        <div className="bg-rose-950/80 border-b border-rose-800 text-rose-200 px-4 py-2 text-sm flex items-center justify-center gap-2 backdrop-blur-md sticky top-0 z-50">
          <AlertTriangle size={16} className="text-rose-400 animate-pulse" />
          <span><strong>Offline Mode:</strong> Backend server is unreachable. Actions will be saved locally but might not sync.</span>
        </div>
      )}

      {/* Header */}
      <header className="glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Activity size={20} className="text-white animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                HCHI Kanban Hub
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`h-2 w-2 rounded-full ${apiOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {apiOnline ? 'Internal Router Connected' : 'Offline Mode'}
                </span>
              </div>
            </div>
          </div>
  
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm glass-input focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
  
            {/* Filter Dropdown */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl text-sm glass-input cursor-pointer appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pr-8"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Priorities</option>
                <option value="high" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">High Priority</option>
                <option value="medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Medium Priority</option>
                <option value="low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Low Priority</option>
              </select>
            </div>

            {/* Activity Logs Trigger Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer flex items-center justify-center bg-white/50 dark:bg-slate-900/50"
              title="Open Platform Activity & Logs"
              aria-label="Activity Feed"
            >
              <Bell size={16} className="text-indigo-500 dark:text-indigo-400" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer flex items-center justify-center bg-white/50 dark:bg-slate-900/50"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={16} className="theme-toggle-icon text-amber-500" />
              ) : (
                <Moon size={16} className="theme-toggle-icon text-indigo-600" />
              )}
            </button>
  
            {/* Add Task Button */}
            <button
              onClick={() => handleOpenCreateModal('todo')}
              className="bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Analytics Dashboard Panel */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 pt-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={toggleDashboard}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer select-none bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 px-3 py-1.5 rounded-xl"
          >
            <BarChart3 size={14} className="text-indigo-500" />
            <span>{showDashboard ? 'Hide Analytics Dashboard' : 'Show Analytics Dashboard'}</span>
            {showDashboard ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        <div className={`dashboard-collapse ${showDashboard ? '' : 'collapsed'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white/50 dark:bg-slate-950/20 backdrop-blur-md mb-2 shadow-sm">
            {/* Board Completion Progress */}
            <div className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completion Rate</span>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{completionPercentage}%</span>
                <span className="text-xs text-slate-500">({completedTasksCount}/{tasks.length} tasks)</span>
              </div>
              <div className="progress-bar-bg h-2 w-full">
                <div className="progress-bar-fill bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>

            {/* Urgent & Overdue Actions */}
            <div className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgent Action</span>
                {overdueCount > 0 ? (
                  <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
                ) : (
                  <Sparkles size={16} className="text-indigo-400" />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Overdue Tasks:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${overdueCount > 0 ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>{overdueCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">High Priority (Active):</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${highPriorityCount > 0 ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{highPriorityCount}</span>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 relative overflow-hidden col-span-1 sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Distribution</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Real-time</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {COLUMNS.map(col => {
                  const count = tasks.filter(t => t.column === col.id).length;
                  return (
                    <div key={col.id} className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-lg font-bold text-slate-800 dark:text-white">{count}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate w-full text-center">{col.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HCHI Cluster Nodes Status */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white/50 dark:bg-slate-950/20 backdrop-blur-md mb-2 shadow-sm mt-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-indigo-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">HCHI Cluster Nodes Status</h3>
              </div>
              <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Simulated Cluster Hardware Monitor</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(nodeStats).map(([key, node]) => {
                const isMaster = key === 'pi5';
                const name = isMaster ? 'hchi-pi5-master' : key === 'pi4_1' ? 'hchi-pi4-worker1' : 'hchi-pi4-worker2';
                const label = isMaster ? 'Primary Host' : key === 'pi4_1' ? 'Worker Node' : 'Worker Node';
                const isActive = node.status === 'active';
                const maxRam = isMaster ? 8 : 4;
                
                return (
                  <div key={key} className={`flex flex-col p-4 rounded-xl border border-slate-200/80 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 relative overflow-hidden transition-all duration-300 ${!isActive ? 'opacity-65' : ''}`}>
                    {/* Node Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`glow-indicator ${isActive ? 'glow-green' : 'glow-amber'}`}></span>
                          <span className="font-bold text-xs text-slate-850 dark:text-slate-200 uppercase tracking-wider">{name}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">{node.ip} &bull; {label}</span>
                      </div>
                      
                      {isActive ? (
                        <div className="flex items-center">
                          <svg className="h-6 w-20 overflow-visible" viewBox="0 0 120 30">
                            <path
                              fill="none"
                              stroke={isMaster ? '#6366f1' : '#10b981'}
                              strokeWidth="1.5"
                              d={`M ${node.cpuHistory.map((val, idx) => {
                                const x = (idx / (node.cpuHistory.length - 1)) * 120;
                                const y = 30 - (val / 100) * 26 - 2;
                                return `${x} ${y}`;
                              }).join(' L ')}`}
                              className="transition-all duration-300"
                            />
                          </svg>
                        </div>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => handleBootNode(key)}
                          className="px-2 py-0.5 rounded text-[8px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer select-none active:scale-95"
                        >
                          Wake-on-LAN
                        </button>
                      )}
                    </div>

                    {isActive ? (
                      <div className="space-y-2 mt-auto">
                        {/* CPU / RAM metrics */}
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/30 rounded p-1.5">
                            <div className="flex items-center justify-between text-slate-500 mb-0.5">
                              <span className="flex items-center gap-0.5 font-bold uppercase text-[7px]"><Cpu size={10} /> CPU</span>
                              <span className="font-bold text-slate-800 dark:text-white text-[9px]">{node.cpu}%</span>
                            </div>
                            <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${node.cpu}%`, transition: 'width 0.4s ease' }}></div>
                            </div>
                          </div>
                          <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/30 rounded p-1.5">
                            <div className="flex items-center justify-between text-slate-500 mb-0.5">
                              <span className="flex items-center gap-0.5 font-bold uppercase text-[7px]"><HardDrive size={10} /> RAM</span>
                              <span className="font-bold text-slate-800 dark:text-white text-[9px]">{node.ram} GB</span>
                            </div>
                            <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${(node.ram / maxRam) * 100}%`, transition: 'width 0.4s ease' }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Temp & Containers */}
                        <div className="grid grid-cols-2 gap-2 text-[9px]">
                          <div className="flex items-center gap-1 p-1 px-1.5 rounded bg-white/20 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 font-medium">
                            <Thermometer size={10} className={node.temp > 65 ? 'text-rose-500 animate-bounce' : 'text-indigo-400'} />
                            <span>Temp: <strong className={node.temp > 65 ? 'text-rose-500 font-bold' : 'text-slate-800 dark:text-slate-300'}>{node.temp}°C</strong></span>
                          </div>
                          <div className="flex items-center gap-1 p-1 px-1.5 rounded bg-white/20 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 font-medium">
                            <Database size={10} className="text-emerald-400" />
                            <span>Containers: <strong className="text-slate-800 dark:text-slate-300">{node.containers}</strong></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-14 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800/60 rounded-lg text-slate-400 dark:text-slate-500 text-[9px] font-bold tracking-wide uppercase select-none">
                        SYSTEM IN SLEEP STATE
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Board Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 overflow-y-auto">
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse mt-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 h-[400px]">
                <div className="h-4 bg-slate-800 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-24 bg-slate-800/50 rounded-xl"></div>
                  <div className="h-24 bg-slate-800/50 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Sorting Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/55 dark:border-slate-800/50 rounded-2xl p-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpDown size={12} className="text-indigo-500" />
                  Sort By:
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'none', label: 'Default' },
                    { id: 'priority', label: 'Priority' },
                    { id: 'dueDate', label: 'Due Date' },
                    { id: 'createdAt', label: 'Date Created' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all ${
                        sortBy === opt.id
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/15'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Showing <strong className="text-indigo-600 dark:text-indigo-400">{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {COLUMNS.map(column => {
                const columnTasks = sortTasks(filteredTasks.filter(t => t.column === column.id));
                const isOver = activeDropColumn === column.id;

                return (
                  <div
                    key={column.id}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDrop={(e) => handleDrop(e, column.id)}
                    onDragLeave={() => setActiveDropColumn(null)}
                    className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-slate-100/30 dark:bg-slate-950/40 p-4 min-h-[500px] flex flex-col transition-all border-t-2 ${column.color} ${isOver ? 'drag-over' : ''}`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60 dark:border-slate-900">
                      <div className="flex items-center gap-2">
                        {getColumnIcon(column.id)}
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm tracking-wide uppercase">
                          {column.title}
                        </h3>
                        <span className="bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {columnTasks.length}
                        </span>
                      </div>
    
                      <button 
                        onClick={() => handleOpenCreateModal(column.id)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title="Add task to this column"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Tasks List */}
                    <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto max-h-[70vh] pr-1">
                      {columnTasks.length === 0 ? (
                        <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-900/60 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 dark:text-slate-500 text-xs text-center min-h-[120px] select-none">
                          Drop tasks here or click '+' to create
                        </div>
                      ) : (
                        columnTasks.map(task => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragEnd={handleDragEnd}
                            className={`glass-card rounded-xl p-4 shadow-sm relative group cursor-grab active:cursor-grabbing ${
                              task.priority === 'high' ? 'card-high-priority' : ''
                            }`}
                          >
                            {/* Card Header & Badges */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPriorityBadgeClass(task.priority)}`}>
                                {task.priority}
                              </span>
                              
                              {/* Card Control Buttons */}
                              <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleOpenEditModal(task)}
                                  className="p-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                  title="Edit Task"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1 rounded bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/30 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                                  title="Delete Task"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Task Content */}
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1.5 break-words line-clamp-2">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-slate-600 dark:text-slate-400 text-xs mb-3.5 line-clamp-3 leading-relaxed break-words">
                                {task.description}
                              </p>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2.5">
                                {task.tags.map((tag, idx) => (
                                  <span key={idx} className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${getTagColorClass(tag)}`}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Subtasks Progress */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="mt-3.5 border-t border-slate-100 dark:border-slate-900/60 pt-2.5">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCardSubtasksExpand(task.id);
                                  }}
                                  className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mb-1.5 cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400 select-none"
                                >
                                  <span className="flex items-center gap-1 font-semibold">
                                    <CheckSquare size={11} className="text-indigo-500 dark:text-indigo-400" />
                                    <span>Subtasks Checklist</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span>
                                      {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                    </span>
                                    {expandedCardSubtasks[task.id] ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                  </span>
                                </div>
                                <div className="progress-bar-bg h-1.5 w-full mb-1.5">
                                  <div 
                                    className="progress-bar-fill bg-indigo-600 dark:bg-indigo-500" 
                                    style={{ width: `${task.subtasks.length ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100) : 0}%` }}
                                  />
                                </div>

                                {/* Expanded checklist layout */}
                                {expandedCardSubtasks[task.id] && (
                                  <div className="space-y-1.5 mt-2 max-h-40 overflow-y-auto pr-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {task.subtasks.map(s => (
                                      <div 
                                        key={s.id} 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleSubtask(task.id, s.id);
                                        }}
                                        className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100/50 dark:hover:bg-slate-900/50 cursor-pointer text-[10px] transition-colors"
                                      >
                                        <div className="text-indigo-500 dark:text-indigo-400">
                                          {s.completed ? (
                                            <CheckSquare size={12} className="fill-indigo-500/10" />
                                          ) : (
                                            <div className="h-3 w-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                                          )}
                                        </div>
                                        <span className={`truncate ${s.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                                          {s.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Card Footer */}
                            <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-slate-100 dark:border-slate-900/60 text-[11px] text-slate-500 dark:text-slate-400">
                              {/* Due Date */}
                              <div className="flex items-center gap-1.5 font-medium">
                                <Calendar size={12} className="text-indigo-500 dark:text-indigo-400" />
                                <span className={
                                  task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) && task.column !== 'done'
                                    ? 'text-rose-600 dark:text-rose-400 font-bold' 
                                    : ''
                                }>
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'No due date'}
                                </span>
                              </div>

                              {/* Assignee and Mobile controls */}
                              <div className="flex items-center gap-2">
                                {task.assignee && (
                                  <div 
                                    className={`h-5 w-5 rounded-full bg-gradient-to-tr ${getAvatarGradient(task.assignee)} flex items-center justify-center text-[9px] font-black text-white shadow-sm`}
                                    title={`Assigned to ${task.assignee}`}
                                  >
                                    {getInitials(task.assignee)}
                                  </div>
                                )}

                                {/* Mobile-Only Movement Controls */}
                                <div className="flex md:hidden items-center gap-1">
                                  <button
                                    onClick={() => shiftTaskColumn(task.id, task.column, -1)}
                                    disabled={column.id === 'todo'}
                                    className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-20 text-slate-500 dark:text-slate-400 active:bg-indigo-600 active:text-white"
                                    title="Move Left"
                                  >
                                    <ChevronLeft size={12} />
                                  </button>
                                  <button
                                    onClick={() => shiftTaskColumn(task.id, task.column, 1)}
                                    disabled={column.id === 'done'}
                                    className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-20 text-slate-500 dark:text-slate-400 active:bg-indigo-600 active:text-white"
                                    title="Move Right"
                                  >
                                    <ChevronRight size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 px-6 py-4 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} HCHI Task Management Portal</span>
          <span className="flex items-center gap-1">
            Built following <a href="file:///e:/Hybrid%20Cloud%20HomeLab%20Infrastructure/Task%20Management%20application/HCHI%20Deployable%20Application%20Standard.md" className="text-indigo-400 hover:underline">HCHI Deployable Standard</a>
          </span>
        </div>
      </footer>

      {/* Edit/Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {editingTask ? 'Edit Task Details' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTask} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Set up internal DNS routing"
                  className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Provide details about the target goal..."
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl text-sm glass-input resize-none"
                />
              </div>

              {/* Assignee Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Assignee
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleFormChange}
                    placeholder="e.g. Alice Smith"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input"
                  />
                </div>
              </div>

              {/* Tags Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Tags / Labels
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Press Enter or click Add"
                    className="flex-1 px-4 py-2 rounded-xl text-sm glass-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 text-xs transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-2 rounded-xl">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 rounded-lg flex items-center gap-1.5 font-semibold"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-indigo-400 hover:text-indigo-600 dark:hover:text-white"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtasks checklist builder */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Subtasks Checklist
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskInput}
                    onChange={(e) => setNewSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    placeholder="e.g. Test Docker image locally"
                    className="flex-1 px-4 py-2 rounded-xl text-sm glass-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 text-xs transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {formData.subtasks && formData.subtasks.length > 0 && (
                  <div className="space-y-2 mt-2 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-2 rounded-xl max-h-36 overflow-y-auto">
                    {formData.subtasks.map(s => (
                      <div key={s.id} className="flex items-center justify-between gap-2 p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-xs">
                        <span className="truncate text-slate-700 dark:text-slate-300">{s.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(s.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Columns & Priorities */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Board Status
                  </label>
                  <select
                    name="column"
                    value={formData.column}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
                  >
                    <option value="todo" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">To Do</option>
                    <option value="in_progress" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">In Progress</option>
                    <option value="review" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Review</option>
                    <option value="done" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
                  >
                    <option value="low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Low</option>
                    <option value="medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Medium</option>
                    <option value="high" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Confetti Overlay */}
      {confettiParticles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="confetti-wrapper">
              {confettiParticles.map(p => (
                <div
                  key={p.id}
                  className={`confetti-particle ${p.shape}`}
                  style={{
                    '--dx': p.dx,
                    '--dy': p.dy,
                    '--rot': p.rot,
                    '--particle-color': p.color,
                    backgroundColor: p.color,
                    width: p.size,
                    height: p.size,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs Sidebar Drawer */}
      {isDrawerOpen && (
        <div 
          className="drawer-backdrop"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
      <div className={`activity-drawer ${isDrawerOpen ? 'drawer-open' : 'drawer-closed'} flex flex-col h-full`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">HCHI Platform Logs</h3>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-800 flex gap-1.5 overflow-x-auto flex-shrink-0">
          {[
            { id: 'all', label: 'All Logs' },
            { id: 'board', label: 'Board' },
            { id: 'system', label: 'System' },
            { id: 'build', label: 'Builds' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setLogFilter(f.id)}
              className={`px-2.5 py-1 text-[9px] rounded-lg border font-semibold cursor-pointer transition-all ${
                logFilter === f.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setActivityLogs([
              { id: `clear-${Date.now()}`, type: 'system', message: 'Activity logs cleared by administrator', timestamp: new Date() }
            ])}
            className="ml-auto px-2 py-1 text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer select-none"
            title="Clear Log History"
          >
            <Trash2 size={10} /> Clear
          </button>
        </div>

        {/* Log List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 graph-grid">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-slate-400 dark:text-slate-500 text-xs py-10">
              No logs in this category.
            </div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="flex gap-2.5 text-xs border-b border-slate-200/30 dark:border-slate-800/20 pb-3 last:border-b-0">
                <div className="mt-0.5 flex-shrink-0">
                  {log.type === 'board' ? (
                    <div className="h-5 w-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                      <ClipboardList size={11} />
                    </div>
                  ) : log.type === 'build' ? (
                    <div className="h-5 w-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <RefreshCw size={11} className="animate-spin-slow" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                      <Cpu size={11} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 dark:text-slate-300 font-medium break-words leading-relaxed text-[11px]">
                    {log.message}
                  </p>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 font-semibold block mt-1">
                    {formatLogTime(log.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-850 bg-white/30 dark:bg-slate-900/20 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold uppercase"><Terminal size={10} /> Shell status: Active</span>
            <span className="font-semibold text-indigo-500">{apiOnline ? 'ROUTER ONLINE' : 'OFFLINE MODE'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
