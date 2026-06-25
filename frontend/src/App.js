import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const API = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { text, type }
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  // Apply theme
  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks whenever data or filters change
  useEffect(() => {
    let result = [...tasks];

    if (search.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterPriority !== 'All') {
      result = result.filter((t) => t.priority === filterPriority);
    }

    if (filterStatus === 'Completed') {
      result = result.filter((t) => t.completed);
    } else if (filterStatus === 'Pending') {
      result = result.filter((t) => !t.completed);
    }

    setFiltered(result);
  }, [tasks, search, filterPriority, filterStatus]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      showMessage('Cannot connect to server. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (formData) => {
    try {
      if (editTask) {
        const res = await axios.put(`${API}/tasks/update/${editTask._id}`, formData);
        setTasks(tasks.map((t) => (t._id === editTask._id ? res.data : t)));
        setEditTask(null);
        showMessage('Task updated successfully!');
      } else {
        const res = await axios.post(`${API}/tasks/add`, formData);
        setTasks([res.data, ...tasks]);
        showMessage('Task added successfully!');
      }
    } catch (err) {
      showMessage('Failed to save task. Please try again.', 'error');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await axios.put(`${API}/tasks/update/${task._id}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      showMessage('Failed to update task.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API}/tasks/delete/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      showMessage('Task deleted.');
    } catch (err) {
      showMessage('Failed to delete task.', 'error');
    }
  };

  return (
    <>
      <Navbar
        tasks={tasks}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <div className="main-container">
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <TaskForm
          onSubmit={handleAddTask}
          editTask={editTask}
          onCancelEdit={() => setEditTask(null)}
        />

        {/* Search & Filter Bar */}
        <div className="filter-bar">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">⏳ Loading tasks...</div>
        ) : (
          <TaskList
            tasks={filtered}
            onToggle={handleToggleComplete}
            onEdit={(task) => setEditTask(task)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
}

export default App;
