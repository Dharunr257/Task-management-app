import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Activity,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-t-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/5' },
  { id: 'in_progress', title: 'In Progress', color: 'border-t-amber-500 text-amber-700 dark:text-amber-400 bg-amber-500/5' },
  { id: 'review', title: 'Review', color: 'border-t-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/5' },
  { id: 'done', title: 'Done', color: 'border-t-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5' }
];

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
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null means creating a new task
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    column: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [formError, setFormError] = useState('');

  // Drag and Drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks();
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
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
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
      dueDate: new Date().toISOString().split('T')[0]
    });
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
      dueDate: task.dueDate || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      dueDate: formData.dueDate
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
    } else {
      // Add mode
      setTasks(prev => [...prev, taskForState]);
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {COLUMNS.map(column => {
              const columnTasks = filteredTasks.filter(t => t.column === column.id);
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
                          className="glass-card rounded-xl p-4 shadow-sm relative group cursor-grab active:cursor-grabbing"
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
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
          <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
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
            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
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
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl text-sm glass-input resize-none"
                />
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
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
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
    </div>
  );
}
